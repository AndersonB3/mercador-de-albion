import asyncio, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from frases import T
from playwright.async_api import async_playwright
JS = """(cases) => cases.map(([f, e]) => {
  const p = parse(f);
  let clar = null;
  const q = p.kind ? p : ((p.fam || p.famOptions || p.res) ? p : null);
  if (q && !['steps','more','safe','explain','help','greet','thanks'].includes(q.kind)){
    const c = clarifyFor(q);
    if (c){ clar = q.famOptions && !q.fam ? 'fam' : (!q.kind ? 'kind' : (q.resAmb ? 'couro' : 'city')); }
  }
  const got = {kind: p.kind, from: p.from, to: p.to, any: p.any, res: p.res, raw: p.raw_, fam: p.fam, tier: p.tier, ench: p.ench,
    budget: p.budget, cap: p.cap, premium: p.premium, mode: p.mode, focus: p.focus, topic: p.topic, clarify: clar};
  const bad = Object.entries(e).filter(([k, v]) => JSON.stringify(got[k] ?? null) !== JSON.stringify(v ?? null));
  return bad.length ? {f, bad: bad.map(([k, v]) => `${k}: esperado ${JSON.stringify(v)}, veio ${JSON.stringify(got[k])}`), fixes: p.fixes} : null;
}).filter(Boolean)"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/*', lambda r: r.abort() if 'albion-online-data' in r.request.url else r.continue_())
        await pg.goto((Path(__file__).resolve().parents[2] / 'index.html').as_uri()); await pg.wait_for_timeout(500)
        fails = await pg.evaluate(JS, [[f, e] for f, e in T])
        for x in fails: print('FALHOU:', x['f'], '|', '; '.join(x['bad']), '| correções:', x['fixes'])
        print(f'\n{len(T) - len(fails)} de {len(T)} passaram.', 'Erros na página:', errs)
        await b.close()
asyncio.run(main())
