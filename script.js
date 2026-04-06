/* ============================================================
   THE MIRROR JAMMU KASHMIR - COMPLETE SCRIPT
   FIXED: Read More, Vlogs, Calendar, Share Buttons, Pagination, Footer
   ============================================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing...");
    
    // Initialize all components
    initLoader();
    initYear();
    initClocks();
    initWeatherBar();
    initTicker();
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
    initShareTooltip();
    
    // Load homepage content from JSON
    loadHomepageContent();
    
    // Check current page and load appropriate content
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
    
    // Set up clock to update every second
    setInterval(updateClocks, 1000);
});

/* ============================
   LOADER
   ============================ */
function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) return;
    
    setTimeout(function() {
        loader.style.opacity = "0";
        setTimeout(function() {
            loader.style.display = "none";
        }, 300);
    }, 1500);
}

/* ============================
   FOOTER YEAR
   ============================ */
function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* ============================
   CLOCKS & CALENDARS - FIXED BIKRAMI
   ============================ */
function initClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    const zurichTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    const fullDate = now.toLocaleDateString("en-GB", options);
    const cestText = fullDate + " at " + zurichTime;
    
    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    const istHours = now.getHours();
    const istAmpm = istHours >= 12 ? 'pm' : 'am';
    const istFull = istTime + ' ' + istAmpm;
    
    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    const pktHours = now.getHours();
    const pktAmpm = pktHours >= 12 ? 'pm' : 'am';
    const pktFull = pktTime + ' ' + pktAmpm;
    
    // Get updated Bikrami date
    const bikramiDate = getBikramiDate();
    
    datetimeBar.innerHTML = `
        <span>${cestText}</span>
        <span class="separator">•</span>
        <span id="cal-hijri">${getHijriDate()}</span>
        <span class="separator">•</span>
        <span id="cal-bikrami">${bikramiDate}</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istFull}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktFull}</strong></span>
    `;
}

function getHijriDate() {
    try {
        const now = new Date();
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
        return hijriDate + " AH";
    } catch(e) {
        return "Ramadan, 1447 AH";
    }
}

/* ============================
   BIKRAMI (DESI PUNJABI) CALENDAR - FIXED
   ============================ */
function getBikramiDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-11
    const year = today.getFullYear();
    
    // Bikrami months in order
    const bikramiMonths = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];
    
    // Days of week in Punjabi/Desi
    const bikramiDays = [
        "Aitvaar", "Somvaar", "Mangalvaar", "Budhvaar", "Veervaar", "Shukarvaar", "Shanivaar"
    ];
    
    // Get day of week
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const dayName = bikramiDays[dayOfWeek];
    
    // Calculate Bikrami year and month
    let bikramiYear = year + 57;
    let bikramiMonth = 0;
    let bikramiDay = day;
    
    // Bikrami year starts around March 14-15 (Chet 1)
    if (month === 2) { // March
        if (day >= 14) {
            bikramiMonth = 0; // Chet
            bikramiYear = year + 57;
            bikramiDay = day - 13;
        } else {
            bikramiMonth = 11; // Phagun
            bikramiYear = year + 56;
            bikramiDay = day + 18;
        }
    }
    else if (month === 3) { // April
        bikramiMonth = 0; // Chet
        bikramiYear = year + 57;
        bikramiDay = day + 17;
        if (bikramiDay > 31) {
            bikramiDay = bikramiDay - 31;
            bikramiMonth = 1; // Vaisakh
        }
    }
    else if (month === 4) { // May
        bikramiMonth = 1; // Vaisakh
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 31) {
            bikramiDay = bikramiDay - 31;
            bikramiMonth = 2; // Jeth
        }
    }
    else if (month === 5) { // June
        bikramiMonth = 2; // Jeth
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 31) {
            bikramiDay = bikramiDay - 31;
            bikramiMonth = 3; // Harh
        }
    }
    else if (month === 6) { // July
        bikramiMonth = 3; // Harh
        bikramiYear = year + 57;
        bikramiDay = day + 17;
        if (bikramiDay > 31) {
            bikramiDay = bikramiDay - 31;
            bikramiMonth = 4; // Sawan
        }
    }
    else if (month === 7) { // August
        bikramiMonth = 4; // Sawan
        bikramiYear = year + 57;
        bikramiDay = day + 17;
        if (bikramiDay > 31) {
            bikramiDay = bikramiDay - 31;
            bikramiMonth = 5; // Bhadon
        }
    }
    else if (month === 8) { // September
        bikramiMonth = 5; // Bhadon
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 6; // Assu
        }
    }
    else if (month === 9) { // October
        bikramiMonth = 6; // Assu
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 7; // Kattak
        }
    }
    else if (month === 10) { // November
        bikramiMonth = 7; // Kattak
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 8; // Maghar
        }
    }
    else if (month === 11) { // December
        bikramiMonth = 8; // Maghar
        bikramiYear = year + 57;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 9; // Poh
        }
    }
    else if (month === 0) { // January
        bikramiMonth = 9; // Poh
        bikramiYear = year + 56;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 10; // Magh
        }
    }
    else if (month === 1) { // February
        bikramiMonth = 10; // Magh
        bikramiYear = year + 56;
        bikramiDay = day + 16;
        if (bikramiDay > 30) {
            bikramiDay = bikramiDay - 30;
            bikramiMonth = 11; // Phagun
        }
    }
    
    // Ensure day is within valid range
    if (bikramiDay < 1) bikramiDay = 1;
    if (bikramiDay > 31) bikramiDay = 31;
    
    const monthName = bikramiMonths[bikramiMonth];
    
    return dayName + ", " + bikramiDay + " " + monthName + " " + bikramiYear + " VS";
}

/* ============================
   WEATHER BAR
   ============================ */
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    const cities = [
        { name: "Zurich", temp: "6°C" },
        { name: "Rawalakot", temp: "9°C" },
        { name: "Jammu", temp: "18°C" },
        { name: "Kashmir", temp: "4°C" },
        { name: "Ladakh", temp: "-2°C" },
        { name: "Gilgit", temp: "3°C" },
        { name: "Baltistan", temp: "-1°C" },
        { name: "Muzaffarabad", temp: "10°C" }
    ];
    
    let html = '';
    cities.forEach(function(c, index) {
        html += '<span>' + c.name + ': <strong>' + c.temp + '</strong></span>';
        if (index < cities.length - 1) {
            html += '<span class="separator">•</span>';
        }
    });
    
    bar.innerHTML = html;
}

/* ============================
   TICKER
   ============================ */
const TICKER_ITEMS = [
    "THE MIRROR JAMMU KASHMIR --- AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH, JUSTICE AND HUMAN DIGNITY",
    "WE CHALLENGE SILENCE, EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES",
    "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR",
    "HOPE BECOMES REAL THROUGH ACTION, PERSISTENCE AND PRINCIPLED JOURNALISM",
    "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS --- UDHR ARTICLE 1",
    "EQUALITY WITHOUT DISCRIMINATION IS A RIGHT, NOT A PRIVILEGE",
    "DEMOCRACY DERIVES LEGITIMACY FROM THE WILL AND PARTICIPATION OF THE PEOPLE",
    "DEMOCRACY CANNOT SURVIVE WHERE HUMAN RIGHTS ARE VIOLATED OR POPULATIONS EXCLUDED"
];

function initTicker() {
    const tickerItems = document.getElementById("ticker-items");
    if (!tickerItems) return;
    
    let html = '';
    for (let i = 0; i < 2; i++) {
        TICKER_ITEMS.forEach(function(item) {
            html += '<span>' + item + ' • </span>';
        });
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
        const scrolled = (window.scrollY / windowHeight) * 100;
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
    
    if (!hamburger || !navList || !mobileMenu) return;
    
    hamburger.addEventListener("click", function() {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        mobileMenu.hidden = expanded;
        
        if (!expanded) {
            mobileMenu.innerHTML = navList.innerHTML;
        }
    });
    
    // Dropdown handling for desktop
    const dropdowns = document.querySelectorAll(".has-sub");
    dropdowns.forEach(function(item) {
        const btn = item.querySelector(".nav-btn");
        const dropdown = item.querySelector(".dropdown");
        
        if (btn && dropdown) {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                document.querySelectorAll(".dropdown").forEach(function(d) {
                    if (d !== dropdown) d.style.display = "none";
                });
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
        }
    });
    
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".has-sub")) {
            document.querySelectorAll(".dropdown").forEach(function(d) {
                d.style.display = "none";
            });
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
    
    if (!openBtn || !closeBtn || !modal) return;
    
    openBtn.addEventListener("click", function() {
        modal.classList.remove("hidden");
    });
    
    closeBtn.addEventListener("click", function() {
        modal.classList.add("hidden");
    });
    
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            modal.classList.add("hidden");
        });
    }
    
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("contact-name")?.value || '';
            const email = document.getElementById("contact-email")?.value || '';
            const message = document.getElementById("contact-message")?.value || '';
            
            if (name && email && message) {
                alert("Thank you for your message! We will get back to you soon.");
                modal.classList.add("hidden");
                contactForm.reset();
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
}

/* ============================
   VLOGS - LOAD FROM YOUTUBE JSON
   ============================ */
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    const visitBtn = document.getElementById("vlog-visit-channel");
    
    if (!grid) return;
    
    // Load from YouTube JSON
    fetch("content/youtube.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("YouTube JSON not found");
        })
        .then(function(data) {
            console.log("YouTube JSON loaded:", data);
            if (visitBtn && data.channel && data.channel.url) {
                visitBtn.addEventListener("click", function() {
                    window.open(data.channel.url, "_blank");
                });
                visitBtn.style.display = 'inline-block';
            }
            
            const videos = data.videos || [];
            renderVlogs(videos);
        })
        .catch(function(error) {
            console.log("YouTube JSON not found, using fallback", error);
            if (visitBtn) {
                visitBtn.style.display = 'none';
            }
            renderVlogsFallback();
        });
}

function renderVlogs(videos) {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    if (!videos || videos.length === 0) {
        renderVlogsFallback();
        return;
    }
    
    let html = '';
    videos.forEach(function(v) {
        const thumb = v.youtubeId ? 
            'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg' : 
            'https://via.placeholder.com/640x360?text=Video';
        
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title || 'Video'}" onerror="this.src='https://via.placeholder.com/640x360?text=Video'">
                    <div class="vlog-play-icon" onclick="playVideo('${v.youtubeId}')">▶</div>
                    <div class="vlog-duration">${v.duration || '00:00'}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title || 'Video'}</h3>
                    <p>${v.description || ''}</p>
                </div>
            </article>
        `;
    });
    
    grid.innerHTML = html;
}

function renderVlogsFallback() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    const fallbackVlogs = [
        { title: "Exclusive Interview | The Mirror Jammu Kashmir", description: "In-depth interview on peace, justice, and human rights.", duration: "15:32", youtubeId: "yEnXu1M-dlo" },
        { title: "Ground Report | Community Voices", description: "Voices from the ground. Real stories. Real people.", duration: "12:45", youtubeId: "hr1ATz8E39M" },
        { title: "Analysis | Human Rights Framework", description: "Legal and political analysis of ongoing human rights issues.", duration: "18:20", youtubeId: "pOEQeRhYbec" }
    ];
    
    let html = '';
    fallbackVlogs.forEach(function(v) {
        const thumb = 'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg';
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="${thumb}" alt="${v.title}" onerror="this.src='https://via.placeholder.com/640x360?text=Video'">
                    <div class="vlog-play-icon" onclick="playVideo('${v.youtubeId}')">▶</div>
                    <div class="vlog-duration">${v.duration}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>${v.description}</p>
                </div>
            </article>
        `;
    });
    
    grid.innerHTML = html;
}

function playVideo(youtubeId) {
    if (youtubeId) {
        window.open('https://www.youtube.com/watch?v=' + youtubeId, '_blank');
    }
}

/* ============================
   LANGUAGE SELECTOR
   ============================ */
function initLanguageSelector() {
    const select = document.getElementById("language-select");
    if (!select) return;
    
    select.addEventListener("change", function(e) {
        alert("Language changed to " + e.target.options[e.target.selectedIndex].text);
    });
}

/* ============================
   SEARCH
   ============================ */
function initSearch() {
    const searchForm = document.querySelector(".search");
    const searchInput = document.getElementById("search-input");
    
    if (!searchForm || !searchInput) return;
    
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (searchInput.value.trim()) {
            alert("Searching for: " + searchInput.value.trim());
        }
    });
}

/* ============================
   SOCIAL BUTTONS
   ============================ */
function initSocialButtons() {
    const buttons = document.querySelectorAll(".sa-btn");
    
    buttons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            const text = btn.textContent.trim();
            
            if (text.includes("Like")) {
                alert("Thank you for liking!");
            } else if (text.includes("Subscribe")) {
                const email = prompt("Enter your email to subscribe:", "your@email.com");
                if (email && email.includes('@') && email.includes('.')) {
                    alert("Thank you for subscribing!");
                } else if (email) {
                    alert("Please enter a valid email address.");
                }
            } else if (text.includes("Share")) {
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: window.location.href
                    }).catch(function() {});
                } else {
                    alert("Share this page: " + window.location.href);
                }
            }
        });
    });
}

/* ============================
   COPY LINK
   ============================ */
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(function() {
            alert("Link copied to clipboard!");
        })
        .catch(function() {
            alert("Failed to copy link");
        });
}

/* ============================
   FILE UPLOAD
   ============================ */
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const fileNameSpan = document.querySelector(".file-name");
    
    if (!fileInput || !fileNameSpan) return;
    
    fileInput.addEventListener("change", function() {
        fileNameSpan.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : "No file chosen";
    });
    
    const uploadForm = document.querySelector(".epaper-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", function(e) {
            e.preventDefault();
            if (fileInput.files.length > 0) {
                alert("File '" + fileInput.files[0].name + "' ready for upload.");
            } else {
                alert("Please select a file first.");
            }
        });
    }
}

/* ============================
   NEWSLETTER
   ============================ */
function initNewsletter() {
    const subscribeBtn = document.getElementById("subscribeBtn");
    const emailInput = document.getElementById("subscribeEmail");
    
    if (!subscribeBtn || !emailInput) return;
    
    subscribeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        
        if (email && email.includes("@") && email.includes(".")) {
            alert("Thank you for subscribing!");
            emailInput.value = "";
        } else {
            alert("Please enter a valid email address.");
        }
    });
}

/* ============================
   FOOTER DROPDOWNS - FIXED WITH CENTERED TEXT
   ============================ */
function initFooterDropdowns() {
    updateFooterContent();
    
    const sections = document.querySelectorAll('.footer-section');
    sections.forEach(function(section, index) {
        const heading = section.querySelector('h4');
        if (!heading) return;
        
        heading.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            section.classList.toggle('open');
        });
    });
}

function updateFooterContent() {
    const footerContent = document.querySelector('.footer-content');
    if (!footerContent) return;
    
    footerContent.innerHTML = `
        <div class="footer-section">
            <h4 style="text-align: center;">THE MIRROR JAMMU KASHMIR</h4>
            <p style="text-align: center; max-width: 90%; margin: 0 auto;">
                THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, TO POLICY, TO HISTORY, AND TO TRUTH.
            </p>
        </div>
        <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="#top-stories">Top Stories</a></li>
                <li><a href="#vlogs">Vlogs</a></li>
                <li><a href="#international">International</a></li>
                <li><a href="#human-rights">Human Rights</a></li>
                <li><a href="about.html">About Us</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>Contact</h4>
            <p>themirrorjk@gmail.com</p>
            <p>+41 783 13 12 13</p>
        </div>
        <div class="footer-section">
            <h4>Follow</h4>
            <div class="social-icons">
                <a href="#" class="social-icon">📘</a>
                <a href="#" class="social-icon">🐦</a>
                <a href="#" class="social-icon">📷</a>
                <a href="#" class="social-icon">▶️</a>
            </div>
        </div>
    `;
}

/* ============================
   SHARE TOOLTIP
   ============================ */
function initShareTooltip() {
    const shareBtn = document.getElementById('btn-share');
    const tooltip = document.getElementById('share-tooltip');
    
    if (!shareBtn || !tooltip) return;
    
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        tooltip.classList.toggle('show');
    });
    
    document.addEventListener('click', function(e) {
        if (!tooltip.contains(e.target) && e.target !== shareBtn) {
            tooltip.classList.remove('show');
        }
    });
    
    tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    updateShareLinks();
}

function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    const platforms = {
        'share-facebook': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        'share-twitter': `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        'share-whatsapp': `https://api.whatsapp.com/send?text=${title}%20${url}`,
        'share-linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        'share-telegram': `https://t.me/share/url?url=${url}&text=${title}`,
        'share-reddit': `https://www.reddit.com/submit?url=${url}&title=${title}`,
        'share-pinterest': `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
        'share-email': `mailto:?subject=${title}&body=Check this article: ${decodeURIComponent(url)}`
    };
    
    for (const [id, href] of Object.entries(platforms)) {
        const link = document.getElementById(id);
        if (link) {
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    }
}

/* ============================
   HOMEPAGE CONTENT LOADER
   ============================ */
function loadHomepageContent() {
    fetch("content/index.json")
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Index JSON not found");
        })
        .then(function(index) {
            console.log("Index loaded:", index);
            
            if (index.topStories) {
                loadTopStories([index.topStories.lead, index.topStories.breaking, index.topStories.opinion]);
            } else {
                loadTopStoriesFallback();
            }
            
            if (index.latestEditorialHistorical) {
                loadLehSection([index.latestEditorialHistorical.latest, index.latestEditorialHistorical.editorial, index.latestEditorialHistorical.historical]);
            } else {
                loadLehFallback();
            }
            
            if (index.jammuKashmir) {
                loadJammuKashmir(Array.isArray(index.jammuKashmir) ? index.jammuKashmir : [index.jammuKashmir.first, index.jammuKashmir.second]);
            } else {
                loadJammuKashmirFallback();
            }
            
            if (index.international) {
                loadInternational(Array.isArray(index.international) ? index.international : [index.international.first, index.international.second]);
            } else {
                loadInternationalFallback();
            }
            
            if (index.humanRights) {
                loadHumanRights(Array.isArray(index.humanRights) ? index.humanRights : [index.humanRights.first, index.humanRights.second]);
            } else {
                loadHumanRightsFallback();
            }
        })
        .catch(function(error) {
            console.log("Index JSON not found, using fallback", error);
            loadAllFallback();
        });
}

function loadAllFallback() {
    loadTopStoriesFallback();
    loadLehFallback();
    loadJammuKashmirFallback();
    loadInternationalFallback();
    loadHumanRightsFallback();
}

/* ============================
   LOAD TOP STORIES
   ============================ */
function loadTopStories(ids) {
    const grid = document.getElementById("top-stories-grid");
    if (!grid) return;
    
    Promise.all(ids.map(function(id) {
        if (!id) return Promise.resolve(null);
        return fetch("content/" + id + ".json").then(function(r) {
            if (r.ok) return r.json();
            return null;
        }).catch(function() { return null; });
    })).then(function(articles) {
        let html = '';
        let hasContent = false;
        
        articles.forEach(function(article) {
            if (article) {
                let processed = article;
                if (article.items && Array.isArray(article.items) && article.items.length > 0) processed = article.items[0];
                else if (Array.isArray(article) && article.length > 0) processed = article[0];
                html += createHomepageCard(processed);
                hasContent = true;
            }
        });
        
        grid.innerHTML = hasContent ? html : loadTopStoriesFallbackHTML();
    });
}

function loadTopStoriesFallback() {
    const grid = document.getElementById("top-stories-grid");
    if (grid) grid.innerHTML = loadTopStoriesFallbackHTML();
}

function loadTopStoriesFallbackHTML() {
    return `
        <article class="card">
            <div class="media"><img src="https://via.placeholder.com/640x360?text=Rawalakot+Protest" alt="Rawalakot Protest"></div>
            <div class="card-body"><h3>Complete Shutter Down Paralyses Rawalakot Poonch</h3><p>Thousands shut down Rawalakot in protest against prolonged electricity outages...</p><a href="article.html?id=article-001" class="btn-red">Read More →</a></div>
        </article>
        <article class="card">
            <div class="media"><img src="https://via.placeholder.com/640x360?text=UKPNP+Delegation" alt="UKPNP Delegation"></div>
            <div class="card-body"><h3>UKPNP Delegation Meets Baroness Emma Nicholson</h3><p>A high level UKPNP delegation met Baroness Emma Nicholson in London...</p><a href="article.html?id=breaking-001" class="btn-red">Read More →</a></div>
        </article>
        <article class="card">
            <div class="media"><img src="https://via.placeholder.com/640x360?text=British+MPs" alt="British MPs"></div>
            <div class="card-body"><h3>UKPNP Delegation Briefs British MPs</h3><p>A high level delegation briefed British MPs on the Kashmir conflict...</p><a href="article.html?id=blog-001" class="btn-red">Read More →</a></div>
        </article>
    `;
}

/* ============================
   LOAD LEH SECTION
   ============================ */
function loadLehSection(ids) {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    Promise.all(ids.map(function(id) {
        if (!id) return Promise.resolve(null);
        return fetch("content/" + id + ".json").then(function(r) {
            if (r.ok) return r.json();
            return null;
        }).catch(function() { return null; });
    })).then(function(articles) {
        let html = '';
        const labels = ["LATEST", "EDITORIAL", "HISTORICAL"];
        
        articles.forEach(function(article, index) {
            if (article) {
                let processed = article;
                if (article.items && Array.isArray(article.items) && article.items.length > 0) processed = article.items[0];
                else if (Array.isArray(article) && article.length > 0) processed = article[0];
                html += createHomepageCard(processed, labels[index]);
            } else {
                html += createEmptyCard(labels[index]);
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadLehFallback() {
    const grid = document.getElementById("leh-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Latest+News" alt="Latest News"></div><div class="card-body"><h3>LATEST</h3><p>Latest news and updates will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Editorial" alt="Editorial"></div><div class="card-body"><h3>EDITORIAL</h3><p>Editorial content and opinions will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Historical" alt="Historical"></div><div class="card-body"><h3>HISTORICAL</h3><p>Historical analysis and articles will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
    `;
}

/* ============================
   LOAD JAMMU KASHMIR
   ============================ */
function loadJammuKashmir(ids) {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    Promise.all(ids.map(function(id) {
        if (!id) return Promise.resolve(null);
        return fetch("content/" + id + ".json").then(function(r) {
            if (r.ok) return r.json();
            return null;
        }).catch(function() { return null; });
    })).then(function(articles) {
        let html = '';
        
        articles.forEach(function(article) {
            if (article) {
                let processed = article;
                if (article.items && Array.isArray(article.items) && article.items.length > 0) processed = article.items[0];
                else if (Array.isArray(article) && article.length > 0) processed = article[0];
                html += createHomepageCard(processed, "JK");
            } else {
                html += createEmptyCard("JK");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadJammuKashmirFallback() {
    const grid = document.getElementById("jk-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Jammu+Region" alt="Jammu Region"></div><div class="card-body"><h3>Jammu Region</h3><p>News from Jammu region will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Kashmir+Valley" alt="Kashmir Valley"></div><div class="card-body"><h3>Kashmir Valley</h3><p>News from Kashmir valley will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
    `;
}

/* ============================
   LOAD INTERNATIONAL
   ============================ */
function loadInternational(ids) {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    Promise.all(ids.map(function(id) {
        if (!id) return Promise.resolve(null);
        return fetch("content/" + id + ".json").then(function(r) {
            if (r.ok) return r.json();
            return null;
        }).catch(function() { return null; });
    })).then(function(articles) {
        let html = '';
        
        articles.forEach(function(article) {
            if (article) {
                let processed = article;
                if (article.items && Array.isArray(article.items) && article.items.length > 0) processed = article.items[0];
                else if (Array.isArray(article) && article.length > 0) processed = article[0];
                html += createHomepageCard(processed, "INTL");
            } else {
                html += createEmptyCard("INTL");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadInternationalFallback() {
    const grid = document.getElementById("intl-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=International+News" alt="International News"></div><div class="card-body"><h3>International News</h3><p>Global headlines will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=World+Affairs" alt="World Affairs"></div><div class="card-body"><h3>World Affairs</h3><p>World news will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
    `;
}

/* ============================
   LOAD HUMAN RIGHTS
   ============================ */
function loadHumanRights(ids) {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    Promise.all(ids.map(function(id) {
        if (!id) return Promise.resolve(null);
        return fetch("content/" + id + ".json").then(function(r) {
            if (r.ok) return r.json();
            return null;
        }).catch(function() { return null; });
    })).then(function(articles) {
        let html = '';
        
        articles.forEach(function(article) {
            if (article) {
                let processed = article;
                if (article.items && Array.isArray(article.items) && article.items.length > 0) processed = article.items[0];
                else if (Array.isArray(article) && article.length > 0) processed = article[0];
                html += createHomepageCard(processed, "HR");
            } else {
                html += createEmptyCard("HR");
            }
        });
        
        grid.innerHTML = html;
    });
}

function loadHumanRightsFallback() {
    const grid = document.getElementById("hr-grid");
    if (!grid) return;
    
    grid.innerHTML = `
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=Human+Rights" alt="Human Rights"></div><div class="card-body"><h3>Human Rights</h3><p>Human rights updates will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
        <article class="card"><div class="media"><img src="https://via.placeholder.com/640x360?text=UNHRC" alt="UNHRC"></div><div class="card-body"><h3>UNHRC Updates</h3><p>UNHRC developments will appear here.</p><a href="#" class="btn-red">Read More →</a></div></article>
    `;
}

/* ============================
CREATE HOMEPAGE CARD - FIXED
============================ */
function createHomepageCard(article, label) {
    if (!article) return '';
    
    console.log("Creating card for:", article.id, article.title);
    
    const title = article.title || 'Untitled';
    const excerpt = article.excerpt || article.summary || 'Click to read more about this story.';
    
    // Get hero image - MULTIPLE FALLBACKS
    let image = 'https://via.placeholder.com/640x360?text=No+Image';
    
    if (article.heroImage) {
        if (typeof article.heroImage === 'string') {
            image = article.heroImage;
        } else if (article.heroImage.src) {
            image = article.heroImage.src;
        }
    }
    
    // If still no image, try article.image
    if (image === 'https://via.placeholder.com/640x360?text=No+Image' && article.image) {
        image = article.image;
    }
    
    // Fix relative paths
    if (image && image.startsWith('content/')) {
        image = image;
    } else if (image && !image.startsWith('http') && !image.startsWith('/')) {
        image = 'content/images/' + image.split('/').pop();
    }
    
    console.log("Final image path:", image);
    
    const id = article.id || '';
    let displayTitle = title.length > 80 ? title.substring(0, 80) + '...' : title;
    let displayExcerpt = excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt;
    
    return `
        <article class="card">
            <div class="media">
                <img src="${image}" alt="${displayTitle}" onerror="this.src='https://via.placeholder.com/640x360?text=News'">
            </div>
            <div class="card-body">
                <h3>${displayTitle}</h3>
                <p>${displayExcerpt}</p>
                <a href="article.html?id=${id}" class="btn-red">Read More →</a>
            </div>
        </article>
    `;
}

/* ============================
   ABOUT PAGE LOADER
   ============================ */
function loadAboutPage() {
    fetch("content/about.json").then(function(response) {
        if (response.ok) return response.json();
        throw new Error("About content not found");
    }).then(function(data) {
        renderAboutPage(data);
    }).catch(function(error) {
        console.error("Failed to load about page:", error);
        const aboutTitle = document.getElementById("about-title");
        const aboutContent = document.getElementById("about-content");
        if (aboutTitle) aboutTitle.innerHTML = "About content coming soon";
        if (aboutContent) {
            aboutContent.innerHTML = '<div style="text-align:center; padding:50px;"><h2>About content coming soon</h2><a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a></div>';
        }
    });
}

function renderAboutPage(data) {
    document.title = (data.title || "About") + " | THE MIRROR JAMMU KASHMIR";
    const titleEl = document.getElementById("about-title");
    const subtitleEl = document.getElementById("about-subtitle");
    const metaEl = document.getElementById("about-meta");
    const contentEl = document.getElementById("about-content");
    
    if (titleEl) titleEl.textContent = data.title || "About The Mirror Jammu Kashmir";
    if (subtitleEl) subtitleEl.textContent = data.subtitle || "";
    
    if (metaEl && data.date) {
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
        metaEl.innerHTML = `<strong>${data.location || 'Switzerland'}</strong> --- ${formattedDate}<br>By <em>${data.author || 'Editorial Desk'}</em> · ${data.readTime || ''}`;
    }
    
    if (contentEl && data.body) {
        let html = '';
        data.body.forEach(function(block, index) {
            if (block.type === "paragraph") {
                if (index === 0 && data.heroImage) {
                    const alignClass = data.heroImage.align === "left" ? "img-left" : "img-right";
                    html += `<p><figure class="${alignClass}"><img src="${data.heroImage.src}" alt="${data.heroImage.caption || 'Logo'}"><figcaption>${data.heroImage.caption || ''}</figcaption></figure>${block.text}</p>`;
                } else {
                    html += '<p>' + block.text + '</p>';
                }
            } else if (block.type === "subheading") {
                html += '<h2 class="mid-subheading">' + block.text + '</h2>';
            } else if (block.type === "pullquote") {
                html += '<div class="pull-quote">' + block.text + '</div>';
            } else if (block.type === "points" && block.items) {
                let itemsHtml = '<div class="important-points"><ul>';
                block.items.forEach(item => { itemsHtml += '<li>' + item + '</li>'; });
                itemsHtml += '</ul></div>';
                html += itemsHtml;
            } else if (block.type === "image" && block.src) {
                const alignClass = block.align === "left" ? "img-left" : (block.align === "right" ? "img-right" : "img-center");
                html += `<figure class="${alignClass}"><img src="${block.src}" alt="${block.caption || 'Image'}"><figcaption>${block.caption || ''} ${block.credit ? '--- ' + block.credit : ''}</figcaption></figure>`;
            }
        });
        contentEl.innerHTML = html;
    }
}

/* ============================
   CHIEF EDITOR PAGE LOADER
   ============================ */
function loadChiefEditorPage() {
    fetch("content/chief-editor.json").then(function(response) {
        if (response.ok) return response.json();
        throw new Error("Chief Editor content not found");
    }).then(function(data) {
        renderChiefEditorPage(data);
    }).catch(function(error) {
        console.error("Failed to load chief editor page:", error);
        const editorTitle = document.getElementById("editor-title");
        const editorContent = document.getElementById("editor-content");
        if (editorTitle) editorTitle.innerHTML = "Chief Editor content coming soon";
        if (editorContent) {
            editorContent.innerHTML = '<div style="text-align:center; padding:50px;"><h2>Chief Editor content coming soon</h2><a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a></div>';
        }
    });
}

function renderChiefEditorPage(data) {
    document.title = (data.title || "Chief Editor") + " | THE MIRROR JAMMU KASHMIR";
    const titleEl = document.getElementById("editor-title");
    const metaEl = document.getElementById("editor-meta");
    const contentEl = document.getElementById("editor-content");
    
    if (titleEl) titleEl.textContent = data.title || "Chief Editor";
    if (metaEl && data.date) {
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
        metaEl.innerHTML = `<strong>${data.location || 'Switzerland'}</strong> --- ${formattedDate}<br>By <em>${data.author || 'Editorial Desk'}</em> · ${data.readTime || ''}`;
    }
    
    if (contentEl && data.body) {
        let html = '';
        data.body.forEach(function(block, index) {
            if (block.type === "paragraph") {
                if (index === 0 && data.heroImage) {
                    const alignClass = data.heroImage.align === "left" ? "img-left" : "img-right";
                    html += `<p><figure class="${alignClass}"><img src="${data.heroImage.src}" alt="${data.heroImage.caption || 'Chief Editor'}"><figcaption>${data.heroImage.caption || ''}</figcaption></figure>${block.text}</p>`;
                } else {
                    html += '<p>' + block.text + '</p>';
                }
            } else if (block.type === "subheading") {
                html += '<h2 class="mid-subheading">' + block.text + '</h2>';
            } else if (block.type === "pullquote") {
                html += '<div class="pull-quote">' + block.text + '</div>';
            } else if (block.type === "points" && block.items) {
                let itemsHtml = '<div class="important-points"><ul>';
                block.items.forEach(item => { itemsHtml += '<li>' + item + '</li>'; });
                itemsHtml += '</ul></div>';
                html += itemsHtml;
            } else if (block.type === "image" && block.src) {
                const alignClass = block.align === "left" ? "img-left" : (block.align === "right" ? "img-right" : "img-center");
                html += `<figure class="${alignClass}"><img src="${block.src}" alt="${block.caption || 'Image'}"><figcaption>${block.caption || ''} ${block.credit ? '--- ' + block.credit : ''}</figcaption></figure>`;
            }
        });
        contentEl.innerHTML = html;
    }
}

/* ============================
   HISTORICAL PAGE LOADER
   ============================ */
function loadHistoricalPage() {
    fetch("content/historical-001.json").then(function(response) {
        if (response.ok) return response.json();
        throw new Error("Historical content not found");
    }).then(function(data) {
        renderHistoricalPage(data);
    }).catch(function(error) {
        console.error("Failed to load historical page:", error);
        document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>Historical content coming soon</h2><a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a></div>';
    });
}

function renderHistoricalPage(data) {
    document.title = (data.title || "Historical") + " | THE MIRROR JAMMU KASHMIR";
    const titleEl = document.getElementById("historical-title");
    const metaEl = document.getElementById("historical-meta");
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    const heroWrap = document.getElementById("heroWrap");
    const contentEl = document.getElementById("historical-content");
    
    if (titleEl) titleEl.textContent = data.title || "Historical Article";
    
    if (metaEl && data.date) {
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
        metaEl.innerHTML = `<strong>${data.location || 'Geneva'}</strong> --- ${formattedDate}<br>By <em>${data.author || 'Editorial Desk'}</em> · ${data.readTime || ''}`;
    }
    
    if (data.heroImage && data.heroImage.src && heroImg) {
        let imageSrc = data.heroImage.src;
        if (imageSrc.includes('github.com') && !imageSrc.includes('raw')) {
            imageSrc = imageSrc.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
        heroImg.src = imageSrc;
        heroImg.alt = data.heroImage.caption || '';
        if (heroCaption) heroCaption.textContent = data.heroImage.caption || '';
        if (heroWrap) heroWrap.style.display = 'block';
    } else if (heroWrap) {
        heroWrap.style.display = 'none';
    }
    
    if (contentEl && data.body) {
        let html = '';
        data.body.forEach(function(block) {
            if (block.type === "paragraph") {
                html += '<p>' + block.text + '</p>';
            } else if (block.type === "subheading") {
                html += '<h2>' + block.text + '</h2>';
            } else if (block.type === "pullquote") {
                html += '<div class="pull-quote">' + block.text + '</div>';
            } else if (block.type === "points" && block.items) {
                let itemsHtml = '<div class="important-points"><ul>';
                block.items.forEach(item => { itemsHtml += '<li>' + item + '</li>'; });
                itemsHtml += '</ul></div>';
                html += itemsHtml;
            } else if (block.type === "image" && block.src) {
                let imageSrc = block.src;
                if (imageSrc.includes('github.com') && !imageSrc.includes('raw')) {
                    imageSrc = imageSrc.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                }
                const alignClass = block.align === "left" ? "float-left" : "float-right";
                html += `<figure class="${alignClass}"><img src="${imageSrc}" alt="${block.caption || ''}"><figcaption>${block.caption || ''}</figcaption></figure>`;
            }
        });
        contentEl.innerHTML = html;
    }
}

/* ============================
   ARTICLE PAGE INITIALIZATION
   ============================ */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) {
        document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>No article specified</h2><a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a></div>';
        return;
    }
    
    const pathsToTry = [
        "content/" + id + ".json",
        "./content/" + id + ".json",
        "/content/" + id + ".json",
        id + ".json"
    ];
    
    tryLoadArticle(pathsToTry, 0, id);
}

function tryLoadArticle(paths, index, id) {
    if (index >= paths.length) {
        console.error("All paths failed for article:", id);
        document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>Article not found: ' + id + '</h2><a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a></div>';
        return;
    }
    
    const path = paths[index];
    console.log("Trying path:", path);
    
    fetch(path)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to load from " + path);
        })
        .then(function(data) {
            console.log("Raw data loaded:", data);
            
            let article = data;
            if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                article = data.items[0];
            } else if (Array.isArray(data) && data.length > 0) {
                article = data[0];
            }
            
            console.log("Processed article:", article);
            
            // Update meta tags for social sharing BEFORE rendering
            updateSocialMetaTags(article);
            
            renderFullArticlePage(article);
            initShareTooltip();
        })
        .catch(function(error) {
            console.error("Error loading from", path, ":", error);
            tryLoadArticle(paths, index + 1, id);
        });
}

/* ============================
   RENDER FULL ARTICLE PAGE
   ============================ */
function renderFullArticlePage(article) {
    console.log("Rendering article:", article.title);
    
    // Hide loading, show content
    const loadingDiv = document.getElementById('loading-state');
    if (loadingDiv) loadingDiv.style.display = 'none';
    
    const contentDiv = document.getElementById('content');
    if (contentDiv) contentDiv.style.display = 'block';
    
    // Set page title
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = (article.title || "Article") + " | THE MIRROR JAMMU KASHMIR";
    }
    
    // Set section label
    const sectionLabel = document.getElementById("section-label");
    if (sectionLabel) {
        sectionLabel.textContent = article.sectionLabel || article.category || "ARTICLE";
    }
    
    // Set title
    const titleEl = document.getElementById("title");
    if (titleEl) {
        titleEl.textContent = article.title || "Untitled";
    }
    
    // Set meta information
    const metaEl = document.getElementById("meta");
    if (metaEl) {
        let metaHtml = '';
        
        if (article.location) {
            metaHtml += '<strong>' + article.location + '</strong>';
        }
        
        if (article.date) {
            const dateObj = new Date(article.date);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            metaHtml += (metaHtml ? ' — ' : '') + formattedDate;
        }
        
        if (article.author) {
            metaHtml += '<br>By <em>' + article.author + '</em>';
        }
        
        if (article.readTime) {
            metaHtml += ' · ' + article.readTime;
        }
        
        metaEl.innerHTML = metaHtml;
    }
    
    // Set hero image
    const heroWrap = document.getElementById("heroWrap");
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");
    
    if (article.heroImage && article.heroImage.src && heroImg) {
        let imageSrc = article.heroImage.src;
        
        if (imageSrc.startsWith('/')) imageSrc = imageSrc.substring(1);
        if (!imageSrc.startsWith('http') && !imageSrc.startsWith('content/images/')) {
            imageSrc = 'content/images/' + imageSrc.split('/').pop();
        }
        
        heroImg.src = imageSrc;
        heroImg.alt = article.heroImage.caption || article.title || '';
        heroImg.onerror = function() {
            this.onerror = null;
            this.src = 'https://via.placeholder.com/1280x720?text=' + encodeURIComponent(article.title?.charAt(0) || 'J');
        };
        
        if (heroCaption) heroCaption.textContent = article.heroImage.caption || '';
        if (heroWrap) heroWrap.style.display = 'block';
    } else if (heroWrap) {
        heroWrap.style.display = 'none';
    }
    
    // Render body content
    const contentEl = document.getElementById("content");
    if (!contentEl) return;
    contentEl.innerHTML = '';
    
    if (article.body && Array.isArray(article.body) && article.body.length > 0) {
        article.body.forEach(function(block) {
            if (block.type === "paragraph") {
                contentEl.innerHTML += '<p>' + (block.text || '') + '</p>';
            }
            else if (block.type === "header") {
                contentEl.innerHTML += '<h2 class="mid-subheading" style="font-size: 1.8rem; color: #b30000; margin: 2rem 0 1.5rem;">' + (block.text || '') + '</h2>';
            }
            else if (block.type === "subheading") {
                contentEl.innerHTML += '<h2 class="mid-subheading">' + (block.text || '') + '</h2>';
            }
            else if (block.type === "pullquote") {
                contentEl.innerHTML += '<div class="pull-quote">' + (block.text || '') + '</div>';
            }
            else if (block.type === "points" && block.items) {
                let listHtml = '<div class="important-points"><ul>';
                block.items.forEach(function(item) {
                    listHtml += '<li>' + item + '</li>';
                });
                listHtml += '</ul></div>';
                contentEl.innerHTML += listHtml;
            }
            else if (block.type === "image" && block.src) {
                let imageSrc = block.src;
                
                if (imageSrc.startsWith('/')) imageSrc = imageSrc.substring(1);
                if (!imageSrc.startsWith('http') && !imageSrc.startsWith('content/images/')) {
                    imageSrc = 'content/images/' + imageSrc.split('/').pop();
                }
                
                const alignClass = block.align === "right" ? "img-right" :
                                   block.align === "left" ? "img-left" : "img-center";
                
                let captionText = block.caption || '';
                if (block.credit && !captionText.includes(block.credit)) {
                    captionText += captionText ? ' — ' + block.credit : block.credit;
                }
                
                contentEl.innerHTML += `
                    <figure class="${alignClass}">
                        <img src="${imageSrc}" alt="${block.caption || 'Image'}" onerror="this.src='https://via.placeholder.com/640x360?text=Image'">
                        ${captionText ? '<figcaption>' + captionText + '</figcaption>' : ''}
                    </figure>
                `;
            }
        });
    } else {
        contentEl.innerHTML = '<p>No content available for this article.</p>';
    }
    
    // Add Read More section
    if (article.readMore && article.readMore.trim() !== '') {
        const readMoreSection = document.createElement('div');
        readMoreSection.className = 'read-more-section';
        readMoreSection.innerHTML = `
            <h3 class="read-more-title">Read More</h3>
            <div class="read-more-content">
                ${article.readMore}
            </div>
        `;
        contentEl.appendChild(readMoreSection);
    }
    
    // Add article action buttons
    addArticleActionButtons(article);
    
    // Add article pagination
    addArticlePagination(article);
    
    // Suggest next article
    suggestNextArticle(article.id);
}

/* ============================
   ADD ARTICLE ACTION BUTTONS
   ============================ */
function addArticleActionButtons(article) {
    let actionsDiv = document.querySelector('.article-actions-bottom');
    
    if (!actionsDiv) {
        const contentEl = document.getElementById("content");
        if (contentEl && contentEl.parentNode) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'article-actions-bottom';
            contentEl.parentNode.insertBefore(actionsDiv, contentEl.nextSibling);
        }
    }
    
    if (actionsDiv) {
        const articleId = article.id || window.location.search;
        const storageKey = 'article-likes-' + articleId;
        let likes = localStorage.getItem(storageKey) || 0;
        
        actionsDiv.innerHTML = `
            <div class="article-action-buttons">
                <button id="article-like-btn" class="action-btn">👍 Like <span id="article-like-count">${likes ? ' (' + likes + ')' : ''}</span></button>
                <button id="article-subscribe-btn" class="action-btn">🔔 Subscribe</button>
                <button id="article-share-btn" class="action-btn">📤 Share</button>
                <button id="article-copy-btn" class="action-btn">🔗 Copy Link</button>
            </div>
        `;
        
        const likeBtn = document.getElementById('article-like-btn');
        const likeCountSpan = document.getElementById('article-like-count');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                let currentLikes = parseInt(localStorage.getItem(storageKey) || 0);
                currentLikes++;
                localStorage.setItem(storageKey, currentLikes);
                if (likeCountSpan) likeCountSpan.textContent = ' (' + currentLikes + ')';
                likeBtn.style.backgroundColor = '#b30000';
                likeBtn.style.color = 'white';
                setTimeout(() => {
                    likeBtn.style.backgroundColor = '';
                    likeBtn.style.color = '';
                }, 200);
            });
        }
        
        const subscribeBtn = document.getElementById('article-subscribe-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', function() {
                const email = prompt("Enter your email to subscribe:", "your@email.com");
                if (email && email.includes('@') && email.includes('.')) {
                    alert("Thank you for subscribing!");
                } else if (email) {
                    alert("Please enter a valid email address.");
                }
            });
        }
        
        const shareBtn = document.getElementById('article-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                const tooltip = document.getElementById('share-tooltip');
                if (tooltip) {
                    tooltip.classList.toggle('show');
                } else if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: window.location.href
                    }).catch(() => {});
                } else {
                    alert("Share this page: " + window.location.href);
                }
            });
        }
        
        const copyBtn = document.getElementById('article-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert("Link copied!"))
                    .catch(() => alert("Failed to copy link"));
                copyBtn.style.backgroundColor = '#b30000';
                copyBtn.style.color = 'white';
                setTimeout(() => {
                    copyBtn.style.backgroundColor = '';
                    copyBtn.style.color = '';
                }, 200);
            });
        }
    }
}

/* ============================
   ADD ARTICLE PAGINATION - UNIFIED MAROON BUTTONS
   ============================ */
function addArticlePagination(article) {
    let paginationDiv = document.querySelector('.article-pagination');
    
    if (!paginationDiv) {
        const contentEl = document.getElementById("content");
        if (contentEl && contentEl.parentNode) {
            paginationDiv = document.createElement('div');
            paginationDiv.className = 'article-pagination';
            contentEl.parentNode.insertBefore(paginationDiv, contentEl.nextSibling);
        }
    }
    
    const articleSequence = [
        { id: 'article-001', title: 'Shutter Down in Rawalakot' },
        { id: 'breaking-001', title: 'UKPNP Meets Baroness Nicholson' },
        { id: 'blog-001', title: 'UKPNP Briefs British MPs' },
        { id: 'editorial-001', title: 'Brief History of Jammu and Kashmir' },
        { id: 'latest-001', title: 'US-Israel-Iran Escalation' },
        { id: 'historical-001', title: 'US-Israel-Iran War Risk' }
    ];
    
    const currentIndex = articleSequence.findIndex(a => a.id === article.id);
    let prevHtml = '', nextHtml = '';
    
    if (currentIndex > 0) {
        const prev = articleSequence[currentIndex - 1];
        prevHtml = `<a href="article.html?id=${prev.id}" class="pagination-btn prev-btn">← Previous: ${prev.title}</a>`;
    }
    if (currentIndex < articleSequence.length - 1) {
        const next = articleSequence[currentIndex + 1];
        nextHtml = `<a href="article.html?id=${next.id}" class="pagination-btn next-btn">Next: ${next.title} →</a>`;
    }
    
    if (paginationDiv) {
        paginationDiv.innerHTML = `
            <a href="index.html" class="pagination-btn home-btn">← Back to Homepage</a>
            <div class="pagination-nav">${prevHtml} ${nextHtml}</div>
        `;
    }
}

/* ============================
   UPDATE SOCIAL META TAGS - CRITICAL FOR SOCIAL MEDIA SHARING
   ============================ */
function updateSocialMetaTags(article) {
    const fullUrl = window.location.href;
    const title = article.title || 'THE MIRROR JAMMU KASHMIR';
    const excerpt = article.excerpt || article.summary || 'Read the latest from THE MIRROR JAMMU KASHMIR.';
    
    let imageUrl = '';
    if (article.heroImage && article.heroImage.src) {
        imageUrl = article.heroImage.src;
        if (!imageUrl.startsWith('http')) {
            imageUrl = window.location.origin + '/' + imageUrl;
        }
    } else {
        imageUrl = window.location.origin + '/content/images/logo.png';
    }
    
    // Update Open Graph tags
    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', fullUrl);
    
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDescription = document.getElementById('og-description');
    if (ogDescription) ogDescription.setAttribute('content', excerpt);
    
    const ogImage = document.getElementById('og-image');
    if (ogImage) ogImage.setAttribute('content', imageUrl);
    
    // Update Twitter Card tags
    const twitterTitle = document.getElementById('twitter-title');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    
    const twitterDescription = document.getElementById('twitter-description');
    if (twitterDescription) twitterDescription.setAttribute('content', excerpt);
    
    const twitterImage = document.getElementById('twitter-image');
    if (twitterImage) twitterImage.setAttribute('content', imageUrl);
    
    // Update standard meta description
    const metaDescription = document.getElementById('meta-description');
    if (metaDescription) metaDescription.setAttribute('content', excerpt);
    
    console.log("Social meta tags updated:", { title, excerpt, imageUrl, fullUrl });
}

/* ============================
   NEXT ARTICLE SUGGESTION
   ============================ */
function suggestNextArticle(currentArticleId) {
    const suggestionDiv = document.getElementById('next-article-suggestion');
    if (!suggestionDiv) return;
    
    const articleSequence = [
        { id: 'article-001', title: 'Shutter Down in Rawalakot' },
        { id: 'breaking-001', title: 'UKPNP Meets Baroness Nicholson' },
        { id: 'blog-001', title: 'UKPNP Briefs British MPs' },
        { id: 'editorial-001', title: 'Brief History of Jammu and Kashmir' },
        { id: 'latest-001', title: 'US-Israel-Iran Escalation' },
        { id: 'historical-001', title: 'US-Israel-Iran War Risk' }
    ];
    
    const currentIndex = articleSequence.findIndex(a => a.id === currentArticleId);
    
    if (currentIndex !== -1 && currentIndex < articleSequence.length - 1) {
        const next = articleSequence[currentIndex + 1];
        suggestionDiv.innerHTML = `<a href="article.html?id=${next.id}">Next: ${next.title} →</a>`;
        suggestionDiv.style.display = 'block';
    } else {
        suggestionDiv.style.display = 'none';
    }
}

// Make functions globally available
window.copyPageLink = copyPageLink;
window.playVideo = playVideo;
