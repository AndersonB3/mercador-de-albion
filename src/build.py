"""Monta o index.html a partir do modelo, do chat e da base de itens.
Uso: python3 src/build.py   (rodar na pasta principal do projeto)"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / 'src'
db = json.dumps(json.loads((SRC / 'db.json').read_text(encoding='utf-8')), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
modelo = (SRC / 'painel.template.html').read_text(encoding='utf-8')
chat = (SRC / 'chat.js').read_text(encoding='utf-8')
assert '/*__DB__*/' in modelo and '/*__CHAT__*/' in modelo
(RAIZ / 'index.html').write_text(modelo.replace('/*__CHAT__*/', chat).replace('/*__DB__*/', db), encoding='utf-8')
print('index.html atualizado')
