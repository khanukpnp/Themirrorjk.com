import fs from "fs";
import path from "path";

export async function handler(event, context) {
  const id = event.queryStringParameters.id;

  if (!id) {
    return {
      statusCode: 400,
      body: "<html><body><h1>Missing article id parameter</h1></body></html>"
    };
  }

  // Try multiple possible paths for the JSON file
  const possiblePaths = [
    path.join(process.cwd(), "content", `${id}.json`),
    path.join(process.cwd(), "..", "content", `${id}.json`),
    path.join(__dirname, "..", "..", "..", "content", `${id}.json`),
    path.join(process.cwd(), "public", "content", `${id}.json`)
  ];

  let filePath = null;
  for (const tryPath of possiblePaths) {
    if (fs.existsSync(tryPath)) {
      filePath = tryPath;
      break;
    }
  }

  if (!filePath) {
    return {
      statusCode: 404,
      body: `<html><body><h1>Article "${id}" not found</h1></body></html>`
    };
  }

  // Read JSON data
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Handle nested data structures
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      data = data.items[0];
    } else if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }
  } catch (e) {
    return { statusCode: 500, body: "<html><body><h1>Error reading article data</h1></body></html>" };
  }

  // Build absolute image URL - FIXED with better handling
  let imageUrl = "https://themirrorjk.com/content/images/logo.png";
  if (data.heroImage) {
    if (typeof data.heroImage === 'string') {
      imageUrl = data.heroImage.startsWith('http') ? data.heroImage : `https://themirrorjk.com/${data.heroImage}`;
    } else if (data.heroImage.src) {
      imageUrl = data.heroImage.src.startsWith('http') ? data.heroImage.src : `https://themirrorjk.com/${data.heroImage.src}`;
    }
  }
  
  // Clean up image URL - remove any double slashes
  imageUrl = imageUrl.replace(/([^:]\/)\/+/g, "$1");

  const canonicalUrl = `https://themirrorjk.com/article.html?id=${id}`;
  const title = data.title || "THE MIRROR JAMMU KASHMIR";
  const excerpt = data.excerpt || data.summary || "Read the latest from THE MIRROR JAMMU KASHMIR.";
  
  // Escape special characters for HTML safety
  const escapeHtml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Generate HTML for social media crawlers - IMPROVED VERSION
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | THE MIRROR JAMMU KASHMIR</title>
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(title)}">
  <meta name="description" content="${escapeHtml(excerpt.substring(0, 200))}">
  
  <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(excerpt.substring(0, 200))}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="THE MIRROR JAMMU KASHMIR">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(excerpt.substring(0, 200))}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:site" content="@TheMirrorJK">
  <meta name="twitter:creator" content="@TheMirrorJK">
  
  <!-- Article Metadata -->
  <meta property="article:published_time" content="${data.date || ''}">
  <meta property="article:author" content="${escapeHtml(data.author || 'Editorial Desk')}">
  <meta property="article:section" content="${escapeHtml(data.category || 'News')}">
  
  <!-- Additional Meta Tags -->
  <meta name="robots" content="index, follow">
  <meta name="language" content="English">
  
  <!-- Image dimensions for better preview -->
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  
  <!-- Force refresh for crawlers -->
  <meta http-equiv="last-modified" content="${new Date().toUTCString()}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #222;
      background: #fff;
    }
    .preview-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-top: 20px;
    }
    .preview-image {
      background: #f5f5f5;
      text-align: center;
    }
    .preview-image img {
      width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: cover;
    }
    .preview-content {
      padding: 24px;
    }
    .preview-site {
      color: #b30000;
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .preview-title {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 12px;
      color: #1a1a1a;
    }
    .preview-description {
      color: #555;
      margin-bottom: 12px;
      font-size: 1rem;
    }
    .preview-url {
      color: #666;
      font-size: 0.8rem;
      word-break: break-all;
    }
    .redirect-note {
      text-align: center;
      margin-top: 30px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .redirect-note a {
      color: #b30000;
      text-decoration: none;
      font-weight: 600;
    }
    .redirect-note a:hover {
      text-decoration: underline;
    }
    hr {
      margin: 30px 0 20px;
      border: none;
      border-top: 1px solid #e0e0e0;
    }
    .footer-text {
      font-size: 0.8rem;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="preview-card">
    <div class="preview-image">
      <img src="${imageUrl}" alt="${escapeHtml(title)}" onerror="this.src='https://themirrorjk.com/content/images/logo.png'">
    </div>
    <div class="preview-content">
      <div class="preview-site">THE MIRROR JAMMU KASHMIR</div>
      <div class="preview-title">${escapeHtml(title)}</div>
      <div class="preview-description">${escapeHtml(excerpt.substring(0, 300))}</div>
      <div class="preview-url">${canonicalUrl}</div>
    </div>
  </div>
  <div class="redirect-note">
    ⏳ Redirecting to full article... <a href="${canonicalUrl}">Click here</a> if not redirected automatically.
  </div>
  <hr>
  <div class="footer-text">
    THE MIRROR JAMMU KASHMIR — Champion Justice & Amplify the Voices of the Unheard
  </div>
  
  <script>
    // Immediate redirect for non-crawler user agents
    (function() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isCrawler = /bot|crawler|spider|facebook|twitter|whatsapp|slack|discord|telegram|linkedin|pinterest|reddit|skype|viber|wechat|curl|wget|python|java|php|perl|ruby|go|node|phantom|headless/i.test(userAgent);
      const isPreviewBot = /facebot|facebookexternalhit|twitterbot|whatsapp|slack|linkedinbot|pinterest|telegrambot|discordbot/i.test(userAgent);
      
      // Redirect if not a crawler and not already on the article page
      if (!isCrawler && !isPreviewBot && !window.location.href.includes('article-social')) {
        window.location.href = '${canonicalUrl}';
      }
    })();
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600" // Cache for 1 hour
    },
    body: html
  };
}
