/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   ============================================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing...");
    
    // Initialize all components
    initLoader();
    initYear();
    updateClocks();
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
    
    // Set up clock to update every second
    setInterval(updateClocks, 1000);
});

/* ============================
   LOADER
   ============================ */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) {
        console.log("Loader not found");
        return;
    }
    
    console.log("Initializing loader...");
    
    // Hide loader after 1.5 seconds
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() {
            loader.style.display = "none";
            console.log("Loader hidden");
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
   CLOCKS
   ============================ */
function updateClocks() {
    const now = new Date();
    
    // Format date for CEST display
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // Update CEST (Zurich) clock with full date
    const cest = document.getElementById("clock-cest");
    if (cest) {
        const zurichTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Europe/Zurich",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const fullDate = now.toLocaleDateString("en-GB", options);
        const span = cest.querySelector("span");
        if (span) {
            span.textContent = fullDate + " at " + zurichTime;
        }
    }
    
    // Update IST
    const ist = document.getElementById("tz-ist");
    if (ist) {
        const istTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const span = ist.querySelector("span");
        if (span) {
            span.textContent = istTime;
        }
    }
    
    // Update PKT
    const pkt = document.getElementById("tz-pkt");
    if (pkt) {
        const pktTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const span = pkt.querySelector("span");
        if (span) {
            span.textContent = pktTime;
        }
    }
}

/* ============================
   HIJRI CALENDAR
   ============================ */
function updateHijri() {
    const hijriEl = document.querySelector("#cal-hijri span");
    if (!hijriEl) return;
    
    try {
        const now = new Date();
        // Using Islamic calendar
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        
        hijriEl.textContent = hijriDate + " AH";
    } catch (e) {
        console.log("Hijri calendar error:", e);
        hijriEl.textContent = "Ramadan 27, 1447 AH"; // Fallback
    }
}

/* ============================
   BIKRAMI CALENDAR
   ============================ */
function updateBikrami() {
    const el = document.querySelector("#cal-bikrami span");
    if (!el) return;
    
    // For demo purposes - in production use proper Bikrami calendar library
    const today = new Date();
    const months = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    // Approximate calculation
    const monthIndex = today.getMonth();
    const day = today.getDate();
    const year = today.getFullYear() + 57; // Convert to Bikrami year
    
    el.textContent = `${day} ${months[monthIndex]} ${year} VS`;
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
    
    bar.innerHTML = cities.map(function(c) {
        return `<li>🌡️ ${c.name}: <strong>${c.temp}</strong></li>`;
    }).join("");
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
    const ul = document.getElementById("ticker-items");
    if (!ul) return;
    
    // Duplicate items for continuous scroll
    const allItems = TICKER_ITEMS.concat(TICKER_ITEMS);
    ul.innerHTML = allItems.map(function(t) {
        return `<li>${t}</li>`;
    }).join("");
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
            // Clone the nav list for mobile
            mobileMenu.innerHTML = '<ul class="nav-list">' + navList.innerHTML + '</ul>';
        }
    });
    
    // Handle dropdowns on desktop
    const dropdowns = document.querySelectorAll(".has-sub");
    dropdowns.forEach(function(item) {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        
        if (btn && dropdown) {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                // Close all other dropdowns
                dropdowns.forEach(function(other) {
                    if (other !== item) {
                        const otherDropdown = other.querySelector(".dropdown");
                        if (otherDropdown) {
                            otherDropdown.style.display = "none";
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
        }
    });
    
    // Close dropdowns when clicking outside
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
    
    if (!openBtn || !closeBtn || !modal) return;
    
    openBtn.addEventListener("click", function() {
        modal.classList.remove("hidden");
    });
    
    closeBtn.addEventListener("click", function() {
        modal.classList.add("hidden");
    });
    
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
}

/* ============================
   VLOGS
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Sample vlog data
    const videos = [
        {
            id: "sample1",
            title: "Exclusive Interview | The Mirror Jammu Kashmir",
            description: "In-depth interview on peace, justice, and human rights.",
            duration: "15:32"
        },
        {
            id: "sample2",
            title: "Ground Report | Community Voices",
            description: "Voices from the ground. Real stories. Real people.",
            duration: "12:45"
        },
        {
            id: "sample3",
            title: "Analysis | Human Rights Framework",
            description: "Legal and political analysis of ongoing human rights issues.",
            duration: "18:20"
        }
    ];
    
    if (visitBtn) {
        visitBtn.addEventListener("click", function() {
            window.open("https://youtube.com/@TheMirrorJammuKashmir", "_blank");
        });
    }
    
    grid.innerHTML = videos.map(function(v) {
        return `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>${v.description}</p>
                </div>
            </article>
        `;
    }).join("");
}

/* ============================
   LANGUAGE SELECTOR
   ============================ */
function initLanguageSelector() {
    const select = document.getElementById("language-select");
    if (!select) return;
    
    select.addEventListener("change", function(e) {
        const lang = e.target.value;
        const langNames = {
            en: "English", de: "German", fr: "French", ru: "Russian",
            he: "Hebrew", es: "Spanish", nl: "Dutch", ur: "Urdu",
            hi: "Hindi", ar: "Arabic"
        };
        alert("Language changed to " + (langNames[lang] || lang));
    });
}

/* ============================
   SEARCH
   ============================ */
function initSearch() {
    const searchForm = document.querySelector(".search");
    const searchInput = document.getElementById("search-input");
    
    if (!searchForm || !searchInput) return;
    
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            alert("Searching for: " + query);
        }
    });
}

/* ============================
   SOCIAL BUTTONS
   ============================ */
function initSocialButtons() {
    const buttons = document.querySelectorAll(".sa-btn");
    
    buttons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            const text = btn.textContent.trim();
            if (text.includes("Like")) {
                alert("Thank you for liking!");
            } else if (text.includes("Subscribe")) {
                alert("Thank you for subscribing!");
            } else if (text.includes("Share")) {
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: window.location.href
                    }).catch(function() {});
                } else {
                    alert("Sharing is not supported on this device");
                }
            }
        });
    });
}

/* ============================
   COPY LINK FUNCTION
   ============================ */
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(function() {
            alert("Link copied to clipboard!");
        })
        .catch(function() {
            alert("Failed to copy link");
        });
}
