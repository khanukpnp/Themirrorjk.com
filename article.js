/* ============================================================
   THE MIRROR JAMMU KASHMIR — ARTICLE ENGINE
   Handles: dynamic loading, metadata, hero image, clocks,
   Bikrami calendar, navigation, share buttons, read-more section
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const articleId = document.querySelector("main.article-page").dataset.defaultId;

    const titleEl = document.getElementById("title");
    const metaEl = document.getElementById("meta");
    const contentEl = document.getElementById("content");
    const loadingState = document.getElementById("loading-state");
    const heroWrap = document.getElementById("heroWrap");
    const heroImg = document.getElementById("heroImg");
    const heroCaption = document.getElementById("heroCaption");

    const readMoreSection = document.getElementById("read-more-section");
    const readMoreHeroImg = document.getElementById("readMoreHeroImg");
    const readMoreHeroCaption = document.getElementById("readMoreHeroCaption");
    const readMoreContent = document.getElementById("read-more-content");

    const sectionLabel = document.getElementById("section-label");

    const likeBtn = document.getElementById("btn-like");
    const likeCount = document.getElementById("like-count");

    const shareTooltip = document.getElementById("share-tooltip");
    const shareBtn = document.getElementById("btn-share");

    const prevBtn = document.getElementById("prev-article");
    const nextBtn = document.getElementById("next-article");
    const navWrap = document.getElementById("article-nav");

    const nextSuggestion = document.getElementById("next-article-suggestion");

    /* ------------------------------------------------------------
       Fetch Article JSON
       ------------------------------------------------------------ */
    fetch(`articles/${articleId}.json`)
        .then(res => res.json())
        .then(data => {
            loadingState.style.display = "none";

            /* Title */
            titleEl.textContent = data.title;

            /* Category Label */
            sectionLabel.textContent = data.category.toUpperCase();

            /* Metadata */
            metaEl.innerHTML = `
                <span>${data.author}</span> • 
                <span>${data.location}</span> • 
                <span>${data.date}</span>
            `;

            /* Hero Image */
            if (data.hero && data.hero.src) {
                heroWrap.style.display = "block";
                heroImg.src = data.hero.src;
                heroCaption.textContent = data.hero.caption || "";
            }

            /* Main Content */
            contentEl.style.display = "block";
            contentEl.innerHTML = data.content;

            /* Read More Section */
            if (data.readMore && data.readMore.content) {
                readMoreSection.style.display = "block";
                readMoreContent.innerHTML = data.readMore.content;

                if (data.hero && data.hero.src) {
                    readMoreHeroImg.src = data.hero.src;
                    readMoreHeroCaption.textContent = data.hero.caption || "";
                }
            }

            /* Navigation */
            if (data.prev) {
                prevBtn.style.display = "inline-block";
                prevBtn.href = `article.html?id=${data.prev}`;
            }
            if (data.next) {
                nextBtn.style.display = "inline-block";
                nextBtn.href = `article.html?id=${data.next}`;
                nextSuggestion.style.display = "block";
                nextSuggestion.textContent = `Next: ${data.nextTitle}`;
            }

            navWrap.style.display = "flex";

            /* Meta Tags */
            document.getElementById("og-title").content = data.title;
            document.getElementById("og-description").content = data.summary;
            document.getElementById("og-image").content = data.hero.src;

            document.getElementById("twitter-title").content = data.title;
            document.getElementById("twitter-description").content = data.summary;
            document.getElementById("twitter-image").content = data.hero.src;

            document.getElementById("meta-description").content = data.summary;
            document.getElementById("page-title").textContent = data.title;

        })
        .catch(err => {
            loadingState.innerHTML = "<p>Error loading article.</p>";
        });

    /* ------------------------------------------------------------
       Like Button
       ------------------------------------------------------------ */
    let likes = 0;
    likeBtn.addEventListener("click", () => {
        likes++;
        likeCount.textContent = likes;
    });

    /* ------------------------------------------------------------
       Share Tooltip
       ------------------------------------------------------------ */
    shareBtn.addEventListener("click", () => {
        shareTooltip.classList.toggle("visible");
    });

    document.addEventListener("click", (e) => {
        if (!shareTooltip.contains(e.target) && e.target !== shareBtn) {
            shareTooltip.classList.remove("visible");
        }
    });

    /* ------------------------------------------------------------
       Reading Progress Bar
       ------------------------------------------------------------ */
    const progressBar = document.getElementById("reading-progress");
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + "%";
    });

    /* ------------------------------------------------------------
       Footer Year
       ------------------------------------------------------------ */
    document.getElementById("year").textContent = new Date().getFullYear();
});
