/* ============================================================
   PAGE LOADER
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initYear();

  updateGregorian();
  updateHijri();
  updateBikrami();
  updateClocks();

  initWeatherBar();
  initTicker();
  initNav();
  initContactModal();
  initVlogs();

  // Auto-refresh
  setInterval(updateGregorian, 1000);
  setInterval(updateHijri, 60000);
  setInterval(updateBikrami, 60000);
  setInterval(updateClocks, 1000);

  // Homepage content loader
  loadHomepageIndex();
});

/* ============================================================
   LOADER
============================================================ */
function initLoader() {
  const loader = document.getElementById("site-loader");
  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 600);
  }, 1200);
}

/* ============================================================
   FOOTER YEAR
============================================================ */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ============================================================
   GREGORIAN DATE (FULL DATE + TIME)
============================================================ */
function updateGregorian() {
  const el = document.querySelector("#cal-gregorian span");
  if (!el) return;

  const now = new Date();

  const datePart = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timePart = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  el.textContent = `${datePart} at ${timePart}`;
}

/* ============================================================
   HIJRI DATE
============================================================ */
function updateHijri() {
  const el = document.querySelector("#cal-hijri span");
  if (!el) return;

  try {
    const now = new Date();
    const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);

    el.textContent = hijriDate;
  } catch {
    el.textContent = "Hijri calendar";
  }
}

/* ============================================================
   PUNJABI DESI BIKRAMI DATE
============================================================ */
function updateBikrami() {
  const el = document.querySelector("#cal-bikrami span");
  if (!el) return;

  const now = new Date();

  const months = [
    "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
    "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
  ];

  const startMonth = 2; // Chet begins mid-March
  const month = (now.getMonth() - startMonth + 12) % 12;
  const year = now.getFullYear() + 57;
  const day = now.getDate();

  el.textContent = `${day} ${months[month]} ${year} BK`;
}

/* ============================================================
   CLOCKS — CEST / IST / PKT
============================================================ */
function updateClocks() {
  const now = new Date();

  // CEST
  const cestEl = document.querySelector("#clock-cest span");
  if (cestEl) {
    cestEl.textContent = now.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  // IST
  const istEl = document.querySelector("#tz-ist span");
  if (istEl) {
    istEl.textContent = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  // PKT
  const pktEl = document.querySelector("#tz-pkt span");
  if (pktEl) {
    pktEl.textContent = now.toLocaleTimeString("en-PK", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
}

/* ============================================================
   WEATHER BAR
============================================================ */
function initWeatherBar() {
  const bar = document.getElementById("weather-bar");
  if (!bar) return;

  const cities = [
    { name: "Zurich", temp: "7°C" },
    { name: "Rawalakot", temp: "9°C" },
    { name: "Jammu", temp: "18°C" },
    { name: "Kashmir", temp: "5°C" },
    { name: "Ladakh", temp: "2°C" },
    { name: "Gilgit", temp: "3°C" },
    { name: "Baltistan", temp: "3°C" },
    { name: "Muzaffarabad", temp: "8°C" }
  ];

  bar.innerHTML = cities
    .map(
      c => `
      <div class="chip tiny">
        🌡️ ${c.name}: <strong>${c.temp}</strong>
      </div>
    `
    )
    .join("");
}

/* ============================================================
   TICKER
============================================================ */
function initTicker() {
  const ul = document.getElementById("ticker-items");
  if (!ul) return;

  const items = [
    "WE DO NOT MANUFACTURE NARRATIVES — WE REFLECT REALITY",
    "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH"
  ];

  ul.innerHTML = items.map(t => `<li>${t}</li>`).join("");
}

/* ============================================================
   NAVIGATION
============================================================ */
function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !navList || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));

    if (expanded) {
      mobileMenu.hidden = true;
      mobileMenu.innerHTML = "";
    } else {
      mobileMenu.hidden = false;
      mobileMenu.innerHTML = navList.innerHTML;
    }
  });
}

/* ============================================================
   CONTACT MODAL
============================================================ */
function initContactModal() {
  const openBtn = document.getElementById("contact-open");
  const closeBtn = document.getElementById("contact-close");
  const modal = document.getElementById("contact-modal");

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

/* ============================================================
   VLOGS (STATIC PLACEHOLDERS)
============================================================ */
function initVlogs() {
  const grid = document.getElementById("vlogs-grid");
  if (!grid) return;

  const vlogs = [
    { title: "Kashmir Protest Highlights", duration: "4:32" },
    { title: "Diaspora Voices on Human Rights", duration: "6:10" },
    { title: "Brief History of Jammu & Kashmir", duration: "8:45" }
  ];

  grid.innerHTML = vlogs
    .map(
      v => `
      <article class="card">
        <div class="media maroon">▶</div>
        <div class="card-body">
          <h3>${v.title}</h3>
          <p>Duration: ${v.duration}</p>
        </div>
      </article>
    `
    )
    .join("");
}

/* ============================================================
   HOMEPAGE CONTENT LOADER
============================================================ */
function loadHomepageIndex() {
  fetch("content/index.json")
    .then(r => r.json())
    .then(data => {
      const hp = data.homepage || data;

      if (hp.topStories) loadTopStories(hp.topStories);
      if (hp.latestEditorialHistorical) loadLatestEditorialHistorical(hp.latestEditorialHistorical);
      if (hp.jammuKashmir) loadJammuKashmir(hp.jammuKashmir);
      if (hp.international) loadInternational(hp.international);
      if (hp.humanRights) loadHumanRights(hp.humanRights);
    })
    .catch(err => console.error("Index JSON error:", err));
}

/* ============================================================
   TOP STORIES
============================================================ */
function loadTopStories(section) {
  if (section.lead) loadArticleToCard(section.lead, "lead-media", "lead-body");
  if (section.breaking) loadArticleToCard(section.breaking, "breaking-media", "breaking-body");
  if (section.opinion) loadArticleToCard(section.opinion, "opinion-media", "opinion-body");
}

/* ============================================================
   LATEST / EDITORIAL / HISTORICAL
============================================================ */
function loadLatestEditorialHistorical(section) {
  if (section.latest) loadArticleToCard(section.latest, "leh1-media", "leh1-body");
  if (section.editorial) loadArticleToCard(section.editorial, "leh2-media", "leh2-body");
  if (section.historical) loadArticleToCard(section.historical, "leh3-media", "leh3-body");
}

/* ============================================================
   JAMMU KASHMIR
============================================================ */
function loadJammuKashmir(ids) {
  if (!Array.isArray(ids)) return;

  if (ids[0]) loadArticleToCard(ids[0], "jk1-media", "jk1-body");
  if (ids[1]) loadArticleToCard(ids[1], "jk2-media", "jk2-body");
}

/* ============================================================
   INTERNATIONAL
============================================================ */
function loadInternational(ids) {
  if (!Array.isArray(ids)) return;

  if (ids[0]) loadArticleToCard(ids[0], "intl1-media", "intl1-body");
  if (ids[1]) loadArticleToCard(ids[1], "intl2-media", "intl2-body");
}

/* ============================================================
   HUMAN RIGHTS
============================================================ */
function loadHumanRights(ids) {
  if (!Array.isArray(ids)) return;

  if (ids[0]) loadArticleToCard(ids[0], "hr1-media", "hr1-body");
  if (ids[1]) loadArticleToCard(ids[1], "hr2-media", "hr2-body");
}

/* ============================================================
   UNIVERSAL ARTICLE LOADER
============================================================ */
function loadArticleToCard(articleId, mediaId, bodyId) {
  fetch(`content/${articleId}.json`)
    .then(r => r.json())
    .then(article => {
      renderArticleCard(mediaId, bodyId, article);
    })
    .catch(err => console.error(`Error loading ${articleId}:`, err));
}

/* ============================================================
   RENDER ARTICLE CARD
============================================================ */
function renderArticleCard(mediaId, bodyId, article) {
  const mediaEl = document.getElementById(mediaId);
  const bodyEl = document.getElementById(bodyId);

  if (!mediaEl || !bodyEl) return;

  if (article.heroImage && article.heroImage.src) {
    mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;
  }

  bodyEl.innerHTML = `
    <h3>${article.title}</h3>
    <p>${article.excerpt || article.summary || ""}</p>
    <a class="btn-red" href="article.html?id=${article.id}">Read More →</a>
  `;
}

/* ============================================================
   ARTICLE PAGE LOADER
============================================================ */

function loadArticlePage() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  fetch(`content/${id}.json`)
    .then(r => r.json())
    .then(article => {

      const titleEl = document.getElementById("title");
      const labelEl = document.getElementById("section-label");
      const metaEl = document.getElementById("meta");
      const heroImg = document.getElementById("heroImg");
      const heroCaption = document.getElementById("heroCaption");
      const contentEl = document.getElementById("content");

      if (!contentEl) return;

      if (titleEl) titleEl.textContent = article.title;
      if (labelEl) labelEl.textContent = article.sectionLabel || "";

      if (metaEl) {
        const date = new Date(article.date).toLocaleDateString();
        metaEl.textContent =
          `${article.author} | ${article.location} | ${date} | ${article.readTime}`;
      }

      if (heroImg && article.heroImage?.src) {
        heroImg.src = article.heroImage.src;
      }

      if (heroCaption && article.heroImage?.caption) {
        heroCaption.textContent =
          `${article.heroImage.caption} — ${article.heroImage.credit || ""}`;
      }

      contentEl.innerHTML = "";

      article.body.forEach(block => {

        // PARAGRAPH
        if (block.type === "paragraph") {
          contentEl.innerHTML += `<p>${block.text}</p>`;
        }

        // MID ARTICLE SUBHEADING
        if (block.type === "subheading") {
          contentEl.innerHTML +=
            `<h2 class="mid-subheading">${block.text}</h2>`;
        }

        // PULL QUOTE
        if (block.type === "pullquote") {
          contentEl.innerHTML +=
            `<div class="pull-quote">${block.text}</div>`;
        }

        // IMPORTANT POINTS
        if (block.type === "points") {
          contentEl.innerHTML += `
            <div class="important-points">
              <ul>
                ${block.items.map(i => `<li>${i}</li>`).join("")}
              </ul>
            </div>
          `;
        }

        // INLINE IMAGE
        if (block.type === "image") {

          const alignClass =
            block.align === "right" ? "img-right" : "img-left";

          contentEl.innerHTML += `
            <figure class="${alignClass}">
              <img src="${block.src}" alt="">
              <figcaption>${block.caption || ""}</figcaption>
            </figure>
          `;
        }

      });

      loadArticleSidebar();

    })
    .catch(err => console.error("Article load error:", err));

}
