// =====================
// Helpers
// =====================
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // Footer year
  // =====================
  $("#year") && ($("#year").textContent = new Date().getFullYear());

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
  document.addEventListener("click", () =>
    $$(".nav-item.open").forEach(n => n.classList.remove("open"))
  );

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
      if (!expanded) mobileMenu.innerHTML = $("#nav-list").outerHTML;
    });
  }

  // =====================
  // Weather
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
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const d = await r.json();
        const t = d?.current_weather?.temperature;
        weatherBar.insertAdjacentHTML(
          "beforeend",
          `<div class="city"><span class="name">${name}:</span> <span class="temp">${t ?? "—"}°C</span></div>`
        );
      } catch {
        weatherBar.insertAdjacentHTML(
          "beforeend",
          `<div class="city"><span class="name">${name}:</span> <span class="temp">—</span></div>`
        );
      }
    }
  }
  loadWeather();

  // =====================
  // Contact modal
  // =====================
  const modal = $("#contact-modal");
  $("#open-contact")?.addEventListener("click", () => modal.showModal());
  $("#close-contact")?.addEventListener("click", () => modal.close());

  // =====================
  // PLACEHOLDERS (RESTORED PROPERLY)
  // =====================
  $$("img").forEach(img => {
    if (!img.getAttribute("src")) {
      injectPlaceholder(img);
    }
    img.addEventListener("error", () => injectPlaceholder(img));
  });

  function injectPlaceholder(img) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "1";

    const text = img.dataset.placeholder || "Image unavailable";
    const holder = document.createElement("div");
    holder.className = "media-placeholder";
    holder.textContent = text;
    img.replaceWith(holder);
  }

  // =====================
  // YOUTUBE EMBEDS (RESTORED)
  // =====================
  $$(".card.video .media").forEach(media => {
    const yt = media.dataset.youtube || media.getAttribute("data-youtube");
    if (!yt) return;

    media.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${yt}"
        loading="lazy"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style="width:100%;height:100%;border:0">
      </iframe>
    `;
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
