document.addEventListener('DOMContentLoaded', function () {
    // 1. Génération dynamique des options pour les selects de période
    function populateMonthSelect(selectName) {
        const selectElement = document.querySelector('select[name="' + selectName + '"]');
        if (selectElement) {
            // Vider le select existant
            selectElement.innerHTML = '';

            // Déterminer la langue du navigateur
            const lang = navigator.language || navigator.userLanguage || 'en';
            let monthNames;
            if (lang.toLowerCase().startsWith('fr')) {
                monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            } else {
                monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            }

            const today = new Date();

            // Générer 16 options à partir du mois courant
            for (let i = 0; i < 16; i++) {
                const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
                const monthName = monthNames[date.getMonth()];
                const year = date.getFullYear();
                const optionText = monthName + ' ' + year;

                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;

                selectElement.appendChild(option);
            }
        }
    }

    // Appliquer la génération sur les deux selects spécifiques
    populateMonthSelect('brief-pro-date-periode');
    populateMonthSelect('brief-private-date-periode');

    // 2. Synchronisation entre select caché et dropdown custom
    function synchronizeSelectAndDropdown(origine, destination) {
        const selectElement = document.querySelector(`select[selectpopulate="${origine}"]`);
        const dropdownWrapper = document.querySelector(`.dropdown_wrapper[selectpopulate="${destination}"]`);
        const dropdownList = dropdownWrapper.querySelector('.dropdown_list');
        const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
        const dropdownToggleText = dropdownToggle.querySelector('div:first-child');

        // Peupler le Dropdown avec les options du Select
        selectElement.querySelectorAll('option').forEach(option => {
            const optionValue = option.value;
            const optionText = option.textContent;
            if (optionValue) {
                const dropdownLink = document.createElement('a');
                dropdownLink.href = '#';
                dropdownLink.classList.add('dropdown_link', 'w-dropdown-link');
                dropdownLink.setAttribute('data-value', optionValue);
                dropdownLink.setAttribute('role', 'menuitem');
                dropdownLink.textContent = optionText;
                dropdownList.appendChild(dropdownLink);
            }
        });

        // Gestion du clic sur une option dans le Dropdown
        dropdownList.addEventListener('click', function (e) {
            if (e.target.matches('.dropdown_link')) {
                e.preventDefault();
                const selectedValue = e.target.getAttribute('data-value');
                const selectedText = e.target.textContent;

                // Mettre à jour le Select correspondant
                selectElement.value = selectedValue;
                selectElement.dispatchEvent(new Event('change'));

                // Mettre à jour l'affichage du Dropdown
                dropdownToggleText.textContent = selectedText;

                // Retirer l'état d'erreur
                dropdownToggle.classList.remove('is-error');

                // Fermer le Dropdown
                closeDropdown();
            }
        });

        // Mise à jour du Dropdown lorsque le Select est modifié directement
        selectElement.addEventListener('change', function () {
            const selectedText = selectElement.options[selectElement.selectedIndex].textContent;
            dropdownToggleText.textContent = selectedText;
            dropdownToggle.classList.remove('is-error');
        });

        // Fermeture si clic à l'extérieur
        document.addEventListener('click', function (e) {
            if (!dropdownWrapper.contains(e.target) && dropdownToggle.getAttribute('aria-expanded') === 'true') {
                closeDropdown();
            }
        });

        // Fonction pour fermer le Dropdown
        function closeDropdown() {
            dropdownToggle.classList.remove('w--open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownList.classList.remove('w--open');
            dropdownList.style.opacity = '0';
            dropdownList.style.transform = 'translate3d(0px, -2rem, 0px)';
        }

        // Synchroniser l'état d'erreur : en cas d'invalidité du select
        selectElement.addEventListener('invalid', function () {
            dropdownToggle.classList.add('is-error');
        });
        selectElement.addEventListener('input', function () {
            if (selectElement.checkValidity()) {
                dropdownToggle.classList.remove('is-error');
            }
        });
    }

    // Synchroniser tous les dropdowns/custom selects avec l'attribut selectpopulate commençant par "origine"
    document.querySelectorAll('[selectpopulate^="origine"]').forEach(selectElement => {
        const origineAttr = selectElement.getAttribute('selectpopulate');
        const destinationAttr = origineAttr.replace('origine', 'destination');
        synchronizeSelectAndDropdown(origineAttr, destinationAttr);
    });

    // 3. Gestion des erreurs pour tous les autres champs du formulaire
    document.querySelectorAll('form').forEach(form => {
        // Vérification à la soumission du formulaire
        form.addEventListener('submit', function(e) {
            let formValid = true;
            // Vérifier tous les champs requis (inputs, textarea, selects)
            form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-error');
                    // Afficher le message d'erreur associé via l'attribut error-label
                    const errorLabel = form.querySelector(`.form_label-error[error-label="${input.name}"]`);
                    if (errorLabel) {
                        errorLabel.style.display = 'block';
                    }
                    formValid = false;
                } else {
                    input.classList.remove('is-error');
                    const errorLabel = form.querySelector(`.form_label-error[error-label="${input.name}"]`);
                    if (errorLabel) {
                        errorLabel.style.display = 'none';
                    }
                }
            });
            // Empêcher l'envoi du formulaire si un champ requis n'est pas renseigné
            if (!formValid) {
                e.preventDefault();
            }
        });

        // Dès que l'utilisateur saisit une valeur, retirer l'état d'erreur et masquer le message
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                if (input.value.trim()) {
                    input.classList.remove('is-error');
                    const errorLabel = form.querySelector(`.form_label-error[error-label="${input.name}"]`);
                    if (errorLabel) {
                        errorLabel.style.display = 'none';
                    }
                }
            });
        });
    });
});
