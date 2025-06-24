(function() {
  const DATA_URL          = 'https://assets.atawa.com/form-event-type-source.json';
  const STORAGE_ROLE_KEY  = 'RoleEventType';
  const STORAGE_VALUE_KEY = 'SelectedEventType';

  function detectLang() {
    return window.location.pathname.startsWith('/en') ? 'en' : 'fr';
  }

  function fetchEventTypes() {
    return fetch(DATA_URL, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`Échec fetch (${res.status})`);
        return res.json();
      });
  }

  function clearUI() {
    const selectEl = document.querySelector('[event-type-pro="origine"]');
    const navEl    = document.querySelector('[event-type-pro="destination"]');
    if (!selectEl || !navEl) return;

    // reset <select>
    const firstOption     = selectEl.options[0];
    const placeholderHTML = firstOption?.outerHTML || '<option value="">…</option>';
    const placeholderText = firstOption?.textContent || '';
    selectEl.innerHTML = placeholderHTML;

    // reset dropdown list
    navEl.innerHTML = '';

    // reset toggle text
    const wrapper  = document.querySelector('.w-dropdown');
    const toggleEl = wrapper?.querySelector('.w-dropdown-toggle');
    if (toggleEl) {
      const labelDiv = toggleEl.querySelector('div');
      if (labelDiv) labelDiv.textContent = placeholderText;
      toggleEl.setAttribute('aria-expanded', 'false');
      toggleEl.classList.remove('w--open');
    }
    if (wrapper) wrapper.classList.remove('w--open');
    const listEl = wrapper?.querySelector('.w-dropdown-list');
    if (listEl) listEl.classList.remove('w--open');
  }

  function resetAll() {
    clearUI();
    localStorage.removeItem(STORAGE_ROLE_KEY);
    localStorage.removeItem(STORAGE_VALUE_KEY);
  }

  function resolveRoleKey(orderMap, rawKey) {
    if (rawKey in orderMap) return rawKey;
    const alt1 = rawKey.replace(/_/g, '-');
    if (alt1 in orderMap) return alt1;
    const alt2 = rawKey.replace(/-/g, '_');
    if (alt2 in orderMap) return alt2;
    return null;
  }

  function updateOptions(rawRoleKey, data, lang) {
    const selectEl = document.querySelector('[event-type-pro="origine"]');
    const navEl    = document.querySelector('[event-type-pro="destination"]');
    if (!selectEl || !navEl) return console.error('UI manquante');

    clearUI();

    // Get placeholder info
    const placeholderOption = selectEl.options[0];
    const placeholderText   = placeholderOption?.textContent || '';
    // Inject placeholder into dropdown
    const placeholderA = document.createElement('a');
    placeholderA.href        = '#';
    placeholderA.className   = 'dropdown_link w-dropdown-link';
    placeholderA.setAttribute('data-value', '');
    placeholderA.setAttribute('tabindex', '0');
    placeholderA.textContent = placeholderText;
    placeholderA.addEventListener('click', e => {
      e.preventDefault();
      selectEl.value = '';
      localStorage.removeItem(STORAGE_VALUE_KEY);
      // update toggle text
      const wrapper  = placeholderA.closest('.w-dropdown');
      const toggleEl = wrapper.querySelector('.w-dropdown-toggle');
      const labelDiv = toggleEl.querySelector('div');
      if (labelDiv) labelDiv.textContent = placeholderText;
      // close dropdown
      wrapper.classList.remove('w--open');
      toggleEl.classList.remove('w--open');
      toggleEl.setAttribute('aria-expanded', 'false');
      wrapper.querySelector('.w-dropdown-list').classList.remove('w--open');
    });
    navEl.appendChild(placeholderA);

    // resolve role and get values
    const orderMap  = data.eventTypeOrderByProfile  || {};
    const labelsMap = data.eventTypeLabels          || {};
    const roleKey   = resolveRoleKey(orderMap, rawRoleKey);
    if (!roleKey) return console.error(`Profil "${rawRoleKey}" introuvable`);

    const values = orderMap[roleKey];
    if (!Array.isArray(values)) return console.error(`eventTypeOrderByProfile["${roleKey}"] n'est pas un tableau`);

    // inject <option> items
    values.forEach(val => {
      const text = labelsMap[val]?.[lang];
      if (!text) {
        console.error(`Pas de label pour "${val}" en "${lang}"`);
        return;
      }
      const opt = document.createElement('option');
      opt.value       = val;
      opt.textContent = text;
      selectEl.appendChild(opt);
    });

    // restore saved value
    const savedValue = localStorage.getItem(STORAGE_VALUE_KEY);
    if (savedValue && values.includes(savedValue)) {
      selectEl.value = savedValue;
      const savedText = labelsMap[savedValue]?.[lang];
      const wrapper   = document.querySelector('.w-dropdown');
      const toggleEl  = wrapper.querySelector('.w-dropdown-toggle');
      const labelDiv  = toggleEl.querySelector('div');
      if (labelDiv && savedText) labelDiv.textContent = savedText;
    }

    // inject <a> items for each
    values.forEach(val => {
      const text = labelsMap[val]?.[lang];
      if (!text) return;
      const a = document.createElement('a');
      a.href        = '#';
      a.className   = 'dropdown_link w-dropdown-link';
      a.setAttribute('data-value', val);
      a.setAttribute('tabindex', '0');
      a.textContent = text;

      a.addEventListener('click', e => {
        e.preventDefault();
        selectEl.value = val;
        localStorage.setItem(STORAGE_VALUE_KEY, val);
        selectEl.dispatchEvent(new Event('change'));
        // update toggle text
        const wrapper  = a.closest('.w-dropdown');
        const toggleEl = wrapper.querySelector('.w-dropdown-toggle');
        const labelDiv = toggleEl.querySelector('div');
        if (labelDiv) labelDiv.textContent = text;
        // close dropdown
        wrapper.classList.remove('w--open');
        toggleEl.classList.remove('w--open');
        toggleEl.setAttribute('aria-expanded', 'false');
        wrapper.querySelector('.w-dropdown-list').classList.remove('w--open');
      });

      a.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          a.click();
        }
      });

      navEl.appendChild(a);
    });
  }

  function bindEvents(data, lang) {
    document.querySelectorAll('[role-event-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('role-event-type');
        if (!role) return console.error('role-event-type manquant');
        localStorage.setItem(STORAGE_ROLE_KEY, role);
        localStorage.removeItem(STORAGE_VALUE_KEY);
        updateOptions(role, data, lang);
      });
    });

    const resetBtn = document.querySelector('[form-element="reset-btn"]');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    const selectEl = document.querySelector('[event-type-pro="origine"]');
    if (selectEl) {
      selectEl.addEventListener('change', () => {
        const val = selectEl.value;
        if (val) localStorage.setItem(STORAGE_VALUE_KEY, val);
      });
    }
  }

  function init() {
    const lang = detectLang();
    fetchEventTypes()
      .then(data => {
        bindEvents(data, lang);
        const savedRole = localStorage.getItem(STORAGE_ROLE_KEY);
        if (savedRole) updateOptions(savedRole, data, lang);
      })
      .catch(err => console.error('Erreur fetch event types →', err));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
