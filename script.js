// ================= GLOBAL SELECTORS =================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ================= IMAGE FALLBACK =================
function applyImageFallback(ctx = document) {
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='36' fill='%23999'%3EImage Placeholder%3C/text%3E%3C/svg%3E";

  $$("img", ctx).forEach(img => {
    img.onerror = () => {
      img.src = placeholder;
    };
  });
}

// ================= ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {

  // ================= YEAR =================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================= CLOCKS & CALENDARS =================
  function updateTimes() {
    const now = new Date();

    const setTime = (selector, options) => {
      const el = $(selector);
      if (!el) return;
      try {
        el.textContent = new Intl.DateTimeFormat("en-GB", options).format(now);
      } catch {
        el.textContent = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).format(now);
      }
    };

    // CEST (Zurich)
    setTime("#clock-cest span", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Zurich"
    });

    // IST (Jammu–Kashmir–Ladbi)
    setTime("#tz-ist span", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    });

    // PKT (Gilgit–Baltistan & Azad Kashmir)
    setTime("#tz-pkt span", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi"
    });

    // Hijri Calendar
    const hijriEl = $("#cal-hijri span");
    if (hijriEl) {
      try {
        hijriEl.textContent = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          calendar: "islamic"
        }).format(now);
      } catch {
        hijriEl.textContent = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
      }
    }

    // Hindi (Vikram Samvat)
    const hindiEl = $("#cal-hindi span");
    if (hindiEl) {
      try {
        hindiEl.textContent = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          calendar: "indian"
        }).format(now);
      } catch {
        hindiEl.textContent = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
      }
    }
  }

  updateTimes();
  setInterval(updateTimes, 1000);

  // ================= WEATHER BAR =================
  async function loadWeather() {
    const bar = $("#weather-bar");
    if (!bar) return;

    const cities = [
      { name: "Zurich", lat: 47.3769, lon: 8.5417 },
      { name: "Rawalakot", lat: 33.8578, lon: 73.7604 },
      { name: "Jammu", lat: 32.7266, lon: 74.8570 },
      { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
      { name: "Ladakh", lat: 34.1526, lon: 77.5771 },
      { name: "Gilgit", lat: 35.9208, lon: 74.3080 },
      { name: "Baltistan", lat: 35.3025, lon: 75.6360 },
      { name: "Muzaffarabad", lat: 34.37, lon: 73.47 }
    ];

    bar.innerHTML = "";

    for (const c of cities) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
        );
        const data = await res.json();
        const t = data?.current_weather?.temperature ?? "—";
        bar.innerHTML += `<div class="city">${c.name}: ${t}°C</div>`;
      } catch {
        bar.innerHTML += `<div class="city">${c.name}: —°C</div>`;
      }
    }
  }

  loadWeather();

  // ================= BREAKING NEWS =================
  async function loadBreaking() {
    const mediaBox = $("#breaking .media");
    const bodyBox = $("#breaking-body");
    if (!mediaBox || !bodyBox) return;

    try {
      const res = await fetch("content/breaking.json", { cache: "no-store" });
      const data = await res.json();
      if (!data.items || data.items.length === 0) return;

      const item = data.items[0];

      // HERO IMAGE
      if (item.heroImage?.src) {
        mediaBox.innerHTML = `
          <img src="${item.heroImage.src}" alt="" style="aspect-ratio:16/9; object-fit:cover;">
        `;
        mediaBox.classList.remove("placeholder");
      } else {
        mediaBox.textContent = "No Image";
      }

      // TEXT CONTENT
      bodyBox.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
      `;

      applyImageFallback(mediaBox);
    } catch (err) {
      console.warn("Breaking news failed:", err);
    }
  }

  loadBreaking();

  // ================= LATEST ARTICLES =================
  async function loadLatestArticles() {
    const ids = [
      ["#la1-media", "#la1-body"],
      ["#la2-media", "#la2-body"],
      ["#la3-media", "#la3-body"]
    ];

    try {
      const res = await fetch("content/articles.json", { cache: "no-store" });
      const data = await res.json();
      if (!data.items) return;

      const items = data.items
        .slice()
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .slice(0,3);

      items.forEach((item, i) => {
        const media = document.querySelector(ids[i][0]);
        const body  = document.querySelector(ids[i][1]);

        if (item.heroImage?.src) {
          media.innerHTML = `
            <img src="${item.heroImage.src}" alt="${item.title}" 
                 style="aspect-ratio:16/9;object-fit:cover;">
          `;
          media.classList.remove("placeholder");
        }

        body.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.excerpt || ""}</p>
          <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
        `;
      });

      applyImageFallback();
    } catch (err) {
      console.warn("Latest articles failed:", err);
    }
  }

  loadLatestArticles();

  // ================= TICKER DUPLICATION =================
  const tickerList = $("#ticker-items");
  if (tickerList && tickerList.parentElement) {
    const clone = tickerList.cloneNode(true);
    tickerList.parentElement.appendChild(clone);
  }

  // ================= NAVIGATION DROPDOWNS =================
  $$(".nav-item.has-sub").forEach(item => {
    const btn = item.querySelector(".nav-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = item.classList.contains("open");
      $$(".nav-item.has-sub").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  document.addEventListener("click", () => {
    $$(".nav-item.has-sub").forEach(i => i.classList.remove("open"));
  });

  // ================= MOBILE MENU =================
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");
  const navList = $(".nav-list");

  if (hamburger && mobileMenu && navList) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.hasAttribute("hidden") === false;
      if (isOpen) {
        mobileMenu.setAttribute("hidden", "");
      } else {
        mobileMenu.removeAttribute("hidden");
        mobileMenu.innerHTML = navList.outerHTML;

        $$(".nav-item.has-sub", mobileMenu).forEach(item => {
          const btn = item.querySelector(".nav-btn");
          if (!btn) return;
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            item.classList.toggle("open");
          });
        });
      }
    });
  }

  // ================= CONTACT MODAL =================
  const contactModal = $("#contact-modal");
  const openContactBtn = $("#open-contact");
  const openContactEpaperBtn = $("#open-contact-epaper");
  const closeContactBtn = $("#close-contact");

  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener("click", () => {
      contactModal.showModal();
    });
  }

  if (openContactEpaperBtn && contactModal) {
    openContactEpaperBtn.addEventListener("click", () => {
      contactModal.showModal();
    });
  }

  if (closeContactBtn && contactModal) {
    closeContactBtn.addEventListener("click", () => {
      contactModal.close();
    });
  }

  // ================= FINAL IMAGE FALLBACK =================
  applyImageFallback();
});
