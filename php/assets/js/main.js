/**
 * Creative Web Solutions - Main JavaScript
 * Modern IT Company Website
 * Royal Blue Theme with Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Temporary live image URLs for internal banners and service visuals.
    // Replace these URLs later with your final hosted images.
    const LIVE_IMAGE_URLS = {
        internalBanner: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
        internalVisual: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        serviceBanner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
        serviceVisual: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'
    };
    const SECTION_IMAGE_BANK = {
        service: [
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
        ],
        course: [
            'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80'
        ],
        contact: [
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80'
        ],
        legal: [
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'
        ],
        package: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'
        ],
        process: [
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80'
        ]
    };
    
    // ============================================
    // Preloader
    // ============================================
    const preloader = document.getElementById('preloader') || document.querySelector('.preloader');
    
    // Function to hide preloader
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('loaded');
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    
    // Hide preloader on page load
    window.addEventListener('load', hidePreloader);
    
    // Fallback - hide preloader after 1.5 seconds max
    setTimeout(hidePreloader, 1500);

    // ============================================
    // Initialize AOS Animation Library
    // ============================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }

    // ============================================
    // Internal Banner Images
    // ============================================
    function applyLiveBannerImages() {
        document.querySelectorAll('.page-header').forEach((section) => {
            section.classList.add('has-live-banner');
            section.style.backgroundImage = `linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 58, 138, 0.74)), url("${LIVE_IMAGE_URLS.internalBanner}")`;
        });

        document.querySelectorAll('.service-hero').forEach((section) => {
            section.style.backgroundImage = `linear-gradient(135deg, rgba(15, 23, 42, 0.52), rgba(30, 58, 138, 0.38)), url("${LIVE_IMAGE_URLS.serviceBanner}")`;
            section.style.backgroundSize = 'cover';
            section.style.backgroundPosition = 'center';

            if (section.querySelector('.service-live-visual')) {
                return;
            }

            const row = section.querySelector('.row');
            const hasHeroImage = !!section.querySelector('img');

            if (!row || hasHeroImage) {
                return;
            }

            const columns = Array.from(row.children).filter((child) => child.className && child.className.includes('col-'));
            const mediaColumn = columns[1];

            if (!mediaColumn) {
                return;
            }

            const visualWrapper = document.createElement('div');
            visualWrapper.className = 'service-live-visual';
            visualWrapper.innerHTML = `
                <img src="${LIVE_IMAGE_URLS.serviceVisual}" alt="Creative Web Solutions service preview" loading="lazy">
                <div class="service-live-visual-meta">
                    <strong>Temporary service image</strong>
                    <span>Update this live URL later from main.js</span>
                </div>
            `;

            const cardHost = mediaColumn.firstElementChild;
            if (cardHost && cardHost.children.length > 0) {
                cardHost.appendChild(visualWrapper);
            } else {
                mediaColumn.appendChild(visualWrapper);
            }
        });

        document.querySelectorAll('.course-detail-hero').forEach((section) => {
            section.style.backgroundImage = `linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 58, 138, 0.72)), url("${LIVE_IMAGE_URLS.internalBanner}")`;
            section.style.backgroundSize = 'cover';
            section.style.backgroundPosition = 'center';
        });
    }

    applyLiveBannerImages();

    // ============================================
    // Section Images
    // ============================================
    function createSectionImageBlock(src, label, alt) {
        const media = document.createElement('div');
        media.className = 'section-card-media';

        const image = document.createElement('img');
        image.src = src;
        image.alt = alt;
        image.loading = 'lazy';

        const tag = document.createElement('span');
        tag.className = 'section-card-media-label';
        tag.textContent = label;

        media.appendChild(image);
        media.appendChild(tag);
        return media;
    }

    function decorateCards(selector, images, label) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            if (card.querySelector('.section-card-media') || card.querySelector('img')) {
                return;
            }

            const titleEl = card.querySelector('h1, h2, h3, h4, h5, strong');
            const titleText = titleEl ? titleEl.textContent.trim() : label;
            const imageSrc = images[index % images.length];
            const imageBlock = createSectionImageBlock(imageSrc, label, `${titleText} preview`);
            card.insertBefore(imageBlock, card.firstChild);
        });
    }

    function applySectionImages() {
        decorateCards('.service-card, .service-card-light, .web-card, .app-card, .crm-card, .custom-card, .erp-card', SECTION_IMAGE_BANK.service, 'Section Image');
        decorateCards('.course-card', SECTION_IMAGE_BANK.course, 'Course Image');
        decorateCards('.contact-info-card', SECTION_IMAGE_BANK.contact, 'Contact Visual');
        decorateCards('.legal-section', SECTION_IMAGE_BANK.legal, 'Info Visual');
        decorateCards('.package-card', SECTION_IMAGE_BANK.package, 'Package View');
        decorateCards('.process-step', SECTION_IMAGE_BANK.process, 'Process Visual');
    }

    applySectionImages();

    // ============================================
    // Configure Lightbox2 for Portfolio
    // ============================================
    if (typeof lightbox !== 'undefined' && lightbox !== null) {
        try {
            lightbox.option({
                'resizeDuration': 300,
                'wrapAround': true,
                'albumLabel': 'Image %1 of %2',
                'fadeDuration': 300,
                'imageFadeDuration': 300,
                'positionFromTop': 50,
                'showImageNumberLabel': true,
                'disableScrolling': true
            });
        } catch(e) {
            console.log('Lightbox initialization skipped');
        }
    }

    // ============================================
    // Initialize Swiper Hero Slider
    // ============================================
    if (typeof Swiper !== 'undefined') {
        // Hero Slider - only initialize if element exists
        const heroSliderEl = document.querySelector('.hero-swiper');
        if (heroSliderEl) {
            const heroSwiper = new Swiper('.hero-swiper', {
                // Basic settings
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                speed: 1000,
                
                // Autoplay
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                
                // Pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                
                // Navigation
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }

        // Tech Slider - only initialize if element exists
        const techSliderEl = document.querySelector('.tech-slider');
        if (techSliderEl && techSliderEl instanceof Element) {
            try {
                const techSwiper = new Swiper('.tech-slider', {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    loop: true,
                    speed: 800,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    breakpoints: {
                        576: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 4,
                        },
                        992: {
                            slidesPerView: 5,
                        },
                        1200: {
                            slidesPerView: 6,
                        }
                    }
                });
            } catch(e) {
                console.log('Tech slider initialization skipped:', e);
            }
        }
    }

    // ============================================
    // Sticky Header on Scroll
    // ============================================
    const header = document.getElementById('header');
    const topbar = document.getElementById('topbar');
    
    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load

    // ============================================
    // Mobile Menu Toggle Animation
    // ============================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Create mobile overlay
    let mobileOverlay = document.querySelector('.mobile-menu-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileOverlay);
    }
    
    function closeMobileMenu() {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarToggler.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    }
    
    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('active');
            if (navbarCollapse.classList.contains('show')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close menu when clicking close button
        const mobileCloseBtn = document.querySelector('.mobile-close-btn');
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking outside (but not floating buttons)
        document.addEventListener('click', function(e) {
            const isFloatingButton = e.target.closest('.back-to-top, .whatsapp-float, .chatbot-container');
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target) && !isFloatingButton) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize (if going to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // Back to Top Button
    // ============================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                    if (navbarToggler) {
                        navbarToggler.classList.remove('active');
                    }
                }
            }
        });
    });

    // ============================================
    // Counter Animation for Stats
    // ============================================
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Intersection Observer for Counter Animation
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
        
        // Fallback: Trigger animation after 1 second if still at 0
        setTimeout(() => {
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }, 1000);
    }

    // ============================================
    // Form Validation & Submission
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Simple validation
            const fields = [firstName, lastName, email, phone, service, message];
            
            fields.forEach(field => {
                if (field && field.hasAttribute('required') && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else if (field) {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Email validation
            if (email && email.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email.value)) {
                    isValid = false;
                    email.classList.add('is-invalid');
                }
            }
            
            // Phone validation (basic)
            if (phone && phone.value) {
                const phonePattern = /^[\d\s+()-]{10,}$/;
                if (!phonePattern.test(phone.value)) {
                    isValid = false;
                    phone.classList.add('is-invalid');
                }
            }
            
            if (isValid) {
                // Show success message (replace with actual form submission)
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.classList.add('btn-success');
                    
                    // Reset form
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.classList.remove('btn-success');
                        submitBtn.disabled = false;
                        
                        // Show success alert
                        showAlert('success', 'Thank you! Your message has been sent successfully. We will get back to you soon.');
                    }, 2000);
                }, 1500);
            }
        });
        
        // Remove invalid class on input
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }
    
    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button');
            
            if (emailInput && emailInput.value) {
                const originalIcon = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.innerHTML = originalIcon;
                    showAlert('success', 'Thank you for subscribing to our newsletter!');
                }, 1500);
            }
        });
    });

    // ============================================
    // Alert Function
    // ============================================
    function showAlert(type, message) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close" aria-label="Close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Trigger animation
        setTimeout(() => alertDiv.classList.add('show'), 10);
        
        // Close button
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        });
        
        // Auto close
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.classList.remove('show');
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, 5000);
    }

    // ============================================
    // Typing Effect for Hero Title (Single Implementation)
    // ============================================
    // Removed duplicate - using the hero-specific implementation below

    // ============================================
    // Parallax Effect for Hero Section
    // ============================================
    const heroSection = document.querySelector('.hero-slider-section');
    
    if (heroSection && heroSection instanceof Element) {
        window.addEventListener('scroll', function() {
            try {
                const scrolled = window.scrollY;
                const heroHeight = heroSection.offsetHeight;
                
                if (scrolled < heroHeight && heroSection.style) {
                    const parallaxValue = scrolled * 0.4;
                    heroSection.style.backgroundPositionY = `${parallaxValue}px`;
                }
            } catch(e) {
                // Silently handle error
            }
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ============================================
    // Scroll to Hash on Page Load
    // ============================================
    if (window.location.hash) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        
        if (target) {
            setTimeout(() => {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // ============================================
    // Service Card Hover Effect
    // ============================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // Testimonial Slider (if exists)
    // ============================================
    const testimonialSliderEl = document.querySelector('.testimonial-slider');
    if (typeof Swiper !== 'undefined' && testimonialSliderEl && testimonialSliderEl instanceof Element) {
        try {
            new Swiper('.testimonial-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                speed: 800,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.testimonial-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    }
                }
            });
        } catch(e) {
            console.log('Testimonial slider initialization skipped:', e);
        }
    }

    // ============================================
    // Custom Alert Styles (Inject CSS)
    // ============================================
    const alertStyles = document.createElement('style');
    alertStyles.textContent = `
        .custom-alert {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            padding: 20px 25px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        .custom-alert.show {
            transform: translateX(0);
        }
        .custom-alert.alert-success {
            border-left: 4px solid #10b981;
        }
        .custom-alert.alert-error {
            border-left: 4px solid #ef4444;
        }
        .alert-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .alert-content i {
            font-size: 24px;
        }
        .alert-success i {
            color: #10b981;
        }
        .alert-error i {
            color: #ef4444;
        }
        .alert-content span {
            flex: 1;
            font-size: 14px;
            line-height: 1.5;
        }
        .alert-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }
        .alert-close:hover {
            color: #333;
        }
    `;
    document.head.appendChild(alertStyles);

    // ============================================
    // Tilt Effect for Cards (Parallax)
    // ============================================
    try {
        const tiltCards = document.querySelectorAll('.service-card, .course-card, .testimonial-card');
        
        if (tiltCards && tiltCards.length > 0) {
            tiltCards.forEach(card => {
                if (card && card instanceof Element) {
                    card.addEventListener('mousemove', function(e) {
                        try {
                            const rect = this.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = (y - centerY) / 20;
                            const rotateY = (centerX - x) / 20;
                            
                            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                        } catch(err) {}
                    });
                    
                    card.addEventListener('mouseleave', function() {
                        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                    });
                }
            });
        }
    } catch(e) {
        console.log('Tilt effect skipped');
    }

    // ============================================
    // Magnetic Button Effect
    // ============================================
    try {
        const magneticBtns = document.querySelectorAll('.btn-primary-custom, .btn-white');
        
        if (magneticBtns && magneticBtns.length > 0) {
            magneticBtns.forEach(btn => {
                if (btn && btn instanceof Element) {
                    btn.addEventListener('mousemove', function(e) {
                        try {
                            const rect = this.getBoundingClientRect();
                            const x = e.clientX - rect.left - rect.width / 2;
                            const y = e.clientY - rect.top - rect.height / 2;
                            
                            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                        } catch(err) {}
                    });
                    
                    btn.addEventListener('mouseleave', function() {
                        this.style.transform = 'translate(0, 0)';
                    });
                }
            });
        }
    } catch(e) {
        console.log('Magnetic effect skipped');
    }

    // ============================================
    // Ripple Effect on Buttons
    // ============================================
    try {
        const rippleBtns = document.querySelectorAll('.btn-primary-custom, .btn-course, .btn-white');
        
        if (rippleBtns && rippleBtns.length > 0) {
            rippleBtns.forEach(btn => {
                if (btn && btn instanceof Element) {
                    btn.addEventListener('click', function(e) {
                        try {
                            const rect = this.getBoundingClientRect();
                            const ripple = document.createElement('span');
                            ripple.className = 'ripple-effect';
                            ripple.style.left = `${e.clientX - rect.left}px`;
                            ripple.style.top = `${e.clientY - rect.top}px`;
                            this.appendChild(ripple);
                            
                            setTimeout(() => ripple.remove(), 600);
                        } catch(err) {}
                    });
                }
            });
        }
    } catch(e) {
        console.log('Ripple effect skipped');
    }

    // Add ripple styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .ripple-effect {
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: translate(-50%, -50%) scale(40);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);

    // ============================================
    // Text Typing Effect for Hero
    // ============================================
    const typingText = document.querySelector('.hero-title .typing-text');
    if (typingText && typingText instanceof Element) {
        const words = ['Web Development', 'App Development', 'Digital Marketing', 'UI/UX Design'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            try {
                const currentWord = words[wordIndex];
                
                if (isDeleting) {
                    typingText.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingText.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                let typeSpeed = isDeleting ? 50 : 100;
                
                if (!isDeleting && charIndex === currentWord.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500;
                }
                
                setTimeout(typeEffect, typeSpeed);
            } catch(e) {
                console.log('Typing effect error:', e);
            }
        }
        
        setTimeout(typeEffect, 1000);
    }

    // ============================================
    // AI Chatbot Functionality
    // ============================================
    // Chatbot will be initialized on window load to ensure all elements are ready

});

// Initialize chatbot after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

// ============================================
// AI Chatbot Functions
// ============================================
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatBadge = document.getElementById('chatBadge');
    
    if (!chatbotToggle) return;
    
    // Chatbot Knowledge Base
    const knowledgeBase = {
        services: {
            keywords: ['service', 'services', 'what do you do', 'offer', 'provide'],
            response: `We offer a wide range of IT services:\n\n🌐 **Website Development** - Custom websites, e-commerce, CMS\n📱 **Mobile App Development** - iOS, Android, Cross-platform\n💻 **Custom Software Development** - ERP, CRM, GST Software\n🎨 **UI/UX & Graphics Design** - Modern, user-centric designs\n🔗 **Blockchain Development** - Smart contracts, DApps\n📈 **Digital Marketing** - SEO, SMM, PPC campaigns\n\nWhich service interests you?`
        },
        courses: {
            keywords: ['course', 'courses', 'training', 'learn', 'education', 'teach'],
            response: `📚 Our Popular Courses:\n\n• **Full Stack Web Development** - 6 months\n• **Mobile App Development** - 4 months\n• **Digital Marketing** - 3 months\n• **UI/UX Design** - 3 months\n• **Data Science & AI** - 6 months\n• **Cloud Computing** - 4 months\n\n✅ Live Projects\n✅ Industry Experts\n✅ Job Assistance\n\nWould you like more details about any course?`
        },
        contact: {
            keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'call'],
            response: `📞 Contact Us:\n\n📍 **Address:** New Delhi, India\n📧 **Email:** info@cwsindia.online\n📱 **Phone:** +91-XXXXXXXXXX\n\n⏰ **Business Hours:**\nMon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed\n\nYou can also fill out our contact form on the website!`
        },
        pricing: {
            keywords: ['price', 'pricing', 'cost', 'rate', 'charge', 'fee', 'budget', 'quote'],
            response: `💰 Our pricing is competitive and project-based.\n\nFor accurate pricing, we need to understand:\n• Project requirements\n• Timeline\n• Features needed\n\n🎁 **Free Consultation Available!**\n\nWould you like to schedule a free consultation call?`
        },
        consultation: {
            keywords: ['consultation', 'consult', 'meeting', 'discuss', 'free', 'appointment'],
            response: `📅 **Free Consultation**\n\nYes! We offer FREE consultation for all new projects.\n\n✅ Understand your requirements\n✅ Suggest best solutions\n✅ Provide timeline & estimate\n✅ Answer all your questions\n\n📞 Book via: Contact page\n📧 Or email: info@cwsindia.online\n\nShall I redirect you to our contact page?`
        },
        about: {
            keywords: ['about', 'company', 'who', 'team', 'experience', 'history'],
            response: `🏢 **About Creative Web Solutions**\n\nWe are a leading IT solutions company based in India.\n\n🎯 **Our Mission:** Transform businesses through technology\n\n✨ **What Makes Us Different:**\n• 5+ Years Experience\n• 500+ Projects Delivered\n• 200+ Happy Clients\n• Expert Team of Developers\n• 24/7 Support\n\nWe believe in quality, innovation, and client satisfaction!`
        },
        portfolio: {
            keywords: ['portfolio', 'work', 'project', 'example', 'showcase', 'previous'],
            response: `💼 **Our Portfolio**\n\nWe've worked with clients across various industries:\n\n🛒 E-commerce Platforms\n🏥 Healthcare Solutions\n🏫 Education Systems\n🏦 Banking & Finance Apps\n🏭 Manufacturing ERP\n\nVisit our Portfolio page to see live examples!\n\nWould you like to see specific industry projects?`
        },
        greeting: {
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
            response: `Hello! 👋 Welcome to Creative Web Solutions!\n\nI'm here to help you with:\n• Our Services & Solutions\n• Course Information\n• Pricing & Quotes\n• General Inquiries\n\nHow can I assist you today?`
        },
        thanks: {
            keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful'],
            response: `You're welcome! 😊\n\nI'm glad I could help. If you have any more questions, feel free to ask.\n\nHave a great day! 🌟`
        },
        blockchain: {
            keywords: ['blockchain', 'crypto', 'smart contract', 'web3', 'nft', 'defi'],
            response: `🔗 **Blockchain Development Services**\n\n• Smart Contract Development (Solidity)\n• DApp Development\n• NFT Marketplace\n• DeFi Solutions\n• Token Development\n• Exchange Listing Support\n• Web3 Integration\n\nOur blockchain experts can help bring your idea to life!\n\nInterested in a blockchain project?`
        },
        ecommerce: {
            keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'shopping', 'cart'],
            response: `🛒 **E-commerce Solutions**\n\nWe build powerful online stores:\n\n• Custom E-commerce Development\n• Shopify / WooCommerce\n• Payment Gateway Integration\n• Inventory Management\n• Multi-vendor Marketplace\n• Mobile Commerce Apps\n\n🎁 Special: Complete e-commerce package available!\n\nWant to launch your online store?`
        }
    };
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        chatbotWindow.classList.toggle('active');
        if (chatBadge) chatBadge.style.display = 'none';
        if (chatbotWindow.classList.contains('active')) {
            setTimeout(() => {
                if (chatInput) chatInput.focus();
            }, 300);
        }
    });
    
    // Close button
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatbotToggle.classList.remove('active');
            chatbotWindow.classList.remove('active');
        });
    }
    
    // Send message on button click
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Quick reply buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-reply-btn')) {
            const message = e.target.dataset.message;
            if (message) {
                // Hide all quick replies in the chat
                document.querySelectorAll('.quick-replies').forEach(qr => {
                    qr.style.display = 'none';
                });
                
                addMessage(message, 'user');
                
                // Show typing indicator
                showTyping();
                
                // Get bot response after delay
                setTimeout(() => {
                    hideTyping();
                    getBotResponse(message);
                }, 1200);
            }
        }
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTyping();
        
        // Get bot response after delay
        setTimeout(() => {
            hideTyping();
            getBotResponse(message);
        }, 1500);
    }
    
    function addMessage(text, sender, quickReplies = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const icon = sender === 'bot' ? 'fa-robot' : 'fa-user';
        
        // Convert markdown-like formatting to HTML
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        // Build quick replies HTML
        let quickRepliesHTML = '';
        if (sender === 'bot' && quickReplies.length > 0) {
            quickRepliesHTML = '<div class="quick-replies">';
            quickReplies.forEach(reply => {
                quickRepliesHTML += `<button class="quick-reply-btn" data-message="${reply}">${reply}</button>`;
            });
            quickRepliesHTML += '</div>';
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${icon}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">${formattedText}</div>
                <span class="message-time">${time}</span>
                ${quickRepliesHTML}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';
        let quickReplies = [];
        
        // Search through knowledge base
        for (const [category, data] of Object.entries(knowledgeBase)) {
            for (const keyword of data.keywords) {
                if (message.includes(keyword)) {
                    response = data.response;
                    
                    // Add contextual quick replies based on category
                    if (category === 'services') {
                        quickReplies = ['Web Development', 'Mobile Apps', 'Pricing Info'];
                    } else if (category === 'courses') {
                        quickReplies = ['Course Fees', 'Batch Timings', 'Free Demo'];
                    } else if (category === 'pricing' || category === 'consultation') {
                        quickReplies = ['Book Consultation', 'Contact Us', 'View Portfolio'];
                    } else if (category === 'greeting') {
                        quickReplies = ['Our Services', 'Courses', 'Get Quote'];
                    }
                    break;
                }
            }
            if (response) break;
        }
        
        // Enhanced pattern matching for common questions
        if (!response) {
            if (message.includes('website') || message.includes('web')) {
                response = `🌐 **Website Development**\n\nWe create stunning, high-performance websites:\n\n• Corporate Websites\n• E-commerce Stores\n• Landing Pages\n• Web Applications\n• CMS Development\n\n**Technologies:** PHP, Laravel, React, Vue.js, WordPress\n\n💰 Starting from ₹15,000\n\nWant a custom quote for your website?`;
                quickReplies = ['Get Quote', 'View Portfolio', 'Free Consultation'];
            } else if (message.includes('app') || message.includes('mobile') || message.includes('android') || message.includes('ios')) {
                response = `📱 **Mobile App Development**\n\nWe build powerful mobile applications:\n\n• Android Apps (Kotlin/Java)\n• iOS Apps (Swift)\n• Cross-Platform (Flutter/React Native)\n• Progressive Web Apps\n\n✅ UI/UX Design Included\n✅ Backend Development\n✅ App Store Publishing\n\nTell me about your app idea!`;
                quickReplies = ['Android App', 'iOS App', 'Get Quote'];
            } else if (message.includes('time') || message.includes('duration') || message.includes('how long')) {
                response = `⏱️ **Project Timeline**\n\nTypical project durations:\n\n• Simple Website: 1-2 weeks\n• E-commerce Store: 2-4 weeks\n• Mobile App: 4-8 weeks\n• Custom Software: 8-16 weeks\n\nTimelines depend on:\n• Project complexity\n• Features required\n• Revisions needed\n\nWant an estimate for your project?`;
                quickReplies = ['Get Timeline', 'Start Project', 'Contact Us'];
            } else if (message.includes('payment') || message.includes('pay')) {
                response = `💳 **Payment Options**\n\nWe offer flexible payment terms:\n\n• 50% Advance + 50% on Delivery\n• Milestone-based Payments\n• EMI Options Available\n\n**Accepted Methods:**\n• Bank Transfer\n• UPI\n• Credit/Debit Cards\n• PayPal (International)\n\nNeed more details about payment?`;
                quickReplies = ['Start Project', 'Contact Us'];
            } else if (message.includes('support') || message.includes('help') || message.includes('issue') || message.includes('problem')) {
                response = `🛠️ **Support & Maintenance**\n\nWe provide comprehensive support:\n\n• 24/7 Technical Support\n• Bug Fixes & Updates\n• Performance Optimization\n• Security Patches\n• Feature Enhancements\n\n📧 Email: support@cwsindia.online\n📞 Call: +91-7015969967\n\nHow can we help you today?`;
                quickReplies = ['Report Issue', 'Contact Support'];
            } else if (message.includes('demo') || message.includes('trial')) {
                response = `🎯 **Free Demo Available!**\n\nYes, we offer free demos:\n\n• **Courses:** Free trial class\n• **Software:** Product walkthrough\n• **Services:** Sample work showcase\n\n📅 Book your free demo now!\n\nWhich demo would you like?`;
                quickReplies = ['Course Demo', 'Software Demo', 'Book Now'];
            } else if (message.includes('job') || message.includes('career') || message.includes('hiring') || message.includes('vacancy')) {
                response = `💼 **Career Opportunities**\n\nWe're always looking for talented individuals!\n\n**Current Openings:**\n• Full Stack Developer\n• Mobile App Developer\n• UI/UX Designer\n• Digital Marketing Executive\n\n📧 Send resume to: hr@cwsindia.online\n\nJoin our growing team!`;
                quickReplies = ['View Openings', 'Contact HR'];
            } else if (message.includes('location') || message.includes('office') || message.includes('where')) {
                response = `📍 **Our Location**\n\n**Creative Web Solutions**\nNew Delhi, India\n\n⏰ **Office Hours:**\nMonday - Saturday: 9:00 AM - 7:00 PM\nSunday: Closed\n\n📞 +91-7015969967\n📧 info@cwsindia.online\n\nVisit us anytime during office hours!`;
                quickReplies = ['Get Directions', 'Contact Us'];
            } else if (message.includes('yes') || message.includes('sure') || message.includes('okay') || message.includes('ok')) {
                response = `Great! 🎉\n\nTo proceed, you can:\n\n1️⃣ **Call us:** +91-7015969967\n2️⃣ **Email:** info@cwsindia.online\n3️⃣ **Visit:** Contact page on our website\n\nOur team will get back to you within 24 hours!\n\nAnything else you'd like to know?`;
                quickReplies = ['Contact Page', 'More Services', 'Pricing'];
            } else if (message.includes('no') || message.includes('not now') || message.includes('later')) {
                response = `No problem! 😊\n\nFeel free to reach out whenever you're ready. We're here to help!\n\n💡 Tip: Save our number: +91-7015969967\n\nIs there anything else I can help with?`;
                quickReplies = ['Our Services', 'Courses', 'Contact'];
            } else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
                response = `Goodbye! 👋\n\nThank you for chatting with Creative Web Solutions!\n\nRemember, we're just a message away whenever you need us.\n\nHave a wonderful day! 🌟`;
                quickReplies = [];
            }
        }
        
        // Default response if still no match
        if (!response) {
            response = `Thanks for your message! 🤔\n\nI'm here to help with:\n\n• **Services** - Web, App, Software Development\n• **Courses** - IT Training Programs\n• **Pricing** - Project Quotes\n• **Support** - Technical Assistance\n\nCould you please rephrase or choose an option below?`;
            quickReplies = ['Our Services', 'Courses', 'Get Quote', 'Contact Us'];
        }
        
        addMessage(response, 'bot', quickReplies);
    }
    
    // Show notification badge after 5 seconds
    setTimeout(() => {
        if (!chatbotWindow.classList.contains('active') && chatBadge) {
            chatBadge.style.display = 'flex';
        }
    }, 5000);
}

// ============================================
// Window Load Event
// ============================================
window.addEventListener('load', function() {
    // Refresh AOS on load
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});
