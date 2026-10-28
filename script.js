/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - INTEGRATED PRODUCTION ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded - initializing application architecture...");
    
    // Core Mechanical Components
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
    
    // Application Routing Engine
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

/* LOADER & TIME CALENDARS */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() { loader.style.display = "none"; }, 300);
    }, 1000);
}
function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
function initClocks() { updateClocks(); }
function updateClocks() {
    const now = new Date();
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    const fullDate = now.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const zurichTime = now.toLocaleTimeString("en-GB", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const cestText = fullDate + " at " + zurichTime;
    
    const istTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const pktTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    datetimeBar.innerHTML = `
        <span>${cestText}</span>
        <span class="separator">•</span>
        <span id="cal-hijri">${getHijriDate()}</span>
        <span class="separator">•</span>
        <span id="cal-bikrami">${getBikramiDate()}</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istTime}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktTime}</strong></span>
    `;
}
function getHijriDate() {
    try {
        return new Intl.DateTimeFormat("en-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(new Date()) + " AH";
    } catch(e) { return "Ramadan, 1447 AH"; }
}
function getBikramiDate() {
    const today = new Date();
    const day = today.getDate();
    const bikramiMonths = ["Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon", "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"];
    return `${day} ${bikramiMonths[today.getMonth() % 12]} ${today.getFullYear() + 57} VS`;
}

/* WEATHER BAR PIPELINE */
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    const cities = [
        { name: "Zurich", temp: "6°C" }, { name: "Rawalakot", temp: "9°C" },
        { name: "Jammu", temp: "18°C" }, { name: "Kashmir", temp: "4°C" }, 
        { name: "Ladakh", temp: "-2°C" }, { name: "Gilgit", temp: "3°C" },
        { name: "Baltistan", temp: "-1°C" }, { name: "Muzaffarabad", temp: "10°C" }
    ];
    bar.innerHTML = cities.map(c => `<span>${c.name}: <strong>${c.temp}</strong></span>`).join('<span class="separator">•</span>');
}

/* TICKER & INTERACTION CONTROLS */
function initTicker(jsonData) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    const items = (jsonData && jsonData.ticker) ? jsonData.ticker : [
        "WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY",
        "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH"
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
    const mobileMenu = document.getElementById("mobile-menu");
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function() {
            const hidden = mobileMenu.hidden;
            mobileMenu.hidden = !hidden;
        });
    }
}
function initContactModal() {}
function initDisclosureAutoScroll() {}
function initVlogs() {}
function initLanguageSelector() {}
function initSearch() {}
function initFileUpload() {}
function initNewsletter() {}
function initFooterDropdowns() {}

/* HOMEPAGE INGESTION ENGINE */
function loadHomepageContent() {
    const cb = "?v=" + new Date().getTime();
    fetch("content/index.json" + cb)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(index => {
            initTicker(index);
            
            // 1. Latest / Editorial / Historical (At Top)
            if (index.latestEditorialHistorical) {
                loadLehSection(index.latestEditorialHistorical);
            }
            
            // 2. Top Stories Grid
            if (index.topStories) {
                loadTopStories([index.topStories.lead, index.topStories.breaking, index.topStories.opinion]);
            }
            
            // 3. Spotlight, In Focus & Trending
            if (index.spotlightFocusTrending) {
                loadSpotlightSection(index.spotlightFocusTrending);
            }
            
            // 4. Category Grids
            if (index.jammuKashmir) loadSectionGroup("jk-grid", "jk-archive-grid", index.jammuKashmir, "Jammu Kashmir");
            if (index.international) loadSectionGroup("intl-grid", "intl-archive-grid", index.international, "International Diplomacy");
            if (index.humanRights) loadSectionGroup("hr-grid", "hr-archive-grid", index.humanRights, "Human Rights");
        })
        .catch(() => loadLehFallback());
}

function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    const idList = Array.isArray(ids) ? ids : Object.values(ids || {});
    const cb = "?v=" + new Date().getTime();
    
    Promise.all(idList.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let cardsHtml = validArticles.slice(0, 6).map((a, i) => createHomepageCard(a, a.sectionLabel || "REPORT")).join('');
            for (let i = validArticles.length; i < 6; i++) {
                cardsHtml += createComingSoonCard("COMING SOON");
            }
            grid.innerHTML = cardsHtml;
        });
}

function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let cardsHtml = validArticles.slice(0, 6).map(a => createHomepageCard(a)).join('');
            for (let i = validArticles.length; i < 6; i++) {
                cardsHtml += createComingSoonCard("TOP STORY UPDATE");
            }
            grid.innerHTML = cardsHtml;
        });
}

function loadSpotlightSection(config) {
    const topRowIds = config.topRow || ["spotlight-001", "infocus-001", "trending-001"];
    const bottomRowIds = config.bottomRow || ["spotlight-002", "infocus-002", "trending-002"];
    const cb = "?v=" + new Date().getTime();
    
    const renderRow = (rowIds, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        Promise.all(rowIds.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
            .then(articles => {
                const valid = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
                let cardsHtml = valid.map(a => `
                    <div class="news-card-badge spotlight-badge">
                        <span class="card-badge">FEATURED</span>
                        <div class="media"><img src="${a.heroImage?.src || a.heroImage || 'content/images/img1.jpg'}" alt="${a.title}"></div>
                        <h3>${a.title}</h3>
                        <p>${(a.excerpt || a.summary || '').substring(0, 100)}...</p>
                        <a href="article.html?id=${a.id}" class="btn-red" style="margin-top:auto;">Read More ➔</a>
                    </div>
                `).join('');
                for (let i = valid.length; i < 3; i++) {
                    cardsHtml += createComingSoonCard("SPOTLIGHT UPDATE");
                }
                container.innerHTML = cardsHtml;
            });
    };
    renderRow(topRowIds, "spotlight-top-row");
    renderRow(bottomRowIds, "spotlight-bottom-row");
}

function loadSectionGroup(gridId, archiveGridId, ids, label) {
    const grid = document.getElementById(gridId);
    if (!grid || !ids) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const valid = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            let cardsHtml = valid.map(a => createHomepageCard(a, label)).join('');
            for (let i = valid.length; i < 6; i++) {
                cardsHtml += createComingSoonCard(`${label} UPDATE`);
            }
            grid.innerHTML = cardsHtml;
        });
}

function createComingSoonCard(customLabel = "Upcoming Feature") {
    return `
        <article class="card coming-soon-card">
            <div class="media empty-media" style="display:flex; align-items:center; justify-content:center; background:#f9f9f9; height:180px;">
                <span class="coming-soon-badge">${customLabel.toUpperCase()}</span>
            </div>
            <div class="card-body" style="text-align: center; justify-content: center;">
                <h3 style="color: #b30000; font-size: 1.15rem; margin-bottom: 6px;">Coming Soon</h3>
                <p style="color: #666; font-style: italic; font-size: 0.9rem;">Ready for new publications.</p>
            </div>
        </article>
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
                <div style="margin-top:auto; text-align:right;">
                    <a href="article.html?id=${article.id || ''}" class="btn-red">Read More ➔</a>
                </div>
            </div>
        </article>`;
}

/* ARTICLE PAGE PIPELINE */
function initArticlePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    const cb = "?v=" + new Date().getTime();
    if (!id) return;
    
    fetch(`content/${id.toLowerCase()}.json${cb}`)
        .then(r => r.json())
        .then(data => {
            const article = data.items ? data.items[0] : data;
            renderFullArticlePage(article);
        })
        .catch(() => {
            fetch(`content/article.json${cb}`)
                .then(r => r.json())
                .then(master => {
                    const match = (master.items || master || []).find(a => a.id.toLowerCase() === id.toLowerCase());
                    if (match) renderFullArticlePage(match);
                });
        });
}

function renderFullArticlePage(article) {
    const loader = document.getElementById('loading-state');
    if (loader) loader.style.display = 'none';
    
    const contentEl = document.getElementById("content") || document.getElementById("article-content") || document.body;
    if (!contentEl) return;
    contentEl.style.display = 'block';
    
    document.title = (article.title || "Article") + " | THE MIRROR JAMMU KASHMIR";
    let processedDate = article.date ? new Date(article.date).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    
    contentEl.innerHTML = `
        <article class="prose-container">
            <header style="margin-bottom: 2rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 1rem;">
                <span style="color:#b30000; font-weight:700; text-transform:uppercase; font-size:0.85rem; letter-spacing:1px; display:block; margin-bottom:0.5rem;">
                    ${article.category || article.sectionLabel || 'News'}
                </span>
                <h1 style="font-family:'Playfair Display', serif; font-size: 2.3rem; line-height: 1.25; margin: 0 0 1rem 0; color:#111; font-weight:900;">
                    ${article.title}
                </h1>
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; font-size:0.9rem; color:#666; gap:10px;">
                    <div>By <strong style="color:#111;">${article.author || 'Editorial Desk'}</strong> ${article.location ? '| ' + article.location : ''}</div>
                    <div>${processedDate} | ⏱️ ${article.readTime || '5 min read'}</div>
                </div>
            </header>

            <!-- HERO IMAGE CONTAINER -->
            ${article.heroImage ? `
                <figure class="hero-image-container">
                    <img src="${article.heroImage.src || article.heroImage}" alt="${article.title}">
                    ${article.heroImage.caption ? `<figcaption>${article.heroImage.caption}</figcaption>` : ''}
                </figure>
            ` : ''}

            <!-- BODY CONTENT WITH FLOATING IMAGES (60%) -->
            <div class="article-body-content">
                ${renderJSONBody(article.body || article.content)}
            </div>

            <!-- ACTION BAR -->
            ${generateArticleActionButtons()}
            
            <!-- BOTTOM NAVIGATION -->
            ${generateArticleBottomNavigation(article.navigation)}
        </article>
    `;
    
    initSocialButtons();
}

function generateArticleActionButtons() {
    return `
        <div class="action-bar">
            <button id="like" data-id="like"><svg width='18' height='18' viewBox='0 0 24 24' fill='#E63946'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/></svg> Like</button>
            <button id="subscribe" data-id="subscribe"><svg width='18' height='18' viewBox='0 0 24 24' fill='#D97706'><path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/></svg> Subscribe</button>
            <button id="share" data-id="share"><svg width='18' height='18' viewBox='0 0 24 24' stroke='#4F46E5' stroke-width='2.5' fill='none'><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/><polyline points='16 6 12 2 8 6'/></svg> Share</button>
            <button id="copyLink" data-id="copyLink"><svg width='18' height='18' viewBox='0 0 24 24' stroke='#0D9488' stroke-width='2.5' fill='none'><rect width='14' height='14' x='8' y='8' rx='2'/></svg> Copy Link</button>
        </div>
    `;
}

function generateArticleBottomNavigation(nav) {
    const prevUrl = (nav && nav.prev) ? `article.html?id=${nav.prev}` : "index.html";
    const nextUrl = (nav && nav.next) ? `article.html?id=${nav.next}` : "index.html";
    return `
        <div class="bottom-article-nav">
            <a href="${prevUrl}" style="color:#b30000;">← PREVIOUS</a>
            <a href="index.html" class="bottom-nav-home" title="Return Home">🏠</a>
            <a href="${nextUrl}" style="color:#b30000;">NEXT →</a>
        </div>
    `;
}

function initSocialButtons() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.id || btn.getAttribute("data-id");
        if (id === "like") alert("Thank you for liking!");
        if (id === "copyLink") {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    });
}

function addGlobalReadMoreInterceptor() {}

function renderJSONBody(body) {
    if (!body) return '<p>No document text specified.</p>';
    if (typeof body === 'string') return `<p>${body}</p>`;
    if (Array.isArray(body)) {
        return body.map(block => {
            switch (block.type) {
                case 'paragraph': return `<p style="margin-bottom:1.5rem;">${block.text}</p>`;
                case 'subheading':
                case 'header': return `<h2 style="color:#b30000; font-family:'Playfair Display',serif; margin:2rem 0 1rem; font-size:1.6rem; font-weight:700;">${block.text}</h2>`;
                case 'pullquote': return `<div style="font-size:1.25rem; font-weight:600; margin:2rem 0; padding:1.2rem 1.5rem; background:#f9f9f9; border-left:4px solid #b30000; font-style:italic; color:#333;">${block.text}</div>`;
                case 'image':
                    const alignClass = block.align === 'left' ? 'img-left' : (block.align === 'right' ? 'img-right' : 'img-center');
                    return `<figure class="${alignClass}"><img src="${block.src}" alt="Media"><figcaption>${block.caption || ''}</figcaption></figure>`;
                default: return '';
            }
        }).join('');
    }
    return '';
}

function loadAboutPage() {}
function loadChiefEditorPage() {}
function loadHistoricalPage() {}
