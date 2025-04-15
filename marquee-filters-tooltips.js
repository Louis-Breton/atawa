document.addEventListener('DOMContentLoaded', () => {
  console.log('[INIT] DOMContentLoaded');

  const tags = document.querySelectorAll('.dynamic-radio-tag [tooltip-active]');
  const tooltips = document.querySelectorAll('.tooltip-banner');
  const tooltipWrapper = document.querySelector('[tooltip-data="ccoeur"]'); // conteneur global
  const resetButton = document.querySelector('.filter-reset-button');
  let activeTooltip = null;
  let activeTooltipKey = null;

  // Fonction centrale pour forcer l'affichage
  function showTooltipManually(key) {
    const tooltip = Array.from(tooltips).find(t => t.getAttribute('tooltip-data') === key);
    if (!tooltip) return;

    if (tooltipWrapper && tooltipWrapper.style.display === 'none') {
      console.log('[TOOLTIPS] Tooltip wrapper is hidden — forcing display');
      tooltipWrapper.style.display = 'block';
    }

    tooltip.style.display = 'flex';
    activeTooltip = tooltip;
    activeTooltipKey = key;

    console.log('[TOOLTIPS] Tooltip manually shown:', key);
  }

  // Fonction pour cacher tous les tooltips
  function hideAllTooltips() {
    console.log('[TOOLTIPS] Hiding all tooltips');
    tooltips.forEach(tooltip => {
      tooltip.style.display = 'none';
    });
    activeTooltip = null;
    activeTooltipKey = null;
  }

  // MutationObserver pour intercepter les changements DOM causés par Finsweet
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (
        activeTooltipKey &&
        tooltipWrapper &&
        tooltipWrapper.style.display === 'none'
      ) {
        console.log('[TOOLTIPS] CMS Filter modified wrapper — restoring tooltip');
        showTooltipManually(activeTooltipKey);
      }
    });
  });

  // Démarrage de l'observation du parent
  if (tooltipWrapper) {
    observer.observe(tooltipWrapper, { attributes: true, attributeFilter: ['style'] });
  }

  // Écoute des tags
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const tooltipKey = tag.getAttribute('tooltip-active');
      console.log('[TOOLTIPS] Tag clicked:', tooltipKey);

      if (activeTooltip && activeTooltip.getAttribute('tooltip-data') !== tooltipKey) {
        console.log('[TOOLTIPS] Hiding previous tooltip');
        activeTooltip.style.display = 'none';
      }

      showTooltipManually(tooltipKey);
    });
  });

  // Écoute du reset
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      console.log('[TOOLTIPS] Reset button clicked');
      hideAllTooltips();
    });
  }
});
