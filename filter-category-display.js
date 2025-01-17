document.addEventListener("DOMContentLoaded", function () {
    // Récupération des catégories dans la grille
    const gridElements = document.querySelectorAll('[fs-cmsfilter-element="list"] [fs-cmsfilter-field="category"]');
    const gridCategories = new Set();

    // Extraction des catégories uniques dans la grille
    gridElements.forEach((element) => {
        const category = element.textContent.trim().toLowerCase(); // Suppression des espaces et mise en minuscule
        if (category) {
            gridCategories.add(category);
        }
    });

    // Parcours des tags pour vérifier les correspondances
    const tags = document.querySelectorAll('[tag-filter="wrapper"] [tag-filter="category"]');
    tags.forEach((tag) => {
        const categoryField = tag.querySelector('[fs-cmsfilter-field="category"]');
        if (categoryField) {
            const tagCategory = categoryField.textContent.trim().toLowerCase(); // Mise en minuscule
            if (!gridCategories.has(tagCategory)) {
                // Aucune correspondance trouvée, masquer le tag
                tag.style.display = "none";
            }
        }
    });
});
