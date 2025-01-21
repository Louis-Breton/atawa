document.addEventListener("DOMContentLoaded", () => {
  // === Sélecteurs généraux ===
  const formContainer = document.querySelector('[form-element="container"]');
  const triggersContainer = document.querySelector('[form-element="triggers"]');
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]');
  const forms = {
    pro: document.querySelector('[form-profil="pro"]'),
    private: document.querySelector('[form-profil="private"]'),
  };
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]');
  const wishlistSection = document.querySelector('[form-element="wishlist"]'); // Section wishlist

  // === Gestion de la Wishlist ===
  /**
   * Vérifie la clé "wishlist" dans le localStorage pour afficher/masquer la section wishlist.
   */
  const updateWishlistVisibility = () => {
    if (wishlistSection) {
      const storedWishlist = localStorage.getItem("wishlist"); // Vérifie la clé "wishlist"
      if (storedWishlist) {
        const wishlist = JSON.parse(storedWishlist);
        if (wishlist.length > 0) {
          wishlistSection.style.display = "block"; // Affiche si des éléments sont présents
          console.log("Wishlist visible, nombre d'éléments :", wishlist.length);
        } else {
          wishlistSection.style.display = "none"; // Cache si la wishlist est vide
          console.log("Wishlist cachée car elle est vide.");
        }
      } else {
        wishlistSection.style.display = "none"; // Cache si la clé "wishlist" n'existe pas
        console.log("Wishlist cachée car aucune clé 'wishlist' trouvée.");
      }
    } else {
      console.error("Élément wishlist introuvable.");
    }
  };

  // === Gestion des Formulaires ===
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
  });

  // === Initialisation ===
  updateWishlistVisibility(); // Mise à jour de la visibilité de la wishlist
});
