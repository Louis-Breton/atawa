document.addEventListener("DOMContentLoaded", function () {
    function getBrowserInfo() {
        return {
            "browser-language": navigator.language || navigator.userLanguage,
            "device-type": /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            "screen-resolution": `${window.screen.width}x${window.screen.height}`,
            "language-region": Intl.DateTimeFormat().resolvedOptions().locale || navigator.language
        };
    }

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

    function applyDataToForms() {
        const browserInfo = getBrowserInfo();
        const utmFromURL = getUTMFromURL();
        const utmFromStorage = getUTMFromStorage();

        const combinedData = { ...browserInfo, ...utmFromURL, ...utmFromStorage };

        fillHiddenFields("wf-form-brief-pro", combinedData);
        fillHiddenFields("wf-form-brief-private", combinedData);
    }

    applyDataToForms();
});
