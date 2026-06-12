/* ============================================================
   WELLNESS — evolucao-perfil.js
   Tela motivacional de evolução de perfil
   ============================================================ */

/* ── Quotes rotativos ── */
const QUOTES = [
    'Cada resposta torna sua experiência mais personalizada.',
    'Estamos construindo um plano baseado em você.',
    'Pequenos passos geram grandes resultados.',
    'Seu perfil está ficando cada vez mais completo.',
];

let quoteIdx = 0;

function cycleQuote() {
    const textEl = document.getElementById('epQuoteText');
    const dots   = document.querySelectorAll('.ep-dot');

    textEl.classList.add('ep-fading');

    setTimeout(() => {
        quoteIdx = (quoteIdx + 1) % QUOTES.length;
        textEl.textContent = QUOTES[quoteIdx];
        textEl.classList.remove('ep-fading');
        dots.forEach((d, i) => d.classList.toggle('ep-dot--active', i === quoteIdx));
    }, 340);
}

setInterval(cycleQuote, 4500);


/* ── Dados do localStorage ── */
const essentials = JSON.parse(localStorage.getItem('wellness_essentials') || '{}');

if (essentials.goal) {
    const goalMap = {
        'ganhar-massa':         'Ganhar massa muscular é seu foco — seu plano inteiro será orientado para força e hipertrofia.',
        'emagrecer':            'Emagrecer com saúde é seu objetivo — suas recomendações serão voltadas para perda de gordura sustentável.',
        'melhorar-alimentacao': 'Melhorar sua relação com a comida é o que buscamos — um caminho de equilíbrio e prazer.',
    };
    const goalEl = document.getElementById('epGoalText');
    if (goalEl && goalMap[essentials.goal]) goalEl.textContent = goalMap[essentials.goal];
}

if (essentials.bmi) {
    const bmi = essentials.bmi;
    let bmiText = `Seu IMC é ${bmi} — `;

    if      (bmi < 18.5) bmiText += 'abaixo do ideal. Suas recomendações apoiarão um ganho de peso saudável e progressivo.';
    else if (bmi < 25)   bmiText += 'dentro do intervalo saudável. Vamos potencializar ainda mais seu bem-estar.';
    else if (bmi < 30)   bmiText += 'acima do ideal. Seu plano será desenhado para uma evolução gradual e sustentável.';
    else                  bmiText += 'indicando atenção especial. A Wellness vai te acompanhar com cuidado nessa jornada.';

    const bmiEl = document.getElementById('epBmiText');
    if (bmiEl) bmiEl.textContent = bmiText;
}


/* ── Contador animado (easeOutCubic) ── */
function animateCounter(el, target, duration) {
    const start = performance.now();
    const tick  = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}


/* ── IntersectionObserver reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        if (entry.target.classList.contains('ep-stats')) {
            entry.target.querySelectorAll('.ep-stat-num').forEach(el => {
                animateCounter(el, parseInt(el.dataset.target, 10), 680);
            });
        }

        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── Botão CTA ── */
document.getElementById('epBtnContinue').addEventListener('click', () => {
    const btn = document.getElementById('epBtnContinue');
    btn.textContent = 'Preparando sua evolução...';
    btn.disabled = true;

    setTimeout(() => {
        window.location.href = 'index.html'; /* substituir pelas perguntas adaptativas */
    }, 1200);
});
