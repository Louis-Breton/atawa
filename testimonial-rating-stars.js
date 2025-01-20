document.addEventListener("DOMContentLoaded", function() {
        const ratingWrappers = document.querySelectorAll('.rating_wrapper');
        ratingWrappers.forEach(wrapper => {
            const ratingData = wrapper.querySelector('[rating-data]');
            const note = parseFloat(ratingData.getAttribute('rating-data'));
            const percentage = Math.min((note / 5) * 100, 100);
            const ratingStarLevel = wrapper.querySelector('.rating_star_level');
            ratingStarLevel.style.width = `${percentage}%`;
        });
    });
