# Mercador de Albion

Painel gratuito que mostra o que está dando lucro no mercado do Albion Online, no servidor das Américas. Basta abrir no navegador, sem instalar nada.

## O que ele faz

- **Perguntar:** um chat em que você escreve do seu jeito, como "o que está dando lucro hoje?", "vale a pena refinar madeira T6?" ou "tenho 1 milhão, o que faço?". Ele não usa IA: entende a pergunta por palavras-chave, faz as contas e mostra como entendeu.
- **Transporte:** a melhor rota para comprar numa cidade e vender em outra.
- **Black Market:** o que o Black Market de Caerleon está pagando acima das cidades.
- **Refino:** se vale a pena refinar cada tier, com as receitas oficiais e o retorno de material.
- **Crafting:** lucro de fabricar qualquer item do jogo, com a receita oficial.

Cada oportunidade mostra o lucro já descontando as taxas, o selo Seguro ou Atenção (com base nas vendas da última semana), a idade dos preços e um passo a passo do que fazer no jogo.

## De onde vêm os preços

Os preços vêm do [Albion Online Data Project](https://www.albion-online-data.com/), uma base pública alimentada por jogadores que usam o Albion Data Client. Quem usa o painel não precisa instalar o cliente, mas quem instala ajuda a deixar os preços mais frescos para todo mundo.

Os nomes dos itens, pesos e receitas vêm dos dados públicos do jogo em [ao-data/ao-bin-dumps](https://github.com/ao-data/ao-bin-dumps).

## Como o projeto é organizado

| Arquivo | O que é |
|---|---|
| `index.html` | O painel pronto. É o arquivo que o site publica. |
| `src/painel.template.html` | Visual e lógica das abas. |
| `src/chat.js` | O chat da aba Perguntar. |
| `src/db.json` | Base de itens com nomes em português, pesos e receitas. |
| `src/build.py` | Junta os três arquivos acima no `index.html`. |
| `src/gerar_base.py` | Atualiza o `db.json` quando o jogo recebe itens novos. |
| `src/tests/` | 207 perguntas de teste do chat, com a resposta esperada. |

## Como alterar

1. Edite `src/painel.template.html` ou `src/chat.js`.
2. Rode `python3 src/build.py` para gerar o `index.html` novo.
3. Rode os testes do chat: `python3 src/tests/rodar.py`. Eles precisam do Playwright (`pip install playwright` e `playwright install chromium`).
4. Envie as mudanças. O site atualiza sozinho em cerca de um minuto.

Depois de uma atualização do jogo com itens novos, rode `python3 src/gerar_base.py` e depois o `build.py`.
