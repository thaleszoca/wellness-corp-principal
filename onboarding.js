const TOTAL = 5;
let current = 0;

const slides = [
    {
        title: 'Sua jornada começa aqui',
        text:  'Descubra hábitos, estratégias e recomendações criadas para a sua realidade.'
    },
    {
        title: 'Alimentação feita para você',
        text:  'Receba sugestões personalizadas com base nos seus objetivos e comportamento alimentar.'
    },
    {
        title: 'Construa hábitos duradouros',
        text:  'Acompanhe sua evolução diariamente através de metas simples e consistentes.'
    },
    {
        title: 'Bem-estar vai além da alimentação',
        text:  'Cuide da mente, do corpo e da sua rotina com orientações inteligentes.'
    },
    {
        title: 'Seu plano será único',
        text:  'Nossa avaliação identifica seu perfil e cria uma experiência personalizada para você.'
    }
];

/* Elementos */
const imgs       = document.querySelectorAll('.ob-img');
const content    = document.getElementById('obContent');
const titleEl    = document.getElementById('obTitle');
const textEl     = document.getElementById('obText');
const dots       = document.querySelectorAll('.ob-dot');
const btnCta     = document.getElementById('obBtn');
const btnPrev    = document.getElementById('obPrev');
const btnNext    = document.getElementById('obNext');

function goTo(index) {
    if (index < 0 || index >= TOTAL) return;

    /* Fade content out */
    content.classList.add('fading');

    setTimeout(() => {

        /* Troca de imagem */
        imgs[current].classList.remove('is-active');
        current = index;
        imgs[current].classList.add('is-active');

        /* Atualiza texto */
        titleEl.textContent = slides[current].title;
        textEl.textContent  = slides[current].text;

        /* Atualiza dots */
        dots.forEach((d, i) => d.classList.toggle('ob-dot--active', i === current));

        /* Mostra/oculta setas nas extremidades */
        btnPrev.classList.toggle('hidden', current === 0);
        btnNext.classList.toggle('hidden', current === TOTAL - 1);

        /* Fade content in */
        content.classList.remove('fading');

    }, 280);
}

/* Estado inicial: esconde seta esquerda no primeiro slide */
btnPrev.classList.add('hidden');

/* Setas */
btnPrev.addEventListener('click', () => goTo(current - 1));
btnNext.addEventListener('click', () => goTo(current + 1));

/* Botão CTA — vai direto para avaliação */
btnCta.addEventListener('click', () => {
    window.location.href = 'avaliacao.html';
});

/* Swipe (mobile) */
let tx = 0, ty = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }
}, { passive: true });

/* Teclado */
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft')  goTo(current - 1);
});
