document.addEventListener("DOMContentLoaded", () => {
    // Gestion des switchs pour les wrappers
    const wrappers = document.querySelectorAll('[date-switch="wrapper"]');

    wrappers.forEach((wrapper, index) => {
        const switchButton = wrapper.querySelector('[date-switch="switch"]');
        const fullDateContainer = wrapper.querySelector('[date-switch="full-date"]');
        const periodDateContainer = wrapper.querySelector('[date-switch="period-date"]');

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
            },
            agency: {
                startDesktop: wrapper.querySelector('[name="brief-agency-date-start-desktop"]'),
                endDesktop: wrapper.querySelector('[name="brief-agency-date-end-desktop"]'),
                startMobile: wrapper.querySelector('[name="brief-agency-date-start-mobile"]'),
                endMobile: wrapper.querySelector('[name="brief-agency-date-end-mobile"]'),
                period: wrapper.querySelector('[name="brief-agency-date-periode"]')
            }
        };

        if (!switchButton || !fullDateContainer || !periodDateContainer) return;

        const isVisible = (element) => element && getComputedStyle(element).display !== "none";

        const applyState = (isSwitched) => {
            switchButton.setAttribute("aria-checked", isSwitched);

            if (isSwitched) {
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
                fullDateContainer.style.display = "block";
                periodDateContainer.style.display = "none";

                Object.values(dateInputs).forEach(({ startDesktop, endDesktop, startMobile, endMobile, period }) => {
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

        const switchStateKey = `date-switch-state-wrapper-${index}`;
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

        const observer = new MutationObserver(() => {
            const isChecked = switchButton.getAttribute("aria-checked") === "true";
            applyState(isChecked);
        });

        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style", "class"] });
    });

    // 📅 Configuration du double DatePicker PAR WRAPPER
    const userLang = navigator.language || navigator.userLanguage;
    const isFrench = userLang.startsWith('fr');
    const dateFormat = isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY';

    document.querySelectorAll('[date-switch="wrapper"]').forEach(wrapper => {
        const startInput = wrapper.querySelector('input[daterange="start"]');
        const endInput = wrapper.querySelector('input[daterange="end"]');

        if (startInput && endInput) {
            $(startInput).daterangepicker({
                opens: 'left',
                autoUpdateInput: false,
                locale: {
                    format: dateFormat,
                    cancelLabel: isFrench ? 'Annuler' : 'Cancel',
                    applyLabel: isFrench ? 'Enregistrer' : 'Apply'
                }
            }, function (start, end) {
                startInput.value = start.format(dateFormat);
                endInput.value = end.format(dateFormat);
            });
        }
    });
});
