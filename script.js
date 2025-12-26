// script.js
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function pad(n) {
    return String(n).padStart(2, "0");
  }

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
        const h = new Intl.DateTimeFormat("en-GB-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
        hijri.textContent = h;
      } catch {
        hijri.textContent = "Hijri";
      }
    }

    const saka = $("#cal-hindi span");
    if (saka) {
      try {
        const s = new Intl.DateTimeFormat("en-GB-u-ca-indian", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(now);
        saka.textContent = s;
      } catch {
        saka.textContent = "Saka";
      }
    }
  }

  function svgPlaceholder(text, accentName) {
    const map = {
      maroon: "#6b0f1a",
      blue: "#1d4ed8",
      green: "#166534",
      red: "#b91c1c"
    };
    const stroke = map[accentName] || map.maroon;

    const safeText = (text || "Placeholder").slice(0, 24);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
        <rect x="18" y="18" width="1164" height="664" rx="40" fill="#ffffff" stroke="${stroke}" stroke-width="10"/>
        <text x="600" y="360" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="92" font-weight="700" fill="${stroke}">
          ${safeText}
        </text>
      </svg>`;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function applyPlaceholders() {
    const imgs = $$("img.img-ph");

    imgs.forEach((img) => {
      const phText = img.getAttribute("data-placeholder") || "Placeholder";
      const accent = img.getAttribute("data-accent") || "maroon";
      const realSrc = img.getAttribute("data-src");

      img.src = svgPlaceholder(phText, accent);

      if (!realSrc) return;

      const tester = new Image();
      tester.decoding = "async";
      tester.loading = "lazy";

      tester.onload = () => {
        img.src = realSrc;
        img.classList.add("is-real");
      };

      tester.onerror = () => {
        img.src = svgPlaceholder(phText, accent);
        img.classList.remove("is-real");
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
      { name: "Kashmir", lat: 34.0837, lon: 74.7973 },      // Srinagar
      { name: "Ladakh", lat: 34.1526, lon: 77.5771 },       // Leh
      { name: "Gilgit", lat: 35.9208, lon: 74.3081 },
      { name: "Baltistan", lat: 35.2971, lon: 75.6333 },    // Skardu
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
        const t = data && data.current && typeof data.current.temperature_2m === "number"
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
            panel.hidden = confirms(panel.hidden) ? false : true;
          });

          function confirms(hiddenState) {
            return hiddenState;
          }

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
