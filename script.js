// JS v2 refresh (FULL ORIGINAL STABLE VERSION)

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

/* ===== YEAR ===== */
if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

/* ===== CLOCKS ===== */
function formatCEST() {
  const el = $("#clock-cest span");
  if (!el) return;

  const now = new Date();
  const opts = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:false,
    timeZone: 'Europe/Zurich'
  };

  el.textContent =
    new Intl.DateTimeFormat('en-GB', opts)
    .format(now)
    .replace(',', ' —');
}

function formatHijri() {
  const el = $("#cal-hijri span");
  if (!el) return;

  try{
    const now = new Date();
    const fmt = new Intl.DateTimeFormat(
      'en-u-ca-islamic',
      { day:'numeric', month:'long', year:'numeric' }
    );
    el.textContent = fmt.format(now) + " AH";
  } catch(e){
    el.textContent = "Hijri calendar not supported";
  }
}

function formatVikramSamvatApprox(){
  const el = $("#cal-hindi span");
  if (!el) return;

  const now = new Date();
  const gYear = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const vsYear = (m >= 3) ? gYear + 57 : gYear + 56;

  const months = [
    "Pausha","Magha","Phalguna","Chaitra",
    "Vaisakh","Jyeshtha","Ashadha","Shravana",
    "Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];

  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  el.textContent =
    `${months[map[m]]} ${d}, ${vsYear} VS`;
}

function updateTimes(){
  formatCEST();
  formatHijri();
  formatVikramSamvatApprox();

  const now = new Date();
  const fmt = (tz) =>
    new Intl.DateTimeFormat(
      'en-GB',
      { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone: tz }
    ).format(now);

  const ist = $("#tz-ist span");
  const pkt = $("#tz-pkt span");

  if (ist) ist.textContent = fmt('Asia/Kolkata');
  if (pkt) pkt.textContent = fmt('Asia/Karachi');
}

updateTimes();
setInterval(updateTimes, 1000);

/* ===== NAVIGATION ===== */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    if (!li) return;

    const isOpen = li.classList.contains("open");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    if(!isOpen) li.classList.add("open");
  });
});

document.addEventListener("click", (e) => {
  if(!e.target.closest(".navbar")) {
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
  }
});

const hamburger = $("#hamburger");
const mobileMenu = $("#mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

/* ===== WEATHER ===== */
const cities = [
  { name:"Zurich", lat:47.3769, lon:8.5417 },
  { name:"Rawalakot", lat:33.8578, lon:73.7604 }
];

const weatherBar = $("#weather-bar");

async function loadWeather(){
  if (!weatherBar) return;

  weatherBar.textContent = "";

  for(const c of cities){
    try{
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";
      weatherBar.innerHTML +=
        `<div class="city"><span>${c.name}:</span> ${t}°C</div>`;
    } catch(e){
      weatherBar.innerHTML +=
        `<div class="city"><span>${c.name}:</span> —°C</div>`;
    }
  }
}

loadWeather();

/* ===== CONTENT LOADER ===== */
async function loadJSON(path){
  const res = await fetch(path, { cache:"no-store" });
  if(!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
}

async function applyContent(){
  try{
    const [site, articles, vlogs] = await Promise.all([
      loadJSON("content/site.json"),
      loadJSON("content/articles.json"),
      loadJSON("content/vlogs.json")
    ]);

    const titleEl = document.querySelector(".site-title");
    if(titleEl && site.siteTitle)
      titleEl.textContent = site.siteTitle;

  } catch(e){
    console.warn("Content load skipped:", e);
  }
}

document.addEventListener("DOMContentLoaded", applyContent);

/* ===== IMAGE PLACEHOLDER ===== */
document.addEventListener("DOMContentLoaded", () => {
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = placeholder;
    });
  });
});

/* ===== CONTACT MODAL ===== */
document.addEventListener("DOMContentLoaded", () => {
  const dlg = $("#contact-modal");
  const open = $("#open-contact");
  const close = $("#close-contact");

  if (dlg && open && close) {
    open.addEventListener("click", ()=> dlg.showModal());
    close.addEventListener("click", ()=> dlg.close());
  }
});
