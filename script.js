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
    loadBreaking();
    loadBlog();
    loadLatest();
    loadEditorial();
    loadHistorical();
});

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

    // CEST (browser local assumed Europe/Zurich)
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

    // IST
    const istEl = document.querySelector("#tz-ist span");
    if (istEl) {
        const ist = new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        istEl.textContent = ist;
    }

    // PKT
    const pktEl = document.querySelector("#tz-pkt span");
    if (pktEl) {
        const pkt = new Date().toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        pktEl.textContent = pkt;
    }
}

// ============================
// HIJRI CALENDAR (APPROXIMATE)
// ============================
function updateHijri() {
    const hijriEl = document.querySelector("#cal-hijri span");
    if (!hijriEl) return;

    // Simple approximation using Intl (where supported)
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
// VIKRAM SAMVAT CALENDAR (VS)
// ============================
function updateVikramSamvat() {
    const vsEl = document.querySelector("#cal-hindi span");
    if (!vsEl) return;

    const now = new Date();
    const vsYear = now.getFullYear() + 57; // Approximate offset

    const months = [
        "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha",
        "Shravana", "Bhadrapada", "Ashwin", "Kartika",
        "Margashirsha", "Pausha", "Magha", "Phalguna"
    ];

    const month = months[now.getMonth()];
    const day = now.getDate();

    vsEl.textContent = `${day} ${month} ${vsYear} VS`;
}

// ============================
// WEATHER BAR (STATIC SAMPLE)
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
// BREAKING TICKER
// ============================
function initTicker() {
    const ul = document.getElementById("ticker-items");
    if (!ul) return;

    const items = [
        "Rawalakot shutter down protest over power cuts and blackouts.",
        "UKPNP briefs British MPs on Kashmir crisis in London.",
        "UKPNP delegation meets Baroness Emma Nicholson on Kashmir developments.",
        "Brief history of the State of Jammu and Kashmir, 1819–1953."
    ];

    ul.innerHTML = items.map(t => `<li>${t}</li>`).join("");
}

// ============================
// NAVIGATION (MOBILE)
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

    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// ============================
// VLOGS (STATIC PLACEHOLDERS)
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
// ARTICLE RENDERING HELPERS
// ============================
function renderBlock(block) {
    if (block.type === "paragraph") {
        return `<p>${block.text}</p>`;
    }

    if (block.type === "points") {
        return `
            <ul>
                ${block.items.map(i => `<li>${i}</li>`).join("")}
            </ul>
        `;
    }

    if (block.type === "image") {
        const alignClass = block.align === "right" ? "img-right" :
                           block.align === "left" ? "img-left" : "";
        return `
            <figure class="${alignClass}">
                <img src="${block.src}" alt="">
                <figcaption>${block.caption}</figcaption>
            </figure>
        `;
    }

    return "";
}

function renderArticleCard(mediaId, bodyId, article, isSimple = true) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);
    if (!mediaEl || !bodyEl) return;

    if (article.heroImage && article.heroImage.src) {
        mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;
    } else if (article.hero_image) {
        mediaEl.innerHTML = `<img src="content/images/${article.hero_image}" alt="">`;
    }

    if (isSimple) {
        bodyEl.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.excerpt || article.summary || ""}</p>
        `;
    } else {
        const previewBlocks = (article.body || []).slice(0, 3).map(renderBlock).join("");
        bodyEl.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.excerpt || article.summary || ""}</p>
            ${previewBlocks}
        `;
    }
}

// ============================
// LOAD: BREAKING → MIDDLE WINDOW
// ============================
function loadBreaking() {
    fetch("content/breaking-001.json")
        .then(r => r.json())
        .then(data => {
            const a = data.items[0];
            renderArticleCard("breaking-media", "breaking-body", a, true);
        })
        .catch(() => {});
}

// ============================
// LOAD: BLOG → RIGHT WINDOW
// ============================
function loadBlog() {
    fetch("content/blog-001.json")
        .then(r => r.json())
        .then(data => {
            const a = data.items[0];
            renderArticleCard("opinion-media", "opinion-body", a, true);
        })
        .catch(() => {});
}

// ============================
// LOAD: LATEST-001 → LATEST LEFT
// ============================
function loadLatest() {
    fetch("content/latest-001.json")
        .then(r => r.json())
        .then(a => {
            renderArticleCard("leh1-media", "leh1-body", a, true);
        })
        .catch(() => {});
}

// ============================
// LOAD: EDITORIAL → MIDDLE
// ============================
function loadEditorial() {
    fetch("content/editorial-brief-history.json")
        .then(r => r.json())
        .then(a => {
            renderArticleCard("leh2-media", "leh2-body", a, true);
        })
        .catch(() => {});
}

// ============================
// LOAD: HISTORICAL → RIGHT
// ============================
function loadHistorical() {
    fetch("content/historical-brief-history.json")
        .then(r => r.json())
        .then(a => {
            renderArticleCard("leh3-media", "leh3-body", a, true);
        })
        .catch(() => {});
}
