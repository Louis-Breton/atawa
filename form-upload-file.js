document.addEventListener("DOMContentLoaded", function () {
  const handleUploads = (attributeName) => {
    const uploadFields = Array.from(document.querySelectorAll(`[${attributeName}]`));

    const showNextField = (index) => {
      if (index < uploadFields.length - 1) {
        const nextField = uploadFields[index + 1];
        if (nextField.classList.contains("start-hide")) {
          nextField.classList.remove("start-hide");
          nextField.style.display = "flex";
        }
      }
    };

    uploadFields.forEach((field, index) => {
      const fileInput = field.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.addEventListener("change", function () {
          if (fileInput.value) {
            showNextField(index);
          }
        });
      }
    });
  };

  // Trouver dynamiquement tous les attributs upload-*
  const allUploadContainers = Array.from(document.querySelectorAll("[*|upload]"));
  const uploadAttributes = new Set();

  allUploadContainers.forEach(el => {
    for (const attr of el.attributes) {
      if (attr.name.startsWith("upload-")) {
        uploadAttributes.add(attr.name);
      }
    }
  });

  // Gérer chaque attribut upload-*
  uploadAttributes.forEach(attr => {
    handleUploads(attr);
  });
});
