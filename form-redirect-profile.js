document.addEventListener("DOMContentLoaded", () => {
  // Sélecteur universel pour tous les formulaires avec attribut form-prefix
  const formSelector = "form[form-prefix]";

  // Dictionnaire pour convertir les préfixes en type de formulaire lisible
  const formTypeMap = {
    pro: "Professionnel",
    private: "Particulier",
    agency: "Professionnel événementiel"
  };

  /**
   * Enregistre une valeur d'un champ dans le sessionStorage
   * @param {HTMLFormElement} form - Le formulaire source
   * @param {string} name - Le nom ou l'ID du champ
   * @param {string} value - La valeur à enregistrer
   */
  const saveField = (form, name, value) => {
    const prefix = form.getAttribute("form-prefix");
    if (!prefix) return;

    // On enregistre le type de formulaire une seule fois
    if (!sessionStorage.getItem("formType")) {
      const formType = formTypeMap[prefix] || "";
      if (formType) sessionStorage.setItem("formType", formType);
    }

    // Mapping entre les noms de champs HTML et les clés dans le sessionStorage
    const keyMap = {
      [`brief-${prefix}-civilite`]: "formCivilite",
      [`brief-${prefix}-last-name`]: "formNom",
      [`brief-${prefix}-budget`]: "formBudget",
      [`brief-${prefix}-lead-role`]: "formLeadRole"
    };

    const storageKey = keyMap[name];

    // Si une correspondance est trouvée, on enregistre ou on supprime
    if (storageKey) {
      if (value && value.trim() !== "") {
        sessionStorage.setItem(storageKey, value);
      } else {
        sessionStorage.removeItem(storageKey);
      }
    }
  };

  // On parcourt tous les formulaires avec un form-prefix
  document.querySelectorAll(formSelector).forEach(form => {
    const prefix = form.getAttribute("form-prefix");
    if (!prefix) return;

    // Liste des champs standards à surveiller
    const selectors = [
      `input[name="brief-${prefix}-civilite"]`,        // radio
      `input[name="brief-${prefix}-last-name"]`,        // nom
      `select[name="brief-${prefix}-budget"]`,         // budget (select)
      `select[name="brief-${prefix}-lead-role"]`,      // rôle (select alternatif)
      `input[name="brief-${prefix}-budget"]`,          // budget (input alternatif)
      `input[name="brief-${prefix}-lead-role"]`        // rôle (input alternatif)
    ];

    // Pour chaque champ, on ajoute un listener d’enregistrement dynamique
    selectors.forEach(selector => {
      form.querySelectorAll(selector).forEach(field => {
        const name = field.getAttribute("name") || field.getAttribute("id");
        if (!name) return;

        // Choix de l'événement : 'change' pour radios/selects, 'input' sinon
        const eventType = field.type === "radio" || field.tagName === "SELECT" ? "change" : "input";

        // Ajout du listener d'enregistrement
        field.addEventListener(eventType, () => {
          const value = field.type === "radio"
            ? form.querySelector(`[name="${name}"]:checked`)?.value || ""
            : field.value;

          saveField(form, name, value);
        });
      });
    });
  });

  // 🎯 Ciblage spécifique du wrapper contenant les boutons role-value
  const roleWrapper = document.querySelector('[role-pro="wrapper"]');
  if (roleWrapper) {
    // Surveille tous les boutons avec l’attribut role-value à l’intérieur
    roleWrapper.querySelectorAll('[role-value]').forEach(button => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('role-value');

        // Enregistrement immédiat dans le sessionStorage sous formLeadRole
        if (value) sessionStorage.setItem("formLeadRole", value);
      });
    });
  }
});
