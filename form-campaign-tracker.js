document.addEventListener("DOMContentLoaded", function () {
    /**
     * Fonction pour récupérer les informations du navigateur (langue, appareil, résolution)
     */
    function getBrowserInfo() {
        return {
            "browser-language": navigator.language || navigator.userLanguage,
            "device-type": /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            "screen-resolution": `${window.screen.width}x${window.screen.height}`,
            "language-region": Intl.DateTimeFormat().resolvedOptions().locale || navigator.language
        };
    }

    /**
     * Fonction pour récupérer les paramètres UTM depuis l'URL
     */
    function getUTMFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            "ads-gclid": urlParams.get("gclid") || "",
            "ads-camp": urlParams.get("utm_campaign") || "",
            "ads-adgroup": urlParams.get("utm_adgroup") || "",
            "ads-utm-term": urlParams.get("utm_term") || "",
            "ads-utm-campaign": urlParams.get("utm_campaign") || "",
            "ads-utm-source": urlParams.get("utm_source") || ""
        };
    }

    /**
     * Fonction pour récupérer les valeurs UTM depuis le local storage (si elles existent)
     */
    function getUTMFromStorage() {
        try {
            const storedUTM = localStorage.getItem("utm_tracking");
            if (storedUTM) {
                const parsedData = JSON.parse(storedUTM);
                return {
                    "ads-gclid": parsedData.data["gclid"] || "",
                    "ads-utm-source": parsedData.data["utm_source"] || "",
                    "ads-utm-campaign": parsedData.data["utm_campaign"] || "",
                    "ads-utm-term": parsedData.data["utm_term"] || ""
                };
            }
        } catch (e) {}
        return {};
    }

    /**
     * Fonction pour récupérer le référent du document et vérifier s'il existe en local storage
     * - Si présent en local storage, on l’utilise.
     * - Sinon, on le calcule depuis `document.referrer` et on le formate (`domaine.extension`).
     */
    function getReferrer() {
        try {
            const storedReferrer = localStorage.getItem("referrer_tracking");
            if (storedReferrer) {
                return storedReferrer; // Priorité à la valeur existante
            }
        } catch (e) {}

        let referrer = document.referrer;
        if (!referrer) return ""; // Aucun référent détecté

        try {
            let hostname = new URL(referrer).hostname; // Extrait le domaine complet
            let parts = hostname.split("."); // Sépare les parties du domaine
            if (parts.length > 2) {
                return parts[parts.length - 2] + "." + parts[parts.length - 1]; // Ex: google.com, facebook.com
            }
            return hostname;
        } catch (e) {
            return "";
        }
    }

    /**
     * Fonction pour injecter les données dans les champs cachés des formulaires
     */
    function fillHiddenFields(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`input[name="brief-${formId.split('-').pop()}-${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }

    /**
     * Applique toutes les données aux formulaires
     */
    function applyDataToForms() {
        const browserInfo = getBrowserInfo();
        const utmFromURL = getUTMFromURL();
        const utmFromStorage = getUTMFromStorage();
        const referrer = getReferrer();

        // Fusionne toutes les données
        const combinedData = { ...browserInfo, ...utmFromURL, ...utmFromStorage, "document-referrer": referrer };

        // Injecte les valeurs dans les champs cachés des formulaires
        fillHiddenFields("wf-form-brief-pro", combinedData);
        fillHiddenFields("wf-form-brief-private", combinedData);
    }

    // Exécute l'ajout des données
    applyDataToForms();
});
