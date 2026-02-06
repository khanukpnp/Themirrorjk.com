/* =========================
   Helpers
========================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
$("#year").textContent = new Date().getFullYear();

/* =========================
   Time & Calendars
========================= */
function updateTimes() {
  const now = new Date();

  $("#clock-cest span").textContent =
    new Intl.DateTimeFormat("en-GB", {
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

  try {
    $("#cal-hijri span").textContent =
      new Intl.DateTimeFormat("en-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now) + " AH";
  } catch {
    $("#cal-hijri span").textContent = "Hijri unavailable";
  }

  $("#cal-hindi span").textContent =
    `${now.getDate()}, ${now.getFullYear() + 57} VS`;

  $("#tz-ist span").textContent =
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    }).format(now);

  $("#tz-pkt span").textContent =
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi"
    }).format(now);
}
updateTimes();
setInterval(updateTimes, 1000);

/* =========================
   Navigation
========================= */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.onclick = e => {
    const li = e.currentTarget.closest(".nav-item");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    li.classList.toggle("open");
  };
});
document.addEventListener("click", e => {
  if (!e.target.closest(".navbar"))
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
});

/* =========================
   Weather
========================= */
const cities = [
  { name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { name: "Rawalakot", lat: 33.8578, lon: 73.7604 },
  { name: "Jammu", lat: 32.7266, lon: 74.857 },
  { name: "Kashmir", lat: 34.0837, lon: 74.7973 }
];
async function loadWeather() {
  const bar = $("#weather-bar");
  bar.innerHTML = "";
  for (const c of cities) {
    try {
      const r = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const d = await r.json();
      bar.innerHTML += `<div class="city">${c.name}: ${d.current_weather.temperature}°C</div>`;
    } catch {
      bar.innerHTML += `<div class="city">${c.name}: — °C</div>`;
    }
  }
}
loadWeather();

/* =========================
   JSON Loader
========================= */
async function loadJSON(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(path);
  return r.json();
}

/* =========================
   Ticker
========================= */
function renderTicker(items) {
  const ul = $("#ticker-items");
  ul.innerHTML = "";
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.toUpperCase();
    ul.appendChild(li);
  });
  ul.innerHTML += ul.innerHTML;
}

/* =========================
   BLOG CARD RENDER
========================= */
function renderLatestArticle(article) {
  const card = $("#blog .card.post");
  if (!card) return;

  card.querySelector("h3").textContent = article.title;
  card.querySelector("p").textContent = article.excerpt;
  card.querySelector(".author").textContent = article.author;
  card.querySelector(".date").textContent = article.date;
  card.querySelector(".badge.cat").textContent = article.category;
  card.querySelector(".badge.time").textContent = article.readTime;

  const img = card.querySelector("img");
  img.src = article.image;
  img.onload = () => img.classList.remove("img-fallback");

  card.querySelector(".read-more").href =
    `article.html?slug=${article.slug}`;
}

/* =========================
   VLOG RENDER (FIXED)
========================= */
function renderTopVlogs(videos) {
  const cards = $$("#vlog article.card.video");
  videos.slice(0, 3).forEach((v, i) => {
    const card = cards[i];
    if (!card) return;

    card.querySelector(".badge.cat").textContent = v.category || "Video";
    card.querySelector(".badge.duration").textContent = v.duration || "";
    card.querySelector("h3").textContent = v.title;
    card.querySelector("p").textContent = v.description || "";

    const media = card.querySelector(".media");
    media.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${v.youtubeId}"
        loading="lazy"
        allowfullscreen
        frameborder="0"></iframe>`;
  });
}

/* =========================
   PLACEHOLDER (SAFE)
========================= */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='40' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function applyImageFallbacks() {
  document.querySelectorAll("img").forEach(img => {
    img.onerror = () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = "1";
        img.src = PLACEHOLDER;
      }
    };
  });
}

/* =========================
   MAIN LOAD
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const site = await loadJSON("content/site.json");
    const articles = await loadJSON("content/articles.json");
    const vlogs = await loadJSON("content/vlogs.json");

    renderTicker(site.ticker || []);
    renderLatestArticle(articles.items[0]);
    renderTopVlogs(vlogs.videos || []);

    // IMPORTANT: apply placeholders AFTER content load
    setTimeout(applyImageFallbacks, 500);
  } catch (e) {
    console.warn("Content load error", e);
  }
});
