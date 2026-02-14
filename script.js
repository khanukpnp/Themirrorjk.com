// ================= GLOBAL SELECTORS =================
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", function(){

// ================= YEAR =================
const yearEl = $("#year");
if(yearEl) yearEl.textContent = new Date().getFullYear();


// ================= CLOCKS + CALENDARS =================
function updateTimes(){
  const now = new Date();

  // CEST
  const cest = $("#clock-cest span");
  if(cest){
    cest.textContent =
      new Intl.DateTimeFormat('en-GB',{
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:false,
        timeZone:'Europe/Zurich'
      }).format(now).replace(',', ' —');
  }

  // IST
  const ist = $("#tz-ist span");
  if(ist){
    ist.textContent =
      new Intl.DateTimeFormat('en-GB',{
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:false,
        timeZone:'Asia/Kolkata'
      }).format(now);
  }

  // PKT
  const pkt = $("#tz-pkt span");
  if(pkt){
    pkt.textContent =
      new Intl.DateTimeFormat('en-GB',{
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:false,
        timeZone:'Asia/Karachi'
      }).format(now);
  }

  // Hijri
  const hijri = $("#cal-hijri span");
  if(hijri){
    hijri.textContent =
      new Intl.DateTimeFormat('en-TN-u-ca-islamic',{
        day:'numeric',
        month:'long',
        year:'numeric'
      }).format(now);
  }

  // Vikram Samvat
  const vs = $("#cal-hindi span");
  if(vs){
    vs.textContent =
      new Intl.DateTimeFormat('en-IN-u-ca-indian',{
        day:'numeric',
        month:'long',
        year:'numeric'
      }).format(now);
  }
}
updateTimes();
setInterval(updateTimes,1000);


// ================= WEATHER =================
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

async function loadWeather(){
  const weatherBar = $("#weather-bar");
  if(!weatherBar) return;
  weatherBar.innerHTML = "";

  for(const c of cities){
    try{
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";

      weatherBar.innerHTML +=
        `<div class="city">
          <span class="name">${c.name}:</span>
          <span class="temp">${t}°C</span>
        </div>`;
    }catch{
      weatherBar.innerHTML +=
        `<div class="city">${c.name}: —°C</div>`;
    }
  }
}
loadWeather();


// ================= IMAGE FALLBACK =================
function applyImageFallback(context=document){
  const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  $$("img", context).forEach(img=>{
    img.onerror = () => img.src = placeholder;
  });
}
applyImageFallback();


// ================= NAV DROPDOWN =================
const navItems = $$(".nav-item.has-sub");

navItems.forEach(item=>{
  const btn = item.querySelector(".nav-btn");
  if(!btn) return;

  btn.addEventListener("click", function(e){
    e.preventDefault();
    e.stopPropagation();

    navItems.forEach(other=>{
      if(other !== item) other.classList.remove("open");
    });

    item.classList.toggle("open");
  });
});

document.addEventListener("click", ()=>{
  navItems.forEach(item=>item.classList.remove("open"));
});


// ================= MOBILE MENU =================
const hamburger = $("#hamburger");
const navList = $("#nav-list");

if(hamburger && navList){
  hamburger.addEventListener("click", ()=>{
    const expanded =
      hamburger.getAttribute("aria-expanded")==="true";

    hamburger.setAttribute("aria-expanded", !expanded);
    navList.style.display = expanded ? "none" : "flex";
  });
}


// ================= HOMEPAGE CARDS =================
async function renderCards(){
  const cards = document.querySelectorAll("article.card.post");
  if(!cards.length) return;

  try{
    const res = await fetch("content/articles.json",{cache:"no-store"});
    const data = await res.json();
    if(!data.items) return;

    data.items.slice(0,cards.length).forEach((item,i)=>{
      const card = cards[i];
      card.querySelector("h3").textContent = item.title;
      card.querySelector("p").textContent = item.excerpt;

      const link = card.querySelector(".read-more");
      if(link) link.href = `article.html?id=${item.id}`;

      const img = card.querySelector("img");
      if(img && item.heroImage?.src){
        img.src = item.heroImage.src;
      }

      const author = card.querySelector(".author");
      if(author) author.textContent = "Special Correspondent";
    });

    applyImageFallback();
  }catch(e){
    console.warn("Cards failed");
  }
}
renderCards();


// ================= VLOG RENDER =================
async function renderVlogs(){
  const vlogSection = $("#vlog");
  if(!vlogSection) return;

  try{
    const res = await fetch("content/vlogs.json",{cache:"no-store"});
    const data = await res.json();
    if(!data.videos) return;

    const cards = vlogSection.querySelectorAll("article.card.video");

    data.videos.slice(0,cards.length).forEach((v,i)=>{
      const card = cards[i];
      const media = card.querySelector(".media");
      if(!media) return;

      // KEEP placeholder if no youtubeId
      if(v.youtubeId){
        media.innerHTML =
          `<iframe 
            src="https://www.youtube.com/embed/${v.youtubeId}" 
            frameborder="0"
            allowfullscreen
            style="width:100%;height:100%;border:0;">
          </iframe>`;
      }
    });
  }catch(e){
    console.warn("Vlogs failed");
  }
}
renderVlogs();


// ================= ARTICLE PAGE =================
if(location.pathname.includes("article.html")){
  renderArticlePage();
}

async function renderArticlePage(){
  const id = new URLSearchParams(location.search).get("id");
  if(!id) return;

  try{
    const res = await fetch("content/articles.json",{cache:"no-store"});
    const data = await res.json();
    const article = data.items.find(x=>x.id===id);
    if(!article) return;

    $("#title").textContent = article.title;
    $("#meta").textContent =
      `${article.location||""} · ${article.date} · ${article.readTime}`;

    if(article.heroImage?.src){
      $("#heroWrap").style.display="block";
      $("#heroImg").src = article.heroImage.src;
      $("#heroCaption").textContent =
        (article.heroImage.caption||"") +
        (article.heroImage.credit ? " © "+article.heroImage.credit : "");
    }

    const content = $("#content");
    content.innerHTML="";

    article.body.forEach(block=>{
      if(block.type==="paragraph"){
        const p=document.createElement("p");
        p.textContent=block.text;
        content.appendChild(p);
      }
      if(block.type==="image"){
        const fig=document.createElement("figure");
        fig.className="article-figure";
        fig.innerHTML=
          `<img src="${block.src}">
           <figcaption>${block.caption||""}</figcaption>`;
        content.appendChild(fig);
      }
    });

    applyImageFallback(content);

  }catch(e){
    console.warn("Article load failed");
  }
}

});
