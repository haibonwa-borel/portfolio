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

// ---- UI Background Parallax ----
function initUIBackground() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Scroll parallax
    gsap.to('.card-code', { y: -150, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.card-stats', { y: -120, rotation: -5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    gsap.to('.card-decorative', { y: -200, scale: 1.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 } });

    // Mouse hover parallax
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 768) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to('.card-code', { x: x * 30, y: y * 30, duration: 1, ease: 'power2.out' });
            gsap.to('.card-stats', { x: x * -40, y: y * -40, duration: 1, ease: 'power2.out' });
            gsap.to('.card-decorative', { x: x * 60, y: y * 60, duration: 2, ease: 'power2.out' });
        });
        heroVisual.addEventListener('mouseleave', () => {
            gsap.to('.card-code', { x: 0, y: 0, duration: 1, ease: 'power2.out' });
            gsap.to('.card-stats', { x: 0, y: 0, duration: 1, ease: 'power2.out' });
            gsap.to('.card-decorative', { x: 0, y: 0, duration: 1, ease: 'power2.out' });
        });
    }
}

// ---- Three.js & GSAP Morphing Device ----
function initThreeJS() {
    return; // Three.js disabled, replaced by UI background
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Device Group
    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // Initial position for hero section
    deviceGroup.position.set(3, 0, 0); 
    deviceGroup.rotation.set(0.2, -0.4, 0);
    
    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.4
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x00e88f,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    // Base (Keyboard side)
    const baseGeo = new THREE.BoxGeometry(4, 0.15, 3);
    const baseMesh = new THREE.Mesh(baseGeo, frameMaterial);
    
    // Keyboard Area
    const kbGeo = new THREE.BoxGeometry(3.6, 0.05, 1.4);
    const kbMesh = new THREE.Mesh(kbGeo, glassMaterial);
    kbMesh.position.set(0, 0.1, -0.2);
    baseMesh.add(kbMesh);
    
    // Trackpad
    const trackpadGeo = new THREE.BoxGeometry(1, 0.02, 0.6);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, glassMaterial);
    trackpadMesh.position.set(0, 0.1, 1.0);
    baseMesh.add(trackpadMesh);

    deviceGroup.add(baseMesh);

    // Lid (Screen side)
    const lidGroup = new THREE.Group();
    // Move lid center of rotation to the back edge
    lidGroup.position.set(0, 0.075, -1.5);
    
    const screenBaseGeo = new THREE.BoxGeometry(4, 3, 0.1);
    const screenBaseMesh = new THREE.Mesh(screenBaseGeo, frameMaterial);
    // Offset mesh so it hinges at the bottom
    screenBaseMesh.position.set(0, 1.5, 0);
    
    const displayGeo = new THREE.PlaneGeometry(3.8, 2.7);
    const displayMesh = new THREE.Mesh(displayGeo, screenMaterial);
    displayMesh.position.set(0, 1.5, 0.06);
    
    lidGroup.add(screenBaseMesh);
    lidGroup.add(displayMesh);
    
    // Initial open state
    lidGroup.rotation.x = -Math.PI / 10; 
    deviceGroup.add(lidGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00e88f, 2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00b4ff, 2);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    camera.position.z = 8;

    // Mouse interaction for floating effect
    let mouseX = 0, mouseY = 0;
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    // Morph Objects for Phone State
    // We will animate the scales of the geometries to match a phone ratio
    // Laptop ratio: 4 x 3. Phone ratio: 2 x 4.
    
    const animations = {
        lidAngle: -Math.PI / 10,
        baseScaleX: 1,
        baseScaleZ: 1,
        yPos: 0,
        xPos: 3,
        rotY: -0.4,
        rotX: 0.2,
        rotZ: 0
    };

    function updateDeviceShape() {
        lidGroup.rotation.x = animations.lidAngle;
        
        // Morph scaling
        baseMesh.scale.x = animations.baseScaleX;
        baseMesh.scale.z = animations.baseScaleZ;
        lidGroup.scale.x = animations.baseScaleX;
        lidGroup.scale.y = animations.baseScaleZ; // Lid Z maps to phone Y
        
        deviceGroup.position.y = animations.yPos;
        deviceGroup.position.x = animations.xPos;
        
        deviceGroup.rotation.y = animations.rotY;
        deviceGroup.rotation.x = animations.rotX;
        deviceGroup.rotation.z = animations.rotZ;
    }

    // GSAP ScrollTrigger Timeline
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        });

        // 1. Scroll to About -> Close Lid & move to center
        tl.to(animations, {
            lidAngle: -Math.PI, // closed
            xPos: 0,
            rotY: 0,
            rotX: 1.0, // angled to look at top of closed laptop
            duration: 1,
            onUpdate: updateDeviceShape
        });

        // 2. Scroll to Education -> Morph into Phone shape vertically
        tl.to(animations, {
            baseScaleX: 0.5, // Narrower
            baseScaleZ: 1.33, // Taller (3 * 1.33 = 4)
            rotX: 1.5, // Look flat
            rotZ: Math.PI / 2, // Rotated to stand up as a phone
             duration: 1,
            onUpdate: updateDeviceShape
        });
        
        // 3. Scroll to Stats/Contact -> Rotate phone
        tl.to(animations, {
            rotY: Math.PI * 2,
            yPos: -1,
            duration: 1.5,
            onUpdate: updateDeviceShape
        });
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Gentle floating effect
        const time = Date.now() * 0.001;
        const floatY = Math.sin(time) * 0.1;
        const floatX = Math.cos(time * 0.8) * 0.05;
        
        // Apply scroll-driven animations + float + mouse tilt
        updateDeviceShape();
        
        deviceGroup.position.y += floatY;
        deviceGroup.position.x += floatX;
        
        deviceGroup.rotation.x += mouseY * 0.1;
        deviceGroup.rotation.y += mouseX * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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

// ---- Footer Year ----
function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', function() {
    initUIBackground();
    initGSAPAnimations();
    initSmoothScroll();
    initContactForm();
    animateSkills();
    animateCounters();
    initScrollReveal();
    initActiveNavOnScroll();
    updateYear();
    document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('THREE')) {
        console.log('Three.js non disponible, utilisation des animations CSS uniquement');
    }
});