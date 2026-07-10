/* ============================================================
   WELLNESS — data-regras.js
   Regras do fluxo adaptativo: estrutura de blocos, contagem de 40,
   limiares de pontuação, desempate, cobertura de dimensões e segurança.

   Fonte de verdade: wellness_project/questionnaire/flow-rules.json
                     wellness_project/questionnaire/scoring-rules.json
                     wellness_project/questionnaire/safety-rules.json
   ============================================================ */

window.WELLNESS_REGRAS = {

  /* Total obrigatório de perguntas por usuário (spec §2 e §17.1). */
  total_perguntas: 40,

  /* As perguntas essenciais (idade, sexo, altura, peso, objetivo) formam o
     Bloco 1 (perguntas 1–5) e são respondidas na tela perguntas-essenciais.
     O motor adaptativo apresenta as perguntas 6 a 40. */
  perguntas_essenciais: 5,

  /* Estrutura de 8 blocos de 5 perguntas (spec §5).
     `fonte` indica de onde o motor tira as perguntas do bloco:
       'essenciais'    → já respondidas na tela anterior (bloco 1)
       'compartilhado' → banco.compartilhadas (todos respondem)
       'objetivo'      → banco.objetivos[goal] (ramifica por objetivo)
       'categoria'     → banco.categorias[cat] (ramifica pela categoria líder)
       'personalizacao'→ banco.personalizacao (todos respondem) */
  blocos: [
    { n: 1, de: 1,  ate: 5,  fonte: "essenciais",     funcao: "perfil físico, objetivo e segurança inicial" },
    { n: 2, de: 6,  ate: 10, fonte: "compartilhado",  funcao: "alimentação atual e rotina básica" },
    { n: 3, de: 11, ate: 15, fonte: "compartilhado",  funcao: "estado mental e emocional" },
    { n: 4, de: 16, ate: 20, fonte: "compartilhado",  funcao: "relação entre emoções e alimentação" },
    { n: 5, de: 21, ate: 25, fonte: "objetivo",       funcao: "classificação da categoria principal" },
    { n: 6, de: 26, ate: 30, fonte: "objetivo",       funcao: "desempate e confirmação da categoria" },
    { n: 7, de: 31, ate: 35, fonte: "categoria",      funcao: "classificação da subcategoria" },
    { n: 8, de: 36, ate: 40, fonte: "personalizacao", funcao: "intensidade, preferências e personalização" },
  ],

  /* Marcos em que uma mensagem motivacional é exibida (spec §6). */
  marcos_mensagem: [5, 10, 15, 20, 25, 30, 35, 40],

  /* Momentos de classificação: após qual pergunta o motor decide. */
  classificacao: {
    categoria_apos:    30,  // fim do bloco 6
    subcategoria_apos: 35,  // fim do bloco 7
  },

  /* Limiares de confiança da categoria (spec §10.2). */
  limiares: {
    categoria_provavel:      8,
    categoria_confirmada:    12,
    diferenca_minima:        4,   // diferença p/ a 2ª colocada
    evidencias_independentes: 3,  // nº mínimo de perguntas que pontuaram
  },

  /* Regra de empate (spec §10.3): se a diferença entre as duas líderes for
     menor que `diferenca_minima`, o bloco 6 prioriza perguntas de desempate.
     Persistindo o empate ao classificar, vence a de maior pontuação e, em
     igualdade absoluta, a primeira definida na ordem do objetivo. */
  empate: {
    aciona_desempate_se_diferenca_menor_que: 4,
    criterio_final: "maior_pontuacao_depois_primeira_definida",
  },

  /* Cobertura mínima por dimensão ao final das 40 perguntas (spec §5.1).
     Usada para validação/teste; o desenho fixo dos blocos já garante estes
     mínimos (ver tests/question-count-tests). */
  dimensoes_minimas: {
    perfil_objetivo:        5,
    alimentacao_atual:      7,
    estado_emocional:       7,
    conexao_mente_comida:   8,
    rotina_sono_atividade:  4,
    categoria_desempate:    5,
    subcategoria_personal:  4,
  },

  /* Configuração de segurança (spec §15). Cada resposta pode ativar um flag.
     Se qualquer flag for ativado, o resultado exibe a mensagem de segurança
     e NÃO prescreve dieta restritiva nem apresenta diagnóstico. */
  seguranca: {
    flags_conhecidas: [
      "desmaios_restricao",
      "vomito_provocado",
      "laxantes_compensacao",
      "jejum_prolongado_intencional",
      "perda_controle_sofrimento",
      "variacao_peso_inexplicada",
      "medo_extremo_de_comer",
      "sofrimento_imagem_corporal",
      "risco_emocional",
    ],
    // flags consideradas de urgência: podem antecipar a mensagem de segurança
    urgentes: ["risco_emocional", "vomito_provocado", "laxantes_compensacao"],
  },

  /* Escolha de dieta (1 ou 2) dentro da subcategoria confirmada.
     Cada subcategoria define uma `dieta_regra` em data-subcategorias.js.
     Empate → dieta1 (padrão). */
  dieta: {
    empate_favorece: "dieta1",
  },
};
