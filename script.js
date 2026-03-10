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

    // NEW: Load homepage index first
    loadHomepageIndex();
});

// ============================
// LOAD HOMEPAGE INDEX (NEW)
// ============================

function loadHomepageIndex() {
    fetch("content/index.json")
        .then(r => r.json())
        .then(data => {
            loadTopStories(data.homepage.topStories);
            loadLatestEditorialHistorical(data.homepage.latestEditorialHistorical);
        })
        .catch(err => console.error("Index JSON error:", err));
}

// ============================
// LOAD TOP STORIES (NEW)
// ============================

function loadTopStories(section) {
    if (section.lead) loadArticleToCard(section.lead, "lead-media", "lead-body");
    if (section.breaking) loadArticleToCard(section.breaking, "breaking-media", "breaking-body");
    if (section.opinion) loadArticleToCard(section.opinion, "opinion-media", "opinion-body");
}

// ============================
// LOAD LATEST / EDITORIAL / HISTORICAL (NEW)
// ============================

function loadLatestEditorialHistorical(section) {
    if (section.latest) loadArticleToCard(section.latest, "leh1-media", "leh1-body");
    if (section.editorial) loadArticleToCard(section.editorial, "leh2-media", "leh2-body");
    if (section.historical) loadArticleToCard(section.historical, "leh3-media", "leh3-body");
}

// ============================
// UNIVERSAL ARTICLE LOADER (NEW)
// ============================

function loadArticleToCard(articleId, mediaId, bodyId) {
    fetch(`content/${articleId}.json`)
        .then(r => r.json())
        .then(article => {
            renderArticleCard(mediaId, bodyId, article, true);
        })
        .catch(err => console.error(`Error loading ${articleId}:`, err));
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
// CLOCKS & TIMEZONES
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

    const istEl = document.querySelector("#tz-ist span");
    if (istEl) {
        istEl.textContent = new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    const pktEl = document.querySelector("#tz-pkt span");
    if (pktEl) {
        pktEl.textContent = new Date().toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
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
            if (!ul) return;

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
// ARTICLE RENDERING
// ============================

function renderArticleCard(mediaId, bodyId, article, isSimple = true) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);

    if (!mediaEl || !bodyEl) return;

    if (article.heroImage && article.heroImage.src) {
        mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;
    } else if (article.hero_image) {
        mediaEl.innerHTML = `<img src="content/images/${article.hero_image}" alt="">`;
    }

    bodyEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.excerpt || article.summary || ""}</p>
    `;
}
// ======================================================
// ARTICLE PAGE DETECTION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const isArticlePage = document.body.classList.contains("article-page");
    if (isArticlePage) {
        initArticlePage();
    }
});

// ======================================================
// INITIALISE ARTICLE PAGE
// ======================================================

function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    fetch(`content/${id}.json`)
        .then(r => r.json())
        .then(article => renderFullArticlePage(article))
        .catch(err => console.error("Article load error:", err));
}

// ======================================================
// FULL ARTICLE PAGE RENDERER (BBC / DW / Reuters Style)
// ======================================================

function renderFullArticlePage(article) {

    // SECTION LABEL
    const sectionLabel = document.getElementById("section-label");
    if (sectionLabel) {
        sectionLabel.textContent = article.category || "THE MIRROR JAMMU KASHMIR";
    }

    // PAGE TITLE
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = `${article.title} | THE MIRROR JAMMU KASHMIR`;
    }

    // MAIN HEADLINE
    const titleEl = document.getElementById("title");
    if (titleEl) {
        titleEl.textContent = article.title;
    }

    // META: PLACE — DAY — DATE — TIME — BYLINE
    const metaEl = document.getElementById("meta");
    if (metaEl) {
        const dateObj = new Date(article.date);
        const day = dateObj.toLocaleString("en-GB", { weekday: "long" });
        const dateStr = dateObj.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const timeStr = dateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const place = article.location || "";
        const byline = article.author || "The Mirror Jammu Kashmir Desk";

        metaEl.innerHTML = `
            <strong>${place}</strong> — ${day}, ${dateStr} — ${timeStr}<br>
            By <em>${byline}</em>
        `;
    }

    // HERO IMAGE
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const heroWrap = document.getElementById("heroWrap");

    if (article.heroImage && article.heroImage.src) {
        heroImg.src = article.heroImage.src;
        heroCaption.textContent = article.heroImage.caption || "";
    } else {
        heroWrap.style.display = "none";
    }

    // BODY CONTENT
    const contentEl = document.getElementById("content");
    if (!contentEl) return;

    contentEl.innerHTML = "";

    article.body.forEach(block => {

        // PARAGRAPH
        if (block.type === "paragraph") {
            contentEl.innerHTML += `<p>${block.text}</p>`;
        }

        // IMPORTANT POINTS (BBC / DW style)
        if (block.type === "points") {
            contentEl.innerHTML += `
                <div class="important-points">
                    <ul>
                        ${block.items.map(i => `<li>${i}</li>`).join("")}
                    </ul>
                </div>
            `;
        }

        // INLINE IMAGE (LEFT / RIGHT FLOAT)
        if (block.type === "image") {
            const alignClass = block.align === "right" ? "img-right" : "img-left";
            contentEl.innerHTML += `
                <figure class="${alignClass}">
                    <img src="${block.src}" alt="">
                    <figcaption>${block.caption || ""}</figcaption>
                </figure>
            `;
        }
    });
}

// ======================================================
// HOMEPAGE READ MORE LINKS
// ======================================================

function attachReadMoreLink(bodyId, articleId) {
    const bodyEl = document.getElementById(bodyId);
    if (!bodyEl) return;

    const link = bodyEl.querySelector("a.btn-red");
    if (!link) return;

    link.href = `article.html?id=${articleId}`;
}

// Modify renderArticleCard to attach read-more links
const originalRenderArticleCard = renderArticleCard;

renderArticleCard = function(mediaId, bodyId, article, isSimple = true) {
    originalRenderArticleCard(mediaId, bodyId, article, isSimple);

    // Attach read-more link
    attachReadMoreLink(bodyId, article.id);
};
