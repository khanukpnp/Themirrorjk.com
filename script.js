/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   FULLY RESTORED TO ORIGINAL DESIGN WITH MODERN FOOTER
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
    loadHomepageContent();
    
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
   CLOCKS - MATCHING ORIGINAL PNG FORMAT
   ============================ */
function initClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    
    // Format: Wednesday, 18 March 2026 at 07:18:39
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // CEST Clock (Zurich) with full date
    const cestEl = document.querySelector("#clock-cest span");
    if (cestEl) {
        const zurichTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Europe/Zurich",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const fullDate = now.toLocaleDateString("en-GB", options);
        cestEl.textContent = fullDate + " at " + zurichTime;
    }
    
    // IST (Jammu-Kashmir-Ladakh)
    const istEl = document.querySelector("#tz-ist span");
    if (istEl) {
        const istTime = now.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        istEl.textContent = istTime + (istTime.includes('am') || istTime.includes('pm') ? '' : 
            (now.getHours() >= 12 ? ' pm' : ' am'));
    }
    
    // PKT (Gilgit-Baltistan & AJK)
    const pktEl = document.querySelector("#tz-pkt span");
    if (pktEl) {
        const pktTime = now.toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        pktEl.textContent = pktTime + (pktTime.includes('am') || pktTime.includes('pm') ? '' : 
            (now.getHours() >= 12 ? ' pm' : ' am'));
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
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        
        // Format: Ramadan 27, 1447 AH
        hijriEl.textContent = hijriDate + " AH";
    } catch(e) {
        console.log("Hijri calendar error:", e);
        // Fallback to approximate date
        const today = new Date();
        const months = ["Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah", 
                        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
                        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban"];
        const month = months[today.getMonth() % 12];
        const year = 1447; // Approximate
        hijriEl.textContent = month + " " + today.getDate() + ", " + year + " AH";
    }
}

/* ============================
   BIKRAMI CALENDAR - MATCHING PNG (16 Iyeshtha 2083 VS)
   ============================ */
function updateBikrami() {
    const vsEl = document.querySelector("#cal-bikrami span");
    if (!vsEl) return;
    
    const now = new Date();
    const months = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    // Bikrami year = Gregorian + 57
    const bikramiYear = now.getFullYear() + 57;
    const monthIndex = now.getMonth();
    const monthName = months[monthIndex];
    const day = now.getDate();
    
    vsEl.textContent = day + " " + monthName + " " + bikramiYear + " VS";
}

/* ============================
   WEATHER BAR - ALL REGIONS FROM PNG
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
        return "<li>🌡️ " + c.name + ": <strong>" + c.temp + "</strong></li>";
    }).join("");
}

/* ============================
   TICKER - ORIGINAL MESSAGES
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
    
    // Duplicate items for seamless scrolling
    const allItems = TICKER_ITEMS.concat(TICKER_ITEMS);
    tickerItems.innerHTML = allItems.map(function(t) {
        return "<span>" + t + " • </span>";
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
            // Clone the nav items for mobile
            const items = navList.querySelectorAll(".nav-item");
            let mobileHTML = '<ul class="nav-list">';
            items.forEach(function(item) {
                const link = item.querySelector(".nav-btn");
                if (link) {
                    mobileHTML += '<li class="nav-item"><a href="' + link.getAttribute('href') + '" class="nav-btn">' + link.textContent + '</a></li>';
                }
            });
            mobileHTML += '</ul>';
            mobileMenu.innerHTML = mobileHTML;
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
   VLOGS - MATCHING PNG CONTENT
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Vlog data matching the PNG screenshots
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
            en: "English", de: "German", fr: "French", 
            ur: "Urdu", hi: "Hindi", ar: "Arabic"
        };
        alert("Language changed to " + (langNames[lang] || lang));
    });
}

/* ============================
   SEARCH FUNCTIONALITY
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
            // Implement actual search here
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

/* ============================
   FILE UPLOAD - E-PAPER
   ============================ */
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const fileNameSpan = document.querySelector(".file-name");
    
    if (!fileInput || !fileNameSpan) return;
    
    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            fileNameSpan.textContent = fileInput.files[0].name;
        } else {
            fileNameSpan.textContent = "No file chosen";
        }
    });
    
    const uploadForm = document.querySelector(".epaper-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", function(e) {
            e.preventDefault();
            if (fileInput.files.length > 0) {
                alert("File '" + fileInput.files[0].name + "' ready for upload. (Demo mode)");
            } else {
                alert("Please select a file first.");
            }
        });
    }
}

/* ============================
   NEWSLETTER SUBSCRIPTION
   ============================ */
function initNewsletter() {
    const subscribeBtn = document.getElementById("subscribeBtn");
    const emailInput = document.getElementById("subscribeEmail");
    
    if (!subscribeBtn || !emailInput) return;
    
    subscribeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (email && email.includes("@") && email.includes(".")) {
            alert("Thank you for subscribing with " + email + "!");
            emailInput.value = "";
        } else {
            alert("Please enter a valid email address.");
        }
    });
}

/* ============================
   HOMEPAGE CONTENT LOADER - JSON BASED
   ============================ */
function loadHomepageContent() {
    // Try to load from JSON, fallback to default content
    fetch("content/index.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Content loaded from JSON", data);
            renderHomepageContent(data);
        })
        .catch(function(error) {
            console.log("JSON loading failed, using default content", error);
            loadDefaultContent();
        });
}

/* ============================
   RENDER HOMEPAGE CONTENT FROM JSON
   ============================ */
function renderHomepageContent(data) {
    const hp = data.homepage || data;
    
    // Top Stories
    if (hp.topStories) {
        renderTopStories(hp.topStories);
    }
    
    // Latest / Editorial / Historical
    if (hp.latest || hp.editorial || hp.historical) {
        renderLehSection({
            latest: hp.latest,
            editorial: hp.editorial,
            historical: hp.historical
        });
    }
    
    // Jammu Kashmir
    if (hp.jammuKashmir) {
        renderJammuKashmir(hp.jammuKashmir);
    }
    
    // International
    if (hp.international) {
        renderInternational(hp.international);
    }
    
    // Human Rights
    if (hp.humanRights) {
        renderHumanRights(hp.humanRights);
    }
}

/* ============================
   DEFAULT CONTENT - MATCHING PNG SCREENSHOTS
   ============================ */
function loadDefaultContent() {
    console.log("Loading default content matching PNG screenshots");
    
    // Top Stories - Exactly as shown in PNG
    const topStoriesGrid = document.getElementById("top-stories-grid");
    if (topStoriesGrid) {
        topStoriesGrid.innerHTML = `
            <article class="card">
                <div class="media">
                    <img src="https://via.placeholder.com/400x200?text=Rawalakot+Protest" alt="Rawalakot Protest">
                </div>
                <div class="card-body">
                    <h3>Complete Shutter Down Paralyses Rawalakot Poonch as Thousands Protest Against Punitive Measures, Power Cuts and Communication Blackouts</h3>
                    <p>Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch.</p>
                    <a href="article.html?id=lead" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media">
                    <img src="https://via.placeholder.com/400x200?text=UKPNP+Delegation" alt="UKPNP Delegation">
                </div>
                <div class="card-body">
                    <h3>UKPNP Delegation Meets Baroness Emma Nicholson in London House of Lords to Discuss Kashmir Crisis</h3>
                    <p>A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict, regional developments, and prospects for international engagement.</p>
                    <a href="article.html?id=breaking" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media">
                    <img src="https://via.placeholder.com/400x200?text=British+MPs" alt="British MPs">
                </div>
                <div class="card-body">
                    <h3>UKPNP Delegation Briefs British MPs on Kashmir Crisis at the House of Parliament in London</h3>
                    <p>A high level delegation of the United Kashmir People's National Party briefed British Members of Parliament in London on the historical roots of the Kashmir conflict and the current political and human rights situation.</p>
                    <a href="article.html?id=opinion" class="btn-red">Read More →</a>
                </div>
            </article>
        `;
    }
    
    // Latest / Editorial / Historical - Placeholders
    const lehGrid = document.getElementById("leh-grid");
    if (lehGrid) {
        lehGrid.innerHTML = `
            <article class="card">
                <div class="media"><span>LATEST</span></div>
                <div class="card-body">
                    <h3>Latest News Headline</h3>
                    <p>Latest updates and breaking news from the region...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media"><span>EDITORIAL</span></div>
                <div class="card-body">
                    <h3>Editorial: Justice and Human Rights</h3>
                    <p>Our stance on the current situation and path forward...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media"><span>HISTORICAL</span></div>
                <div class="card-body">
                    <h3>Historical Analysis: 1947 to Present</h3>
                    <p>Understanding the roots of the conflict through historical perspective...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
        `;
    }
    
    // Jammu Kashmir
    const jkGrid = document.getElementById("jk-grid");
    if (jkGrid) {
        jkGrid.innerHTML = `
            <article class="card">
                <div class="media"><span>JK</span></div>
                <div class="card-body">
                    <h3>Jammu Region Updates</h3>
                    <p>Latest developments from Jammu division...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media"><span>JK</span></div>
                <div class="card-body">
                    <h3>Kashmir Valley News</h3>
                    <p>Breaking news from Kashmir valley...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
        `;
    }
    
    // International
    const intlGrid = document.getElementById("intl-grid");
    if (intlGrid) {
        intlGrid.innerHTML = `
            <article class="card">
                <div class="media"><span>INTL</span></div>
                <div class="card-body">
                    <h3>International News 1</h3>
                    <p>Global headlines and international affairs...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media"><span>INTL</span></div>
                <div class="card-body">
                    <h3>International News 2</h3>
                    <p>World news and diplomatic developments...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
        `;
    }
    
    // Human Rights
    const hrGrid = document.getElementById("hr-grid");
    if (hrGrid) {
        hrGrid.innerHTML = `
            <article class="card">
                <div class="media"><span>HR</span></div>
                <div class="card-body">
                    <h3>Human Rights Report</h3>
                    <p>Latest human rights updates and violations...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
            <article class="card">
                <div class="media"><span>HR</span></div>
                <div class="card-body">
                    <h3>UNHRC Updates</h3>
                    <p>United Nations Human Rights Council developments...</p>
                    <a href="#" class="btn-red">Read More →</a>
                </div>
            </article>
        `;
    }
}

/* ============================
   RENDER TOP STORIES
   ============================ */
function renderTopStories(stories) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid || !stories || !stories.lead) return;
    
    let html = '';
    
    if (stories.lead) {
        html += createStoryCard(stories.lead);
    }
    if (stories.breaking) {
        html += createStoryCard(stories.breaking);
    }
    if (stories.opinion) {
        html += createStoryCard(stories.opinion);
    }
    
    grid.innerHTML = html;
}

/* ============================
   RENDER LATEST/EDITORIAL/HISTORICAL
   ============================ */
function renderLehSection(section) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    let html = '';
    
    if (section.latest) {
        html += createPlaceholderCard("LATEST", section.latest);
    } else {
        html += createPlaceholderCard("LATEST", { title: "Latest News", excerpt: "Latest updates..." });
    }
    
    if (section.editorial) {
        html += createPlaceholderCard("EDITORIAL", section.editorial);
    } else {
        html += createPlaceholderCard("EDITORIAL", { title: "Editorial", excerpt: "Opinion pieces..." });
    }
    
    if (section.historical) {
        html += createPlaceholderCard("HISTORICAL", section.historical);
    } else {
        html += createPlaceholderCard("HISTORICAL", { title: "Historical", excerpt: "Historical analysis..." });
    }
    
    grid.innerHTML = html;
}

/* ============================
   RENDER JAMMU KASHMIR
   ============================ */
function renderJammuKashmir(items) {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    const items_array = Array.isArray(items) ? items : [items.first, items.second];
    let html = '';
    
    items_array.forEach(function(item, index) {
        if (item) {
            html += createStoryCard(item);
        } else {
            html += createPlaceholderCard("JK", { title: "Jammu Kashmir News", excerpt: "Regional updates..." });
        }
    });
    
    grid.innerHTML = html;
}

/* ============================
   RENDER INTERNATIONAL
   ============================ */
function renderInternational(items) {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    const items_array = Array.isArray(items) ? items : [items.first, items.second];
    let html = '';
    
    items_array.forEach(function(item, index) {
        if (item) {
            html += createStoryCard(item);
        } else {
            html += createPlaceholderCard("INTL", { title: "International News", excerpt: "Global headlines..." });
        }
    });
    
    grid.innerHTML = html;
}

/* ============================
   RENDER HUMAN RIGHTS
   ============================ */
function renderHumanRights(items) {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    const items_array = Array.isArray(items) ? items : [items.first, items.second];
    let html = '';
    
    items_array.forEach(function(item, index) {
        if (item) {
            html += createStoryCard(item);
        } else {
            html += createPlaceholderCard("HR", { title: "Human Rights", excerpt: "Rights and advocacy..." });
        }
    });
    
    grid.innerHTML = html;
}

/* ============================
   CREATE STORY CARD FROM ARTICLE DATA
   ============================ */
function createStoryCard(article) {
    if (typeof article === 'string') {
        // If article is just an ID, return placeholder
        return createPlaceholderCard("NEWS", { title: "Loading...", excerpt: "Content loading..." });
    }
    
    return `
        <article class="card">
            <div class="media">
                <img src="${article.image || 'https://via.placeholder.com/400x200?text=News'}" alt="${article.title}">
            </div>
            <div class="card-body">
                <h3>${article.title}</h3>
                <p>${article.excerpt || article.summary || ''}</p>
                <a href="article.html?id=${article.id}" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   CREATE PLACEHOLDER CARD
   ============================ */
function createPlaceholderCard(label, data) {
    return `
        <article class="card">
            <div class="media"><span>${label}</span></div>
            <div class="card-body">
                <h3>${data.title || 'News Title'}</h3>
                <p>${data.excerpt || 'Content will appear here...'}</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   ARTICLE PAGE INITIALIZATION
   ============================ */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) return;
    
    fetch("content/" + id + ".json")
        .then(function(r) { return r.json(); })
        .then(function(article) {
            renderFullArticlePage(article);
        })
        .catch(function(err) {
            console.error("Article load error:", err);
        });
}

/* ============================
   RENDER FULL ARTICLE PAGE
   ============================ */
function renderFullArticlePage(article) {
    // Article page rendering logic here
    console.log("Rendering article:", article);
}
