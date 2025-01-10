document.addEventListener("DOMContentLoaded", function () {
  // Récupérer toutes les divs avec l'attribut event-size="wrapper"
  const wrappers = Array.from(document.querySelectorAll('[event-size="wrapper"]'));

  wrappers.forEach((wrapper) => {
    // Récupérer les inputs dans chaque wrapper
    const guestInput = wrapper.querySelector('[event-size="guest"]');
    const areaInput = wrapper.querySelector('[event-size="area"]');

    if (guestInput && areaInput) {
      // Ajouter un écouteur d'événement sur l'input area
      areaInput.addEventListener("input", function () {
        if (areaInput.value.trim() !== "") {
          // Si area est rempli, enlever le requis sur guest
          guestInput.removeAttribute("required");
        } else {
          // Si area est vide, remettre le requis sur guest
          guestInput.setAttribute("required", "true");
        }
      });
    }
  });
});
