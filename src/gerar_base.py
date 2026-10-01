"""Gera src/db.json (nomes em português, peso, categoria e receitas oficiais)
a partir dos dados públicos do jogo em github.com/ao-data/ao-bin-dumps.
Rode quando sair uma atualização do Albion com itens novos.
Uso: python3 src/gerar_base.py"""
import json, urllib.request
from pathlib import Path

BASE = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/'
def baixar(nome):
    with urllib.request.urlopen(BASE + nome) as r:
        return json.loads(r.read().decode('utf-8'))

itens = baixar('items.json')['items']
nomes = {}
for x in baixar('formatted/items.json'):
    ln = x.get('LocalizedNames') or {}
    n = ln.get('PT-BR') or ln.get('EN-US')
    if n: nomes[x['UniqueName']] = n

def lista(v): return v if isinstance(v, list) else ([v] if v else [])
def codigo(r):
    u, e = r['@uniquename'], int(r.get('@enchantmentlevel', '0') or 0)
    return f'{u}@{e}' if e > 0 else u
def receita(cr):
    crs = lista(cr)
    if not crs: return None
    c = crs[0]
    res = [[codigo(r), int(r['@count']), 0 if r.get('@maxreturnamount') == '0' else 1] for r in lista(c.get('craftresource'))]
    return [int(c.get('@amountcrafted', '1') or 1), res] if res else None

db = {}
for grupo in ['weapon', 'equipmentitem', 'simpleitem', 'consumableitem', 'mount', 'farmableitem', 'consumablefrominventoryitem']:
    for x in itens.get(grupo, []):
        u, cat = x['@uniquename'], x.get('@shopcategory')
        e = int(x.get('@enchantmentlevel', '0') or 0)
        chave = f'{u}@{e}' if e > 0 else u
        n = nomes.get(chave) or nomes.get(u)
        if not cat or not n or cat in ('vanity', 'other'): continue
        recs = {}
        r0 = receita(x.get('craftingrequirements'))
        if r0: recs['0'] = r0
        for en in lista((x.get('enchantments') or {}).get('enchantment')):
            r = receita(en.get('craftingrequirements'))
            if r: recs[en['@enchantmentlevel']] = r
        db[chave] = [n, round(float(x.get('@weight', '0') or 0), 2), cat, x.get('@shopsubcategory1', ''), recs]

destino = Path(__file__).resolve().parent / 'db.json'
destino.write_text(json.dumps(db, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'{len(db)} itens salvos em {destino}')
