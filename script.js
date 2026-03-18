/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   PURE JSON LOADING - NO HARDCODED CONTENT
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
    
    // Load homepage content from JSON files only
    loadHomepageContent();
    
    // Check if we're on article page and load article
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
        // Fallback to API if needed
        hijriEl.textContent = "Loading...";
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
   TICKER - LOAD FROM JSON
   ============================ */
function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Load ticker from JSON
    fetch("content/ticker.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ticker JSON not found");
        })
        .then(function(data) {
            // Check if data is an array or has items property
            const items = Array.isArray(data) ? data : (data.items || []);
            if (items.length > 0) {
                renderTickerItems(items);
            } else {
                loadTickerFromText();
            }
        })
        .catch(function() {
            loadTickerFromText();
        });
}

function loadTickerFromText() {
    // Try to load from ticker text file
    fetch("content/ticker.txt")
        .then(function(response) {
            if (response.ok) {
                return response.text();
            }
            throw new Error("Ticker text not found");
        })
        .then(function(text) {
            const items = text.split('•').map(item => item.trim()).filter(item => item.length > 0);
            if (items.length > 0) {
                renderTickerItems(items);
            } else {
                // Last resort - show basic message
                renderTickerItems(["THE MIRROR JAMMU KASHMIR"]);
            }
        })
        .catch(function() {
            // If all fails, show minimal ticker
            renderTickerItems(["THE MIRROR JAMMU KASHMIR"]);
        });
}

function renderTickerItems(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Ensure we have items
    if (!items || items.length === 0) {
        items = ["THE MIRROR JAMMU KASHMIR"];
    }
    
    // Duplicate for seamless scrolling
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
   VLOGS - LOAD FROM YOUTUBE JSON
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
        .catch(function(error) {
            console.log("YouTube JSON not found", error);
            if (grid) {
                grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
            }
        });
}

function renderVlogs(videos) {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    if (!videos || videos.length === 0) {
        grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
        return;
    }
    
    let html = '';
    videos.forEach(function(v) {
        const thumb = v.youtubeId ? 
            'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg' : 
            'https://via.placeholder.com/320x180?text=Video';
        
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title || 'Video'}" onerror="this.src='https://via.placeholder.com/320x180?text=Video'">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title || 'Video'}</h3>
                    <p>${v.description || ''}</p>
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
   HOMEPAGE CONTENT LOADER - PURE JSON
   ============================ */
function loadHomepageContent() {
    // Load index.json which contains references to all content
    fetch("content/index.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Index JSON not found - create content/index.json");
        })
        .then(function(index) {
            console.log("Index loaded:", index);
            
            // Load Top Stories
            if (index.topStories) {
                loadSectionFromIds("top-stories-grid", [
                    index.topStories.lead,
                    index.topStories.breaking,
                    index.topStories.opinion
                ]);
            }
            
            // Load Latest/Editorial/Historical
            const lehIds = [
                index.latest ? index.latest[0] : null,
                index.editorial ? index.editorial[0] : null,
                index.historical ? index.historical[0] : null
            ];
            loadLehSection(lehIds);
            
            // Load Jammu Kashmir
            if (index.jammuKashmir) {
                loadSectionFromIds("jk-grid", [
                    index.jammuKashmir.first,
                    index.jammuKashmir.second
                ], "JK");
            }
            
            // Load International
            if (index.international) {
                loadSectionFromIds("intl-grid", [
                    index.international.first,
                    index.international.second
                ], "INTL");
            }
            
            // Load Human Rights
            if (index.humanRights) {
                loadSectionFromIds("hr-grid", [
                    index.humanRights.first,
                    index.humanRights.second
                ], "HR");
            }
        })
        .catch(function(error) {
            console.error("Failed to load content:", error);
            // Show error message but don't crash
            const grids = ["top-stories-grid", "leh-grid", "jk-grid", "intl-grid", "hr-grid"];
            grids.forEach(function(gridId) {
                const grid = document.getElementById(gridId);
                if (grid) {
                    grid.innerHTML = '<p class="coming-soon">Content configuration not found. Please create content/index.json</p>';
                }
            });
        });
}

/* ============================
   LOAD SECTION FROM IDs
   ============================ */
function loadSectionFromIds(gridId, ids, defaultLabel) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    // Filter out null/undefined ids
    const validIds = ids.filter(id => id !== null && id !== undefined);
    
    if (validIds.length === 0) {
        // No content configured
        grid.innerHTML = '<p class="coming-soon">Content coming soon</p>';
        return;
    }
    
    // Load all articles in parallel
    Promise.all(
        validIds.map(function(id) {
            return fetch("content/" + id + ".json")
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        let hasContent = false;
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article);
                hasContent = true;
            } else if (validIds[index]) {
                // ID exists but file not found
                html += createMissingCard(validIds[index]);
            }
        });
        
        // If we have at least some content, show it
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            // If all articles failed to load
            grid.innerHTML = '<p class="coming-soon">Content temporarily unavailable</p>';
        }
    });
}

/* ============================
   LOAD LEH SECTION SPECIALLY
   ============================ */
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
    
    Promise.all(
        ids.map(function(id) {
            if (!id) return Promise.resolve(null);
            return fetch("content/" + id + ".json")
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                })
                .catch(function() {
                    return null;
                });
        })
    ).then(function(articles) {
        let html = '';
        let hasContent = false;
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article, labels[index]);
                hasContent = true;
            } else if (ids[index]) {
                // ID exists but file not found
                html += createMissingCard(ids[index], labels[index]);
            } else {
                // No ID configured
                html += createEmptyCard(labels[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   CREATE ARTICLE CARD FROM JSON
   ============================ */
function createArticleCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || '';
    let image = 'https://via.placeholder.com/400x200?text=No+Image';
    
    // Check for heroImage or image property
    if (article.heroImage && article.heroImage.src) {
        image = article.heroImage.src;
    } else if (article.image) {
        image = article.image;
    }
    
    const id = article.id || '';
    const category = article.category || '';
    
    // Clean up title for display
    let displayTitle = title;
    if (title.length > 80) {
        displayTitle = title.substring(0, 80) + '...';
    }
    
    return `
        <article class="card" data-category="${category}">
            <div class="media">
                <img src="${image}" alt="${displayTitle}" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Not+Found'">
            </div>
            <div class="card-body">
                <h3>${displayTitle}</h3>
                ${excerpt ? '<p>' + excerpt.substring(0, 100) + (excerpt.length > 100 ? '...' : '') + '</p>' : ''}
                <a href="article.html?id=${id}" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   CREATE MISSING CARD (file exists but couldn't load)
   ============================ */
function createMissingCard(id, label) {
    const displayLabel = label || id;
    return `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📄</span>
            </div>
            <div class="card-body">
                <h3>${displayLabel}</h3>
                <p class="coming-soon">Content file "${id}.json" not found</p>
            </div>
        </article>
    `;
}

/* ============================
   CREATE EMPTY CARD (no ID configured)
   ============================ */
function createEmptyCard(label) {
    return `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📄</span>
            </div>
            <div class="card-body">
                <h3>${label}</h3>
                <p class="coming-soon">Coming soon</p>
            </div>
        </article>
    `;
}

/* ============================
   ABOUT PAGE LOADER
   ============================ */
function loadAboutPage() {
    fetch("content/about-001.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("About content not found");
        })
        .then(function(about) {
            renderPageContent(about);
        })
        .catch(function(error) {
            console.error("Failed to load about page:", error);
            document.body.innerHTML += '<div class="error-message">About content coming soon</div>';
        });
}

/* ============================
   CHIEF EDITOR PAGE LOADER
   ============================ */
function loadChiefEditorPage() {
    fetch("content/chief-editor-001.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Chief Editor content not found");
        })
        .then(function(editor) {
            renderPageContent(editor);
        })
        .catch(function(error) {
            console.error("Failed to load chief editor page:", error);
            document.body.innerHTML += '<div class="error-message">Chief Editor content coming soon</div>';
        });
}

/* ============================
   OUR TEAM PAGE LOADER
   ============================ */
function loadOurTeamPage() {
    fetch("content/our-team.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Team content not found");
        })
        .then(function(team) {
            renderTeamPage(team);
        })
        .catch(function(error) {
            console.error("Failed to load team page:", error);
            document.body.innerHTML += '<div class="error-message">Team information coming soon</div>';
        });
}

/* ============================
   ARTICLE PAGE INITIALIZATION
   ============================ */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) {
        document.body.innerHTML += '<div class="error-message">No article ID specified</div>';
        return;
    }
    
    fetch("content/" + id + ".json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Article not found: " + id);
        })
        .then(function(article) {
            renderFullArticlePage(article);
        })
        .catch(function(error) {
            console.error("Article load error:", error);
            document.body.innerHTML += '<div class="error-message">Article not found</div>';
        });
}

/* ============================
   RENDER FULL ARTICLE PAGE
   ============================ */
function renderFullArticlePage(article) {
    // Set page title
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = article.title + " | THE MIRROR JAMMU KASHMIR";
    }
    
    // Set section label
    const sectionLabel = document.getElementById("section-label");
    if (sectionLabel) {
        sectionLabel.textContent = article.sectionLabel || article.category || "ARTICLE";
        sectionLabel.className = "category-label cat-" + (article.category || "default");
    }
    
    // Set title
    const titleEl = document.getElementById("title");
    if (titleEl) {
        titleEl.textContent = article.title;
    }
    
    // Set meta
    const metaEl = document.getElementById("meta");
    if (metaEl && article.date) {
        const dateObj = new Date(article.date);
        const formattedDate = dateObj.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        metaEl.innerHTML = `
            <strong>${article.location || 'Location'}</strong> — ${formattedDate}<br>
            By <em>${article.author || 'Editorial Desk'}</em> · ${article.readTime || ''}
        `;
    }
    
    // Set hero image
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const heroWrap = document.getElementById("heroWrap");
    
    if (article.heroImage && article.heroImage.src && heroImg && heroCaption && heroWrap) {
        heroImg.src = article.heroImage.src;
        heroImg.alt = article.heroImage.caption || '';
        heroCaption.textContent = article.heroImage.caption || '';
    } else if (heroWrap) {
        heroWrap.style.display = "none";
    }
    
    // Render body content
    const contentEl = document.getElementById("content");
    if (!contentEl) return;
    
    contentEl.innerHTML = '';
    
    if (article.body && Array.isArray(article.body)) {
        article.body.forEach(function(block) {
            if (block.type === "paragraph") {
                contentEl.innerHTML += '<p>' + block.text + '</p>';
            } else if (block.type === "subheading") {
                contentEl.innerHTML += '<h2 class="mid-subheading">' + block.text + '</h2>';
            } else if (block.type === "pullquote") {
                contentEl.innerHTML += '<div class="pull-quote">' + block.text + '</div>';
            } else if (block.type === "points" && block.items) {
                let listHtml = '<div class="important-points"><ul>';
                block.items.forEach(function(item) {
                    listHtml += '<li>' + item + '</li>';
                });
                listHtml += '</ul></div>';
                contentEl.innerHTML += listHtml;
            } else if (block.type === "image" && block.src) {
                const alignClass = block.align === "right" ? "img-right" : 
                                  block.align === "center" ? "img-center" : "img-left";
                contentEl.innerHTML += `
                    <figure class="${alignClass}">
                        <img src="${block.src}" alt="${block.caption || ''}">
                        <figcaption>${block.caption || ''}</figcaption>
                    </figure>
                `;
            }
        });
    }
}

/* ============================
   RENDER PAGE CONTENT (for about, editor pages)
   ============================ */
function renderPageContent(data) {
    // This would need the appropriate HTML structure
    console.log("Rendering page:", data);
}

/* ============================
   RENDER TEAM PAGE
   ============================ */
function renderTeamPage(data) {
    console.log("Rendering team page:", data);
    // Team page rendering logic
}

// Export functions for use in other pages
window.copyPageLink = copyPageLink;
