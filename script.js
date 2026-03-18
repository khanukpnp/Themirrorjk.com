/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   WITH FULL ARTICLE, ABOUT, AND CHIEF EDITOR RENDERING
   ============================================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing...");
    
    // Initialize all components
    initLoader();
    initYear();
    initClocks();
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
    initFooterDropdowns();
    
    // Load homepage content from JSON
    loadHomepageContent();
    
    // Check if we're on article page
    if (window.location.pathname.includes("article.html") || window.location.search.includes("id=")) {
        initArticlePage();
    }
    
    // Check if we're on about page
    if (window.location.pathname.includes("about.html")) {
        loadAboutPage();
    }
    
    // Check if we're on chief editor page
    if (window.location.pathname.includes("chief-editor.html")) {
        loadChiefEditorPage();
    }
    
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
   CLOCKS
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
    
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    const zurichTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const fullDate = now.toLocaleDateString("en-GB", options);
    const cestText = fullDate + " at " + zurichTime;
    
    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const istHours = now.getHours();
    const istAmpm = istHours >= 12 ? 'pm' : 'am';
    const istFull = istTime + ' ' + istAmpm;
    
    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const pktHours = now.getHours();
    const pktAmpm = pktHours >= 12 ? 'pm' : 'am';
    const pktFull = pktTime + ' ' + pktAmpm;
    
    datetimeBar.innerHTML = `
        <span>${cestText}</span>
        <span class="separator">•</span>
        <span id="cal-hijri">${getHijriDate()}</span>
        <span class="separator">•</span>
        <span id="cal-bikrami">${getBikramiDate()}</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istFull}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktFull}</strong></span>
    `;
}

function getHijriDate() {
    try {
        const now = new Date();
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        return hijriDate + " AH";
    } catch(e) {
        return "Ramadan 27, 1447 AH";
    }
}

function getBikramiDate() {
    const today = new Date();
    const day = today.getDate();
    const months = [
        "Chet", "Vaisakh", "Iyeshtha", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    const monthIndex = today.getMonth();
    const monthName = months[monthIndex];
    const bikramiYear = today.getFullYear() + 57;
    return day + " " + monthName + " " + bikramiYear + " VS";
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
    "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1"
];

function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    let html = '';
    for (let i = 0; i < 2; i++) {
        TICKER_ITEMS.forEach(function(item) {
            html += '<span>' + item + ' • </span>';
        });
    }
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
        mobileMenu.hidden = expanded;
        if (!expanded) {
            mobileMenu.innerHTML = navList.innerHTML;
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
    
    openBtn.addEventListener("click", function() {
        modal.classList.remove("hidden");
    });
    
    closeBtn.addEventListener("click", function() {
        modal.classList.add("hidden");
    });
    
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            modal.classList.add("hidden");
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Thank you for your message. We will get back to you soon!");
            modal.classList.add("hidden");
            contactForm.reset();
        });
    }
}

/* ============================
   VLOGS
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    const videos = [
        {
            title: "Exclusive Interview | The Mirror Jammu Kashmir",
            description: "In-depth interview on peace, justice, and human rights.",
            duration: "15:32"
        },
        {
            title: "Ground Report | Community Voices",
            description: "Voices from the ground. Real stories. Real people.",
            duration: "12:45"
        },
        {
            title: "Analysis | Human Rights Framework",
            description: "Legal and political analysis of ongoing human rights issues.",
            duration: "18:20"
        }
    ];
    
    let html = '';
    videos.forEach(function(v) {
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="https://via.placeholder.com/320x180?text=Video" alt="${v.title}">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>${v.description}</p>
                </div>
            </article>
        `;
    });
    
    grid.innerHTML = html;
}

/* ============================
   LANGUAGE SELECTOR
   ============================ */
function initLanguageSelector() {
    const select = document.getElementById("language-select");
    if (!select) return;
    
    select.addEventListener("change", function(e) {
        alert("Language changed to " + e.target.options[e.target.selectedIndex].text);
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
        if (searchInput.value.trim()) {
            alert("Searching for: " + searchInput.value.trim());
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
                    alert("Share this page!");
                }
            }
        });
    });
}

/* ============================
   COPY LINK
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
   FILE UPLOAD
   ============================ */
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const fileNameSpan = document.querySelector(".file-name");
    
    if (!fileInput || !fileNameSpan) return;
    
    fileInput.addEventListener("change", function() {
        fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : "No file chosen";
    });
}

/* ============================
   NEWSLETTER
   ============================ */
function initNewsletter() {
    const subscribeBtn = document.getElementById("subscribeBtn");
    const emailInput = document.getElementById("subscribeEmail");
    
    if (!subscribeBtn || !emailInput) return;
    
    subscribeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (email && email.includes("@") && email.includes(".")) {
            alert("Thank you for subscribing!");
            emailInput.value = "";
        } else {
            alert("Please enter a valid email address.");
        }
    });
}

/* ============================
   FOOTER DROPDOWNS
   ============================ */
function initFooterDropdowns() {
    const sections = document.querySelectorAll('.footer-section');
    
    sections.forEach(function(section, index) {
        if (index === 0) return;
        
        const heading = section.querySelector('h4');
        if (!heading) return;
        
        heading.addEventListener('click', function() {
            section.classList.toggle('open');
        });
    });
}

/* ============================
   HOMEPAGE CONTENT LOADER
   ============================ */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Index JSON not found");
        })
        .then(function(index) {
            console.log("Index loaded:", index);
            
            // Load Top Stories
            if (index.topStories) {
                loadTopStories([
                    index.topStories.lead,
                    index.topStories.breaking,
                    index.topStories.opinion
                ]);
            }
            
            // Load Latest/Editorial/Historical
            if (index.latestEditorialHistorical) {
                loadLehSection([
                    index.latestEditorialHistorical.latest,
                    index.latestEditorialHistorical.editorial,
                    index.latestEditorialHistorical.historical
                ]);
            }
            
            // Load Jammu Kashmir
            if (index.jammuKashmir) {
                loadJammuKashmir(index.jammuKashmir);
            }
            
            // Load International
            if (index.international) {
                loadInternational(index.international);
            }
            
            // Load Human Rights
            if (index.humanRights) {
                loadHumanRights(index.humanRights);
            }
        })
        .catch(function(error) {
            console.log("Index JSON not found, using fallback", error);
            loadTopStoriesFallback();
            loadLehFallback();
            loadJammuKashmirFallback();
            loadInternationalFallback();
            loadHumanRightsFallback();
        });
}

/* ============================
   LOAD TOP STORIES
   ============================ */
function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    Promise.all(
        ids.map(function(id) {
            if (!id) return Promise.resolve(null);
            return fetch("content/" + id + ".json")
                .then(function(r) {
                    if (r.ok) return r.json();
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createHomepageCard(article);
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            loadTopStoriesFallback();
        }
    });
}

function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body">
                <h3>Complete Shutter Down Paralyses Rawalakot Poonch</h3>
                <p>Thousands shut down Rawalakot in protest against prolonged electricity outages...</p>
                <a href="article.html?id=article-001" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body">
                <h3>UKPNP Delegation Meets Baroness Emma Nicholson</h3>
                <p>High level delegation discusses Kashmir crisis in London...</p>
                <a href="article.html?id=breaking-001" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body">
                <h3>UKPNP Delegation Briefs British MPs</h3>
                <p>Delegation briefs MPs on Kashmir conflict...</p>
                <a href="article.html?id=blog-001" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   LOAD LEH SECTION
   ============================ */
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    Promise.all(
        ids.map(function(id) {
            if (!id) return Promise.resolve(null);
            return fetch("content/" + id + ".json")
                .then(function(r) {
                    if (r.ok) return r.json();
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createHomepageCard(article, labels[index]);
            } else {
                html += createEmptyCard(labels[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body"><h3>LATEST</h3><p class="coming-soon">Coming soon</p></div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📝</span></div>
            <div class="card-body"><h3>EDITORIAL</h3><p class="coming-soon">Coming soon</p></div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📜</span></div>
            <div class="card-body"><h3>HISTORICAL</h3><p class="coming-soon">Coming soon</p></div>
        </article>
    `;
}

/* ============================
   LOAD JAMMU KASHMIR
   ============================ */
function loadJammuKashmir(ids) {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    Promise.all(
        ids.map(function(id) {
            if (!id) return Promise.resolve(null);
            return fetch("content/" + id + ".json")
                .then(function(r) {
                    if (r.ok) return r.json();
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        
        articles.forEach(function(article) {
            if (article) {
                html += createHomepageCard(article, "JK");
            } else {
                html += createEmptyCard("JK");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadJammuKashmirFallback() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media"><span class="placeholder-icon">🏔️</span></div>
            <div class="card-body"><h3>Jammu Region</h3><p class="coming-soon">JK</p></div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">🏞️</span></div>
            <div class="card-body"><h3>Kashmir Valley</h3><p class="coming-soon">JK</p></div>
        </article>
    `;
}

/* ============================
   LOAD INTERNATIONAL
   ============================ */
function loadInternational(ids) {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    Promise.all(
        ids.map(function(id) {
            if (!id) return Promise.resolve(null);
            return fetch("content/" + id + ".json")
                .then(function(r) {
                    if (r.ok) return r.json();
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        
        articles.forEach(function(article) {
            if (article) {
                html += createHomepageCard(article, "INTL");
            } else {
                html += createEmptyCard("INTL");
            }
        });
        
        grid.innerHTML = html;
    });
