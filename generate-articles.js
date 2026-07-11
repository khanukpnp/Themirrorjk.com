// generate-articles.js
// Run with: node generate-articles.js
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    siteUrl: 'https://themirrorjk.com',
    siteName: 'THE MIRROR JAMMU KASHMIR',
    siteDescription: 'Champion Justice & Amplify the Voices of the Unheard - Independent Digital Media Platform',
    logoImage: 'content/images/logo.png',
    contentDir: './content',
    outputDir: './articles',
    templateFile: './article-template.html',
    indexFile: './articles/index.json' // For listing all articles
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Read all JSON files from content directory
function getAllArticles() {
    const files = fs.readdirSync(CONFIG.contentDir);
    const articles = [];
    
    files.forEach(file => {
        if (file.endsWith('.json') && file !== 'index.json' && file !== 'youtube.json') {
            try {
                const filePath = path.join(CONFIG.contentDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                let data = JSON.parse(content);
                
                // Handle items wrapper
                let article = data;
                if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                    article = data.items[0];
                } else if (Array.isArray(data) && data.length > 0) {
                    article = data[0];
                }
                
                if (article && article.id) {
                    articles.push(article);
                }
            } catch (e) {
                console.error(`Error parsing ${file}:`, e.message);
            }
        }
    });
    
    return articles;
}

// Generate article HTML
function generateArticleHTML(article) {
    const id = article.id;
    const title = escapeHtml(article.title || 'Untitled');
    const description = escapeHtml(article.excerpt || article.summary || CONFIG.siteDescription);
    const author = escapeHtml(article.author || 'The Mirror JK');
    const date = article.date ? new Date(article.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Get image URL
    let imageUrl = CONFIG.logoImage;
    if (article.heroImage) {
        if (typeof article.heroImage === 'string') {
            imageUrl = article.heroImage;
        } else if (article.heroImage.src) {
            imageUrl = article.heroImage.src;
        }
    }
    
    // Ensure image URL is absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${CONFIG.siteUrl}/${imageUrl}`;
    }
    
    const articleUrl = `${CONFIG.siteUrl}/articles/${id}.html`;
    
    // Generate complete HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${title} | ${CONFIG.siteName}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="author" content="${author}">
    <meta name="keywords" content="${article.tags ? article.tags.join(', ') : 'Jammu Kashmir, news, editorial, history, human rights'}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:site_name" content="${CONFIG.siteName}">
    <meta property="article:published_time" content="${date}">
    <meta property="article:author" content="${author}">
    <meta property="article:tag" content="${article.tags ? article.tags.join(', ') : ''}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${articleUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="@TheMirrorJK">
    <meta name="twitter:creator" content="@NasirKhanUKPNP">
    
    <!-- Additional SEO -->
    <link rel="canonical" href="${articleUrl}">
    <meta name="robots" content="index, follow">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght=700;900&family=Source+Sans+Pro:wght=400;600;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <style>
        /* Loading State */
        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: #666;
        }
        .loading-state .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #b30000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Reading Progress Bar -->
    <div class="reading-progress" id="reading-progress"></div>
    
    <main class="article-page">
        <!-- Category Label -->
        <div id="section-label" class="category-label"></div>
        
        <!-- Article Title -->
        <h1 id="title"></h1>
        
        <!-- Article Meta Information -->
        <div id="meta" class="article-meta"></div>
        
        <!-- Hero Image Container -->
        <div id="heroWrap" class="hero-image-container" style="display: none;">
            <img id="heroImg" src="" alt="">
            <div id="heroCaption"></div>
        </div>
        
        <!-- Loading State -->
        <div id="loading-state" class="loading-state">
            <div class="spinner"></div>
            <p>Loading article, clocks, calendars and headlines...</p>
        </div>
        
        <!-- Article Content -->
        <div id="content" class="clearfix" style="display: none;"></div>
        
        <!-- Next Article Suggestion -->
        <div class="next-article-text" id="next-article-suggestion" style="display: none;"></div>
    </main>
    
    <!-- Share Tooltip Links Fixed to Match Engine Layout IDs -->
    <div class="share-tooltip" id="share-tooltip">
        <a href="#" id="share-facebook"><span>📘</span> Facebook</a>
        <a href="#" id="share-twitter"><span>🐦</span> X (Twitter)</a>
        <a href="#" id="share-whatsapp"><span>📱</span> WhatsApp</a>
        <a href="#" id="share-email"><span>📧</span> Email</a>
    </div>
    
    <!-- Footer -->
    <footer class="footer">
        <p>© <span id="year"></span> ${CONFIG.siteName}. All rights reserved.</p>
    </footer>
    
    <script>
        // Pass article data globally to JavaScript execution environment
        window.ARTICLE_DATA = ${JSON.stringify(article)};
        window.ARTICLE_ID = "${id}";
    </script>
    <script src="/script.js"></script>
</body>
</html>`;
}

// Helper: Escape HTML special characters
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Generate all articles
function generateAllArticles() {
    console.log('📖 Reading articles from', CONFIG.contentDir);
    const articles = getAllArticles();
    console.log(`✅ Found ${articles.length} articles`);
    
    const generated = [];
    
    articles.forEach(article => {
        const html = generateArticleHTML(article);
        const outputPath = path.join(CONFIG.outputDir, `${article.id}.html`);
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`  ✅ Generated: ${outputPath}`);
        generated.push({
            id: article.id,
            title: article.title,
            slug: article.slug,
            date: article.date,
            excerpt: article.excerpt,
            url: `/articles/${article.id}.html`
        });
    });
    
    // Generate index file for reference
    const indexData = {
        generatedAt: new Date().toISOString(),
        totalArticles: generated.length,
        articles: generated
    };
    fs.writeFileSync(CONFIG.indexFile, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`\n✅ Index saved to: ${CONFIG.indexFile}`);
    console.log(`\n🎉 Done! Generated ${generated.length} article pages.`);
}

// Run the generator
generateAllArticles();
