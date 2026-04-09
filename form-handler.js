/**
 * Secure Form Handler Module
 * Fixes: XSS vulnerabilities, input validation, user feedback
 */
class SecureFormHandler {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    init() {
        document.querySelectorAll('form').forEach(form => {
            this.setupForm(form);
        });
    }
    
    /**
     * Setup individual form with security measures
     */
    setupForm(form) {
        const formId = form.id || `form-${Date.now()}`;
        
        // Add CSRF protection for dynamic forms
        this.addCSRFToken(form);
        
        // Setup validation and submission
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        
        // Real-time validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
        
        this.forms.set(formId, form);
    }
    
    /**
     * Add CSRF token to form
     */
    addCSRFToken(form) {
        if (form.querySelector('input[name="_csrf"]')) return;
        
        const token = document.createElement('input');
        token.type = 'hidden';
        token.name = '_csrf';
        token.value = this.generateCSRFToken();
        form.appendChild(token);
    }
    
    /**
     * Generate simple CSRF token
     */
    generateCSRFToken() {
        return btoa(Date.now().toString() + Math.random().toString(36));
    }
    
    /**
     * Handle form submission securely
     */
    async handleSubmit(e, form) {
        e.preventDefault();
        
        // Validate all fields
        if (!this.validateForm(form)) {
            this.showFormError(form, 'Please correct the errors below');
            return;
        }
        
        // Get sanitized form data
        const formData = this.sanitizeFormData(new FormData(form));
        
        try {
            // Show loading state
            this.setFormLoading(form, true);
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);
            
            // Success feedback
            this.showFormSuccess(form, 'Form submitted successfully!');
            form.reset();
            
        } catch (error) {
            this.showFormError(form, 'Submission failed. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            this.setFormLoading(form, false);
        }
    }
    
    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        const pattern = field.getAttribute('pattern');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required validation
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Pattern validation
        if (pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                this.showFieldError(field, 'Please match the required format');
                return false;
            }
        }
        
        // Length validation
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
            this.showFieldError(field, `Minimum ${minLength} characters required`);
            return false;
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
            this.showFieldError(field, `Maximum ${maxLength} characters allowed`);
            return false;
        }
        
        return true;
    }
    
    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        this.clearFieldError(field);
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Sanitize form data
     */
    sanitizeFormData(formData) {
        const sanitized = new FormData();
        
        for (const [key, value] of formData.entries()) {
            // Sanitize string values
            if (typeof value === 'string') {
                sanitized.append(key, this.sanitizeString(value));
            } else {
                sanitized.append(key, value);
            }
        }
        
        return sanitized;
    }
    
    /**
     * Sanitize string to prevent XSS
     */
    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Show form error message
     */
    showFormError(form, message) {
        this.showFormMessage(form, message, 'error');
    }
    
    /**
     * Show form success message
     */
    showFormSuccess(form, message) {
        this.showFormMessage(form, message, 'success');
    }
    
    /**
     * Show form message
     */
    showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        // Insert after form title or at the beginning
        const titleElement = form.querySelector('h2, h3, h4') || form.firstChild;
        form.insertBefore(messageElement, titleElement.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
    
    /**
     * Set form loading state
     */
    setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            form.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
            form.classList.remove('loading');
        }
    }
    
    /**
     * Simulate form submission (replace with actual API call)
     */
    async submitForm(formData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real application, you would send the data to your server:
        // const response = await fetch('/api/submit', {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'X-CSRF-Token': formData.get('_csrf')
        //     }
        // });
        
        // if (!response.ok) {
        //     throw new Error('Submission failed');
        // }
        
        return Promise.resolve();
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SecureFormHandler());
} else {
    new SecureFormHandler();
}

// Add form styles if not present
if (!document.querySelector('#form-styles')) {
    const style = document.createElement('style');
    style.id = 'form-styles';
    style.textContent = `
        .field-error {
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        input.error, textarea.error, select.error {
            border-color: #e53e3e !important;
        }
        
        .form-message {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .form-message-success {
            background-color: #f0fff4;
            border: 1px solid #9ae6b4;
            color: #22543d;
        }
        
        .form-message-error {
            background-color: #fff5f5;
            border: 1px solid #feb2b2;
            color: #742a2a;
        }
        
        form.loading {
            opacity: 0.7;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}
