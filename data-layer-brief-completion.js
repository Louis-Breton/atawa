document.addEventListener("DOMContentLoaded", function () {
  let eventCooldown = {};

  const formTypeMap = {
    pro: "professionnel",
    private: "particulier",
    agency: "professionnel événementiel"
  };

  function triggerDataLayerEvent(eventName, formType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      form: formType
    });
  }

  function observeFieldsForForm(form, fields, eventName, allRequired = false) {
    const prefix = form.getAttribute("form-prefix");
    const formType = formTypeMap[prefix] || prefix;

    const fieldElements = fields.map(name => form.querySelector(`[name="brief-${prefix}-${name}"], #brief-${prefix}-${name}`)).filter(Boolean);

    function checkAndTrigger(e) {
      const field = e.target;
      const now = Date.now();

      if (eventCooldown[field.name] && now - eventCooldown[field.name] < 60000) return;
      eventCooldown[field.name] = now;

      const filledCount = fieldElements.filter(f => f && f.value.trim() !== "").length;
      if (allRequired && filledCount === fieldElements.length) {
        triggerDataLayerEvent(eventName, formType);
      } else if (!allRequired && filledCount > 0) {
        triggerDataLayerEvent(eventName, formType);
      }
    }

    fieldElements.forEach(field => {
      if (field) {
        field.addEventListener("change", checkAndTrigger);
        field.addEventListener("blur", checkAndTrigger);
      }
    });
  }

  function observeBudgetField(form) {
    const prefix = form.getAttribute("form-prefix");
    const formType = formTypeMap[prefix] || prefix;
    const budget = form.querySelector(`#brief-${prefix}-budget`);
    if (!budget) return;

    budget.addEventListener("change", (event) => {
      const field = event.target;
      if (eventCooldown[field.name]) return;
      eventCooldown[field.name] = Date.now();
      if (field.value.trim() !== "") {
        triggerDataLayerEvent("add_budget", formType);
      }
    });
  }

  function observeDateFieldsForForm(form) {
    const prefix = form.getAttribute("form-prefix");
    const formType = formTypeMap[prefix] || prefix;

    const startDesktop = form.querySelector(`#brief-${prefix}-date-start-desktop`);
    const endDesktop = form.querySelector(`#brief-${prefix}-date-end-desktop`);
    const startMobile = form.querySelector(`#brief-${prefix}-date-start-mobile`);
    const endMobile = form.querySelector(`#brief-${prefix}-date-end-mobile`);
    const periode = form.querySelector(`#brief-${prefix}-date-periode`);

    function checkAndTriggerDate() {
      if (
        (startDesktop?.value && endDesktop?.value) ||
        (startMobile?.value && endMobile?.value) ||
        (periode?.value)
      ) {
        triggerDataLayerEvent("add_dates", formType);
      }
    }

    [startDesktop, endDesktop, startMobile, endMobile, periode].forEach(el => {
      if (el) el.addEventListener("change", checkAndTriggerDate);
    });

    if (startDesktop) {
      $(startDesktop).on("apply.daterangepicker", () => {
        checkAndTriggerDate();
      });
    }
  }

  // Initialisation pour chaque formulaire
  document.querySelectorAll("form[form-prefix]").forEach(form => {
    // Dates
    observeDateFieldsForForm(form);

    // Budget
    observeBudgetField(form);

    // Shipping info
    observeFieldsForForm(form, ["postal-code", "country"], "add_shipping_info", true);

    // Event details
    observeFieldsForForm(form, ["guest", "surface"], "add_event_details");

    // Contact info
    observeFieldsForForm(form, ["first-name", "last-name", "email", "phone"], "add_contact_info", true);
  });
});
