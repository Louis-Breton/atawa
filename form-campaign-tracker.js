document.addEventListener("DOMContentLoaded", () => {
    const PARAMS_EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 heures en millisecondes

    // === Fonction pour capturer directement les informations utilisateur ===
    const userInfo = {
        browserLanguage: navigator.language || navigator.userLanguage,
        deviceType: /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        languageRegion: (() => {
            const languageSegment = window.location.pathname.split('/')[1];
            const languageMap = {
                'fr': 'Français',
                'en': 'Anglais',
                'fr-ch': 'Suisse français',
                'en-ch': 'Suisse anglais',
                'uk': 'Royaume-Uni'
            };
            return languageMap[languageSegment] || 'Non spécifié';
        })()
    };

    // === Fonction pour obtenir les paramètres d'URL ===
    const getUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            gclid: params.get('gclid') || '',
            camp: params.get('camp') || '',
            adgroup: params.get('adgroup') || '',
            utm_term: params.get('utm_term') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_source: params.get('utm_source') || ''
        };
    };

    // === Fonction pour enregistrer les paramètres dans le localStorage ===
    const saveParamsToLocalStorage = (params) => {
        const timestampedParams = {
            ...params,
            timestamp: Date.now()
        };
        localStorage.setItem('formParams', JSON.stringify(timestampedParams));
    };

    // === Fonction pour récupérer les paramètres depuis le localStorage ===
    const getParamsFromLocalStorage = () => {
        const savedParams = JSON.parse(localStorage.getItem('formParams')) || {};
        const isExpired = savedParams.timestamp && (Date.now() - savedParams.timestamp > PARAMS_EXPIRATION_TIME);
        return isExpired ? {} : savedParams;
    };

    // === Fonction pour remplir les champs cachés ===
    const fillHiddenFields = (formId, prefix, params) => {
        const form = document.getElementById(formId);
        if (!form) return;

        // Mapping pour les paramètres d'URL
        const urlFieldMappings = {
            gclid: `${prefix}-ads-gclid`,
            camp: `${prefix}-ads-camp`,
            adgroup: `${prefix}-ads-adgroup`,
            utm_term: `${prefix}-ads-utm-term`,
            utm_campaign: `${prefix}-ads-utm-campaign`,
            utm_source: `${prefix}-ads-utm-source`
        };

        // Mapping pour les informations utilisateur
        const userFieldMappings = {
            'browser-language': userInfo.browserLanguage,
            'device-type': userInfo.deviceType,
            'screen-resolution': userInfo.screenResolution,
            'language-region': userInfo.languageRegion
        };

        // Remplissage des champs URL
        Object.entries(urlFieldMappings).forEach(([key, fieldId]) => {
            const input = form.querySelector(`#${fieldId}`);
            if (input) input.value = params[key] || '';
        });

        // Remplissage des champs utilisateur
        Object.entries(userFieldMappings).forEach(([key, value]) => {
            const input = form.querySelector(`#${prefix}-${key}`);
            if (input) input.value = value;
        });
    };

    // === Assurer l'injection avant soumission ===
    const ensureFieldsBeforeSubmit = (formId, prefix, params) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', () => {
                fillHiddenFields(formId, prefix, params); // Remplir à nouveau les champs avant soumission
            });
        }
    };

    // === Gestion des paramètres URL et localStorage ===
    const urlParams = getUrlParams();
    if (Object.values(urlParams).some(value => value)) {
        saveParamsToLocalStorage(urlParams);
    }

    const storedParams = getParamsFromLocalStorage();
    const paramsToUse = Object.values(urlParams).some(value => value) ? urlParams : storedParams;

    // === Application des valeurs aux formulaires ===
    const applyToForms = () => {
        fillHiddenFields('wf-form-brief-pro', 'brief-pro', paramsToUse);
        fillHiddenFields('wf-form-brief-private', 'brief-private', paramsToUse);
    };

    // === Gestion des formulaires dynamiques ===
    const observer = new MutationObserver(() => {
        if (document.getElementById('wf-form-brief-pro') && document.getElementById('wf-form-brief-private')) {
            applyToForms();
            observer.disconnect(); // Arrête l'observation
        }
    });

    // Si les formulaires ne sont pas encore chargés
    if (!document.getElementById('wf-form-brief-pro') || !document.getElementById('wf-form-brief-private')) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        applyToForms();
    }

    // Assurer l'injection avant soumission
    ensureFieldsBeforeSubmit('wf-form-brief-pro', 'brief-pro', paramsToUse);
    ensureFieldsBeforeSubmit('wf-form-brief-private', 'brief-private', paramsToUse);
});
