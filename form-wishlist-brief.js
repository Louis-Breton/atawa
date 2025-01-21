document.addEventListener("DOMContentLoaded", function () {
    // === Configuration Générale ===
    const WISHLIST_KEY = "wishlist"; // Clé pour accéder à la wishlist dans le localStorage
    const wishlistContainer = document.querySelector('[wl-page="list"]'); // Conteneur pour afficher les produits
    const cardTemplate = document.querySelector("#wishlist-card-template"); // Template HTML pour les cartes produit
    const wishlistSection = document.querySelector('[form-element="wishlist"]'); // Section contenant la wishlist
    const proCategoryField = document.querySelector('#brief-pro-wishlist-category'); // Champ wishlist catégorie (pro)
    const proProductField = document.querySelector('#brief-pro-wishlist-product'); // Champ wishlist produit (pro)
    const privateCategoryField = document.querySelector('#brief-private-wishlist-category'); // Champ wishlist catégorie (privé)
    const privateProductField = document.querySelector('#brief-private-wishlist-product'); // Champ wishlist produit (privé)
    const URL_PREFIX = "https://www.atawa.com"; // Préfixe utilisé pour générer les URLs des produits
    const counterLabel = document.querySelector('[wl-page="counter-label"]'); // Étiquette affichant le compteur
    const counterElement = document.querySelector('[wl="counter"]'); // Élément affichant le nombre d'éléments
    const userLang = navigator.language || navigator.userLanguage; // Langue du navigateur
    const isEnglish = userLang.startsWith('en'); // Détection si la langue est anglaise

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
        updateCounterLabel(); // Mise à jour dynamique de l'étiquette
    }

    // === Fonction pour mettre à jour l'étiquette de compteur ===
    function updateCounterLabel() {
        const count = wishlist.length;
        if (counterElement && counterLabel) {
            const labelText = isEnglish
                ? count === 1
                    ? 'product added:'
                    : 'products added:'
                : count === 1
                    ? 'produit ajouté :'
                    : 'produits ajoutés :';
            counterLabel.textContent = labelText;
        }
    }

    // === Fonction pour gérer une wishlist vide ===
    function handleEmptyWishlist() {
        if (wishlist.length === 0 && wishlistSection) {
            wishlistSection.style.display = "none"; // Cacher la section wishlist si elle est vide
        } else if (wishlistSection) {
            wishlistSection.style.display = "block"; // Afficher si des éléments sont présents
        }
    }

    // === Fonction pour remplir les champs wishlist-category et wishlist-product ===
    function updateWishlistFields() {
        // Catégories dédupliquées
        const categories = Array.from(new Set(wishlist.map(product => product.category))).join(", ");

        // Produits formatés avec quantité et nom
        const products = wishlist.map(product => `${product.quantity || 1} ${product.name}`).join(", ");

        // Mise à jour des champs pour le formulaire privé
        if (privateCategoryField) privateCategoryField.value = categories;
        if (privateProductField) privateProductField.value = products;

        // Mise à jour des champs pour le formulaire professionnel
        if (proCategoryField) proCategoryField.value = categories;
        if (proProductField) proProductField.value = products;
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

    // === Fonction pour gérer les ajustements de quantité avec accélération ===
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
        if (!wishlistContainer || !cardTemplate) {
            return;
        }

        wishlistContainer.innerHTML = "";

        wishlist.forEach(product => {
            const card = cardTemplate.content.cloneNode(true);

            const imageElement = card.querySelector('[wl-card="image"]');
            const categoryElement = card.querySelector('[wl-card="category"]');
            const nameLinkElement = card.querySelector('[wl-card="name-link"]');
            const quantityField = card.querySelector('[quantity="value"]');
            const removeButton = card.querySelector('[wl-card="remove"]');

            if (!imageElement || !categoryElement || !nameLinkElement || !quantityField || !removeButton) {
                return;
            }

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
