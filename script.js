/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   RESTORED CALENDARS, WEATHER, AND ALL CONTENT
   ============================================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing...");
    
    // Initialize all components
    initLoader();
    initYear();
    initClocks();
    updateHijri();
    updateBikrami();
    initWeatherBar();
    initTicker();
    initNav();
    initContactModal();
    initVlogs();
    initLanguageSelector();
    initSearch();
    initSocialButtons();
    initFileUpload();
    initNewsletter();
    
    // Load all content
    loadAllContent();
    
    // Set up clock to update every second
    setInterval(updateClocks, 1000);
});

/* ============================
   LOADER
   ============================ */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() {
            loader.style.display = "none";
        }, 300);
    }, 1500);
}

/* ============================
   FOOTER YEAR
   ============================ */
function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================
   CLOCKS - RESTORED WITH FULL DATE
   ============================ */
function initClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // Get the datetime bar element
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    // Format: Wednesday, 18 March 2026 at 07:18:39
    const zurichTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const fullDate = now.toLocaleDateString("en-GB", options);
    const cestText = fullDate + " at " + zurichTime;
    
    // IST
    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const istHours = now.getHours();
    const istAmpm = istHours >= 12 ? 'pm' : 'am';
    const istFull = istTime + ' ' + istAmpm;
    
    // PKT
    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const pktHours = now.getHours();
    const pktAmpm = pktHours >= 12 ? 'pm' : 'am';
    const pktFull = pktTime + ' ' + pktAmpm;
    
    // Update the datetime bar
    datetimeBar.innerHTML = `
        <span>${cestText}</span>
        <span class="separator">•</span>
        <span id="cal-hijri"></span>
        <span class="separator">•</span>
        <span id="cal-bikrami"></span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istFull}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktFull}</strong></span>
    `;
}

/* ============================
   HIJRI CALENDAR
   ============================ */
function updateHijri() {
    const hijriEl = document.getElementById("cal-hijri");
    if (!hijriEl) return;
    
    try {
        const now = new Date();
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        hijriEl.textContent = hijriDate + " AH";
    } catch(e) {
        hijriEl.textContent = "Ramadan 27, 1447 AH";
    }
}

/* ============================
   BIKRAMI PUNJABI DESI CALENDAR
   ============================ */
function updateBikrami() {
    const vsEl = document.getElementById("cal-bikrami");
    if (!vsEl) return;
    
    const today = new Date();
    const day = today.getDate();
    
    const months = [
        "Chet", "Vaisakh", "Iyeshtha", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    const monthIndex = today.getMonth();
    const monthName = months[monthIndex];
    const bikramiYear = today.getFullYear() + 57;
    
    vsEl.textContent = day + " " + monthName + " " + bikramiYear + " VS";
}

/* ============================
   WEATHER BAR
   ============================ */
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    const cities = [
        { name: "Zurich", temp: "6°C" },
        { name: "Rawalakot", temp: "9°C" },
        { name: "Jammu", temp: "18°C" },
        { name: "Kashmir", temp: "4°C" },
        { name: "Ladakh", temp: "-2°C" },
        { name: "Gilgit", temp: "3°C" },
        { name: "Baltistan", temp: "-1°C" },
        { name: "Muzaffarabad", temp: "10°C" }
    ];
    
    let html = '';
    cities.forEach(function(c, index) {
        html += '<span>' + c.name + ': <strong>' + c.temp + '</strong></span>';
        if (index < cities.length - 1) {
            html += '<span class="separator">•</span>';
        }
    });
    
    bar.innerHTML = html;
}

/* ============================
   TICKER
   ============================ */
const TICKER_ITEMS = [
    "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
    "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
    "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
    "HOPE BECOMES REAL THROUGH ACTION, PERSISTENCE AND PRINCIPLED JOURNALISM",
    "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1",
    "EQUALITY WITHOUT DISCRIMINATION IS A RIGHT, NOT A PRIVILEGE",
    "DEMOCRACY DERIVES LEGITIMACY FROM THE WILL AND PARTICIPATION OF THE PEOPLE",
    "DEMOCRACY CANNOT SURVIVE WHERE HUMAN RIGHTS ARE VIOLATED OR POPULATIONS EXCLUDED",
    "THE MIRROR JAMMU KASHMIR STANDS AGAINST THE GLOBAL EROSION OF HUMAN RIGHTS",
    "NEO-COLONIAL PRACTICES AND MODERN FORMS OF SLAVERY REMAIN PRESENT-DAY REALITIES",
    "JAMMU KASHMIR --- A MULTI-RELIGIOUS, MULTI-CULTURAL, MULTI-LINGUAL AND MULTI-ETHNIC SOCIETY",
    "SINCE 1947 THE PEOPLE OF JAMMU KASHMIR HAVE REMAINED FORCIBLY DIVIDED",
    "FREEDOM OF MOVEMENT ACROSS DIFFERENT PARTS OF THE STATE OF JAMMU KASHMIR HAS BEEN DENIED SINCE 1947",
    "FREEDOM OF EXPRESSION, PEACEFUL ASSEMBLY AND ASSOCIATION ARE RESTRICTED",
    "INDEPENDENT JOURNALISM IS INCREASINGLY MARGINALIZED --- FREEDOM OF THE PRESS IS ESSENTIAL",
    "WE PRESENT VERIFIED FACTS, TREATIES AND GROUND REALITIES",
    "WE REMIND STATES OF THEIR RESPONSIBILITIES UNDER INTERNATIONAL LAW AND UN OBLIGATIONS",
    "WE ASSESS POLICIES AGAINST PROMISES AND ACTIONS AGAINST PLEDGES",
    "WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY",
    "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH",
    "GOT NEWS, FEEDBACK OR URGENT UPDATES? CONTACT THE MIRROR JAMMU KASHMIR",
    "FOLLOW US ON YOUTUBE --- THE MIRROR JAMMU KASHMIR --- SUBSCRIBE, LIKE AND SHARE"
];

function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    renderTickerItems(TICKER_ITEMS);
}

function renderTickerItems(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    const allItems = items.concat(items);
    let html = '';
    allItems.forEach(function(t) {
        html += '<span>' + t + ' • </span>';
    });
    tickerItems.innerHTML = html;
}

/* ============================
   NAVIGATION
   ============================ */
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (!hamburger || !navList || !mobileMenu) return;
    
    hamburger.addEventListener("click", function() {
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
    
    // Dropdown handling
    const dropdowns = document.querySelectorAll(".has-sub");
    dropdowns.forEach(function(item) {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        
        if (btn && dropdown) {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                document.querySelectorAll(".dropdown").forEach(function(d) {
                    if (d !== dropdown) d.style.display = "none";
                });
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
        }
    });
    
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".has-sub")) {
            document.querySelectorAll(".dropdown").forEach(function(d) {
                d.style.display = "none";
            });
        }
    });
}

/* ============================
   CONTACT MODAL
   ============================ */
function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    const cancelBtn = document.getElementById("modal-cancel");
    const contactForm = document.getElementById("contact-form");
    
    if (!openBtn || !closeBtn || !modal) return;
    
    openBtn.addEventListener("click",
