document.addEventListener('DOMContentLoaded', () => {
  // Fonction principale pour activer une région
  function activateRegion(region) {
    // Désactiver tous les points actifs et masquer toutes les cards
    document.querySelectorAll('.map-markup_dot.is-active').forEach(dot => dot.classList.remove('is-active'));
    document.querySelectorAll('[map-card="list"] .map_card-id').forEach(card => (card.style.display = 'none'));
    document.querySelectorAll('.map-active.map_svg-hover').forEach(active => active.classList.remove('map_svg-hover'));

    // Activer tous les points associés
    document.querySelectorAll(`.map-markup[map-markup="${region}"] .map-markup_dot`).forEach(dot => {
      dot.classList.add('is-active');
    });

    // Afficher la card correspondante
    const activeCard = document.querySelector(`[map-card="${region}"]`);
    if (activeCard) {
      activeCard.style.display = 'block';
    }

    // Maintenir l'effet hover sur le SVG correspondant
    const activeSvg = document.querySelector(`.map-active[data-region="${region}"]`);
    if (activeSvg) {
      activeSvg.classList.add('map_svg-hover');
    }
  }

  // Initialisation : Activez le premier point et la première card au chargement
  function initializeMap() {
    const firstMarkup = document.querySelector('[map-markup="list"] .map-markup');
    if (firstMarkup) {
      const firstRegion = firstMarkup.getAttribute('map-markup');
      activateRegion(firstRegion);

      // Activer l'effet hover permanent sur le premier élément
      const firstSvg = document.querySelector(`.map-active[data-region="${firstRegion}"]`);
      if (firstSvg) {
        firstSvg.classList.add('map_svg-hover');
      }
    }
  }

  // Gestion des survols (hover)
  function setupHover() {
    document.querySelectorAll('.map-markup').forEach(markup => {
      markup.addEventListener('mouseover', () => {
        const targetRegion = markup.dataset.region || markup.dataset.target;
        if (targetRegion) {
          // Ajouter la classe .map_svg-hover à l'élément correspondant dans le SVG
          document.querySelectorAll(`.map-active[data-region="${targetRegion}"]`).forEach(item => {
            item.classList.add('map_svg-hover');
          });
        }
      });

      markup.addEventListener('mouseout', () => {
        const targetRegion = markup.dataset.region || markup.dataset.target;
        if (targetRegion) {
          // Retirer la classe .map_svg-hover si la card n'est pas active
          document.querySelectorAll(`.map-active[data-region="${targetRegion}"]`).forEach(item => {
            const isCardActive = document.querySelector(`[map-card="${targetRegion}"]`).style.display === 'block';
            if (!isCardActive) {
              item.classList.remove('map_svg-hover');
            }
          });
        }
      });
    });
  }

  // Gestion des clics
  function setupClicks() {
    document.querySelectorAll('.map-markup').forEach(markup => {
      markup.addEventListener('click', () => {
        const region = markup.getAttribute('map-markup');
        if (region) {
          activateRegion(region);
        }
      });
    });
  }

  // Initialiser toutes les fonctionnalités
  initializeMap();
  setupHover();
  setupClicks();
});
