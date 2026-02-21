// ============================================
// PORTFOLIO – MAIN SCRIPT
// ============================================

// ---- Mobile Navigation ----
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// ---- Navbar scroll effect ----
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(7,7,13,0.95)';
        navbar.style.borderBottomColor = 'rgba(0,232,143,0.15)';
    } else {
        navbar.style.background = 'rgba(7,7,13,0.75)';
        navbar.style.borderBottomColor = 'rgba(255,255,255,0.06)';
    }
});

// ---- Skill Bars Animation ----
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.round(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
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
    const revealElements = document.querySelectorAll('.reveal, .stat-card, .contact-item, .contact-form');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });
    revealElements.forEach(el => observer.observe(el));
}

// ---- Three.js – Particle Network ----
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00e88f,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Central glowing sphere
    const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x00e88f,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Outer ring
    const torusGeo = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x00b4ff,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // Second ring
    const torus2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.015, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2 })
    );
    torus2.rotation.x = -Math.PI / 4;
    torus2.rotation.y = Math.PI / 6;
    scene.add(torus2);

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Update particles
        const posArray = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i].x;
            posArray[i * 3 + 1] += velocities[i].y;
            posArray[i * 3 + 2] += velocities[i].z;

            // Bounce within bounds
            for (let j = 0; j < 3; j++) {
                if (Math.abs(posArray[i * 3 + j]) > 5) {
                    if (j === 0) velocities[i].x *= -1;
                    if (j === 1) velocities[i].y *= -1;
                    if (j === 2) velocities[i].z *= -1;
                }
            }
        }
        geometry.attributes.position.needsUpdate = true;

        // Rotate objects
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.003;
        torus.rotation.z += 0.003;
        torus2.rotation.z -= 0.002;
        torus2.rotation.x += 0.001;
        particles.rotation.y += 0.001;

        // Mouse interaction
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// ---- GSAP Animations ----
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.hero-badge', { duration: 0.8, y: 20, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero-title .title-line', { duration: 1, y: 40, opacity: 0, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero-title .title-name', { duration: 1, y: 40, opacity: 0, ease: 'power3.out', delay: 0.3 });
    gsap.from('.hero-subtitle', { duration: 1, y: 30, opacity: 0, ease: 'power3.out', delay: 0.5 });
    gsap.from('.hero-buttons', { duration: 1, y: 30, opacity: 0, ease: 'power3.out', delay: 0.7 });
}

// ---- Smooth scroll ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ---- Contact form ----
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            btn.textContent = 'Envoi en cours...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                alert('Message envoyé avec succès ! Je vous répondrai bientôt.');
                form.reset();
                btn.textContent = 'Envoyer le message →';
                btn.style.opacity = '1';
            }, 1000);
        });
    }
}

// ---- Active nav link on scroll ----
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initGSAPAnimations();
    initSmoothScroll();
    initContactForm();
    animateSkills();
    animateCounters();
    initScrollReveal();
    initActiveNavOnScroll();
    document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('THREE')) {
        console.log('Three.js non disponible, utilisation des animations CSS uniquement');
    }
});