// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#0ff', '#f0f', '#0f0', '#ff0'];
        this.init();

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    init() {
        this.resizeCanvas();
        const particleCount = Math.min(120, Math.floor(window.innerWidth / 15));
        this.particles = Array(particleCount).fill().map(() => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 2.5 + 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        }));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if(particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if(particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            this.particles.slice(i + 1).forEach(p2 => {
                const dx = particle.x - p2.x;
                const dy = particle.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    const gradient = this.ctx.createLinearGradient(particle.x, particle.y, p2.x, p2.y);
                    gradient.addColorStop(0, particle.color.replace(')', ', 0.4)'));
                    gradient.addColorStop(1, p2.color.replace(')', ', 0.4)'));
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = Math.max(0.5, 1 - distance/150);
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Initialize and animate
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();

    function animate() {
        particleSystem.draw();
        requestAnimationFrame(animate);
    }
    animate();

    // Holographic Header Effect
    const header = document.querySelector('header');
    let scrollPos = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.style.background = currentScroll > 50 
            ? `linear-gradient(45deg, 
                rgba(0, 0, 0, 0.95) 0%, 
                rgba(32, 0, 64, 0.95) 100%)`
            : 'transparent';
        
        header.style.boxShadow = currentScroll > 50
            ? '0 4px 30px rgba(0, 255, 255, 0.15)'
            : 'none';
            
        scrollPos = currentScroll;
    });

    // Digital glitch effect
    setInterval(() => {
        const glitchText = document.createElement('div');
        glitchText.className = 'digital-glitch';
        glitchText.style.left = Math.random() * window.innerWidth + 'px';
        glitchText.style.top = Math.random() * window.innerHeight + 'px';
        glitchText.style.color = ['#0ff', '#f0f', '#0f0'][Math.floor(Math.random() * 3)];
        glitchText.textContent = Math.random().toString(16).substr(2, 8);
        document.body.appendChild(glitchText);

        setTimeout(() => {
            glitchText.remove();
        }, 1000);
    }, 2000);
}); 