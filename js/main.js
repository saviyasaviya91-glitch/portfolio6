/**
 * VIDUSHA NETHSARA PORTFOLIO
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initPreloader();
    initCustomCursor();
    initNavbar();
    initTypingEffect();
    initParticles();
    initScrollReveal();
    initSkillBars();
    initCounterAnimation();
    initPortfolioFilter();
    initContactForm();
    initThemeToggle();
    initScrollToTop();
    initSmoothScroll();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Follower follows with delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
        cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .service-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px) scale(1.5)`;
            cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px) scale(1.5)`;
            cursorFollower.style.borderColor = 'var(--accent-secondary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px) scale(1)`;
            cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px) scale(1)`;
            cursorFollower.style.borderColor = 'var(--accent-primary)';
        });
    });
}

/**
 * Navbar
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Typing Effect
 */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const words = [
        'Web Developer',
        'Graphics Designer',
        'UI/UX Designer',
        'Creative Thinker',
        'Problem Solver'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before new word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

/**
 * Particles Background
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and animation
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .skills-section, .service-card, .portfolio-item, .contact-content'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

/**
 * Skill Bars Animation
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        const windowHeight = window.innerHeight;
        
        skillBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            
            if (barTop < windowHeight - 100) {
                const width = bar.getAttribute('data-width');
                bar.style.width = `${width}%`;
            }
        });
    };
    
    window.addEventListener('scroll', animateSkillBars);
    setTimeout(animateSkillBars, 1000); // Initial check after preloader
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const animateCounters = () => {
        const windowHeight = window.innerHeight;
        
        counters.forEach(counter => {
            const counterTop = counter.getBoundingClientRect().top;
            
            if (counterTop < windowHeight - 100 && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / speed;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            }
        });
    };
    
    window.addEventListener('scroll', animateCounters);
    setTimeout(animateCounters, 1500); // Initial check after preloader
}

/**
 * Portfolio Filter
 */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact Form Validation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('form-success');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: /.{10,500}/
    };
    
    // Error messages
    const errorMessages = {
        name: 'Please enter a valid name (2-50 characters)',
        email: 'Please enter a valid email address',
        message: 'Message must be between 10-500 characters'
    };
    
    // Validate field
    function validateField(input, pattern, errorId) {
        const errorElement = document.getElementById(errorId);
        const value = input.value.trim();
        
        if (!pattern.test(value)) {
            errorElement.textContent = errorMessages[input.name];
            errorElement.classList.add('show');
            input.style.borderColor = '#ff4757';
            return false;
        } else {
            errorElement.classList.remove('show');
            input.style.borderColor = 'var(--accent-primary)';
            return true;
        }
    }
    
    // Real-time validation
    nameInput.addEventListener('blur', () => {
        validateField(nameInput, patterns.name, 'name-error');
    });
    
    emailInput.addEventListener('blur', () => {
        validateField(emailInput, patterns.email, 'email-error');
    });
    
    messageInput.addEventListener('blur', () => {
        validateField(messageInput, patterns.message, 'message-error');
    });
    
    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            const errorId = `${input.name}-error`;
            const errorElement = document.getElementById(errorId);
            errorElement.classList.remove('show');
            input.style.borderColor = 'var(--border-color)';
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput, patterns.name, 'name-error');
        const isEmailValid = validateField(emailInput, patterns.email, 'email-error');
        const isMessageValid = validateField(messageInput, patterns.message, 'message-error');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Show success message
            successMessage.classList.add('show');
            form.reset();
            
            // Reset border colors
            [nameInput, emailInput, messageInput].forEach(input => {
                input.style.borderColor = 'var(--border-color)';
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            // Here you would normally send the form data to a server
            console.log('Form submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });
        }
    });
}

/**
 * Theme Toggle
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effect for Hero
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-gradient, .particles');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/**
 * Add hover effect to portfolio cards
 */
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
