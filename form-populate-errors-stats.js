document.addEventListener('DOMContentLoaded', function () {
  // 1. Population dynamique des selects de période
  function populateMonthSelect(selectName) {
    const selectElement = document.querySelector('select[name="' + selectName + '"]');
    if (selectElement) {
      const existingValues = new Set();
      selectElement.querySelectorAll('option').forEach(option => {
        existingValues.add(option.value);
      });

      const lang = navigator.language || navigator.userLanguage || 'en';
      const monthNames = lang.toLowerCase().startsWith('fr')
        ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const today = new Date();
      for (let i = 0; i < 16; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const optionText = monthNames[date.getMonth()] + ' ' + date.getFullYear();

        if (!existingValues.has(optionText)) {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          selectElement.appendChild(option);
        }
      }
    }
  }
  populateMonthSelect('brief-pro-date-periode');
  populateMonthSelect('brief-private-date-periode');

  // 2. Vérification lors du clic sur le trigger (btn="check-error")
  document.querySelectorAll('[btn="check-error"]').forEach(triggerButton => {
    triggerButton.addEventListener('click', function () {
      const form = triggerButton.closest('form');
      if (!form) return;

      // Vérification des champs obligatoires (inputs, textarea, selects, checkboxes)
      form.querySelectorAll('input:not([type="radio"]), textarea, select').forEach(field => {
        if (field.hasAttribute('required')) {
          let valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
          let wrapper = field.closest('.form_field-wrapper');
          if (!valid) {
            field.classList.add('is-error');
            if (wrapper) {
              wrapper.classList.add('is-error');
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'block';
            }
          } else {
            field.classList.remove('is-error');
            if (wrapper) {
              wrapper.classList.remove('is-error');
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'none';
            }
          }
        }
      });

      // Vérification pour les champs de date (mobile et desktop)
      const fullDateContainer = form.querySelector('[date-switch="full-date"]');
      if (fullDateContainer) {
        const startDesktop = fullDateContainer.querySelector('input[name="brief-private-date-start-desktop"]');
        const endDesktop = fullDateContainer.querySelector('input[name="brief-private-date-end-desktop"]');
        const startMobile = fullDateContainer.querySelector('input[name="brief-private-date-start-mobile"]');
        const endMobile = fullDateContainer.querySelector('input[name="brief-private-date-end-mobile"]');

        // Vérifier si on est en mobile ou desktop
        const isMobileActive = startMobile && window.getComputedStyle(startMobile).display !== 'none';

        let isValid = false;
        if (isMobileActive) {
          isValid = startMobile.value.trim() !== '' && endMobile.value.trim() !== '';
        } else {
          isValid = startDesktop.value.trim() !== '' && endDesktop.value.trim() !== '';
        }

        if (!isValid) {
          fullDateContainer.classList.add('is-error');
          const errStart = isMobileActive 
            ? fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-start-mobile"]`) 
            : fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-start-desktop"]`);
          const errEnd = isMobileActive 
            ? fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-end-mobile"]`) 
            : fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-end-desktop"]`);

          if (errStart) errStart.style.display = 'block';
          if (errEnd) errEnd.style.display = 'block';
        } else {
          fullDateContainer.classList.remove('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-start-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-private-date-end-${isMobileActive ? 'mobile' : 'desktop'}"]`);

          if (errStart) errStart.style.display = 'none';
          if (errEnd) errEnd.style.display = 'none';
        }
      }
    });
  });

  // 3. Gestion des erreurs en direct lors de la saisie
  document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      ['input', 'change'].forEach(evt => {
        field.addEventListener(evt, function () {
          let valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
          if (valid) {
            field.classList.remove('is-error');
            let wrapper = field.closest('.form_field-wrapper');
            if (wrapper) {
              wrapper.classList.remove('is-error');
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'none';
            }
          }
        });
      });
    });
  });

});
