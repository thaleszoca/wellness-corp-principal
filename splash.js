const splash = document.getElementById('splash');

setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 560);
}, 3000);
