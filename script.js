/* ===============================
   CORE HELPERS
================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
document.getElementById("year")?.textContent = new Date().getFullYear();

/* ===============================
   TIME & CALENDARS (SAFE)
================================ */
function updateTimes() {
  const now = new Date();

  // CEST
  const cest = new Intl.DateTimeFormat("en-GB", {
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
  $("#clock-cest span") && ($("#clock-cest span").textContent = cest.replace(",", " —"));

  // Hijri
  try {
    const hijri = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
    $("#cal-hijri span") && ($("#cal-hijri span").textContent = hijri + " AH");
  } catch {
    $("#cal-hijri span") && ($("#cal-hijri span").textContent = "Hijri unavailable");
  }

  // Vikram Samvat (approx)
  const gYear = now.getFullYear();
  const vsYear = now.getMonth() >= 3 ? gYear + 57 : gYear + 56;
  const vsMonths = [
    "Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha",
    "Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  const vsMonth = vsMonths[map[now.getMonth()]];
  $("#cal-hindi span") && ($("#cal-hindi span").textContent = `${vsMonth} ${now.getDate()}, ${vsYear} VS`);

  // IST / PKT
  const timeAt = tz =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz
    }).format(now);

  $("#tz-ist span") && ($("#tz-ist span").textContent = timeAt("Asia/Kolkata"));
  $("#tz-pkt span") && ($("#tz-pkt span").textContent = timeAt("Asia/Karachi"));
}
updateTimes();
setInterval(updateTimes, 1000);

/* ===============================
   NAVIGATION (UNCHANGED LOGIC)
================================ */
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
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

/* ===============================
   WEATHER (ALL CITIES SAFE)
================================ */
const cities = [
  { name:"Zurich", lat:47.3769, lon:8.5417 },
  { name:"Rawalakot", lat:33.8578, lon:73.7604 },
  { name:"Jammu", lat:32.7266, lon:74.8570 },
  { name:"Kashmir", lat:34.0837, lon:74.7973 },
  { name:"Ladakh", lat:34.1526, lon:77.5771 },
  { name:"Gilgit", lat:35.9208, lon:74.3080 },
  { name:"Baltistan", lat:35.3025, lon:75.6360 },
  { name:"Muzaffarabad", lat:34.37, lon:73.47 }
];

const weatherBar = $("#weather-bar");
const iconFor = c =>
  c === 0 ? "☀️" :
  [1,2,3].includes(c) ? "⛅" :
  [61,63,65,80,81,82].includes(c) ? "🌧️" :
  [71,73,75,85,86].includes(c) ? "🌨️" :
  [95,96,99].includes(c) ? "⛈️" : "🌡️";

async function loadWeather() {
  if (!weatherBar) return;
  weatherBar.innerHTML = "";
  for (const c of cities) {
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`);
      const d = await r.json();
      const temp = d?.current_weather?.temperature ?? "—";
      const icon = iconFor(d?.current_weather?.weathercode);
      weatherBar.innerHTML += `<div class="city"><span>${c.name}:</span> <span>${temp}°C ${icon}</span></div>`;
    } catch {
      weatherBar.innerHTML += `<div class="city"><span>${c.name}:</span> <span>— °C</span></div>`;
    }
  }
}
loadWeather();

/* ===============================
   IMAGE PLACEHOLDER (SAFE)
================================ */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function fixImages() {
  document.querySelectorAll("img").forEach(img => {
    if (!img.dataset.bound) {
      img.dataset.bound = "1";
      img.addEventListener("error", () => {
        if (!img.dataset.failed) {
          img.dataset.failed = "1";
          img.src = PLACEHOLDER;
        }
      });
    }
  });
}

/* ===============================
   VLOG YOUTUBE EMBEDS (SAFE)
================================ */
async function loadVlogs() {
  try {
    const res = await fetch("content/vlogs.json");
    if (!res.ok) return;
    const data = await res.json();
    const cards = $$("#vlog article.card.video");
    data.videos.slice(0, cards.length).forEach((v, i) => {
      const media = cards[i].querySelector(".media");
      media.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${v.youtubeId}"
          loading="lazy"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
        </iframe>`;
    });
  } catch {}
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  fixImages();
  loadVlogs();
});
