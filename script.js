/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT (VS10 FINAL)
   Fully synchronized with JSON repo + images repo
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded - initializing...");

    initLoader();
    initYear();
    initClocks();
    initWeatherBar();
    initTicker();
    initNav();
    initContactModal();
    initVlogs();
    initLanguageSelector();
    initSearch();
    initSocialButtons();
    initFileUpload();
    initNewsletter();
    initFooterDropdowns();
    initReadingProgress();

    loadHomepageContent();

    // Archive page support
    if (window.location.pathname.includes("archive.html")) {
        initArchivePage();
    }

    // About page
    if (window.location.pathname.includes("about.html")) {
        loadAboutPage();
    }

    // Chief Editor page
    if (window.location.pathname.includes("chief-editor.html")) {
        loadChiefEditorPage();
    }
});

/* ============================
   LOADER
============================ */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;

    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 300);
    }, 1500);
}

/* ============================
   FOOTER YEAR
============================ */
function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================
   CLOCKS + CALENDARS
============================ */
function initClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;

    const zurichTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const fullDate = now.toLocaleDateString("en-GB", options);

    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    datetimeBar.innerHTML = `
        <span>${fullDate} at ${zurichTime}</span>
        <span class="separator">•</span>
        <span>${getHijriDate()}</span>
        <span class="separator">•</span>
        <span>${getBikramiDate()}</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istTime}</strong></span>
        <span class="separator">•</span>
        <span>PKT (GB & AJK): <strong>${pktTime}</strong></span>
    `;
}

function getHijriDate() {
    try {
        const now = new Date();
        return new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now) + " AH";
    } catch {
        return "Ramadan 27, 1447 AH";
    }
}

function getBikramiDate() {
    const today = new Date();
    const months = [
        "Chet", "Vaisakh", "Iyeshtha", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear() + 57} VS`;
}

/* ============================
   WEATHER BAR
============================ */
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

    bar.innerHTML = cities
        .map((c, i) =>
            `${c.name}: <strong>${c.temp}</strong>${i < cities.length - 1 ? '<span class="separator">•</span>' : ''}`
        )
        .join("");
}

/* ============================
   TICKER (from ticker.json)
============================ */
function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;

    fetch("content/ticker.json")
        .then(r => r.ok ? r.json() : [])
        .then(data => {
            const items = data.items || [];
            tickerItems.innerHTML = items.concat(items).map(t => `<span>${t} • </span>`).join("");
        })
        .catch(() => {
            tickerItems.innerHTML = "<span>THE MIRROR JAMMU KASHMIR — Independent Digital Media Platform • </span>";
        });
}

/* ============================
   NAVIGATION
============================ */
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!hamburger || !navList || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", !expanded);
        mobileMenu.hidden = expanded;
        if (!expanded) mobileMenu.innerHTML = navList.innerHTML;
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".has-sub")) {
            document.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
        }
    });
}

/* ============================
   CONTACT MODAL
============================ */
function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    const cancelBtn = document.getElementById("modal-cancel");
    const form = document.getElementById("contact-form");

    if (!modal) return;

    openBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
    cancelBtn?.addEventListener("click", () => modal.classList.add("hidden"));

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    form?.addEventListener("submit", e => {
        e.preventDefault();
        alert("Thank you for your message. We will get back to you soon!");
        modal.classList.add("hidden");
        form.reset();
    });
}

/* ============================
   VLOGS (YouTube JSON)
============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");

    if (!grid) return;

    fetch("content/youtube.json")
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (!data) throw new Error();

            if (visitBtn && data.channel?.url) {
                visitBtn.addEventListener("click", () => window.open(data.channel.url, "_blank"));
                visitBtn.style.display = "inline-block";
            }

            renderVlogs(data.videos || []);
        })
        .catch(() => {
            grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
            if (visitBtn) visitBtn.style.display = "none";
        });
}

function renderVlogs(videos) {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;

    if (!videos.length) {
        grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
        return;
    }

    grid.innerHTML = videos.map(v => {
        const thumb = v.youtubeId
            ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
            : "https://via.placeholder.com/640x360?text=Video";

        return `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title || 'Video'}">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration || "00:00"}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title || "Video"}</h3>
                    <p>${v.description || ""}</p>
                </div>
            </article>
        `;
    }).join("");
}

/* ============================
   LANGUAGE SELECTOR
============================ */
function initLanguageSelector() {
    const select = document.getElementById("language-select");
    if (!select) return;

    select.addEventListener("change", e => {
        alert("Language changed to " + e.target.options[e.target.selectedIndex].text);
    });
}

/* ============================
   SEARCH
============================ */
function initSearch() {
    const form = document.querySelector(".search");
    const input = document.getElementById("search-input");

    if (!form || !input) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        if (input.value.trim()) alert("Searching for: " + input.value.trim());
    });
}

/* ============================
   SOCIAL BUTTONS
============================ */
function initSocialButtons() {
    document.querySelectorAll(".sa-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.textContent.trim();
            if (text.includes("Like")) alert("Thank you for liking!");
            else if (text.includes("Subscribe")) alert("Thank you for subscribing!");
            else if (text.includes("Share")) {
                if (navigator.share) {
                    navigator.share({ title: document.title, url: window.location.href });
                } else alert("Share this page!");
            }
        });
    });
}

/* ============================
   COPY LINK
============================ */
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
}

/* ============================
   FILE UPLOAD
============================ */
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const fileNameSpan = document.querySelector(".file-name");

    if (!fileInput || !fileNameSpan) return;

    fileInput.addEventListener("change", () => {
        fileNameSpan.textContent = fileInput.files.length
            ? fileInput.files[0].name
            : "No file chosen";
    });

    const form = document.querySelector(".epaper-form");
    form?.addEventListener("submit", e => {
        e.preventDefault();
        if (fileInput.files.length) {
            alert(`File '${fileInput.files[0].name}' ready for upload.`);
        } else alert("Please select a file first.");
    });
}

/* ============================
   NEWSLETTER
============================ */
function initNewsletter() {
    const btn = document.getElementById("subscribeBtn");
    const email = document.getElementById("subscribeEmail");

    if (!btn || !email) return;

    btn.addEventListener("click", e => {
        e.preventDefault();
        const val = email.value.trim();
        if (val && val.includes("@") && val.includes(".")) {
            alert("Thank you for subscribing!");
            email.value = "";
        } else alert("Please enter a valid email address.");
    });
}

/* ============================
   FOOTER DROPDOWNS
============================ */
function initFooterDropdowns() {
    document.querySelectorAll(".footer-section").forEach((section, i) => {
        if (i === 0) return;
        const h = section.querySelector("h4");
        h?.addEventListener("click", () => section.classList.toggle("open"));
    });
}

/* ============================
   READING PROGRESS BAR
============================ */
function initReadingProgress() {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / height) * 100 + "%";
    });
}

/* ============================================================
   HOMEPAGE CONTENT LOADER
============================================================ */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(r => r.ok ? r.json() : null)
        .then(index => {
            if (!index) throw new Error();

            /* TOP STORIES */
            if (index.topStories) {
                const ts = index.topStories;
                loadTopStories({
                    article: ts.article || ts.lead || null,
                    breaking: ts.breaking || null,
                    blog: ts.blog || ts.opinion || null
                });
            }

            /* LATEST / EDITORIAL / HISTORICAL */
            if (index.latestEditorialHistorical) {
                const leh = index.latestEditorialHistorical;
                loadLehSection([leh.latest, leh.editorial, leh.historical]);
            }

            /* JAMMU KASHMIR */
            if (index.jammuKashmir) {
                loadJammuKashmir(index.jammuKashmir);
            }

            /* INTERNATIONAL */
            if (index.international) {
                loadInternational(index.international);
            }

            /* HUMAN RIGHTS */
            if (index.humanRights) {
                loadHumanRights(index.humanRights);
            }
        })
        .catch(() => {
            loadTopStoriesFallback();
            loadLehFallback();
            loadJammuKashmirFallback();
            loadInternationalFallback();
            loadHumanRightsFallback();
        });
}

/* ============================================================
   TOP STORIES (Article + Breaking + Blog)
============================================================ */
function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;

    const ordered = [ids.article, ids.breaking, ids.blog];

    Promise.all(
        ordered.map(id =>
            id
                ? fetch(`content/${id}.json`)
                      .then(r => (r.ok ? r.json() : null))
                      .catch(() => null)
                : Promise.resolve(null)
        )
    ).then(articles => {
        let html = "";
        let hasContent = false;

        articles.forEach(article => {
            if (article) {
                html += createHomepageCard(article, true);
                hasContent = true;
            }
        });

        grid.innerHTML = hasContent ? html : loadTopStoriesFallback();
    });
}

function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;

    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <img src="https://via.placeholder.com/640x360?text=Rawalakot+Protest">
            </div>
            <div class="card-body">
                <h3>Complete Shutter Down Paralyses Rawalakot Poonch</h3>
                <p>Thousands shut down Rawalakot in protest against electricity outages and communication blackouts.</p>
                <a href="article.html?id=article-001" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================================================
   LATEST / EDITORIAL / HISTORICAL
============================================================ */
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;

    Promise.all(
        ids.map(id =>
            id
                ? fetch(`content/${id}.json`)
                      .then(r => (r.ok ? r.json() : null))
                      .catch(() => null)
                : Promise.resolve(null)
        )
    ).then(articles => {
        grid.innerHTML = articles
            .map((a, i) =>
                a ? createHomepageCard(a) : createEmptyCard(["LATEST", "EDITORIAL", "HISTORICAL"][i])
            )
            .join("");
    });
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;

    grid.innerHTML = `
        <article class="card"><div class="media"></div><div class="card-body"><h3>LATEST</h3><p>Coming soon.</p></div></article>
        <article class="card"><div class="media"></div><div class="card-body"><h3>EDITORIAL</h3><p>Coming soon.</p></div></article>
        <article class="card"><div class="media"></div><div class="card-body"><h3>HISTORICAL</h3><p>Coming soon.</p></div></article>
    `;
}

/* ============================================================
   JAMMU KASHMIR
============================================================ */
function loadJammuKashmir(ids) {
    const grid = document.getElementById("jk-grid");
    if
