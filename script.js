/* ============================================================
   SHORTCUTS
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ============================================================
   SAFE JSON LOADER (NO CRASH IF FILE MISSING OR INVALID)
============================================================ */
async function safeJSON(path) {
  try {
    const res = await fetch(path + "?v=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("Missing JSON: " + path);
    const data = await res.json();
    return data || {};
  } catch (err) {
    console.warn("safeJSON fallback for", path, err);
    return { items: [] };
  }
}

/* ============================================================
   BOOTSTRAP
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  updateYear();
  updateTimes();
  setInterval(updateTimes, 1000);
  updateCalendars();
  loadWeather();
  loadTicker();
  loadHomepage();
  setupNav();
  setupContactModal();

  if (document.body.classList.contains("article-page")) {
    initArticlePage();
  }
});

window.addEventListener("load", () => {
  const loader = $("#site-loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 400);
  }
});

/* ============================================================
   YEAR
============================================================ */
function updateYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ============================================================
   CLOCKS
============================================================ */
function updateTimes() {
  const now = new Date();

  const cest = $("#clock-cest span");
  if (cest) {
    cest.textContent = new Intl.DateTimeFormat("en-GB", {
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

  const ist = $("#tz-ist span");
  if (ist) {
    ist.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    }).format(now);
  }

  const pkt = $("#tz-pkt span");
  if (pkt) {
    pkt.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi"
    }).format(now);
  }
}

/* ============================================================
   CALENDARS
============================================================ */
function updateCalendars() {
  const now = new Date();

  const hijri = $("#cal-hijri span");
  if (hijri) {
    try {
      hijri.textContent = new Intl.DateTimeFormat("en-GB-u-ca-islamic", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(now);
    } catch {
      hijri.textContent = "Hijri calendar";
    }
  }

  const hindi = $("#cal-hindi span");
  if (hindi) {
    try {
      hindi.textContent = new Intl.DateTimeFormat("en-IN-u-ca-indian", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(now);
    } catch {
      hindi.textContent = "Indian calendar";
    }
  }
}

/* ============================================================
   WEATHER BAR
============================================================ */
async function loadWeather() {
  const bar = $("#weather-bar");
  if (!bar) return;

  const cities = [
    ["Zurich", 47.37, 8.54],
    ["Rawalakot", 33.85, 73.75],
    ["Jammu", 32.73, 74.86],
    ["Kashmir", 34.08, 74.79],
    ["Ladakh", 34.15, 77.57],
    ["Gilgit", 35.92, 74.3],
    ["Baltistan", 35.28, 75.63],
    ["Muzaffarabad", 34.37, 73.47]
  ];

  bar.innerHTML = "";

  for (const [name, lat, lon] of cities) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = data?.current_weather?.temperature;
      if (typeof temp === "number") {
        const chip = document.createElement("div");
        chip.className = "chip tiny";
        chip.textContent = `${name}: ${temp}°C`;
        bar.appendChild(chip);
      }
    } catch (err) {
      console.warn("Weather error", name, err);
    }
  }
}

/* ============================================================
   TICKER
============================================================ */
async function loadTicker() {
  const list = $("#ticker-items");
  if (!list) return;

  const index = await safeJSON("content/index.json");
  const items = index.ticker || [];

  list.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Breaking updates will appear here.";
    list.appendChild(li);
    return;
  }

  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

/* ============================================================
   HOMEPAGE CONTENT
============================================================ */
async function loadHomepage() {
  if (!$("#top-stories")) return;

  const index = await safeJSON("content/index.json");
  if (!index || !index.homepage) return;

  const articles = await safeJSON("content/articles.json");
  const editorial = await safeJSON("content/editorial.json");
  const blog = await safeJSON("content/blog.json");
  const breaking = await safeJSON("content/breaking.json");
  const international = await safeJSON("content/international.json");
  const hr = await safeJSON("content/humanrights.json");
  const jk = await safeJSON("content/jk.json");
  const historical = await safeJSON("content/historical.json");
  const latest001 = await safeJSON("content/latest-001.json");

  const all = [
    ...(articles.items || []),
    ...(editorial.items || []),
    ...(blog.items || []),
    ...(breaking.items || []),
    ...(international.items || []),
    ...(hr.items || []),
    ...(jk.items || []),
    ...(historical.items || []),
    ...(latest001.items || [])
  ];

  const find = id => all.find(a => a.id === id);

  const ts = index.homepage.topStories;
  fillCard(find(ts.lead), "#lead-media", "#lead-body");
  fillCard(find(ts.breaking), "#breaking-media", "#breaking-body");
  fillCard(find(ts.opinion), "#opinion-media", "#opinion-body");

  const leh = index.homepage.latestEditorialHistorical;
  fillCard(find(leh.latest), "#leh1-media", "#leh1-body");
  fillCard(find(leh.editorial), "#leh2-media", "#leh2-body");
  fillCard(find(leh.historical), "#leh3-media", "#leh3-body");

  fillCard(find(index.homepage.jammuKashmir?.[0]), "#jk1-media", "#jk1-body");
  fillCard(find(index.homepage.jammuKashmir?.[1]), "#jk2-media", "#jk2-body");

  fillCard(find(index.homepage.international?.[0]), "#intl1-media", "#intl1-body");
  fillCard(find(index.homepage.international?.[1]), "#intl2-media", "#intl2-body");

  fillCard(find(index.homepage.humanRights?.[0]), "#hr1-media", "#hr1-body");
  fillCard(find(index.homepage.humanRights?.[1]), "#hr2-media", "#hr2-body");
}

/* ============================================================
   CARD RENDERER
============================================================ */
function getArticleUrl(item) {
  if (!item || !item.id) return "#";

  const id = item.id;

  if (id.startsWith("article-")) return `article.html?id=${id}`;
  if (id.startsWith("breaking-")) return `breaking.html?id=${id}`;
  if (id.startsWith("blog-")) return `blog.html?id=${id}`;
  if (id.startsWith("editorial-")) return `editorial.html?id=${id}`;
  if (id.startsWith("latest-")) return `latest-001.html?id=${id}`;
  if (id.startsWith("chief-")) return `chief-editor.html?id=${id}`;

  return `article.html?id=${id}`;
}

function fillCard(item, mediaSel, bodySel) {
  const media = $(mediaSel);
  const body = $(bodySel);
  if (!media || !body) return;

  if (!item) {
    body.innerHTML = "<h3>Coming Soon</h3><p>Content will be added shortly.</p>";
    media.classList.add("placeholder");
    return;
  }

  if (item.heroImage && item.heroImage.src) {
    media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.heroImage.caption || item.title || ""}">`;
    media.classList.remove("placeholder");
  } else {
    media.classList.add("placeholder");
  }

  body.innerHTML = `
    <h3>${item.title || ""}</h3>
    <p>${item.excerpt || ""}</p>
    <a class="read-more" href="${getArticleUrl(item)}">Read More →</a>
  `;
}

/* ============================================================
   NAVIGATION + MOBILE MENU
============================================================ */
function setupNav() {
  const hamburger = $("#hamburger");
  const navList = $("#nav-list");
  const mobileMenu = $("#mobile-menu");

  if (!hamburger || !navList || !mobileMenu) return;

  mobileMenu.innerHTML = "";
  const clone = navList.cloneNode(true);
  clone.id = "nav-list-mobile";
  mobileMenu.appendChild(clone);

  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });

  $$("#nav-list-mobile .has-sub > button").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const parent = btn.parentElement;
      const dd = parent.querySelector(".dropdown");
      if (!dd) return;
      dd.style.display = dd.style.display === "flex" ? "none" : "flex";
    });
  });
}

/* ============================================================
   CONTACT MODAL
============================================================ */
function setupContactModal() {
  const openBtn = $("#contact-open");
  const closeBtn = $("#contact-close");
  const modal = $("#contact-modal");

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

/* ============================================================
   ARTICLE PAGES (ID‑BASED ROUTING)
============================================================ */
function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function initArticlePage() {
  const id = getQueryId();
  if (!id) return;

  let jsonPath = null;
  let mode = "list";

  if (id.startsWith("article-")) jsonPath = "content/articles.json";
  else if (id.startsWith("breaking-")) jsonPath = "content/breaking.json";
  else if (id.startsWith("blog-")) jsonPath = "content/blog.json";
  else if (id.startsWith("editorial-")) jsonPath = "content/editorial.json";
  else if (id.startsWith("latest-")) jsonPath = "content/latest-001.json";
  else if (id.startsWith("chief-")) {
    jsonPath = "content/chief-editor.json";
    mode = "single";
  } else {
    return;
  }

  const data = await safeJSON(jsonPath);
  let item = null;

  if (mode === "list") {
    const items = data.items || [];
    item = items.find(a => a.id === id) || items[0];
  } else {
    item = data;
  }

  if (!item) return;

  renderArticleItem(item);
  initArticleActions();
}

/* ============================================================
   ARTICLE RENDERER
============================================================ */
function renderArticleItem(item) {
  const sectionLabel = $("#section-label");
  const titleEl = $("#title");
  const metaEl = $("#meta");
  const heroImg = $("#heroImg");
  const heroCaption = $("#heroCaption");
  const content = $("#content");

  if (titleEl) titleEl.textContent = item.title || "Untitled";

  if (sectionLabel && item.category) {
    sectionLabel.textContent = item.category;
  }

  if (metaEl) {
    const dateObj = item.date ? new Date(item.date) : null;
    const formattedDate =
      dateObj && !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        : item.date || "";

    metaEl.innerHTML = `
      ${item.location ? `${item.location} · ` : ""}
      ${formattedDate ? `${formattedDate} · ` : ""}
      ${item.readTime ? `${item.readTime} · ` : ""}
      ${item.author || ""}
    `;
  }

  if (heroImg && item.heroImage && item.heroImage.src) {
    heroImg.src = item.heroImage.src;
    heroImg.alt = item.heroImage.caption || item.title || "";
  }

  if (heroCaption && item.heroImage && (item.heroImage.caption || item.heroImage.credit)) {
    heroCaption.innerHTML = `
      ${item.heroImage.caption || ""}${
      item.heroImage.credit ? ` — <em>${item.heroImage.credit}</em>` : ""
    }
    `;
  }

  if (!content) return;

  content.innerHTML = "";

  if (Array.isArray(item.body)) {
    item.body.forEach(block => {
      if (typeof block === "string") {
        content.innerHTML += `<p>${block}</p>`;
        return;
      }

      if (block.type === "paragraph") {
        content.innerHTML += `<p>${block.text}</p>`;
      }

      if (block.type === "header") {
        content.innerHTML += `<h2 style="margin-top:40px;">${block.text}</h2>`;
      }

      if (block.type === "points") {
        const items = (block.items || []).map(i => `<li>${i}</li>`).join("");
        content.innerHTML += `
          <div class="important-points">
            <ul>${items}</ul>
          </div>
        `;
      }

      if (block.type === "image") {
        const align =
          block.align === "right"
            ? "right"
            : block.align === "center"
            ? "center"
            : "left";

        if (align === "center") {
          content.innerHTML += `
            <figure style="text-align:center;margin:20px 0;">
              <img src="${block.src}" alt="${block.caption || ""}" style="max-width:100%;height:auto;">
              ${
                block.caption
                  ? `<figcaption>${block.caption}${
                      block.credit ? ` — <em>${block.credit}</em>` : ""
                    }</figcaption>`
                  : ""
              }
            </figure>
          `;
        } else {
          content.innerHTML += `
            <figure class="image-${align}">
              <img src="${block.src}" alt="${block.caption || ""}">
              ${
                block.caption
                  ? `<figcaption>${block.caption}${
                      block.credit ? ` — <em>${block.credit}</em>` : ""
                    }</figcaption>`
                  : ""
              }
            </figure>
          `;
        }
      }
    });
  }
}

/* ============================================================
   ARTICLE ACTION BUTTONS
============================================================ */
function initArticleActions() {
  const likeBtn = $("#likeBtn");
  const likeCount = $("#likeCount");
  const subscribeBtn = $("#subscribeBtn") || $("#subBtn");
  const shareBtn = $("[data-share]") || $("#shareBtn");
  const copyBtn = $("[data-copy-link]") || $("#copyBtn");

  if (likeBtn && likeCount) {
    let likes = 0;
    likeBtn.addEventListener("click", () => {
      likes += 1;
      likeCount.textContent = likes;
    });
  }

  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", () => {
      subscribeBtn.textContent = "Subscribed";
      subscribeBtn.disabled = true;
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: location.href
        });
      } else {
        alert("Share not supported on this browser.");
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(location.href);
    });
  }
}
