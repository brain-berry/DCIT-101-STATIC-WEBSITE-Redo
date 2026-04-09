/**
 * Optimized UI Components
 * Fixes: Memory leaks, performance issues, inconsistent patterns
 */

// Base component class for consistent patterns
class BaseComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...this.getDefaultOptions(), ...options };
        this.isDestroyed = false;
        this.eventListeners = new Map();
    }
    
    getDefaultOptions() {
        return {};
    }
    
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.set({ element, event }, handler);
    }
    
    removeEventListener(element, event) {
        const key = { element, event };
        const handler = this.eventListeners.get(key);
        if (handler) {
            element.removeEventListener(event, handler);
            this.eventListeners.delete(key);
        }
    }
    
    destroy() {
        this.eventListeners.forEach((handler, key) => {
            key.element.removeEventListener(key.event, handler);
        });
        this.eventListeners.clear();
        this.isDestroyed = true;
    }
}

// Optimized Testimonial Slider
class OptimizedTestimonialSlider extends BaseComponent {
    constructor(element) {
        super(element);
        this.slides = this.element.querySelectorAll('.testimonial-slide');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.indicators = document.querySelectorAll('#testimonialIndicators .indicator');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 6000;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.setupEventListeners();
        this.startAutoplay();
        this.preloadAdjacentSlides();
    }
    
    setupEventListeners() {
        // Button controls
        if (this.prevBtn) {
            this.addEventListener(this.prevBtn, 'click', () => this.prev());
        }
        if (this.nextBtn) {
            this.addEventListener(this.nextBtn, 'click', () => this.next());
        }
        
        // Indicator controls
        this.indicators.forEach((indicator, index) => {
            this.addEventListener(indicator, 'click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        this.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch support with debouncing
        this.addTouchSupport();
        
        // Pause on hover
        this.addEventListener(this.element, 'mouseenter', () => this.pauseAutoplay());
        this.addEventListener(this.element, 'mouseleave', () => this.resumeAutoplay());
        
        // Visibility API to pause when tab is not visible
        this.addEventListener(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        };
        
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        };
        
        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Swipe threshold
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        };
        
        this.addEventListener(this.element, 'touchstart', handleTouchStart, { passive: true });
        this.addEventListener(this.element, 'touchmove', handleTouchMove, { passive: false });
        this.addEventListener(this.element, 'touchend', handleTouchEnd);
    }
    
    goToSlide(index) {
        if (this.isDestroyed || index === this.currentSlide) return;
        
        // Remove active classes
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');
        this.indicators[this.currentSlide]?.classList.remove('active');
        
        // Add active classes
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.remove('prev');
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');
        
        // Clean up previous slide classes
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 600);
        
        // Preload adjacent slides
        this.preloadAdjacentSlides();
    }
    
    preloadAdjacentSlides() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        
        // Preload images in adjacent slides
        [nextIndex, prevIndex].forEach(index => {
            const images = this.slides[index].querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        });
    }
    
    next() {
        const nextSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextSlide);
    }
    
    prev() {
        const prevSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevSlide);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused && !document.hidden) {
                this.next();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        this.isPaused = true;
    }
    
    resumeAutoplay() {
        this.isPaused = false;
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoplay();
        super.destroy();
    }
}

// Optimized Image Carousel
class OptimizedImageCarousel extends BaseComponent {
    constructor(element) {
        super(element);
        this.slides = this.element.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.thumbnails = document.querySelectorAll('.carousel-thumbnails .thumbnail');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.setupEventListeners();
        this.startAutoplay();
        this.lazyLoadImages();
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.addEventListener(this.prevBtn, 'click', () => this.prev());
        }
        if (this.nextBtn) {
            this.addEventListener(this.nextBtn, 'click', () => this.next());
        }
        
        this.thumbnails.forEach((thumb, index) => {
            this.addEventListener(thumb, 'click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation with scope checking
        this.addEventListener(document, 'keydown', (e) => {
            if (e.target.closest('.image-carousel-container')) {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
        
        this.addEventListener(this.element, 'mouseenter', () => this.pauseAutoplay());
        this.addEventListener(this.element, 'mouseleave', () => this.resumeAutoplay());
        
        this.addEventListener(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    goToSlide(index) {
        if (this.isDestroyed || index === this.currentSlide) return;
        
        this.slides[this.currentSlide].classList.remove('active');
        this.thumbnails[this.currentSlide]?.classList.remove('active');
        
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.thumbnails[this.currentSlide]?.classList.add('active');
        
        this.lazyLoadCurrentSlide();
    }
    
    lazyLoadImages() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.lazyLoadCurrentSlide();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.element);
    }
    
    lazyLoadCurrentSlide() {
        const currentSlideElement = this.slides[this.currentSlide];
        const images = currentSlideElement.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.onload = () => img.removeAttribute('data-src');
                img.onerror = () => {
                    img.src = img.getAttribute('data-fallback') || 'https://via.placeholder.com/600x400';
                    img.removeAttribute('data-src');
                };
            }
        });
    }
    
    next() {
        const nextSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextSlide);
    }
    
    prev() {
        const prevSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevSlide);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused && !document.hidden) {
                this.next();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        this.isPaused = true;
    }
    
    resumeAutoplay() {
        this.isPaused = false;
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoplay();
        super.destroy();
    }
}

// Optimized Count Up Animation
class OptimizedCountUp extends BaseComponent {
    constructor(element) {
        super(element);
        this.counters = document.querySelectorAll('[data-count-up] .stat-number');
        this.hasAnimated = false;
        this.animationFrameId = null;
        
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.counters[0].closest('.stats-counter-section'));
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                if (this.isDestroyed) return;
                
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    this.animationFrameId = requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            this.animationFrameId = requestAnimationFrame(updateCounter);
        });
    }
    
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        super.destroy();
    }
}

// Optimized Scroll Animations
class OptimizedScrollAnimations extends BaseComponent {
    constructor() {
        super(document.body);
        this.elements = document.querySelectorAll('[data-fade-in], .gallery-card, .about .content-wrapper > div');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(el);
        });
    }
    
    animateElement(element) {
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        super.destroy();
    }
}

// Export for use in main app
window.OptimizedComponents = {
    TestimonialSlider: OptimizedTestimonialSlider,
    ImageCarousel: OptimizedImageCarousel,
    CountUp: OptimizedCountUp,
    ScrollAnimations: OptimizedScrollAnimations
};
