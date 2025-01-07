document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments principaux
  const formContainer = document.querySelector('[form-element="container"]'); // Conteneur principal
  const triggersContainer = document.querySelector('[form-element="triggers"]'); // Conteneur des triggers
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]'); // Tous les boutons de trigger
  const forms = {
    pro: document.querySelector('[form-profil="pro"]'), // Formulaire professionnel
    private: document.querySelector('[form-profil="private"]'), // Formulaire particulier
  };
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]'); // Bouton de réinitialisation
  const wishlistElement = document.querySelector('[form-element="wishlist"]'); // Élément Wishlist

  /**
   * Réinitialise l'affichage des éléments et supprime la préférence sauvegardée.
   */
  const resetDisplay = () => {
    formContainer.style.display = "none"; // Cacher le conteneur principal
    triggersContainer.style.display = "block"; // Afficher les triggers
    Object.values(forms).forEach((form) => {
      if (form) form.style.display = "none"; // Cacher tous les formulaires
    });
    localStorage.removeItem("formPreference"); // Supprimer les préférences sauvegardées
    localStorage.removeItem("formPreferenceExpiration"); // Supprimer l'expiration
  };

  /**
   * Affiche la wishlist si elle n'est pas déjà cachée par un autre script.
   */
  const ensureWishlistVisible = () => {
    if (wishlistElement && getComputedStyle(wishlistElement).display === "none") {
      wishlistElement.style.display = "block"; // Afficher la wishlist
    }
  };

  /**
   * Vérifie si la préférence est expirée.
   * @returns {boolean} - true si expiré, false sinon.
   */
  const isPreferenceExpired = () => {
    const expiration = localStorage.getItem("formPreferenceExpiration");
    if (!expiration) return true; // Si aucune expiration n'est définie, considérer comme expirée
    const now = new Date().getTime();
    return now > parseInt(expiration, 10); // Comparer le temps actuel avec l'expiration
  };

  // Chargement de la préférence sauvegardée
  const savedPreference = localStorage.getItem("formPreference");
  if (savedPreference && forms[savedPreference] && !isPreferenceExpired()) {
    formContainer.style.display = "block"; // Afficher le conteneur principal
    triggersContainer.style.display = "none"; // Cacher les triggers

    // Afficher uniquement le formulaire correspondant à la préférence
    Object.keys(forms).forEach((key) => {
      forms[key].style.display = key === savedPreference ? "block" : "none";
    });
  } else {
    resetDisplay(); // Réinitialiser si la préférence est expirée ou invalide
  }

  // Assurer l'affichage de la wishlist par défaut
  ensureWishlistVisible();

  // Gérer les clics sur les boutons de trigger
  triggerButtons.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger");
      if (formType && forms[formType]) {
        formContainer.style.display = "block"; // Afficher le conteneur principal
        triggersContainer.style.display = "none"; // Cacher les triggers
        Object.keys(forms).forEach((key) => {
          forms[key].style.display = key === formType ? "block" : "none"; // Afficher le bon formulaire
        });
        // Sauvegarder la préférence avec une expiration
        localStorage.setItem("formPreference", formType);
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Ajouter 1 heure
        localStorage.setItem("formPreferenceExpiration", expirationTime);
      }
    });
  });

  // Gérer les clics sur le bouton de réinitialisation
  resetButton.addEventListener("click", () => {
    resetDisplay(); // Réinitialiser les préférences et l'affichage
    ensureWishlistVisible(); // Assurer que la wishlist reste visible après réinitialisation
  });
});
