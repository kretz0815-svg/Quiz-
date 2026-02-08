// 3D Parallax Background Controller
class ParallaxBackground {
    constructor() {
        this.layers = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParallaxLayers();
        this.createParticles(30);
        this.createAccentLines(5);
        this.setupEventListeners();
        this.animate();
    }

    createParallaxLayers() {
        const container = document.querySelector('.parallax-background');
        if (!container) return;

        // Layer 1: Blurred background image
        const layer1 = document.createElement('div');
        layer1.className = 'parallax-layer parallax-layer-1';
        layer1.dataset.depth = '0.1';
        container.appendChild(layer1);

        // Layer 2: Gradient overlay
        const layer2 = document.createElement('div');
        layer2.className = 'parallax-layer parallax-layer-2';
        layer2.dataset.depth = '0.05';
        container.appendChild(layer2);

        // Layer 3: Top gradient
        const layer3 = document.createElement('div');
        layer3.className = 'parallax-layer parallax-layer-3';
        layer3.dataset.depth = '0.02';
        container.appendChild(layer3);

        this.layers = container.querySelectorAll('.parallax-layer');
    }

    createParticles(count) {
        const container = document.querySelector('.parallax-particles');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random animation delay
            particle.style.animationDelay = Math.random() * 20 + 's';

            // Random animation duration
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';

            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createAccentLines(count) {
        const container = document.querySelector('.parallax-particles');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const accent = document.createElement('div');
            accent.className = 'parallax-accent';

            // Random horizontal position
            accent.style.left = (20 + Math.random() * 60) + '%';

            // Random animation delay
            accent.style.animationDelay = Math.random() * 15 + 's';

            // Random animation duration
            accent.style.animationDuration = (10 + Math.random() * 10) + 's';

            container.appendChild(accent);
        }
    }

    setupEventListeners() {
        // Mouse move for parallax effect
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Normalize to -1 to 1
            this.targetX = (this.mouseX / window.innerWidth) * 2 - 1;
            this.targetY = (this.mouseY / window.innerHeight) * 2 - 1;
        });

        // Device orientation for mobile
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                // Normalize gamma and beta to -1 to 1
                this.targetX = (e.gamma || 0) / 45; // -45 to 45 degrees
                this.targetY = (e.beta || 0) / 90;  // -90 to 90 degrees

                // Clamp values
                this.targetX = Math.max(-1, Math.min(1, this.targetX));
                this.targetY = Math.max(-1, Math.min(1, this.targetY));
            });
        }

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            this.targetX = 0;
            this.targetY = 0;
        });
    }

    animate() {
        // Smooth interpolation
        this.currentX += (this.targetX - this.currentX) * 0.05;
        this.currentY += (this.targetY - this.currentY) * 0.05;

        // Apply parallax to layers
        this.layers.forEach((layer) => {
            const depth = parseFloat(layer.dataset.depth) || 0;
            const moveX = this.currentX * depth * 50;
            const moveY = this.currentY * depth * 50;

            layer.style.transform = `
                translateX(${moveX}px) 
                translateY(${moveY}px)
                translateZ(${layer.classList.contains('parallax-layer-1') ? '-100px' :
                    layer.classList.contains('parallax-layer-2') ? '-50px' : '0'})
                scale(${layer.classList.contains('parallax-layer-1') ? '1.1' :
                    layer.classList.contains('parallax-layer-2') ? '1.05' : '1'})
            `;
        });

        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        // Cleanup
        const container = document.querySelector('.parallax-background');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Initialize parallax on home screen
let parallaxInstance = null;

// Add to app initialization
const originalShowScreen = app.showScreen;
app.showScreen = function (screenName) {
    originalShowScreen.call(this, screenName);

    // Initialize parallax on home screen
    if (screenName === 'home') {
        if (!parallaxInstance) {
            parallaxInstance = new ParallaxBackground();
        }
    }
};

// Initialize on page load if starting on home
document.addEventListener('DOMContentLoaded', () => {
    if (app.currentScreen === 'home' || app.currentScreen === 'splash') {
        setTimeout(() => {
            parallaxInstance = new ParallaxBackground();
        }, 100);
    }
});
