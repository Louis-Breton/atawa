document.addEventListener("DOMContentLoaded", () => {
  // Gestion des switchs pour les wrappers
  const wrappers = document.querySelectorAll('[date-switch="wrapper"]');

  wrappers.forEach((wrapper) => {
    const profil = wrapper.getAttribute("data-profil"); // ex: 'pro', 'private', 'agency'
    if (!profil) return; // sécurité : ignorer si data-profil absent

    const switchButton = wrapper.querySelector('[date-switch="switch"]');
    const fullDateContainer = wrapper.querySelector('[date-switch="full-date"]');
    const periodDateContainer = wrapper.querySelector('[date-switch="period-date"]');

    if (!switchButton || !fullDateContainer || !periodDateContainer) return;

    // Sélection dynamique des champs en fonction du profil
    const buildDateInputs = (prefix) => ({
      startDesktop: wrapper.querySelector(`[name="brief-${prefix}-date-start-desktop"]`),
      endDesktop: wrapper.querySelector(`[name="brief-${prefix}-date-end-desktop"]`),
      startMobile: wrapper.querySelector(`[name="brief-${prefix}-date-start-mobile"]`),
      endMobile: wrapper.querySelector(`[name="brief-${prefix}-date-end-mobile"]`),
      period: wrapper.querySelector(`[name="brief-${prefix}-date-periode"]`)
    });

    const dateInputs = buildDateInputs(profil);

    const isVisible = (element) => element && getComputedStyle(element).display !== "none";

    const applyState = (isSwitched) => {
      switchButton.setAttribute("aria-checked", isSwitched);

      if (isSwitched) {
        fullDateContainer.style.display = "none";
        periodDateContainer.style.display = "block";

        Object.values(dateInputs).forEach((el) => {
          if (el) el.required = el === dateInputs.period;
        });
      } else {
        fullDateContainer.style.display = "block";
        periodDateContainer.style.display = "none";

        if (isVisible(dateInputs.startDesktop)) {
          if (dateInputs.startDesktop) dateInputs.startDesktop.required = true;
          if (dateInputs.startMobile) dateInputs.startMobile.required = false;
        } else if (isVisible(dateInputs.startMobile)) {
          if (dateInputs.startMobile) dateInputs.startMobile.required = true;
          if (dateInputs.startDesktop) dateInputs.startDesktop.required = false;
        }

        if (isVisible(dateInputs.endDesktop)) {
          if (dateInputs.endDesktop) dateInputs.endDesktop.required = true;
          if (dateInputs.endMobile) dateInputs.endMobile.required = false;
        } else if (isVisible(dateInputs.endMobile)) {
          if (dateInputs.endMobile) dateInputs.endMobile.required = true;
          if (dateInputs.endDesktop) dateInputs.endDesktop.required = false;
        }

        if (dateInputs.period) dateInputs.period.required = false;
      }
    };

    // Nouvelle clé sessionStorage basée sur le profil
    const switchStateKey = `date-switch-state-${profil}`;
    const switchState = sessionStorage.getItem(switchStateKey) === "true";
    applyState(switchState);

    const toggleSwitch = () => {
      const isChecked = switchButton.getAttribute("aria-checked") === "true";
      const newState = !isChecked;
      applyState(newState);
      sessionStorage.setItem(switchStateKey, newState);
    };

    switchButton.addEventListener("click", toggleSwitch);
    switchButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSwitch();
      }
    });

    // Observer les changements de visibilité et ajuster les `required`
    const observer = new MutationObserver(() => {
      const isChecked = switchButton.getAttribute("aria-checked") === "true";
      applyState(isChecked);
    });

    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style", "class"] });
  });

  // 📅 Configuration du double DatePicker
  const userLang = navigator.language || navigator.userLanguage;
  const isFrench = userLang.startsWith('fr');

  $('input[daterange="start"], input[daterange="end"]').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    locale: {
      format: isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      cancelLabel: isFrench ? 'Annuler' : 'Cancel',
      applyLabel: isFrench ? 'Enregistrer' : 'Apply'
    }
  }, function (start, end) {
    $('input[daterange="start"]').val(start.format(isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY'));
    $('input[daterange="end"]').val(end.format(isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY'));
  });
});
