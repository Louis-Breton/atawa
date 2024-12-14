// Fonction principale pour générer les indicateurs de prix
function updatePriceIndicators() {
    // Sélectionner toutes les divs avec les attributs nécessaires
    const priceContainers = document.querySelectorAll('[product-price-level][product-price-range]');

    priceContainers.forEach(container => {
        // Récupérer les valeurs des attributs
        const level = parseInt(container.getAttribute('product-price-level'));
        const range = parseInt(container.getAttribute('product-price-range'));

        // Nettoyer les enfants existants pour éviter les doublons
        container.innerHTML = '';

        // Détecter la localisation pour déterminer le symbole monétaire
        const currencySymbol = (navigator.language || navigator.userLanguage).includes('en-GB') || navigator.language.includes('en')
            ? '£'
            : navigator.language.includes('de-CH') || navigator.language.includes('fr-CH')
            ? 'CHF'
            : '€';

        // Générer les indicateurs de prix
        for (let i = 1; i <= range; i++) {
            const priceIndicator = document.createElement('div');
            priceIndicator.setAttribute('product-price', 'indicator');
            priceIndicator.classList.add('product-card_price');

            // Ajouter la classe is-active si l'indicateur est dans le niveau
            if (i <= level) {
                priceIndicator.classList.add('is-active');
            }

            // Ajouter le symbole monétaire
            priceIndicator.textContent = currencySymbol;

            // Ajouter l'indicateur au conteneur
            container.appendChild(priceIndicator);
        }
    });
}

// Fonction pour observer les ajouts au DOM
function observeLazyLoad() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (
                    node.nodeType === Node.ELEMENT_NODE &&
                    node.querySelectorAll &&
                    node.querySelectorAll('[product-price-level][product-price-range]').length > 0
                ) {
                    updatePriceIndicators();
                }
            });
        });
    });

    // Observer les changements dans le DOM
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updatePriceIndicators();
    observeLazyLoad();
});
