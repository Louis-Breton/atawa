document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist";
    const drawerBody = document.querySelector('.drawer_body[wl="list"]');
    const emptyState = document.querySelector('[wl="empty"]');
    const cta = document.querySelector('[wl="cta"]');
    const label = document.querySelector('[wl="counter-label"]');

    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

    // Vérifie et met à jour le localStorage en cas de problème
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

            // Utilisation de méthodes sécurisées pour créer le contenu
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
            removeButton.setAttribute("data-tooltip", "Retirer de la wishlist");
            removeButton.innerHTML = `
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" role="img" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5L12 12M12 12L18.5 18.5M12 12L5.5 18.5M12 12L18.5 5.5" 
                        stroke="currentColor" stroke-linecap="round" stroke-width="1.5" stroke-linejoin="round"></path>
                </svg>
            `;

            // Supprimer le produit au clic
            removeButton.addEventListener("click", () => removeFromWishlist(product.id));

            // Ajouter tous les éléments à la carte
            cardContent.appendChild(category);
            cardContent.appendChild(link);
            cardContent.appendChild(removeButton);
            card.appendChild(cardImage);
            card.appendChild(cardContent);

            drawerBody.appendChild(card);
        });

        updateEmptyState();
    }

    // Ajout des événements aux boutons
    document.body.addEventListener("click", function (e) {
        const button = e.target.closest('[wl="button"]');
        if (button) {
            toggleWishlist(button);
        }
    });

    // Initialisation
    updateButtonState();
    updateEmptyState();
    updateCounter();
    renderWishlist();
});
