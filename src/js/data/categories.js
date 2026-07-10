/* ============================================================
   WELLNESS — data-categorias.js
   Categorias principais por objetivo.

   `interno`  → nome técnico mantido internamente (spec §3.3 / §12–14).
   `nome`     → nome humanizado e NÃO diagnóstico exibido ao usuário.
   `resumo`   → descrição educativa curta do padrão (não é diagnóstico).

   Fonte de verdade: wellness_project/outcomes/categories.json
   ============================================================ */

window.WELLNESS_CATEGORIAS = {

  "ganhar-massa": {
    "magro-ansioso": {
      interno: "Magro Ansioso",
      nome:    "Ansiedade que afeta o apetite",
      resumo:  "Padrão em que a ansiedade e a mente acelerada reduzem o apetite e a regularidade das refeições, dificultando o ganho de massa.",
    },
    "falso-magro": {
      interno: "Falso Magro",
      nome:    "Baixo condicionamento e rotina alimentar irregular",
      resumo:  "Baixa massa muscular acompanhada de gordura localizada, baixa atividade física e consumo frequente de ultraprocessados.",
    },
    "ectomorfo": {
      interno: "Ectomorfo",
      nome:    "Alto gasto e dificuldade de ganhar peso",
      resumo:  "Perfil descritivo com gasto energético elevado ou baixa ingestão calórica, com dificuldade de ganhar peso.",
    },
    "apetite-seletivo": {
      interno: "Apetite Seletivo",
      nome:    "Seletividade alimentar",
      resumo:  "Repertório alimentar restrito por questões sensoriais ou por resistência a experimentar novos alimentos.",
    },
  },

  "emagrecer": {
    "psicologico-compulsivo": {
      interno: "Psicológico / Compulsivo",
      nome:    "Alimentação impulsiva ou emocional",
      resumo:  "Episódios de comer além do pretendido ligados a emoções, ansiedade noturna ou gatilhos, muitas vezes seguidos de culpa.",
    },
    "sedentario-metabolismo-lento": {
      interno: "Sedentário com Metabolismo Lento",
      nome:    "Baixa atividade e rotina sedentária",
      resumo:  "Rotina com muitas horas sentado, pouca atividade física e, por vezes, baixa hidratação que confunde sede com fome.",
    },
    "restritivo-efeito-sanfona": {
      interno: "Restritivo (Efeito Sanfona)",
      nome:    "Restrição e efeito sanfona",
      resumo:  "Histórico de dietas restritivas com recuperação rápida de peso e alternância entre foco total e desistência.",
    },
    "paladar-infantil": {
      interno: "Paladar Infantil / Viciado em Processados",
      nome:    "Preferência intensa por ultraprocessados",
      resumo:  "Forte preferência por sabores hiperpalatáveis e alimentos industrializados, com rejeição a alimentos naturais.",
    },
  },

  "melhorar-alimentacao": {
    "terrorista-nutricional": {
      interno: "Terrorista Nutricional",
      nome:    "Rigidez e medo alimentar",
      resumo:  "Regras alimentares muito rígidas, medo de determinados alimentos e, por vezes, comportamento compensatório.",
    },
    "desconectado-distraido": {
      interno: "Desconectado / Comedor Distraído",
      nome:    "Alimentação automática e desconexão corporal",
      resumo:  "Refeições feitas no automático, com telas e pressa, e dificuldade de perceber sinais de fome e saciedade.",
    },
    "obcecado-estetica": {
      interno: "Obcecado pela Estética / Balança",
      nome:    "Imagem corporal e validação",
      resumo:  "Preocupação intensa com aparência, comparação corporal frequente e autoestima muito sensível ao peso.",
    },
    "comedor-emocional": {
      interno: "Comedor Emocional de Alívio",
      nome:    "Alimentação emocional",
      resumo:  "Uso da comida como recompensa ou alívio de emoções difíceis, com alívio temporário e retorno do desconforto.",
    },
  },
};
