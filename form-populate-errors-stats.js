document.addEventListener('DOMContentLoaded', function () {
  const lang = navigator.language || navigator.userLanguage || 'en';
  const monthNames = lang.toLowerCase().startsWith('fr')
    ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

  function populateMonthSelect(selectName) {
    const selectElement = document.querySelector(`select[name="${selectName}"]`);
    if (!selectElement) return;

    const existingValues = new Set([...selectElement.options].map(o => o.value));
    const today = new Date();

    for (let i = 0; i < 16; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const optionText = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!existingValues.has(optionText)) {
        const option = new Option(optionText, optionText);
        selectElement.add(option);
      }
    }
  }

  ['pro', 'private', 'agency'].forEach(prefix => {
    populateMonthSelect(`brief-${prefix}-date-periode`);
  });

  function synchronizeSelectAndDropdown(origine, destination) {
    const selectElement = document.querySelector(`select[selectpopulate="${origine}"]`);
    const dropdownWrapper = document.querySelector(`.dropdown_wrapper[selectpopulate="${destination}"]`);
    if (!selectElement || !dropdownWrapper) return;

    const dropdownList = dropdownWrapper.querySelector('.dropdown_list');
    const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
    const dropdownToggleText = dropdownToggle.querySelector('div:first-child');

    selectElement.querySelectorAll('option').forEach(option => {
      if (option.value) {
        const dropdownLink = document.createElement('a');
        dropdownLink.href = '#';
        dropdownLink.classList.add('dropdown_link', 'w-dropdown-link');
        dropdownLink.setAttribute('data-value', option.value);
        dropdownLink.setAttribute('role', 'menuitem');
        dropdownLink.textContent = option.textContent;
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

  document.querySelectorAll('select[selectpopulate]').forEach(selectEl => {
    const origineAttr = selectEl.getAttribute('selectpopulate');
    if (origineAttr.startsWith('origine')) {
      const destinationAttr = origineAttr.replace('origine', 'destination');
      synchronizeSelectAndDropdown(origineAttr, destinationAttr);
    }
  });
});
