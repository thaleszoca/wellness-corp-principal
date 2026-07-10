/* ============================================================
   WELLNESS — dados.js
   Estrutura completa do fluxo adaptativo de perguntas.

   Baseado na Documentação Oficial da Wellness.

   Hierarquia:
     Objetivo
       └─ Categoria Principal (classificada pela TRIAGEM do objetivo)
            └─ Subcategoria Final (classificada pelas perguntas da categoria)
                 └─ Dieta 1 / Dieta 2 (escolhida pelas perguntas da subcategoria)

   ── Tipos de pergunta ──
     'sim-nao'  → opções Sim / Não          (valores: 'sim' | 'nao')
     'escala'   → nota 0 a 10 (slider)       (valor numérico)
     'opcoes'   → múltipla escolha           (valor = value da opção)

   ── Critérios de classificação (motor de pontuação) ──
     Cada categoria / subcategoria / dieta possui uma lista `criterios`.
     Cada critério: { pergunta: '<id>', valor: <esperado> }
        - sim-nao : 'sim' | 'nao'
        - escala  : { min: n, max: n }
        - opcoes  : 'valor'  ou  ['valor1','valor2']  (qualquer um satisfaz)
     O sistema conta quantos critérios são satisfeitos.
     Vence quem tiver a MAIOR pontuação (empate → a primeira definida).

   ── Compatibilidade de dieta ──
     Cada dieta tem `compat` mapeando as perguntas da subcategoria (q1..q4)
     para 'sim' | 'nao' | 'ambos'. Respostas "Sim ou Não" viram 'ambos'
     (não pontuam, pois não diferenciam). Vence a dieta com mais acertos.
   ============================================================ */

const WELLNESS_DADOS = {

  /* ══════════════════════════════════════════════════════════
     OBJETIVO 1 — GANHAR MASSA MUSCULAR
  ══════════════════════════════════════════════════════════ */
  "ganhar-massa": {
    nome: "Ganhar Massa Muscular",

    /* Perguntas essenciais do objetivo → definem a categoria principal */
    triagem: [
      {
        id: "gm_dificuldade",
        texto: "Você tem dificuldade em ganhar massa muscular?",
        dica: "Mesmo se alimentando, sente que não evolui.",
        tipo: "sim-nao",
      },
      {
        id: "gm_flexibilidade",
        texto: "Você tem flexibilidade alimentar?",
        dica: "Consegue variar os alimentos do dia a dia com facilidade.",
        tipo: "sim-nao",
      },
      {
        id: "gm_culpa",
        texto: "Você se sente culpado após alguma refeição?",
        tipo: "sim-nao",
      },
      {
        id: "gm_atividade",
        texto: "Você costuma praticar atividade física? Com qual frequência?",
        tipo: "opcoes",
        opcoes: [
          { value: "nenhuma", label: "Nenhuma" },
          { value: "baixa",   label: "Baixa (1 a 2x por semana)" },
          { value: "media",   label: "Moderada (3 a 5x por semana)" },
          { value: "alta",    label: "Alta (mais de 5x por semana)" },
        ],
      },
      {
        id: "gm_ansiedade",
        texto: "De 0 a 10, o quanto você se considera ansioso?",
        tipo: "escala",
      },
    ],

    categorias: {

      /* ────────── MAGRO ANSIOSO ────────── */
      "magro-ansioso": {
        nome: "Magro Ansioso",
        criterios: [
          { pergunta: "gm_dificuldade", valor: "sim" },
          { pergunta: "gm_culpa",       valor: "sim" },
          { pergunta: "gm_ansiedade",   valor: { min: 7, max: 10 } },
        ],
        perguntas: [
          {
            id: "ma_q1",
            texto: "Quando está muito ansioso, você sente desconfortos digestivos (queimação, estufamento, “nó no estômago”) que te impedem de comer?",
            tipo: "sim-nao",
          },
          {
            id: "ma_q2",
            texto: "Você se considera uma pessoa que não consegue ficar parada (balança as pernas, mexe muito as mãos, em constante movimento)?",
            tipo: "sim-nao",
          },
          {
            id: "ma_q3",
            texto: "Sobre as refeições, o que mais acontece com você?",
            tipo: "opcoes",
            opcoes: [
              { value: "planeja", label: "Planejo o que vou comer com antecedência" },
              { value: "esquece", label: "Só lembro de comer quando já estou com fraqueza ou dor de cabeça" },
            ],
          },
          {
            id: "ma_q4",
            texto: "Você tem dificuldade para dormir por estar com a mente acelerada e acaba sentindo fome súbita no meio da noite?",
            tipo: "sim-nao",
          },
          {
            id: "ma_q5",
            texto: "Mesmo tentando relaxar, sua mente continua acelerada e isso atrapalha seu descanso ao longo do dia?",
            tipo: "sim-nao",
          },
        ],
        subcategorias: {

          "ansiedade-digestiva": {
            nome: "Ansiedade Digestiva",
            criterios: [
              { pergunta: "ma_q1", valor: "sim" },
              { pergunta: "ma_q4", valor: "sim" },
              { pergunta: "ma_q3", valor: "esquece" },
            ],
            perguntas: [
              { id: "ad_q1", texto: "Você sente que seu apetite desaparece completamente em períodos de muito estresse ou preocupação?", tipo: "sim-nao" },
              { id: "ad_q2", texto: "Durante momentos de ansiedade, você sente desconfortos intestinais que dificultam terminar refeições completas?", tipo: "sim-nao" },
              { id: "ad_q3", texto: "Você percebe que passa várias horas sem comer porque está concentrado em problemas ou tarefas?", tipo: "sim-nao" },
              { id: "ad_q4", texto: "Em períodos emocionalmente difíceis, seu peso costuma diminuir sem que você tente emagrecer?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Ansiedade Digestiva com perda de apetite em períodos de estresse",
                compat: { ad_q1: "sim", ad_q2: "sim", ad_q3: "ambos", ad_q4: "sim" },
                objetivo: "Esse usuário perde o apetite em períodos de estresse, sente desconfortos digestivos e pode apresentar queda de peso sem intenção. A dieta prioriza refeições menores, mais frequentes, de boa densidade calórica e com preparações de fácil aceitação, reduzindo o desconforto gastrointestinal e favorecendo o ganho gradual de massa muscular.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte integral", "Banana", "Aveia", "Pasta de amendoim"] },
                  { nome: "Lanche", itens: ["Vitamina de leite integral com mamão", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Peito de frango grelhado", "Abobrinha cozida", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Tapioca com queijo minas", "Suco natural"] },
                  { nome: "Jantar", itens: ["Purê de batata", "Carne moída magra", "Cenoura cozida"] },
                  { nome: "Ceia", itens: ["Leite integral", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Ansiedade Digestiva com esquecimento alimentar e baixa regularidade",
                compat: { ad_q1: "ambos", ad_q2: "sim", ad_q3: "sim", ad_q4: "ambos" },
                objetivo: "Esse usuário passa muitas horas sem comer por estar concentrado em tarefas, preocupações ou problemas, e só percebe a necessidade de se alimentar quando já apresenta fraqueza ou desconforto. A dieta busca organizar horários fixos, utilizar refeições práticas e garantir oferta constante de energia e proteínas ao longo do dia.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Pão integral", "Mamão", "Leite integral"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Filé de frango", "Legumes cozidos", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de frango desfiado", "Banana"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne bovina magra", "Salada simples"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia", "Pasta de amendoim"] },
                ],
              },
            },
          },

          "hiperatividade-mental": {
            nome: "Hiperatividade Mental",
            criterios: [
              { pergunta: "ma_q2", valor: "sim" },
              { pergunta: "ma_q5", valor: "sim" },
            ],
            perguntas: [
              { id: "hm_q1", texto: "Você sente necessidade constante de estar fazendo alguma coisa, mesmo em momentos de descanso?", tipo: "sim-nao" },
              { id: "hm_q2", texto: "Sua mente permanece ativa mesmo quando você está tentando relaxar ou dormir?", tipo: "sim-nao" },
              { id: "hm_q3", texto: "Você sente dificuldade em permanecer concentrado em uma única tarefa por muito tempo?", tipo: "sim-nao" },
              { id: "hm_q4", texto: "Você percebe que gasta muita energia mental ao longo do dia e termina o dia exausto?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Hiperatividade Mental com alto gasto energético",
                compat: { hm_q1: "sim", hm_q2: "sim", hm_q3: "ambos", hm_q4: "sim" },
                objetivo: "Esse usuário está sempre em movimento, gasta muita energia durante o dia e chega ao fim do dia mentalmente exausto. Apesar de comer, seu gasto energético elevado dificulta o ganho de massa. A dieta busca manter um fornecimento constante de energia ao longo do dia, reduzindo períodos de baixa disponibilidade energética.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["3 ovos mexidos", "2 fatias de pão integral", "Banana", "Leite integral"] },
                  { nome: "Lanche", itens: ["Iogurte integral", "Mix de castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Legumes", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de frango desfiado", "Suco natural"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne moída", "Salada"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia", "Pasta de amendoim"] },
                ],
              },
              dieta2: {
                titulo: "Hiperatividade Mental com dificuldade de concentração",
                compat: { hm_q1: "ambos", hm_q2: "sim", hm_q3: "sim", hm_q4: "nao" },
                objetivo: "Nesse perfil, o maior desafio é manter uma alimentação consistente diante da dificuldade de concentração e organização da rotina. A dieta prioriza refeições simples, práticas e fáceis de preparar, favorecendo a regularidade alimentar necessária para estimular o ganho de massa muscular.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Tapioca com queijo minas", "Mamão"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Carne bovina magra", "Salada"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peito de frango", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── FALSO MAGRO ────────── */
      "falso-magro": {
        nome: "Falso Magro",
        criterios: [
          { pergunta: "gm_dificuldade", valor: "sim" },
          { pergunta: "gm_atividade",   valor: ["nenhuma", "baixa"] },
        ],
        perguntas: [
          { id: "fm_q1", texto: "Você apresenta baixa massa muscular aparente, acompanhada de acúmulo de gordura em regiões específicas (abdômen, flancos ou peitoral)?", tipo: "sim-nao" },
          {
            id: "fm_q2",
            texto: "Como você classifica seu tônus muscular atual?",
            tipo: "opcoes",
            opcoes: [
              { value: "flacidez", label: "Sinto flacidez, mesmo com peso baixo ou na média" },
              { value: "firme",    label: "Musculatura firme" },
            ],
          },
          { id: "fm_q3", texto: "Seu peso oscila com frequência devido à retenção hídrica (inchaço abdominal) ao longo do dia?", tipo: "sim-nao" },
          { id: "fm_q4", texto: "Em tentativas de reduzir gordura, você perdeu mais volume muscular e ganhou flacidez, em vez de melhorar a definição?", tipo: "sim-nao" },
          {
            id: "fm_q5",
            texto: "Qual sua frequência semanal de ultraprocessados, gorduras saturadas ou açúcares refinados (frituras, doces, fast food)?",
            tipo: "opcoes",
            opcoes: [
              { value: "baixa", label: "Baixa (raramente)" },
              { value: "media", label: "Moderada" },
              { value: "alta",  label: "Alta (quase todos os dias)" },
            ],
          },
        ],
        subcategorias: {

          "metabolicamente-descondicionado": {
            nome: "Metabolicamente Descondicionado",
            criterios: [
              { pergunta: "fm_q1", valor: "sim" },
              { pergunta: "fm_q3", valor: "sim" },
              { pergunta: "fm_q5", valor: "alta" },
            ],
            perguntas: [
              { id: "md_q1", texto: "Você sente cansaço frequente mesmo realizando atividades simples do dia a dia?", tipo: "sim-nao" },
              { id: "md_q2", texto: "Após refeições muito grandes você sente sonolência intensa?", tipo: "sim-nao" },
              { id: "md_q3", texto: "Seu abdômen costuma permanecer inchado durante boa parte do dia?", tipo: "sim-nao" },
              { id: "md_q4", texto: "Você percebe dificuldade em melhorar sua composição corporal mesmo tentando comer melhor?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Metabolicamente Descondicionado com baixa disposição e inchaço frequente",
                compat: { md_q1: "sim", md_q2: "ambos", md_q3: "sim", md_q4: "sim" },
                objetivo: "Esse usuário apresenta sinais de baixa eficiência metabólica, como cansaço frequente, inchaço abdominal e dificuldade para melhorar a composição corporal mesmo tentando se alimentar melhor. A dieta busca reduzir o consumo de alimentos ultraprocessados, melhorar a qualidade nutricional das refeições e favorecer o ganho de massa muscular sem aumentar o acúmulo de gordura corporal.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Pão integral", "Mamão", "Café sem açúcar"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Brócolis", "Cenoura", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Maçã", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Salada variada"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Metabolicamente Descondicionado com sonolência pós-refeição",
                compat: { md_q1: "ambos", md_q2: "sim", md_q3: "nao", md_q4: "sim" },
                objetivo: "Esse usuário apresenta dificuldade em melhorar sua composição corporal e costuma sentir sonolência após refeições volumosas, indicando necessidade de uma melhor distribuição alimentar ao longo do dia. A dieta prioriza refeições menores, equilibradas e ricas em proteínas, mantendo níveis de energia mais constantes e favorecendo o ganho de massa muscular de forma gradual.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Banana"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Abobrinha", "Salada"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral", "Queijo minas", "Peito de peru"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne moída magra", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },

          "baixa-massa-muscular": {
            nome: "Baixa Massa Muscular",
            criterios: [
              { pergunta: "fm_q2", valor: "flacidez" },
              { pergunta: "fm_q4", valor: "sim" },
              { pergunta: "fm_q1", valor: "sim" },
            ],
            perguntas: [
              { id: "bm_q1", texto: "Você sente dificuldade em realizar tarefas que exigem força física?", tipo: "sim-nao" },
              { id: "bm_q2", texto: "Mesmo com ganho de peso, você percebe que a aparência continua pouco definida?", tipo: "sim-nao" },
              { id: "bm_q3", texto: "Você já tentou musculação e teve pouca evolução na força?", tipo: "sim-nao" },
              { id: "bm_q4", texto: "Você sente que sua musculatura é pouco desenvolvida em relação ao restante do corpo?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Baixa Massa Muscular com deficiência de força e desenvolvimento muscular",
                compat: { bm_q1: "sim", bm_q2: "ambos", bm_q3: "sim", bm_q4: "sim" },
                objetivo: "Esse usuário apresenta baixa massa muscular, pouca evolução na força e dificuldade em desenvolver musculatura mesmo praticando exercícios. A dieta prioriza um elevado aporte de proteínas distribuídas ao longo do dia e carboidratos de qualidade para favorecer a recuperação muscular, estimular a hipertrofia e melhorar o desempenho físico.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (4 ovos)", "2 fatias de pão integral", "Banana", "Leite integral"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Brócolis", "Cenoura", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral", "Queijo minas", "Peito de peru"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia", "Pasta de amendoim"] },
                ],
              },
              dieta2: {
                titulo: "Baixa Massa Muscular com pouca definição corporal",
                compat: { bm_q1: "ambos", bm_q2: "sim", bm_q3: "nao", bm_q4: "sim" },
                objetivo: "Esse usuário consegue realizar atividades do dia a dia normalmente, porém apresenta pouca definição muscular mesmo quando ganha peso. O foco da dieta é estimular o crescimento de massa magra de forma gradual, garantindo uma ingestão equilibrada de proteínas, carboidratos complexos e gorduras saudáveis para favorecer uma melhor composição corporal.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com queijo minas e 3 ovos mexidos", "Mamão", "Leite integral"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango grelhado", "Salada variada", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne moída magra", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia", "Castanhas"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── ECTOMORFO ────────── */
      "ectomorfo": {
        nome: "Ectomorfo",
        criterios: [
          { pergunta: "gm_dificuldade", valor: "sim" },
          { pergunta: "gm_atividade",   valor: "media" },
          { pergunta: "gm_ansiedade",   valor: { min: 0, max: 6 } },
        ],
        perguntas: [
          { id: "ec_q1", texto: "Você tem uma estrutura física com membros longos, articulações finas e baixo percentual de massa e gordura?", tipo: "sim-nao" },
          { id: "ec_q2", texto: "Você tem resistência ao ganho de peso e hipertrofia, mesmo mantendo treino de força constante?", tipo: "sim-nao" },
          { id: "ec_q3", texto: "Sua rotina tem alta demanda de movimento ou atividades não planejadas que elevam seu gasto energético?", tipo: "sim-nao" },
          { id: "ec_q4", texto: "Você mantém adesão rigorosa a todos os horários de refeição, evitando períodos prolongados de jejum?", tipo: "sim-nao" },
          { id: "ec_q5", texto: "Você sente dificuldade em atingir a meta calórica diária devido ao volume de comida?", tipo: "sim-nao" },
          { id: "ec_q6", texto: "A ingestão de proteínas de alto valor está distribuída de forma equilibrada em todas as suas refeições?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "alto-gasto-energetico": {
            nome: "Alto Gasto Energético",
            criterios: [
              { pergunta: "ec_q3", valor: "sim" },
              { pergunta: "ec_q2", valor: "sim" },
              { pergunta: "ec_q1", valor: "sim" },
            ],
            perguntas: [
              { id: "ag_q1", texto: "Você costuma caminhar muito ou permanecer em movimento durante o dia sem perceber?", tipo: "sim-nao" },
              { id: "ag_q2", texto: "Você sente fome várias vezes ao dia mesmo após refeições completas?", tipo: "sim-nao" },
              { id: "ag_q3", texto: "Seu peso cai rapidamente quando reduz um pouco a alimentação?", tipo: "sim-nao" },
              { id: "ag_q4", texto: "Você tem dificuldade em ficar parado por longos períodos?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Alto Gasto Energético com grande consumo calórico diário",
                compat: { ag_q1: "sim", ag_q2: "sim", ag_q3: "ambos", ag_q4: "sim" },
                objetivo: "Esse usuário possui um gasto energético naturalmente elevado, permanecendo em constante movimento durante o dia. Mesmo consumindo boas quantidades de alimento, tem dificuldade para manter o peso e ganhar massa muscular. A dieta busca aumentar significativamente a ingestão calórica por meio de refeições frequentes e alimentos energeticamente densos.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (4 ovos)", "3 fatias de pão integral", "Banana", "Vitamina de leite integral com aveia"] },
                  { nome: "Lanche", itens: ["Mix de castanhas", "Iogurte integral"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Batata-doce", "Legumes", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de frango desfiado", "Suco natural"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne bovina magra", "Salada"] },
                  { nome: "Ceia", itens: ["Leite integral", "Aveia", "Pasta de amendoim"] },
                ],
              },
              dieta2: {
                titulo: "Alto Gasto Energético com dificuldade para manter o peso",
                compat: { ag_q1: "sim", ag_q2: "nao", ag_q3: "sim", ag_q4: "ambos" },
                objetivo: "Esse usuário não sente tanta fome ao longo do dia, porém perde peso facilmente quando reduz a alimentação ou aumenta sua rotina de atividades. A dieta prioriza refeições completas e consistentes, aumentando gradualmente o aporte energético para evitar perda de peso e favorecer o ganho de massa muscular.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão", "Leite integral"] },
                  { nome: "Lanche", itens: ["Banana", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Carne bovina magra", "Legumes", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peito de frango grelhado", "Brócolis"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia"] },
                ],
              },
            },
          },

          "baixa-ingestao-calorica": {
            nome: "Baixa Ingestão Calórica",
            criterios: [
              { pergunta: "ec_q5", valor: "sim" },
              { pergunta: "ec_q4", valor: "nao" },
              { pergunta: "ec_q2", valor: "sim" },
            ],
            perguntas: [
              { id: "bi_q1", texto: "Você sente que se sacia rapidamente durante as refeições?", tipo: "sim-nao" },
              { id: "bi_q2", texto: "Você costuma deixar refeições incompletas por falta de apetite?", tipo: "sim-nao" },
              { id: "bi_q3", texto: "Você acredita que come bastante, mas quando observa percebe que suas porções são pequenas?", tipo: "sim-nao" },
              { id: "bi_q4", texto: "Você frequentemente esquece de realizar refeições planejadas?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Baixa Ingestão Calórica com saciedade precoce",
                compat: { bi_q1: "sim", bi_q2: "sim", bi_q3: "sim", bi_q4: "ambos" },
                objetivo: "Esse usuário acredita que se alimenta bem, porém consome poucas calorias devido à saciedade precoce e ao baixo volume alimentar. A dieta utiliza refeições menores, porém mais calóricas, facilitando o aumento da ingestão energética sem causar desconforto durante as refeições.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Vitamina de leite integral", "Banana", "Aveia", "Pasta de amendoim"] },
                  { nome: "Lanche", itens: ["Iogurte integral", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Purê de batata", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche natural de frango"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne moída", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Leite integral", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Baixa Ingestão Calórica por rotina desorganizada",
                compat: { bi_q1: "nao", bi_q2: "ambos", bi_q3: "sim", bi_q4: "sim" },
                objetivo: "Esse usuário apresenta baixa ingestão calórica principalmente por esquecer refeições ou manter uma rotina alimentar desorganizada. A dieta busca estabelecer horários fixos, refeições práticas e boa distribuição de proteínas e carboidratos ao longo do dia, favorecendo o ganho de massa muscular de forma consistente.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Filé de frango", "Salada", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── APETITE SELETIVO ────────── */
      "apetite-seletivo": {
        nome: "Apetite Seletivo",
        criterios: [
          { pergunta: "gm_dificuldade",  valor: "sim" },
          { pergunta: "gm_flexibilidade", valor: "nao" },
          { pergunta: "gm_culpa",         valor: "nao" },
        ],
        perguntas: [
          {
            id: "as_q1",
            texto: "No dia a dia, você come sempre as mesmas opções ou consegue variar o que coloca no prato?",
            tipo: "opcoes",
            opcoes: [
              { value: "mesmas", label: "Sempre as mesmas 4 ou 5 opções" },
              { value: "varia",  label: "Consigo variar bastante" },
            ],
          },
          { id: "as_q2", texto: "Você sente resistência ou aflição ao provar alimentos que nunca comeu antes?", tipo: "sim-nao" },
          {
            id: "as_q3",
            texto: "Qual destes grupos você tem maior dificuldade em aceitar?",
            tipo: "opcoes",
            opcoes: [
              { value: "vegetais",  label: "Vegetais" },
              { value: "proteinas", label: "Proteínas" },
              { value: "frutas",    label: "Frutas" },
            ],
          },
          { id: "as_q4", texto: "De 0 a 10, o quanto você está disposto a tentar novas formas de preparo de alimentos que hoje não gosta?", tipo: "escala" },
          { id: "as_q5", texto: "A textura dos alimentos (muito mole, crocante ou fibroso) é o principal motivo para você rejeitar uma comida?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "sensibilidade-sensorial": {
            nome: "Sensibilidade Sensorial",
            criterios: [
              { pergunta: "as_q5", valor: "sim" },
              { pergunta: "as_q2", valor: "sim" },
              { pergunta: "as_q1", valor: "mesmas" },
            ],
            perguntas: [
              { id: "ss_q1", texto: "Certas texturas causam desconforto imediato ao experimentar um alimento?", tipo: "sim-nao" },
              { id: "ss_q2", texto: "Você rejeita alimentos mais pela textura do que pelo sabor?", tipo: "sim-nao" },
              { id: "ss_q3", texto: "Misturar diferentes alimentos no mesmo prato gera incômodo para você?", tipo: "sim-nao" },
              { id: "ss_q4", texto: "Você costuma separar ingredientes durante as refeições?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Sensibilidade Sensorial com forte rejeição à textura",
                compat: { ss_q1: "sim", ss_q2: "sim", ss_q3: "ambos", ss_q4: "sim" },
                objetivo: "Esse usuário apresenta forte sensibilidade às texturas dos alimentos, o que limita sua variedade alimentar e dificulta o consumo adequado de nutrientes para o ganho de massa muscular. A dieta prioriza alimentos de textura previsível, preparações simples e refeições que reduzam estímulos sensoriais desagradáveis, mantendo boa ingestão calórica e proteica.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Banana", "Aveia"] },
                  { nome: "Lanche", itens: ["Queijo minas", "Torradas integrais"] },
                  { nome: "Almoço", itens: ["Arroz branco", "Filé de frango grelhado", "Purê de batata"] },
                  { nome: "Lanche", itens: ["Sanduíche de peito de peru", "Suco natural"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne moída"] },
                  { nome: "Ceia", itens: ["Leite integral", "Banana"] },
                ],
              },
              dieta2: {
                titulo: "Sensibilidade Sensorial com seletividade moderada",
                compat: { ss_q1: "sim", ss_q2: "ambos", ss_q3: "nao", ss_q4: "nao" },
                objetivo: "Esse usuário apresenta seletividade alimentar moderada, conseguindo consumir alguns alimentos variados desde que mantenham texturas confortáveis. A dieta busca ampliar gradualmente a variedade alimentar sem gerar desconforto, favorecendo o ganho de massa muscular de forma equilibrada.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Peito de frango", "Cenoura cozida"] },
                  { nome: "Lanche", itens: ["Tapioca com queijo minas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },

          "resistencia-novidade": {
            nome: "Resistência à Novidade Alimentar",
            criterios: [
              { pergunta: "as_q2", valor: "sim" },
              { pergunta: "as_q4", valor: { min: 0, max: 4 } },
              { pergunta: "as_q1", valor: "mesmas" },
            ],
            perguntas: [
              { id: "rn_q1", texto: "Você evita experimentar novos alimentos por medo de não gostar?", tipo: "sim-nao" },
              { id: "rn_q2", texto: "Quando conhece um alimento novo, prefere não arriscar prová-lo?", tipo: "sim-nao" },
              { id: "rn_q3", texto: "Você sente desconforto apenas ao pensar em determinados alimentos desconhecidos?", tipo: "sim-nao" },
              { id: "rn_q4", texto: "Sua alimentação atual é muito parecida com a que tinha na infância?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Resistência à Novidade com forte resistência a experimentar novos alimentos",
                compat: { rn_q1: "sim", rn_q2: "sim", rn_q3: "sim", rn_q4: "ambos" },
                objetivo: "Esse usuário apresenta grande resistência em experimentar novos alimentos, mantendo uma alimentação muito limitada e repetitiva. A dieta utiliza alimentos já familiares ao usuário, garantindo um bom aporte nutricional para o ganho de massa muscular sem exigir mudanças bruscas na rotina alimentar.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Leite integral", "Pão integral com queijo minas", "Banana"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango grelhado"] },
                  { nome: "Lanche", itens: ["Sanduíche de peito de peru"] },
                  { nome: "Jantar", itens: ["Macarrão", "Carne moída"] },
                  { nome: "Ceia", itens: ["Leite integral", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Resistência à Novidade com abertura gradual para novos alimentos",
                compat: { rn_q1: "sim", rn_q2: "nao", rn_q3: "nao", rn_q4: "sim" },
                objetivo: "Esse usuário ainda demonstra resistência à introdução de novos alimentos, porém aceita experimentar quando se sente seguro ou quando os alimentos são apresentados de forma gradual. A dieta mantém alimentos familiares como base, incorporando pequenas variações para ampliar o repertório alimentar sem comprometer a adesão ao plano.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (3 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Filé de frango", "Cenoura cozida", "Brócolis"] },
                  { nome: "Lanche", itens: ["Tapioca com queijo minas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Salada"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },
    },
  },

  /* ══════════════════════════════════════════════════════════
     OBJETIVO 2 — EMAGRECER
  ══════════════════════════════════════════════════════════ */
  "emagrecer": {
    nome: "Emagrecer",

    triagem: [
      { id: "em_estado", texto: "De 0 a 10, qual o seu nível de ansiedade / carga emocional relacionada à comida?", tipo: "escala" },
      {
        id: "em_desejo",
        texto: "Qual comportamento mais representa você diante da comida?",
        tipo: "opcoes",
        opcoes: [
          { value: "sem_fome",     label: "Vontade de comer mesmo sem fome física" },
          { value: "doces",        label: "Preferência por doces, massas ou fast food" },
          { value: "equilibrado",  label: "Costumo comer de forma equilibrada" },
        ],
      },
      {
        id: "em_atividade",
        texto: "Qual a sua frequência semanal de atividade física?",
        tipo: "opcoes",
        opcoes: [
          { value: "0-1", label: "0 a 1 vez por semana" },
          { value: "2-3", label: "2 a 3 vezes por semana" },
          { value: "4+",  label: "4 ou mais vezes por semana" },
        ],
      },
      {
        id: "em_metabolismo",
        texto: "Como você percebe o seu metabolismo hoje?",
        tipo: "opcoes",
        opcoes: [
          { value: "lento",        label: "Sinto que é lento" },
          { value: "normal",       label: "Parece normal" },
          { value: "nao_responde", label: "Não responde como antes, após muitas dietas" },
        ],
      },
      { id: "em_restritivas", texto: "Você já fez dietas muito restritivas e sofreu com efeito sanfona (recuperou o peso)?", tipo: "sim-nao" },
      { id: "em_preocupacao", texto: "Você sente muita preocupação ou medo de engordar associado à ansiedade?", tipo: "sim-nao" },
    ],

    categorias: {

      /* ────────── PSICOLÓGICO / COMPULSIVO ────────── */
      "psicologico-compulsivo": {
        nome: "Psicológico / Compulsivo",
        criterios: [
          { pergunta: "em_estado",      valor: { min: 8, max: 10 } },
          { pergunta: "em_desejo",      valor: "sem_fome" },
          { pergunta: "em_preocupacao", valor: "sim" },
        ],
        perguntas: [
          { id: "pc_q1", texto: "Você passa boa parte do dia pensando na próxima refeição, usando o planejamento da comida para aliviar a ansiedade atual?", tipo: "sim-nao" },
          { id: "pc_q2", texto: "Em momentos de crise, você perde o controle sobre as quantidades e só para de comer quando se sente fisicamente muito cheio?", tipo: "sim-nao" },
          { id: "pc_q3", texto: "Sua ansiedade aumenta à noite, gerando vontade incontrolável de beliscar mesmo após o jantar?", tipo: "sim-nao" },
          { id: "pc_q4", texto: "Você come muito rápido, mal sentindo o sabor, quase como se estivesse “engolindo” as emoções?", tipo: "sim-nao" },
          { id: "pc_q5", texto: "Ao final de um dia estressante, você sente que “merece” comer algo bem calórico para relaxar?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "beliscador-noturno": {
            nome: "Beliscador Noturno Hipervigilante",
            criterios: [
              { pergunta: "pc_q1", valor: "sim" },
              { pergunta: "pc_q3", valor: "sim" },
            ],
            perguntas: [
              { id: "bn_q1", texto: "Você costuma despertar de madrugada com pensamentos obsessivos direcionados a consumir sobras de comida?", tipo: "sim-nao" },
              { id: "bn_q2", texto: "Se não houver uma guloseima específica estocada em casa à noite, você experimenta irritabilidade ou frustração?", tipo: "sim-nao" },
              { id: "bn_q3", texto: "Você sente necessidade incontrolável de revisitar os armários da cozinha, mesmo já deitado para dormir?", tipo: "sim-nao" },
              { id: "bn_q4", texto: "O hábito de beliscar após o jantar ocorre no piloto automático enquanto assiste TV ou mexe no celular?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Beliscador Noturno com ansiedade noturna intensa",
                compat: { bn_q1: "sim", bn_q2: "sim", bn_q3: "sim", bn_q4: "ambos" },
                objetivo: "Esse usuário apresenta forte inquietação noturna em relação à comida, podendo despertar ou permanecer hipervigilante com pensamentos sobre alimentos específicos. A dieta busca aumentar a saciedade no fim do dia, reduzir longos intervalos sem comer e organizar uma ceia planejada para diminuir beliscos impulsivos.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Chia"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada variada", "Legumes cozidos"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peixe grelhado", "Brócolis", "Salada"] },
                  { nome: "Ceia", itens: ["Iogurte natural", "Aveia", "Canela"] },
                ],
              },
              dieta2: {
                titulo: "Beliscador Noturno com belisco automático após o jantar",
                compat: { bn_q1: "ambos", bn_q2: "ambos", bn_q3: "sim", bn_q4: "sim" },
                objetivo: "Esse usuário belisca principalmente no piloto automático, muitas vezes associado a televisão, celular ou descanso após o jantar. A dieta organiza refeições completas e inclui uma opção noturna planejada, evitando que o consumo aconteça de forma desestruturada e sem percepção de quantidade.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Carne bovina magra", "Salada colorida"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral com frango desfiado"] },
                  { nome: "Jantar", itens: ["Sopa de legumes com frango", "Torrada integral"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },

          "comedor-impulsivo": {
            nome: "Comedor Impulsivo por Crises Agudas",
            criterios: [
              { pergunta: "pc_q2", valor: "sim" },
              { pergunta: "pc_q4", valor: "sim" },
            ],
            perguntas: [
              { id: "ci_q1", texto: "Você tenta ocultar embalagens e caixas vazias para que outras pessoas não descubram a dimensão do consumo?", tipo: "sim-nao" },
              { id: "ci_q2", texto: "Você experimenta uma profunda ressaca moral e prostração física imediatamente após o episódio?", tipo: "sim-nao" },
              { id: "ci_q3", texto: "Durante a crise, você mistura sabores contrastantes (doce com salgado) em alta velocidade apenas pela urgência do ato?", tipo: "sim-nao" },
              { id: "ci_q4", texto: "Seus episódios agudos ocorrem imediatamente após discussões, críticas profissionais ou notícias muito estressantes?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Comedor Impulsivo com perda de controle após gatilhos emocionais",
                compat: { ci_q1: "sim", ci_q2: "sim", ci_q3: "ambos", ci_q4: "sim" },
                objetivo: "Esse usuário apresenta episódios de compulsão ou descontrole alimentar após gatilhos emocionais claros. A dieta prioriza refeições regulares, boa saciedade e distribuição de proteínas e fibras para reduzir vulnerabilidade a crises, sem utilizar restrição agressiva que possa aumentar o ciclo de culpa.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Frango grelhado", "Salada variada", "Legumes"] },
                  { nome: "Lanche", itens: ["Banana", "Aveia"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Comedor Impulsivo com consumo rápido e mistura de sabores",
                compat: { ci_q1: "ambos", ci_q2: "sim", ci_q3: "sim", ci_q4: "ambos" },
                objetivo: "Esse usuário apresenta ingestão acelerada e busca por estímulo sensorial intenso durante os episódios de crise. A dieta utiliza refeições estruturadas e lanches planejados com sabor agradável, reduzindo a necessidade de buscar combinações altamente palatáveis em momentos de urgência emocional.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Salada", "Abobrinha"] },
                  { nome: "Lanche", itens: ["Fruta", "Chocolate 70% cacau em pequena porção"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne moída magra", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar", "Iogurte natural"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── SEDENTÁRIO COM METABOLISMO LENTO ────────── */
      "sedentario-metabolismo-lento": {
        nome: "Sedentário com Metabolismo Lento",
        criterios: [
          { pergunta: "em_atividade",   valor: "0-1" },
          { pergunta: "em_metabolismo", valor: "lento" },
        ],
        perguntas: [
          {
            id: "sm_q1",
            texto: "Qual o seu padrão predominante de consumo alimentar?",
            tipo: "opcoes",
            opcoes: [
              { value: "estruturado", label: "Refeições estruturadas em horários fixos" },
              { value: "belisco",     label: "Belisco alimentos de forma assistemática ao longo do dia" },
            ],
          },
          { id: "sm_q2", texto: "Nos últimos três meses você realizou ao menos 150 minutos semanais de atividade física moderada ou intensa?", tipo: "sim-nao" },
          {
            id: "sm_q3",
            texto: "Durante o trabalho ou estudo, quanto tempo você permanece em repouso (sentado/deitado) sem interrupções?",
            tipo: "opcoes",
            opcoes: [
              { value: "pouco",  label: "Pouco — me movimento com frequência" },
              { value: "medio",  label: "Algumas horas" },
              { value: "muito",  label: "Muitas horas seguidas" },
            ],
          },
          {
            id: "sm_q4",
            texto: "Com que frequência você opta por fast food ou ultraprocessados por praticidade ou falta de planejamento?",
            tipo: "opcoes",
            opcoes: [
              { value: "raro",   label: "Raramente" },
              { value: "as_vezes", label: "Às vezes" },
              { value: "sempre", label: "Quase sempre" },
            ],
          },
          { id: "sm_q5", texto: "Você mantém ingestão de água superior a 2 litros por dia e consegue distinguir sede da vontade de comer?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "desidratado-fome-invertida": {
            nome: "Desidratado com Fome Invertida",
            criterios: [
              { pergunta: "sm_q5", valor: "nao" },
              { pergunta: "sm_q1", valor: "belisco" },
            ],
            perguntas: [
              { id: "df_q1", texto: "A coloração da sua urina se mantém em tons de amarelo escuro na maior parte do dia?", tipo: "sim-nao" },
              { id: "df_q2", texto: "Você já notou que a suposta urgência por comida diminui consideravelmente após ingerir um copo grande de água?", tipo: "sim-nao" },
              { id: "df_q3", texto: "Costuma ter dores de cabeça ou boca seca no meio da tarde e confunde isso com fome?", tipo: "sim-nao" },
              { id: "df_q4", texto: "Você consome grandes volumes de café, chás adoçados ou refrigerantes para substituir a água pura?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Desidratado com Fome Invertida com baixa ingestão de água",
                compat: { df_q1: "sim", df_q2: "sim", df_q3: "sim", df_q4: "ambos" },
                objetivo: "Esse usuário interpreta sinais de sede como fome e tende a beliscar ao longo do dia. A dieta prioriza hidratação planejada, refeições com boa presença de frutas, legumes e fibras, além de lanches simples para diferenciar fome física de sede.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Melão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Morangos"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Frango grelhado", "Salada com pepino e tomate", "Abobrinha cozida"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Jantar", itens: ["Peixe grelhado", "Batata-doce", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar", "Iogurte natural"] },
                ],
              },
              dieta2: {
                titulo: "Desidratado com Fome Invertida com uso excessivo de bebidas substitutas",
                compat: { df_q1: "ambos", df_q2: "sim", df_q3: "ambos", df_q4: "sim" },
                objetivo: "Esse usuário substitui água por café, chás adoçados, refrigerantes ou outras bebidas, mantendo sede mascarada e maior vontade de beliscar. A dieta organiza a troca gradual por água e refeições estruturadas, reduzindo calorias líquidas e melhorando saciedade.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão"] },
                  { nome: "Lanche", itens: ["Banana", "Aveia"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Salada variada", "Cenoura cozida"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Chia"] },
                  { nome: "Jantar", itens: ["Sopa de legumes com carne desfiada", "Torrada integral"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
            },
          },

          "inativo-de-cadeira": {
            nome: "Inativo de Cadeira (Imobilidade Ocupacional)",
            criterios: [
              { pergunta: "sm_q3", valor: "muito" },
              { pergunta: "sm_q2", valor: "nao" },
            ],
            perguntas: [
              { id: "ic_q1", texto: "O esgotamento mental do trabalho faz você se sentir fisicamente incapaz de treinar ao fim do expediente?", tipo: "sim-nao" },
              { id: "ic_q2", texto: "Toda a sua logística de deslocamento é feita por veículos, eliminando pequenas caminhadas cotidianas?", tipo: "sim-nao" },
              { id: "ic_q3", texto: "Você tem dores articulares (joelhos, lombar) que servem de desestímulo inicial para começar exercícios?", tipo: "sim-nao" },
              { id: "ic_q4", texto: "Sua rotina faz você passar mais de 6 horas contínuas sentado sem pausas para caminhar?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Inativo de Cadeira com rotina sentada prolongada",
                compat: { ic_q1: "ambos", ic_q2: "sim", ic_q3: "ambos", ic_q4: "sim" },
                objetivo: "Esse usuário passa muitas horas sentado e tem baixo gasto energético diário. A dieta cria déficit calórico moderado, com alto volume de vegetais, proteínas magras e carboidratos bem distribuídos, evitando restrições extremas e favorecendo emagrecimento sustentável mesmo com rotina pouco ativa.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada grande", "Legumes cozidos"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Jantar", itens: ["Peixe grelhado", "Purê de abóbora", "Brócolis"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar"] },
                ],
              },
              dieta2: {
                titulo: "Inativo de Cadeira com cansaço mental e baixa disposição para treino",
                compat: { ic_q1: "sim", ic_q2: "ambos", ic_q3: "sim", ic_q4: "ambos" },
                objetivo: "Esse usuário sente esgotamento mental e dificuldade em iniciar exercícios, especialmente após o expediente. A dieta prioriza refeições leves, práticas e estáveis em energia, reduzindo picos de sonolência e facilitando a adesão a pequenas mudanças de rotina.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Ovo cozido", "Fruta"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Carne bovina magra", "Salada variada", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral com queijo minas"] },
                  { nome: "Jantar", itens: ["Frango desfiado", "Batata-doce", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── RESTRITIVO (EFEITO SANFONA) ────────── */
      "restritivo-efeito-sanfona": {
        nome: "Restritivo (Efeito Sanfona)",
        criterios: [
          { pergunta: "em_restritivas",  valor: "sim" },
          { pergunta: "em_metabolismo",  valor: "nao_responde" },
        ],
        perguntas: [
          { id: "re_q1", texto: "Você já aderiu a protocolos de extrema baixa caloria ou que exigiram exclusão total de grupos alimentares (cortar totalmente carboidratos ou gorduras)?", tipo: "sim-nao" },
          {
            id: "re_q2",
            texto: "Após terminar um processo de emagrecimento, em quanto tempo costuma começar a recuperar o peso perdido?",
            tipo: "opcoes",
            opcoes: [
              { value: "rapido", label: "Muito rápido (poucas semanas)" },
              { value: "medio",  label: "Alguns meses" },
              { value: "mantem", label: "Costumo manter o peso" },
            ],
          },
          { id: "re_q3", texto: "Durante dietas, a fome e o desejo por alimentos “proibidos” ficavam persistentes a ponto de comprometer seu humor e suas atividades?", tipo: "sim-nao" },
          { id: "re_q4", texto: "Ao finalizar ou interromper uma dieta, você tem episódios de perda de controle com consumo excessivo em curto período?", tipo: "sim-nao" },
          { id: "re_q5", texto: "No seu histórico de efeito sanfona, o peso recuperado costumou ser superior ao que você tinha antes de iniciar a dieta?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "fobico-carboidratos": {
            nome: "Fóbico de Carboidratos Crônico",
            criterios: [
              { pergunta: "re_q1", valor: "sim" },
              { pergunta: "re_q3", valor: "sim" },
            ],
            perguntas: [
              { id: "fc_q1", texto: "Você pula refeições principais na tentativa de economizar calorias a qualquer custo?", tipo: "sim-nao" },
              { id: "fc_q2", texto: "Seu desejo por massas ou doces explode de forma incontrolável após poucos dias de restrição total?", tipo: "sim-nao" },
              { id: "fc_q3", texto: "Suas tentativas de cortar carboidratos geram fraqueza, tonturas e irritabilidade extrema nos primeiros dias?", tipo: "sim-nao" },
              { id: "fc_q4", texto: "Você sente medo paralisante de ingerir fontes saudáveis de carboidrato (arroz, batata), associando-as a ganho imediato de gordura?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Fóbico de Carboidratos com restrição intensa",
                compat: { fc_q1: "sim", fc_q2: "sim", fc_q3: "sim", fc_q4: "sim" },
                objetivo: "Esse usuário evita carboidratos de forma rígida e acaba entrando em ciclos de fome, fraqueza e perda de controle. A dieta reintroduz carboidratos de forma planejada, em porções moderadas, combinados com proteínas e fibras para reduzir medo, melhorar energia e permitir emagrecimento sem restrição extrema.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Chia"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Frango grelhado", "Salada variada", "Legumes"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peixe grelhado", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Fóbico de Carboidratos com medo de fontes saudáveis",
                compat: { fc_q1: "ambos", fc_q2: "sim", fc_q3: "ambos", fc_q4: "sim" },
                objetivo: "Esse usuário associa qualquer fonte de carboidrato ao ganho de gordura, mesmo alimentos básicos e saudáveis. A dieta utiliza carboidratos familiares, porções controladas e refeições equilibradas para reconstruir confiança alimentar e evitar compulsões por restrição acumulada.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Morangos"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Carne bovina magra", "Salada", "Abobrinha"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Frango desfiado", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar"] },
                ],
              },
            },
          },

          "cicatriz-metabolica": {
            nome: "Cicatriz Metabólica / Efeito Rebote Agudo",
            criterios: [
              { pergunta: "re_q5", valor: "sim" },
              { pergunta: "re_q4", valor: "sim" },
            ],
            perguntas: [
              { id: "cm_q1", texto: "Você costuma investir em fórmulas, chás milagrosos ou “desafios detox” agressivos buscando resultado em curto prazo?", tipo: "sim-nao" },
              { id: "cm_q2", texto: "Sente que seu metabolismo está mais lento a cada tentativa, exigindo passar mais fome para perder o mesmo peso?", tipo: "sim-nao" },
              { id: "cm_q3", texto: "Quando interrompe um plano, você entra em um ciclo de adiar o reinício para a “próxima segunda-feira”?", tipo: "sim-nao" },
              { id: "cm_q4", texto: "Seu peso costuma oscilar mais de 4 a 5 quilos em 30 dias entre o “foco total” e a “desistência”?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Cicatriz Metabólica com histórico de dietas agressivas",
                compat: { cm_q1: "sim", cm_q2: "sim", cm_q3: "ambos", cm_q4: "sim" },
                objetivo: "Esse usuário passou por ciclos repetidos de dietas rígidas e recuperação de peso. A dieta evita cortes extremos, estabelece déficit moderado e prioriza consistência, saciedade e manutenção de massa magra para reduzir o risco de novo efeito rebote.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango", "Salada grande", "Legumes cozidos"] },
                  { nome: "Lanche", itens: ["Banana", "Aveia"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Batata-doce", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Cicatriz Metabólica com oscilação entre foco total e desistência",
                compat: { cm_q1: "ambos", cm_q2: "sim", cm_q3: "sim", cm_q4: "sim" },
                objetivo: "Esse usuário alterna períodos de controle rígido com abandono completo do plano, recuperando peso rapidamente. A dieta busca estabilidade, refeições simples e flexíveis, reduzindo a mentalidade de recomeço perfeito e favorecendo continuidade mesmo após pequenos desvios.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Ovo cozido", "Fruta"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada variada"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral com queijo minas"] },
                  { nome: "Jantar", itens: ["Peixe grelhado", "Purê de abóbora", "Legumes"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── PALADAR INFANTIL / VICIADO EM PROCESSADOS ────────── */
      "paladar-infantil": {
        nome: "Paladar Infantil / Viciado em Processados",
        criterios: [
          { pergunta: "em_desejo", valor: "doces" },
        ],
        perguntas: [
          { id: "pi_q1", texto: "Você tem resistência ou aversão a hortaliças (verduras e legumes) por sabor amargo ou texturas específicas?", tipo: "sim-nao" },
          { id: "pi_q2", texto: "Você tem dificuldade persistente em experimentar novos grupos alimentares, mantendo um repertório restrito e familiar?", tipo: "sim-nao" },
          {
            id: "pi_q3",
            texto: "Com que frequência você substitui refeições completas por embutidos, salgadinhos ou produtos prontos?",
            tipo: "opcoes",
            opcoes: [
              { value: "raro",   label: "Raramente" },
              { value: "as_vezes", label: "Às vezes" },
              { value: "sempre", label: "Com muita frequência" },
            ],
          },
          { id: "pi_q4", texto: "Você sente que alimentos naturais (frutas e vegetais) têm sabor pouco atrativo ou “insosso” perto dos industrializados?", tipo: "sim-nao" },
          { id: "pi_q5", texto: "Você sente necessidade compulsiva de comer açúcar ou gordura (doces ou frituras) para se sentir satisfeito, mesmo sem fome física?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "dependente-hiperpalataveis": {
            nome: "Dependente Químico de Hiperpalatáveis",
            criterios: [
              { pergunta: "pi_q5", valor: "sim" },
              { pergunta: "pi_q4", valor: "sim" },
            ],
            perguntas: [
              { id: "dh_q1", texto: "Você sente uma fissura física por um doce concentrado imediatamente após terminar de almoçar?", tipo: "sim-nao" },
              { id: "dh_q2", texto: "Você consome sucos em pó artificiais ou refrigerantes (mesmo versões zero) em praticamente todas as refeições?", tipo: "sim-nao" },
              { id: "dh_q3", texto: "Comidas preparadas só com temperos naturais (alho, cebola, ervas) parecem sem graça ao seu paladar?", tipo: "sim-nao" },
              { id: "dh_q4", texto: "Você precisa adicionar açúcar, adoçantes ou condimentos industrializados em excesso para tolerar frutas e cafés?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Dependente de Hiperpalatáveis com fissura por açúcar e gordura",
                compat: { dh_q1: "sim", dh_q2: "ambos", dh_q3: "sim", dh_q4: "sim" },
                objetivo: "Esse usuário busca sabores muito intensos para sentir satisfação e pode apresentar fissura por doces ou alimentos gordurosos. A dieta reduz gradualmente a exposição a hiperpalatáveis, mantendo refeições saborosas, temperos naturais e pequenas estratégias de transição para preservar adesão.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Banana", "Aveia", "Canela"] },
                  { nome: "Lanche", itens: ["Maçã", "Pasta de amendoim"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Frango grelhado com ervas", "Salada colorida", "Legumes assados"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Chocolate 70% cacau em pequena porção"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Batata-doce", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Dependente de Hiperpalatáveis com bebidas e condimentos industrializados",
                compat: { dh_q1: "ambos", dh_q2: "sim", dh_q3: "ambos", dh_q4: "sim" },
                objetivo: "Esse usuário depende de bebidas adoçadas, versões zero, adoçantes ou condimentos industrializados para aceitar o sabor dos alimentos. A dieta propõe substituições graduais e mantém refeições simples, com temperos naturais e alimentos de maior saciedade para diminuir a necessidade de estímulo artificial constante.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Morangos"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Peito de frango temperado com alho, cebola e ervas", "Salada", "Cenoura cozida"] },
                  { nome: "Lanche", itens: ["Banana", "Castanhas"] },
                  { nome: "Jantar", itens: ["Sopa de legumes com carne desfiada", "Torrada integral"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar"] },
                ],
              },
            },
          },

          "seletivo-industrial": {
            nome: "Seletivo Industrial Monótono",
            criterios: [
              { pergunta: "pi_q2", valor: "sim" },
              { pergunta: "pi_q1", valor: "sim" },
            ],
            perguntas: [
              { id: "si_q1", texto: "O ambiente familiar e a rotina onde você vive seguem esse mesmo padrão de ausência de vegetais e abundância de carboidratos e pacotes?", tipo: "sim-nao" },
              { id: "si_q2", texto: "Você consome marcas muito específicas de ultraprocessados por se sentir seguro de que o sabor não terá surpresas?", tipo: "sim-nao" },
              { id: "si_q3", texto: "Seus lanches intermediários são compostos quase integralmente por embutidos, salgadinhos de pacote ou congelados?", tipo: "sim-nao" },
              { id: "si_q4", texto: "O aspecto, formato ou textura de um vegetal cozido gera náusea visual imediata a ponto de fazer você descartar o prato?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Seletivo Industrial com rejeição intensa a vegetais",
                compat: { si_q1: "sim", si_q2: "ambos", si_q3: "sim", si_q4: "sim" },
                objetivo: "Esse usuário rejeita vegetais pela aparência, textura ou sabor, mantendo alimentação repetitiva e pobre em variedade. A dieta utiliza introduções graduais, preparações de textura previsível e alimentos familiares para melhorar qualidade nutricional sem provocar ruptura brusca na adesão.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Pão integral com queijo minas", "Iogurte natural", "Banana"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango grelhado", "Purê de abóbora"] },
                  { nome: "Lanche", itens: ["Sanduíche de frango desfiado"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne moída magra", "Cenoura bem cozida"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Seletivo Industrial com dependência de alimentos de sabor previsível",
                compat: { si_q1: "ambos", si_q2: "sim", si_q3: "sim", si_q4: "ambos" },
                objetivo: "Esse usuário prefere marcas, produtos e sabores previsíveis, evitando alimentos naturais por medo de variações sensoriais. A dieta mantém uma base familiar, substitui ultraprocessados por alternativas mais simples e introduz pequenas variações controladas para ampliar o repertório alimentar.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango", "Batata inglesa", "Cenoura cozida"] },
                  { nome: "Lanche", itens: ["Tapioca com queijo minas"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Purê de batata", "Legumes bem cozidos"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },
    },
  },

  /* ══════════════════════════════════════════════════════════
     OBJETIVO 3 — MELHORAR RELAÇÃO COM A COMIDA
  ══════════════════════════════════════════════════════════ */
  "melhorar-alimentacao": {
    nome: "Melhorar Relação com a Comida",

    triagem: [
      { id: "mr_culpa",     texto: "Você sente arrependimento, vergonha ou culpa logo após comer alimentos que considera “não saudáveis” ou “proibidos”?", tipo: "sim-nao" },
      { id: "mr_rigida",    texto: "Você classifica os alimentos de forma rígida entre “bons vs. ruins” ou “permitidos vs. proibidos”, sentindo que a dieta é uma regra inquebrável?", tipo: "sim-nao" },
      { id: "mr_saciedade", texto: "Você consegue identificar e respeitar os sinais de saciedade (parar quando está satisfeito)?", tipo: "sim-nao" },
      { id: "mr_balanca",   texto: "Seu humor e a autopercepção do seu dia são diretamente influenciados pelo número na balança ou pelo que vê no espelho?", tipo: "sim-nao" },
      { id: "mr_emocional",  texto: "Você usa a comida como principal mecanismo para lidar com emoções difíceis (tédio, solidão, raiva, estresse)?", tipo: "sim-nao" },
    ],

    categorias: {

      /* ────────── TERRORISTA NUTRICIONAL ────────── */
      "terrorista-nutricional": {
        nome: "Terrorista Nutricional",
        criterios: [
          { pergunta: "mr_rigida", valor: "sim" },
          { pergunta: "mr_culpa",  valor: "sim" },
        ],
        perguntas: [
          { id: "tn_q1", texto: "Você sente necessidade de analisar minuciosamente todos os rótulos, sentindo ansiedade se encontra algo que não considera “puro” ou “limpo”?", tipo: "sim-nao" },
          { id: "tn_q2", texto: "Após comer algo fora do planejamento, você sente culpa intensa, fracasso ou necessidade de compensação física imediata?", tipo: "sim-nao" },
          { id: "tn_q3", texto: "Você sente ansiedade ou evita situações sociais por medo de não ter controle total sobre os ingredientes servidos?", tipo: "sim-nao" },
          { id: "tn_q4", texto: "Sua escolha alimentar é baseada prioritariamente no medo de aditivos e substâncias químicas, mesmo sem condição clínica diagnosticada?", tipo: "sim-nao" },
          { id: "tn_q5", texto: "Ao “errar” na dieta, você adota práticas punitivas, como jejuns prolongados ou exercícios excessivos para “anular” o que comeu?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "ortorexia-funcional": {
            nome: "Ortorexia Funcional",
            criterios: [
              { pergunta: "tn_q1", valor: "sim" },
              { pergunta: "tn_q3", valor: "sim" },
              { pergunta: "tn_q4", valor: "sim" },
            ],
            perguntas: [
              { id: "of_q1", texto: "Você sente desconforto ao consumir alimentos preparados por outras pessoas por não saber os ingredientes utilizados?", tipo: "sim-nao" },
              { id: "of_q2", texto: "Você passa muito tempo pesquisando sobre alimentação saudável, ingredientes ou possíveis riscos alimentares?", tipo: "sim-nao" },
              { id: "of_q3", texto: "Você já deixou de participar de eventos sociais para evitar consumir alimentos fora dos seus padrões?", tipo: "sim-nao" },
              { id: "of_q4", texto: "Quando segue suas regras alimentares perfeitamente, você sente superioridade ou controle sobre sua saúde?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Ortorexia Funcional com rigidez alimentar intensa",
                compat: { of_q1: "sim", of_q2: "sim", of_q3: "sim", of_q4: "ambos" },
                objetivo: "Esse usuário apresenta uma relação excessivamente rígida com a alimentação, evitando alimentos preparados por outras pessoas e restringindo situações sociais por medo de consumir algo fora de seus padrões. A dieta busca manter uma alimentação equilibrada, reduzindo gradualmente as restrições desnecessárias e incentivando maior flexibilidade, sempre preservando a sensação de segurança do usuário.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Aveia", "Banana"] },
                  { nome: "Lanche", itens: ["Mix de castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Legumes variados", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Frutas da estação", "Queijo minas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Filé de peixe", "Salada variada"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Ortorexia Funcional com preocupação moderada sobre qualidade alimentar",
                compat: { of_q1: "ambos", of_q2: "sim", of_q3: "nao", of_q4: "sim" },
                objetivo: "Esse usuário valoriza muito a qualidade da alimentação, porém ainda consegue manter alguma flexibilidade em situações específicas. A dieta busca reforçar hábitos saudáveis sem estimular comportamentos excessivamente restritivos, mostrando que uma alimentação equilibrada também permite adaptações ocasionais.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada colorida"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Batata inglesa", "Brócolis"] },
                  { nome: "Ceia", itens: ["Iogurte natural"] },
                ],
              },
            },
          },

          "compensador-punitivo": {
            nome: "Compensador Punitivo",
            criterios: [
              { pergunta: "tn_q2", valor: "sim" },
              { pergunta: "tn_q5", valor: "sim" },
            ],
            perguntas: [
              { id: "cp_q1", texto: "Após comer algo fora do planejado, você sente necessidade imediata de reduzir calorias na próxima refeição?", tipo: "sim-nao" },
              { id: "cp_q2", texto: "Você acredita que precisa “merecer” certos alimentos por meio de exercícios físicos?", tipo: "sim-nao" },
              { id: "cp_q3", texto: "Quando sai da dieta, sente que o dia inteiro foi perdido e continua fazendo escolhas piores?", tipo: "sim-nao" },
              { id: "cp_q4", texto: "Você costuma associar seu valor pessoal à sua capacidade de seguir regras alimentares?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Compensador Punitivo com comportamento compensatório frequente",
                compat: { cp_q1: "sim", cp_q2: "sim", cp_q3: "sim", cp_q4: "ambos" },
                objetivo: "Esse usuário apresenta um padrão de compensação após comer alimentos considerados “fora da dieta”, alternando períodos de restrição com episódios de culpa. A dieta busca eliminar comportamentos compensatórios, promovendo refeições equilibradas e consistentes ao longo do dia para reduzir o ciclo de culpa e punição.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada"] },
                  { nome: "Lanche", itens: ["Castanhas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne magra", "Legumes"] },
                  { nome: "Ceia", itens: ["Leite"] },
                ],
              },
              dieta2: {
                titulo: "Compensador Punitivo com mentalidade de “tudo ou nada”",
                compat: { cp_q1: "sim", cp_q2: "nao", cp_q3: "sim", cp_q4: "sim" },
                objetivo: "Esse usuário interpreta pequenos desvios alimentares como fracassos completos, abandonando o planejamento após um único episódio. A dieta enfatiza regularidade, equilíbrio e flexibilidade, mostrando que uma refeição isolada não compromete o progresso e que o foco deve permanecer na constância dos hábitos.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos"] },
                  { nome: "Lanche", itens: ["Banana"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Frango", "Legumes"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne bovina magra", "Salada"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── DESCONECTADO / COMEDOR DISTRAÍDO ────────── */
      "desconectado-distraido": {
        nome: "Desconectado / Comedor Distraído",
        criterios: [
          { pergunta: "mr_saciedade", valor: "nao" },
        ],
        perguntas: [
          { id: "dd_q1", texto: "Você usa dispositivos eletrônicos (celular, TV, computador) de forma sistemática durante as refeições, desviando o foco do ato de comer?", tipo: "sim-nao" },
          { id: "dd_q2", texto: "Após uma refeição, você tem dificuldade em recordar as quantidades ou os sabores, sentindo que tudo ocorreu de forma automática?", tipo: "sim-nao" },
          { id: "dd_q3", texto: "Você come em velocidade acelerada, com poucas pausas, o que impede perceber texturas e nuances do alimento?", tipo: "sim-nao" },
          { id: "dd_q4", texto: "Com que frequência você termina a refeição com sensação de “vazio” psicológico, gerando busca imediata por sobremesa?", tipo: "sim-nao" },
          { id: "dd_q5", texto: "Você para de comer pelos sinais de saciedade ou sente necessidade de comer todo o prato independentemente de estar satisfeito?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "alimentacao-automatica": {
            nome: "Alimentação Automática",
            criterios: [
              { pergunta: "dd_q1", valor: "sim" },
              { pergunta: "dd_q2", valor: "sim" },
              { pergunta: "dd_q3", valor: "sim" },
            ],
            perguntas: [
              { id: "aa_q1", texto: "Você costuma terminar uma refeição sem lembrar exatamente do sabor ou da quantidade que comeu?", tipo: "sim-nao" },
              { id: "aa_q2", texto: "Você frequentemente come enquanto mexe no celular, trabalha ou assiste televisão?", tipo: "sim-nao" },
              { id: "aa_q3", texto: "Você percebe que começa a comer sem realmente sentir fome?", tipo: "sim-nao" },
              { id: "aa_q4", texto: "Você só percebe que exagerou quando a refeição já terminou?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Alimentação Automática com refeições distraídas",
                compat: { aa_q1: "sim", aa_q2: "sim", aa_q3: "ambos", aa_q4: "sim" },
                objetivo: "Esse usuário costuma realizar as refeições no “piloto automático”, com pouca atenção ao ato de comer. A dieta busca estimular uma alimentação consciente, reduzindo distrações durante as refeições e favorecendo uma melhor percepção da fome, da saciedade e da satisfação alimentar.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada variada"] },
                  { nome: "Lanche", itens: ["Banana"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Legumes"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Alimentação Automática por rotina acelerada",
                compat: { aa_q1: "nao", aa_q2: "sim", aa_q3: "sim", aa_q4: "ambos" },
                objetivo: "Esse usuário possui uma rotina corrida e acaba realizando as refeições sem atenção, priorizando velocidade em vez da experiência alimentar. A dieta incentiva horários organizados, refeições completas e momentos exclusivos para alimentação, favorecendo uma relação mais consciente com a comida.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Legumes"] },
                  { nome: "Lanche", itens: ["Maçã"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne moída magra", "Salada"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },

          "desconexao-corporal": {
            nome: "Desconexão Corporal",
            criterios: [
              { pergunta: "dd_q4", valor: "sim" },
              { pergunta: "dd_q5", valor: "sim" },
            ],
            perguntas: [
              { id: "dc_q1", texto: "Você sente dificuldade para identificar quando realmente está com fome?", tipo: "sim-nao" },
              { id: "dc_q2", texto: "Você costuma perceber que está satisfeito apenas quando já comeu além do necessário?", tipo: "sim-nao" },
              { id: "dc_q3", texto: "Você sente dificuldade para diferenciar fome física de vontade emocional de comer?", tipo: "sim-nao" },
              { id: "dc_q4", texto: "Você costuma ignorar sinais do seu corpo relacionados à alimentação durante o dia?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Desconexão Corporal com baixa percepção dos sinais de fome",
                compat: { dc_q1: "sim", dc_q2: "sim", dc_q3: "ambos", dc_q4: "sim" },
                objetivo: "Esse usuário apresenta dificuldade para reconhecer os próprios sinais fisiológicos relacionados à alimentação. A dieta busca reconstruir essa percepção através de horários consistentes, refeições equilibradas e incentivo à atenção plena durante a alimentação, favorecendo uma relação mais saudável com o próprio corpo.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Filé de frango", "Salada", "Legumes"] },
                  { nome: "Lanche", itens: ["Castanhas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Desconexão Corporal com dificuldade em reconhecer a saciedade",
                compat: { dc_q1: "ambos", dc_q2: "sim", dc_q3: "sim", dc_q4: "sim" },
                objetivo: "Esse usuário costuma ultrapassar os próprios limites de saciedade por não perceber adequadamente os sinais enviados pelo corpo. A dieta prioriza refeições balanceadas, com boa distribuição de fibras, proteínas e líquidos, favorecendo uma percepção gradual da saciedade e reduzindo episódios de excesso alimentar.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada variada"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Peixe grelhado", "Batata-doce", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── OBCECADO PELA ESTÉTICA / BALANÇA ────────── */
      "obcecado-estetica": {
        nome: "Obcecado pela Estética / Balança",
        criterios: [
          { pergunta: "mr_balanca", valor: "sim" },
        ],
        perguntas: [
          { id: "oe_q1", texto: "Mesmo com peso e medidas dentro da normalidade, você mantém insatisfação persistente com sua imagem corporal?", tipo: "sim-nao" },
          { id: "oe_q2", texto: "Você usa padrões estéticos externos (redes sociais, corpos de terceiros) como métrica principal, desmotivando-se quando não os atinge?", tipo: "sim-nao" },
          { id: "oe_q3", texto: "Você costuma recusar interações sociais por desconforto com a aparência ou receio de perder o controle sobre a alimentação?", tipo: "sim-nao" },
          { id: "oe_q4", texto: "No seu planejamento alimentar, a busca por mudança visual imediata se sobrepõe à saúde metabólica e ao bem-estar?", tipo: "sim-nao" },
          { id: "oe_q5", texto: "Seu valor pessoal e seu humor são influenciados diretamente pelas variações diárias no espelho ou pelo cumprimento de metas estéticas?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "dependente-validacao": {
            nome: "Dependente da Validação Estética",
            criterios: [
              { pergunta: "oe_q2", valor: "sim" },
              { pergunta: "oe_q5", valor: "sim" },
              { pergunta: "oe_q3", valor: "sim" },
            ],
            perguntas: [
              { id: "dv_q1", texto: "Comentários positivos ou negativos sobre sua aparência afetam fortemente seu humor?", tipo: "sim-nao" },
              { id: "dv_q2", texto: "Você compara frequentemente seu corpo com pessoas das redes sociais ou da academia?", tipo: "sim-nao" },
              { id: "dv_q3", texto: "Você sente necessidade constante de aprovação visual dos outros?", tipo: "sim-nao" },
              { id: "dv_q4", texto: "Seu nível de satisfação pessoal depende muito da sua aparência física atual?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Dependente da Validação Estética com alta comparação corporal",
                compat: { dv_q1: "sim", dv_q2: "sim", dv_q3: "sim", dv_q4: "ambos" },
                objetivo: "Esse usuário tem o humor fortemente influenciado por comentários externos e comparações visuais. A dieta busca reduzir oscilações extremas de controle alimentar, mantendo refeições equilibradas, previsíveis e suficientes, sem reforçar punição estética ou restrição como resposta à insegurança corporal.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada variada", "Legumes cozidos"] },
                  { nome: "Lanche", itens: ["Banana", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peixe grelhado", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Dependente da Validação Estética com necessidade constante de aprovação visual",
                compat: { dv_q1: "ambos", dv_q2: "sim", dv_q3: "sim", dv_q4: "sim" },
                objetivo: "Esse usuário associa satisfação pessoal à aparência física atual e à aprovação dos outros. A dieta prioriza constância, flexibilidade e regularidade alimentar, evitando estratégias que aumentem a dependência da balança, do espelho ou de comentários externos para validar o progresso.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Maçã", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Salada colorida", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Sanduíche de pão integral com queijo minas"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Batata inglesa", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Iogurte natural"] },
                ],
              },
            },
          },

          "insatisfacao-cronica": {
            nome: "Insatisfação Corporal Crônica",
            criterios: [
              { pergunta: "oe_q1", valor: "sim" },
              { pergunta: "oe_q4", valor: "sim" },
            ],
            perguntas: [
              { id: "in_q1", texto: "Mesmo atingindo metas físicas, você rapidamente encontra novos defeitos no seu corpo?", tipo: "sim-nao" },
              { id: "in_q2", texto: "Você sente que nunca está satisfeito com sua aparência física?", tipo: "sim-nao" },
              { id: "in_q3", texto: "Pequenas alterações no peso corporal afetam significativamente sua autoestima?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Insatisfação Corporal Crônica com busca constante por novos defeitos",
                compat: { in_q1: "sim", in_q2: "sim", in_q3: "ambos" },
                objetivo: "Esse usuário rapidamente encontra novos defeitos mesmo após atingir metas físicas, o que pode gerar ciclos de restrição, frustração e mudança constante de estratégia. A dieta busca estabilizar a rotina alimentar, manter equilíbrio nutricional e evitar planos extremos motivados por insatisfação momentânea.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Fruta"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Chia"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada variada", "Legumes"] },
                  { nome: "Lanche", itens: ["Banana", "Castanhas"] },
                  { nome: "Jantar", itens: ["Peixe grelhado", "Batata-doce", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Insatisfação Corporal Crônica com autoestima muito sensível ao peso",
                compat: { in_q1: "ambos", in_q2: "sim", in_q3: "sim" },
                objetivo: "Esse usuário tem a autoestima fortemente afetada por pequenas variações no peso corporal ou na aparência. A dieta prioriza refeições consistentes, alimentos de boa saciedade e uma estrutura alimentar que reduza oscilações bruscas, evitando que variações normais do corpo sejam interpretadas como fracasso.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Granola"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada variada", "Azeite de oliva"] },
                  { nome: "Lanche", itens: ["Maçã", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Purê de abóbora", "Legumes cozidos"] },
                  { nome: "Ceia", itens: ["Chá sem açúcar", "Iogurte natural"] },
                ],
              },
            },
          },
        },
      },

      /* ────────── COMEDOR EMOCIONAL DE ALÍVIO ────────── */
      "comedor-emocional": {
        nome: "Comedor Emocional de Alívio",
        criterios: [
          { pergunta: "mr_emocional", valor: "sim" },
          { pergunta: "mr_culpa",     valor: "sim" },
        ],
        perguntas: [
          { id: "ce_q1", texto: "Você usa a comida como recurso frequente para amenizar estados emocionais negativos (ansiedade, estresse, tristeza, solidão)?", tipo: "sim-nao" },
          { id: "ce_q2", texto: "Em instabilidade emocional, sua busca é direcionada exclusivamente a itens específicos (doces ou gorduras), sem interesse por refeições completas?", tipo: "sim-nao" },
          { id: "ce_q3", texto: "Você estabelece uma relação de “gratificação” com a comida, usando-a como recompensa após pressão ou cansaço exaustivo?", tipo: "sim-nao" },
          { id: "ce_q4", texto: "No momento da ingestão motivada pela emoção, você sente uma “anestesia” temporária, livre dos problemas que causaram o desconforto?", tipo: "sim-nao" },
          { id: "ce_q5", texto: "A satisfação imediata é logo substituída por culpa ou arrependimento, gerando percepção de falta de controle?", tipo: "sim-nao" },
        ],
        subcategorias: {

          "alivio-recompensa": {
            nome: "Alívio por Recompensa",
            criterios: [
              { pergunta: "ce_q3", valor: "sim" },
              { pergunta: "ce_q1", valor: "sim" },
              { pergunta: "ce_q5", valor: "sim" },
            ],
            perguntas: [
              { id: "ar_q1", texto: "Você costuma sentir vontade de comer após conquistar algo importante ou passar por um dia muito cansativo?", tipo: "sim-nao" },
              { id: "ar_q2", texto: "Você utiliza alimentos como forma de se presentear com frequência?", tipo: "sim-nao" },
              { id: "ar_q3", texto: "Você percebe que procura doces ou alimentos específicos para melhorar o humor?", tipo: "sim-nao" },
              { id: "ar_q4", texto: "Mesmo sem fome física, você sente necessidade de comer para relaxar?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Alívio por Recompensa com busca frequente por conforto alimentar",
                compat: { ar_q1: "sim", ar_q2: "sim", ar_q3: "sim", ar_q4: "ambos" },
                objetivo: "Esse usuário associa a alimentação a momentos de recompensa e conforto emocional. A dieta busca manter refeições prazerosas e nutritivas, reduzindo a necessidade de utilizar a comida como principal fonte de satisfação emocional, sem gerar sensação de restrição.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Peito de frango grelhado", "Salada variada"] },
                  { nome: "Lanche", itens: ["Banana", "Chocolate 70% cacau (pequena porção)"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Carne bovina magra", "Legumes"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Alívio por Recompensa com episódios ocasionais",
                compat: { ar_q1: "sim", ar_q2: "nao", ar_q3: "ambos", ar_q4: "sim" },
                objetivo: "Esse usuário utiliza a comida como recompensa principalmente em momentos específicos de estresse ou após dias cansativos. A dieta procura manter uma rotina alimentar equilibrada, incorporando alimentos de preferência em pequenas quantidades, reduzindo a sensação de privação e favorecendo uma relação mais saudável com a alimentação.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Iogurte natural", "Granola", "Banana"] },
                  { nome: "Lanche", itens: ["Mix de castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Filé de frango", "Legumes"] },
                  { nome: "Lanche", itens: ["Frutas"] },
                  { nome: "Jantar", itens: ["Macarrão integral", "Carne bovina magra", "Salada"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },

          "fuga-emocional": {
            nome: "Fuga Emocional Alimentar",
            criterios: [
              { pergunta: "ce_q2", valor: "sim" },
              { pergunta: "ce_q4", valor: "sim" },
              { pergunta: "ce_q5", valor: "sim" },
            ],
            perguntas: [
              { id: "fe_q1", texto: "Você percebe que come para evitar lidar com sentimentos como tristeza, ansiedade ou solidão?", tipo: "sim-nao" },
              { id: "fe_q2", texto: "Após episódios de estresse intenso, você sente vontade imediata de comer?", tipo: "sim-nao" },
              { id: "fe_q3", texto: "Você sente culpa depois desses episódios de alimentação emocional?", tipo: "sim-nao" },
              { id: "fe_q4", texto: "Você acredita que a comida ajuda a aliviar emoções difíceis, mesmo que por pouco tempo?", tipo: "sim-nao" },
            ],
            dietas: {
              dieta1: {
                titulo: "Fuga Emocional Alimentar com episódios frequentes",
                compat: { fe_q1: "sim", fe_q2: "sim", fe_q3: "sim", fe_q4: "sim" },
                objetivo: "Esse usuário utiliza a alimentação como estratégia para aliviar emoções negativas, criando um ciclo de desconforto emocional, alimentação impulsiva e culpa. A dieta busca estabelecer uma rotina alimentar previsível, rica em alimentos com boa saciedade e equilíbrio nutricional, reduzindo gatilhos para episódios de alimentação emocional.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Omelete (2 ovos)", "Pão integral", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural"] },
                  { nome: "Almoço", itens: ["Arroz integral", "Feijão", "Filé de frango", "Salada variada"] },
                  { nome: "Lanche", itens: ["Banana", "Castanhas"] },
                  { nome: "Jantar", itens: ["Batata-doce", "Peixe grelhado", "Legumes"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
              dieta2: {
                titulo: "Fuga Emocional Alimentar com episódios moderados",
                compat: { fe_q1: "sim", fe_q2: "ambos", fe_q3: "nao", fe_q4: "sim" },
                objetivo: "Esse usuário apresenta episódios de alimentação emocional, porém ainda consegue manter certo controle sobre sua rotina alimentar. A dieta busca aumentar a regularidade das refeições, melhorar a saciedade e reduzir longos períodos em jejum, diminuindo a probabilidade de recorrer à comida para lidar com emoções difíceis.",
                refeicoes: [
                  { nome: "Café da manhã", itens: ["Tapioca com ovos mexidos", "Mamão"] },
                  { nome: "Lanche", itens: ["Iogurte natural", "Castanhas"] },
                  { nome: "Almoço", itens: ["Arroz", "Feijão", "Frango grelhado", "Salada"] },
                  { nome: "Lanche", itens: ["Maçã", "Pasta de amendoim"] },
                  { nome: "Jantar", itens: ["Carne bovina magra", "Batata-doce", "Brócolis"] },
                  { nome: "Ceia", itens: ["Leite", "Aveia"] },
                ],
              },
            },
          },
        },
      },
    },
  },
};

/* Disponibiliza globalmente (uso sem módulos) */
if (typeof window !== 'undefined') {
  window.WELLNESS_DADOS = WELLNESS_DADOS;
}
