(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- CLOCKS & CALENDARS ---------------- */

  function updateTime() {
    const now = new Date();

    const cest = $("#clock-cest span");
    if (cest) {
      cest.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const ist = $("#tz-ist span");
    if (ist) {
      ist.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const pkt = $("#tz-pkt span");
    if (pkt) {
      pkt.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);
    }

    const hijri = $("#cal-hijri span");
    if (hijri) {
      try {
        hijri.textContent = new Intl.DateTimeFormat(
          "en-GB-u-ca-islamic-umalqura",
          { day: "numeric", month: "long", year: "numeric" }
        ).format(now);
      } catch {
        hijri.textContent = "Hijri";
      }
    }

    const saka = $("#cal-hindi span");
    if (saka) {
      try {
        saka.textContent = new Intl.DateTimeFormat(
          "en-GB-u-ca-indian",
          { day: "numeric", month: "long", year: "numeric" }
        ).format(now);
      } catch {
        saka.textContent = "Saka";
      }
    }
  }

  /* ---------------- WEATHER ---------------- */

  async function loadWeather() {
    const bar = $("#weather-bar");
    if (!bar) return;

    const cities = [
      ["Zurich", 47.37, 8.54],
      ["Jammu", 32.72, 74.85],
      ["Kashmir", 34.08, 74.79],
      ["Ladakh", 34.15, 77.57],
      ["Gilgit", 35.92, 74.30],
      ["Baltistan", 35.29, 75.63],
      ["Muzaffarabad", 34.37, 73.47],
      ["Rawalakot",]()
