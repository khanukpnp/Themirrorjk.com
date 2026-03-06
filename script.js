/* ======================================================
GLOBAL HELPERS
====================================================== */

const CONTENT_BASE = "content/";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function clearEl(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function resolveHeroImage(item) {
  if (!item) return null;

  if (item.heroImage && item.heroImage.src) return item.heroImage.src;
  if (item.heroImage) return item.heroImage;
  if (item.image) return item.image;
  if (item.thumbnail) return item.thumbnail;

  return null;
}

/* ======================================================
CLOCKS AND CALENDARS
====================================================== */

function initClocksCalendars() {
  function update() {
    const now = new Date();

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

    const hijri = $("#cal-hijri span");
    if (hijri) {
      hijri.textContent = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);
    }

    const hindu = $("#cal-hindi span");
    if (hindu) {
      hindu.textContent = new Intl.DateTimeFormat("en-IN-u-ca-indian", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);
    }
  }

  update();
  setInterval(update, 1000);
}

/* ======================================================
WEATHER BAR
====================================================== */

async function initWeather() {
  const bar = $("#weather-bar");
  if (!bar) return;

  const cities = [
    { name: "Zurich", lat: 47.37, lon: 8.54 },
    { name: "Rawalakot", lat: 33.85, lon: 73.76 },
    { name: "Jammu", lat: 32.73, lon: 74.86 },
    { name: "Kashmir", lat: 34.08, lon: 74.79 },
    { name: "Ladakh", lat: 34.15, lon: 77.58 },
    { name: "Gilgit", lat: 35.92, lon: 74.30 },
    { name: "Baltistan", lat: 35.30, lon: 75.63 },
    { name: "Muzaffarabad", lat: 34.37, lon: 73.47 }
  ];

  clearEl(bar);

  for (const c of cities) {
    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        c.lat +
        "&longitude=" +
        c.lon +
        "&current_weather=true";

      const data = await fetchJSON(url);

      const t = data?.current_weather?.temperature ?? "--";

      const chip = createEl("div", "chip tiny", c.name + ": " + t + "°C");

      bar.appendChild(chip);
    } catch {
      const chip = createEl("div", "chip tiny", c.name + ": --°C");
      bar.appendChild(chip);
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

  if (!data || !data.ticker) return;

  clearEl(ul);

  data.ticker.forEach(text => {
    const li = createEl("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

/* ======================================================
ARTICLE LOADER
====================================================== */

async function loadArticleById(id) {
  const files = [
    "articles.json",
    "breaking.json",
    "blog.json",
    "editorial.json"
  ];

  for (const file of files) {
    const data = await fetchJSON(CONTENT_BASE + file);

    if (!data || !data.items) continue;

    const item = data.items.find(x => x.id === id);

    if (item) return item;
  }

  return null;
}

/* ======================================================
HOMEPAGE
====================================================== */

async function initHomepage() {
  const data = await fetchJSON(CONTENT_BASE + "index.json");
  if (!data) return;

  const top = data.homepage.topStories;

  const lead = await loadArticleById(top.lead);
  const breaking = await loadArticleById(top.breaking);
  const opinion = await loadArticleById(top.opinion);

  fillCard("lead-media", "lead-body", lead);
  fillCard("breaking-media", "breaking-body", breaking);
  fillCard("opinion-media", "opinion-body", opinion);

  const leh = data.homepage.latestEditorialHistorical;

  const latest = await loadArticleById(leh.latest);
  const editorial = await loadArticleById(leh.editorial);
  const historical = await loadArticleById(leh.historical);

  fillCard("leh1-media", "leh1-body", latest);
  fillCard("leh2-media", "leh2-body", editorial);
  fillCard("leh3-media", "leh3-body", historical);
}

function fillCard(mediaId, bodyId, item) {
  const media = $("#" + mediaId);
  const body = $("#" + bodyId);

  if (!media || !body || !item) return;

  const img = resolveHeroImage(item);

  if (img) {
    media.style.backgroundImage = "url(" + img + ")";
    media.style.backgroundSize = "cover";
    media.style.backgroundPosition = "center";
  }

  clearEl(body);

  const h = createEl("h3", null, item.title);
  const p = createEl("p", null, item.excerpt);

  const a = createEl("a", "read-more", "Read More");
  a.href = "article.html?id=" + item.id;

  body.appendChild(h);
  body.appendChild(p);
  body.appendChild(a);
}

/* ======================================================
VLOGS
====================================================== */

async function initVlogs() {
  const grid = $("#vlogs-grid");
  if (!grid) return;

  const data = await fetchJSON(CONTENT_BASE + "youtube.json");
  if (!data) return;

  clearEl(grid);

  data.videos.slice(0, 3).forEach(v => {
    const card = createEl("div", "card");

    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + v.youtubeId;
    iframe.allowFullscreen = true;

    const body = createEl("div", "card-body");

    const h = createEl("h3", null, v.title);
    const p = createEl("p", null, v.description);

    body.appendChild(h);
    body.appendChild(p);

    card.appendChild(iframe);
    card.appendChild(body);

    grid.appendChild(card);
  });
}

/* ======================================================
CONTACT MODAL
====================================================== */

function initContactModal() {
  const modal = $("#contact-modal");
  const open = $("#contact-open");
  const close = $("#contact-close");

  if (!modal) return;

  if (open) open.onclick = () => modal.classList.remove("hidden");

  if (close) close.onclick = () => modal.classList.add("hidden");

  window.onclick = e => {
    if (e.target === modal) modal.classList.add("hidden");
  };
}

/* ======================================================
FOOTER YEAR
====================================================== */

function initFooterYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ======================================================
LOADER
====================================================== */

function initLoader() {
  const loader = $("#site-loader");

  window.addEventListener("load", () => {
    if (!loader) return;

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  });
}

/* ======================================================
INITIALIZE
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initClocksCalendars();
  initWeather();
  initTicker();
  initHomepage();
  initVlogs();
  initContactModal();
  initFooterYear();
  initLoader();
});
