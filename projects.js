// ============================================
// PROJECTS PAGE – 3D Flip Cards + GitHub API
// ============================================

const GITHUB_USERNAME = "haibonwa-borel";

// ---- Custom Cursor (projects page) ----
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const halo = document.getElementById('cursorHalo');
  if (!dot || !halo) return;
  let mouseX = 0, mouseY = 0, haloX = 0, haloY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
  });
  (function animateHalo() {
    haloX += (mouseX - haloX) * 0.12;
    haloY += (mouseY - haloY) * 0.12;
    halo.style.left = haloX + 'px'; halo.style.top = haloY + 'px';
    requestAnimationFrame(animateHalo);
  })();
  document.querySelectorAll('a, button, .project-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

// ---- Mobile Navigation ----
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu   = document.querySelector(".nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
    document.querySelectorAll(".nav-link").forEach(n =>
      n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      })
    );
  }
  document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ---- Navbar scroll ----
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(2,2,13,0.97)";
    navbar.style.borderBottomColor = "rgba(168,85,247,0.15)";
  } else {
    navbar.style.background = "rgba(2,2,13,0.65)";
    navbar.style.borderBottomColor = "rgba(255,255,255,0.04)";
  }
});

// ---- Language colors ----
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  HTML: "#e34c26", CSS: "#663399", Dart: "#00B4AB",
  PHP: "#4F5D95", Java: "#b07219", "C++": "#f34b7d",
  "C#": "#178600", Swift: "#F05138", Kotlin: "#A97BFF",
  PowerShell: "#012456", Shell: "#89e051",
};

// ---- Language icon emoji ----
const LANG_ICON = {
  JavaScript: '<i class="fa-brands fa-js"></i>', TypeScript: '<i class="fa-solid fa-file-code"></i>', Python: '<i class="fa-brands fa-python"></i>', HTML: '<i class="fa-brands fa-html5"></i>',
  CSS: '<i class="fa-brands fa-css3-alt"></i>', Dart: '<i class="fa-solid fa-bullseye"></i>', PHP: '<i class="fa-brands fa-php"></i>', Java: '<i class="fa-brands fa-java"></i>', "C++": '<i class="fa-solid fa-c"></i>',
  "C#": '<i class="fa-solid fa-c"></i>', Swift: '<i class="fa-brands fa-swift"></i>', Kotlin: '<i class="fa-solid fa-code"></i>', PowerShell: '<i class="fa-solid fa-terminal"></i>',
  Shell: '<i class="fa-solid fa-terminal"></i>',
};

// ---- Category detection ----
function getProjectCategory(repo) {
  const lang   = (repo.language || "").toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  if (["dart","swift","kotlin"].includes(lang) ||
      ["mobile","flutter","react-native","android","ios"].some(t => topics.includes(t)))
    return "mobile";
  if (["fullstack","full-stack"].some(t => topics.includes(t))) return "fullstack";
  return "web";
}

// ---- Gradient per language ----
function getCardGradient(language) {
  const g = {
    JavaScript: "linear-gradient(135deg,#0d0d1a 0%,#2a1a4e 100%)",
    Python:     "linear-gradient(135deg,#0d0d1a 0%,#1a2a4e 100%)",
    HTML:       "linear-gradient(135deg,#0d0d1a 0%,#4e1a1a 100%)",
    CSS:        "linear-gradient(135deg,#0d0d1a 0%,#2a1a4e 100%)",
    PHP:        "linear-gradient(135deg,#0d0d1a 0%,#1a2a4e 100%)",
    Dart:       "linear-gradient(135deg,#0d0d1a 0%,#1a4e4a 100%)",
    PowerShell: "linear-gradient(135deg,#0d0d1a 0%,#1a1a40 100%)",
  };
  return g[language] || "linear-gradient(135deg,#0d0d1a 0%,#2a1a3e 100%)";
}

// ---- Create 3D Flip Project Card ----
function createProjectCard(repo) {
  const category    = getProjectCategory(repo);
  const description = repo.description || "Aucune description disponible.";
  const truncated   = description.length > 100 ? description.substring(0, 97) + "..." : description;
  const icon        = LANG_ICON[repo.language] || '<i class="fa-solid fa-laptop-code"></i>';
  const langColor   = LANG_COLORS[repo.language] || "#a855f7";

  let tags = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics)   tags = [...tags, ...repo.topics.filter(t => t !== repo.language?.toLowerCase())];
  tags = tags.slice(0, 4);

  const tagsHtml = tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("");

  const statsHtml = `
    <div class="project-back-stats">
      ${repo.stargazers_count > 0 ? `<span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>` : ""}
      ${repo.forks_count > 0     ? `<span><i class="fa-solid fa-code-branch"></i> ${repo.forks_count}</span>` : ""}
      <span>${new Date(repo.updated_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
    </div>
  `;

  const linksHtml = `
    <div class="project-back-links">
      <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">GitHub</a>
      ${repo.homepage ? `<a href="${repo.homepage}" class="project-link secondary" target="_blank" rel="noopener">Demo →</a>` : ""}
    </div>
  `;

  const div = document.createElement("div");
  div.className = "project-card";
  div.setAttribute("data-category", category);

  div.innerHTML = `
    <div class="project-card-inner">
      <!-- FRONT -->
      <div class="project-card-face project-card-front">
        <div class="project-image" style="background:${getCardGradient(repo.language)}">
          <div style="text-align:center;padding:1.5rem;">
            <div style="font-size:3rem;margin-bottom:0.5rem;">${icon}</div>
            <div style="font-family:var(--font-mono);font-size:0.8rem;color:${langColor};">${repo.language || "N/A"}</div>
          </div>
          <div style="position:absolute;bottom:0.6rem;right:0.8rem;font-size:0.7rem;font-family:var(--font-mono);color:rgba(255,255,255,0.25);">
            hover →
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${repo.name.replace(/[-_]/g, " ")}</h3>
          <p class="project-description">${truncated}</p>
          <div class="project-tech">${tagsHtml}</div>
        </div>
      </div>

      <!-- BACK -->
      <div class="project-card-face project-card-back">
        <div class="project-back-icon">${icon}</div>
        <div class="project-back-title">${repo.name.replace(/[-_]/g, " ")}</div>
        <p class="project-back-desc">${description}</p>
        <div class="project-tech" style="justify-content:center;">${tagsHtml}</div>
        ${linksHtml}
        ${statsHtml}
      </div>
    </div>
  `;

  return div;
}

// ---- Fetch & render projects ----
async function fetchGitHubProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      { headers: { Accept: "application/vnd.github.mercy-preview+json" } }
    );
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
    const fetchedRepos = await response.json();

    // Custom project: Zevaba
    const zevabaProject = {
      name: "Zevaba.com",
      description: "Application mobile et plateforme web pour Zevaba, développée avec Flutter. Interface moderne et expérience utilisateur fluide.",
      language: "Dart",
      topics: ["flutter", "mobile", "frontend"],
      html_url: "https://zevaba.com",
      homepage: "https://zevaba.com",
      stargazers_count: 0, forks_count: 0,
      updated_at: new Date().toISOString(),
    };

    const repos = [zevabaProject, ...fetchedRepos];
    grid.innerHTML = "";

    if (repos.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-2);padding:4rem 0;">Aucun projet trouvé.</p>';
      return;
    }

    repos.forEach((repo, index) => {
      const card = createProjectCard(repo);
      card.style.opacity  = "0";
      card.style.transform = "translateY(30px) scale(0.97)";
      grid.appendChild(card);

      setTimeout(() => {
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.opacity    = "1";
        card.style.transform  = "translateY(0) scale(1)";
      }, index * 70);
    });

    // Init filters after loading
    setTimeout(() => {
      initProjectFilter();
    }, repos.length * 70 + 300);

  } catch (error) {
    console.error("GitHub fetch error:", error);
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:var(--text-2);padding:4rem 0;">
        <p style="margin-bottom:1rem;font-size:1.1rem;"><i class="fa-solid fa-triangle-exclamation"></i> Impossible de charger les projets depuis GitHub.</p>
        <button onclick="fetchGitHubProjects()" class="filter-btn" style="cursor:pointer;margin-top:0.5rem;">Réessayer</button>
      </div>
    `;
  }
}

// ---- Project filter ----
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards  = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        if (filterValue === "all" || cardCategory === filterValue) {
          card.style.display = "block";
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity    = "1";
            card.style.transform  = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity   = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => { card.style.display = "none"; }, 300);
        }
      });
    });
  });
}

// ---- GSAP Page Animations ----
function initPageAnimations() {
  if (typeof gsap === "undefined") return;
  gsap.from(".page-title",   { duration: 0.8, y: 40, opacity: 0, ease: "power3.out" });
  gsap.from(".page-subtitle",{ duration: 0.8, y: 25, opacity: 0, ease: "power3.out", delay: 0.15 });
  gsap.from(".filter-btn",   { duration: 0.5, y: 15, opacity: 0, stagger: 0.08, ease: "power3.out", delay: 0.3 });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  initPageAnimations();
  fetchGitHubProjects();
});
