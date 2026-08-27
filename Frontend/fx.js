// Archivo exclusivo para efectos visuales (UI/UX) - No afecta la lógica de negocio

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.classList.add('transition-opacity', 'duration-100', 'ease-in-out');
    setTimeout(() => {
        body.classList.remove('opacity-0');
    }, 50);
    const transitionLinks = document.querySelectorAll('.page-transition');
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
                const targetUrl = link.getAttribute('href');
               body.classList.add('opacity-0');
                 setTimeout(() => {
                window.location.href = targetUrl;
            }, 100);
        });
    });
});
