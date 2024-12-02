$(document).ready(function() {
    // Vérifie la langue du navigateur
    const userLang = navigator.language || navigator.userLanguage;
    const isFrench = userLang.startsWith('fr');

    // Initialise le Date Range Picker avec la configuration de langue
    $('input[daterange="start"], input[daterange="end"]').daterangepicker({
        opens: 'left',
        autoUpdateInput: false,
        locale: {
            format: isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY', // Change le format de la date selon la langue
            cancelLabel: isFrench ? 'Annuler' : 'Cancel',
            applyLabel: isFrench ? 'Enregistrer' : 'Apply'
        }
    }, function(start, end) {
        $('input[daterange="start"]').val(start.format(isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY'));
        $('input[daterange="end"]').val(end.format(isFrench ? 'DD/MM/YYYY' : 'MM/DD/YYYY'));
    });
});
