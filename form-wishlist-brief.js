document.addEventListener("DOMContentLoaded", function () {
  // === Configuration Générale ===
  const WISHLIST_KEY = "wishlist";
  const wishlistContainer = document.querySelector('[wl-page="list"]');
  const cardTemplate = document.querySelector("#wishlist-card-template");
  const wishlistSection = document.querySelector('[form-element="wishlist"]');
  const counterLabel = document.querySelector('[wl-page="counter-label"]');
  const counterElement = document.querySelector('[wl="counter"]');
  const URL_PREFIX = "https://www.atawa.com";
  const userLang = navigator.language || navigator.userLanguage;
  const isEnglish = userLang.startsWith('en');

  // === Initialisation de la Wishlist ===
  let wishlist;
  try {
    wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (error) {
    wishlist = [];
  }

  // === Fonction pour synchroniser la wishlist avec le localStorage ===
  function syncWishlist() {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    notifyWishlistChange();
  }

  // === Fonction pour notifier les autres scripts d'une mise à jour de la wishlist ===
  function notifyWishlistChange() {
    const event = new CustomEvent("wishlist:updated", {
      detail: { wishlist },
    });
    document.dispatchEvent(event);
  }

  // === Fonction pour mettre à jour les compteurs de la wishlist ===
  function updateCounters() {
    const counters = document.querySelectorAll('[wl="counter"]');
    counters.forEach(counter => {
      counter.textContent = wishlist.length;
    });
    updateCounterLabel();
  }

  function updateCounterLabel() {
    const count = wishlist.length;
    if (counterElement && counterLabel) {
      const labelText = isEnglish
        ? count === 1 ? 'product added:' : 'products added:'
        : count === 1 ? 'produit ajouté :' : 'produits ajoutés :';
      counterLabel.textContent = labelText;
    }
  }

  // === Fonction pour gérer une wishlist vide ===
  function handleEmptyWishlist() {
    if (wishlistSection) {
      wishlistSection.style.display = wishlist.length === 0 ? "none" : "block";
    }
  }

  // === Fonction universelle pour mettre à jour les champs wishlist-category et wishlist-product ===
  function updateWishlistFields() {
    const categories = Array.from(new Set(wishlist.map(product => product.category))).join(", ");
    const products = wishlist.map(product => `${product.quantity || 1} ${product.name}`).join(", ");

    const categoryFields = document.querySelectorAll('[wishlist-field="category"]');
    const productFields = document.querySelectorAll('[wishlist-field="product"]');

    categoryFields.forEach(field => {
      field.value = categories;
    });

    productFields.forEach(field => {
      field.value = products;
    });
  }

  // === Fonction pour mettre à jour la quantité d'un produit ===
  function updateProductQuantity(productId, newQuantity) {
    const product = wishlist.find(product => product.id === productId);
    if (product) {
      product.quantity = newQuantity;
      syncWishlist();
      updateCounters();
      updateWishlistFields();
      handleEmptyWishlist();
    }
  }

  function setupQuantityAdjustment(button, action, quantityField, productId, minQuantity, maxQuantity) {
    let interval;
    let speed = 300;
    const acceleration = 30;
    const minSpeed = 30;

    const adjustQuantity = () => {
      let currentQuantity = parseInt(quantityField.textContent, 10);
      if (action === "decrease" && currentQuantity > minQuantity) {
        currentQuantity--;
      } else if (action === "increase" && currentQuantity < maxQuantity) {
        currentQuantity++;
      }
      quantityField.textContent = currentQuantity;
      updateProductQuantity(productId, currentQuantity);
    };

    const startAdjusting = () => {
      adjustQuantity();
      speed = Math.max(speed - acceleration, minSpeed);
      interval = setTimeout(startAdjusting, speed);
    };

    const startEvent = (e) => {
      e.preventDefault();
      speed = 300;
      adjustQuantity();
      interval = setTimeout(startAdjusting, speed);
    };

    const stopEvent = () => clearTimeout(interval);

    button.addEventListener("mousedown", startEvent);
    button.addEventListener("touchstart", startEvent);
    document.addEventListener("mouseup", stopEvent);
    document.addEventListener("touchend", stopEvent);
    document.addEventListener("mouseleave", stopEvent);
  }

  // === Fonction pour afficher la wishlist ===
  function renderWishlist() {
    if (!wishlistContainer || !cardTemplate) return;

    wishlistContainer.innerHTML = "";

    wishlist.forEach(product => {
      const card = cardTemplate.content.cloneNode(true);

      const imageElement = card.querySelector('[wl-card="image"]');
      const categoryElement = card.querySelector('[wl-card="category"]');
      const nameLinkElement = card.querySelector('[wl-card="name-link"]');
      const quantityField = card.querySelector('[quantity="value"]');
      const removeButton = card.querySelector('[wl-card="remove"]');

      if (!imageElement || !categoryElement || !nameLinkElement || !quantityField || !removeButton) return;

      imageElement.src = product.image;
      imageElement.alt = product.name;
      categoryElement.textContent = product.category;
      nameLinkElement.textContent = product.name;
      quantityField.textContent = product.quantity || 1;

      removeButton.addEventListener("click", () => {
        wishlist = wishlist.filter(p => p.id !== product.id);
        syncWishlist();
        renderWishlist();
        updateCounters();
        updateWishlistFields();
        handleEmptyWishlist();
      });

      const decreaseButton = card.querySelector('[quantity="decrease"]');
      const increaseButton = card.querySelector('[quantity="increase"]');
      const inputWrapper = quantityField.closest('[quantity="input"]');
      const minQuantity = parseInt(inputWrapper.dataset.min, 10) || 1;
      const maxQuantity = parseInt(inputWrapper.dataset.max, 10) || 999;

      setupQuantityAdjustment(decreaseButton, "decrease", quantityField, product.id, minQuantity, maxQuantity);
      setupQuantityAdjustment(increaseButton, "increase", quantityField, product.id, minQuantity, maxQuantity);

      wishlistContainer.appendChild(card);
    });
  }

  // === Initialisation ===
  renderWishlist();
  updateCounters();
  updateWishlistFields();
  handleEmptyWishlist();
});
