document.addEventListener('DOMContentLoaded', () => {
    const PARAMS_EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 heures en millisecondes

    // === Fonction pour obtenir les informations utilisateur ===
    function gatherUserInfo() {
        const browserLanguage = navigator.language || navigator.userLanguage;
        const userAgent = navigator.userAgent;
        const deviceType = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent) ? 'Mobile' : 'Desktop';
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const languageSegment = window.location.pathname.split('/')[1];
        const languageMap = {
            'fr': 'Français',
            'en': 'Anglais',
            'fr-ch': 'Suisse français',
            'en-ch': 'Suisse anglais',
            'uk': 'Royaume-Uni'
        };
        const languageRegion = languageMap[languageSegment] || 'Non spécifié';

        return {
            browserLanguage,
            deviceType,
            screenResolution,
            languageRegion
        };
    }

    // === Fonction pour obtenir les paramètres d'URL ===
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            gclid: params.get('gclid') || '',
            camp: params.get('camp') || '',
            adgroup: params.get('adgroup') || '',
            utm_term: params.get('utm_term') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_source: params.get('utm_source') || ''
        };
    }

    // === Fonction pour enregistrer les paramètres dans le localStorage ===
    function saveParamsToLocalStorage(params) {
        const timestampedParams = {
            ...params,
            timestamp: Date.now()
        };
        localStorage.setItem('formParams', JSON.stringify(timestampedParams));
    }

    // === Fonction pour récupérer les paramètres depuis le localStorage ===
    function getParamsFromLocalStorage() {
        const savedParams = JSON.parse(localStorage.getItem('formParams')) || {};
        const isExpired = savedParams.timestamp && (Date.now() - savedParams.timestamp > PARAMS_EXPIRATION_TIME);
        return isExpired ? {} : savedParams;
    }

    // === Fonction pour remplir les champs cachés ===
    function fillHiddenFields(formId, prefix, params) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Mapping des champs pour les campagnes publicitaires
        const urlMapping = {
            gclid: `${prefix}-ads-gclid`,
            camp: `${prefix}-ads-camp`,
            adgroup: `${prefix}-ads-adgroup`,
            utm_term: `${prefix}-ads-utm-term`,
            utm_campaign: `${prefix}-ads-utm-campaign`,
            utm_source: `${prefix}-ads-utm-source`
        };

        // Mapping des champs pour les informations utilisateur
        const userInfo = gatherUserInfo();
        const userMapping = {
            'browser-language': `${prefix}-browser-language`,
            'device-type': `${prefix}-device-type`,
            'screen-resolution': `${prefix}-screen-resolution`,
            'language-region': `${prefix}-language-region`
        };

        // Remplir les champs pour les campagnes publicitaires
        Object.entries(urlMapping).forEach(([key, fieldId]) => {
            const input = form.querySelector(`#${fieldId}`);
            if (input) input.value = params[key] || '';
        });

        // Remplir les champs pour les informations utilisateur
        Object.entries(userMapping).forEach(([key, fieldId]) => {
            const input = form.querySelector(`#${fieldId}`);
            if (input) input.value = userInfo[key] || '';
        });
    }

    // === Force l'injection des données avant la soumission ===
    function ensureFieldsBeforeSubmit(formId, prefix, params) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', () => {
                fillHiddenFields(formId, prefix, params);
            });
        }
    }

    // === Vérifie si les paramètres sont présents dans l'URL ===
    const urlParams = getUrlParams();
    if (Object.values(urlParams).some(value => value)) {
        saveParamsToLocalStorage(urlParams);
    }

    // Récupère les paramètres depuis le localStorage si l'URL n'en contient pas
    const storedParams = getParamsFromLocalStorage();
    const paramsToUse = Object.values(urlParams).some(value => value) ? urlParams : storedParams;

    // Remplit les champs pour les deux formulaires
    fillHiddenFields('wf-form-brief-pro', 'brief-pro', paramsToUse);
    fillHiddenFields('wf-form-brief-private', 'brief-private', paramsToUse);

    // Ajoute un contrôle avant soumission pour chaque formulaire
    ensureFieldsBeforeSubmit('wf-form-brief-pro', 'brief-pro', paramsToUse);
    ensureFieldsBeforeSubmit('wf-form-brief-private', 'brief-private', paramsToUse);
});
