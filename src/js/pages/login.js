/* ── Frases motivacionais ── */
const quotes = [
    '"Pequenos hábitos criam grandes mudanças."',
    '"Seu futuro começa com as escolhas de hoje."',
    '"Constância supera motivação."',
    '"Cada passo conta."',
    '"A evolução acontece um dia de cada vez."',
    '"Cuide de você como cuidaria de alguém que ama."',
    '"Progresso, não perfeição."',
];

document.getElementById('loginQuote').textContent =
    quotes[Math.floor(Math.random() * quotes.length)];


/* ── Mostrar / ocultar senha ── */
const toggleBtn    = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');
const eyeShow      = toggleBtn.querySelector('.eye-show');
const eyeHide      = toggleBtn.querySelector('.eye-hide');

toggleBtn.addEventListener('click', () => {
    const hidden = passwordInput.type === 'password';
    passwordInput.type     = hidden ? 'text'     : 'password';
    eyeShow.style.display  = hidden ? 'none'     : 'block';
    eyeHide.style.display  = hidden ? 'block'    : 'none';
    toggleBtn.setAttribute('aria-label', hidden ? 'Ocultar senha' : 'Mostrar senha');
});


/* ── Submit — Entrar ── */
const form      = document.getElementById('loginForm');
const btnSubmit = form.querySelector('.btn-primary');

form.addEventListener('submit', e => {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    /* Validação básica */
    if (!email || !password) {
        shake(btnSubmit);
        showError(!email ? 'email' : 'password', 'Campo obrigatório.');
        return;
    }

    if (!email.includes('@')) {
        shake(btnSubmit);
        showError('email', 'E-mail inválido.');
        return;
    }

    /* Feedback de loading */
    btnSubmit.textContent = 'Entrando...';
    btnSubmit.disabled    = true;

    /* Envia as credenciais para o backend (PHP) */
    const dados = new FormData();
    dados.append('email', email);
    dados.append('senha', password);

    fetch('../../../backend/auth/login.php', {
        method: 'POST',
        body: dados,
    })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                // Autenticou — vai para o app
                window.location.href = '../dashboard/home.html';
            } else {
                // Ex.: e-mail ou senha incorretos
                showError('password', data.mensagem);
                shake(btnSubmit);
                btnSubmit.textContent = 'Entrar';
                btnSubmit.disabled    = false;
            }
        })
        .catch(() => {
            showError('email', 'Erro de conexão. Abra a página por http://localhost/wellness/...');
            shake(btnSubmit);
            btnSubmit.textContent = 'Entrar';
            btnSubmit.disabled    = false;
        });
});


/* ── Botões sociais ── */
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.querySelector('span').textContent;
        showToast(`Login com ${name.replace('Continuar com ', '')} em breve.`);
    });
});


/* ── Esqueci minha senha ── */
document.querySelector('.forgot-link').addEventListener('click', e => {
    e.preventDefault();
    showToast('Recuperação de senha em breve.');
});


/* ── Helpers ── */
function showError(fieldId, msg) {
    clearErrors();
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

function showToast(msg) {
    const existing = document.querySelector('.login-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className   = 'login-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('login-toast--visible'), 10);
    setTimeout(() => {
        toast.classList.remove('login-toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
