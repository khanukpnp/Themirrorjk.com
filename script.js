/* ===========================
   Utilities
=========================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===========================
   Time & Calendars
=========================== */
function formatCEST() {
  const now = new Date();
  const opts = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Zurich"
  };
  const el = $("#clock-cest span");
  if (el) {
    el.textContent = new Intl.DateTimeFormat("en-GB", opts)
      .format(now)
      .replace(",", " —");
  }
}

function formatHijri() {
  const el = $("#cal-hijri span");
  if (!el) return;
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    el.textContent = fmt.format(new Date()) + " AH";
  } catch {
    el.textContent = "Hijri calendar not supported";
  }
}

function formatVikramSamvatApprox() {
  const el = $("#cal-hindi span");
  if (!el) return;
  const now = new Date();
  const gYear = now.getFullYear();
  const vsYear = now.getMonth() >= 3 ? gYear + 57 : gYear + 56;
  const months = [
    "Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha",
    "Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  el.textContent = `${months[map[now.getMonth()]]} ${now.getDate()}, ${vsYear} VS`;
}

function updateTimes() {
  formatCEST();
  formatHijri();
  formatVikramSamvatApprox();

  const now = new Date();
  const fmt = (tz) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz
    }).format(now);

  const ist = $("#tz-ist span");
  const pkt = $("#tz-pkt span");
  if (ist) ist.textContent = fmt("Asia/Kolkata");
  if (pkt) pkt.textContent = fmt("Asia/Karachi");
}

updateTimes();
setInterval(updateTimes, 1000);

/* ===========================
   Navigation
=========================== */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    if (!li) return;
    const open = li.classList.contains("open");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    if (!open) li.classList.add("open");
  });
});

document.addEventListener("click", e => {
  if (!e.target.closest(".navbar")) {
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
  }
});

const hamburger = $("#hamburger");
const mobileMenu = $("#mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      mobileMenu.innerHTML = "";
      const clone = $("#nav-list")?.cloneNode(true);
      if (!clone) return;

      clone.id = "nav-list-mobile";
      clone.querySelectorAll(".nav-item.has-sub > .nav-btn").forEach(b => {
        const a = document.createElement("a");
        a.textContent = b.textContent;
        a.className = "nav-btn";
        a.href = "#";
        b.replaceWith(a);
      });
      mobileMenu.appendChild(clone);
      mobileMenu.hidden = false;
    } else {
      mobileMenu.hidden = true;
    }
  });
}

/* ===========================
   Weather
=========================== */
const cities = [
  { name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { name: "Rawalakot", lat: 33.8578, lon: 73.7604 },
  { name: "Jammu", lat: 32.7266, lon: 74.8570 },
  { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
  { name: "Ladakh", lat: 34.1526, lon: 77.5771 },
  { name: "Gilgit", lat: 35.9208, lon: 74.3080 },
  { name: "Baltistan", lat: 35.3025, lon: 75.6360 },
  { name: "Muzaffarabad", lat: 34.37, lon: 73.47 }
];

const weatherBar = $("#weather-bar");

const iconForCode = c =>
  c === 0 ? "☀️" :
  [1,2,3].includes(c) ? "⛅" :
  [45,48].includes(c) ? "🌫️" :
  [51,53,55,56,57].includes(c) ? "🌦️" :
  [61,63,65,80,81,82].includes(c) ? "🌧️" :
  [71,73,75,85,86].includes(c) ? "🌨️" :
  [95,96,99].includes(c) ? "⛈️" : "🌡️";

async function loadWeather() {
  if (!weatherBar) return;
  weatherBar.textContent = "";

  for (const c of cities) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code`
      );
      const data = await res.json();
      const t = data?.current?.temperature_2m;
      const code = data?.current?.weather_code;

      const el = document.createElement("div");
      el.className = "city";
      el.innerHTML = `<span class="name">${c.name}:</span>
        <span class="temp">${t ?? "—"}°C ${iconForCode(Number(code))}</span>`;
      weatherBar.appendChild(el);
    } catch {
      const el = document.createElement("div");
      el.className = "city";
      el.textContent = `${c.name}: —`;
      weatherBar.appendChild(el);
    }
  }
}
loadWeather();

/* ===========================
   JSON Loader (SAFE)
=========================== */
async function loadJSON(path) {
  const tryFetch = async p => {
    const res = await fetch(p, { cache: "no-store" });
    return res.ok ? res.json() : null;
  };
  return (
    await tryFetch(path) ||
    (path.startsWith("content/") ? await tryFetch(path.replace("content/", "")) : null)
  );
}

/* ===========================
   Ticker
=========================== */
function renderTicker(items = []) {
  const ul = $("#ticker-items");
  if (!ul) return;
  ul.innerHTML = "";
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = String(t);
    ul.appendChild(li);
  });
}

/* ===========================
   Vlogs
=========================== */
function renderTopVlogs(videos = [], channelUrl = "") {
  const cards = $$("#vlog article.card.video");
  videos.slice(0, 3).forEach((v, i) => {
    const card = cards[i];
    if (!card) return;

    card.querySelector(".badge.cat").textContent = v.category || "Video";
    card.querySelector(".badge.duration").textContent = v.duration || "";
    card.querySelector("h3").textContent = v.title || "";
    card.querySelector("p").textContent = v.description || "";

    const media = card.querySelector(".media");
    media.innerHTML = `<iframe loading="lazy" allowfullscreen
      src="https://www.youtube.com/embed/${encodeURIComponent(v.youtubeId || "")}"></iframe>`;
  });

  $$('a[href*="youtube"]').forEach(a => {
    a.href = channelUrl || a.href;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ===========================
   Apply Content
=========================== */
async function applyContent() {
  const site = await loadJSON("content/site.json");
  const vlogs = await loadJSON("content/vlogs.json");

  if (site?.siteTitle) {
    const title = $(".site-title");
    if (title) title.textContent = site.siteTitle;
  }
  if (site?.siteTagline) {
    const tag = $(".subheading");
    if (tag) tag.textContent = site.siteTagline;
  }

  if (site?.ticker) renderTicker(site.ticker);
  if (vlogs?.videos) renderTopVlogs(vlogs.videos, site?.youtubeChannelUrl);
}

document.addEventListener("DOMContentLoaded", applyContent);

/* ===========================
   Article Page Actions
=========================== */
window.initArticlePage = function () {
  let likes = 0;
  const like = $('[data-like]');
  const count = $('[data-like-count]');
  const copy = $('[data-copy]');
  const share = $('[data-share]');

  if (like && count) {
    like.onclick = () => (count.textContent = ++likes);
  }
  if (copy) {
    copy.onclick = () => navigator.clipboard.writeText(location.href);
  }
  if (share) {
    share.onclick = () =>
      navigator.share
        ? navigator.share({ title: document.title, url: location.href })
        : navigator.clipboard.writeText(location.href);
  }
};
