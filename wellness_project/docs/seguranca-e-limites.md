# Segurança e Limites

Fonte operacional: `questionnaire/scoring.json` (bloco `seguranca`) e a pergunta
`p_40` do bloco 8 em `questionnaire/questions.json`.

## Linguagem não diagnóstica (spec §3.3)

O app **não afirma** diagnósticos (“você tem compulsão”, “seu metabolismo está
quebrado” etc.). Usa formulações como “suas respostas indicam um padrão de
alimentação impulsiva em momentos de estresse”. Todo resultado traz o aviso de que
não substitui avaliação profissional.

## Sinais monitorados (safety flags)

| Flag | Origem |
|---|---|
| `desmaios_restricao` | p_40 |
| `vomito_provocado` | p_40 (urgente) |
| `laxantes_compensacao` | p_40 (urgente) |
| `jejum_prolongado_intencional` | p_40 |
| `perda_controle_sofrimento` | p_40 e em_26 |
| `sofrimento_imagem_corporal` | ml_25 (escala ≥ 9) |
| `risco_emocional` | reservada p/ expansão (urgente) |

## Regra (spec §15)

```
SE qualquer resposta indicar risco elevado
ENTÃO ativar safety_flag
     E mostrar orientação clara para procurar profissional qualificado
     E não apresentar o resultado como diagnóstico
     E não prescrever dieta restritiva.
```

O fluxo pode seguir até 40 para não interromper a experiência; sinais urgentes,
porém, não devem ser adiados. A mensagem inclui o canal de apoio (CVV 188).

## Limites do modelo

- Classificação por padrões comportamentais, não clínica.
- Cardápios (`outcomes/recommendations.json`) são sugestões que **devem ser
  revisadas por profissional** antes de uso real (spec §20.12).
