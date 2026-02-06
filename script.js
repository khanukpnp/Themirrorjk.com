// =========================
// Helpers
// =========================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
$("#year").textContent = new Date().getFullYear();

// =========================
// Time & Calendar (unchanged)
// =========================
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
  $("#clock-cest span").textContent =
    new Intl.DateTimeFormat("en-GB", opts).format(now).replace(",", " —");
}

function formatHijri() {
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    $("#cal-hijri span").textContent = fmt.format(new Date()) + " AH";
  } catch {
    $("#cal-hijri span").textContent = "Hijri calendar not supported";
  }
}

function formatVikramSamvatApprox() {
  const d = new Date();
  const vsYear = d.getMonth() >= 3 ? d.getFullYear() + 57 : d.getFullYear() + 56;
  const months = [
    "Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha",
    "Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  $("#cal-hindi span").textContent =
    `${months[map[d.getMonth()]]} ${d.getDate()}, ${vsYear} VS`;
}

function updateTimes() {
  formatCEST();
  formatHijri();
  formatVikramSamvatApprox();
  const now = new Date();
  const fmt = tz =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz
    }).format(now);

  $("#tz-ist span").textContent = fmt("Asia/Kolkata");
  $("#tz-pkt span").textContent = fmt("Asia/Karachi");
}
updateTimes();
setInterval(updateTimes, 1000);

// =========================
// Navigation (unchanged)
// =========================
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    li.classList.toggle("open");
  });
});

document.addEventListener("click", e => {
  if (!e.target.closest(".navbar")) {
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
  }
});

$("#hamburger").addEventListener("click", () => {
  const menu = $("#mobile-menu");
  menu.hidden = !menu.hidden;
  if (!menu.hidden) {
    const clone = $("#nav-list").cloneNode(true);
    clone.id = "nav-list-mobile";
    menu.innerHTML = "";
    menu.appendChild(clone);
  }
});

// =========================
// Weather (unchanged)
// =========================
async function loadWeather() {
  const bar = $("#weather-bar");
  bar.innerHTML = "";
  try {
    const r = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=33.8578&longitude=73.7604&current_weather=true"
    );
    const d = await r.json();
    bar.innerHTML = `<div class="city">Rawalakot: ${d.current_weather.temperature}°C</div>`;
  } catch {
    bar.innerHTML = `<div class="city">Weather unavailable</div>`;
  }
}
loadWeather();

// =========================
// JSON Loader
// =========================
async function loadJSON(path) {
  let r = await fetch(path, { cache: "no-store" });
  if (!r.ok && path.startsWith("content/")) {
    r = await fetch(path.replace("content/", ""), { cache: "no-store" });
  }
  if (!r.ok) throw new Error(path);
  return r.json();
}

// =========================
// Ticker
// =========================
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

// =========================
// ARTICLE RENDER FIX (NEW)
// =========================
function renderLatestArticles(items) {
  const cards = $$("#blog article.card.post");
  items.slice(0, cards.length).forEach((a, i) => {
    const card = cards[i];
    if (!card) return;

    card.querySelector("h3").textContent = a.title;
    card.querySelector("p").textContent = a.excerpt;
    card.querySelector(".author").textContent = a.author;
    card.querySelector(".date").textContent = a.date;
    card.querySelector(".badge.cat").textContent = a.category;
    card.querySelector(".badge.time").textContent = a.readTime;

    const img = card.querySelector("img");
    img.src = a.image;

    card.querySelector(".read-more").href =
      `article.html?slug=${a.slug}`;
  });
}

// =========================
// VLOG FIX (stable)
// =========================
function renderTopVlogs(videos) {
  const cards = $$("#vlog article.card.video");
  videos.slice(0, cards.length).forEach((v, i) => {
    const card = cards[i];
    if (!card) return;

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

// =========================
// IMAGE FALLBACK FIX (CRITICAL)
// =========================
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='40' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function forceImageFallbacks() {
  $$("img").forEach(img => {
    setTimeout(() => {
      if (!img.complete || img.naturalWidth === 0) {
        img.src = PLACEHOLDER;
        img.classList.add("img-fallback");
      }
    }, 300);
  });
}

// =========================
// MAIN
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const site = await loadJSON("content/site.json");
    const articles = await loadJSON("content/articles.json");
    const vlogs = await loadJSON("content/vlogs.json");

    renderTicker(site.ticker || []);
    renderLatestArticles(articles.items || []);
    renderTopVlogs(vlogs.videos || []);

    // MUST be delayed
    setTimeout(forceImageFallbacks, 800);
  } catch (e) {
    console.warn("Content load error", e);
  }
});
