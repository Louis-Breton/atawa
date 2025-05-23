document.addEventListener("DOMContentLoaded", function () {
    /**
     * Récupère les infos du navigateur (langue, appareil, résolution)
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
     * Récupère les UTM depuis l'URL
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
     * Récupère les UTM depuis le localStorage
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
     * Récupère le référent depuis le localStorage ou document.referrer
     */
    function getReferrer() {
        try {
            const storedReferrer = localStorage.getItem("utm_tracking");
            if (storedReferrer) {
                let parsedData = JSON.parse(storedReferrer);
                if (parsedData.data && parsedData.data["document-referrer"]) {
                    return parsedData.data["document-referrer"]; // Utilise la valeur existante
                }
            }
        } catch (e) {}

        let referrer = document.referrer;
        if (!referrer) return ""; // Aucun référent détecté

        try {
            let hostname = new URL(referrer).hostname;
            let parts = hostname.split(".");
            if (parts.length > 2) {
                return parts[parts.length - 2] + "." + parts[parts.length - 1]; // Format simplifié
            }
            return hostname;
        } catch (e) {
            return "";
        }
    }

    /**
     * Injecte les valeurs dans les champs cachés
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
     * Applique les valeurs aux formulaires
     */
    function applyDataToForms() {
        const browserInfo = getBrowserInfo();
        const utmFromURL = getUTMFromURL();
        const utmFromStorage = getUTMFromStorage();
        const referrer = getReferrer();

        const combinedData = { ...browserInfo, ...utmFromURL, ...utmFromStorage, "document-referrer": referrer };

        document.querySelectorAll('form[form-prefix]').forEach(form => {
            const formId = form.id; // ex: wf-form-brief-agency
            fillHiddenFields(formId, combinedData);
    });
}

applyDataToForms();
});
