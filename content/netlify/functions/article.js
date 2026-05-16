import fs from "fs";
import path from "path";

export async function handler(event, context) {
  const id = event.queryStringParameters.id;

  const filePath = path.join(process.cwd(), "content", `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return { statusCode: 404, body: "Article not found" };
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Build absolute image URL
  const imageUrl = `https://themirrorjk.com/${data.heroImage.src}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.excerpt}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="https://themirrorjk.com/article.html?id=${id}">
    <meta property="og:site_name" content="The Mirror Jammu Kashmir">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${data.title}">
    <meta name="twitter:description" content="${data.excerpt}">
    <meta name="twitter:image" content="${imageUrl}">

    <title>${data.title}</title>
  </head>

  <body>
    <script>
      window.location.href = "/article.html?id=${id}";
    </script>
  </body>
  </html>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  };
}
