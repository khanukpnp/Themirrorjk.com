(function () {
  "use strict";

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function inHeader(el) {
    if (!el) return false;
    const header = qs("header") || document.body;
    return header.contains(el);
  }

  function findByText(regex) {
    const candidates = qsa("span,strong,div,p,li,a,button").filter(el => {
      if (!inHeader(el)) return false;
      const t = (el.textContent || "").trim();
      if (!t) return false;
      if (t.length > 80) return false;
      return regex.test(t);
    });

    return candidates.length ? candidates[0] : null;
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value;
  }

  function formatCESTDateTime() {
    try {
      const now = new Date();
      const datePart = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(now);

      const timePart = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich",
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
      return "--:--:--";
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
      return "Unavailable";
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
      return "Unavailable";
    }
  }

  function locateHeaderFields() {
    const elCEST = qs("#dateTime, #currentDateTime, #datetime, [data-datetime], .date-time") || findByText(/CEST/i);
    const elHijri = qs("#hijriDate, #hijri-date, [data-hijri], .hijri-date") || findByText(/Hijri|Rajab|Muharram|Safar|Rabi|Jumada|Shaban|Ramadan|Dhul/i);
    const elSaka = qs("#sakaDate, #saka-date, [data-saka], .saka-date") || findByText(/\bVS\b|Saka|Phalguna|Chaitra|Baisakh|Kartika|Magha/i);
    const elIST = qs("#istTime, #ist-time, [data-ist], .ist-time") || findByText(/\bIST\b/i);
    const elPKT = qs("#pktTime, #pkt-time, [data-pkt], .pkt-time") || findByText(/\bPKT\b/i);

    return { elCEST, elHijri, elSaka, elIST, elPKT };
  }

  function renderHeaderClocks() {
    const { elCEST, elHijri, elSaka, elIST, elPKT } = locateHeaderFields();

    if (elCEST) {
      const hasWordCEST = /CEST/i.test((elCEST.textContent || ""));
      setText(elCEST, hasWordCEST ? formatCESTDateTime() : formatCESTDateTime());
    }

    if (elHijri) {
      const t = formatHijri();
      setText(elHijri, t);
    }

    if (elSaka) {
      const t = formatSaka();
      setText(elSaka, t);
    }

    if (elIST) {
      const t = formatTime("Asia/Kolkata");
      const label = /IST/i.test((elIST.textContent || "")) ? "IST (JKL): " : "";
      setText(elIST, label ? `${label}${t}` : t);
    }

    if (elPKT) {
      const t = formatTime("Asia/Karachi");
      const label = /PKT/i.test((elPKT.textContent || "")) ? "PKT (GBM): " : "";
      setText(elPKT, label ? `${label}${t}` : t);
    }
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

  function findOrCreateTempRow() {
    let row =
      qs("#regionalTemps, #regional-temps, #weatherPills, #weather-chips, .weather-pills, .regional-temps, [data-regional-temps]");

    if (row) return row;

    const header = qs("header");
    if (!header) return null;

    const anchor = findByText(/CEST|Hijri|VS|IST|PKT/i);
    const anchorRow = anchor ? anchor.closest("div") : null;

    row = document.createElement("div");
    row.className = "tm-weather-row";
    row.id = "regional-temps";

    if (anchorRow && anchorRow.parentElement) {
      anchorRow.parentElement.insertBefore(row, anchorRow.nextSibling);
    } else {
      header.appendChild(row);
    }

    return row;
  }

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

  function renderTemps(row, items) {
    if (!row) return;
    row.innerHTML = items.map(it => {
      const t = it.temp === null ? "--" : `${Math.round(it.temp * 10) / 10}°C`;
      return `<span class="tm-weather-pill">${it.name}: ${t}</span>`;
    }).join("");
  }

  async function loadTemps() {
    const row = findOrCreateTempRow();
    if (!row) return;

    renderTemps(row, CITIES.map(c => ({ name: c.name, temp: null })));

    try {
      const results = await Promise.allSettled(CITIES.map(fetchTemp));
      const ok = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

      if (ok.length) renderTemps(row, ok);
    } catch {
      // keep placeholders
    }
  }

  function setupDropdowns() {
    const nav = qs("nav");
    if (!nav) return;

    const items = qsa("li", nav);
    items.forEach(li => {
      const sub = li.querySelector("ul, .dropdown, .submenu");
      const a = li.querySelector(":scope > a");
      if (!sub || !a) return;

      li.classList.add("has-submenu");

      a.addEventListener("click", (e) => {
        const isMobile = window.matchMedia("(max-width: 900px)").matches;
        if (!isMobile) return;

        const href = (a.getAttribute("href") || "").trim();
        const hasRealLink = href && href !== "#";

        if (hasRealLink && !li.classList.contains("open")) {
          e.preventDefault();
          li.classList.add("open");
          return;
        }

        if (!hasRealLink) {
          e.preventDefault();
          li.classList.toggle("open");
        }
      });
    });

    document.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (!isMobile) return;
      if (e.target.closest("nav")) return;
      qsa("li.has-submenu.open", nav).forEach(li => li.classList.remove("open"));
    });
  }

  function boot() {
    renderHeaderClocks();
    setInterval(renderHeaderClocks, 1000);

    setupDropdowns();

    loadTemps();
    setInterval(loadTemps, 10 * 60 * 1000);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
