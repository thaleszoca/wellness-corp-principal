/* ============================================================
   WELLNESS — home.js
   Saudação + card do plano do dia. A navegação (Início, Progresso,
   Plano, Ayla, Perfil) fica na barra inferior (bottom-nav.js).
   ============================================================ */

const userData = JSON.parse(localStorage.getItem('wellness_user')  || '{}');
const plano    = JSON.parse(localStorage.getItem('wellness_plano') || 'null');
const planoPronto = !!(plano && plano.refeicoes && plano.refeicoes.length);

const QUOTES = [
  'Pequenos hábitos criam grandes mudanças.',
  'Constância vence motivação.',
  'Um dia de cada vez. Isso é tudo que precisa.',
  'Progresso, não perfeição.',
  'Cuidar de você é um ato de coragem.',
  'Você merece sentir-se bem.',
  'Saúde começa na mente antes de chegar ao corpo.',
];

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
function quoteDoDia() {
  const t = new Date();
  const dia = Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 86400000);
  return QUOTES[dia % QUOTES.length];
}

document.addEventListener('DOMContentLoaded', () => {
  const nome = userData.name ? `, ${userData.name.split(' ')[0]}` : '';
  document.getElementById('hmGreeting').textContent = `${saudacao()}${nome}`;
  document.getElementById('hmQuote').textContent = quoteDoDia();

  const sub = document.getElementById('hmCoreSub');
  if (sub) sub.textContent = planoPronto ? 'Ver minhas dietas' : 'Montar meu plano';

  const core = document.getElementById('hmCore');
  if (core) core.addEventListener('click', () => {
    window.location.href = planoPronto ? 'plano-alimentar.html' : '../onboarding/perguntas-adaptativas.html';
  });

  /* Chegada da transição do plano: balão "Dieta de hoje concluída" saindo do Início */
  if (localStorage.getItem('wellness_dia_msg') === '1') {
    localStorage.removeItem('wellness_dia_msg');
    setTimeout(mostrarChegadaDieta, 320);
  }
});

function mostrarChegadaDieta() {
  const item = document.querySelector('.wn-nav-item[data-nav="inicio"]');
  if (!item) return;
  const r = item.getBoundingClientRect();
  item.classList.add('wn-arrived');

  const bubble = document.createElement('div');
  bubble.className = 'hm-arrival';
  bubble.innerHTML =
    '<span class="hm-arrival-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' +
    'Dieta de hoje concluída';
  document.body.appendChild(bubble);

  const half = bubble.offsetWidth / 2 || 110;
  const cx = r.left + r.width / 2;
  const left = Math.min(Math.max(cx, 12 + half), window.innerWidth - 12 - half);
  bubble.style.left = left + 'px';
  bubble.style.bottom = (window.innerHeight - r.top + 14) + 'px';
  bubble.style.setProperty('--arrow', (cx - left) + 'px');

  requestAnimationFrame(() => requestAnimationFrame(() => bubble.classList.add('visible')));
  setTimeout(() => {
    bubble.classList.remove('visible');
    item.classList.remove('wn-arrived');
    setTimeout(() => bubble.remove(), 400);
  }, 3400);
}
