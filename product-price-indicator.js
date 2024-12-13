// Script pour variabiliser l'affichage d'un prix
function updatePriceIndicators() {
  // Récupérer tous les éléments avec les attributs product-price-level et product-price-range
  const priceContainers = document.querySelectorAll('[product-price-level][product-price-range]');

  priceContainers.forEach(container => {
    // Lire les attributs product-price-level et product-price-range
    const level = parseInt(container.getAttribute('product-price-level'));
    const range = parseInt(container.getAttribute('product-price-range'));

    // Vider la div parent pour éviter les duplications
    container.innerHTML = '';

    // Déterminer le symbole de la monnaie selon la localisation
    const userLocale = navigator.language || navigator.userLanguage;
    let currencySymbol = '€'; // Par défaut pour la France
    if (userLocale.includes('en-GB') || userLocale.includes('en')) {
      currencySymbol = '£'; // Livre sterling pour le Royaume-Uni
    } else if (userLocale.includes('de-CH') || userLocale.includes('fr-CH')) {
      currencySymbol = 'CHF'; // Franc suisse pour la Suisse
    }

    // Générer les divs enfants
    for (let i = 1; i <= range; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('product-price', 'indicator');
      indicator.classList.add('product-card_price');

      // Ajouter la classe is-active si l'indicateur est dans la plage active
      if (i <= level) {
        indicator.classList.add('is-active');
      }

      // Ajouter le symbole de la monnaie comme contenu texte
      indicator.textContent = currencySymbol;

      // Ajouter l'indicateur à la div parent
      container.appendChild(indicator);
    }
  });
}

// Exécuter la fonction à la charge de la page
window.addEventListener('DOMContentLoaded', updatePriceIndicators);
