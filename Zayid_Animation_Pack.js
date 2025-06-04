// Zayid_Animation_Pack.js


//Page Starts From The Top On Reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};


// Animation Class Adding Function
function setupScrollAnimations(animationClasses) {
    const selector = animationClasses.map(c => `.${c}`).join(',');
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const rect = el.getBoundingClientRect();

            const enteringFromBottom = rect.top < window.innerHeight && rect.top >= 0;
            const exitingFromBottom = rect.top >= window.innerHeight;

            if (entry.isIntersecting && enteringFromBottom) {
                el.classList.add('active');
            }

            if (!entry.isIntersecting && exitingFromBottom) {
                el.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}


// Parent Targeted Animation Class Adding Function
function setupParentDependentAnimations(animationClasses) {
    const elements = document.querySelectorAll(animationClasses.map(cls => `.${cls}`).join(','));

    const observedParents = new Set();

    elements.forEach(el => {
        const parent = el.parentElement;
        if (parent && !observedParents.has(parent)) {
            observedParents.add(parent);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const isVisible = entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight && entry.boundingClientRect.top >= 0;
                    const children = parent.querySelectorAll(animationClasses.map(cls => `.${cls}`).join(','));

                    if (isVisible) {
                        children.forEach(child => child.classList.add('active'));
                    } else if (entry.boundingClientRect.top >= window.innerHeight) {
                        children.forEach(child => child.classList.remove('active'));
                    }
                });
            }, {
                threshold: 0.1
            });

            observer.observe(parent);
        }
    });
}


// Initialize function
function initScrollAnimationEngine() {
setupScrollAnimations([
    'fade-in', 'fade-in-top', 'fade-in-bottom', 'fade-in-left', 'fade-in-right',
    'from-top', 'from-bottom', 'from-left', 'from-right',
    'zoom-in', 'zoom-in-top', 'zoom-in-bottom', 'zoom-in-left', 'zoom-in-right',
    'rotate-in', 'rotate-in-top', 'rotate-in-bottom', 'rotate-in-left', 'rotate-in-right', 'rotate-out',
    'flip-in-x', 'flip-in-y', 'flip-out-x', 'flip-out-y',
    'blur-in', 'blur-in-top', 'blur-in-bottom', 'blur-in-left', 'blur-in-right',
    'skew-in-x', 'skew-in-y', 'skew-in-top', 'skew-in-bottom'
]);

setupParentDependentAnimations([
    'pt-fade-in', 'pt-fade-in-top', 'pt-fade-in-bottom', 'pt-fade-in-left', 'pt-fade-in-right',
    'pt-from-top', 'pt-from-bottom', 'pt-from-left', 'pt-from-right',
    'pt-zoom-in', 'pt-zoom-in-top', 'pt-zoom-in-bottom', 'pt-zoom-in-left', 'pt-zoom-in-right',
    'pt-rotate-in', 'pt-rotate-in-top', 'pt-rotate-in-bottom', 'pt-rotate-in-left', 'pt-rotate-in-right', 'pt-rotate-out',
    'pt-flip-in-x', 'pt-flip-in-y', 'pt-flip-out-x', 'pt-flip-out-y',
    'pt-blur-in', 'pt-blur-in-top', 'pt-blur-in-bottom', 'pt-blur-in-left', 'pt-blur-in-right',
    'pt-skew-in-x', 'pt-skew-in-y', 'pt-skew-in-top', 'pt-skew-in-bottom'
]);
}

// Optional: Auto-run on load
window.addEventListener('DOMContentLoaded', initScrollAnimationEngine);
