document.addEventListener("DOMContentLoaded", () => {
    const wrappers = document.querySelectorAll('[date-switch="wrapper"]');

    wrappers.forEach((wrapper, index) => {
        const switchButton = wrapper.querySelector('[date-switch="switch"]');
        const fullDateContainer = wrapper.querySelector('[date-switch="full-date"]');
        const periodDateContainer = wrapper.querySelector('[date-switch="period-date"]');

        // Sélection des champs "pro" et "private"
        const dateInputs = {
            pro: {
                startDesktop: wrapper.querySelector('[name="brief-pro-date-start-desktop"]'),
                endDesktop: wrapper.querySelector('[name="brief-pro-date-end-desktop"]'),
                startMobile: wrapper.querySelector('[name="brief-pro-date-start-mobile"]'),
                endMobile: wrapper.querySelector('[name="brief-pro-date-end-mobile"]'),
                period: wrapper.querySelector('[name="brief-pro-date-periode"]')
            },
            private: {
                startDesktop: wrapper.querySelector('[name="brief-private-date-start-desktop"]'),
                endDesktop: wrapper.querySelector('[name="brief-private-date-end-desktop"]'),
                startMobile: wrapper.querySelector('[name="brief-private-date-start-mobile"]'),
                endMobile: wrapper.querySelector('[name="brief-private-date-end-mobile"]'),
                period: wrapper.querySelector('[name="brief-private-date-periode"]')
            }
        };

        if (!switchButton || !fullDateContainer || !periodDateContainer) return;

        // Vérifier si un élément est visible (non caché par "hide-tablet" ou "hide-desktop")
        const isVisible = (element) => element && getComputedStyle(element).display !== "none";

        // Appliquer l'état du switch
        const applyState = (isSwitched) => {
            switchButton.setAttribute("aria-checked", isSwitched);

            if (isSwitched) {
                // Mode "Période" activé
                fullDateContainer.style.display = "none";
                periodDateContainer.style.display = "block";

                Object.values(dateInputs).forEach(({ startDesktop, endDesktop, startMobile, endMobile, period }) => {
                    if (startDesktop) startDesktop.required = false;
                    if (endDesktop) endDesktop.required = false;
                    if (startMobile) startMobile.required = false;
                    if (endMobile) endMobile.required = false;
                    if (period) period.required = true;
                });

            } else {
                // Mode "Full Date" activé
                fullDateContainer.style.display = "block";
                periodDateContainer.style.display = "none";

                Object.values(dateInputs).forEach(({ startDesktop, endDesktop, startMobile, endMobile, period }) => {
                    // Appliquer `required` uniquement aux champs visibles
                    if (isVisible(startDesktop)) {
                        startDesktop.required = true;
                        if (startMobile) startMobile.required = false;
                    } else if (isVisible(startMobile)) {
                        startMobile.required = true;
                        if (startDesktop) startDesktop.required = false;
                    }

                    if (isVisible(endDesktop)) {
                        endDesktop.required = true;
                        if (endMobile) endMobile.required = false;
                    } else if (isVisible(endMobile)) {
                        endMobile.required = true;
                        if (endDesktop) endDesktop.required = false;
                    }

                    if (period) period.required = false;
                });
            }
        };

        // Appliquer l'état initial du switch depuis sessionStorage
        const switchStateKey = `date-switch-state-wrapper-${index}`;
        const switchState = sessionStorage.getItem(switchStateKey) === "true";
        applyState(switchState);

        // Basculer l'état du switch
        const toggleSwitch = () => {
            const isChecked = switchButton.getAttribute("aria-checked") === "true";
            const newState = !isChecked;

            applyState(newState);
            sessionStorage.setItem(switchStateKey, newState);
        };

        // Écoute des interactions utilisateur
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

    // Configuration des datepickers
    const userLang = navigator.language || navigator.userLanguage;
    const isFrench = userLang.startsWith('fr');

    document.querySelectorAll('input[daterange="start"], input[daterange="end"]').forEach((input) => {
        $(input).daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
                cancelLabel: isFrench ? 'Annuler' : 'Cancel',
                applyLabel: isFrench ? 'Enregistrer' : 'Apply'
            }
        }, function (selectedDate) {
            $(input).val(selectedDate.format(isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY'));
        });
    });

});
