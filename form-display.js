document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector('[form-element="container"]'); // Conteneur principal
  const triggersContainer = document.querySelector('[form-element="triggers"]'); // Conteneur des triggers
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]'); // Tous les triggers
  const forms = {
    pro: document.querySelector('[form-profil="pro"]'), // Formulaire professionnel
    private: document.querySelector('[form-profil="private"]'), // Formulaire particulier
  };
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]'); // Bouton de réinitialisation
  const wishlistElement = document.querySelector('[form-element="wishlist"]'); // Élément Wishlist

  const resetDisplay = () => {
    formContainer.style.display = "none"; // Cacher le conteneur principal
    triggersContainer.style.display = "block"; // Afficher les triggers
    Object.values(forms).forEach((form) => {
      if (form) form.style.display = "none"; // Cacher tous les formulaires
    });
    if (wishlistElement && window.innerWidth < 767) {
      wishlistElement.style.display = "none"; // Cacher la wishlist
    }
    localStorage.removeItem("formPreference"); // Supprimer les préférences sauvegardées
  };

  const savedPreference = localStorage.getItem("formPreference");
  if (savedPreference && forms[savedPreference]) {
    formContainer.style.display = "block";
    triggersContainer.style.display = "none";

    // Masquer tous les formulaires et afficher uniquement celui correspondant à la préférence
    Object.keys(forms).forEach((key) => {
      forms[key].style.display = key === savedPreference ? "block" : "none";
    });

    // Afficher la wishlist si elle n'est pas déjà cachée par un autre script
    if (wishlistElement && getComputedStyle(wishlistElement).display !== "none") {
      wishlistElement.style.display = "block";
    }
  } else {
    resetDisplay();
  }

  triggerButtons.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger");
      if (formType && forms[formType]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none"; // Cacher le conteneur parent des triggers
        Object.keys(forms).forEach((key) => {
          forms[key].style.display = key === formType ? "block" : "none";
        });
        if (wishlistElement && getComputedStyle(wishlistElement).display !== "none") {
          wishlistElement.style.display = "block";
        }
        localStorage.setItem("formPreference", formType);
      }
    });
  });

  resetButton.addEventListener("click", () => {
    resetDisplay();
  });
});
