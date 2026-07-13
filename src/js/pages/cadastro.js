/* ── Frases motivacionais ── */
const quotes = [
    '"O primeiro passo é sempre o mais importante."',
    '"Sua jornada começa agora."',
    '"Pequenos hábitos criam grandes mudanças."',
    '"Constância supera motivação."',
    '"Cuide de você como cuidaria de alguém que ama."',
    '"A evolução acontece um dia de cada vez."',
    '"Progresso, não perfeição."',
];

document.getElementById('cadQuote').textContent =
    quotes[Math.floor(Math.random() * quotes.length)];


/* ── Toggle de visibilidade da senha ── */
setupPasswordToggle('togglePw', 'password');
setupPasswordToggle('toggleConfirmPw', 'confirmPassword');

function setupPasswordToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const show  = btn.querySelector('.eye-show');
    const hide  = btn.querySelector('.eye-hide');

    btn.addEventListener('click', () => {
        const hidden = input.type === 'password';
        input.type         = hidden ? 'text'    : 'password';
        show.style.display = hidden ? 'none'    : 'block';
        hide.style.display = hidden ? 'block'   : 'none';
        btn.setAttribute('aria-label', hidden ? 'Ocultar senha' : 'Mostrar senha');
    });
}


/* ── Indicador de força da senha ── */
const passwordInput = document.getElementById('password');
const strengthWrap  = document.getElementById('passwordStrength');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;

    if (!val) {
        strengthWrap.classList.remove('visible');
        return;
    }

    strengthWrap.classList.add('visible');
    const s = getPasswordStrength(val);
    strengthFill.style.width      = s.width;
    strengthFill.style.background = s.color;
    strengthLabel.textContent     = s.label;
    strengthLabel.style.color     = s.color;
});

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8)             score++;
    if (password.length >= 12)            score++;
    if (/[A-Z]/.test(password))           score++;
    if (/[0-9]/.test(password))           score++;
    if (/[^A-Za-z0-9]/.test(password))   score++;

    if (score <= 1) return { width: '33%',  color: '#f87171', label: 'Senha fraca' };
    if (score <= 3) return { width: '66%',  color: '#f5a623', label: 'Senha média' };
    return             { width: '100%', color: '#6AAB71', label: 'Senha forte' };
}


/* ── Submit — Criar Conta ── */
const form      = document.getElementById('cadForm');
const btnSubmit = document.getElementById('cadSubmit');

form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name            = document.getElementById('fullName').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name) {
        showError('fullName', 'Por favor, informe seu nome.');
        shake(btnSubmit); return;
    }

    if (!email) {
        showError('email', 'Por favor, informe seu e-mail.');
        shake(btnSubmit); return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Formato de e-mail inválido.');
        shake(btnSubmit); return;
    }

    if (password.length < 8) {
        showError('password', 'A senha deve ter no mínimo 8 caracteres.');
        shake(btnSubmit); return;
    }

    if (!confirmPassword) {
        showError('confirmPassword', 'Por favor, confirme sua senha.');
        shake(btnSubmit); return;
    }

    if (password !== confirmPassword) {
        showError('confirmPassword', 'As senhas não coincidem.');
        shake(btnSubmit); return;
    }

    /* Feedback de loading */
    btnSubmit.textContent = 'Criando conta...';
    btnSubmit.disabled    = true;

    /* Envia os dados para o backend (PHP) */
    const dados = new FormData();
    dados.append('nome',  name);
    dados.append('email', email);
    dados.append('senha', password);

    fetch('../../../backend/auth/cadastro.php', {
        method: 'POST',
        body: dados,
    })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                // Cadastrou no banco — segue para as perguntas essenciais
                window.location.href = '../onboarding/perguntas-essenciais.html';
            } else {
                // Ex.: e-mail já cadastrado
                showError('email', data.mensagem);
                shake(btnSubmit);
                btnSubmit.textContent = 'Criar Conta';
                btnSubmit.disabled    = false;
            }
        })
        .catch(() => {
            showError('email', 'Erro de conexão com o servidor. O Apache está ligado?');
            shake(btnSubmit);
            btnSubmit.textContent = 'Criar Conta';
            btnSubmit.disabled    = false;
        });
});


/* ── Helpers ── */
function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    input.style.borderColor = '#d94f4f';
    const err = document.createElement('p');
    err.className   = 'field-error';
    err.textContent = msg;
    input.closest('.field-group').appendChild(err);
    input.addEventListener('input', clearErrors, { once: true });
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.field-group input').forEach(el => {
        el.style.borderColor = '';
    });
}

function shake(el) {
    el.classList.add('btn-shake');
    el.addEventListener('animationend', () => el.classList.remove('btn-shake'), { once: true });
}
