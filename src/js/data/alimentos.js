/* ============================================================
   WELLNESS — alimentos.js

   Tabela nutricional dos alimentos usados nos cardápios (dados.js).
   Cada chave é EXATAMENTE o texto do item como aparece em
   `refeicoes[].itens` — assim a tela de plano alimentar consegue
   cruzar o item com suas calorias/porção/emoji sem alterar dados.js.

     { emoji, kcal, porcao, p }
       emoji  → ícone visual do alimento
       kcal   → calorias estimadas para a porção indicada
       porcao → descrição da porção (ex.: "1 xícara (150g)")
       p      → chave da família em PORQUE (explicação "por que comer")

   As explicações de "por que comer" (PORQUE) variam conforme o
   OBJETIVO do usuário (ganhar-massa / emagrecer / melhorar-alimentacao),
   pois o papel do mesmo alimento muda conforme a meta.

   Os valores/textos são estimativas de referência para exibição no
   protótipo (não são prescrição nutricional).

   Uso:  WELLNESS_ALIMENTO(nome, objetivo)  → sempre devolve um objeto
         válido (com fallback), incluindo `porque` já resolvido para
         o objetivo informado.
   ============================================================ */

/* ════════════ EXPLICAÇÕES POR FAMÍLIA × OBJETIVO ════════════ */
const WELLNESS_PORQUE = {
  pao_integral: {
    "ganhar-massa": "Carboidrato de digestão lenta: energia constante para treinar e sustentar o ganho de massa.",
    "emagrecer": "As fibras aumentam a saciedade e seguram a fome por mais tempo, com energia estável.",
    "melhorar-alimentacao": "Versão mais nutritiva que o pão branco, com fibras que ajudam o intestino e a disposição.",
  },
  ovos: {
    "ganhar-massa": "Proteína de alto valor biológico que ajuda diretamente na construção e no reparo dos músculos.",
    "emagrecer": "Muita proteína e poucas calorias: sacia bastante e preserva o músculo durante o emagrecimento.",
    "melhorar-alimentacao": "Proteína completa e prática, com nutrientes importantes como colina e vitaminas do complexo B.",
  },
  arroz: {
    "ganhar-massa": "Principal fonte de energia (carboidrato) para render no treino e ter combustível para crescer.",
    "emagrecer": "Carboidrato para energia — na porção certa, dá saciedade sem exagerar. A versão integral tem mais fibra.",
    "melhorar-alimentacao": "Base energética da refeição; combinado com o feijão, forma uma proteína completa e equilibrada.",
  },
  feijao: {
    "ganhar-massa": "Proteína vegetal, ferro e fibras que complementam o arroz e ajudam na recuperação muscular.",
    "emagrecer": "Rico em fibras e proteína vegetal: dá saciedade prolongada com poucas calorias.",
    "melhorar-alimentacao": "Junto com o arroz, fecha uma proteína completa; fonte barata de ferro e fibras.",
  },
  aveia: {
    "ganhar-massa": "Carboidrato de liberação lenta que mantém a energia — ótimo para refeições pré e pós-treino.",
    "emagrecer": "Fibras que aumentam a saciedade e ajudam a controlar o apetite e o açúcar no sangue.",
    "melhorar-alimentacao": "Fibras solúveis que ajudam o intestino e o coração, com energia estável ao longo do dia.",
  },
  granola: {
    "ganhar-massa": "Mistura calórica de cereais e oleaginosas que soma energia e nutrientes ao lanche.",
    "emagrecer": "Fibras e crocância para o iogurte — use porção controlada por ser mais calórica.",
    "melhorar-alimentacao": "Combina fibras, cereais e castanhas; boa para variar textura e nutrientes do café da manhã.",
  },
  chia: {
    "ganhar-massa": "Fibras e gorduras boas (ômega-3) que somam nutrientes e ajudam na digestão.",
    "emagrecer": "Absorve água e aumenta a saciedade; fibras que ajudam a controlar a fome.",
    "melhorar-alimentacao": "Pequena porção rica em ômega-3, fibras e minerais para enriquecer a refeição.",
  },
  macarrao: {
    "ganhar-massa": "Boa fonte de carboidrato para repor energia e sustentar treinos mais intensos.",
    "emagrecer": "Carboidrato para energia; controle a porção e prefira a versão integral, com mais fibra.",
    "melhorar-alimentacao": "Opção prática de energia; a versão integral agrega fibras à refeição.",
  },
  batata: {
    "ganhar-massa": "Carboidrato de fácil digestão que repõe energia e ajuda na recuperação após o treino.",
    "emagrecer": "Saciante e com poucas calorias quando preparada sem excesso de gordura.",
    "melhorar-alimentacao": "Fonte natural de energia e potássio; boa alternativa a alimentos ultraprocessados.",
  },
  batata_doce: {
    "ganhar-massa": "Carboidrato de absorção gradual, clássico para energia estável no treino e para crescer.",
    "emagrecer": "Libera energia devagar, prolonga a saciedade e evita picos de fome.",
    "melhorar-alimentacao": "Rica em fibras e betacaroteno, com energia de qualidade e liberação lenta.",
  },
  pure_abobora: {
    "ganhar-massa": "Acompanhamento leve e nutritivo que agrega volume e vitaminas sem pesar.",
    "emagrecer": "Baixa em calorias e rica em fibras: dá volume ao prato e sacia.",
    "melhorar-alimentacao": "Leve e fácil de digerir, rica em betacaroteno e antioxidantes.",
  },
  carne_vermelha: {
    "ganhar-massa": "Proteína de alto valor e ferro: apoia o crescimento muscular e o transporte de oxigênio.",
    "emagrecer": "Escolha magra: muita proteína para preservar músculo com menos gordura.",
    "melhorar-alimentacao": "Fonte importante de ferro, zinco e proteína; prefira cortes magros e preparos simples.",
  },
  frango: {
    "ganhar-massa": "Proteína magra e versátil, base para construir músculo sem muita gordura.",
    "emagrecer": "Muita proteína e pouca gordura: sacia e ajuda a manter a massa magra no emagrecimento.",
    "melhorar-alimentacao": "Proteína leve e prática, fácil de encaixar em refeições equilibradas do dia a dia.",
  },
  peru: {
    "ganhar-massa": "Proteína magra prática para somar aos lanches e distribuir proteína ao longo do dia.",
    "emagrecer": "Rico em proteína e bem magro: sacia o lanche com poucas calorias.",
    "melhorar-alimentacao": "Opção de frios mais magra e leve para lanches equilibrados.",
  },
  peixe: {
    "ganhar-massa": "Proteína magra com gorduras boas (ômega-3) que ajudam na recuperação e na saúde geral.",
    "emagrecer": "Proteína leve e saciante, com poucas calorias e gorduras benéficas.",
    "melhorar-alimentacao": "Ômega-3 e proteína de qualidade; importante para o coração e o cérebro.",
  },
  leite: {
    "ganhar-massa": "Proteína e cálcio que ajudam na recuperação; forma líquida prática de somar calorias.",
    "emagrecer": "Proteína e cálcio que saciam; escolha a porção certa para controlar as calorias.",
    "melhorar-alimentacao": "Fonte de cálcio e proteína para os ossos e a rotina; boa base para vitaminas.",
  },
  iogurte: {
    "ganhar-massa": "Proteína e probióticos que ajudam na recuperação e na saúde intestinal.",
    "emagrecer": "Proteína que sacia e probióticos que ajudam a digestão, com poucas calorias.",
    "melhorar-alimentacao": "Probióticos para o intestino e proteína leve; ótimo para lanches equilibrados.",
  },
  queijo: {
    "ganhar-massa": "Proteína e cálcio em porção prática, boa para compor lanches ao longo do dia.",
    "emagrecer": "Queijo mais magro: proteína e sabor com menos gordura que os amarelos.",
    "melhorar-alimentacao": "Opção de queijo mais leve, fonte de cálcio e proteína para o dia a dia.",
  },
  vitamina: {
    "ganhar-massa": "Forma prática e calórica de somar proteína e energia — ótima para quem tem pouco apetite.",
    "emagrecer": "Sacia e nutre; controle os ingredientes para não passar das calorias.",
    "melhorar-alimentacao": "Combina leite e frutas numa refeição prática, fácil de digerir e nutritiva.",
  },
  suco: {
    "ganhar-massa": "Ajuda a hidratar e repor energia rápida, além de trazer vitaminas para o dia.",
    "emagrecer": "Prefira natural e sem açúcar; hidrata e traz vitaminas — atenção à quantidade.",
    "melhorar-alimentacao": "Vitaminas e hidratação da fruta; melhor que refrigerantes e sucos industrializados.",
  },
  banana: {
    "ganhar-massa": "Potássio e carboidrato de rápida absorção: energia ideal perto do treino e contra cãibras.",
    "emagrecer": "Doce natural que mata a vontade de açúcar, com fibras que ajudam na saciedade.",
    "melhorar-alimentacao": "Fruta prática rica em potássio e energia, ótima para lanches e digestão.",
  },
  maca: {
    "ganhar-massa": "Fibras e energia leve para os intervalos entre as refeições.",
    "emagrecer": "Fibras que saciam e pouca caloria: ótima para segurar a fome entre refeições.",
    "melhorar-alimentacao": "Rica em fibras e antioxidantes; lanche natural, prático e leve.",
  },
  mamao_melao: {
    "ganhar-massa": "Fruta leve que ajuda na digestão e complementa as refeições com vitaminas.",
    "emagrecer": "Muita água e poucas calorias: hidrata, sacia e ajuda o intestino.",
    "melhorar-alimentacao": "Facilita a digestão e regula o intestino, com vitaminas e boa hidratação.",
  },
  morangos: {
    "ganhar-massa": "Antioxidantes e vitaminas com pouquíssimas calorias para colorir o lanche.",
    "emagrecer": "Doce natural, baixíssimo em calorias e rico em fibras e vitamina C.",
    "melhorar-alimentacao": "Rico em antioxidantes e vitamina C — um doce natural saudável.",
  },
  frutas: {
    "ganhar-massa": "Vitaminas, minerais e energia natural que apoiam o desempenho e a recuperação.",
    "emagrecer": "Doçura natural com fibras: saciam e substituem doces mais calóricos.",
    "melhorar-alimentacao": "Variar as frutas garante vitaminas, minerais e fibras para o equilíbrio da dieta.",
  },
  castanhas: {
    "ganhar-massa": "Gorduras boas e calorias densas que ajudam a atingir a meta calórica para crescer.",
    "emagrecer": "Gorduras boas que saciam — porção pequena, por serem bem calóricas.",
    "melhorar-alimentacao": "Gorduras boas, fibras e minerais; um punhado agrega qualidade ao lanche.",
  },
  amendoim: {
    "ganhar-massa": "Gordura boa e proteína numa fonte calórica prática para somar energia ao dia.",
    "emagrecer": "Sacia bastante com gordura boa e proteína — use pouca quantidade pelas calorias.",
    "melhorar-alimentacao": "Gordura boa e proteína vegetal; prefira a versão sem açúcar e sem óleo.",
  },
  azeite: {
    "ganhar-massa": "Gordura boa que aumenta as calorias do prato de forma saudável, ajudando no superávit.",
    "emagrecer": "Gordura boa que dá saciedade e sabor; use pouca quantidade por ser calórica.",
    "melhorar-alimentacao": "Gordura que protege o coração; ótima para finalizar pratos no lugar de molhos prontos.",
  },
  legumes: {
    "ganhar-massa": "Vitaminas, minerais e fibras que apoiam a digestão e a recuperação sem pesar no prato.",
    "emagrecer": "Muito volume e poucas calorias: enchem o prato, saciam e regulam o intestino.",
    "melhorar-alimentacao": "Fibras, vitaminas e antioxidantes essenciais; quanto mais variados, melhor.",
  },
  salada: {
    "ganhar-massa": "Fibras e vitaminas que melhoram a digestão das refeições maiores e mais proteicas.",
    "emagrecer": "Começa a refeição enchendo o estômago com pouquíssimas calorias e muitas fibras.",
    "melhorar-alimentacao": "Folhas e vegetais crus trazem fibras, água e vitaminas — hábito diário importante.",
  },
  tapioca: {
    "ganhar-massa": "Carboidrato de fácil digestão e rápida energia, prático perto do treino.",
    "emagrecer": "Leve e sem glúten; controle o recheio e a quantidade para manter as calorias.",
    "melhorar-alimentacao": "Opção leve e de fácil digestão; fica nutritiva com recheios proteicos.",
  },
  sanduiche: {
    "ganhar-massa": "Refeição prática que une carboidrato e proteína para repor energia e nutrir o músculo.",
    "emagrecer": "Lanche com pão integral e proteína magra: sacia sem exagerar nas calorias.",
    "melhorar-alimentacao": "Alternativa caseira e equilibrada ao fast-food, com pão integral e recheio magro.",
  },
  sopa: {
    "ganhar-massa": "Refeição quente e nutritiva; com carne ou frango, agrega proteína de forma confortável.",
    "emagrecer": "Muito volume e poucas calorias: aquece, sacia e hidrata no jantar.",
    "melhorar-alimentacao": "Leve e de fácil digestão, ótima para jantares confortáveis e nutritivos.",
  },
  cafe: {
    "ganhar-massa": "Cafeína que ajuda na disposição e no foco antes do treino, sem calorias.",
    "emagrecer": "Praticamente sem calorias; a cafeína dá disposição e ajuda a controlar o apetite.",
    "melhorar-alimentacao": "Sem açúcar, é uma bebida sem calorias; evite exageros perto de dormir.",
  },
  cha: {
    "ganhar-massa": "Hidratação sem calorias; alguns chás ajudam na digestão e no relaxamento.",
    "emagrecer": "Zero calorias e reconfortante; ótimo para hidratar e substituir bebidas açucaradas.",
    "melhorar-alimentacao": "Hidrata sem açúcar e pode ajudar na digestão e no sono.",
  },
  canela: {
    "ganhar-massa": "Tempero que dá sabor sem calorias e ajuda a variar os lanches sem açúcar.",
    "emagrecer": "Realça o doce natural dos alimentos, ajudando a reduzir o açúcar adicionado.",
    "melhorar-alimentacao": "Especiaria que adoça naturalmente e agrega antioxidantes, reduzindo o açúcar.",
  },
  chocolate: {
    "ganhar-massa": "Pequeno prazer com antioxidantes; em porção controlada, ajuda na adesão à dieta.",
    "emagrecer": "Porção pequena mata a vontade de doce com menos açúcar que o chocolate ao leite.",
    "melhorar-alimentacao": "Mais cacau e menos açúcar: fonte de antioxidantes para um doce mais consciente.",
  },
};

/* Explicação genérica (fallback para item não catalogado) */
const WELLNESS_PORQUE_PADRAO = {
  "ganhar-massa": "Compõe uma refeição equilibrada que apoia energia e recuperação para o ganho de massa.",
  "emagrecer": "Faz parte de uma refeição equilibrada, ajudando na saciedade e no controle das calorias.",
  "melhorar-alimentacao": "Contribui para uma alimentação mais variada e equilibrada no seu dia a dia.",
};

/* ════════════ TABELA DE ALIMENTOS ════════════ */
const WELLNESS_ALIMENTOS = {
  /* ── Pães e torradas ── */
  "Pão integral":                { emoji: "🍞", kcal: 70,  porcao: "1 fatia", p: "pao_integral" },
  "2 fatias de pão integral":    { emoji: "🍞", kcal: 140, porcao: "2 fatias", p: "pao_integral" },
  "3 fatias de pão integral":    { emoji: "🍞", kcal: 210, porcao: "3 fatias", p: "pao_integral" },
  "Torrada integral":            { emoji: "🍞", kcal: 60,  porcao: "2 unidades", p: "pao_integral" },
  "Torradas integrais":          { emoji: "🍞", kcal: 60,  porcao: "2 unidades", p: "pao_integral" },
  "Pão integral com queijo minas": { emoji: "🥪", kcal: 220, porcao: "1 fatia + queijo", p: "sanduiche" },

  /* ── Ovos e omeletes ── */
  "Ovo cozido":                  { emoji: "🥚", kcal: 70,  porcao: "1 unidade", p: "ovos" },
  "3 ovos mexidos":              { emoji: "🍳", kcal: 230, porcao: "3 ovos", p: "ovos" },
  "Omelete (2 ovos)":            { emoji: "🍳", kcal: 160, porcao: "2 ovos", p: "ovos" },
  "Omelete (3 ovos)":            { emoji: "🍳", kcal: 230, porcao: "3 ovos", p: "ovos" },
  "Omelete (4 ovos)":            { emoji: "🍳", kcal: 300, porcao: "4 ovos", p: "ovos" },

  /* ── Cereais / grãos ── */
  "Arroz":                       { emoji: "🍚", kcal: 205, porcao: "1 xícara (150g)", p: "arroz" },
  "Arroz branco":                { emoji: "🍚", kcal: 205, porcao: "1 xícara (150g)", p: "arroz" },
  "Arroz integral":              { emoji: "🍚", kcal: 215, porcao: "1 xícara (150g)", p: "arroz" },
  "Feijão":                      { emoji: "🫘", kcal: 115, porcao: "1 concha (100g)", p: "feijao" },
  "Aveia":                       { emoji: "🥣", kcal: 150, porcao: "3 col. sopa (40g)", p: "aveia" },
  "Granola":                     { emoji: "🥣", kcal: 120, porcao: "3 col. sopa (30g)", p: "granola" },
  "Chia":                        { emoji: "🌱", kcal: 60,  porcao: "1 col. sopa", p: "chia" },
  "Macarrão":                    { emoji: "🍝", kcal: 220, porcao: "1 xícara", p: "macarrao" },
  "Macarrão integral":           { emoji: "🍝", kcal: 200, porcao: "1 xícara", p: "macarrao" },

  /* ── Tubérculos e purês ── */
  "Batata inglesa":              { emoji: "🥔", kcal: 130, porcao: "1 média", p: "batata" },
  "Batata-doce":                 { emoji: "🍠", kcal: 115, porcao: "1 média (130g)", p: "batata_doce" },
  "Purê de batata":              { emoji: "🥔", kcal: 160, porcao: "1 xícara", p: "batata" },
  "Purê de abóbora":             { emoji: "🎃", kcal: 80,  porcao: "1 xícara", p: "pure_abobora" },

  /* ── Carnes e proteínas ── */
  "Carne magra":                 { emoji: "🥩", kcal: 180, porcao: "120g", p: "carne_vermelha" },
  "Carne bovina magra":          { emoji: "🥩", kcal: 180, porcao: "120g", p: "carne_vermelha" },
  "Carne moída":                 { emoji: "🥩", kcal: 220, porcao: "120g", p: "carne_vermelha" },
  "Carne moída magra":           { emoji: "🥩", kcal: 200, porcao: "120g", p: "carne_vermelha" },
  "Frango":                      { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Frango grelhado":             { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Frango grelhado com ervas":   { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Frango desfiado":             { emoji: "🍗", kcal: 150, porcao: "100g", p: "frango" },
  "Filé de frango":              { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Filé de frango grelhado":     { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Peito de frango":             { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Peito de frango grelhado":    { emoji: "🍗", kcal: 165, porcao: "120g", p: "frango" },
  "Peito de frango temperado com alho, cebola e ervas": { emoji: "🍗", kcal: 170, porcao: "120g", p: "frango" },
  "Peito de peru":               { emoji: "🦃", kcal: 90,  porcao: "3 fatias", p: "peru" },
  "Filé de peixe":               { emoji: "🐟", kcal: 140, porcao: "120g", p: "peixe" },
  "Peixe grelhado":              { emoji: "🐟", kcal: 140, porcao: "120g", p: "peixe" },

  /* ── Laticínios ── */
  "Leite":                       { emoji: "🥛", kcal: 130, porcao: "1 copo (200ml)", p: "leite" },
  "Leite integral":              { emoji: "🥛", kcal: 150, porcao: "1 copo (200ml)", p: "leite" },
  "Iogurte natural":             { emoji: "🥛", kcal: 100, porcao: "1 pote (170g)", p: "iogurte" },
  "Iogurte integral":            { emoji: "🥛", kcal: 120, porcao: "1 pote (170g)", p: "iogurte" },
  "Queijo minas":                { emoji: "🧀", kcal: 80,  porcao: "1 fatia (30g)", p: "queijo" },

  /* ── Vitaminas e sucos ── */
  "Vitamina de leite integral":            { emoji: "🥤", kcal: 220, porcao: "1 copo (300ml)", p: "vitamina" },
  "Vitamina de leite integral com aveia":  { emoji: "🥤", kcal: 280, porcao: "1 copo (300ml)", p: "vitamina" },
  "Vitamina de leite integral com mamão":  { emoji: "🥤", kcal: 250, porcao: "1 copo (300ml)", p: "vitamina" },
  "Suco natural":                { emoji: "🧃", kcal: 110, porcao: "1 copo (250ml)", p: "suco" },

  /* ── Frutas ── */
  "Banana":                      { emoji: "🍌", kcal: 105, porcao: "1 unidade", p: "banana" },
  "Maçã":                        { emoji: "🍎", kcal: 95,  porcao: "1 unidade", p: "maca" },
  "Mamão":                       { emoji: "🍈", kcal: 60,  porcao: "1 fatia", p: "mamao_melao" },
  "Melão":                       { emoji: "🍈", kcal: 60,  porcao: "1 fatia", p: "mamao_melao" },
  "Morangos":                    { emoji: "🍓", kcal: 45,  porcao: "1 xícara", p: "morangos" },
  "Fruta":                       { emoji: "🍎", kcal: 80,  porcao: "1 porção", p: "frutas" },
  "Frutas":                      { emoji: "🍎", kcal: 80,  porcao: "1 porção", p: "frutas" },
  "Frutas da estação":           { emoji: "🍓", kcal: 80,  porcao: "1 porção", p: "frutas" },

  /* ── Oleaginosas e gorduras ── */
  "Castanhas":                   { emoji: "🌰", kcal: 180, porcao: "1 punhado (30g)", p: "castanhas" },
  "Mix de castanhas":            { emoji: "🥜", kcal: 190, porcao: "1 punhado (30g)", p: "castanhas" },
  "Pasta de amendoim":           { emoji: "🥜", kcal: 95,  porcao: "1 col. sopa (15g)", p: "amendoim" },
  "Azeite de oliva":             { emoji: "🫒", kcal: 120, porcao: "1 col. sopa", p: "azeite" },

  /* ── Legumes e saladas ── */
  "Abobrinha":                   { emoji: "🥒", kcal: 20,  porcao: "1 xícara", p: "legumes" },
  "Abobrinha cozida":            { emoji: "🥒", kcal: 20,  porcao: "1 xícara", p: "legumes" },
  "Cenoura":                     { emoji: "🥕", kcal: 25,  porcao: "1 unidade", p: "legumes" },
  "Cenoura cozida":              { emoji: "🥕", kcal: 35,  porcao: "1 xícara", p: "legumes" },
  "Cenoura bem cozida":          { emoji: "🥕", kcal: 35,  porcao: "1 xícara", p: "legumes" },
  "Brócolis":                    { emoji: "🥦", kcal: 55,  porcao: "1 xícara", p: "legumes" },
  "Legumes":                     { emoji: "🥗", kcal: 60,  porcao: "1 xícara", p: "legumes" },
  "Legumes cozidos":             { emoji: "🥗", kcal: 60,  porcao: "1 xícara", p: "legumes" },
  "Legumes bem cozidos":         { emoji: "🥗", kcal: 60,  porcao: "1 xícara", p: "legumes" },
  "Legumes assados":             { emoji: "🥗", kcal: 70,  porcao: "1 xícara", p: "legumes" },
  "Legumes variados":            { emoji: "🥗", kcal: 65,  porcao: "1 xícara", p: "legumes" },
  "Salada":                      { emoji: "🥗", kcal: 35,  porcao: "1 prato", p: "salada" },
  "Salada simples":              { emoji: "🥗", kcal: 30,  porcao: "1 prato", p: "salada" },
  "Salada variada":              { emoji: "🥗", kcal: 40,  porcao: "1 prato", p: "salada" },
  "Salada colorida":             { emoji: "🥗", kcal: 40,  porcao: "1 prato", p: "salada" },
  "Salada grande":               { emoji: "🥗", kcal: 50,  porcao: "1 prato", p: "salada" },
  "Salada com pepino e tomate":  { emoji: "🥗", kcal: 35,  porcao: "1 prato", p: "salada" },

  /* ── Tapiocas ── */
  "Tapioca com queijo minas":                    { emoji: "🫓", kcal: 250, porcao: "1 unidade", p: "tapioca" },
  "Tapioca com ovos mexidos":                    { emoji: "🫓", kcal: 280, porcao: "1 unidade", p: "tapioca" },
  "Tapioca com queijo minas e 3 ovos mexidos":   { emoji: "🫓", kcal: 380, porcao: "1 unidade", p: "tapioca" },

  /* ── Sanduíches ── */
  "Sanduíche de pão integral":                       { emoji: "🥪", kcal: 200, porcao: "1 unidade", p: "sanduiche" },
  "Sanduíche de frango desfiado":                    { emoji: "🥪", kcal: 280, porcao: "1 unidade", p: "sanduiche" },
  "Sanduíche de peito de peru":                      { emoji: "🥪", kcal: 250, porcao: "1 unidade", p: "sanduiche" },
  "Sanduíche natural de frango":                     { emoji: "🥪", kcal: 270, porcao: "1 unidade", p: "sanduiche" },
  "Sanduíche de pão integral com frango desfiado":   { emoji: "🥪", kcal: 290, porcao: "1 unidade", p: "sanduiche" },
  "Sanduíche de pão integral com queijo minas":      { emoji: "🥪", kcal: 260, porcao: "1 unidade", p: "sanduiche" },

  /* ── Sopas ── */
  "Sopa de legumes com frango":        { emoji: "🍲", kcal: 230, porcao: "1 prato fundo", p: "sopa" },
  "Sopa de legumes com carne desfiada":{ emoji: "🍲", kcal: 250, porcao: "1 prato fundo", p: "sopa" },

  /* ── Bebidas quentes e temperos ── */
  "Café sem açúcar":             { emoji: "☕", kcal: 5,  porcao: "1 xícara", p: "cafe" },
  "Chá sem açúcar":              { emoji: "🍵", kcal: 2,  porcao: "1 xícara", p: "cha" },
  "Canela":                      { emoji: "🍂", kcal: 6,  porcao: "1 pitada", p: "canela" },

  /* ── Doces (porções controladas) ── */
  "Chocolate 70% cacau (pequena porção)":   { emoji: "🍫", kcal: 90, porcao: "20g", p: "chocolate" },
  "Chocolate 70% cacau em pequena porção":  { emoji: "🍫", kcal: 90, porcao: "20g", p: "chocolate" },
};

/* Resolve a explicação "por que comer" para o objetivo informado. */
function WELLNESS_PORQUE_TEXTO(chaveFamilia, objetivo) {
  const fam = WELLNESS_PORQUE[chaveFamilia] || WELLNESS_PORQUE_PADRAO;
  return fam[objetivo] || fam["melhorar-alimentacao"] || Object.values(fam)[0];
}

/* Devolve sempre um objeto válido para qualquer item (com fallback),
   já com `porque` resolvido para o objetivo (padrão: melhorar-alimentacao). */
function WELLNESS_ALIMENTO(nome, objetivo) {
  const obj = objetivo || "melhorar-alimentacao";
  const chave = (nome || '').trim();
  const item = WELLNESS_ALIMENTOS[chave];
  if (item) {
    return {
      nome: chave, emoji: item.emoji, kcal: item.kcal, porcao: item.porcao,
      porque: WELLNESS_PORQUE_TEXTO(item.p, obj),
    };
  }
  /* Fallback: item não catalogado */
  return {
    nome: chave, emoji: "🍽️", kcal: 90, porcao: "1 porção",
    porque: WELLNESS_PORQUE_TEXTO(null, obj),
  };
}

if (typeof window !== 'undefined') {
  window.WELLNESS_ALIMENTOS = WELLNESS_ALIMENTOS;
  window.WELLNESS_PORQUE    = WELLNESS_PORQUE;
  window.WELLNESS_ALIMENTO  = WELLNESS_ALIMENTO;
}
