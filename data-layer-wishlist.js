// Fonction de gestion des boutons wishlist
function handleWishlistButtons() {
  const wishlistButtons = document.querySelectorAll('[wl-event="add_to_wishlist"]');

  wishlistButtons.forEach(button => {
    // Empêche l'ajout multiple de listeners
    if (button.dataset.wishlistHandled) return;

    button.dataset.wishlistHandled = true; // Marque ce bouton comme géré

    button.addEventListener('click', function () {
      const product = this.closest('[wl="product"]');
      const itemId = product.getAttribute('wl-id');
      const itemName = product.querySelector('[wl="name"]').textContent.trim();
      const itemCategory = product.querySelector('[wl="category"]').textContent.trim();
      const isActive = this.classList.contains('is-active');
      const eventName = isActive ? 'remove_from_wishlist' : 'add_to_wishlist';

      window.dataLayer.push({
        event: eventName,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            item_category: itemCategory,
          }
        ]
      });

      console.log(`Produit ${isActive ? 'retiré de' : 'ajouté à'} la wishlist :`, {
        item_id: itemId,
        item_name: itemName,
        item_category: itemCategory,
      });
    });
  });
}

// Fonction pour observer les ajouts au DOM
function observeLazyLoadForWishlist() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches &&
          node.matches('[wl="product"]')
        ) {
          handleWishlistButtons(); // Réexécute pour le nouveau produit
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Exécuter les fonctions
document.addEventListener('DOMContentLoaded', () => {
  handleWishlistButtons(); // Gérer les produits déjà présents
  observeLazyLoadForWishlist(); // Observer les produits ajoutés dynamiquement
});
