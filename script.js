// script.js
// THE MIRROR JAMMU KASHMIR – unified frontend
// - Clocks (CEST, IST, PKT)
// - Hijri & Hindi (Vikram Samvat-style) calendars
// - Weather bar via Open-Meteo
// - Breaking ticker (scrolling via CSS)
// - Homepage content loader (Top Stories, Latest/Editorial/Historical)
// - Vlog 3-window layout on homepage
// - Article renderer (hero + inline images 35–40% left/right)
// - Action buttons, contact modal, loader, footer year

(function () {
  "use strict";

  const CONTENT_BASE = "content/";

  // ------------------------------------------------------------
  // Generic helpers
  // ------------------------------------------------------------
  function fetchJSON(path) {
    return fetch(path, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load " + path);
        return res.json();
      })
      .catch((err) => {
        console.error("JSON load error:", path, err);
        return null;
      });
  }

  function normalizeItems(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function clearEl(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  // ------------------------------------------------------------
  // CLOCKS & CALENDARS
  // ------------------------------------------------------------
  function formatTimeInZone(timeZone) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
      }).format(new Date());
    } catch {
      return "—:—:—";
    }
  }

  function formatHijri() {
    try {
      return new Intl.DateTimeFormat("en-GB-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return "Hijri date";
    }
  }

  function formatHindi() {
    // Approximate Vikram Samvat-style using Indian calendar if available
    try {
      return new Intl.DateTimeFormat("en-IN-u-ca-indian", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return "VS date";
    }
  }

  function initClocksCalendars() {
    const cestEl = document.querySelector("#clock-cest span");
    const hijriEl = document.querySelector("#cal-hijri span");
    const hindiEl = document.querySelector("#cal-hindi span");
    const istEl = document.querySelector("#tz-ist span");
    const pktEl = document.querySelector("#tz-pkt span");

    if (!cestEl && !hijriEl && !hindiEl && !istEl && !pktEl) return;

    function update() {
      const now = new Date();
      if (cestEl) {
        const dateStr = now.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const timeStr = formatTimeInZone("Europe/Zurich");
        cestEl.textContent = `${dateStr} at ${timeStr}`;
      }
      if (hijriEl) hijriEl.textContent = formatHijri();
      if (hindiEl) hindiEl.textContent = formatHindi();
      if (istEl) istEl.textContent = formatTimeInZone("Asia/Kolkata");
      if (pktEl) pktEl.textContent = formatTimeInZone("Asia/Karachi");
    }

    update();
    setInterval(update, 1000);
  }

  // ------------------------------------------------------------
  // WEATHER BAR (Open-Meteo)
  // ------------------------------------------------------------
  const WEATHER_CITIES = [
    { name: "Zurich", lat: 47.3769, lon: 8.5417 },
    { name: "Rawalakot", lat: 33.8570, lon: 73.7640 },
    { name: "Jammu", lat: 32.7266, lon: 74.8570 },
    { name: "Kashmir", lat: 34.0837, lon: 74.7973 }, // Srinagar
    { name: "Ladakh", lat: 34.1526, lon: 77.5771 }, // Leh
    { name: "Gilgit", lat: 35.9208, lon: 74.3089 },
    { name: "Baltistan", lat: 35.2976, lon: 75.6333 }, // Skardu
    { name: "Muzaffarabad", lat: 34.3700, lon: 73.4710 },
  ];

  function initWeather() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;

    clearEl(bar);

    WEATHER_CITIES.forEach((city) => {
      const chip = createEl("div", "chip tiny", `${city.name}: …°C`);
      bar.appendChild(chip);

      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        city.lat +
        "&longitude=" +
        city.lon +
        "&current_weather=true";

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.current_weather && typeof data.current_weather.temperature === "number") {
            chip.textContent = `${city.name}: ${data.current_weather.temperature.toFixed(
              1
            )}°C`;
          }
        })
        .catch(() => {
          chip.textContent = `${city.name}: —°C`;
        });
    });
  }

  // ------------------------------------------------------------
  // BREAKING TICKER
  // ------------------------------------------------------------
  function initTicker() {
    const list = document.getElementById("ticker-items");
    if (!list) return;

    fetchJSON(CONTENT_BASE + "breaking.json").then((data) => {
      const items = normalizeItems(data);
      clearEl(list);

      if (!items.length) {
        const li = createEl("li", null, "No breaking news at the moment.");
        list.appendChild(li);
        return;
      }

      items.forEach((item) => {
        const li = createEl(
          "li",
          null,
          item.title || item.excerpt || "Breaking update"
        );
        list.appendChild(li);
      });
      // CSS animation on .ticker ul handles scrolling
    });
  }

  // ------------------------------------------------------------
  // HOMEPAGE CONTENT LOADER
  // ------------------------------------------------------------
  const HOMEPAGE_SOURCES = {
    lead: CONTENT_BASE + "articles.json",
    breaking: CONTENT_BASE + "breaking.json",
    opinion: CONTENT_BASE + "blog.json",
    latestLeft: CONTENT_BASE + "latest-001.json",
    editorialMiddle: CONTENT_BASE + "editorial.json",
    historicalRight: CONTENT_BASE + "latest-002.json", // ensure this exists
  };

  function resolveHeroImage(item) {
    if (!item) return null;
    if (item.heroImage && typeof item.heroImage === "object") {
      return {
        src: item.heroImage.src || "",
        caption: item.heroImage.caption || "",
        credit: item.heroImage.credit || "",
      };
    }
    if (typeof item.heroImage === "string") {
      return { src: item.heroImage, caption: "", credit: "" };
    }
    if (item.image) return { src: item.image, caption: "", credit: "" };
    if (item.thumbnail) return { src: item.thumbnail, caption: "", credit: "" };
    return null;
  }

  function pickTopItem(items) {
    if (!items || !items.length) return null;
    return items[0];
  }

  function fillCard(mediaId, bodyId, item, fallbackTitle, fallbackText, defaultHref) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);
    if (!mediaEl || !bodyEl) return;

    clearEl(mediaEl);
    clearEl(bodyEl);

    const hero = resolveHeroImage(item);

    if (hero && hero.src) {
      const img = createEl("img");
      img.src = hero.src;
      img.alt = item && item.title ? item.title : fallbackTitle || "";
      mediaEl.classList.remove("placeholder", "maroon");
      mediaEl.appendChild(img);
    } else {
      mediaEl.textContent = fallbackTitle || "Coming Soon";
    }

    const title = createEl(
      "h3",
      null,
      item && item.title ? item.title : fallbackTitle || "Coming Soon"
    );
    const p = createEl(
      "p",
      null,
      item && item.excerpt
        ? item.excerpt
        : fallbackText || "Content will be added shortly."
    );

    bodyEl.appendChild(title);
    bodyEl.appendChild(p);

    const hrefBase = defaultHref || "editorial.html";
    if (item && item.id) {
      const link = createEl("a", null, "Read More →");
      link.href = hrefBase + "?id=" + encodeURIComponent(item.id);
      link.style.display = "inline-block";
      link.style.marginTop = "6px";
      bodyEl.appendChild(link);
    }
  }

  function initHomepage() {
    const topStoriesSection = document.getElementById("top-stories");
    if (!topStoriesSection) return;

    // Lead
    fetchJSON(HOMEPAGE_SOURCES.lead).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "lead-media",
        "lead-body",
        item,
        "Lead Story",
        "Lead story will appear here.",
        "article.html"
      );
    });

    // Breaking
    fetchJSON(HOMEPAGE_SOURCES.breaking).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "breaking-media",
        "breaking-body",
        item,
        "Breaking News",
        "Breaking news will appear here.",
        "breaking.html"
      );
    });

    // Opinion
    fetchJSON(HOMEPAGE_SOURCES.opinion).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "opinion-media",
        "opinion-body",
        item,
        "Opinion",
        "Opinion and blog will appear here.",
        "blog.html"
      );
    });

    // Latest (left)
    fetchJSON(HOMEPAGE_SOURCES.latestLeft).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "leh1-media",
        "leh1-body",
        item,
        "Latest",
        "Latest content will be added shortly.",
        "latest.html"
      );
    });

    // Editorial (middle)
    fetchJSON(HOMEPAGE_SOURCES.editorialMiddle).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "leh2-media",
        "leh2-body",
        item,
        "Editorial",
        "Editorial content will be added shortly.",
        "editorial.html"
      );
    });

    // Historical (right)
    fetchJSON(HOMEPAGE_SOURCES.historicalRight).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "leh3-media",
        "leh3-body",
        item,
        "Historical",
        "Historical content will be added shortly.",
        "historical.html"
      );
    });
  }

  // ------------------------------------------------------------
  // VLOG – HOMEPAGE 3-WINDOW LAYOUT
  // ------------------------------------------------------------
  const VLOG_CONFIG = {
    mainJson: CONTENT_BASE + "youtube.json",
    mainGridId: "vlogs-grid", // matches index.html
  };

  function buildYouTubeThumb(video) {
    if (video.thumbnail && video.thumbnail.startsWith("http")) return video.thumbnail;
    if (video.videoId) {
      return "https://img.youtube.com/vi/" + video.videoId + "/hqdefault.jpg";
    }
    return "";
  }

  function renderVlogMain(videos) {
    const container = document.getElementById(VLOG_CONFIG.mainGridId);
    if (!container) return;
    clearEl(container);

    const topThree = (videos || []).slice(0, 3);

    topThree.forEach((video) => {
      const card = createEl("article", "card");
      const media = createEl("div", "media");
      const thumb = buildYouTubeThumb(video);

      if (thumb) {
        const img = createEl("img");
        img.src = thumb;
        img.alt = video.title || "Video";
        media.appendChild(img);
      } else {
        media.textContent = "Video";
      }

      const body = createEl("div", "card-body");
      const title = createEl("h3", null, video.title || "Untitled video");
      const p = createEl(
        "p",
        null,
        video.excerpt || video.description || "Video report."
      );

      body.appendChild(title);
      body.appendChild(p);

      const btn = createEl("button", "btn-red", "Play");
      btn.addEventListener("click", () => {
        if (video.url) {
          window.open(video.url, "_blank", "noopener");
        } else if (video.videoId) {
          window.open(
            "https://www.youtube.com/watch?v=" + video.videoId,
            "_blank",
            "noopener"
          );
        }
      });
      body.appendChild(btn);

      card.appendChild(media);
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  function initVlogHomepage() {
    const container = document.getElementById(VLOG_CONFIG.mainGridId);
    if (!container) return;
    fetchJSON(VLOG_CONFIG.mainJson).then((data) => {
      const items = normalizeItems(data);
      renderVlogMain(items);
    });
  }

  // ------------------------------------------------------------
  // ARTICLE RENDERER (EDITORIAL / BLOG / BREAKING / LATEST / HISTORICAL)
  // ------------------------------------------------------------
  function detectArticleSource() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("editorial")) {
      return { json: CONTENT_BASE + "editorial.json", defaultId: "editorial-001" };
    }
    if (path.includes("blog")) {
      return { json: CONTENT_BASE + "blog.json", defaultId: null };
    }
    if (path.includes("breaking")) {
      return { json: CONTENT_BASE + "breaking.json", defaultId: null };
    }
    if (path.includes("latest")) {
      return { json: CONTENT_BASE + "latest-001.json", defaultId: null };
    }
    if (path.includes("historical")) {
      return { json: CONTENT_BASE + "historical.json", defaultId: null };
    }
    if (path.includes("article")) {
      return { json: CONTENT_BASE + "articles.json", defaultId: null };
    }
    return null;
  }

  function renderArticleMeta(metaEl, item) {
    clearEl(metaEl);
    if (!item) return;

    const bits = [];
    if (item.category) bits.push(item.category);
    if (item.author) bits.push(item.author);
    if (item.location) bits.push(item.location);
    if (item.date) bits.push(item.date);
    if (item.readTime) bits.push(item.readTime);

    metaEl.textContent = bits.join(" • ");
  }

  function renderArticleBody(contentEl, bodyBlocks) {
    clearEl(contentEl);
    if (!Array.isArray(bodyBlocks)) return;

    bodyBlocks.forEach((block) => {
      if (!block || !block.type) return;

      let el = null;

      if (block.type === "header") {
        el = createEl("h2", null, block.text || "");
      } else if (block.type === "paragraph") {
        el = createEl("p", null, block.text || "");
      } else if (block.type === "points") {
        el = createEl("div", "important-points");
        const ul = createEl("ul");
        (block.items || []).forEach((pt) => {
          const li = createEl("li", null, pt);
          ul.appendChild(li);
        });
        el.appendChild(ul);
      } else if (block.type === "image") {
        const figure = document.createElement("figure");
        const align = (block.align || "").toLowerCase();

        if (align === "left") {
          figure.className = "image-left";
        } else if (align === "right") {
          figure.className = "image-right";
        } else {
          // center / full width
          figure.style.margin = "20px 0";
        }

        const img = createEl("img");
        img.src = block.src;
        img.alt = block.caption || "";
        figure.appendChild(img);

        if (block.caption || block.credit) {
          const cap = createEl(
            "figcaption",
            null,
            (block.caption || "") +
              (block.credit ? " — " + block.credit : "")
          );
          figure.appendChild(cap);
        }

        el = figure;
      }

      if (el) contentEl.appendChild(el);
    });
  }

  function initArticlePage() {
    const titleEl = document.getElementById("title");
    const metaEl = document.getElementById("meta");
    const heroWrap = document.getElementById("heroWrap");
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const contentEl = document.getElementById("content");

    if (!titleEl || !metaEl || !heroWrap || !heroImg || !heroCaption || !contentEl) {
      return; // not on article page
    }

    const srcInfo = detectArticleSource();
    if (!srcInfo) return;

    const requestedId = getQueryParam("id");

    fetchJSON(srcInfo.json).then((data) => {
      const items = normalizeItems(data);
      if (!items.length) return;

      let article = null;
      if (requestedId) {
        article = items.find((it) => it.id === requestedId);
      }
      if (!article && srcInfo.defaultId) {
        article = items.find((it) => it.id === srcInfo.defaultId);
      }
      if (!article) {
        article = items[0];
      }
      if (!article) return;

      // Title
      titleEl.textContent = article.title || "Untitled";

      // Meta
      renderArticleMeta(metaEl, article);

      // Hero
      const hero = resolveHeroImage(article);
      if (hero && hero.src) {
        heroImg.src = hero.src;
        heroImg.alt = article.title || "";
        heroCaption.textContent =
          (hero.caption || "") +
          (hero.credit ? " — " + hero.credit : "");
        heroWrap.style.display = "";
      } else {
        heroWrap.style.display = "none";
      }

      // Body
      renderArticleBody(contentEl, article.body || article.blocks || []);
    });
  }

  // ------------------------------------------------------------
  // ACTION BUTTONS
  // ------------------------------------------------------------
  function initActions() {
    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");
    const subBtn = document.getElementById("subBtn");
    const shareBtn = document.getElementById("shareBtn");
    const copyBtn = document.getElementById("copyBtn");

    if (likeBtn && likeCount) {
      let count = 0;
      likeBtn.addEventListener("click", () => {
        count += 1;
        likeCount.textContent = String(count);
      });
    }

    if (subBtn) {
      subBtn.addEventListener("click", () => {
        subBtn.textContent =
          subBtn.textContent.indexOf("Subscribed") === -1
            ? "✅ Subscribed"
            : "🔔 Subscribe";
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        if (navigator.share) {
          navigator
            .share({
              title: document.title,
              url: window.location.href,
            })
            .catch(() => {});
        } else {
          alert("Sharing is not supported in this browser.");
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).catch(() => {});
        } else {
          const tmp = document.createElement("input");
          tmp.value = url;
          document.body.appendChild(tmp);
          tmp.select();
          try {
            document.execCommand("copy");
          } catch (e) {}
          document.body.removeChild(tmp);
        }
      });
    }
  }

  // ------------------------------------------------------------
  // CONTACT MODAL, FOOTER YEAR, LOADER
  // ------------------------------------------------------------
  function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    }
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 400);
    });
  }

  // ------------------------------------------------------------
  // INIT
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initClocksCalendars();
    initWeather();
    initTicker();
    initHomepage();
    initVlogHomepage();
    initArticlePage();
    initActions();
    initContactModal();
    initFooterYear();
    initLoader();
  });
})();
