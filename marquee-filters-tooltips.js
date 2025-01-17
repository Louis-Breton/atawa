document.addEventListener('DOMContentLoaded', () => {
    // SCRIPT 1 : Gestion des filtres

    // Sélectionner le bouton "Toutes"
    const clearButton = document.querySelector('[fs-cmsfilter-element="clear"]');

    // Sélectionner tous les autres filtres
    const filterButtons = document.querySelectorAll('[fs-cmsfilter-active="is-active"]');

    if (clearButton && filterButtons) {
        // Ajouter un événement de clic au bouton "Toutes"
        clearButton.addEventListener('click', () => {
            // Ajouter la classe is-active au bouton "Toutes"
            clearButton.classList.add('is-active');

            // Retirer la classe is-active des autres filtres
            filterButtons.forEach(button => {
                if (button !== clearButton) {
                    button.classList.remove('is-active');
                }
            });
        });

        // Ajouter un événement de clic à chaque filtre
        filterButtons.forEach(button => {
            if (button !== clearButton) {
                button.addEventListener('click', () => {
                    // Retirer la classe is-active du bouton "Toutes"
                    clearButton.classList.remove('is-active');

                    // Ajouter la classe is-active au bouton cliqué
                    button.classList.add('is-active');
                });
            }
        });
    }

    // SCRIPT 2 : Gestion des tooltips

    // Sélectionne tous les éléments ayant la classe .dynamic-radio-tag avec l'attribut [tooltip-active]
    const tags = document.querySelectorAll(".dynamic-radio-tag [tooltip-active]");
    // Sélectionne tous les tooltips avec la classe .tooltip-banner
    const tooltips = document.querySelectorAll(".tooltip-banner");
    // Sélectionne le bouton de réinitialisation
    const resetButton = document.querySelector(".filter-reset-button");
    let activeTooltip = null;

    // Fonction pour cacher tous les tooltips
    function hideAllTooltips() {
        tooltips.forEach(tooltip => {
            tooltip.style.display = "none";
        });
        activeTooltip = null;
    }

    // Ajoute un événement de clic à chaque tag
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const tooltipActiveValue = tag.getAttribute("tooltip-active");

            // Trouve le tooltip correspondant à l'attribut tooltip-active
            const tooltip = Array.from(tooltips).find(
                t => t.getAttribute("tooltip-data") === tooltipActiveValue
            );

            // Cache le tooltip actif actuel s'il est différent de celui sur lequel on a cliqué
            if (activeTooltip && activeTooltip !== tooltip) {
                activeTooltip.style.display = "none";
            }

            // Affiche le nouveau tooltip si ce n'est pas déjà le tooltip actif
            if (tooltip && tooltip !== activeTooltip) {
                tooltip.style.display = "flex";
                activeTooltip = tooltip;
            }
        });
    });

    // Ajoute un événement de clic au bouton de réinitialisation
    if (resetButton) {
        resetButton.addEventListener("click", hideAllTooltips);
    }
});
