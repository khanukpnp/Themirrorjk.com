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
// CARD RENDERER
// ============================

function renderArticleCard(mediaId, bodyId, article) {

    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);

    if (!mediaEl || !bodyEl) return;

    if (article.heroImage && article.heroImage.src) {

        mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;

    }

    bodyEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.excerpt || ""}</p>
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

        .then(article => renderFullArticlePage(article));

}


// ============================
// FULL ARTICLE RENDERER
// ============================

function renderFullArticlePage(article) {

    const title = document.getElementById("title");

    if (title) title.textContent = article.title;

    const content = document.getElementById("content");

    if (!content) return;

    content.innerHTML = "";

    article.body.forEach(block => {

        if (block.type === "paragraph") {

            content.innerHTML += `<p>${block.text}</p>`;

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
