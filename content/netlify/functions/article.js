import fs from "fs";
import path from "path";

export async function handler(event, context) {
  const id = event.queryStringParameters.id;

  // Locate JSON file
  const filePath = path.join(process.cwd(), "content", `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return { statusCode: 404, body: "Article not found" };
  }

  // Read JSON data
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Build absolute hero image URL
  const imageUrl = `https://themirrorjk.com/${data.heroImage?.src || "content/images/default.jpg"}`;
  const canonicalUrl = `https://themirrorjk.com/article.html?id=${id}`;

  // Generate HTML for social media crawlers
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${data.title}</title>
<link rel="canonical" href="${canonicalUrl}" />

<!-- Primary Meta -->
<meta name="title" content="${data.title}">
<meta name="description" content="${data.excerpt}">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.excerpt}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="The Mirror Jammu Kashmir">

<!-- Article Metadata -->
<meta property="article:published_time" content="${data.date}">
<meta property="article:author" content="${data.author}">
<meta property="article:section" content="${data.category}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${data.title}">
<meta name="twitter:description" content="${data.excerpt}">
<meta name="twitter:image" content="${imageUrl}">

<!-- Redirect -->
<meta http-equiv="refresh" content="0; url=${canonicalUrl}" />
</head>
<body>
Redirecting to article...
</body>
</html>
`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  };
}
