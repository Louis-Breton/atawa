document.addEventListener("DOMContentLoaded", function () {
    let eventCooldown = {}; // Stocke les événements déclenchés pour éviter les répétitions

    // Fonction pour envoyer un événement au dataLayer
    function triggerDataLayerEvent(eventName, formType) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': eventName,
            'form': formType
        });
    }

    // Fonction pour observer les champs et déclencher un événement quand nécessaire
    function observeFields(fields, eventName, formType, allRequired = false) {
        const fieldElements = fields.map(selector => document.querySelector(selector)).filter(Boolean);

        function checkAndTrigger(e) {
            const field = e.target;
            const now = Date.now();

            // Bloque les événements multiples dans un délai de 60 secondes
            if (eventCooldown[field.name] && now - eventCooldown[field.name] < 60000) {
                return;
            }
            eventCooldown[field.name] = now;

            // Vérifie si tous les champs requis sont remplis
            const filledCount = fieldElements.filter(f => f && f.value.trim() !== "").length;
            if (allRequired && filledCount === fields.length) {
                triggerDataLayerEvent(eventName, formType);
            } else if (!allRequired && filledCount > 0) {
                triggerDataLayerEvent(eventName, formType);
            }
        }

        // Ajoute des écouteurs sur les champs
        fieldElements.forEach(field => {
            if (field) {
                field.addEventListener("change", checkAndTrigger);
                field.addEventListener("blur", checkAndTrigger);
            }
        });
    }

    // Fonction pour observer les champs de date
    function observeDateFields() {
        const desktopProStart = document.querySelector("#brief-pro-date-start-desktop");
        const desktopProEnd = document.querySelector("#brief-pro-date-end-desktop");
        const mobileProStart = document.querySelector("#brief-pro-date-start-mobile");
        const mobileProEnd = document.querySelector("#brief-pro-date-end-mobile");
        const periodePro = document.querySelector("#brief-pro-date-periode");

        const desktopPrivateStart = document.querySelector("#brief-private-date-start-desktop");
        const desktopPrivateEnd = document.querySelector("#brief-private-date-end-desktop");
        const mobilePrivateStart = document.querySelector("#brief-private-date-start-mobile");
        const mobilePrivateEnd = document.querySelector("#brief-private-date-end-mobile");
        const periodePrivate = document.querySelector("#brief-private-date-periode");

        function checkAndTriggerPro() {
            if ((desktopProStart && desktopProStart.value && desktopProEnd && desktopProEnd.value) ||
                (mobileProStart && mobileProStart.value && mobileProEnd && mobileProEnd.value) ||
                (periodePro && periodePro.value)) {
                triggerDataLayerEvent("add_dates", "professionnel");
            }
        }

        function checkAndTriggerPrivate() {
            if ((desktopPrivateStart && desktopPrivateStart.value && desktopPrivateEnd && desktopPrivateEnd.value) ||
                (mobilePrivateStart && mobilePrivateStart.value && mobilePrivateEnd && mobilePrivateEnd.value) ||
                (periodePrivate && periodePrivate.value)) {
                triggerDataLayerEvent("add_dates", "particulier");
            }
        }

        // Ajoute des écouteurs sur les champs de date
        [desktopProStart, desktopProEnd, mobileProStart, mobileProEnd, periodePro].forEach(el => {
            if (el) el.addEventListener("change", checkAndTriggerPro);
        });

        [desktopPrivateStart, desktopPrivateEnd, mobilePrivateStart, mobilePrivateEnd, periodePrivate].forEach(el => {
            if (el) el.addEventListener("change", checkAndTriggerPrivate);
        });

        // Écoute les sélections sur DateRangePicker
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

    // Fonction pour observer les champs budget
    function observeBudgetFields() {
        const proBudget = document.querySelector("#brief-pro-budget");
        const privateBudget = document.querySelector("#brief-private-budget");

        function triggerBudgetEvent(event) {
            const field = event.target;
            if (eventCooldown[field.name]) return;
            eventCooldown[field.name] = Date.now();

            if (field.value.trim() !== "") {
                triggerDataLayerEvent("add_budget", field.name.includes("pro") ? "professionnel" : "particulier");
            }
        }

        if (proBudget) proBudget.addEventListener("change", triggerBudgetEvent);
        if (privateBudget) privateBudget.addEventListener("change", triggerBudgetEvent);
    }

    // Observe les champs de date
    observeDateFields();

    // Observe les champs de budget
    observeBudgetFields();

    // Observe les champs pour add_shipping_info
    observeFields(["#brief-pro-postal-code", "#brief-pro-country"], "add_shipping_info", "professionnel", true);
    observeFields(["#brief-private-postal-code", "#brief-private-country"], "add_shipping_info", "particulier", true);

    // Observe les champs pour add_event_details
    observeFields(["#brief-pro-guest", "#brief-pro-surface"], "add_event_details", "professionnel");
    observeFields(["#brief-private-guest", "#brief-private-surface"], "add_event_details", "particulier");

    // Observe les champs pour add_contact_info
    observeFields(["#brief-pro-first-name", "#brief-pro-last-name", "#brief-pro-email", "#brief-pro-phone"], "add_contact_info", "professionnel", true);
    observeFields(["#brief-private-first-name", "#brief-private-last-name", "#brief-private-email", "#brief-private-phone"], "add_contact_info", "particulier", true);
});
