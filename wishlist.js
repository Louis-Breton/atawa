document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist";
    const drawerBody = document.querySelector('.drawer_body[wl="list"]');
    const emptyState = document.querySelector('[wl="empty"]');
    const cta = document.querySelector('[wl="cta"]');
    const label = document.querySelector('[wl="counter-label"]');
    const counterWrap = document.querySelector('[wl="counter-wrap"]');
    const cmsList = document.querySelector('[fs-cmsload-element="list"]'); // Conteneur CMS principal

    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

    // Synchronise les données locales avec le localStorage
    function syncLocalStorage() {
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        } catch (error) {
            console.error("Erreur lors de l'accès au localStorage:", error);
        }
    }

    // Met à jour le compteur wishlist
    function updateCounter() {
        const counters = document.querySelectorAll('[wl="counter"]');
        counters.forEach(counter => (counter.textContent = wishlist.length));
        updateLabel();
        updateCounterWrap();
    }

    // Affiche ou cache le counter-wrap
    function updateCounterWrap() {
        if (counterWrap) {
            counterWrap.style.display = wishlist.length === 0 ? "none" : "block";
        }
    }

    // Met à jour le label à côté du compteur
    function updateLabel() {
        const lang = navigator.language || navigator.userLanguage; // Langue du navigateur
        const isFrench = lang.startsWith('fr');
        const count = wishlist.length;

        const labelText = isFrench
            ? count <= 1
                ? "produit ajouté :"
                : "produits ajoutés :"
            : count <= 1
            ? "product:"
            : "products:";

        if (label) label.textContent = ` ${labelText}`;
    }

    // Met à jour l'état vide / CTA
    function updateEmptyState() {
        if (wishlist.length === 0) {
            emptyState.style.display = "flex"; // Utiliser flex au lieu de block
            cta.style.display = "none";
        } else {
            emptyState.style.display = "none";
            cta.style.display = "block";
        }
    }

    // Synchronise l'état des boutons wishlist sur la page principale
    function updateButtonState() {
        const buttons = document.querySelectorAll('[wl="button"]');
        buttons.forEach(button => {
            const productId = button.getAttribute("wl-id");
            const isInWishlist = wishlist.some(item => item.id === productId);

            button.classList.toggle("is-active", isInWishlist);
            button.setAttribute(
                "data-tooltip",
                isInWishlist ? "Retirer de ma wishlist" : "Ajouter à ma wishlist"
            );
            button.setAttribute("aria-pressed", isInWishlist);
        });
    }

    // Ajoute ou retire un produit de la wishlist
    function toggleWishlist(button) {
        const productWrapper = button.closest('[wl="product"]');
        const productId = button.getAttribute("wl-id");

        const product = {
            id: productId,
            name: productWrapper.querySelector('[wl="name"]').textContent,
            link: productWrapper.querySelector('[wl="link"]').getAttribute("href"),
            image: productWrapper.querySelector('[wl="image"]').getAttribute("src"),
            category: productWrapper.querySelector('[wl="category"]').textContent
        };

        const index = wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
            wishlist.splice(index, 1); // Retirer
        } else {
            wishlist.push(product); // Ajouter
        }

        syncLocalStorage();
        updateButtonState();
        updateEmptyState();
        renderWishlist();
        updateCounter();
    }

    // Supprime un produit par ID
    function removeFromWishlist(productId) {
        const index = wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            syncLocalStorage();
            updateButtonState(); // Synchronise l'état des boutons
            renderWishlist(); // Met à jour le drawer
            updateCounter();
        }
    }

    // Rend la wishlist dans le drawer
    function renderWishlist() {
        drawerBody.innerHTML = ""; // Nettoyer la liste existante

        wishlist.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("wishlist_card");
            card.setAttribute("wl-card", "card");

            const cardImage = document.createElement("div");
            cardImage.classList.add("wishlist_card-image");
            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.name;
            img.classList.add("image-cover");
            img.setAttribute("wl-card", "image");
            cardImage.appendChild(img);

            const cardContent = document.createElement("div");
            cardContent.classList.add("wishlist_card-content");

            const category = document.createElement("p");
            category.classList.add("fs-9", "text-neutral_400", "text-style-ellipsis");
            category.setAttribute("wl-card", "category");
            category.textContent = product.category;

            const link = document.createElement("a");
            link.href = product.link;
            link.classList.add("text-secondary_950-base", "text-style-ellipsis");
            link.setAttribute("wl-card", "name-link");
            link.textContent = product.name;

            const removeButton = document.createElement("div");
            removeButton.classList.add("wishlist_remove-product", "w-embed");
            removeButton.setAttribute("wl-card", "remove");
            removeButton.innerHTML = `
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" role="img" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5L12 12M12 12L18.5 18.5M12 12L5.5 18.5M12 12L18.5 5.5" 
                        stroke="currentColor" stroke-linecap="round" stroke-width="1.5" stroke-linejoin="round"></path>
                </svg>
            `;

            // Supprimer le produit au clic
            removeButton.addEventListener("click", () => removeFromWishlist(product.id));

            cardContent.appendChild(category);
            cardContent.appendChild(link);
            cardContent.appendChild(removeButton);
            card.appendChild(cardImage);
            card.appendChild(cardContent);

            drawerBody.appendChild(card);
        });

        updateEmptyState();
    }

    // Ajoute les événements wishlist
    function attachWishlistEvents() {
        const buttons = document.querySelectorAll('[wl="button"]');
        buttons.forEach(button => {
            if (!button.hasAttribute("data-wishlist-bound")) {
                button.setAttribute("data-wishlist-bound", "true");
                button.addEventListener("click", () => toggleWishlist(button));
            }
        });
    }

    // Surveille les changements dans le conteneur CMS avec MutationObserver
    function observeLazyLoadedContent() {
        if (!cmsList) return;

        const observer = new MutationObserver(() => {
            console.log("Nouveaux éléments détectés via lazy loading");
            attachWishlistEvents(); // Réattacher les événements
            updateButtonState(); // Mettre à jour les boutons
        });

        observer.observe(cmsList, { childList: true, subtree: true });
    }

    // Initialisation
    attachWishlistEvents(); // Attache les événements initiaux
    updateButtonState(); // Met à jour les boutons initiaux
    updateEmptyState(); // Met à jour l'état de la wishlist
    updateCounter(); // Met à jour le compteur
    renderWishlist(); // Affiche les éléments dans le drawer
    observeLazyLoadedContent(); // Surveille les contenus chargés dynamiquement
});
