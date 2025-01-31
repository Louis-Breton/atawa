(function() {
  const WISHLIST_KEY = "wishlist";

  function getWishlistItems() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      console.error("Erreur de parsing de la wishlist :", e);
      return [];
    }
  }

  function detectWishlistChange(event) {
    if (event.key !== WISHLIST_KEY) return; // Ignorer les autres modifications du localStorage

    const oldWishlist = getWishlistItems();
    const newWishlist = event.newValue ? JSON.parse(event.newValue) : [];

    if (!Array.isArray(newWishlist)) return; // Vérification de type

    // Comparaison rapide
    const oldIds = new Set(oldWishlist.map(item => item.id));
    const newIds = new Set(newWishlist.map(item => item.id));

    const addedItems = newWishlist.filter(item => !oldIds.has(item.id));
    const removedItems = oldWishlist.filter(item => !newIds.has(item.id));

    if (addedItems.length > 0) {
      sendWishlistEvent("add_to_wishlist", addedItems);
    }

    if (removedItems.length > 0) {
      sendWishlistEvent("remove_from_wishlist", removedItems);
    }
  }

  function sendWishlistEvent(action, items) {
    if (items.length === 0) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category
      }))
    });

    console.log(`Produits ${action === "add_to_wishlist" ? "ajoutés" : "retirés"} de la wishlist :`, items);
  }

  // Détection des changements de wishlist en direct
  window.addEventListener("storage", detectWishlistChange);
})();
