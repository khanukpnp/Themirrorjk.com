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

  // Build absolute image URL
  let imageUrl = "https://themirrorjk.com/content/images/logo.png";
  if (data.heroImage) {
    if (typeof data.heroImage === 'string') {
      imageUrl = data.heroImage.startsWith('http') ? data.heroImage : `https://themirrorjk.com/${data.heroImage}`;
    } else if (data.heroImage.src) {
      imageUrl = data.heroImage.src.startsWith('http') ? data.heroImage.src : `https://themirrorjk.com/${data.heroImage.src}`;
    }
  }
  
  // Clean up image URL
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

  // Generate HTML with ONLY meta tags - NO redirect (crawlers will read this)
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
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(excerpt.substring(0, 200))}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:site" content="@TheMirrorJK">
  
  <!-- Article Metadata -->
  <meta property="article:published_time" content="${data.date || ''}">
  <meta property="article:author" content="${escapeHtml(data.author || 'Editorial Desk')}">
  <meta property="article:section" content="${escapeHtml(data.category || 'News')}">
  
  <!-- Robots - allow indexing -->
  <meta name="robots" content="index, follow">
  
  <!-- Tell crawlers the real URL -->
  <link rel="alternate" href="${canonicalUrl}">
  
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
    .view-article {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 20px;
      background: #b30000;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
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
      <a href="${canonicalUrl}" class="view-article">Read Full Article →</a>
    </div>
  </div>
  <hr>
  <div class="footer-text">
    THE MIRROR JAMMU KASHMIR — Champion Justice & Amplify the Voices of the Unheard
  </div>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600"
    },
    body: html
  };
}
