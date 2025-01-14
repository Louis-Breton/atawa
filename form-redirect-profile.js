document.addEventListener("DOMContentLoaded", () => {
    // Tableau de correspondance pour les formulaires
    const redirectMappings = {
        "wf-form-brief-pro": {
            "brief-pro-budget": {
                "< 3 000 €": "Professionnel_1",
                "3 000 > 5 000 €": "Professionnel_2",
                "5 000 > 10 000 €": "Professionnel_3",
                "10 000 > 20 000 €": "Professionnel_4",
                "20 000 > 50 000 €": "Professionnel_5",
                "50 000 > 100 000 €": "Professionnel_6",
                "100 000 > 200 000 €": "Professionnel_7",
                "> 200 000 €": "Professionnel_8"
            }
        },
        "wf-form-brief-private": {
            "brief-private-budget": {
                "< 3 000 €": "Particulier_1",
                "3 000 > 5 000 €": "Particulier_2",
                "5 000 > 10 000 €": "Particulier_3",
                "10 000 > 20 000 €": "Particulier_4",
                "20 000 > 50 000 €": "Particulier_5",
                "50 000 > 100 000 €": "Particulier_6",
                "100 000 > 200 000 €": "Particulier_7",
                "> 200 000 €": "Particulier_8"
            }
        }
    };

    // Fonction de redirection
    const handleFormSubmit = (event) => {
        event.preventDefault(); // Empêche la soumission native
        const form = event.target; // Le formulaire soumis
        const formId = form.getAttribute("id"); // Récupère l'ID du formulaire
        const formMapping = redirectMappings[formId]; // Trouve le mapping correspondant

        if (formMapping) {
            // Trouve le champ <select> dans le formulaire
            const selectName = Object.keys(formMapping)[0];
            const selectElement = form.querySelector(`#${selectName}, [name="${selectName}"]`);

            if (selectElement) {
                const selectedValue = selectElement.value.trim(); // Récupère la valeur sélectionnée
                const profil = formMapping[selectName][selectedValue]; // Correspondance du profil

                if (profil) {
                    // Détecte automatiquement le répertoire de langue
                    const languageDirectory = window.location.pathname.split('/')[1]; // Extrait "fr", "en", etc.

                    // URL de redirection
                    const redirectUrl = `/${languageDirectory}/lp/merci-brief/?profil=${profil}`;

                    // Redirection avec un délai
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 100); // 200ms de délai
                }
            }
        }
    };

    // Ajout des écouteurs d'événements pour chaque formulaire
    Object.keys(redirectMappings).forEach((formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", handleFormSubmit);
        }
    });
});
