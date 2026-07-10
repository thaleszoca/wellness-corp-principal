# WELLNESS — Especificação da Estrutura do Questionário Adaptativo de 40 Perguntas

## 1. Finalidade deste documento

Este documento define a arquitetura funcional do novo questionário da Wellness.

A Wellness deverá utilizar um banco amplo de perguntas, mas cada usuário responderá **exatamente 40 perguntas válidas**. O caminho será adaptativo: as perguntas seguintes dependerão das respostas anteriores, do objetivo escolhido, das categorias prováveis, das subcategorias prováveis e das informações ainda ausentes.

A proposta central do sistema é:

```text
Compreender fatores emocionais e mentais
↓
Identificar como eles influenciam a alimentação atual
↓
Relacionar esse comportamento às consequências físicas e funcionais
↓
Gerar uma orientação personalizada de bem-estar e alimentação
```

A Wellness não deverá diagnosticar transtornos mentais, alimentares, metabólicos ou clínicos. O sistema identificará **padrões comportamentais e alimentares compatíveis**, apresentando linguagem educativa e recomendando avaliação profissional quando houver sinais de risco.

---

## 2. Regra principal do questionário

```text
Tamanho do banco: variável e expansível
Perguntas apresentadas por usuário: exatamente 40
Perguntas repetidas na mesma sessão: 0
Resultado antes da pergunta 40: proibido
Resultado depois da pergunta 40: obrigatório
```

Usuários diferentes poderão responder conjuntos diferentes de perguntas.

Exemplo:

```text
Usuário A
Objetivo: ganhar massa muscular
Categoria provável: Magro Ansioso
Subcategoria provável: Ansiedade Digestiva
Total respondido: 40
```

```text
Usuário B
Objetivo: emagrecer
Categoria provável: Restritivo
Subcategoria provável: Efeito Rebote
Total respondido: 40
```

Os dois usuários respondem exatamente 40 perguntas, mas percorrem caminhos diferentes.

---

## 3. Princípios de experiência da Wellness

### 3.1 Bem-estar antes de julgamento

As perguntas devem evitar humilhação, culpa, rótulos ofensivos e conclusões precipitadas.

Evitar:

> Você não tem controle quando come?

Preferir:

> Em momentos difíceis, com que frequência você percebe que come além do que pretendia?

### 3.2 Integração entre mente, alimentação e corpo

A maioria das perguntas deverá investigar pelo menos duas dimensões:

- emoção ou pensamento;
- alimentação atual;
- consequência física;
- rotina e contexto;
- capacidade de mudança.

Exemplo:

> Quando você está ansioso, seu apetite costuma diminuir, aumentar ou permanecer semelhante?

Essa pergunta mede estado emocional, resposta alimentar e possível impacto energético.

### 3.3 Linguagem não diagnóstica

O aplicativo não deverá afirmar:

- “você tem compulsão alimentar”;
- “você possui ortorexia”;
- “seu metabolismo está quebrado”;
- “você é dependente químico de comida”.

A interface deverá utilizar frases como:

- “suas respostas indicam um padrão de alimentação impulsiva em momentos de estresse”;
- “há sinais de rigidez alimentar que podem estar afetando seu bem-estar”;
- “seu padrão atual pode estar dificultando a regularidade alimentar”.

Os nomes atuais das categorias poderão ser mantidos internamente, mas os nomes exibidos ao usuário devem ser revisados.

---

## 4. Arquitetura recomendada de arquivos

```text
wellness/
├── README.md
├── CLAUDE.md
├── docs/
│   ├── 01-visao-geral.md
│   ├── 02-regras-do-questionario.md
│   ├── 03-modelo-de-classificacao.md
│   ├── 04-seguranca-e-encaminhamento.md
│   ├── 05-linguagem-e-tom.md
│   └── 06-glossario.md
│
├── questionnaire/
│   ├── questions.json
│   ├── answer-options.json
│   ├── flow-rules.json
│   ├── scoring-rules.json
│   ├── motivational-messages.json
│   └── safety-rules.json
│
├── objectives/
│   ├── ganhar-massa/
│   │   ├── categories.json
│   │   ├── subcategories.json
│   │   └── question-pools.json
│   ├── emagrecer/
│   │   ├── categories.json
│   │   ├── subcategories.json
│   │   └── question-pools.json
│   └── relacao-com-a-comida/
│       ├── categories.json
│       ├── subcategories.json
│       └── question-pools.json
│
├── outcomes/
│   ├── category-results.json
│   ├── subcategory-results.json
│   ├── recommendations.json
│   └── diets.json
│
├── examples/
│   ├── complete-flow-gain-mass.json
│   ├── complete-flow-weight-loss.json
│   └── complete-flow-food-relationship.json
│
└── tests/
    ├── route-tests.json
    ├── tie-tests.json
    ├── safety-tests.json
    ├── question-count-tests.json
    └── expected-results.json
```

### 4.1 Função do `CLAUDE.md`

O arquivo deverá ensinar à IA como trabalhar no projeto, sem armazenar todo o conteúdo do questionário.

Deverá conter regras como:

- não alterar IDs existentes;
- não criar diagnóstico;
- não modificar uma pergunta sem atualizar os testes;
- manter exatamente 40 perguntas por fluxo;
- não separar dietas das subcategorias;
- explicar qualquer nova regra de pontuação;
- preservar a relação mente → alimentação → físico.

### 4.2 Fonte de verdade

A fonte de verdade operacional deverá ser JSON, não texto livre.

O Markdown servirá para documentação humana. Os arquivos JSON controlarão perguntas, pesos, condições, próximas etapas e resultados.

---

## 5. Estrutura das 40 perguntas

O questionário será dividido em oito blocos de cinco perguntas. Após cada bloco, será exibida uma mensagem curta de incentivo.

| Bloco | Perguntas | Função principal |
|---|---:|---|
| 1 | 1–5 | perfil físico, objetivo e segurança inicial |
| 2 | 6–10 | alimentação atual e rotina básica |
| 3 | 11–15 | estado mental e emocional |
| 4 | 16–20 | relação entre emoções e alimentação |
| 5 | 21–25 | classificação da categoria principal |
| 6 | 26–30 | desempate e confirmação da categoria |
| 7 | 31–35 | classificação da subcategoria |
| 8 | 36–40 | intensidade, preferências e personalização final |

Essa é uma estrutura de slots, não uma sequência fixa de textos. O motor escolhe a pergunta mais útil para cada slot.

### 5.1 Regras mínimas por dimensão

Ao final das 40 perguntas, todo usuário deverá ter respondido no mínimo:

| Dimensão | Mínimo |
|---|---:|
| perfil físico e objetivo | 5 |
| alimentação atual | 7 |
| estado emocional e pensamentos | 7 |
| conexão mente–alimentação | 8 |
| rotina, sono e atividade | 4 |
| categoria e desempate | 5 |
| subcategoria e personalização | 4 |

Uma pergunta pode contar para mais de uma dimensão, mas o motor deverá registrar sua função principal e suas funções secundárias.

---

## 6. Mensagens de motivação a cada cinco perguntas

As mensagens aparecerão depois das perguntas 5, 10, 15, 20, 25, 30, 35 e 40.

Elas não contam como perguntas e não alteram o total.

### 6.1 Regras das mensagens

- no máximo duas frases;
- não prometer resultados físicos;
- não usar culpa ou pressão;
- reconhecer o esforço do usuário;
- reforçar que não existem respostas certas ou erradas;
- não revelar prematuramente a categoria provável;
- adaptar o texto ao tom das respostas quando possível;
- nunca usar dados sensíveis de forma constrangedora.

### 6.2 Mensagens sugeridas

#### Após a pergunta 5

> Ótimo começo. Suas respostas ajudam a Wellness a olhar para você como um todo, não apenas para números do corpo.

#### Após a pergunta 10

> Você já concluiu a primeira parte. Responda com sinceridade: aqui não existem hábitos “perfeitos”, apenas informações que ajudam a personalizar seu caminho.

#### Após a pergunta 15

> Cuidar da alimentação também envolve compreender emoções, rotina e limites. Você está construindo um retrato mais completo do seu bem-estar.

#### Após a pergunta 20

> Metade concluída. Perceber como a mente influencia suas escolhas é um passo importante para mudanças mais sustentáveis.

#### Após a pergunta 25

> Bom progresso. Agora estamos refinando os padrões que mais influenciam sua alimentação e sua rotina física.

#### Após a pergunta 30

> Falta pouco. Suas respostas estão ajudando a diferenciar necessidades que podem parecer iguais, mas exigem estratégias diferentes.

#### Após a pergunta 35

> Última etapa. Vamos ajustar detalhes de rotina, preferências e bem-estar para tornar o resultado mais útil para você.

#### Após a pergunta 40

> Questionário concluído. Obrigado por responder com sinceridade — seu resultado será apresentado como uma orientação de bem-estar, não como julgamento ou diagnóstico.

### 6.3 Personalização das mensagens

A mensagem poderá ter variantes por estado emocional, mas sem indicar diagnóstico.

Exemplo para usuário que relatou culpa intensa:

> Você está indo bem. Falar sobre culpa alimentar pode ser desconfortável, e suas respostas serão usadas para propor uma abordagem mais acolhedora e equilibrada.

Exemplo para usuário que relatou rotina corrida:

> Seu dia parece exigir bastante de você. As próximas perguntas vão ajudar a encontrar estratégias compatíveis com a sua rotina real.

---

## 7. Tipos de resposta permitidos

### 7.1 Sim ou não

Usado quando a condição é objetiva e facilmente compreendida.

```json
{
  "type": "boolean",
  "options": ["sim", "nao"]
}
```

### 7.2 Sim, às vezes ou não

Preferível para comportamentos que variam.

```json
{
  "type": "frequency_short",
  "options": ["sim_frequentemente", "as_vezes", "nao"]
}
```

### 7.3 Frequência de cinco níveis

```text
Nunca
Raramente
Às vezes
Frequentemente
Quase sempre
```

### 7.4 Escala de 0 a 10

Indicada para intensidade subjetiva, como ansiedade, culpa, dificuldade ou disposição.

A escala deverá apresentar âncoras:

```text
0 = nada
5 = intensidade moderada
10 = intensidade extrema
```

### 7.5 Escolha única

Exemplo:

> Quando fica ansioso, o que acontece com seu apetite?

- diminui muito;
- diminui um pouco;
- não muda;
- aumenta um pouco;
- aumenta muito.

### 7.6 Múltipla escolha

Utilizar apenas quando mais de uma opção pode ocorrer.

Exemplo:

> Quais situações mais alteram sua alimentação?

- ansiedade;
- tristeza;
- cansaço;
- tédio;
- conflitos;
- comemorações;
- nenhuma dessas.

### 7.7 Resposta numérica

Usada para idade, altura, peso, frequência semanal e horas de sono.

Toda resposta numérica deverá possuir limites e validação.

### 7.8 Texto livre

Deverá ser opcional e raro. Texto livre não deve controlar sozinho a classificação, pois aumenta ambiguidades.

---

## 8. Modelo de dados de uma pergunta

```json
{
  "id": "GM-MA-AD-007",
  "version": 1,
  "text": "Quando você está sob muito estresse, seu apetite costuma diminuir?",
  "objective": "ganhar_massa",
  "stage": "subcategory_classification",
  "primary_dimension": "mind_food_connection",
  "secondary_dimensions": [
    "emotional_state",
    "current_food_intake",
    "physical_impact"
  ],
  "answer_type": "frequency_5",
  "options": [
    {"id": "never", "label": "Nunca", "value": 0},
    {"id": "rarely", "label": "Raramente", "value": 1},
    {"id": "sometimes", "label": "Às vezes", "value": 2},
    {"id": "often", "label": "Frequentemente", "value": 3},
    {"id": "almost_always", "label": "Quase sempre", "value": 4}
  ],
  "eligibility": {
    "required_objectives": ["ganhar_massa"],
    "minimum_answered": 20,
    "maximum_answered": 39
  },
  "score_effects": {
    "category.magro_ansioso": {
      "never": 0,
      "rarely": 0,
      "sometimes": 1,
      "often": 2,
      "almost_always": 3
    },
    "subcategory.ansiedade_digestiva": {
      "never": -1,
      "rarely": 0,
      "sometimes": 1,
      "often": 3,
      "almost_always": 4
    }
  },
  "next_question_hints": {
    "often": ["GM-MA-AD-008", "GM-MA-AD-009"],
    "almost_always": ["GM-MA-AD-008", "SAFE-EATING-004"],
    "never": ["GM-MA-HM-004"]
  },
  "excludes": ["GM-MA-AD-002"],
  "tags": ["stress", "appetite_loss", "energy_intake"]
}
```

---

## 9. Como o sistema escolhe a próxima pergunta

A IA não deverá inventar a próxima pergunta. A seleção deverá ser controlada por regras.

### 9.1 Estado da sessão

```json
{
  "target_question_count": 40,
  "answered_count": 18,
  "remaining_count": 22,
  "objective": "ganhar_massa",
  "current_stage": "mind_food_connection",
  "category_scores": {
    "magro_ansioso": 12,
    "falso_magro": 4,
    "ectomorfo": 7,
    "apetite_seletivo": 2
  },
  "subcategory_scores": {},
  "asked_question_ids": [],
  "answered_question_ids": [],
  "dimension_coverage": {},
  "safety_flags": []
}
```

### 9.2 Prioridade de seleção

A próxima pergunta deverá ser escolhida nesta ordem:

1. pergunta obrigatória ainda não respondida;
2. pergunta de segurança necessária;
3. dimensão com cobertura abaixo do mínimo;
4. pergunta capaz de desempatar categorias próximas;
5. pergunta capaz de confirmar a categoria líder;
6. pergunta de classificação da subcategoria;
7. pergunta de intensidade;
8. pergunta de personalização;
9. pergunta reserva compatível, caso ainda faltem respostas para completar 40.

### 9.3 Fórmula conceitual de prioridade

```text
prioridade =
valor_de_informacao
+ necessidade_de_cobertura
+ poder_de_desempate
+ compatibilidade_com_o_caminho
+ urgencia_de_seguranca
- repeticao_semantica
- irrelevancia_para_o_objetivo
```

### 9.4 Regra de não repetição

Uma pergunta não poderá ser escolhida quando:

- seu ID já foi respondido;
- existir outra pergunta semanticamente equivalente já respondida;
- ela investigar uma hipótese que já foi descartada com alta confiança;
- ela contradizer uma condição objetiva já registrada.

---

## 10. Sistema de pontuação

### 10.1 Pontuação por resposta

Cada resposta pode:

- adicionar pontos;
- retirar pontos;
- não alterar uma hipótese;
- ativar uma regra de segurança;
- tornar uma pergunta futura elegível.

Exemplo:

```text
Pergunta: Quando você está ansioso, seu apetite diminui?

Quase sempre:
+3 Magro Ansioso
+4 Ansiedade Digestiva

Às vezes:
+1 Magro Ansioso
+1 Ansiedade Digestiva

Nunca:
-1 Ansiedade Digestiva
+1 Hiperatividade Mental, caso exista mente acelerada sem perda de apetite
```

### 10.2 Confiança da categoria

Uma categoria não deverá ser confirmada apenas por uma resposta.

Sugestão:

```text
Categoria provável: pelo menos 8 pontos
Categoria confirmada: pelo menos 12 pontos
Diferença mínima para segunda colocada: 4 pontos
Evidências independentes mínimas: 3 perguntas
```

### 10.3 Empate

Se a diferença entre as duas categorias líderes for inferior a quatro pontos, o sistema deverá apresentar perguntas de desempate.

Exemplo:

```text
Magro Ansioso: 11
Ectomorfo: 9
Diferença: 2
Ação: perguntar sobre perda de apetite por estresse, desconforto digestivo e gasto energético espontâneo.
```

### 10.4 Respostas contraditórias

O sistema não deverá acusar o usuário de inconsistência.

Deverá apresentar uma pergunta contextualizada:

> Você comentou que costuma manter horários regulares, mas também relatou esquecer refeições em dias corridos. Em qual situação isso acontece com mais frequência?

---

## 11. Fluxo geral das perguntas 1 a 40

## Bloco 1 — Perguntas 1 a 5: perfil e objetivo

Perguntas obrigatórias sugeridas:

1. Qual é a sua idade?
2. Como você prefere informar seu sexo biológico para fins de estimativas corporais? Inclui opção “prefiro não informar”.
3. Qual é a sua altura atual?
4. Qual é o seu peso atual?
5. Qual é seu principal objetivo neste momento?
   - ganhar massa muscular;
   - emagrecer;
   - melhorar a relação com a comida.

Após a pergunta 5: mensagem motivacional.

## Bloco 2 — Perguntas 6 a 10: alimentação atual

O conjunto deverá investigar:

- número de refeições;
- regularidade;
- fome e saciedade;
- variedade;
- ultraprocessados;
- hidratação;
- porções;
- ingestão proteica;
- restrições;
- facilidade de preparo.

Exemplos:

6. Em quantos momentos do dia você costuma fazer uma refeição ou lanche?
7. Com que frequência você passa mais de cinco horas acordado sem comer?
8. Você costuma perceber fome antes de comer ou começa a refeição por horário, hábito ou oportunidade?
9. Depois das refeições, como você costuma se sentir?
   - ainda com fome;
   - satisfeito;
   - cheio demais;
   - varia bastante;
   - tenho dificuldade de perceber.
10. Em uma semana comum, com que frequência refeições completas são substituídas por produtos prontos, fast food ou lanches rápidos?

Após a pergunta 10: mensagem motivacional.

## Bloco 3 — Perguntas 11 a 15: estado mental

Exemplos:

11. De 0 a 10, quanto a ansiedade interfere na sua rotina atualmente?
12. De 0 a 10, quanto pensamentos sobre corpo, peso ou alimentação ocupam sua mente durante o dia?
13. Quando algo sai diferente do planejado na alimentação, qual reação se aproxima mais da sua?
14. Com que frequência você sente culpa depois de comer?
15. Em dias difíceis, você sente que possui outras formas de lidar com as emoções além da comida?

Após a pergunta 15: mensagem motivacional.

## Bloco 4 — Perguntas 16 a 20: conexão mente–alimentação

Exemplos:

16. Quando você fica ansioso, seu apetite diminui, aumenta ou não muda?
17. Em momentos de estresse, você sente sintomas digestivos que dificultam comer?
18. Quando está triste, cansado ou sozinho, com que frequência procura comida mesmo sem fome física?
19. Após comer algo que considera fora do plano, você tenta compensar pulando refeições ou treinando mais?
20. Quando sua rotina fica corrida, o que costuma acontecer com sua alimentação?

Após a pergunta 20: mensagem motivacional.

## Blocos 5 e 6 — Perguntas 21 a 30: categoria principal

Essas perguntas serão escolhidas de acordo com o objetivo e as primeiras hipóteses.

Após a pergunta 25 e a pergunta 30: mensagens motivacionais.

## Bloco 7 — Perguntas 31 a 35: subcategoria

O sistema apresentará perguntas específicas da categoria confirmada, incluindo ao menos uma pergunta de confirmação e uma de exclusão da subcategoria concorrente.

Após a pergunta 35: mensagem motivacional.

## Bloco 8 — Perguntas 36 a 40: personalização

Deverá investigar:

- intensidade e frequência do padrão;
- alimentos aceitos e rejeitados;
- disponibilidade para cozinhar;
- restrições, alergias ou condições relatadas;
- suporte social;
- prontidão para mudança;
- necessidade de recomendação profissional.

A pergunta 40 deverá ser uma pergunta útil, não apenas uma confirmação vazia.

Após a pergunta 40: mensagem final.

---

## 12. Regras de roteamento — Objetivo: Ganhar Massa Muscular

Categorias atuais:

- Magro Ansioso;
- Falso Magro;
- Ectomorfo;
- Apetite Seletivo.

### 12.1 Magro Ansioso

#### Evidências favoráveis

- dificuldade de ganhar massa;
- ansiedade alta;
- culpa ou preocupação alimentar;
- perda de apetite em períodos de estresse;
- desconfortos digestivos emocionais;
- esquecimento de refeições por mente acelerada.

#### Exemplo de regra explícita

```text
SE
ansiedade >= 7
E dificuldade_para_ganhar_massa = sim
E apetite_no_estresse = diminui
E desconforto_digestivo_no_estresse = sim ou frequente
ENTÃO
adicionar forte evidência para Magro Ansioso
E abrir perguntas de Ansiedade Digestiva.
```

#### Subcategoria: Ansiedade Digestiva

```text
SE
apetite_desaparece_no_estresse = sim/frequentemente
E sintomas_digestivos_atrapalham_refeicao = sim/frequentemente
E passa_horas_sem_comer_por_preocupacao = sim/às vezes
ENTÃO
classificar como Ansiedade Digestiva.
```

Exemplo solicitado de combinações:

```text
SE usuário responder:
- NÃO para “você permanece em movimento o tempo todo?”
- SIM para “o estresse reduz seu apetite?”
- SIM para “a ansiedade causa desconforto digestivo?”
- SIM para “você perde peso em períodos emocionais difíceis?”
ENTÃO direcionar para Ansiedade Digestiva.
```

#### Subcategoria: Hiperatividade Mental

```text
SE
mente_acelerada = sim/frequentemente
E necessidade_constante_de_atividade = sim
E dificuldade_de_concentracao = sim
E desconforto_digestivo_intenso = não ou baixo
ENTÃO
classificar como Hiperatividade Mental.
```

Exemplo:

```text
SE usuário responder:
- SIM para “sua mente continua ativa ao tentar descansar?”
- SIM para “você sente necessidade de estar fazendo algo?”
- SIM para “você perde o horário das refeições por distração?”
- NÃO para “o estresse causa desconforto digestivo intenso?”
ENTÃO direcionar para Hiperatividade Mental.
```

### 12.2 Falso Magro

#### Evidências favoráveis

- baixa massa muscular aparente;
- gordura localizada;
- baixa atividade física;
- flacidez;
- pouca força;
- consumo frequente de ultraprocessados.

#### Subcategoria: Metabolicamente Descondicionado

Nome de exibição recomendado: **Baixo condicionamento e rotina alimentar irregular**.

```text
SE
cansaco_em_atividades_simples = sim
E inchaço_frequente = sim
E ultraprocessados_frequentes = sim
E atividade_fisica_baixa = sim
ENTÃO
classificar como Baixo condicionamento e rotina alimentar irregular.
```

#### Subcategoria: Baixa Massa Muscular

```text
SE
pouca_forca = sim
E musculatura_pouco_desenvolvida = sim
E pouca_evolucao_na_musculacao = sim ou histórico compatível
E gordura_localizada pode ser sim ou não
ENTÃO
classificar como Baixa Massa Muscular.
```

### 12.3 Ectomorfo

O termo deverá ser tratado como perfil descritivo interno, não como diagnóstico metabólico definitivo.

#### Subcategoria: Alto Gasto Energético

```text
SE
movimento_espontaneo_alto = sim
E perde_peso_rapidamente_ao_comer_menos = sim
E dificuldade_de_ganhar_peso = sim
E ingestao_nao_parece_baixa = sim
ENTÃO
classificar como Alto Gasto Energético.
```

#### Subcategoria: Baixa Ingestão Calórica

```text
SE
saciedade_precoce = sim
OU porcoes_pequenas = sim
OU esquece_refeicoes = sim
E dificuldade_de_ganhar_peso = sim
ENTÃO
classificar como Baixa Ingestão Calórica.
```

Desempate:

```text
SE movimento alto = SIM e refeições regulares = SIM
→ Alto Gasto Energético.

SE movimento alto = NÃO ou moderado e refeições esquecidas = SIM
→ Baixa Ingestão Calórica.
```

### 12.4 Apetite Seletivo

#### Subcategoria: Sensibilidade Sensorial

```text
SE
rejeicao_por_textura = sim
E mistura_de_alimentos_incomoda = sim
E separa_ingredientes = sim/às vezes
ENTÃO
classificar como Sensibilidade Sensorial.
```

#### Subcategoria: Resistência à Novidade Alimentar

```text
SE
medo_ou_resistencia_a_experimentar = sim
E textura_nao_e_o_principal_motivo = sim
E alimentação_muito_semelhante_desde_infancia = sim
ENTÃO
classificar como Resistência à Novidade Alimentar.
```

---

## 13. Regras de roteamento — Objetivo: Emagrecer

Categorias atuais:

- Psicológico / Compulsivo;
- Sedentário com Metabolismo Lento;
- Restritivo / Efeito Sanfona;
- Paladar Infantil / Viciado em Processados.

Nomes de exibição devem ser humanizados.

### 13.1 Alimentação impulsiva ou emocional

Nome interno atual: Psicológico / Compulsivo.

#### Subcategoria: Belisco Noturno e Hipervigilância

```text
SE
ansiedade_noturna = alta
E belisca_depois_do_jantar = frequente
E revisita_armarios_automaticamente = sim
E perda_de_controle_aguda = não ou menos intensa
ENTÃO
classificar como Belisco Noturno e Hipervigilância.
```

#### Subcategoria: Impulsividade em Crises Agudas

```text
SE
episodios_apos_gatilho_emocional = sim
E come_muito_rapido = sim
E para_apenas_com_desconforto = sim
E culpa_intensa_depois = sim
ENTÃO
classificar como Impulsividade em Crises Agudas.
```

Exemplo de desvio:

```text
NÃO para “você costuma beliscar após o jantar?”
SIM para “os episódios surgem após discussões ou notícias estressantes?”
SIM para “você come rapidamente durante esses episódios?”
SIM para “sente culpa intensa depois?”
→ Impulsividade em Crises Agudas.
```

### 13.2 Baixa atividade e rotina sedentária

Nome interno atual: Sedentário com Metabolismo Lento.

#### Subcategoria: Baixa hidratação e confusão entre sede e fome

```text
SE
agua_baixa = sim
E boca_seca_ou_dor_de_cabeca = frequente
E vontade_de_comer_diminui_apos_agua = sim
ENTÃO
classificar como Baixa hidratação e confusão entre sede e fome.
```

#### Subcategoria: Imobilidade Ocupacional

```text
SE
mais_de_6_horas_sentado = sim
E atividade_fisica_menor_150_minutos = sim
E poucas_pausas_de_movimento = sim
ENTÃO
classificar como Imobilidade Ocupacional.
```

### 13.3 Restrição e efeito sanfona

#### Subcategoria: Medo Crônico de Carboidratos

```text
SE
exclui_carboidratos = sim
E medo_de_arroz_batata_ou_massas = alto
E fraqueza_ou_irritabilidade_apos_corte = sim
E desejo_intenso_apos_restricao = sim
ENTÃO
classificar como Medo Crônico de Carboidratos.
```

#### Subcategoria: Efeito Rebote Agudo

```text
SE
historico_de_dietas_agressivas = sim
E recupera_peso_rapidamente = sim
E oscilacao_de_4_ou_5kg_em_30_dias = sim
E alterna_foco_total_e_desistencia = sim
ENTÃO
classificar como Efeito Rebote Agudo.
```

### 13.4 Preferência intensa por ultraprocessados

Nome interno atual: Paladar Infantil / Viciado em Processados.

#### Subcategoria: Dependência de Hiperpalatáveis

Nome de exibição recomendado: **Busca intensa por sabores hiperpalatáveis**.

```text
SE
fissura_por_doce_ou_gordura = sim
E alimentos_naturais_parecem_sem_graca = sim
E bebidas_adocadas_ou_zero_sao_frequentes = sim
ENTÃO
classificar como Busca intensa por sabores hiperpalatáveis.
```

#### Subcategoria: Seletividade Industrial Monótona

```text
SE
marcas_especificas_trazem_seguranca = sim
E lanches_sao_majoritariamente_industrializados = sim
E rejeicao_visual_ou_textural_de_vegetais = sim
ENTÃO
classificar como Seletividade Industrial Monótona.
```

---

## 14. Regras de roteamento — Objetivo: Melhorar Relação com a Comida

Categorias atuais:

- Terrorista Nutricional;
- Desconectado / Comedor Distraído;
- Obcecado pela Estética / Balança;
- Comedor Emocional de Alívio.

Os nomes exibidos ao usuário deverão ser mais acolhedores.

### 14.1 Rigidez e medo alimentar

Nome interno atual: Terrorista Nutricional.

#### Subcategoria: Rigidez com alimentação “limpa”

Nome interno atual: Ortorexia Funcional.

```text
SE
analisa_rotulos_com_ansiedade = sim
E evita_eventos_sociais_por_comida = sim
E teme_ingredientes_sem_indicacao_clinica = sim
E compensacao_punitiva = não ou secundária
ENTÃO
classificar como Rigidez com alimentação “limpa”.
```

#### Subcategoria: Compensação Punitiva

```text
SE
culpa_apos_sair_do_plano = alta
E pula_refeicao_para_compensar = sim
OU exercício_para_anular_comida = sim
E pensamento_tudo_ou_nada = sim
ENTÃO
classificar como Compensação Punitiva.
```

### 14.2 Alimentação automática e desconexão corporal

#### Subcategoria: Alimentação Automática

```text
SE
usa_telas_nas_refeicoes = frequente
E nao_lembra_sabor_ou_quantidade = sim
E come_sem_fome_por_automatismo = sim
ENTÃO
classificar como Alimentação Automática.
```

#### Subcategoria: Desconexão Corporal

```text
SE
dificuldade_de_reconhecer_fome = sim
E percebe_saciedade_apenas_muito_cheio = sim
E dificuldade_de_diferenciar_fome_emocional = sim
ENTÃO
classificar como Desconexão Corporal.
```

Desempate:

```text
Telas e velocidade altas + sinais corporais razoáveis
→ Alimentação Automática.

Poucas telas + dificuldade intensa de fome e saciedade
→ Desconexão Corporal.
```

### 14.3 Imagem corporal e validação

Nome interno atual: Obcecado pela Estética / Balança.

#### Subcategoria: Dependência de Validação Estética

```text
SE
comentarios_afetam_humor = muito
E compara_corpo_frequentemente = sim
E busca_aprovacao_visual = sim
ENTÃO
classificar como Dependência de Validação Estética.
```

#### Subcategoria: Insatisfação Corporal Persistente

```text
SE
nunca_se_sente_satisfeito = sim
E encontra_novos_defeitos_apos_metas = sim
E pequenas_variacoes_afetam_autoestima = sim
ENTÃO
classificar como Insatisfação Corporal Persistente.
```

### 14.4 Alimentação emocional

#### Subcategoria: Recompensa Alimentar

```text
SE
comida_como_premio = frequente
E vontade_apos_dia_cansativo = sim
E objetivo_principal_e_relaxar_ou_comemorar = sim
E fuga_de_sentimentos = não ou secundária
ENTÃO
classificar como Recompensa Alimentar.
```

#### Subcategoria: Fuga Emocional

```text
SE
come_para_evitar_sentimentos = sim
E alivio_e_temporario = sim
E problemas_continuam_depois = sim
E dificuldade_de_encontrar_outros_recursos = sim
ENTÃO
classificar como Fuga Emocional.
```

---

## 15. Perguntas de segurança e encaminhamento

A Wellness deverá possuir perguntas de segurança que podem ser inseridas sem alterar o total de 40; elas ocupam um slot normal e substituem uma pergunta menos prioritária.

Exemplos de sinais:

- desmaios ou tonturas frequentes associados à restrição;
- vômitos provocados;
- uso de laxantes ou medicamentos para compensar alimentação;
- períodos prolongados sem comer intencionalmente;
- episódios frequentes de perda de controle com sofrimento intenso;
- perda ou ganho de peso rápido sem explicação;
- medo extremo de comer;
- sofrimento intenso com imagem corporal;
- pensamentos de autolesão ou falta de segurança emocional.

Regra:

```text
SE qualquer resposta indicar risco elevado
ENTÃO
ativar safety_flag
E mostrar orientação clara para procurar profissional qualificado
E não apresentar o resultado como diagnóstico
E não prescrever dieta restritiva.
```

O fluxo pode continuar até 40 para fins de experiência, desde que a mensagem de segurança não seja adiada quando houver urgência.

---

## 16. Como preencher exatamente 40 perguntas sem perguntas inúteis

### 16.1 Quando a categoria é identificada cedo

As perguntas restantes devem aprofundar:

- intensidade;
- frequência;
- contexto;
- impacto físico;
- rotina;
- preferências;
- barreiras;
- disponibilidade para mudança;
- segurança;
- personalização do plano.

### 16.2 Quando a categoria ainda está incerta

As perguntas restantes devem priorizar:

- contraste entre as duas categorias líderes;
- perguntas de exclusão;
- exemplos situacionais;
- frequência real;
- diferença entre comportamento habitual e exceção.

### 16.3 Perguntas reserva

Cada objetivo deverá possuir perguntas reserva que sejam úteis para qualquer categoria.

Exemplos:

- Como você avalia sua qualidade de sono de 0 a 10?
- Em quantos dias da semana você prepara ou participa do preparo das próprias refeições?
- Quanto apoio você recebe das pessoas que vivem com você para mudar hábitos?
- Qual é sua maior dificuldade para manter uma rotina alimentar?
- De 0 a 10, quanto você se sente pronto para realizar pequenas mudanças nas próximas semanas?

---

## 17. Validações obrigatórias do sistema

### 17.1 Validação de contagem

```text
answered_count < 40 → não finalizar
answered_count = 40 → finalizar
answered_count > 40 → erro de sistema
```

### 17.2 Validação de resultado

Antes de finalizar, deve existir:

- objetivo confirmado;
- categoria principal definida;
- subcategoria definida;
- cobertura mínima das dimensões;
- ausência de empate não resolvido;
- registro de alertas de segurança;
- justificativa do resultado baseada em respostas reais.

### 17.3 Validação de transparência

O resultado deverá indicar:

- principais padrões percebidos;
- como esses padrões afetam a alimentação;
- possível consequência física ou funcional;
- sugestões compatíveis;
- limitações da análise;
- recomendação profissional quando aplicável.

---

## 18. Estrutura do resultado final

```text
Seu objetivo
↓
Padrão comportamental principal
↓
Padrão alimentar atual
↓
Como mente e alimentação parecem se relacionar
↓
Impactos físicos ou funcionais relatados
↓
Categoria comportamental compatível
↓
Subcategoria compatível
↓
Estratégia inicial personalizada
↓
Alertas e recomendação profissional, quando necessário
```

Exemplo:

```text
Padrão mental observado:
Ansiedade elevada e dificuldade de desacelerar em dias de pressão.

Impacto alimentar observado:
Redução do apetite, desconforto digestivo e longos períodos sem refeições.

Impacto físico relatado:
Dificuldade de manter o peso e baixa disponibilidade de energia.

Perfil compatível:
Magro Ansioso — Ansiedade Digestiva.

Direção inicial:
Refeições menores e regulares, preparações de fácil aceitação e estratégias de organização da rotina. Esse resultado não substitui avaliação médica, nutricional ou psicológica.
```

---

## 19. Testes necessários

### 19.1 Teste de cada rota

Cada categoria e subcategoria deverá possuir ao menos:

- um caso típico;
- um caso moderado;
- um caso com respostas contraditórias;
- um caso de empate;
- um caso com alerta de segurança.

### 19.2 Teste de contagem

Todas as rotas devem terminar com exatamente 40 perguntas.

### 19.3 Teste de repetição

Nenhuma rota poderá apresentar:

- ID duplicado;
- perguntas semanticamente equivalentes;
- pergunta incompatível com objetivo já escolhido.

### 19.4 Teste das mensagens

As mensagens devem aparecer após 5, 10, 15, 20, 25, 30, 35 e 40 respostas, sem aumentar o contador.

---

## 20. Decisões definidas nesta especificação

1. O banco conterá muitas perguntas.
2. Cada usuário responderá exatamente 40 perguntas.
3. O caminho dependerá das respostas anteriores.
4. Serão aceitos formatos como sim/não, às vezes, frequência, múltipla escolha e escala de 0 a 10.
5. As perguntas investigarão alimentação atual, mente, emoções, rotina e impacto físico.
6. O sistema mostrará uma mensagem de motivação a cada cinco perguntas.
7. As mensagens não contarão como perguntas.
8. Cada categoria e subcategoria terá regras explícitas de inclusão, exclusão e desempate.
9. A IA não inventará a próxima pergunta; o motor utilizará perguntas previamente cadastradas.
10. O resultado será educativo e não diagnóstico.
11. Sinais de risco ativarão orientações de segurança.
12. Dietas continuarão vinculadas às subcategorias, mas deverão ser revisadas por profissional qualificado antes de uso real.

---

## 21. Próximas etapas de implementação

### Etapa 1 — Auditoria

- remover duplicações;
- normalizar opções de resposta;
- revisar nomes clínicos ou estigmatizantes;
- identificar critérios vagos;
- mapear conflitos.

### Etapa 2 — Banco de perguntas

Criar perguntas com:

- ID;
- texto;
- tipo de resposta;
- dimensão;
- objetivo;
- categoria;
- subcategoria;
- pesos;
- condições;
- exclusões;
- alertas.

### Etapa 3 — Motor de fluxo

Implementar:

- contador de 40;
- seleção da próxima pergunta;
- pontuação;
- desempate;
- cobertura mínima;
- mensagens motivacionais;
- regras de segurança.

### Etapa 4 — Testes

Simular centenas de combinações e confirmar:

- resultados coerentes;
- nenhuma rota com menos ou mais de 40;
- ausência de repetição;
- desempates resolvidos;
- linguagem acolhedora;
- alertas de segurança funcionando.

---

## 22. Referências de produto utilizadas como inspiração

A pesquisa pública sobre o HeightMax indica que o produto utiliza questionário inicial, personalização de plano, acompanhamento de progresso, desafios, lembretes, recompensas e motivação diária. Não foi encontrada documentação pública confiável confirmando que o aplicativo exiba frases exatamente a cada cinco perguntas. Por isso, a Wellness adotará essa frequência como uma decisão própria de experiência, inspirada no princípio geral de manter constância e engajamento, sem copiar textos do produto.

Fontes consultadas:

- App Store — HeightMax / HeightMax Grow Taller.
- Google Play — HeightMax Grow Taller.
- Site público do HeightMax.

---

## 23. Observação acadêmica e ética

Como o projeto envolve alimentação, imagem corporal, ansiedade, culpa, perda de controle e possíveis sintomas físicos, a versão final do TCC deverá explicar claramente:

- que o aplicativo não realiza diagnóstico;
- como as perguntas foram elaboradas;
- quais profissionais revisaram o conteúdo;
- como será protegida a privacidade do usuário;
- como o sistema age diante de sinais de risco;
- como será evitado reforçar transtornos alimentares, culpa ou restrição excessiva;
- quais são as limitações científicas do modelo de classificação.

A frase conceitual “entender o mental para consertar o físico” pode ser utilizada internamente, mas a formulação acadêmica recomendada é:

> Compreender fatores emocionais e comportamentais que influenciam a alimentação para orientar mudanças físicas e nutricionais mais adequadas, sustentáveis e acolhedoras.
