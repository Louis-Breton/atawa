document.addEventListener('DOMContentLoaded', function () {
  function validateRadioGroupsForForm(form, prefix) {
    const radioGroups = {};
    form.querySelectorAll(`input[type="radio"][required][name^="${prefix}"]`).forEach(radio => {
      const name = radio.name;
      if (!radioGroups[name]) radioGroups[name] = [];
      radioGroups[name].push(radio);
    });
    Object.keys(radioGroups).forEach(name => {
      const group = radioGroups[name];
      const checked = group.some(radio => radio.checked);
      const groupContainer = group[0].closest('.form_check-group');
      group.forEach(radio => {
        const label = radio.closest('label.w-radio');
        if (!checked) {
          if (label) label.classList.add('is-error');
          const radioIcon = label?.querySelector('.w-radio-input');
          if (radioIcon) radioIcon.classList.add('is-error');
          if (groupContainer) groupContainer.classList.add('is-error');
        } else {
          if (label) label.classList.remove('is-error');
          const radioIcon = label?.querySelector('.w-radio-input');
          if (radioIcon) radioIcon.classList.remove('is-error');
          if (groupContainer) groupContainer.classList.remove('is-error');
        }
      });
    });
  }

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

  function isFieldInvalid(field, prefix) {
    const isRequired = field.hasAttribute('required');
    const isVisible = window.getComputedStyle(field).display !== 'none';
    const isRelevant = field.name && field.name.startsWith(`brief-${prefix}`);
    if (!isRequired || !isVisible || !isRelevant) return false;

    if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return true;
    if (field.type !== 'checkbox' && field.type !== 'radio' && field.value.trim() === '') return true;

    return false;
  }

  document.querySelectorAll('[btn="check-error"]').forEach(triggerButton => {
    triggerButton.addEventListener('click', function () {
      const form = triggerButton.closest('form');
      if (!form) return;
      const formPrefix = form.getAttribute('form-prefix');
      if (!formPrefix) return;

      form.querySelectorAll('input:not([type="radio"]), textarea, select').forEach(field => {
        if (field.name && field.name.startsWith(`brief-${formPrefix}`) && field.hasAttribute('required')) {
          const valid = !isFieldInvalid(field, formPrefix);

          let wrapper;
          if (field.type === 'checkbox') {
            wrapper = field.closest('label.w-checkbox');
          } else if (field.name === `brief-${formPrefix}-date-periode`) {
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
        const prefix = formPrefix;
        const startDesktop = fullDateContainer.querySelector(`input[name="brief-${prefix}-date-start-desktop"]`);
        const endDesktop = fullDateContainer.querySelector(`input[name="brief-${prefix}-date-end-desktop"]`);
        const startMobile = fullDateContainer.querySelector(`input[name="brief-${prefix}-date-start-mobile"]`);
        const endMobile = fullDateContainer.querySelector(`input[name="brief-${prefix}-date-end-mobile"]`);
        const isMobileActive = startMobile && window.getComputedStyle(startMobile).display !== 'none';
        const isValid = isMobileActive
          ? startMobile.value.trim() !== '' && endMobile.value.trim() !== ''
          : startDesktop.value.trim() !== '' && endDesktop.value.trim() !== '';

        const dateInputContainer = fullDateContainer.querySelector('.form_input.is-datepicker');
        if (!isValid) {
          if (dateInputContainer) dateInputContainer.classList.add('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-${prefix}-date-start-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-${prefix}-date-end-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          if (errStart) errStart.style.display = 'block';
          if (errEnd) errEnd.style.display = 'block';
        } else {
          if (dateInputContainer) dateInputContainer.classList.remove('is-error');
          const errStart = fullDateContainer.querySelector(`.form_label-error[error-label="brief-${prefix}-date-start-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          const errEnd = fullDateContainer.querySelector(`.form_label-error[error-label="brief-${prefix}-date-end-${isMobileActive ? 'mobile' : 'desktop'}"]`);
          if (errStart) errStart.style.display = 'none';
          if (errEnd) errEnd.style.display = 'none';
        }
      }

      validateCheckboxesForForm(form, `brief-${formPrefix}`);
      validateRadioGroupsForForm(form, `brief-${formPrefix}`);
    });
  });
});
