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
    initInfiniteScroll();
    
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
        "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
        "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES"
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
                visitBtn.onclick = () => window.open(data.channel.url, "_blank");
                visitBtn.style.display = 'inline-block';
            }
            renderVlogs(data.videos || [], grid, archiveGrid);
        })
        .catch(() => {
            if (visitBtn) visitBtn.style.display = 'inline-block';
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
        { title: "Azad Kashmir Under Siege", description: "Communication blackout, curfews, and widespread leadership actions.", duration: "15:32", youtubeId: "lRE5cVWbWmA" },
        { title: "Kashmiri Leaders Geneva Briefing", description: "Crucial international briefing on human rights developments.", duration: "12:45", youtubeId: "1Sbomv3juT4" },
        { title: "UN Geneva: Azad Kashmir Under Siege", description: "Protest exposes lethal crackdown and internet blackouts in AJK.", duration: "1:08:24", youtubeId: "FE9farW5M18" },
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
    document.querySelectorAll(".sa-btn, .sa-btn-modern").forEach(btn => {
        btn.addEventListener("click", function(e) {
            const text = btn.textContent;
            const btnId = btn.id;

            if (text.includes("Like") || btnId === "action-like") {
                liked = !liked;
                btn.style.background = liked ? "#b30000" : "white";
                btn.style.color = liked ? "white" : "#222";
                showToast(liked ? "Thank you for liking!" : "Unliked");
            } else if (text.includes("Subscribe") || btnId === "action-subscribe") {
                const newsSection = document.getElementById("newsletter");
                if (newsSection) {
                    newsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showToast("Thank you for subscribing to The Mirror Jammu Kashmir!");
                }
            } else if (text.includes("Share") || btnId === "action-share") {
                e.stopPropagation();
                const tooltip = document.getElementById("share-tooltip");
                if (tooltip) {
                    tooltip.classList.toggle("show");
                } else if (navigator.share) {
                    navigator.share({
                        title: document.title || 'THE MIRROR JAMMU KASHMIR',
                        text: 'Champion Justice & Amplify the Voices of the Unheard',
                        url: window.location.href,
                    }).catch(() => copyPageLink());
                } else {
                    copyPageLink();
                }
            } else if (text.includes("Copy") || btnId === "action-copy") {
                copyPageLink();
            }
        });
    });

    document.addEventListener("click", function() {
        const tooltip = document.getElementById("share-tooltip");
        if (tooltip) tooltip.classList.remove("show");
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
   UNLIMITED EXPANDING INFINITE SCROLL PIPELINE
   ========================================================================== */
function initInfiniteScroll() {
    let isFetching = false;
    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            if (!isFetching) {
                isFetching = true;
                appendDynamicStream();
                setTimeout(() => { isFetching = false; }, 2000);
            }
        }
    });
}
function appendDynamicStream() {
    const archiveContainer = document.getElementById("archive-list");
    if (!archiveContainer) return;
    
    const newCard = document.createElement("div");
    newCard.className = "cards three";
    newCard.style.marginTop = "20px";
    newCard.innerHTML = `
        <article class="card">
            <div class="media"><img src="content/images/img1.jpg" alt="Stream News" onerror="this.src='https://via.placeholder.com/640x360?text=Archive+Entry'"></div>
            <div class="card-body">
                <h3>Archived Dispatch: Civil Rights &amp; Press Advocacy</h3>
                <p>Ongoing documentation of civil society reports and human rights advocacy...</p>
                ${createCardNavOptions('archive-stream')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img2.jpg" alt="Stream News" onerror="this.src='https://via.placeholder.com/640x360?text=Archive+Entry'"></div>
            <div class="card-body">
                <h3>Regional Economic Perspectives</h3>
                <p>Analysis of local markets, subsidies, and administrative policy frameworks...</p>
                ${createCardNavOptions('archive-stream')}
            </div>
        </article>
        <article class="card">
            <div class="media"><img src="content/images/img3.jpg" alt="Stream News" onerror="this.src='https://via.placeholder.com/640x360?text=Archive+Entry'"></div>
            <div class="card-body">
                <h3>International Diplomacy Overview</h3>
                <p>Digest of global diplomatic discussions and international appeals...</p>
                ${createCardNavOptions('archive-stream')}
            </div>
        </article>
    `;
    archiveContainer.appendChild(newCard);
}

/* ==========================================================================
   DYNAMIC HOMEPAGE CONTENT INGESTION ENGINE
   ========================================================================== */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(index => {
            initTicker(index);
            if (index.topStories) {
                loadTopStories([
                    index.topStories.lead, index.topStories.breaking, index.topStories.opinion,
                    index.topStories.lead, index.topStories.breaking, index.topStories.opinion
                ]);
            } else { loadTopStoriesFallback(); }
            
            if (index.latestEditorialHistorical) {
                loadLehSection([
                    index.latestEditorialHistorical.latest, index.latestEditorialHistorical.editorial, index.latestEditorialHistorical.historical,
                    index.latestEditorialHistorical.latest, index.latestEditorialHistorical.editorial, index.latestEditorialHistorical.historical
                ]);
            } else { loadLehFallback(); }
            
            if (index.jammuKashmir) loadSectionGroup("jk-grid", "jk-archive-grid", index.jammuKashmir, "JK", "Jammu Kashmir", 3);
            if (index.international) loadSectionGroup("intl-grid", "intl-archive-grid", index.international, "INTL", "International Diplomacy", 3);
            if (index.humanRights) loadSectionGroup("hr-grid", "hr-archive-grid", index.humanRights, "HR", "Human Rights", 3);
        })
        .catch(() => {
            initTicker(null);
            loadTopStoriesFallback();
            loadLehFallback();
        });
}
function loadSectionGroup(gridId, archiveGridId, ids, label, categoryKey, count = 3) {
    const grid = document.getElementById(gridId);
    const archiveGrid = document.getElementById(archiveGridId);
    if (!grid || !ids) return;
    
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            let validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            
            fetch("content/archive.json")
                .then(res => res.ok ? res.json() : { items: [] })
                .then(archiveData => {
                    const archivedItems = archiveData.items || [];
                    const categoryItems = archivedItems.filter(item => item.category === categoryKey || item.sectionLabel === categoryKey);
                    
                    let combinedPool = [...validArticles];
                    categoryItems.forEach(oldItem => {
                        if (!combinedPool.some(newItem => newItem.id === oldItem.id)) {
                            combinedPool.push(oldItem);
                        }
                    });
                    
                    const activeSlice = combinedPool.slice(0, count);
                    const archiveSlice = combinedPool.slice(count);
                    
                    grid.innerHTML = activeSlice.length ? activeSlice.map(a => createHomepageCard(a)).join('') : createEmptyCardSet(label, count);
                    if (archiveGrid) {
                        archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a)).join('') : `<p style="padding:15px; color:#666;">No older ${label} entries archived.</p>`;
                    }
                })
                .catch(() => {
                    const activeSlice = validArticles.slice(0, count);
                    const archiveSlice = validArticles.slice(count);
                    grid.innerHTML = activeSlice.length ? activeSlice.map(a => createHomepageCard(a)).join('') : createEmptyCardSet(label, count);
                    if (archiveGrid) {
                        archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a)).join('') : `<p style="padding:15px; color:#666;">No older ${label} entries archived.</p>`;
                    }
                });
        });
}
function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    const archiveGrid = document.getElementById("top-stories-archive-grid");
    if (!grid) return;
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean);
            if (validArticles.length) {
                const activeSlice = validArticles.slice(0, 6);
                const archiveSlice = validArticles.slice(6);
                grid.innerHTML = activeSlice.map(a => createHomepageCard(a.items ? a.items[0] : a)).join('');
                if (archiveGrid) {
                    archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a.items ? a.items[0] : a)).join('') : '<p style="padding:15px; color:#666;">No older Top Stories archived.</p>';
                }
            } else { loadTopStoriesFallback(); }
        });
}
function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (grid) {
        let cardsHtml = '';
        for (let i = 1; i <= 6; i++) {
            cardsHtml += `
            <article class="card">
                <div class="media"><img src="content/images/img${(i % 3) + 1}.jpg" alt="Top Story" onerror="this.src='https://via.placeholder.com/640x360?text=Top+Story'"></div>
                <div class="card-body">
                    <h3>Top Story Headline ${i}: Dispatches &amp; Regional Developments</h3>
                    <p>Comprehensive reporting on local developments, civil rights initiatives, and governance...</p>
                    ${createCardNavOptions('top-story-' + i)}
                </div>
            </article>`;
        }
        grid.innerHTML = cardsHtml;
    }
}
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    const archiveGrid = document.getElementById("leh-archive-grid");
    if (!grid) return;
    const labels = ["LATEST", "EDITORIAL", "HISTORICAL", "LATEST", "EDITORIAL", "HISTORICAL"];
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean);
            const activeSlice = validArticles.slice(0, 6);
            const archiveSlice = validArticles.slice(6);
            grid.innerHTML = activeSlice.map((a, i) => createHomepageCard(a.items ? a.items[0] : a, labels[i])).join('');
            if (archiveGrid) {
                archiveGrid.innerHTML = archiveSlice.length ? archiveSlice.map(a => createHomepageCard(a.items ? a.items[0] : a)).join('') : '<p style="padding:15px; color:#666;">No older updates archived.</p>';
            }
        });
}
function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (grid) {
        grid.innerHTML = 
            createEmptyCard("LATEST") + createEmptyCard("EDITORIAL") + createEmptyCard("HISTORICAL") +
            createEmptyCard("LATEST UPDATE") + createEmptyCard("EDITORIAL DIGEST") + createEmptyCard("HISTORICAL ARCHIVE");
    }
}
function createCardNavOptions(articleId) {
    return `
        <div class="card-nav-options">
            <button class="card-nav-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">🏠 Home</button>
            <button class="card-nav-btn" onclick="window.history.back()">⬅️ Back</button>
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
function createEmptyCard(label = "COMING SOON") {
    return `
    <article class="card">
        <div class="card-body">
            <h3>${label}</h3>
            <p>Content coming soon.</p>
            ${createCardNavOptions('')}
        </div>
    </article>`;
}
function createEmptyCardSet(label = "SECTION", count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += createEmptyCard(`${label} ${i + 1}`);
    }
    return html;
}

/* ==========================================================================
   ARTICLE DETAILED VIEW PIPELINE
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
    
    fetch(`content/${id}.json`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            const article = data.items ? data.items[0] : data;
            renderFullArticlePage(article);
        })
        .catch(() => {
            fetch("content/article.json")
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(masterData => {
                    const articlesList = masterData.items || masterData || [];
                    const match = articlesList.find(item => item.id === id);
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
            ${createCardNavOptions(article.id)}
        </article>
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
                case 'image':
                    const alignClass = block.align ? `img-${block.align}` : 'img-center';
                    return `
                        <figure class="${alignClass}" style="margin:2rem 0; text-align:center;">
                            <img src="${block.src}" alt="${block.caption || 'Image'}" style="max-width:100%; height:auto; border-radius:4px;" onerror="this.style.display='none'">
                            ${block.caption ? `<figcaption style="font-size:0.85rem; color:#666; margin-top:5px; font-style:italic;">${block.caption} ${block.credit ? `(${block.credit})` : ''}</figcaption>` : ''}
                        </figure>`;
                default:
                    return '';
            }
        }).join('');
    }
    return '';
}

/* ==========================================================================
   SYSTEM PROSE PAGE LOADING FALLBACKS
   ========================================================================== */
function loadAboutPage() {
    const titleEl = document.getElementById("about-title") || document.getElementById("title");
    const subtitleEl = document.getElementById("about-subtitle");
    const metaEl = document.getElementById("about-meta") || document.getElementById("meta");
    const contentEl = document.getElementById("about-content") || document.getElementById("content");
    if (!contentEl) return;
    
    fetch("content/about.json")
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
    
    fetch("content/chief-editor.json")
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const cleanData = data.items ? data.items[0] : data;
            contentEl.innerHTML = `
                <article class="prose-container" style="line-height: 1.8;">
                    <h1 class="about-title" style="color:#b30000; font-family:'Playfair Display',serif;">${cleanData.title || 'Chief Editor Message'}</h1>
                    ${cleanData.subtitle ? `<p class="about-subtitle" style="font-style:italic; color:#666;">${cleanData.subtitle}</p>` : ''}
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
