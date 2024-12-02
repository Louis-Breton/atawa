document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments principaux
  const container = document.querySelector('[form-element="container"]'); // Conteneur principal
  const triggerContainer = document.querySelector('[form-element="triggers"]'); // Conteneur des triggers
  const triggers = triggerContainer.querySelectorAll('[form-trigger]'); // Tous les triggers
  const forms = {
    pro: document.querySelector('[form-profil="pro"]'), // Formulaire professionnel
    private: document.querySelector('[form-profil="private"]'), // Formulaire particulier
  };
  const resetBtn = container.querySelector('[form-element="reset-btn"]'); // Bouton de réinitialisation
  const wishlist = document.querySelector('[form-element="wishlist"]'); // Élément Wishlist

  /**
   * Réinitialiser l'affichage à l'état par défaut
   */
  const resetDisplay = () => {
    container.style.display = "none"; // Cacher le conteneur principal
    triggerContainer.style.display = "block"; // Afficher les triggers
    Object.values(forms).forEach((form) => {
      if (form) form.style.display = "none"; // Cacher tous les formulaires
    });
    // Cacher la wishlist si elle existe et si la fenêtre est inférieure à 767px
    if (wishlist && window.innerWidth < 767) {
      wishlist.style.display = "none";
    }
    // Supprimer les préférences sauvegardées
    localStorage.removeItem("formPreference");
  };

  /**
   * Charger l'état sauvegardé depuis le localStorage (si disponible)
   */
  const savedPreference = localStorage.getItem("formPreference");
  if (savedPreference && forms[savedPreference]) {
    // Restaurer l'état précédent
    container.style.display = "block";
    triggerContainer.style.display = "none";
    forms[savedPreference].style.display = "block";
    // Afficher la wishlist si elle n'est pas déjà cachée par un autre script
    if (wishlist && getComputedStyle(wishlist).display !== "none") {
      wishlist.style.display = "block";
    }
  } else {
    resetDisplay(); // Réinitialiser si aucune préférence sauvegardée
  }

  /**
   * Gérer les clics sur les triggers
   */
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger"); // Type de formulaire déclenché
      if (formType && forms[formType]) {
        // Afficher le conteneur principal et cacher les triggers
        container.style.display = "block";
        triggerContainer.style.display = "none";

        // Afficher le formulaire sélectionné et cacher les autres
        Object.keys(forms).forEach((key) => {
          forms[key].style.display = key === formType ? "block" : "none";
        });

        // Afficher la wishlist si elle n'est pas déjà cachée
        if (wishlist && getComputedStyle(wishlist).display !== "none") {
          wishlist.style.display = "block";
        }

        // Sauvegarder la préférence utilisateur
        localStorage.setItem("formPreference", formType);
      }
    });
  });

  /**
   * Gérer le clic sur le bouton de réinitialisation
   */
  resetBtn.addEventListener("click", () => {
    resetDisplay(); // Réinitialiser l'affichage
  });
});
