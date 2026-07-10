# Motivação e Mensagens

Fonte no app: `data-mensagens.js`. Referência conceitual: §6 de
[`estrutura-completa-questionario.md`](estrutura-completa-questionario.md).

## Quando aparecem

Após as perguntas **5, 10, 15, 20, 25, 30, 35 e 40**. As mensagens **não contam
como perguntas** e não alteram o total de 40.

## Regras (spec §6.1)

- no máximo duas frases;
- não prometer resultados físicos;
- não usar culpa ou pressão;
- reconhecer o esforço do usuário;
- reforçar que não há respostas certas ou erradas;
- não revelar a categoria provável;
- adaptar ao tom das respostas quando possível.

## Variantes por estado emocional (spec §6.3)

Quando um gatilho está ativo no marco, a mensagem padrão é substituída por uma
variante mais acolhedora:

- **culpa intensa** (culpa alimentar frequente) → marcos 15, 20, 25;
- **rotina corrida** → marcos 10, 20, 30;
- **ansiedade alta** (escala ≥ 7) → marcos 15, 20.

## Segurança

Além das motivacionais, há a mensagem de **encaminhamento** (`seguranca`) exibida
no resultado quando qualquer `safety_flag` é ativada, e o **aviso não diagnóstico**
(`aviso_resultado`) sempre presente no resultado.
