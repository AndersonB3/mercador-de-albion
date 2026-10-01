# (frase, esperado). Campos: kind, from, to, any, res, raw, fam, tier, ench, budget, cap, premium, mode, focus, topic, clarify ('fam'|'kind'|'couro'|'city'|None)
T = []
def add(f, **e): T.append((f, e))
# lucro geral
for f in ["O que está dando lucro hoje?", "o que ta dando lucro", "oq ta dando lucro hj", "qual o melhor jeito de ganhar prata hoje",
          "como ganho dinheiro agora", "me fala oq compensa", "o que compensa fazer hoje?", "quero lucrar", "oque rende mais agora",
          "qual o corre de hoje?", "como farmar prata", "o que da pra fazer pra ganhar grana", "me da uma dica de lucro", "o que vale a pena hoje",
          "quais as melhores oportunidades", "o q ta rendendo", "to sem prata, o que faço?", "lucro", "ganhar silver", "o que tá dando mais lucro agora?"]:
    add(f, kind='general', clarify=None)
add("tenho 1 milhão, o que faço?", kind='general', budget=1000000)
add("tenho 1kk", kind='general', budget=1000000)
add("o que faço com 2kk de prata", kind='general', budget=2000000)
add("tenho 500k", kind='general', budget=500000)
add("tenho meio milhão pra investir", kind='general', budget=500000)
add("com 300 mil o que eu faço", kind='general', budget=300000)
add("tenho 1,5kk", kind='general', budget=1500000)
add("investir 750000 de prata", kind='general', budget=750000)
add("o que dá lucro com couro?", kind='general', res='HIDE', clarify='couro')
add("o que dá lucro com madeira", kind='general', res='WOOD', raw=True)
add("lucro com tábuas t6", kind='general', res='WOOD', raw=False, tier=6)
add("o que da lucro em martlock", kind='general', any=['Martlock'])
add("o que rende com equipamentos", kind='general')
# refino
for f, res, raw in [("Vale a pena refinar madeira?", 'WOOD', True), ("vale apena refinar minerio", 'ORE', True), ("refinar couro compensa?", 'HIDE', False),
                    ("compensa refinar fibra", 'FIBER', True), ("vale refinar pedra?", 'ROCK', True), ("refinar tabua", 'WOOD', False),
                    ("da lucro refinar barra?", 'ORE', False), ("refino de tecido", 'FIBER', False), ("refinar algodão", 'FIBER', True),
                    ("vale a pena refinr madeira", 'WOOD', True), ("refina madera", 'WOOD', True), ("refinar couro cru", 'HIDE', True)]:
    add(f, kind='refine', res=res, raw=raw, clarify=None)
add("vale a pena refinar?", kind='refine', res=None)
add("o que compensa refinar hoje", kind='refine')
add("vale a pena refinar minério t6.2 em thetford", kind='refine', res='ORE', tier=6, ench=2, any=['Thetford'])
add("refinar madeira 6.1", kind='refine', res='WOOD', tier=6, ench=1)
add("refinar madeira t6 ponto 3", kind='refine', tier=6, ench=3)
add("refinar couro 8.4", kind='refine', res='HIDE', tier=8, ench=4)
add("refinar madeira tier 5", kind='refine', tier=5)
add("refinar fibra encantamento 2", kind='refine', ench=2)
add("refinar fibra .2", kind='refine', ench=2)
add("refinar madeira com foco", kind='refine', focus=True)
add("refinar madeira sem foco", kind='refine', focus=False)
add("refinar minerio em fort sterling", kind='refine', any=['Fort Sterling'])
add("refinar couro em martlok", kind='refine', any=['Martlock'])
add("refinar pedra em bridge", kind='refine', any=['Bridgewatch'])
add("refinar pedra comprando em lym e vendendo em caer", kind='refine', **{'from': ['Lymhurst'], 'to': ['Caerleon']})
# transporte
add("O que levar de Martlock pra Caerleon?", kind='transport', **{'from': ['Martlock'], 'to': ['Caerleon']})
add("o que levar de martlock para caerleon", kind='transport', **{'from': ['Martlock'], 'to': ['Caerleon']})
add("o que comprar em lymhurst pra vender em bridgewatch", kind='transport', **{'from': ['Lymhurst'], 'to': ['Bridgewatch']})
add("rota de thetford pra fort sterling", kind='transport', **{'from': ['Thetford'], 'to': ['Fort Sterling']})
add("transporte de brecilien pra caerleon", kind='transport', **{'from': ['Brecilien'], 'to': ['Caerleon']})
add("o que levar pra caerleon", kind='transport', to=['Caerleon'])
add("o que vender em caerleon", kind='transport', to=['Caerleon'])
add("o que comprar em martlock", kind='transport', **{'from': ['Martlock']})
add("flipar de bridge pra lym", kind='transport', **{'from': ['Bridgewatch'], 'to': ['Lymhurst']})
add("flipar itens", kind='transport')
add("o que transportar hoje", kind='transport')
add("viagem de martlock pra thetford compensa?", kind='transport', **{'from': ['Martlock'], 'to': ['Thetford']})
add("levar tecido t6 de lymhurst pra martlock", kind='transport', res='FIBER', raw=False, tier=6, **{'from': ['Lymhurst'], 'to': ['Martlock']})
add("levar madeira de fort pra caerleon", kind='transport', res='WOOD', raw=True, **{'from': ['Fort Sterling'], 'to': ['Caerleon']})
add("levar couro de martlock pra caerleon", kind='transport', res='HIDE', clarify='couro')
add("levar couro trabalhado de martlock pra caerleon", kind='transport', res='HIDE', raw=False, clarify=None)
add("levar espada larga de martlock pra caerleon", kind='transport', fam='MAIN_SWORD')
add("levar bolsa t5 pra caerleon", kind='transport', fam='BAG', tier=5)
add("o que levar das cidades reais pra caerleon", kind='transport', to=['Caerleon'])
add("de martlock pra martlock", kind='transport', clarify='city')
add("o que levar de martlok pra caerlon", kind='transport', **{'from': ['Martlock'], 'to': ['Caerleon']})
add("o que levar de thetfort pra bridgewach", kind='transport', **{'from': ['Thetford'], 'to': ['Bridgewatch']})
add("transportar equipamentos de lymhurst pra caerleon", kind='transport', **{'from': ['Lymhurst'], 'to': ['Caerleon']})
add("revender de brecilien pra martlock", kind='transport', **{'from': ['Brecilien'], 'to': ['Martlock']})
# black market
for f in ["O que o Black Market está pagando bem?", "o que vender no bm", "bm ta pagando o que?", "o que o mercado negro compra",
          "black market compensa?", "vender pro blackmarket", "o que levar pro bm", "melhores itens pro black market"]:
    add(f, kind='bm')
add("comprar em martlock pra vender no bm", kind='bm', **{'from': ['Martlock']})
add("vender espada larga no black market", kind='bm', fam='MAIN_SWORD')
add("bm t8", kind='bm', tier=8)
add("black market 6.2", kind='bm', tier=6, ench=2)
# crafting
add("Quanto dá fabricar espada larga?", kind='craft', fam='MAIN_SWORD')
add("quanto da craftar espada larga", kind='craft', fam='MAIN_SWORD')
add("fabricar espada larga t6", kind='craft', fam='MAIN_SWORD', tier=6)
add("vale a pena fabricar bolsa?", kind='craft', fam='BAG')
add("fabricar bolsa t5.1 em caerleon", kind='craft', fam='BAG', tier=5, ench=1, any=['Caerleon'])
add("quanto dá fazer poção de cura", kind='craft', fam='POTION_HEAL')
add("fazer pot de cura", kind='craft', fam='POTION_HEAL')
add("craftar bag", kind='craft', fam='BAG')
add("crafto capa?", kind='craft', fam='CAPE')
add("fabricar arco", kind='craft', fam='2H_BOW')
add("fabricar espada", kind='craft', clarify='fam')
add("fabricar", kind='craft')
add("fabricar adaga t4", kind='craft', fam='MAIN_DAGGER', tier=4)
add("fabrcar espada larga", kind='craft', fam='MAIN_SWORD')
add("quanto da fazer espda larga", kind='craft', fam='MAIN_SWORD')
add("fabricar montante", kind='craft', fam='2H_CLAYMORE')
add("vale fabricar bolsa em martlock vendendo em caerleon", kind='craft', fam='BAG', any=['Martlock'], to=['Caerleon'])
# preço
add("Quanto está a tábua T5?", kind='price', res='WOOD', raw=False, tier=5)
add("quanto ta a tabua t5", kind='price', res='WOOD', tier=5)
add("qnto ta a tabua t5", kind='price', res='WOOD', tier=5)
add("preço do couro cru t4", kind='price', res='HIDE', raw=True, tier=4)
add("preço do couro t4", kind='price', res='HIDE', clarify='couro')
add("quanto custa espada larga t6", kind='price', fam='MAIN_SWORD', tier=6)
add("quanto ta a espada larga", kind='price', fam='MAIN_SWORD')
add("qual o valor da bolsa t4", kind='price', fam='BAG', tier=4)
add("prc da barra t7", kind='price', res='ORE', raw=False, tier=7)
add("quanto tá o minério 6.1", kind='price', res='ORE', raw=True, tier=6, ench=1)
add("quanto está a pedra t4", kind='price', res='ROCK', raw=True)
add("cotação do tecido t8", kind='price', res='FIBER', raw=False, tier=8)
add("quanto pagam na bolsa", kind='price', fam='BAG')
# só o item ou recurso: precisa perguntar
add("madeira", kind=None, res='WOOD', clarify='kind')
add("espada larga t6", kind=None, fam='MAIN_SWORD', tier=6, clarify='kind')
add("tabua t5", kind=None, res='WOOD', clarify='kind')
add("bolsa", kind=None, fam='BAG', clarify='kind')
add("couro", kind=None, res='HIDE', clarify='kind')
add("poção de cura", kind=None, fam='POTION_HEAL', clarify='kind')
# ajustes
add("não tenho premium", kind=None, premium=False, clarify=None)
add("nao tenho premium", kind=None, premium=False)
add("sem premium", kind=None, premium=False)
add("meu premium acabou", kind=None, premium=False)
add("tenho premium", kind=None, premium=True)
add("quero vender na hora", kind=None, mode='instant')
add("vender rapido", kind=None, mode='instant')
add("quero anunciar", kind=None, mode='order')
add("minha montaria carrega 2000 kg", kind=None, cap=2000)
add("meu boi carrega 1.500 kg", kind=None, cap=1500)
add("100 unidades", kind=None)
add("com foco", kind=None, focus=True)
add("e com foco?", kind=None, focus=True)
add("sem foco", kind=None, focus=False)
add("sem limite de prata", kind=None, budget=-1)
# continuação
add("e o .1?", kind=None, ench=1)
add("e o T6?", kind=None, tier=6)
add("e o 6.2?", kind=None, tier=6, ench=2)
add("e em Thetford?", kind=None, any=['Thetford'])
add("e pra caerleon?", kind=None, to=['Caerleon'])
add("e comprando em martlock?", kind=None, **{'from': ['Martlock']})
add("e vendendo em caerleon?", kind=None, to=['Caerleon'])
add("e vendendo na hora?", kind=None, mode='instant')
for f, k in [("passo a passo da 2", 'steps'), ("Passo a passo da 1ª", 'steps'), ("passo a passo", 'steps'), ("como faço a primeira?", 'steps'),
             ("como faço a 3", 'steps'), ("me explica a segunda", 'steps'), ("mostrar mais", 'more'), ("mostra mais", 'more'), ("ver mais opções", 'more'),
             ("e as outras?", 'more'), ("só os seguros", 'safe'), ("somente os seguros", 'safe'), ("so as seguras", 'safe')]:
    add(f, kind=k)
# explicações
for f, tp in [("o que é foco?", 'retorno'), ("o que é black market", 'blackmarket'), ("o que é tier", 'tier'), ("o que é refino?", 'refino'),
              ("como funciona o premium", 'premium'), ("o que significa seguro", 'seguro'), ("o que é atenção?", 'seguro'),
              ("o que é encantamento", 'encantamento'), ("pra que serve o data client", 'cliente'), ("por que os preços estão antigos? explica", 'cliente'),
              ("o que é taxa", 'taxa'), ("o que é qualidade", 'qualidade'), ("o que é anunciar", 'anunciar'), ("como funciona o transporte", 'transporte'),
              ("o que é crafting", 'crafting'), ("o que é retorno de recursos", 'retorno'), ("explica o bm", 'blackmarket')]:
    add(f, kind='explain', topic=tp)
# ajuda, saudação, agradecimento, fora do assunto
for f in ["O que você sabe fazer?", "ajuda", "help", "o que vc faz", "como te uso", "o que posso perguntar"]:
    add(f, kind='help')
for f in ["oi", "olá", "bom dia", "e ai", "salve", "boa noite"]:
    add(f, kind='greet')
for f in ["valeu", "obrigado", "vlw", "tmj", "obrigada!"]:
    add(f, kind='thanks')
for f in ["qual a capital da frança", "quem ganhou o jogo ontem", "me conta uma piada", "asdfgh", "qual sua cor favorita"]:
    add(f, kind=None, fam=None, res=None, clarify=None)
