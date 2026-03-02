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

/* ============================================================
   LIVE CLOCKS + LIVE WEATHER + CORRECT HIJRI DATE
============================================================ */

const OPENWEATHER_KEY = "YOUR_OPENWEATHER_API_KEY";

/* ---------------- LIVE CLOCKS ---------------- */
function updateClocks() {
  // Zurich
  const cestEl = document.querySelector("#clock-cest span");
  if (cestEl) {
    const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
    cestEl.textContent = `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
  }

  // IST
  const istEl = document.querySelector("#tz-ist span");
  if (istEl) {
    const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    istEl.textContent = `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
  }

  // PKT
  const pktEl = document.querySelector("#tz-pkt span");
  if (pktEl) {
    const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
    pktEl.textContent = `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
  }
}

setInterval(updateClocks, 1000);
updateClocks();

/* ---------------- HIJRI DATE ---------------- */
async function updateHijri() {
  const hijriEl = document.querySelector("#cal-hijri span");
  if (!hijriEl) return;

  try {
    const today = new Date();
    const gDate = today.toISOString().split("T")[0];
    const res = await fetch(`https://api.aladhan.com/v1/gToH/${gDate}`);
    const data = await res.json();
    const h = data.data.hijri;
    hijriEl.textContent = `${h.day} ${h.month.en} ${h.year}`;
  } catch (err) {
    console.error("Hijri error:", err);
  }
}

updateHijri();
setInterval(updateHijri, 3600000);

/* ---------------- VIKRAM SAMVAT ---------------- */
function updateVikramSamvat() {
  const hindiEl = document.querySelector("#cal-hindi span");
  if (!hindiEl) return;
  const now = new Date();
  hindiEl.textContent = `VS ${now.getFullYear() + 57}`;
}
updateVikramSamvat();

/* ---------------- LIVE WEATHER ---------------- */
async function updateWeather() {
  const weatherBar = document.getElementById("weather-bar");
  if (!weatherBar) return;

  weatherBar.innerHTML = "";

  const cities = [
    { name: "Zurich", id: 2657896 },
    { name: "Rawalakot", id: 1166993 },
    { name: "Jammu", id: 1269321 },
    { name: "Kashmir", id: 1255634 },
    { name: "Ladakh", id: 1264976 },
    { name: "Gilgit", id: 1178337 },
    { name: "Baltistan", id: 1180289 },
    { name: "Muzaffarabad", id: 1176615 }
  ];

  for (const c of cities) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${c.id}&appid=${OPENWEATHER_KEY}&units=metric`
      );
      const data = await res.json();

      const chip = document.createElement("div");
      chip.className = "chip tiny";
      chip.textContent = `${c.name}: ${Math.round(data.main.temp)}°C | ${data.weather[0].main}`;
      weatherBar.appendChild(chip);
    } catch (err) {
      console.error("Weather error:", c.name, err);
    }
  }
}

updateWeather();
setInterval(updateWeather, 600000);

/* ================= UNIVERSAL FETCH HELPER ================= */
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

/* ================= HOMEPAGE LOADERS ================= */
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
        body.innerHTML = `<h3>${fallbackTitle}</h3><p>${fallbackText}</p>`;
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

    fillCard(articles[0], "#lead-media", "#lead-body", "Coming Soon", "Lead story will appear here.", "article");
    fillCard(breaking[0], "#breaking-media", "#breaking-body", "Coming Soon", "Breaking news will appear here.", "article");
    fillCard(blogs[0], "#opinion-media", "#opinion-body", "Coming Soon", "Opinion and blog will appear here.", "blog");

    function fillUnifiedCard(item, mediaSel, bodySel) {
      const media = document.querySelector(mediaSel);
      const body = document.querySelector(bodySel);
      if (!media || !body) return;

      if (!item) {
        body.innerHTML = `<h3>Coming Soon</h3><p>Content will be added shortly.</p>`;
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

    fillCard(jk[0], "#jk1-media", "#jk1-body", "Coming Soon", "Reporting from Jammu & Kashmir will appear here.", "article");
    fillCard(jk[1], "#jk2-media", "#jk2-body", "Coming Soon", "Additional coverage will be added.", "article");

    fillCard(intl[0], "#intl1-media", "#intl1-body", "Coming Soon", "International coverage will appear here.", "article");
    fillCard(intl[1], "#intl2-media", "#intl2-body", "Coming Soon", "Additional international reports will be added.", "article");

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

    const pageTitle = document.getElementById("page-title");
    if (pageTitle) pageTitle.textContent = `${item.title} | THE MIRROR JAMMU KASHMIR`;

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

    document.getElementById("title").textContent = item.title;

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

    const container = document.getElementById("content");
    container.innerHTML = "";

    (item.body || []).forEach(block => {
      if (block.type === "paragraph") {
        const p = document.createElement("p");
        p.textContent = block.text;
        container.appendChild(p);
      }

      if (block.type === "header") {
        const h2 = document.createElement("h2");  // FIXED
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

  } catch (err) {
    console.error("Article load error:", err);
    document.getElementById("title").textContent = "Error loading content";
  }
}

loadArticlePage();
