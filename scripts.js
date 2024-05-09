// Canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// State and configurations
const particlesArray = [];
let hue = 0;
let frame = 0;

// Mouse position tracking
const mouse = {
  x: undefined,
  y: undefined,
};

// Particle class definition
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 14 + 1;
    this.speedX = (Math.random() * 3) - 1.5;
    this.speedY = (Math.random() * 3) - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) {
      this.size -= 0.1;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Event listeners for creating particles
canvas.addEventListener("click", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  hue += 8; // Change color on click
  for (let i = 0; i < 20; i++) {
    particlesArray.push(new Particle(mouse.x, mouse.y));
  }
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  hue += 2; // Slight color change on mouse move
  if (frame % 2 === 0) {
    for (let i = 0; i < 7; i++) {
      particlesArray.push(new Particle(mouse.x, mouse.y));
    }
  }
});

// Connect particles that are within a certain distance
function drawConnections() {
  const connectionDistance = 100; // Maximum distance to draw lines between particles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Set the line color and opacity
  ctx.lineWidth = 0.5; // Line thickness

  for (let i = 0; i < particlesArray.length - 1; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Particle handling
function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    if (particlesArray[i].size <= 0.2) {
      particlesArray.splice(i, 1); // Remove small particles
      i--;
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  handleParticles(); // Draw particles
  drawConnections(); // Connect particles
  frame++; // Increment frame counter
  requestAnimationFrame(animate); // Recursive animation
}

animate(); // Start the animation loop
