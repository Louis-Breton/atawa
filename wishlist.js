document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist";
    const drawerBody = document.querySelector('.drawer_body[wl="list"]');
    const emptyState = document.querySelector('[wl="empty"]');
    const cta = document.querySelector('[wl="cta"]');
    const label = document.querySelector('[wl="counter-label"]');

    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    // Met à jour le compteur wishlist
    function updateCounter() {
        const counters = document.querySelectorAll('[wl="counter"]');
        counters.forEach(counter => counter.textContent = wishlist.length);

        updateLabel();
    }

    // Met à jour le label à côté du compteur
    function updateLabel() {
        const lang = navigator.language || navigator.userLanguage; // Récupère la langue du navigateur
        const isFrench = lang.startsWith('fr');
        const count = wishlist.length;

        const labelText = isFrench
            ? (count <= 1 ? "produit ajouté :" : "produits ajoutés :")
            : (count <= 1 ? "product:" : "products:");

        label.textContent = ` ${labelText}`; // Remplace complètement le texte
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
            if (wishlist.find(item => item.id === productId)) {
                button.classList.add("is-active");
                button.setAttribute("data-tooltip", "Retirer de ma wishlist");
            } else {
                button.classList.remove("is-active");
                button.setAttribute("data-tooltip", "Ajouter à ma wishlist");
            }
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

        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        updateWishlistButtons();
        updateEmptyState();
        renderWishlist();
        updateCounter();
    }

    // Supprime un produit par ID
    function removeFromWishlist(productId) {
        const index = wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
            updateButtonState(); // Synchronise l'état des boutons
        }
    }

    // Rend la wishlist dans le drawer
    function renderWishlist() {
        const wishlistItems = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

        // Nettoyer la liste existante
        drawerBody.innerHTML = "";

        // Générer les cards
        wishlistItems.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("wishlist_card");
            card.setAttribute("wl-card", "card");
            card.innerHTML = `
                <div class="wishlist_card-image">
                    <img src="${product.image}" loading="lazy" alt="${product.name}" class="image-cover" wl-card="image">
                </div>
                <div class="wishlist_card-content">
                    <p class="fs-9 text-neutral_400 text-style-ellipsis" wl-card="category">${product.category}</p>
                    <a href="${product.link}" class="text-secondary_950-base text-style-ellipsis" wl-card="name-link">${product.name}</a>
                    <div data-tooltip="Retirer de la wishlist" class="wishlist_remove-product w-embed" wl-card="remove">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" role="img" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5L12 12M12 12L18.5 18.5M12 12L5.5 18.5M12 12L18.5 5.5" 
                                  stroke="currentColor" stroke-linecap="round" stroke-width="1.5" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
            `;

            // Ajout de l'événement pour supprimer un produit
            card.querySelector('[wl-card="remove"]').addEventListener("click", () => {
                removeFromWishlist(product.id);
                card.remove();
                renderWishlist(); // Met à jour la liste et l'affichage
                updateButtonState(); // Synchronise les boutons de la page
            });

            drawerBody.appendChild(card);
        });

        updateEmptyState();
        updateCounter();
    }

    // Ajout des événements aux boutons
    document.querySelectorAll('[wl="button"]').forEach(button => {
        button.addEventListener("click", () => toggleWishlist(button));
    });

    // Initialisation
    updateWishlistButtons();
    updateEmptyState();
    updateCounter();
    renderWishlist();
});
