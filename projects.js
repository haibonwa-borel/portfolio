// Navigation mobile (réutilisé)
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu mobile lors du clic sur un lien
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
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

// Système de filtrage des projets
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Afficher la carte avec animation
                    gsap.to(card, {
                        duration: 0.5,
                        opacity: 1,
                        scale: 1,
                        display: 'block',
                        ease: 'power2.out'
                    });
                } else {
                    // Masquer la carte avec animation
                    gsap.to(card, {
                        duration: 0.3,
                        opacity: 0,
                        scale: 0.8,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Animations d'entrée pour les cartes de projets
function initProjectAnimations() {
    // Animation d'entrée pour le titre de la page
    gsap.from('.page-title', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.page-subtitle', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.2
    });
    
    // Animation d'entrée pour les boutons de filtre
    gsap.from('.filter-btn', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4
    });
    
    // Animation d'entrée pour les cartes de projets
    gsap.from('.project-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.6
    });
}

// Effet de parallax sur les images de projets
function initProjectParallax() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    window.addEventListener('scroll', () => {
        projectImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const speed = 0.1;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(window.pageYOffset - rect.top) * speed;
                img.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// Animation au survol des cartes de projets
function initProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        const overlay = card.querySelector('.project-overlay');
        const links = card.querySelectorAll('.project-link');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                duration: 0.3,
                scale: 1.1,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 1,
                ease: 'power2.out'
            });
            
            gsap.from(links, {
                duration: 0.4,
                y: 20,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.1
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.out'
            });
        });
    });
}

// Animation des tags de technologies
function initTechTagsAnimation() {
    const techTags = document.querySelectorAll('.tech-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    duration: 0.5,
                    scale: 0,
                    opacity: 0,
                    ease: 'back.out(1.7)',
                    delay: Math.random() * 0.3
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    techTags.forEach(tag => observer.observe(tag));
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

// Effet de révélation au scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .filter-btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => observer.observe(element));
}

// Gestion des liens de projets
function initProjectLinks() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Animation de clic
            gsap.to(link, {
                duration: 0.1,
                scale: 0.95,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
            
            // Simulation d'ouverture de lien
            setTimeout(() => {
                const linkText = link.textContent.trim();
                if (linkText === 'GitHub') {
                    alert('Redirection vers le repository GitHub du projet');
                } else if (linkText === 'Demo') {
                    alert('Ouverture de la démonstration du projet');
                }
            }, 200);
        });
    });
}

// Animation de chargement de la page
function initPageLoader() {
    // Masquer tous les éléments initialement
    gsap.set('.projects-hero, .projects-section', { opacity: 0 });
    
    // Animation de révélation progressive
    const tl = gsap.timeline();
    
    tl.to('.projects-hero', {
        duration: 0.8,
        opacity: 1,
        ease: 'power2.out'
    })
    .to('.projects-section', {
        duration: 0.8,
        opacity: 1,
        ease: 'power2.out'
    }, '-=0.4');
}

// Initialisation de tous les scripts
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si GSAP est disponible
    if (typeof gsap !== 'undefined') {
        initProjectAnimations();
        initProjectHoverEffects();
        initTechTagsAnimation();
        initPageLoader();
    }
    
    initProjectFilter();
    initProjectParallax();
    initSmoothScroll();
    initScrollReveal();
    initProjectLinks();
    
    // Ajout d'une classe pour les animations CSS
    document.body.classList.add('loaded');
});

// Gestion des erreurs
window.addEventListener('error', function(e) {
    if (e.message.includes('gsap')) {
        console.log('GSAP non disponible, utilisation des animations CSS uniquement');
    }
});

// Animation de sortie de page
window.addEventListener('beforeunload', function() {
    gsap.to('body', {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.in'
    });
});

