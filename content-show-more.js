document.addEventListener("DOMContentLoaded", function () {
    const contentElements = document.querySelectorAll('[showmore="content"]');

    contentElements.forEach((contentElement) => {
        const triggerElement = document.querySelector(`[showmore="trigger"][showmore-id="${contentElement.getAttribute("showmore-id")}"]`);

        // Fonction pour détecter si le texte dépasse la hauteur définie par le CSS
        function isTextClamped(element) {
            return element.scrollHeight > element.offsetHeight;
        }

        // Vérifie si le contenu dépasse
        if (isTextClamped(contentElement)) {
            // Si le contenu dépasse, on affiche le bouton
            triggerElement.style.display = "inline-block";
        } else {
            // Sinon, on cache le bouton
            triggerElement.style.display = "none";
        }

        // Ajoute l'événement pour retirer la classe et cacher le bouton
        triggerElement.addEventListener("click", function () {
            contentElement.classList.remove("text-style-3lines");
            this.style.display = "none";
        });
    });
});
