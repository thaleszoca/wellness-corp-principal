# Regras do Fluxo

Fonte operacional: `questionnaire/flow.json` e `questionnaire/scoring.json`.

## Contagem exata de 40

- Bloco 1 (1–5): perfil e objetivo — tela `perguntas-essenciais`.
- Blocos 2–4 (6–20): 15 perguntas compartilhadas (todos respondem).
- Blocos 5–6 (21–30): 10 perguntas do objetivo escolhido.
- Bloco 7 (31–35): 5 perguntas da **categoria líder** (classificada após a 30).
- Bloco 8 (36–40): 5 perguntas de personalização + segurança.

Total = 5 + 15 + 10 + 5 + 5 = **40**. Nenhuma rota termina antes da 40 nem passa
de 40 (validado em `tests/`).

## Seleção da próxima pergunta (spec §9)

Determinística por blocos:

1. Enquanto houver perguntas no bloco corrente, a próxima é a próxima do bloco.
2. Ao terminar o bloco 6, a **categoria de maior pontuação** define o bloco 7.
3. Ao terminar o bloco 7, a **subcategoria de maior pontuação** define a dieta e
   libera o bloco 8 (personalização, comum a todos).

## Não repetição

- Todos os IDs são únicos.
- Blocos fixos + fila incremental impedem que uma pergunta apareça duas vezes.
- Uma categoria/subcategoria descartada não “reabre” perguntas já superadas.

## Pontuação, confiança e desempate (spec §10)

- Cada resposta soma pontos a uma categoria (blocos 2–6) ou subcategoria (bloco 7).
- Categoria provável ≥ 8; confirmada ≥ 12 com diferença ≥ 4 para a segunda.
- Empate (diferença < 4): o bloco 6 já contém perguntas de contraste; persistindo,
  vence a maior pontuação e, em igualdade, a primeira categoria definida.
- A pontuação é **recalculada de forma pura** a partir das respostas nos pontos de
  decisão — por isso voltar e alterar respostas é seguro.

## Contradições (spec §10.4)

O sistema não acusa inconsistência. Vence a maior pontuação acumulada; perguntas
de contexto ajudam a diferenciar hábito de exceção.

## Encerramento

Após a 40ª resposta: escolha da dieta (regra explícita por subcategoria em
`outcomes/subcategories.json`), montagem do resultado e, se houver `safety_flag`,
mensagem de encaminhamento.
