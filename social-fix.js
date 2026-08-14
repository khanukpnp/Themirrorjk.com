/* ============================================================
   THE MIRROR JAMMU KASHMIR - SOCIAL SHARING & META PIPELINE
   ============================================================ */
(function() {
    function initSocialMetaData() {
        // Wait until script.js dynamically renders the article page
        const checkInterval = setInterval(function() {
            const h1Title = document.querySelector('article.prose-container h1');
            
            if (h1Title && h1Title.textContent.trim() !== '') {
                clearInterval(checkInterval);
                
                const titleText = h1Title.textContent.trim();
                const firstParagraph = document.querySelector('.article-body-content p')?.textContent?.trim() || 'Read the latest from THE MIRROR JAMMU KASHMIR';
                const heroImgEl = document.querySelector('article.prose-container figure img');
                
                let heroImgSrc = heroImgEl ? heroImgEl.getAttribute('src') : 'content/images/logo.png';
                if (heroImgSrc && !heroImgSrc.startsWith('http')) {
                    heroImgSrc = window.location.origin + (heroImgSrc.startsWith('/') ? '' : '/') + heroImgSrc;
                }
                
                const articleData = {
                    title: titleText,
                    excerpt: firstParagraph.substring(0, 160) + '...',
                    heroImage: heroImgSrc,
                    url: window.location.href
                };
                
                updateMetaTags(articleData);
                attachShareButtonHandler(articleData);
            }
        }, 100);
    }

    function updateMetaTags(article) {
        document.title = article.title + ' | THE MIRROR JAMMU KASHMIR';
        
        setMetaContent('property', 'og:title', article.title);
        setMetaContent('property', 'og:description', article.excerpt);
        setMetaContent('property', 'og:image', article.heroImage);
        setMetaContent('property', 'og:url', article.url);
        
        setMetaContent('name', 'twitter:title', article.title);
        setMetaContent('name', 'twitter:description', article.excerpt);
        setMetaContent('name', 'twitter:image', article.heroImage);
        setMetaContent('name', 'description', article.excerpt);
    }

    function setMetaContent(attrName, attrValue, content) {
        let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attrName, attrValue);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    function attachShareButtonHandler(article) {
        const shareBtn = document.getElementById('share') || document.querySelector('button[data-id="share"]');
        
        if (shareBtn) {
            const cleanBtn = shareBtn.cloneNode(true);
            shareBtn.parentNode.replaceChild(cleanBtn, shareBtn);
            
            cleanBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (navigator.share) {
                    navigator.share({
                        title: article.title,
                        text: article.excerpt,
                        url: article.url
                    }).catch(err => console.log('Share dismissed:', err));
                } else {
                    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`;
                    window.open(fbShareUrl, '_blank', 'width=600,height=400');
                }
            });
        }
    }

    if (window.location.pathname.includes('article.html') || window.location.search.includes('id=')) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initSocialMetaData();
        } else {
            document.addEventListener('DOMContentLoaded', initSocialMetaData);
        }
    }
})();
