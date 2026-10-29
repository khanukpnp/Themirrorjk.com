/* ==========================================================================
   THE MIRROR JAMMU KASHMIR - INTEGRATED PRODUCTION SCRIPT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    initLoader();
    initYear();
    initClocks();
    initWeatherBar(); 
    initTicker();
    initSocialButtons();
    initNav();
    initContactModal();
    
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    if (articleId) {
        initArticlePage(articleId);
    } else {
        loadHomepageContent();
    }
    
    setInterval(updateClocks, 1000);
    setInterval(initWeatherBar, 900000);
});

function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const cancelBtn = document.getElementById("modal-cancel");
    const modal = document.getElementById("contact-modal");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => { modal.style.display = "flex"; });
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
    }
    if (cancelBtn && modal) {
        cancelBtn.addEventListener("click", () => { modal.style.display = "none"; });
    }
}

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

function initNav() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => mobileMenu.hidden = !mobileMenu.hidden);
    }
}

function loadHomepageContent() {
    const loadingDiv = document.getElementById('loading-state');
    if (loadingDiv) loadingDiv.style.display = 'none';
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
        })
        .catch(err => console.error("Index fetch error:", err));
        
    loadVlogs();
}

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
                        <a href="${v.url}" target="_blank" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:#800000; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; text-decoration:none; font-size:1.2rem;">▶</a>
                    </div>
                    <div class="card-body">
                        <span class="category-label">${v.category || 'VLOG'}</span>
                        <h3>${v.title}</h3>
                        <p>${v.description}</p>
                        <div style="margin-top:auto; text-align:right;">
                            <a href="${v.url}" target="_blank" style="background:#800000; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-weight:bold; font-size:0.8rem;">Watch Video ➔</a>
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
                    <a href="article.html?id=${article.id || ''}" style="background:#800000; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-weight:bold; font-size:0.8rem;">Read More ➔</a>
                </div>
            </div>
        </article>`;
}

async function initArticlePage(articleId) {
    const loadingDiv = document.getElementById('loading-state');
    const contentDiv = document.getElementById('content');
    const cb = "?v=" + new Date().getTime();
    
    let articleData = null;
    
    try {
        const response = await fetch(`content/${articleId.toLowerCase()}.json${cb}`);
        if (response.ok) {
            const data = await response.json();
            articleData = data.items ? data.items[0] : data;
        }
    } catch (e) { console.warn("Direct fetch failed, checking master..."); }
    
    if (!articleData) {
        try {
            const response = await fetch(`content/article.json${cb}`);
            if (response.ok) {
                const master = await response.json();
                const items = master.items || master || [];
                articleData = items.find(a => a.id && a.id.toLowerCase() === articleId.toLowerCase());
            }
        } catch (e) { console.error("Master database fetch failed."); }
    }
    
    if (articleData) {
        renderArticle(articleData);
    }
}

function renderArticle(article) {
    const loadingDiv = document.getElementById('loading-state');
    const contentDiv = document.getElementById('content');
    const heroWrap = document.getElementById('heroWrap');
    const heroImg = document.getElementById('heroImg');
    const heroCaption = document.getElementById('heroCaption');
    const titleEl = document.getElementById('title');
    const sectionLabel = document.getElementById('section-label');
    const metaEl = document.getElementById('meta');
    
    document.title = `${article.title || 'Article'} | THE MIRROR JAMMU KASHMIR`;
    if (titleEl) titleEl.textContent = article.title || '';
    if (sectionLabel) sectionLabel.textContent = article.category || article.sectionLabel || 'REPORT';
    if (metaEl) {
        let dateStr = article.date ? new Date(article.date).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        metaEl.innerHTML = `By <strong>${article.author || 'Editorial Desk'}</strong> ${article.location ? '| ' + article.location : ''} | ${dateStr} | ⏱️ ${article.readTime || '5 min read'}`;
    }
    
    if (article.heroImage && heroWrap && heroImg) {
        let src = typeof article.heroImage === 'string' ? article.heroImage : article.heroImage.src;
        let cap = article.heroImage.caption || '';
        if (src) {
            heroImg.src = src;
            heroWrap.style.display = 'block';
            if (heroCaption) heroCaption.textContent = cap;
        }
    }
    
    if (contentDiv) {
        contentDiv.innerHTML = renderJSONBody(article.body || article.content);
        contentDiv.style.display = 'block';
    }
    
    if (article.navigation) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn && article.navigation.prev) prevBtn.href = `article.html?id=${article.navigation.prev}`;
        if (nextBtn && article.navigation.next) nextBtn.href = `article.html?id=${article.navigation.next}`;
    }
    
    if (loadingDiv) loadingDiv.style.display = 'none';
}

function renderJSONBody(body) {
    if (!body) return '<p>No content text provided.</p>';
    if (typeof body === 'string') return `<p>${body}</p>`;
    
    if (Array.isArray(body)) {
        return body.map(block => {
            switch (block.type) {
                case 'paragraph': return `<p style="margin-bottom:1.5rem;">${block.text}</p>`;
                case 'subheading':
                case 'header': return `<h2 style="color:#800000; font-family:'Playfair Display',serif; margin:2rem 0 1rem; font-size:1.6rem; font-weight:700;">${block.text}</h2>`;
                case 'pullquote': return `<div style="font-size:1.25rem; font-weight:600; margin:2rem 0; padding:1.2rem 1.5rem; background:#f9f9f9; border-left:4px solid #800000; font-style:italic; color:#333;">${block.text}</div>`;
                case 'image':
                    const alignClass = block.align === 'left' ? 'img-left' : (block.align === 'right' ? 'img-right' : 'img-center');
                    return `<figure class="${alignClass}"><img src="${block.src}" alt="Media"><figcaption>${block.caption || ''}</figcaption></figure>`;
                default: return '';
            }
        }).join('');
    }
    return '';
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
