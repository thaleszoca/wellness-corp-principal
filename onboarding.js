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
