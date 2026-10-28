/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - INTEGRATED PRODUCTION ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded - initializing application architecture...");
    
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
    
    setInterval(updateClocks, 1000);
    setInterval(initWeatherBar, 900000);
});

function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 300);
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
    datetimeBar.innerHTML = `<span>${fullDate} at ${zurichTime}</span>`;
}
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (bar) bar.innerHTML = `<span>Zurich: <strong>6°C</strong></span> • <span>Rawalakot: <strong>9°C</strong></span> • <span>Muzaffarabad: <strong>10°C</strong></span>`;
}
function initTicker(jsonData) {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    tickerItems.innerHTML = `<span>WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY • </span><span>THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH • </span>`;
}
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    });
}
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            const hidden = mobileMenu.hidden;
            mobileMenu.hidden = !hidden;
        });
    }
}
function initContactModal() {}
function initVlogs() {}
function initLanguageSelector() {}
function initSearch() {}
function initFileUpload() {}
function initNewsletter() {}
function initFooterDropdowns() {}

/* ==========================================================================
   DYNAMIC HOMEPAGE CONTENT ENGINE (LATEST SECTION LOADED FIRST AT THE TOP)
   ========================================================================== */
function loadHomepageContent() {
    const cb = "?v=" + new Date().getTime();
    fetch("content/index.json" + cb)
        .then(r => r.json())
        .then(index => {
            initTicker(index);
            
            // 1. LATEST / EDITORIAL / HISTORICAL GRID (MOVED TO VERY TOP)
            if (index.latestEditorialHistorical) {
                loadLehSection(index.latestEditorialHistorical);
            } else { loadLehFallback(); }
            
            // 2. TOP STORIES GRID
            if (index.topStories) {
                loadTopStories([index.topStories.lead, index.topStories.breaking, index.topStories.opinion]);
            } else { loadTopStoriesFallback(); }
            
            // 3. SPOTLIGHT, IN FOCUS & TRENDING
            if (index.spotlightFocusTrending) {
                loadSpotlightSection(index.spotlightFocusTrending);
            }
            
            // 4. CATEGORY GRIDS
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
            let activeSlice = validArticles.slice(0, 6);
            
            grid.innerHTML = activeSlice.map((a, i) => createHomepageCard(a, a.sectionLabel || "REPORT")).join('');
        });
}

function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const validArticles = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            grid.innerHTML = validArticles.map(a => createHomepageCard(a)).join('');
        });
}

function loadSpotlightSection(config) {}
function loadSectionGroup(g, ag, ids, label) {}
function loadLehFallback() {}
function loadTopStoriesFallback() {}

function createHomepageCard(article, label) {
    if (!article) return '';
    const title = article.title || 'Untitled Report';
    const excerpt = article.excerpt || article.summary || 'Click below to read full article coverage.';
    let image = article.heroImage?.src || article.heroImage || article.image || 'content/images/img1.jpg';
    
    return `
        <article class="card">
            <div class="media"><img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/640x360?text=News'"></div>
            <div class="card-body">
                ${label ? `<span class="category-label" style="background:#b30000; color:#fff; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:2px; display:inline-block; margin-bottom:8px;">${label}</span>` : ''}
                <h3>${title.substring(0, 80)}</h3>
                <p>${excerpt.substring(0, 120)}...</p>
                <div class="card-nav-options" style="margin-top:auto; padding-top:12px; text-align:right;">
                    <a href="article.html?id=${article.id || ''}" style="background:#b30000; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-weight:bold; font-size:0.8rem;">Read More ➔</a>
                </div>
            </div>
        </article>`;
}

/* ==========================================================================
   ARTICLE PAGE RENDERER WITH GUARANTEED BOTTOM ACTION & NAVIGATION BAR
   ========================================================================== */
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

            ${article.heroImage ? `
                <figure class="hero-image-container">
                    <img src="${article.heroImage.src || article.heroImage}" alt="${article.title}">
                    ${article.heroImage.caption ? `<figcaption>${article.heroImage.caption}</figcaption>` : ''}
                </figure>
            ` : ''}

            <div class="article-body-content">
                ${renderJSONBody(article.body || article.content)}
            </div>

            <!-- RESTORED COLORED MODERN ACTION BUTTONS -->
            ${generateArticleActionButtons()}
            
            <!-- RESTORED PREVIOUS / HOME / NEXT NAVIGATION BAR -->
            ${generateArticleBottomNavigation(article.navigation)}
        </article>
    `;
    
    initSocialButtons();
}

function generateArticleActionButtons() {
    return `
        <div class="action-bar">
            <button id="like" data-id="like">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='#E63946' stroke='#E63946' stroke-width='2'><path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/></svg> Like
            </button>
            <button id="subscribe" data-id="subscribe">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='#D97706' stroke='#D97706' stroke-width='2'><path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/></svg> Subscribe
            </button>
            <button id="share" data-id="share">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#4F46E5' stroke-width='2.5'><path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'/><polyline points='16 6 12 2 8 6'/><line x1='12' x2='12' y1='2' y2='15'/></svg> Share
            </button>
            <button id="copyLink" data-id="copyLink">
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#0D9488' stroke-width='2.5'><rect width='14' height='14' x='8' y='8' rx='2' ry='2'/><path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'/></svg> Copy Link
            </button>
        </div>
    `;
}

function generateArticleBottomNavigation(nav) {
    const prevUrl = (nav && nav.prev) ? `article.html?id=${nav.prev}` : "index.html";
    const nextUrl = (nav && nav.next) ? `article.html?id=${nav.next}` : "index.html";
    const prevTitle = (nav && nav.prevTitle) || "Previous Article";
    const nextTitle = (nav && nav.nextTitle) || "Next Article";
    
    return `
        <div class="bottom-article-nav">
            <a href="${prevUrl}" style="color:#b30000; display:inline-flex; align-items:center; gap:6px; max-width:40%;">
                <div>
                    <div style="font-size:0.75rem; color:#888; text-transform:uppercase;">← PREVIOUS</div>
                    <span style="font-size:0.85rem; color:#333; font-weight:normal; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prevTitle}</span>
                </div>
            </a>
            
            <a href="index.html" class="bottom-nav-home" title="Return Home">
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='#1F2937' stroke='#1F2937' stroke-width='2'><path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>
            </a>

            <a href="${nextUrl}" style="color:#b30000; text-align:right; display:inline-flex; align-items:center; gap:6px; max-width:40%; justify-content:flex-end;">
                <div>
                    <div style="font-size:0.75rem; color:#888; text-transform:uppercase;">NEXT →</div>
                    <span style="font-size:0.85rem; color:#333; font-weight:normal; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${nextTitle}</span>
                </div>
            </a>
        </div>
    `;
}

function initSocialButtons() {
    let liked = false;
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.id || btn.getAttribute("data-id");
        if (id === "like") {
            liked = !liked;
            btn.style.backgroundColor = liked ? "#E63946" : "#FFEBEB";
            btn.style.color = liked ? "#FFFFFF" : "#E63946";
            alert(liked ? "Thank you for liking!" : "Unliked");
        } else if (id === "copyLink") {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        } else if (id === "share") {
            if (navigator.share) {
                navigator.share({ title: document.title, url: window.location.href });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        }
    });
}

function renderJSONBody(body) {
    if (!body) return '<p>No document text specified.</p>';
    if (typeof body === 'string') return `<p>${body}</p>`;
    if (Array.isArray(body)) {
        return body.map(block => {
            switch (block.type) {
                case 'paragraph': return `<p style="margin-bottom:1.5rem;">${block.text}</p>`;
                case 'subheading':
                case 'header': return `<h2 class="mid-subheading" style="color:#b30000; font-family:'Playfair Display',serif; margin-top:2rem; margin-bottom:1rem; font-size:1.6rem; font-weight:700;">${block.text}</h2>`;
                case 'pullquote': return `<div class="pull-quote" style="font-size:1.25rem; font-weight:600; margin:2rem 0; padding:1.2rem 1.5rem; background:#f9f9f9; border-left:4px solid #b30000; font-style:italic; color:#333;">${block.text}</div>`;
                case 'points': return `<ul style="margin-bottom:1.5rem; padding-left:20px;">${(block.items || []).map(i => `<li style="margin-bottom:8px;">${i}</li>`).join('')}</ul>`;
                case 'image':
                    return `<figure class="img-center"><img src="${block.src}" alt="Media"><figcaption>${block.caption || ''}</figcaption></figure>`;
                default: return '';
            }
        }).join('');
    }
    return '';
}

function loadAboutPage() {}
function loadChiefEditorPage() {}
function loadHistoricalPage() {}
