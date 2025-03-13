(function () {
  const FADE_IN_DURATION = 300; // Durée de l'animation fade-in en ms
  const FADE_OUT_DURATION = 300; // Durée de l'animation fade-out en ms
  const CORNER_BANNER_DELAY = 5000; // 5 sec pour la bannière (desktop)
  const DEFAULT_POPUP_DELAY = 6000; // Délai d'affichage de la pop-up en ms (6 sec)
  const COOKIE_DURATION_HOURS = 48; // Durée du cookie en heures

  const modals = document.querySelectorAll('[modal="list"]');
  const cornerBanner = document.querySelector('[modal="corner-banner"]');
  const popupModal = document.querySelector('[modal="popup"]');
  const cornerElements = cornerBanner?.querySelectorAll('[modal="corner-banner-element"]') || [];
  const popupElements = popupModal?.querySelectorAll('[modal="popup-element"]') || [];
  const cornerCloseTriggers = document.querySelectorAll('[modal-close="corner-banner"]');
  const popupCloseTriggers = document.querySelectorAll('[modal-close="popup"]');

  let popupShown = false;

  // Arrête le script si aucun modal="list" n'est présent
  if (!modals || modals.length === 0) return;

  // Vérifie si un cookie empêche l'affichage d'une modale spécifique
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

  // Détection de sortie de la souris (exit intent) pour desktop
  const onMouseLeave = (event) => {
    if (event.clientY <= 0 && !popupShown) {
      popupShown = true;
      fadeIn(popupModal, 'flex');
    }
  };

  if (popupModal && popupElements.length > 0 && !isCookieSet('popup')) {
    checkCookieExpiry('popup');
    // Affichage par défaut de la pop-up après 6 secondes (pour mobile et desktop)
    setTimeout(() => {
      if (!popupShown) {
        popupShown = true;
        fadeIn(popupModal, 'flex');
      }
    }, DEFAULT_POPUP_DELAY);

    // Pour desktop, on conserve la détection exit intent
    if (window.innerWidth >= 768) {
      document.addEventListener('mouseleave', onMouseLeave);
    }
  }

  if (cornerBanner && cornerElements.length > 0 && !isCookieSet('corner-banner') && window.innerWidth >= 768) {
    checkCookieExpiry('corner-banner');
    setTimeout(() => {
      // On affiche la bannière corner si la pop-up n'est pas affichée
      if (!popupShown) fadeIn(cornerBanner, 'block');
    }, CORNER_BANNER_DELAY);
  }

  // Gestion du clic sur les éléments de fermeture
  cornerCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => hideModal('corner-banner', cornerBanner));
  });

  popupCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => hideModal('popup', popupModal));
  });
})();
