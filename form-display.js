document.addEventListener("DOMContentLoaded", () => {
  // === Sélecteurs principaux ===
  const formContainer = document.querySelector('[form-element="container"]');
  const triggersContainer = document.querySelector('[form-element="triggers"]');
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]');
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]');
  const wishlistSection = document.querySelector('[form-element="wishlist"]');
  const roleWrapper = document.querySelector('[role-pro="wrapper"]');
  const roleDestination = document.querySelector('[role-label="destination"]');
  const companyInput = document.querySelector('#brief-pro-company');
  const leadRoleInput = document.querySelector('#brief-pro-lead-role');

  // === Mapping des formulaires selon leur attribut `form-profil` ===
  const forms = {};
  document.querySelectorAll('[form-profil]').forEach(form => {
    const key = form.getAttribute('form-profil');
    forms[key] = form;
  });

  // === Affiche ou masque la section wishlist en fonction du contenu localStorage ===
  const updateWishlistVisibility = () => {
    if (!wishlistSection) return;
    const storedWishlist = localStorage.getItem("wishlist");
    if (!storedWishlist) return wishlistSection.style.display = "none";
    const wishlist = JSON.parse(storedWishlist);
    wishlistSection.style.display = wishlist.length > 0 ? "block" : "none";
  };

  // === Réinitialise l'affichage complet (retour à l'état initial) ===
  const resetDisplay = () => {
    formContainer.style.display = "none";
    triggersContainer.style.display = "block";

    triggerButtons.forEach(trigger => {
      trigger.style.removeProperty("display");
    });

    Object.values(forms).forEach(form => {
      form.style.display = "none";
    });

    if (roleWrapper) {
      roleWrapper.style.display = "none";
    }

    // Suppression des préférences stockées
    localStorage.removeItem("formPreference");
    localStorage.removeItem("formPreferenceExpiration");
    localStorage.removeItem("leadRoleLabel");
    localStorage.removeItem("leadRoleValue");
    localStorage.removeItem("leadCompanyPlaceholder");

    // Réinitialisation des champs
    if (companyInput) {
      companyInput.placeholder = "Indiquez votre entreprise";
    }

    if (roleDestination) {
      roleDestination.textContent = "";
    }

    if (leadRoleInput) {
      leadRoleInput.value = "";
    }
  };

  // === Vérifie si la préférence stockée est expirée ===
  const isPreferenceExpired = () => {
    const expiration = localStorage.getItem("formPreferenceExpiration");
    if (!expiration) return true;
    return Date.now() > parseInt(expiration, 10);
  };

  // === Tentative de récupération de la préférence utilisateur ===
  const savedPreference = localStorage.getItem("formPreference");

  // === Si une préférence valide est trouvée, on restaure l'état de l'UI ===
  if (savedPreference && forms[savedPreference] && !isPreferenceExpired()) {
    formContainer.style.display = "block";
    triggersContainer.style.display = "none";

    Object.entries(forms).forEach(([key, form]) => {
      form.style.display = key === savedPreference ? "block" : "none";
    });

    if (savedPreference === "pro") {
      if (roleDestination) {
        roleDestination.textContent = localStorage.getItem("leadRoleLabel") || "";
      }
      if (companyInput) {
        const savedPlaceholder = localStorage.getItem("leadCompanyPlaceholder");
        if (savedPlaceholder) companyInput.placeholder = savedPlaceholder;
      }
      if (leadRoleInput) {
        leadRoleInput.value = localStorage.getItem("leadRoleValue") || "";
      }
    }
  } else {
    // Sinon, reset complet
    resetDisplay();
  }

  // === Gestion du clic sur les boutons de trigger (choix d’un profil) ===
  triggerButtons.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger");
      if (!formType) return;

      if (formType === "pro" && roleWrapper) {
        // Si "pro" : affichage d’un sous-menu pour choisir un rôle
        roleWrapper.style.display = "block";

        // On masque les autres boutons
        triggerButtons.forEach(btn => {
          if (btn !== trigger) btn.style.display = "none";
        });

        return;
      }

      // Affichage direct du formulaire sélectionné
      if (forms[formType]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";

        Object.entries(forms).forEach(([key, form]) => {
          form.style.display = key === formType ? "block" : "none";
        });

        // Stockage des préférences
        localStorage.setItem("formPreference", formType);
        localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      }
    });
  });

  // === Bouton de réinitialisation générale ===
  resetButton.addEventListener("click", resetDisplay);

  // === Gestion du clic dans le wrapper des rôles PRO ===
  if (roleWrapper) {
    roleWrapper.addEventListener("click", e => {
      const roleValueEl = e.target.closest('[role-value]');
      if (!roleValueEl) return;

      // Extraction des données du rôle sélectionné
      const roleValue = roleValueEl.getAttribute("role-value") || "";
      const roleCompany = roleValueEl.getAttribute("role-company") || "";
      const roleLabelOrigin = roleValueEl.querySelector('[role-label="origin"]')?.textContent.trim() || "";

      // Injection dans l’interface et dans le champ hidden
      if (leadRoleInput) leadRoleInput.value = roleValue;
      if (companyInput) companyInput.placeholder = roleCompany;
      if (roleDestination) roleDestination.textContent = roleLabelOrigin;

      // Enregistrement dans le localStorage
      localStorage.setItem("formPreference", "pro");
      localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      localStorage.setItem("leadRoleLabel", roleLabelOrigin);
      localStorage.setItem("leadRoleValue", roleValue); // 💾 Nouvelle clé importante
      localStorage.setItem("leadCompanyPlaceholder", roleCompany);

      // Affichage du bon formulaire
      if (forms["pro"]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";
        forms["pro"].style.display = "block";
      }

      // On masque le sélecteur de rôle et on remonte la page
      roleWrapper.style.display = "none";
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  // === Affiche ou masque la wishlist au chargement ===
  updateWishlistVisibility();
});
