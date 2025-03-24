document.addEventListener('DOMContentLoaded', function () {
  // Fonction pour valider les groupes de boutons radio d'un formulaire, pour un préfixe donné
  function validateRadioGroupsForForm(form, prefix) {
    const radioGroups = {};
    form.querySelectorAll(`input[type="radio"][required][name^="${prefix}"]`).forEach(radio => {
      const name = radio.name;
      if (!radioGroups[name]) {
        radioGroups[name] = [];
      }
      radioGroups[name].push(radio);
    });
    Object.keys(radioGroups).forEach(name => {
      const group = radioGroups[name];
      const checked = group.some(radio => radio.checked);
      const groupContainer = group[0].closest('.form_check-group');
      group.forEach(radio => {
        const label = radio.closest('label.w-radio');
        if (!checked) {
          if (label) {
            label.classList.add('is-error');
            const radioIcon = label.querySelector('.w-radio-input');
            if (radioIcon) radioIcon.classList.add('is-error');
          }
          if (groupContainer) {
            groupContainer.classList.add('is-error');
          }
        } else {
          if (label) {
            label.classList.remove('is-error');
            const radioIcon = label.querySelector('.w-radio-input');
            if (radioIcon) radioIcon.classList.remove('is-error');
          }
          if (groupContainer) {
            groupContainer.classList.remove('is-error');
          }
        }
      });
    });
  }

  // Fonction pour valider les checkboxes d'un formulaire, pour un préfixe donné
  function validateCheckboxesForForm(form, prefix) {
    form.querySelectorAll(`input[type="checkbox"][required][name^="${prefix}"]`).forEach(checkbox => {
      if (!checkbox.checked) {
        checkbox.classList.add('is-error');
        const wrapper = checkbox.closest('label.w-checkbox');
        if (wrapper) {
          wrapper.classList.add('is-error');
          const checkIcon = wrapper.querySelector('.w-checkbox-input');
          if (checkIcon) checkIcon.classList.add('is-error');
        }
      }
    });
  }

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

  // Validation principale au clic
  document.querySelectorAll('[btn="check-error"]').forEach(triggerButton => {
    triggerButton.addEventListener('click', function () {
      const form = triggerButton.closest('form');
      if (!form) return;

      form.querySelectorAll('input:not([type="radio"]), textarea, select').forEach(field => {
        if (field.hasAttribute('required') && field.name && (field.name.startsWith('brief-pro') || field.name.startsWith('brief-private'))) {
          let valid = field.value.trim() !== '';
          if (field.type === 'checkbox') {
            valid = field.checked;
          }
          let wrapper;
          if (field.type === 'checkbox') {
            wrapper = field.closest('label.w-checkbox');
          } else if (field.name === 'brief-pro-date-periode' || field.name === 'brief-private-date-periode') {
            wrapper = field.closest('[date-switch="period-date"]');
          } else {
            wrapper = field.closest('.form_field-wrapper');
          }
          if (!valid) {
            field.classList.add('is-error');
            if (wrapper) {
              wrapper.classList.add('is-error');
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

      const fullDateContainer = form.querySelector('[date-switch="full-date"]');
      if (fullDateContainer) {
        const startDesktop = fullDateContainer.querySelector('input[name$="date-start-desktop"]');
        const endDesktop = fullDateContainer.querySelector('input[name$="date-end-desktop"]');
        const startMobile = fullDateContainer.querySelector('input[name$="date-start-mobile"]');
        const endMobile = fullDateContainer.querySelector('input[name$="date-end-mobile"]');
        const isMobileActive = startMobile && window.getComputedStyle(startMobile).display !== 'none';
        let isValid = isMobileActive
          ? startMobile.value.trim() !== '' && endMobile.value.trim() !== ''
          : startDesktop.value.trim() !== '' && endDesktop.value.trim() !== '';
        const dateInputContainer = fullDateContainer.querySelector('.form_input.is-datepicker');
        if (!isValid) {
          if (dateInputContainer) dateInputContainer.classList.add('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label$="date-start-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label$="date-end-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          if (errStart) errStart.style.display = 'block';
          if (errEnd) errEnd.style.display = 'block';
        } else {
          if (dateInputContainer) dateInputContainer.classList.remove('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label$="date-start-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label$="date-end-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          if (errStart) errStart.style.display = 'none';
          if (errEnd) errEnd.style.display = 'none';
        }
      }

      validateCheckboxesForForm(form, "brief-pro");
      validateCheckboxesForForm(form, "brief-private");
      validateRadioGroupsForForm(form, "brief-pro");
      validateRadioGroupsForForm(form, "brief-private");

      const tooltip = form.querySelector('[tooltip="error"]');
      if (tooltip) {
        let hasEmpty = false;
        form.querySelectorAll('input, textarea, select').forEach(field => {
          const isRequired = field.hasAttribute('required');
          const isVisible = window.getComputedStyle(field).display !== 'none';
          const isRelevant = field.name && (field.name.startsWith('brief-pro') || field.name.startsWith('brief-private'));

          if (isRequired && isVisible && isRelevant) {
            if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) {
              hasEmpty = true;
            } else if (field.type !== 'checkbox' && field.type !== 'radio' && field.value.trim() === '') {
              hasEmpty = true;
            }
          }
        });

        const startMobile = form.querySelector('input[name$="date-start-mobile"]');
        const endMobile = form.querySelector('input[name$="date-end-mobile"]');
        const startDesktop = form.querySelector('input[name$="date-start-desktop"]');
        const endDesktop = form.querySelector('input[name$="date-end-desktop"]');
        const isMobileActive = startMobile && window.getComputedStyle(startMobile).display !== 'none';
        const isDateValid = isMobileActive
          ? startMobile?.value.trim() !== '' && endMobile?.value.trim() !== ''
          : startDesktop?.value.trim() !== '' && endDesktop?.value.trim() !== '';
        if (!isDateValid) hasEmpty = true;

        tooltip.style.display = hasEmpty ? 'block' : 'none';
      }
    });
  });

  // Retrait auto des erreurs
  document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      ['input', 'change'].forEach(evt => {
        field.addEventListener(evt, function () {
          if (field.hasAttribute('required') && (field.type === 'checkbox' || field.type === 'radio' || (field.name && (field.name.startsWith('brief-pro') || field.name.startsWith('brief-private'))))) {
            let valid = (field.type === 'checkbox' || field.type === 'radio') ? field.checked : field.value.trim() !== '';
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
                const radios = form.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
                radios.forEach(radio => {
                  const lab = radio.closest('label.w-radio');
                  if (lab) {
                    lab.classList.remove('is-error');
                    const rIcon = lab.querySelector('.w-radio-input');
                    if (rIcon) rIcon.classList.remove('is-error');
                  }
                });
                const groupContainer = field.closest('.form_check-group');
                if (groupContainer) {
                  groupContainer.classList.remove('is-error');
                }
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
          }
        });
      });
    });
  });

  document.querySelectorAll('[date-switch="full-date"]').forEach(fullDateContainer => {
    fullDateContainer.addEventListener('click', function () {
      const dateInputContainer = fullDateContainer.querySelector('.form_input.is-datepicker');
      if (dateInputContainer) dateInputContainer.classList.remove('is-error');
      const errorLabels = [
        'brief-private-date-start-desktop',
        'brief-private-date-end-desktop',
        'brief-private-date-start-mobile',
        'brief-private-date-end-mobile',
        'brief-pro-date-start-desktop',
        'brief-pro-date-end-desktop',
        'brief-pro-date-start-mobile',
        'brief-pro-date-end-mobile'
      ];
      errorLabels.forEach(label => {
        const errElem = fullDateContainer.querySelector(`.form_label-error[error-label="${label}"]`);
        if (errElem) errElem.style.display = 'none';
      });
    });
  });

  // Ajout pour observer dynamiquement les erreurs visibles
  document.querySelectorAll('form').forEach(form => {
    const tooltip = form.querySelector('[tooltip="error"]');
    if (!tooltip) return;

    const observer = new MutationObserver(() => {
      const visibleErrors = Array.from(form.querySelectorAll('.is-error')).filter(el => {
        return el.offsetParent !== null;
      });

      tooltip.style.display = visibleErrors.length > 0 ? 'block' : 'none';
    });

    observer.observe(form, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  });
});
