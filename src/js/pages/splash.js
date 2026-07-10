const splash = document.getElementById('splash');

setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
        window.location.href = '../../../index.html';
    }, 560);
}, 3000);
