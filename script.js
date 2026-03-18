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
    
    // Load all content from JSON files
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
   TICKER - LOAD FROM JSON
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
            // Fallback to default ticker items
            const defaultItems = [
                "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
                "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
                "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
                "HOPE BECOMES REAL THROUGH ACTION, PERSISTENCE AND PRINCIPLED JOURNALISM",
                "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1",
                "EQUALITY WITHOUT DISCRIMINATION IS A RIGHT, NOT A PRIVILEGE"
            ];
            renderTickerItems(defaultItems);
        });
}

function renderTickerItems(items) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Ensure items is an array
    const itemArray = Array.isArray(items) ? items : [items];
    
    // Duplicate for seamless scrolling
    const allItems = itemArray.concat(itemArray);
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
   HOMEPAGE CONTENT LOADER - FROM JSON
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
                loadTopStoriesFallback();
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
            console.log("Index JSON not found, using fallback content", error);
            // Load all fallback content
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
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>Complete Shutter Down Paralyses Rawalakot Poonch</h3>
                <p>Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>UKPNP Delegation Meets Baroness Emma Nicholson</h3>
                <p>A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>UKPNP Delegation Briefs British MPs</h3>
                <p>A high level delegation briefed British Members of Parliament on the historical roots of the Kashmir conflict and current human rights situation.</p>
                <a href="#" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   LOAD LEH SECTION
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
        let hasContent = false;
        const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
        
        articles.forEach(function(article, index) {
            if (article) {
                html += createArticleCard(article, labels[index]);
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            loadLehFallback();
        }
    });
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📰</span>
            </div>
            <div class="card-body">
                <h3>LATEST</h3>
                <p class="coming-soon">Latest news and updates will appear here.</p>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📝</span>
            </div>
            <div class="card-body">
                <h3>EDITORIAL</h3>
                <p class="coming-soon">Editorial content will appear here.</p>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">📜</span>
            </div>
            <div class="card-body">
                <h3>HISTORICAL</h3>
                <p class="coming-soon">Historical analysis will appear here.</p>
            </div>
        </article>
    `;
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
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createArticleCard(article, "JK");
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            loadJammuKashmirFallback();
        }
    });
}

function loadJammuKashmirFallback() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">🏔️</span>
            </div>
            <div class="card-body">
                <h3>Jammu Region</h3>
                <p class="coming-soon">JK</p>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">🏞️</span>
            </div>
            <div class="card-body">
                <h3>Kashmir Valley</h3>
                <p class="coming-soon">JK</p>
            </div>
        </article>
    `;
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
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createArticleCard(article, "INTL");
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            loadInternationalFallback();
        }
    });
}

function loadInternationalFallback() {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">🌍</span>
            </div>
            <div class="card-body">
                <h3>International News</h3>
                <p class="coming-soon">INTL</p>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">🌎</span>
            </div>
            <div class="card-body">
                <h3>World Affairs</h3>
                <p class="coming-soon">INTL</p>
            </div>
        </article>
    `;
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
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                html += createArticleCard(article, "HR");
                hasContent = true;
            }
        });
        
        if (hasContent) {
            grid.innerHTML = html;
        } else {
            loadHumanRightsFallback();
        }
    });
}

function loadHumanRightsFallback() {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">❤️</span>
            </div>
            <div class="card-body">
                <h3>Human Rights</h3>
                <p class="coming-soon">HR</p>
            </div>
        </article>
        <article class="card">
            <div class="media">
                <span class="placeholder-icon">⚖️</span>
            </div>
            <div class="card-body">
                <h3>UNHRC Updates</h3>
                <p class="coming-soon">HR</p>
            </div>
        </article>
    `;
}

/* ============================
   CREATE ARTICLE CARD FROM JSON
   ============================ */
function createArticleCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || '';
    let image = 'https://via.placeholder.com/400x200?text=News';
    
    if (article.heroImage && article.heroImage.src) {
        image = article.heroImage.src;
    } else if (article.image) {
        image = article.image;
    }
    
    const id = article.id || '';
    
    // Clean up title for display
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

// Export functions for use in other pages
window.copyPageLink = copyPageLink;
