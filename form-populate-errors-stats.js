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

  // 2. Synchronisation entre select caché et dropdown custom
  function synchronizeSelectAndDropdown(origine, destination) {
    const selectElement = document.querySelector(`select[selectpopulate="${origine}"]`);
    const dropdownWrapper = document.querySelector(`.dropdown_wrapper[selectpopulate="${destination}"]`);
    const dropdownList = dropdownWrapper.querySelector('.dropdown_list');
    const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
    const dropdownToggleText = dropdownToggle.querySelector('div:first-child');

    selectElement.querySelectorAll('option').forEach(option => {
      const optionValue = option.value;
      const optionText = option.textContent;
      if (optionValue) {
        const dropdownLink = document.createElement('a');
        dropdownLink.href = '#';
        dropdownLink.classList.add('dropdown_link', 'w-dropdown-link');
        dropdownLink.setAttribute('data-value', optionValue);
        dropdownLink.setAttribute('role', 'menuitem');
        dropdownLink.textContent = optionText;
        dropdownList.appendChild(dropdownLink);
      }
    });

    dropdownList.addEventListener('click', function (e) {
      if (e.target.matches('.dropdown_link')) {
        e.preventDefault();
        const selectedValue = e.target.getAttribute('data-value');
        const selectedText = e.target.textContent;
        selectElement.value = selectedValue;
        selectElement.dispatchEvent(new Event('change'));
        dropdownToggleText.textContent = selectedText;
        dropdownToggle.classList.remove('is-error');
        closeDropdown();
      }
    });

    selectElement.addEventListener('change', function () {
      const selectedText = selectElement.options[selectElement.selectedIndex].textContent;
      dropdownToggleText.textContent = selectedText;
      dropdownToggle.classList.remove('is-error');
    });

    document.addEventListener('click', function (e) {
      if (!dropdownWrapper.contains(e.target) && dropdownToggle.getAttribute('aria-expanded') === 'true') {
        closeDropdown();
      }
    });

    function closeDropdown() {
      dropdownToggle.classList.remove('w--open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownList.classList.remove('w--open');
      dropdownList.style.opacity = '0';
      dropdownList.style.transform = 'translate3d(0px, -2rem, 0px)';
    }

    selectElement.addEventListener('invalid', function () {
      dropdownToggle.classList.add('is-error');
    });
    selectElement.addEventListener('input', function () {
      if (selectElement.checkValidity()) {
        dropdownToggle.classList.remove('is-error');
      }
    });
  }
  document.querySelectorAll('[selectpopulate^="origine"]').forEach(selectEl => {
    const origineAttr = selectEl.getAttribute('selectpopulate');
    const destinationAttr = origineAttr.replace('origine', 'destination');
    synchronizeSelectAndDropdown(origineAttr, destinationAttr);
  });

  // 3. Vérification lors du clic sur le trigger (btn="check-error")
  document.querySelectorAll('[btn="check-error"]').forEach(triggerButton => {
    triggerButton.addEventListener('click', function () {
      const form = triggerButton.closest('form');
      if (!form) return;

      form.querySelectorAll('input, textarea, select').forEach(field => {
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
    });
  });

  // 4. Retrait automatique de l'état d'erreur lors de la saisie ou modification
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

  // 5. Pour le groupe full-date, retirer l'erreur dès que l'utilisateur clique sur la zone
  document.querySelectorAll('[date-switch="full-date"]').forEach(fullDateContainer => {
    fullDateContainer.addEventListener('click', function () {
      const dateInputContainer = fullDateContainer.querySelector('.form_input.is-datepicker');
      if (dateInputContainer) dateInputContainer.classList.remove('is-error');
      const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-start-desktop"]`);
      const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-end-mobile"]`);
      if (errStart) errStart.style.display = 'none';
      if (errEnd) errEnd.style.display = 'none';
    });
  });
});
