document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('iframe[data-src]');

    iframes.forEach((iframe) => {
        const device = iframe.getAttribute('device');
        const screenWidth = window.innerWidth;

        // Charger la vidéo en fonction de la taille d'écran
        if (
            (device === 'desktop' && screenWidth > 768) ||
            (device === 'mobile' && screenWidth <= 768)
        ) {
            iframe.setAttribute('src', iframe.getAttribute('data-src'));
        } else {
            iframe.removeAttribute('src'); // Assurez-vous que l'autre iframe ne charge pas.
        }
    });
});
