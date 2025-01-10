document.addEventListener("DOMContentLoaded", function () {
  // Fonction pour gérer une série spécifique d'upload
  const handleUploads = (attributeName) => {
    // Récupérer les champs de la série spécifique
    const uploadFields = Array.from(document.querySelectorAll(`[${attributeName}]`));

    // Fonction pour afficher le champ suivant
    const showNextField = (index) => {
      if (index < uploadFields.length - 1) {
        const nextField = uploadFields[index + 1];
        if (nextField.classList.contains("start-hide")) {
          nextField.classList.remove("start-hide");
          nextField.style.display = "flex"; // Afficher le champ en flex
        }
      }
    };

    // Ajouter un écouteur d'événement pour chaque champ
    uploadFields.forEach((field, index) => {
      const fileInput = field.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.addEventListener("change", function () {
          // Vérifier si l'attribut value contient un nom de fichier
          if (fileInput.value) {
            // Afficher le champ suivant
            showNextField(index);
          }
        });
      }
    });
  };

  // Gérer chaque série d'uploads
  handleUploads("upload-private");
  handleUploads("upload-pro");
});
