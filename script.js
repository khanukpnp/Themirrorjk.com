/* ============================================================
   PAGE LOADER
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("site-loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 600);
    }, 1200);
  }

  initYear();
  updateGregorian();
  updateHijri();
  updateBikrami();
  updateClocks();
  initWeatherBar();
  initTicker();
  initNav();
  initContactModal();
  initVlogs();

  setInterval(updateGregorian, 1000);
  setInterval(updateHijri, 60000);
  setInterval(updateBikrami, 60000);
  setInterval(updateClocks, 1000);
});

/* ============================================================
   FOOTER YEAR
============================================================ */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ============================================================
   GREGORIAN DATE (FULL DATE + TIME)
   Example: Friday, 20 February 2026 at 19:50:20
============================================================ */
function updateGregorian() {
  const el = document.querySelector("#cal-gregorian span");
  if (!el) return;

  const now = new Date();
  const datePart = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const timePart = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  el.textContent = `${datePart} at ${timePart}`;
}

/* ============================================================
   HIJRI DATE (Islamic calendar)
============================================================ */
function updateHijri() {
  const el = document.querySelector("#cal-hijri span");
  if (!el) return;

  try {
    const now = new Date();
    const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
    el.textContent = hijriDate;
  } catch (e) {
    el.textContent = "Hijri calendar";
  }
}

/* ============================================================
   PUNJABI DESI BIKRAMI DATE (Simplified)
============================================================ */
function updateBikrami() {
  const el = document.querySelector("#cal-bikrami span");
  if (!el) return;

  const now = new Date();

  const months = [
    "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
    "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
  ];

  const startMonth = 2; // Chet begins mid‑March (0=Jan,1=Feb,2=Mar)
  const month = (now.getMonth() - startMonth + 12) % 12;
  const year = now.getFullYear() + 57; // Bikrami offset
  const day = now.getDate();

  el.textContent = `${day} ${months[month]} ${year} BK`;
}

/* ============================================================
   CLOCKS — CEST / IST / PKT
============================================================ */
function updateClocks() {
  const now = new Date();

  // CEST (Europe/Zurich)
  const cestEl = document.querySelector("#clock-cest span");
  if (cestEl) {
    const cestTime = now.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    cestEl.textContent = cestTime;
  }

  // IST (Asia/Kolkata)
  const istEl = document.querySelector("#tz-ist span");
  if (istEl) {
    const istTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    istEl.textContent = istTime;
  }

  // PKT (Asia/Karachi)
  const pktEl = document.querySelector("#tz-pkt span");
  if (pktEl) {
    const pktTime = now.toLocaleTimeString("en-PK", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    pktEl.textContent = pktTime;
  }
}

/* ============================================================
   WEATHER BAR (STATIC SAMPLE, MATCHING YOUR CITIES)
============================================================ */
function initWeatherBar() {
  const bar = document.getElementById("weather-bar");
  if (!bar) return;

  const cities = [
    { name: "Zurich",       temp: "7°C"  },
    { name: "Rawalakot",    temp: "9°C"  },
    { name: "Jammu",        temp: "18°C" },
    { name: "Kashmir",      temp: "5°C"  },
    { name: "Ladakh",       temp: "2°C"  },
    { name: "Gilgit",       temp: "3°C"  },
    { name: "Baltistan",    temp: "3°C"  },
    { name: "Muzaffarabad", temp: "8°C"  }
  ];

  bar.innerHTML = cities
    .map(
      c => `
      <div class="chip tiny">
        🌡️ ${c.name}: <strong>${c.temp}</strong>
      </div>
    `
    )
    .join("");
}

/* ============================================================
   TICKER (DUMMY PLACEHOLDER ITEMS)
============================================================ */
function initTicker() {
  const ul = document.getElementById("ticker-items");
  if (!ul) return;

  const items = [
    "WE DO NOT MANUFACTURE NARRATIVES — WE REFLECT REALITY",
    "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH"
  ];

  ul.innerHTML = items.map(t => `<li>${t}</li>`).join("");
}

/* ============================================================
   NAVIGATION (MOBILE MENU)
============================================================ */
function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !navList || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));

    if (expanded) {
      mobileMenu.hidden = true;
      mobileMenu.innerHTML = "";
    } else {
      mobileMenu.hidden = false;
      mobileMenu.innerHTML = navList.innerHTML;
    }
  });
}

/* ============================================================
   CONTACT MODAL
============================================================ */
function initContactModal() {
  const openBtn = document.getElementById("contact-open");
  const closeBtn = document.getElementById("contact-close");
  const modal = document.getElementById("contact-modal");

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

/* ============================================================
   VLOGS (STATIC PLACEHOLDERS)
============================================================ */
function initVlogs() {
  const grid = document.getElementById("vlogs-grid");
  if (!grid) return;

  const vlogs = [
    { title: "Kashmir Protest Highlights", duration: "4:32" },
    { title: "Diaspora Voices on Human Rights", duration: "6:10" },
    { title: "Brief History of Jammu & Kashmir", duration: "8:45" }
  ];

  grid.innerHTML = vlogs
    .map(
      v => `
      <article class="card">
        <div class="media maroon">
          ▶
        </div>
        <div class="card-body">
          <h3>${v.title}</h3>
          <p>Duration: ${v.duration}</p>
        </div>
      </article>
    `
    )
    .join("");
}
