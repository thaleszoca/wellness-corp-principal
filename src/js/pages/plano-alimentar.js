/* ============================================================
   WELLNESS — plano-alimentar.js
   Tela de dieta no estilo "diário alimentar" (desktop).

   Lê o resultado do questionário salvo em localStorage
   (wellness_plano) e monta:
     • uma barra-resumo com o total de calorias do dia
       (adaptada ao plano fixo — sem Net/Exercise);
     • um cartão por refeição, com cada alimento exibindo
       emoji, calorias e porção (fonte: alimentos.js).

   Interações:
     • clicar no cartão da refeição → abre um MODAL com os
       detalhes da refeição (cada alimento + explicação);
     • botão "?" ao lado de cada alimento → POP-OVER flutuante
       com a explicação de "por que comer" (ligada ao objetivo).

   As calorias/porções/explicações vêm de WELLNESS_ALIMENTO() — são
   estimativas de referência para exibição, não prescrição.
   ============================================================ */

const plContent = document.getElementById('plContent');
const plano = JSON.parse(localStorage.getItem('wellness_plano') || 'null');

let REFEICOES = [];   // refeições computadas (com itens + porque + total)

/* ── Estado do dia (concluir refeições) — salvo por data ── */
function chaveDoDia() {
  const n = new Date();
  const mm = String(n.getMonth() + 1).padStart(2, '0');
  const dd = String(n.getDate()).padStart(2, '0');
  return `${n.getFullYear()}-${mm}-${dd}`;
}
const DIA_KEY = 'wellness_dia_' + chaveDoDia();
let diaState = JSON.parse(localStorage.getItem(DIA_KEY) || 'null') || { done: [], finalized: false };
function salvarDia() { localStorage.setItem(DIA_KEY, JSON.stringify(diaState)); }

/* Mensagens motivacionais ao finalizar o dia */
const MSG_FIM_DIA = [
  'Mais um dia cuidando de você. É a soma dos dias que constrói a mudança.',
  'Você honrou seu plano hoje. Constância vence a motivação.',
  'Cada refeição concluída é uma promessa cumprida a si mesmo.',
  'Disciplina é uma forma de amor próprio — e hoje você praticou.',
  'Progresso, não perfeição. E hoje você progrediu.',
  'Pequenos hábitos, grandes mudanças. Continue assim amanhã.',
];

/* ── Data formatada (topo estilo diário) ── */
function dataHoje() {
  const dias  = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  return `${dias[now.getDay()]}, ${now.getDate()} ${meses[now.getMonth()]}`;
}

/* ── Ícone SVG por refeição (mesma linguagem do questionário) ── */
function mealIcon(nome) {
  const n = (nome || '').toLowerCase();
  if (n.includes('café'))   return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
  if (n.includes('almoço')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M5 2v20"/><path d="M18 2v20"/><path d="M18 2a3 3 0 0 0-3 3v6h3"/></svg>`;
  if (n.includes('jantar')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`;
  if (n.includes('ceia'))   return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2 1 3H8a6 6 0 0 0-6 6c0 3 2 5 5 5h10c3 0 5-2 5-5a6 6 0 0 0-6-6h-2c0-1 1-1.5 1-3a3 3 0 0 0-3-3z"/></svg>`;
}

/* Cores das fatias da barra empilhada (rotação) */
const FATIA_CORES = ['#6AAB71', '#7FB98B', '#94C79F', '#A9D4B3', '#5F9D66', '#8AC0A0'];

/* Ícone "?" (interrogação) */
const ICON_WHY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

/* HTML de um alimento (lista principal — sem botões; card é clicável) */
function foodHTML(it) {
  return `
    <li class="pl-food">
      <span class="pl-food-thumb">
        <span class="pl-food-emoji">${it.emoji}</span>
        <span class="pl-food-badge" aria-hidden="true">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      </span>
      <div class="pl-food-info">
        <span class="pl-food-name">${it.nome}</span>
        <span class="pl-food-meta">${it.kcal} cal &middot; ${it.porcao}</span>
      </div>
    </li>`;
}

/* ── Estado vazio (sem plano gerado) ── */
function renderVazio() {
  plContent.innerHTML = `
    <div class="pl-empty">
      <div class="pl-empty-ico">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>
      <h1 class="pl-empty-title">Seu plano ainda não está pronto</h1>
      <p class="pl-empty-desc">Responda o questionário comportamental para gerarmos sua orientação alimentar personalizada.</p>
      <button class="pl-btn-primary" id="plGoQuiz">Fazer o questionário
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>`;
  const b = document.getElementById('plGoQuiz');
  if (b) b.addEventListener('click', () => { window.location.href = '../onboarding/perguntas-adaptativas.html'; });
}

/* ── Render principal ── */
function renderPlano(p) {
  const objetivo = p.objetivo;
  REFEICOES = (p.refeicoes || []).map(r => {
    const itens = (r.itens || []).map(nome => WELLNESS_ALIMENTO(nome, objetivo));
    const total = itens.reduce((s, it) => s + (it.kcal || 0), 0);
    return { nome: r.nome, itens, total };
  });

  const totalDia = REFEICOES.reduce((s, r) => s + r.total, 0);
  const nRefeicoes = REFEICOES.length;
  const media = nRefeicoes ? Math.round(totalDia / nRefeicoes) : 0;
  const numeroDieta = p.dieta === 'dieta1' ? '1' : '2';

  /* Barra empilhada (proporção de cada refeição no total) */
  const segmentos = REFEICOES.map((r, i) => {
    const pct = totalDia ? (r.total / totalDia) * 100 : 0;
    const cor = FATIA_CORES[i % FATIA_CORES.length];
    return `<span class="pl-stack-seg" style="width:${pct}%;background:${cor}" title="${r.nome}: ${r.total} cal"></span>`;
  }).join('');

  const legenda = REFEICOES.map((r, i) => `
    <span class="pl-legend-item">
      <span class="pl-legend-dot" style="background:${FATIA_CORES[i % FATIA_CORES.length]}"></span>
      ${r.nome} <b>${r.total}</b>
    </span>`).join('');

  /* Cartões de refeição */
  const mealsHTML = REFEICOES.map((r, i) => {
    const itensHTML = r.itens.map(it => foodHTML(it)).join('');
    return `
      <article class="pl-meal reveal" style="--d:${i * 0.05}s" data-meal="${i}" role="button" tabindex="0" aria-label="Ver detalhes de ${r.nome}">
        <span class="pl-meal-doneflag" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Concluída
        </span>
        <header class="pl-meal-head">
          <span class="pl-meal-ico">${mealIcon(r.nome)}</span>
          <div class="pl-meal-titles">
            <h2 class="pl-meal-name">${r.nome}</h2>
            <span class="pl-meal-sub">${r.itens.length} ${r.itens.length === 1 ? 'item' : 'itens'} &middot; toque para detalhes</span>
          </div>
          <span class="pl-meal-kcal">${r.total}<em>cal</em></span>
        </header>
        <ul class="pl-food-list">${itensHTML}</ul>
      </article>`;
  }).join('');

  plContent.innerHTML = `
    <div class="pl-wrap">

      <!-- Barra de data (estilo diário) -->
      <div class="pl-datebar">
        <button class="pl-date-arrow" type="button" aria-label="Dia anterior" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="pl-date-label">${dataHoje()}</span>
        <button class="pl-date-arrow" type="button" aria-label="Próximo dia" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- Resumo de calorias (adaptado ao plano fixo) -->
      <section class="pl-summary reveal">
        <div class="pl-summary-main">
          <div class="pl-summary-total">
            <span class="pl-summary-num">${totalDia.toLocaleString('pt-BR')}</span>
            <span class="pl-summary-unit">cal / dia</span>
          </div>
          <div class="pl-summary-pills">
            <span class="pl-pill"><b>${nRefeicoes}</b> refeições</span>
            <span class="pl-pill"><b>${media}</b> cal / refeição</span>
            <span class="pl-pill pl-pill--tag">Cardápio ${numeroDieta}</span>
          </div>
        </div>

        <div class="pl-summary-bar">
          <div class="pl-stack">${segmentos}</div>
          <div class="pl-legend">${legenda}</div>
        </div>
      </section>

      <!-- Cabeçalho da orientação -->
      <div class="pl-plan-head reveal" style="--d:.04s">
        <span class="pl-plan-tag">Sua orientação · ${p.objetivoNome || ''}</span>
        <h1 class="pl-plan-title">${p.dietaTitulo || 'Plano alimentar'}</h1>
        ${p.dietaObjetivo ? `<p class="pl-plan-desc">${p.dietaObjetivo}</p>` : ''}
        <div class="pl-plan-path">
          ${p.categoriaNome ? `<span class="pl-path-chip">${p.categoriaNome}</span>` : ''}
          ${p.subcategoriaNome ? `<span class="pl-path-arrow">→</span><span class="pl-path-chip">${p.subcategoriaNome}</span>` : ''}
        </div>
      </div>

      <!-- Refeições -->
      <div class="pl-meals">${mealsHTML}</div>

      <!-- Finalizar o dia -->
      <section class="pl-finish reveal">
        <div class="pl-finish-info">
          <span class="pl-finish-count"><b id="doneCount">0</b> de ${nRefeicoes} refeições concluídas</span>
          <div class="pl-finish-track"><div class="pl-finish-fill" id="finishFill"></div></div>
        </div>
        <div class="pl-finish-actions">
          <button class="pl-reset-btn" id="resetBtn" type="button" hidden>Reiniciar dia</button>
          <button class="pl-finish-btn" id="finishBtn" type="button" disabled>
            <span class="pl-finish-btn-label">Finalizar o dia</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </section>

      <p class="pl-disclaimer reveal">Os valores de calorias, porções e explicações são estimativas de referência para orientação. Para prescrição individualizada, consulte um nutricionista.</p>

    </div>`;

  wireInteractions();
  sincronizarDia();

  /* Reveal on scroll */
  const reveals = plContent.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  reveals.forEach(el => obs.observe(el));
  setTimeout(() => reveals.forEach(el => el.classList.add('visible')), 1000);
}

/* ════════════ INTERAÇÕES ════════════ */
function wireInteractions() {
  plContent.addEventListener('click', (e) => {
    /* Clique no cartão da refeição → modal (com "?" e "Concluir" dentro) */
    const meal = e.target.closest('.pl-meal');
    if (meal) { abrirModal(+meal.dataset.meal); }
  });

  const finishBtn = plContent.querySelector('#finishBtn');
  if (finishBtn) finishBtn.addEventListener('click', () => {
    if (!finishBtn.disabled) finalizarDia();
  });

  const resetBtn = plContent.querySelector('#resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', reiniciarDia);

  /* Teclado: Enter/Espaço no cartão da refeição */
  plContent.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const meal = e.target.closest('.pl-meal');
    if (meal && !e.target.closest('.pl-food-why')) { e.preventDefault(); abrirModal(+meal.dataset.meal); }
  });
}

/* ── CONCLUIR REFEIÇÕES / FINALIZAR O DIA ── */
function toggleConcluir(idx) {
  if (diaState.finalized) return;               // dia já finalizado → travado
  const pos = diaState.done.indexOf(idx);
  if (pos === -1) diaState.done.push(idx);
  else diaState.done.splice(pos, 1);
  salvarDia();
  sincronizarDia();
}

function sincronizarDia() {
  const total = REFEICOES.length;
  const cards = plContent.querySelectorAll('.pl-meal');
  cards.forEach(card => {
    const i = +card.dataset.meal;
    card.classList.toggle('pl-meal--done', diaState.done.includes(i));
  });
  /* se o modal de uma refeição estiver aberto, reflete o estado no botão dele */
  const modalDone = document.querySelector('.pl-modal-done');
  if (modalDone) atualizarBotaoModal(modalDone, +modalDone.dataset.meal);

  const feitas = diaState.done.length;
  const countEl = plContent.querySelector('#doneCount');
  const fillEl  = plContent.querySelector('#finishFill');
  const finishBtn = plContent.querySelector('#finishBtn');
  const finishLabel = finishBtn && finishBtn.querySelector('.pl-finish-btn-label');
  if (countEl) countEl.textContent = feitas;
  if (fillEl)  fillEl.style.width = total ? `${(feitas / total) * 100}%` : '0%';

  const todas = total > 0 && feitas === total;
  if (finishBtn) {
    if (diaState.finalized) {
      finishBtn.disabled = true;
      finishBtn.classList.add('is-finalized');
      if (finishLabel) finishLabel.textContent = 'Dia finalizado';
    } else {
      finishBtn.disabled = !todas;
      finishBtn.classList.remove('is-finalized');
      finishBtn.classList.toggle('is-ready', todas);
      if (finishLabel) finishLabel.textContent = todas ? 'Finalizar o dia' : `Conclua as refeições (${feitas}/${total})`;
    }
  }

  /* Botão "Reiniciar dia" aparece quando há progresso ou dia finalizado */
  const resetBtn = plContent.querySelector('#resetBtn');
  if (resetBtn) resetBtn.hidden = !(diaState.finalized || feitas > 0);
}

function reiniciarDia() {
  localStorage.removeItem(DIA_KEY);
  diaState = { done: [], finalized: false };
  sincronizarDia();
}

function finalizarDia() {
  diaState.finalized = true;
  /* garante todas marcadas */
  diaState.done = REFEICOES.map((_, i) => i);
  salvarDia();
  sincronizarDia();
  celebrarDia();
}

function celebrarDia() {
  const msg = MSG_FIM_DIA[new Date().getDate() % MSG_FIM_DIA.length];
  const overlay = document.createElement('div');
  overlay.className = 'pl-celebrate';
  overlay.innerHTML = `
    <div class="pl-celebrate-inner">
      <div class="pl-celebrate-logo-wrap">
        <span class="pl-celebrate-ring"></span>
        <span class="pl-celebrate-ring pl-celebrate-ring--2"></span>
        <img src="../../../assets/images/logo-wellness.png" alt="Wellness" class="pl-celebrate-logo">
      </div>
      <span class="pl-celebrate-badge">Dia concluído</span>
      <h2 class="pl-celebrate-title">Você cuidou de você hoje</h2>
      <p class="pl-celebrate-msg">${msg}</p>
      <button class="pl-celebrate-btn" type="button">Voltar para a home</button>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('visible'));
  overlay.querySelector('.pl-celebrate-btn').addEventListener('click', () => {
    transicaoParaInicio(overlay);
  });
}

/* ── POP-OVER "por que comer" ── */
let popEl = null;
function fecharPopover() {
  if (popEl) { popEl.remove(); popEl = null; }
}
function togglePopover(anchor, it) {
  const jaAberto = popEl && popEl.dataset.for === `${anchor.dataset.meal}-${anchor.dataset.food}`;
  fecharPopover();
  if (jaAberto) return;

  const pop = document.createElement('div');
  pop.className = 'pl-pop';
  pop.dataset.for = `${anchor.dataset.meal}-${anchor.dataset.food}`;
  pop.innerHTML = `
    <div class="pl-pop-head"><span class="pl-pop-emoji">${it.emoji}</span><span class="pl-pop-name">${it.nome}</span></div>
    <p class="pl-pop-text">${it.porque}</p>
    <span class="pl-pop-arrow" aria-hidden="true"></span>`;
  document.body.appendChild(pop);
  popEl = pop;
  posicionarPopover(anchor, pop);
}
function posicionarPopover(anchor, pop) {
  const r = anchor.getBoundingClientRect();
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  const margem = 10;
  /* centraliza horizontalmente sobre o botão, preso à viewport */
  let left = r.left + r.width / 2 - pw / 2;
  left = Math.max(margem, Math.min(left, window.innerWidth - pw - margem));
  /* por padrão acima do botão; se não couber, abaixo */
  let top = r.top - ph - 12;
  let dir = 'top';
  if (top < margem) { top = r.bottom + 12; dir = 'bottom'; }
  pop.style.left = `${left + window.scrollX}px`;
  pop.style.top  = `${top + window.scrollY}px`;
  pop.classList.add(`pl-pop--${dir}`);
  /* posiciona a setinha sob o botão */
  const arrow = pop.querySelector('.pl-pop-arrow');
  if (arrow) arrow.style.left = `${r.left + r.width / 2 - left}px`;
  requestAnimationFrame(() => pop.classList.add('visible'));
}

/* fecha o pop-over em clique fora, scroll, resize ou ESC */
document.addEventListener('click', (e) => {
  if (popEl && !e.target.closest('.pl-pop') && !e.target.closest('.pl-food-why')) fecharPopover();
});
window.addEventListener('scroll', fecharPopover, { passive: true });
window.addEventListener('resize', fecharPopover);

/* ── MODAL da refeição ── */
function abrirModal(idx) {
  const r = REFEICOES[idx];
  if (!r) return;
  fecharPopover();

  const itensHTML = r.itens.map((it, j) => `
    <li class="pl-mfood">
      <span class="pl-mfood-thumb">${it.emoji}</span>
      <div class="pl-mfood-body">
        <div class="pl-mfood-top">
          <span class="pl-mfood-name">${it.nome}</span>
          <div class="pl-mfood-right">
            <span class="pl-mfood-kcal">${it.kcal} cal</span>
            <button class="pl-mfood-why-btn" type="button" data-food="${j}" aria-expanded="false" aria-label="Por que comer ${it.nome}?">${ICON_WHY}</button>
          </div>
        </div>
        <span class="pl-mfood-porcao">${it.porcao}</span>
        <p class="pl-mfood-why" id="why-${idx}-${j}" hidden><span class="pl-mfood-why-ico">${ICON_WHY}</span>${it.porque}</p>
      </div>
    </li>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'pl-modal-overlay';
  overlay.innerHTML = `
    <div class="pl-modal" role="dialog" aria-modal="true" aria-label="Detalhes de ${r.nome}">
      <header class="pl-modal-head">
        <span class="pl-modal-ico">${mealIcon(r.nome)}</span>
        <div class="pl-modal-titles">
          <h2 class="pl-modal-name">${r.nome}</h2>
          <span class="pl-modal-sub">${r.itens.length} ${r.itens.length === 1 ? 'item' : 'itens'} &middot; ${r.total} cal no total</span>
        </div>
        <button class="pl-modal-close" type="button" aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </header>
      <ul class="pl-modal-list">${itensHTML}</ul>
      <p class="pl-modal-hint">Toque no <span class="pl-modal-hint-ico">${ICON_WHY}</span> de cada alimento para ver por que ele faz parte da sua orientação.</p>
      <footer class="pl-modal-foot">
        <button class="pl-modal-done" type="button" data-meal="${idx}">
          <span class="pl-done-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
          <span class="pl-done-label">Concluir refeição</span>
        </button>
      </footer>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('visible'));

  /* "?" por alimento → revela/oculta a explicação */
  overlay.querySelectorAll('.pl-mfood-why-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = overlay.querySelector(`#why-${idx}-${btn.dataset.food}`);
      if (!p) return;
      const abrir = p.hidden;
      p.hidden = !abrir;
      btn.classList.toggle('is-open', abrir);
      btn.setAttribute('aria-expanded', String(abrir));
    });
  });

  /* Botão "Concluir refeição" (dentro do modal) */
  const doneBtn = overlay.querySelector('.pl-modal-done');
  atualizarBotaoModal(doneBtn, idx);
  doneBtn.addEventListener('click', () => { toggleConcluir(idx); atualizarBotaoModal(doneBtn, idx); });

  const fechar = () => {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 220);
    document.removeEventListener('keydown', onEsc);
  };
  const onEsc = (e) => { if (e.key === 'Escape') fechar(); };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  overlay.querySelector('.pl-modal-close').addEventListener('click', fechar);
  document.addEventListener('keydown', onEsc);
}

/* Atualiza o botão "Concluir refeição" do modal conforme o estado do dia */
function atualizarBotaoModal(btn, idx) {
  if (!btn) return;
  const feito = diaState.done.includes(idx);
  btn.classList.toggle('is-done', feito);
  btn.disabled = diaState.finalized;
  const label = btn.querySelector('.pl-done-label');
  if (label) label.textContent = feito ? 'Refeição concluída' : 'Concluir refeição';
}

/* Transição: a celebração recolhe numa bolinha verde (folha) que voa até o Início */
const LEAF_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
function transicaoParaInicio(overlay) {
  const alvo = document.querySelector('.wn-nav-item[data-nav="inicio"]');
  const r = alvo ? alvo.getBoundingClientRect()
                 : { left: 36, top: window.innerHeight - 50, width: 48, height: 48 };
  const destX = r.left + r.width / 2;
  const destY = r.top + r.height / 2;
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.42;

  /* a celebração recolhe */
  if (overlay) overlay.classList.add('pl-celebrate--collapse');

  /* bolinha verde com a folha */
  const ball = document.createElement('div');
  ball.className = 'pl-ball';
  ball.innerHTML = LEAF_SVG;
  ball.style.left = startX + 'px';
  ball.style.top = startY + 'px';
  ball.style.setProperty('--dx', (destX - startX) + 'px');
  ball.style.setProperty('--dy', (destY - startY) + 'px');
  document.body.appendChild(ball);
  requestAnimationFrame(() => ball.classList.add('is-flying'));

  /* sinaliza para a Home mostrar "Dieta de hoje concluída" e navega */
  localStorage.setItem('wellness_dia_msg', '1');
  setTimeout(() => { window.location.href = 'home.html'; }, 1120);
}

function planoObjetivoNome() {
  return (plano && plano.objetivoNome) ? plano.objetivoNome.toLowerCase() : 'bem-estar';
}

/* ── Header scroll + voltar ── */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('plHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  const back = document.getElementById('plBackBtn');
  if (back) back.addEventListener('click', () => { window.location.href = 'home.html'; });
});

/* ── Start ── */
if (!plano || !plano.refeicoes || !plano.refeicoes.length) {
  renderVazio();
} else {
  renderPlano(plano);
}
