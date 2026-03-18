/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   WITH REAL CONTENT LOADING FROM JSON FILES
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
    
    // Load homepage content from JSON files
    loadHomepageContent();
    
    // Check if we're on article page and load article
    if (window.location.pathname.includes("article.html")) {
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
    
    // Check if we're on our team page
    if (window.location.pathname.includes("our-team.html")) {
        loadOurTeamPage();
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
   CLOCKS - SINGLE LINE
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
    
    // CEST Clock with full date
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
    
    // IST
    const istSpan = document.querySelector("#tz-ist span");
    if (istSpan) {
        const istTime = now.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const hours = now.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        istSpan.textContent = istTime + ' ' + ampm;
    }
    
    // PKT
    const pktSpan = document.querySelector("#tz-pkt span");
    if (pktSpan) {
        const pktTime = now.toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const hours = now.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        pktSpan.textContent = pktTime + ' ' + ampm;
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
   NAVIGATION - UPDATED WITH DROPDOWNS
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
            const items = navList.querySelectorAll(".nav-item");
            let mobileHTML = '<ul class="nav-list">';
            items.forEach(function(item) {
                const link = item.querySelector(".nav-btn");
                if (link) {
                    const href = link.getAttribute('href') || '#';
                    const text = link.textContent;
                    mobileHTML += '<li class="nav-item"><a href="' + href + '" class="nav-btn">' + text + '</a></li>';
                    
                    // Add dropdown items for mobile if they exist
                    const dropdown = item.querySelector(".dropdown");
                    if (dropdown) {
                        const dropdownLinks = dropdown.querySelectorAll("a");
                        dropdownLinks.forEach(function(dropLink) {
                            mobileHTML += '<li class="nav-item dropdown-item"><a href="' + dropLink.getAttribute('href') + '" class="nav-btn" style="padding-left: 40px;">' + dropLink.textContent + '</a></li>';
                        });
                    }
                }
            });
            mobileHTML += '</ul>';
            mobileMenu.innerHTML = mobileHTML;
        }
    });
    
    // Dropdown handling for desktop
    const dropdowns = document.querySelectorAll(".has-sub");
    dropdowns.forEach(function(item) {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        
        if (btn && dropdown) {
            // For Home dropdown with About, Chief Editor, Our Team, Contact
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                // Close all other dropdowns
                document.querySelectorAll(".dropdown").forEach(function(d) {
                    if (d !== dropdown) d.style.display = "none";
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
    
    // Handle hover for better UX
    dropdowns.forEach(function(item) {
        item.addEventListener("mouseenter", function() {
            const dropdown = this.querySelector(".dropdown");
            if (dropdown) {
                dropdown.style.display = "block";
            }
        });
        
        item.addEventListener("mouseleave", function() {
            const dropdown = this.querySelector(".dropdown");
            if (dropdown) {
                dropdown.style.display = "none";
            }
        });
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
   VLOGS
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Try to load from YouTube JSON
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
            // Fallback to sample videos
            if (visitBtn) {
                visitBtn.addEventListener("click", function() {
                    window.open("https://youtube.com/@TheMirrorJammuKashmir", "_blank");
                });
            }
            
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
    
    let html = '';
    videos.forEach(function(v) {
        const thumb = v.youtubeId ? 
            'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg' : 
            'https://via.placeholder.com/320x180?text=Coming+Soon';
        
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title || 'Video'}" onerror="this.src='https://via.placeholder.com/320x180?text=Video'">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title || 'Coming Soon'}</h3>
                    <p>${v.description || 'Video content will appear here.'}</p>
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
   HOMEPAGE CONTENT LOADER
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
            } else {
                loadTopStoriesManually();
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
            console.log("Index JSON not found, loading manually", error);
            // Load Top Stories manually
            loadTopStoriesManually();
            // Load Latest/Editorial/Historical manually
            loadLehSectionManually();
            renderJammuKashmirPlaceholders();
            renderInternationalPlaceholders();
            renderHumanRightsPlaceholders();
        });
}

/* ============================
   LOAD TOP STORIES MANUALLY
   ============================ */
function loadTopStoriesManually() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    // Load all three articles in parallel
    Promise.all([
        fetch("content/article-001.json").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("content/breaking-001.json").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("content/blog-001.json").then(r => r.ok ? r.json() : null).catch(() => null)
    ]).then(function(articles) {
        let html = '';
        
        // LEFT WINDOW - article-001 (Rawalakot Shutter Down)
        if (articles[0]) {
            html += createArticleCard(articles[0]);
        } else {
            html += createStoryCard(
                "Complete Shutter Down Paralyses Rawalakot Poonch",
                "Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch."
            );
        }
        
        // MIDDLE WINDOW - breaking-001 (Baroness Meeting)
        if (articles[1]) {
            html += createArticleCard(articles[1]);
        } else {
            html += createStoryCard(
                "UKPNP Delegation Meets Baroness Emma Nicholson",
                "A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict."
            );
        }
        
        // RIGHT WINDOW - blog-001 (MPs Meeting)
        if (articles[2]) {
            html += createArticleCard(articles[2]);
        } else {
            html += createStoryCard(
                "UKPNP Delegation Briefs British MPs",
                "A high level delegation briefed British Members of Parliament on the historical roots of the Kashmir conflict and current human rights situation."
            );
        }
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD TOP STORIES FROM INDEX
   ============================ */
function loadTopStories(stories) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    const storyIds = [
        stories.lead,      // LEFT WINDOW - article-001
        stories.breaking,  // MIDDLE WINDOW - breaking-001
        stories.opinion    // RIGHT WINDOW - blog-001
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
                // Fallback placeholders
                const titles = [
                    "Complete Shutter Down Paralyses Rawalakot Poonch",
                    "UKPNP Delegation Meets Baroness Emma Nicholson",
                    "UKPNP Delegation Briefs British MPs"
                ];
                const excerpts = [
                    "Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch.",
                    "A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict.",
                    "A high level delegation briefed British Members of Parliament on the historical roots of the Kashmir conflict and current human rights situation."
                ];
                
                html += createStoryCard(titles[index], excerpts[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD LATEST/EDITORIAL/HISTORICAL MANUALLY
   ============================ */
function loadLehSectionManually() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    // Load editorial-001 for editorial window
    Promise.all([
        Promise.resolve(null), // latest (will use placeholder)
        fetch("content/editorial-001.json").then(r => r.ok ? r.json() : null).catch(() => null),
        Promise.resolve(null)  // historical (will use placeholder)
    ]).then(function(articles) {
        let html = '';
        
        // LATEST window - placeholder
        html += createSectionCard("LATEST", "Latest news and updates from the region will appear here.");
        
        // EDITORIAL window - load editorial-001
        if (articles[1]) {
            html += createArticleCard(articles[1], "EDITORIAL");
        } else {
            html += createSectionCard("EDITORIAL", "Editorial content and opinions will appear here.");
        }
        
        // HISTORICAL window - placeholder
        html += createSectionCard("HISTORICAL", "Historical analysis and articles will appear here.");
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD LATEST/EDITORIAL/HISTORICAL FROM INDEX
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
        const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article, labels[index]);
            } else {
                // Specific fallbacks based on index
                if (index === 0) { // LATEST
                    html += createSectionCard("LATEST", "Latest news and updates from the region will appear here.");
                } else if (index === 1) { // EDITORIAL
                    // Try to load editorial-001 as fallback
                    fetch("content/editorial-001.json")
                        .then(r => r.ok ? r.json() : null)
                        .then(editorial => {
                            if (editorial) {
                                const newHtml = createArticleCard(editorial, "EDITORIAL");
                                document.querySelector("#leh-grid article:nth-child(2)").outerHTML = newHtml;
                            }
                        })
                        .catch(() => {});
                    html += createSectionCard("EDITORIAL", "Editorial content and opinions will appear here.");
                } else { // HISTORICAL
                    html += createSectionCard("HISTORICAL", "Historical analysis and articles will appear here.");
                }
            }
        });
        
        grid.innerHTML = html;
        
        // Try to load editorial-001 separately if it exists but wasn't in index
        if (!section.editorial) {
            fetch("content/editorial-001.json")
                .then(r => r.ok ? r.json() : null)
                .then(editorial => {
                    if (editorial) {
                        const cards = grid.querySelectorAll(".card");
                        if (cards.length >= 2) {
                            const newCard = createArticleCard(editorial, "EDITORIAL");
                            cards[1].outerHTML = newCard;
                        }
                    }
                })
                .catch(() => {});
        }
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
                html += createSectionCard("JK", "Jammu Kashmir news coming soon");
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
                html += createSectionCard("INTL", "International news coming soon");
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
                html += createSectionCard("HR", "Human rights news coming soon");
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   RENDER PLACEHOLDERS
   ============================ */
function renderTopStoriesPlaceholders() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createStoryCard("Complete Shutter Down Paralyses Rawalakot Poonch", "Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch.")}
        ${createStoryCard("UKPNP Delegation Meets Baroness Emma Nicholson", "A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict.")}
        ${createStoryCard("UKPNP Delegation Briefs British MPs", "A high level delegation briefed British Members of Parliament on the historical roots of the Kashmir conflict and current human rights situation.")}
    `;
}

function renderLehPlaceholders() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionCard("LATEST", "Latest news and updates from the region will appear here.")}
        ${createSectionCard("EDITORIAL", "Editorial content and opinions will appear here.")}
        ${createSectionCard("HISTORICAL", "Historical analysis and articles will appear here.")}
    `;
}

function renderJammuKashmirPlaceholders() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionCard("JK", "Jammu region news and updates coming soon.")}
        ${createSectionCard("JK", "Kashmir valley news and updates coming soon.")}
    `;
}

function renderInternationalPlaceholders() {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionCard("INTL", "International news and global affairs coming soon.")}
        ${createSectionCard("INTL", "World news and diplomatic developments coming soon.")}
    `;
}

function renderHumanRightsPlaceholders() {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createSectionCard("HR", "Human rights updates and reports coming soon.")}
        ${createSectionCard("HR", "UNHRC and advocacy news coming soon.")}
    `;
}

/* ============================
   CREATE ARTICLE CARD FROM JSON
   ============================ */
function createArticleCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || 'No description available';
    let image = 'https://via.placeholder.com/400x200?text=News';
    
    if (article.heroImage && article.heroImage.src) {
        image = article.heroImage.src;
    } else if (article.image) {
        image = article.image;
    }
    
    const id = article.id || '';
    
    // Clean up title for display (shorten if needed)
    let displayTitle = title;
    if (title.length > 80) {
        displayTitle = title.substring(0, 80) + '...';
    }
    
    // Determine category class
    let categoryClass = 'cat-default';
    if (article.category === 'breaking') categoryClass = 'cat-breaking';
    else if (article.category === 'blog')
