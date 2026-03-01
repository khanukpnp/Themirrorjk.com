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

    // IST (Jammu–Kashmir–Ladakh)
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

  // ================= BREAKING NEWS (MIDDLE WINDOW) =================
  async function loadBreaking() {
    const mediaBox = $("#breaking-media");
    const bodyBox = $("#breaking-body");
    if (!mediaBox || !bodyBox) return;

    try {
      const res = await fetch("content/breaking.json", { cache: "no-store" });
      const data = await res.json();
      if (!data.items || data.items.length === 0) return;

      const item = data.items[0];

      // HERO IMAGE
      if (item.heroImage?.src) {
        mediaBox.innerHTML =
          `<img src="${item.heroImage.src}" alt="" style="aspect-ratio:16/9; object-fit:cover;">`;
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

  // ================= ARTICLES (LEAD, BLOG & OPINION, LATEST, ARCHIVE, EDITORIAL) =================
  async function loadArticles() {
    try {
      const res = await fetch("content/articles.json", { cache: "no-store" });
      const data = await res.json();
      if (!data.items) return;

      // sort newest first
      const items = data.items
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (!items.length) return;

      // ----- LEAD ARTICLE (LEFT WINDOW) -----
      const lead = items[0];
      const leadMedia = $("#lead-media");
      const leadBody = $("#lead-body");

      if (leadMedia && leadBody) {
        if (lead.heroImage?.src) {
          leadMedia.innerHTML =
            `<img src="${lead.heroImage.src}" alt="${lead.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
          leadMedia.classList.remove("placeholder");
        }
        leadBody.innerHTML = `
          <h3>${lead.title}</h3>
          <p>${lead.excerpt || ""}</p>
          <a class="read-more" href="article.html?id=${lead.id}">Read More →</a>
        `;
      }

      // ----- BLOG & OPINION (RIGHT WINDOW) -----
      const opinion = items.find(a => {
        const cat = (a.category || a.section || "").toLowerCase();
        return cat.includes("opinion") || cat.includes("blog");
      }) || items[1] || items[0];

      const opMedia = $("#opinion-media");
      const opBody = $("#opinion-body");

      if (opMedia && opBody && opinion) {
        if (opinion.heroImage?.src) {
          opMedia.innerHTML =
            `<img src="${opinion.heroImage.src}" alt="${opinion.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
          opMedia.classList.remove("placeholder");
        }
        opBody.innerHTML = `
          <h3>${opinion.title}</h3>
          <p>${opinion.excerpt || ""}</p>
          <a class="read-more" href="article.html?id=${opinion.id}">Read More →</a>
        `;
      }

      // ----- LATEST ARTICLES SECTION (3 ITEMS BELOW HERO) -----
      const remaining = items.filter(a => a !== lead && a !== opinion);
      const latest = remaining.slice(0, 3);

      const latestSlots = [
        ["#la1-media", "#la1-body"],
        ["#la2-media", "#la2-body"],
        ["#la3-media", "#la3-body"]
      ];

      latest.forEach((item, i) => {
        const [mSel, bSel] = latestSlots[i];
        const media = $(mSel);
        const body = $(bSel);
        if (!media || !body) return;

        if (item.heroImage?.src) {
          media.innerHTML =
            `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
          media.classList.remove("placeholder");
        }
        body.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.excerpt || ""}</p>
          <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
        `;
      });

      // ----- LATEST EDITORIAL / HISTORICAL FACTS / JAMMU KASHMIR -----
      const editorial = remaining.filter(a => {
        const sec = (a.section || a.category || "").toLowerCase();
        return sec.includes("editorial");
      })[0] || remaining[3];

      const historical = remaining.filter(a => {
        const sec = (a.section || a.category || "").toLowerCase();
        return sec.includes("history") || sec.includes("historical");
      })[0] || remaining[4];

      const jk = remaining.filter(a => {
        const sec = (a.section || a.category || "").toLowerCase();
        return sec.includes("jammu") || sec.includes("kashmir");
      })[0] || remaining[5];

      const edSlots = [
        { mediaSel: "#ed1-media", bodySel: "#ed1-body", item: editorial },
        { mediaSel: "#hf1-media", bodySel: "#hf1-body", item: historical },
        { mediaSel: "#jk1-media", bodySel: "#jk1-body", item: jk }
      ];

      edSlots.forEach(slot => {
        const { mediaSel, bodySel, item } = slot;
        if (!item) return;
        const media = $(mediaSel);
        const body = $(bodySel);
        if (!media || !body) return;

        if (item.heroImage?.src) {
          media.innerHTML =
            `<img src="${item.heroImage.src}" alt="${item.title}" style="aspect-ratio:16/9;object-fit:cover;">`;
          media.classList.remove("placeholder");
        }
        body.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.excerpt || ""}</p>
          <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
        `;
      });

      // ----- ARCHIVE (ALL REMAINING OLD CONTENT) -----
      const usedIds = new Set(
        [lead, opinion, ...latest, editorial, historical, jk]
          .filter(Boolean)
          .map(a => a.id)
      );

      const archiveItems = items.filter(a => !usedIds.has(a.id));

      const archiveList = $("#archive-list");
      if (archiveList) {
        archiveList.innerHTML = "";
        archiveItems.forEach(a => {
          const thumbSrc = a.heroImage?.src || "assets/placeholder.jpg";
          const excerpt = a.excerpt || "";
          archiveList.innerHTML += `
            <article class="archive-item">
              <div class="thumb">
                <img src="${thumbSrc}" alt="${a.title}">
              </div>
              <div class="info">
                <h4>${a.title}</h4>
                <p>${excerpt}</p>
                <a href="article.html?id=${a.id}">Read More →</a>
              </div>
            </article>
          `;
        });
      }

      applyImageFallback();
    } catch (err) {
      console.warn("Articles load failed:", err);
    }
  }
  loadArticles();

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

  // ================= ARTICLE PAGE LOADER =================
  if (location.pathname.includes("article.html")) {
    loadArticlePage();
  }

  async function loadArticlePage() {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) return;

    try {
      const res = await fetch("content/articles.json", { cache: "no-store" });
      const data = await res.json();
      const article = data.items?.find(x => x.id === id);
      if (!article) return;

      const titleEl = $("#title");
      const metaEl = $("#meta");
      const heroWrap = $("#heroWrap");
      const heroImg = $("#heroImg");
      const content = $("#content");

      if (titleEl) titleEl.textContent = article.title || "";

      // meta: News area time + Special Correspondent / Desk
      if (metaEl) {
        const dateStr = article.date ? new Date(article.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }) : "";

        const timeStr = article.time || "";
        const locationStr = article.location || "";
        const roleStr = article.authorRole || "";
        const deskStr = article.desk || "";

        let line1 = [];
        if (locationStr) line1.push(locationStr);
        if (dateStr) line1.push(dateStr);
        if (timeStr) line1.push(timeStr);

        let line2 = [];
        if (roleStr) line2.push(roleStr);
        if (deskStr) line2.push(deskStr);

        metaEl.innerHTML = `
          <div><strong>News:</strong> ${line1.join(" · ")}</div>
          ${line2.length ? `<div>${line2.join(" · ")}</div>` : ""}
        `;
      }

      // hero image = first image in body or article.heroImage
      let heroSrc = article.heroImage?.src || "";
      let heroCaption = article.heroImage?.caption || "";
      let remainingBlocks = article.body || [];

      if (!heroSrc && remainingBlocks && remainingBlocks.length) {
        const firstImgIndex = remainingBlocks.findIndex(b => b
