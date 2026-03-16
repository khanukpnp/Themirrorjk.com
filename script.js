/* ============================================================
   THE MIRROR JAMMU KASHMIR — FULL COMBINED SCRIPT
   All features merged: Calendars, Times, Weather, Ticker,
   Homepage Sections, YouTube, Team, Language, Newsletter,
   Engagement Buttons, Archive Loader.
   ============================================================ */

/* ------------------------------------------------------------
   1. UTILITY: SAFE JSON FETCH
------------------------------------------------------------ */
async function fetchJSON(url) {
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return await res.json();
    } catch (err) {
        console.error("JSON Load Error:", url, err);
        return null;
    }
}

/* ------------------------------------------------------------
   2. ENGAGEMENT BUTTON BAR (Like, Subscribe, Share, Copy)
------------------------------------------------------------ */
function createEngagementBar(url, title) {
    const bar = document.createElement("div");
    bar.className = "engagement-bar";

    const like = document.createElement("button");
    like.textContent = "👍 Like";
    like.onclick = () => like.classList.add("active");

    const sub = document.createElement("button");
    sub.textContent = "🔔 Subscribe";
    sub.onclick = () => window.open("https://www.youtube.com/@themirrorjk", "_blank");

    const share = document.createElement("button");
    share.textContent = "📤 Share";
    share.onclick = async () => {
        if (navigator.share) {
            await navigator.share({ title, text: title, url });
        } else alert("Sharing not supported.");
    };

    const copy = document.createElement("button");
    copy.textContent = "📋 Copy Link";
    copy.onclick = async () => {
        await navigator.clipboard.writeText(url);
        copy.textContent = "✅ Copied";
        setTimeout(() => (copy.textContent = "📋 Copy Link"), 1500);
    };

    bar.append(like, sub, share, copy);
    return bar;
}

/* ------------------------------------------------------------
   3. ARTICLE CARD GENERATOR
------------------------------------------------------------ */
function createArticleCard(item) {
    const card = document.createElement("article");
    card.className = "news-card";

    if (item.image) {
        const wrap = document.createElement("div");
        wrap.className = "thumb thumb-cropped";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        wrap.appendChild(img);
        card.appendChild(wrap);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    if (item.category) {
        const cat = document.createElement("div");
        cat.className = "card-category";
        cat.textContent = item.category;
        body.appendChild(cat);
    }

    const h3 = document.createElement("h3");
    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = item.title;
    h3.appendChild(a);
    body.appendChild(h3);

    if (item.subtitle) {
        const sub = document.createElement("p");
        sub.className = "card-subtitle";
        sub.textContent = item.subtitle;
        body.appendChild(sub);
    }

    if (item.date) {
        const meta = document.createElement("div");
        meta.className = "card-meta";
        meta.textContent = item.date;
        body.appendChild(meta);
    }

    body.appendChild(createEngagementBar(item.link, item.title));
    card.appendChild(body);

    return card;
}

/* ------------------------------------------------------------
   4. RENDER LISTS
------------------------------------------------------------ */
function renderList(id, items) {
    const box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";

    if (!items || !items.length) {
        box.innerHTML = "<p>No content available.</p>";
        return;
    }

    items.forEach(item => box.appendChild(createArticleCard(item)));
}

/* ------------------------------------------------------------
   5. ARCHIVE RENDERER
------------------------------------------------------------ */
function renderArchive(id, archive) {
    const box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";

    archive.forEach(yearBlock => {
        const sec = document.createElement("div");
        sec.className = "archive-year-block";

        const h3 = document.createElement("h3");
        h3.textContent = yearBlock.year;
        sec.appendChild(h3);

        const ul = document.createElement("ul");
        yearBlock.items.forEach(item => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = item.link;
            a.textContent = item.title;

            const d = document.createElement("span");
            d.className = "archive-date";
            d.textContent = item.date;

            li.append(a, d);
            ul.appendChild(li);
        });

        sec.appendChild(ul);
        box.appendChild(sec);
    });
}

/* ------------------------------------------------------------
   6. HOMEPAGE LOADER (index.json)
------------------------------------------------------------ */
async function loadHomePage() {
    const data = await fetchJSON("index.json");
    if (!data) return;

    renderList("top-stories-container", data.topStories);
    renderList("latest-container", data.latest);
    renderList("editorial-container", data.editorial);
    renderList("historical-container", data.historical);
    renderList("jk-container", data.jammuKashmir);
    renderList("international-container", data.international);
    renderList("human-rights-container", data.humanRights);
    renderArchive("archive-container", data.archive);

    initTicker(data.ticker);
}

/* ------------------------------------------------------------
   7. TICKER (from index.json)
------------------------------------------------------------ */
function initTicker(items) {
    const box = document.getElementById("ticker-content");
    if (!box || !items || !items.length) return;

    let i = 0;
    function next() {
        box.innerHTML = "";
        const a = document.createElement("a");
        a.href = items[i].link;
        a.textContent = items[i].text;
        box.appendChild(a);
        i = (i + 1) % items.length;
    }

    next();
    setInterval(next, 8000);
}

/* ------------------------------------------------------------
   8. NEWSLETTER
------------------------------------------------------------ */
function initNewsletter() {
    const form = document.getElementById("newsletter-form");
    const msg = document.getElementById("newsletter-message");

    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        msg.textContent = "Thank you for subscribing.";
        msg.className = "newsletter-success";
        form.reset();
    });
}

/* ------------------------------------------------------------
   9. LANGUAGE SELECTOR
------------------------------------------------------------ */
function initLanguageSelector() {
    const sel = document.getElementById("language-dropdown");
    if (!sel) return;

    sel.addEventListener("change", () => {
        console.log("Language changed to:", sel.value);
    });
}

/* ------------------------------------------------------------
   10. WEATHER (Static placeholders)
------------------------------------------------------------ */
function initWeather() {
    const W = {
        zurich: "Zurich: 5°C, Cloudy",
        jammu: "Jammu: 18°C, Clear",
        kashmir: "Kashmir: 4°C, Snow",
        ladakh: "Ladakh: -2°C, Clear",
        gilgit: "Gilgit: 3°C, Partly Cloudy",
        baltistan: "Baltistan: -1°C, Snow",
        muzaffarabad: "Muzaffarabad: 7°C, Cloudy",
        rawalakot: "Rawalakot: 6°C, Mist"
    };

    const set = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    set("weather-zurich", W.zurich);
    set("weather-jammu", W.jammu);
    set("weather-kashmir", W.kashmir);
    set("weather-ladakh", W.ladakh);
    set("weather-gilgit", W.gilgit);
    set("weather-baltistan", W.baltistan);
    set("weather-muzaffarabad", W.muzaffarabad);
    set("weather-rawalakot", W.rawalakot);
}

/* ------------------------------------------------------------
   11. CALENDARS (Gregorian + Hijri + Punjabi Desi)
------------------------------------------------------------ */
function loadGregorian() {
    const now = new Date();
    const opt = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.getElementById("gregorian-date").textContent =
        now.toLocaleDateString("en-US", opt);
}

function loadHijri() {
    const now = new Date();
    const hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric", month: "long", year: "numeric"
    }).format(now);
    document.getElementById("hijri-date").textContent = hijri + " AH";
}

function loadPunjabi() {
    const months = [
        "Chet","Vaisakh","Jeth","Harh","Sawan","Bhadon",
        "Assu","Kattak","Maghar","Poh","Magh","Phagun"
    ];

    const now = new Date();
    const gy = now.getFullYear();
    const by = gy + 57;
    const m = now.getMonth();
    const d = now.getDate();

    const pm = (m + 10) % 12;

    document.getElementById("punjabi-date").textContent =
        `${months[pm]} ${d}, ${by} Bikrami`;
}

function loadTimes() {
    const now = new Date();

    const ist = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    const pkt = now.toLocaleTimeString("en-US", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit" });
    const cet = now.toLocaleTimeString("en-US", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" });

    document.getElementById("region-times").textContent =
        `IST (JKL): ${ist} | PKT (GBM): ${pkt} | CET (Zurich): ${cet}`;
}

function initCalendars() {
    loadGregorian();
    loadHijri();
    loadPunjabi();
    loadTimes();
    setInterval(loadTimes, 60000);
}

/* ------------------------------------------------------------
   12. YOUTUBE (youtube.json)
------------------------------------------------------------ */
async function initYouTube() {
    const box = document.getElementById("vlog-container");
    if (!box) return;

    const data = await fetchJSON("youtube.json");
    if (!data) {
        box.innerHTML = "<p>No videos available.</p>";
        return;
    }

    box.innerHTML = "";
    data.slice(0, 3).forEach(v => {
        const card = document.createElement("article");
        card.className = "video-card";

        const wrap = document.createElement("div");
        wrap.className = "thumb thumb-cropped";

        const img = document.createElement("img");
        img.src = v.thumbnail;
        img.alt = v.title;
        wrap.appendChild(img);

        const body = document.createElement("div");
        body.className = "card-body";

        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = v.url;
        a.target = "_blank";
        a.textContent = v.title;
        h3.appendChild(a);

        const meta = document.createElement("div");
        meta.className = "card-meta";
        meta.textContent = v.publishedAt;

        body.append(h3, meta, createEngagementBar(v.url, v.title));
        card.append(wrap, body);
        box.appendChild(card);
    });
}

/* ------------------------------------------------------------
   13. TEAM (our-team.json)
------------------------------------------------------------ */
async function initTeam() {
    const box = document.getElementById("team-container");
    if (!box) return;

    const data = await fetchJSON("our-team.json");
    if (!data) {
        box.innerHTML = "<p>No team members available.</p>";
        return;
    }

    box.innerHTML = "";
    data.forEach(m => {
        const card = document.createElement("article");
        card.className = "team-card";

        if (m.photo) {
            const wrap = document.createElement("div");
            wrap.className = "team-photo";
            const img = document.createElement("img");
            img.src = m.photo;
            img.alt = m.name;
            wrap.appendChild(img);
            card.appendChild(wrap);
        }

        const body = document.createElement("div");
        body.className = "team-body";

        const h3 = document.createElement("h3");
        h3.textContent = m.name;

        const role = document.createElement("p");
        role.className = "team-role";
        role.textContent = m.role;

        const bio = document.createElement("p");
        bio.className = "team-bio";
        bio.textContent = m.bio;

        body.append(h3, role, bio);

        if (m.link) {
            const link = document.createElement("a");
            link.href = m.link;
            link.target = "_blank";
            link.className = "team-link";
            link.textContent = "Profile / Contact";
            body.appendChild(link);
        }

        card.appendChild(body);
        box.appendChild(card);
    });
}

/* ------------------------------------------------------------
   14. MASTER INITIALIZER
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    initCalendars();
    initWeather();
    initLanguageSelector();
    initNewsletter();
    loadHomePage();
    initYouTube();
    initTeam();
});
