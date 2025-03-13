document.addEventListener('DOMContentLoaded', function () {
  // 1. Population dynamique des selects de période
  function populateMonthSelect(selectName) {
    const selectElement = document.querySelector('select[name="' + selectName + '"]');
    if (selectElement) {
      selectElement.innerHTML = '';
      const lang = navigator.language || navigator.userLanguage || 'en';
      const monthNames = lang.toLowerCase().startsWith('fr')
        ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const today = new Date();
      for (let i = 0; i < 16; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const optionText = monthNames[date.getMonth()] + ' ' + date.getFullYear();
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        selectElement.appendChild(option);
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

      // Récupérer l'élément switch qui contrôle la visibilité du champ période
      const switchElem = form.querySelector('[date-switch="switch"]');

      // 3a. Vérification pour tous les champs non-radio (inputs, textarea, selects, checkboxes)
      form.querySelectorAll('input:not([type="radio"]), textarea, select').forEach(field => {
        if (field.hasAttribute('required')) {
          // Pour le champ période, on valide seulement si le switch indique visible (aria-checked="true")
          if ((field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode')
              && switchElem && switchElem.getAttribute('aria-checked') !== 'true') {
            // Le champ période n'est pas visible, on le considère comme valide
            field.classList.remove('is-error');
            let wrapper = field.closest('[date-switch="period-date"]');
            if (wrapper) {
              wrapper.classList.remove('is-error');
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'none';
            }
            return; // passe au champ suivant
          }
          let valid;
          if (field.type === 'checkbox') {
            valid = field.checked;
          } else {
            valid = field.value.trim() !== '';
          }
          let wrapper;
          if (field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode') {
            // Pour le champ période, on utilise le conteneur avec l'attribut date-switch="period-date"
            wrapper = field.closest('[date-switch="period-date"]');
          } else if (field.type === 'checkbox') {
            // Pour checkbox, le wrapper est le label avec la classe w-checkbox
            wrapper = field.closest('label.w-checkbox');
          } else {
            wrapper = field.closest('.form_field-wrapper');
          }
          if (!valid) {
            field.classList.add('is-error');
            if (wrapper) {
              wrapper.classList.add('is-error');
              // Pour le champ période, ajouter aussi l'erreur sur le dropdown toggle
              if (field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode') {
                const dropdownToggle = wrapper.querySelector('.w-dropdown-toggle');
                if (dropdownToggle) dropdownToggle.classList.add('is-error');
              }
              // Pour checkbox, appliquer is-error sur le label et l'icône
              if (field.type === 'checkbox') {
                const checkIcon = wrapper.querySelector('.w-checkbox-input');
                if (checkIcon) checkIcon.classList.add('is-error');
              }
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'block';
            }
          } else {
            field.classList.remove('is-error');
            if (wrapper) {
              wrapper.classList.remove('is-error');
              if (field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode') {
                const dropdownToggle = wrapper.querySelector('.w-dropdown-toggle');
                if (dropdownToggle) dropdownToggle.classList.remove('is-error');
              }
              if (field.type === 'checkbox') {
                const checkIcon = wrapper.querySelector('.w-checkbox-input');
                if (checkIcon) checkIcon.classList.remove('is-error');
              }
              const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
              if (err) err.style.display = 'none';
            }
          }
        }
      });

      // 3b. Vérification pour le groupe full-date (inputs de date de début et fin desktop)
      const fullDateContainer = form.querySelector('[date-switch="full-date"]');
      if (fullDateContainer) {
        const startDesktop = fullDateContainer.querySelector('input[name="brief-pro-date-start-desktop"]');
        const endDesktop = fullDateContainer.querySelector('input[name="brief-pro-date-end-desktop"]');
        const validDates = startDesktop && endDesktop && startDesktop.value.trim() !== '' && endDesktop.value.trim() !== '';
        const dateInputContainer = fullDateContainer.querySelector('.form_input.is-datepicker');
        if (!validDates) {
          if (dateInputContainer) dateInputContainer.classList.add('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-start-desktop"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-end-mobile"]`);
          if (errStart) errStart.style.display = 'block';
          if (errEnd) errEnd.style.display = 'block';
        } else {
          if (dateInputContainer) dateInputContainer.classList.remove('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-start-desktop"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-pro-date-end-mobile"]`);
          if (errStart) errStart.style.display = 'none';
          if (errEnd) errEnd.style.display = 'none';
        }
      }

      // 3c. Vérification pour les boutons radio (groupés par name)
      const radioGroups = {};
      form.querySelectorAll('input[type="radio"][required]').forEach(radio => {
        const name = radio.name;
        if (!radioGroups[name]) {
          radioGroups[name] = [];
        }
        radioGroups[name].push(radio);
      });
      Object.keys(radioGroups).forEach(name => {
        const group = radioGroups[name];
        const checked = group.some(radio => radio.checked);
        group.forEach(radio => {
          const label = radio.closest('label.w-radio');
          if (!checked) {
            if (label) {
              label.classList.add('is-error');
              const radioIcon = label.querySelector('.w-radio-input');
              if (radioIcon) radioIcon.classList.add('is-error');
            }
          } else {
            // Retirer l'erreur de tous les éléments du groupe
            const radios = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
            radios.forEach(r => {
              const lab = r.closest('label.w-radio');
              if (lab) {
                lab.classList.remove('is-error');
                const rIcon = lab.querySelector('.w-radio-input');
                if (rIcon) rIcon.classList.remove('is-error');
              }
            });
          }
        });
      });
    });
  });

  // 4. Retrait automatique de l'état d'erreur lors de la saisie ou modification
  document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      ['input', 'change'].forEach(evt => {
        field.addEventListener(evt, function () {
          let valid;
          if (field.type === 'checkbox') {
            valid = field.checked;
          } else {
            valid = field.value.trim() !== '';
          }
          if (valid) {
            field.classList.remove('is-error');
            let wrapper;
            if (field.type === 'checkbox') {
              wrapper = field.closest('label.w-checkbox');
              if (wrapper) {
                wrapper.classList.remove('is-error');
                const checkIcon = wrapper.querySelector('.w-checkbox-input');
                if (checkIcon) checkIcon.classList.remove('is-error');
              }
            } else if (field.type === 'radio') {
              // Pour les radios, retirer l'erreur de tout le groupe
              const radios = form.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
              radios.forEach(radio => {
                const lab = radio.closest('label.w-radio');
                if (lab) {
                  lab.classList.remove('is-error');
                  const rIcon = lab.querySelector('.w-radio-input');
                  if (rIcon) rIcon.classList.remove('is-error');
                }
              });
            } else if (field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode') {
              wrapper = field.closest('[date-switch="period-date"]');
              if (wrapper) {
                wrapper.classList.remove('is-error');
                const dropdownToggle = wrapper.querySelector('.w-dropdown-toggle');
                if (dropdownToggle) dropdownToggle.classList.remove('is-error');
                const err = wrapper.querySelector(`.form_label-error[error-label="${field.name}"]`);
                if (err) err.style.display = 'none';
              }
            } else {
              wrapper = field.closest('.form_field-wrapper');
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
