document.addEventListener('DOMContentLoaded', () => {
  // Assurez-vous que le script dropdown-populate est exécuté avant
  setTimeout(() => {
    // 1. Détermine le pays par défaut selon la langue
    const languageDirectory = window.location.pathname.split('/')[1];
    const defaultCountry = {
      'fr': 'France',
      'en': 'France',
      'uk': 'Royaume-Uni',
      'fr-ch': 'Suisse',
      'en-ch': 'Suisse'
    }[languageDirectory] || '';

    if (!defaultCountry) return;

    // 2. Cible tous les blocs dropdown contenant un pays à remplir
    const countryBlocks = document.querySelectorAll('[drop-type="country"]');

    countryBlocks.forEach((dropdownWrapper) => {
      // a. Cible le <select> à l’intérieur
      const selectElement = dropdownWrapper.querySelector('select');
      if (selectElement) {
        const matchingOption = Array.from(selectElement.options).find(opt => opt.value === defaultCountry);
        if (matchingOption) {
          matchingOption.selected = true;
          console.log(`Select dans [drop-type="country"] défini sur ${defaultCountry}`);
        }
      }

      // b. Cible le composant dropdown affiché
      const dropdownLink = dropdownWrapper.querySelector(`a[data-value="${defaultCountry}"]`);
      const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle div');
      if (dropdownLink && dropdownToggle) {
        dropdownToggle.textContent = defaultCountry;
        console.log(`Dropdown visuel dans [drop-type="country"] défini sur ${defaultCountry}`);
      }
    });
  }, 100); // Attend la fin de dropdown-populate.min.js
});
