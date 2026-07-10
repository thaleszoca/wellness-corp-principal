/* cursor.js — cursor personalizado Wellness
   Incluir em qualquer página:
   1. Adicionar no <head>: as classes cursor: none !important no CSS
   2. Antes do </body>: <div class="cursor-dot"></div><div class="cursor-ring"></div>
   3. <script src="cursor.js"></script>
*/
(function () {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let rawX = 0, rawY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        rawX = e.clientX;
        rawY = e.clientY;
        dot.style.left    = rawX + 'px';
        dot.style.top     = rawY + 'px';
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });

    (function tick() {
        const dx = rawX - ringX;
        const dy = rawY - ringY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = 72;
        if (dist > max) {
            const a = Math.atan2(dy, dx);
            ringX = rawX - Math.cos(a) * max;
            ringY = rawY - Math.sin(a) * max;
        } else {
            ringX += dx * 0.07;
            ringY += dy * 0.07;
        }
        ring.style.left = ringX.toFixed(1) + 'px';
        ring.style.top  = ringY.toFixed(1) + 'px';
        requestAnimationFrame(tick);
    })();
})();
