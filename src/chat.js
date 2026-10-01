/* ---------- chat: entender a pergunta ---------- */
const ROYAL = CITIES.filter(c => c !== 'Caerleon');
const CITY_ALIASES = [
  ['ROYAL', ['cidades reais', 'cidade real', 'royals', 'royal']],
  ['Black Market', ['black market', 'blackmarket', 'mercado negro', 'mercado preto', 'bm']],
  ['Fort Sterling', ['fort sterling', 'fortsterling', 'fort', 'sterling', 'fs']],
  ['Caerleon', ['caerleon', 'carleon', 'caerlion', 'caer']],
  ['Bridgewatch', ['bridgewatch', 'bridgewater', 'bridge', 'bw']],
  ['Lymhurst', ['lymhurst', 'limhurst', 'lymhust', 'lym']],
  ['Martlock', ['martlock', 'martlok', 'mart']],
  ['Thetford', ['thetford', 'tetford', 'thet']],
  ['Brecilien', ['brecilien', 'brecilian', 'breci', 'brec']]
];
const RES_WORDS = [
  ['HIDE', true, ['couro cru', 'couros crus', 'pele', 'peles', 'hide']],
  ['WOOD', true, ['madeira', 'madeiras', 'tronco', 'troncos', 'lenha', 'wood']],
  ['WOOD', false, ['tabua', 'tabuas', 'plank', 'planks']],
  ['ORE', true, ['minerio', 'minerios', 'ore']],
  ['ORE', false, ['barra', 'barras', 'metal', 'metais', 'lingote', 'lingotes']],
  ['HIDE', false, ['couro', 'couros', 'leather']],
  ['FIBER', true, ['fibra', 'fibras', 'algodao', 'linho', 'fiber']],
  ['FIBER', false, ['tecido', 'tecidos', 'pano', 'panos', 'cloth']],
  ['ROCK', true, ['pedra', 'pedras', 'rocha', 'rochas', 'rock']],
  ['ROCK', false, ['bloco', 'blocos', 'stone']]
];
const RES_NAME = {WOOD: 'madeira', ORE: 'minério', HIDE: 'couro', FIBER: 'fibra', ROCK: 'pedra'};
const STOP = new Set(norm(`o a os as um uma uns umas de do da dos das em no na nos nas pra para pro pros por pelo pela com sem e ou que qual quais
  quanto quantos quanta quantas eu me mim meu minha meus minhas voce vc voces tu te seu sua hoje agora agr amanha noite dia semana ta esta estao
  estou dando da dar deu vale pena lucro lucros lucrar lucrativo lucrativa ganho ganhos ganhar ganhando dinheiro grana prata pratas quero queria quer
  posso pode consigo consegue fazer faco fazendo fabricar fabrico craftar craft crafting refinar refino refinando transportar transporte levar levo
  comprar compro vender vendo venda vendendo item itens coisa coisas algo algum alguma melhor melhores mais menos muito pouco bom boa bem se tem ter
  tenho isso esse essa aqui ai la como onde quando so apenas compensa rende rendendo oportunidade oportunidades mercado preco precos custa custando
  valor cotacao sai tao hj pfv favor ola oi dica dicas ajuda fala diz mostra mostre ver olhar cidade cidades tier encantamento encantado encantada
  unidade unidades montaria carrega jogar jogo albion ate vai vou ir indo alem disso dele dela entao tambem sim nao refinado refinados bruto brutos
  equipamento equipamentos recurso recursos material materiais seguro seguros premium foco bonus hora rapido rapida anunciar anuncio esperar black
  negro caro cara barato barata baratos agora ainda certo certeza tipo cada ser sera seria vale tudo todos todas qualquer outro outra outros outras
  vez quanto quantia investir gastar orcamento milhao milhoes mil viagem viagens rota rotas leva levando ganha ganho valeria valendo mandar enviar`).split(/\s+/));
const SLANG = [
  [/ (oq|oque) /g, ' o que '], [/ q /g, ' que '], [/ (qnto|qnt|qto|qnts|quantu) /g, ' quanto '], [/ pq /g, ' porque '],
  [/ (tb|tbm) /g, ' tambem '], [/ (mt|mto) /g, ' muito '], [/ hj /g, ' hoje '], [/ agr /g, ' agora '], [/ c\/\s*/g, ' com '], [/ p\/\s*/g, ' pra '],
  [/ eh /g, ' e '], [/ vale apena /g, ' vale a pena '], [/ (prc|prco) /g, ' preco '], [/ meio milhao /g, ' 500 mil '], [/ (silver|sil) /g, ' prata '],
  [/ flip\w* /g, ' revender '], [/ farm(ar|ando|o)? (prata|grana|dinheiro|silver) /g, ' lucrar '], [/ (qual|que) (e )?o corre /g, ' o que da lucro '], [/ trampo /g, ' lucro '],
  [/ transp /g, ' transporte '], [/ craf(to|tei|tando|ta|tar|t) /g, ' craftar '], [/ encanto /g, ' encantamento '], [/ ench /g, ' encantamento '],
  [/ bags? /g, ' bolsa '], [/ capes? /g, ' capa '], [/ swords? /g, ' espada '], [/ bows? /g, ' arco '], [/ daggers? /g, ' adaga '], [/ (potions?|pots?) /g, ' pocao '],
  [/ staffs? /g, ' cajado '], [/ planks? /g, ' tabua '], [/ (t|tier) ?([1-8]) ?(ponto|virgula) ?([0-4]) /g, ' t$2.$4 '], [/ ([4-8]),([0-4]) /g, ' $1.$2 '],
  [/ blackmarket /g, ' black market '], [/ mercado negro /g, ' black market ']
];
function osa(a, b, max){
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({length: a.length + 1}, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++){
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++){
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}
const PROTECT = new Set([...STOP, ...norm(`taxa taxas imposto qualidade retorno atencao cliente client aodp antigo antigos salve opa obrigada obrigado valeu show quem ontem jogo piada conta favorita capital franca`).split(/\s+/)]);
const KW_WORDS = new Set([...norm(`refinar refino refinando refina transportar transporte levar lucro lucrar lucrativo fabricar fabricacao craftar
  vender comprar premium foco encantamento encantado tier black market mercado passo mostrar seguros unidades montaria quanto preco valor
  caerleon bridgewatch martlock thetford lymhurst brecilien sterling fort royal reais revender explica significa funciona ajuda obrigado valeu
  comprando vendendo entregar quero vale pena compensa dando hoje agora tenho milhao milhoes`).split(/\s+/),
  ...RES_WORDS.flatMap(r => r[2]).flatMap(w => w.split(' '))]);
let ITEM_WORDS = null;
function itemWords(){
  if (!ITEM_WORDS){ ITEM_WORDS = new Set(); for (const x of INDEX) for (const w of x.n.split(/[^a-z0-9]+/)) if (w.length >= 4) ITEM_WORDS.add(w); }
  return ITEM_WORDS;
}
function fixWord(w){
  if (w.length < 4 || /\d/.test(w) || PROTECT.has(w) || KW_WORDS.has(w) || itemWords().has(w)) return w;
  const max = w.length >= 8 ? 2 : 1;
  for (const list of [KW_WORDS, itemWords()]){
    let best = null, bd = max + 1;
    for (const c of list){
      if (c.length < 4 || c[0] !== w[0]) continue;
      const dd = osa(w, c, max);
      if (dd < bd){ bd = dd; best = c; }
    }
    if (best) return best;
  }
  return w;
}
function cleanText(text){
  let t = ' ' + norm(text).replace(/[!?;:"'()]/g, ' ').replace(/\s+/g, ' ') + ' ';
  for (const [re, rep] of SLANG) t = t.replace(re, rep);
  const fixes = [];
  t = t.replace(/[a-z]{4,}/g, w => { const f = fixWord(w); if (f !== w) fixes.push([w, f]); return f; });
  return {t: t.replace(/\s+/g, ' ').replace(/^ ?/, ' ').replace(/ ?$/, ' '), fixes};
}
const KIND_LABEL = {transport: 'Transporte', bm: 'Black Market', refine: 'Refino', craft: 'Crafting'};
const ORD = [[/(primeir|\b1\b|\b1a\b|\b1o\b|\bum\b)/, 0], [/(segund|\b2\b|\b2a\b|\b2o\b)/, 1], [/(terceir|\b3\b|\b3a\b)/, 2], [/(quart|\b4\b|\b4a\b)/, 3], [/(quint|\b5\b|\b5a\b)/, 4]];

function toNum(raw, unit){
  let s = raw;
  if (unit && /^\d+[.,]\d{1,2}$/.test(s)) s = s.replace(',', '.');
  else s = s.replace(/[.,]/g, '');
  return parseFloat(s);
}
function singular(w){ return w.replace(/oes$/, 'ao').replace(/aes$/, 'ao').replace(/(r|z)es$/, '$1').replace(/s$/, ''); }
function searchAll(q, filter){
  const ws = norm(q).split(/\s+/).filter(Boolean);
  return INDEX.filter(x => (!filter || filter(x)) && ws.every(w => (' ' + x.n + ' ').includes(' ' + w)));
}
function findItem(words, filter){
  for (let len = Math.min(4, words.length); len >= 1; len--){
    for (let i = 0; i + len <= words.length; i++){
      const part = words.slice(i, i + len);
      if (len === 1 && part[0].length < 4) continue;
      for (const q of [part.join(' '), part.map(singular).join(' ')]){
        const r = searchAll(q, filter);
        if (!r.length) continue;
        const fams = [...new Set(r.map(x => famOf(x.id)))].filter(f => [1,2,3,4,5,6,7,8].some(t => DB[`T${t}_${f}`]));
        if (!fams.length) continue;
        if (fams.length === 1) return {fam: fams[0]};
        const exact = fams.find(f => norm(famName(f)) === q);
        if (exact) return {fam: exact};
        const starts = fams.filter(f => norm(famName(f)).startsWith(q));
        const pool = starts.length ? starts : fams;
        if (pool.length === 1) return {fam: pool[0]};
        return {fam: null, phrase: q, options: pool.sort((a, b) => famName(a).length - famName(b).length || famName(a).localeCompare(famName(b))).slice(0, 6)};
      }
    }
  }
  return null;
}
const TIER_WORDS = /\s+(do|da|de)\s+(calouro|novato|iniciante|adepto|perito|mestre|grão-mestre|grao-mestre|ancião|anciao)$/i;
function famName(fam){
  for (const r of RES_BASES){ if (fam === r) return {WOOD: 'Madeira', ORE: 'Minério', HIDE: 'Couro cru', FIBER: 'Fibra', ROCK: 'Pedra'}[r];
    if (fam === REF_OF[r]) return {WOOD: 'Tábuas', ORE: 'Barras de metal', HIDE: 'Couro trabalhado', FIBER: 'Tecido', ROCK: 'Blocos de pedra'}[r]; }
  const k = [4,5,6,7,8,3,2,1].map(t => `T${t}_${fam}`).find(x => DB[x]);
  return k ? DB[k][0].replace(TIER_WORDS, '') : fam;
}
const famOf = id => id.replace(/^T\d_/, '').replace(/@\d$/, '').replace(/_LEVEL\d$/, '');
const hasRecipe = fam => [1,2,3,4,5,6,7,8].some(t => DB[`T${t}_${fam}`] && DB[`T${t}_${fam}`][4]['0']);
const isEquip = fam => { const k = [4,5,6,7,8].map(t => DB[`T${t}_${fam}`]).find(Boolean); return !!k && ['weapons','head','armors','shoes','capes','offhands','bags'].includes(k[2]); };

function parse(text){
  const cleaned = cleanText(text);
  const t0 = cleaned.t;
  let w = t0;
  const p = {raw: text, from: [], to: [], any: [], tier: null, ench: null, res: null, raw_: null, fam: null, budget: 0, cap: 0, qty: 0,
    premium: null, mode: null, focus: null, kind: null, topic: null, ord: null, equip: false, fixes: cleaned.fixes, famOptions: null, resAmb: false};
  const consume = (re) => { w = w.replace(re, m => ' '.repeat(m.length)); };

  /* números com unidade */
  let m;
  if ((m = w.match(/(\d[\d.,]*)\s*(kg|quilos?)\b/))){ p.cap = toNum(m[1]); consume(m[0]); }
  if ((m = w.match(/(\d[\d.,]*)\s*(unidades?|unid|itens|pecas)\b/))){ p.qty = toNum(m[1]); consume(m[0]); }
  if ((m = w.match(/(?:^|[^a-z0-9.,])(\d[\d.,]*)\s*(kk|milhao|milhoes|mi|m|k|mil)\b/))){
    const mult = {kk: 1e6, milhao: 1e6, milhoes: 1e6, mi: 1e6, m: 1e6, k: 1e3, mil: 1e3}[m[2]];
    p.budget = Math.round(toNum(m[1], true) * mult); consume(m[0]);
  } else if ((m = w.match(/(?:tenho|orcamento|investir|gastar|com)\s+(\d[\d.,]{3,})\b/)) || (m = w.match(/(\d[\d.,]{3,})\s*(?:de\s+)?pratas?\b/))){
    const v = toNum(m[1]); if (v >= 1000){ p.budget = v; consume(m[0]); }
  }
  /* tier e encantamento */
  if ((m = w.match(/\b(?:t|tier)\s?([1-8])(?:\s?[.]\s?([0-4]))?\b/))){ p.tier = +m[1]; if (m[2] != null) p.ench = +m[2]; consume(m[0]); }
  else if ((m = w.match(/\s([4-8])[.]([0-4])(?=\s)/))){ p.tier = +m[1]; p.ench = +m[2]; consume(m[0]); }
  if ((m = w.match(/encant\w*\s*(?:[.]|nivel\s*|level\s*)?([0-4])\b/))){ p.ench = +m[1]; consume(m[0]); }
  else if ((m = w.match(/\s[.]([0-4])(?=\s)/))){ p.ench = +m[1]; consume(m[0]); }
  if (/sem encant/.test(w)) p.ench = 0;
  /* preferências */
  if (/(nao|sem|nem)\s+(tenho\s+|tem\s+|uso\s+)?(o\s+)?premium|premium\s+(acabou|venceu|expirou)/.test(t0)) p.premium = false;
  else if (/(tenho|com|sou|uso|tô|to)\s+(o\s+)?premium/.test(t0)) p.premium = true;
  if (/(na hora|rapid|instant|venda direta|sem esperar|pedido de compra|ordem de compra)/.test(t0)) p.mode = 'instant';
  else if (/(anunci|ordem de venda|esperar|esperando)/.test(t0)) p.mode = 'order';
  if (/(esquece|sem|tira|remove|zera)\s+(o\s+|a\s+)?(dinheiro|orcamento|limite|prata)/.test(t0)) p.budget = -1;
  if (/sem foco/.test(t0)) p.focus = false; else if (/(com|usando|uso|usar)\s+(o\s+)?foco/.test(t0)) p.focus = true;
  /* cidades */
  for (const [c, aliases] of CITY_ALIASES){
    for (const a of aliases){
      const re = new RegExp(`(^|[^a-z0-9])(${a})(?=[^a-z0-9]|$)`);
      let mm;
      while ((mm = w.match(re))){
        const idx = mm.index + mm[1].length;
        const before = w.slice(0, idx).replace(/\s+/g, ' ').trim();
        const last = before.split(' ').pop();
        let role = 'any';
        if (['pra', 'para', 'pro', 'ate', 'p/'].includes(last) || /(vend\w*|entreg\w*|lev\w*)( no| na| em| pra| para| pro)?$/.test(before)) role = 'to';
        else if (['de', 'do', 'da', 'desde'].includes(last) || /(compr\w*)( no| na| em)?$/.test(before)) role = 'from';
        if (c === 'Black Market') p.kind = p.kind || 'bm';
        else for (const cc of (c === 'ROYAL' ? ROYAL : [c])) if (!p[role].includes(cc)) p[role].push(cc);
        w = w.slice(0, idx) + ' '.repeat(a.length) + w.slice(idx + a.length);
      }
    }
  }
  /* recurso */
  for (const [res, isRaw, words] of RES_WORDS){
    for (const word of words){
      const re = new RegExp(`(^|[^a-z0-9])${word}(?=[^a-z0-9]|$)`);
      if (re.test(w)){
        if (!p.res){ p.res = res; p.raw_ = isRaw; if (res === 'HIDE' && !isRaw && !/trabalhad/.test(t0)) p.resAmb = true; }
        w = w.replace(re, s => ' '.repeat(s.length));
      }
    }
  }
  if (/\bequipamentos?\b|\bequips?\b|\bgear\b/.test(t0)) p.equip = true;

  /* intenção */
  const t = t0;
  p.follow = /^ e (o|a|os|as|em|pra|para|pro|no|na|comprando|vendendo|se|com|sem|levando|refinando) /.test(t) || /^ e \S+ $/.test(t);
  const lucro = /(lucr|ganhar|ganhos?\b|ganhando|ganha\b|ganhe\b|dinheiro|grana|compensa|vale a pena|valer a pena|rend|oportunidad|melhor|money|investir|o que (eu )?(faco|fazer|posso)|ta dando|esta dando|da pra fazer)/.test(t);
  const explainCue = /(o que (e|eh|significa|quer dizer|sao)\b|como funciona|pra que serve|para que serve|explic|nao entendi|o que seria|que diabos|por que|porque)/.test(t);
  const TOPICS = [['refino', /refin/], ['blackmarket', /(black ?market|mercado negro|\bbm\b)/], ['premium', /premium/], ['retorno', /(retorno|foco|devolv)/],
    ['taxa', /(taxa|imposto)/], ['seguro', /(seguro|atencao)/], ['cliente', /(data client|aodp|cliente|antig|atualiz)/],
    ['encantamento', /encant/], ['qualidade', /qualidade/], ['tier', /\btier/], ['anunciar', /(anunci|ordem de venda|vender na hora|ordem de compra|pedido de compra)/],
    ['transporte', /transport/], ['crafting', /(craft|fabric)/]];
  for (const o of ORD) if (o[0].test(t)) { p.ord = o[1]; break; }

  if (/(passo a passo|passo-a-passo)/.test(t) || (/(como (eu )?(faco|fazer|faz)( isso)?|me (explica|detalha))/.test(t) && p.ord != null && !lucro)) { p.kind = 'steps'; return p; }
  if (/(mostr\w* mais|mais opc|outras opc|ver mais|mais op|proxim|mais resultado|e as outras)/.test(t)) { p.kind = 'more'; return p; }
  if (/(so|somente|apenas)\s+(os\s+|as\s+)?segur/.test(t)) { p.kind = 'safe'; return p; }
  if (explainCue && !lucro){
    const tp = TOPICS.find(x => x[1].test(t));
    if (tp){ p.kind = 'explain'; p.topic = tp[0]; return p; }
  }
  if (/(\bajuda\b|\bhelp\b|o que (voce|vc|tu) (faz|sabe|consegue)|como (te |voce |vc )?(uso|usar|funciona voce)|comandos|exemplos de pergunta|o que (posso|da pra) perguntar)/.test(t)) { p.kind = 'help'; return p; }

  /* item */
  const words = w.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length >= 3 && !STOP.has(x) && !/^\d/.test(x));
  const crafty = /(fabric|craft|produz|forj)/.test(t) || (/(fazer|criar|montar)/.test(t) && words.length > 0);
  const priceQ = /(preco|quanto (ta|esta|custa|vale|sai|paga|pagam|tao|estao)|qual o valor|cotacao)/.test(t) && !lucro;
  const filter = crafty ? (x => CRAFT_CATS.includes(x.c) && !x.id.includes('@') && DB[x.id][4]['0']) : (x => !x.id.includes('@') && x.c !== 'artefacts');
  if (words.length){
    const it = findItem(words, filter);
    if (it && it.fam) p.fam = it.fam;
    else if (it){ p.famOptions = it.options; p.famPhrase = it.phrase; }
  }

  if (!p.kind){
    if (priceQ) p.kind = 'price';
    else if (/refin/.test(t)) p.kind = 'refine';
    else if (crafty && (p.fam || p.famOptions || /(fabric|craft)/.test(t))) p.kind = 'craft';
    else if (/(transport|levar|leva |viag|viaj|rota|revend|flip|atravess)/.test(t) || (/carreg/.test(t) && !p.cap)) p.kind = 'transport';
    else if (!p.follow && (p.to.length || (p.from.length && !lucro))) p.kind = 'transport';
    else if (lucro || p.budget > 0) p.kind = 'general';
  }
  if (!p.kind){
    if (/^\s*(oi|ola|eai|e ai|bom dia|boa tarde|boa noite|salve|hey|opa|fala)\b/.test(t)) p.kind = 'greet';
    else if (/(obrigad|valeu|vlw|tmj|show|top|perfeito)/.test(t)) p.kind = 'thanks';
  }
  return p;
}
const hasModifiers = p => p.from.length || p.to.length || p.any.length || p.tier || p.ench != null || p.res || p.fam || p.famOptions || p.mode || p.focus != null || p.equip;

/* ---------- chat: executar ---------- */
const chat = {mode: 'order', focus: null, budget: 0, last: null, all: [], shown: [], seen: new Set(), busy: false, pending: null};
const RRR = {base: 0.152, bonus: 0.367, focus: 0.435, bonusFocus: 0.539};

function idsFor(fam, tier, ench){
  const out = [];
  for (const tt of (tier ? [tier] : TIERS)){
    const base = `T${tt}_${fam}`;
    if (!DB[base]) continue;
    if (ench == null) out.push(...variants(base));
    else if (ench === 0) out.push(base);
    else { const res = `${base}_LEVEL${ench}@${ench}`; out.push(DB[res] ? res : `${base}@${ench}`); }
  }
  return out.filter(id => info(id));
}
function filterIds(ids, q){
  return ids.filter(id => (!q.tier || tierOf(id) === q.tier) && (q.ench == null || split(id).e === q.ench));
}
function resIdsFor(q){
  const fams = q.raw_ === true ? [q.res] : q.raw_ === false ? [REF_OF[q.res]] : [REF_OF[q.res], q.res];
  return fams.flatMap(f => idsFor(f, q.tier, q.ench));
}
function refineRrr(res, cityName){
  const bonus = cityName === REFINE_BONUS[res];
  if (chat.focus) return bonus ? RRR.bonusFocus : RRR.focus;
  return bonus ? RRR.bonus : RRR.base;
}
function pickCities(q, fallbackFrom, fallbackTo){
  const from = q.from.length ? q.from : q.any.length ? [q.any[0]] : fallbackFrom;
  const to = q.to.length ? q.to : q.any.length > 1 ? [q.any[1]] : q.any.length && q.from.length ? [q.any[0]] : fallbackTo;
  return {from, to};
}
async function settle(promises){
  const res = await Promise.allSettled(promises);
  const ok = res.filter(r => r.status === 'fulfilled').map(r => r.value);
  if (!ok.length){
    const err = res.find(r => r.status === 'rejected');
    throw err ? err.reason : new Error('Não consegui buscar os preços.');
  }
  return {deals: ok.flatMap(r => r.deals), missing: ok.flatMap(r => r.missing || [])};
}
async function checkHistory(deals, say){
  say('Conferindo as vendas da última semana…');
  const kinds = [...new Set(deals.map(d => d.kind))];
  await Promise.all(kinds.map(k => withHistory(null, deals.filter(d => d.kind === k), k === 'refine' ? null : '1', kinds.length > 1 ? 8 : 15)));
}

async function runQuery(q, say){
  const mode = chat.mode;
  if (q.kind === 'general'){
    const tasks = [], parts = [];
    const {from, to} = pickCities(q, CITIES, CITIES);
    if (q.fam){
      const ids = idsFor(q.fam, q.tier, q.ench);
      tasks.push(scanTransport({ids, orig: from, dest: to, mode}));
      parts.push('o transporte entre as cidades');
      if (isEquip(q.fam)){ tasks.push(scanBM({ids, orig: from.filter(c => c !== 'Caerleon').length ? from.filter(c => c !== 'Caerleon') : ROYAL})); parts.push('o Black Market'); }
      if (hasRecipe(q.fam)){ const c = q.any[0] || q.from[0] || 'Martlock'; tasks.push(scanCraft({fam: q.fam, e: q.ench || 0, buyC: c, sellC: q.to[0] || c, mode})); parts.push('a fabricação'); }
    } else if (q.res){
      tasks.push(scanTransport({ids: resIdsFor(q), orig: from, dest: to, mode}));
      const c = q.any[0] || REFINE_BONUS[q.res];
      tasks.push(scanRefine({res: q.res, e: q.ench || 0, buyC: c, sellC: q.to[0] || c, mode, rrr: refineRrr(q.res, c)}));
      parts.push(`o transporte de ${RES_NAME[q.res]}`, `o refino de ${RES_NAME[q.res]}`);
    } else {
      tasks.push(scanTransport({ids: filterIds(presetItems(q.equip ? 'equip' : 'refinados'), q), orig: from, dest: to, mode}));
      parts.push(q.equip ? 'o transporte de equipamentos' : 'o transporte de recursos refinados');
      tasks.push(scanBM({ids: filterIds(presetItems('bm'), q), orig: q.from.length ? q.from.filter(c => c !== 'Caerleon') : ROYAL}));
      parts.push('o Black Market');
      if (!q.equip) for (const res of RES_BASES){
        const c = q.any[0] || REFINE_BONUS[res];
        tasks.push(scanRefine({res, e: q.ench || 0, buyC: c, sellC: c, mode, rrr: refineRrr(res, c)}));
      }
      if (!q.equip) parts.push('o refino dos 5 recursos');
    }
    say('Buscando preços nas cidades…');
    const r = await settle(tasks);
    await checkHistory(r.deals, say);
    return {...r, intro: `Comparei ${listJoin(parts)}.`, diverse: true};
  }
  if (q.kind === 'transport'){
    const {from, to} = pickCities(q, CITIES, CITIES);
    let ids, what;
    if (q.fam){ ids = idsFor(q.fam, q.tier, q.ench); what = famName(q.fam); }
    else if (q.res){ ids = resIdsFor(q); what = RES_NAME[q.res]; }
    else { ids = filterIds(presetItems(q.equip ? 'equip' : 'refinados'), q); what = q.equip ? 'equipamentos comuns' : 'recursos refinados'; }
    if (!ids.length) throw new Error('Não achei esse item nesse tier ou encantamento.');
    say('Buscando preços nas cidades…');
    const r = await scanTransport({ids, orig: from, dest: to, mode});
    await checkHistory(r.deals, say);
    const allFrom = from.length === CITIES.length, allTo = to.length === CITIES.length;
    const route = allFrom && allTo ? 'entre as 7 cidades' : allFrom ? `vendendo em ${listJoin(to)}` : allTo ? `comprando em ${listJoin(from)}` : `comprando em ${listJoin(from)} e vendendo em ${listJoin(to)}`;
    return {...r, intro: `Comparei ${what} ${route}.`};
  }
  if (q.kind === 'bm'){
    const orig = (q.from.length ? q.from : q.any.length ? q.any : ROYAL).filter(c => c !== 'Caerleon');
    const ids = q.fam ? idsFor(q.fam, q.tier, q.ench) : filterIds(presetItems('bm'), q);
    if (!ids.length) throw new Error('Não achei esse item nesse tier ou encantamento.');
    say('Buscando o que o Black Market está pagando…');
    const r = await scanBM({ids, orig: orig.length ? orig : ROYAL});
    await checkHistory(r.deals, say);
    return {...r, intro: `Comparei o que o Black Market paga com o preço de ${q.fam ? 'desse item' : 'armas e armaduras comuns'} em ${listJoin(orig.length ? orig : ROYAL)}.`};
  }
  if (q.kind === 'refine'){
    const list = q.res ? [q.res] : RES_BASES, tasks = [];
    for (const res of list){
      const c = q.from[0] || q.any[0] || REFINE_BONUS[res];
      tasks.push(scanRefine({res, e: q.ench || 0, buyC: c, sellC: q.to[0] || c, mode, rrr: refineRrr(res, c)}));
    }
    say('Buscando o preço dos recursos…');
    const r = await settle(tasks);
    if (q.tier) r.deals = r.deals.filter(d => tierOf(d.sellId) === q.tier);
    await checkHistory(r.deals, say);
    const c = q.from[0] || q.any[0];
    const where = c ? `refinando em ${c}` : q.res ? `refinando em ${REFINE_BONUS[q.res]}, a cidade com bônus` : 'refinando na cidade com bônus de cada recurso';
    return {...r, intro: `Calculei o refino de ${q.res ? RES_NAME[q.res] : 'madeira, minério, couro, fibra e pedra'} ${where}${chat.focus ? ', com foco' : ''}, usando as receitas oficiais.`};
  }
  if (q.kind === 'craft'){
    if (!q.fam) return {ask: 'O que você quer fabricar? Escreva, por exemplo: "quanto dá fabricar espada larga" ou "poção de cura".'};
    const cities = q.from.length || q.any.length ? [q.from[0] || q.any[0]] : CITIES;
    say(cities.length > 1 ? 'Comparando a fabricação nas 7 cidades…' : `Buscando preços em ${cities[0]}…`);
    const r = await settle(cities.map(c => scanCraft({fam: q.fam, e: q.ench || 0, buyC: c, sellC: q.to[0] || c, mode})));
    const best = new Map();
    for (const d of r.deals) if (!best.has(d.sellId) || best.get(d.sellId).profit < d.profit) best.set(d.sellId, d);
    r.deals = [...best.values()];
    if (q.tier) r.deals = r.deals.filter(d => tierOf(d.sellId) === q.tier);
    await checkHistory(r.deals, say);
    const nm = famName(q.fam);
    return {...r, intro: `Calculei a fabricação de ${nm}${q.tier ? ` T${q.tier}${q.ench ? '.' + q.ench : ''}` : ', em todos os tiers,'} com a receita oficial${cities.length > 1 ? ', comparando as 7 cidades e mostrando a melhor de cada tier' : ` em ${cities[0]}`}.`};
  }
  if (q.kind === 'price'){
    const fam = q.fam || (q.res ? (q.raw_ ? q.res : REF_OF[q.res]) : null);
    if (!fam) return {ask: 'De qual item você quer saber o preço? Escreva, por exemplo: "quanto está a tábua T5?".'};
    const ids = idsFor(fam, q.tier, q.ench == null ? 0 : q.ench);
    if (!ids.length) return {ask: 'Não achei esse item nesse tier. Tente outro tier, por exemplo T4, T5 ou T6.'};
    say('Buscando preços nas cidades…');
    const P = await fetchPrices(ids, [...CITIES, BM], '1');
    return {price: {ids, P}};
  }
  return null;
}
function listJoin(a){ return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }

/* ---------- chat: montar respostas ---------- */
function unitsFor(d){
  if (!chat.budget) return {u: qty(), capped: false};
  let u = Math.floor(chat.budget / d.cost), capped = false;
  if (d.hist && d.hist.daily >= 1 && u > Math.ceil(d.hist.daily * 3)){ u = Math.ceil(d.hist.daily * 3); capped = true; }
  return {u: Math.max(0, u), capped};
}
function rank(deals){
  const gains = deals.filter(isGain);
  const score = d => chat.budget ? Math.round(d.profit) * unitsFor(d).u : d.profit;
  return gains.sort((a, b) => (b.checked && b.safe) - (a.checked && a.safe) || score(b) - score(a));
}
function pickShown(all, diverse){
  if (!diverse) return all.slice(0, 5);
  const out = [], per = {};
  for (const d of all){ if (out.length >= 5) break; if ((per[d.kind] || 0) < 2){ out.push(d); per[d.kind] = (per[d.kind] || 0) + 1; } }
  for (const d of all){ if (out.length >= 5) break; if (!out.includes(d)) out.push(d); }
  return out;
}
function oppHtml(d){
  const {u, capped} = unitsFor(d);
  const tag = d.checked ? (d.safe ? '<span class="tag gain">Seguro</span>' : '<span class="tag warn">Atenção</span>') : '';
  const money = chat.budget
    ? (u > 0 ? `Com ${fmt(chat.budget)} de prata, dá para fazer <b>${fmt(u)} unidades</b> e lucrar <b class="g">${signed(Math.round(d.profit) * u)}</b>${capped ? ', limitando ao que a cidade vende em 3 dias' : ''}.`
             : `Cada unidade custa ${fmt(d.cost)}, mais do que os ${fmt(chat.budget)} que você tem.`)
    : `Com ${fmt(u)} unidades: <b class="g">${signed(Math.round(d.profit) * u)}</b>.`;
  const warn = (d.facts || []).find(f => f[0] === 'warn' && !(chat.budget && f[3] === 'qty'));
  const tr = trustFact(d.prices);
  QTY_OVERRIDE = chat.budget ? (u || 1) : 0;
  const steps = stepsFor(d), detail = dealHtml(d);
  QTY_OVERRIDE = 0;
  return `<li class="opp${d.checked && !d.safe ? ' caution' : ''}">
    <div class="tags"><span class="tag cat">${KIND_LABEL[d.kind]}</span>${tag}</div>
    <b class="opp-title">${esc(d.title)}</b>
    <span class="how">${d.how}</span>
    <p>Lucro de <strong class="g">${signed(d.profit)}</strong> prata por unidade. ${money}</p>
    ${warn ? `<p class="opp-note warn">${esc(warn[1])}</p>` : ''}
    ${tr[0] !== 'ok' ? `<p class="opp-note ${tr[0]}">${esc(tr[1])}</p>` : ''}
    <details><summary>Passo a passo</summary><ol class="steps">${steps.map(x => `<li>${x}</li>`).join('')}</ol></details>
    <details><summary>Todos os detalhes</summary>${detail}</details>
  </li>`;
}
function settingsLine(){
  return `Contas ${$('g-premium').checked ? 'com Premium (taxa de 4%)' : 'sem Premium (taxa de 8%)'}, ${chat.mode === 'order' ? 'anunciando e esperando a venda' : 'vendendo na hora'}${chat.budget ? `, com ${fmt(chat.budget)} de prata para investir (diga "sem limite de prata" para voltar)` : `, para ${fmt(qty())} unidades`}.`;
}
function resultHtml(r){
  const all = rank(r.deals);
  chat.all = all;
  chat.shown = pickShown(all, r.diverse);
  chat.seen = new Set(chat.shown);
  let h = `<p>${esc(r.intro)}</p>`;
  if (!all.length){
    h += `<p><b>Nada está dando lucro com esses preços agora.</b> Isso acontece quando os preços estão parecidos entre as cidades ou estão antigos.</p>`;
    h += `<p>Tente perguntar de outro jeito, por exemplo vendendo na hora, outra cidade ou outro tier.</p>`;
  } else {
    const best = chat.shown[0];
    h += all.length === 1 ? `<p>Encontrei <b>1 opção com lucro</b>:</p>`
      : `<p>Encontrei <b>${all.length} opções com lucro</b>. ${all.length > chat.shown.length ? `Estas são as ${chat.shown.length} melhores` : 'Aqui estão todas'}, começando pelas mais seguras:</p>`;
    h += `<ol class="opps">${chat.shown.map(oppHtml).join('')}</ol>`;
    const old = chat.shown.filter(d => trustFact(d.prices)[0] === 'old').length;
    if (old) h += `<p class="help">${old === chat.shown.length ? 'Todos esses preços estão antigos.' : `${old} desses preços estão antigos.`} Se você usa o Albion Data Client, abra esses itens no mercado e pergunte de novo.</p>`;
    if (best && !(best.checked && best.safe)) h += `<p class="help">Nenhuma opção passou em todas as conferências de segurança. Leia os avisos antes de investir.</p>`;
  }
  if (r.missing && r.missing.length > 3) h += `<p class="help">Faltaram preços de ${r.missing.length} itens, porque ninguém consultou eles no mercado recentemente.</p>`;
  h += `<p class="help">${settingsLine()} Para mudar, é só me dizer, por exemplo: "não tenho premium", "quero vender na hora" ou "tenho 1 milhão".</p>`;
  return h;
}
function priceHtml({ids, P}){
  const locs = [...CITIES, BM];
  if (ids.length === 1){
    const id = ids[0];
    const rows = locs.map(c => ({c, r: P.get(id, c)})).filter(x => x.r && (x.r.sell || x.r.buy));
    if (!rows.length) return `<p>Ninguém consultou <b>${esc(label(id))}</b> no mercado recentemente, então não tenho o preço.</p><p class="help">Com o Albion Data Client ligado, abra esse item no mercado de alguma cidade e pergunte de novo.</p>`;
    const sells = rows.filter(x => x.r.sell && x.c !== BM), buys = rows.filter(x => x.r.buy);
    const cheap = sells.reduce((a, x) => !a || x.r.sell < a.r.sell ? x : a, null);
    const pays = buys.reduce((a, x) => !a || x.r.buy > a.r.buy ? x : a, null);
    let h = `<p>Preços de <b>${esc(label(id))}</b> agora:</p><div class="pricetab"><table class="prices"><thead><tr><th>Cidade</th><th class="n">Anunciado por</th><th class="n">Pedidos de compra pagam</th></tr></thead><tbody>`;
    h += rows.map(x => `<tr><td>${city(x.c)}</td>
      <td class="n${cheap && x === cheap ? ' best' : ''}">${x.r.sell && x.c !== BM ? `${fmt(x.r.sell)}<small>${ageText(x.r.sellDate)}</small>` : '<span class="nodata">sem anúncio</span>'}</td>
      <td class="n${pays && x === pays ? ' best' : ''}">${x.r.buy ? `${fmt(x.r.buy)}<small>${ageText(x.r.buyDate)}</small>` : '<span class="nodata">sem pedido</span>'}</td></tr>`).join('');
    h += `</tbody></table></div>`;
    if (cheap) h += `<p>O mais barato para comprar é em <b>${esc(cheap.c)}</b>, por ${fmt(cheap.r.sell)}.${pays ? ` Quem paga mais na hora é <b>${esc(pays.c)}</b>, por ${fmt(pays.r.buy)}.` : ''}</p>`;
    return h;
  }
  const nm = famName(famOf(ids[0]));
  let h = `<p>Preços de <b>${esc(nm)}</b> em cada tier, sem encantamento:</p><div class="pricetab"><table class="prices"><thead><tr><th>Item</th><th>Mais barato para comprar</th><th>Anunciado mais caro</th></tr></thead><tbody>`;
  for (const id of ids){
    const rows = CITIES.map(c => ({c, r: P.get(id, c)})).filter(x => x.r && x.r.sell);
    if (!rows.length){ h += `<tr><td>${esc(label(id))}</td><td colspan="2"><span class="nodata">sem preço recente</span></td></tr>`; continue; }
    const lo = rows.reduce((a, x) => x.r.sell < a.r.sell ? x : a), hi = rows.reduce((a, x) => x.r.sell > a.r.sell ? x : a);
    h += `<tr><td>${esc(label(id))}</td><td>${city(lo.c)} ${fmt(lo.r.sell)}<small>${ageText(lo.r.sellDate)}</small></td><td>${city(hi.c)} ${fmt(hi.r.sell)}<small>${ageText(hi.r.sellDate)}</small></td></tr>`;
  }
  return h + `</tbody></table></div><p class="help">Para ver todas as cidades de um tier, pergunte com o tier, por exemplo "${esc(nm.toLowerCase())} T5".</p>`;
}
const EXPLAIN = {
  refino: ['Refinar é transformar recurso bruto em refinado: madeira vira tábua, minério vira barra, couro cru vira couro trabalhado, fibra vira tecido e pedra vira bloco. Cada tier pede o recurso bruto mais 1 refinado do tier anterior.',
    'Cada recurso tem uma cidade com bônus, onde o jogo devolve mais material: madeira em Fort Sterling, minério em Thetford, couro em Martlock, fibra em Lymhurst e pedra em Bridgewatch.', ['Vale a pena refinar madeira?']],
  blackmarket: ['O Black Market fica em Caerleon e compra equipamentos dos jogadores para abastecer os baús de monstros e dungeons. Você vende direto para os pedidos dele, na hora, e paga só a taxa de venda.',
    'Às vezes ele paga mais do que o preço anunciado nas outras cidades. É aí que está o lucro: comprar barato numa cidade e entregar no Black Market.', ['O que o Black Market está pagando bem?']],
  premium: ['Com Premium, o mercado cobra 4% de taxa quando você vende. Sem Premium, cobra 8%.', 'Me diga "tenho premium" ou "não tenho premium" que eu ajusto todas as contas.', ['Não tenho premium']],
  retorno: ['Quando você refina ou fabrica, o jogo devolve parte do material, que você usa de novo. Por isso o custo de cada unidade cai.',
    'No refino, volta cerca de 15,2% numa cidade qualquer, 36,7% na cidade com bônus do recurso e 53,9% na cidade com bônus usando foco. Fora da cidade com bônus, com foco, volta cerca de 43,5%.', ['E com foco?']],
  taxa: ['Quando você vende, o mercado cobra 4% com Premium ou 8% sem. Se você anunciar e esperar, paga também 2,5% para criar o anúncio.', 'Vender na hora, para quem já deixou um pedido de compra, paga só a taxa de venda. Eu já desconto tudo isso nas contas.', []],
  seguro: ['"Seguro" quer dizer que eu conferi as vendas da última semana: o item vende bem, o preço de agora está normal e não é antigo.',
    '"Atenção" quer dizer que algo pede cuidado, como vender pouco ou um preço fora do comum. O motivo aparece logo abaixo da opção.', ['Só os seguros']],
  cliente: ['Os preços vêm de jogadores que usam o Albion Data Client. Quando alguém abre um item no mercado, o preço é enviado para uma base pública, que eu consulto.',
    'Para ter preços frescos: baixe o programa em albion-online-data.com, deixe ele aberto, entre no jogo e abra no mercado os itens que você quer negociar. Depois me pergunte de novo. Programas de ping, como ExitLag, podem impedir o envio.', []],
  encantamento: ['Encantamento é o nível extra do item, mostrado depois do ponto: T6.1, T6.2, T6.3 e T6.4. Quanto maior, mais forte e mais caro.', 'Para perguntar sobre um encantamento, escreva por exemplo "refinar madeira T6.2".', ['Vale a pena refinar madeira T6.1?']],
  qualidade: ['Equipamentos saem com qualidade Normal, Boa, Excepcional, Excelente ou Obra-prima. Nas respostas daqui eu uso a qualidade Normal.', 'Para outra qualidade, use as abas Transporte, Black Market ou Crafting, em Opções avançadas.', []],
  tier: ['Tier é o nível do item, de T1 a T8. Quanto maior o tier, mais forte e mais caro.', 'Você pode colocar o tier na pergunta, como "tábuas T6" ou "espada larga T5.1".', ['Quanto está a tábua T5?']],
  anunciar: ['Anunciar e esperar: você coloca o item à venda pelo preço que quiser e espera alguém comprar. Ganha mais, mas demora e paga 2,5% a mais de taxa.',
    'Vender na hora: você vende para quem já deixou um pedido de compra. Recebe na hora, só que por um preço menor. Diga "quero vender na hora" ou "quero anunciar" para eu mudar as contas.', ['Quero vender na hora']],
  transporte: ['Transporte é comprar um item onde ele está barato, levar até outra cidade e vender onde está caro. Eu comparo as cidades e mostro a melhor rota para cada item.', 'Cuidado com o caminho: em zonas vermelhas e pretas você pode ser atacado e perder a carga.', ['O que levar de Martlock pra Caerleon?']],
  crafting: ['Crafting é comprar os materiais e fabricar o item. Eu uso a receita oficial do jogo e comparo o custo com o preço do item pronto.', 'Itens de artefato precisam de uma peça especial, que não volta no retorno de material.', ['Quanto dá fabricar espada larga?']]
};
const START_SUGS = ['O que está dando lucro hoje?', 'Vale a pena refinar madeira?', 'O que levar de Martlock pra Caerleon?', 'Quanto dá fabricar espada larga?', 'O que o Black Market está pagando bem?', 'Quanto está a tábua T5?', 'Tenho 1 milhão, o que faço?', 'O que você sabe fazer?'];
function sugsFor(kind){
  const base = chat.shown.length && kind !== 'price' ? ['Passo a passo da 1ª'] : [];
  if (kind !== 'price' && chat.all.some(d => !chat.seen.has(d))) base.push('Mostrar mais');
  const extra = {
    general: ['Só os seguros', 'Só refino', 'Tenho 1 milhão', chat.mode === 'order' ? 'Quero vender na hora' : 'Quero anunciar'],
    transport: ['Só os seguros', 'E pra Caerleon?', 'Minha montaria carrega 2000 kg', chat.mode === 'order' ? 'Quero vender na hora' : 'Quero anunciar'],
    bm: ['Só os seguros', 'E comprando em Martlock?', 'E o T6?'],
    refine: [chat.focus ? 'Sem foco' : 'E com foco?', 'E o .1?', 'E o .2?', chat.mode === 'order' ? 'E vendendo na hora?' : 'Quero anunciar'],
    craft: ['E o .1?', 'E vendendo em Caerleon?', 'E em Martlock?', chat.mode === 'order' ? 'E vendendo na hora?' : 'Quero anunciar'],
    price: ['O que está dando lucro hoje?', 'Vale a pena refinar madeira?']
  }[kind] || START_SUGS.slice(0, 4);
  return [...base, ...extra].slice(0, 6);
}

/* ---------- chat: como eu entendi ---------- */
const RES_REFINED_NAME = {WOOD: 'tábuas', ORE: 'barras de metal', HIDE: 'couro trabalhado', FIBER: 'tecido', ROCK: 'blocos de pedra'};
const RES_RAW_NAME = {WOOD: 'madeira', ORE: 'minério', HIDE: 'couro cru', FIBER: 'fibra', ROCK: 'pedra'};
const KIND_TEXT = {general: 'o que está dando lucro', transport: 'transporte entre cidades', bm: 'venda no Black Market', refine: 'refino', craft: 'fabricação', price: 'preço'};
const KIND_BTN = {general: 'O que dá lucro com isso', transport: 'Transportar entre cidades', bm: 'Vender no Black Market', refine: 'Refinar', craft: 'Fabricar', price: 'Ver o preço'};
function whatText(q){
  if (q.fam) return famName(q.fam);
  if (q.res){
    if (q.kind === 'refine') return `${RES_RAW_NAME[q.res]} em ${RES_REFINED_NAME[q.res]}`;
    return q.raw_ === true ? RES_RAW_NAME[q.res] : q.raw_ === false ? RES_REFINED_NAME[q.res] : `${RES_RAW_NAME[q.res]} e ${RES_REFINED_NAME[q.res]}`;
  }
  return '';
}
function describe(q){
  const parts = [`<b>${KIND_TEXT[q.kind]}</b>`];
  const what = whatText(q);
  if (what) parts.push(esc(what));
  else if (q.kind === 'transport') parts.push(q.equip ? 'equipamentos comuns' : 'recursos refinados');
  else if (q.kind === 'bm') parts.push('armas e armaduras comuns');
  else if (q.kind === 'refine') parts.push('os 5 recursos');
  if (q.from.length && q.from.length < CITIES.length) parts.push(`comprando em ${esc(listJoin(q.from))}`);
  if (q.to.length) parts.push(`vendendo em ${esc(listJoin(q.to))}`);
  if (q.any.length) parts.push(`em ${esc(listJoin(q.any))}`);
  if (!q.from.length && !q.to.length && !q.any.length){
    if (q.kind === 'refine') parts.push(q.res ? `em ${REFINE_BONUS[q.res]}, a cidade com bônus` : 'na cidade com bônus de cada recurso');
    else if (q.kind === 'craft') parts.push('comparando as 7 cidades');
    else if (q.kind !== 'price') parts.push('todas as cidades');
  }
  parts.push(q.tier ? `T${q.tier}` : 'todos os tiers');
  if (q.ench != null) parts.push(q.ench ? `encantamento .${q.ench}` : 'sem encantamento');
  else if (['refine', 'craft', 'price'].includes(q.kind)) parts.push('sem encantamento');
  else parts.push('encantamentos .0 a .3');
  if (!['price', 'bm'].includes(q.kind)) parts.push(chat.mode === 'order' ? 'anunciando a venda' : 'vendendo na hora');
  if (q.kind === 'refine' || (q.kind === 'general' && !q.fam)) parts.push(chat.focus ? 'com foco' : 'sem foco');
  return parts.join(', ');
}
function altKinds(q){
  const ks = ['general', 'transport'];
  if (q.res || (!q.fam && !q.res)) ks.push('refine');
  if (q.fam && hasRecipe(q.fam)) ks.push('craft');
  if ((q.fam && isEquip(q.fam)) || (!q.fam && !q.res)) ks.push('bm');
  if (q.fam || q.res) ks.push('price');
  return ks.filter(k => k !== q.kind);
}

/* ---------- chat: registro do que não deu certo ---------- */
const LOG_KEY = 'chatlog';
function logQ(text, reason, interp){
  const list = store.get(LOG_KEY, []);
  list.push({t: new Date().toISOString(), q: text, r: reason, i: interp || ''});
  store.set(LOG_KEY, list.slice(-200));
  updateLogBtn();
}
function updateLogBtn(){
  const n = store.get(LOG_KEY, []).length;
  $('chat-log-btn').hidden = !n;
  $('chat-log-n').textContent = n;
}
function logText(){
  const R = {'nao-entendi': 'não entendi', 'errado': 'entendi errado'};
  return store.get(LOG_KEY, []).map(x => `${new Date(x.t).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})} | ${R[x.r] || x.r} | ${x.q}${x.i ? ` | entendi: ${x.i}` : ''}`).join('\n');
}
function showLog(){
  const list = store.get(LOG_KEY, []);
  if (!list.length){ addMsg('bot', '<p>Ainda não tem nenhuma pergunta registrada.</p>'); return; }
  const el = addMsg('bot', `<p>Estas são as ${list.length === 1 ? 'pergunta que eu não entendi ou entendi errado' : `${list.length} perguntas que eu não entendi ou entendi errado`}, guardadas só neste navegador. Copie a lista e mande para quem cuida do painel, para eu aprender a responder.</p>
    <pre class="logbox">${esc(logText())}</pre>
    <div class="opts"><button type="button" data-a="copy">Copiar lista</button><button type="button" data-a="clear">Apagar lista</button></div><p class="help copied" hidden></p>`);
  el.querySelector('[data-a="copy"]').addEventListener('click', () => {
    const done = () => { const n = el.querySelector('.copied'); n.hidden = false; n.textContent = 'Lista copiada.'; };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(el.querySelector('.logbox')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      const n = el.querySelector('.copied'); n.hidden = false; n.textContent = 'Selecionei a lista. Use Ctrl+C para copiar.'; };
    try { navigator.clipboard.writeText(logText()).then(done, fallback); } catch (_) { fallback(); }
  });
  el.querySelector('[data-a="clear"]').addEventListener('click', () => {
    store.set(LOG_KEY, []); updateLogBtn();
    el.querySelector('.opts').remove(); el.querySelector('.logbox').remove();
    const n = el.querySelector('.copied'); n.hidden = false; n.textContent = 'Lista apagada.';
  });
  el.scrollIntoView({block: 'start'});
}

/* ---------- chat: interface ---------- */
function addMsg(who, html){
  const el = document.createElement('div');
  el.className = 'msg ' + who;
  el.innerHTML = who.startsWith('bot') ? `<span class="who">Mercador</span>${html}` : html;
  $('chat-log').appendChild(el);
  return el;
}
function setSugs(list){
  $('chat-sugs').innerHTML = list.map(s => `<button type="button">${esc(s)}</button>`).join('');
  $('chat-sugs').querySelectorAll('button').forEach(b => b.addEventListener('click', () => ask(b.textContent)));
}
function optButtons(el, options, onPick){
  const box = document.createElement('div');
  box.className = 'opts';
  options.forEach((o, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = o.label;
    b.addEventListener('click', () => { if (!chat.busy) onPick(o, i); });
    box.appendChild(b);
  });
  el.appendChild(box);
  return box;
}
function applySettings(p){
  const done = [];
  if (p.premium != null){ $('g-premium').checked = p.premium; store.set('premium', p.premium); done.push(p.premium ? 'com Premium (taxa de 4%)' : 'sem Premium (taxa de 8%)'); }
  if (p.cap){ $('g-cap').value = p.cap; store.set('cap', p.cap); done.push(`sua montaria carregando ${fmt(p.cap)} kg`); }
  if (p.qty){ $('g-qty').value = p.qty; store.set('qty', p.qty); chat.budget = 0; done.push(`${fmt(p.qty)} unidades`); }
  if (p.budget > 0){ chat.budget = p.budget; done.push(`${fmt(p.budget)} de prata para investir`); }
  else if (p.budget < 0 && chat.budget){ chat.budget = 0; done.push(`contas por quantidade (${fmt(qty())} unidades), sem limite de prata`); }
  if (p.mode && p.mode !== chat.mode){ chat.mode = p.mode; done.push(p.mode === 'order' ? 'anunciando e esperando a venda' : 'vendendo na hora'); }
  if (p.focus != null && p.focus !== chat.focus){ chat.focus = p.focus; done.push(p.focus ? 'refino com foco' : 'refino sem foco'); }
  return done;
}
function mergeCtx(last, p){
  const q = {...last, fixes: p.fixes, raw: p.raw, famOptions: null, resAmb: false};
  if (p.from.length || p.to.length || p.any.length){ q.from = p.from; q.to = p.to; q.any = p.any; }
  for (const k of ['tier', 'ench']) if (p[k] != null) q[k] = p[k];
  if (p.res){ q.res = p.res; q.raw_ = p.raw_; q.resAmb = p.resAmb; q.fam = null; if (last.kind === 'craft') q.kind = null; }
  if (p.fam || p.famOptions){ q.fam = p.fam; q.famOptions = p.famOptions; q.famPhrase = p.famPhrase; q.res = null; if (last.kind === 'refine') q.kind = null; }
  if (p.equip) q.equip = true;
  return q;
}

/* perguntas de esclarecimento: devolve null quando já dá para buscar */
function clarifyFor(q){
  if (q.famOptions && !q.fam) return {msg: `Achei mais de um item com "${q.famPhrase}". Qual deles?`,
    options: q.famOptions.map(f => ({label: famName(f), patch: {fam: f, famOptions: null}}))};
  if (!q.kind && (q.fam || q.res)){
    const tmp = {...q, kind: null};
    return {msg: `O que você quer saber sobre ${whatText(tmp) || 'isso'}?`, options: altKinds(tmp).map(k => ({label: KIND_BTN[k], patch: {kind: k}}))};
  }
  if (q.resAmb && q.res === 'HIDE' && ['price', 'transport', 'general'].includes(q.kind)){
    const o = [{label: 'Couro cru, para refinar', patch: {raw_: true, resAmb: false}}, {label: 'Couro trabalhado, já refinado', patch: {raw_: false, resAmb: false}}];
    if (q.kind !== 'price') o.push({label: 'Os dois', patch: {raw_: null, resAmb: false}});
    return {msg: 'Você quer saber de couro cru ou de couro trabalhado?', options: o};
  }
  if (q.kind === 'transport' && q.from.length === 1 && q.to.length === 1 && q.from[0] === q.to[0])
    return {msg: `Comprar e vender em ${q.from[0]} não é transporte. O que você quer?`, options: [
      {label: `Comprar em ${q.from[0]} e vender em qualquer cidade`, patch: {to: []}},
      {label: `Comprar em qualquer cidade e vender em ${q.from[0]}`, patch: {from: []}}]};
  return null;
}
function route(q, pre){
  const c = clarifyFor(q);
  if (!c) return execute(q, pre);
  const el = addMsg('bot', `${pre || ''}<p>${esc(c.msg)}</p>`);
  chat.pending = {q, options: c.options};
  optButtons(el, c.options, o => pickPending(o));
  setSugs([]);
  el.scrollIntoView({block: 'nearest'});
}
function pickPending(o){
  const pend = chat.pending;
  if (!pend) return;
  chat.pending = null;
  addMsg('me', esc(o.label));
  route({...pend.q, ...o.patch});
}
function matchPending(text){
  if (!chat.pending) return null;
  const n = cleanText(text).t.trim();
  if (!n) return null;
  return chat.pending.options.find(o => { const l = norm(o.label); return l === n || l.includes(n) || n.split(' ').some(w => w.length >= 4 && l.includes(w)); }) || null;
}

async function execute(q, pre){
  pre = pre || '';
  if (q.fixes && q.fixes.length) pre += `<p class="help">Corrigi a digitação: ${q.fixes.map(([a, b]) => `"${esc(a)}" virou "${esc(b)}"`).join(', ')}.</p>`;
  chat.busy = true;
  $('chat-in').disabled = true; $('chat-send').disabled = true;
  const understood = `<p class="understood">Entendi assim: ${describe(q)}.</p>`;
  const wait = addMsg('bot typing', `${pre}${understood}<p class="wait">Buscando preços…</p>`);
  const say = s => { const el = wait.querySelector('.wait'); if (el) el.textContent = s; };
  let ok = false;
  try {
    const r = await runQuery(q, say);
    wait.classList.remove('typing');
    const head = `<span class="who">Mercador</span>${pre}${understood}`;
    if (!r) wait.innerHTML = `<span class="who">Mercador</span><p>Não entendi bem essa pergunta.</p>`;
    else if (r.ask) wait.innerHTML = `${head}<p>${esc(r.ask)}</p>`;
    else if (r.price){ wait.innerHTML = `${head}${priceHtml(r.price)}`; chat.last = q; ok = true; }
    else { chat.last = q; wait.innerHTML = `${head}${resultHtml(r)}`; ok = true; }
    stamp();
    setSugs(sugsFor(q.kind));
  } catch (err){
    wait.classList.remove('typing');
    const msg = err instanceof TypeError
      ? 'Não consegui buscar os preços. Confira sua internet. Se você abriu o painel pela prévia do Claude ou do Discord, baixe o arquivo e abra no navegador.'
      : err.message;
    wait.innerHTML = `<span class="who">Mercador</span>${understood}<p class="err">${esc(msg)}</p>`;
  } finally {
    chat.busy = false;
    $('chat-in').disabled = false; $('chat-send').disabled = false;
    if (ok) feedbackRow(wait, q);
    wait.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    $('chat-in').focus({preventScroll: true});
  }
}
function feedbackRow(el, q){
  const row = document.createElement('div');
  row.className = 'fb';
  row.innerHTML = '<span>Entendi certo?</span>';
  el.appendChild(row);
  const yes = document.createElement('button'), no = document.createElement('button');
  yes.type = no.type = 'button'; yes.textContent = 'Sim'; no.textContent = 'Não';
  row.append(yes, no);
  yes.addEventListener('click', () => { row.innerHTML = '<span>Obrigado!</span>'; });
  no.addEventListener('click', () => {
    logQ(q.raw || '', 'errado', describe(q).replace(/<[^>]+>/g, ''));
    row.innerHTML = '<span>Anotei para melhorar. O que você queria?</span>';
    const opts = altKinds(q).map(k => ({label: KIND_BTN[k], patch: {kind: k}}));
    opts.push({label: 'Vou escrever de outro jeito', write: true});
    optButtons(row, opts, o => {
      if (o.write){ $('chat-in').focus(); return; }
      row.querySelector('.opts').remove();
      addMsg('me', esc(o.label));
      route({...q, ...o.patch, fixes: []});
    });
  });
}

async function ask(text){
  text = String(text || '').trim();
  if (!text || chat.busy) return;
  const picked = matchPending(text);
  if (picked){ $('chat-in').value = ''; addMsg('me', esc(text)); const pend = chat.pending; chat.pending = null; route({...pend.q, ...picked.patch}); return; }
  chat.pending = null;
  addMsg('me', esc(text));
  $('chat-in').value = '';
  const p = parse(text);
  if (/^s[oó] refino$/i.test(text)) p.kind = 'refine';
  const changed = applySettings(p);
  const pre = changed.length ? `<p>Pronto, anotei: ${esc(listJoin(changed))}.</p>` : '';

  if (p.kind === 'steps' || p.kind === 'more' || p.kind === 'safe'){
    if (!chat.shown.length && !chat.all.length){ addMsg('bot', '<p>Ainda não tenho opções para mostrar. Pergunte primeiro, por exemplo: "o que está dando lucro hoje?".</p>'); setSugs(START_SUGS); return; }
    if (p.kind === 'steps'){
      const d = chat.shown[p.ord == null ? 0 : p.ord];
      if (!d){ addMsg('bot', `<p>Na última resposta mostrei ${chat.shown.length} ${chat.shown.length === 1 ? 'opção' : 'opções'}. Diga, por exemplo, "passo a passo da 1ª".</p>`); return; }
      const {u} = unitsFor(d);
      QTY_OVERRIDE = chat.budget ? (u || 1) : 0;
      const steps = stepsFor(d), rec = receiptHtml(d);
      QTY_OVERRIDE = 0;
      addMsg('bot', `<p>Passo a passo para <b>${esc(d.title)}</b>, com ${fmt(u || 1)} unidades:</p><ol class="steps">${steps.map(x => `<li>${x}</li>`).join('')}</ol><details class="inmsg"><summary>Ver a conta de 1 unidade</summary>${rec}</details>`);
      setSugs(sugsFor(chat.last ? chat.last.kind : 'general'));
      return;
    }
    if (p.kind === 'more'){
      const next = chat.all.filter(d => !chat.seen.has(d)).slice(0, 5);
      next.forEach(d => chat.seen.add(d));
      if (!next.length){ addMsg('bot', '<p>Já mostrei todas as opções com lucro dessa busca.</p>'); return; }
      chat.shown = next;
      addMsg('bot', `<p>Mais ${next.length} ${next.length === 1 ? 'opção' : 'opções'}:</p><ol class="opps">${next.map(oppHtml).join('')}</ol>`);
      setSugs(sugsFor(chat.last ? chat.last.kind : 'general'));
      return;
    }
    const safe = chat.all.filter(d => d.checked && d.safe).slice(0, 5);
    if (!safe.length){ addMsg('bot', '<p>Nenhuma opção dessa busca passou em todas as conferências de segurança. Leia os avisos de cada uma antes de investir.</p>'); return; }
    chat.shown = safe;
    addMsg('bot', `<p>${safe.length === 1 ? 'Só 1 opção passou em todas as conferências: vende bem e está com preço normal.' : `As ${safe.length} opções mais seguras, que vendem bem e estão com preço normal:`}</p><ol class="opps">${safe.map(oppHtml).join('')}</ol>`);
    setSugs(sugsFor(chat.last ? chat.last.kind : 'general'));
    return;
  }
  if (p.kind === 'explain'){
    const [a, b, s] = EXPLAIN[p.topic];
    addMsg('bot', `<p>${esc(a)}</p><p>${esc(b)}</p>`);
    setSugs([...s, ...START_SUGS.slice(0, 3)].slice(0, 5));
    return;
  }
  if (p.kind === 'help'){
    addMsg('bot', `<p>Eu procuro o que está dando lucro no mercado do servidor das Américas, com os preços mais recentes enviados pelos jogadores. Você pode me perguntar:</p>
      <ul class="plain"><li>O que está dando lucro agora, em geral ou com um recurso, como "o que dá lucro com couro?"</li>
      <li>O que levar de uma cidade para outra, como "o que levar de Lymhurst pra Martlock?"</li>
      <li>Se vale a pena refinar, como "vale a pena refinar minério T6?"</li>
      <li>Quanto dá fabricar um item, como "quanto dá fabricar bolsa?"</li>
      <li>O que o Black Market está pagando bem</li>
      <li>O preço de um item, como "quanto está a tábua T5?"</li>
      <li>O que significa algo, como "o que é foco?"</li></ul>
      <p>Também posso ajustar as contas. Diga "não tenho premium", "quero vender na hora", "tenho 500 mil", "minha montaria carrega 1500 kg" ou "com foco".</p>
      <p>Pode escrever do seu jeito, com gírias e abreviações. Se eu entender errado, toque em "Não" embaixo da resposta.</p>`);
    setSugs(START_SUGS);
    return;
  }
  if (p.kind === 'greet' && !changed.length){
    addMsg('bot', '<p>Oi! Eu procuro o que está dando lucro no mercado de Albion. Pergunte do seu jeito, ou toque numa das sugestões abaixo.</p>');
    setSugs(START_SUGS);
    return;
  }
  if (p.kind === 'thanks' && !changed.length){
    addMsg('bot', '<p>De nada! Boas vendas. Os preços mudam o tempo todo, então vale perguntar de novo antes de cada viagem.</p>');
    setSugs(START_SUGS.slice(0, 4));
    return;
  }

  let q = null;
  if (p.kind && !['greet', 'thanks'].includes(p.kind)) q = p;
  else if (chat.last && (hasModifiers(p) || changed.length)) q = mergeCtx(chat.last, p);
  else if (changed.length && p.budget > 0) q = {...p, kind: 'general'};
  else if (p.from.length || p.to.length) q = {...p, kind: 'transport'};
  else if (p.fam || p.famOptions || p.res) q = p;

  if (!q){
    if (changed.length){ addMsg('bot', `${pre}<p>Agora me pergunte o que quer saber.</p>`); setSugs(START_SUGS.slice(0, 5)); return; }
    logQ(text, 'nao-entendi');
    addMsg('bot', `<p>Não entendi bem essa pergunta. Eu entendo perguntas sobre lucro, transporte entre cidades, refino, fabricação, Black Market e preço de itens.</p><p>Tente, por exemplo, uma das sugestões abaixo. Anotei sua pergunta para eu aprender.</p>`);
    setSugs(START_SUGS);
    return;
  }
  route(q, pre);
}
function initChat(){
  addMsg('bot', `<p>Oi! Eu sou o Mercador. Pergunte do seu jeito o que você quer fazer no mercado, e eu busco os preços e faço as contas.</p>
    <p>Por exemplo: "o que está dando lucro hoje?", "vale a pena refinar madeira?" ou "tenho 1 milhão, o que faço?".</p>`);
  setSugs(START_SUGS);
  $('chat-form').addEventListener('submit', e => { e.preventDefault(); ask($('chat-in').value); });
  $('chat-log-btn').addEventListener('click', showLog);
  updateLogBtn();
}
