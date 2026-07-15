/* ============================================================
SOCIAL SHARING FIX - Optimized & Aligned with Modern Article Page
============================================================ */
(function() {
    // Wait for article to load
    function waitForArticle() {
        const checkInterval = setInterval(function() {
            const titleEl = document.getElementById('title');
            if (titleEl && titleEl.textContent && titleEl.textContent.trim() !== '') {
                clearInterval(checkInterval);
                
                // Get article data directly from the rendered page
                const articleData = {
                    title: titleEl.textContent,
                    excerpt: document.querySelector('#content p')?.textContent?.substring(0, 160) || 'Read the latest from THE MIRROR JAMMU KASHMIR',
                    heroImage: document.getElementById('heroImg')?.getAttribute('src') || '/content/images/logo.png'
                };
                
                // Update meta tags for social preview
                updateMetaTags(articleData);
                
                // Fix share buttons inside the tooltip
                fixShareButtons(articleData);
                
                // Setup Toggle for Share Buttons
                setupShareDropdown();
            }
        }, 100);
    }
    
    function updateMetaTags(article) {
        const url = window.location.href;
        const title = article.title;
        const excerpt = article.excerpt;
        let imageUrl = article.heroImage;
        
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = window.location.origin + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
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
        
        // Safely resolve clean complete image source
        let absoluteImg = article.heroImage;
        if (absoluteImg && !absoluteImg.startsWith('http')) {
            absoluteImg = window.location.origin + (absoluteImg.startsWith('/') ? '' : '/') + absoluteImg;
        }
        const image = encodeURIComponent(absoluteImg);
        
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
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
        
        console.log('Share tooltip links initialized successfully.');
    }
    
    function setupShareDropdown() {
        // Target both old design IDs and the new modern button IDs
        const actionShareBtn = document.getElementById('action-share') || document.getElementById('article-share-btn');
        const tooltip = document.getElementById('share-tooltip');
        
        if (actionShareBtn && tooltip) {
            // Remove any old listeners first
            const clone = actionShareBtn.cloneNode(true);
            actionShareBtn.parentNode.replaceChild(clone, actionShareBtn);
            
            clone.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                tooltip.classList.toggle('show');
            });
            
            // Auto close if clicking anywhere else outside the menu
            document.addEventListener('click', function(e) {
                if (!tooltip.contains(e.target) && e.target !== clone) {
                    tooltip.classList.remove('show');
                }
            });
        }
    }
    
    // Run validation only on article pages
    if (window.location.pathname.includes('article.html') || window.location.search.includes('id=')) {
        document.addEventListener('DOMContentLoaded', waitForArticle);
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            waitForArticle();
        }
    }
})();
