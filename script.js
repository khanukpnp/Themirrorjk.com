/* ============================================================
   GLOBAL SCRIPT.JS — CORE UTILITIES
   ============================================================ */

/* ---------------- YEAR ---------------- */
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* ---------------- MOBILE NAV ---------------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.getElementById("nav-list");

if (hamburger && mobileMenu && navList) {
    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.style.display === "flex";
        if (isOpen) {
            mobileMenu.style.display = "none";
            hamburger.setAttribute("aria-expanded", "false");
            mobileMenu.innerHTML = "";
        } else {
            mobileMenu.style.display = "flex";
            hamburger.setAttribute("aria-expanded", "true");
            mobileMenu.innerHTML = navList.innerHTML;
        }
    });
}

/* ---------------- CONTACT MODAL ---------------- */
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

if (contactBtn && contactModal && closeContact) {
    contactBtn.addEventListener("click", () => {
        contactModal.classList.remove("hidden");
    });

    closeContact.addEventListener("click", () => {
        contactModal.classList.add("hidden");
    });

    contactModal.addEventListener("click", (e) => {
        if (e.target === contactModal) {
            contactModal.classList.add("hidden");
        }
    });
}

/* ============================================================
   CLOCKS + CALENDARS + WEATHER
   ============================================================ */

const OPENWEATHER_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with real key

/* ---------------- LIVE CLOCKS ---------------- */
function updateClocks() {
    const zones = [
        { selector: "#clock-cest span", tz: "Europe/Zurich" },
        { selector: "#tz-ist span", tz: "Asia/Kolkata" },
        { selector: "#tz-pkt span", tz: "Asia/Karachi" }
    ];

    zones.forEach((z) => {
        const el = document.querySelector(z.selector);
        if (!el) return;

        const d = new Date(
            new Date().toLocaleString("en-US", { timeZone: z.tz })
        );
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");

        el.textContent = `${hh}:${mm}:${ss}`;
    });
}
updateClocks();
setInterval(updateClocks, 1000);

/* ---------------- HIJRI DATE ---------------- */
async function updateHijri() {
    const hijriEl = document.querySelector("#cal-hijri span");
    if (!hijriEl) return;

    try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${today}`);
        const data = await res.json();
        const h = data.data.hijri;
        hijriEl.textContent = `${h.day} ${h.month.en} ${h.year}`;
    } catch (err) {
        console.error("Hijri error:", err);
    }
}
updateHijri();
setInterval(updateHijri, 3600000);

/* ---------------- VIKRAM SAMVAT ---------------- */
function updateVikramSamvat() {
    const hindiEl = document.querySelector("#cal-hindi span");
    if (!hindiEl) return;

    const now = new Date();
    const vsYear = now.getFullYear() + 57;
    hindiEl.textContent = `VS ${vsYear}`;
}
updateVikramSamvat();

/* ---------------- LIVE WEATHER ---------------- */
async function updateWeather() {
    const weatherBar = document.getElementById("weather-bar");
    if (!weatherBar) return;

    weatherBar.innerHTML = "";

    const cities = [
        { name: "Zurich", id: 2657896 },
        { name: "Rawalakot", id: 1166993 },
        { name: "Jammu", id: 1269321 },
        { name: "Kashmir", id: 1255634 },
        { name: "Ladakh", id: 1264976 },
        { name: "Gilgit", id: 1178337 },
        { name: "Baltistan", id: 1180289 },
        { name: "Muzaffarabad", id: 1176615 }
    ];

    for (const c of cities) {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?id=${c.id}&appid=${OPENWEATHER_KEY}&units=metric`
            );
            const data = await res.json();
            if (!data.main || !data.weather) continue;

            const temp = Math.round(data.main.temp);
            const cond = data.weather[0].main;

            const chip = document.createElement("div");
            chip.className = "chip tiny";
            chip.textContent = `${c.name}: ${temp}°C | ${cond}`;
            weatherBar.appendChild(chip);
        } catch (err) {
            console.error("Weather error:", c.name, err);
        }
    }
}
updateWeather();
setInterval(updateWeather, 600000);

/* ============================================================
   UNIVERSAL JSON FETCH
   ============================================================ */
async function fetchJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return res.json();
}
/* ============================================================
   HOMEPAGE LOADER — FIXED & STABLE
   ============================================================ */

async function loadHomepage() {
    if (!document.querySelector("#top-stories")) return;

    try {
        /* ------------------------------------------------------------
           LOAD ALL SECTIONS
           (Latest now loads latest-001.json directly)
        ------------------------------------------------------------ */
        const [
            breakingData,
            articlesData,
            blogData,
            editorialData,
            latestData,
            historicalData,
            jkData,
            intlData,
            hrData
        ] = await Promise.all([
            fetchJSON("content/breaking.json").catch(() => ({ items: [] })),
            fetchJSON("content/articles.json").catch(() => ({ items: [] })),
            fetchJSON("content/blog.json").catch(() => ({ items: [] })),
            fetchJSON("content/editorial.json").catch(() => ({ items: [] })),

            // FIXED: Latest now loads latest-001.json
            fetchJSON("content/latest/latest-001.json").catch(() => ({ items: [] })),

            fetchJSON("content/historical.json").catch(() => ({ items: [] })),
            fetchJSON("content/jammu-kashmir.json").catch(() => ({ items: [] })),
            fetchJSON("content/international.json").catch(() => ({ items: [] })),
            fetchJSON("content/human-rights.json").catch(() => ({ items: [] }))
        ]);

        /* ------------------------------------------------------------
           NORMALIZED ARRAYS
        ------------------------------------------------------------ */
        const breaking = breakingData.items || [];
        const articles = articlesData.items || [];
        const blogs = blogData.items || [];
        const editorial = editorialData.items || [];
        const latest = latestData.items || [];
        const historical = historicalData.items || [];
        const jk = jkData.items || [];
        const intl = intlData.items || [];
        const hr = hrData.items || [];

        /* ------------------------------------------------------------
           CARD HELPERS
        ------------------------------------------------------------ */

        function fillCard(item, mediaSel, bodySel, fallbackTitle, fallbackText, linkType) {
            const media = document.querySelector(mediaSel);
            const body = document.querySelector(bodySel);
            if (!media || !body) return;

            if (!item) {
                body.innerHTML = `
                    <h3>${fallbackTitle}</h3>
                    <p>${fallbackText}</p>
                `;
                return;
            }

            if (item.heroImage && item.heroImage.src) {
                media.innerHTML = `
                    <img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">
                `;
                media.classList.remove("placeholder");
            }

            let href = "#";
            if (linkType === "article") href = `article.html?id=${item.id}`;
            if (linkType === "blog") href = `blog.html?id=${item.id}`;

            body.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.excerpt || ""}</p>
                <a class="read-more" href="${href}">Read More →</a>
            `;
        }

        function fillUnifiedCard(item, mediaSel, bodySel) {
            const media = document.querySelector(mediaSel);
            const body = document.querySelector(bodySel);
            if (!media || !body) return;

            if (!item) {
                body.innerHTML = `
                    <h3>Coming Soon</h3>
                    <p>Content will be added shortly.</p>
                `;
                return;
            }

            if (item.heroImage && item.heroImage.src) {
                media.innerHTML = `
                    <img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">
                `;
                media.classList.remove("placeholder");
            }

            body.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.excerpt || ""}</p>
                <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
            `;
        }

        /* ------------------------------------------------------------
           NEWEST ITEMS (first item in each array)
        ------------------------------------------------------------ */
        const newestArticle = articles[0] || null;
        const newestBreaking = breaking[0] || null;
        const newestBlog = blogs[0] || null;
        const newestLatest = latest[0] || null;
        const newestEditorial = editorial[0] || null;
        const newestHistorical = historical[0] || null;
        const newestJK1 = jk[0] || null;
        const newestJK2 = jk[1] || null;
        const newestIntl1 = intl[0] || null;
        const newestIntl2 = intl[1] || null;
        const newestHR1 = hr[0] || null;
        const newestHR2 = hr[1] || null;

        /* ------------------------------------------------------------
           TOP STORIES
        ------------------------------------------------------------ */
        fillCard(newestArticle, "#lead-media", "#lead-body",
            "Coming Soon", "Lead story will appear here.", "article");

        fillCard(newestBreaking, "#breaking-media", "#breaking-body",
            "Coming Soon", "Breaking news will appear here.", "article");

        fillCard(newestBlog, "#opinion-media", "#opinion-body",
            "Coming Soon", "Opinion and blog will appear here.", "blog");

        /* ------------------------------------------------------------
           LEFT WINDOW — LATEST (only newest)
        ------------------------------------------------------------ */
        fillUnifiedCard(newestLatest, "#leh1-media", "#leh1-body");

        /* ------------------------------------------------------------
           EDITORIAL + HISTORICAL
        ------------------------------------------------------------ */
        fillUnifiedCard(newestEditorial, "#leh2-media", "#leh2-body");
        fillUnifiedCard(newestHistorical, "#leh3-media", "#leh3-body");

        /* ------------------------------------------------------------
           JAMMU KASHMIR
        ------------------------------------------------------------ */
        fillCard(newestJK1, "#jk1-media", "#jk1-body",
            "Coming Soon", "Reporting from Jammu & Kashmir will appear here.", "article");

        fillCard(newestJK2, "#jk2-media", "#jk2-body",
            "Coming Soon", "Additional coverage will be added.", "article");

        /* ------------------------------------------------------------
           INTERNATIONAL
        ------------------------------------------------------------ */
        fillCard(newestIntl1, "#intl1-media", "#intl1-body",
            "Coming Soon", "International coverage will appear here.", "article");

        fillCard(newestIntl2, "#intl2-media", "#intl2-body",
            "Coming Soon", "Additional international reports will be added.", "article");

        /* ------------------------------------------------------------
           HUMAN RIGHTS
        ------------------------------------------------------------ */
        fillCard(newestHR1, "#hr1-media", "#hr1-body",
            "Coming Soon", "Human rights documentation will appear here.", "article");

        fillCard(newestHR2, "#hr2-media", "#hr2-body",
            "Coming Soon", "Further human rights reports will be added.", "article");

    } catch (err) {
        console.error("Homepage load error:", err);
    }
}

loadHomepage();
/* ============================================================
   ARCHIVE PAGE LOADER — FIXED & STABLE
   ============================================================ */

async function loadArchivePage() {
    const archiveContainer = document.getElementById("archive-list");
    if (!archiveContainer) return;

    const section = archiveContainer.getAttribute("data-section");
    if (!section) return;

    /* ------------------------------------------------------------
       FIXED: Correct paths (Latest now loads latest-001.json)
    ------------------------------------------------------------ */
    const map = {
        latest: "content/latest/latest-001.json",
        jk: "content/jammu-kashmir.json",
        intl: "content/international.json",
        hr: "content/human-rights.json",
        editorial: "content/editorial.json",
        historical: "content/historical.json",
        blog: "content/blog.json",
        breaking: "content/breaking.json"
    };

    const path = map[section];
    if (!path) return;

    const ITEMS_PER_PAGE = 9;

    try {
        const data = await fetchJSON(path);
        let items = data.items || [];

        /* ------------------------------------------------------------
           Sort newest → oldest
        ------------------------------------------------------------ */
        items = items.slice().sort((a, b) => {
            const da = a.date ? new Date(a.date).getTime() : 0;
            const db = b.date ? new Date(b.date).getTime() : 0;
            return db - da;
        });

        /* ------------------------------------------------------------
           Pagination logic
        ------------------------------------------------------------ */
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get("page") || "1", 10);

        const totalItems = items.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
        const currentPage = Math.min(Math.max(page, 1), totalPages);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        archiveContainer.innerHTML = "";

        if (pageItems.length === 0) {
            archiveContainer.innerHTML = `<p>No items available in this archive yet.</p>`;
            return;
        }

        /* ------------------------------------------------------------
           FIXED: Archive card template (no nested template literals)
        ------------------------------------------------------------ */
        pageItems.forEach((item) => {
            const card = document.createElement("article");
            card.className = "archive-card";

            const dateObj = item.date ? new Date(item.date) : null;
            const formattedDate = dateObj
                ? dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                  })
                : "";

            const imgSrc = item.heroImage?.src || "";
            const imgAlt = item.heroImage?.caption || item.title || "";

            const href = item.id ? `article.html?id=${item.id}` : "#";

            card.innerHTML = `
                <div class="archive-card-media">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}">` : ""}
                </div>

                <div class="archive-card-body">
                    <h3>${item.title || ""}</h3>

                    <p class="archive-meta">
                        ${formattedDate}
                        ${item.readTime ? ` · ${item.readTime}` : ""}
                        ${item.author ? ` · ${item.author}` : ""}
                    </p>

                    <p>${item.excerpt || ""}</p>

                    <a class="read-more" href="${href}">Read More →</a>
                </div>
            `;

            archiveContainer.appendChild(card);
        });

        /* ------------------------------------------------------------
           FIXED: Numbered pagination (← 1 2 3 →)
        ------------------------------------------------------------ */
        const paginationEl = document.getElementById("archive-pagination");
        if (paginationEl) {
            paginationEl.innerHTML = "";

            if (totalPages > 1) {
                const createPageLink = (p, label, isActive = false, isDisabled = false) => {
                    const a = document.createElement("a");
                    a.textContent = label;

                    if (isActive) a.classList.add("active");
                    if (isDisabled) {
                        a.classList.add("disabled");
                        a.href = "javascript:void(0)";
                    } else {
                        const url = new URL(window.location.href);
                        url.searchParams.set("page", p);
                        a.href = url.toString();
                    }
                    return a;
                };

                // Previous
                paginationEl.appendChild(
                    createPageLink(currentPage - 1, "←", false, currentPage === 1)
                );

                // Numbered pages
                for (let p = 1; p <= totalPages; p++) {
                    paginationEl.appendChild(
                        createPageLink(p, String(p), p === currentPage)
                    );
                }

                // Next
                paginationEl.appendChild(
                    createPageLink(currentPage + 1, "→", false, currentPage === totalPages)
                );
            }
        }
    } catch (err) {
        console.error("Archive load error:", err);
        archiveContainer.innerHTML = `<p>Error loading archive content.</p>`;
    }
}

loadArchivePage();
/* ============================================================
   ARTICLE PAGE LOADER — FIXED & STABLE
   ============================================================ */

async function loadArticlePage() {
    /* ------------------------------------------------------------
       FIXED: Run on ANY page that has #content
       (Blog, Latest, Editorial, JK, HR, International, etc.)
    ------------------------------------------------------------ */
    if (!document.getElementById("content")) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    /* ------------------------------------------------------------
       Identify section from ID prefix
       e.g. blog-001 → "blog"
    ------------------------------------------------------------ */
    const prefix = id.split("-")[0];

    /* ------------------------------------------------------------
       FIXED: Latest now loads latest-001.json
    ------------------------------------------------------------ */
    const map = {
        breaking: "content/breaking.json",
        article: "content/articles.json",
        blog: "content/blog.json",
        editorial: "content/editorial.json",
        historical: "content/historical.json",
        jk: "content/jammu-kashmir.json",
        intl: "content/international.json",
        hr: "content/human-rights.json",
        latest: "content/latest/latest-001.json"
    };

    const path = map[prefix];
    if (!path) return;

    try {
        const data = await fetchJSON(path);
        const items = data.items || [];
        const item = items.find((a) => a.id === id);

        if (!item) {
            const titleEl = document.getElementById("title");
            if (titleEl) titleEl.textContent = "Article not found";
            return;
        }

        /* ------------------------------------------------------------
           PAGE TITLE (Browser tab)
        ------------------------------------------------------------ */
        const pageTitle = document.getElementById("page-title");
        if (pageTitle) {
            pageTitle.textContent = `${item.title} | THE MIRROR JAMMU KASHMIR`;
        }

        /* ------------------------------------------------------------
           SECTION LABEL
        ------------------------------------------------------------ */
        const sectionLabel = document.getElementById("section-label");
        if (sectionLabel) {
            const labelMap = {
                breaking: "Breaking News",
                article: "Latest Articles",
                blog: "Blog & Opinion",
                editorial: "Editorial",
                historical: "Historical Facts",
                jk: "Jammu Kashmir",
                intl: "International",
                hr: "Human Rights",
                latest: "Latest"
            };
            sectionLabel.textContent = labelMap[prefix] || "Article";
        }

        /* ------------------------------------------------------------
           TITLE
        ------------------------------------------------------------ */
        const titleEl = document.getElementById("title");
        if (titleEl) titleEl.textContent = item.title;

        /* ------------------------------------------------------------
           META INFORMATION
        ------------------------------------------------------------ */
        const metaEl = document.getElementById("meta");
        if (metaEl) {
            const dateObj = item.date ? new Date(item.date) : null;
            const formattedDate = dateObj
                ? dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                  })
                : "";

            metaEl.innerHTML = `
                <strong>${item.category || ""}</strong> ·
                ${item.location || ""} ·
                ${formattedDate} ·
                ${item.readTime || ""} ·
                ${item.author || ""}
            `;
        }

        /* ------------------------------------------------------------
           HERO IMAGE
        ------------------------------------------------------------ */
        const heroWrap = document.getElementById("heroWrap");
        const heroImg = document.getElementById("heroImg");
        const heroCaption = document.getElementById("heroCaption");

        if (item.heroImage && item.heroImage.src && heroImg && heroCaption) {
            heroImg.src = item.heroImage.src;
            heroImg.alt = item.heroImage.caption || item.title;

            const credit = item.heroImage.credit
                ? ` — <em>${item.heroImage.credit}</em>`
                : "";

            heroCaption.innerHTML = `${item.heroImage.caption || ""}${credit}`;
        } else if (heroWrap) {
            heroWrap.style.display = "none";
        }

        /* ------------------------------------------------------------
           BODY CONTENT
        ------------------------------------------------------------ */
        const container = document.getElementById("content");
        if (!container) return;

        container.innerHTML = "";

        (item.body || []).forEach((block) => {
            /* ---------------- PARAGRAPH ---------------- */
            if (block.type === "paragraph") {
                const p = document.createElement("p");
                p.textContent = block.text;
                container.appendChild(p);
            }

            /* ---------------- HEADER ---------------- */
            if (block.type === "header") {
                const h2 = document.createElement("h2");
                h2.textContent = block.text;
                container.appendChild(h2);
            }

            /* ---------------- BULLET POINTS ---------------- */
            if (block.type === "points") {
                const wrap = document.createElement("div");
                wrap.className = "important-points";

                const ul = document.createElement("ul");
                (block.items || []).forEach((i) => {
                    const li = document.createElement("li");
                    li.textContent = i;
                    ul.appendChild(li);
                });

                wrap.appendChild(ul);
                container.appendChild(wrap);
            }

            /* ---------------- INLINE IMAGE ---------------- */
            if (block.type === "image") {
                const fig = document.createElement("figure");
                const align = block.align === "right" ? "image-right" : "image-left";
                fig.className = align;

                const img = document.createElement("img");
                img.src = block.src;
                img.alt = block.caption || "";

                const cap = document.createElement("figcaption");
                const credit = block.credit ? ` — ${block.credit}` : "";
                cap.textContent = `${block.caption || ""}${credit}`;

                fig.appendChild(img);
                fig.appendChild(cap);
                container.appendChild(fig);
            }
        });

    } catch (err) {
        console.error("Article load error:", err);
        const titleEl = document.getElementById("title");
        if (titleEl) titleEl.textContent = "Error loading content";
    }
}

loadArticlePage();
/* ============================================================
   SHARE BUTTONS • COPY LINK • SUBSCRIBE — FINAL GLUE
   ============================================================ */

/* ---------------- COPY LINK BUTTONS ---------------- */
function initCopyLinkButtons() {
    const buttons = document.querySelectorAll("[data-copy-link]");

    if (!buttons.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const url = btn.getAttribute("data-copy-link") || window.location.href;

            try {
                await navigator.clipboard.writeText(url);

                // Visual feedback
                btn.classList.add("copied");
                setTimeout(() => btn.classList.remove("copied"), 1500);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        });
    });
}
initCopyLinkButtons();

/* ---------------- SHARE BUTTONS ---------------- */
function initShareButtons() {
    const shareButtons = document.querySelectorAll("[data-share]");

    if (!shareButtons.length) return;

    shareButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const shareUrl = btn.getAttribute("data-share") || window.location.href;
            const shareTitle = document.title;

            // If browser supports native share
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareTitle,
                        url: shareUrl
                    });
                } catch (err) {
                    console.error("Share failed:", err);
                }
            } else {
                // Fallback: copy link
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    btn.classList.add("copied");
                    setTimeout(() => btn.classList.remove("copied"), 1500);
                } catch (err) {
                    console.error("Share fallback failed:", err);
                }
            }
        });
    });
}
initShareButtons();

/* ---------------- SUBSCRIBE BUTTON ---------------- */
function initSubscribe() {
    const subscribeBtn = document.getElementById("subscribeBtn");
    const subscribeInput = document.getElementById("subscribeEmail");

    if (!subscribeBtn || !subscribeInput) return;

    subscribeBtn.addEventListener("click", () => {
        const email = subscribeInput.value.trim();

        if (!email || !email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

        // You can replace this with backend integration later
        alert("Thank you for subscribing!");
        subscribeInput.value = "";
    });
}
initSubscribe();

/* ============================================================
   END OF SCRIPT.JS
   ============================================================ */
