// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("Website loading...");
    
    // Hide loader after 1.5 seconds
    setTimeout(function() {
        const loader = document.getElementById("site-loader");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(function() {
                loader.style.display = "none";
            }, 300);
        }
    }, 1500);
    
    // Set footer year
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Update clocks
    updateClocks();
    setInterval(updateClocks, 1000);
    
    // Initialize weather bar
    initWeatherBar();
    
    // Initialize ticker
    initTicker();
    
    // Initialize navigation
    initNav();
    
    // Initialize contact modal
    initContactModal();
    
    // Initialize vlogs
    initVlogs();
    
    // Initialize language selector
    initLanguageSelector();
    
    // Initialize search
    initSearch();
    
    // Initialize social buttons
    initSocialButtons();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize newsletter
    initNewsletter();
    
    // Initialize footer dropdowns
    initFooterDropdowns();
    
    // Load homepage content
    loadHomepageContent();
});

// Update clocks function
function updateClocks() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const datetimeBar = document.getElementById("datetime-bar");
    if (!datetimeBar) return;
    
    const zurichTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const fullDate = now.toLocaleDateString("en-GB", options);
    
    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const istAmpm = now.getHours() >= 12 ? 'pm' : 'am';
    
    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const pktAmpm = now.getHours() >= 12 ? 'pm' : 'am';
    
    datetimeBar.innerHTML = `
        <span>${fullDate} at ${zurichTime}</span>
        <span class="separator">•</span>
        <span>Ramadan 27, 1447 AH</span>
        <span class="separator">•</span>
        <span>16 Iyeshtha 2083 VS</span>
        <span class="separator">•</span>
        <span>IST (Jammu-Kashmir-Ladakh): <strong>${istTime} ${istAmpm}</strong></span>
        <span class="separator">•</span>
        <span>PKT (Gilgit-Baltistan & Azad Kashmir): <strong>${pktTime} ${pktAmpm}</strong></span>
    `;
}

// Weather bar
function initWeatherBar() {
    const bar = document.getElementById("weather-bar");
    if (!bar) return;
    
    const cities = [
        "Zurich: 6°C", "Rawalakot: 9°C", "Jammu: 18°C", "Kashmir: 4°C",
        "Ladakh: -2°C", "Gilgit: 3°C", "Baltistan: -1°C", "Muzaffarabad: 10°C"
    ];
    
    let html = '';
    cities.forEach(function(city, index) {
        html += `<span>🌡️ ${city}</span>`;
        if (index < cities.length - 1) html += '<span class="separator">•</span>';
    });
    
    bar.innerHTML = html;
}

// Ticker
function initTicker() {
    const ticker = document.getElementById("ticker-items");
    if (!ticker) return;
    
    const items = [
        "THE MIRROR JAMMU KASHMIR --- INDEPENDENT DIGITAL MEDIA",
        "WE CHALLENGE SILENCE, EXPOSE INJUSTICE",
        "OUR MISSION: CHAMPION JUSTICE AND SPEAK TRUTH",
        "ALL HUMAN BEINGS ARE BORN FREE AND EQUAL"
    ];
    
    let html = '';
    for (let i = 0; i < 3; i++) {
        items.forEach(item => html += `<span>${item} • </span>`);
    }
    ticker.innerHTML = html;
}

// Navigation
function initNav() {
    const hamburger = document.getElementById("hamburger");
    const navList = document.getElementById("nav-list");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (!hamburger || !navList || !mobileMenu) return;
    
    hamburger.addEventListener("click", function() {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        mobileMenu.hidden = expanded;
        if (!expanded) mobileMenu.innerHTML = navList.innerHTML;
    });
}

// Contact Modal
function initContactModal() {
    const openBtn = document.getElementById("contact-open");
    const closeBtn = document.getElementById("contact-close");
    const modal = document.getElementById("contact-modal");
    const cancelBtn = document.getElementById("modal-cancel");
    const contactForm = document.getElementById("contact-form");
    
    if (!openBtn || !closeBtn || !modal) return;
    
    openBtn.onclick = () => modal.classList.remove("hidden");
    closeBtn.onclick = () => modal.classList.add("hidden");
    if (cancelBtn) cancelBtn.onclick = () => modal.classList.add("hidden");
    
    if (contactForm) {
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            alert("Thank you for your message!");
            modal.classList.add("hidden");
            contactForm.reset();
        };
    }
}

// Vlogs
function initVlogs() {
    const grid = document.getElementById("vlogs-grid");
    if (!grid) return;
    
    const videos = [
        { title: "Exclusive Interview | The Mirror Jammu Kashmir", desc: "In-depth interview on peace, justice, and human rights.", duration: "15:32" },
        { title: "Ground Report | Community Voices", desc: "Voices from the ground. Real stories. Real people.", duration: "12:45" },
        { title: "Analysis | Human Rights Framework", desc: "Legal and political analysis of ongoing human rights issues.", duration: "18:20" }
    ];
    
    let html = '';
    videos.forEach(v => {
        html += `
            <article class="card">
                <div class="vlog-card-thumb">
                    <img src="https://via.placeholder.com/320x180?text=Video" alt="${v.title}">
                    <div class="vlog-play-icon">▶</div>
                    <div class="vlog-duration">${v.duration}</div>
                </div>
                <div class="card-body">
                    <h3>${v.title}</h3>
                    <p>${v.desc}</p>
                </div>
            </article>
        `;
    });
    grid.innerHTML = html;
}

// Language Selector
function initLanguageSelector() {
    const select = document.getElementById("language-select");
    if (select) {
        select.onchange = function(e) {
            alert("Language changed to " + e.target.options[e.target.selectedIndex].text);
        };
    }
}

// Search
function initSearch() {
    const form = document.querySelector(".search");
    const input = document.getElementById("search-input");
    if (form && input) {
        form.onsubmit = function(e) {
            e.preventDefault();
            if (input.value.trim()) alert("Searching for: " + input.value.trim());
        };
    }
}

// Social Buttons
function initSocialButtons() {
    document.querySelectorAll(".sa-btn").forEach(btn => {
        btn.onclick = function() {
            const text = this.textContent.trim();
            if (text.includes("Like")) alert("Thank you for liking!");
            else if (text.includes("Subscribe")) alert("Thank you for subscribing!");
            else if (text.includes("Share")) alert("Share this page!");
        };
    });
}

// Copy Link
window.copyPageLink = function() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
};

// File Upload
function initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const fileNameSpan = document.querySelector(".file-name");
    if (fileInput && fileNameSpan) {
        fileInput.onchange = function() {
            fileNameSpan.textContent = this.files.length ? this.files[0].name : "No file chosen";
        };
    }
}

// Newsletter
function initNewsletter() {
    const btn = document.getElementById("subscribeBtn");
    const input = document.getElementById("subscribeEmail");
    if (btn && input) {
        btn.onclick = function(e) {
            e.preventDefault();
            const email = input.value.trim();
            if (email && email.includes("@") && email.includes(".")) {
                alert("Thank you for subscribing!");
                input.value = "";
            } else {
                alert("Please enter a valid email address.");
            }
        };
    }
}

// Footer Dropdowns
function initFooterDropdowns() {
    document.querySelectorAll('.footer-section:not(:first-child) h4').forEach(heading => {
        heading.onclick = function() {
            this.parentElement.classList.toggle('open');
        };
    });
}

// Homepage Content
function loadHomepageContent() {
    // Top Stories
    const topGrid = document.getElementById("top-stories-grid");
    if (topGrid) {
        topGrid.innerHTML = `
            <article class="card"><div class="media"><span class="placeholder-icon">📰</span></div><div class="card-body"><h3>Complete Shutter Down Paralyses Rawalakot</h3><p>Thousands protest against power cuts...</p><a href="#" class="btn-red">Read More →</a></div></article>
            <article class="card"><div class="media"><span class="placeholder-icon">📰</span></div><div class="card-body"><h3>UKPNP Delegation Meets Baroness Nicholson</h3><p>High level delegation discusses Kashmir crisis...</p><a href="#" class="btn-red">Read More →</a></div></article>
            <article class="card"><div class="media"><span class="placeholder-icon">📰</span></div><div class="card-body"><h3>UKPNP Delegation Briefs British MPs</h3><p>Delegation briefs MPs on Kashmir conflict...</p 
