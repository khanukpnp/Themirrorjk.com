/* FILE: script.js (full replacement) */
(() => {
  "use strict";

  if (window.__TMJK_BOOTED__) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function setSpanText(containerId, text) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const span = el.querySelector("span");
    if (!span) return;
    span.textContent = text;
  }

  function formatDateTimeInTZ(tz) {
    try {
      const d = new Date();
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).formatToParts(d);

      const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
      return `${map.weekday}, ${map.day} ${map.month} ${map.year} at ${map.hour}:${map.minute}:${map.second}`;
    } catch {
      return "";
    }
  }

  function formatTimeInTZ(tz) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(new Date());
    } catch {
      return "—:—";
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
      return "Hijri unavailable";
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
      return "VS unavailable";
    }
  }

  function renderClocks() {
    setSpanText("clock-cest", formatDateTimeInTZ("Europe/Zurich"));
    setSpanText("cal-hijri", formatHijri());
    setSpanText("cal-hindi", formatSaka());
    setSpanText("tz-ist", formatTimeInTZ("Asia/Kolkata"));
    setSpanText("tz-pkt", formatTimeInTZ("Asia/Karachi"));
  }

  const CITIES = [
    { name: "Zurich", lat: 47.3769, lon: 8.5417 },
    { name: "Jammu", lat: 32.7266, lon: 74.8570 },
    { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
    { name: "Ladakh", lat: 34.1526, lon: 77.5770 },
    { name: "Gilgit", lat: 35.9208, lon: 74.3146 },
    { name: "Baltistan", lat: 35.3270, lon: 75.5510 },
    { name: "Muzaffarabad", lat: 34.37, lon: 73.47 },
    { name: "Rawalakot", lat: 33.857, lon: 73.763 }
  ];

  async function fetchTemp(city) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(city.lat)}` +
      `&longitude=${encodeURIComponent(city.lon)}` +
      "&current=temperature_2m" +
      "&timezone=auto";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("weather");
    const data = await res.json();

    const temp =
      data && data.current && typeof data.current.temperature_2m === "number"
        ? data.current.temperature_2m
        : null;

    return { name: city.name, temp };
  }

  function renderWeatherBar(items) {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;

    bar.innerHTML = items.map(it => {
      const t = it.temp === null ? "--" : `${Math.round(it.temp * 10) / 10}°C`;
      return `<span class="weather-pill">${it.name}: ${t}</span>`;
    }).join("");
  }

  async function loadWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;

    renderWeatherBar(CITIES.map(c => ({ name: c.name, temp: null })));

    try {
      const results = await Promise.allSettled(CITIES.map(fetchTemp));
      const ok = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

      if (ok.length) renderWeatherBar(ok);
    } catch {
      // keep placeholders
    }
  }

  function setupDropdowns() {
    const nav = $(".navbar");
    if (!nav) return;

    function closeAll() {
      $$(".nav-item.has-sub.open", nav).forEach(li => li.classList.remove("open"));
    }

    $$(".nav-item.has-sub", nav).forEach(li => {
      const btn = $(".nav-btn", li);
      if (!btn) return;

      btn.addEventListener("click", (e) => {
        const isMobile = window.matchMedia("(max-width: 900px)").matches;
        if (!isMobile) return;

        e.preventDefault();
        const willOpen = !li.classList.contains("open");
        closeAll();
        if (willOpen) li.classList.add("open");
      });
    });

    document.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (!isMobile) return;
      if (e.target.closest(".navbar")) return;
      closeAll();
    });

    window.addEventListener("resize", closeAll);
  }

  function setupMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const navList = document.getElementById("nav-list");
    if (!hamburger || !mobileMenu || !navList) return;

    if (!mobileMenu.dataset.built) {
      const clone = navList.cloneNode(true);
      clone.id = "nav-list-mobile";
      mobileMenu.appendChild(clone);
      mobileMenu.dataset.built = "1";
    }

    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobileMenu.hidden = expanded;
    });

    document.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (!isMobile) return;
      if (e.target.closest(".navbar")) return;
      mobileMenu.hidden = true;
      hamburger.setAttribute("aria-expanded", "false");
    });
  }

  function setupContactModal() {
    const openBtn = document.getElementById("open-contact");
    const closeBtn = document.getElementById("close-contact");
    const modal = document.getElementById("contact-modal");
    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        if (typeof modal.showModal === "function") modal.showModal();
        else modal.setAttribute("open", "open");
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (typeof modal.close === "function") modal.close();
        else modal.removeAttribute("open");
      });
    }
  }

  function setupYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function setupShare() {
    const btn = document.getElementById("share-btn");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      const url = window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({ title: document.title, url });
          return;
        }
      } catch {}

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          const old = btn.textContent;
          await navigator.clipboard.writeText(url);
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = old), 1200);
        }
      } catch {}
    });
  }

  function setupSearch() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (input.value || "").trim().toLowerCase();
      if (!q) return;

      const cards = document.querySelectorAll(".card.post, .card.rail, .card.video");
      cards.forEach(card => {
        const t = (card.textContent || "").toLowerCase();
        card.style.display = t.includes(q) ? "" : "none";
      });
    });
  }

  function boot() {
    renderClocks();
    setInterval(renderClocks, 1000);

    loadWeatherBar();
    setInterval(loadWeatherBar, 10 * 60 * 1000);

    setupDropdowns();
    setupMobileMenu();
    setupContactModal();
    setupYear();
    setupShare();
    setupSearch();

    window.__TMJK_BOOTED__ = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
