/* ── CTA principal ── */
document.getElementById('obBtnPrimary').addEventListener('click', () => {
    window.location.href = 'cadastro.html';
});

/* ── Como funciona ── */
document.getElementById('obBtnHow').addEventListener('click', () => {
    window.location.href = 'como-funciona.html';
});

/* ── Slideshow automático ── */
const slides = document.querySelectorAll('.ob-slide');
const dots   = document.querySelectorAll('.slide-dot');
let current  = 0;
let timer;

function goTo(index) {
    slides[current].classList.remove('ob-slide--active');
    dots[current].classList.remove('slide-dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = index;

    slides[current].classList.add('ob-slide--active');
    dots[current].classList.add('slide-dot--active');
    dots[current].setAttribute('aria-selected', 'true');
}

function next() {
    goTo((current + 1) % slides.length);
}

timer = setInterval(next, 4000);

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(i);
        timer = setInterval(next, 4000);
    });
});

/* Pausa ao hover no slideshow */
const slideshow = document.querySelector('.ob-slideshow');
if (slideshow) {
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', () => { timer = setInterval(next, 4000); });
}

/* ── Efeito de digitação no título (typing/deleting em loop) ── */
(function () {
    const el = document.getElementById('obRotator');
    if (!el) return;

    const rotator = el.closest('.ob-rotator');
    const words   = ['personalizada', 'inteligente', 'adaptativa'];

    const TYPE_SPEED   = 95;    // ms por letra ao digitar
    const DELETE_SPEED = 45;    // ms por letra ao apagar
    const HOLD_TIME    = 1900;  // ms com a palavra completa na tela
    const PAUSE_EMPTY   = 380;  // ms antes de digitar a próxima

    // Respeita usuários que preferem menos movimento: mantém a 1ª palavra fixa
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let wordIndex = 0;
    let charIndex = words[0].length; // 1ª palavra já vem escrita do HTML

    const setTyping = (on) => rotator && rotator.classList.toggle('is-typing', on);

    function type() {
        const word = words[wordIndex];
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex < word.length) {
            setTimeout(type, TYPE_SPEED);
        } else {
            setTyping(false);              // terminou de digitar → cursor pisca
            setTimeout(erase, HOLD_TIME);
        }
    }

    function erase() {
        setTyping(true);                   // apagando → cursor fixo
        const word = words[wordIndex];
        charIndex--;
        el.textContent = word.slice(0, Math.max(charIndex, 0));
        if (charIndex > 0) {
            setTimeout(erase, DELETE_SPEED);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            charIndex = 0;
            setTimeout(type, PAUSE_EMPTY);
        }
    }

    // Arranque: a 1ª palavra já está visível; segura e depois inicia o loop
    setTyping(false);
    setTimeout(erase, HOLD_TIME);
})();
