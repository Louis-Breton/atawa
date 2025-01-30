document.addEventListener("DOMContentLoaded", () => {
    // Récupérer les valeurs depuis le sessionStorage
    const formType = sessionStorage.getItem("formType");  // "Professionnel" ou "Particulier"
    const budget = sessionStorage.getItem("formBudget");  // Valeur sélectionnée dans le formulaire
    const civilite = sessionStorage.getItem("formCivilite"); // Civilité
    const nom = sessionStorage.getItem("formNom"); // Nom

    // Tableau de correspondance pour les formulaires et budgets
    const redirectMappings = {
        "Professionnel": {
            "< 3 000 €": "Professionnel_1",
            "3 000 > 5 000 €": "Professionnel_2",
            "5 000 > 10 000 €": "Professionnel_3",
            "10 000 > 20 000 €": "Professionnel_4",
            "20 000 > 50 000 €": "Professionnel_5",
            "50 000 > 100 000 €": "Professionnel_6",
            "100 000 > 200 000 €": "Professionnel_7",
            "> 200 000 €": "Professionnel_8"
        },
        "Particulier": {
            "< 3 000 €": "Particulier_1",
            "3 000 > 5 000 €": "Particulier_2",
            "5 000 > 10 000 €": "Particulier_3",
            "10 000 > 20 000 €": "Particulier_4",
            "20 000 > 50 000 €": "Particulier_5",
            "50 000 > 100 000 €": "Particulier_6",
            "100 000 > 200 000 €": "Particulier_7",
            "> 200 000 €": "Particulier_8"
        }
    };

    // Injection des valeurs dans la page (civilité et nom)
    if (civilite) {
        const civiliteSpan = document.querySelector('span[data-form="civilite"]');
        if (civiliteSpan) civiliteSpan.textContent = civilite;
    }

    if (nom) {
        const nomSpan = document.querySelector('span[data-form="nom"]');
        if (nomSpan) nomSpan.textContent = nom;
    }

    // Vérifier si les données sont valides pour l'envoi au dataLayer
    if (formType && budget) {
        const budgetCategory = redirectMappings[formType]?.[budget] || "Inconnu";

        // Envoyer les données à GA4 via le dataLayer avec le bon format
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "briefSubmission",
            form: budgetCategory // Ex: "Professionnel_3" ou "Particulier_5"
        });

        console.log("Données envoyées à GA4:", {
            event: "briefSubmission",
            form: budgetCategory
        });
    }
});
