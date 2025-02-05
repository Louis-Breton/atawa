document.addEventListener("DOMContentLoaded", function () {
    /**
     * Récupère les informations du navigateur (langue, type d'appareil, résolution d'écran)
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
     * Extrait les paramètres UTM depuis l'URL
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
     * Détermine la source du trafic à partir de document.referrer
     */
    function getReferrerSource() {
        let referrer = document.referrer;
        let source = "Direct"; // Par défaut si aucun referrer

        if (referrer.includes("google.")) {
            source = "Google Organic";
        } else if (referrer.includes("facebook.")) {
            source = "Facebook";
        } else if (referrer !== "") {
            try {
                source = "Referral (" + new URL(referrer).hostname + ")";
            } catch (e) {
                source = "Unknown";
            }
        }
        return source;
    }

    /**
     * Récupère les UTM et la source du trafic depuis localStorage
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
                    "ads-utm-term": parsedData.data["utm_term"] || "",
                    "document-referrer": parsedData.data["document-referrer"] || getReferrerSource()
                };
            }
        } catch (e) {}
        return { "document-referrer": getReferrerSource() };
    }

    /**
     * Remplit les champs cachés des formulaires avec les données collectées
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

        // Ajoute la valeur du referer dans les champs dédiés
        const referrerField = form.querySelector(`input[name="brief-${formId.split('-').pop()}-document-referrer"]`);
        if (referrerField) {
            referrerField.value = data["document-referrer"];
        }
    }

    /**
     * Applique les données aux formulaires en combinant toutes les sources
     */
    function applyDataToForms() {
        const browserInfo = getBrowserInfo();
        const utmFromURL = getUTMFromURL();
        const utmFromStorage = getUTMFromStorage();

        const combinedData = { ...browserInfo, ...utmFromURL, ...utmFromStorage };

        fillHiddenFields("wf-form-brief-pro", combinedData);
        fillHiddenFields("wf-form-brief-private", combinedData);
    }

    // Exécution du script
    applyDataToForms();
});
