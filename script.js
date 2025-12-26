(function () {
  "use strict";

  const JSON_ARTICLES = "articles.json";

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getParam(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  async function fetchJson(url, timeoutMs = 9000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }

  function buildArticleCard(a) {
    const id = a.id || "";
    const title = a.title || "Untitled";
    const excerpt = a.excerpt || "";
    const image = a.image || "sample-1.jpg";
    const date = formatDate(a.date);
    const category = a.category || "";

    return `
      <article class="article-card content-block">
        <div class="article-card-inner">
          <img class="card-img" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"
               onerror="this.src='sample-1.jpg';" />
          <h3>${escapeHtml(title)}</h3>
          <div class="meta">${escapeHtml(category)}${category && date ? " | " : ""}${escapeHtml(date)}</div>
          <p>${escapeHtml(excerpt)}</p>
          <a class="read-more-btn" href="article.html?id=${encodeURIComponent(id)}">Read More</a>
        </div>
      </article>
    `;
  }

  async function renderHomepageArticles() {
    const host =
      qs("#articles-list") ||
      qs("#latest-articles") ||
      qs("[data-articles]");

    if (!host) return;

    host.innerHTML = "<div class='content-block'>Loading articles...</div>";

    try {
      const data = await fetchJson(JSON_ARTICLES);
      if (!Array.isArray(data) || data.length === 0) {
        host.innerHTML = "<div class='content-block'>No articles found.</div>";
        return;
      }

      const latestCount = 6;
      const latest = data.slice(0, latestCount);
      const archive = data.slice(latestCount);

      const latestHtml = latest.map(buildArticleCard).join("");

      let archiveHtml = "";
      if (archive.length) {
        archiveHtml = `
          <section class="content-block">
            <h2 class="page-title">Archive</h2>
            <div class="archive-list">
              ${archive
                .map(a => {
                  const t = a.title || "Untitled";
                  const d = formatDate(a.date);
                  return `<div class="archive-item">
                    <a href="article.html?id=${encodeURIComponent(a.id || "")}">${escapeHtml(t)}</a>
                    <span class="meta">${escapeHtml(d)}</span>
                  </div>`;
                })
                .join("")}
            </div>
          </section>
        `;
      }

      host.innerHTML = latestHtml + archiveHtml;
    } catch (e) {
      host.innerHTML = "<div class='content-block'>Failed to load articles.</div>";
    }
  }

  async function renderFullArticlePage() {
    const titleEl = qs("#article-title");
    const metaEl = qs("#article-meta");
    const imgEl = qs("#article-image");
    const contentEl = qs("#article-content");

    if (!titleEl || !metaEl || !imgEl || !contentEl) return;

    const id = getParam("id");
    if (!id) {
      titleEl.textContent = "Article not found";
      metaEl.textContent = "";
      contentEl.innerHTML = "<p>Missing article id.</p>";
      return;
    }

    try {
      const data = await fetchJson(JSON_ARTICLES);
      const a = Array.isArray(data) ? data.find(x => String(x.id) === String(id)) : null;

      if (!a) {
        titleEl.textContent = "Article not found";
        metaEl.textContent = "";
        contentEl.innerHTML = "<p>The article you requested does not exist.</p>";
        return;
      }

      const title = a.title || "Untitled";
      const date = formatDate(a.date);
      const category = a.category || "";
      const author = a.author || "";
      const image = a.image || "sample-1.jpg";
      const content = a.content || "<p>No content provided.</p>";

      document.title = `${title} | The Mirror Jammu Kashmir`;

      titleEl.textContent = title;
      metaEl.textContent = [category, date, author].filter(Boolean).join(" | ");

      imgEl.src = image;
      imgEl.alt = title;
      imgEl.onerror = function () {
        imgEl.src = "sample-1.jpg";
      };

      contentEl.innerHTML = content;
    } catch (e) {
      titleEl.textContent = "Loading error";
      metaEl.textContent = "";
      contentEl.innerHTML = "<p>Could not load this article.</p>";
    }
  }

  function initPageActions() {
    const blocks = qsa("[data-actions]");
    if (!blocks.length) return;

    blocks.forEach(block => {
      const likeBtn = qs("[data-like]", block);
      const likeCount = qs("[data-like-count]", block);
      const copyBtn = qs("[data-copy]", block);
      const shareBtn = qs("[data-share]", block);

      const key = "tmjk_like_" + location.pathname + location.search;
      let count = Number(localStorage.getItem(key) || "0");
      if (likeCount) likeCount.textContent = String(count);

      if (likeBtn) {
        likeBtn.addEventListener("click", () => {
          count += 1;
          localStorage.setItem(key, String(count));
          if (likeCount) likeCount.textContent = String(count);
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            copyBtn.textContent = "Copied";
            setTimeout(() => (copyBtn.textContent = "🔗 Copy Link"), 1200);
          } catch {
            copyBtn.textContent = "Copy failed";
            setTimeout(() => (copyBtn.textContent = "🔗 Copy Link"), 1200);
          }
        });
      }

      if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
          const payload = {
            title: document.title,
            text: document.title,
            url: window.location.href
          };

          if (navigator.share) {
            try {
              await navigator.share(payload);
            } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(window.location.href);
              shareBtn.textContent = "Link copied";
              setTimeout(() => (shareBtn.textContent = "📤 Share"), 1200);
            } catch {}
          }
        });
      }
    });
  }

  function initAdminOnlyUploads() {
    const uploadAreas = qsa("[data-admin-upload]");
    if (!uploadAreas.length) return;

    const ownerKey = "tmjk_owner_mode";
    const isOwner = localStorage.getItem(ownerKey) === "1";

    uploadAreas.forEach(area => {
      area.style.display = isOwner ? "" : "none";
    });

    const ownerBtn = qs("[data-owner-toggle]");
    if (ownerBtn) {
      ownerBtn.addEventListener("click", () => {
        const pass = prompt("Owner password");
        if (!pass) return;

        if (pass === "CHANGE_THIS_PASSWORD") {
          localStorage.setItem(ownerKey, "1");
          location.reload();
        } else {
          alert("Wrong password");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHomepageArticles();
    renderFullArticlePage();
    initPageActions();
    initAdminOnlyUploads();
  });
})();
