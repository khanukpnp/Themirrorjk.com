/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   WITH FIXED ARTICLE LOADING, READ MORE, AND IMAGES
   ============================================================ */

// ==========================
// CONFIG (from your JSON)
// ==========================
const SITE_CONFIG = {
    site: {
        name: "THE MIRROR JAMMU KASHMIR",
        tagline: "CHAMPION JUSTICE & AMPLIFY THE VOICES OF THE UNHEARD",
        url: "https://themirrorjk.com",
        language: "en"
    },
    weather: {
        cities: [
            { name: "Zurich", temp: "6°C" },
            { name: "Rawalakot", temp: "9°C" },
            { name: "Jammu", temp: "18°C" },
            { name: "Kashmir", temp: "4°C" },
            { name: "Ladakh", temp: "-2°C" },
            { name: "Gilgit", temp: "3°C" },
            { name: "Baltistan", temp: "-1°C" },
            { name: "Muzaffarabad", temp: "10°C" }
        ]
    },
    ticker: {
        speed: 40,
        items: [
            "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
            "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
            "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
            "HOPE BECOMES REAL THROUGH ACTION, PERSISTENCE AND PRINCIPLED JOURNALISM",
            "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1",
            "EQUALITY WITHOUT DISCRIMINATION IS A RIGHT, NOT A PRIVILEGE"
        ]
    }
};

// ==========================
// WEATHER RENDER
// ==========================
function renderWeather() {
    const row = document.getElementById('weather-row');
    if (!row) return;
    row.innerHTML = '';
    SITE_CONFIG.weather.cities.forEach(city => {
        const span = document.createElement('span');
        span.className = 'weather-item';
        span.innerHTML = '<span class="weather-city">' + city.name + ':</span> ' + city.temp;
        row.appendChild(span);
    });
}

// ==========================
// TICKER RENDER
// ==========================
function renderTicker() {
    const tickerInner = document.getElementById('ticker-inner');
    if (!tickerInner) return;
    const text = SITE_CONFIG.ticker.items.join(' • ');
    tickerInner.textContent = text;
}

// ==========================
// CLOCKS & CALENDARS
// ==========================
function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
}

function formatGregorian(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    const seconds = pad2(date.getSeconds());
    return dayName + ", " + day + " " + monthName + " " + year + " · " + hours + ":" + minutes + ":" + seconds;
}

function getTimeInOffset(baseDate, offsetHours) {
    const utc = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000);
    const local = new Date(utc + offsetHours * 3600000);
    const h = pad2(local.getHours());
    const m = pad2(local.getMinutes());
    const s = pad2(local.getSeconds());
    return h + ":" + m + ":" + s;
}

function gregorianToHijri(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    let jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
        Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
        Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
        day - 32075;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
        (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
        (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const m = Math.floor((24 * l3) / 709);
    const d = l3 - Math.floor((709 * m) / 24);
    const y = 30 * n + j - 30;
    const months = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"];
    return { day: d, month: months[m - 1], year: y };
}

function gregorianToVikram(date) {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth();
    const gDay = date.getDate();
    const vsYear = gYear + 57;
    const vsMonths = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];
    const mapping = [10, 11, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8];
    const vsMonthIndex = mapping[gMonth];
    const vsMonthName = vsMonths[vsMonthIndex];
    return { day: gDay, month: vsMonthName, year: vsYear };
}

function gregorianToBikrami(date) {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth();
    const gDay = date.getDate();
    const bkYear = gYear + 57;
    const bkMonths = ["Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon", "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagan"];
    const mapping = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
    const bkMonthIndex = mapping[gMonth];
    const bkMonthName = bkMonths[bkMonthIndex];
    return { day: gDay, month: bkMonthName, year: bkYear };
}

function updateClocksAndCalendars() {
    const now = new Date();
    
    const gregDisplay = document.getElementById('gregorian-display');
    if (gregDisplay) gregDisplay.textContent = formatGregorian(now);
    
    const timeIST = document.getElementById('time-ist');
    const timePKT = document.getElementById('time-pkt');
    const timeCET = document.getElementById('time-cet');
    if (timeIST) timeIST.textContent = getTimeInOffset(now, 5.5);
    if (timePKT) timePKT.textContent = getTimeInOffset(now, 5);
    if (timeCET) timeCET.textContent = getTimeInOffset(now, 1);
    
    const hijri = gregorianToHijri(now);
    const hijriDisplay = document.getElementById('hijri-display');
    if (hijriDisplay) hijriDisplay.textContent = hijri.day + " " + hijri.month + " " + hijri.year + " AH";
    
    const vs = gregorianToVikram(now);
    const vikramDisplay = document.getElementById('vikram-display');
    if (vikramDisplay) vikramDisplay.textContent = vs.day + " " + vs.month + " " + vs.year + " VS";
    
    const bk = gregorianToBikrami(now);
    const bikramiDisplay = document.getElementById('bikrami-display');
    if (bikramiDisplay) bikramiDisplay.textContent = bk.day + " " + bk.month + " " + bk.year + " (Desi Bikrami)";
}

// ==========================
// CREATE HOMEPAGE CARD
// ==========================
function createHomepageCard(article, label) {
    if (!article) return '';
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || 'Click to read more about this story.';
    
    let imageUrl = '';
    
    if (article.heroImage) {
        if (typeof article.heroImage === 'string') {
            imageUrl = article.heroImage;
        } else if (article.heroImage.src) {
            imageUrl = article.heroImage.src;
        }
    }
    
    if (!imageUrl && article.body && Array.isArray(article.body)) {
        for (let i = 0; i < article.body.length; i++) {
            if (article.body[i].type === 'image' && article.body[i].src) {
                imageUrl = article.body[i].src;
                break;
            }
        }
    }
    
    if (imageUrl) {
        if (imageUrl.startsWith('/')) imageUrl = imageUrl.substring(1);
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('content/images/')) {
            imageUrl = 'content/images/' + imageUrl.split('/').pop();
        }
    } else {
        const firstLetter = title.charAt(0).toUpperCase();
        imageUrl = 'https://via.placeholder.com/640x360?text=' + encodeURIComponent(firstLetter);
    }
    
    const id = article.id || '';
    
    let displayTitle = title;
    if (title.length > 80) displayTitle = title.substring(0, 80) + '...';
    
    let displayExcerpt = excerpt;
    if (excerpt.length > 120) displayExcerpt = excerpt.substring(0, 120) + '...';
    
    return `
        <article class="card">
            <div class="card-hero">
                <img src="${imageUrl}" alt="${displayTitle}" onerror="this.onerror=null; this.src='https://via.placeholder.com/640x360?text=News'">
            </div>
            <div class="card-body">
                <div class="card-kicker">${label || 'ARTICLE'}</div>
                <h3 class="card-title">${displayTitle}</h3>
                <div class="card-meta">${article.location || 'The Mirror JK'}</div>
                <p class="card-excerpt">${displayExcerpt}</p>
                <div class="card-footer">
                    <a href="article.html?id=${id}" class="btn-read-more">Read More →</a>
                </div>
            </div>
        </article>
    `;
}

// ==========================
// LOAD HOMEPAGE SECTIONS
// ==========================
async function loadHomepageContent() {
    const articlesToLoad = {
        'top-stories-grid': ['article-001', 'breaking-001', 'blog-001'],
        'leh-grid': ['latest-001', 'editorial-001', 'historical-001'],
        'jk-grid': ['jk-001', 'jk-002'],
        'intl-grid': ['intl-001', 'intl-002'],
        'hr-grid': ['hr-001', 'hr-002']
    };
    
    for (const [gridId, articleIds] of Object.entries(articlesToLoad)) {
        const grid = document.getElementById(gridId);
        if (!grid) continue;
        
        grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>';
        
        const articles = [];
        for (const id of articleIds) {
            try {
                const response = await fetch('content/' + id + '.json');
                if (response.ok) {
                    let data = await response.json();
                    let article = data;
                    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                        article = data.items[0];
                    } else if (Array.isArray(data) && data.length > 0) {
                        article = data[0];
                    }
                    articles.push(article);
                } else {
                    articles.push(null);
                }
            } catch (e) {
                articles.push(null);
            }
        }
        
        let html = '';
        const labels = {
            'top-stories-grid': ['TOP STORY', 'BREAKING', 'OPINION'],
            'leh-grid': ['LATEST', 'EDITORIAL', 'HISTORICAL'],
            'jk-grid': ['JK', 'JK'],
            'intl-grid': ['INTL', 'INTL'],
            'hr-grid': ['HR', 'HR']
        };
        
        articles.forEach((article, index) => {
            if (article) {
                html += createHomepageCard(article, labels[gridId] ? labels[gridId][index] : '');
            } else {
                html += `
                    <article class="card">
                        <div class="card-hero">
                            <div class="card-hero-placeholder">${labels[gridId] ? labels[gridId][index] : 'COMING'}</div>
                        </div>
                        <div class="card-body">
                            <div class="card-kicker">${labels[gridId] ? labels[gridId][index] : 'COMING SOON'}</div>
                            <h3 class="card-title">Content Coming Soon</h3>
                            <p class="coming-soon-text">Content will appear here. Please check back later.</p>
                        </div>
                    </article>
                `;
            }
        });
        
        grid.innerHTML = html;
    }
}

// ==========================
// LOAD VLOGS
// ==========================
function loadVlogs() {
    const grid = document.getElementById('vlogs-grid');
    if (!grid) return;
    
    const vlogs = [
        { title: "Azad Kashmir / POJK: Denial of Rights & Self Rule", duration: "15:32", image: "content/images/london-ukpnp-01.jpg", kicker: "Exclusive Interview" },
        { title: "SCO Summit 2025: New World Order?", duration: "12:45", image: "content/images/london-ukpnp-02.jpg", kicker: "Ground Report" },
        { title: "UKPNP Intra Kashmir Virtual Conference", duration: "18:20", image: "content/images/rawalakot-03.jpg", kicker: "Analysis" }
    ];
    
    let html = '';
    vlogs.forEach(vlog => {
        html += `
            <article class="card">
                <div class="card-hero">
                    <img src="${vlog.image}" alt="${vlog.title}" onerror="this.src='https://via.placeholder.com/640x360?text=Video'">
                    <div class="video-duration">${vlog.duration}</div>
                </div>
                <div class="card-body">
                    <div class="card-kicker">${vlog.kicker}</div>
                    <h3 class="card-title">${vlog.title}</h3>
                    <div class="card-meta">The Mirror Jammu Kashmir</div>
                    <p class="card-excerpt">In-depth coverage and analysis of key issues affecting the region...</p>
                    <div class="card-footer">
                        <a href="#" class="btn-read-more">Watch →</a>
                    </div>
                </div>
            </article>
        `;
    });
    grid.innerHTML = html;
}

// ==========================
// INTERACTION BUTTONS
// ==========================
function setupInteractionButtons() {
    const likeBtn = document.getElementById('btn-like-main');
    const subscribeBtn = document.getElementById('btn-subscribe-main');
    const shareBtn = document.getElementById('btn-share-main');
    const copyBtn = document.getElementById('btn-copy-main');
    const backHomeBtn = document.getElementById('btn-back-home-main');
    const epaperUpload = document.getElementById('epaper-upload-btn');
    const newsletterSubscribe = document.getElementById('newsletter-subscribe-btn');
    const contactFormBtn = document.getElementById('open-contact-form-btn');
    
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            alert('Thank you for liking THE MIRROR JAMMU KASHMIR.');
        });
    }
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            const email = prompt('Enter your email to subscribe:', 'your@email.com');
            if (email && email.includes('@') && email.includes('.')) {
                alert('Thank you for subscribing! You will receive notifications about new articles.');
            } else if (email) {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: SITE_CONFIG.site.name,
                    text: SITE_CONFIG.site.tagline,
                    url: window.location.href
                }).catch(() => {});
            } else {
                alert('Share this page: ' + window.location.href);
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            }).catch(() => {
                alert('Unable to copy link. Please copy manually: ' + window.location.href);
            });
        });
    }
    
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (epaperUpload) {
        epaperUpload.addEventListener('click', () => {
            const fileInput = document.getElementById('epaper-file');
            if (fileInput && fileInput.files.length > 0) {
                alert('File "' + fileInput.files[0].name + '" ready for upload.');
            } else {
                alert('Please select a file first.');
            }
        });
    }
    
    if (newsletterSubscribe) {
        newsletterSubscribe.addEventListener('click', () => {
            const emailInput = document.getElementById('newsletter-email');
            if (emailInput && emailInput.value.trim()) {
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    if (contactFormBtn) {
        contactFormBtn.addEventListener('click', () => {
            alert('Contact Form: Send your message to themirrorjk@gmail.com or call +41 783 13 12 13');
        });
    }
}

// ==========================
// LANGUAGE SELECTOR
// ==========================
function setupLanguageSelector() {
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            alert('Language changed to ' + e.target.options[e.target.selectedIndex].text + '. Content translation coming soon.');
        });
    }
}

// ==========================
// SEARCH
// ==========================
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                alert('Searching for: ' + searchInput.value.trim());
            }
        });
    }
}

// ==========================
// FOOTER YEAR
// ==========================
function updateFooterYear() {
    const yearSpan = document.getElementById('footer-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ==========================
// INITIALIZATION
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing...');
    
    renderWeather();
    renderTicker();
    updateClocksAndCalendars();
    setInterval(updateClocksAndCalendars, 1000);
    loadHomepageContent();
    loadVlogs();
    setupInteractionButtons();
    setupLanguageSelector();
    setupSearch();
    updateFooterYear();
});

// Make functions available globally for article.html
window.copyPageLink = function() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy link');
    });
};
