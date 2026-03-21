/* ============================================================
   THE MIRROR JAMMU KASHMIR - ARTICLE PAGE SCRIPT
   FIXED: Read More Section, Share Tooltip, Navigation, Calendar
   ============================================================ */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("Article page loaded - initializing...");
    
    // Initialize components
    initYear();
    initReadingProgress();
    initShareTooltip();
    initClocksAndCalendars();
    
    // Start clock updates
    setInterval(updateClocks, 1000);
    setInterval(updateCalendars, 1000);
    
    // Load article
    initArticlePage();
});

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
   CLOCKS & CALENDARS - FIXED
   ============================ */
function initClocksAndCalendars() {
    updateClocks();
    updateCalendars();
}

function updateClocks() {
    const now = new Date();
    
    // IST (UTC+5:30)
    const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    // PKT (UTC+5)
    const pktTime = now.toLocaleTimeString("en-PK", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    // CET (UTC+1)
    const cetTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    // Update if elements exist
    const timeIST = document.getElementById('time-ist');
    const timePKT = document.getElementById('time-pkt');
    const timeCET = document.getElementById('time-cet');
    
    if (timeIST) timeIST.textContent = istTime;
    if (timePKT) timePKT.textContent = pktTime;
    if (timeCET) timeCET.textContent = cetTime;
}

function updateCalendars() {
    const now = new Date();
    
    // Gregorian Date
    const gregDisplay = document.getElementById('gregorian-display');
    if (gregDisplay) {
        gregDisplay.textContent = formatGregorianDate(now);
    }
    
    // Hijri Date
    const hijriDisplay = document.getElementById('hijri-display');
    if (hijriDisplay) {
        hijriDisplay.textContent = getHijriDate(now);
    }
    
    // Bikrami Date (Desi Punjabi Calendar)
    const bikramiDisplay = document.getElementById('bikrami-display');
    if (bikramiDisplay) {
        bikramiDisplay.textContent = getBikramiDate(now);
    }
    
    // Vikram Samvat
    const vikramDisplay = document.getElementById('vikram-display');
    if (vikramDisplay) {
        vikramDisplay.textContent = getVikramDate(now);
    }
}

function formatGregorianDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return days[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
}

function getHijriDate(date) {
    try {
        const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
        return hijriDate + " AH";
    } catch(e) {
        return "Ramadan, 1447 AH";
    }
}

function getBikramiDate(date) {
    // Bikrami (Desi Punjabi) Calendar
    const bikramiMonths = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagan"
    ];
    
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth(); // 0-11
    const gregorianDay = date.getDate();
    
    // Calculate Bikrami year (add 57 years, adjust based on month)
    let bikramiYear = gregorianYear + 57;
    
    // Bikrami year starts in mid-March (around March 14-15)
    // If before Bikrami New Year, subtract 1
    if (gregorianMonth < 2 || (gregorianMonth === 2 && gregorianDay < 14)) {
        bikramiYear = gregorianYear + 56;
    }
    
    // Map Gregorian month to Bikrami month
    const monthMapping = [
        9,  // January -> Magh
        10, // February -> Phagan
        11, // March -> Chet
        0,  // April -> Chet/Vaisakh
        1,  // May -> Vaisakh
        2,  // June -> Jeth
        3,  // July -> Harh
        4,  // August -> Sawan
        5,  // September -> Bhadon
        6,  // October -> Assu
        7,  // November -> Kattak
        8   // December -> Maghar
    ];
    
    const bikramiMonthIndex = monthMapping[gregorianMonth];
    const bikramiMonthName = bikramiMonths[bikramiMonthIndex];
    
    return gregorianDay + " " + bikramiMonthName + " " + bikramiYear + " (Desi Bikrami)";
}

function getVikramDate(date) {
    const vikramMonths = [
        "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
        "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
    ];
    
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth();
    const gregorianDay = date.getDate();
    
    // Vikram Samvat adds 57 years, with new year in April
    let vikramYear = gregorianYear + 57;
    if (gregorianMonth < 3) {
        vikramYear = gregorianYear + 56;
    }
    
    const monthMapping = [
        10, // January -> Magha
        11, // February -> Phalguna
        0,  // March -> Chaitra
        0,  // April -> Chaitra
        1,  // May -> Vaishakha
        2,  // June -> Jyeshtha
        3,  // July -> Ashadha
        4,  // August -> Shravana
        5,  // September -> Bhadrapada
        6,  // October -> Ashwin
        7,  // November -> Kartika
        8   // December -> Margashirsha
    ];
    
    const vikramMonthIndex = monthMapping[gregorianMonth];
    const vikramMonthName = vikramMonths[vikramMonthIndex];
    
    return gregorianDay + " " + vikramMonthName + " " + vikramYear + " VS";
}

/* ============================
   SHARE TOOLTIP - FIXED
   ============================ */
function initShareTooltip() {
    const shareBtn = document.getElementById('btn-share');
    const tooltip = document.getElementById('share-tooltip');
    
    if (!shareBtn || !tooltip) return;
    
    // Toggle tooltip on share button click
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        tooltip.classList.toggle('show');
    });
    
    // Hide tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (!tooltip.contains(e.target) && e.target !== shareBtn) {
            tooltip.classList.remove('show');
        }
    });
    
    // Prevent tooltip from closing when clicking inside
    tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Update share links with current URL
    updateShareLinks();
}

function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    // Facebook
    const fbLink = document.getElementById('share-facebook');
    if (fbLink) {
        fbLink.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        fbLink.target = '_blank';
        fbLink.rel = 'noopener noreferrer';
    }
    
    // Twitter/X
    const twitterLink = document.getElementById('share-twitter');
    if (twitterLink) {
        twitterLink.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        twitterLink.target = '_blank';
        twitterLink.rel = 'noopener noreferrer';
    }
    
    // WhatsApp
    const whatsappLink = document.getElementById('share-whatsapp');
    if (whatsappLink) {
        whatsappLink.href = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
    }
    
    // LinkedIn
    const linkedinLink = document.getElementById('share-linkedin');
    if (linkedinLink) {
        linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
    }
    
    // Telegram
    const telegramLink = document.getElementById('share-telegram');
    if (telegramLink) {
        telegramLink.href = `https://t.me/share/url?url=${url}&text=${title}`;
        telegramLink.target = '_blank';
        telegramLink.rel = 'noopener noreferrer';
    }
    
    // Reddit
    const redditLink = document.getElementById('share-reddit');
    if (redditLink) {
        redditLink.href = `https://www.reddit.com/submit?url=${url}&title=${title}`;
        redditLink.target = '_blank';
        redditLink.rel = 'noopener noreferrer';
    }
    
    // Pinterest
    const pinterestLink = document.getElementById('share-pinterest');
    if (pinterestLink) {
        pinterestLink.href = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
        pinterestLink.target = '_blank';
        pinterestLink.rel = 'noopener noreferrer';
    }
    
    // Email
    const emailLink = document.getElementById('share-email');
    if (emailLink) {
        emailLink.href = `mailto:?subject=${title}&body=Check this article: ${decodeURIComponent(url)}`;
        emailLink.target = '_blank';
        emailLink.rel = 'noopener noreferrer';
    }
}

/* ============================
   COPY PAGE LINK
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
   ARTICLE PAGE INITIALIZATION
   ============================ */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    let articleId = params.get("id");
    
    // Default article if no ID provided
    if (!articleId) {
        const defaultId = document.querySelector('main.article-page')?.getAttribute('data-default-id');
        if (defaultId) {
            articleId = defaultId;
            console.log("Using default article ID:", articleId);
        } else {
            showArticleNotFound();
            return;
        }
    }
    
    console.log("Loading article ID:", articleId);
    
    // Show loading state
    const loadingDiv = document.getElementById('loading-state');
    if (loadingDiv) loadingDiv.style.display = 'flex';
    
    // Hide content until loaded
    const contentDiv = document.getElementById('content');
    if (contentDiv) contentDiv.style.display = 'none';
    
    const readMoreSection = document.getElementById('read-more-section');
    if (readMoreSection) readMoreSection.style.display = 'none';
    
    const actionsDiv = document.getElementById('article-actions');
    if (actionsDiv) actionsDiv.style.display = 'none';
    
    const navDiv = document.getElementById('article-nav');
    if (navDiv) navDiv.style.display = 'none';
    
    // Try multiple paths to find the JSON
    const pathsToTry = [
        "content/" + articleId + ".json",
        "./content/" + articleId + ".json",
        "/content/" + articleId + ".json",
        articleId + ".json",
        "./" + articleId + ".json"
    ];
    
    tryLoadArticle(pathsToTry, 0, articleId);
}

function tryLoadArticle(paths, index, articleId) {
    if (index >= paths.length) {
        console.error("All paths failed for article:", articleId);
        showArticleNotFound();
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
            console.log("Article data loaded:", data);
            
            // Extract article from possible wrappers
            let article = data;
            
            // Check for items wrapper
            if (data && typeof data === 'object' && !data.id && !data.title) {
                if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                    article = data.items[0];
                    console.log("Extracted from items wrapper");
                } else if (Array.isArray(data) && data.length > 0) {
                    article = data[0];
                    console.log("Extracted from array");
                }
            }
            
            // Validate article
            if (!article || !article.title) {
                console.error("Invalid article structure:", article);
                throw new Error("Invalid article structure");
            }
            
            // Ensure required fields exist
            if (!article.id) article.id = articleId;
            if (!article.body) article.body = [];
            
            // Render the article
            renderFullArticlePage(article);
        })
        .catch(function(error) {
            console.error("Error loading from", path, ":", error);
            tryLoadArticle(paths, index + 1, articleId);
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
    
    const actionsDiv = document.getElementById('article-actions');
    if (actionsDiv) actionsDiv.style.display = 'flex';
    
    const navDiv = document.getElementById('article-nav');
    if (navDiv) navDiv.style.display = 'flex';
    
    // Set page title
    document.title = (article.title || "Article") + " | THE MIRROR JAMMU KASHMIR";
    
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
        
        // Clean up path
        imageSrc = imageSrc.replace(/^\/+/, '');
        
        // Fix relative paths
        if (!imageSrc.startsWith('http') && !imageSrc.startsWith('content/images/')) {
            imageSrc = 'content/images/' + imageSrc.split('/').pop();
        }
        
        heroImg.src = imageSrc;
        heroImg.alt = article.heroImage.caption || article.title || '';
        
        heroImg.onerror = function() {
            this.onerror = null;
            this.src = 'https://via.placeholder.com/1280x720?text=' + encodeURIComponent(article.title?.charAt(0) || 'J');
        };
        
        if (heroCaption) {
            heroCaption.textContent = article.heroImage.caption || '';
        }
        
        heroWrap.style.display = 'block';
    }
    
    // --- RENDER BODY CONTENT ---
    const contentEl = document.getElementById("content");
    if (!contentEl) return;
    
    contentEl.innerHTML = '';
    
    if (article.body && Array.isArray(article.body)) {
        article.body.forEach(function(block) {
            // Paragraph
            if (block.type === "paragraph") {
                contentEl.innerHTML += '<p>' + (block.text || '') + '</p>';
            }
            // Header
            else if (block.type === "header") {
                contentEl.innerHTML += '<h2 class="mid-subheading" style="font-size: 1.8rem; color: #b30000; margin: 2rem 0 1.5rem;">' + (block.text || '') + '</h2>';
            }
            // Subheading
            else if (block.type === "subheading") {
                contentEl.innerHTML += '<h2 class="mid-subheading">' + (block.text || '') + '</h2>';
            }
            // Pull Quote
            else if (block.type === "pullquote") {
                contentEl.innerHTML += '<div class="pull-quote">' + (block.text || '') + '</div>';
            }
            // Points / Bullet List
            else if (block.type === "points" && block.items) {
                let listHtml = '<div class="important-points"><ul>';
                block.items.forEach(function(item) {
                    listHtml += '<li>' + item + '</li>';
                });
                listHtml += '</ul></div>';
                contentEl.innerHTML += listHtml;
            }
            // Image with floating
            else if (block.type === "image" && block.src) {
                let imageSrc = block.src;
                
                // Clean up path
                imageSrc = imageSrc.replace(/^\/+/, '');
                
                // Fix relative paths
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
    
    // --- READ MORE SECTION ---
    if (article.readMore && article.readMore.trim() !== '') {
        const readMoreSection = document.getElementById('read-more-section');
        const readMoreContent = document.getElementById('read-more-content');
        
        if (readMoreSection && readMoreContent) {
            readMoreContent.innerHTML = article.readMore;
            readMoreSection.style.display = 'block';
            
            // Also set hero image in read more section if available
            const readMoreHeroImg = document.getElementById('readMoreHeroImg');
            const readMoreHeroCaption = document.getElementById('readMoreHeroCaption');
            
            if (readMoreHeroImg && article.heroImage && article.heroImage.src) {
                let imageSrc = article.heroImage.src;
                imageSrc = imageSrc.replace(/^\/+/, '');
                if (!imageSrc.startsWith('http') && !imageSrc.startsWith('content/images/')) {
                    imageSrc = 'content/images/' + imageSrc.split('/').pop();
                }
                readMoreHeroImg.src = imageSrc;
                readMoreHeroImg.alt = article.heroImage.caption || '';
                
                const readMoreHeroContainer = document.querySelector('.read-more-hero');
                if (readMoreHeroContainer) readMoreHeroContainer.style.display = 'block';
                
                if (readMoreHeroCaption && article.heroImage.caption) {
                    readMoreHeroCaption.textContent = article.heroImage.caption;
                }
            } else {
                const readMoreHeroContainer = document.querySelector('.read-more-hero');
                if (readMoreHeroContainer) readMoreHeroContainer.style.display = 'none';
            }
        }
    }
    
    // Initialize article action buttons
    initArticleActions(article);
    
    // Setup navigation (prev/next)
    setupArticleNavigation(article);
    
    // Update social media meta tags
    updateSocialMetaTags(article);
}

/* ============================
   ARTICLE ACTION BUTTONS
   ============================ */
function initArticleActions(article) {
    const likeBtn = document.getElementById("btn-like");
    const subscribeBtn = document.getElementById("btn-subscribe");
    const copyBtn = document.getElementById("btn-copy");
    const likeCountSpan = document.getElementById("like-count");
    
    const articleId = article?.id || window.location.search || 'default';
    const storageKey = 'article-likes-' + articleId;
    
    // Load existing likes
    let likes = localStorage.getItem(storageKey) || 0;
    if (likeCountSpan) {
        likeCountSpan.textContent = likes ? ' (' + likes + ')' : '';
    }
    
    // Like button
    if (likeBtn) {
        likeBtn.addEventListener("click", function() {
            let currentLikes = parseInt(localStorage.getItem(storageKey) || 0);
            currentLikes++;
            localStorage.setItem(storageKey, currentLikes);
            
            if (likeCountSpan) {
                likeCountSpan.textContent = ' (' + currentLikes + ')';
            }
            
            // Visual feedback
            likeBtn.style.backgroundColor = '#b30000';
            likeBtn.style.color = 'white';
            setTimeout(() => {
                likeBtn.style.backgroundColor = '';
                likeBtn.style.color = '';
            }, 200);
            
            alert('Thank you for liking this article!');
        });
    }
    
    // Subscribe button
    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", function() {
            const email = prompt("Enter your email to subscribe:", "your@email.com");
            if (email && email.includes('@') && email.includes('.')) {
                alert("Thank you for subscribing! You'll receive notifications about new articles.");
            } else if (email) {
                alert("Please enter a valid email address.");
            }
        });
    }
    
    // Copy link button
    if (copyBtn) {
        copyBtn.addEventListener("click", function() {
            copyPageLink();
            
            // Visual feedback
            copyBtn.style.backgroundColor = '#b30000';
            copyBtn.style.color = 'white';
            setTimeout(() => {
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 200);
        });
    }
}

/* ============================
   ARTICLE NAVIGATION
   ============================ */
function setupArticleNavigation(currentArticle) {
    const prevLink = document.getElementById('prev-article');
    const nextLink = document.getElementById('next-article');
    const suggestionDiv = document.getElementById('next-article-suggestion');
    
    // Define article sequence
    const articleSequence = [
        { id: 'article-001', title: 'Shutter Down in Rawalakot' },
        { id: 'breaking-001', title: 'UKPNP Meets Baroness Nicholson' },
        { id: 'blog-001', title: 'UKPNP Briefs British MPs' },
        { id: 'editorial-001', title: 'Brief History of Jammu and Kashmir' },
        { id: 'latest-001', title: 'US-Israel-Iran Escalation' },
        { id: 'historical-001', title: 'US-Israel-Iran War Risk' }
    ];
    
    // Find current article index
    const currentIndex = articleSequence.findIndex(a => a.id === currentArticle.id);
    
    if (currentIndex === -1) {
        if (prevLink) prevLink.style.display = 'none';
        if (nextLink) nextLink.style.display = 'none';
        if (suggestionDiv) suggestionDiv.style.display = 'none';
        return;
    }
    
    // Set previous article
    if (currentIndex > 0 && prevLink) {
        const prev = articleSequence[currentIndex - 1];
        prevLink.href = 'article.html?id=' + prev.id;
        prevLink.style.display = 'inline-flex';
    } else if (prevLink) {
        prevLink.style.display = 'none';
    }
    
    // Set next article
    if (currentIndex < articleSequence.length - 1 && nextLink) {
        const next = articleSequence[currentIndex + 1];
        nextLink.href = 'article.html?id=' + next.id;
        nextLink.style.display = 'inline-flex';
        
        // Set suggestion text
        if (suggestionDiv) {
            suggestionDiv.innerHTML = 'Next: <a href="article.html?id=' + next.id + '">' + next.title + ' →</a>';
            suggestionDiv.style.display = 'block';
        }
    } else {
        if (nextLink) nextLink.style.display = 'none';
        if (suggestionDiv) suggestionDiv.style.display = 'none';
    }
}

/* ============================
   UPDATE SOCIAL META TAGS
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
    }
    
    // Open Graph
    setMetaContent('og-url', fullUrl);
    setMetaContent('og-title', title);
    setMetaContent('og-description', excerpt);
    if (imageUrl) setMetaContent('og-image', imageUrl);
    
    // Twitter
    setMetaContent('twitter-title', title);
    setMetaContent('twitter-description', excerpt);
    if (imageUrl) setMetaContent('twitter-image', imageUrl);
    
    // Standard
    setMetaContent('meta-description', excerpt);
}

function setMetaContent(id, content) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('content', content);
}

/* ============================
   SHOW ARTICLE NOT FOUND
   ============================ */
function showArticleNotFound() {
    const loadingDiv = document.getElementById('loading-state');
    if (loadingDiv) loadingDiv.style.display = 'none';
    
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = `
            <div style="text-align:center; padding:60px 20px;">
                <h2 style="color:#b30000; margin-bottom:20px;">Article Not Found</h2>
                <p>The article you're looking for could not be loaded.</p>
                <p>Please check the URL or return to the homepage.</p>
                <a href="index.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#b30000; color:white; text-decoration:none; border-radius:4px;">Return to Homepage</a>
            </div>
        `;
    }
    
    const titleEl = document.getElementById("title");
    if (titleEl) titleEl.textContent = "Article Not Found";
    
    const metaEl = document.getElementById("meta");
    if (metaEl) metaEl.innerHTML = '<strong>Error</strong> — Unable to load article';
}
