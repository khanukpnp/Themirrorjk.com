/* ============================================================
   GLOBAL UTILITIES
============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* Image fallback */
function applyImageFallback(ctx = document) {
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='36' fill='%23999'%3EImage Placeholder%3C/text%3E%3C/svg%3E";

  $$("img", ctx).forEach(img => {
    img.onerror = () => {
      img.src = placeholder;
    };
  });
}

/* ============================================================
   ON PAGE LOAD
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateTimes();
  setInterval(updateTimes, 1000);

  loadWeather();
  loadHomepageBreaking();
  loadHomepageArticles();

  duplicateTicker();
  setupNavigation();
  setupMobileMenu();
  setupContactModal();

  if (location.pathname.includes("article.html")) {
    loadUniversalArticle();
  }
});

/* ============================================================
   CLOCKS & CALENDARS
============================================================ */

function updateTimes() {
  const now = new Date();

  const setTime = (selector, options) => {
    const el = $(selector);
    if (!el) return;
    try {
      el.textContent = new Intl.DateTimeFormat("en-GB", options).format(now);
    } catch {
      el.textContent = now.toLocaleString("en-GB");
    }
  };

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

  setTime("#tz-ist span", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });

  setTime("#tz-pkt span", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Karachi"
  });

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
      hijriEl.textContent = now.toLocaleDateString("en-GB");
    }
  }

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
      hindiEl.textContent = now.toLocaleDateString("en-GB");
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

/* ============================================================
   HOMEPAGE — BREAKING NEWS
============================================================ */

async function loadHomepageBreaking() {
  const mediaBox = $("#breaking-media");
  const bodyBox = $("#breaking-body");
  if (!mediaBox || !bodyBox) return;

  try {
    const res = await fetch("content/breaking.json", { cache: "no-store" });
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return;

    if (item.heroImage?.src) {
      mediaBox.innerHTML = `<img src="${item.heroImage.src}" alt="" style="aspect-ratio:16/9;object-fit:cover;">`;
      mediaBox.classList.remove("placeholder");
    }

    bodyBox.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
    `;

    applyImageFallback(mediaBox);
  } catch (err) {
    console.warn("Breaking load failed:", err);
  }
}

/* ============================================================
   HOMEPAGE — ARTICLES + ALL OTHER DESKS
============================================================ */

async function loadHomepageArticles() {
  try {
    const desks = [
      { file: "articles.json", key: "articles" },
      { file: "blog.json", key: "blog" },
      { file: "editorial.json", key: "editorial" },
      { file: "historical.json", key: "historical" },
      { file: "jammu-kashmir.json", key: "jk" },
      { file: "international.json", key: "intl" },
      { file: "human-rights.json", key: "hr" }
    ];

    const deskData = {};

    for (const d of desks) {
      const res = await fetch(`content/${d.file}`, { cache: "no-store" });
      deskData[d.key] = (await res.json()).items || [];
    }

    const articles = deskData.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    const blog = deskData.blog.sort((a, b) => new Date(b.date) - new Date(a.date));
    const editorial = deskData.editorial.sort((a, b) => new Date(b.date) - new Date(a.date));
    const historical = deskData.historical.sort((a, b) => new Date(b.date) - new Date(a.date));
    const jk = deskData.jk.sort((a, b) => new Date(b.date) - new Date(a.date));
    const intl = deskData.intl.sort((a, b) => new Date(b.date) - new Date(a.date));
    const hr = deskData.hr.sort((a, b) => new Date(b.date) - new Date(a.date));

    /* Lead Article */
    const lead = articles[0];
    if (lead) {
      const media = $("#lead-media");
      const body = $("#lead-body");
      if (lead.heroImage?.src) {
        media.innerHTML = `<img src="${lead.heroImage.src}" alt="${lead.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }
      body.innerHTML = `
        <h3>${lead.title}</h3>
        <p>${lead.excerpt}</p>
        <a class="read-more" href="article.html?id=${lead.id}">Read More →</a>
      `;
    }

    /* Blog & Opinion */
    const op = blog[0];
    if (op) {
      const media = $("#opinion-media");
      const body = $("#opinion-body");
      if (op.heroImage?.src) {
        media.innerHTML = `<img src="${op.heroImage.src}" alt="${op.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }
      body.innerHTML = `
        <h3>${op.title}</h3>
        <p>${op.excerpt}</p>
        <a class="read-more" href="article.html?id=${op.id}">Read More →</a>
      `;
    }

    /* Latest Articles (3) */
    const latest = articles.slice(1, 4);
    const slots = [
      ["#la1-media", "#la1-body"],
      ["#la2-media", "#la2-body"],
      ["#la3-media", "#la3-body"]
    ];

    latest.forEach((item, i) => {
      const [mSel, bSel] = slots[i];
      const media = $(mSel);
      const body = $(bSel);
      if (!media || !body) return;

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
      `;
    });

    /* Editorial / Historical / JK */
    const edSlots = [
      { item: editorial[0], mediaSel: "#ed1-media", bodySel: "#ed1-body" },
      { item: historical[0], mediaSel: "#hf1-media", bodySel: "#hf1-body" },
      { item: jk[0], mediaSel: "#jk1-media", bodySel: "#jk1-body" }
    ];

    edSlots.forEach(({ item, mediaSel, bodySel }) => {
      if (!item) return;
      const media = $(mediaSel);
      const body = $(bodySel);

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
      `;
    });

    /* International (2) */
    const intlSlots = [
      ["#international .cards.two article:nth-child(1) .media", "#international .cards.two article:nth-child(1) .card-body"],
      ["#international .cards.two article:nth-child(2) .media", "#international .cards.two article:nth-child(2) .card-body"]
    ];

    intl.slice(0, 2).forEach((item, i) => {
      const [mSel, bSel] = intlSlots[i];
      const media = $(mSel);
      const body = $(bSel);

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
      `;
    });

    /* Human Rights (2) */
    const hrSlots = [
      ["#human-rights .cards.two article:nth-child(1) .media", "#human-rights .cards.two article:nth-child(1) .card-body"],
      ["#human-rights .cards.two article:nth-child(2) .media", "#human-rights .cards.two article:nth-child(2) .card-body"]
    ];

    hr.slice(0, 2).forEach((item, i) => {
      const [mSel, bSel] = hrSlots[i];
      const media = $(mSel);
      const body = $(bSel);

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
      `;
    });

    /* Archive */
    const archiveList = $("#archive-list");
    if (archiveList) {
      archiveList.innerHTML = "";

      const all = [
        ...articles,
        ...blog,
        ...editorial,
        ...historical,
        ...jk,
        ...intl,
        ...hr
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      all.slice(10).forEach(a => {
        const thumb = a.heroImage?.src || "assets/placeholder.jpg";
        archiveList.innerHTML += `
          <article class="archive-item">
            <div class="thumb"><img src="${thumb}" alt="${a.title}"></div>
            <div class="info">
              <h4>${a.title}</h4>
              <p>${a.excerpt}</p>
              <a href="article.html?id=${a.id}">Read More →</a>
            </div>
          </article>
        `;
      });
    }

    applyImageFallback();
  } catch (err) {
    console.warn("Homepage articles failed:", err);
  }
}

/* ============================================================
   UNIVERSAL ARTICLE LOADER
============================================================ */

async function loadUniversalArticle() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  const prefixMap = {
    "breaking-": "breaking.json",
    "article-": "articles.json",
    "blog-": "blog.json",
    "editorial-": "editorial.json",
    "historical-": "historical.json",
    "jk-": "jammu-kashmir.json",
    "intl-": "international.json",
    "hr-": "human-rights.json"
  };

  const sectionLabels = {
    "breaking-": "Breaking News",
    "article-": "News Report",
    "blog-": "Blog & Opinion",
    "editorial-": "Editorial",
    "historical-": "Historical Facts",
    "jk-": "Jammu Kashmir",
    "intl-": "International",
    "hr-": "Human Rights"
  };

  let file = null;
  let label = "News Report";

  for (const p in prefixMap) {
    if (id.startsWith(p)) {
      file = prefixMap[p];
      label = sectionLabels[p];
      break;
    }
  }

  if (!file) return;

  try {
    const res = await fetch(`content/${file}`, { cache: "no-store" });
    const data = await res.json();
    const article = data.items?.find(x => x.id === id);
    if (!article) return;

    $("#section-label").textContent = label;
    $("#title").textContent = article.title || "";
    $("#page-title").textContent = `${article.title} | THE MIRROR JAMMU KASHMIR`;

    const dateStr = article.date
      ? new Date(article.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "";

    const timeStr = article.time || "";
    const locationStr = article.location || "";
    const roleStr = article.authorRole || "";
    const deskStr = article.desk || "";

    const metaEl = $("#meta");
    metaEl.innerHTML = `
      <div><strong>News:</strong> ${locationStr} · ${dateStr}${timeStr ? " · " + timeStr : ""}</div>
      ${roleStr || deskStr ? `<div>${roleStr}${deskStr ? " · " + deskStr : ""}</div>` : ""}
    `;

    /* HERO IMAGE */
