document.addEventListener("DOMContentLoaded", () => {
  // Récupérer les valeurs depuis le sessionStorage
  const formType = sessionStorage.getItem("formType");
  const budget = sessionStorage.getItem("formBudget");
  const civilite = sessionStorage.getItem("formCivilite");
  const nom = sessionStorage.getItem("formNom");
  const role = sessionStorage.getItem("formLeadRole");

  // Mapping des segments budgétaires
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

  // Affichage conditionnel : civilité
  const civiliteSpan = document.querySelector('span[data-form="civilite"]');
  if (civiliteSpan) {
    if (civilite) {
      civiliteSpan.textContent = civilite;
      civiliteSpan.style.display = "";
    } else {
      civiliteSpan.style.display = "none";
    }
  }

  // Affichage conditionnel : nom
  const nomSpan = document.querySelector('span[data-form="nom"]');
  if (nomSpan) {
    if (nom) {
      nomSpan.textContent = nom;
      nomSpan.style.display = "";
    } else {
      nomSpan.style.display = "none";
    }
  }

  // Affichage conditionnel : rôle
  const roleSpan = document.querySelector('span[data-form="role"]');
  if (roleSpan) {
    if (role) {
      roleSpan.textContent = role;
      roleSpan.style.display = "";
    } else {
      roleSpan.style.display = "none";
    }
  }

  // Envoi dans le dataLayer
  if (formType && budget) {
    const budgetCategory = redirectMappings[formType]?.[budget] || "Inconnu";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "briefSubmission",
      form: budgetCategory,
      formType: formType,
      formBudget: budget,
      leadRole: role || ""
    });
  }
});
