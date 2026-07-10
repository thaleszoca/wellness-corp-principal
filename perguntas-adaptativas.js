/* ============================================================
   WELLNESS — perguntas-adaptativas.js
   Motor do fluxo comportamental:

     Objetivo (vindo das perguntas essenciais)
       → Triagem            → classifica CATEGORIA
       → Perguntas categoria → classifica SUBCATEGORIA
       → Perguntas subcat.   → escolhe DIETA 1 ou DIETA 2
       → Plano alimentar personalizado

   Depende de: dados.js  (window.WELLNESS_DADOS)
   ============================================================ */

/* ════════════════════════════════════════
   ESTADO
════════════════════════════════════════ */

const essentials = JSON.parse(localStorage.getItem('wellness_essentials') || '{}');
const goalKey     = essentials.goal || 'ganhar-massa';
const objetivo    = WELLNESS_DADOS[goalKey];

/* Fila de perguntas construída dinamicamente conforme a classificação avança */
let fila       = [];       // [{ id, texto, tipo, opcoes?, dica?, fase }]
let idx        = 0;        // índice da pergunta atual na fila
let transitioning = false;

/* Respostas registradas: { <id>: valor } */
const respostas = {};

/* Resultado da classificação, preenchido ao longo do fluxo */
const resultado = {
  objetivo:     goalKey,
  categoria:    null,   // chave
  subcategoria: null,   // chave
  dieta:        null,   // 'dieta1' | 'dieta2'
};

/* Referências para os nós de dados atuais */
let catNode = null;   // objeto da categoria escolhida
let subNode = null;   // objeto da subcategoria escolhida

/* Fases do fluxo (para o rótulo do topo) */
const FASES = {
  triagem:      'Perfil',
  categoria:    'Comportamento',
  subcategoria: 'Detalhamento',
};

/* ── Refs DOM ── */
const progressFill = document.getElementById('progressFill');
const backBtn      = document.getElementById('backBtn');
const continueBtn  = document.getElementById('continueBtn');
const stepNumEl    = document.getElementById('stepNum');
const stepTotalEl  = document.getElementById('stepTotal');
const faseLabelEl  = document.getElementById('faseLabel');
const cardEl       = document.getElementById('questionCard');
const quizMain     = document.getElementById('quizMain');
const resultMain   = document.getElementById('resultMain');


/* ════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════ */

function init() {
  if (!objetivo) {
    /* Sem objetivo salvo — volta para as perguntas essenciais */
    window.location.href = 'perguntas-essenciais.html';
    return;
  }

  /* Título do objetivo no cabeçalho */
  const goalNameEl = document.getElementById('goalName');
  if (goalNameEl) goalNameEl.textContent = objetivo.nome;

  /* Começa pela triagem do objetivo */
  fila = objetivo.triagem.map(q => ({ ...q, fase: 'triagem' }));
  idx  = 0;
  render();
}


/* ════════════════════════════════════════
   RENDERIZAÇÃO DA PERGUNTA ATUAL
════════════════════════════════════════ */

function render() {
  const q = fila[idx];
  if (!q) return;

  /* Monta o HTML do card conforme o tipo */
  let controlHTML = '';

  if (q.tipo === 'sim-nao') {
    controlHTML = `
      <div class="pa-choice-grid" data-tipo="sim-nao">
        <button class="pa-choice" type="button" data-value="sim">
          <span class="pa-choice-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span class="pa-choice-label">Sim</span>
        </button>
        <button class="pa-choice" type="button" data-value="nao">
          <span class="pa-choice-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
          <span class="pa-choice-label">Não</span>
        </button>
      </div>`;
  }

  else if (q.tipo === 'opcoes') {
    const opts = q.opcoes.map(o => `
      <button class="pa-option" type="button" data-value="${o.value}">
        <span class="pa-option-label">${o.label}</span>
        <span class="pa-option-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      </button>`).join('');
    controlHTML = `<div class="pa-option-list" data-tipo="opcoes">${opts}</div>`;
  }

  else if (q.tipo === 'escala') {
    const saved = respostas[q.id];
    const val   = (saved === undefined || saved === null) ? 5 : saved;
    controlHTML = `
      <div class="pa-scale" data-tipo="escala">
        <div class="pa-scale-value"><span id="scaleDisplay">${val}</span><span class="pa-scale-max">/10</span></div>
        <input type="range" class="pa-scale-slider" id="scaleSlider" min="0" max="10" step="1" value="${val}">
        <div class="pa-scale-legend"><span>Nada</span><span>Muito</span></div>
      </div>`;
  }

  const dicaHTML = q.dica ? `<p class="pa-hint">${q.dica}</p>` : '';

  cardEl.innerHTML = `
    <div class="pa-qwrap">
      <span class="pa-qbadge">Pergunta ${idx + 1}</span>
      <h2 class="pa-question">${q.texto}</h2>
      ${dicaHTML}
      <div class="pa-control">${controlHTML}</div>
      <p class="pa-field-error" id="fieldError"></p>
    </div>`;

  bindControls(q);
  restoreAnswer(q);
  updateUI();

  /* Animação de entrada */
  cardEl.classList.remove('pa-enter', 'pa-enter-back');
  void cardEl.offsetWidth;
  cardEl.classList.add('pa-enter');
}

/* ── Liga os eventos dos controles renderizados ── */
function bindControls(q) {
  if (q.tipo === 'sim-nao') {
    cardEl.querySelectorAll('.pa-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        cardEl.querySelectorAll('.pa-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        respostas[q.id] = btn.dataset.value;
        clearError();
        /* Sim/Não: avança automaticamente com leve atraso (feedback visual) */
        setTimeout(() => advance(), 260);
      });
    });
  }

  else if (q.tipo === 'opcoes') {
    cardEl.querySelectorAll('.pa-option').forEach(btn => {
      btn.addEventListener('click', () => {
        cardEl.querySelectorAll('.pa-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        respostas[q.id] = btn.dataset.value;
        clearError();
        setTimeout(() => advance(), 280);
      });
    });
  }

  else if (q.tipo === 'escala') {
    const slider  = cardEl.querySelector('#scaleSlider');
    const display = cardEl.querySelector('#scaleDisplay');
    const paint = () => {
      const pct = (slider.value / 10) * 100;
      slider.style.background = `linear-gradient(to right, #6AAB71 ${pct}%, #273041 ${pct}%)`;
      display.textContent = slider.value;
      respostas[q.id] = parseInt(slider.value, 10);
    };
    slider.addEventListener('input', paint);
    /* Valor inicial já registrado */
    respostas[q.id] = parseInt(slider.value, 10);
    paint();
  }
}

/* ── Restaura seleção anterior ao voltar ── */
function restoreAnswer(q) {
  const val = respostas[q.id];
  if (val === undefined || val === null) return;

  if (q.tipo === 'sim-nao') {
    const btn = cardEl.querySelector(`.pa-choice[data-value="${val}"]`);
    if (btn) btn.classList.add('selected');
  } else if (q.tipo === 'opcoes') {
    const btn = cardEl.querySelector(`.pa-option[data-value="${val}"]`);
    if (btn) btn.classList.add('selected');
  }
}


/* ════════════════════════════════════════
   NAVEGAÇÃO
════════════════════════════════════════ */

function updateUI() {
  const q = fila[idx];

  /* Total é dinâmico: perguntas já enfileiradas (a fila cresce por fase) */
  stepNumEl.textContent   = idx + 1;
  stepTotalEl.textContent = fila.length;
  faseLabelEl.textContent = FASES[q.fase] || '';

  /* Progresso: 3 fases de peso igual, com fração dentro da fase atual */
  progressFill.style.width = `${progressoPercentual()}%`;

  backBtn.disabled = idx === 0;
  clearError();
}

/* Progresso estimado em 3 blocos (triagem / categoria / subcategoria) */
function progressoPercentual() {
  const q = fila[idx];
  const blocos = { triagem: 0, categoria: 1, subcategoria: 2 };
  const bloco  = blocos[q.fase] ?? 0;

  /* Perguntas da fase atual dentro da fila */
  const idxsFase = fila
    .map((f, i) => (f.fase === q.fase ? i : -1))
    .filter(i => i >= 0);
  const posNaFase = idxsFase.indexOf(idx);
  const fracao    = (posNaFase + 1) / idxsFase.length;

  return Math.min(100, Math.round(((bloco + fracao) / 3) * 100));
}

function advance() {
  if (transitioning) return;

  const q = fila[idx];
  if (respostas[q.id] === undefined || respostas[q.id] === null || respostas[q.id] === '') {
    showError('Selecione uma opção para continuar.');
    shakeCard();
    return;
  }

  /* Se esta é a última pergunta da fase atual, faz a classificação e enfileira a próxima fase */
  const ultimaDaFase = ehUltimaDaFase();

  if (ultimaDaFase) {
    const avancou = classificarEEnfileirar(q.fase);
    if (!avancou) return; /* fluxo terminou → foi para o resultado */
  }

  if (idx < fila.length - 1) {
    goTo(idx + 1, 'forward');
  }
}

function ehUltimaDaFase() {
  const q = fila[idx];
  /* É a última se não existe pergunta seguinte com a MESMA fase depois dela */
  for (let i = idx + 1; i < fila.length; i++) {
    if (fila[i].fase === q.fase) return false;
  }
  return true;
}

/* Após concluir uma fase, classifica e adiciona as perguntas da próxima fase */
function classificarEEnfileirar(fase) {
  if (fase === 'triagem') {
    const catKey = classificar(objetivo.categorias);
    resultado.categoria = catKey;
    catNode = objetivo.categorias[catKey];
    /* Enfileira perguntas da categoria */
    fila = fila.concat(catNode.perguntas.map(p => ({ ...p, fase: 'categoria' })));
    return true;
  }

  if (fase === 'categoria') {
    const subKey = classificar(catNode.subcategorias);
    resultado.subcategoria = subKey;
    subNode = catNode.subcategorias[subKey];
    fila = fila.concat(subNode.perguntas.map(p => ({ ...p, fase: 'subcategoria' })));
    return true;
  }

  if (fase === 'subcategoria') {
    resultado.dieta = escolherDieta(subNode);
    finalizar();
    return false;
  }

  return true;
}


/* ════════════════════════════════════════
   MOTOR DE CLASSIFICAÇÃO (pontuação)
════════════════════════════════════════ */

/* Recebe um mapa { chave: { criterios: [...] } } e devolve a chave vencedora */
function classificar(mapa) {
  let melhorChave  = null;
  let melhorPonto  = -1;

  for (const chave of Object.keys(mapa)) {
    const criterios = mapa[chave].criterios || [];
    let ponto = 0;
    for (const c of criterios) {
      if (criterioSatisfeito(c)) ponto++;
    }
    if (ponto > melhorPonto) {
      melhorPonto = ponto;
      melhorChave = chave;
    }
  }
  return melhorChave;
}

/* Verifica se um critério { pergunta, valor } bate com a resposta registrada */
function criterioSatisfeito(c) {
  const resp = respostas[c.pergunta];
  if (resp === undefined || resp === null) return false;

  const esperado = c.valor;

  /* Faixa de escala: { min, max } */
  if (esperado && typeof esperado === 'object' && !Array.isArray(esperado)) {
    const n = Number(resp);
    return n >= esperado.min && n <= esperado.max;
  }

  /* Lista de valores aceitáveis */
  if (Array.isArray(esperado)) {
    return esperado.includes(resp);
  }

  /* Valor único */
  return resp === esperado;
}

/* Escolhe Dieta 1 ou Dieta 2 comparando as respostas da subcategoria com `compat` */
function escolherDieta(sub) {
  const d1 = sub.dietas.dieta1.compat;
  const d2 = sub.dietas.dieta2.compat;

  let p1 = 0, p2 = 0;
  for (const qId of Object.keys(d1)) {
    const resp = respostas[qId];
    if (resp === undefined) continue;
    if (d1[qId] !== 'ambos' && d1[qId] === resp) p1++;
  }
  for (const qId of Object.keys(d2)) {
    const resp = respostas[qId];
    if (resp === undefined) continue;
    if (d2[qId] !== 'ambos' && d2[qId] === resp) p2++;
  }

  /* Empate favorece a Dieta 1 (padrão da documentação) */
  return p2 > p1 ? 'dieta2' : 'dieta1';
}


/* ════════════════════════════════════════
   TRANSIÇÃO ENTRE PERGUNTAS
════════════════════════════════════════ */

function goTo(nextIdx, direction) {
  if (transitioning) return;
  transitioning = true;

  const exit = direction === 'forward' ? 'pa-exit' : 'pa-exit-back';
  cardEl.classList.remove('pa-enter', 'pa-enter-back');
  cardEl.classList.add(exit);

  setTimeout(() => {
    cardEl.classList.remove(exit);
    idx = nextIdx;
    render();
    if (direction === 'back') {
      cardEl.classList.remove('pa-enter');
      cardEl.classList.add('pa-enter-back');
    }
    transitioning = false;
  }, 240);
}

backBtn.addEventListener('click', () => {
  if (idx > 0) goTo(idx - 1, 'back');
});

continueBtn.addEventListener('click', advance);

/* Enter avança */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.repeat) return;
  if (resultMain.classList.contains('active')) return;
  e.preventDefault();
  advance();
});


/* ════════════════════════════════════════
   FINALIZAÇÃO — monta o plano alimentar
════════════════════════════════════════ */

function finalizar() {
  const dieta = subNode.dietas[resultado.dieta];

  /* Persiste o resultado completo */
  const payload = {
    ...resultado,
    objetivoNome:     objetivo.nome,
    categoriaNome:    catNode.nome,
    subcategoriaNome: subNode.nome,
    dietaTitulo:      dieta.titulo,
    dietaObjetivo:    dieta.objetivo,
    refeicoes:        dieta.refeicoes,
    respostas:        { ...respostas },
    completedAt:      new Date().toISOString(),
  };
  localStorage.setItem('wellness_plano', JSON.stringify(payload));

  /* Botão em estado de carregamento */
  continueBtn.classList.add('loading');
  continueBtn.disabled = true;

  setTimeout(() => renderResultado(payload), 900);
}

function renderResultado(p) {
  progressFill.style.width = '100%';

  const numeroDieta = p.dieta === 'dieta1' ? '1' : '2';

  const refeicoesHTML = p.refeicoes.map((r, i) => `
    <div class="pa-meal reveal" style="--d:${i * 0.06}s">
      <div class="pa-meal-head">
        <span class="pa-meal-ico">${mealIcon(r.nome)}</span>
        <span class="pa-meal-name">${r.nome}</span>
      </div>
      <ul class="pa-meal-items">
        ${r.itens.map(it => `<li>${it}</li>`).join('')}
      </ul>
    </div>`).join('');

  resultMain.innerHTML = `
    <div class="pa-result">

      <div class="pa-result-hero reveal">
        <div class="pa-result-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Plano gerado
        </div>
        <h1 class="pa-result-title">Seu plano alimentar<br><em>personalizado</em></h1>
        <p class="pa-result-sub">Baseado no seu comportamento alimentar, hábitos e perfil — não apenas no seu objetivo.</p>
      </div>

      <div class="pa-path reveal" style="--d:.08s">
        <div class="pa-path-item">
          <span class="pa-path-label">Objetivo</span>
          <span class="pa-path-value">${p.objetivoNome}</span>
        </div>
        <span class="pa-path-arrow">→</span>
        <div class="pa-path-item">
          <span class="pa-path-label">Categoria</span>
          <span class="pa-path-value">${p.categoriaNome}</span>
        </div>
        <span class="pa-path-arrow">→</span>
        <div class="pa-path-item">
          <span class="pa-path-label">Subcategoria</span>
          <span class="pa-path-value">${p.subcategoriaNome}</span>
        </div>
      </div>

      <div class="pa-diet-card reveal" style="--d:.14s">
        <span class="pa-diet-tag">Dieta ${numeroDieta}</span>
        <h2 class="pa-diet-title">${p.dietaTitulo}</h2>
        <p class="pa-diet-desc">${p.dietaObjetivo}</p>
      </div>

      <div class="pa-meals">
        ${refeicoesHTML}
      </div>

      <div class="pa-result-actions reveal">
        <button class="pa-btn-primary" id="goDashboard">
          Ir para o Aplicativo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="pa-btn-ghost" id="restartQuiz">Refazer questionário</button>
      </div>

    </div>`;

  /* Troca de telas */
  quizMain.classList.remove('active');
  quizMain.classList.add('hidden');
  document.querySelector('.pa-footer').classList.add('hidden');
  resultMain.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Ações */
  document.getElementById('goDashboard').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
  document.getElementById('restartQuiz').addEventListener('click', () => {
    window.location.href = 'perguntas-adaptativas.html';
  });

  /* Reveal on scroll */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  resultMain.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* Ícone SVG por tipo de refeição */
function mealIcon(nome) {
  const n = nome.toLowerCase();
  if (n.includes('café')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
  }
  if (n.includes('almoço')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M5 2v20"/><path d="M18 2v20"/><path d="M18 2a3 3 0 0 0-3 3v6h3"/></svg>`;
  }
  if (n.includes('jantar')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`;
  }
  if (n.includes('ceia')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
  /* Lanche */
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2 1 3H8a6 6 0 0 0-6 6c0 3 2 5 5 5h10c3 0 5-2 5-5a6 6 0 0 0-6-6h-2c0-1 1-1.5 1-3a3 3 0 0 0-3-3z"/></svg>`;
}


/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */

function showError(msg) {
  const el = document.getElementById('fieldError');
  if (el) el.textContent = msg;
}
function clearError() {
  const el = document.getElementById('fieldError');
  if (el) el.textContent = '';
}
function shakeCard() {
  cardEl.classList.add('pa-shake');
  cardEl.addEventListener('animationend', () => cardEl.classList.remove('pa-shake'), { once: true });
}


/* ════════════════════════════════════════
   START
════════════════════════════════════════ */

init();
