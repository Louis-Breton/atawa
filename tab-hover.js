document.addEventListener('DOMContentLoaded', function () {
    // Vérifie si l'utilisateur est sur un écran supérieur à 991px
    if (window.innerWidth > 991) {
      const hoverTabElements = document.querySelectorAll('[tab="hover"]');

      hoverTabElements.forEach(hoverTabElement => {
        hoverTabElement.addEventListener('mouseenter', function () {
          hoverTabElement.click(); // Click sur l'élément au survol
        });
      });
    }
  });
