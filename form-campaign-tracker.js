
document.addEventListener("DOMContentLoaded", function () {
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            gclid: params.get("gclid") || "",
            utm_source: params.get("utm_source") || "",
            utm_medium: params.get("utm_medium") || "",
            utm_campaign: params.get("utm_campaign") || "",
            utm_term: params.get("utm_term") || "",
            utm_adgroup: params.get("utm_adgroup") || "",
            utm_camp: params.get("utm_camp") || ""
        };
    }

    function getLocalStorageParams() {
        try {
            const utmTracking = JSON.parse(localStorage.getItem("utm_tracking")) || {};
            return {
                gclid: utmTracking.gclid || "",
                utm_source: utmTracking.data?.utm_source || "",
                utm_medium: utmTracking.data?.utm_medium || "",
                utm_campaign: utmTracking.data?.utm_campaign || "",
                utm_term: utmTracking.data?.utm_term || "",
                utm_adgroup: utmTracking.data?.utm_adgroup || "",
                utm_camp: utmTracking.data?.utm_camp || ""
            };
        } catch (e) {
            return {};
        }
    }

    function setHiddenField(id, value) {
        const field = document.getElementById(id);
        if (field) field.value = value;
    }

    function detectDeviceType() {
        return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop";
    }

    function getScreenResolution() {
        return `${window.screen.width}x${window.screen.height}`;
    }

    function getBrowserLanguage() {
        return navigator.language || navigator.userLanguage;
    }

    function getLanguageRegion() {
        return getBrowserLanguage().split("-")[0];
    }

    function populateFields(prefix) {
        const urlParams = getUrlParams();
        const storageParams = getLocalStorageParams();

        setHiddenField(`${prefix}-browser-language`, getBrowserLanguage());
        setHiddenField(`${prefix}-device-type`, detectDeviceType());
        setHiddenField(`${prefix}-screen-resolution`, getScreenResolution());
        setHiddenField(`${prefix}-language-region`, getLanguageRegion());

        setHiddenField(`${prefix}-ads-gclid`, urlParams.gclid || storageParams.gclid);
        setHiddenField(`${prefix}-ads-utm-source`, urlParams.utm_source || storageParams.utm_source);
        setHiddenField(`${prefix}-ads-utm-medium`, urlParams.utm_medium || storageParams.utm_medium);
        setHiddenField(`${prefix}-ads-utm-campaign`, urlParams.utm_campaign || storageParams.utm_campaign);
        setHiddenField(`${prefix}-ads-utm-term`, urlParams.utm_term || storageParams.utm_term);
        setHiddenField(`${prefix}-ads-adgroup`, urlParams.utm_adgroup || storageParams.utm_adgroup);
        setHiddenField(`${prefix}-ads-utm-camp`, urlParams.utm_camp || storageParams.utm_camp);
    }

    // Remplit les champs pour "brief-pro" et "brief-private"
    populateFields("brief-pro");
    populateFields("brief-private");
});
