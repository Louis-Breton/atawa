document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "wishlist";
    const drawerBody = document.querySelector('.drawer_body[wl="list"]');
    const emptyState = document.querySelector('[wl="empty"]');
    const cta = document.querySelector('[wl="cta"]');

    const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    // Met à jour le compteur wishlist
    function updateCounter() {
        const counters = document.querySelectorAll('[wl="counter"]');
        counters.forEach(counter => counter.textContent = wishlist.length);
    }

    // Met à jour l'état vide / CTA
    function updateEmptyState() {
        if (wishlist.length === 0) {
            emptyState.style.display = "block";
            cta.style.display = "none";
        } else {
            emptyState.style.display = "none";
            cta.style.display = "block";
        }
    }

    // Met à jour l'état des boutons et tooltips
    function updateWishlistButtons() {
        const buttons = document.querySelectorAll('[wl="button"]');
        buttons.forEach(button => {
            const productWrapper = button.closest('[wl="product"]');
            const productLink = productWrapper.querySelector('[wl="link"]').getAttribute("src");

            if (wishlist.find(item => item.link === productLink)) {
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
        const productLink = productWrapper.querySelector('[wl="link"]').getAttribute("src");

        const product = {
            name: productWrapper.querySelector('[wl="name"]').textContent,
            link: productLink,
            image: productWrapper.querySelector('[wl="image"]').getAttribute("src"),
            category: productWrapper.querySelector('[wl="category"]').textContent
        };

        const index = wishlist.findIndex(item => item.link === productLink);
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

    // Supprime un produit par lien
    function removeFromWishlist(link) {
        const index = wishlist.findIndex(item => item.link === link);
        if (index > -1) {
            wishlist.splice(index, 1);
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
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
                removeFromWishlist(product.link);
                card.remove();
                renderWishlist(); // Met à jour la liste et l'affichage
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
