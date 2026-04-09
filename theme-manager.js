/**
 * Unified Theme Manager - Secure and consistent theme handling
 * Fixes: XSS vulnerability, duplicate code, inconsistent implementation
 */
class ThemeManager {
    constructor() {
        this.storageKey = 'duc-theme';
        this.themeBtn = null;
        this.themeText = null;
        this.currentTheme = 'light';
        
        this.init();
    }
    
    init() {
        // Cache DOM elements
        this.themeBtn = document.getElementById('themeBtn');
        if (!this.themeBtn) return;
        
        this.themeText = this.themeBtn.querySelector('.theme-text');
        
        // Load and apply saved theme securely
        this.loadTheme();
        
        // Add event listener with proper cleanup
        this.themeBtn.addEventListener('click', this.handleThemeToggle.bind(this));
    }
    
    /**
     * Secure theme loading with validation
     */
    loadTheme() {
        try {
            const savedTheme = localStorage.getItem(this.storageKey);
            // Validate theme value to prevent XSS
            if (savedTheme === 'dark' || savedTheme === 'light') {
                this.currentTheme = savedTheme;
            } else {
                this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            this.applyTheme();
        } catch (error) {
            console.warn('Theme loading failed:', error);
            this.currentTheme = 'light';
            this.applyTheme();
        }
    }
    
    /**
     * Apply theme to DOM
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateButtonText();
    }
    
    /**
     * Handle theme toggle with secure storage
     */
    handleThemeToggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        
        try {
            localStorage.setItem(this.storageKey, this.currentTheme);
        } catch (error) {
            console.warn('Theme saving failed:', error);
        }
    }
    
    /**
     * Update button text consistently
     */
    updateButtonText() {
        if (this.themeText) {
            this.themeText.textContent = this.currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
    
    /**
     * Cleanup method for SPA scenarios
     */
    destroy() {
        if (this.themeBtn) {
            this.themeBtn.removeEventListener('click', this.handleThemeToggle.bind(this));
        }
    }
}

// Export for module usage or initialize immediately
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} else {
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ThemeManager());
    } else {
        new ThemeManager();
    }
}
