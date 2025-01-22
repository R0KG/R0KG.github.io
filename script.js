// Enhanced Navigation and Particle System
class HybridNavigation {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.navMap = new Map([
            ['#about', {x: 15, y: 30, color: '#00ff9d'}],
            ['#projects', {x: 45, y: 60, color: '#00ffff'}],
            ['#contact', {x: 75, y: 90, color: '#ff00ff'}]
        ]);
        
        this.initNavigation();
        this.addScrollSync();
    }

    initNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            const target = link.getAttribute('href');
            link.addEventListener('mouseenter', () => this.handleNavHover(target));
            link.addEventListener('click', (e) => this.handleNavClick(e, target));
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                '1': '#about', '2': '#projects', '3': '#contact',
                'ArrowUp': () => window.scrollBy(0, -window.innerHeight),
                'ArrowDown': () => window.scrollBy(0, window.innerHeight)
            };
            
            if (keyMap[e.key]) {
                e.preventDefault();
                typeof keyMap[e.key] === 'function' 
                    ? keyMap[e.key]() 
                    : this.navigateToSection(keyMap[e.key]);
            }
        });
    }

    handleNavHover(target) {
        const coords = this.navMap.get(target);
        if (coords) {
            this.particleSystem.createNavigationPulse({
                x: coords.x * window.innerWidth / 100,
                y: coords.y * window.innerHeight / 100,
                color: coords.color
            });
        }
    }

    handleNavClick(e, target) {
        e.preventDefault();
        this.navigateToSection(target);
    }

    navigateToSection(target) {
        const section = document.querySelector(target);
        if (!section) return;

        this.particleSystem.createSectionTransitionEffect(target);
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    addScrollSync() {
        let lastScroll = Date.now();
        window.addEventListener('scroll', () => {
            if (Date.now() - lastScroll > 100) {
                this.particleSystem.updateParticleFlow();
                lastScroll = Date.now();
            }
        }, { passive: true });
    }
}

class EnhancedParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.resizeCanvas();
        this.init();

        // Proper event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initParticles();
    }

    initParticles() {
        const density = Math.min(2, window.devicePixelRatio);
        this.particles = Array.from({ length: Math.floor((this.canvas.width * this.canvas.height) / 15000 * density) }, 
            () => this.createParticle());
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            life: 100,
            color: Math.random() > 0.5 ? '#00ffff' : '#50ff50'
        };
    }

    createNavigationPulse({ x, y, color }) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x,
                y,
                size: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8,
                life: 40,
                color
            });
        }
    }

    updateParticleFlow() {
        this.particles.forEach(particle => {
            particle.speedX *= 0.95;
            particle.speedY *= 0.95;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Performance optimization: Use Path2D
        this.particles.forEach((particle, index) => {
            // Update particle physics
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.5;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 50;
                particle.x -= (dx / distance) * force;
                particle.y -= (dy / distance) * force;
            }

            // Recycle particles
            if (particle.life <= 0 || particle.x < -100 || particle.x > this.canvas.width + 100 ||
                particle.y < -100 || particle.y > this.canvas.height + 100) {
                this.particles[index] = this.createParticle();
            }

            // Draw particle
            const path = new Path2D();
            path.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill(path);
        });

        this.drawConnections();
    }

    drawConnections() {
        const connectionThreshold = 100;
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionThreshold) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(128, 255, 128, ${0.3 * (1 - distance/connectionThreshold)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }

    createSectionTransitionEffect(sectionId) {
        const section = document.querySelector(sectionId);
        const rect = section.getBoundingClientRect();
        
        this.particles.forEach(particle => {
            const dx = rect.left - particle.x;
            const dy = rect.top - particle.y;
            particle.speedX = dx * 0.1;
            particle.speedY = dy * 0.1;
        });
    }
}

// Enhanced Contact Form with Validation
class EnhancedContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.initValidation();
        this.initHolographicEffects();
    }

    initValidation() {
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input, true));
        });
    }

    validateField(input, isBlur = false) {
        const isValid = input.checkValidity();
        const container = input.parentElement;
        
        container.classList.toggle('valid', isValid);
        container.classList.toggle('invalid', !isValid);
        
        if (isBlur && !isValid) {
            this.showErrorTooltip(input);
        }
    }

    showErrorTooltip(input) {
        const tooltip = document.createElement('div');
        tooltip.className = 'input-tooltip';
        tooltip.textContent = input.validationMessage;
        
        const rect = input.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 3000);
    }

    initHolographicEffects() {
        this.form.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            this.form.style.setProperty('--hologram-x', x);
            this.form.style.setProperty('--hologram-y', y);
        });
    }
}

// Initialize skill meters
function initializeSkillMeters() {
    const meters = document.querySelectorAll('.meter-fill');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };

    const meterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const meter = entry.target;
                const level = meter.dataset.level || '0';
                
                // Reset the meter
                meter.style.width = '0%';
                meter.style.opacity = '0';
                
                // Force a reflow
                meter.offsetHeight;
                
                // Add the animation class and show the meter
                meter.classList.add('animate-meter');
                meter.style.opacity = '1';
                
                // Animate to the target width with proper timing
                requestAnimationFrame(() => {
                    meter.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
                    meter.style.width = `${level}%`;
                });
                
                // Update the meter text with counting animation
                const meterText = meter.parentElement.querySelector('.meter-text');
                if (meterText) {
                    const targetLevel = parseInt(level);
                    let currentLevel = 0;
                    const duration = 1500; // 1.5 seconds to match the meter animation
                    const interval = 16; // ~60fps
                    const steps = duration / interval;
                    const increment = targetLevel / steps;
                    
                    const updateCounter = () => {
                        currentLevel = Math.min(currentLevel + increment, targetLevel);
                        meterText.textContent = `${Math.round(currentLevel)}%`;
                        
                        if (currentLevel < targetLevel) {
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    updateCounter();
                }
                
                observer.unobserve(meter);
            }
        });
    }, observerOptions);

    // Initialize each meter
    meters.forEach(meter => {
        // Ensure initial state
        meter.style.width = '0%';
        meter.style.opacity = '0';
        meter.style.visibility = 'visible';
        
        // Start observing
        meterObserver.observe(meter);
    });
}

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new EnhancedParticleSystem();
    const navigation = new HybridNavigation(particleSystem);
    const contactForm = new EnhancedContactForm();

    function animate() {
        particleSystem.draw();
        requestAnimationFrame(animate);
    }
    animate();

    // Initialize skill meters
    initializeSkillMeters();

    // Project card hover effects with enhanced 3D
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });

    // Terminal typing effect with cursor
    const terminalLines = document.querySelectorAll('.tech-list');
    let delay = 0;
    
    terminalLines.forEach(line => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '0';
        
        setTimeout(() => {
            line.style.opacity = '1';
            let i = 0;
            const cursor = document.createElement('span');
            cursor.classList.add('cursor');
            cursor.textContent = '█';
            line.appendChild(cursor);

            function type() {
                if (i < text.length) {
                    line.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                    i++;
                    setTimeout(type, 50);
                } else {
                    cursor.style.animation = 'blink 1s infinite';
                }
            }
            type();
        }, delay);
        delay += 1000;
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation and submission effect
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = form.querySelector('button');
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#f40';
                    input.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        input.style.animation = '';
                    }, 500);
                } else {
                    input.style.borderColor = '#0f0';
                }
            });

            if (isValid) {
                button.textContent = 'TRANSMITTING...';
                button.style.background = 'var(--cyber-gradient)';
                
                setTimeout(() => {
                    button.textContent = 'TRANSMITTED!';
                    form.reset();
                    inputs.forEach(input => {
                        input.style.borderColor = 'var(--neon-border-color)';
                    });
                    setTimeout(() => {
                        button.textContent = 'TRANSMIT';
                        button.style.background = '';
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Navigation functionality
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');

    // Handle scroll effects
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navContainer.classList.toggle('active');
    });

    // Navigation indicator
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = e.target.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            navIndicator.style.width = `${rect.width}px`;
            navIndicator.style.transform = `translateX(${rect.left + scrollLeft}px)`;
            navIndicator.style.left = '0';
            navIndicator.style.opacity = '1';
        });

        link.addEventListener('mouseleave', () => {
            navIndicator.style.opacity = '0';
        });
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navContainer.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 