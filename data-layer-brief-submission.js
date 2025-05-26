document.addEventListener("DOMContentLoaded", () => {
  // Récupération depuis sessionStorage
  const formType = sessionStorage.getItem("formType");
  const budget = sessionStorage.getItem("formBudget");
  const civilite = sessionStorage.getItem("formCivilite");
  const nom = sessionStorage.getItem("formNom");
  const leadRole = sessionStorage.getItem("formLeadRole");

  // Affichage conditionnel des champs visibles uniquement
  const mappings = [
    { key: civilite, selector: 'span[data-form="civilite"]' },
    { key: nom, selector: 'span[data-form="nom"]' },
    { key: leadRole, selector: 'span[data-form="leadrole"]' }
  ];

  mappings.forEach(({ key, selector }) => {
    const span = document.querySelector(selector);
    if (span) {
      if (key) {
        span.textContent = key;
        span.style.display = "";
      } else {
        span.style.display = "none";
      }
    }
  });

  // Mapping des segments pour dataLayer uniquement
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

  if (formType && budget) {
    const budgetCategory = redirectMappings[formType]?.[budget] || "Inconnu";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "briefSubmission",
      form: budgetCategory,
      formType: formType,
      formBudget: budget,
      leadRole: leadRole || ""
    });
  }
});
