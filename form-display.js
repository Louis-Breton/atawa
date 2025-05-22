document.addEventListener("DOMContentLoaded", () => {
  // === Sélecteurs généraux ===
  const formContainer = document.querySelector('[form-element="container"]');
  const triggersContainer = document.querySelector('[form-element="triggers"]');
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]');
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]');
  const wishlistSection = document.querySelector('[form-element="wishlist"]');

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

  // === Réinitialisation ===
  resetButton.addEventListener("click", resetDisplay);

  // === Initialisation Wishlist ===
  updateWishlistVisibility();
});
