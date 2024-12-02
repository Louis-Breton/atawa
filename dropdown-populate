document.addEventListener('DOMContentLoaded', function () {
    function synchronizeSelectAndDropdown(origine, destination) {
        const selectElement = document.querySelector(`select[selectpopulate="${origine}"]`);
        const dropdownWrapper = document.querySelector(`.dropdown_wrapper[selectpopulate="${destination}"]`);
        const dropdownList = dropdownWrapper.querySelector('.dropdown_list');
        const dropdownToggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
        const dropdownToggleText = dropdownToggle.querySelector('div:first-child');

        // 1. Peupler le Dropdown avec les options du Select
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

        // 2. Gestion du clic sur une option dans le Dropdown
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

                // Fermer le Dropdown
                closeDropdown();
            }
        });

        // 3. Mise à jour du Dropdown lorsque le Select est modifié directement
        selectElement.addEventListener('change', function () {
            const selectedText = selectElement.options[selectElement.selectedIndex].textContent;
            dropdownToggleText.textContent = selectedText;
        });

        // 4. Fermeture si clic à l'extérieur
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
    }

    // Synchroniser tous les Dropdowns et Selects
    document.querySelectorAll('[selectpopulate^="origine"]').forEach(selectElement => {
        const origineAttr = selectElement.getAttribute('selectpopulate');
        const destinationAttr = origineAttr.replace('origine', 'destination');
        synchronizeSelectAndDropdown(origineAttr, destinationAttr);
    });
});
