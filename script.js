(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }
  function pickEl(selectors) {
    for (const s of selectors) {
      const el = qs(s);
      if (el) return el;
    }
    return null;
  }
  function safeText(v) {
    if (v === null || v === undefined) return "";
    return String(v);
  }

  const EL = {
    dateTime: pickEl(["#dateTime", "#currentDateTime", "#datetime", ".date-time", "[data-datetime]"]),
    hijri: pickEl(["#hijriDate", "#hijri-date", ".hijri-date", "[data-hijri]"]),
    saka: pickEl(["#sakaDate", "#saka-date", ".saka-date", "[data-saka]"]),
    ist: pickEl(["#istTime", "#ist-time", ".ist-time", "[data-ist]"]),
    pkt: pickEl(["#pktTime", "#pkt-time", ".pkt-time", "[data-pkt]"]),
    tempsRow: pickEl(["#regionalTemps", "#regional-temps", "#weatherPills", "#weather-chips", ".weather-pills", ".regional-temps", "[data-regional-temps]"]),
    tickerTrack: pickEl(["#tickerTrack", "#tickerText", "#ticker-items", ".ticker-track", ".ticker-text", "[data-ticker]"]),
    nav: pickEl([".nav-links", ".nav-list", "nav ul", "#nav-list"]),
    mobileToggle: pickEl(["#menuToggle", "#nav-toggle", ".nav-toggle", "#hamburger"]),
    mobileMenu: pickEl(["#mobileMenu", "#nav-list-mobile", ".mobile-nav", ".nav-list-mobile"]),
    articlesGrid: pickEl(["#latestArticlesGrid", "#articles-grid", "#articles-list", ".articles-grid", ".latest-articles-grid", "[data-articles-grid]"]),
    vlogsGrid: pickEl(["#vlogsGrid", "#vlogs-list", ".vlogs-grid", "[data-vlogs-grid]"])
  };

  const CONFIG = {
    timezoneCEST: "Europe/Zurich",
    cities: [
      { name: "Zurich", lat: 47.3769, lon: 8.5417 },
      { name: "Jammu", lat: 32.7266, lon: 74.8570 },
      { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
      { name: "Ladakh", lat: 34.1526, lon: 77.5770 },
      { name: "Gilgit", lat: 35.9208, lon: 74.3146 },
      { name: "Baltistan", lat: 35.3270, lon: 75.5510 },
      { name: "Muzaffarabad", lat: 34.3700, lon: 73.4700 },
      { name: "Rawalakot", lat: 33.8570, lon: 73.7630 }
    ],
    placeholderCards: [
      { tag: "Politics", read: "5 min read", title: "Editorial Placeholder", accent: "maroon" },
      { tag: "Human Rights", read: "8 min read", title: "Opinion Placeholder", accent: "blue" },
      { tag: "Education", read: "6 min read", title: "Update Placeholder", accent: "green" }
    ],
    fallbackImages: ["sample-1.jpg", "sample-2.jpg", "sample-3.jpg"]
  };

  function formatCESTDateTime() {
    try {
      const now = new Date();
      const datePart = new Intl.DateTimeFormat("en-GB", {
        timeZone: CONFIG.timezoneCEST,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(now);

      const timePart = new Intl.DateTimeFormat("en-GB", {
        timeZone: CONFIG.timezoneCEST,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(now);

      return `${datePart} at ${timePart}`;
    } catch {
      return "";
    }
  }

  function formatTime(tz) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(new Date());
    } catch {
      return "";
    }
  }

  function formatHijri() {
    try {
      return new Intl.DateTimeFormat("en", {
        calendar: "islamic-umalqura",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
    } catch {
      return "";
    }
  }

  function formatSaka() {
    try {
      return new Intl.DateTimeFormat("en", {
        calendar: "indian",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
    } catch {
      return "";
    }
  }

  function renderCalendarRow() {
    if (EL.dateTime) EL.dateTime.textContent = formatCESTDateTime();
    if (EL.hijri) EL.hijri.textContent = formatHijri() || "Unavailable";
    if (EL.saka) EL.saka.textContent = formatSaka() || "Unavailable";
    if (EL.ist) EL.ist.textContent = formatTime("Asia/Kolkata") || "--:--:--";
    if (EL.pkt) EL.pkt.textContent = formatTime("Asia/Karachi") || "--:--:--";
  }

  async function fetchCityTemp(city) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(city.lat)}` +
      `&longitude=${encodeURIComponent(city.lon)}` +
      "&current=temperature_2m" +
      "&timezone=auto";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("weather");
    const data = await res.json();

    const temp = data && data.current && typeof data.current.temperature_2m === "number"
      ? data.current.temperature_2m
      : null;

    return { name: city.name, temp };
  }

  function renderTempsRow(items) {
    if (!EL.tempsRow) return;

    const html = items.map(it => {
      const t = it.temp === null ? "--" : `${Math.round(it.temp * 10) / 10}°C`;
      return `<span class="weather-pill">${it.name}: ${t}</span>`;
    }).join("");

    EL.tempsRow.innerHTML = html;
  }

  async function loadRegionalTemps() {
    if (!EL.tempsRow) return;

    try {
      EL.tempsRow.innerHTML = CONFIG.cities
        .map(c => `<span class="weather-pill">${c.name}: --</span>`)
        .join("");

      const results = await Promise.allSettled(CONFIG.cities.map(fetchCityTemp));
      const ok = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

      if (ok.length) renderTempsRow(ok);
    } catch {
      // keep placeholders
    }
  }

  async function loadSiteJson() {
    try {
      const res = await fetch("site.json", { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function renderTicker(texts) {
    if (!EL.tickerTrack) return;

    const list = Array.isArray(texts) && texts.length ? texts : [
      "MULTILINGUAL SUPPORT & MOBILE-FIRST DESIGN ARE BUILT-IN.",
      "WELCOME TO THE MIRROR JAMMU KASHMIR. EMPOWERING TRUTH.",
      "SUBMIT YOUR EDITORIALS AND VLOGS VIA THE CONTACT FORM BELOW."
    ];

    const combined = list.join("     ");
    EL.tickerTrack.textContent = combined;
  }

  function isSmallScreen() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function setupDropdowns() {
    const dropdownParents = qsa("li, .nav-item").filter(li => {
      const menu = li.querySelector("ul, .dropdown, .submenu");
      const link = li.querySelector("a");
      return !!(menu && link);
    });

    dropdownParents.forEach(li => {
      const menu = li.querySelector("ul, .dropdown, .submenu");
      const link = li.querySelector("a");
      if (!menu || !link) return;

      li.classList.add("has-submenu");

      link.addEventListener("click", (e) => {
        if (!isSmallScreen()) return;

        const href = link.getAttribute("href") || "";
        const hasRealLink = href && href !== "#" && !href.startsWith("javascript");
        if (hasRealLink && !li.classList.contains("open")) {
          e.preventDefault();
          li.classList.toggle("open");
          return;
        }

        if (!hasRealLink) {
          e.preventDefault();
          li.classList.toggle("open");
        }
      });
    });
  }

  function setupMobileMenu() {
    if (!EL.mobileToggle) return;

    const menu = EL.mobileMenu || EL.nav;
    if (!menu) return;

    EL.mobileToggle.addEventListener("click", () => {
      const expanded = EL.mobileToggle.getAttribute("aria-expanded") === "true";
      EL.mobileToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      menu.classList.toggle("open");
      if (menu.hasAttribute("hidden")) menu.hidden = expanded ? true : false;
    });

    document.addEventListener("click", (e) => {
      if (!isSmallScreen()) return;
      const inside = e.target.closest("nav");
      if (inside) return;
      menu.classList.remove("open");
      EL.mobileToggle.setAttribute("aria-expanded", "false");
      if (menu.hasAttribute("hidden")) menu.hidden = true;
    });
  }

  function placeholderCardHTML(p) {
    return `
      <article class="tm-card tm-placeholder tm-accent-${p.accent}">
        <div class="tm-card-top">
          <span class="tm-tag">${p.tag}</span>
          <span class="tm-read">${p.read}</span>
        </div>
        <div class="tm-ph-box">
          <div class="tm-ph-text">${p.title}</div>
        </div>
        <div class="tm-card-bottom">
          <a class="tm-readmore" href="#">Read More →</a>
        </div>
      </article>
    `;
  }

  function renderPlaceholders() {
    if (!EL.articlesGrid) return;

    const hasCardsAlready =
      EL.articlesGrid.querySelector(".tm-card, .article-card, .news-card, article");

    if (hasCardsAlready) return;

    EL.articlesGrid.innerHTML = CONFIG.placeholderCards.map(placeholderCardHTML).join("");
  }

  function pickFallbackImage(i) {
    const idx = Math.abs(i) % CONFIG.fallbackImages.length;
    return CONFIG.fallbackImages[idx];
  }

  function articleCardHTML(a, i) {
    const title = safeText(a.title || "Untitled");
    const author = safeText(a.author || a.byline || "");
    const date = safeText(a.date || "");
    const cat = safeText(a.category || a.section || "");
    const excerpt = safeText(a.excerpt || a.summary || "");
    const read = safeText(a.readTime || a.read || "");
    const image = safeText(a.image || a.mainImage || pickFallbackImage(i));
    const id = encodeURIComponent(safeText(a.id || a.slug || title));

    return `
      <article class="article-card tm-card">
        <div class="article-image tm-image-wrap">
          <img src="${image}" alt="${title}" loading="lazy"
            onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('tm-image-missing');" />
          <div class="tm-image-placeholder">Image placeholder</div>
        </div>

        <div class="article-body">
          <div class="article-meta">
            ${cat ? `<span class="tm-tag">${cat}</span>` : ""}
            ${read ? `<span class="tm-read">${read}</span>` : ""}
          </div>

          <h3 class="article-title">${title}</h3>
          ${excerpt ? `<p class="article-excerpt">${excerpt}</p>` : ""}
          <div class="article-footer">
            <span class="article-byline">${author}</span>
            <span class="article-date">${date}</span>
          </div>

          <button class="tm-readmore-btn" type="button" data-open-article="${id}">Read More →</button>
        </div>
      </article>
    `;
  }

  async function loadArticles() {
    if (!EL.articlesGrid) return;

    renderPlaceholders();

    try {
      const res = await fetch("articles.json", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data.articles) ? data.articles : []);

      if (!list.length) return;

      EL.articlesGrid.innerHTML = list.slice(0, 6).map(articleCardHTML).join("");

      EL.articlesGrid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-open-article]");
        if (!btn) return;
        const id = decodeURIComponent(btn.getAttribute("data-open-article") || "");
        openArticleModal(list, id);
      });
    } catch {
      // keep placeholders
    }
  }

  function openArticleModal(list, id) {
    const modal = pickEl(["#articleModal", "#article-modal", ".article-modal", "[data-article-modal]"]);
    const body = pickEl(["#articleModalBody", "#article-modal-body", ".article-modal-body", "[data-article-modal-body]"]);

    if (!modal || !body) return;

    const a = list.find(x => safeText(x.id) === id || safeText(x.slug) === id || safeText(x.title) === id);
    if (!a) return;

    const title = safeText(a.title || "Untitled");
    const content = safeText(a.content || a.body || a.fullText || "");
    const image = safeText(a.inlineImage || a.image || "");

    body.innerHTML = `
      <article class="tm-article-full">
        <h2 class="tm-article-title">${title}</h2>
        <div class="tm-article-wrap">
          ${image ? `<img class="tm-article-inline" src="${image}" alt="${title}" onerror="this.onerror=null;this.style.display='none';" />` : ""}
          <div class="tm-article-text">${content ? content : "Content will appear here."}</div>
        </div>
      </article>
    `;

    modal.classList.add("open");
    modal.removeAttribute("hidden");

    const closeBtn = modal.querySelector("[data-close], .close, .modal-close");
    const backdrop = modal.querySelector(".backdrop, .modal-backdrop");
    function close() {
      modal.classList.remove("open");
      modal.setAttribute("hidden", "hidden");
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }

    if (closeBtn) closeBtn.addEventListener("click", close, { once: true });
    if (backdrop) backdrop.addEventListener("click", close, { once: true });
    document.addEventListener("keydown", onKey);
  }

  async function loadVlogs() {
    if (!EL.vlogsGrid) return;

    try {
      const res = await fetch("vlogs.json", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data.vlogs) ? data.vlogs : []);
      if (!list.length) return;

      EL.vlogsGrid.innerHTML = list.slice(0, 6).map((v, i) => {
        const title = safeText(v.title || "Vlog");
        const image = safeText(v.thumbnail || v.image || pickFallbackImage(i));
        const url = safeText(v.url || v.youtube || "#");

        return `
          <article class="vlog-card tm-card">
            <div class="tm-image-wrap">
              <img src="${image}" alt="${title}" loading="lazy"
                onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('tm-image-missing');" />
              <div class="tm-image-placeholder">Image placeholder</div>
            </div>
            <div class="vlog-body">
              <h3 class="vlog-title">${title}</h3>
              <a class="tm-watch" href="${url}" target="_blank" rel="noopener">Watch</a>
            </div>
          </article>
        `;
      }).join("");
    } catch {
      // ignore
    }
  }

  async function boot() {
    renderCalendarRow();
    setInterval(renderCalendarRow, 1000);

    const site = await loadSiteJson();
    renderTicker(site && site.ticker ? site.ticker : null);

    setupDropdowns();
    setupMobileMenu();

    renderPlaceholders();
    loadArticles();
    loadVlogs();

    loadRegionalTemps();
    setInterval(loadRegionalTemps, 10 * 60 * 1000);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
