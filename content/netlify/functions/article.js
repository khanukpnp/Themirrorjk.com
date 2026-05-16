import fs from "fs";
import path from "path";

export async function handler(event, context) {
  const id = event.queryStringParameters.id;
  const filePath = path.join(process.cwd(), "content", `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return { statusCode: 404, body: "Article not found" };
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta property="og:title" content="${data.title}">
      <meta property="og:description" content="${data.description}">
      <meta property="og:image" content="${data.image}">
      <meta property="og:url" content="https://themirrorjk.com/article?id=${id}">
      <title>${data.title}</title>
    </head>
    <body>
      <script>
        window.location.href = "/article.html?id=${id}";
      </script>
    </body>
    </html>
  `;
  return { statusCode: 200, headers: { "Content-Type": "text/html" }, body: html };
}
