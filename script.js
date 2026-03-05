// script.js
// The Mirror Jammu Kashmir – unified frontend logic
// - Vlog 3-window horizontal layout (main page)
// - Vlog archive with 9-per-page grid + pagination
// - Archives for all sections with 9-per-page grid + pagination
// - Unified article renderer (all sections)
// - Inline image float engine (35–40% Reuters style via CSS classes)
// - Important-points block rendering
// - Routing by ID prefix
// - Action buttons wiring (Like, Subscribe, Share, Copy Link)
// -----------------------------------------------------------------------------
// Assumptions (aligned with your repo):
// JSON files live in /content/:
//   latest-001.json, latest-archive.json
//   editorial.json, editorial-archive.json
//   breaking.json, breaking-archive.json
//   blog.json, blog-archive.json
//   humanrights.json, humanrights-archive.json
//   international.json, international-archive.json
//   jk.json, jk-archive.json
//   historical.json, historical-archive.json
//   chief-editor.json
//   youtube.json, youtube-archive.json
//   articles.json (for generic article listing if needed)
//   index.json (for homepage blocks if needed)
//
// HTML expectations (you can adapt IDs/classes in your templates):
//   - Vlog main grid container:        #vlog-grid
//   - Vlog "Visit Channel" button:     #vlog-visit-channel
//   - Vlog archive grid container:     #vlog-archive-grid
//   - Vlog archive pagination:         #vlog-archive-pagination
//
//   - Archive grids (per section):     #latest-archive-grid, #editorial-archive-grid, etc.
//   - Archive paginations:             #latest-archive-pagination, #editorial-archive-pagination, etc.
//
//   - Article page containers:
//       #article-title
//       #article-meta
//       #article-body
//       #article-hero
//
//   - Action buttons (optional):
//       .btn-like
//       .btn-subscribe
//       .btn-share
//       .btn-copy-link
//
// You can adjust selectors to match your actual HTML.
// -----------------------------------------------------------------------------

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Utility helpers
  // ---------------------------------------------------------------------------

  const CONTENT_BASE = "content/";

  function fetchJSON(path) {
    return fetch(path, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load " + path + " (" + res.status + ")");
        }
        return res.json();
      })
      .catch((err) => {
        console.error("JSON load error:", path, err);
        return [];
      });
  }

  function byDateDesc(a, b) {
    // We respect whatever date string you put in JSON.
    // For sorting, we try Date parsing; if it fails, we keep original order.
    const da = Date.parse(a.date || "") || 0;
    const db = Date.parse(b.date || "") || 0;
    return db - da;
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
    while (el && el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  // ---------------------------------------------------------------------------
  // Config for sections and archives
  // ---------------------------------------------------------------------------

  const SECTION_CONFIG = {
    latest: {
      key: "latest",
      mainJson: CONTENT_BASE + "latest-001.json",
      archiveJson: CONTENT_BASE + "latest-archive.json",
      archiveGridId: "latest-archive-grid",
      archivePaginationId: "latest-archive-pagination",
    },
    editorial: {
      key: "editorial",
      mainJson: CONTENT_BASE + "editorial.json",
      archiveJson: CONTENT_BASE + "editorial-archive.json",
      archiveGridId: "editorial-archive-grid",
      archivePaginationId: "editorial-archive-pagination",
    },
    breaking: {
      key: "breaking",
      mainJson: CONTENT_BASE + "breaking.json",
      archiveJson: CONTENT_BASE + "breaking-archive.json",
      archiveGridId: "breaking-archive-grid",
      archivePaginationId: "breaking-archive-pagination",
    },
    blog: {
      key: "blog",
      mainJson: CONTENT_BASE + "blog.json",
      archiveJson: CONTENT_BASE + "blog-archive.json",
      archiveGridId: "blog-archive-grid",
      archivePaginationId: "blog-archive-pagination",
    },
    humanrights: {
      key: "humanrights",
      mainJson: CONTENT_BASE + "humanrights.json",
      archiveJson: CONTENT_BASE + "humanrights-archive.json",
      archiveGridId: "humanrights-archive-grid",
      archivePaginationId: "humanrights-archive-pagination",
    },
    international: {
      key: "international",
      mainJson: CONTENT_BASE + "international.json",
      archiveJson: CONTENT_BASE + "international-archive.json",
      archiveGridId: "international-archive-grid",
      archivePaginationId: "international-archive-pagination",
    },
    jk: {
      key: "jk",
      mainJson: CONTENT_BASE + "jk.json",
      archiveJson: CONTENT_BASE + "jk-archive.json",
      archiveGridId: "jk-archive-grid",
      archivePaginationId: "jk-archive-pagination",
    },
    historical: {
      key: "historical",
      mainJson: CONTENT_BASE + "historical.json",
      archiveJson: CONTENT_BASE + "historical-archive.json",
      archiveGridId: "historical-archive-grid",
      archivePaginationId: "historical-archive-pagination",
    },
    chiefEditor: {
      key: "chief-editor",
      mainJson: CONTENT_BASE + "chief-editor.json",
      archiveJson: null,
      archiveGridId: null,
      archivePaginationId: null,
    },
  };

  // Vlog / YouTube config
  const VLOG_CONFIG = {
    mainJson: CONTENT_BASE + "youtube.json",
    archiveJson: CONTENT_BASE + "youtube-archive.json",
    mainGridId: "vlog-grid",
    visitChannelId: "vlog-visit-channel",
    archiveGridId: "vlog-archive-grid",
    archivePaginationId: "vlog-archive-pagination",
    // You can change this to your real channel URL:
    channelUrl: "https://www.youtube.com/",
  };

  const ITEMS_PER_PAGE = 9;

  // ---------------------------------------------------------------------------
  // Vlog main page – 3 horizontal windows
  // ---------------------------------------------------------------------------

  function buildYouTubeThumbnail(video) {
    // We use YouTube's own thumbnails (your choice A).
    // Expecting video.videoId in JSON.
    if (video.thumbnail && video.thumbnail.indexOf("http") === 0) {
      return video.thumbnail;
    }
    if (video.videoId) {
      return "https://img.youtube.com/vi/" + video.videoId + "/hqdefault.jpg";
    }
    return "";
  }

  function renderVlogMain(videos) {
    const container = document.getElementById(VLOG_CONFIG.mainGridId);
    if (!container) return;

    clearEl(container);

    // Sort newest → oldest
    videos.sort(byDateDesc);

    const topThree = videos.slice(0, 3);

    topThree.forEach((video) => {
      const card = createEl("article", "vlog-card");

      const thumbUrl = buildYouTubeThumbnail(video);
      if (thumbUrl) {
        const img = createEl("img", "vlog-thumb");
        img.src = thumbUrl;
        img.alt = video.title || "Video";
        card.appendChild(img);
      }

      const body = createEl("div", "vlog-card-body");

      if (video.title) {
        const titleEl = createEl("h3", "vlog-title", video.title);
        body.appendChild(titleEl);
      }

      const meta = createEl("div", "vlog-meta");
      if (video.category) {
        const cat = createEl("span", "vlog-category", video.category);
        meta.appendChild(cat);
      }
      if (video.date) {
        const date = createEl("span", "vlog-date", video.date);
        meta.appendChild(date);
      }
      if (meta.childNodes.length > 0) {
        body.appendChild(meta);
      }

      const actions = createEl("div", "vlog-actions");
      const playBtn = createEl("button", "btn btn-play", "Play");
      playBtn.addEventListener("click", () => {
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
      actions.appendChild(playBtn);
      body.appendChild(actions);

      card.appendChild(body);
      container.appendChild(card);
    });

    // Visit Channel button
    const visitBtn = document.getElementById(VLOG_CONFIG.visitChannelId);
    if (visitBtn) {
      visitBtn.addEventListener("click", () => {
        window.open(VLOG_CONFIG.channelUrl, "_blank", "noopener");
      });
    }
  }

  function initVlogMain() {
    const container = document.getElementById(VLOG_CONFIG.mainGridId);
    if (!container) return; // Not on vlog main page

    fetchJSON(VLOG_CONFIG.mainJson).then((videos) => {
      if (!Array.isArray(videos)) videos = [];
      renderVlogMain(videos);
    });
  }

  // ---------------------------------------------------------------------------
  // Vlog archive – 9 per page + pagination
  // ---------------------------------------------------------------------------

  function renderPagination(container, currentPage, totalPages, onPageChange) {
    if (!container) return;
    clearEl(container);

    if (totalPages <= 1) return;

    const prev = createEl("button", "pagination-prev", "<");
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    });
    container.appendChild(prev);

    for (let p = 1; p <= totalPages; p++) {
      const btn = createEl("button", "pagination-page", String(p));
      if (p === currentPage) {
        btn.classList.add("is-active");
      }
      btn.addEventListener("click", () => {
        if (p !== currentPage) onPageChange(p);
      });
      container.appendChild(btn);
    }

    const next = createEl("button", "pagination-next", "Next >");
    next.disabled = currentPage === totalPages;
    next.addEventListener("click", () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    });
    container.appendChild(next);
  }

  function renderVlogArchivePage(videos, page) {
    const grid = document.getElementById(VLOG_CONFIG.archiveGridId);
    const pagination = document.getElementById(VLOG_CONFIG.archivePaginationId);
    if (!grid) return;

    clearEl(grid);

    videos.sort(byDateDesc);

    const totalItems = videos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = videos.slice(start, end);

    pageItems.forEach((video) => {
      const card = createEl("article", "archive-card vlog-archive
