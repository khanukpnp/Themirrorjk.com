const id = new URLSearchParams(location.search).get("id");
if (!id) return;

fetch("content/articles.json", { cache: "no-store" })
  .then(res => res.json())
  .then(data => {

    const article = data.items.find(x => x.id === id);
    if (!article) return;

    $("#title").textContent = article.title;
    $("#meta").textContent =
      `${article.location || ""} · ${article.date} · ${article.readTime}`;

    if (article.heroImage?.src) {
      $("#heroWrap").style.display = "block";
      $("#heroImg").src = article.heroImage.src;
      $("#heroCaption").textContent =
        (article.heroImage.caption || "") +
        (article.heroImage.credit ? " © " + article.heroImage.credit : "");
    }

    const content = $("#content");
    content.innerHTML = "";

    article.body.forEach(block => {

      if (block.type === "paragraph") {
        const p = document.createElement("p");
        p.textContent = block.text;
        content.appendChild(p);
      }

      if (block.type === "image") {
        const fig = document.createElement("figure");
        fig.innerHTML =
          `<img src="${block.src}">
           <figcaption>${block.caption || ""}</figcaption>`;
        content.appendChild(fig);
      }

    });

    applyImageFallback(content);

  })
  .catch(err => console.error("Article load error:", err));
