// ============================================
// PORTFOLIO – MAIN SCRIPT (3D Edition)
// Three.js + GSAP + ScrollTrigger
// ============================================

// ---- Mobile Navigation ----
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-link').forEach(n =>
      n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      })
    );
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

// ---- Navbar scroll effect ----
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(2,2,13,0.97)';
    navbar.style.borderBottomColor = 'rgba(168,85,247,0.15)';
  } else {
    navbar.style.background = 'rgba(2,2,13,0.65)';
    navbar.style.borderBottomColor = 'rgba(255,255,255,0.04)';
  }
});

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const halo = document.getElementById('cursorHalo');
  if (!dot || !halo) return;

  let mouseX = 0, mouseY = 0;
  let haloX  = 0, haloY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateHalo() {
    haloX += (mouseX - haloX) * 0.12;
    haloY += (mouseY - haloY) * 0.12;
    halo.style.left = haloX + 'px';
    halo.style.top  = haloY + 'px';
    raf = requestAnimationFrame(animateHalo);
  }
  animateHalo();

  document.querySelectorAll('a, button, .skill-chip, .stat-card, .contact-item, .filter-btn, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ============================================
// THREE.JS — HERO GLOBE (Orbital Particles)
// ============================================
function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.set(0, 0, 5);

  // --- Central glowing sphere ---
  const coreGeo = new THREE.SphereGeometry(1, 64, 64);
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0xa855f7,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.6,
    shininess: 120,
    transparent: true,
    opacity: 0.9,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // --- Wireframe overlay on sphere ---
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const wire = new THREE.Mesh(new THREE.SphereGeometry(1.01, 20, 20), wireMat);
  scene.add(wire);

  // --- Inner glow sphere ---
  const glowGeo = new THREE.SphereGeometry(1.35, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  // --- Orbital rings ---
  function makeRing(radius, color, tiltX, tiltZ) {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
    const ring = new THREE.Line(geo, mat);
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    scene.add(ring);
    return ring;
  }
  const ring1 = makeRing(1.8, 0xa855f7, Math.PI / 2, 0);
  const ring2 = makeRing(2.2, 0xf43f5e, Math.PI / 4, Math.PI / 6);
  const ring3 = makeRing(2.6, 0x00e5ff, Math.PI / 6, Math.PI / 3);

  // --- Tech icon sprites orbiting ---
  const techLabels = ['JS', 'Py', 'Fl', 'Re', 'TS', 'PHP', 'AI', 'Git'];
  const orbitObjs = [];
  techLabels.forEach((label, i) => {
    const angle = (i / techLabels.length) * Math.PI * 2;
    const radius = 1.8 + (i % 3) * 0.4;
    const tilt = (i % 3 - 1) * 0.4;

    // Small sphere as icon node
    const geo = new THREE.SphereGeometry(0.09, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: [0xa855f7, 0xf43f5e, 0x00e5ff][i % 3] });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.cos(angle) * radius, Math.sin(tilt) * 0.6, Math.sin(angle) * radius);
    scene.add(mesh);
    orbitObjs.push({ mesh, angle, radius, speed: 0.3 + i * 0.04, tilt });
  });

  // --- Particle field (stars) ---
  const starCount = 300;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 20;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(starGeo, starMat));

  // --- Lights ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const light1 = new THREE.PointLight(0xa855f7, 4, 10);
  light1.position.set(3, 3, 3);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xf43f5e, 2, 8);
  light2.position.set(-3, -2, 2);
  scene.add(light2);

  // --- Mouse tilt ---
  let mX = 0, mY = 0;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mY = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  });

  // --- Animation loop ---
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    core.rotation.y  = t * 0.3;
    core.rotation.x  = Math.sin(t * 0.2) * 0.1;
    wire.rotation.y -= 0.004;

    ring1.rotation.z = t * 0.15;
    ring2.rotation.y = t * 0.2;
    ring3.rotation.x = t * 0.1;

    // Orbit the tech nodes
    orbitObjs.forEach(obj => {
      obj.angle += obj.speed * 0.012;
      obj.mesh.position.set(
        Math.cos(obj.angle) * obj.radius,
        Math.sin(obj.tilt + t * 0.3) * 0.5,
        Math.sin(obj.angle) * obj.radius
      );
      // Pulse scale
      const s = 1 + Math.sin(t * 3 + obj.angle) * 0.3;
      obj.mesh.scale.setScalar(s);
    });

    // Mouse tilt on whole scene
    scene.rotation.y += (mX * 0.3 - scene.rotation.y) * 0.05;
    scene.rotation.x += (mY * 0.2 - scene.rotation.x) * 0.05;

    // Floating bob
    scene.position.y = Math.sin(t * 0.6) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

// ============================================
// THREE.JS — SKILLS GLOBE (Interactive 3D)
// ============================================
function initSkillsThreeJS() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  camera.position.set(0, 0, 5);

  // Tech nodes distributed on sphere surface (Fibonacci sphere)
  const techs = [
    { name: 'JS',      color: 0xf1e05a, size: 0.14 },
    { name: 'React',   color: 0x61dafb, size: 0.14 },
    { name: 'Python',  color: 0x3572A5, size: 0.13 },
    { name: 'Flutter', color: 0x00B4AB, size: 0.12 },
    { name: 'Node',    color: 0x68a063, size: 0.12 },
    { name: 'PHP',     color: 0x4F5D95, size: 0.11 },
    { name: 'Azure',   color: 0x0089d6, size: 0.11 },
    { name: 'Git',     color: 0xf05032, size: 0.11 },
    { name: 'MySQL',   color: 0x4479a1, size: 0.10 },
    { name: 'ML/AI',   color: 0xa855f7, size: 0.13 },
    { name: 'CSS',     color: 0x663399, size: 0.10 },
    { name: 'HTML',    color: 0xe34c26, size: 0.10 },
    { name: 'TS',      color: 0x3178c6, size: 0.11 },
    { name: 'Dart',    color: 0x00b4ab, size: 0.10 },
    { name: 'C++',     color: 0xf34b7d, size: 0.09 },
    { name: 'C#',      color: 0x178600, size: 0.09 },
  ];

  const radius = 2.0;
  const n = techs.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const nodes = [];
  techs.forEach((tech, i) => {
    const y   = 1 - (i / (n - 1)) * 2;
    const r   = Math.sqrt(1 - y * y);
    const phi = goldenAngle * i;
    const x   = Math.cos(phi) * r;
    const z   = Math.sin(phi) * r;

    const geo  = new THREE.SphereGeometry(tech.size, 14, 14);
    const mat  = new THREE.MeshPhongMaterial({
      color: tech.color,
      emissive: tech.color,
      emissiveIntensity: 0.4,
      shininess: 60,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x * radius, y * radius, z * radius);
    scene.add(mesh);

    // Glow halo per node
    const haloGeo = new THREE.SphereGeometry(tech.size * 2.2, 8, 8);
    const haloMat = new THREE.MeshBasicMaterial({
      color: tech.color,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    mesh.add(halo);

    nodes.push({ mesh, basePos: mesh.position.clone(), phase: Math.random() * Math.PI * 2 });
  });

  // Wireframe globe
  const globeWire = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.06 })
  );
  scene.add(globeWire);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pl = new THREE.PointLight(0xa855f7, 3, 15);
  pl.position.set(4, 4, 4);
  scene.add(pl);

  // Mouse drag
  let isDragging = false, prevX = 0, prevY = 0;
  let velX = 0, velY = 0;
  let autoRotate = true;

  canvas.addEventListener('mousedown', e => { isDragging = true; prevX = e.clientX; prevY = e.clientY; autoRotate = false; });
  window.addEventListener('mouseup',   () => { isDragging = false; });
  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velX = (e.clientX - prevX) * 0.01;
    velY = (e.clientY - prevY) * 0.01;
    scene.rotation.y += velX;
    scene.rotation.x += velY;
    prevX = e.clientX; prevY = e.clientY;
  });
  // Touch drag
  canvas.addEventListener('touchstart', e => { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; autoRotate = false; });
  window.addEventListener('touchend',   () => { isDragging = false; });
  canvas.addEventListener('touchmove',  e => {
    if (!isDragging) return;
    velX = (e.touches[0].clientX - prevX) * 0.01;
    velY = (e.touches[0].clientY - prevY) * 0.01;
    scene.rotation.y += velX;
    scene.rotation.x += velY;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    if (!isDragging) {
      // Momentum + auto-rotate
      velX *= 0.92;
      scene.rotation.y += velX;
      if (autoRotate) scene.rotation.y += 0.004;
    }

    // Pulse nodes
    nodes.forEach(({ mesh, phase }) => {
      const s = 1 + Math.sin(t * 2 + phase) * 0.12;
      mesh.scale.setScalar(s);
    });

    globeWire.rotation.y -= 0.003;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

// ---- Skill Bars Animation ----
function animateSkills() {
  const skillBars = document.querySelectorAll('.skill-progress');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => observer.observe(bar));
}

// ---- Animated Counters ----
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter   = entry.target;
        const target    = parseInt(counter.getAttribute('data-target'));
        const duration  = 2000;
        const startTime = performance.now();
        function updateCounter(currentTime) {
          const elapsed  = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(updateCounter);
          else counter.textContent = target;
        }
        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .stat-card, .contact-item, .contact-form, .skill-chip');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  revealElements.forEach(el => observer.observe(el));
}

// ---- GSAP Hero Animations ----
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.from('.hero-badge',          { duration: 0.8, y: 20, opacity: 0, ease: 'power3.out' });
  gsap.from('.hero-title .title-line', { duration: 1, y: 40, opacity: 0, ease: 'power3.out', delay: 0.1 });
  gsap.from('.hero-title .title-name', { duration: 1, y: 40, opacity: 0, ease: 'power3.out', delay: 0.3 });
  gsap.from('.hero-subtitle',       { duration: 1, y: 30, opacity: 0, ease: 'power3.out', delay: 0.5 });
  gsap.from('.hero-buttons',        { duration: 1, y: 30, opacity: 0, ease: 'power3.out', delay: 0.7 });
  gsap.from('#hero-canvas',         { duration: 1.2, scale: 0.8, opacity: 0, ease: 'power3.out', delay: 0.4 });
}

// ---- GSAP ScrollTrigger parallax ----
function initScrollParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero canvas subtle zoom on scroll
  gsap.to('#hero-canvas', {
    y: -80, scale: 0.95, opacity: 0.5,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  // Skills canvas entrance
  gsap.from('#skills-canvas', {
    x: -80, opacity: 0, duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#skills-3d', start: 'top 80%' }
  });
  gsap.from('.skill-chip', {
    x: 60, opacity: 0, stagger: 0.1, duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#skills-3d', start: 'top 70%' }
  });

  // Stats cards entrance
  gsap.from('.stat-card', {
    y: 60, opacity: 0, stagger: 0.12, duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.stats', start: 'top 75%' }
  });
}

// ---- Smooth scroll ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---- Contact form ----
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('contactSubmit');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.textContent = 'Envoi en cours...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Envoyer le message →';
      btn.style.opacity = '1';
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1200);
  });
}

// ---- Active nav link on scroll ----
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

// ---- Footer Year ----
function updateYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ---- Project card 3D tilt on hover (for index page if any) ----
function initCardTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
      card.querySelector('.project-card-inner').style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.project-card-inner').style.transform = '';
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const isMobile = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initCustomCursor();
  initGSAPAnimations();
  initSmoothScroll();
  initContactForm();
  animateSkills();
  animateCounters();
  initScrollReveal();
  initActiveNavOnScroll();
  updateYear();

  if (!prefersReducedMotion) {
    initScrollParallax();
  }

  // Init Three.js scenes (skip on very small/low-end devices)
  setTimeout(() => {
    if (!isMobile || window.innerWidth > 480) {
      initHeroThreeJS();
    }
    initSkillsThreeJS();
    if (!isMobile) {
      initCardTilt();
    }
  }, 100);

  document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', function (e) {
  if (e.message && (e.message.includes('THREE') || e.message.includes('three'))) {
    console.log('Three.js non disponible — animations CSS en fallback');
  }
});