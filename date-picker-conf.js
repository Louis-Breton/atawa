document.addEventListener("DOMContentLoaded", () => {
    // Gestion des switchs pour les wrappers
    const wrappers = document.querySelectorAll('[date-switch="wrapper"]');

    wrappers.forEach((wrapper, index) => {
        const switchButton = wrapper.querySelector('[date-switch="switch"]');
        const fullDateContainer = wrapper.querySelector('[date-switch="full-date"]');
        const startingDateInput = wrapper.querySelector('[date-switch="input-starting-date"]');
        const endingDateInput = wrapper.querySelector('[date-switch="input-ending-date"]');
        const periodDateContainer = wrapper.querySelector('[date-switch="period-date"]');
        const selectPeriod = wrapper.querySelector('[date-switch="periode"]');

        // Vérification des éléments requis
        if (!switchButton || !fullDateContainer || !periodDateContainer) return;

        // Gestion de l'état dans le localStorage
        const switchStateKey = `date-switch-state-wrapper-${index}`;
        const switchState = localStorage.getItem(switchStateKey) === "true";

        // Appliquer l'état initial
        const applyState = (isSwitched) => {
            switchButton.setAttribute("aria-checked", isSwitched);
            if (isSwitched) {
                fullDateContainer.style.display = "none";
                if (startingDateInput) startingDateInput.required = false;
                if (endingDateInput) endingDateInput.required = false;

                periodDateContainer.style.display = "block";
                if (selectPeriod) selectPeriod.required = true;
            } else {
                fullDateContainer.style.display = "block";
                if (startingDateInput) startingDateInput.required = true;
                if (endingDateInput) endingDateInput.required = true;

                periodDateContainer.style.display = "none";
                if (selectPeriod) selectPeriod.required = false;
            }
        };

        applyState(switchState);

        // Basculer l'état
        const toggleSwitch = () => {
            const isChecked = switchButton.getAttribute("aria-checked") === "true";
            applyState(!isChecked);
            localStorage.setItem(switchStateKey, !isChecked);
        };

        // Écoute des clics et gestion du clavier
        switchButton.addEventListener("click", toggleSwitch);
        switchButton.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSwitch();
            }
        });
    });

    // Configuration des datepickers
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
