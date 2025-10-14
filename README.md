# Portfolio - Site Web Étudiant Développeur

Un site web portfolio moderne pour un étudiant en informatique avec des animations fluides et 3D, développé avec HTML5, CSS3 et JavaScript.

## 🚀 Fonctionnalités

### Page d'accueil (index.html)
- **Design moderne** avec dégradés et animations CSS
- **Animations 3D** avec Three.js (cube, sphères flottantes, tore)
- **Section héro** avec titre animé et boutons d'action
- **Section à propos** avec barres de compétences animées
- **Statistiques** avec compteurs animés
- **Formulaire de contact** interactif
- **Navigation fluide** avec smooth scroll

### Page projets (projects.html)
- **Grille de projets** responsive
- **Système de filtrage** par catégorie (Web, Mobile, Full Stack)
- **Cartes de projets** avec overlay au survol
- **Liens GitHub et Demo** pour chaque projet
- **Tags de technologies** utilisées
- **Animations GSAP** pour les interactions

## 🛠️ Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes, animations, responsive design
- **JavaScript ES6+** - Interactivité et animations
- **Three.js** - Animations 3D
- **GSAP** - Animations fluides et professionnelles
- **Google Fonts** - Typographie (Inter)

## 📁 Structure du projet

```
portfolio-site/
├── index.html              # Page d'accueil
├── projects.html           # Page projets
├── styles.css              # Styles CSS principaux
├── script.js               # JavaScript page d'accueil
├── projects.js             # JavaScript page projets
├── project_illustration_web_dev.png  # Image d'illustration
└── README.md               # Documentation
```

## 🚀 Installation et utilisation

### Méthode 1 : Serveur HTTP simple
```bash
# Naviguer dans le dossier du projet
cd portfolio-site

# Démarrer un serveur HTTP local
python3 -m http.server 8000

# Ouvrir dans le navigateur
http://localhost:8000
```

### Méthode 2 : Serveur Node.js
```bash
# Installer http-server globalement
npm install -g http-server

# Démarrer le serveur
http-server -p 8000

# Ouvrir dans le navigateur
http://localhost:8000
```

### Méthode 3 : Extension VS Code
- Installer l'extension "Live Server"
- Clic droit sur index.html → "Open with Live Server"

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans les variables CSS au début de `styles.css` :
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    /* ... */
}
```

### Contenu
- **Informations personnelles** : Modifier dans `index.html` (sections hero, about, contact)
- **Projets** : Ajouter/modifier dans `projects.html` (section projects-grid)
- **Statistiques** : Ajuster dans `index.html` (section stats)

### Images
- Remplacer `project_illustration_web_dev.png` par vos propres images
- Ajouter des images spécifiques pour chaque projet
- Optimiser les images pour le web (format WebP recommandé)

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints pour :
- **Desktop** : > 1024px
- **Tablet** : 768px - 1024px
- **Mobile** : < 768px

## ⚡ Optimisations

### Performance
- Images optimisées et lazy loading
- CSS et JS minifiés pour la production
- Animations GPU-accelerated
- Chargement asynchrone des bibliothèques

### SEO
- Structure HTML sémantique
- Meta tags appropriés
- Alt text pour les images
- URLs propres

## 🔧 Développement

### Prérequis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Serveur HTTP local pour éviter les erreurs CORS

### Debugging
- Ouvrir les outils de développement (F12)
- Console JavaScript pour les erreurs
- Network tab pour les ressources

### Ajout de nouvelles fonctionnalités
1. Modifier le HTML pour la structure
2. Ajouter les styles CSS correspondants
3. Implémenter la logique JavaScript
4. Tester sur différents appareils

## 📞 Support

Pour toute question ou problème :
- Vérifier la console JavaScript pour les erreurs
- S'assurer que toutes les ressources sont chargées
- Tester avec un serveur HTTP local

## 📄 Licence

Ce projet est libre d'utilisation pour des fins éducatives et personnelles.

---

**Développé avec ❤️ pour les étudiants en informatique**

