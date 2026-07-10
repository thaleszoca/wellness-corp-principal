# Visão Geral

A **Wellness** é um questionário adaptativo de nutrição e bem-estar. Cada usuário
responde **exatamente 40 perguntas**, por um caminho que depende das respostas
anteriores, do objetivo escolhido e das hipóteses de categoria/subcategoria.

## Proposta

```
Compreender fatores emocionais e mentais
↓
Identificar como influenciam a alimentação atual
↓
Relacionar com consequências físicas e funcionais
↓
Gerar uma orientação personalizada de bem-estar
```

A Wellness **não diagnostica** transtornos. Apresenta linguagem educativa e
recomenda avaliação profissional diante de sinais de risco.

## Público-alvo

Pessoas que buscam **ganhar massa**, **emagrecer** ou **melhorar a relação com a
comida**, com atenção conjunta a mente, alimentação, rotina, sono, atividade
física e possíveis consequências físicas dos hábitos.

## Onde está cada coisa (fonte de verdade)

| Conteúdo | Arquivo |
|---|---|
| Banco de perguntas + pesos | `questionnaire/questions.json` |
| Tipos de resposta | `questionnaire/answers.json` |
| Regras de fluxo (blocos, 40, marcos) | `questionnaire/flow.json` |
| Pontuação, limiares, segurança | `questionnaire/scoring.json` |
| Mensagens motivacionais | ver §6 de `docs/estrutura-completa-questionario.md` (app: `data-mensagens.js`) |
| Categorias | `outcomes/categories.json` |
| Subcategorias | `outcomes/subcategories.json` |
| Cardápios | `outcomes/recommendations.json` |
| Testes | `tests/*.json` |

O documento de arquitetura completo é
[`estrutura-completa-questionario.md`](estrutura-completa-questionario.md).

## Implementação no app

O app estático consome esses dados por meio de módulos JS equivalentes
(`data-banco.js`, `data-regras.js`, `data-categorias.js`, `data-subcategorias.js`,
`data-mensagens.js`) e do motor `perguntas-adaptativas.js`. Os cardápios ficam em
`dados.js`. Os JSON desta pasta são a fonte de verdade documental e são gerados a
partir dos mesmos dados.
