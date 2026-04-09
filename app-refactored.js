/**
 * Consolidated Application Initialization
 * Fixes: Duplicate DOMContentLoaded listeners, race conditions, memory leaks
 */
'use strict';

class App {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
    }
    
    /**
     * Single initialization point
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize core functionality first
            this.initializeTheme();
            this.initializeMobileMenu();
            this.initializeHeaderEffects();
            this.initializeFormHandlers();
            
            // Initialize UI components
            this.initializeComponents();
            
            // Add utility enhancements
            this.initializeUtilities();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
        }
    }
    
    /**
     * Initialize theme management
     */
    initializeTheme() {
        if (typeof ThemeManager !== 'undefined') {
            this.components.set('theme', new ThemeManager());
        }
    }
    
    /**
     * Initialize mobile menu with proper cleanup
     */
    initializeMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (!mobileToggle || !mobileNav) return;
        
        const toggleMenu = () => {
            mobileToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        };
        
        mobileToggle.addEventListener('click', toggleMenu);
        
        // Close menu on link clicks
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
        
        // Store for cleanup
        this.components.set('mobileMenu', { element: mobileToggle, handler: toggleMenu });
    }
    
    /**
     * Initialize header scroll effects with throttling
     */
    initializeHeaderEffects() {
        const header = document.getElementById('header');
        if (!header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        };
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.components.set('header', { element: window, handler: scrollHandler });
    }
    
    /**
     * Initialize form handlers with validation
     */
    initializeFormHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Basic validation
                if (!this.validateForm(form)) {
                    this.showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                // Success feedback (replaces alert)
                this.showNotification('Form submitted successfully!', 'success');
                form.reset();
            });
        });
    }
    
    /**
     * Initialize UI components
     */
    initializeComponents() {
        // Initialize sliders only if elements exist
        if (document.getElementById('testimonialSlider')) {
            this.components.set('testimonialSlider', new TestimonialSlider());
        }
        
        if (document.getElementById('campusCarousel')) {
            this.components.set('imageCarousel', new ImageCarousel());
        }
        
        if (document.querySelector('[data-count-up]')) {
            this.components.set('countUp', new CountUpAnimation());
        }
        
        if (document.querySelector('[data-fade-in]')) {
            this.components.set('scrollAnimations', new ScrollAnimations());
        }
    }
    
    /**
     * Initialize utility functions
     */
    initializeUtilities() {
        // Add ripple effects safely
        this.initializeRippleEffects();
        
        // Initialize smooth scrolling
        this.initializeSmoothScroll();
    }
    
    /**
     * Form validation helper
     */
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    /**
     * User-friendly notification system (replaces alert)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    background: var(--surface-color);
                    color: var(--text-main);
                    box-shadow: var(--shadow);
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification-success { border-left: 4px solid #48bb78; }
                .notification-error { border-left: 4px solid #f56565; }
                .notification.show { transform: translateX(0); }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * Initialize ripple effects with cleanup
     */
    initializeRippleEffects() {
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', this.createRipple);
        });
        
        this.components.set('rippleButtons', buttons);
    }
    
    /**
     * Create ripple effect
     */
    createRipple(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`
        });
        
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    /**
     * Initialize smooth scrolling
     */
    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    /**
     * Cleanup method for SPA scenarios
     */
    destroy() {
        this.components.forEach((component, name) => {
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            } else if (component.element && component.handler) {
                component.element.removeEventListener('click', component.handler);
            }
        });
        
        this.components.clear();
        this.isInitialized = false;
    }
}

// Single DOMContentLoaded listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App().init());
} else {
    new App().init();
}
