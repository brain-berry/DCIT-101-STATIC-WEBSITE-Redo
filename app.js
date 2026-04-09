'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeBtn');
    const themeText = themeBtn.querySelector('.theme-text');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeText.textContent = 'Light Mode';
    }
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let targetTheme = 'light';
        
        if (currentTheme !== 'dark') {
            targetTheme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        
        if (targetTheme === 'dark') {
            themeText.textContent = 'Light Mode';
        } else {
            themeText.textContent = 'Dark Mode';
        }
    });

    // Handle form submission
    const form = document.querySelector('.inquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Settings have been modernized! Thank you for your inquiry.');
            form.reset();
        });
    }
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
}

// Close mobile menu when clicking links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// GALLERY LIGHTBOX (Optional Enhancement)
// ========================================
document.querySelectorAll('.gallery-card-enhanced').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        console.log(`Gallery item clicked: ${category}`);
        // You can add a lightbox modal here
    });
});



// ========================================
// TESTIMONIAL SLIDER
// ========================================
class TestimonialSlider {
    constructor() {
        this.slider = document.getElementById('testimonialSlider');
        if (!this.slider) return;
        
        this.slides = this.slider.querySelectorAll('.testimonial-slide');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.indicators = document.querySelectorAll('#testimonialIndicators .indicator');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 6000;
        
        this.init();
    }
    
    init() {
        // Button listeners
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Indicator listeners
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch support
        this.addTouchSupport();
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    goToSlide(index) {
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Add active class to new slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.remove('prev');
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        // Remove prev class after animation
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 600);
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
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        
        this.slider.addEventListener('touchend', () => {
            if (startX - endX > 50) this.next();
            if (endX - startX > 50) this.prev();
        });
    }
}

// ========================================
// IMAGE CAROUSEL
// ========================================
class ImageCarousel {
    constructor() {
        this.carousel = document.getElementById('campusCarousel');
        if (!this.carousel) return;
        
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.thumbnails = document.querySelectorAll('.carousel-thumbnails .thumbnail');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        this.init();
    }
    
    init() {
        // Button listeners
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Thumbnail listeners
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && e.target.closest('.image-carousel-container')) this.prev();
            if (e.key === 'ArrowRight' && e.target.closest('.image-carousel-container')) this.next();
        });
        
        // Touch support
        this.addTouchSupport();
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    goToSlide(index) {
        // Remove active class
        this.slides[this.currentSlide].classList.remove('active');
        this.thumbnails[this.currentSlide].classList.remove('active');
        
        // Add active class
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.thumbnails[this.currentSlide].classList.add('active');
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
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', () => {
            if (startX - endX > 50) this.next();
            if (endX - startX > 50) this.prev();
        });
    }
}

// ========================================
// ANIMATED COUNTER
// ========================================
class CountUpAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count-up] .stat-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.counters[0].closest('.stats-counter-section'));
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        });
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-fade-in], .gallery-card, .about .content-wrapper > div');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

// ========================================
// INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sliders
    new TestimonialSlider();
    new ImageCarousel();
    new CountUpAnimation();
    new ScrollAnimations();
    
    // Add hover effects to buttons
    document.querySelectorAll('.submit-btn, .btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease';
        });
        btn.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / 600);
        });
    }
    
    console.log('✨ All interactive elements loaded successfully!');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to element
function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Add ripple effect to buttons
document.querySelectorAll('button, .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    button, .btn { position: relative; overflow: hidden; }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

