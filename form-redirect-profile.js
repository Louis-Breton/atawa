const saveToSessionStorage = (form) => {
  const id = form.id; // ex: wf-form-brief-pro
  const prefixMatch = id.match(/brief-(pro|private|agency)/);
  if (!prefixMatch) return;

  const prefix = prefixMatch[1]; // pro, private, agency

  const civilite = form.querySelector(`[name="brief-${prefix}-civilite"]:checked`)?.value || "";
  const nom = form.querySelector(`#brief-${prefix}-last-name`)?.value.trim() || "";
  const budget = form.querySelector(`[name="brief-${prefix}-budget"]`)?.value || "";
  const role = form.querySelector(`[name="brief-${prefix}-role"]`)?.value || "";

  // Déduire le type de formulaire à partir du prefix
  const formTypeMap = {
    pro: "Professionnel",
    private: "Particulier",
    agency: "Professionnel événementiel"
  };
  const formType = formTypeMap[prefix] || "";

  // Nettoyage si vide
  if (!budget) sessionStorage.removeItem("formBudget");
  if (!role) sessionStorage.removeItem("formRole");

  // Enregistrement des données
  if (formType) sessionStorage.setItem("formType", formType);
  if (civilite) sessionStorage.setItem("formCivilite", civilite);
  if (nom) sessionStorage.setItem("formNom", nom);
  if (budget) sessionStorage.setItem("formBudget", budget);
  if (role) sessionStorage.setItem("formRole", role);
};

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches("form[id^='wf-form-brief-']")) {
    saveToSessionStorage(form);
  }
});
