// Fonction pour enregistrer uniquement les valeurs du formulaire soumis dans le sessionStorage
const saveToSessionStorage = (form) => {
    let civilite = "";
    let nom = "";
    let budget = "";
    let formType = "";

    // Détermine le type de formulaire et récupère les valeurs correspondantes
    if (form.id === "wf-form-brief-pro") {
        civilite = form.querySelector('[name="brief-pro-civilite"]:checked')?.value || "";
        nom = form.querySelector('#brief-pro-last-name')?.value.trim() || "";
        budget = form.querySelector('[name="brief-pro-budget"]')?.value || "";
        formType = "Professionnel";
    } else if (form.id === "wf-form-brief-private") {
        civilite = form.querySelector('[name="brief-private-civilite"]:checked')?.value || "";
        nom = form.querySelector('#brief-private-last-name')?.value.trim() || "";
        budget = form.querySelector('[name="brief-private-budget"]')?.value || "";
        formType = "Particulier";
    }

    // Vérifier si on doit supprimer une ancienne valeur non mise à jour
    if (!budget) {
        sessionStorage.removeItem("formBudget");
    }

    // Enregistre uniquement les nouvelles valeurs du formulaire soumis
    if (formType) {
        sessionStorage.setItem("formType", formType);
    }
    if (civilite) {
        sessionStorage.setItem("formCivilite", civilite);
    }
    if (nom) {
        sessionStorage.setItem("formNom", nom);
    }
    if (budget) {
        sessionStorage.setItem("formBudget", budget);
    }
};

// Ajout d'un écouteur d'événement pour détecter la soumission des formulaires
document.addEventListener("submit", (event) => {
    const form = event.target;

    if (form.id === "wf-form-brief-pro" || form.id === "wf-form-brief-private") {
        saveToSessionStorage(form);
    }
});
