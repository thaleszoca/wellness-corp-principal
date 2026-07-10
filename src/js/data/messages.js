/* ============================================================
   WELLNESS — data-mensagens.js
   Mensagens motivacionais (a cada 5 perguntas) e mensagens de
   segurança / encaminhamento.

   Fonte de verdade: wellness_project/questionnaire/motivational-messages.json
   e wellness_project/docs/estrutura-completa-questionario.md (seções 6 e 15).

   Regras (spec §6.1):
     - no máximo duas frases;
     - não prometer resultados físicos;
     - não usar culpa ou pressão;
     - reconhecer o esforço do usuário;
     - reforçar que não há respostas certas ou erradas;
     - não revelar a categoria provável;
     - adaptar ao tom das respostas quando possível.

   As mensagens NÃO contam como perguntas e NÃO alteram o total de 40.
   ============================================================ */

window.WELLNESS_MENSAGENS = {

  /* Mensagem padrão exibida APÓS a pergunta de número indicado.
     Aparece depois de 5, 10, 15, 20, 25, 30, 35 e 40 respostas. */
  motivacionais: {
    5:  "Ótimo começo. Suas respostas ajudam a Wellness a olhar para você como um todo, não apenas para números do corpo.",
    10: "Você já concluiu a primeira parte. Responda com sinceridade: aqui não existem hábitos “perfeitos”, apenas informações que ajudam a personalizar seu caminho.",
    15: "Cuidar da alimentação também envolve compreender emoções, rotina e limites. Você está construindo um retrato mais completo do seu bem-estar.",
    20: "Metade concluída. Perceber como a mente influencia suas escolhas é um passo importante para mudanças mais sustentáveis.",
    25: "Bom progresso. Agora estamos refinando os padrões que mais influenciam sua alimentação e sua rotina física.",
    30: "Falta pouco. Suas respostas estão ajudando a diferenciar necessidades que podem parecer iguais, mas exigem estratégias diferentes.",
    35: "Última etapa. Vamos ajustar detalhes de rotina, preferências e bem-estar para tornar o resultado mais útil para você.",
    40: "Questionário concluído. Obrigado por responder com sinceridade — seu resultado será apresentado como uma orientação de bem-estar, não como julgamento ou diagnóstico.",
  },

  /* Variantes por estado emocional (spec §6.3). O motor escolhe a variante
     quando um "gatilho" estiver ativo no momento da mensagem; caso contrário
     usa a mensagem padrão do marco. Cada variante indica em qual marco pode
     substituir a mensagem padrão. */
  variantes: [
    {
      gatilho: "culpa_intensa",           // sinal culpa_alimentar alto
      marcos: [15, 20, 25],
      texto: "Você está indo bem. Falar sobre culpa alimentar pode ser desconfortável, e suas respostas serão usadas para propor uma abordagem mais acolhedora e equilibrada.",
    },
    {
      gatilho: "rotina_corrida",          // sinal rotina_corrida alto
      marcos: [10, 20, 30],
      texto: "Seu dia parece exigir bastante de você. As próximas perguntas vão ajudar a encontrar estratégias compatíveis com a sua rotina real.",
    },
    {
      gatilho: "ansiedade_alta",          // sinal ansiedade alto
      marcos: [15, 20],
      texto: "Obrigado por compartilhar como você tem se sentido. Reconhecer a ansiedade já é um passo — as próximas perguntas ajudam a cuidar disso com mais gentileza.",
    },
  ],

  /* Mensagem de segurança / encaminhamento (spec §15).
     Exibida junto ao resultado quando houver safety_flag; em caso de
     urgência, pode ser antecipada durante o fluxo (sem alterar a contagem). */
  seguranca: {
    titulo: "Um cuidado importante com você",
    texto: "Algumas de suas respostas indicam sinais que merecem atenção de um profissional qualificado (médico, nutricionista ou psicólogo). Este aplicativo não realiza diagnóstico e não substitui avaliação profissional. Se você estiver passando por um momento difícil, procurar ajuda é um gesto de cuidado.",
    rodape: "Em situações de risco imediato à sua segurança, procure atendimento de emergência ou ligue para o CVV no 188 (24h, gratuito).",
  },

  /* Aviso fixo apresentado no resultado (linguagem não diagnóstica). */
  aviso_resultado: "Este resultado é uma orientação educativa de bem-estar, baseada nas suas respostas. Ele não é um diagnóstico e não substitui a avaliação de um profissional de saúde.",
};
