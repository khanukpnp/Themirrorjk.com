/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT ENGINE
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing...");
    
    // Initialize standard components
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
    
    // Dynamic Content Ingestion Architecture
    loadHomepageContent();
    
    // Check routing logic
    const path = window.location.pathname;
    if (path.includes("article.html") || window.location.search.includes("id=")) {
        initArticlePage();
    }
    else if (path.includes("about.html")) {
        loadAboutPage();
    }
    else if (path.includes("chief-editor.html")) {
        loadChiefEditorPage();
    }
    else if (path.includes("historical.html")) {
        loadHistoricalPage();
    }
    
    setInterval(updateClocks, 1000);
});

/* ============================
   LOADER & FOOTER YEAR
   ============================ */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() { loader.style.display = "none"; }, 300);
    }, 1500);
}

function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================
   PRECISION TIMEBAR ENGINE (FIXED GLOBAL HOURLY BLEED)
   ============================ */
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
    
    // Extract localized hour string to calculate real time zone AM/PM indicator instead of local user machine hours
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

/* ============================
   WEATHER BAR
   ============================ */
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    const cities = [
        { name: "Zurich", temp: "6°C" }, { name: "Rawalakot", temp: "9°C" },
        { name: "Jammu", temp: "18°C" }, { name: "Kashmir", temp: "4°C" },
        { name: "Ladakh", temp: "-2°C" }, { name: "Gilgit", temp: "3°C" },
        { name: "Baltistan", temp: "-1°C" }, { name: "Muzaffarabad", temp: "10°C" }
    ];
    bar.innerHTML = cities.map((c, i) => `<span>${c.name}: <strong>${c.temp}</strong></span>`).join('<span class="separator">•</span>');
}

/* ============================
   DYNAMIC TICKER ENGINE
   ============================ */
function initTicker(jsonData) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    // Connects dynamic properties directly from index.json configurations
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

/* ============================
   READING PROGRESS BAR
   ============================ */
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}

/* ============================
   NAVIGATION
   ============================ */
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

/* ============================
   CONTACT MODAL
   ============================ */
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
                alert("Thank you for your message!");
                modal.classList.add("hidden");
                contactForm.reset();
            }
        });
    }
}

/* ============================
   VLOGS DATA ARCHITECTURE
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    if (!grid) return;
    
    fetch("content/youtube.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            if (visitBtn && data.channel?.url) {
                visitBtn.onclick = () => window.open(data.channel.url, "_blank");
                visitBtn.style.display = 'inline-block';
            }
            renderVlogs(data.videos || []);
        })
        .catch(() => {
            if (visitBtn) visitBtn.style.display = 'none';
            renderVlogsFallback();
        });
}

function renderVlogs(videos) {
    const grid = document.getElementById("vlogs-grid");
    if (!grid || !videos.length) { renderVlogsFallback(); return; }
    grid.innerHTML = videos.map(v => {
        const thumb = v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : 'https://via.placeholder.com/640x360?text=Video';
        return `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title}" onerror="this.src='https://via.placeholder.com/640x360?text=Video'">
                    <div class="vlog-play-icon" onclick="playVideo('${v.youtubeId}')">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body"><h3>${v.title}</h3><p>${v.description || ''}</p></div>
            </article>`;
    }).join('');
}

function renderVlogsFallback() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    const fallbacks = [
        { title: "Azad Kashmir Under Siege", description: "Communication blackout, curfews, and widespread leadership actions.", duration: "15:32", youtubeId: "lRE5cVWbWmA" },
        { title: "Kashmiri Leaders Geneva Briefing", description: "Crucial international briefing on human rights developments.", duration: "12:45", youtubeId: "1Sbomv3juT4" }
    ];
    renderVlogs(fallbacks);
}

function playVideo(id) { if (id) window.open('https://www.youtube.com/watch?v=' + id, '_blank'); }

/* ============================
   INTERFACE CONTROLS & MODULES
   ============================ */
function initLanguageSelector() {
    document.getElementById("language-select")?.addEventListener("change", e => {
        alert("Language changed to " + e.target.options[e.target.selectedIndex].text);
    });
}

/* ============================
   SHARE TOOLTIP ENGINE
   ============================ */
function initShareTooltip() {
    const shareBtn = document.getElementById('article-share-btn') || document.getElementById('btn-share');
    const tooltip = document.getElementById('share-tooltip');
    if (!shareBtn || !tooltip) return;
    
    shareBtn.onclick = e => { e.stopPropagation(); tooltip.classList.toggle('show'); };
    document.onclick = () => tooltip.classList.remove('show');
    tooltip.onclick = e => e.stopPropagation();
    
    updateShareLinks();
}

function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const platforms = {
        'share-facebook': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        'share-twitter': `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        'share-whatsapp': `https://api.whatsapp.com/send?text=${title}%20${url}`,
        'share-email': `mailto:?subject=${title}&body=${url}`
    };
    for (const [id, href] of Object.entries(platforms)) {
        const el = document.getElementById(id);
        if (el) { el.href = href; el.target = '_blank'; }
    }
}

function initSearch() {
    document.querySelector(".search")?.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("search-input")?.value.trim();
        if (input) alert("Searching for: " + input);
    });
}

function initSocialButtons() {
    document.querySelectorAll(".sa-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const text = btn.textContent;
            if (text.includes("Like")) alert("Thank you for liking!");
            else if (text.includes("Share")) window.copyPageLink();
        });
    });
}

function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
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
        if (email && email.includes("@")) { alert("Thank you for subscribing!"); }
    });
}

function initFooterDropdowns() {
    updateFooterContent();
    document.querySelectorAll('.footer-section').forEach(section => {
        section.querySelector('h4')?.addEventListener('click', e => {
            e.preventDefault();
            section.classList.toggle('open');
        });
    });
}

function updateFooterContent() {
    const fc = document.querySelector('.footer-content');
    if (!fc) return;
    fc.innerHTML = `
        <div class="footer-section">
            <h4 style="text-align: center;">THE MIRROR JAMMU KASHMIR</h4>
            <p style="text-align: center; max-width: 90%; margin: 0 auto;">THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY, AND TRUTH.</p>
        </div>
        <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="#top-stories">Top Stories</a></li>
                <li><a href="about.html">About Us</a></li>
            </ul>
        </div>
        <div class="footer-section"><h4>Contact</h4><p>themirrorjk@gmail.com</p></div>
        <div class="footer-section">
            <h4>Follow</h4>
            <div class="social-icons"><a href="#">📘</a><a href="#">▶️</a></div>
        </div>`;
}

/* ============================
   DYNAMIC HOMEPAGE CONTENT LOADING
   ============================ */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(index => {
            initTicker(index);
            
            if (index.topStories) {
                loadTopStories([index.topStories.lead, index.topStories.breaking, index.topStories.opinion]);
            } else { loadTopStoriesFallback(); }
            
            if (index.latestEditorialHistorical) {
                loadLehSection([index.latestEditorialHistorical.latest, index.latestEditorialHistorical.editorial, index.latestEditorialHistorical.historical]);
            } else { loadLehFallback(); }
            
            if (index.jammuKashmir) loadSectionGroup("jk-grid", index.jammuKashmir, "JK");
            if (index.international) loadSectionGroup("intl-grid", index.international, "INTL");
            if (index.humanRights) loadSectionGroup("hr-grid", index.humanRights, "HR");
        })
        .catch(() => {
            initTicker(null);
            loadAllFallback();
        });
}

function loadSectionGroup(gridId, ids, label) {
    const grid = document.getElementById(gridId);
    if (!grid || !ids) return;
    
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            grid.innerHTML = articles.map(a => a ? createHomepageCard(a.items ? a.items[0] : a) : createEmptyCard(label)).join('');
        });
}

function loadAllFallback() {
    loadTopStoriesFallback();
    loadLehFallback();
}

function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean);
            if (validArticles.length) {
                grid.innerHTML = validArticles.map(a => createHomepageCard(a.items ? a.items[0] : a)).join('');
            } else { loadTopStoriesFallback(); }
        });
}

function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (grid) {
        grid.innerHTML = `
        <article class="card">
            <div class="media"><img src="https://via.placeholder.com/640x360?text=News" alt="News"></div>
            <div class="card-body"><h3>Shutter Down Paralyses Rawalakot</h3><p>Protests continue over infrastructure issues...</p><a href="article.html?id=article-001" class="btn-red">Read More →</a></div>
        </article>`;
    }
}

function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
    Promise.all(ids.map(id => fetch(`content/${id}.json`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            grid.innerHTML = articles.map((a, i) => a ? createHomepageCard(a.items ? a.items[0] : a, labels[i]) : createEmptyCard(labels[i])).join('');
        });
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (grid) grid.innerHTML = createEmptyCard("LATEST") + createEmptyCard("EDITORIAL") + createEmptyCard("HISTORICAL");
}

function createHomepageCard(article, label) {
    if (!article) return '';
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || 'Click to view details.';
    let image = article.heroImage?.src || article.heroImage || article.image || 'https://via.placeholder.com/640x360?text=No+Image';
    
    return `
        <article class="card">
            <div class="media"><img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                <h3>${title.substring(0, 80)}</h3>
                <p>${excerpt.substring(0, 120)}...</p>
                <a href="article.html?id=${article.id || ''}" class="btn-red">Read More →</a>
            </div>
        </article>`;
}

/* ============================
   ARTICLE SYSTEM & PAGINATION PIPELINE
   ============================ */
function initArticlePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>No article specified</h2></div>';
        return;
    }
    fetch(`content/${id}.json`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            const article = data.items ? data.items[0] : data;
            updateSocialMetaTags(article);
            renderFullArticlePage(article);
            initShareTooltip();
        })
        .catch(() => {
            document.body.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Article not found: ${id}</h2></div>`;
        });
}

function renderFullArticlePage(article) {
    if (document.getElementById('loading-state')) document.getElementById('loading-state').style.display = 'none';
    
    const contentEl = document.getElementById("content") || document.getElementById("article-content");
    if (!contentEl) return;
    contentEl.style.display = 'block';
    
    const titleEl = document.getElementById("title") || document.getElementById("article-title");
    if (titleEl) titleEl.textContent = article.title || "Untitled";
    
    let bodyHtml = (article.body || []).map(block => {
        if (block.type === "paragraph") return `<p>${block.text}</p>`;
        if (block.type === "subheading" || block.type === "header") return `<h2 class="mid-subheading">${block.text}</h2>`;
        if (block.type === "pullquote") return `<div class="pull-quote">${block.text}</div>`;
        return '';
    }).join('');
    
    contentEl.innerHTML = bodyHtml;
    
    // Connect dynamic next/previous sequence directly from the index.json keys
    fetch("content/index.json")
        .then(r => r.json())
        .then(index => {
            const sequence = [
                index.topStories?.lead, index.topStories?.breaking, index.topStories?.opinion,
                ...(index.jammuKashmir || []), ...(index.international || []), ...(index.humanRights || [])
            ].filter(Boolean);
            
            addArticlePagination(article.id, sequence);
        }).catch(() => addArticlePagination(article.id, []));
}

function addArticlePagination(currentId, sequence) {
    let div = document.querySelector('.article-pagination') || document.createElement('div');
    div.className = 'article-pagination';
    
    const targetParent = document.getElementById("content") || document.getElementById("article-content");
    if (targetParent) {
        targetParent.parentNode.insertBefore(div, targetParent.nextSibling);
    }
    
    const idx = sequence.indexOf(currentId);
    let prevHtml = idx > 0 ? `<a href="article.html?id=${sequence[idx-1]}" class="pagination-btn">← Previous</a>` : '';
    let nextHtml = idx < sequence.length - 1 && idx !== -1 ? `<a href="article.html?id=${sequence[idx+1]}" class="pagination-btn">Next →</a>` : '';
    
    div.innerHTML = `<a href="index.html" class="pagination-btn home-btn">← Back to Home</a><div class="pagination-nav">${prevHtml}${nextHtml}</div>`;
}

function updateSocialMetaTags(article) {
    document.title = (article.title || "Article") + " | THE MIRROR JAMMU KASHMIR";
    document.getElementById('og-title')?.setAttribute('content', article.title || '');
    document.getElementById('og-description')?.setAttribute('content', article.excerpt || '');
}

function createEmptyCard(label = "COMING SOON") {
    return `<article class="card"><div class="card-body"><h3>${label}</h3><p>Content coming soon.</p></div></article>`;
}

// Fallback empty loaders for dedicated layouts
function loadAboutPage() {}
function loadChiefEditorPage() {}
function loadHistoricalPage() {}

window.copyPageLink = copyPageLink;
window.playVideo = playVideo;
