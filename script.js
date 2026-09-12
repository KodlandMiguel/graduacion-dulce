const canvas = document.getElementById('romanticCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Configuración de palabras flotantes dentro del corazón
const WORDS = ["Te amo", "Mi vida", "Siempre juntos", "Mi amor", "Eres todo", "Te adoro"];
const COLORS = [
    "rgba(255, 75, 110, 0.9)",
    "rgba(255, 130, 150, 0.9)",
    "rgba(255, 180, 195, 0.9)",
    "rgba(255, 105, 135, 0.9)",
    "rgba(245, 50, 80, 0.9)"
];

let particles = [];
let interactiveSparks = [];
let stars = [];

// Clase para las estrellas del fondo
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.02 + 0.005;
    }
    update() {
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0.2) {
            this.speed = -this.speed;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Inicializar estrellas de fondo
for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}

// Clase de Partícula de Texto (Corazón)
class TextParticle {
    constructor(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.x = width / 2 + (Math.random() - 0.5) * 400;
        this.y = height / 2 + (Math.random() - 0.5) * 400;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.flicker = Math.random() * Math.PI * 2;
        this.flickSpd = 0.03 + Math.random() * 0.07;
        this.size = Math.floor(Math.random() * 3) + 11;
    }

    update() {
        // Movimiento elástico hacia su posición objetivo en el corazón
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        this.x += dx * 0.05;
        this.y += dy * 0.05;

        this.flicker += this.flickSpd;
    }

    draw() {
        let alpha = 0.6 + 0.4 * Math.sin(this.flicker);
        ctx.save();
        ctx.font = `${this.size}px 'Montserrat', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff4b6e';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillText(this.word, this.x, this.y);
        ctx.restore();
    }
}

// Clase para chispas interactivas cuando se toca la pantalla
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 4 + 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = "#ffb3c6";
        ctx.shadowColor = "#ff4b6e";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Generar coordenadas del corazón matemático
function initHeartParticles() {
    particles = [];
    const scale = Math.min(width, height) / 45;
    
    // Contorno y relleno denso por puntos paramétricos
    for (let t = 0; t < Math.PI * 2; t += 0.04) {
        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        let screenX = width / 2 + hx * scale;
        let screenY = height / 2 + hy * scale - 20;
        particles.push(new TextParticle(screenX, screenY));
    }

    // Partículas internas para dar volumen de texto al corazón
    for (let i = 0; i < 70; i++) {
        let t = Math.random() * Math.PI * 2;
        let r = Math.random() * 0.85;
        let hx = 16 * Math.pow(Math.sin(t), 3) * r;
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;

        let screenX = width / 2 + hx * scale;
        let screenY = height / 2 + hy * scale - 20;
        particles.push(new TextParticle(screenX, screenY));
    }
}

initHeartParticles();
window.addEventListener('resize', initHeartParticles);

// Evento táctil y de clics para generar chispas de amor
window.addEventListener('pointerdown', (e) => {
    for (let i = 0; i < 15; i++) {
        interactiveSparks.push(new Spark(e.clientX, e.clientY));
    }
});

// Bucle principal de animación a 60 FPS
function animate() {
    ctx.fillStyle = "rgba(11, 2, 5, 0.25)"; // Efecto de estela suave (motion blur estético)
    ctx.fillRect(0, 0, width, height);

    // Actualizar estrellas
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Actualizar partículas del corazón
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Actualizar chispas interactivas
    for (let i = interactiveSparks.length - 1; i >= 0; i--) {
        let spark = interactiveSparks[i];
        spark.update();
        spark.draw();
        if (spark.life <= 0) {
            interactiveSparks.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Lógica del Modal de la Carta
const openBtn = document.getElementById('openLetterBtn');
const closeBtn = document.getElementById('closeLetterBtn');
const modal = document.getElementById('letterModal');

openBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});