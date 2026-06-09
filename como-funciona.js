/* ============================================================
   WELLNESS — como-funciona.js
   Animações premium de scroll, parallax, tilt e microinterações
   ============================================================ */


/* ══════════════════════════════════════════
   NAVBAR — classe "scrolled" ao rolar
══════════════════════════════════════════ */
(function () {
    const nav = document.getElementById('cfNav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL — data-reveal + data-delay
   Classes: up (default) | left | right | scale | fade
══════════════════════════════════════════ */
(function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || '0');
            setTimeout(() => el.classList.add('visible'), delay);
            observer.unobserve(el);
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

    els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════
   PARALLAX — orbs do hero respondem ao scroll
══════════════════════════════════════════ */
(function () {
    const orb1 = document.querySelector('.cf-hero-orb--1');
    const orb2 = document.querySelector('.cf-hero-orb--2');
    const orb3 = document.querySelector('.cf-hero-orb--3');
    if (!orb1) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            orb1.style.transform = `translateY(${y * 0.28}px)`;
            orb2.style.transform = `translateY(${y * -0.18}px)`;
            if (orb3) orb3.style.transform = `translate(-50%, calc(-50% + ${y * 0.12}px))`;
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
})();


/* ══════════════════════════════════════════
   TILT 3D — cards com efeito perspectiva
══════════════════════════════════════════ */
(function () {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const rotY = dx * 8;
            const rotX = -dy * 6;
            card.style.transition = 'transform 0.08s, box-shadow 0.28s';
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s';
            card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
})();


/* ══════════════════════════════════════════
   FLUXOGRAMA — animação sequencial premium
   Nós: slide da direita + fade
   Conectores: linha cresce de cima para baixo
══════════════════════════════════════════ */
(function () {
    const diagram = document.getElementById('flowDiagram');
    if (!diagram) return;

    const allItems = [...diagram.children];

    /* Estado inicial de cada elemento */
    allItems.forEach(el => {
        const isNode = el.classList.contains('cf-flow-node');
        const isConn = el.classList.contains('cf-flow-connector');

        el.style.opacity = '0';
        el.style.willChange = 'opacity, transform';

        if (isNode) {
            /* Nós: entram da direita */
            el.style.transform = 'translateX(40px) scale(0.96)';
            el.style.transition = 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)';
        } else if (isConn) {
            /* Conectores: escalam no eixo Y */
            el.style.transform = 'scaleY(0)';
            el.style.transformOrigin = 'top center';
            el.style.transition = 'opacity 0.35s ease, transform 0.40s cubic-bezier(0.22,1,0.36,1)';
        }
    });

    const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        /* Delay base por posição, nós demoram mais, conectores são rápidos */
        let delay = 0;
        allItems.forEach(el => {
            const isNode = el.classList.contains('cf-flow-node');
            const step = isNode ? 180 : 90;

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0) scale(1) scaleY(1)';

                /* Dot pulsa ao aparecer */
                if (isNode) {
                    const dot = el.querySelector('.cf-flow-dot');
                    if (dot) {
                        dot.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
                        dot.style.transform = 'scale(1.4)';
                        setTimeout(() => { dot.style.transform = 'scale(1)'; }, 350);
                    }
                }
            }, delay);

            delay += step;
        });
    }, { threshold: 0.15 });

    observer.observe(diagram);
})();


/* ══════════════════════════════════════════
   FEAT CARDS — delay escalonado
══════════════════════════════════════════ */
(function () {
    const grid = document.querySelector('.cf-features-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.cf-feat-card');

    cards.forEach((card, i) => {
        card.classList.add('reveal');
        card.dataset.delay = String(i * 70);
    });

    /* Re-observa (já foram adicionados ao reveal acima) */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
        });
    }, { threshold: 0.10 });

    cards.forEach(c => observer.observe(c));
})();


/* ══════════════════════════════════════════
   STEP HOVER — destaca número
══════════════════════════════════════════ */
(function () {
    document.querySelectorAll('.cf-step').forEach(step => {
        step.addEventListener('mouseenter', () => {
            const n = step.querySelector('.cf-step-num');
            if (n) n.style.color = 'rgba(255,255,255,0.72)';
        });
        step.addEventListener('mouseleave', () => {
            const n = step.querySelector('.cf-step-num');
            if (n) n.style.color = '';
        });
    });
})();


/* ══════════════════════════════════════════
   COMPARATIVO — anima lista ao entrar
══════════════════════════════════════════ */
(function () {
    const items = document.querySelectorAll('.cf-compare-item');
    if (!items.length) return;

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-12px)';
        item.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const siblings = [...e.target.parentElement.querySelectorAll('.cf-compare-item')];
            siblings.forEach((item, i) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, i * 60 + 150);
            });
            observer.unobserve(e.target);
        });
    }, { threshold: 0.30 });

    /* Observa só o primeiro item de cada lista */
    document.querySelectorAll('.cf-compare-list').forEach(list => {
        const first = list.querySelector('.cf-compare-item');
        if (first) observer.observe(first);
    });
})();
