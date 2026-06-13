/* ============================================================
   WELLNESS — dashboard.js
   Lógica da tela principal
   ============================================================ */

/* ── Frases diárias (rotação por dia do ano) ── */
const DAILY_QUOTES = [
    'Pequenos hábitos criam grandes mudanças.',
    'Constância vence motivação.',
    'A evolução não é linear. Continue mesmo assim.',
    'Um dia de cada vez. Isso é tudo que precisa.',
    'Quem está consistente está avançando.',
    'Seu futuro começa hoje.',
    'Cada dia é uma nova chance de evoluir.',
    'Não é sobre onde você está. É sobre para onde está indo.',
    'Começar de novo não é fracasso. É coragem.',
    'O melhor momento para começar era ontem. O segundo melhor é agora.',
    'Você não precisa ser perfeito. Precisa ser constante.',
    'Progresso, não perfeição.',
    'O processo é a recompensa.',
    'Confie no processo, mesmo quando não vê o resultado.',
    'Cada hábito completado é uma promessa cumprida a si mesmo.',
    'Você é mais forte do que seus dias difíceis.',
    'Dias difíceis testam o hábito. Continue.',
    'A disciplina é uma forma de amor próprio.',
    'Cuide de você hoje para ser quem quer se tornar amanhã.',
    'Seu esforço tem valor, mesmo quando não aparece ainda.',
    'Saúde é uma jornada, não um destino.',
    'O corpo que você quer é construído um dia de cada vez.',
    'Não compare sua jornada com a de ninguém.',
    'Você não está atrasado. Você está no seu tempo.',
    'Pequenas mudanças. Grande impacto.',
    'Cuidar de você é um ato de coragem.',
    'Você merece sentir-se bem.',
    'Saúde começa na mente antes de chegar ao corpo.',
    'Equilíbrio não é perfeição. É ajuste constante.',
    'Você já está fazendo mais do que imagina.',
];

function getDailyQuote() {
    const today     = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}


/* ── Saudação por hora ── */
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia,';
    if (h < 18) return 'Boa tarde,';
    return 'Boa noite,';
}


/* ── Data formatada ── */
function getFormattedDate() {
    const days   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}


/* ── localStorage ── */
const essentials = JSON.parse(localStorage.getItem('wellness_essentials') || '{}');
const userData   = JSON.parse(localStorage.getItem('wellness_user')        || '{}');


/* ── Mapeamento de objetivos ── */
const goalLabels = {
    'ganhar-massa':         'Ganhar Massa',
    'emagrecer':            'Emagrecer',
    'melhorar-alimentacao': 'Alimentação',
};


/* ── Cálculo de progresso ── */
function calculateProgress() {
    if (!essentials.goal) return 12;
    if (essentials.adaptiveComplete) return 85;
    return 42;
}


/* ── Counter animado (easeOutCubic) ── */
function animateCounter(el, target, duration) {
    if (!el) return;
    const start = performance.now();
    const tick  = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const v = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(v * target);
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}


/* ── Toast ── */
function showToast(msg) {
    const prev = document.querySelector('.db-toast');
    if (prev) prev.remove();

    const toast = document.createElement('div');
    toast.className   = 'db-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('db-toast--visible'));
    });

    setTimeout(() => {
        toast.classList.remove('db-toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}


/* ══════════════════════════════════════════
   INICIALIZAÇÃO
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Saudação e nome ── */
    document.getElementById('dbGreeting').textContent  = getGreeting();
    document.getElementById('dbDailyQuote').textContent = getDailyQuote();
    document.getElementById('dbDateText').textContent  = getFormattedDate();

    const name = userData.name || null;
    document.getElementById('dbUserName').textContent = name
        ? `Olá, ${name}`
        : 'Bem-vindo à Wellness';


    /* ── Stats ── */
    if (essentials.goal) {
        document.getElementById('statGoalVal').textContent =
            goalLabels[essentials.goal] || essentials.goal;
    }

    if (essentials.bmi) {
        const bmi     = parseFloat(essentials.bmi);
        let   bmiLabel = String(bmi);
        if      (bmi < 18.5) bmiLabel += ' ↓';
        else if (bmi < 25)   bmiLabel += ' ✓';
        else                  bmiLabel += ' ↑';
        document.getElementById('statBmiVal').textContent = bmiLabel;
    }

    if (essentials.age) {
        document.getElementById('statAgeVal').textContent = `${essentials.age} anos`;
    }

    /* Ocultar stats se não há dados */
    if (!essentials.goal && !essentials.bmi && !essentials.age) {
        const statsSection = document.getElementById('dbStatsSection');
        if (statsSection) statsSection.style.display = 'none';
    }


    /* ── Unlock list: ajuste se sem dados ── */
    if (!essentials.goal) {
        document.getElementById('ulItemEssentials').classList.remove('db-unlock-item--done');
        document.getElementById('ulItemEssentials').querySelector('.db-unlock-check')
            .outerHTML = '<span class="db-unlock-dot" aria-hidden="true"></span>';
        document.getElementById('ulItemGoal').classList.remove('db-unlock-item--done');
        document.getElementById('ulItemGoal').querySelector('.db-unlock-check')
            .outerHTML = '<span class="db-unlock-dot" aria-hidden="true"></span>';
    }


    /* ── Progresso ── */
    const RING_CIRCUM = 477.52; /* 2π × 76 */
    const progress    = calculateProgress();

    /* Tag */
    const tag = document.getElementById('dbProgressTag');
    if (progress >= 85)      tag.textContent = 'Quase completo';
    else if (progress >= 42) tag.textContent = 'Em construção';
    else                      tag.textContent = 'Iniciando';

    /* Hint */
    if (!essentials.goal) {
        document.getElementById('dbProgressHint').textContent =
            'Responda o questionário para iniciar seu perfil personalizado';
    }

    /* CTA card: ocultar se perfil completo */
    if (progress >= 85) {
        const ctaSec = document.getElementById('ctaSection');
        if (ctaSec) ctaSec.style.display = 'none';
    }

    /* Animações de progresso (com delay para after paint) */
    setTimeout(() => {
        /* Barra */
        document.getElementById('dbProgressBar').style.width = progress + '%';

        /* Ring */
        const offset = RING_CIRCUM * (1 - progress / 100);
        document.getElementById('dbRingFill').style.strokeDashoffset = offset;

        /* Contadores */
        animateCounter(document.getElementById('dbProgressPct'), progress, 1200);
        animateCounter(document.getElementById('dbRingPct'),      progress, 1200);
    }, 200);


    /* ── CTA Button ── */
    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            ctaBtn.textContent = 'Abrindo...';
            ctaBtn.disabled    = true;
            setTimeout(() => {
                if (essentials.goal) {
                    window.location.href = 'evolucao-perfil.html';
                } else {
                    window.location.href = 'perguntas-essenciais.html';
                }
            }, 600);
        });
    }


    /* ── Header scroll ── */
    const header = document.getElementById('dbHeader');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });


    /* ── Cards de recursos clicáveis ── */
    document.getElementById('aylaChatCard').addEventListener('click', () => {
        showToast('Ayla está sendo preparada para você!');
    });

    document.getElementById('aylaChatCard').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showToast('Ayla está sendo preparada para você!');
        }
    });

    document.querySelectorAll('.db-rc--locked').forEach(card => {
        card.addEventListener('click', () => {
            showToast('Complete seu perfil para desbloquear.');
        });
    });


    /* ── Navegação inferior ── */
    document.getElementById('navHome').addEventListener('click', () => {
        /* Já está na tela inicial */
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('navPlan').addEventListener('click', () => {
        showToast('Plano Alimentar em preparação.');
    });

    document.getElementById('navAyla').addEventListener('click', () => {
        showToast('Ayla está sendo preparada para você!');
    });

    document.getElementById('navAchiev').addEventListener('click', () => {
        showToast('Conquistas disponíveis em breve!');
    });


    /* ── Notificação bell ── */
    document.getElementById('dbNotifBtn').addEventListener('click', () => {
        showToast('Nenhuma notificação no momento.');
    });


    /* ── Reveal observer ── */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

});
