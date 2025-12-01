/**
 * Modern Effects & Interactions
 * VLCS@SCU Website Enhancement
 */

(function() {
    'use strict';

    // ========================================
    // Smooth Scroll with Offset
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // Navbar Scroll Effect (Optimized)
    // ========================================
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar-modern');
    let navbarTicking = false;
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (!navbarTicking) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;
                    
                    // Add shadow on scroll
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    
                    // Hide/show navbar on scroll (disabled for better UX)
                    // if (currentScroll > lastScroll && currentScroll > 100) {
                    //     navbar.style.transform = 'translateY(-100%)';
                    // } else {
                    //     navbar.style.transform = 'translateY(0)';
                    // }
                    
                    lastScroll = currentScroll;
                    navbarTicking = false;
                });
                navbarTicking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to elements
    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });

    // ========================================
    // Card Hover Effects
    // ========================================
    document.querySelectorAll('.card-modern, .feature-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ========================================
    // Parallax Effect - Disabled for better performance
    // ========================================
    // Parallax effect can cause scroll jank, disabled for smoother experience

    // ========================================
    // Active Navigation Link
    // ========================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ========================================
    // Typing Effect for Hero Text
    // ========================================
    const typeText = document.getElementById('genetext');
    if (typeText && typeText.textContent.trim()) {
        const originalText = typeText.textContent;
        typeText.textContent = '';
        let charIndex = 0;
        
        function type() {
            if (charIndex < originalText.length) {
                typeText.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 50);
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 500);
    }

    // ========================================
    // Carousel Enhancement
    // ========================================
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        // Initialize carousel with custom options
        const carouselElement = document.getElementById('carouselExampleCaptions');
        if (carouselElement) {
            const bsCarousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000,
                pause: 'hover',
                wrap: true,
                touch: true
            });
            
            // Add smooth transition on slide change
            carouselElement.addEventListener('slide.bs.carousel', function (e) {
                // Reset caption animation for incoming slide
                const incomingCaption = e.relatedTarget.querySelector('.carousel-caption');
                if (incomingCaption) {
                    incomingCaption.style.opacity = '0';
                    incomingCaption.style.transform = 'translateX(-30px)';
                }
            });
            
            carouselElement.addEventListener('slid.bs.carousel', function (e) {
                // Trigger caption animation after slide completes
                const activeCaption = e.relatedTarget.querySelector('.carousel-caption');
                if (activeCaption) {
                    setTimeout(() => {
                        activeCaption.style.opacity = '1';
                        activeCaption.style.transform = 'translateX(0)';
                    }, 100);
                }
            });
            
            // Preload images for smoother transitions
            const images = carousel.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', function() {
                        this.style.opacity = '1';
                    });
                }
            });
        }
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) bsCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) bsCarousel.cycle();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                if (e.key === 'ArrowLeft') {
                    bsCarousel.prev();
                } else if (e.key === 'ArrowRight') {
                    bsCarousel.next();
                }
            }
        });
    }

    // ========================================
    // Accordion Enhancement
    // ========================================
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            // Add smooth scroll to accordion item
            setTimeout(() => {
                const accordionItem = this.closest('.accordion-item');
                if (accordionItem && !this.classList.contains('collapsed')) {
                    accordionItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 350);
        });
    });

    // ========================================
    // Loading Animation
    // ========================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ========================================
    // Back to Top Button
    // ========================================
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    // ========================================
    // Performance: Lazy Load Images
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Console Easter Egg
    // ========================================
    console.log('%c🔬 VLCS@SCU', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cVisible Light Communication & Sensing Laboratory', 'font-size: 14px; color: #667eea;');
    console.log('%c探索光的无限可能 · 连接智能未来', 'font-size: 12px; color: #764ba2;');
    console.log('%cInterested in joining us? Contact: yangyanbing@scu.edu.cn', 'font-size: 11px; color: #4a5568;');

})();
