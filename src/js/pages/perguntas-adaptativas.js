/* ============================================================
   WELLNESS — perguntas-adaptativas.js
   MOTOR DO FLUXO ADAPTATIVO DE 40 PERGUNTAS

   Trilha (spec wellness_project — estrutura-completa-questionario.md):
     Bloco 1 (1–5)   perfil e objetivo    → tela perguntas-essenciais
     Blocos 2–4 (6–20) compartilhadas      → WELLNESS_BANCO.compartilhadas
     Blocos 5–6 (21–30) por objetivo       → WELLNESS_BANCO.objetivos[goal]
       → classifica CATEGORIA (após a 30)
     Bloco 7 (31–35) por categoria         → WELLNESS_BANCO.categorias[cat]
       → classifica SUBCATEGORIA (após a 35)
     Bloco 8 (36–40) personalização        → WELLNESS_BANCO.personalizacao
       → escolhe DIETA e monta o resultado

   Regras:  WELLNESS_REGRAS      (limiares, blocos, segurança)
   Nomes:   WELLNESS_CATEGORIAS / WELLNESS_SUBCATEGORIAS (humanizados)
   Dietas:  WELLNESS_DADOS       (dados.js — refeições/planos)
   Msgs:    WELLNESS_MENSAGENS

   A pontuação é RECALCULADA de forma pura a partir de `respostas` nos
   pontos de decisão — assim voltar e alterar respostas é sempre seguro.
   ============================================================ */

/* ════════════ CONFIG / DEPENDÊNCIAS ════════════ */
const REGRAS = window.WELLNESS_REGRAS;
const BANCO  = window.WELLNESS_BANCO;
const MSG    = window.WELLNESS_MENSAGENS;
const CATS   = window.WELLNESS_CATEGORIAS;
const SUBS   = window.WELLNESS_SUBCATEGORIAS;

const essentials = JSON.parse(localStorage.getItem('wellness_essentials') || '{}');
const goalKey    = essentials.goal;
const objetivoDados = window.WELLNESS_DADOS ? window.WELLNESS_DADOS[goalKey] : null;

/* ════════════ ESTADO ════════════ */
const OFFSET = REGRAS.perguntas_essenciais;   // 5 → perguntas 6..40 são do motor
const TOTAL  = REGRAS.total_perguntas;        // 40

let fila = [];          // perguntas 6..40 (cresce por bloco)
let idx  = 0;           // índice em `fila` (0 → pergunta 6)
let transitioning = false;
let finalizado = false; // trava: o resultado só é gerado/salvo uma vez

const respostas = {};   // { <id>: valor }

let resultado = {
  objetivo: goalKey, categoria: null, subcategoria: null, dieta: null,
  categoriaConfianca: null, safetyFlags: [],
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

/* Rótulos de fase por bloco (topo) */
function faseDoNumero(n) {
  const b = REGRAS.blocos.find(bl => n >= bl.de && n <= bl.ate);
  const rotulos = {
    2:'Alimentação', 3:'Estado mental', 4:'Mente e comida',
    5:'Comportamento', 6:'Confirmação', 7:'Detalhamento', 8:'Personalização',
  };
  return b ? (rotulos[b.n] || 'Perfil') : 'Perfil';
}

/* ════════════ INICIALIZAÇÃO ════════════ */
function init() {
  if (!goalKey || !objetivoDados || !CATS[goalKey]) {
    window.location.href = 'perguntas-essenciais.html';
    return;
  }
  const goalNameEl = document.getElementById('goalName');
  if (goalNameEl) goalNameEl.textContent = objetivoDados.nome;

  /* Fila inicial: blocos 2–4 (compartilhadas) + blocos 5–6 (objetivo) = Q6..Q30 */
  fila = BANCO.compartilhadas.concat(BANCO.objetivos[goalKey] || []);
  idx  = 0;

  /* Mensagem "após a pergunta 5" como abertura */
  mostrarMensagem(5, () => render());
}

/* ════════════ PONTUAÇÃO (recálculo puro) ════════════ */
function tracked_cats() { return Object.keys(CATS[goalKey]); }
function tracked_subs() { return resultado.categoria ? Object.keys(SUBS[resultado.categoria]) : []; }

function computarEstado() {
  const catScores = {}; tracked_cats().forEach(k => catScores[k] = 0);
  const subScores = {}; tracked_subs().forEach(k => subScores[k] = 0);
  const sinais = { ansiedade: 0, culpa_alimentar: false, rotina_corrida: false, ansiedade_alta: false };
  const flags = new Set();

  for (const q of fila) {
    const val = respostas[q.id];
    if (val === undefined || val === null || val === '') continue;
    aplicarEfeitos(q, val, catScores, subScores);
    aplicarSeguranca(q, val, flags);
    aplicarSinais(q, val, sinais);
  }
  sinais.ansiedade_alta = sinais.ansiedade >= 7;
  return { catScores, subScores, sinais, flags };
}

function aplicarEfeitos(q, val, catScores, subScores) {
  const add = (ef) => {
    if (!ef) return;
    ef.forEach(e => {
      if (e.alvo === 'cat' && e.chave in catScores) catScores[e.chave] += e.pts;
      if (e.alvo === 'sub' && e.chave in subScores) subScores[e.chave] += e.pts;
    });
  };
  if (q.tipo === 'escala' && q.efeitos_escala) {
    const n = Number(val);
    q.efeitos_escala.forEach(r => { if (n >= r.min && n <= r.max) add(r.ef); });
  } else if (q.tipo === 'multipla' && Array.isArray(val)) {
    val.forEach(v => add(q.efeitos && q.efeitos[v]));
  } else if (q.efeitos) {
    add(q.efeitos[val]);
  }
}

function aplicarSeguranca(q, val, flags) {
  if (q.tipo === 'multipla' && Array.isArray(val)) {
    (q.opcoes || []).forEach(o => { if (o.safety && val.includes(o.value)) flags.add(o.safety); });
  }
  if (q.safety && q.safety[val]) flags.add(q.safety[val]);
  if (q.tipo === 'escala' && q.safety_escala && Number(val) >= q.safety_escala.min) {
    flags.add(q.safety_escala.flag);
  }
}

function aplicarSinais(q, val, sinais) {
  if (!q.sinal) return;
  if (q.sinal.de === 'valor')       sinais[q.sinal.chave] = Number(val);
  else if (q.sinal.quando)          sinais[q.sinal.chave] = q.sinal.quando.includes(val);
}

/* ════════════ CLASSIFICAÇÃO ════════════ */
function classificarCategoria() {
  const { catScores } = computarEstado();
  const ordem = tracked_cats();
  let winner = ordem[0], best = -Infinity, second = -Infinity;
  for (const k of ordem) {
    if (catScores[k] > best) { second = best; best = catScores[k]; winner = k; }
    else if (catScores[k] > second) { second = catScores[k]; }
  }
  resultado.categoria = winner;
  resultado.categoriaConfianca = {
    pontos: best, segunda: second, diferenca: best - second,
    provavel:   best >= REGRAS.limiares.categoria_provavel,
    confirmada: best >= REGRAS.limiares.categoria_confirmada && (best - second) >= REGRAS.limiares.diferenca_minima,
    scores: { ...catScores },
  };
  /* Reconstrói o Bloco 7 (Q31–35) da categoria vencedora */
  fila = fila.slice(0, 25).concat(BANCO.categorias[winner] || []);
}

function classificarSubcategoria() {
  const { subScores } = computarEstado();
  const ordem = tracked_subs();
  let winner = ordem[0], best = -Infinity;
  for (const k of ordem) if (subScores[k] > best) { best = subScores[k]; winner = k; }
  resultado.subcategoria = winner;
  /* Anexa o Bloco 8 (Q36–40) */
  fila = fila.slice(0, 30).concat(BANCO.personalizacao || []);
}

function escolherDieta() {
  const sub = SUBS[resultado.categoria][resultado.subcategoria];
  const regra = sub.dieta_regra;
  if (!regra) return 'dieta1';
  const ans = respostas[regra.pergunta];
  if (ans === undefined) return REGRAS.dieta.empate_favorece; // padrão dieta1
  return ans === regra.dieta1_se ? 'dieta1' : 'dieta2';
}

/* ════════════ RENDERIZAÇÃO DA PERGUNTA ════════════ */
function numeroAtual() { return OFFSET + 1 + idx; }  // idx 0 → 6

function render() {
  const q = fila[idx];
  if (!q) return;
  let controlHTML = '';

  if (q.tipo === 'sim-nao') {
    controlHTML = `
      <div class="pa-choice-grid" data-tipo="sim-nao">
        <button class="pa-choice" type="button" data-value="sim">
          <span class="pa-choice-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
          <span class="pa-choice-label">Sim</span>
        </button>
        <button class="pa-choice" type="button" data-value="nao">
          <span class="pa-choice-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
          <span class="pa-choice-label">Não</span>
        </button>
      </div>`;
  }
  else if (q.tipo === 'opcoes' || q.tipo === 'frequencia') {
    const opcoes = q.tipo === 'frequencia' ? FREQ_OPCOES : q.opcoes;
    const opts = opcoes.map(o => `
      <button class="pa-option" type="button" data-value="${o.value}">
        <span class="pa-option-label">${o.label}</span>
        <span class="pa-option-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
      </button>`).join('');
    controlHTML = `<div class="pa-option-list" data-tipo="opcoes">${opts}</div>`;
  }
  else if (q.tipo === 'multipla') {
    const opts = q.opcoes.map(o => `
      <button class="pa-option pa-option-multi" type="button" data-value="${o.value}">
        <span class="pa-option-label">${o.label}</span>
        <span class="pa-option-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
      </button>`).join('');
    controlHTML = `<div class="pa-option-list" data-tipo="multipla">${opts}</div>`;
  }
  else if (q.tipo === 'escala') {
    const saved = respostas[q.id];
    const val = (saved === undefined || saved === null) ? 5 : saved;
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
      <span class="pa-qbadge">Pergunta ${numeroAtual()}</span>
      <h2 class="pa-question">${q.texto}</h2>
      ${dicaHTML}
      <div class="pa-control">${controlHTML}</div>
      <p class="pa-field-error" id="fieldError"></p>
    </div>`;

  bindControls(q);
  restoreAnswer(q);
  updateUI();
  cardEl.classList.remove('pa-enter', 'pa-enter-back');
  void cardEl.offsetWidth;
  cardEl.classList.add('pa-enter');
}

const FREQ_OPCOES = [
  { value: 'nunca',          label: 'Nunca' },
  { value: 'raramente',      label: 'Raramente' },
  { value: 'as-vezes',       label: 'Às vezes' },
  { value: 'frequentemente', label: 'Frequentemente' },
  { value: 'quase-sempre',   label: 'Quase sempre' },
];

function bindControls(q) {
  if (q.tipo === 'sim-nao') {
    cardEl.querySelectorAll('.pa-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        cardEl.querySelectorAll('.pa-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        respostas[q.id] = btn.dataset.value;
        clearError();
        setTimeout(advance, 240);
      });
    });
  }
  else if (q.tipo === 'opcoes' || q.tipo === 'frequencia') {
    cardEl.querySelectorAll('.pa-option').forEach(btn => {
      btn.addEventListener('click', () => {
        cardEl.querySelectorAll('.pa-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        respostas[q.id] = btn.dataset.value;
        clearError();
        setTimeout(advance, 260);
      });
    });
  }
  else if (q.tipo === 'multipla') {
    if (!Array.isArray(respostas[q.id])) respostas[q.id] = [];
    cardEl.querySelectorAll('.pa-option-multi').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.value;
        let sel = respostas[q.id] || [];
        const nenhuma = (q.opcoes.find(o => o.value === v) && v === 'nenhuma');
        if (nenhuma) {
          sel = sel.includes('nenhuma') ? [] : ['nenhuma'];
        } else {
          sel = sel.filter(x => x !== 'nenhuma');
          sel = sel.includes(v) ? sel.filter(x => x !== v) : sel.concat(v);
        }
        respostas[q.id] = sel;
        cardEl.querySelectorAll('.pa-option-multi').forEach(b =>
          b.classList.toggle('selected', sel.includes(b.dataset.value)));
        clearError();
      });
    });
  }
  else if (q.tipo === 'escala') {
    const slider = cardEl.querySelector('#scaleSlider');
    const display = cardEl.querySelector('#scaleDisplay');
    const paint = () => {
      const pct = (slider.value / 10) * 100;
      slider.style.background = `linear-gradient(to right, #6AAB71 ${pct}%, #273041 ${pct}%)`;
      display.textContent = slider.value;
      respostas[q.id] = parseInt(slider.value, 10);
    };
    slider.addEventListener('input', paint);
    respostas[q.id] = parseInt(slider.value, 10);
    paint();
  }
}

function restoreAnswer(q) {
  const val = respostas[q.id];
  if (val === undefined || val === null) return;
  if (q.tipo === 'sim-nao') {
    const b = cardEl.querySelector(`.pa-choice[data-value="${val}"]`); if (b) b.classList.add('selected');
  } else if (q.tipo === 'opcoes' || q.tipo === 'frequencia') {
    const b = cardEl.querySelector(`.pa-option[data-value="${val}"]`); if (b) b.classList.add('selected');
  } else if (q.tipo === 'multipla' && Array.isArray(val)) {
    val.forEach(v => { const b = cardEl.querySelector(`.pa-option-multi[data-value="${v}"]`); if (b) b.classList.add('selected'); });
  }
}

/* ════════════ NAVEGAÇÃO ════════════ */
function updateUI() {
  const n = numeroAtual();
  stepNumEl.textContent = n;
  stepTotalEl.textContent = TOTAL;
  faseLabelEl.textContent = faseDoNumero(n);
  progressFill.style.width = `${Math.round((n / TOTAL) * 100)}%`;
  backBtn.disabled = idx === 0;
  clearError();
}

function respostaValida(q) {
  const v = respostas[q.id];
  if (q.tipo === 'multipla') return Array.isArray(v) && v.length > 0;
  return !(v === undefined || v === null || v === '');
}

function advance() {
  if (transitioning) return;
  const q = fila[idx];
  if (!respostaValida(q)) {
    showError(q.tipo === 'multipla' ? 'Selecione ao menos uma opção (ou “Nenhuma dessas”).' : 'Selecione uma opção para continuar.');
    shakeCard();
    return;
  }

  const n = numeroAtual();

  /* Pontos de classificação (recalculam do zero e reconstroem a fila) */
  if (n === REGRAS.classificacao.categoria_apos)    classificarCategoria();
  if (n === REGRAS.classificacao.subcategoria_apos) classificarSubcategoria();

  /* Fim do questionário */
  if (n >= TOTAL) {
    mostrarMensagem(40, () => finalizar());
    return;
  }

  /* Mensagem motivacional nos marcos, depois próxima pergunta */
  if (REGRAS.marcos_mensagem.includes(n) && n !== 5) {
    mostrarMensagem(n, () => goTo(idx + 1, 'forward'));
  } else {
    goTo(idx + 1, 'forward');
  }
}

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
    if (direction === 'back') { cardEl.classList.remove('pa-enter'); cardEl.classList.add('pa-enter-back'); }
    transitioning = false;
  }, 220);
}

backBtn.addEventListener('click', () => { if (idx > 0) goTo(idx - 1, 'back'); });
continueBtn.addEventListener('click', advance);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.repeat) return;
  if (resultMain.classList.contains('active')) return;
  if (document.querySelector('.pa-msg-overlay')) { const b = document.querySelector('.pa-msg-btn'); if (b) b.click(); return; }
  e.preventDefault(); advance();
});

/* ════════════ MENSAGENS MOTIVACIONAIS (overlay) ════════════ */
function mostrarMensagem(marco, onContinue) {
  const texto = escolherTextoMensagem(marco);
  const overlay = document.createElement('div');
  overlay.className = 'pa-msg-overlay';
  overlay.innerHTML = `
    <div class="pa-msg-card">
      <div class="pa-msg-mark">${marco === 40 ? 'Concluído' : `${marco} de ${TOTAL}`}</div>
      <p class="pa-msg-text">${texto}</p>
      <button class="pa-msg-btn" type="button">${marco === 40 ? 'Ver meu resultado' : 'Continuar'}</button>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
  const close = () => {
    overlay.classList.remove('visible');
    setTimeout(() => { overlay.remove(); onContinue && onContinue(); }, 220);
  };
  overlay.querySelector('.pa-msg-btn').addEventListener('click', close);
}

function escolherTextoMensagem(marco) {
  const { sinais } = computarEstado();
  for (const v of MSG.variantes) {
    if (!v.marcos.includes(marco)) continue;
    if (sinais[v.gatilho]) return v.texto;
  }
  return MSG.motivacionais[marco];
}

/* ════════════ FINALIZAÇÃO ════════════ */
function finalizar() {
  if (finalizado) return;   // evita salvar/gerar o resultado mais de uma vez
  finalizado = true;
  const st = computarEstado();
  resultado.safetyFlags = Array.from(st.flags);
  resultado.dieta = escolherDieta();

  const goalNode = objetivoDados;
  const catNode  = goalNode.categorias[resultado.categoria];
  const subNode  = catNode.subcategorias[resultado.subcategoria];
  const dieta    = subNode.dietas[resultado.dieta];

  const catDisp = CATS[goalKey][resultado.categoria];
  const subDisp = SUBS[resultado.categoria][resultado.subcategoria];

  const payload = {
    objetivo: goalKey,
    categoria: resultado.categoria,
    subcategoria: resultado.subcategoria,
    dieta: resultado.dieta,
    objetivoNome: goalNode.nome,
    categoriaNome: catDisp.nome,        // nome humanizado (exibição)
    categoriaInterna: catDisp.interno,
    subcategoriaNome: subDisp.nome,     // nome humanizado (exibição)
    subcategoriaInterna: subDisp.interno,
    categoriaResumo: catDisp.resumo,
    dietaTitulo: dieta.titulo,
    dietaObjetivo: dieta.objetivo,
    refeicoes: dieta.refeicoes,
    confianca: resultado.categoriaConfianca,
    safetyFlags: resultado.safetyFlags,
    respostas: { ...respostas },
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem('wellness_plano', JSON.stringify(payload));
  salvarDietaNoBanco(payload);

  continueBtn.classList.add('loading');
  continueBtn.disabled = true;
  setTimeout(() => renderResultado(payload), 700);
}

/* Envia o resultado ao backend (só grava se estiver logado). Não bloqueia a UI:
   o plano já está salvo no localStorage; se falhar (offline/sem login), segue igual. */
function salvarDietaNoBanco(p) {
  const dados = new FormData();
  dados.append('objetivo',     p.objetivo);
  dados.append('categoria',    p.categoria);
  dados.append('subcategoria', p.subcategoria);
  dados.append('dieta',        p.dieta);
  dados.append('pontuacao',    p.confianca ? String(p.confianca.pontos) : '');

  fetch('../../../backend/dieta/salvar-dieta.php', { method: 'POST', body: dados })
    .catch(() => { /* sem conexão ou não logado — o plano continua salvo localmente */ });
}

function renderResultado(p) {
  progressFill.style.width = '100%';
  const numeroDieta = p.dieta === 'dieta1' ? '1' : '2';

  const nRefeicoes = (p.refeicoes || []).length;

  const safetyHTML = (p.safetyFlags && p.safetyFlags.length) ? `
    <div class="pa-safety reveal" style="--d:.10s">
      <h3 class="pa-safety-title">${MSG.seguranca.titulo}</h3>
      <p class="pa-safety-text">${MSG.seguranca.texto}</p>
      <p class="pa-safety-foot">${MSG.seguranca.rodape}</p>
    </div>` : '';

  resultMain.innerHTML = `
    <div class="pa-result">
      <div class="pa-result-hero reveal">
        <div class="pa-result-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Orientação gerada</div>
        <h1 class="pa-result-title">Sua orientação de<br><em>bem-estar</em></h1>
        <p class="pa-result-sub">Baseada nas suas 40 respostas sobre mente, alimentação e rotina — não apenas no seu objetivo.</p>
      </div>

      <div class="pa-path reveal" style="--d:.08s">
        <div class="pa-path-item"><span class="pa-path-label">Objetivo</span><span class="pa-path-value">${p.objetivoNome}</span></div>
        <span class="pa-path-arrow">→</span>
        <div class="pa-path-item"><span class="pa-path-label">Padrão principal</span><span class="pa-path-value">${p.categoriaNome}</span></div>
        <span class="pa-path-arrow">→</span>
        <div class="pa-path-item"><span class="pa-path-label">Detalhamento</span><span class="pa-path-value">${p.subcategoriaNome}</span></div>
      </div>

      ${p.categoriaResumo ? `<p class="pa-result-resumo reveal" style="--d:.11s">${p.categoriaResumo}</p>` : ''}
      ${safetyHTML}

      <div class="pa-diet-card reveal" style="--d:.14s">
        <span class="pa-diet-tag">Sugestão de cardápio ${numeroDieta}</span>
        <h2 class="pa-diet-title">${p.dietaTitulo}</h2>
        <p class="pa-diet-desc">${p.dietaObjetivo}</p>
        <button class="pa-diet-cta" id="verPlano">
          <span class="pa-diet-cta-txt">Ver meu plano alimentar${nRefeicoes ? ` · ${nRefeicoes} refeições` : ''}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <p class="pa-result-aviso reveal">${MSG.aviso_resultado}</p>

      <div class="pa-result-actions reveal">
        <button class="pa-btn-primary" id="goDashboard">Ir para o Aplicativo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="pa-btn-ghost" id="restartQuiz">Refazer questionário</button>
      </div>
    </div>`;

  quizMain.classList.remove('active'); quizMain.classList.add('hidden');
  const footer = document.querySelector('.pq-footer'); if (footer) footer.classList.add('hidden');
  resultMain.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById('goDashboard').addEventListener('click', () => { window.location.href = '../dashboard/home.html'; });
  document.getElementById('restartQuiz').addEventListener('click', () => { window.location.href = 'perguntas-adaptativas.html'; });
  const verPlano = document.getElementById('verPlano');
  if (verPlano) verPlano.addEventListener('click', () => { window.location.href = '../dashboard/plano-alimentar.html'; });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  resultMain.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function mealIcon(nome) {
  const n = nome.toLowerCase();
  if (n.includes('café')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
  if (n.includes('almoço')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M5 2v20"/><path d="M18 2v20"/><path d="M18 2a3 3 0 0 0-3 3v6h3"/></svg>`;
  if (n.includes('jantar')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`;
  if (n.includes('ceia')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2 1 3H8a6 6 0 0 0-6 6c0 3 2 5 5 5h10c3 0 5-2 5-5a6 6 0 0 0-6-6h-2c0-1 1-1.5 1-3a3 3 0 0 0-3-3z"/></svg>`;
}

/* ════════════ HELPERS ════════════ */
function showError(msg) { const el = document.getElementById('fieldError'); if (el) el.textContent = msg; }
function clearError()   { const el = document.getElementById('fieldError'); if (el) el.textContent = ''; }
function shakeCard() {
  cardEl.classList.add('pa-shake');
  cardEl.addEventListener('animationend', () => cardEl.classList.remove('pa-shake'), { once: true });
}

/* ════════════ START ════════════ */
init();
