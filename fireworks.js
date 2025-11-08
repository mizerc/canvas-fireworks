const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class for firework particles
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        
        // Random velocity in all directions
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * randomInt(2,5) + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.alpha = 3;
        this.decay = Math.random() * 0.015 + 0.015;
        this.gravity = 0.05;
        this.radius = Math.random() * 1.5 + 1;
        this.airResistance = 1.0 - Math.max(Math.random() * 0.015 + 0.015, 0.015);
    }
    
    update() {
        this.vx *= this.airResistance; // Air resistance
        this.vy *= this.airResistance;
        this.vy += this.gravity; // Gravity
        
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        // ctx.shadowBlur = 15;
        // ctx.shadowColor = this.color;
        // ctx.fill();

        ctx.restore();
    }
    
    isAlive() {
        return this.alpha > 0;
    }
}

// Firework class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.color = this.getRandomColor();
        
        // Create particles
        const particleCount = Math.random() * 100 + 100;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y, this.color));
        }
        
        // Add some particles with complementary color
        const complementaryColor = this.getComplementaryColor(this.color);
        const complementaryCount = Math.random() * 20 + 30;
        for (let i = 0; i < complementaryCount; i++) {
            this.particles.push(new Particle(x, y, complementaryColor));
        }
    }
    
    getRandomColor() {
        const colors = [
            '#ff0000', // Red
            '#ff4500', // Orange Red
            '#ffd700', // Gold
            '#00ff00', // Green
            '#00ffff', // Cyan
            '#0080ff', // Blue
            '#ff00ff', // Magenta
            '#ff1493', // Deep Pink
            '#ffffff', // White
            '#ff69b4', // Hot Pink
            '#00ff7f', // Spring Green
            '#ff6347', // Tomato
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getComplementaryColor(hexColor) {
        // Simple complementary color generator
        const colors = ['#ffff00', '#ff8c00', '#ff00ff', '#00ffff', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => particle.isAlive());
    }
    
    draw() {
        this.particles.forEach(particle => particle.draw());
    }
    
    isAlive() {
        return this.particles.length > 0;
    }
}

// Array to hold all active fireworks
const fireworks = [];

// Animation loop
function animate() {
    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 255)';
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all fireworks
    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });
    
    // Remove dead fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (!fireworks[i].isAlive()) {
            fireworks.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

// Mouse click event listener
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    fireworks.push(new Firework(x, y));
});

// Start animation
animate();

