Script js 23rd Feb2026
// ================= GLOBAL SELECTORS =================
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", function(){

// ================= YEAR =================
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ================= CLOCKS =================
function updateTimes(){
  const now = new Date();

  const setTime = (selector, options) => {
    const el = $(selector);
    if (!el) return;
    try {
      el.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
    } catch {
      el.textContent = new Intl.DateTimeFormat('en-GB', {
        day:'numeric', month:'long', year:'numeric',
        hour:'2-digit', minute:'2-digit', second:'2-digit',
        hour12:false
      }).format(now);
    }
  };

  setTime("#clock-cest span", {
    weekday:'long', year:'numeric', month:'long', day:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
    hour12:false, timeZone:'Europe/Zurich'
  });

  setTime("#tz-ist span", {
    hour:'2-digit', minute:'2-digit', second:'2-digit',
    hour12:false, timeZone:'Asia/Kolkata'
  });

  setTime("#tz-pkt span", {
    hour:'2-digit', minute:'2-digit', second:'2-digit',
    hour12:false, timeZone:'Asia/Karachi'
  });

  const hijriEl = $("#cal-hijri span");
  if (hijriEl){
    try {
      hijriEl.textContent = new Intl.DateTimeFormat('en-GB', {
        day:'numeric', month:'long', year:'numeric', calendar:'islamic'
      }).format(now);
    } catch {
      hijriEl.textContent = new Intl.DateTimeFormat('en-GB', {
        day:'numeric', month:'long', year:'numeric'
      }).format(now);
    }
  }

  const hindiEl = $("#cal-hindi span");
  if (hindiEl){
    try {
      hindiEl.textContent = new Intl.DateTimeFormat('en-GB', {
        day:'numeric', month:'long', year:'numeric', calendar:'indian'
      }).format(now);
    } catch {
      hindiEl.textContent = new Intl.DateTimeFormat('en-GB', {
        day:'numeric', month:'long', year:'numeric'
      }).format(now);
    }
  }
}

updateTimes();
setInterval(updateTimes, 1000);

// ================= WEATHER =================
async function loadWeather(){
  const bar = $("#weather-bar");
  if (!bar) return;

  const cities = [
    {name:"Zurich", lat:47.3769, lon:8.5417},
    {name:"Rawalakot", lat:33.8578, lon:73.7604},
    {name:"Jammu", lat:32.7266, lon:74.8570},
    {name:"Kashmir", lat:34.0837, lon:74.7973},
    {name:"Ladakh", lat:34.1526, lon:77.5771},
    {name:"Gilgit", lat:35.9208, lon:74.3080},
    {name:"Baltistan", lat:35.3025, lon:75.6360},
    {name:"Muzaffarabad", lat:34.37, lon:73.47}
  ];

  bar.innerHTML = "";

  for (const c of cities){
    try{
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";
      bar.innerHTML += `<div class="city">${c.name}: ${t}°C</div>`;
    } catch {
      bar.innerHTML += `<div class="city">${c.name}: —°C</div>`;
    }
  }
}
loadWeather();

// ================= IMAGE FALLBACK =================
function applyImageFallback(ctx=document){
  const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='36' fill='%23999'%3EImage Placeholder%3C/text%3E%3C/svg%3E";

  $$("img", ctx).forEach(img=>{
    img.onerror = ()=> { img.src = placeholder; };
  });
}
applyImageFallback();

// ======================================================
// =============== BREAKING NEWS (CORRECTED) ============
// ======================================================
async function loadBreaking(){
  const mediaBox = $("#breaking");
  const bodyBox = $("#breaking-body");

  if (!mediaBox || !bodyBox) return;

  try{
    const res = await fetch("content/breaking.json",{cache:"no-store"});
    const data = await res.json();
    if (!data.items || data.items.length === 0) return;

    const item = data.items[0]; // newest breaking

    // HERO IMAGE (16:9)
    if (item.heroImage?.src){
      mediaBox.innerHTML = `<img src="${item.heroImage.src}" alt="" style="aspect-ratio:16/9;object-fit:cover;">`;
      mediaBox.classList.remove("placeholder");
    } else {
      mediaBox.textContent = "No Image";
    }

    // TEXT
    bodyBox.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
    `;

    applyImageFallback(mediaBox);

  } catch (err){
    console.warn("Breaking failed", err);
  }
}
loadBreaking();

// ================= VLOG =================
async function renderVlogs(){
  const vlogSection = $("#vlog");
  if (!vlogSection) return;

  try{
    const res = await fetch("content/vlogs.json",{cache:"no-store"});
    const data = await res.json();
    if (!data.videos) return;

    const cards = vlogSection.querySelectorAll("article.card.video");

    data.videos.slice(0, cards.length).forEach((v,i)=>{
      if (!v.youtubeId) return;

      const card = cards[i];
      if (!card) return;

      const media = card.querySelector(".media");
      if (!media) return;

      const badges = [...media.querySelectorAll(".badge")];
      media.innerHTML = "";
      badges.forEach(b => media.appendChild(b));

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${v.youtubeId}`;
      iframe.title = v.title || "";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";

      media.appendChild(iframe);
    });

  } catch {
    console.warn("Vlog load failed");
  }
}
renderVlogs();

// ================= ABOUT PAGE =================
if (location.pathname.includes("about.html")){
  loadAbout();
}

async function loadAbout(){
  try{
    const res = await fetch("content/about.json",{cache:"no-store"});
    const data = await res.json();

    $("#title").textContent = data.title || "";
    $("#meta").textContent = data.subtitle || "";

    const content = $("#content");
    content.innerHTML = "";

    data.body.forEach(block=>{
      if (block.type === "paragraph"){
        const p = document.createElement("p");
        p.textContent = block.text;
        content.appendChild(p);
      }
      if (block.type === "header"){
        const h = document.createElement("h2");
        h.textContent = block.text;
        content.appendChild(h);
      }
    });

    applyImageFallback(content);

  } catch {
    console.warn("About page failed");
  }
}

// ================= CHIEF EDITOR PAGE =================
if (location.pathname.includes("chief-editor.html")){
  loadChiefEditor();
}

async function loadChiefEditor(){
  try{
    const res = await fetch("content/chief-editor.json",{cache:"no-store"});
    const data = await res.json();

    $("#title").textContent = data.title || "";
    $("#meta").textContent = data.subtitle || "";

    const content = $("#content");
    content.innerHTML = "";

    if (data.heroImage?.src){
      const fig = document.createElement("figure");
      fig.style.float = "right";
      fig.style.width = "35%";
      fig.style.margin = "8px 0 14px 20px";
      fig.innerHTML = `
        <img src="${data.heroImage.src}" alt="">
        <figcaption>${data.heroImage.caption || ""}</figcaption>
      `;
      content.appendChild(fig);
    }

    data.body.forEach(block=>{
      if (block.type === "paragraph"){
        const p = document.createElement("p");
        p.textContent = block.text;
        content.appendChild(p);
      }
    });

    const clear = document.createElement("div");
    clear.style.clear = "both";
    content.appendChild(clear);

    applyImageFallback(content);

  } catch {
    console.warn("Chief Editor page failed");
  }
}

// ================= ARTICLE PAGE (MERGED BREAKING + ARTICLES) =================
if (location.pathname.includes("article.html")){
  loadArticle();
}

async function loadArticle(){
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  try {
    const [articlesRes, breakingRes] = await Promise.all([
      fetch("content/articles.json", { cache: "no-store" }),
      fetch("content/breaking.json", { cache: "no-store" })
    ]);

    const articlesData = await articlesRes.json();
    const breakingData = await breakingRes.json();

    let article =
      articlesData.items?.find(x => x.id === id) ||
      breakingData.items?.find(x => x.id === id);

    if (!article) return;

    $("#title").textContent = article.title;

    const heroWrap = $("#heroWrap");
    const heroImg = $("#heroImg");

    if (heroImg && heroWrap){
      heroImg.src = article.heroImage?.src || "";
      heroWrap.style.display = article.heroImage?.src ? "block" : "none";
    }

    const content = $("#content");
    content.innerHTML = "";

    article.body.forEach(block=>{
      if (block.type === "paragraph"){
        const p = document.createElement("p");
        p.textContent = block.text;
        content.appendChild(p);
      }
      if (block.type === "image"){
        const fig = document.createElement("figure");
        fig.innerHTML = `
          <img src="${block.src}" alt="">
          <figcaption>${block.caption || ""}</figcaption>
        `;
        content.appendChild(fig);
      }
    });

    applyImageFallback(content);

  } catch (err){
    console.warn("Article failed", err);
  }
}

// ================= NAVIGATION DROPDOWNS =================
$$(".nav-item.has-sub").forEach(item => {
  const btn = item.querySelector(".nav-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Close all others
    $$(".nav-item.has-sub").forEach(i => {
      if (i !== item) i.classList.remove("open");
    });

    // Toggle this one
    item.classList.toggle("open");
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  $$(".nav-item.has-sub").forEach(i => i.classList.remove("open"));
});

// ================= CONTACT MODAL OPEN/CLOSE =================
const contactModal = $("#contact-modal");
const openContactBtn = $("#open-contact");
const closeContactBtn = $("#close-contact");

if (openContactBtn && contactModal) {
  openContactBtn.addEventListener("click", () => {
    contactModal.showModal();
  });
}

if (closeContactBtn && contactModal) {
  closeContactBtn.addEventListener("click", () => {
    contactModal.close();
  });
}

});
