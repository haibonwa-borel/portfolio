// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
});

// Animation de la navbar au scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animation des barres de compétences
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Animation des statistiques (compteur)
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Scene 3D avec Three.js
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;
    
    // Configuration de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Création des géométries 3D
    const geometries = [];
    
    // Cube principal
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);
    geometries.push(cube);
    
    // Sphères flottantes
    for (let i = 0; i < 5; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: Math.random() * 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        sphere.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        
        scene.add(sphere);
        geometries.push(sphere);
    }
    
    // Tore
    const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(2, -1, -1);
    scene.add(torus);
    geometries.push(torus);
    
    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);
    
    // Position de la caméra
    camera.position.z = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotation des objets
        geometries.forEach((obj, index) => {
            obj.rotation.x += 0.01 * (index + 1);
            obj.rotation.y += 0.01 * (index + 1);
            
            // Mouvement flottant pour les sphères
            if (obj.geometry instanceof THREE.SphereGeometry) {
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            }
        });
        
        // Rotation de la caméra
        camera.position.x = Math.cos(Date.now() * 0.0005) * 5;
        camera.position.z = Math.sin(Date.now() * 0.0005) * 5;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Redimensionnement
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
    
    // Interaction avec la souris
    let mouseX = 0, mouseY = 0;
    
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) / rect.width * 2 - 1;
        mouseY = -(event.clientY - rect.top) / rect.height * 2 + 1;
        
        // Rotation basée sur la souris
        geometries[0].rotation.x = mouseY * 0.5;
        geometries[0].rotation.y = mouseX * 0.5;
    });
}

// Animations GSAP
function initGSAPAnimations() {
    // Animation d'entrée pour les éléments de la hero section
    gsap.from('.hero-title .title-line', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-title .title-name', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
    });
    
    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.4
    });
    
    gsap.from('.hero-buttons', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });
    
    // Animation des cartes de statistiques
    gsap.from('.stat-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stats',
            start: 'top 80%'
        }
    });
    
    // Animation des éléments flottants
    gsap.to('.floating-element', {
        duration: 4,
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.5
    });
}

// Smooth scroll pour les liens d'ancrage
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Gestion du formulaire de contact
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animation de succès
            gsap.to(form, {
                duration: 0.3,
                scale: 0.95,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
            
            // Simulation d'envoi
            setTimeout(() => {
                alert('Message envoyé avec succès ! Je vous répondrai bientôt.');
                form.reset();
            }, 600);
        });
    }
}

// Parallax effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initGSAPAnimations();
    initSmoothScroll();
    initContactForm();
    initParallax();
    animateSkills();
    animateCounters();
    
    // Ajout d'une classe pour les animations CSS
    document.body.classList.add('loaded');
});

// Gestion des erreurs Three.js
window.addEventListener('error', function(e) {
    if (e.message.includes('THREE')) {
        console.log('Three.js non disponible, utilisation des animations CSS uniquement');
    }
});

