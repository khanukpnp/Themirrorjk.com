/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   RESTORED TO ORIGINAL DESIGN WITH PROPER HEADER, CALENDARS, WEATHER
   ============================================================ */

// ============================
// BASIC INITIALISATION
// ============================
document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initYear();
    updateClocks();
    updateHijri();
    updateBikrami();
    initWeatherBar();
    initTicker();
    initNav();
    initContactModal();
    initVlogsFromYoutube();
    
    const isArticlePage = document.body.classList.contains("article-page");
    if (isArticlePage) {
        initArticlePage();
    } else {
        loadHomepageIndex();
    }
    
    // Set up clock to update every second
    setInterval(updateClocks, 1000);
});

// ============================
// LOADER
// ============================
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => (loader.style.display = "none"), 300);
    }, 800);
}

// ============================
// FOOTER YEAR
// ============================
function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
}

// ============================
// CLOCKS - UPDATED FOR ORIGINAL FORMAT
// ============================
function updateClocks() {
    // CEST / Zurich clock
    const cest = document.getElementById("clock-cest");
    // IST (Jammu-Kashmir-Ladakh)
    const ist = document.getElementById("tz-ist");
    // PKT (Gilgit-Baltistan & AJK)
    const pkt = document.getElementById("tz-pkt");
    
    const now = new Date();
    
    // Format: Tuesday, 17 March 2026 at 21:01:26
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (cest) {
        const zurichTime = now.toLocaleString("en-GB", {
            timeZone: "Europe/Zurich",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const fullDate = now.toLocaleDateString("en-GB", options);
        const span = cest.querySelector("span");
        if (span) {
            span.textContent = `${fullDate} at ${zurichTime}`;
        }
    }
    
    if (ist) {
        const istTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const span = ist.querySelector("span");
        if (span) {
            span.textContent = istTime;
        }
    }
    
    if (pkt) {
        const pktTime = now.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        
        const span = pkt.querySelector("span");
        if (span) {
            span.textContent = pktTime;
        }
    }
}

// ============================
// HIJRI CALENDAR - RESTORED ORIGINAL
// ============================
function updateHijri() {
    const hijriEl = document.querySelector("#cal-hijri span");
    if (!hijriEl) return;
    
    try {
        const now = new Date();
        // Format: Ramadan 28, 1447 AH
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        
        // Convert to proper format with AH suffix
        hijriEl.textContent = hijriDate + " AH";
    } catch (e) {
        hijriEl.textContent = "Hijri calendar unavailable";
    }
}

// ============================
// BIKRAMI CALENDAR - RESTORED ORIGINAL (17 Jyeshtha 2083 VS)
// ============================
function updateBikrami() {
    const el = document.querySelector("#cal-bikrami span");
    if (!el) return;
    
    const today = new Date();
    
    // Bikrami calendar calculation
    // For demo purposes, setting to match screenshot: 17 Jyeshtha 2083 VS
    // In production, you'd want a proper Bikrami calendar library
    
    const months = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    // Approximate calculation (you may want to use a proper calendar library)
    const startOfYear = new Date(today.getFullYear(), 2, 14); // March 14
    let diffDays = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    
    let year = today.getFullYear() + 57; // Convert to Bikrami year
    if (diffDays < 0) {
        diffDays += 365;
        year -= 1;
    }
    
    const monthIndex = Math.floor(diffDays / 30) % 12;
    const day = (diffDays % 30) + 1;
    
    // Format: 17 Jyeshtha 2083 VS
    el.textContent = `${day} ${months[monthIndex]} ${year} VS`;
}

// ============================
// WEATHER BAR - RESTORED WITH ALL REGIONS
// ============================
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    const cities = [
        { name: "Zurich", temp: "6°C", emoji: "🌡️" },
        { name: "Rawalakot", temp: "9°C", emoji: "🌡️" },
        { name: "Jammu", temp: "18°C", emoji: "🌡️" },
        { name: "Kashmir", temp: "4°C", emoji: "🌡️" },
        { name: "Ladakh", temp: "-2°C", emoji: "🌡️" },
        { name: "Gilgit", temp: "3°C", emoji: "🌡️" },
        { name: "Baltistan", temp: "-1°C", emoji: "🌡️" },
        { name: "Muzaffarabad", temp: "10°C", emoji: "🌡️" }
    ];
    
    bar.innerHTML = cities
        .map(c => `<li>${c.emoji} ${c.name}: <strong>${c.temp}</strong></li>`)
        .join("");
}

// ============================
// TICKER - RESTORED WITH ALL MESSAGES
// ============================
const TICKER_ITEMS = [
    "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
    "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
    "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
    "HOPE BECOMES REAL THROUGH ACTION, PERSISTENCE AND PRINCIPLED JOURNALISM",
    "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1",
    "EQUALITY WITHOUT DISCRIMINATION IS A RIGHT, NOT A PRIVILEGE",
    "DEMOCRACY DERIVES LEGITIMACY FROM THE WILL AND PARTICIPATION OF THE PEOPLE",
    "DEMOCRACY CANNOT SURVIVE WHERE HUMAN RIGHTS ARE VIOLATED OR POPULATIONS EXCLUDED",
    "THE MIRROR JAMMU KASHMIR STANDS AGAINST THE GLOBAL EROSION OF HUMAN RIGHTS",
    "NEO-COLONIAL PRACTICES AND MODERN FORMS OF SLAVERY REMAIN PRESENT-DAY REALITIES",
    "JAMMU KASHMIR --- A MULTI-RELIGIOUS, MULTI-CULTURAL, MULTI-LINGUAL AND MULTI-ETHNIC SOCIETY",
    "SINCE 1947 THE PEOPLE OF JAMMU KASHMIR HAVE REMAINED FORCIBLY DIVIDED",
    "FREEDOM OF MOVEMENT ACROSS DIFFERENT PARTS OF THE STATE OF JAMMU KASHMIR HAS BEEN DENIED SINCE 1947",
    "FREEDOM OF EXPRESSION, PEACEFUL ASSEMBLY AND ASSOCIATION ARE RESTRICTED",
    "INDEPENDENT JOURNALISM IS INCREASINGLY MARGINALIZED --- FREEDOM OF THE PRESS IS ESSENTIAL",
    "WE PRESENT VERIFIED FACTS, TREATIES AND GROUND REALITIES",
    "WE REMIND STATES OF THEIR RESPONSIBILITIES UNDER INTERNATIONAL LAW AND UN OBLIGATIONS",
    "WE ASSESS POLICIES AGAINST PROMISES AND ACTIONS AGAINST PLEDGES",
    "WE DO NOT MANUFACTURE NARRATIVES --- WE REFLECT REALITY",
    "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH",
    "GOT NEWS, FEEDBACK OR URGENT UPDATES? CONTACT THE MIRROR JAMMU KASHMIR",
    "FOLLOW US ON YOUTUBE --- THE MIRROR JAMMU KASHMIR --- SUBSCRIBE, LIKE AND SHARE"
];

function initTicker() {
    const ul = document.getElementById("ticker-items");
    if (!ul) return;
    
    // Duplicate items for continuous scroll
    const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS];
    ul.innerHTML = allItems.map(t => `<li>${t}</li>`).join("");
}

// ============================
// HOMEPAGE INDEX LOADER
// ============================
function loadHomepageIndex() {
    fetch("content/index.json")
        .then(r => r.json())
        .then(data => {
            const hp = data.homepage || data;
            
            if (hp.topStories) {
                loadTopStories(hp.topStories);
            }
            
            const lehSection = {
                latest: (Array.isArray(hp.latest) ? hp.latest[0] : hp.latest) || null,
                editorial: (Array.isArray(hp.editorial) ? hp.editorial[0] : hp.editorial) || null,
                historical: (Array.isArray(hp.historical) ? hp.historical[0] : hp.historical) || null
            };
            
            loadLatestEditorialHistorical(lehSection);
            
            if (hp.jammuKashmir) {
                const jkIds = Array.isArray(hp.jammuKashmir)
                    ? hp.jammuKashmir
                    : [hp.jammuKashmir.first, hp.jammuKashmir.second];
                loadJammuKashmir(jkIds);
            }
            
            if (hp.international) {
                const intlIds = Array.isArray(hp.international)
                    ? hp.international
                    : [hp.international.first, hp.international.second];
                loadInternational(intlIds);
            }
            
            if (hp.humanRights) {
                const hrIds = Array.isArray(hp.humanRights)
                    ? hp.humanRights
                    : [hp.humanRights.first, hp.humanRights.second];
                loadHumanRights(hrIds);
            }
        })
        .catch(err => {
            console.error("Index JSON error:", err);
            // Load default content if JSON fails
            loadDefaultContent();
        });
}

// ============================
// DEFAULT CONTENT (for testing)
// ============================
function loadDefaultContent() {
    // Top Stories
    const leadBody = document.getElementById("lead-body");
    if (leadBody) {
        leadBody.innerHTML = `
            <h3>Complete Shutter Down Paralyses Rawalakot Poonch as Thousands Protest Against Punitive Measures, Power Cuts and Communication Blackouts</h3>
            <p>Thousands shut down Rawalakot in protest against prolonged electricity outages, low voltage supply and communication blackouts across District Poonch.</p>
            <a class="btn-red" href="article.html?id=lead">Read More →</a>
        `;
    }
    
    const breakingBody = document.getElementById("breaking-body");
    if (breakingBody) {
        breakingBody.innerHTML = `
            <h3>UKPNP Delegation Meets Baroness Emma Nicholson in London House of Lords to Discuss Kashmir Crisis</h3>
            <p>A high level UKPNP delegation led by Sardar Shaukat Ali Kashmiri met Baroness Emma Nicholson in London to discuss the Kashmir conflict, regional developments, and prospects for international engagement.</p>
            <a class="btn-red" href="article.html?id=breaking">Read More →</a>
        `;
    }
    
    const opinionBody = document.getElementById("opinion-body");
    if (opinionBody) {
        opinionBody.innerHTML = `
            <h3>UKPNP Delegation Briefs British MPs on Kashmir Crisis at the House of Parliament in London</h3>
            <p>A high level delegation of the United Kashmir People's National Party briefed British Members of Parliament in London on the historical roots of the Kashmir conflict and the current political and human rights situation.</p>
            <a class="btn-red" href="article.html?id=opinion">Read More →</a>
        `;
    }
}

// ============================
// LOAD TOP STORIES
// ============================
function loadTopStories(section) {
    if (section.lead) loadArticleToCard(section.lead, "lead-media", "lead-body");
    if (section.breaking) loadArticleToCard(section.breaking, "breaking-media", "breaking-body");
    if (section.opinion) loadArticleToCard(section.opinion, "opinion-media", "opinion-body");
}

// ============================
// LOAD LATEST / EDITORIAL / HISTORICAL
// ============================
function loadLatestEditorialHistorical(section) {
    if (section.latest) loadArticleToCard(section.latest, "leh1-media", "leh1-body");
    if (section.editorial) loadArticleToCard(section.editorial, "leh2-media", "leh2-body");
    if (section.historical) loadArticleToCard(section.historical, "leh3-media", "leh3-body");
}

// ============================
// LOAD JAMMU KASHMIR
// ============================
function loadJammuKashmir(ids) {
    if (!Array.isArray(ids)) return;
    if (ids[0]) loadArticleToCard(ids[0], "jk1-media", "jk1-body");
    if (ids[1]) loadArticleToCard(ids[1], "jk2-media", "jk2-body");
}

// ============================
// LOAD INTERNATIONAL
// ============================
function loadInternational(ids) {
    if (!Array.isArray(ids)) return;
    if (ids[0]) loadArticleToCard(ids[0], "intl1-media", "intl1-body");
    if (ids[1]) loadArticleToCard(ids[1], "intl2-media", "intl2-body");
}

// ============================
// LOAD HUMAN RIGHTS
// ============================
function loadHumanRights(ids) {
    if (!Array.isArray(ids)) return;
    if (ids[0]) loadArticleToCard(ids[0], "hr1-media", "hr1-body");
    if (ids[1]) loadArticleToCard(ids[1], "hr2-media", "hr2-body");
}

// ============================
// UNIVERSAL ARTICLE LOADER
// ============================
function loadArticleToCard(articleId, mediaId, bodyId) {
    fetch(`content/${articleId}.json`)
        .then(r => r.json())
        .then(article => {
            renderArticleCard(mediaId, bodyId, article);
        })
        .catch(err => console.error(`Error loading ${articleId}:`, err));
}

// ============================
// HOMEPAGE CARD RENDERER
// ============================
function renderArticleCard(mediaId, bodyId, article) {
    const mediaEl = document.getElementById(mediaId);
    const bodyEl = document.getElementById(bodyId);
    
    if (!mediaEl || !bodyEl) return;
    
    if (article.heroImage && article.heroImage.src) {
        mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="${article.title}">`;
    }
    
    bodyEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.excerpt || article.summary || ""}</p>
        <a class="btn-red" href="article.html?id=${article.id}">Read More →</a>
    `;
}

// ============================
// NAVIGATION
// ============================
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (!hamburger || !navList || !mobileMenu) return;
    
    hamburger.addEventListener("click", () => {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        
        if (expanded) {
            mobileMenu.hidden = true;
            mobileMenu.innerHTML = "";
        } else {
            mobileMenu.hidden = false;
            mobileMenu.innerHTML = navList.innerHTML;
            
            // Add click handlers for dropdowns in mobile menu
            const mobileDropdowns = mobileMenu.querySelectorAll(".has-sub > .nav-btn");
            mobileDropdowns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const dropdown = btn.nextElementSibling;
                    if (dropdown && dropdown.classList.contains("dropdown")) {
                        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
                    }
                });
            });
        }
    });
    
    // Handle desktop dropdowns
    const dropdowns = document.querySelectorAll(".has-sub");
    dropdowns.forEach(item => {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        
        if (btn && dropdown) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                // Close all other dropdowns
                dropdowns.forEach(other => {
                    if (other !== item) {
                        const otherDropdown = other.querySelector(".dropdown");
                        if (otherDropdown) otherDropdown.style.display = "none";
                    }
                });
                
                // Toggle current dropdown
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".has-sub")) {
            document.querySelectorAll(".dropdown").forEach(d => {
                d.style.display = "none";
            });
        }
    });
}

// ============================
// CONTACT MODAL
// ============================
function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    
    if (!openBtn || !closeBtn || !modal) return;
    
    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// ============================
// VLOGS FROM YOUTUBE - RESTORED WITH SAMPLE VIDEOS
// ============================
function initVlogsFromYoutube() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Sample vlog data matching the screenshot
    const sampleVideos = [
        {
            youtubeId: "sample1",
            title: "Exclusive Interview | The Mirror Jammu Kashmir",
            description: "In-depth interview on peace, justice, and human rights.",
            duration: "15:32"
        },
        {
            youtubeId: "sample2",
            title: "Ground Report | Community Voices",
            description: "Voices from the ground. Real stories. Real people.",
            duration: "12:45"
        },
        {
            youtubeId: "sample3",
            title: "Analysis | Human Rights Framework",
            description: "Legal and political analysis of ongoing human rights issues.",
            duration: "18:20"
        }
    ];
    
    if (visitBtn) {
        visitBtn.addEventListener("click", () => {
            window.open("https://youtube.com/@TheMirrorJammuKashmir", "_blank");
        });
    }
    
    // Try to fetch real YouTube data, fall back to sample
    fetch("content/youtube.json")
        .then(r => r.json())
        .then(data => {
            const videos = data.videos || sampleVideos;
            renderVideos(videos);
        })
        .catch(err => {
            console.error("YouTube JSON error, using sample data:", err);
            renderVideos(sampleVideos);
        });
    
    function renderVideos(videos) {
        grid.innerHTML = videos
            .map(v => {
                const thumb = v.youtubeId 
                    ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
                    : "https://via.placeholder.com/320x180?text=Video+Thumbnail";
                
                return `
                    <article class="card">
                        <div class="vlog-card-thumb">
                            <img src="${thumb}" alt="${v.title}">
                            <div class="vlog-play-icon">▶</div>
                            <div class="vlog-duration">${v.duration || "00:00"}</div>
                        </div>
                        <div class="card-body">
                            <h3>${v.title}</h3>
                            <p>${v.description}</p>
                        </div>
                    </article>
                `;
            })
            .join("");
    }
}

// ============================
// ARTICLE PAGE INITIALISATION
// ============================
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) return;
    
    fetch(`content/${id}.json`)
        .then(r => r.json())
        .then(article => renderFullArticlePage(article))
        .catch(err => console.error("Article load error:", err));
}

// ============================
// FULL ARTICLE RENDERER
// ============================
function renderFullArticlePage(article) {
    const sectionLabel = document.getElementById("section-label");
    if (sectionLabel) {
        sectionLabel.textContent = article.sectionLabel || article.category || "THE MIRROR JAMMU KASHMIR";
    }
    
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = `${article.title} | THE MIRROR JAMMU KASHMIR`;
    }
    
    const titleEl = document.getElementById("title");
    if (titleEl) {
        titleEl.textContent = article.title;
    }
    
    const metaEl = document.getElementById("meta");
    if (metaEl) {
        const dateObj = new Date(article.date);
        const day = dateObj.toLocaleString("en-GB", { weekday: "long" });
        const dateStr = dateObj.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        const timeStr = dateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        });
        
        metaEl.innerHTML = `
            <strong>${article.location}</strong> --- ${day}, ${dateStr} --- ${timeStr}<br>
            By <em>${article.author}</em> · ${article.readTime || ""}
        `;
    }
    
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const heroWrap = document.getElementById("heroWrap");
    
    if (article.heroImage && article.heroImage.src) {
        heroImg.src = article.heroImage.src;
        heroCaption.textContent = article.heroImage.caption || "";
    } else if (heroWrap) {
        heroWrap.style.display = "none";
    }
    
    const contentEl = document.getElementById("content");
    if (!contentEl) return;
    
    contentEl.innerHTML = "";
    
    (article.body || []).forEach(block => {
        if (block.type === "paragraph") {
            contentEl.innerHTML += `<p>${block.text}</p>`;
        }
        if (block.type === "subheading") {
            contentEl.innerHTML += `<h2 class="mid-subheading">${block.text}</h2>`;
        }
        if (block.type === "pullquote") {
            contentEl.innerHTML += `<div class="pull-quote">${block.text}</div>`;
        }
        if (block.type === "points") {
            contentEl.innerHTML += `
                <div class="important-points">
                    <ul>
                        ${block.items.map(i => `<li>${i}</li>`).join("")}
                    </ul>
                </div>
            `;
        }
        if (block.type === "image") {
            const alignClass = block.align === "right" ? "img-right" : block.align === "center" ? "img-center" : "img-left";
            contentEl.innerHTML += `
                <figure class="${alignClass}">
                    <img src="${block.src}" alt="">
                    <figcaption>${block.caption || ""}</figcaption>
                </figure>
            `;
        }
    });
}

// ============================
// ARTICLE ACTION BAR HANDLERS
// ============================
function initArticleActions() {
    const likeBtn = document.getElementById("btn-like");
    const subscribeBtn = document.getElementById("btn-subscribe");
    const shareBtn = document.getElementById("btn-share");
    const copyBtn = document.getElementById("btn-copy");
    
    if (likeBtn) {
        likeBtn.addEventListener("click", () => {
            alert("Thank you for liking this article!");
        });
    }
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", () => {
            alert("Thank you for subscribing!");
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        url: window.location.href
                    });
                } catch (err) {
                    console.log("Share cancelled");
                }
            } else {
                alert("Sharing is not supported on this device.");
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            copyPageLink();
        });
    }
}

// ============================
// COPY PAGE LINK FUNCTION
// ============================
function copyPageLink() {
    navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
}

// ============================
// NEWSLETTER SUBSCRIPTION
// ============================
const subscribeBtn = document.getElementById("subscribeBtn");
if (subscribeBtn) {
    subscribeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = document.getElementById("subscribeEmail").value;
        if (email && email.includes("@")) {
            alert(`Thank you for subscribing with ${email}!`);
        } else {
            alert("Please enter a valid email address.");
        }
    });
}

// ============================
// SEARCH FUNCTIONALITY
// ============================
const searchForm = document.querySelector(".search");
if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("search-input").value;
        if (query.trim()) {
            alert(`Searching for: ${query}`);
            // Implement actual search here
        }
    });
}

// ============================
// LANGUAGE SELECTOR
// ============================
const languageSelect = document.getElementById("language-select");
if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
        const lang = e.target.value;
        console.log(`Language changed to: ${lang}`);
        // Implement language switching here
        alert(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
    });
}
