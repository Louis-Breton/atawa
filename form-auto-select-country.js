document.addEventListener('DOMContentLoaded', () => {
        // Assurez-vous que le script dropdown-populate est exécuté avant
        setTimeout(() => {
            // Détecte le répertoire de langue
            const languageDirectory = window.location.pathname.split('/')[1];

            // Détermine le pays par défaut en fonction du répertoire de langue
            const defaultCountry = {
                'fr': 'France',
                'en': 'France',
                'uk': 'Royaume-Uni',
                'fr-ch': 'Suisse',
                'en-ch': 'Suisse'
            }[languageDirectory] || ''; // Valeur par défaut si non trouvé

            if (!defaultCountry) return; // Aucun pays par défaut à définir

            // Liste des champs à remplir
            const fields = [
                { selectId: 'brief-private-country', dropdownId: 'brief-private-country-drop' },
                { selectId: 'brief-pro-country', dropdownId: 'brief-pro-country-drop' }
            ];

            // Applique la sélection automatique
            fields.forEach(({ selectId, dropdownId }) => {
                const selectElement = document.getElementById(selectId);
                const dropdownElement = document.getElementById(dropdownId);

                if (selectElement) {
                    // Sélectionne la valeur dans le <select>
                    const option = Array.from(selectElement.options).find(opt => opt.value === defaultCountry);
                    if (option) {
                        option.selected = true;
                        console.log(`${selectId} défini sur ${defaultCountry}`);
                    }
                }

                if (dropdownElement) {
                    // Sélectionne la valeur dans le dropdown
                    const dropdownLink = dropdownElement.querySelector(`a[data-value="${defaultCountry}"]`);
                    if (dropdownLink) {
                        const dropdownToggle = dropdownElement.querySelector('.w-dropdown-toggle div');
                        if (dropdownToggle) dropdownToggle.textContent = defaultCountry; // Met à jour l'affichage
                        console.log(`${dropdownId} défini sur ${defaultCountry}`);
                    }
                }
            });
        }, 100); // Délai pour garantir que dropdown-populate.min.js est terminé
    });
