/* ============================================================
   WELLNESS — perguntas-essenciais.js
   Fluxo de 5 perguntas base do sistema adaptativo
   ============================================================ */

/* ── Ordem dos steps ── */
const STEPS = ['age', 'gender', 'height', 'weight', 'goal'];
const TOTAL  = STEPS.length;
let current  = 0;
let transitioning = false;

const answers = {
    age:    null,
    gender: null,
    height: 170,
    weight: 70,
    goal:   null,
    bmi:    null,
};

/* ── Refs DOM ── */
const progressFill = document.getElementById('progressFill');
const backBtn      = document.getElementById('backBtn');
const continueBtn  = document.getElementById('continueBtn');
const stepNumEl    = document.getElementById('stepNum');


/* ════════════════════════════════════════
   NAVEGAÇÃO ENTRE STEPS
════════════════════════════════════════ */

function goTo(index, direction) {
    if (transitioning || index < 0 || index >= TOTAL) return;
    transitioning = true;

    const currentEl = document.getElementById(`step-${STEPS[current]}`);
    const nextEl    = document.getElementById(`step-${STEPS[index]}`);

    const exitClass  = direction === 'forward' ? 'exit-forward' : 'exit-back';
    const enterAnim  = direction === 'forward' ? '' : 'enter-back';

    currentEl.classList.remove('active');
    currentEl.classList.add(exitClass);

    setTimeout(() => {
        currentEl.classList.remove(exitClass);

        current = index;

        nextEl.classList.remove('active', 'enter-back');
        if (enterAnim) nextEl.classList.add(enterAnim);
        else           nextEl.classList.add('active');

        if (enterAnim) {
            requestAnimationFrame(() => {
                nextEl.classList.remove(enterAnim);
                nextEl.classList.add('active');
            });
        }

        updateUI();
        transitioning = false;
    }, 280);
}

function updateUI() {
    const step = current + 1;

    /* Progresso */
    progressFill.style.width = `${(step / TOTAL) * 100}%`;

    /* Contador */
    stepNumEl.textContent = step;

    /* Botão voltar — desabilitado na 1ª pergunta */
    backBtn.disabled = current === 0;

    /* Limpar erros */
    clearError(STEPS[current]);
}

backBtn.addEventListener('click', () => {
    if (current > 0) goTo(current - 1, 'back');
});

function advance() {
    if (transitioning || continueBtn.disabled) return;
    if (!validateStep(STEPS[current])) return;
    captureStep(STEPS[current]);

    if (current < TOTAL - 1) {
        goTo(current + 1, 'forward');
    } else {
        finish();
    }
}

continueBtn.addEventListener('click', advance);

/* ── Enter avança para a próxima pergunta ── */
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.repeat) return;
    e.preventDefault();
    advance();
});


/* ════════════════════════════════════════
   VALIDAÇÃO
════════════════════════════════════════ */

function validateStep(step) {
    clearError(step);

    if (step === 'age') {
        const val = parseInt(document.getElementById('inputAge').value, 10);
        if (!val || isNaN(val) || val < 13 || val > 99) {
            showError('errorAge', 'Por favor, informe uma idade entre 13 e 99 anos.');
            shakeBtn();
            return false;
        }
    }

    if (step === 'gender') {
        const sel = document.querySelector('.pq-gender-card.selected');
        if (!sel) {
            showError('errorGender', 'Selecione uma opção para continuar.');
            shakeBtn();
            return false;
        }
    }

    if (step === 'goal') {
        const sel = document.querySelector('.pq-goal-card.selected');
        if (!sel) {
            showError('errorGoal', 'Selecione um objetivo para continuar.');
            shakeBtn();
            return false;
        }
    }

    return true;
}

function captureStep(step) {
    if (step === 'age') {
        answers.age = parseInt(document.getElementById('inputAge').value, 10);
    }
    if (step === 'gender') {
        answers.gender = document.querySelector('.pq-gender-card.selected').dataset.value;
    }
    if (step === 'height') {
        answers.height = parseInt(document.getElementById('inputHeight').value, 10);
    }
    if (step === 'weight') {
        answers.weight = parseFloat(document.getElementById('inputWeight').value);
    }
    if (step === 'goal') {
        answers.goal = document.querySelector('.pq-goal-card.selected').dataset.value;
    }
}


/* ════════════════════════════════════════
   STEPPER — ALTURA
════════════════════════════════════════ */

const heightDisplay = document.getElementById('heightDisplay');
const heightSlider  = document.getElementById('heightSlider');
const heightHidden  = document.getElementById('inputHeight');

function setHeight(val) {
    val = Math.min(250, Math.max(100, Math.round(val)));
    answers.height          = val;
    heightDisplay.textContent = val;
    heightSlider.value        = val;
    heightHidden.value        = val;
    updateSliderFill(heightSlider);
    bumpValue(heightDisplay);
}

document.getElementById('heightMinus').addEventListener('click', () => setHeight(answers.height - 1));
document.getElementById('heightPlus').addEventListener('click',  () => setHeight(answers.height + 1));

heightSlider.addEventListener('input', () => setHeight(parseFloat(heightSlider.value)));

/* Hold-to-repeat nos steppers */
setupHold('heightMinus', () => setHeight(answers.height - 1));
setupHold('heightPlus',  () => setHeight(answers.height + 1));


/* ════════════════════════════════════════
   STEPPER — PESO
════════════════════════════════════════ */

const weightDisplay = document.getElementById('weightDisplay');
const weightSlider  = document.getElementById('weightSlider');
const weightHidden  = document.getElementById('inputWeight');

function setWeight(val) {
    val = Math.min(200, Math.max(30, Math.round(val * 2) / 2)); /* step 0.5 */
    answers.weight             = val;
    weightDisplay.textContent  = val % 1 === 0 ? val : val.toFixed(1);
    weightSlider.value          = val;
    weightHidden.value          = val;
    updateSliderFill(weightSlider);
    bumpValue(weightDisplay);
}

document.getElementById('weightMinus').addEventListener('click', () => setWeight(answers.weight - 0.5));
document.getElementById('weightPlus').addEventListener('click',  () => setWeight(answers.weight + 0.5));

weightSlider.addEventListener('input', () => setWeight(parseFloat(weightSlider.value)));

setupHold('weightMinus', () => setWeight(answers.weight - 0.5));
setupHold('weightPlus',  () => setWeight(answers.weight + 0.5));


/* ════════════════════════════════════════
   CARDS — SEXO
════════════════════════════════════════ */

document.querySelectorAll('.pq-gender-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.pq-gender-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        clearError('gender');
    });
});


/* ════════════════════════════════════════
   CARDS — OBJETIVO
════════════════════════════════════════ */

document.querySelectorAll('.pq-goal-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.pq-goal-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        clearError('goal');
    });
});


/* ════════════════════════════════════════
   FINALIZAÇÃO — salva e redireciona
════════════════════════════════════════ */

function finish() {
    captureStep('goal');

    /* Cálculo do IMC */
    const heightM = answers.height / 100;
    answers.bmi   = Math.round((answers.weight / (heightM * heightM)) * 10) / 10;

    /* Salva no localStorage para uso nas próximas etapas */
    localStorage.setItem('wellness_essentials', JSON.stringify({
        age:         answers.age,
        gender:      answers.gender,
        height:      answers.height,
        weight:      answers.weight,
        bmi:         answers.bmi,
        goal:        answers.goal,
        completedAt: new Date().toISOString(),
    }));

    /* Estado de carregamento */
    continueBtn.classList.add('loading');
    continueBtn.disabled = true;

    setTimeout(() => {
        window.location.href = '../dashboard/continuar-perfil.html';
    }, 1600);
}


/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */

function updateSliderFill(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const pct = ((parseFloat(slider.value) - min) / (max - min)) * 100;
    slider.style.background =
        `linear-gradient(to right, #6AAB71 ${pct}%, #273041 ${pct}%)`;
}

function bumpValue(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
}

function showError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) el.textContent = msg;
}

function clearError(step) {
    const map = { age: 'errorAge', gender: 'errorGender', goal: 'errorGoal' };
    if (map[step]) {
        const el = document.getElementById(map[step]);
        if (el) el.textContent = '';
    }
}

function shakeBtn() {
    continueBtn.classList.add('shake');
    continueBtn.addEventListener('animationend', () => continueBtn.classList.remove('shake'), { once: true });
}

/* Foca o input de idade ao carregar (1ª pergunta) para usar o Enter de imediato */
const ageInput = document.getElementById('inputAge');
if (ageInput) ageInput.focus();

/* Hold-to-repeat: pressionar e segurar o botão acelera a mudança */
function setupHold(btnId, fn) {
    const btn = document.getElementById(btnId);
    let timer = null;
    let interval = null;

    function start() {
        fn();
        timer = setTimeout(() => {
            interval = setInterval(fn, 80);
        }, 380);
    }

    function stop() {
        clearTimeout(timer);
        clearInterval(interval);
    }

    btn.addEventListener('mousedown',   start);
    btn.addEventListener('touchstart',  start, { passive: true });
    btn.addEventListener('mouseup',     stop);
    btn.addEventListener('mouseleave',  stop);
    btn.addEventListener('touchend',    stop);
    btn.addEventListener('touchcancel', stop);
}


/* ── Inicializa sliders com fill correto ── */
updateSliderFill(heightSlider);
updateSliderFill(weightSlider);

/* ── Estado inicial do botão voltar (1ª pergunta) ── */
backBtn.disabled = current === 0;

/* Shake no botão continuar */
const style = document.createElement('style');
style.textContent = `
    @keyframes btnShake {
        0%,100% { transform: translateX(0); }
        20%     { transform: translateX(-7px); }
        40%     { transform: translateX(7px); }
        60%     { transform: translateX(-5px); }
        80%     { transform: translateX(5px); }
    }
    .pq-btn-next.shake { animation: btnShake 0.36s ease; }
`;
document.head.appendChild(style);
