// script.js (FULL REPLACEMENT)
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function formatTimeForTZ(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(date);

    const get = (t) => (parts.find(p => p.type === t) || {}).value || "00";
    return `${get("hour")}:${get("minute")}:${get("second")}`;
  }

  function formatFullForTZ(date, timeZone) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);
  }

  function setClocks() {
    const now = new Date();

    const cest = $("#clock-cest span");
    if (cest) cest.textContent = formatFullForTZ(now, "Europe/Zurich");

    const ist = $("#tz-ist span");
    if (ist) ist.textContent = formatTimeForTZ(now, "Asia/Kolkata");

    const pkt = $("#tz-pkt span");
    if (pkt) pkt.textContent = formatTimeForTZ(now, "Asia/Karachi");

    const hijri = $("#cal-hijri span");
    if (hijri) {
      try {
        hijri.textContent = new Intl.DateTimeFormat("en-GB-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
      } catch {
        hijri.textContent = "Hijri";
      }
    }

    const saka = $("#cal-hindi span");
    if (saka) {
      try {
        saka.textContent = new Intl.DateTimeFormat("en-GB-u-ca-indian", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
      } catch {
        saka.textContent = "Saka";
      }
    }
  }

  function wrapToTwoLines(text) {
    const t = String(text || "Placeholder").trim().replace(/\s+/g, " ").slice(0, 42);
    const words = t.split(" ").filter(Boolean);

    if (words.length <= 1) return [t];

    const target = Math.ceil(t.length / 2);
    let line1 = "";
    let line2 = "";

    for (const w of words) {
      const next = (line1 ? line1 + " " : "") + w;
      if (next.length <= target || !line1) {
        line1 = next;
      } else {
        line2 = (line2 ? line2 + " " : "") + w;
      }
    }

    if (!line2) return [line1];

    // If line2 still too long, hard-split it once
    if (line2.length > 22 && line1.length < 22) {
      const cut = line2.lastIndexOf(" ", 22);
      if (cut > 10) {
        const a = line2.slice(0, cut).trim();
        const b = line2.slice(cut + 1).trim();
        return [line1, a.length >= b.length ? a : a, b];
      }
    }

    return [line1, line2];
  }

  function computeFontSize(lines) {
    const joinedLen = lines.join(" ").length;

    // Match your Latest Articles placeholder feel
    if (lines.length === 1) {
      if (joinedLen <= 18) return 78;
      if (joinedLen <= 24) return 64;
      return 54;
    }

    if (lines.length === 2) {
      if (joinedLen <= 28) return 60;
      if (joinedLen <= 34) return 52;
      return 46;
    }

    // 3 lines (rare)
    if (joinedLen <= 38) return 44;
    return 40;
  }

  function svgPlaceholder(text, accentName) {
    const map = {
      maroon: "#6b0f1a",
      blue: "#1d4ed8",
      green: "#166534",
      red: "#b91c1c"
    };
    const stroke = map[accentName] || map.maroon;

    const linesRaw = wrapToTwoLines(text);
    const lines = linesRaw.slice(0, 2); // keep it clean: max 2 lines
    const fontSize = computeFontSize(lines);

    const rectX = 22;
    const rectY = 22;
    const rectW = 1200 - rectX * 2;
    const rectH = 700 - rectY * 2;

    // Vertical centering for 1 or 2 lines
    let textBlock = "";
    if (lines.length === 1) {
      textBlock = `
        <text x="600" y="370" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="${fontSize}" font-weight="700"
          fill="${stroke}">
          ${escapeXml(lines[0])}
        </text>`;
    } else {
      const lineGap = Math.round(fontSize * 0.92);
      const y1 = 350 - Math.round(lineGap / 2);
      const y2 = y1 + lineGap;

      textBlock = `
        <text x="600" y="${y1}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="${fontSize}" font-weight="700"
          fill="${stroke}">
          <tspan x="600" dy="0">${escapeXml(lines[0])}</tspan>
          <tspan x="600" dy="${lineGap}">${escapeXml(lines[1])}</tspan>
        </text>`;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
        <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="40"
          fill="#ffffff" stroke="${stroke}" stroke-width="10"/>
        ${textBlock}
      </svg>`.trim();

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function escapeXml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }

  function applyPlaceholders() {
    // Apply to all images that declare a placeholder
    const imgs = $$("img[data-placeholder]");

    imgs.forEach((img) => {
      const phText = img.getAttribute("data-placeholder") || "Placeholder";
      const accent = img.getAttribute("data-accent") || "maroon";
      const realSrc = img.getAttribute("src") || "";

      // Set placeholder immediately
      img.src = svgPlaceholder(phText, accent);
      img.setAttribute("data-ph-ready", "1");

      // If there is no real src (or it's already a placeholder), stop
      if (!realSrc || realSrc.startsWith("data:image/svg+xml")) return;

      // Try to load the real image, swap in only if it works
      const tester = new Image();
      tester.decoding = "async";
      tester.loading = "lazy";

      tester.onload = () => {
        img.src = realSrc;
        img.classList.add("is-real");
        img.removeAttribute("data-ph-ready");
      };

      tester.onerror = () => {
        img.src = svgPlaceholder(phText, accent);
        img.classList.remove("is-real");
        img.setAttribute("data-ph-ready", "1");
      };

      tester.src = realSrc;
    });
  }

  async function fetchWeather() {
    const bar = $("#weather-bar");
    if (!bar) return;

    const cities = [
      { name: "Zurich", lat: 47.3769, lon: 8.5417 },
      { name: "Jammu", lat: 32.7266, lon: 74.8570 },
      { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
      { name: "Ladakh", lat: 34.1526, lon: 77.5771 },
      { name: "Gilgit", lat: 35.9208, lon: 74.3081 },
      { name: "Baltistan", lat: 35.2971, lon: 75.6333 },
      { name: "Muzaffarabad", lat: 34.3700, lon: 73.4708 },
      { name: "Rawalakot", lat: 33.8584, lon: 73.7669 }
    ];

    bar.innerHTML = "";

    for (const c of cities) {
      const chip = document.createElement("div");
      chip.className = "chip tiny wx-chip";
      chip.textContent = `${c.name}: …°C`;
      bar.appendChild(chip);

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(c.lat)}&longitude=${encodeURIComponent(c.lon)}&current=temperature_2m&temperature_unit=celsius&timezone=auto`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();

        const t =
          data && data.current && typeof data.current.temperature_2m === "number"
            ? data.current.temperature_2m
            : null;

        chip.textContent = `${c.name}: ${t === null ? "—" : t.toFixed(1)}°C`;
      } catch {
        chip.textContent = `${c.name}: —°C`;
      }
    }
  }

  function setupContactModal() {
    const modal = $("#contact-modal");
    const openBtn = $("#open-contact");
    const closeBtn = $("#close-contact");

    if (!modal || !openBtn || !closeBtn) return;

    openBtn.addEventListener("click", () => {
      if (typeof modal.showModal === "function") modal.showModal();
    });

    closeBtn.addEventListener("click", () => {
      if (typeof modal.close === "function") modal.close();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal && typeof modal.close === "function") modal.close();
    });
  }

  function setupShare() {
    const btn = $("#share-btn");
    const stickyShare = $("#sticky-share");

    async function doShare() {
      const url = location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title: document.title, url });
          return;
        }
      } catch {}

      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied.");
      } catch {
        prompt("Copy link:", url);
      }
    }

    if (btn) btn.addEventListener("click", doShare);
    if (stickyShare) stickyShare.addEventListener("click", doShare);
  }

  function setupSearch() {
    window.fakeSearch = function fakeSearch() {
      const q = ($("#search-input")?.value || "").trim();
      if (!q) return;
      alert(`Search is a placeholder for now. You searched: ${q}`);
    };

    const stickySearch = $("#sticky-search");
    if (stickySearch) {
      stickySearch.addEventListener("click", () => {
        const input = $("#search-input");
        if (input) input.focus();
      });
    }
  }

  function setupDropdowns() {
    const items = $$(".nav-item.has-sub");

    function closeAll(except) {
      items.forEach((li) => {
        if (li !== except) li.classList.remove("open");
        const btn = li.querySelector(".nav-btn");
        if (btn) btn.setAttribute("aria-expanded", li.classList.contains("open") ? "true" : "false");
      });
    }

    items.forEach((li) => {
      const btn = li.querySelector(".nav-btn");
      if (!btn) return;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const willOpen = !li.classList.contains("open");
        closeAll();
        li.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    document.addEventListener("click", (e) => {
      const nav = $(".navbar");
      if (!nav) return;
      if (!nav.contains(e.target)) closeAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  function setupMobileMenu() {
    const hamburger = $("#hamburger");
    const mobileMenu = $("#mobile-menu");
    const navList = $("#nav-list");

    if (!hamburger || !mobileMenu || !navList) return;

    function buildMobile() {
      mobileMenu.innerHTML = "";

      const ul = document.createElement("ul");
      ul.className = "nav-list mobile";

      $$(".nav-item", navList).forEach((li) => {
        const clone = li.cloneNode(true);

        const btn = clone.querySelector("button.nav-btn");
        const dd = clone.querySelector(".dropdown");

        if (btn && dd) {
          const wrap = document.createElement("div");
          wrap.className = "mobile-dd";

          const topBtn = document.createElement("button");
          topBtn.type = "button";
          topBtn.className = "nav-btn";
          topBtn.textContent = btn.textContent;

          const panel = document.createElement("div");
          panel.className = "dropdown";
          panel.innerHTML = dd.innerHTML;
          panel.hidden = true;

          topBtn.addEventListener("click", () => {
            panel.hidden = !panel.hidden;
          });

          wrap.appendChild(topBtn);
          wrap.appendChild(panel);

          const liWrap = document.createElement("li");
          liWrap.className = "nav-item has-sub";
          liWrap.appendChild(wrap);

          ul.appendChild(liWrap);
        } else {
          const a = clone.querySelector("a.nav-btn") || clone.querySelector("a");
          if (a) {
            const liWrap = document.createElement("li");
            liWrap.className = "nav-item";
            liWrap.appendChild(a);
            ul.appendChild(liWrap);
          }
        }
      });

      mobileMenu.appendChild(ul);

      $$("a", mobileMenu).forEach((a) => {
        a.addEventListener("click", () => {
          mobileMenu.hidden = true;
          hamburger.setAttribute("aria-expanded", "false");
        });
      });
    }

    buildMobile();

    hamburger.addEventListener("click", () => {
      const isOpen = !mobileMenu.hidden;
      mobileMenu.hidden = isOpen;
      hamburger.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });

    const stickyMenu = $("#sticky-menu");
    if (stickyMenu) {
      stickyMenu.addEventListener("click", () => hamburger.click());
    }
  }

  function setupReadMore() {
    $$(".read-more").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Read More is a placeholder. Next step is connecting articles.json to a full article page.");
      });
    });
  }

  function setupYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function init() {
    setupYear();
    setClocks();
    setInterval(setClocks, 1000);

    applyPlaceholders();
    fetchWeather();

    setupDropdowns();
    setupMobileMenu();

    setupSearch();
    setupShare();
    setupReadMore();
    setupContactModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
