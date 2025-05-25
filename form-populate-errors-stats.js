<script>
document.addEventListener('DOMContentLoaded', function () {
  // Supprime tous les états d'erreur d'un champ donné
  function removeError(field) {
    if (!field) return;
    field.classList.remove('is-error');
    const wrapper = field.closest('.form_field-wrapper') || field.closest('.form_check-group');
    if (wrapper) wrapper.classList.remove('is-error');
    const err = document.querySelector(`[error-label="${field.name}"]`);
    if (err) err.style.display = 'none';
    const dropdownToggle = document.querySelector(`.w-dropdown-toggle[error-label-link="${field.name}"]`);
    if (dropdownToggle) dropdownToggle.classList.remove('is-error');
  }

  // Remplit dynamiquement les dropdowns Webflow à partir des balises <select>
  function populateSelectAndDropdown() {
    document.querySelectorAll('select[selectpopulate^="origine"]').forEach(select => {
      const origine = select.getAttribute('selectpopulate');
      const destination = origine.replace('origine', 'destination');
      const dropdownWrapper = document.querySelector(`.dropdown_wrapper[selectpopulate="${destination}"]`);
      if (!dropdownWrapper) return;

      const dropdownList = dropdownWrapper.querySelector('.dropdown_list');
      const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
      const dropdownText = dropdownToggle?.querySelector('div:first-child');
      if (!dropdownList || !dropdownToggle || !dropdownText) return;

      dropdownList.innerHTML = '';
      [...select.options].forEach(option => {
        if (option.value) {
          const a = document.createElement('a');
          a.href = '#';
          a.className = 'dropdown_link w-dropdown-link';
          a.setAttribute('data-value', option.value);
          a.textContent = option.textContent;
          dropdownList.appendChild(a);
        }
      });

      dropdownList.querySelectorAll('.dropdown_link').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const val = link.getAttribute('data-value');
          const text = link.textContent;
          select.value = val;
          select.dispatchEvent(new Event('change'));
          dropdownText.textContent = text;

          const name = select.getAttribute('name');
          const toggle = document.querySelector(`.w-dropdown-toggle[error-label-link="${name}"]`);
          if (toggle) toggle.classList.remove('is-error');
          const err = document.querySelector(`[error-label="${name}"]`);
          if (err) err.style.display = 'none';

          dropdownToggle.classList.remove('w--open');
          dropdownList.classList.remove('w--open');
          dropdownList.style.opacity = '0';
          dropdownList.style.transform = 'translate3d(0px, -2rem, 0px)';
        });
      });
    });
  }

  // Ajoute tous les écouteurs nécessaires à la suppression dynamique des erreurs
  function setupFieldListeners(form, prefix) {
    // Suppression groupée des erreurs date au clic sur l'un des deux champs
    const dateInputs = form.querySelectorAll(`input[name^="brief-${prefix}-date-start"], input[name^="brief-${prefix}-date-end"]`);
    dateInputs.forEach(input => {
      input.addEventListener('click', () => {
        const group = form.querySelector('[date-switch="full-date"]');
        const labels = group?.querySelectorAll('[error-label]');
        if (labels) labels.forEach(el => el.style.display = 'none');
        const errs = group?.querySelectorAll('.is-error');
        if (errs) errs.forEach(el => el.classList.remove('is-error'));
      });
    });

    // Suppression erreurs groupe radio
    form.querySelectorAll(`input[type="radio"][name^="brief-${prefix}-"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const groupName = radio.name;
        const groupRadios = form.querySelectorAll(`input[name="${groupName}"]`);
        groupRadios.forEach(r => {
          r.classList.remove('is-error');
          const label = r.closest('label.w-radio');
          if (label) label.classList.remove('is-error');
          const icon = label?.querySelector('.w-radio-input');
          if (icon) icon.classList.remove('is-error');
        });
      });
    });

    // Suppression erreurs checkbox
    form.querySelectorAll(`input[type="checkbox"][name^="brief-${prefix}-"]`).forEach(cb => {
      cb.addEventListener('change', () => {
        cb.classList.remove('is-error');
        const label = cb.closest('label.w-checkbox');
        const icon = label?.querySelector('.w-checkbox-input');
        if (label) label.classList.remove('is-error');
        if (icon) icon.classList.remove('is-error');
      });
    });

    // Suppression erreurs guest / surface si un des deux est rempli
    const guest = form.querySelector(`[name="brief-${prefix}-guest"]`);
    const surface = form.querySelector(`[name="brief-${prefix}-surface"]`);
    [guest, surface].forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => {
        const gVal = guest?.value.trim();
        const sVal = surface?.value.trim();
        if (gVal || sVal) {
          [guest, surface].forEach(el => removeError(el));
        }
      });
    });

    // Suppression erreurs sur tous les inputs classiques (type texte, email, tel, number, etc.) + textarea
    form.querySelectorAll(`input[name^="brief-${prefix}-"], textarea[name^="brief-${prefix}-"]`).forEach(field => {
      field.addEventListener('input', () => removeError(field));
    });

    // Suppression erreurs select classique
    form.querySelectorAll('select').forEach(select => {
      select.addEventListener('change', () => removeError(select));
    });
  }

  // Timer pour tooltip (à usage unique)
  let tooltipTimeout = null;

  // Vérifie tous les champs d'un formulaire et affiche les erreurs si besoin
  function validateForm(form) {
    const prefix = form.getAttribute('form-prefix');
    let hasError = false;

    const showError = (field) => {
      if (!field) return;
      field.classList.add('is-error');
      const wrapper = field.closest('.form_field-wrapper') || field.closest('.form_check-group');
      if (wrapper) wrapper.classList.add('is-error');
      const err = document.querySelector(`[error-label="${field.name}"]`);
      if (err) err.style.display = 'block';
      const toggle = document.querySelector(`.w-dropdown-toggle[error-label-link="${field.name}"]`);
      if (toggle) toggle.classList.add('is-error');
      hasError = true;
    };

    // Validation des selects (visibles et liés aux dropdowns)
    const selects = form.querySelectorAll(`select[required][name^="brief-${prefix}-"]`);
    selects.forEach(select => {
      const isVisible = select.offsetParent !== null;
      const isEmpty = !select.value.trim();
      if (isEmpty) {
        showError(select);
        const name = select.getAttribute('name');
        const toggle = form.querySelector(`.w-dropdown-toggle[error-label-link="${name}"]`);
        if (toggle && !isVisible) {
          toggle.classList.add('is-error');
        }
      }
    });

    // Validation des champs texte / textarea / email / tel / number…
    const fields = form.querySelectorAll(`input[required]:not([type="radio"]):not([type="checkbox"]), textarea[required]`);
    fields.forEach(field => {
      if (field.offsetParent && !field.value.trim()) {
        showError(field);
      }
    });

    // Validation groupes radio
    const radioGroups = {};
    form.querySelectorAll(`input[type="radio"][required][name^="brief-${prefix}-"]`).forEach(r => {
      if (!radioGroups[r.name]) radioGroups[r.name] = [];
      radioGroups[r.name].push(r);
    });
    Object.values(radioGroups).forEach(group => {
      const checked = group.some(r => r.checked);
      if (!checked) {
        group.forEach(r => {
          r.classList.add('is-error');
          const label = r.closest('label.w-radio');
          if (label) label.classList.add('is-error');
          const icon = label?.querySelector('.w-radio-input');
          if (icon) icon.classList.add('is-error');
        });
        hasError = true;
      }
    });

    // Validation checkboxes
    form.querySelectorAll(`input[type="checkbox"][required][name^="brief-${prefix}-"]`).forEach(cb => {
      if (!cb.checked && cb.offsetParent) {
        cb.classList.add('is-error');
        const label = cb.closest('label.w-checkbox');
        if (label) label.classList.add('is-error');
        const icon = label?.querySelector('.w-checkbox-input');
        if (icon) icon.classList.add('is-error');
        hasError = true;
      }
    });

    // Validation conditionnelle guest / surface
    const guest = form.querySelector(`[name="brief-${prefix}-guest"]`);
    const surface = form.querySelector(`[name="brief-${prefix}-surface"]`);
    const guestVal = guest?.value.trim();
    const surfaceVal = surface?.value.trim();
    if (!guestVal && !surfaceVal) {
      [guest, surface].forEach(f => showError(f));
    }

    // Validation champ période
    const period = form.querySelector(`select[name="brief-${prefix}-date-periode"]`);
    const wrapperPeriode = period?.closest('[date-switch="period-date"]');
    if (wrapperPeriode?.offsetParent && !period.value.trim()) {
      showError(period);
    }

    // Validation champ full-date (mobile / desktop)
    const fullDate = form.querySelector('[date-switch="full-date"]');
    if (fullDate?.offsetParent) {
      const sm = fullDate.querySelector(`[name="brief-${prefix}-date-start-mobile"]`);
      const em = fullDate.querySelector(`[name="brief-${prefix}-date-end-mobile"]`);
      const sd = fullDate.querySelector(`[name="brief-${prefix}-date-start-desktop"]`);
      const ed = fullDate.querySelector(`[name="brief-${prefix}-date-end-desktop"]`);
      const isMobile = sm?.offsetParent !== null;
      const filled = isMobile
        ? sm?.value.trim() && em?.value.trim()
        : sd?.value.trim() && ed?.value.trim();
      if (!filled) {
        if (isMobile) {
          if (sm && !sm.value.trim()) showError(sm);
          if (em && !em.value.trim()) showError(em);
        } else {
          if (sd && !sd.value.trim()) showError(sd);
          if (ed && !ed.value.trim()) showError(ed);
        }
      }
    }

    // Affichage temporaire du tooltip global d'erreur (6 secondes max)
    const tooltip = form.querySelector('[tooltip="error"]');
    if (tooltip) {
      if (hasError) {
        tooltip.style.display = 'block';
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          tooltip.style.display = 'none';
        }, 6000);
      } else {
        tooltip.style.display = 'none';
      }
    }

    return !form.querySelector('.is-error');
  }

  // Initialisation du script pour tous les formulaires présents avec form-prefix
  document.querySelectorAll('form[form-prefix]').forEach(form => {
    const prefix = form.getAttribute('form-prefix');
    setupFieldListeners(form, prefix);
    populateSelectAndDropdown();
    form.querySelectorAll('[btn="check-error"]').forEach(btn => {
      btn.addEventListener('click', () => {
        validateForm(form);
      });
    });
  });
});
</script>
