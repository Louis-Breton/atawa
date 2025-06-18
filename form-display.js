document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector('[form-element="container"]');
  const triggersContainer = document.querySelector('[form-element="triggers"]');
  const triggerButtons = triggersContainer.querySelectorAll('[form-trigger]');
  const resetButton = formContainer.querySelector('[form-element="reset-btn"]');
  const wishlistSection = document.querySelector('[form-element="wishlist"]');
  const roleWrapper = document.querySelector('[role-pro="wrapper"]');
  const roleDestination = document.querySelector('[role-label="destination"]');
  const companyInput = document.querySelector('#brief-pro-company');
  const leadRoleInput = document.querySelector('#brief-pro-lead-role');

  const forms = {};
  document.querySelectorAll('[form-profil]').forEach(form => {
    const key = form.getAttribute('form-profil');
    forms[key] = form;
  });

  const updateWishlistVisibility = () => {
    if (!wishlistSection) return;
    const storedWishlist = localStorage.getItem("wishlist");
    if (!storedWishlist) return wishlistSection.style.display = "none";
    const wishlist = JSON.parse(storedWishlist);
    wishlistSection.style.display = wishlist.length > 0 ? "block" : "none";
  };

  const resetDisplay = () => {
    formContainer.style.display = "none";
    triggersContainer.style.display = "block";

    triggerButtons.forEach(trigger => {
      trigger.style.removeProperty("display");
    });

    Object.values(forms).forEach(form => {
      form.style.display = "none";
    });

    if (roleWrapper) {
      roleWrapper.style.display = "none";
    }

    localStorage.removeItem("formPreference");
    localStorage.removeItem("formPreferenceExpiration");
    localStorage.removeItem("leadRoleLabel");
    localStorage.removeItem("leadRoleValue");
    localStorage.removeItem("leadCompanyPlaceholder");

    if (companyInput) {
      companyInput.placeholder = "Indiquez votre entreprise";
    }

    if (roleDestination) {
      roleDestination.textContent = "";
    }

    if (leadRoleInput) {
      leadRoleInput.value = "";
    }
  };

  const isPreferenceExpired = () => {
    const expiration = localStorage.getItem("formPreferenceExpiration");
    if (!expiration) return true;
    return Date.now() > parseInt(expiration, 10);
  };

  const savedPreference = localStorage.getItem("formPreference");

  if (savedPreference && forms[savedPreference] && !isPreferenceExpired()) {
    formContainer.style.display = "block";
    triggersContainer.style.display = "none";
    Object.entries(forms).forEach(([key, form]) => {
      form.style.display = key === savedPreference ? "block" : "none";
    });

    if (savedPreference === "pro") {
      if (roleDestination) {
        roleDestination.textContent = localStorage.getItem("leadRoleLabel") || "";
      }
      if (companyInput) {
        const savedPlaceholder = localStorage.getItem("leadCompanyPlaceholder");
        if (savedPlaceholder) companyInput.placeholder = savedPlaceholder;
      }
      if (leadRoleInput) {
        leadRoleInput.value = localStorage.getItem("leadRoleValue") || "";
      }
    }
  } else {
    resetDisplay();
  }

  triggerButtons.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const formType = trigger.getAttribute("form-trigger");
      if (!formType) return;

      if (formType === "pro" && roleWrapper) {
        roleWrapper.style.display = "block";
        triggerButtons.forEach(btn => {
          if (btn !== trigger) btn.style.display = "none";
        });
        return;
      }

      if (forms[formType]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";
        Object.entries(forms).forEach(([key, form]) => {
          form.style.display = key === formType ? "block" : "none";
        });
        localStorage.setItem("formPreference", formType);
        localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      }
    });
  });

  resetButton.addEventListener("click", resetDisplay);

  if (roleWrapper) {
    roleWrapper.addEventListener("click", e => {
      const roleValueEl = e.target.closest('[role-value]');
      if (!roleValueEl) return;

      const roleValue = roleValueEl.getAttribute("role-value") || "";
      const roleCompany = roleValueEl.getAttribute("role-company") || "";
      const roleLabelOrigin = roleValueEl.querySelector('[role-label="origin"]')?.textContent.trim() || "";

      if (leadRoleInput) leadRoleInput.value = roleValue;
      if (companyInput) companyInput.placeholder = roleCompany;
      if (roleDestination) roleDestination.textContent = roleLabelOrigin;

      localStorage.setItem("formPreference", "pro");
      localStorage.setItem("formPreferenceExpiration", Date.now() + 60 * 60 * 1000);
      localStorage.setItem("leadRoleLabel", roleLabelOrigin);
      localStorage.setItem("leadRoleValue", roleValue);
      localStorage.setItem("leadCompanyPlaceholder", roleCompany);

      if (forms["pro"]) {
        formContainer.style.display = "block";
        triggersContainer.style.display = "none";
        forms["pro"].style.display = "block";
      }

      roleWrapper.style.display = "none";
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  updateWishlistVisibility();
});
