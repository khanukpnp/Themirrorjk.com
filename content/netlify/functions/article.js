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
    path.join(__dirname, "..", "..", "..", "content", `${id}.json`)
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
  
  const canonicalUrl = `https://themirrorjk.com/article.html?id=${id}`;
  const title = data.title || "THE MIRROR JAMMU KASHMIR";
  const excerpt = data.excerpt || data.summary || "Read the latest from THE MIRROR JAMMU KASHMIR.";

  // Generate HTML for social media crawlers only (no redirect - let crawlers see meta tags)
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | THE MIRROR JAMMU KASHMIR</title>
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Primary Meta -->
  <meta name="title" content="${title}">
  <meta name="description" content="${excerpt.substring(0, 200)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${excerpt.substring(0, 200)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="THE MIRROR JAMMU KASHMIR">
  
  <!-- Article Metadata -->
  <meta property="article:published_time" content="${data.date || ''}">
  <meta property="article:author" content="${data.author || 'Editorial Desk'}">
  <meta property="article:section" content="${data.category || 'News'}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${excerpt.substring(0, 200)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:site" content="@TheMirrorJK">
  
  <!-- Tell crawlers this is the page (don't redirect) -->
  <meta name="robots" content="index, follow">
  
  <!-- Client-side redirect for humans (preserves meta tags for crawlers) -->
  <script>
    // Only redirect if this is a crawler request (check user-agent)
    const isCrawler = /bot|crawler|spider|facebook|twitter|whatsapp|slack|discord|telegram/i.test(navigator.userAgent);
    if (!isCrawler && !window.location.pathname.includes('/article-social')) {
      window.location.href = '${canonicalUrl}';
    }
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 50px auto; padding: 20px; line-height: 1.6;">
  <h1>${title}</h1>
  <p><strong>${data.author || 'Editorial Desk'}</strong> | ${data.date ? new Date(data.date).toLocaleDateString() : ''}</p>
  <div style="margin: 20px 0;">
    <img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px;">
  </div>
  <p>${excerpt.substring(0, 500)}...</p>
  <p><a href="${canonicalUrl}" style="display: inline-block; background: #b30000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Read full article →</a></p>
  <hr>
  <p style="font-size: 0.8rem; color: #666;">THE MIRROR JAMMU KASHMIR — Champion Justice & Amplify the Voices of the Unheard</p>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  };
}
