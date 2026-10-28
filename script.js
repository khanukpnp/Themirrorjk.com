/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - INTEGRATED PRODUCTION ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    initLoader();
    initYear();
    initClocks();
    initWeatherBar(); 
    initNav();
    
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");
    
    if (path.includes("article.html") || articleId) {
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
    setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.style.display = "none", 300); }, 800);
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
    
    const istTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const pktTime = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    datetimeBar.innerHTML = `
        <span>${fullDate} at ${zurichTime}</span>
        <span class="separator">•</span>
        <span>Jumada I 18, 1448 AH</span>
        <span class="separator">•</span>
        <span>Budhvaar, 14 Kattak 2083 VS</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istTime}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktTime}</strong></span>
    `;
}

function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    bar.innerHTML = `<span>Zurich: <strong>9°C</strong></span> • <span>Rawalakot: <strong>13°C</strong></span> • <span>Jammu: <strong>15°C</strong></span> • <span>Kashmir: <strong>6°C</strong></span> • <span>Ladakh: <strong>-1°C</strong></span> • <span>Gilgit: <strong>10°C</strong></span> • <span>Baltistan: <strong>7°C</strong></span> • <span>Muzaffarabad: <strong>13°C</strong></span>`;
}

function initNav() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => mobileMenu.hidden = !mobileMenu.hidden);
    }
}

function loadHomepageContent() {
    const cb = "?v=" + new Date().getTime();
    fetch("content/index.json" + cb)
        .then(r => r.json())
        .then(index => {
            if (index.latestEditorialHistorical) loadLehSection(index.latestEditorialHistorical);
            if (index.topStories) loadTopStories([index.topStories.lead, index.topStories.breaking, index.topStories.opinion]);
            if (index.spotlightFocusTrending) loadSpotlightSection(index.spotlightFocusTrending);
            if (index.jammuKashmir) loadSectionGroup("jk-grid", index.jammuKashmir, "Jammu Kashmir");
            if (index.international) loadSectionGroup("intl-grid", index.international, "International Diplomacy");
            if (index.humanRights) loadSectionGroup("hr-grid", index.humanRights, "Human Rights");
        });
}

/* 6 WINDOW SPOTLIGHT ENGINE FIX */
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
                let html = valid.map(a => createHomepageCard(a)).join('');
                for (let i = valid.length; i < 3; i++) html += createComingSoonCard("SPOTLIGHT");
                container.innerHTML = html;
            });
    };
    renderRow(topRowIds, "spotlight-top-row");
    renderRow(bottomRowIds, "spotlight-bottom-row");
}

function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const valid = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            grid.innerHTML = valid.slice(0, 6).map(a => createHomepageCard(a, a.sectionLabel || "REPORT")).join('');
        });
}

function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const valid = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            grid.innerHTML = valid.slice(0, 6).map(a => createHomepageCard(a)).join('');
        });
}

function loadSectionGroup(gridId, ids, label) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    Promise.all(ids.map(id => fetch(`content/${id.toLowerCase()}.json${cb}`).then(r => r.json()).catch(() => null)))
        .then(articles => {
            const valid = articles.filter(Boolean).map(a => a.items ? a.items[0] : a);
            grid.innerHTML = valid.map(a => createHomepageCard(a, label)).join('');
        });
}

function createComingSoonCard(label = "COMING SOON") {
    return `
        <article class="card">
            <div class="media" style="display:flex; align-items:center; justify-content:center; background:#f9f9f9;">
                <span style="font-weight:bold; color:#888;">${label}</span>
            </div>
            <div class="card-body" style="text-align:center;">
                <h3 style="color:#b30000;">Coming Soon</h3>
                <p>Ready for new publications.</p>
            </div>
        </article>`;
}

function createHomepageCard(article, label) {
    if (!article) return '';
    const title = article.title || 'Untitled Report';
    const excerpt = article.excerpt || article.summary || 'Click below to read full article coverage.';
    let image = article.heroImage?.src || article.heroImage || article.image || 'content/images/img1.jpg';
    
    return `
        <article class="card">
            <div class="media"><img src="${image}" alt="${title}"></div>
            <div class="card-body">
                ${label ? `<span class="category-label">${label}</span>` : ''}
                <h3>${title.substring(0, 80)}</h3>
                <p>${excerpt.substring(0, 120)}...</p>
                <div style="margin-top:auto; text-align:right;">
                    <a href="article.html?id=${article.id || ''}" style="background:#b30000; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-weight:bold; font-size:0.8rem;">Read More ➔</a>
                </div>
            </div>
        </article>`;
}

function initArticlePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    const cb = "?v=" + new Date().getTime();
    if (!id) return;
    
    fetch(`content/${id.toLowerCase()}.json${cb}`)
        .then(r => r.json())
        .then(data => renderFullArticlePage(data.items ? data.items[0] : data));
}

function renderFullArticlePage(article) {
    const contentEl = document.getElementById("content") || document.getElementById("article-content") || document.body;
    if (!contentEl) return;
    contentEl.style.display = 'block';
    
    contentEl.innerHTML = `
        <article class="prose-container">
            <h1>${article.title}</h1>
            ${article.heroImage ? `<figure class="hero-image-container"><img src="${article.heroImage.src || article.heroImage}"></figure>` : ''}
            <div class="article-body-content">${renderJSONBody(article.body || article.content)}</div>
            
            <div class="action-bar">
                <button id="like" data-id="like">❤️ Like</button>
                <button id="subscribe" data-id="subscribe">🔔 Subscribe</button>
                <button id="share" data-id="share">🔗 Share</button>
                <button id="copyLink" data-id="copyLink">📋 Copy Link</button>
            </div>
            
            <div class="bottom-article-nav">
                <a href="index.html" style="color:#b30000;">← PREVIOUS</a>
                <a href="index.html" class="bottom-nav-home">🏠</a>
                <a href="index.html" style="color:#b30000;">NEXT →</a>
            </div>
        </article>`;
}

function renderJSONBody(body) {
    if (!body) return '';
    if (typeof body === 'string') return `<p>${body}</p>`;
    if (Array.isArray(body)) {
        return body.map(block => {
            if (block.type === 'paragraph') return `<p style="margin-bottom:1.5rem;">${block.text}</p>`;
            if (block.type === 'image') return `<figure class="img-center"><img src="${block.src}"><figcaption>${block.caption || ''}</figcaption></figure>`;
            return '';
        }).join('');
    }
    return '';
}
