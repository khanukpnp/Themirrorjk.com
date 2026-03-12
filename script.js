// ============================
// BASIC INITIALISATION
// ============================

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initYear();
    initClocks();
    updateHijri();
    updateVikramSamvat();
    initWeatherBar();
    initTicker();
    initNav();
    initContactModal();
    initVlogs();

    const isArticlePage = document.body.classList.contains("article-page");
    if (isArticlePage) {
        initArticlePage();
    } else {
        loadHomepageIndex();
    }
});

// ============================
// LOAD HOMEPAGE INDEX
// ============================

function loadHomepageIndex() {
    fetch("content/index.json")
        .then(r => r.json())
        .then(data => {
            if (data.homepage) {
                loadTopStories(data.homepage.topStories);
                loadLatestEditorialHistorical(data.homepage.latestEditorialHistorical);
                loadJammuKashmir(data.homepage.jammuKashmir);
                loadInternational(data.homepage.international);
                loadHumanRights(data.homepage.humanRights);
            }
        })
        .catch(err => console.error("Index JSON error:", err));
}

// ============================
// LOAD TOP STORIES
// ============================

function loadTopStories(section) {
    if (!section) return;

    if (section.lead)
        loadArticleToCard(section.lead, "lead-media", "lead-body");

    if (section.breaking)
        loadArticleToCard(section.breaking, "breaking-media", "breaking-body");

    if (section.opinion)
        loadArticleToCard(section.opinion, "opinion-media", "opinion-body");
}

// ============================
// LOAD LATEST / EDITORIAL / HISTORICAL
// ============================

function loadLatestEditorialHistorical(section) {
    if (!section) return;

    if (section.latest)
        loadArticleToCard(section.latest, "leh1-media", "leh1-body");

    if (section.editorial)
        loadArticleToCard(section.editorial, "leh2-media", "leh2-body");

    if (section.historical)
        loadArticleToCard(section.historical, "leh3-media", "leh3-body");
}

// ============================
// LOAD JAMMU KASHMIR
// ============================

function loadJammuKashmir(section) {
    if (!section) return;

    if (section[0])
        loadArticleToCard(section[0], "jk1-media", "jk1-body");

    if (section[1])
        loadArticleToCard(section[1], "jk2-media", "jk2-body");
}

// ============================
// LOAD INTERNATIONAL
// ============================

function loadInternational(section) {
    if (!section) return;

    if (section[0])
        loadArticleToCard(section[0], "intl1-media", "intl1-body");

    if (section[1])
        loadArticleToCard(section[1], "intl2-media", "intl2-body");
}

// ============================
// LOAD HUMAN RIGHTS
// ============================

function loadHumanRights(section) {
    if (!section) return;

    if (section[0])
        loadArticleToCard(section[0], "hr1-media", "hr1-body");

    if (section[1])
        loadArticleToCard(section[1], "hr2-media", "hr2-body");
}

// ============================
// UNIVERSAL ARTICLE LOADER
// ============================

function loadArticleToCard(articleId, mediaId, bodyId) {
    if (!articleId) return;

    fetch(`content/${articleId}.json`)
        .then(r => r.json())
        .then(article => {
            renderArticleCard(mediaId, bodyId, article, true);
        })
        .catch(() => {
            const body = document.getElementById(bodyId);
            if (body) {
                body.innerHTML = `
<h3>Coming Soon</h3>
<p>Content will be added shortly.</p>
`;
            }
        });
}

// ============================
// LOADER
// ============================

function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;

    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 300);
    }, 800);
}

// ============================
// FOOTER YEAR
// ============================

function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
}

// ============================
// CLOCKS
// ============================

function initClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    const cestEl = document.querySelector("#clock-cest span");

    if (cestEl) {
        cestEl.textContent = now.toLocaleString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
    // If you later re-add IST / PKT elements, you can extend here.
}

// ============================
// HIJRI CALENDAR
// ============================

function updateHijri() {
    const hijriEl = document.querySelector("#cal-hijri span");
    if (!hijriEl) return;

    try {
        const now = new Date();
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        hijriEl.textContent = hijriDate;
    } catch {
        hijriEl.textContent = "Hijri calendar";
    }
}

// ============================
// VIKRAM SAMVAT
// ============================

function updateVikramSamvat() {
    const vsEl = document.querySelector("#cal-hindi span");
    if (!vsEl) return;

    const now = new Date();
    const vsYear = now.getFullYear() + 57;
    const months = [
        "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha",
        "Shravana", "Bhadrapada", "Ashwin", "Kartika",
        "Margashirsha", "Pausha", "Magha", "Phalguna"
    ];

    vsEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${vsYear} VS`;
}

// ============================
// WEATHER BAR
// ============================

function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;

    const cities = [
        { name: "Zurich", temp: "6°C" },
        { name: "Rawalakot", temp: "9°C" },
        { name: "Jammu", temp: "18°C" },
        { name: "Kashmir", temp: "4°C" },
        { name: "Ladakh", temp: "-2°C" },
        { name: "Gilgit", temp: "3°C" },
        { name: "Baltistan", temp: "-1°C" },
        { name: "Muzaffarabad", temp: "10°C" }
    ];

    bar.innerHTML = cities.map(c => `
<div class="chip tiny">
  🌡️ ${c.name}: <strong>${c.temp}</strong>
</div>
`).join("");
}

// ============================
// TICKER
// ============================

function initTicker() {
    fetch("content/index.json")
        .then(r => r.json())
        .then(data => {
            const ul = document.getElementById("ticker-items");
            if (!ul || !data.ticker) return;
            ul.innerHTML = data.ticker.map(t => `<li>${t}</li>`).join("");
        })
        .catch(() => {});
}

// ============================
// NAVIGATION
// ============================

function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!hamburger || !navList || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));

        if (expanded) {
            mobileMenu.hidden = true;
            mobileMenu.innerHTML = "";
        } else {
            mobileMenu.hidden = false;
            mobileMenu.innerHTML = navList.innerHTML;
        }
    });
}

// ============================
// CONTACT MODAL
// ============================

function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");

    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// ============================
// VLOGS
// ============================

function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;

    const vlogs = [
        { title: "Kashmir Protest Highlights", duration: "4:32" },
        { title: "Diaspora Voices on Human Rights", duration: "6:10" },
        { title: "Brief History of Jammu & Kashmir", duration: "8:45" }
    ];

    grid.innerHTML = vlogs.map(v => `
<article class="card">
  <div class="vlog-thumb">
    <div class="play-icon">▶</div>
  </div>
  <div class="card-body">
    <h3>${v.title}</h3>
    <p>Duration: ${v.duration}</p>
  </div>
</article>
`).join("");
}

// ============================
// CATEGORY THEME HELPER
// ============================

function getCategoryTheme(category) {
    const themes = {
        "Breaking News": { colorClass: "cat-breaking", label: "BREAKING", icon: "🛑" },
        "Blog": { colorClass: "cat-blog", label: "OPINION", icon: "✏️" },
        "Opinion": { colorClass: "cat-blog", label: "OPINION", icon: "✏️" },
        "Editorial": { colorClass: "cat-editorial", label: "EDITORIAL", icon: "🖋️" },
        "Historical": { colorClass: "cat-historical", label: "HISTORICAL DOCUMENT", icon: "🏛️" },
        "Human Rights": { colorClass: "cat-humanrights", label: "HUMAN RIGHTS REPORT", icon: "❤️" },
        "International": { colorClass: "cat-international", label: "INTERNATIONAL", icon: "🌍" },
        "Latest": { colorClass: "cat-latest", label: "LATEST UPDATE", icon: "🕒" },
        "Jammu Kashmir": { colorClass: "cat-jk", label: "JAMMU & KASHMIR", icon: "📍" },
        "Vlog": { colorClass: "cat-vlog", label: "VIDEO REPORT", icon: "🎥" }
    };

    return themes[category] || { colorClass: "cat-default", label: category || "NEWS", icon: "📰" };
}

// ============================
// CARD RENDERER (HOMEPAGE)
// ============================

function renderArticleCard(mediaId, bodyId, article) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);
    if (!mediaEl || !bodyEl) return;

    const theme = getCategoryTheme(article.category);

    const heroHtml =
        article.heroImage && article.heroImage.src
            ? `<img src="${article.heroImage.src}" alt="">`
            : "";

    bodyEl.innerHTML = `
<h3>${article.title}</h3>

<div class="card-hero">
  ${heroHtml}
</div>

<p>${article.excerpt || ""}</p>

<p class="card-meta">
  <span class="card-category ${theme.colorClass}">${theme.icon} ${theme.label}</span>
</p>

<a class="btn-red" href="article.html?id=${article.id}">
  Read More →
</a>
`;
}

// ============================
// ARTICLE PAGE
// ============================

function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    fetch(`content/${id}.json`)
        .then(r => r.json())
        .then(article => renderFullArticlePage(article))
        .catch(err => {
            console.error("Article load error:", err);
            const title = document.getElementById("title");
            if (title) title.textContent = "Error loading article";
        });
}

// ============================
// META FORMATTER
// ============================

function formatArticleMeta(article) {
    if (!article || !article.date) return "";

    const dateObj = new Date(article.date);
    const day = dateObj.toLocaleString("en-GB", { weekday: "long" });
    const dateStr = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const timeStr = dateObj.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const location = article.location || "";
    const author = article.author || "";
    const desk = article.desk || "";

    let byline = "";
    if (author && desk) {
        byline = `By <em>${author}</em> — ${desk}`;
    } else if (author) {
        byline = `By <em>${author}</em>`;
    } else if (desk) {
        byline = desk;
    }

    return `
<strong>${location}</strong> — ${day}, ${dateStr} — ${timeStr}<br>
${byline}
`;
}

// ============================
// FULL ARTICLE RENDERER
// ============================

function renderFullArticlePage(article) {
    // PAGE TITLE
    const pageTitle = document.getElementById("page-title");
    if (pageTitle && article.title) {
        pageTitle.textContent = `${article.title} | THE MIRROR JAMMU KASHMIR`;
    }

    // SECTION LABEL + CATEGORY THEME
    const sectionLabel = document.getElementById("section-label");
    const theme = getCategoryTheme(article.category);
    if (sectionLabel) {
        sectionLabel.textContent = article.category || "THE MIRROR JAMMU KASHMIR";
        sectionLabel.classList.add(theme.colorClass);
    }

    // MAIN HEADLINE
    const title = document.getElementById("title");
    if (title) title.textContent = article.title || "";

    // HERO IMAGE
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const heroWrap = document.getElementById("heroWrap");

    if (article.heroImage && article.heroImage.src && heroImg && heroCaption && heroWrap) {
        heroImg.src = article.heroImage.src;
        heroImg.alt = article.heroImage.caption || article.title || "";
        heroCaption.textContent = article.heroImage.caption
            ? `${article.heroImage.caption}${article.heroImage.credit ? " — " + article.heroImage.credit : ""}`
            : "";
        heroWrap.style.display = "";
    } else if (heroWrap) {
        heroWrap.style.display = "none";
    }

    // META
    const metaEl = document.getElementById("meta");
    if (metaEl) {
        metaEl.innerHTML = formatArticleMeta(article);
    }

    // CONTENT
    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = "";

    // STANDFIRST (2nd SUBHEADING)
    if (article.standfirst) {
        content.innerHTML += `
<p class="standfirst">
  ${article.standfirst}
</p>
`;
    }

    // BODY BLOCKS
    if (Array.isArray(article.body)) {
        article.body.forEach(block => {
            if (block.type === "paragraph") {
                content.innerHTML += `<p>${block.text}</p>`;
            }

            if (block.type === "points") {
                if (block.style === "pull") {
                    content.innerHTML += `
<div class="pull-quote">
  ${block.items.map(i => `<p>${i}</p>`).join("")}
</div>
`;
                } else {
                    content.innerHTML += `
<div class="important-points">
  <ul>
    ${block.items.map(i => `<li>${i}</li>`).join("")}
  </ul>
</div>
`;
                }
            }

            if (block.type === "pullquote") {
                content.innerHTML += `
<div class="pull-points">
  <p>${block.text}</p>
</div>
`;
            }

            if (block.type === "image") {
                const alignClass = block.align === "right" ? "img-right" : "img-left";
                content.innerHTML += `
<figure class="${alignClass}">
  <img src="${block.src}" alt="">
  <figcaption>${block.caption || ""}</figcaption>
</figure>
`;
            }
        });
    }
}

// ============================
// ARTICLE ACTION BAR
// ============================

function addArticleActions() {
    const content = document.getElementById("content");
    if (!content) return;

    const actions = document.createElement("div");
    actions.className = "article-actions";

    actions.innerHTML = `
<button class="act-btn" onclick="alert('Liked!')">👍 Like</button>
<button class="act-btn" onclick="navigator.share({title: document.title, url: location.href})">🔗 Share</button>
<button class="act-btn" onclick="alert('Subscribed!')">✉️ Subscribe</button>
<button class="act-btn" onclick="navigator.clipboard.writeText(location.href)">📋 Copy Link</button>
`;

    content.appendChild(actions);
}

// Attach after article loads
const originalRenderFullArticlePage = renderFullArticlePage;
renderFullArticlePage = function (article) {
    originalRenderFullArticlePage(article);
    addArticleActions();
};
