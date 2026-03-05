<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<base href="/">

<title>Chief Editor | THE MIRROR JAMMU KASHMIR</title>

<link rel="stylesheet" href="styles.css?v=22">
</head>

<body class="article-page theme-maroon">

<main class="page-shell article-main">

<section class="article-container">
<div class="article-shell">

<!-- SECTION LABEL -->
<div class="section-title red-bar">Chief Editor</div>

<!-- HEADER -->
<header class="article-header">
<h1 id="ce-title">Loading…</h1>
<div id="ce-meta" class="article-meta"></div>
</header>

<!-- HERO IMAGE FLOAT RIGHT -->
<figure id="ce-hero" class="image-right"></figure>

<!-- CONTENT -->
<div id="ce-content" class="article-content"></div>

<!-- ACTION BUTTONS -->
<div class="page-actions">
<button id="likeBtn">❤️ Like <span id="likeCount">0</span></button>
<button id="subBtn">🔔 Subscribe</button>
<button id="shareBtn">📣 Share</button>
<button id="copyBtn">🔗 Copy Link</button>
</div>

</div>
</section>

</main>

<footer class="footer">
<p>© <span id="year"></span> THE MIRROR JAMMU KASHMIR. All rights reserved.</p>
</footer>

<script src="script.js?v=22"></script>

<script>
// YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// LIKE
let likes = 0;
document.getElementById("likeBtn").onclick =
() => document.getElementById("likeCount").textContent = ++likes;

// SUBSCRIBE
document.getElementById("subBtn").onclick = function(){
this.textContent="Subscribed";
this.disabled=true;
};

// SHARE
document.getElementById("shareBtn").onclick = () =>
navigator.share
? navigator.share({title:document.title,url:location.href})
: alert("Share not supported");

// COPY LINK
document.getElementById("copyBtn").onclick =
() => navigator.clipboard.writeText(location.href);

// LOAD chief-editor.json
async function loadChiefEditor() {
try {
const res = await fetch("content/chief-editor.json", { cache: "no-store" });
const data = await res.json();

// TITLE + META
document.getElementById("ce-title").textContent = data.title;
document.getElementById("ce-meta").textContent = data.subtitle || "";

// HERO IMAGE
const hero = document.getElementById("ce-hero");
if (data.heroImage?.src) {
hero.innerHTML = `
<img src="${data.heroImage.src}" alt="${data.heroImage.caption}">
<figcaption>${data.heroImage.caption}</figcaption>
`;
}

// BODY CONTENT
const container = document.getElementById("ce-content");
container.innerHTML = "";

data.body.forEach(block => {
if (block.type === "paragraph") {
container.innerHTML += `<p>${block.text}</p>`;
}
if (block.type === "header") {
container.innerHTML += `<h2 style="margin-top:40px;">${block.text}</h2>`;
}
if (block.type === "points") {
const items = block.items.map(i => `<li>${i}</li>`).join("");
container.innerHTML += `
<div class="important-points">
<ul>${items}</ul>
</div>
`;
}
if (block.type === "image") {
const align = block.align === "left" ? "image-left" :
              block.align === "right" ? "image-right" : "";
container.innerHTML += `
<figure class="${align}">
<img src="${block.src}" alt="${block.caption}">
<figcaption>${block.caption}</figcaption>
</figure>
`;
}
});

} catch (err) {
console.error("Failed to load chief-editor.json", err);
document.getElementById("ce-title").textContent = "Error loading content";
}
}

loadChiefEditor();
</script>

</body>
</html>
  // ------------------------------------------------------------
  // HOMEPAGE CONTENT LOADER
  // ------------------------------------------------------------
  const HOMEPAGE_SOURCES = {
    lead:            CONTENT_BASE + "articles.json",
    breaking:        CONTENT_BASE + "breaking.json",
    opinion:         CONTENT_BASE + "blog.json",
    latestLeft:      CONTENT_BASE + "latest-001.json",
    editorialMiddle: CONTENT_BASE + "editorial.json",
    historicalRight: CONTENT_BASE + "latest-002.json" // ensure this exists
  };

  function resolveHeroImage(item) {
    if (!item) return null;
    if (item.heroImage && typeof item.heroImage === "object") {
      return {
        src:     item.heroImage.src || "",
        caption: item.heroImage.caption || "",
        credit:  item.heroImage.credit || ""
      };
    }
    if (typeof item.heroImage === "string") {
      return { src: item.heroImage, caption: "", credit: "" };
    }
    if (item.image)     return { src: item.image,     caption: "", credit: "" };
    if (item.thumbnail) return { src: item.thumbnail, caption: "", credit: "" };
    return null;
  }

  function pickTopItem(items) {
    if (!items || !items.length) return null;
    return items[0];
  }

  function fillCard(mediaId, bodyId, item, fallbackTitle, fallbackText, defaultHref) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl  = document.getElementById(bodyId);
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
      const item  = pickTopItem(items);
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
      const item  = pickTopItem(items);
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
      const item  = pickTopItem(items);
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
      const item  = pickTopItem(items);
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
      const item  = pickTopItem(items);
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
      const item  = pickTopItem(items);
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
    mainJson:   CONTENT_BASE + "youtube.json",
    mainGridId: "vlogs-grid"
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
      const card  = createEl("article", "card");
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

      const body  = createEl("div", "card-body");
      const title = createEl("h3", null, video.title || "Untitled video");
      const p     = createEl(
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
  // ARTICLE RENDERER (EDITORIAL / BLOG / BREAKING / LATEST / HISTORICAL / ARTICLE)
  // ------------------------------------------------------------
  function detectArticleSource() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("editorial")) {
      return { json: CONTENT_BASE + "editorial.json",   defaultId: "editorial-001" };
    }
    if (path.includes("blog")) {
      return { json: CONTENT_BASE + "blog.json",        defaultId: null };
    }
    if (path.includes("breaking")) {
      return { json: CONTENT_BASE + "breaking.json",    defaultId: null };
    }
    if (path.includes("latest")) {
      return { json: CONTENT_BASE + "latest-001.json",  defaultId: null };
    }
    if (path.includes("historical")) {
      return { json: CONTENT_BASE + "historical.json",  defaultId: null };
    }
    if (path.includes("article")) {
      return { json: CONTENT_BASE + "articles.json",    defaultId: null };
    }
    return null;
  }

  function renderArticleMeta(metaEl, item) {
    clearEl(metaEl);
    if (!item) return;

    const bits = [];
    if (item.category) bits.push(item.category);
    if (item.author)   bits.push(item.author);
    if (item.location) bits.push(item.location);
    if (item.date)     bits.push(item.date);
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
        const align  = (block.align || "").toLowerCase();

        if (align === "left") {
          figure.className = "image-left";
        } else if (align === "right") {
          figure.className = "image-right";
        } else {
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
    const titleEl      = document.getElementById("title");
    const metaEl       = document.getElementById("meta");
    const heroWrap     = document.getElementById("heroWrap");
    const heroImg      = document.getElementById("heroImg");
    const heroCaption  = document.getElementById("heroCaption");
    const contentEl    = document.getElementById("content");

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

      titleEl.textContent = article.title || "Untitled";
      renderArticleMeta(metaEl, article);

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

      renderArticleBody(contentEl, article.body || article.blocks || []);
    });
  }
  // ------------------------------------------------------------
  // ACTION BUTTONS (for article pages that use them)
  // ------------------------------------------------------------
  function initActions() {
    const likeBtn   = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");
    const subBtn    = document.getElementById("subBtn");
    const shareBtn  = document.getElementById("shareBtn");
    const copyBtn   = document.getElementById("copyBtn");

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
