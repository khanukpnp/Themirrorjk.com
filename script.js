,,
/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - INTEGRATED PRODUCTION ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded - initializing application architecture...");
    
    // Core Layout Components
    initLoader();
    initYear();
    initClocks();
    initWeatherBar(); 
    initNav();
    initContactModal();
    initVlogs();
    initLanguageSelector();
    initSearch();
    initSocialButtons();
    initFileUpload();
    initNewsletter();
    initFooterDropdowns();
    initReadingProgress();
    initDisclosureAutoScroll();
    
    // Dynamic Application Routing Engine
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");
    
    if (path.includes("about.html") || path.includes("about-001.html")) {
        loadAboutPage();
    } else if (path.includes("chief-editor.html") || path.includes("chief-editor-001.html")) {
        loadChiefEditorPage();
    } else if (path.includes("historical.html")) {
        loadHistoricalPage();
    } else if (path.includes("article.html") || articleId) {
        initArticlePage();
    } else {
        loadHomepageContent();
    }
    
    addGlobalReadMoreInterceptor();
    setInterval(updateClocks, 1000);
    setInterval(initWeatherBar, 900000);
});

/* ==========================================================================
   LOADER & FOOTER MECHANICAL COMPONENTS
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() { loader.style.display = "none"; }, 300);
    }, 1200);
}
function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   PRECISION TIMEBAR CALENDAR ARCHITECTURE
   ========================================================================== */
function initClocks() {
    updateClocks();
}
function updateClocks() {
    const now = new Date();
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    const fullDate = now.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const zurichTime = now.toLocaleTimeString("en-GB", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const cestText = fullDate + " at " + zurichTime;
    
    const istTimeStr = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false });
    const istTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const istAmpm = parseInt(istTimeStr) >= 12 ? 'pm' : 'am';
    const istFull = istTime + ' ' + istAmpm;
    
    const pktTimeStr = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", hour12: false });
    const pktTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const pktAmpm = parseInt(pktTimeStr) >= 12 ? 'pm' : 'am';
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
        return new Intl.DateTimeFormat("en-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(new Date()) + " AH";
    } catch(e) {
        return "Ramadan, 1447 AH";
    }
}
function getBikramiDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    const bikramiMonths = ["Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon", "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"];
    const bikramiDays = ["Aitvaar", "Somvaar", "Mangalvaar", "Budhvaar", "Veervaar", "Shukarvaar", "Shanivaar"];
    
    let bikramiYear = year + 57;
    let bikramiMonth = 0;
    let bikramiDay = day;
    
    if (month === 2) { 
        if (day >= 14) { bikramiMonth = 0; bikramiDay = day - 13; } 
        else { bikramiMonth = 11; bikramiYear = year + 56; bikramiDay = day + 18; }
    }
    else if (month === 3) { bikramiMonth = 0; bikramiDay = day + 17; if (bikramiDay > 31) { bikramiDay -= 31; bikramiMonth = 1; }}
    else if (month === 4) { bikramiMonth = 1; bikramiDay = day + 16; if (bikramiDay > 31) { bikramiDay -= 31; bikramiMonth = 2; }}
    else if (month === 5) { bikramiMonth = 2; bikramiDay = day + 16; if (bikramiDay > 31) { bikramiDay -= 31; bikramiMonth = 3; }}
    else if (month === 6) { bikramiMonth = 3; bikramiDay = day + 17; if (bikramiDay > 31) { bikramiDay -= 31; bikramiMonth = 4; }}
    else if (month === 7) { bikramiMonth = 4; bikramiDay = day + 17; if (bikramiDay > 31) { bikramiDay -= 31; bikramiMonth = 5; }}
    else if (month === 8) { bikramiMonth = 5; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 6; }}
    else if (month === 9) { bikramiMonth = 6; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 7; }}
    else if (month === 10) { bikramiMonth = 7; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 8; }}
    else if (month === 11) { bikramiMonth = 8; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 9; }}
    else if (month === 0) { bikramiMonth = 9; bikramiYear = year + 56; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 10; }}
    else if (month === 1) { bikramiMonth = 10; bikramiYear = year + 56; bikramiDay = day + 16; if (bikramiDay > 30) { bikramiDay -= 30; bikramiMonth = 11; }}
    
    if (bikramiDay < 1) bikramiDay = 1;
    return bikramiDays[today.getDay()] + ", " + bikramiDay + " " + bikramiMonths[bikramiMonth] + " " + bikramiYear + " VS";
}

/* ==========================================================================
   AUTOMATED WEATHER PIPELINE
   ========================================================================== */
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    const cities = [
        { name: "Zurich", lat: 47.3769, lon: 8.5417, temp: "6°C" },
        { name: "Rawalakot", lat: 33.8578, lon: 73.7604, temp: "9°C" },
        { name: "Jammu", lat: 32.7266, lon: 74.8570, temp: "18°C" },
        { name: "Kashmir", lat: 34.0837, lon: 74.7973, temp: "4°C" }, 
        { name: "Ladakh", lat: 34.1526, lon: 77.5771, temp: "-2°C" }, 
        { name: "Gilgit", lat: 35.9208, lon: 74.3089, temp: "3°C" },
        { name: "Baltistan", lat: 35.2974, lon: 75.6329, temp: "-1°C" }, 
        { name: "Muzaffarabad", lat: 34.3700, lon: 73.4711, temp: "10°C" }
    ];
    const lats = cities.map(c => c.lat).join(",");
    const lons = cities.map(c => c.lon).join(",");
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            let dataArray = Array.isArray(data) ? data : [data];
            const updatedHtml = cities.map((city, idx) => {
                const liveData = dataArray[idx]?.current_weather;
                const finalTemp = liveData ? `${Math.round(liveData.temperature)}°C` : city.temp;
                return `<span>${city.name}: <strong>${finalTemp}</strong></span>`;
            }).join('<span class="separator">•</span>');
            bar.innerHTML = updatedHtml;
        })
        .catch(() => {
            bar.innerHTML = cities.map(c => `<span>${c.name}: <strong>${c.temp}</strong></span>`).join('<span class="separator">•</span>');
        });
}

/* ==========================================================================
   TICKER & INTERACTION CONTROLS
   ========================================================================== */
function initTicker(jsonData) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    const items = (jsonData && jsonData.ticker) ? jsonData.ticker : [
        "WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY",
        "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH",
        "GOT NEWS, FEEDBACK OR URGENT UPDATES? CONTACT THE MIRROR JAMMU KASHMIR"
    ];
    
    let html = '';
    for (let i = 0; i < 2; i++) {
        items.forEach(item => { html += '<span>' + item + ' • </span>'; });
    }
    tickerItems.innerHTML = html;
}
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (hamburger && navList && mobileMenu) {
        hamburger.addEventListener("click", function() {
            const expanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", String(!expanded));
            mobileMenu.hidden = expanded;
            if (!expanded) mobileMenu.innerHTML = navList.innerHTML;
        });
    }
    
    document.querySelectorAll(".has-sub").forEach(item => {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        if (btn && dropdown) {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                document.querySelectorAll(".dropdown").forEach(d => { if (d !== dropdown) d.style.display = "none"; });
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
        }
    });
    
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".has-sub")) {
            document.querySelectorAll(".dropdown").forEach(d => { d.style.display = "none"; });
        }
    });
}
function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    const cancelBtn = document.getElementById("modal-cancel");
    const contactForm = document.getElementById("contact-form");
    
    if (!modal) return;
    if (openBtn) openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    if (cancelBtn) cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
    
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            if (document.getElementById("contact-name")?.value && document.getElementById("contact-email")?.value) {
                showToast("Thank you for your message!");
                modal.classList.add("hidden");
                contactForm.reset();
            }
        });
    }
}
function initDisclosureAutoScroll() {
    document.querySelectorAll('.inline-section-archive').forEach(disclosure => {
        disclosure.addEventListener('toggle', function() {
            if (disclosure.open) {
                setTimeout(() => {
                    disclosure.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

/* ==========================================================================
   VLOG REPOSITORY HANDLER (9-WINDOW GRID FORMAT)
   ========================================================================== */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const archiveGrid = document.getElementById("vlogs-archive-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    if (!grid) return;
    
    fetch("content/youtube.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            if (visitBtn && data.channel?.url) {
                visitBtn.href = data.channel.url;
            }
            renderVlogs(data.videos || [], grid, archiveGrid);
        })
        .catch(() => {
            renderVlogsFallback();
        });
}
function renderVlogs(videos, mainGrid, archiveGrid) {
    if (!mainGrid) return;
    if (!videos.length) { renderVlogsFallback(); return; }
    
    const activeVlogs = videos.slice(0, 9);
    const archivedVlogs = videos.slice(9);
    
    const mapHtml = v => {
        const thumb = v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : 'https://via.placeholder.com/640x360?text=Video';
        return `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title}" onerror="this.src='https://via.placeholder.com/640x360?text=Video'">
                    <div class="vlog-play-icon" onclick="playVideo('${v.youtubeId}')">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>${v.description || ''}</p>
                    ${createCardNavOptions(v.id)}
                </div>
            </article>`;
    };
    mainGrid.innerHTML = activeVlogs.map(mapHtml).join('');
    if (archiveGrid) {
        archiveGrid.innerHTML = archivedVlogs.length ? archivedVlogs.map(mapHtml).join('') : '<p style="padding:15px; color:#666;">No older vlogs archived.</p>';
    }
}
function renderVlogsFallback() {
    const grid = document.getElementById("vlogs-grid");
    const archiveGrid = document.getElementById("vlogs-archive-grid");
    if (!grid) return;
    const fallbacks = [
        { title: "UN Geneva: Azad Kashmir Under Siege", description: "Protest exposes lethal crackdown and internet blackouts in AJK.", duration: "1:08:24", youtubeId: "FE9farW5M18" },
        { title: "Azad Kashmir Under Siege", description: "Communication blackout, curfews, and widespread leadership actions.", duration: "15:32", youtubeId: "lRE5cVWbWmA" },
        { title: "Kashmiri Leaders Geneva Briefing", description: "Crucial international briefing on human rights developments.", duration: "12:45", youtubeId: "1Sbomv3juT4" },
        { title: "Rawalakot CMH Incident Coverage", description: "Eyewitness updates and live analysis of the recent events.", duration: "18:10", youtubeId: "lRE5cVWbWmA" },
        { title: "JAAC Rights Movement Special", description: "Detailed documentary on grassroots public advocacy.", duration: "22:15", youtubeId: "1Sbomv3juT4" },
        { title: "Diaspora Million March Report", description: "Coverage of overseas demonstrations across major European capitals.", duration: "14:50", youtubeId: "FE9farW5M18" },
        { title: "Human Rights Forum Geneva", description: "Special addresses at the UNHRC side events.", duration: "19:40", youtubeId: "lRE5cVWbWmA" },
        { title: "Poonch & Sudhnuti Ground Report", description: "Field reports detailing economic and social developments.", duration: "11:20", youtubeId: "1Sbomv3juT4" },
        { title: "Press Conference Digest", description: "Statements issued by cross-border civil society leadership.", duration: "16:05", youtubeId: "FE9farW5M18" }
    ];
    renderVlogs(fallbacks, grid, archiveGrid);
}
function playVideo(id) { if (id) window.open('https://www.youtube.com/watch?v=' + id, '_blank'); }

/* ==========================================================================
   INTERACTION CONTROLS & MODERN BUTTONS
   ========================================================================== */
function initLanguageSelector() {
    document.getElementById("language-select")?.addEventListener("change", e => {
        showToast("Language set to " + e.target.options[e.target.selectedIndex].text);
    });
}
function initSearch() {
    document.querySelector(".search")?.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("search-input")?.value.trim();
        if (input) showToast("Searching for: " + input);
    });
}
function initSocialButtons() {
    let liked = false;
    document.addEventListener("click", function(e) {
        const btn = e.target.closest("button");
        if (!btn) return;
        
        const id = btn.id || btn.getAttribute("data-id");
        if (id === "like") {
            liked = !liked;
            btn.style.backgroundColor = liked ? "#E63946" : "#FFEBEB";
            btn.style.color = liked ? "#FFFFFF" : "#E63946";
            const svg = btn.querySelector("svg");
            if (svg) {
                svg.style.fill = liked ? "#FFFFFF" : "#E63946";
                svg.style.stroke = liked ? "#FFFFFF" : "#E63946";
            }
            showToast(liked ? "Thank you for liking!" : "Unliked");
        } else if (id === "subscribe") {
            document.getElementById("newsletter")?.scrollIntoView({ behavior: 'smooth' });
            showToast("Scrolling to newsletter subscription...");
        } else if (id === "share") {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: 'The Mirror Jammu Kashmir',
                    url: window.location.href,
                }).catch(() => copyPageLink());
            } else {
                copyPageLink();
            }
        } else if (id === "copyLink") {
            copyPageLink();
        }
    });
}
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast("Link successfully copied to clipboard!"))
        .catch(() => showToast("Failed to copy link"));
}
function showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#800000; color:white; padding:10px 24px; border-radius:30px; box-shadow:0 4px 12px rgba(0,0,0,0.3); z-index:9999; font-weight:600; font-size:0.9rem; transition:opacity 0.3s ease;";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const nameSpan = document.querySelector(".file-name");
    if (fileInput && nameSpan) {
        fileInput.addEventListener("change", () => {
            nameSpan.textContent = fileInput.files.length ? fileInput.files[0].name : "No file chosen";
        });
    }
}
function initNewsletter() {
    document.getElementById("subscribeBtn")?.addEventListener("click", e => {
        e.preventDefault();
        const email = document.getElementById("subscribeEmail")?.value.trim();
        if (email && email.includes("@")) { showToast("Thank you for subscribing!"); }
        else { showToast("Please enter a valid email address."); }
    });
}
function initFooterDropdowns() {
    document.querySelectorAll('.footer-section').forEach(section => {
        section.querySelector('h4')?.addEventListener('click', e => {
            e.preventDefault();
            section.classList.toggle('open');
        });
    });
}

/* ==========================================================================
   DYNAMIC HOMEPAGE CONTENT INGESTION ENGINE
   ========================================================================== */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(index => {
            initTicker(index);
            
            // 1. Ingest Spotlight, In Focus & Trending (6 Windows)
            if (index.spotlightFocusTrending) {
                loadSpotlightSection(index.spotlightFocusTrending);
            } else {
                loadSpotlightSection({
                    topRow: ["spotlight-001", "infocus-001", "trending-001"],
                    bottomRow: ["spotlight-002", "infocus-002", "trending-002"]
                });
            }
            // 2. Top Stories Grid
            if (index.topStories) {
                loadTopStories([
                    index.topStories.lead, 
                    index.topStories.breaking, 
                    index.topStories.opinion
                ]);
            } else { loadTopStoriesFallback(); }
            
            // 3. Latest / Editorial / Historical Grid
            if (index.latestEditorialHistorical) {
                loadLehSection([
                    index.latestEditorialHistorical.latest, 
                    index.latestEditorialHistorical.editorial, 
                    index.latestEditorialHistorical.historical
                ]);
            } else { loadLehFallback(); }
            
            // 4. Category Grids
            if (index.jammuKashmir) loadSectionGroup("jk-grid", "jk-archive-grid", index.jammuKashmir, "JK", "Jammu Kashmir");
            if (index.international) loadSectionGroup("intl-grid", "intl-archive-grid", index.international, "INTL", "International Diplomacy");
            if (index.humanRights) loadSectionGroup("hr-grid", "hr-archive-grid", index.humanRights, "HR", "Human Rights");
        })
        .catch(() => {
            initTicker(null);
            loadSpotlightSection({
                topRow: ["spotlight-001", "infocus-001", "trending-001"],
                bottomRow: ["spotlight-002", "infocus-002", "trending-002"]
            });
            loadTopStoriesFallback();
            loadLehFallback();
        });
}

/* ==========================================================================
   SPOTLIGHT, IN FOCUS & TRENDING ENGINE (6 WINDOW LAYOUT)
   ========================================================================== */
function loadSpotlightSection(config) {
    const topRowIds = config.topRow || ["spotlight-001", "infocus-001", "trending-001"];
    const bottomRowIds = config.bottomRow || ["spotlight-002", "infocus-002", "trending-002"];
    
    const badges = {
        'spotlight': { label: 'SPOTLIGHT', class: 'spotlight-badge' },
        'infocus': { label: 'IN FOCUS', class: 'focus-badge' },
        'trending': { label: 'TRENDING NOW', class: 'trending-badge' }
    };
    const renderRow = (ids, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json`).then(r => r.ok ? r.json() : null).catch(() => null)))
            .then(articles => {
                container.innerHTML = articles.map((item, index) => {
                    if (!item) return createComingSoonCard(`Window ${index + 1}`);
                    const article = item.items ? item.items[0] : item;
                    const idKey = (article.id || ids[index] || '').toLowerCase();
                    
                    let badgeInfo = badges['spotlight'];
                    if (idKey.includes('focus')) badgeInfo = badges['infocus'];
                    if (idKey.includes('trending')) badgeInfo = badges['trending'];
                    let imgUrl = article.heroImage?.src || article.heroImage || article.image || 'content/images/logo.png';
                    return `
                        <div class="news-card-badge ${badgeInfo.class}">
                            <span class="card-badge">${badgeInfo.label}</span>
                            <div class="image-container">
                                <img src="${imgUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/640x360?text=News'">
                            </div>
                            <h3>${article.title}</h3>
                            <p>${(article.excerpt || article.summary || '').substring(0, 110)}...</p>
                            ${createCardNavOptions(article.id)}
                        </div>
                    `;
                }).join('');
            });
    };
    renderRow(topRowIds, 'spotlight-top-row');
    renderRow(bottomRowIds, 'spotlight-bottom-row');
}
function loadSectionGroup(gridId, archiveGridId, ids, label, categoryKey) {
    const grid = document.getElementById(gridId);
    const archiveGrid = document.getElementById(archiveGridId);
    if (!grid || !ids) return;
    
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            let validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let activeSlice = validArticles.slice(0, 3);
            let archiveSlice = validArticles.slice(3);
            
            let cardsHtml = activeSlice.map(a => createHomepageCard(a)).join('');
            while (activeSlice.length < 3) {
                cardsHtml += createComingSoonCard(label);
                activeSlice.push({});
            }
            grid.innerHTML = cardsHtml;
            if (archiveGrid) {
                archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a)).join('') : `<p style="padding:15px; color:#666;">No older ${label} entries archived.</p>`;
            }
        });
}
function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    const archiveGrid = document.getElementById("top-stories-archive-grid");
    if (!grid) return;
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let activeSlice = validArticles.slice(0, 3);
            let archiveSlice = validArticles.slice(3);
            let cardsHtml = activeSlice.map(a => createHomepageCard(a)).join('');
            while (activeSlice.length < 6) {
                cardsHtml += createComingSoonCard("Top Story Update");
                activeSlice.push({});
            }
            grid.innerHTML = cardsHtml;
            if (archiveGrid) {
                archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a)).join('') : '<p style="padding:15px; color:#666;">No older Top Stories archived.</p>';
            }
        })
        .catch(() => loadTopStoriesFallback());
}
function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    let html = `
        <article class="card">
            <div class="media"><img src="content/images/img1.jpg" alt="Top Story" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                <h3>UKPNP Holds Historic Event on 28 April 1949 Karachi Agreement</h3>
                <p>A comprehensive report detailing the landmark Rawalakot event...</p>
                ${createCardNavOptions('top-story-001')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img2.jpg" alt="Top Story" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                <h3>High Level UKPNP Delegation Meets Baroness Em</h3>
                <p>A high level delegation led by Exiled Chairman Sardar Shaukat Ali Kashmiri...</p>
                ${createCardNavOptions('top-story-002')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img3.jpg" alt="Top Story" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                <h3>UKPNP Delegation Briefs British MPs on Kashmir Crisis</h3>
                <p>Briefing British Members of Parliament in London on ongoing developments...</p>
                ${createCardNavOptions('top-story-003')}
            </div>
        </article>
    `;
    html += createComingSoonCard("Top Story Feature");
    html += createComingSoonCard("Top Story Dispatch");
    html += createComingSoonCard("Top Story Analysis");
    grid.innerHTML = html;
}
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    const archiveGrid = document.getElementById("leh-archive-grid");
    if (!grid) return;
    const labels = ["LATEST", "EDITORIAL", "HISTORICAL", "LATEST UPDATE", "EDITORIAL DIGEST", "HISTORICAL ARCHIVE"];
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let activeSlice = validArticles.slice(0, 3);
            let archiveSlice = validArticles.slice(3);
            let cardsHtml = activeSlice.map((a, i) => createHomepageCard(a, labels[i])).join('');
            while (activeSlice.length < 6) {
                const labelIndex = activeSlice.length;
                cardsHtml += createComingSoonCard(labels[labelIndex] || "Upcoming Feature");
                activeSlice.push({});
            }
            grid.innerHTML = cardsHtml;
            if (archiveGrid) {
                archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a)).join('') : '<p style="padding:15px; color:#666;">No older updates archived.</p>';
            }
        })
        .catch(() => loadLehFallback());
}
function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    let html = `
        <article class="card">
            <div class="media"><img src="content/images/img1.jpg" alt="Latest" onerror="this.src='https://via.placeholder.com/640x360?text=Latest'"></div>
            <div class="card-body">
                <span class="category-label">LATEST</span>
                <h3>Dangerous Escalation: US–Israel Strikes on Iran</h3>
                <p>A sharp escalation between the United States, Israel, and Iran...</p>
                ${createCardNavOptions('latest-001')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img2.jpg" alt="Editorial" onerror="this.src='https://via.placeholder.com/640x360?text=Editorial'"></div>
            <div class="card-body">
                <span class="category-label">EDITORIAL</span>
                <h3>Brief History of the State of Jammu and Kashmir, 1819–1953</h3>
                <p>A comprehensive historical analysis of political evolution...</p>
                ${createCardNavOptions('editorial-001')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img3.jpg" alt="Historical" onerror="this.src='https://via.placeholder.com/640x360?text=Historical'"></div>
            <div class="card-body">
                <span class="category-label">HISTORICAL</span>
                <h3>US and Israel Strikes on Iran and Retaliatory Attacks</h3>
                <p>Sardar Shaukat Ali Kashmiri warns that recent joint strikes...</p>
                ${createCardNavOptions('historical-001')}
            </div>
        </article>
    `;
    html += createComingSoonCard("LATEST UPDATE");
    html += createComingSoonCard("EDITORIAL DIGEST");
    html += createComingSoonCard("HISTORICAL ARCHIVE");
    grid.innerHTML = html;
}
function createComingSoonCard(customLabel = "Upcoming Feature") {
    return `
        <article class="card coming-soon-card">
            <div class="media empty-media">
                <div class="coming-soon-badge">${customLabel.toUpperCase()}</div>
                <span class="placeholder-icon">⌛</span>
            </div>
            <div class="card-body" style="text-align: center; justify-content: center;">
                <h3 style="color: #b30000; font-size: 1.15rem; margin-bottom: 6px;">Coming Soon</h3>
                <p style="color: #666; font-style: italic; font-size: 0.9rem; margin-bottom: 12px;">
                    Visit us later for new updates and dispatches.
                </p>
            </div>
        </article>
    `;
}

/* CLEAN HOMEPAGE CARD BUTTON (ONLY READ MORE) */
function createCardNavOptions(articleId) {
    return `
        <div class="card-nav-options" style="justify-content: flex-end;">
            <a href="article.html?id=${articleId || ''}" class="card-nav-btn next-link">Read More ➔</a>
        </div>
    `;
}

function createHomepageCard(article, label) {
    if (!article) return '';
    const title = article.title || 'Untitled Report';
    const excerpt = article.excerpt || article.summary || 'Click below to read full article coverage.';
    let image = article.heroImage?.src || article.heroImage || article.image || 'content/images/img1.jpg';
    
    return `
        <article class="card">
            <div class="media"><img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                ${label ? `<span class="category-label">${label}</span>` : ''}
                <h3>${title.substring(0, 80)}</h3>
                <p>${excerpt.substring(0, 120)}...</p>
                ${createCardNavOptions(article.id)}
            </div>
        </article>`;
}

/* ==========================================================================
   ARTICLE DETAILED VIEW PIPELINE & GLOBAL BOTTOM COMPONENT RENDERER
   ========================================================================== */
function initArticlePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    const mainContentEl = document.getElementById("content") || document.getElementById("article-content") || document.body;
    
    if (!id) {
        if (mainContentEl) {
            mainContentEl.innerHTML = `<p style="padding: 20px; text-align: center;">No article target specified. Please return to the home screen.</p>`;
        }
        return;
    }
    
    fetch(`content/${id.toLowerCase()}.json`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            const article = data.items ? data.items[0] : data;
            renderFullArticlePage(article);
        })
        .catch(() => {
            fetch("content/archive.json")
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(archiveData => {
                    const match = (archiveData.items || []).find(item => item.id.toLowerCase() === id.toLowerCase());
                    if (match) { 
                        renderFullArticlePage(match); 
                    } else { 
                        renderArticleFallback(id); 
                    }
                })
                .catch(() => renderArticleFallback(id));
        });
}
function renderArticleFallback(id) {
    const contentEl = document.getElementById("content") || document.getElementById("article-content") || document.body;
    if (contentEl) {
        contentEl.innerHTML = `
            <div style="max-width: 800px; margin: 40px auto; padding: 20px; text-align: center; font-family:'Source Sans Pro', sans-serif;">
                <h2 style="color:#b30000; font-family:'Playfair Display', serif;">Resource Not Loaded</h2>
                <p style="color:#555; margin-top:10px;">The target item "${id}" could not be parsed dynamically. Please verify directories and file parameters.</p>
                <a href="index.html" style="display:inline-block; margin-top:20px; background:#b30000; color:#fff; padding:10px 20px; text-decoration:none; font-weight:bold; border-radius:4px;">Return Home</a>
            </div>`;
    }
}
function renderFullArticlePage(article) {
    const loader = document.getElementById('loading-state');
    if (loader) loader.style.display = 'none';
    
    const contentEl = document.getElementById("content") || document.getElementById("article-content") || document.body;
    if (!contentEl) return;
    contentEl.style.display = 'block';
    
    document.title = (article.title || "Article") + " | THE MIRROR JAMMU KASHMIR";
    
    let rawDate = article.date || "";
    let processedDate = rawDate;
    if (rawDate) {
        try {
            processedDate = new Date(rawDate).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' });
        } catch(e) {
            processedDate = rawDate;
        }
    }

    const navData = article.navigation || article.bottomNavigation || {
        prev: "index.html",
        prevTitle: "Previous Story",
        next: "index.html",
        nextTitle: "Next Story"
    };
    
    contentEl.innerHTML = `
        <article class="prose-container" style="max-width: 850px; margin: 40px auto; padding: 0 20px; font-family:'Source Sans Pro', sans-serif; line-height: 1.8;">
            <header style="margin-bottom: 2.5rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 1.5rem;">
                <span style="color:#b30000; font-weight:700; text-transform:uppercase; font-size:0.85rem; letter-spacing:1px; display:block; margin-bottom:0.5rem;">
                    ${article.category || article.sectionLabel || 'News'}
                </span>
                <h1 style="font-family:'Playfair Display', serif; font-size: 2.5rem; line-height: 1.25; margin: 0 0 1rem 0; color:#111; font-weight:900;">
                    ${article.title}
                </h1>
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; font-size:0.9rem; color:#666; gap:10px;">
                    <div>By <strong style="color:#111;">${article.author || 'Editorial Desk'}</strong> | ${article.location || ''}</div>
                    <div>${processedDate} | ⏱️ ${article.readTime || '5 min read'}</div>
                </div>
            </header>
            ${article.heroImage && (article.heroImage.src || typeof article.heroImage === 'string') ? `
                <figure style="margin: 0 0 2.5rem 0; text-align:center;">
                    <img src="${article.heroImage.src || article.heroImage}" alt="${article.title}" style="width:100%; height:auto; max-height:480px; object-fit:cover; border-radius:4px;" onerror="this.style.display='none'">
                    ${article.heroImage.caption ? `<figcaption style="text-align:left; color:#666; font-size:0.85rem; padding:8px 12px; border-left:3px solid #b30000; background:#f9f9f9; margin-top:8px; font-style:italic;">${article.heroImage.caption}</figcaption>` : ''}
                </figure>
            ` : ''}
            <div class="article-body-content" style="font-size:1.15rem; color:#222; line-height:1.8;">
                ${renderJSONBody(article.body || article.content)}
            </div>
            ${generateArticleActionButtons(article.actionButtons)}
            ${generateArticleBottomNavigation(navData)}
        </article>
    `;
}

/* ==========================================================================
   GLOBAL COLORED BUTTONS & NAVIGATION GENERATOR
   ========================================================================== */
function generateArticleActionButtons(buttons) {
    return `
        <div class="action-bar" style="display:flex !important; justify-content:center !important; align-items:center !important; gap:12px !important; margin:35px 0 20px 0 !important; border-top:1px solid #eaeaea !important; padding-top:20px !important;">
            <button id="like" data-id="like" style="display:inline-flex !important; align-items:center !important; gap:6px !important; background-color:#FFEBEB !important; color:#E63946 !important; border:1px solid #FFD6D6 !important; border-radius:30px !important; padding:8px 18px !important; font-weight:600 !important; cursor:pointer !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='#E63946' stroke='#E63946' stroke-width='2' style='fill:#E63946 !important; stroke:#E63946 !important;'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/></svg> Like
            </button>
            <button id="subscribe" data-id="subscribe" style="display:inline-flex !important; align-items:center !important; gap:6px !important; background-color:#FEF3C7 !important; color:#D97706 !important; border:1px solid #FDE68A !important; border-radius:30px !important; padding:8px 18px !important; font-weight:600 !important; cursor:pointer !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='#D97706' stroke='#D97706' stroke-width='2' style='fill:#D97706 !important; stroke:#D97706 !important;'><path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/></svg> Subscribe
            </button>
            <button id="share" data-id="share" style="display:inline-flex !important; align-items:center !important; gap:6px !important; background-color:#EEF2FF !important; color:#4F46E5 !important; border:1px solid #E0E7FF !important; border-radius:30px !important; padding:8px 18px !important; font-weight:600 !important; cursor:pointer !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#4F46E5' stroke-width='2.5' style='stroke:#4F46E5 !important;'><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/><polyline points='16 6 12 2 8 6'/><line x1='12' x2='12' y1='2' y2='15'/></svg> Share
            </button>
            <button id="copyLink" data-id="copyLink" style="display:inline-flex !important; align-items:center !important; gap:6px !important; background-color:#CCFBF1 !important; color:#0D9488 !important; border:1px solid #99F6E4 !important; border-radius:30px !important; padding:8px 18px !important; font-weight:600 !important; cursor:pointer !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#0D9488' stroke-width='2.5' style='stroke:#0D9488 !important;'><rect width='14' height='14' x='8' y='8' rx='2' ry='2'/><path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'/></svg> Copy Link
            </button>
        </div>
    `;
}

function generateArticleBottomNavigation(nav) {
    const prevObj = (nav && nav.previous) ? nav.previous : {};
    const nextObj = (nav && nav.next) ? nav.next : {};
    
    let prevUrl = (nav && nav.prev) || prevObj.url || "index.html";
    let nextUrl = (nav && typeof nav.next === "string") ? nav.next : (nextObj.url || "index.html");
    
    if (prevUrl && !prevUrl.includes('.html')) prevUrl = `article.html?id=${prevUrl}`;
    if (nextUrl && !nextUrl.includes('.html')) nextUrl = `article.html?id=${nextUrl}`;

    const prevTitle = (nav && nav.prevTitle) || prevObj.title || "Previous Article";
    const nextTitle = (nav && nav.nextTitle) || nextObj.title || "Next Article";

    return `
        <div class="bottom-article-nav" style="display:flex !important; justify-content:space-between !important; align-items:center !important; border-top:1px solid #eaeaea !important; padding-top:20px !important; margin-top:25px !important; width:100% !important;">
            <a href="${prevUrl}" style="color:#2563EB !important; text-decoration:none !important; font-weight:bold !important; display:inline-flex !important; align-items:center !important; gap:6px !important; max-width:40% !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#2563EB' stroke-width='2.5' style='stroke:#2563EB !important;'><path d='m12 19-7-7 7-7'/><path d='M19 12H5'/></svg>
                <div>
                    <div style="color:#2563EB !important;">← PREVIOUS</div>
                    <span style="font-size:12px !important; color:#555 !important; font-weight:normal !important; display:block !important; text-overflow:ellipsis !important; overflow:hidden !important; white-space:nowrap !important;">${prevTitle}</span>
                </div>
            </a>
            
            <a href="index.html" style="display:inline-flex !important; align-items:center !important; justify-content:center !important; width:42px !important; height:42px !important; background-color:#F3F4F6 !important; border-radius:50% !important; flex-shrink:0 !important; text-decoration:none !important;">
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='#1F2937' stroke='#1F2937' stroke-width='2' style='fill:#1F2937 !important; stroke:#1F2937 !important;'><path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>
            </a>

            <a href="${nextUrl}" style="color:#2563EB !important; text-decoration:none !important; font-weight:bold !important; text-align:right !important; display:inline-flex !important; align-items:center !important; gap:6px !important; max-width:40% !important; justify-content:flex-end !important;">
                <div>
                    <div style="color:#2563EB !important;">NEXT →</div>
                    <span style="font-size:12px !important; color:#555 !important; font-weight:normal !important; display:block !important; text-overflow:ellipsis !important; overflow:hidden !important; white-space:nowrap !important;">${nextTitle}</span>
                </div>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#2563EB' stroke-width='2.5' style='stroke:#2563EB !important;'><path d='M5 12h14'/><path d='m12 5 7 7-7 7'/></svg>
            </a>
        </div>
    `;
}

function addGlobalReadMoreInterceptor() {
    document.addEventListener("click", function(event) {
        if (event.target.closest("a") && event.target.tagName === "A" && event.target.closest(".card-body")) {
            const link = event.target;
            if (link.hostname === window.location.hostname && !link.search) {
                if (link.pathname.match(/\/([\w-]+)\.html$/)) {
                    event.preventDefault();
                    const slug = link.pathname.match(/\/([\w-]+)\.html$/)[1];
                    window.location.href = `article.html?id=${slug}`;
                }
            }
        }
    });
}

function renderJSONBody(bodyData) {
    if (!bodyData) return '<p>No document content specified.</p>';
    if (typeof bodyData === 'string') return `<p>${bodyData}</p>`;
    
    if (Array.isArray(bodyData)) {
        return bodyData.map(block => {
            switch (block.type) {
                case 'paragraph':
                    return `<p style="margin-bottom:1.5rem;">${block.text}</p>`;
                case 'subheading':
                case 'header':
                    return `<h2 class="mid-subheading" style="color:#b30000; font-family:'Playfair Display',serif; margin-top:2rem; margin-bottom:1rem; font-size:1.6rem; font-weight:700;">${block.text}</h2>`;
                case 'pullquote':
                    return `<div class="pull-quote" style="font-size: 1.3rem; font-weight:600; margin:2rem 0; padding:1.5rem 2rem; background:#f9f9f9; border-left:4px solid #b30000; font-style:italic; color:#333;">${block.text}</div>`;
                case 'points':
                    return `<ul style="margin-bottom:1.5rem; padding-left:20px;">${(block.items || []).map(item => `<li style="margin-bottom:8px;">${item}</li>`).join('')}</ul>`;
                case 'image':
                    const alignClass = block.align ? `img-${block.align}` : 'img-center';
                    return `
                        <figure class="${alignClass}" style="margin:2rem 0; text-align:center;">
                            <img src="${block.src}" alt="${block.caption || 'Image'}" style="max-width:100%; height:auto; border-radius:4px;" onerror="this.style.display='none'">
                            ${block.caption ? `<figcaption style="font-size:0.85rem; color:#666; margin-top:5px; font-style:italic;">${block.caption} ${block.credit ? `(${block.credit})` : ''}</figcaption>` : ''}
                        </figure>`;
                case 'html':
                    return block.content || '';
                default:
                    return '';
            }
        }).join('');
    }
    return '';
}

function loadAboutPage() {
    const titleEl = document.getElementById("about-title");
    const subtitleEl = document.getElementById("about-subtitle");
    const metaEl = document.getElementById("about-meta");
    const contentEl = document.getElementById("about-content");
    if (!contentEl) return;
    
    fetch("content/about-001.json")
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const cleanData = data.items ? data.items[0] : data;
            if (titleEl) titleEl.textContent = cleanData.title || "About Us";
            if (subtitleEl) subtitleEl.textContent = cleanData.subtitle || "";
            if (metaEl && cleanData.author) {
                const dateStr = cleanData.date ? new Date(cleanData.date).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                metaEl.innerHTML = `By <strong>${cleanData.author}</strong> | ${cleanData.location || ''} | ${dateStr} | ⏱️ ${cleanData.readTime || ''}`;
            }
            if (contentEl) contentEl.innerHTML = renderJSONBody(cleanData.body);
        })
        .catch(() => {
            if (contentEl) contentEl.innerHTML = `<p style='text-align:center; padding:20px; color:#666;'>Failed to load about page source.</p>`;
        });
}

function loadChiefEditorPage() {
    const contentEl = document.getElementById("content") || document.getElementById("editor-content") || document.getElementById("about-content");
    if (!contentEl) return;
    
    fetch("content/chief-editor-001.json")
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const cleanData = data.items ? data.items[0] : data;
            contentEl.innerHTML = `
                <article class="prose-container" style="line-height: 1.8;">
                    <h1 class="about-title" style="color:#b30000; font-family:'Playfair Display',serif;">${cleanData.title || 'Chief Editor Message'}</h1>
                    ${cleanData.subtitle ? `<p class="about-subtitle" style="font-style:italic; color:#666; ">${cleanData.subtitle}</p>` : ''}
                    <div class="about-content" style="margin-top:20px;">${renderJSONBody(cleanData.body || cleanData.content)}</div>
                </article>`;
        })
        .catch(() => {
            contentEl.innerHTML = `<p style='text-align:center; padding:20px; color:#666;'>Failed to load chief editor document.</p>`;
        });
}

function loadHistoricalPage() {
    const contentEl = document.getElementById("content") || document.getElementById("historical-content") || document.getElementById("about-content");
    if (!contentEl) return;
    
    fetch("content/historical.json")
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const cleanData = data.items ? data.items[0] : data;
            contentEl.innerHTML = `
                <article class="prose-container" style="line-height: 1.8;">
                    <h1 class="about-title" style="color:#b30000; font-family:'Playfair Display',serif;">${cleanData.title || 'Historical Archive'}</h1>
                    <div class="about-content" style="margin-top:20px;">${renderJSONBody(cleanData.body || cleanData.content)}</div>
                </article>`;
        })
        .catch(() => {
            contentEl.innerHTML = `<p style='text-align:center; padding:20px; color:#666;'>Failed to parse historical index configuration modules.</p>`;
        });
}

// Global window assignments
window.copyPageLink = copyPageLink;
window.playVideo = playVideo;
