document.addEventListener("DOMContentLoaded", function() {
    const titles = document.querySelectorAll('.title-underline');

    function animateUnderline() {
        titles.forEach(title => {
            const rect = title.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0 && !title.classList.contains('visible')) {
                title.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', animateUnderline);
    animateUnderline();
});
