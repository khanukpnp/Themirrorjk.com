/* ============================================================
PAGE LOADER
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  initLoader();

  initYear();

  updateGregorian();
  updateHijri();
  updateBikrami();
  updateClocks();

  initWeatherBar();
  initTicker();
  initNav();
  initContactModal();
  initVlogs();

  /* Auto-refresh */

  setInterval(updateGregorian, 1000);
  setInterval(updateHijri, 60000);
  setInterval(updateBikrami, 60000);
  setInterval(updateClocks, 1000);

  /* Homepage content loader */

  loadHomepageIndex();

  /* Load homepage sections (Latest, Editorial, Historical) */

  if(document.getElementById("latest-media") ||
     document.getElementById("editorial-media") ||
     document.getElementById("historical-media")){

      loadHomepageSections();

  }

/* ============================================================
ARTICLE / STATIC PAGE LOADER
============================================================ */

function loadArticlePage(){

const params = new URLSearchParams(window.location.search);
let id = params.get("id");

const path = window.location.pathname.toLowerCase();

/* detect static pages */

if(!id){

if(path.includes("about")) id = "about-001";
else if(path.includes("chief-editor")) id = "chief-editor-001";
else if(path.includes("blog")) id = "blog-001";

}

/* stop safely if no article id */

if(!id) return;


/* load json */

fetch(`content/${id}.json`)

.then(res => {

if(!res.ok){
console.error("Article JSON not found:", id);
return null;
}

return res.json();

})

.then(article => {

if(!article) return;


/* page elements */

const title = document.getElementById("title");
const label = document.getElementById("section-label");
const meta = document.getElementById("meta");
const hero = document.getElementById("heroImg");
const caption = document.getElementById("heroCaption");
const content = document.getElementById("content");

if(!content) return;


/* header */

if(title) title.textContent = article.title;

if(label) label.textContent = article.sectionLabel || "";

if(meta){

const d = new Date(article.date).toLocaleDateString();

meta.textContent =
`${article.author} | ${article.location} | ${d} | ${article.readTime}`;

}


/* hero image */

if(hero && article.heroImage?.src) hero.src = article.heroImage.src;

if(caption) caption.textContent = article.heroImage?.caption || "";


/* clear content */

content.innerHTML = "";


/* render article blocks */

article.body.forEach(block => {

if(block.type === "paragraph"){

content.innerHTML += `<p>${block.text}</p>`;

}

if(block.type === "subheading"){

content.innerHTML += `<h2 class="mid-subheading">${block.text}</h2>`;

}

if(block.type === "pullquote"){

content.innerHTML += `<div class="pull-quote">${block.text}</div>`;

}

if(block.type === "points"){

content.innerHTML += `
<div class="important-points">
<ul>
${block.items.map(i => `<li>${i}</li>`).join("")}
</ul>
</div>
`;

}

if(block.type === "image"){

const align = block.align === "right" ? "img-right" : "img-left";

content.innerHTML += `
<figure class="${align}">
<img src="${block.src}" loading="lazy">
<figcaption>${block.caption || ""}</figcaption>
</figure>
`;

}

});


/* ============================================================
ARTICLE ACTION BAR
============================================================ */

content.innerHTML += `

<div class="article-actions">

<button class="action-btn" onclick="likeArticle()">👍 Like</button>

<button class="action-btn" onclick="subscribeChannel()">🔔 Subscribe</button>

<button class="action-btn" onclick="shareArticle()">🔗 Share</button>

<button class="action-btn" onclick="copyLink()">📋 Copy Link</button>

</div>

`;

})

.catch(err => console.error("Article load error:", err));

}
  
/* ============================================================
FOOTER YEAR
============================================================ */

function initYear() {

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

}


/* ============================================================
GREGORIAN DATE (FULL DATE + TIME)
============================================================ */

function updateGregorian() {

  const el = document.querySelector("#cal-gregorian span");
  if (!el) return;

  const now = new Date();

  const datePart = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timePart = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  el.textContent = `${datePart} at ${timePart}`;

}


/* ============================================================
HIJRI DATE
============================================================ */

function updateHijri() {

  const el = document.querySelector("#cal-hijri span");
  if (!el) return;

  try {

    const now = new Date();

    const hijriDate = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);

    el.textContent = hijriDate;

  } catch {

    el.textContent = "Hijri calendar";

  }

}


/* ============================================================
PUNJABI DESI BIKRAMI DATE
============================================================ */

function updateBikrami() {

  const el = document.querySelector("#cal-bikrami span");
  if (!el) return;

  const now = new Date();

  const months = [
    "Chet","Vaisakh","Jeth","Harh","Sawan","Bhadon",
    "Assu","Kattak","Maghar","Poh","Magh","Phagun"
  ];

  const startMonth = 2;

  const month = (now.getMonth() - startMonth + 12) % 12;

  const year = now.getFullYear() + 57;

  const day = now.getDate();

  el.textContent = `${day} ${months[month]} ${year} BK`;

}


/* ============================================================
CLOCKS — CEST / IST / PKT
============================================================ */

function updateClocks() {

  const now = new Date();

  const cestEl = document.querySelector("#clock-cest span");
  if (cestEl) {
    cestEl.textContent = now.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  const istEl = document.querySelector("#tz-ist span");
  if (istEl) {
    istEl.textContent = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  const pktEl = document.querySelector("#tz-pkt span");
  if (pktEl) {
    pktEl.textContent = now.toLocaleTimeString("en-PK", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

}


/* ============================================================
WEATHER BAR
============================================================ */

function initWeatherBar() {

  const bar = document.getElementById("weather-bar");
  if (!bar) return;

  const cities = [
    { name: "Zurich", temp: "7°C" },
    { name: "Rawalakot", temp: "9°C" },
    { name: "Jammu", temp: "18°C" },
    { name: "Kashmir", temp: "5°C" },
    { name: "Ladakh", temp: "2°C" },
    { name: "Gilgit", temp: "3°C" },
    { name: "Baltistan", temp: "3°C" },
    { name: "Muzaffarabad", temp: "8°C" }
  ];

  bar.innerHTML = cities
    .map(
      c => `
      <div class="chip tiny">
        🌡️ ${c.name}: <strong>${c.temp}</strong>
      </div>
    `
    )
    .join("");

}


/* ============================================================
TICKER
============================================================ */

function initTicker() {

  const ul = document.getElementById("ticker-items");
  if (!ul) return;

  const items = [
    "WE DO NOT MANUFACTURE NARRATIVES — WE REFLECT REALITY",
    "THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER, POLICY, HISTORY AND TRUTH"
  ];

  /* create duplicated list for continuous scroll */
  const fullList = items.concat(items);

  ul.innerHTML = fullList.map(t => `<li class="ticker-item">${t}</li>`).join("");

  /* layout */
  ul.style.display = "flex";
  ul.style.gap = "60px";
  ul.style.whiteSpace = "nowrap";
  ul.style.alignItems = "center";
  ul.style.willChange = "transform";

  /* smooth animation */
  let position = 0;

  function scrollTicker(){

    position -= 0.4;

    if(Math.abs(position) >= ul.scrollWidth / 2){
      position = 0;
    }

    ul.style.transform = `translateX(${position}px)`;

    requestAnimationFrame(scrollTicker);
  }

  scrollTicker();
}
/* ============================================================
NAVIGATION
============================================================ */

function initNav() {

  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !navList || !mobileMenu) return;

  hamburger.addEventListener("click", () => {

    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));

    if (expanded) {
      mobileMenu.hidden = true;
      mobileMenu.innerHTML = "";
    } else {
      mobileMenu.hidden = false;
      mobileMenu.innerHTML = navList.innerHTML;
    }

  });

}


/* ============================================================
CONTACT MODAL
============================================================ */

function initContactModal() {

  const openBtn = document.getElementById("contact-open");
  const closeBtn = document.getElementById("contact-close");
  const modal = document.getElementById("contact-modal");

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });

}


/* ============================================================
VLOGS
============================================================ */

function initVlogs() {

  const grid = document.getElementById("vlogs-grid");
  if (!grid) return;

  const vlogs = [
    { title: "Kashmir Protest Highlights", duration: "4:32" },
    { title: "Diaspora Voices on Human Rights", duration: "6:10" },
    { title: "Brief History of Jammu & Kashmir", duration: "8:45" }
  ];

  grid.innerHTML = vlogs
    .map(
      v => `
      <article class="card">
        <div class="media maroon">▶</div>
        <div class="card-body">
          <h3>${v.title}</h3>
          <p>Duration: ${v.duration}</p>
        </div>
      </article>
    `
    )
    .join("");

}


/* ============================================================
HOMEPAGE CONTENT LOADER
============================================================ */

function loadHomepageIndex() {

  fetch("content/index.json")

    .then(r => r.json())

    .then(data => {

      const hp = data.homepage || data;

      if (hp.topStories) loadTopStories(hp.topStories);

      if (hp.latestEditorialHistorical) loadLatestEditorialHistorical(hp.latestEditorialHistorical);

      if (hp.jammuKashmir) loadJammuKashmir(hp.jammuKashmir);

      if (hp.international) loadInternational(hp.international);

      if (hp.humanRights) loadHumanRights(hp.humanRights);

    })

    .catch(err => console.error("Index JSON error:", err));

}


/* ============================================================
TOP STORIES
============================================================ */

function loadTopStories(section) {

  if (section.lead) loadArticleToCard(section.lead, "lead-media", "lead-body");

  if (section.breaking) loadArticleToCard(section.breaking, "breaking-media", "breaking-body");

  if (section.opinion) loadArticleToCard(section.opinion, "opinion-media", "opinion-body");

}


/* ============================================================
UNIVERSAL ARTICLE LOADER
============================================================ */

function loadArticleToCard(articleId, mediaId, bodyId) {

  fetch(`content/${articleId}.json`)

    .then(r => r.json())

    .then(article => {

      renderArticleCard(mediaId, bodyId, article);

    })

    .catch(err => console.error(`Error loading ${articleId}:`, err));

}


/* ============================================================
RENDER ARTICLE CARD
============================================================ */

function renderArticleCard(mediaId, bodyId, article) {

  const mediaEl = document.getElementById(mediaId);

  const bodyEl = document.getElementById(bodyId);

  if (!mediaEl || !bodyEl) return;

  if (article.heroImage && article.heroImage.src) {

    mediaEl.innerHTML = `<img src="${article.heroImage.src}" alt="">`;

  }

  bodyEl.innerHTML = `

    <h3>${article.title}</h3>

    <p>${article.excerpt || article.summary || ""}</p>

    <a class="btn-red" href="article.html?id=${article.id}">Read More →</a>

  `;

}


/* ============================================================
ARTICLE PAGE LOADER
============================================================ */

function loadArticlePage(){

const params=new URLSearchParams(window.location.search);

const id=params.get("id");

if(!id)return;

fetch(`content/${id}.json`)
.then(r=>r.json())
.then(article=>{

const title=document.getElementById("title");
const label=document.getElementById("section-label");
const meta=document.getElementById("meta");
const hero=document.getElementById("heroImg");
const caption=document.getElementById("heroCaption");
const content=document.getElementById("content");

if(!content)return;

if(title)title.textContent=article.title;
if(label)label.textContent=article.sectionLabel||"";

if(meta){
const d=new Date(article.date).toLocaleDateString();
meta.textContent=`${article.author} | ${article.location} | ${d} | ${article.readTime}`;
}

if(hero && article.heroImage?.src) hero.src=article.heroImage.src;
if(caption) caption.textContent=article.heroImage?.caption||"";

content.innerHTML="";

article.body.forEach(block=>{

if(block.type==="paragraph"){
content.innerHTML+=`<p>${block.text}</p>`;
}

if(block.type==="subheading"){
content.innerHTML+=`<h2 class="mid-subheading">${block.text}</h2>`;
}

if(block.type==="pullquote"){
content.innerHTML+=`<div class="pull-quote">${block.text}</div>`;
}

if(block.type==="points"){
content.innerHTML+=`
<div class="important-points">
<ul>${block.items.map(i=>`<li>${i}</li>`).join("")}</ul>
</div>`;
}

if(block.type==="image"){
const align=block.align==="right"?"img-right":"img-left";
content.innerHTML+=`
<figure class="${align}">
<img src="${block.src}">
<figcaption>${block.caption||""}</figcaption>
</figure>`;
}

});

});

}

/* ============================================================
   LOAD HOMEPAGE CARDS (Latest, Editorial, Historical)
============================================================ */

async function loadHomepageSections(){

  try{

    const res = await fetch("content/index.json");
    const index = await res.json();

    /* ---------- Latest ---------- */

    if(index.latest && index.latest.length){
      const latestId = index.latest[0];
      const latestRes = await fetch(`content/${latestId}.json`);
      const latestArticle = await latestRes.json();
      renderArticleCard("latest-media","latest-body",latestArticle);
    }

    /* ---------- Editorial ---------- */

    if(index.editorial && index.editorial.length){
      const editorialId = index.editorial[0];
      const editorialRes = await fetch(`content/${editorialId}.json`);
      const editorialArticle = await editorialRes.json();
      renderArticleCard("editorial-media","editorial-body",editorialArticle);
    }

    /* ---------- Historical ---------- */

    if(index.historical && index.historical.length){
      const historicalId = index.historical[0];
      const historicalRes = await fetch(`content/${historicalId}.json`);
      const historicalArticle = await historicalRes.json();
      renderArticleCard("historical-media","historical-body",historicalArticle);
    }

  }catch(err){
    console.error("Homepage load error:",err);
  }

}

document.addEventListener("DOMContentLoaded",loadHomepageSections);

function likeArticle(){
alert("Thank you for liking this article.");
}

function subscribeChannel(){
window.open("https://youtube.com/@themirrorjk","_blank");
}

function shareArticle(){
if(navigator.share){
navigator.share({
title:document.title,
url:window.location.href
});
}else{
alert("Sharing not supported on this browser.");
}
}

function copyLink(){
navigator.clipboard.writeText(window.location.href);
alert("Article link copied.");
}
