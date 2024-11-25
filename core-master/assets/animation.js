window.addEventListener('beforeunload', () => {
    const computedStyle = getComputedStyle(document.body);
    const backgroundPosition = computedStyle.backgroundPosition; // Récupérer la position brute
    const percentage = backgroundPosition.replace(/px|%/g, ''); // Nettoyer les unités

    // Sauvegarde dans localStorage
    localStorage.setItem('backgroundPosition', percentage);
    const elapsedTime = (Date.now() / 1000) % 30; // Temps écoulé en secondes
    localStorage.setItem('elapsedTime', elapsedTime);
});


window.addEventListener('load', () => {
    const savedPosition = localStorage.getItem('backgroundPosition');
    const elapsedTime = localStorage.getItem('elapsedTime') || 0;

    if (savedPosition) {
        // Restaurer la position avec des unités compatibles
        document.body.style.backgroundPosition = `${savedPosition}% center`;

        // Appliquer un décalage pour l'animation
        const delay = `-${elapsedTime}s`; // Décalage négatif pour continuer là où l'animation s'est arrêtée
        document.body.style.animationDelay = delay;
    }
});