/* ============================================================
   WELLNESS — script.js
   Responsável por duas coisas:
   1. Criar as folhas animadas no fundo da tela
   2. Fazer as folhas reagirem ao movimento do mouse (parallax)
   ============================================================ */


/* ----------------------------------------------------------
   PARTE 1 — CRIAÇÃO DAS FOLHAS
   ---------------------------------------------------------- */

/* Pega o container onde as folhas serão inseridas (div#leaves-bg do HTML) */
const bg = document.getElementById('leaves-bg');

/* Array que vai guardar referência de todas as folhas criadas
   (usado depois na parte do parallax) */
const allLeaves = [];

/* Função auxiliar: retorna um número aleatório entre 'a' e 'b' */
const rnd = (a, b) => a + Math.random() * (b - a);


/* ------ Definição das camadas de folhas ------
   Existem 3 camadas, cada uma com características diferentes.
   Camadas mais "próximas" (px alto) são maiores e se movem mais
   com o mouse → cria ilusão de profundidade 3D.

   Cada camada define:
   - px        → quanto essa camada se move com o mouse (parallax)
   - n         → quantidade de folhas nessa camada
   - opMin/Max → faixa de opacidade (transparência)
   - szMin/Max → faixa de tamanho em pixels
*/
const layers = [
    { px: 9,  n: 13, opMin: 0.18, opMax: 0.32, szMin: 32, szMax: 58 },
    { px: 22, n: 15, opMin: 0.28, opMax: 0.45, szMin: 52, szMax: 80 },
    { px: 42, n: 11, opMin: 0.40, opMax: 0.60, szMin: 70, szMax: 110 },
];

const leafColors = [
    [148, 235, 148], /* verde limão suave */
    [120, 218, 172], /* verde-teal */
    [188, 245, 160], /* verde amarelado */
    [155, 240, 200], /* menta */
    [100, 200, 155], /* verde mais escuro */
    [175, 252, 185], /* verde claro brilhante */
];


/* ------ Função que gera o SVG de uma folha ------
   Recebe largura (w), altura (h) e opacidade (op),
   e retorna o código SVG como texto.
   Cada folha tem: contorno, nervura central e nervuras laterais.
*/
const leafSVG = (w, h, op, [r, g, b]) => `
    <svg width="${w}" height="${h}" viewBox="0 0 40 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 1 C16 8 4 18 3 34 C2 48 10 59 20 63 C30 59 38 48 37 34 C36 18 24 8 20 1Z"
              fill="rgba(${r},${g},${b},${op})"
              stroke="rgba(${r},${g},${b},${(op * 0.5).toFixed(3)})"
              stroke-width="0.6"/>
        <line x1="20" y1="2" x2="20" y2="61"
              stroke="rgba(230,255,240,${(op * 0.9).toFixed(3)})" stroke-width="1.1"/>
        <path d="M20 18 Q32 27 30 38" fill="none" stroke="rgba(220,255,235,${(op * 0.75).toFixed(3)})" stroke-width="0.8"/>
        <path d="M20 32 Q31 40 29 51" fill="none" stroke="rgba(220,255,235,${(op * 0.65).toFixed(3)})" stroke-width="0.8"/>
        <path d="M20 18 Q8 27 10 38"  fill="none" stroke="rgba(220,255,235,${(op * 0.75).toFixed(3)})" stroke-width="0.8"/>
        <path d="M20 32 Q9 40 11 51"  fill="none" stroke="rgba(220,255,235,${(op * 0.65).toFixed(3)})" stroke-width="0.8"/>
    </svg>`;


/* ------ Criação das folhas para cada camada ------ */
layers.forEach(({ px, n, opMin, opMax, szMin, szMax }) => {

    for (let i = 0; i < n; i++) {

        const op   = rnd(opMin, opMax);
        const sz   = rnd(szMin, szMax);
        const left = rnd(-3, 103);
        const yOff = rnd(10, 160);
        const dur  = rnd(12, 28);
        const del  = rnd(-dur, 0);
        const sign = Math.random() > 0.5 ? 1 : -1;
        const spin = sign * rnd(120, 360);
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];

        const wrap = document.createElement('div');
        wrap.className = 'leaf-wrap';
        wrap.style.left = `${left}%`;
        wrap.style.top  = `${-yOff}px`; /* começa acima da tela */

        const anim = document.createElement('div');
        anim.className = 'leaf-anim';

        const dist = window.innerHeight + yOff + sz * 1.6;

        anim.style.cssText = `
            --op: ${op.toFixed(3)};
            --dist: ${dist.toFixed(0)}px;
            --spin: ${spin.toFixed(0)}deg;
            animation: fall ${dur.toFixed(1)}s ${del.toFixed(1)}s linear infinite;
        `;

        anim.innerHTML = leafSVG(sz, sz * 1.55, op, color);

        /* Monta a estrutura: wrap > anim > svg */
        wrap.appendChild(anim);
        bg.appendChild(wrap);

        /* Guarda a referência para usar no parallax */
        allLeaves.push({ wrap, px });
    }
});


/* ----------------------------------------------------------
   PARTE 2 — PARALLAX COM O MOUSE
   Quando o mouse se move, as folhas se deslocam levemente
   em direção ao cursor, criando profundidade 3D.
   Folhas da camada da frente (px maior) se movem mais.
   ---------------------------------------------------------- */

/* --- Parallax --- */
let mx = 0, my = 0;
let cx = 0, cy = 0;

/* --- Cursor personalizado --- */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let rawX = window.innerWidth / 2;
let rawY = window.innerHeight / 2;
let ringX = rawX, ringY = rawY;

document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;

    rawX = e.clientX;
    rawY = e.clientY;
    cursorDot.style.left    = rawX + 'px';
    cursorDot.style.top     = rawY + 'px';
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
});


/* ------ Loop de animação do parallax ------
   requestAnimationFrame = roda ~60 vezes por segundo,
   sincronizado com a tela do monitor (mais eficiente que setInterval).

   A cada frame:
   - cx/cy se aproximam gradualmente de mx/my (efeito de inércia)
   - Cada folha é deslocada proporcionalmente ao seu px (profundidade)
*/
(function tick() {

    cx += (mx - cx) * 0.060;
    cy += (my - cy) * 0.060;

    for (const { wrap, px } of allLeaves) {
        const tx = cx * px;
        const ty = cy * px;
        wrap.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    }

    /* Anel do cursor segue o mouse com inércia suave */
    const _dx = rawX - ringX;
    const _dy = rawY - ringY;
    const _dist = Math.sqrt(_dx * _dx + _dy * _dy);
    const _max = 72;
    if (_dist > _max) {
        const _a = Math.atan2(_dy, _dx);
        ringX = rawX - Math.cos(_a) * _max;
        ringY = rawY - Math.sin(_a) * _max;
    } else {
        ringX += _dx * 0.07;
        ringY += _dy * 0.07;
    }
    cursorRing.style.left = ringX.toFixed(1) + 'px';
    cursorRing.style.top  = ringY.toFixed(1) + 'px';

    requestAnimationFrame(tick);

})();
