/* ======================================================
   GLOBAL HELPERS
====================================================== */

const CONTENT_BASE = "content/";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

function createEl(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function clearEl(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

function resolveHeroImage(item) {
  if (!item) return null;
  if (item.heroImage?.src) return item.heroImage.src;
  if (item.heroImage) return item.heroImage;
  if (item.image) return item.image;
  return null;
}

/* ======================================================
   LOADER CONTROL
====================================================== */

function hideLoader() {
  const loader = $("#site-loader");
  if (!loader) return;
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 400);
}

/* ======================================================
   CALENDAR HELPERS (HIJRI & VIKRAM SAMVAT)
====================================================== */

/**
 * Convert Gregorian date to Hijri (approximate, tabular method).
 * Returns { hYear, hMonth, hDay }.
 */
function gregorianToHijri(date) {
  // Based on an approximate algorithm for the Islamic calendar
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  let jd =
    Math.floor(
      (1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4
    ) +
    Math.floor(
      (367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12
    ) -
    Math.floor(
      (3 *
        Math.floor(
          (year + 4900 + Math.floor((month - 14) / 12)) / 100
        )) /
        4
    ) +
    day -
    32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor(
    (10985 - l2) / 5316
  ) *
    Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) *
      Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor(
      (30 - j) / 15
    ) *
      Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) *
      Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return { hYear, hMonth, hDay };
}

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabiʿ al-awwal",
  "Rabiʿ al-thani",
  "Jumada al-awwal",
  "Jumada al-thani",
  "Rajab",
  "Shaʿban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qaʿdah",
  "Dhu al-Hijjah"
];

/**
 * Very simple Vikram Samvat year approximation.
 * VS year ≈ Gregorian year + 57 (from around April),
 * otherwise +56. We keep it as a year-only display.
 */
function gregorianToVikramSamvat(date) {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth(); // 0-based
  const vsYear = gMonth >= 3 ? gYear + 57 : gYear + 56;
  return vsYear;
}

/* ======================================================
   CLOCKS + CALENDARS
====================================================== */

function initClocksCalendars() {
  if (!$("#clock-cest")) return;

  function update() {
    const now = new Date();

    // CEST + English date
    const cest = $("#clock-cest span");
    if (cest) {
      cest.textContent = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Zurich"
      }).format(now);
    }

    // IST
    const ist = $("#tz-ist span");
    if (ist) {
      ist.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata"
      }).format(now);
    }

    // PKT
    const pkt = $("#tz-pkt span");
    if (pkt) {
      pkt.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Karachi"
      }).format(now);
    }

    // Hijri calendar
    const hijriChip = $("#cal-hijri span");
    if (hijriChip) {
      const { hYear, hMonth, hDay } = gregorianToHijri(now);
      const monthName =
        HIJRI_MONTH_NAMES[(hMonth - 1 + 12) % 12] || "";
      hijriChip.textContent = `${hDay} ${monthName} ${hYear} AH`;
    }

    // Vikram Samvat calendar (year only, compact)
    const vsChip = $("#cal-hindi span");
    if (vsChip) {
      const vsYear = gregorianToVikramSamvat(now);
      vsChip.textContent = `Vikram Samvat ${vsYear}`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ======================================================
   WEATHER
====================================================== */

async function initWeather() {
  const bar = $("#weather-bar");
  if (!bar) return;

  const cities = [
    { n: "Zurich", lat: 47.37, lon: 8.54 },
    { n: "Rawalakot", lat: 33.85, lon: 73.76 },
    { n: "Jammu", lat: 32.73, lon: 74.86 },
    { n: "Kashmir", lat: 34.08, lon: 74.79 },
    { n: "Ladakh", lat: 34.15, lon: 77.58 },
    { n: "Gilgit", lat: 35.92, lon: 74.30 },
    { n: "Baltistan", lat: 35.30, lon: 75.63 },
    { n: "Muzaffarabad", lat: 34.37, lon: 73.47 }
  ];

  clearEl(bar);

  for (const c of cities) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;
      const data = await fetchJSON(url);
      const t = data?.current_weather?.temperature ?? "--";
      const chip = createEl("div", "chip tiny", `${c.n}: ${t}°C`);
      bar.appendChild(chip);
    } catch {
      bar.appendChild(createEl("div", "chip tiny", `${c.n}: --°C`));
    }
  }
}

/* ======================================================
   TICKER
====================================================== */

async function initTicker() {
  const ul = $("#ticker-items");
  if (!ul) return;

  const data = await fetchJSON(CONTENT_BASE + "index.json");
  if (!data?.ticker) return;

  clearEl(ul);
  data.ticker.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

/* ======================================================
   ARTICLE SEARCH (BY ID ACROSS JSON FILES)
====================================================== */

async function loadArticleById(id) {
  const files = [
    "articles.json",
    "breaking.json",
    "blog.json",
    "editorial.json",
    "latest-001.json",
    "latest.json",
    "jk.json",
    "international.json",
    "opinion.json"
  ];

  for (const f of files) {
    const data = await fetchJSON(CONTENT_BASE + f);
    if (!data?.items) continue;
    const found = data.items.find(x => x.id === id);
    if (found) return found;
  }

  return null;
}

/* ======================================================
   HOMEPAGE CARDS
====================================================== */

function fillCard(mediaId, bodyId, item) {
  const media = $("#" + mediaId);
  const body = $("#" + bodyId);
  if (!media || !body || !item) return;

  media.textContent = "";
  const img = resolveHeroImage(item);
  if (img) {
    media.style.backgroundImage = `url(${img})`;
    media.style.backgroundSize = "cover";
    media.style.backgroundPosition = "center";
  }

  clearEl(body);
  const h = createEl("h3", null, item.title);
  const p = createEl("p", null, item.excerpt || "");
  const a = createEl("a", "read-more", "Read More");

  // Generic article template – works for editorial, blog, breaking, etc.
  a.href = `editorial.html?id=${item.id}`;

  body.append(h, p, a);
}

/**
 * Generic loader for a section that uses a JSON file with "items" array.
 * It maps items to card media/body IDs in order.
 */
async function fillSectionFromFile(jsonFile, mapping) {
  const data = await fetchJSON(CONTENT_BASE + jsonFile);
  if (!data?.items || !Array.isArray(data.items)) return;

  mapping.forEach((pair, index) => {
    const [mediaId, bodyId] = pair;
    const item = data.items[index];
    if (item) {
      fillCard(mediaId, bodyId, item);
    }
  });
}

/* ======================================================
   HOMEPAGE INITIALIZATION
====================================================== */

async function initHomepage() {
  if (!$("#lead-media")) return;

  const data = await fetchJSON(CONTENT_BASE + "index.json");
  if (!data?.homepage?.topStories) return;

  const top = data.homepage.topStories;

  const lead = await loadArticleById(top.lead);
  const breaking = await loadArticleById(top.breaking);
  const opinion = await loadArticleById(top.opinion);

  fillCard("lead-media", "lead-body", lead);
  fillCard("breaking-media", "breaking-body", breaking);
  fillCard("opinion-media", "opinion-body", opinion);

  // LATEST / EDITORIAL / HISTORICAL – from latest.json or similar
  // Assumes latest.json has items[0..2] for these three cards.
  try {
    await fillSectionFromFile("latest.json", [
      ["leh1-media", "leh1-body"],
      ["leh2-media", "leh2-body"],
      ["leh3-media", "leh3-body"]
    ]);
  } catch (e) {
    // fail silently to keep page stable
  }

  // JAMMU KASHMIR – from jk.json
  try {
    await fillSectionFromFile("jk.json", [
      ["jk1-media", "jk1-body"],
      ["jk2-media", "jk2-body"]
    ]);
  } catch (e) {}

  // INTERNATIONAL – from international.json
  try {
    await fillSectionFromFile("international.json", [
      ["intl1-media", "intl1-body"],
      ["intl2-media", "intl2-body"]
    ]);
  } catch (e) {}

  // HUMAN RIGHTS – if you create human-rights.json later, this will auto-wire
  try {
    await fillSectionFromFile("human-rights.json", [
      ["hr1-media", "hr1-body"],
      ["hr2-media", "hr2-body"]
    ]);
  } catch (e) {}
}

/* ======================================================
   ARTICLE PAGE
====================================================== */

async function loadArticlePage() {
  const contentEl = $("#content");
  if (!contentEl) return;

  const params = new URLSearchParams(location.search);
  let id = params.get("id");

  // Fallback: allow pages to specify article via data-attribute on <body>
  if (!id && document.body && document.body.dataset && document.body.dataset.articleId) {
    id = document.body.dataset.articleId;
  }

  // If still no ID, show a clear message instead of staying on "Loading..."
  if (!id) {
    clearEl(contentEl);
    contentEl.appendChild(
      createEl("p", "notice", "Article not found. Please check the link or return to the homepage.")
    );
    return;
  }

  const article = await loadArticleById(id);

  // If ID is present but article not found, show a graceful message
  if (!article) {
    clearEl(contentEl);
    contentEl.appendChild(
      createEl("p", "notice", "Article not available. It may have been moved or unpublished.")
    );
    return;
  }

  renderArticle(article);
}

function renderArticle(article) {
  const titleEl = $("#title");
  const metaEl = $("#meta");

  if (titleEl) {
    titleEl.textContent = article.title;
  }

  if (metaEl) {
    metaEl.textContent = `${article.author} • ${article.location} • ${article.date} • ${article.readTime}`;
  }

  if (article.heroImage) {
    const heroImg = $("#heroImg");
    const heroCaption = $("#heroCaption");
    if (heroImg) heroImg.src = article.heroImage.src || article.heroImage;
    if (heroCaption) {
      const captionText = article.heroImage.caption || "";
      const creditText = article.heroImage.credit || "";
      heroCaption.textContent = `${captionText}${captionText && creditText ? " — " : ""}${creditText}`;
    }
  }

  const container = $("#content");
  if (!container) return;

  clearEl(container);

  (article.body || []).forEach(b => {
    if (b.type === "header") {
      container.appendChild(createEl("h2", null, b.text));
    }

    if (b.type === "paragraph") {
      container.appendChild(createEl("p", null, b.text));
    }

    if (b.type === "points") {
      const box = createEl("div", "pull-points");
      const ul = document.createElement("ul");
      (b.items || []).forEach(i => {
        const li = document.createElement("li");
        li.textContent = i;
        ul.appendChild(li);
      });
      box.appendChild(ul);
      container.appendChild(box);
    }

    if (b.type === "image") {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = b.src;
      const cap = document.createElement("figcaption");
      const captionText = b.caption || "";
      const creditText = b.credit || "";
      cap.textContent = `${captionText}${captionText && creditText ? " — " : ""}${creditText}`;
      fig.append(img, cap);
      if (b.align === "left") fig.className = "img-left";
      if (b.align === "right") fig.className = "img-right";
      container.appendChild(fig);
    }
  });
}

/* ======================================================
   ARTICLE ACTIONS
====================================================== */

function initArticleActions() {
  const like = $("#likeBtn");
  if (!like) return;

  const likeCount = $("#likeCount");
  let n = 0;

  like.onclick = () => {
    n++;
    if (likeCount) likeCount.textContent = n;
  };

  const sub = $("#subBtn");
  if (sub) {
    sub.onclick = () => {
      sub.textContent = "Subscribed";
      sub.disabled = true;
    };
  }

  const share = $("#shareBtn");
  if (share) {
    share.onclick = () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: location.href });
      }
    };
  }

  const copy = $("#copyBtn");
  if (copy) {
    copy.onclick = () => navigator.clipboard.writeText(location.href);
  }
}

/* ======================================================
   VLOGS
====================================================== */

async function initVlogs() {
  const grid = $("#vlogs-grid");
  if (!grid) return;

  const data = await fetchJSON(CONTENT_BASE + "youtube.json");
  if (!data?.videos) return;

  clearEl(grid);

  data.videos.slice(0, 3).forEach(v => {
    const card = createEl("div", "card");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${v.youtubeId}`;
    iframe.allowFullscreen = true;

    const body = createEl("div", "card-body");
    body.append(
      createEl("h3", null, v.title),
      createEl("p", null, v.description)
    );

    card.append(iframe, body);
    grid.appendChild(card);
  });
}

/* ======================================================
   NAVIGATION MOBILE
====================================================== */

function initMobileMenu() {
  const btn = $("#hamburger");
  const mobile = $("#mobile-menu");
  const list = $("#nav-list");
  if (!btn || !mobile || !list) return;

  mobile.innerHTML = list.innerHTML;

  btn.onclick = () => {
    const open = mobile.hidden;
    mobile.hidden = !open;
    btn.setAttribute("aria-expanded", open);
  };
}

/* ======================================================
   CONTACT MODAL
====================================================== */

function initContactModal() {
  const open = $("#contact-open");
  const modal = $("#contact-modal");
  const close = $("#contact-close");
  if (!open || !modal) return;

  open.onclick = () => modal.classList.remove("hidden");
  if (close) {
    close.onclick = () => modal.classList.add("hidden");
  }

  window.onclick = e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  };
}

/* ======================================================
   SEARCH
====================================================== */

function initSearch() {
  const input = $("#search-input");
  if (!input) return;

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      alert("Search feature will connect to CMS later.");
    }
  });
}

/* ======================================================
   YEAR
====================================================== */

function initYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ======================================================
   SAFE INITIALIZATION
====================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  try { initYear(); } catch (e) {}
  try { initClocksCalendars(); } catch (e) {}
  try { await initWeather(); } catch (e) {}
  try { await initTicker(); } catch (e) {}
  try { await initHomepage(); } catch (e) {}
  try { await initVlogs(); } catch (e) {}
  try { await loadArticlePage(); } catch (e) {}
  try { initArticleActions(); } catch (e) {}
  try { initMobileMenu(); } catch (e) {}
  try { initContactModal(); } catch (e) {}
  try { initSearch(); } catch (e) {}
  hideLoader();
});
