/* ============================================================
PAGE LOADER & GLOBAL INIT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Core UI
    if (typeof initLoader === "function") initLoader();
    initYear();

    // Time & calendars
    updateGregorian();
    updateHijri();
    updateBikrami();
    updateClocks();

    // Live weather
    initWeatherBar();

    // UI components
    initTicker();
    initNav();
    initContactModal();
    initVlogs();
    initVlogChannelButton();

    // Auto-refresh
    setInterval(updateGregorian, 1000);
    setInterval(updateHijri, 60000);
    setInterval(updateBikrami, 60000);
    setInterval(updateClocks, 1000);

    // Homepage content loader
    loadHomepageIndex();

    // Load homepage sections (Latest, Editorial, Historical) if present
    if (
        document.getElementById("latest-media") ||
        document.getElementById("editorial-media") ||
        document.getElementById("historical-media")
    ) {
        loadHomepageSections();
    }

    // Article/static page loader (no-op on pages without article container)
    loadArticlePage();
});

/* ============================================================
ARTICLE / STATIC PAGE LOADER
============================================================ */

function loadArticlePage() {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    const path = window.location.pathname.toLowerCase();

    // Detect static pages
    if (!id) {
        if (path.includes("about")) id = "about-001";
        else if (path.includes("chief-editor")) id = "chief-editor-001";
        else if (path.includes("blog")) id = "blog-001";
    }

    // Stop safely if no article id
    if (!id) return;

    fetch(`content/${id}.json`)
        .then(res => {
            if (!res.ok) {
                console.error("Article JSON not found:", id);
                return null;
            }
            return res.json();
        })
        .then(article => {
            if (!article) return;

            const title = document.getElementById("title");
            const label = document.getElementById("section-label");
            const meta = document.getElementById("meta");
            const hero = document.getElementById("heroImg");
            const caption = document.getElementById("heroCaption");
            const content = document.getElementById("content");
            if (!content) return;

            // Header
            if (title) title.textContent = article.title;
            if (label) label.textContent = article.sectionLabel || "";
            if (meta) {
                const d = new Date(article.date).toLocaleDateString();
                meta.textContent = `${article.author} | ${article.location} | ${d} | ${article.readTime}`;
            }

            // Hero image
            if (hero && article.heroImage?.src) hero.src = article.heroImage.src;
            if (caption) caption.textContent = article.heroImage?.caption || "";

            // Clear content
            content.innerHTML = "";

            // Render article blocks
            article.body.forEach(block => {
                if (block.type === "paragraph") {
                    content.innerHTML += `<p>${block.text}</p>`;
                }
                if (block.type === "subheading") {
                    content.innerHTML += `<h2 class="mid-subheading">${block.text}</h2>`;
                }
                if (block.type === "pullquote") {
                    content.innerHTML += `<div class="pull-quote">${block.text}</div>`;
                }
                if (block.type === "points") {
                    content.innerHTML += `
                        <div class="important-points">
                            <ul>
                                ${block.items.map(i => `<li>${i}</li>`).join("")}
                            </ul>
                        </div>
                    `;
                }
                if (block.type === "image") {
                    const align = block.align === "right" ? "img-right" : "img-left";
                    content.innerHTML += `
                        <figure class="${align}">
                            <img src="${block.src}" loading="lazy">
                            <figcaption>${block.caption || ""}</figcaption>
                        </figure>
                    `;
                }
            });

            // ARTICLE ACTION BAR
            content.innerHTML += `
                <div class="article-actions">
                    <button class="action-btn" onclick="likeArticle()">👍 Like</button>
                    <button class="action-btn" onclick="subscribeChannel()">🔔 Subscribe</button>
                    <button class="action-btn" onclick="shareArticle()">🔗 Share</button>
                    <button class="action-btn" onclick="copyLink()">📋 Copy Link</button>
                </div>
            `;
        })
        .catch(err => console.error("Article load error:", err));
}

/* ============================================================
FOOTER YEAR
============================================================ */

function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
}

/* ============================================================
GREGORIAN DATE (FULL DATE + TIME)
============================================================ */

function updateGregorian() {
    const el = document.querySelector("#cal-gregorian span");
    if (!el) return;

    const now = new Date();
    el.textContent = now.toLocaleString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

/* ============================================================
HIJRI DATE
============================================================ */

function updateHijri() {
    const el = document.querySelector("#cal-hijri span");
    if (!el) return;

    try {
        const now = new Date();
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        el.textContent = hijriDate;
    } catch {
        el.textContent = "Hijri calendar";
    }
}

/* ============================================================
PUNJABI DESI BIKRAMI DATE
============================================================ */

function updateBikrami() {
    const el = document.querySelector("#cal-bikrami span");
    if (!el) return;

    const now = new Date();
    const months = [
        "Chet","Vaisakh","Jeth","Harh","Sawan","Bhadon",
        "Assu","Kattak","Maghar","Poh","Magh","Phagun"
    ];
    const startMonth = 2; // Chet begins in March
    const month = (now.getMonth() - startMonth + 12) % 12;
    const year = now.getFullYear() + 57;
    const day = now.getDate();

    el.textContent = `${day} ${months[month]} ${year} BK`;
}

/* ============================================================
CLOCKS — CEST / IST / PKT
============================================================ */

function updateClocks() {
    const now = new Date();

    const zones = [
        { selector: "#clock-cest span", tz: "Europe/Zurich" },
        { selector: "#tz-ist span", tz: "Asia/Kolkata" },
        { selector: "#tz-pkt span", tz: "Asia/Karachi" }
    ];

    zones.forEach(z => {
        const el = document.querySelector(z.selector);
        if (el) {
            el.textContent = now.toLocaleTimeString("en-GB", {
                timeZone: z.tz,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }
    });
}

/* ============================================================
WEATHER BAR — LIVE OPEN-METEO API
============================================================ */

async function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;

    const cities = [
        { name: "Zurich", lat: 47.3769, lon: 8.5417 },
        { name: "Rawalakot", lat: 33.8570, lon: 73.7604 },
        { name: "Jammu", lat: 32.7266, lon: 74.8570 },
        { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
        { name: "Ladakh", lat: 34.1526, lon: 77.5770 },
        { name: "Gilgit", lat: 35.9208, lon: 74.3089 },
        { name: "Baltistan", lat: 35.3500, lon: 75.5500 },
        { name: "Muzaffarabad", lat: 34.3700, lon: 73.4700 }
    ];

    const fetchWeather = async c => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;
            const res = await fetch(url);
            const data = await res.json();
            return `${Math.round(data.current_weather.temperature)}°C`;
        } catch {
            return "—°C";
        }
    };

    const temps = await Promise.all(cities.map(fetchWeather));

    bar.innerHTML = cities
        .map((c, i) => `
            <div class="chip tiny">
                🌡️ ${c.name}: <strong>${temps[i]}</strong>
            </div>
        `)
        .join("");

    // Auto-refresh every 10 minutes
    setTimeout(initWeatherBar, 600000);
}

/* ============================================================
TICKER
============================================================ */

function initTicker() {
    const ul = document.getElementById("ticker-items");
    if (!ul) return;

    const items = [
        "WE DO NOT MANUFACTURE NARRATIVES — WE REFLECT REALITY",
        "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH"
    ];

    const fullList = items.concat(items);
    ul.innerHTML = fullList.map(t => `<li class="ticker-item">${t}</li>`).join("");

    ul.style.display = "flex";
    ul.style.gap = "60px";
    ul.style.whiteSpace = "nowrap";
    ul.style.alignItems = "center";
    ul.style.willChange = "transform";

    let position = 0;

    function scrollTicker() {
        position -= 0.4;
        if (Math.abs(position) >= ul.scrollWidth / 2) {
            position = 0;
        }
        ul.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(scrollTicker);
    }

    scrollTicker();
}

/* ============================================================
NAVIGATION
============================================================ */

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

/* ============================================================
CONTACT MODAL
============================================================ */

function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

/* ============================================================
VLOGS
============================================================ */

function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;

    const vlogs = [
        { title: "Kashmir Protest Highlights", duration: "4:32" },
        { title: "Diaspora Voices on Human Rights", duration: "6:10" },
        { title: "Brief History of Jammu & Kashmir", duration: "8:45" }
    ];

    grid.innerHTML = vlogs
        .map(
            v => `
            <article class="card">
                <div class="media maroon">▶</div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>Duration: ${v.duration}</p>
                </div>
            </article>
        `
        )
        .join("");
}

function initVlogChannelButton() {
    const btn = document.getElementById("vlog-visit-channel");
    if (!btn) return;
    btn.addEventListener("click", () => {
        window.open("https://youtube.com/@themirrorjk", "_blank");
    });
}

/* ============================================================
HOMEPAGE CONTENT LOADER
============================================================ */

function loadHomepageIndex() {
    fetch("content/index.json")
        .then(r => r.json())
        .then(data => {
            const hp = data.homepage || data;
            if (hp.topStories) loadTopStories(hp.topStories);
            if (hp.latestEditorialHistorical)
                loadLatestEditorialHistorical(hp.latestEditorialHistorical);
            if (hp.jammuKashmir) loadJammuKashmir(hp.jammuKashmir);
            if (hp.international) loadInternational(hp.international);
            if (hp.humanRights) loadHumanRights(hp.humanRights);
        })
        .catch(err => console.error("Index JSON error:", err));
}

/* ============================================================
TOP STORIES
============================================================ */

function loadTopStories(section) {
    if (section.lead) loadArticleToCard(section.lead, "lead-media", "lead-body");
    if (section.breaking) loadArticleToCard(section.breaking, "breaking-media", "breaking-body");
    if (section.opinion) loadArticleToCard(section.opinion, "opinion-media", "opinion-body");
}

/* ============================================================
UNIVERSAL ARTICLE LOADER
============================================================ */

function loadArticleToCard(articleId, mediaId, bodyId) {
    fetch(`content/${articleId}.json`)
        .then(r => r.json())
        .then(article => {
            renderArticleCard(mediaId, bodyId, article);
        })
        .catch(err => console.error(`Error loading ${articleId}:`, err));
}

/* ============================================================
RENDER ARTICLE CARD
============================================================ */

function renderArticleCard(mediaId, bodyId, article) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);
    if (!mediaEl || !bodyEl) return;

    if (article.heroImage && article.heroImage.src) {
        mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;
    }

    bodyEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.excerpt || article.summary || ""}</p>
        <a class="btn-red" href="article.html?id=${article.id}">Read More →</a>
    `;
}

/* ============================================================
LOAD HOMEPAGE CARDS (Latest, Editorial, Historical)
============================================================ */

async function loadHomepageSections() {
    try {
        const res = await fetch("content/index.json");
        const index = await res.json();

        // Latest
        if (index.latest && index.latest.length) {
            const latestId = index.latest[0];
            const latestRes = await fetch(`content/${latestId}.json`);
            const latestArticle = await latestRes.json();
            renderArticleCard("latest-media", "latest-body", latestArticle);
        }

        // Editorial
        if (index.editorial && index.editorial.length) {
            const editorialId = index.editorial[0];
            const editorialRes = await fetch(`content/${editorialId}.json`);
            const editorialArticle = await editorialRes.json();
            renderArticleCard("editorial-media", "editorial-body", editorialArticle);
        }

        // Historical
        if (index.historical && index.historical.length) {
            const historicalId = index.historical[0];
            const historicalRes = await fetch(`content/${historicalId}.json`);
            const historicalArticle = await historicalRes.json();
            renderArticleCard("historical-media", "historical-body", historicalArticle);
        }
    } catch (err) {
        console.error("Homepage load error:", err);
    }
}

/* ============================================================
LATEST · EDITORIAL · HISTORICAL (from index.homepage.latestEditorialHistorical)
============================================================ */

function loadLatestEditorialHistorical(section) {
    // Defensive: support both array of IDs and structured object
    if (Array.isArray(section)) {
        const [latestId, editorialId, historicalId] = section;

        if (latestId) loadArticleToCard(latestId, "latest-media", "latest-body");
        if (editorialId) loadArticleToCard(editorialId, "editorial-media", "editorial-body");
        if (historicalId) loadArticleToCard(historicalId, "historical-media", "historical-body");
    } else if (typeof section === "object" && section !== null) {
        if (section.latest) loadArticleToCard(section.latest, "latest-media", "latest-body");
        if (section.editorial) loadArticleToCard(section.editorial, "editorial-media", "editorial-body");
        if (section.historical) loadArticleToCard(section.historical, "historical-media", "historical-body");
    }
}

/* ============================================================
JAMMU KASHMIR / INTERNATIONAL / HUMAN RIGHTS
============================================================ */

function loadJammuKashmir(section) {
    if (section.first) loadArticleToCard(section.first, "jk1-media", "jk1-body");
    if (section.second) loadArticleToCard(section.second, "jk2-media", "jk2-body");
}

function loadInternational(section) {
    if (section.first) loadArticleToCard(section.first, "intl1-media", "intl1-body");
    if (section.second) loadArticleToCard(section.second, "intl2-media", "intl2-body");
}

function loadHumanRights(section) {
    if (section.first) loadArticleToCard(section.first, "hr1-media", "hr1-body");
    if (section.second) loadArticleToCard(section.second, "hr2-media", "hr2-body");
}

/* ============================================================
ARTICLE ACTIONS
============================================================ */

function likeArticle() {
    alert("Thank you for liking this article.");
}

function subscribeChannel() {
    window.open("https://youtube.com/@themirrorjk", "_blank");
}

function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        alert("Sharing not supported on this browser.");
    }
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied.");
}
