document.addEventListener("DOMContentLoaded", function () {
    /**
     * Récupère les infos du navigateur (langue, appareil, résolution, région de langue)
     */
    function getBrowserInfo() {
        return {
            "contact-browser-language": navigator.language || navigator.userLanguage,
            "contact-device-type": /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            "contact-resolution": `${window.screen.width}x${window.screen.height}`,
            "contact-language-region": getLanguageRegion()
        };
    }

    /**
     * Détermine la région de langue en fonction du pass dans l'URL
     */
    function getLanguageRegion() {
        const pathSegments = window.location.pathname.split('/');
        return (pathSegments[1] === 'fr' || pathSegments[1] === 'en') ? pathSegments[1] : '';
    }

    /**
     * Récupère les UTM depuis l'URL
     */
    function getUTMFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            "contact-ads-gclid": urlParams.get("gclid") || "",
            "contact-ads-camp": urlParams.get("utm_campaign") || "",
            "contact-ads-adgroup": urlParams.get("utm_adgroup") || "",
            "contact-ads-utm-term": urlParams.get("utm_term") || "",
            "contact-ads-utm-campaign": urlParams.get("utm_campaign") || "",
            "contact-ads-utm-source": urlParams.get("utm_source") || ""
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
                    "contact-ads-gclid": parsedData.data["gclid"] || "",
                    "contact-ads-utm-source": parsedData.data["utm_source"] || "",
                    "contact-ads-utm-campaign": parsedData.data["utm_campaign"] || "",
                    "contact-ads-utm-term": parsedData.data["utm_term"] || ""
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
                    return parsedData.data["document-referrer"];
                }
            }
        } catch (e) {}

        let referrer = document.referrer;
        if (!referrer) return "";

        try {
            let hostname = new URL(referrer).hostname;
            let parts = hostname.split(".");
            return parts.length > 2 ? parts[parts.length - 2] + "." + parts[parts.length - 1] : hostname;
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
            const field = form.querySelector(`input[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }

    /**
     * Applique les valeurs au formulaire
     */
    function applyDataToForm() {
        const browserInfo = getBrowserInfo();
        const utmFromURL = getUTMFromURL();
        const utmFromStorage = getUTMFromStorage();
        const referrer = { "contact-document-referrer": getReferrer() };

        const combinedData = { ...browserInfo, ...utmFromURL, ...utmFromStorage, ...referrer };

        fillHiddenFields("wf-form-contact", combinedData);
    }

    applyDataToForm();
});
