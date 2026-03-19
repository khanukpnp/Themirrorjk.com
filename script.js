/* ============================
   ARTICLE.JS - COMPLETE SOLUTION
   ============================ */

// Main function to load and render article
async function loadArticle() {
    try {
        // Get article ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id') || 'editorial-001'; // Default if no ID
        
        // Show loading state
        showLoadingState();
        
        // Fetch article data
        const response = await fetch('articles.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        
        const data = await response.json();
        const article = data.articles.find(a => a.id === articleId);
        
        if (!article) {
            throw new Error('Article not found');
        }
        
        // Render the full article
        renderFullArticlePage(article);
        
        // Setup navigation
        setupArticleNavigation(article);
        
        // Fix date alignment
        fixDateAlignment();
        
        // Initialize all components
        initializeComponents();
        
    } catch (error) {
        console.error('Error loading article:', error);
        showErrorMessage();
    }
}

/* ============================
   SHOW LOADING STATE
   ============================ */
function showLoadingState() {
    const container = document.getElementById('article-content');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading article...</p>
            </div>
        `;
    }
}

/* ============================
   RENDER FULL ARTICLE PAGE
   ============================ */
function renderFullArticlePage(article) {
    const container = document.getElementById('article-content');
    if (!container) return;
    
    // Build article HTML
    let html = `
        <article class="full-article">
            <header class="article-header">
                <h1 class="article-title">${escapeHtml(article.title || 'Untitled')}</h1>
                ${article.subtitle ? `<h2 class="article-subtitle">${escapeHtml(article.subtitle)}</h2>` : ''}
                
                <div class="article-meta">
                    <span class="article-location meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${escapeHtml(article.location || 'Geneva, Switzerland')}
                    </span>
                    
                    <span class="article-date meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        ${formatDate(article.date)}
                    </span>
                    
                    <span class="article-author meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        ${escapeHtml(article.author || 'Sardar Nasir Aziz Khan')}
                    </span>
                    
                    <span class="article-read-time meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        ${escapeHtml(article.readTime || '22 min read')}
                    </span>
                </div>
            </header>
    `;
    
    // Add hero image with error handling
    if (article.heroImage) {
        html += `
            <div class="hero-image-container">
                <img src="${escapeHtml(article.heroImage)}" 
                     alt="${escapeHtml(article.title)}" 
                     class="hero-image"
                     onerror="handleImageError(this)"
                     loading="lazy">
                ${article.imageCaption ? `<figcaption class="image-caption">${escapeHtml(article.imageCaption)}</figcaption>` : ''}
            </div>
        `;
    } else {
        // Add fallback image if no hero image specified
        html += `
            <div class="hero-image-container fallback">
                <div class="image-placeholder">
                    <span>${escapeHtml(article.title?.[0] || 'J')}</span>
                </div>
            </div>
        `;
    }
    
    // Add article content
    html += `
        <div class="article-body">
            ${article.content || ''}
        </div>
    `;
    
    // Add read more section if exists
    if (article.readMore) {
        html += `
            <div class="read-more-section">
                <h3 class="read-more-title">Read More</h3>
                <div class="read-more-content">
                    ${article.readMore}
                </div>
            </div>
        `;
    }
    
    // Add tags if exist
    if (article.tags && article.tags.length > 0) {
        html += `
            <div class="article-tags">
                ${article.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        `;
    }
    
    // Close article tag
    html += `</article>`;
    
    // Add navigation section
    html += `
        <div class="article-navigation" id="article-navigation">
            <div class="nav-links">
                <a href="#" id="prev-article" class="nav-link prev-link" style="display: none;">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                    Previous
                </a>
                <a href="#" id="next-article" class="nav-link next-link" style="display: none;">
                    Next
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                </a>
            </div>
            <div id="next-article-suggestion" class="next-suggestion" style="display: none;"></div>
        </div>
    `;
    
    container.innerHTML = html;
}

/* ============================
   ESCAPE HTML TO PREVENT XSS
   ============================ */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ============================
   IMAGE ERROR HANDLING
   ============================ */
function handleImageError(img) {
    console.warn('Image failed to load:', img.src);
    
    // Replace with fallback
    const container = img.closest('.hero-image-container');
    if (container) {
        const alt = img.alt || 'Article image';
        container.innerHTML = `
            <div class="image-placeholder error">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span>Image not available</span>
            </div>
        `;
    }
}

/* ============================
   DATE FORMATTING AND ALIGNMENT
   ============================ */
function formatDate(dateString) {
    if (!dateString) return '3 March 2026';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }
        
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function fixDateAlignment() {
    const metaContainer = document.querySelector('.article-meta');
    if (!metaContainer) return;
    
    // Add alignment classes
    metaContainer.classList.add('meta-aligned');
    
    // Ensure consistent spacing
    const elements = metaContainer.children;
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('meta-item');
    }
    
    // Check for wrapping issues
    if (window.innerWidth < 768) {
        metaContainer.style.flexDirection = 'column';
        metaContainer.style.alignItems = 'flex-start';
    } else {
        metaContainer.style.flexDirection = 'row';
        metaContainer.style.alignItems = 'center';
    }
}

/* ============================
   ARTICLE NAVIGATION FROM JSON
   ============================ */
function setupArticleNavigation(article) {
    const prevLink = document.getElementById('prev-article');
    const nextLink = document.getElementById('next-article');
    const suggestionDiv = document.getElementById('next-article-suggestion');
    
    // Check if navigation object exists in the article
    if (article.navigation) {
        // Set previous article link
        if (article.navigation.prev && prevLink) {
            prevLink.href = `article.html?id=${article.navigation.prev}`;
            prevLink.style.display = 'inline-flex';
            prevLink.setAttribute('aria-label', 'Previous article');
        } else if (prevLink) {
            prevLink.style.display = 'none';
        }
        
        // Set next article link
        if (article.navigation.next && nextLink) {
            nextLink.href = `article.html?id=${article.navigation.next}`;
            nextLink.style.display = 'inline-flex';
            nextLink.setAttribute('aria-label', 'Next article');
            
            // Also set suggestion text with better formatting
            if (suggestionDiv) {
                // You might want to fetch the next article title
                suggestionDiv.innerHTML = `
                    <div class="next-suggestion-content">
                        <span class="suggestion-label">Up Next:</span>
                        <a href="article.html?id=${article.navigation.next}" class="suggestion-link">
                            ${article.navigation.nextTitle || 'Read Next Article'}
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                        </a>
                    </div>
                `;
                suggestionDiv.style.display = 'block';
            }
        } else if (nextLink) {
            nextLink.style.display = 'none';
            if (suggestionDiv) suggestionDiv.style.display = 'none';
        }
    } else {
        // Hide navigation if no navigation object
        if (prevLink) prevLink.style.display = 'none';
        if (nextLink) nextLink.style.display = 'none';
        if (suggestionDiv) suggestionDiv.style.display = 'none';
    }
}

/* ============================
   INITIALIZE COMPONENTS
   ============================ */
function initializeComponents() {
    // Add window resize listener for responsive meta
    window.addEventListener('resize', () => {
        fixDateAlignment();
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* ============================
   ERROR HANDLING
   ============================ */
function showErrorMessage() {
    const container = document.getElementById('article-content');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h2>Failed to Load Article</h2>
                <p>We're having trouble loading this article. Please try again later.</p>
                <div class="error-actions">
                    <button onclick="location.reload()" class="retry-btn">Try Again</button>
                    <a href="/" class="back-home">Return to Home</a>
                </div>
            </div>
        `;
    }
}

/* ============================
   INITIALIZATION
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
    
    // Also fix date alignment on initial load and after images load
    setTimeout(fixDateAlignment, 100);
    window.addEventListener('load', fixDateAlignment);
});

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadArticle,
        renderFullArticlePage,
        setupArticleNavigation,
        handleImageError,
        fixDateAlignment,
        formatDate,
        escapeHtml
    };
}
