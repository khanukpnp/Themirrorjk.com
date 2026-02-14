// JS v2 hardened stable

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

/* ===== YEAR SAFE ===== */
if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

/* ===== CLOCKS ===== */
function formatCEST() {
  const el = $("#clock-cest span");
  if(!el) return;

  const now = new Date();
  const opts = {
    weekday:'long', year:'numeric', month:'long', day:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
    hour12:false, timeZone:'Europe/Zurich'
  };
  el.textContent =
    new Intl.DateTimeFormat('en-GB', opts)
    .format(now).replace(',', ' —');
}

function formatHijri() {
  const el = $("#cal-hijri span");
  if(!el) return;

  try{
    const now = new Date();
    const fmt = new Intl.DateTimeFormat(
      'en-u-ca-islamic',
      { day:'numeric', month:'long', year:'numeric' }
    );
    el.textContent = fmt.format(now) + " AH";
  }catch(e){
    el.textContent = "Hijri calendar not supported";
  }
}

function formatVikramSamvatApprox(){
  const el = $("#cal-hindi span");
  if(!el) return;

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

  if(ist) ist.textContent = fmt('Asia/Kolkata');
  if(pkt) pkt.textContent = fmt('Asia/Karachi');
}

updateTimes();
setInterval(updateTimes, 1000);

/* ===== NAV SAFE ===== */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    if(!li) return;

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

if(hamburger && mobileMenu){
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));

    if(!expanded){
      mobileMenu.innerHTML = "";
      const navList = $("#nav-list");
      if(!navList) return;

      const clone = navList.cloneNode(true);
      clone.id = "nav-list-mobile";

      clone.querySelectorAll(".nav-item.has-sub > .nav-btn")
        .forEach(b => {
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

/* ===== WEATHER SAFE ===== */
const weatherBar = $("#weather-bar");

const cities = [
  { key:"zurich", name:"Zurich", lat:47.3769, lon:8.5417 },
  { key:"rawalakot", name:"Rawalakot", lat:33.8578, lon:73.7604 },
  { key:"jammu", name:"Jammu", lat:32.7266, lon:74.8570 },
  { key:"kashmir", name:"Kashmir", lat:34.0837, lon:74.7973 },
  { key:"ladakh", name:"Ladakh", lat:34.1526, lon:77.5771 },
  { key:"gilgit", name:"Gilgit", lat:35.9208, lon:74.3080 },
  { key:"baltistan", name:"Baltistan", lat:35.3025, lon:75.6360 },
  { key:"muzaffarabad", name:"Muzaffarabad", lat:34.37, lon:73.47 }
];

function codeToIcon(code){
  if([0].includes(code)) return "☀️";
  if([1,2,3].includes(code)) return "⛅";
  if([45,48].includes(code)) return "🌫️";
  if([51,53,55,56,57].includes(code)) return "🌦️";
  if([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if([71,73,75,77,85,86].includes(code)) return "🌨️";
  if([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
}

function createCityChip(name, text){
  const el = document.createElement("div");
  el.className = "city";
  el.innerHTML =
    `<span class="name">${name}:</span> <span class="temp">${text}</span>`;
  return el;
}

async function loadWeather(){
  if(!weatherBar) return;

  weatherBar.textContent = "";

  for(const c of cities){
    try{
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";
      const code = data?.current_weather?.weathercode ?? null;
      const icon = codeToIcon(Number(code));
      weatherBar.appendChild(
        createCityChip(c.name, `${t}°C ${icon}`)
      );
    }catch(e){
      weatherBar.appendChild(createCityChip(c.name,"— °C"));
    }
  }
}

loadWeather();

/* ===== CONTENT SAFE ===== */
async function loadJSON(path){
  const res = await fetch(path,{cache:"no-store"});
  if(!res.ok) throw new Error("Failed to load "+path);
  return await res.json();
}

async function applyContent(){
  try{
    const [site] = await Promise.all([
      loadJSON("content/site.json")
    ]);

    const titleEl =
      document.querySelector(".site-title");
    if(titleEl && site.siteTitle)
      titleEl.textContent = site.siteTitle;

  }catch(e){
    console.warn("Content skipped:", e);
  }
}

document.addEventListener("DOMContentLoaded", applyContent);
