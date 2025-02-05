document.addEventListener("DOMContentLoaded", function () {
    function triggerDataLayerEvent(eventName, formType) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': eventName,
            'form': formType
        });
        console.log(`Data Layer Triggered: ${eventName} - Form: ${formType}`);
    }

    function observeFields(fields, eventName, formType, allRequired = false) {
        const fieldElements = fields.map(selector => document.querySelector(selector)).filter(Boolean);

        function checkAndTrigger() {
            const filledCount = fieldElements.filter(field => field && field.value.trim() !== "").length;
            if (allRequired && filledCount === fields.length) {
                triggerDataLayerEvent(eventName, formType);
            } else if (!allRequired && filledCount > 0) {
                triggerDataLayerEvent(eventName, formType);
            }
        }

        fieldElements.forEach(field => {
            if (field) {
                field.addEventListener("input", checkAndTrigger);
                field.addEventListener("change", checkAndTrigger);
                field.addEventListener("blur", checkAndTrigger);
            }
        });
    }

    function observeDateFields() {
        const desktopProStart = document.querySelector("#brief-pro-date-start-desktop");
        const desktopProEnd = document.querySelector("#brief-pro-date-end-desktop");
        const periodePro = document.querySelector("#brief-pro-date-periode");

        const desktopPrivateStart = document.querySelector("#brief-private-date-start-desktop");
        const desktopPrivateEnd = document.querySelector("#brief-private-date-end-desktop");
        const periodePrivate = document.querySelector("#brief-private-date-periode");

        function checkAndTriggerPro() {
            if ((desktopProStart && desktopProStart.value && desktopProEnd && desktopProEnd.value) || (periodePro && periodePro.value)) {
                triggerDataLayerEvent("add_dates", "professionnel");
            }
        }

        function checkAndTriggerPrivate() {
            if ((desktopPrivateStart && desktopPrivateStart.value && desktopPrivateEnd && desktopPrivateEnd.value) || (periodePrivate && periodePrivate.value)) {
                triggerDataLayerEvent("add_dates", "particulier");
            }
        }

        // Écoute les événements des champs manuels
        [desktopProStart, desktopProEnd, periodePro].forEach(el => {
            if (el) {
                el.addEventListener("input", checkAndTriggerPro);
                el.addEventListener("change", checkAndTriggerPro);
                el.addEventListener("blur", checkAndTriggerPro);
            }
        });

        [desktopPrivateStart, desktopPrivateEnd, periodePrivate].forEach(el => {
            if (el) {
                el.addEventListener("input", checkAndTriggerPrivate);
                el.addEventListener("change", checkAndTriggerPrivate);
                el.addEventListener("blur", checkAndTriggerPrivate);
            }
        });

        // Ajoute un écouteur spécifique au DateRangePicker
        if (desktopProStart) {
            $(desktopProStart).on("apply.daterangepicker", function () {
                checkAndTriggerPro();
            });
        }
        if (desktopPrivateStart) {
            $(desktopPrivateStart).on("apply.daterangepicker", function () {
                checkAndTriggerPrivate();
            });
        }
    }

    observeDateFields();

    observeFields(["#brief-pro-postal-code", "#brief-pro-country"], "add_shipping_info", "professionnel", true);
    observeFields(["#brief-private-postal-code", "#brief-private-country"], "add_shipping_info", "particulier", true);

    observeFields(["#brief-pro-guest", "#brief-pro-surface"], "add_event_details", "professionnel");
    observeFields(["#brief-private-guest", "#brief-private-surface"], "add_event_details", "particulier");

    observeFields(["#brief-pro-first-name", "#brief-pro-last-name", "#brief-pro-email", "#brief-pro-phone"], "add_contact_info", "professionnel", true);
    observeFields(["#brief-private-first-name", "#brief-private-last-name", "#brief-private-email", "#brief-private-phone"], "add_contact_info", "particulier", true);
});
