document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist"; // Clé pour accéder à la wishlist dans le localStorage
    const wishlistContainer = document.querySelector('[wl-page="list"]'); // Conteneur pour afficher les produits
    const cardTemplate = document.querySelector("#wishlist-card-template"); // Template HTML
    const wishlistSection = document.querySelector('.wishlist_section'); // Section wishlist
    const proTextarea = document.querySelector('#brief-pro-wishlist'); // Champ textarea pro
    const privateTextarea = document.querySelector('#brief-private-wishlist'); // Champ textarea privé
    const URL_PREFIX = "https://www.atawa.com/catalogue"; // Préfixe pour les URLs
    const counterLabel = document.querySelector('[wl-page="counter-label"]'); // Étiquette du compteur
    const userLang = navigator.language || navigator.userLanguage; // Langue du navigateur
    const isEnglish = userLang.startsWith('en'); // Vérifier si la langue est l'anglais

    if (!wishlistContainer || !cardTemplate) {
        console.warn("Conteneur wishlist ou template introuvable sur cette page.");
        return;
    }

    // Charger la wishlist depuis le localStorage
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

    // Fonction pour sauvegarder la wishlist dans le localStorage
    function syncWishlist() {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }

    // Fonction pour mettre à jour l'étiquette du compteur
    function updateCounterLabel() {
        const count = wishlist.length;
        if (counterLabel) {
            if (isEnglish) {
                counterLabel.textContent = count === 1 
                    ? 'product in your wishlist' 
                    : 'products in your wishlist';
            } else {
                counterLabel.textContent = count === 1 
                    ? 'produit dans votre wishlist' 
                    : 'produits dans votre wishlist';
            }
        }
    }

    // Fonction pour mettre à jour la visibilité de la section wishlist
    function updateWishlistVisibility() {
        if (wishlist.length === 0) {
            wishlistSection.style.display = "none";
        } else {
            wishlistSection.style.display = "block";
        }
    }

    // Fonction pour remplir les textareas avec le contenu de la wishlist
    function updateTextareas() {
        let summary = `${wishlist.length} produits enregistrés dans la wishlist :\n\n`;

        wishlist.forEach(product => {
            summary += `(${product.category})\n`; // Catégorie entre parenthèses
            summary += `[${product.quantity || 1}] ${product.name}\n`; // Quantité et nom
            summary += `${URL_PREFIX}${product.link}\n`; // URL complète
            summary += "—\n";
        });

        summary = summary.trimEnd().replace(/—$/, ""); // Nettoyage final

        if (proTextarea) proTextarea.value = summary;
        if (privateTextarea) privateTextarea.value = summary;
    }

    // Fonction pour mettre à jour la quantité d'un produit
    function updateProductQuantity(productId, newQuantity) {
        const product = wishlist.find(product => product.id === productId);
        if (product) {
            product.quantity = newQuantity;
            syncWishlist(); // Synchronise avec le localStorage
            updateTextareas(); // Met à jour les textareas
            updateCounterLabel(); // Met à jour l'étiquette du compteur
        }
    }

    // Fonction pour gérer l'ajustement avec accélération
    function setupQuantityAdjustment(button, action, quantityField, productId, minQuantity, maxQuantity) {
        let interval;
        let speed = 300; // Vitesse initiale
        const acceleration = 30; // Réduction progressive
        const minSpeed = 30; // Vitesse minimale

        // Fonction pour ajuster la quantité
        const adjustQuantity = () => {
            let currentQuantity = parseInt(quantityField.textContent, 10);
            if (action === "decrease" && currentQuantity > minQuantity) {
                currentQuantity--;
            } else if (action === "increase" && currentQuantity < maxQuantity) {
                currentQuantity++;
            }
            quantityField.textContent = currentQuantity;
            updateProductQuantity(productId, currentQuantity); // Met à jour le localStorage
        };

        // Fonction pour démarrer l'ajustement progressif
        const startAdjusting = () => {
            adjustQuantity();
            speed = Math.max(speed - acceleration, minSpeed); // Réduit progressivement la vitesse
            interval = setTimeout(startAdjusting, speed); // Relance
        };

        // Gestion de l'événement mousedown/touchstart
        const startEvent = (e) => {
            e.preventDefault(); // Empêche les comportements par défaut (notamment le scroll sur mobile)
            speed = 300; // Réinitialise la vitesse
            adjustQuantity(); // Ajuste une première fois
            interval = setTimeout(startAdjusting, speed);
        };

        // Gestion de l'arrêt du cycle (mouseup, touchend, mouseleave)
        const stopEvent = () => {
            clearTimeout(interval);
        };

        button.addEventListener("mousedown", startEvent);
        button.addEventListener("touchstart", startEvent);
        document.addEventListener("mouseup", stopEvent);
        document.addEventListener("touchend", stopEvent);
        document.addEventListener("mouseleave", stopEvent);
    }

    // Fonction pour rendre la wishlist dans la page
    function renderWishlist() {
        // Vider le conteneur existant
        wishlistContainer.innerHTML = "";

        // Générer une carte pour chaque produit
        wishlist.forEach(product => {
            // Cloner le template
            const card = cardTemplate.content.cloneNode(true);

            // Mettre à jour les données dans la carte
            card.querySelector('[wl-card="image"]').src = product.image;
            card.querySelector('[wl-card="image"]').alt = product.name;
            card.querySelector('[wl-card="category"]').textContent = product.category;
            card.querySelector('[wl-card="name-link"]').textContent = product.name;

            // Injecter la quantité initiale
            const quantityField = card.querySelector('[quantity="value"]');
            quantityField.textContent = product.quantity || 1;

            // Ajouter les événements
            const removeButton = card.querySelector('[wl-card="remove"]');
            removeButton.addEventListener("click", () => {
                wishlist = wishlist.filter(p => p.id !== product.id);
                syncWishlist();
                renderWishlist();
                updateWishlistVisibility();
                updateTextareas();
                updateCounterLabel(); // Met à jour l'étiquette
            });

            // Gestion des boutons de quantité
            const decreaseButton = card.querySelector('[quantity="decrease"]');
            const increaseButton = card.querySelector('[quantity="increase"]');
            const inputWrapper = quantityField.closest('[quantity="input"]');
            const minQuantity = parseInt(inputWrapper.dataset.min, 10) || 1;
            const maxQuantity = parseInt(inputWrapper.dataset.max, 10) || 999;

            setupQuantityAdjustment(decreaseButton, "decrease", quantityField, product.id, minQuantity, maxQuantity);
            setupQuantityAdjustment(increaseButton, "increase", quantityField, product.id, minQuantity, maxQuantity);

            // Ajouter la carte au conteneur
            wishlistContainer.appendChild(card);
        });

        // Si la wishlist est vide, afficher un message
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `<p>Aucun produit dans la wishlist.</p>`;
        }

        // Mettre à jour la visibilité de la section, les champs textarea, et l'étiquette
        updateWishlistVisibility();
        updateTextareas();
        updateCounterLabel();
    }

    // Initialiser l'affichage de la wishlist
    renderWishlist();
});
