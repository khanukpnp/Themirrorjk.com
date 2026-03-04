/* ============================================================
   GLOBAL SCRIPT.JS — THE MIRROR JAMMU KASHMIR (Final Version)
   Fully compatible with universal article layout + all JSONs
   ============================================================ */

/* ---------------- YEAR ---------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------- MOBILE NAV ---------------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.getElementById("nav-list");

if (hamburger && mobileMenu && navList) {
    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.style.display === "flex";
        mobileMenu.style.display = isOpen ? "none" : "flex";
        hamburger.setAttribute("aria-expanded", String(!isOpen));
        mobileMenu.innerHTML = isOpen ? "" : navList.innerHTML;
    });
}

/* ---------------- CONTACT MODAL ---------------- */
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

if (contactBtn && contactModal && closeContact) {
    contactBtn.addEventListener("click", () => contactModal.classList.remove("hidden"));
    closeContact.addEventListener("click", () => contactModal.classList.add("hidden"));
    contactModal.addEventListener("click", (e) => {
        if (e.target === contactModal) contactModal.classList.add("hidden");
    });
}

/* ============================================================
   CLOCKS + CALENDARS + WEATHER
   ============================================================ */

const OPENWEATHER_KEY = "YOUR_OPENWEATHER_API_KEY";

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

        const d = new Date(new Date().toLocaleString("en-US", { timeZone: z.tz }));
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
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

/* ============================================================
   HOMEPAGE LOADER
   ============================================================ */
async function loadHomepage() {
    if (!document.querySelector("#top-stories")) return;

    try {
        const [
            breakingData,
            articlesData,
            blogData,
            editorialData,
            latestData,
            jkData,
            intlData,
            hrData
        ] = await Promise.all([
            fetchJSON("content/breaking.json").catch(() => ({ items: [] })),
            fetchJSON("content/articles.json").catch(() => ({ items: [] })),
            fetchJSON("content/blog.json").catch(() => ({ items: [] })),
            fetchJSON("content/editorial.json").catch(() => ({ items: [] })),
            fetchJSON("content/latest.json").catch(() => ({ items: [] })),
            fetchJSON("content/jk.json").catch(() => ({ items: [] })),
            fetchJSON("content/international.json").catch(() => ({ items: [] })),
            fetchJSON("content/humanrights.json").catch(() => ({ items: [] }))
        ]);

        const breaking = breakingData.items || [];
        const articles = articlesData.items || [];
        const blogs = blogData.items || [];
        const editorial = editorialData.items || [];
        const latest = latestData.items || [];
        const jk = jkData.items || [];
        const intl = intlData.items || [];
        const hr = hrData.items || [];

        function fillCard(item, mediaSel, bodySel, fallbackTitle, fallbackText, type) {
            const media = document.querySelector(mediaSel);
            const body = document.querySelector(bodySel);
            if (!media || !body) return;

            if (!item) {
                body.innerHTML = `<h3>${fallbackTitle}</h3><p>${fallbackText}</p>`;
                return;
            }

            if (item.heroImage?.src) {
                media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
                media.classList.remove("placeholder");
            }

            const href = `article.html?id=${item.id}`;

            body.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.excerpt || ""}</p>
                <a class="read-more" href="${href}">Read More →</a>
            `;
        }

        fillCard(articles[0], "#lead-media", "#lead-body", "Coming Soon", "Lead story will appear here.");
        fillCard(breaking[0], "#breaking-media", "#breaking-body", "Coming Soon", "Breaking news will appear here.");
        fillCard(blogs[0], "#opinion-media", "#opinion-body", "Coming Soon", "Opinion will appear here.");

        fillCard(latest[0], "#leh1-media", "#leh1-body", "Coming Soon", "Latest content will appear here.");
        fillCard(editorial[0], "#leh2-media", "#leh2-body", "Coming Soon", "Editorial content will appear here.");
        fillCard(articles[1], "#leh3-media", "#leh3-body", "Coming Soon", "Historical content will appear here.");

        fillCard(jk[0], "#jk1-media", "#jk1-body", "Coming Soon", "Jammu & Kashmir content will appear here.");
        fillCard(jk[1], "#jk2-media", "#jk2-body", "Coming Soon", "More JK content will appear here.");

        fillCard(intl[0], "#intl1-media", "#intl1-body", "Coming Soon", "International content will appear here.");
        fillCard(intl[1], "#intl2-media", "#intl2-body", "Coming Soon", "More international content will appear here.");

        fillCard(hr[0], "#hr1-media", "#hr1-body", "Coming Soon", "Human rights content will appear here.");
        fillCard(hr[1], "#hr2-media", "#hr2-body", "Coming Soon", "More human rights content will appear here.");

    } catch (err) {
        console.error("Homepage load error:", err);
    }
}
loadHomepage();

/* ============================================================
   ARTICLE PAGE LOADER
   ============================================================ */
async function loadArticlePage() {
    if (!document.body.classList.contains("article-page")) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const prefix = id.split("-")[0];

    const map = {
        article: "content/articles.json",
        breaking: "content/breaking.json",
        blog: "content/blog.json",
        editorial: "content/editorial.json",
        latest: "content/latest-001.json",
        jk: "content/jk.json",
        intl: "content/international.json",
        hr: "content/humanrights.json"
    };

    const path = map[prefix];
    if (!path) return;

    try {
        const data = await fetchJSON(path);
        const items = data.items || [];
        const item = items.find((a) => a.id === id);

        if (!item) {
            document.getElementById("title").textContent = "Article not found";
            return;
        }

        document.getElementById("page-title").textContent = `${item.title} | THE MIRROR JAMMU KASHMIR`;

        const sectionLabel = document.getElementById("section-label");
        const labelMap = {
            article: "Latest Articles",
            breaking: "Breaking News",
            blog: "Blog & Opinion",
            editorial: "Editorial",
            latest: "Latest Updates",
            jk: "Jammu & Kashmir",
            intl: "International",
            hr: "Human Rights"
        };
        sectionLabel.textContent = labelMap[prefix] || "Article";

        document.getElementById("title").textContent = item.title;

        const metaEl = document.getElementById("meta");
        const dateObj = item.date ? new Date(item.date) : null;
        const formattedDate = dateObj
            ? dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "";

        metaEl.innerHTML = `
            <strong>${item.category || ""}</strong> ·
            ${item.location || ""} ·
            ${formattedDate} ·
            ${item.readTime || ""} ·
            ${item.author || ""}
        `;

        const heroImg = document.getElementById("heroImg");
        const heroCaption = document.getElementById("heroCaption");
        const heroWrap = document.getElementById("heroWrap");

        if (item.heroImage?.src) {
            heroImg.src = item.heroImage.src;
            heroImg.alt = item.heroImage.caption || item.title;
            heroCaption.innerHTML = `${item.heroImage.caption || ""}${item.heroImage.credit ? " — " + item.heroImage.credit : ""}`;
        } else {
            heroWrap.style.display = "none";
        }

        const container = document.getElementById("content");
        container.innerHTML = "";

        (item.body || []).forEach((block) => {
            if (block.type === "paragraph") {
                const p = document.createElement("p");
                p.textContent = block.text;
                container.appendChild(p);
            }

            if (block.type === "header") {
                const h2 = document.createElement("h2");
                h2.textContent = block.text;
                container.appendChild(h2);
            }

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

            if (block.type === "image") {
                const fig = document.createElement("figure");
                const align = block.align === "right" ? "image-right" :
                              block.align === "left" ? "image-left" : "";
                fig.className = align;

                const img = document.createElement("img");
                img.src = block.src;
                img.alt = block.caption || "";

                const cap = document.createElement("figcaption");
                cap.textContent = `${block.caption || ""}${block.credit ? " — " + block.credit : ""}`;

                fig.appendChild(img);
                fig.appendChild(cap);
                container.appendChild(fig);
            }
        });

    } catch (err) {
        console.error("Article load error:", err);
        document.getElementById("title").textContent = "Error loading content";
    }
}
loadArticlePage();

/* ============================================================
   ABOUT PAGE LOADER
   ============================================================ */
async function loadAboutPage() {
    const titleEl = document.getElementById("about-title");
    const subtitleEl = document.getElementById("about-subtitle");
    const heroEl = document.getElementById("about-hero");
    const contentEl = document.getElementById("about-content");

    if (!titleEl || !subtitleEl || !heroEl || !contentEl) return;

    try {
        const data = await fetchJSON("content/about.json");

        titleEl.textContent = data.title || "";
        subtitleEl.textContent = data.subtitle || "";

        if (data.heroImage?.src) {
            heroEl.innerHTML = `
                <img src="${data.heroImage.src}" alt="${data.heroImage.caption || ""}">
                <figcaption>${data.heroImage.caption || ""}</figcaption>
            `;
        }

        contentEl.innerHTML = "";
        (data.body || []).forEach((block) => {
            if (block.type === "paragraph") {
                contentEl.innerHTML += `<p>${block.text}</p>`;
            }
            if (block.type === "header") {
                contentEl.innerHTML += `<h2 style="margin-top:40px;">${block.text}</h2>`;
            }
            if (block.type === "points") {
                const items = (block.items || []).map((i) => `<li>${i}</li>`).join("");
                contentEl.innerHTML += `
                    <div class="important-points">
                        <ul>${items}</ul>
                    </div>
                `;
            }
        });

    } catch (err) {
        console.error("About load error:", err);
        titleEl.textContent = "Error loading content";
    }
}
loadAboutPage();

/* ============================================================
   CHIEF EDITOR PAGE LOADER
   ============================================================ */
async function loadChiefEditorPage() {
    const titleEl = document.getElementById("ce-title");
    const subtitleEl = document.getElementById("ce-subtitle");
    const heroEl = document.getElementById("ce-hero");
    const contentEl = document.getElementById("ce-content");

    if (!titleEl || !subtitleEl || !heroEl || !contentEl) return;

    try {
        const data = await fetchJSON("content/chief-editor.json");

        titleEl.textContent = data.title || "";
        subtitleEl.textContent = data.subtitle || "";

        if (data.heroImage?.src) {
            heroEl.innerHTML = `
                <img src="${data.heroImage.src}" alt="${data.heroImage.caption || ""}">
                <figcaption>${data.heroImage.caption || ""}</figcaption>
            `;
        }

        contentEl.innerHTML = "";
        (data.body || []).forEach((block) => {
            if (block.type === "paragraph") {
                contentEl.innerHTML += `<p>${block.text}</p>`;
            }
            if (block.type === "header") {
                contentEl.innerHTML += `<h2 style="margin-top:40px;">${block.text}</h2>`;
            }
            if (block.type === "points") {
                const items = (block.items || []).map((i) => `<li>${i}</li>`).join("");
                contentEl.innerHTML += `
                    <div class="important-points">
                        <ul>${items}</ul>
                    </div>
                `;
            }
        });

    } catch (err) {
        console.error("Chief Editor load error:", err);
        titleEl.textContent = "Error loading content";
    }
}
loadChiefEditorPage();
