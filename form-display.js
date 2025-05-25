document.addEventListener("DOMContentLoaded", () => {
  // === Sélecteurs généraux ===
  const formContainer = document.querySelector('[form-element="container"]');
  const triggersContainer = document.querySelector('[form-element="triggers"]');
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]');
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]');
  const wishlistSection = document.querySelector('[form-element="wishlist"]');
  const proRoleWrapper = document.querySelector('[role-pro="wrapper"]');
  const proRoleInput = document.querySelector('#brief-pro-lead-role');
  const proCompanyInput = document.querySelector('#brief-pro-company');
  const roleLabelDestination = document.querySelector('p[role-label="destination"]');

  // === Initialisation dynamique des formulaires ===
  const forms = {};
  document.querySelectorAll('[form-profil]').forEach((form) => {
    const key = form.getAttribute('form-profil');
    forms[key] = form;
  });

  // === Wishlist ===
  const updateWishlistVisibility = () => {
    if (wishlistSection) {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        const wishlist = JSON.parse(storedWishlist);
        wishlistSection.style.display = wishlist.length > 0 ? "block" : "none";
        console.log(`Wishlist ${wishlist.length > 0 ? "visible" : "cachée"}, nombre d'éléments :`, wishlist.length);
      } else {
        wishlistSection.style.display = "none";
        console.log("Wishlist cachée car aucune clé 'wishlist' trouvée.");
      }
    } else {
      console.error("Élément wishlist introuvable.");
    }
  };

  // === Formulaires ===
  const resetDisplay = () => {
    formContainer.style.display = "none";
    triggersContainer.style.display = "block";
    if (proRoleWrapper) proRoleWrapper.style.display = "none";
    triggerButtons.forEach(btn => btn.style.display = "inline-block");
    Object.values(forms).forEach((form) => {
      form.style.display = "none";
    });
    localStorage.removeItem("formPreference");
    localStorage.removeItem("formPreferenceExpiration");
  };

  const isPreferenceExpired = () => {
    const expiration = localStorage.getItem("formPreferenceExpiration");
    if (!expiration) return true;
    const now = Date.now();
    return now > parseInt(expiration, 10);
  };

  const savedPreference = localStorage.getItem("formPreference");
  if (savedPreference && forms[savedPreference] && !isPreferenceExpired()) {
    formContainer.style.display = "block";
    triggersContainer.style.display = "none";
    Object.entries(forms).forEach(([key, form]) => {
      form.style.display = key === savedPreference ? "block" : "none";
    });
  } else {
    resetDisplay();
  }

  // === Boutons de déclenchement ===
  triggerButtons.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger");

      if (formType === "pro") {
        if (proRoleWrapper) proRoleWrapper.style.display = "block";
        triggerButtons.forEach(btn => {
          if (btn !== trigger) btn.style.display = "none";
        });
        return;
      }

      if (formType && forms[formType]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";
        Object.entries(forms).forEach(([key, form]) => {
          form.style.display = key === formType ? "block" : "none";
        });
        localStorage.setItem("formPreference", formType);
        localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      }
    });
  });

  // === Comportement au clic sur une valeur de rôle (pro uniquement) ===
  document.querySelectorAll('[role-value]').forEach((el) => {
    el.addEventListener("click", () => {
      const roleValue = el.getAttribute("role-value");
      const roleCompany = el.getAttribute("role-company");
      const labelOrigin = el.querySelector('[role-label="origin"]');
      const labelText = labelOrigin ? labelOrigin.textContent : "";

      if (proRoleInput) {
        proRoleInput.value = roleValue;
      }
      if (roleCompany && proCompanyInput) {
        proCompanyInput.placeholder = roleCompany;
      }
      if (roleLabelDestination && labelText) {
        roleLabelDestination.textContent = labelText;
      }
      if (proRoleWrapper) {
        proRoleWrapper.style.display = "none";
      }
      window.scrollTo(0, 0);

      const formType = "pro";
      if (forms[formType]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";
        Object.entries(forms).forEach(([key, form]) => {
          form.style.display = key === formType ? "block" : "none";
        });
        localStorage.setItem("formPreference", formType);
        localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      }
    });
  });

  // === Réinitialisation ===
  resetButton.addEventListener("click", resetDisplay);

  // === Initialisation Wishlist ===
  updateWishlistVisibility();
});
