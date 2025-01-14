document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist";
    const wishlistContainer = document.querySelector('[wl-page="list"]');
    const cardTemplate = document.querySelector("#wishlist-card-template");
    const wishlistSection = document.querySelector('.wishlist_section');
    const proCategoryField = document.querySelector('#brief-pro-wishlist-category');
    const proProductField = document.querySelector('#brief-pro-wishlist-product');
    const privateCategoryField = document.querySelector('#brief-private-wishlist-category');
    const privateProductField = document.querySelector('#brief-private-wishlist-product');
    const URL_PREFIX = "https://www.atawa.com";
    const counterLabel = document.querySelector('[wl-page="counter-label"]');
    const userLang = navigator.language || navigator.userLanguage;
    const isEnglish = userLang.startsWith('en');

    let wishlist;
    try {
        wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (error) {
        console.error("Erreur lors du chargement de la wishlist :", error);
        wishlist = [];
    }

    function syncWishlist() {
        console.log("Synchronizing wishlist:", wishlist);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        notifyWishlistChange();
    }

    function notifyWishlistChange() {
        const event = new CustomEvent("wishlist:updated", {
            detail: { wishlist },
        });
        document.dispatchEvent(event);
    }

    function updateCounters() {
        const counters = document.querySelectorAll('[wl="counter"]');
        counters.forEach(counter => {
            counter.textContent = wishlist.length;
        });
    }

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

    function updateWishlistVisibility() {
        wishlistSection.style.display = wishlist.length === 0 ? "none" : "block";
    }

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

        console.log("Champs wishlist mis à jour :", {
            categories,
            products
        });
    }

    function updateTextareas() {
        let summary = `${wishlist.length} produits enregistrés dans la wishlist :\n\n`;
        wishlist.forEach(product => {
            summary += `(${product.category})\n`;
            summary += `[${product.quantity || 1}] ${product.name}\n`;
            summary += `${URL_PREFIX}${product.link}\n`;
            summary += "—\n";
        });
        summary = summary.trimEnd().replace(/—$/, "");
    }

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
                updateWishlistFields();
                updateCounterLabel();
            });

            wishlistContainer.appendChild(card);
        });
    }

    renderWishlist();
    updateCounters();
    updateWishlistVisibility();
    updateWishlistFields();
    updateCounterLabel();
});
