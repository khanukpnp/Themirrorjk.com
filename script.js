/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   AUTO-DETECTING JSON SYSTEM - NO CODE CHANGES NEEDED
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
    initFooterDropdowns();
    
    // AUTO-DETECT PAGE TYPE AND LOAD CONTENT
    autoDetectAndLoadContent();
    
    // Set up clock to update every second
    setInterval(updateClocks, 1000);
});

/* ============================
   AUTO-DETECT PAGE TYPE AND LOAD CONTENT
   ============================ */
function autoDetectAndLoadContent() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    
    console.log("Current path:", path);
    console.log("Article ID:", id);
    
    // Check if it's an article page (has ?id= parameter)
    if (id) {
        loadContentByType('article', id);
        return;
    }
    
    // Check by filename
    if (path.includes("article.html")) {
        // Article page without ID - show error or redirect
        document.body.innerHTML += '<div class="error-message" style="text-align:center; padding:50px;">No article specified</div>';
        return;
    }
    
    if (path.includes("about.html")) {
        loadContentByType('about', 'about-001');
        return;
    }
    
    if (path.includes("chief-editor.html")) {
        loadContentByType('chief-editor', 'chief-editor-001');
        return;
    }
    
    if (path.includes("our-team.html")) {
        loadContentByType('team', 'our-team-001');
        return;
    }
    
    if (path.includes("editorial.html")) {
        loadContentByType('editorial', 'editorial-001');
        return;
    }
    
    if (path.includes("breaking.html")) {
        loadContentByType('breaking', 'breaking-001');
        return;
    }
    
    if (path.includes("opinion.html")) {
        loadContentByType('opinion', 'blog-001');
        return;
    }
    
    // Default to homepage content
    loadHomepageContent();
}

/* ============================
   LOAD CONTENT BY TYPE - AUTO DETECTS JSON LOCATION
   ============================ */
function loadContentByType(type, id) {
    console.log(`Loading ${type} content with ID: ${id}`);
    
    // Define possible paths to check
    const possiblePaths = [
        `content/${id}.json`,           // content/article-001.json
        `content/${type}/${id}.json`,   // content/breaking/article-001.json
        `content/${type}s/${id}.json`,  // content/breaking/article-001.json
        `${id}.json`,                    // article-001.json (root)
        `content/${type}-${id}.json`,    // content/breaking-001.json
        `content/${type}/${type}-${id}.json`, // content/breaking/breaking-001.json
        `content/${id}.html`,            // content/article-001.html (fallback)
        `${id}.html`                      // article-001.html (root)
    ];
    
    // Try each path until one works
    tryLoadFromPaths(possiblePaths, 0, type, id);
}

/* ============================
   TRY LOADING FROM MULTIPLE PATHS
   ============================ */
function tryLoadFromPaths(paths, index, type, id) {
    if (index >= paths.length) {
        // All paths failed
        console.error(`Could not load content for ${type} with ID: ${id}`);
        showFallbackContent(type, id);
        return;
    }
    
    const path = paths[index];
    console.log(`Trying to load from: ${path}`);
    
    fetch(path)
        .then(function(response) {
            if (response.ok) {
                // Check content type
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json().then(data => {
                        renderContentByType(type, data, path);
                    });
                } else {
                    // It's HTML or text
                    return response.text().then(text => {
                        renderHtmlContent(text, type, id);
                    });
                }
            } else {
                // Try next path
                tryLoadFromPaths(paths, index + 1, type, id);
            }
        })
        .catch(function(error) {
            console.log(`Failed to load from ${path}:`, error);
            tryLoadFromPaths(paths, index + 1, type, id);
        });
}

/* ============================
   RENDER CONTENT BY TYPE
   ============================ */
function renderContentByType(type, data, path) {
    console.log(`Successfully loaded ${type} content from: ${path}`);
    
    switch(type) {
        case 'article':
            renderFullArticlePage(data);
            break;
        case 'about':
            renderAboutPage(data);
            break;
        case 'chief-editor':
            renderChiefEditorPage(data);
            break;
        case 'team':
            renderTeamPage(data);
            break;
        case 'editorial':
        case 'breaking':
        case 'opinion':
            renderFullArticlePage(data); // These are article-like
            break;
        default:
            // Try to render as article
            renderFullArticlePage(data);
    }
}

/* ============================
   SHOW FALLBACK CONTENT
   ============================ */
function showFallbackContent(type, id) {
    const mainContent = document.querySelector('main') || document.body;
    
    const fallbackHtml = `
        <div style="max-width: 800px; margin: 50px auto; padding: 30px; text-align: center; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #b30000; margin-bottom: 20px;">Content Coming Soon</h2>
            <p style="color: #666; margin-bottom: 15px;">The ${type} content you're looking for is being prepared.</p>
            <p style="color: #666;">Please check back later.</p>
            <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #b30000; color: white; text-decoration: none; border-radius: 4px;">Return to Homepage</a>
        </div>
    `;
    
    // Try to insert in a sensible place
    const container = document.querySelector('.article-container') || 
                      document.querySelector('.home-main') || 
                      document.querySelector('main') || 
                      document.body;
    
    if (container) {
        container.innerHTML = fallbackHtml;
    } else {
        document.body.innerHTML += fallbackHtml;
    }
}

/* ============================
   RENDER HTML CONTENT
   ============================ */
function renderHtmlContent(html, type, id) {
    const container = document.querySelector('.article-container') || 
                      document.querySelector('main') || 
                      document.body;
    container.innerHTML = html;
}

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
    
    // Update calendars after datetime bar is updated
    updateHijri();
    updateBikrami();
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
   TICKER - LOAD FROM JSON OR USE DEFAULT
   ============================ */
function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Try to load from ticker.json
    fetch("content/ticker.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Ticker JSON not found");
        })
        .then(function(data) {
            const items = data.items || data;
            renderTickerItems(items);
        })
        .catch(function() {
            // Try ticker.txt
            fetch("content/ticker.txt")
                .then(function(response) {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error("Ticker text not found");
                })
                .then(function(text) {
                    const items = text.split('•').map(item => item.trim()).filter(item => item.length > 0);
                    renderTickerItems(items);
                })
                .catch(function() {
                    // Use default ticker
                    const defaultItems = [
                        "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
                        "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
                        "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
                        "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1"
                    ];
                    renderTickerItems(defaultItems);
                });
        });
}

function renderTickerItems(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Ensure items is an array
    const itemArray = Array.isArray(items) ? items : [items];
    
    // Clear existing content
    tickerItems.innerHTML = '';
    
    // Create ticker content with duplication for seamless scrolling
    let html = '';
    
    // Add items twice for seamless loop
    for (let i = 0; i < 2; i++) {
        itemArray.forEach(function(item) {
            html += '<span>' + item + ' • </span>';
        });
    }
    
    tickerItems.innerHTML = html;
    
    // Ensure animation is applied
    tickerItems.style.animation = 'ticker-scroll 40s linear infinite';
    
    // Pause animation on hover
    tickerItems.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    tickerItems.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
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
    
    // Try multiple paths for youtube.json
    const possiblePaths = [
        "content/youtube.json",
        "youtube.json",
        "content/videos.json",
        "videos.json"
    ];
    
    tryLoadYoutubeJson(possiblePaths, 0, grid, visitBtn);
}

function tryLoadYoutubeJson(paths, index, grid, visitBtn) {
    if (index >= paths.length) {
        // No YouTube JSON found, show placeholder
        grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
        if (visitBtn) {
            visitBtn.style.display = 'none';
        }
        return;
    }
    
    fetch(paths[index])
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Not found");
        })
        .then(function(data) {
            if (visitBtn && data.channel && data.channel.url) {
                visitBtn.style.display = 'inline-block';
                visitBtn.addEventListener("click", function() {
                    window.open(data.channel.url, "_blank");
                });
            }
            
            const videos = data.videos || [];
            renderVlogs(videos, grid);
        })
        .catch(function() {
            tryLoadYoutubeJson(paths, index + 1, grid, visitBtn);
        });
}

function renderVlogs(videos, grid) {
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
   FOOTER DROPDOWNS
   ============================ */
function initFooterDropdowns() {
    const footerSections = document.querySelectorAll('.footer-section');
    
    footerSections.forEach(function(section, index) {
        if (index === 0) return; // Skip first section
        
        const heading = section.querySelector('h4');
        if (!heading) return;
        
        heading.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            section.classList.toggle('open');
            
            if (section.classList.contains('open')) {
                heading.classList.add('open');
            } else {
                heading.classList.remove('open');
            }
            
            // Close other dropdowns
            footerSections.forEach(function(otherSection, otherIndex) {
                if (otherIndex !== index && otherIndex !== 0) {
                    otherSection.classList.remove('open');
                    const otherHeading = otherSection.querySelector('h4');
                    if (otherHeading) {
                        otherHeading.classList.remove('open');
                    }
                }
            });
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.footer-section')) {
            footerSections.forEach(function(section, index) {
                if (index !== 0) {
                    section.classList.remove('open');
                    const heading = section.querySelector('h4');
                    if (heading) {
                        heading.classList.remove('open');
                    }
                }
            });
        }
    });
}

/* ============================
   HOMEPAGE CONTENT LOADER - FROM INDEX.JSON
   ============================ */
function loadHomepageContent() {
    // Try multiple paths for index.json
    const possiblePaths = [
        "content/index.json",
        "index.json",
        "content/homepage.json",
        "homepage.json"
    ];
    
    tryLoadHomepageJson(possiblePaths, 0);
}

function tryLoadHomepageJson(paths, index) {
    if (index >= paths.length) {
        console.log("No index.json found, using fallback content");
        loadAllFallbackContent();
        return;
    }
    
    fetch(paths[index])
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Not found");
        })
        .then(function(index) {
            console.log("Index loaded from:", paths[index]);
            
            // Load Top Stories
            if (index.topStories) {
                loadSectionContent("top-stories-grid", [
                    index.topStories.lead,
                    index.topStories.breaking,
                    index.topStories.opinion
                ]);
            } else {
                loadTopStoriesFallback();
            }
            
            // Load Latest/Editorial/Historical
            loadLehSectionFromIndex(index);
            
            // Load Jammu Kashmir
            if (index.jammuKashmir) {
                loadSectionContent("jk-grid", [
                    index.jammuKashmir.first,
                    index.jammuKashmir.second
                ], "JK");
            } else {
                loadJammuKashmirFallback();
            }
            
            // Load International
            if (index.international) {
                loadSectionContent("intl-grid", [
                    index.international.first,
                    index.international.second
                ], "INTL");
            } else {
                loadInternationalFallback();
            }
            
            // Load Human Rights
            if (index.humanRights) {
                loadSectionContent("hr-grid", [
                    index.humanRights.first,
                    index.humanRights.second
                ], "HR");
            } else {
                loadHumanRightsFallback();
            }
        })
        .catch(function() {
            tryLoadHomepageJson(paths, index + 1);
        });
}

/* ============================
   LOAD LEH SECTION FROM INDEX
   ============================ */
function loadLehSectionFromIndex(index) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    const ids = [
        index.latest ? (Array.isArray(index.latest) ? index.latest[0] : index.latest) : null,
        index.editorial ? (Array.isArray(index.editorial) ? index.editorial[0] : index.editorial) : null,
        index.historical ? (Array.isArray(index.historical) ? index.historical[0] : index.historical) : null
    ];
    
    const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
    
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
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article, labels[index]);
                hasContent = true;
            } else if (ids[index]) {
                html += createMissingCard(ids[index], labels[index]);
            } else {
                html += createEmptyCard(labels[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

/* ============================
   LOAD SECTION CONTENT
   ============================ */
function loadSectionContent(gridId, ids, defaultLabel) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    const validIds = ids.filter(id => id !== null && id !== undefined);
    
    if (validIds.length === 0) {
        grid.innerHTML = '<p class="coming-soon">Content coming soon</p>';
        return;
    }
    
    Promise.all(
        validIds.map(function(id) {
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
                html += createArticleCard(article);
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            // Show empty cards
            html = '';
            for (let i = 0; i < validIds.length; i++) {
                html += createEmptyCard(defaultLabel || "Content");
            }
            grid.innerHTML = html;
        }
    });
}

/* ============================
   CREATE ARTICLE CARD
   ============================ */
function createArticleCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || '';
    let image = 'https://via.placeholder.com/400x200?text=No+Image';
    
    if (article.heroImage && article.heroImage.src) {
        image = article.heroImage.src;
        // Fix GitHub image URLs
        if (image.includes('github.com') && !image.includes('raw')) {
            image = image.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
    } else if (article.image) {
        image = article.image;
    }
    
    const id = article.id || '';
    
    let displayTitle = title;
    if (title.length > 80) {
        displayTitle = title.substring(0, 80) + '...';
    }
    
    return `
        <article class="card">
            <div class="media">
                <img src="${image}" alt="${displayTitle}" onerror="this.src='https://via.placeholder.com/400x200?text=News'">
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
   CREATE EMPTY CARD
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

function createMissingCard(id, label) {
    return `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📄</span>
            </div>
            <div class="card-body">
                <h3>${label || id}</h3>
                <p class="coming-soon">Content file not found</p>
            </div>
        </article>
    `;
}

/* ============================
   FALLBACK CONTENT FUNCTIONS
   ============================ */
function loadAllFallbackContent() {
    loadTopStoriesFallback();
    loadLehFallback();
    loadJammuKashmirFallback();
    loadInternationalFallback();
    loadHumanRightsFallback();
}

function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>Complete Shutter Down Paralyses Rawalakot Poonch</h3>
                <p>Thousands shut down Rawalakot in protest against prolonged electricity outages.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>UKPNP Delegation Meets Baroness Emma Nicholson</h3>
                <p>High level delegation discusses Kashmir crisis in London.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>UKPNP Delegation Briefs British MPs</h3>
                <p>Delegation briefs MPs on Kashmir conflict.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        ${createEmptyCard("LATEST")}
        ${createEmptyCard("EDITORIAL")}
        ${createEmptyCard("HISTORICAL")}
    `;
}

function loadJammuKashmirFallback() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
