const cnv = document.body.appendChild(document.createElement('canvas'));
const ctx = cnv.getContext('2d');

var w, h;
function resize() {
    w = cnv.width = window.innerWidth;
    h = cnv.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

class Point {
    constructor(x = 0, y = 0) {
	this.x = x;
	this.y = y;
    }

    clone() {
	return new Point(this.x, this.y);
    }
}

class Particle {
    constructor(p, hue) {
	this.pos = p.clone();
	this.vel = new Point();
	this.acc = new Point();

	this.size = Math.random();
	this.colour = `hsl(${hue = hue + Math.random() * 30 - 15}, 100%, ${clamp(Math.floor(Math.random() < 1/3 ? Math.random()*20 : 50-Math.random()*10), 0, 50)}%)`;

	const a = Math.random() * Math.PI * 2;
	const r = (Math.random() < 0.5 ? h/3 : 0) + this.size * h;
	this.vel.x = Math.cos(a) * r;
	this.vel.y = Math.sin(a) * r;

	this.size = this.size * h/40 + 2;
    }

    push(p) {
	this.acc.x += p.x;
	this.acc.y += p.y;
    }

    updt(dt) {
	this.size = this.size - dt * 20;

	this.vel.x += this.acc.x * dt;
	this.vel.y += this.acc.y * dt;

	this.vel.x *= 0.2**dt;
	this.vel.y *= 0.2**dt;
	
	this.pos.x += this.vel.x * dt;
	this.pos.y += this.vel.y * dt;

	this.acc.x = 0;
	this.acc.y = 0;
    }

    draw() {
	if (this.size >= 0) {
	const val = Math.hypot(this.vel.x, this.vel.y);

	ctx.fillStyle = this.colour;

	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2);
	ctx.fill();
	}
    }
}

let particles = [];

const burstSize = 200;

function burst(p) {
    const hue = Math.random() * 360;
    for (let i = 0; i < burstSize; i++) {
	const part = new Particle(p, hue);

	particles.push(part);
    }
}

cnv.addEventListener('mousedown', e => {
    burst(new Point(e.x, e.y));
});

var lastTime = Date.now();

function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    while (Math.random() < 0.02/(particles.length/burstSize)) {
        burst(new Point(Math.random()*w, Math.random()*h));
    }

    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    for (const p of particles) {
	p.updt(dt);
	p.draw();
    }

    particles = particles.filter(p => p.size > 0);

    requestAnimationFrame(drawFrame);
}

drawFrame();
