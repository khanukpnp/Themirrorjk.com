/* ============================================================
SOCIAL SHARING FIX - No changes to existing script.js
============================================================ */

(function() {
    // Wait for article to load
    function waitForArticle() {
        const checkInterval = setInterval(function() {
            const titleEl = document.getElementById('title');
            if (titleEl && titleEl.textContent && titleEl.textContent !== '') {
                clearInterval(checkInterval);
                
                // Get article data from the page
                const articleData = {
                    title: titleEl.textContent,
                    excerpt: document.querySelector('#content p')?.textContent?.substring(0, 160) || 'Read the latest from THE MIRROR JAMMU KASHMIR',
                    heroImage: document.getElementById('heroImg')?.src || '/content/images/logo.png'
                };
                
                // Update meta tags for social preview
                updateMetaTags(articleData);
                
                // Fix share buttons
                fixShareButtons(articleData);
            }
        }, 100);
    }
    
    function updateMetaTags(article) {
        const url = window.location.href;
        const title = article.title;
        const excerpt = article.excerpt;
        let imageUrl = article.heroImage;
        
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = window.location.origin + imageUrl;
        }
        
        // Update Open Graph tags
        const ogTitle = document.getElementById('og-title');
        if (ogTitle) ogTitle.setAttribute('content', title);
        
        const ogDesc = document.getElementById('og-description');
        if (ogDesc) ogDesc.setAttribute('content', excerpt);
        
        const ogImage = document.getElementById('og-image');
        if (ogImage) ogImage.setAttribute('content', imageUrl);
        
        const ogUrl = document.getElementById('og-url');
        if (ogUrl) ogUrl.setAttribute('content', url);
        
        // Update Twitter tags
        const twTitle = document.getElementById('twitter-title');
        if (twTitle) twTitle.setAttribute('content', title);
        
        const twDesc = document.getElementById('twitter-description');
        if (twDesc) twDesc.setAttribute('content', excerpt);
        
        const twImage = document.getElementById('twitter-image');
        if (twImage) twImage.setAttribute('content', imageUrl);
        
        // Update standard meta
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc) metaDesc.setAttribute('content', excerpt);
        
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = title + ' | THE MIRROR JAMMU KASHMIR';
        
        console.log('Meta tags updated for:', title);
    }
    
    function fixShareButtons(article) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(article.title);
        const description = encodeURIComponent(article.excerpt);
        const image = encodeURIComponent(window.location.origin + (article.heroImage.startsWith('/') ? '' : '/') + article.heroImage);
        
        const shareLinks = {
            'share-facebook': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            'share-twitter': `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            'share-whatsapp': `https://api.whatsapp.com/send?text=${title}%20${url}`,
            'share-linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            'share-telegram': `https://t.me/share/url?url=${url}&text=${title}`,
            'share-reddit': `https://www.reddit.com/submit?url=${url}&title=${title}`,
            'share-pinterest': `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${description}`,
            'share-email': `mailto:?subject=${title}&body=${description}%0A${url}`
        };
        
        for (const [id, href] of Object.entries(shareLinks)) {
            const link = document.getElementById(id);
            if (link) {
                link.href = href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        }
        
        // Also fix the article share button if it exists
        const articleShareBtn = document.getElementById('article-share-btn');
        if (articleShareBtn) {
            articleShareBtn.addEventListener('click', function(e) {
                const tooltip = document.getElementById('share-tooltip');
                if (tooltip) {
                    tooltip.classList.toggle('show');
                } else {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${decodeURIComponent(url)}`, '_blank');
                }
            });
        }
        
        console.log('Share buttons fixed');
    }
    
    // Run only on article pages
    if (window.location.pathname.includes('article.html') || window.location.search.includes('id=')) {
        document.addEventListener('DOMContentLoaded', waitForArticle);
        // Also try immediately if already loaded
        if (document.readyState === 'complete') {
            waitForArticle();
        }
    }
})();
