// script.js
// THE MIRROR JAMMU KASHMIR
// - Homepage loader (Top Stories, Latest/Editorial/Historical)
// - Vlog 3-window layout on homepage
// - Article renderer (Reuters/BBC style, hero + inline images 35–40%)
// - Action buttons (Like, Subscribe, Share, Copy Link)
// - Loader + footer year
// ---------------------------------------------------------------------

(function () {
  "use strict";

  const CONTENT_BASE = "content/";

  // ------------------------------------------------------------
  // Helpers
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
  // HOMEPAGE LOADER
  // ------------------------------------------------------------

  // Mapping (as you defined)
  const HOMEPAGE_SOURCES = {
    lead: CONTENT_BASE + "articles.json",
    breaking: CONTENT_BASE + "breaking.json",
    opinion: CONTENT_BASE + "blog.json",
    latestLeft: CONTENT_BASE + "latest-001.json",
    editorialMiddle: CONTENT_BASE + "editorial.json",
    historicalRight: CONTENT_BASE + "latest-002.json", // make sure to upload this
  };

  function pickTopItem(items) {
    if (!items || !items.length) return null;
    return items[0]; // topmost appears on homepage
  }

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
    if (item.image) {
      return { src: item.image, caption: "", credit: "" };
    }
    if (item.thumbnail) {
      return { src: item.thumbnail, caption: "", credit: "" };
    }
    return null;
  }

  function fillCard(mediaId, bodyId, item, fallbackTitle, fallbackText) {
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
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      mediaEl.classList.remove("placeholder", "maroon");
      mediaEl.appendChild(img);
    } else {
      mediaEl.textContent = fallbackTitle || "Coming Soon";
    }

    const title = createEl("h3", null, item && item.title ? item.title : fallbackTitle || "Coming Soon");
    const p = createEl(
      "p",
      null,
      item && item.excerpt
        ? item.excerpt
        : fallbackText || "Content will be added shortly."
    );

    bodyEl.appendChild(title);
    bodyEl.appendChild(p);

    if (item && item.id) {
      const link = createEl("a", null, "Read More →");
      link.href = "editorial.html?id=" + encodeURIComponent(item.id);
      link.style.display = "inline-block";
      link.style.marginTop = "6px";
      bodyEl.appendChild(link);
    }
  }

  function initHomepage() {
    const topStoriesSection = document.getElementById("top-stories");
    if (!topStoriesSection) return; // not on homepage

    // Lead
    fetchJSON(HOMEPAGE_SOURCES.lead).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "lead-media",
        "lead-body",
        item,
        "Lead Story",
        "Lead story will appear here."
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
        "Breaking news will appear here."
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
        "Opinion and blog will appear here."
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
        "Latest content will be added shortly."
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
        "Editorial content will be added shortly."
      );
    });

    // Historical (right) – from latest-002.json
    fetchJSON(HOMEPAGE_SOURCES.historicalRight).then((data) => {
      const items = normalizeItems(data);
      const item = pickTopItem(items);
      fillCard(
        "leh3-media",
        "leh3-body",
        item,
        "Historical",
        "Historical content will be added shortly."
      );
    });

    // JK, International, HR remain “Coming Soon” as you requested
  }

  // ------------------------------------------------------------
  // VLOG – HOMEPAGE 3-WINDOW LAYOUT
  // ------------------------------------------------------------

  const VLOG_CONFIG = {
    mainJson: CONTENT_BASE + "youtube.json",
    mainGridId: "vlog-grid",
    visitChannelId: "vlog-visit-channel",
    channelUrl: "https://www.youtube.com/",
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

    const visitBtn = document.getElementById(VLOG_CONFIG.visitChannelId);
    if (visitBtn) {
      visitBtn.addEventListener("click", () => {
        window.open(VLOG_CONFIG.channelUrl, "_blank", "noopener");
      });
    }
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
  // ARTICLE RENDERER (EDITORIAL STYLE)
  // ------------------------------------------------------------

  // Decide which JSON to use based on URL
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
          // center / default full width
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
  // CONTACT MODAL + FOOTER YEAR + LOADER
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
    initHomepage();
    initVlogHomepage();
    initArticlePage();
    initActions();
    initContactModal();
    initFooterYear();
    initLoader();
  });
})();
