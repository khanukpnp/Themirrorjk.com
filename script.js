/* ================= YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= MOBILE NAV ================= */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.getElementById("nav-list");

if (hamburger && mobileMenu && navList) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "flex";
    if (isOpen) {
      mobileMenu.style.display = "none";
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.innerHTML = "";
    } else {
      mobileMenu.style.display = "flex";
      hamburger.setAttribute("aria-expanded", "true");
      mobileMenu.innerHTML = navList.innerHTML;
    }
  });
}

/* ================= CONTACT MODAL ================= */
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

if (contactBtn && contactModal && closeContact) {
  contactBtn.addEventListener("click", () => {
    contactModal.classList.remove("hidden");
  });

  closeContact.addEventListener("click", () => {
    contactModal.classList.add("hidden");
  });

  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) contactModal.classList.add("hidden");
  });
}

/* ================= CLOCKS & CALENDARS ================= */
function pad2(n) {
  return n.toString().padStart(2, "0");
}

function gregorianToHijri(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4)
    + Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12)
    - Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4)
    + day - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const r = l - 10631 * n;
  const j = Math.floor((r - 1) / 354.36667);
  const hijriYear = 30 * n + j;
  const hijriMonth = Math.floor((r - 29 - Math.floor(j * 354.36667)) / 29.5) + 1;
  const hijriDay = r - Math.floor(j * 354.36667) - Math.floor((hijriMonth - 1) * 29.5);

  return { day: hijriDay, month: hijriMonth, year: hijriYear };
}

function updateClocks() {
  const now = new Date();

  /* Zurich (CEST) */
  const cestEl = document.querySelector("#clock-cest span");
  if (cestEl) {
    cestEl.textContent = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
  }

  /* IST (Jammu-Kashmir-Ladakh) — UTC+4:30 */
  const istEl = document.querySelector("#tz-ist span");
  if (istEl) {
    const ist = new Date(now.getTime() + (4.5 * 60 * 60 * 1000));
    istEl.textContent = `${pad2(ist.getHours())}:${pad2(ist.getMinutes())}:${pad2(ist.getSeconds())}`;
  }

  /* PKT (Gilgit-Baltistan & Azad Kashmir) — UTC+4:00 */
  const pktEl = document.querySelector("#tz-pkt span");
  if (pktEl) {
    const pkt = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    pktEl.textContent = `${pad2(pkt.getHours())}:${pad2(pkt.getMinutes())}:${pad2(pkt.getSeconds())}`;
  }

  /* Hijri */
  const hijriEl = document.querySelector("#cal-hijri span");
  if (hijriEl) {
    const h = gregorianToHijri(now);
    hijriEl.textContent = `${h.day} Ramadan ${h.year}`;
  }

  /* Vikram Samvat */
  const hindiEl = document.querySelector("#cal-hindi span");
  if (hindiEl) {
    const vsYear = now.getFullYear() + 57;
    hindiEl.textContent = `VS ${vsYear}`;
  }
}

setInterval(updateClocks, 1000);
updateClocks();

/* ================= WEATHER ================= */
const weatherBar = document.getElementById("weather-bar");
if (weatherBar) {
  weatherBar.textContent = "";
  const cities = [
    { name: "Zurich", temp: "6.5°C" },
    { name: "Rawalakot", temp: "13.8°C" },
    { name: "Jammu", temp: "16.8°C" },
    { name: "Kashmir", temp: "2.4°C" },
    { name: "Ladakh", temp: "-3.2°C" },
    { name: "Gilgit", temp: "3.0°C" },
    { name: "Baltistan", temp: "3.9°C" },
    { name: "Muzaffarabad", temp: "12.2°C" }
  ];

  cities.forEach(c => {
    const chip = document.createElement("div");
    chip.className = "chip tiny";
    chip.textContent = `${c.name}: ${c.temp}`;
    weatherBar.appendChild(chip);
  });
}

/* ================= UNIVERSAL FETCH HELPER ================= */
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

/* ================= ACTION BAR (LIKE, SUBSCRIBE, SHARE, COPY) ================= */
function injectActionBar(container) {
  const bar = document.createElement("div");
  bar.className = "page-actions";

  bar.innerHTML = `
    <button id="likeBtn">❤️ Like <span id="likeCount">0</span></button>
    <button id="subBtn">🔔 Subscribe</button>
    <button id="shareBtn">📣 Share</button>
    <button id="copyBtn">🔗 Copy Link</button>
  `;

  container.appendChild(bar);

  /* Like */
  let likes = 0;
  document.getElementById("likeBtn").onclick =
    () => document.getElementById("likeCount").textContent = ++likes;

  /* Subscribe */
  document.getElementById("subBtn").onclick = function () {
    this.textContent = "Subscribed";
    this.disabled = true;
  };

  /* Share */
  document.getElementById("shareBtn").onclick = () =>
    navigator.share
      ? navigator.share({ title: document.title, url: location.href })
      : alert("Share not supported");

  /* Copy Link */
  document.getElementById("copyBtn").onclick =
    () => navigator.clipboard.writeText(location.href);
}

/* ================= HOMEPAGE LOADER ================= */
async function loadHomepage() {
  if (!document.querySelector("#top-stories")) return;

  try {
    const [
      breakingData,
      articlesData,
      blogData,
      editorialData,
      historicalData,
      jkData,
      intlData,
      hrData
    ] = await Promise.all([
      fetchJSON("content/breaking.json").catch(() => ({ items: [] })),
      fetchJSON("content/articles.json").catch(() => ({ items: [] })),
      fetchJSON("content/blog.json").catch(() => ({ items: [] })),
      fetchJSON("content/editorial.json").catch(() => ({ items: [] })),
      fetchJSON("content/historical.json").catch(() => ({ items: [] })),
      fetchJSON("content/jammu-kashmir.json").catch(() => ({ items: [] })),
      fetchJSON("content/international.json").catch(() => ({ items: [] })),
      fetchJSON("content/human-rights.json").catch(() => ({ items: [] }))
    ]);

    const breaking = breakingData.items || [];
    const articles = articlesData.items || [];
    const blogs = blogData.items || [];
    const editorial = editorialData.items || [];
    const historical = historicalData.items || [];
    const jk = jkData.items || [];
    const intl = intlData.items || [];
    const hr = hrData.items || [];

    function fillCard(item, mediaSel, bodySel, fallbackTitle, fallbackText, linkType) {
      const media = document.querySelector(mediaSel);
      const body = document.querySelector(bodySel);
      if (!media || !body) return;

      if (!item) {
        body.innerHTML = `
          <h3>${fallbackTitle}</h3>
          <p>${fallbackText}</p>
        `;
        return;
      }

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      const href =
        linkType === "article"
          ? `article.html?id=${item.id}`
          : linkType === "blog"
          ? `blog.html?id=${item.id}`
          : "#";

      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt || ""}</p>
        <a class="read-more" href="${href}">Read More →</a>
      `;
    }

    /* TOP STORIES */
    fillCard(articles[0], "#lead-media", "#lead-body", "Coming Soon", "Lead story will appear here.", "article");
    fillCard(breaking[0], "#breaking-media", "#breaking-body", "Coming Soon", "Breaking news will appear here.", "article");
    fillCard(blogs[0], "#opinion-media", "#opinion-body", "Coming Soon", "Opinion and blog will appear here.", "blog");

    /* LATEST · EDITORIAL · HISTORICAL */
    function fillUnifiedCard(item, mediaSel, bodySel) {
      const media = document.querySelector(mediaSel);
      const body = document.querySelector(bodySel);
      if (!media || !body) return;

      if (!item) {
        body.innerHTML = `
          <h3>Coming Soon</h3>
          <p>Content will be added shortly.</p>
        `;
        return;
      }

      if (item.heroImage?.src) {
        media.innerHTML = `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
        media.classList.remove("placeholder");
      }

      const href = `article.html?id=${item.id}`;
      body.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.excerpt || ""}</p>
        <a class="read-more" href="${href}">Read More →</a>
      `;
    }

    fillUnifiedCard(articles[0], "#leh1-media", "#leh1-body");
    fillUnifiedCard(editorial[0], "#leh2-media", "#leh2-body");
    fillUnifiedCard(historical[0], "#leh3-media", "#leh3-body");

    /* JAMMU KASHMIR */
    fillCard(jk[0], "#jk1-media", "#jk1-body", "Coming Soon", "Reporting from Jammu & Kashmir will appear here.", "article");
    fillCard(jk[1], "#jk2-media", "#jk2-body", "Coming Soon", "Additional coverage will be added.", "article");

    /* INTERNATIONAL */
    fillCard(intl[0], "#intl1-media", "#intl1-body", "Coming Soon", "International coverage will appear here.", "article");
    fillCard(intl[1], "#intl2-media", "#intl2-body", "Coming Soon", "Additional international reports will be added.", "article");

    /* HUMAN RIGHTS */
    fillCard(hr[0], "#hr1-media", "#hr1-body", "Coming Soon", "Human rights documentation will appear here.", "article");
    fillCard(hr[1], "#hr2-media", "#hr2-body", "Coming Soon", "Further human rights reports will be added.", "article");

  } catch (err) {
    console.error("Homepage load error:", err);
  }
}

loadHomepage();

/* ================= ARTICLE PAGE LOADER ================= */
async function loadArticlePage() {
  if (!document.querySelector("body.article-page") || !document.getElementById("content")) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const prefix = id.split("-")[0];
  const map = {
    breaking: "content/breaking.json",
    article: "content/articles.json",
    blog: "content/blog.json",
    editorial: "content/editorial.json",
    historical: "content/historical.json",
    jk: "content/jammu-kashmir.json",
    intl: "content/international.json",
    hr: "content/human-rights.json"
  };

  const path = map[prefix];
  if (!path) return;

  try {
    const data = await fetchJSON(path);
    const items = data.items || [];
    const item = items.find(a => a.id === id);

    if (!item) {
      document.getElementById("title").textContent = "Article not found";
      return;
    }

    /* Page title */
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) pageTitle.textContent = `${item.title} | THE MIRROR JAMMU KASHMIR`;

    /* Section label */
    const sectionLabel = document.getElementById("section-label");
    if (sectionLabel) {
      const labelMap = {
        breaking: "Breaking News",
        article: "Latest Articles",
        blog: "Blog & Opinion",
        editorial: "Editorial",
        historical: "Historical Facts",
        jk: "Jammu Kashmir",
        intl: "International",
        hr: "Human Rights"
      };
      sectionLabel.textContent = labelMap[prefix] || "Article";
    }

    /* Title */
    document.getElementById("title").textContent = item.title;

    /* Meta */
    const metaEl = document.getElementById("meta");
    if (metaEl) {
      const dateObj = item.date ? new Date(item.date) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        : "";

      metaEl.innerHTML = `
        <strong>${item.category || ""}</strong> ·
        ${item.location || ""} ·
        ${formattedDate} ·
        ${item.readTime || ""} ·
        ${item.author || ""}
      `;
    }

    /* Hero */
    const heroWrap = document.getElementById("heroWrap");
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");

    if (item.heroImage?.src && heroImg && heroCaption) {
      heroImg.src = item.heroImage.src;
      heroImg.alt = item.heroImage.caption || item.title;
      const credit = item.heroImage.credit ? ` — <em>${item.heroImage.credit}</em>` : "";
      heroCaption.innerHTML = `${item.heroImage.caption || ""}${credit}`;
    } else if (heroWrap) {
      heroWrap.style.display = "none";
    }

    /* Body */
    const container = document.getElementById("content");
    container.innerHTML = "";

    (item.body || []).forEach(block => {
      if (block.type === "paragraph") {
        const p = document.createElement("p");
        p.textContent = block.text;
        container.appendChild(p);
      }

      if (block.type === "header") {
        const h2 = document.createElement("h2");
        h2.textContent = block.text;
        container.appendChild(h2);
      }

      if (block.type === "points") {
        const wrap = document.createElement("div");
        wrap.className = "important-points";
        const ul = document.createElement("ul");
        (block.items || []).forEach(i => {
          const li = document.createElement("li");
          li.textContent = i;
          ul.appendChild(li);
        });
        wrap.appendChild(ul);
        container.appendChild(wrap);
      }

      if (block.type === "image") {
        const fig = document.createElement("figure");
        const align = block.align === "right" ? "image-right" : "image-left";
        fig.className = align;

        const img = document.createElement("img");
        img.src = block.src;
        img.alt = block.caption || "";

        const cap = document.createElement("figcaption");
        const credit = block.credit ? ` — ${block.credit}` : "";
        cap.textContent = `${block.caption || ""}${credit}`;

        fig.appendChild(img);
        fig.appendChild(cap);
        container.appendChild(fig);
      }
    });

    /* Inject action bar at bottom */
    injectActionBar(container);

  } catch (err) {
    console.error("Article load error:", err);
    document.getElementById("title").textContent = "Error loading content";
  }
}

loadArticlePage();
