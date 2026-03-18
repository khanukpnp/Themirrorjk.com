/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   LOADS CONTENT FROM JSON FILES WITH COMING SOON PLACEHOLDERS
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
    const cestEl = document.getElementById("clock-cest");
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
    const istSpan = document.querySelector("#tz-ist span");
    if (istSpan) {
        const istTime = now.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        istSpan.textContent = istTime;
    }
    
    // PKT (Gilgit-Baltistan & AJK)
    const pktSpan = document.querySelector("#tz-pkt span");
    if (pktSpan) {
        const pktTime = now.toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        pktSpan.textContent = pktTime;
    }
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
        
        // Format: Ramadan 27, 1447 AH
        hijriEl.textContent = hijriDate + " AH";
    } catch(e) {
        console.log("Hijri calendar error:", e);
        // Fallback to approximate date
        const today = new Date();
        const months = ["Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah", 
                        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
                        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban"];
        const monthIndex = today.getMonth() % 12;
        const month = months[monthIndex];
        const year = 1447; // Approximate
        hijriEl.textContent = month + " " + today.getDate() + ", " + year + " AH";
    }
}

/* ============================
   BIKRAMI CALENDAR
   ============================ */
function updateBikrami() {
    const vsEl = document.getElementById("cal-bikrami");
    if (!vsEl) return;
    
    const today = new Date();
    const months = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    // Bikrami year = Gregorian + 57
    const bikramiYear = today.getFullYear() + 57;
    const monthIndex = today.getMonth();
    const monthName = months[monthIndex];
    const day = today.getDate();
    
    vsEl.textContent = day + " " + monthName + " " + bikramiYear + " VS";
}

/* ============================
   WEATHER BAR - ALL REGIONS
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
        return "<span>🌡️ " + c.name + ": <strong>" + c.temp + "</strong></span>";
    }).join('<span class="separator">•</span>');
}

/* ============================
   TICKER - FROM JSON OR FALLBACK
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
    
    // Try to load from JSON, fallback to default
    fetch("content/ticker.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ticker JSON not found");
        })
        .then(function(data) {
            const items = data.items || TICKER_ITEMS;
            renderTickerItems(items);
        })
        .catch(function() {
            renderTickerItems(TICKER_ITEMS);
        });
}

function renderTickerItems(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Duplicate items for seamless scrolling
    const allItems = items.concat(items);
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
                    const href = link.getAttribute('href') || '#';
                    const text = link.textContent;
                    mobileHTML += '<li class="nav-item"><a href="' + href + '" class="nav-btn">' + text + '</a></li>';
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
    
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
    
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
   VLOGS - FROM YOUTUBE JSON
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Load from YouTube JSON
    fetch("content/youtube.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("YouTube JSON not found");
        })
        .then(function(data) {
            if (visitBtn && data.channel && data.channel.url) {
                visitBtn.addEventListener("click", function() {
                    window.open(data.channel.url, "_blank");
                });
            }
            
            const videos = data.videos || [];
            renderVlogs(videos);
        })
        .catch(function() {
            // Fallback to sample data
            const videos = [
                {
                    youtubeId: "SNANYXoJxu0",
                    title: "Exclusive Interview | The Mirror Jammu Kashmir",
                    description: "In-depth interview on peace, justice, and human rights.",
                    duration: "15:32"
                },
                {
                    youtubeId: "SNANYXoJxu0",
                    title: "Ground Report | Community Voices",
                    description: "Voices from the ground. Real stories. Real people.",
                    duration: "12:45"
                },
                {
                    youtubeId: "SNANYXoJxu0",
                    title: "Analysis | Human Rights Framework",
                    description: "Legal and political analysis of ongoing human rights issues.",
                    duration: "18:20"
                }
            ];
            renderVlogs(videos);
        });
}

function renderVlogs(videos) {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    grid.innerHTML = videos.map(function(v) {
        const thumb = v.youtubeId ? 
            `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : 
            'https://via.placeholder.com/320x180?text=Coming+Soon';
        
        return `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title || 'Video'}">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title || 'Coming Soon'}</h3>
                    <p>${v.description || 'Video content will appear here.'}</p>
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
   HOMEPAGE CONTENT LOADER - FROM INDEX JSON
   ============================ */
function loadHomepageContent() {
    // Load index.json which contains references to all content
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
                loadTopStories(index.topStories);
            }
            
            // Load Latest/Editorial/Historical
            loadLehSection({
                latest: index.latest ? index.latest[0] : null,
                editorial: index.editorial ? index.editorial[0] : null,
                historical: index.historical ? index.historical[0] : null
            });
            
            // Load Jammu Kashmir
            if (index.jammuKashmir) {
                loadJammuKashmir(index.jammuKashmir);
            } else {
                renderJammuKashmirPlaceholders();
            }
            
            // Load International
            if (index.international) {
                loadInternational(index.international);
            } else {
                renderInternationalPlaceholders();
            }
            
            // Load Human Rights
            if (index.humanRights) {
                loadHumanRights(index.humanRights);
            } else {
                renderHumanRightsPlaceholders();
            }
        })
        .catch(function(error) {
            console.log("Index JSON not found, using placeholders", error);
            // Render all placeholders if index.json doesn't exist
            renderAllPlaceholders();
        });
}

/* ============================
   LOAD TOP STORIES
   ============================ */
function loadTopStories(stories) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    const storyIds = [
        stories.lead,
        stories.breaking,
        stories.opinion
    ];
    
    Promise.all(
        storyIds.map(function(id) {
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
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article);
            } else {
                // Placeholder for missing article
                const titles = [
                    "Complete Shutter Down Paralyses Rawalakot Poonch",
                    "UKPNP Delegation Meets Baroness Emma Nicholson",
                    "UKPNP Delegation Briefs British MPs"
                ];
                const excerpts = [
                    "Thousands shut down Rawalakot in protest against prolonged electricity outages...",
                    "High level delegation discusses Kashmir crisis in London House of Lords...",
                    "Delegation briefs MPs on historical roots of Kashmir conflict..."
                ];
                
                html += createPlaceholderCard(
                    titles[index] || "Coming Soon",
                    excerpts[index] || "Content will appear here soon."
                );
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD LATEST/EDITORIAL/HISTORICAL
   ============================ */
function loadLehSection(section) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    const sectionIds = [
        section.latest,
        section.editorial,
        section.historical
    ];
    
    Promise.all(
        sectionIds.map(function(id) {
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
        
        articles.forEach(function(article, index) {
            const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
            
            if (article) {
                html += createArticleCard(article, labels[index]);
            } else {
                html += createSectionPlaceholderCard(labels[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD JAMMU KASHMIR
   ============================ */
function loadJammuKashmir(jk) {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    const ids = [
        jk.first,
        jk.second
    ];
    
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
                html += createArticleCard(article, "JK");
            } else {
                html += createSectionPlaceholderCard("JK", "Jammu Kashmir news coming soon");
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD INTERNATIONAL
   ============================ */
function loadInternational(intl) {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    const ids = [
        intl.first,
        intl.second
    ];
    
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
                html += createArticleCard(article, "INTL");
            } else {
                html += createSectionPlaceholderCard("INTL", "International news coming soon");
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD HUMAN RIGHTS
   ============================ */
function loadHumanRights(hr) {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    const ids = [
        hr.first,
        hr.second
    ];
    
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
                html += createArticleCard(article, "HR");
            } else {
                html += createSectionPlaceholderCard("HR", "Human rights news coming soon");
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   RENDER ALL PLACEHOLDERS (FALLBACK)
   ============================ */
function renderAllPlaceholders() {
    renderTopStoriesPlaceholders();
    renderLehPlaceholders();
    renderJammuKashmirPlaceholders();
    renderInternationalPlaceholders();
    renderHumanRightsPlaceholders();
}

function renderTopStoriesPlaceholders() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createPlaceholderCard("Complete Shutter Down Paralyses Rawalakot Poonch", "Thousands shut down Rawalakot in protest against prolonged electricity outages...")}
        ${createPlaceholderCard("UKPNP Delegation Meets Baroness Emma Nicholson", "High level delegation discusses Kashmir crisis in London House of Lords...")}
        ${createPlaceholderCard("UKPNP Delegation Briefs British MPs", "Delegation briefs MPs on historical roots of Kashmir conflict...")}
    `;
}

function renderLehPlaceholders() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionPlaceholderCard("LATEST")}
        ${createSectionPlaceholderCard("EDITORIAL")}
        ${createSectionPlaceholderCard("HISTORICAL")}
    `;
}

function renderJammuKashmirPlaceholders() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionPlaceholderCard("JK", "Jammu Kashmir news coming soon")}
        ${createSectionPlaceholderCard("JK", "Jammu Kashmir news coming soon")}
    `;
}

function renderInternationalPlaceholders() {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionPlaceholderCard("INTL", "International news coming soon")}
        ${createSectionPlaceholderCard("INTL", "International news coming soon")}
    `;
}

function renderHumanRightsPlaceholders() {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionPlaceholderCard("HR", "Human rights news coming soon")}
        ${createSectionPlaceholderCard("HR", "Human rights news coming soon")}
    `;
}

/* ============================
   CREATE ARTICLE CARD FROM JSON
   ============================ */
function createArticleCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || 'No description available';
    const image = article.heroImage && article.heroImage.src ? 
        article.heroImage.src : 'https://via.placeholder.com/400x200?text=News';
    const id = article.id || '';
    const category = article.category || '';
    
    return `
        <article class="card">
            <div class="media">
                <img src="${image}" alt="${title}">
            </div>
            <div class="card-body">
                <h3>${title}</h3>
                <p>${excerpt.substring(0, 120)}${excerpt.length > 120 ? '...' : ''}</p>
                <a href="article.html?id=${id}" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   CREATE PLACEHOLDER CARD
   ============================ */
function createPlaceholderCard(title, excerpt) {
    return `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>${title}</h3>
                <p>${excerpt}</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

function createSectionPlaceholderCard(label, message) {
    const defaultMessage = message || label + " content coming soon";
    return `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📄</span>
            </div>
            <div class="card-body">
                <h3>${label}</h3>
                <p class="coming-soon">${defaultMessage}</p>
            </div>
        </article>
    `;
}

/* ============================
   ABOUT PAGE LOADER
   ============================ */
function loadAboutPage() {
    fetch("content/about-001.json")
        .then(function(r) {
            if (r.ok) return r.json();
            throw new Error("About content not found");
        })
        .then(function(about) {
            renderAboutPage(about);
        })
        .catch(function() {
            document.body.innerHTML += "<p>About content coming soon...</p>";
        });
}

/* ============================
   CHIEF EDITOR PAGE LOADER
   ============================ */
function loadChiefEditorPage() {
    fetch("content/chief-editor-001.json")
        .then(function(r) {
            if (r.ok) return r.json();
            throw new Error("Chief Editor content not found");
        })
        .then(function(editor) {
            renderChiefEditorPage(editor);
        })
        .catch(function() {
            document.body.innerHTML += "<p>Chief Editor content coming soon...</p>";
        });
}

/* ============================
   OUR TEAM PAGE LOADER
   ============================ */
function loadOurTeamPage() {
    fetch("content/our-team.json")
        .then(function(r) {
            if (r.ok) return r.json();
            throw new Error("Team content not found");
        })
        .then(function(team) {
            renderTeamPage(team);
        })
        .catch(function() {
            document.body.innerHTML += "<p>Team information coming soon...</p>";
        });
}

// Export functions for use in other pages
window.loadAboutPage = loadAboutPage;
window.loadChiefEditorPage = loadChiefEditorPage;
window.loadOurTeamPage = loadOurTeamPage;
window.copyPageLink = copyPageLink;
