// ================= CORE HELPERS =================
console.log("SCRIPT LOADED OK");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {

  /* ================= YEAR ================= */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================= CLOCKS & CALENDARS ================= */

  function formatCEST() {
    const el = $("#clock-cest span");
    if (!el) return;
    const now = new Date();
    el.textContent = new Intl.DateTimeFormat("en-GB", {
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

  function formatHijriKashmir() {
    const el = $("#cal-hijri span");
    if (!el) return;
    const now = new Date();
    now.setDate(now.getDate() - 1); // Kashmir moon offset
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    el.textContent = fmt.format(now) + " AH";
  }

  function formatVikramSamvat() {
    const el = $("#cal-hindi span");
    if (!el) return;
    const d = new Date();
    const y = d.getFullYear() + (d.getMonth() >= 3 ? 57 : 56);
    el.textContent = `VS ${y}`;
  }

  function updateTimes() {
    formatCEST();
    formatHijriKashmir();
    formatVikramSamvat();

    const now = new Date();
    const time = tz =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: tz
      }).format(now);

    $("#tz-ist span") && ($("#tz-ist span").textContent = time("Asia/Kolkata"));
    $("#tz-pkt span") && ($("#tz-pkt span").textContent = time("Asia/Karachi"));
  }

  updateTimes();
  setInterval(updateTimes, 1000);

  /* ================= WEATHER ================= */

  const cities = [
    ["Zurich",47.37,8.54],
    ["Jammu",32.73,74.86],
    ["Kashmir",34.08,74.79],
    ["Ladakh",34.15,77.57],
    ["Rawalakot",33.86,73.76],
    ["Gilgit",35.92,74.31],
    ["Muzaffarabad",34.37,73.47]
  ];

  const weatherBar = $("#weather-bar");
  if (weatherBar) {
    cities.forEach(async ([n,lat,lon]) => {
      const chip = document.createElement("div");
      chip.className = "city";
      chip.textContent = `${n}: —°C`;
      weatherBar.appendChild(chip);
      try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const j = await r.json();
        if (j.current_weather) chip.textContent = `${n}: ${j.current_weather.temperature}°C`;
      } catch {}
    });
  }

  /* ================= TICKER ================= */

  const ticker = $("#ticker-items");
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
    let x = 0;
    setInterval(() => {
      x -= 1;
      ticker.style.transform = `translateX(${x}px)`;
      if (Math.abs(x) > ticker.scrollWidth / 2) x = 0;
    }, 30);
  }

  /* ================= NAVIGATION ================= */

  const hamburger = $("#hamburger");
  const navList = $("#nav-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

  $$(".nav-item.has-sub > .nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      btn.parentElement.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    $$(".nav-item.open").forEach(i => i.classList.remove("open"));
  });

  /* ================= CONTACT MODAL ================= */

  const modal = $("#contact-modal");
  $("#open-contact")?.addEventListener("click", () => modal?.showModal());
  $("#close-contact")?.addEventListener("click", () => modal?.close());

  /* ================= SHARE ================= */

  function share() {
    navigator.share
      ? navigator.share({ title: document.title, url: location.href })
      : navigator.clipboard.writeText(location.href);
  }

  $("#share-btn")?.addEventListener("click", share);
  $("#sticky-share")?.addEventListener("click", share);

});
