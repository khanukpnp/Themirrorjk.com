(() => {
  "use strict";

  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => Array.from(r.querySelectorAll(q));

  /* ---------------- CLOCKS & CALENDARS ---------------- */

  function updateClocks() {
    const now = new Date();

    const cest = $("#clock-cest span");
    if (cest) {
      cest.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const ist = $("#ist-time span");
    if (ist) {
      ist.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const pkt = $("#pkt-time span");
    if (pkt) {
      pkt.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const hijri = $("#hijri-date span");
    if (hijri) {
      try {
        hijri.textContent = new Intl.DateTimeFormat(
          "en-GB-u-ca-islamic-umalqura",
          { day: "numeric", month: "long", year: "numeric" }
        ).format(now);
      } catch {
        hijri.textContent = "Hijri";
      }
    }

    const saka = $("#saka-date span");
    if (saka) {
      try {
        saka.textContent = new Intl.DateTimeFormat(
          "en-GB-u-ca-indian",
          { day: "numeric", month: "long", year: "numeric" }
        ).format(now);
      } catch {
        saka.textContent = "Saka";
      }
    }
  }

  /* ---------------- WEATHER ---------------- */

  async function loadWeather() {
    const bar = $("#weather-bar");
    if (!bar) return;

    const cities = [
      ["Zurich", 47.3769, 8.5417],
      ["Jammu", 32.7266, 74.8570],
      ["Kashmir", 34.0837, 74.7973],
      ["Ladakh", 34.1526, 77.5771],
      ["Gilgit", 35.9208, 74.3081],
      ["Baltistan", 35.2971, 75.6333],
      ["Muzaffarabad", 34.3700, 73.4708],
      ["Rawalakot", 33.8584, 73.7669]
    ];

    bar.innerHTML = "";

    for (const [name, lat, lon] of cities) {
      const chip = document.createElement("div");
      chip.className = "chip tiny";
      chip.textContent = `${name}: …°C`;
      bar.appendChild(chip);

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=celsius&timezone=auto`
        );
        const data = await res.json();
        chip.textContent = `${name}: ${data.current.temperature_2m.toFixed(1)}°C`;
      } catch {
        chip.textContent = `${name}: —°C`;
      }
    }
  }

  /* ---------------- HOME DROPDOWN ---------------- */

  function setupHomeDropdown() {
    const homeBtn = $(".nav-btn[data-toggle]");
    const dropdown = homeBtn?.nextElementSibling;

    if (!homeBtn || !dropdown) return;

    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!homeBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  }

  /* ---------------- MOBILE MENU ---------------- */

  function setupMobileMenu() {
    const hamburger = $("#hamburger");
    const menu = $("#mobile-menu");
    const nav = $("#nav-list");

    if (!hamburger || !menu || !nav) return;

    menu.innerHTML = nav.outerHTML;
    menu.hidden = true;

    hamburger.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */

  function setYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- INIT ---------------- */

  function init() {
    setYear();
    updateClocks();
    setInterval(updateClocks, 1000);

    loadWeather();
    setupHomeDropdown();
    setupMobileMenu();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
