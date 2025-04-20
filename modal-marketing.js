(function () {
  const FADE_IN_DURATION = 300;
  const FADE_OUT_DURATION = 300;
  const CORNER_BANNER_DELAY = 7000;
  const DEFAULT_POPUP_DELAY = 7000;
  const COOKIE_DURATION_HOURS = 6;

  const modals = document.querySelectorAll('[modal="list"]');
  const cornerBanner = document.querySelector('[modal="corner-banner"]');
  const popupModal = document.querySelector('[modal="popup"]');
  const cornerElements = cornerBanner?.querySelectorAll('[modal="corner-banner-element"]') || [];
  const popupElements = popupModal?.querySelectorAll('[modal="popup-element"]') || [];
  const cornerCloseTriggers = document.querySelectorAll('[modal-close="corner-banner"]');
  const popupCloseTriggers = document.querySelectorAll('[modal-close="popup"]');

  let popupShown = false;

  if (!modals || modals.length === 0) return;

  const isCookieSet = (modal) => {
    return localStorage.getItem(`modals_hidden_${modal}`) === 'true';
  };

  const setCookie = (modal) => {
    const expiryTime = Date.now() + COOKIE_DURATION_HOURS * 60 * 60 * 1000;
    localStorage.setItem(`modals_hidden_${modal}`, 'true');
    localStorage.setItem(`modals_expiry_${modal}`, expiryTime);
  };

  const checkCookieExpiry = (modal) => {
    const expiryTime = localStorage.getItem(`modals_expiry_${modal}`);
    if (expiryTime && Date.now() > parseInt(expiryTime, 10)) {
      localStorage.removeItem(`modals_hidden_${modal}`);
      localStorage.removeItem(`modals_expiry_${modal}`);
    }
  };

  const fadeIn = (element, displayType = 'block') => {
    const parentModal = element.closest('[modal="list"]');
    if (parentModal) parentModal.style.display = 'block';
    element.style.display = displayType;
    element.style.opacity = 0;
    const start = performance.now();

    const fade = (time) => {
      const progress = Math.min((time - start) / FADE_IN_DURATION, 1);
      element.style.opacity = progress;
      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };
    requestAnimationFrame(fade);
  };

  const fadeOut = (element, callback) => {
    element.style.opacity = 1;
    const start = performance.now();

    const fade = (time) => {
      const progress = Math.min((time - start) / FADE_OUT_DURATION, 1);
      element.style.opacity = 1 - progress;
      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        element.style.display = 'none';
        const parentModal = element.closest('[modal="list"]');
        if (parentModal) parentModal.style.display = 'none';
        if (callback) callback();
      }
    };
    requestAnimationFrame(fade);
  };

  const hideModal = (modalName, element) => {
    fadeOut(element, () => setCookie(modalName));
  };

  const onMouseLeave = (event) => {
    if (event.clientY <= 0 && !popupShown) {
      popupShown = true;
      fadeIn(popupModal, 'flex');
    }
  };

  if (popupModal && popupElements.length > 0 && !isCookieSet('popup')) {
    checkCookieExpiry('popup');

    const popupTrigger = document.getElementById("popup-trigger");
    let timeElapsed = false;
    let triggerSeen = false;

    // Lance le timer dès le début
    setTimeout(() => {
      timeElapsed = true;
      if (triggerSeen && !popupShown) {
        popupShown = true;
        fadeIn(popupModal, 'flex');
      }
    }, DEFAULT_POPUP_DELAY);

    // Si le trigger est présent, observe son intersection dès le début
    if (popupTrigger) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !popupShown) {
            triggerSeen = true;
            if (timeElapsed) {
              popupShown = true;
              fadeIn(popupModal, 'flex');
              obs.unobserve(entry.target);
            }
          }
        });
      }, {
        root: null,
        threshold: 0.1
      });

      observer.observe(popupTrigger);
    }

    if (window.innerWidth >= 768) {
      document.addEventListener('mouseleave', onMouseLeave);
    }
  }

  if (cornerBanner && cornerElements.length > 0 && !isCookieSet('corner-banner') && window.innerWidth >= 768) {
    checkCookieExpiry('corner-banner');
    setTimeout(() => {
      if (!popupShown) fadeIn(cornerBanner, 'block');
    }, CORNER_BANNER_DELAY);
  }

  cornerCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => hideModal('corner-banner', cornerBanner));
  });

  popupCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => hideModal('popup', popupModal));
  });
})();
