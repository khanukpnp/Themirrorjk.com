/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - CORE SCRIPT ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    initLoader();
    initYear();
    initClocks();
    initWeatherBar(); 
    initTicker();
    initSocialButtons();
    
    const path = window.location.pathname;
    if (path.includes("index.html") || path === "/" || path === "") {
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
    bar.innerHTML = `<span>Zurich: <strong>9°C</strong></span> <span class="separator">•</span> <span>Rawalakot: <strong>13°C</strong></span> <span class="separator">•</span> <span>Jammu: <strong>15°C</strong></span> <span class="separator">•</span> <span>Kashmir: <strong>6°C</strong></span> <span class="separator">•</span> <span>Ladakh: <strong>-1°C</strong></span> <span class="separator">•</span> <span>Gilgit: <strong>10°C</strong></span> <span class="separator">•</span> <span>Baltistan: <strong>7°C</strong></span> <span class="separator">•</span> <span>Muzaffarabad: <strong>13°C</strong></span>`;
}

function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    const headlines = [
        "WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY",
        "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH",
        "GOT NEWS, FEEDBACK OR URGENT UPDATES? CONTACT THE MIRROR JAMMU KASHMIR",
        "FOLLOW US ON YOUTUBE --- THE MIRROR JAMMU KASHMIR --- SUBSCRIBE, LIKE AND SHARE"
    ];
    let html = '';
    for (let i = 0; i < 2; i++) {
        headlines.forEach(text => { html += `<span>${text} &nbsp;•&nbsp; </span>`; });
    }
    tickerItems.innerHTML = html;
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
        
    // LOAD 9 VLOGS FROM YOUTUBE.JSON
    loadVlogs();
}

/* 9 WINDOW VIDEO REPORTS & VLOGS (3 ROWS OF 3) */
function loadVlogs() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    const cb = "?v=" + new Date().getTime();
    
    fetch("content/youtube.json" + cb)
        .then(r => r.json())
        .then(data => {
            const videos = data.videos || [];
            grid.innerHTML = videos.slice(0, 9).map(v => `
                <article class="card">
                    <div class="media">
                        <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="${v.title}">
                        <a href="${v.url}" target="_blank" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:#b30000; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; text-decoration:none; font-size:1.2rem;">▶</a>
                    </div>
                    <div class="card-body">
                        <span class="category-label">${v.category || 'VLOG'}</span>
                        <h3>${v.title}</h3>
                        <p>${v.description}</p>
                        <div style="margin-top:auto; text-align:right;">
                            <a href="${v.url}" target="_blank" style="background:#b30000; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-weight:bold; font-size:0.8rem;">Watch Video ➔</a>
                        </div>
                    </div>
                </article>
            `).join('');
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
                container.innerHTML = valid.map(a => createHomepageCard(a)).join('');
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
