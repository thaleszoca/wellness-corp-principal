/* ============================================================
   WELLNESS — theme-toggle.js
   Aplica o tema IMEDIATAMENTE (evita flash) e gerencia o botão
   ============================================================ */

/* Aplica o tema salvo antes do primeiro paint */
(function () {
    var saved = localStorage.getItem('wellness-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
})();

/* Botão de alternância — inicializa após DOM carregar */
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    /* Atualiza o label do botão conforme o tema atual */
    function syncLabel() {
        var theme = document.documentElement.getAttribute('data-theme');
        var labelEl = btn.querySelector('.tt-label');
        var moonEl  = btn.querySelector('.tt-moon');
        var sunEl   = btn.querySelector('.tt-sun');

        if (theme === 'light') {
            if (labelEl) labelEl.textContent = 'Escuro';
            if (moonEl) moonEl.style.display = 'block';
            if (sunEl)  sunEl.style.display  = 'none';
        } else {
            if (labelEl) labelEl.textContent = 'Claro';
            if (moonEl) moonEl.style.display = 'none';
            if (sunEl)  sunEl.style.display  = 'block';
        }
    }

    /* Alterna entre os temas */
    btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next    = current === 'dark' ? 'light' : 'dark';

        /* Transição suave */
        document.documentElement.style.transition = 'background 0.35s ease, color 0.35s ease';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('wellness-theme', next);
        syncLabel();

        setTimeout(function () {
            document.documentElement.style.transition = '';
        }, 400);
    });

    syncLabel();
});
