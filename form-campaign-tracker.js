<script>
document.addEventListener("DOMContentLoaded", function () {
  if (window._campaignTrackerRan) return;
  window._campaignTrackerRan = true;

  function getBrowserInfo() {
    return {
      "browser-language": navigator.language || navigator.userLanguage,
      "device-type": /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      "screen-resolution": `${window.screen.width}x${window.screen.height}`,
      "language-region": Intl.DateTimeFormat().resolvedOptions().locale || navigator.language
    };
  }

  function getUTMFromURL() {
    const p = new URLSearchParams(window.location.search);
    return {
      "ads-gclid": p.get("gclid") || "",
      "ads-camp": p.get("utm_campaign") || "",
      "ads-adgroup": p.get("utm_adgroup") || "",
      "ads-utm-term": p.get("utm_term") || "",
      "ads-utm-campaign": p.get("utm_campaign") || "",
      "ads-utm-source": p.get("utm_source") || ""
    };
  }

  function getUTMFromStorage() {
    try {
      const stored = JSON.parse(localStorage.getItem("utm_tracking"));
      if (!stored?.data) return {};
      return {
        "ads-gclid": stored.data["gclid"] || "",
        "ads-utm-source": stored.data["utm_source"] || "",
        "ads-utm-campaign": stored.data["utm_campaign"] || "",
        "ads-utm-term": stored.data["utm_term"] || ""
      };
    } catch {
      return {};
    }
  }

  function getReferrer() {
    try {
      const stored = JSON.parse(localStorage.getItem("utm_tracking"));
      if (stored?.data?.["document-referrer"]) {
        return stored.data["document-referrer"];
      }
    } catch {}
    const ref = document.referrer;
    if (!ref) return "Direct";
    try {
      const host = new URL(ref).hostname.split(".");
      return host.slice(-2).join(".");
    } catch {
      return "Direct";
    }
  }

  function fillHiddenFields(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;

    Object.entries(data).forEach(([key, value]) => {
      const input = form.querySelector(`[name="brief-${formId.split('-').pop()}-${key}"]`);
      if (input && value !== undefined) input.value = value;
    });
  }

  function applyDataToForms() {
    const data = {
      ...getBrowserInfo(),
      ...getUTMFromURL(),
      ...getUTMFromStorage(),
      "document-referrer": getReferrer()
    };

    document.querySelectorAll("form[form-prefix]").forEach(form => {
      const formId = form.id;
      fillHiddenFields(formId, data);
    });
  }

  applyDataToForms();
});
</script>
