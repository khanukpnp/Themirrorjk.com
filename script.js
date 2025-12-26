(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function pad(n) {
    return String(n).padStart(2, "0");
  }

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
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }

  function formatTimeInTZ(tz) {
    try {
      const d = new Date();
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(d);
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
    { name: "Muzaffarabad", lat: 34.3700, lon: 73.4700 },
    { name: "Rawalakot", lat: 33.8570, lon: 73.7630 }
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

    bar.innerHTML = items
      .map(it => {
        const t = it.temp === null ? "--" : `${Math.round(it.temp * 10) / 10}°C`;
        return `<span class="weather-pill">${it.name}: ${t}</span>`;
      })
      .join("");
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

  function closeAllDropdowns(nav) {
    $$(".nav-item.has-sub.open", nav).forEach(li => li.classList.remove("open"));
  }

  function setupDropdowns() {
    const nav = $(".navbar");
    if (!nav) return;

    $$(".nav-item.has-sub", nav).forEach(li => {
      const btn = $(".nav-btn", li);
      const drop = $(".dropdown", li);
      if (!btn || !drop) return;

      btn.addEventListener("click", (e) => {
        const isMobile = window.matchMedia("(max-width: 900px)").matches;
        if (!isMobile) return;

        e.preventDefault();
        const willOpen = !li.classList.contains("open");
        closeAllDropdowns(nav);
        if (willOpen) li.classList.add("open");
      });
    });

    document.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (!isMobile) return;
