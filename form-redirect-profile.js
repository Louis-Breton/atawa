document.addEventListener("DOMContentLoaded", function () {
  const saveToSessionStorage = (form) => {
    const prefix = form.getAttribute('form-prefix');
    if (!prefix) return;

    const civilite = form.querySelector(`[name="brief-${prefix}-civilite"]:checked`)?.value || "";
    const nom = form.querySelector(`#brief-${prefix}-last-name`)?.value.trim() || "";
    const budget = form.querySelector(`[name="brief-${prefix}-budget"]`)?.value || "";

    const formTypeMap = {
      pro: "Professionnel",
      private: "Particulier",
      agency: "Professionnel événementiel"
    };

    const formType = formTypeMap[prefix] || "";

    if (!budget) {
      sessionStorage.removeItem("formBudget");
    }

    if (formType) sessionStorage.setItem("formType", formType);
    if (civilite) sessionStorage.setItem("formCivilite", civilite);
    if (nom) sessionStorage.setItem("formNom", nom);
    if (budget) sessionStorage.setItem("formBudget", budget);
  };

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (form.hasAttribute('form-prefix')) {
      saveToSessionStorage(form);
    }
  });
});
