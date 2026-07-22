// ============================================
// PROJECTS PAGE – DYNAMIC GITHUB FETCHING
// ============================================

const GITHUB_USERNAME = "haibonwa-borel";

// ---- Mobile Navigation ----
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach((n) =>
      n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }),
    );
  }
});

// ---- Navbar scroll ----
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(7,7,13,0.95)";
  } else {
    navbar.style.background = "rgba(7,7,13,0.75)";
  }
});

// ---- Language colors (GitHub-style) ----
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  PowerShell: "#012456",
  Shell: "#89e051",
  Ruby: "#701516",
  Go: "#00ADD8",
};

// ---- Category detection ----
function getProjectCategory(repo) {
  const lang = (repo.language || "").toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  const mobileLangs = ["dart", "swift", "kotlin"];
  const mobileTopics = ["mobile", "flutter", "react-native", "android", "ios"];

  if (
    mobileLangs.includes(lang) ||
    mobileTopics.some((t) => topics.includes(t))
  ) {
    return "mobile";
  }

  const fullstackTopics = ["fullstack", "full-stack"];
  if (fullstackTopics.some((t) => topics.includes(t))) {
    return "fullstack";
  }

  return "web";
}

// ---- Generate gradient backgrounds based on language ----
function getCardGradient(language) {
  const gradients = {
    JavaScript: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)",
    Python: "linear-gradient(135deg, #1a1a2e 0%, #1b3a4e 100%)",
    HTML: "linear-gradient(135deg, #1a1a2e 0%, #4e1b1b 100%)",
    CSS: "linear-gradient(135deg, #1a1a2e 0%, #2e1b4e 100%)",
    PHP: "linear-gradient(135deg, #1a1a2e 0%, #1b2e4e 100%)",
    Dart: "linear-gradient(135deg, #1a1a2e 0%, #1b4e4a 100%)",
    PowerShell: "linear-gradient(135deg, #1a1a2e 0%, #1b2040 100%)",
  };
  return (
    gradients[language] || "linear-gradient(135deg, #1a1a2e 0%, #2e2e3e 100%)"
  );
}

// ---- Create project card ----
function createProjectCard(repo) {
  const category = getProjectCategory(repo);
  const description = repo.description || "Aucune description disponible.";
  const truncatedDesc =
    description.length > 130
      ? description.substring(0, 127) + "..."
      : description;

  let tags = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics)
    tags = [
      ...tags,
      ...repo.topics.filter((t) => t !== repo.language?.toLowerCase()),
    ];
  tags = tags.slice(0, 4);

  const tagsHtml = tags
    .map((tag) => `<span class="tech-tag">${tag}</span>`)
    .join("");
  const langColor = LANG_COLORS[repo.language] || "#00e88f";

  const div = document.createElement("div");
  div.className = "project-card";
  div.setAttribute("data-category", category);

  div.innerHTML = `
        <div class="project-image" style="background: ${getCardGradient(repo.language)}; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; padding: 1.5rem;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.6;">
                    ${repo.language === "HTML" ? "🌐" : repo.language === "Python" ? "🐍" : repo.language === "JavaScript" ? "⚡" : repo.language === "PHP" ? "🐘" : repo.language === "Dart" ? "🎯" : "💻"}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.8rem; color: ${langColor}; opacity: 0.8;">
                    ${repo.language || "N/A"}
                </div>
            </div>
            <div class="project-overlay">
                <div class="project-links">
                    <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">
                        <span>GitHub</span>
                    </a>
                    ${
                      repo.homepage
                        ? `
                    <a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer">
                        <span>Demo</span>
                    </a>`
                        : ""
                    }
                </div>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${repo.name.replace(/[-_]/g, " ")}</h3>
            <p class="project-description">${truncatedDesc}</p>
            <div class="project-tech">
                ${tagsHtml}
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 0.8rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-3);">
                ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ""}
                ${repo.forks_count > 0 ? `<span>🔀 ${repo.forks_count}</span>` : ""}
                <span style="margin-left: auto;">${new Date(repo.updated_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
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
      {
        headers: { Accept: "application/vnd.github.mercy-preview+json" },
      },
    );

    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

    const fetchedRepos = await response.json();

    // Add custom Zevaba project
    const zevabaProject = {
      name: "Zevaba.com",
      description:
        "Application mobile et plateforme web pour Zevaba, développée avec Flutter.",
      language: "Dart",
      topics: ["flutter", "mobile", "frontend"],
      html_url: "https://zevaba.com",
      homepage: "https://zevaba.com",
      stargazers_count: 0,
      forks_count: 0,
      updated_at: new Date().toISOString(),
    };

    const repos = [zevabaProject, ...fetchedRepos];

    grid.innerHTML = "";

    if (repos.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: var(--text-2); padding: 4rem 0;">Aucun projet trouvé.</p>';
      return;
    }

    repos.forEach((repo, index) => {
      const card = createProjectCard(repo);
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      grid.appendChild(card);

      // Staggered reveal
      setTimeout(() => {
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 80);
    });

    // Init filters after loading
    setTimeout(
      () => {
        initProjectFilter();
        initProjectHoverEffects();
      },
      repos.length * 80 + 200,
    );
  } catch (error) {
    console.error("GitHub fetch error:", error);
    grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-2); padding: 4rem 0;">
                <p style="margin-bottom: 1rem;">Impossible de charger les projets depuis GitHub.</p>
                <button onclick="fetchGitHubProjects()" class="filter-btn" style="cursor: pointer;">Réessayer</button>
            </div>
        `;
  }
}

// ---- Project filter ----
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");

        if (filterValue === "all" || cardCategory === filterValue) {
          card.style.display = "block";
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// ---- Hover effects ----
function initProjectHoverEffects() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const overlay = card.querySelector(".project-overlay");
      if (overlay) overlay.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      const overlay = card.querySelector(".project-overlay");
      if (overlay) overlay.style.opacity = "0";
    });
  });
}

// ---- Page animations ----
function initPageAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.from(".page-title", {
    duration: 0.8,
    y: 40,
    opacity: 0,
    ease: "power3.out",
  });
  gsap.from(".page-subtitle", {
    duration: 0.8,
    y: 25,
    opacity: 0,
    ease: "power3.out",
    delay: 0.15,
  });
  gsap.from(".filter-btn", {
    duration: 0.5,
    y: 15,
    opacity: 0,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.3,
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  initPageAnimations();
  fetchGitHubProjects();
});
