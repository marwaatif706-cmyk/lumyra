// ============================================================
// LUMYRA – Main JavaScript
// ============================================================

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .product-card, .gallery-item, .feature-card, .dot').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ===== FLOATING PARTICLES =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const PARTICLE_COUNT = 55;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4 - 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '200,169,122' : '107,66,38';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => revealObserver.observe(el));

// ===== FEATURED PRODUCTS (Homepage) =====
const featuredContainer = document.getElementById('featured-products');
if (featuredContainer) {
  const featured = DB.products.slice(0, 4);
  featuredContainer.innerHTML = featured.map(p => `
    <div class="product-card reveal-up">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <div class="product-price">${p.price} MAD</div>
          <button class="btn-add-cart" onclick="DB.addToCart(${p.id})">+ Panier</button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe new elements
  featuredContainer.querySelectorAll('.reveal-up').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });
}

// ===== TESTIMONIALS SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');
}

// Make it global
window.goToSlide = goToSlide;

if (slides.length > 0) {
  setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 4000);
}

// ===== SMOOTH PARALLAX ON HERO =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-video');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ===== INIT AUTH =====
Auth.init();
