// =====================
// Helpers
// =====================
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // Footer year
  // =====================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =====================
  // Clocks
  // =====================
  function updateTimes() {
    const now = new Date();

    $("#clock-cest span").textContent =
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "medium",
        hour12: false,
        timeZone: "Europe/Zurich"
      }).format(now);

    $("#tz-ist span").textContent =
      new Intl.DateTimeFormat("en-GB", {
        timeStyle: "medium",
        hour12: false,
        timeZone: "Asia/Kolkata"
      }).format(now);

    $("#tz-pkt span").textContent =
      new Intl.DateTimeFormat("en-GB", {
        timeStyle: "medium",
        hour12: false,
        timeZone: "Asia/Karachi"
      }).format(now);
  }
  updateTimes();
  setInterval(updateTimes, 1000);

  // =====================
  // Navigation dropdowns
  // =====================
  $$(".nav-item.has-sub > .nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const li = btn.closest(".nav-item");
      $$(".nav-item.open").forEach(n => n !== li && n.classList.remove("open"));
      li.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
  });

  // =====================
  // Mobile menu
  // =====================
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
      if (!expanded) {
        mobileMenu.innerHTML = $("#nav-list").outerHTML;
      }
    });
  }

  // =====================
  // Weather (FIXED)
  // =====================
  const cities = [
    ["Zurich", 47.3769, 8.5417],
    ["Rawalakot", 33.8578, 73.7604],
    ["Jammu", 32.7266, 74.8570],
    ["Kashmir", 34.0837, 74.7973],
    ["Ladakh", 34.1526, 77.5771],
    ["Gilgit", 35.9208, 74.3080],
    ["Baltistan", 35.3025, 75.6360],
    ["Muzaffarabad", 34.37, 73.47]
  ];

  const weatherBar = $("#weather-bar");

  async function loadWeather() {
    if (!weatherBar) return;
    weatherBar.innerHTML = "";

    for (const [name, lat, lon] of cities) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        const t = data?.current_weather?.temperature;
        const div = document.createElement("div");
        div.className = "city";
        div.innerHTML = `<span class="name">${name}:</span> <span class="temp">${t ?? "—"}°C</span>`;
        weatherBar.appendChild(div);
      } catch {
        const div = document.createElement("div");
        div.className = "city";
        div.textContent = `${name}: —`;
        weatherBar.appendChild(div);
      }
    }
  }
  loadWeather();

  // =====================
  // Contact modal (RESTORED)
  // =====================
  const modal = $("#contact-modal");
  const openBtn = $("#open-contact");
  const closeBtn = $("#close-contact");

  if (modal && openBtn && closeBtn) {
    openBtn.addEventListener("click", () => modal.showModal());
    closeBtn.addEventListener("click", () => modal.close());
  }

  // =====================
  // Image fallback (SAFE)
  // =====================
  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "1";

      if (img.dataset.placeholder) {
        const ph = document.createElement("div");
        ph.className = "media-placeholder";
        ph.textContent = img.dataset.placeholder;
        img.replaceWith(ph);
      }
    });
  });

  // =====================
  // Share buttons
  // =====================
  function sharePage() {
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href });
    } else {
      navigator.clipboard.writeText(location.href);
      alert("Link copied");
    }
  }

  $("#share-btn")?.addEventListener("click", sharePage);
  $("#sticky-share")?.addEventListener("click", sharePage);

});
