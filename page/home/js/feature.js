// Feature section - Random food picker button handler
document.addEventListener('DOMContentLoaded', function() {
    // Wait for htmlIncluded event to ensure HTML is fully loaded
    document.addEventListener('htmlIncluded', function setupFeatureButton() {
        const tryLuckBtn = document.getElementById('try-luck-btn');
        
        if (tryLuckBtn && typeof fsbOpenRandom === 'function') {
            tryLuckBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fsbOpenRandom();
            });
        }
    }, { once: true });
});
