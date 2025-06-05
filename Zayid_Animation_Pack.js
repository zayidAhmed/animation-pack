// Zayid_Animation_Pack_Enhanced.js

//Page Starts From The Top On Reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Animation Class Adding Function with Custom Thresholds
function setupScrollAnimations(animationClasses, defaultThreshold = 0.1) {
    const selector = animationClasses.map(c => `.${c}`).join(',');
    const elements = document.querySelectorAll(selector);
    
    // Group elements by their threshold values
    const thresholdGroups = new Map();
    
    elements.forEach(el => {
        // Check for data-threshold attribute, fallback to default
        const threshold = parseFloat(el.dataset.threshold) || defaultThreshold;
        
        if (!thresholdGroups.has(threshold)) {
            thresholdGroups.set(threshold, []);
        }
        thresholdGroups.get(threshold).push(el);
    });
    
    // Create separate observers for each threshold group
    thresholdGroups.forEach((groupElements, threshold) => {
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
            threshold: threshold
        });
        
        groupElements.forEach(el => observer.observe(el));
    });
}

// Parent Targeted Animation Class Adding Function with Custom Thresholds
function setupParentDependentAnimations(animationClasses, defaultThreshold = 0.1) {
    const elements = document.querySelectorAll(animationClasses.map(cls => `.${cls}`).join(','));
    
    const observedParents = new Map(); // Changed to Map to store threshold info
    
    elements.forEach(el => {
        const parent = el.parentElement;
        if (parent) {
            // Get threshold from parent's data attribute or use default
            const threshold = parseFloat(parent.dataset.threshold) || defaultThreshold;
            const parentKey = `${parent.outerHTML}-${threshold}`; // Unique key including threshold
            
            if (!observedParents.has(parentKey)) {
                observedParents.set(parentKey, { parent, threshold });
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const isVisible = entry.isIntersecting && 
                                        entry.boundingClientRect.top < window.innerHeight && 
                                        entry.boundingClientRect.top >= 0;
                        const children = parent.querySelectorAll(animationClasses.map(cls => `.${cls}`).join(','));
                        
                        if (isVisible) {
                            children.forEach(child => child.classList.add('active'));
                        } else if (entry.boundingClientRect.top >= window.innerHeight) {
                            children.forEach(child => child.classList.remove('active'));
                        }
                    });
                }, {
                    threshold: threshold
                });
                
                observer.observe(parent);
            }
        }
    });
}

// Advanced setup with threshold configuration
function setupAdvancedScrollAnimations(config = {}) {
    const {
        animationClasses = [
            'fade-in', 'fade-in-top', 'fade-in-bottom', 'fade-in-left', 'fade-in-right',
            'from-top', 'from-bottom', 'from-left', 'from-right',
            'zoom-in', 'zoom-in-top', 'zoom-in-bottom', 'zoom-in-left', 'zoom-in-right',
            'rotate-in', 'rotate-in-top', 'rotate-in-bottom', 'rotate-in-left', 'rotate-in-right', 'rotate-out',
            'flip-in-x', 'flip-in-y', 'flip-out-x', 'flip-out-y',
            'blur-in', 'blur-in-top', 'blur-in-bottom', 'blur-in-left', 'blur-in-right',
            'skew-in-x', 'skew-in-y', 'skew-in-top', 'skew-in-bottom'
        ],
        parentAnimationClasses = [
            'pt-fade-in', 'pt-fade-in-top', 'pt-fade-in-bottom', 'pt-fade-in-left', 'pt-fade-in-right',
            'pt-from-top', 'pt-from-bottom', 'pt-from-left', 'pt-from-right',
            'pt-zoom-in', 'pt-zoom-in-top', 'pt-zoom-in-bottom', 'pt-zoom-in-left', 'pt-zoom-in-right',
            'pt-rotate-in', 'pt-rotate-in-top', 'pt-rotate-in-bottom', 'pt-rotate-in-left', 'pt-rotate-in-right', 'pt-rotate-out',
            'pt-flip-in-x', 'pt-flip-in-y', 'pt-flip-out-x', 'pt-flip-out-y',
            'pt-blur-in', 'pt-blur-in-top', 'pt-blur-in-bottom', 'pt-blur-in-left', 'pt-blur-in-right',
            'pt-skew-in-x', 'pt-skew-in-y', 'pt-skew-in-top', 'pt-skew-in-bottom'
        ],
        defaultThreshold = 0.1,
        classThresholds = {},
        rootMargin = '0px'
    } = config;
    
    // Setup individual element animations
    animationClasses.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        const classThreshold = classThresholds[className] || defaultThreshold;
        
        elements.forEach(el => {
            const elementThreshold = parseFloat(el.dataset.threshold) || classThreshold;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const rect = entry.target.getBoundingClientRect();
                    const enteringFromBottom = rect.top < window.innerHeight && rect.top >= 0;
                    const exitingFromBottom = rect.top >= window.innerHeight;
                    
                    if (entry.isIntersecting && enteringFromBottom) {
                        entry.target.classList.add('active');
                    }
                    
                    if (!entry.isIntersecting && exitingFromBottom) {
                        entry.target.classList.remove('active');
                    }
                });
            }, {
                threshold: elementThreshold,
                rootMargin: rootMargin
            });
            
            observer.observe(el);
        });
    });
    
    // Setup parent-dependent animations
    setupParentDependentAnimations(parentAnimationClasses, defaultThreshold);
}

// Initialize function (backward compatible)
function initScrollAnimationEngine(customConfig = {}) {
    const defaultConfig = {
        defaultThreshold: 0.1,
        classThresholds: {
            // Example: specific thresholds for certain classes
            'fade-in': 0.2,
            'zoom-in': 0.15,
            'rotate-in': 0.25
        }
    };
    
    const config = { ...defaultConfig, ...customConfig };
    setupAdvancedScrollAnimations(config);
}

// Utility function to update threshold for specific elements
function updateElementThreshold(selector, newThreshold) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.dataset.threshold = newThreshold;
    });
    // Note: You'll need to re-initialize observers for this to take effect
}

// Utility function to get current threshold of an element
function getElementThreshold(element) {
    return parseFloat(element.dataset.threshold) || 0.1;
}

// Optional: Auto-run on load
window.addEventListener('DOMContentLoaded', () => initScrollAnimationEngine());
