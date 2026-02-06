/* =========================
   Helpers
========================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
$("#year").textContent = new Date().getFullYear();

/* =========================
   Clocks & Calendars
========================= */
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
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    $("#cal-hijri span").textContent = fmt.format(now) + " AH";
  } catch {
    $("#cal-hijri span").textContent = "Hijri calendar not supported";
  }
}

function formatVikramSamvatApprox() {
  const now = new Date();
  const vsYear = now.getMonth() >= 3 ? now.getFullYear() + 57 : now.getFullYear() + 56;
  const months = [
    "Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha",
    "Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  $("#cal-hindi span").textContent =
    `${months[map[now.getMonth()]]} ${now.getDate()}, ${vsYear} VS`;
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

/* =========================
   Navigation
========================= */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    li.classList.toggle("open");
  });
});
document.addEventListener("click", e => {
  if (!e.target.closest(".navbar"))
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
});

const hamburger = $("#hamburger");
const mobileMenu = $("#mobile-menu");
hamburger.addEventListener("click", () => {
  const open = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!open));
  if (!open) {
    mobileMenu.innerHTML = "";
    const clone = $("#nav-list").cloneNode(true);
    clone.id = "nav-list-mobile";
    clone.querySelectorAll(".nav-btn").forEach(b => {
      if (b.tagName === "BUTTON") {
        const a = document.createElement("a");
        a.textContent = b.textContent;
        a.className = "nav-btn";
        a.href = "#";
        b.replaceWith(a);
      }
    });
    mobileMenu.appendChild(clone);
    mobileMenu.hidden = false;
  } else {
    mobileMenu.hidden = true;
  }
});

/* =========================
   Weather
========================= */
const cities = [
  { name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { name: "Rawalakot", lat: 33.8578, lon: 73.7604 },
  { name: "Jammu", lat: 32.7266, lon: 74.857 },
  { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
  { name: "Ladakh", lat: 34.1526, lon: 77.5771 },
  { name: "Gilgit", lat: 35.9208, lon: 74.308 },
  { name: "Baltistan", lat: 35.3025, lon: 75.636 },
  { name: "Muzaffarabad", lat: 34.37, lon: 73.47 }
];
const weatherBar = $("#weather-bar");

async function loadWeather() {
  weatherBar.textContent = "";
  for (const c of cities) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";
      const div = document.createElement("div");
      div.className = "city";
      div.innerHTML = `<span class="name">${c.name}:</span> <span class="temp">${t}°C</span>`;
      weatherBar.appendChild(div);
    } catch {
      weatherBar.appendChild(
        Object.assign(document.createElement("div"), {
          className: "city",
          textContent: `${c.name}: — °C`
        })
      );
    }
  }
}
loadWeather();

/* =========================
   JSON Loader
========================= */
async function loadJSON(path) {
  const tryFetch = async p => {
    const r = await fetch(p, { cache: "no-store" });
    return r.ok ? r : null;
  };
  return (await (await tryFetch(path) || tryFetch(path.replace("content/", ""))).json());
}

/* =========================
   Placeholder handling
========================= */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function replaceWithPlaceholder(img) {
  if (img.dataset.done) return;
  img.dataset.done = "1";
  img.src = PLACEHOLDER;
}

/* =========================
   Content apply
========================= */
async function applyContent() {
  try {
    const site = await loadJSON("content/site.json");
    const articles = await loadJSON("content/articles.json");
    renderTicker(site.ticker || []);

    /* Latest article → first homepage card */
    const latest = articles.items?.[0];
    const card = $("#blog .card.post");
    if (latest && card) {
      card.querySelector("h3").textContent = latest.title;
      card.querySelector("p").textContent = latest.excerpt;
      card.querySelector(".author").textContent = latest.author;
      card.querySelector(".date").textContent = latest.date;
      card.querySelector(".badge.cat").textContent = latest.category;
      card.querySelector(".badge.time").textContent = latest.readTime;
      const img = card.querySelector("img");
      img.src = latest.image;
      card.querySelector(".read-more").href =
        `article.html?slug=${latest.slug}`;
    }
  } catch (e) {
    console.warn("Content load skipped", e);
  }
}

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
   DOM Ready
========================= */
document.addEventListener("DOMContentLoaded", () => {
  applyContent();

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => replaceWithPlaceholder(img));
    if (img.complete && img.naturalWidth === 0) replaceWithPlaceholder(img);
  });
});

/* =========================
   Article page actions
========================= */
window.initArticlePage = function () {
  let likes = 0;
  const likeBtn = document.querySelector("[data-like]");
  const count = document.querySelector("[data-like-count]");
  if (likeBtn)
    likeBtn.onclick = () => {
      likes++;
      count.textContent = likes;
    };

  const copyBtn = document.querySelector("[data-copy]");
  if (copyBtn)
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(location.href);
      copyBtn.textContent = "Copied";
      setTimeout(() => (copyBtn.textContent = "🔗 Copy Link"), 1500);
    };

  const shareBtn = document.querySelector("[data-share]");
  if (shareBtn)
    shareBtn.onclick = () =>
      navigator.share
        ? navigator.share({ title: document.title, url: location.href })
        : navigator.clipboard.writeText(location.href);
};
