/* ============================================================
   WELLNESS — continuar-perfil.js
   Tela de escolha de personalização adicional
   ============================================================ */

/* ── Botão Primário: Continuar Personalização ── */
document.getElementById('cpBtnContinue').addEventListener('click', () => {
    const btn = document.getElementById('cpBtnContinue');
    btn.textContent = 'Iniciando personalização...';
    btn.disabled = true;

    /* Redireciona para as perguntas adaptativas (próxima tela a ser criada) */
    setTimeout(() => {
        window.location.href = 'index.html'; /* substituir pela tela de perguntas adaptativas */
    }, 1000);
});


/* ── Botão Secundário: Ir para o Aplicativo ── */
document.getElementById('cpBtnApp').addEventListener('click', () => {
    window.location.href = 'index.html';
});
