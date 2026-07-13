/* ============================================================
   WELLNESS — bottom-nav.js
   Comportamento da barra de navegação inferior (componente wn-).
   Roteia os itens com rota definida; os demais mostram um toast
   "em breve". O item ativo (is-active) apenas rola ao topo.
   ============================================================ */
(function () {
  const ROTAS = {
    inicio: 'home.html',
    plano:  'plano-alimentar.html',
  };
  const LABEL = {
    inicio: 'Início', plano: 'Plano', progresso: 'Progresso',
    ayla: 'Ayla', perfil: 'Perfil',
  };

  function toast(msg) {
    const prev = document.querySelector('.wn-toast');
    if (prev) prev.remove();
    const el = document.createElement('div');
    el.className = 'wn-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('wn-toast--visible')));
    setTimeout(() => { el.classList.remove('wn-toast--visible'); setTimeout(() => el.remove(), 300); }, 2400);
  }

  function init() {
    document.querySelectorAll('.wn-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const nav = item.dataset.nav;
        if (item.classList.contains('is-active')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (ROTAS[nav]) { window.location.href = ROTAS[nav]; }
        else { toast(`${LABEL[nav] || 'Recurso'} chega em breve!`); }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
