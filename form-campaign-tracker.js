document.addEventListener('DOMContentLoaded', () => {
        const PARAMS_EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 heures en millisecondes

        // Fonction pour obtenir les paramètres d'URL
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

        // Fonction pour enregistrer les paramètres dans le localStorage
        function saveParamsToLocalStorage(params) {
            const timestampedParams = {
                ...params,
                timestamp: Date.now()
            };
            localStorage.setItem('formParams', JSON.stringify(timestampedParams));
        }

        // Fonction pour récupérer les paramètres depuis le localStorage
        function getParamsFromLocalStorage() {
            const savedParams = JSON.parse(localStorage.getItem('formParams')) || {};
            const isExpired = savedParams.timestamp && (Date.now() - savedParams.timestamp > PARAMS_EXPIRATION_TIME);
            return isExpired ? {} : savedParams;
        }

        // Fonction pour remplir les champs cachés
        function fillHiddenFields(formId, prefix, params) {
            const form = document.getElementById(formId);
            if (form) {
                const urlMapping = {
                    gclid: `${prefix}-ads-gclid`,
                    camp: `${prefix}-ads-camp`,
                    adgroup: `${prefix}-ads-adgroup`,
                    utm_term: `${prefix}-ads-utm-term`,
                    utm_campaign: `${prefix}-ads-utm-campaign`,
                    utm_source: `${prefix}-ads-utm-source`
                };

                // Remplir les champs cachés en fonction des paramètres
                for (const [key, fieldId] of Object.entries(urlMapping)) {
                    const input = form.querySelector(`#${fieldId}`);
                    if (input) {
                        input.value = params[key] || '';
                        console.log(`Rempli ${fieldId} avec : ${params[key]}`); // Débogage
                    } else {
                        console.warn(`Champ introuvable : ${fieldId}`);
                    }
                }
            } else {
                console.error(`Formulaire introuvable : ${formId}`);
            }
        }

        // Force l'injection des données avant la soumission
        function ensureFieldsBeforeSubmit(formId, prefix, params) {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', () => {
                    fillHiddenFields(formId, prefix, params); // Remplir à nouveau les champs avant la soumission
                });
            }
        }

        // Vérifie si les paramètres sont présents dans l'URL
        const urlParams = getUrlParams();
        if (Object.values(urlParams).some(value => value)) {
            saveParamsToLocalStorage(urlParams);
        }

        // Récupère les paramètres depuis le localStorage si l'URL n'en contient pas
        const storedParams = getParamsFromLocalStorage();
        const paramsToUse = Object.values(urlParams).some(value => value) ? urlParams : storedParams;

        // Ajoute un log pour vérifier les paramètres utilisés
        console.log("Paramètres utilisés pour remplir les champs :", paramsToUse);

        // Remplit les champs pour les deux formulaires
        fillHiddenFields('wf-form-brief-pro', 'brief-pro', paramsToUse);
        fillHiddenFields('wf-form-brief-private', 'brief-private', paramsToUse);

        // Ajoute un contrôle avant soumission pour chaque formulaire
        ensureFieldsBeforeSubmit('wf-form-brief-pro', 'brief-pro', paramsToUse);
        ensureFieldsBeforeSubmit('wf-form-brief-private', 'brief-private', paramsToUse);
    });
