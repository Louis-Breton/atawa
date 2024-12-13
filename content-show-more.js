document.querySelector('[showmore="trigger"]').addEventListener("click", function() {
    const contentElement = document.querySelector('[showmore="content"]');
    
    // Supprime toutes les classes appliquées à l'élément
    contentElement.className = "";

    // Cache le bouton après le clic
    this.style.display = "none";
});
