/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   LOADS CONTENT FROM YOUR JSON FILES
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
    
    // Try to load from config.json first
    fetch("content/config.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Config not found");
        })
        .then(function(config) {
            if (config.weather && config.weather.cities) {
                renderWeatherBar(config.weather.cities);
            } else {
                renderDefaultWeather();
            }
        })
        .catch(function() {
            renderDefaultWeather();
        });
}

function renderWeatherBar(cities) {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    let html = '';
    cities.forEach(function(c, index) {
        html += '<span>' + c.name + ': <strong>' + c.temp + '</strong></span>';
        if (index < cities.length - 1) {
            html += '<span class="separator">•</span>';
        }
    });
    bar.innerHTML = html;
}

function renderDefaultWeather() {
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
    
    // Try to load from index.json first
    fetch("content/index.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Index not found");
        })
        .then(function(index) {
            if (index.ticker && index.ticker.length > 0) {
                renderTicker(index.ticker);
            } else {
                loadTickerFromConfig();
            }
        })
        .catch(function() {
            loadTickerFromConfig();
        });
}

function loadTickerFromConfig() {
    fetch("content/config.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Config not found");
        })
        .then(function(config) {
            if (config.ticker && config.ticker.items) {
                renderTicker(config.ticker.items);
            } else {
                renderDefaultTicker();
            }
        })
        .catch(function() {
            renderDefaultTicker();
        });
}

function renderTicker(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    let html = '';
    for (let i = 0; i < 2; i++) {
        items.forEach(function(item) {
            html += '<span>' + item + ' • </span>';
        });
    }
    tickerItems.innerHTML = html;
}

function renderDefaultTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    const defaultItems = [
        "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
        "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
        "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR"
    ];
    
    let html = '';
    for (let i = 0; i < 2; i++) {
        defaultItems.forEach(function(item) {
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
   VLOGS - LOAD FROM YOUTUBE JSON
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
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
            // Hide visit button if no channel
            if (visitBtn) {
                visitBtn.style.display = 'none';
            }
            grid.innerHTML = '<p class="coming-soon">Videos will appear here.</p>';
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
                    <img src="${thumb}" alt="${v.title || 'Video'}">
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
    // Try to load from index.json first
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
            } else {
                loadTopStoriesFallback();
            }
            
            // Load Latest/Editorial/Historical
            if (index.latestEditorialHistorical) {
                loadLehSection([
                    index.latestEditorialHistorical.latest,
                    index.latestEditorialHistorical.editorial,
                    index.latestEditorialHistorical.historical
                ]);
            } else {
                loadLehFallback();
            }
            
            // Load Jammu Kashmir
            if (index.jammuKashmir) {
                loadJammuKashmir(index.jammuKashmir);
            } else {
                loadJammuKashmirFallback();
            }
            
            // Load International
            if (index.international) {
                loadInternational(index.international);
            } else {
                loadInternationalFallback();
            }
            
            // Load Human Rights
            if (index.humanRights) {
                loadHumanRights(index.humanRights);
            } else {
                loadHumanRightsFallback();
            }
        })
        .catch(function(error) {
            console.log("Index JSON not found, trying config.json", error);
            
            // Try config.json as fallback
            fetch("content/config.json")
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Config JSON not found");
                })
                .then(function(config) {
                    console.log("Config loaded:", config);
                    
                    if (config.sections) {
                        // Load Top Stories
                        if (config.sections.topStories && config.sections.topStories.content) {
                            loadTopStories(config.sections.topStories.content);
                        } else {
                            loadTopStoriesFallback();
                        }
                        
                        // Load Latest/Editorial/Historical
                        if (config.sections.latestEditorialHistorical && config.sections.latestEditorialHistorical.content) {
                            loadLehSection(config.sections.latestEditorialHistorical.content);
                        } else {
                            loadLehFallback();
                        }
                        
                        // Load Jammu Kashmir
                        if (config.sections.jammuKashmir && config.sections.jammuKashmir.content) {
                            loadJammuKashmir(config.sections.jammuKashmir.content);
                        } else {
                            loadJammuKashmirFallback();
                        }
                        
                        // Load International
                        if (config.sections.international && config.sections.international.content) {
                            loadInternational(config.sections.international.content);
                        } else {
                            loadInternationalFallback();
                        }
                        
                        // Load Human Rights
                        if (config.sections.humanRights && config.sections.humanRights.content) {
                            loadHumanRights(config.sections.humanRights.content);
                        } else {
                            loadHumanRightsFallback();
                        }
                    } else {
                        loadAllFallback();
                    }
                })
                .catch(function() {
                    console.log("No config found, using fallback");
                    loadAllFallback();
                });
        });
}

function loadAllFallback() {
    loadTopStoriesFallback();
    loadLehFallback();
    loadJammuKashmirFallback();
    loadInternationalFallback();
    loadHumanRightsFallback();
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
                html += createArticleCard(article);
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
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body">
                <h3>UKPNP Delegation Meets Baroness Emma Nicholson</h3>
                <p>High level delegation discusses Kashmir crisis in London...</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">📰</span></div>
            <div class="card-body">
                <h3>UKPNP Delegation Briefs British MPs</h3>
                <p>Delegation briefs MPs on Kashmir conflict...</p>
                <a href="#" class="btn-red">Read More →</a>
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
        let hasContent = false;
        const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article, labels[index]);
                hasContent = true;
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
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createArticleCard(article, "JK");
                hasContent = true;
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
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createArticleCard(article, "INTL");
                hasContent = true;
            } else {
                html += createEmptyCard("INTL");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadInternationalFallback() {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media"><span class="placeholder-icon">🌍</span></div>
            <div class="card-body"><h3>International News</h3><p class="coming-soon">INTL</p></div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">🌎</span></div>
            <div class="card-body"><h3>World Affairs</h3><p class="coming-soon">INTL</p></div>
        </article>
    `;
}

/* ============================
   LOAD HUMAN RIGHTS
   ============================ */
function loadHumanRights(ids) {
    const grid = document.getElementById("hr-grid");
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
                html += createArticleCard(article, "HR");
                hasContent = true;
            } else {
                html += createEmptyCard("HR");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadHumanRightsFallback() {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media"><span class="placeholder-icon">❤️</span></div>
            <div class="card-body"><h3>Human Rights</h3><p class="coming-soon">HR</p></div>
        </article>
        <article class="card">
            <div class="media"><span class="placeholder-icon">⚖️</span></div>
            <div class="card-body"><h3>UNHRC Updates</h3><p class="coming-soon">HR</p></div>
        </article>
    `;
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
        // Fix GitHub image URLs if needed
        if (image.includes('github.com') && !image.includes('raw')) {
            image = image.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
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

function createEmptyCard(label) {
    return `
        <article class="card">
            <div class="media"><span class="placeholder-icon">📄</span></div>
            <div class="card-body"><h3>${label}</h3><p class="coming-soon">Coming soon</p></div>
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
            renderAboutPage(about);
        })
        .catch(function() {
            document.body.innerHTML += '<div style="text-align:center; padding:50px;">About content coming soon</div>';
        });
}

function renderAboutPage(data) {
    // This would need the about.html structure
    console.log("About page data:", data);
    // Implement based on your about.html structure
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
            renderChiefEditorPage(editor);
        })
        .catch(function() {
            document.body.innerHTML += '<div style="text-align:center; padding:50px;">Chief Editor content coming soon</div>';
        });
}

function renderChiefEditorPage(data) {
    // This would need the chief-editor.html structure
    console.log("Chief Editor data:", data);
    // Implement based on your chief-editor.html structure
}

/* ============================
   ARTICLE PAGE INITIALIZATION
   ============================ */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) {
        document.body.innerHTML += '<div style="text-align:center; padding:50px;">No article specified</div>';
        return;
    }
    
    fetch("content/" + id + ".json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Article not found");
        })
        .then(function(article) {
            renderFullArticlePage(article);
        })
        .catch(function() {
            document.body.innerHTML += '<div style="text-align:center; padding:50px;">Article not found</div>';
        });
}

function renderFullArticlePage(article) {
    // This would need the article.html structure
    console.log("Article data:", article);
    // Implement based on your article.html structure
}

// Make copyPageLink globally available
window.copyPageLink = copyPageLink;
