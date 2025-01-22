// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrixCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.drops = [];
        this.fontSize = 14;
        this.init();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.init();
    }

    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00ff00';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            const gradient = this.ctx.createLinearGradient(0, this.drops[i] * this.fontSize - 20, 0, this.drops[i] * this.fontSize);
            gradient.addColorStop(0, '#0f0');
            gradient.addColorStop(1, '#00ff9d');
            this.ctx.fillStyle = gradient;
            this.ctx.font = this.fontSize + 'px monospace';
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        this.ctx.shadowBlur = 0;
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resizeCanvas();
        this.init();

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                life: Math.random() * 100,
                color: Math.random() > 0.5 ? '#00ffff' : '#50ff50'
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.shadowBlur = 15;

        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.1;

            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * 1;
                particle.y -= Math.sin(angle) * 1;
                particle.size = Math.min(particle.size * 1.05, 5);
            }

            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            if (particle.life <= 0 || 
                particle.x < 0 || particle.x > this.canvas.width || 
                particle.y < 0 || particle.y > this.canvas.height) {
                this.particles[index] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.8,
                    speedY: (Math.random() - 0.5) * 0.8,
                    life: 100,
                    color: Math.random() > 0.5 ? '#00ffff' : '#50ff50'
                };
            }
        });

        this.particles.forEach((particle1, i) => {
            this.particles.slice(i + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    const gradient = this.ctx.createLinearGradient(
                        particle1.x, particle1.y, particle2.x, particle2.y
                    );
                    gradient.addColorStop(0, particle1.color);
                    gradient.addColorStop(1, particle2.color);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.globalAlpha = 0.3 * (1 - distance / 100);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            });
        });
    }
}

// Initialize and animate
document.addEventListener('DOMContentLoaded', () => {
    const matrixRain = new MatrixRain();
    const particleSystem = new ParticleSystem();

    function animate() {
        matrixRain.draw();
        particleSystem.draw();
        requestAnimationFrame(animate);
    }
    animate();

    setInterval(() => {
        const glitchText = document.createElement('div');
        glitchText.className = 'digital-glitch';
        glitchText.style.left = Math.random() * window.innerWidth + 'px';
        glitchText.style.top = Math.random() * window.innerHeight + 'px';
        glitchText.style.color = Math.random() > 0.5 ? '#00ffff' : '#50ff50';
        glitchText.textContent = Math.random().toString(16).substr(2, 8);
        document.body.appendChild(glitchText);

        setTimeout(() => {
            glitchText.remove();
        }, 1000);
    }, 2000);
}); 