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

    let wishlist;
    try {
        wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (error) {
        console.error("Erreur lors du chargement de la wishlist :", error);
        wishlist = [];
    }

    // Fonction pour sauvegarder la wishlist dans le localStorage
    function syncWishlist() {
        console.log("Synchronizing wishlist:", wishlist);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        notifyWishlistChange();
    }

    // Fonction pour notifier les autres scripts que la wishlist a été modifiée
    function notifyWishlistChange() {
        const event = new CustomEvent("wishlist:updated", {
            detail: { wishlist },
        });
        document.dispatchEvent(event);
    }

    // Fonction pour mettre à jour tous les compteurs
    function updateCounters() {
        const counters = document.querySelectorAll('[wl="counter"]');
        counters.forEach(counter => {
            counter.textContent = wishlist.length;
        });
    }

    // Fonction pour mettre à jour l'étiquette du compteur
    function updateCounterLabel() {
        const count = wishlist.length;
        if (counterLabel) {
            counterLabel.textContent = isEnglish
                ? count === 1
                    ? 'product in your wishlist'
                    : 'products in your wishlist'
                : count === 1
                    ? 'produit dans votre wishlist'
                    : 'produits dans votre wishlist';
        }
    }

    // Fonction pour mettre à jour la visibilité de la section wishlist
    function updateWishlistVisibility() {
        wishlistSection.style.display = wishlist.length === 0 ? "none" : "block";
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
            syncWishlist();
            updateCounters();
            updateTextareas();
            updateCounterLabel();
        }
    }

    // Fonction pour gérer l'ajustement avec accélération
    function setupQuantityAdjustment(button, action, quantityField, productId, minQuantity, maxQuantity) {
        let interval;
        let speed = 300; // Vitesse initiale
        const acceleration = 30; // Réduction progressive
        const minSpeed = 30; // Vitesse minimale

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

    // Fonction pour rendre la wishlist dans la page
    function renderWishlist() {
        console.log("Rendering wishlist with items:", wishlist);

        if (!wishlistContainer || !cardTemplate) {
            console.error("Conteneur wishlist ou template introuvable !");
            return;
        }

        wishlistContainer.innerHTML = "";

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `<p>Aucun produit dans la wishlist.</p>`;
            return;
        }

        wishlist.forEach(product => {
            const card = cardTemplate.content.cloneNode(true);

            const imageElement = card.querySelector('[wl-card="image"]');
            const categoryElement = card.querySelector('[wl-card="category"]');
            const nameLinkElement = card.querySelector('[wl-card="name-link"]');
            const quantityField = card.querySelector('[quantity="value"]');
            const removeButton = card.querySelector('[wl-card="remove"]');

            if (!imageElement || !categoryElement || !nameLinkElement || !quantityField || !removeButton) {
                console.error("Problème avec le template : certains éléments sont manquants.");
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
                updateWishlistVisibility();
                updateCounters();
                updateTextareas();
                updateCounterLabel();
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

    renderWishlist();
    updateCounters();
    updateWishlistVisibility();
    updateTextareas();
    updateCounterLabel();

    // Gérer les soumissions des formulaires
    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (form.querySelector('input[data-name="brief-pro-civilite"]') || form.querySelector('input[data-name="brief-private-civilite"]')) {
            event.preventDefault();

            const selectedRadio = form.querySelector('input[type="radio"]:checked');
            const civilite = selectedRadio ? selectedRadio.value : '';

            const nomInput = form.querySelector('input[name="brief-pro-nom"], input[name="brief-private-nom"]');
            const nom = nomInput ? nomInput.value : '';

            if (civilite && nom) {
                localStorage.setItem('formCivilite', civilite);
                localStorage.setItem('formNom', nom);
            }
        }
    });
});
