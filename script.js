// ================= GLOBAL SELECTORS =================
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", function(){

// ================= YEAR =================
const yearEl = $("#year");
if(yearEl) yearEl.textContent = new Date().getFullYear();


// ================= CLOCKS =================
function updateTimes(){
  const now = new Date();

  const setTime = (selector, options) => {
    const el = $(selector);
    if(!el) return;
    el.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
  };

  setTime("#clock-cest span", {
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:false,
    timeZone:'Europe/Zurich'
  });

  setTime("#tz-ist span", {
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:false,
    timeZone:'Asia/Kolkata'
  });

  setTime("#tz-pkt span", {
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:false,
    timeZone:'Asia/Karachi'
  });

  setTime("#cal-hijri span", {
    day:'numeric',
    month:'long',
    year:'numeric',
    calendar:'islamic'
  });

  setTime("#cal-hindi span", {
    day:'numeric',
    month:'long',
    year:'numeric',
    calendar:'indian'
  });
}
updateTimes();
setInterval(updateTimes,1000);


// ================= WEATHER =================
async function loadWeather(){
  const bar = $("#weather-bar");
  if(!bar) return;

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

  for(const c of cities){
    try{
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature ?? "—";
      bar.innerHTML += `<div class="city">${c.name}: ${t}°C</div>`;
    }catch{
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
    img.onerror = ()=> img.src = placeholder;
  });
}
applyImageFallback();


// ================= BREAKING NEWS =================
async function loadBreaking(){
  const container = $("#breaking");
  if(!container) return;

  try{
    const res = await fetch("content/breaking.json",{cache:"no-store"});
    const data = await res.json();
    if(!data.items) return;

    container.innerHTML = "";

    data.items.forEach(item=>{
      container.innerHTML += `
        <article class="card post">
          <div class="media">
            <img src="${item.heroImage?.src || ''}">
          </div>
          <div class="card-body">
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <a class="read-more" href="article.html?id=${item.id}">Read More →</a>
          </div>
        </article>
      `;
    });

    applyImageFallback(container);

  }catch{
    console.warn("Breaking failed");
  }
}
loadBreaking();


// ================= VLOG =================
async function renderVlogs(){
  const vlogSection = $("#vlog");
  if(!vlogSection) return;

  try{
    const res = await fetch("content/vlogs.json",{cache:"no-store"});
    const data = await res.json();
    if(!data.videos) return;

    const cards = vlogSection.querySelectorAll("article.card.video");

    data.videos.slice(0,cards.length).forEach((v,i)=>{
      if(!v.youtubeId) return;

      const media = cards[i].querySelector(".media");
      media.innerHTML =
        `<iframe 
          src="https://www.youtube.com/embed/${v.youtubeId}" 
          frameborder="0"
          allowfullscreen
          style="width:100%;height:100%;border:0;">
        </iframe>`;
    });

  }catch{
    console.warn("Vlog load failed");
  }
}
renderVlogs();


// ================= CONTACT MODAL =================
const modal = $("#contact-modal");
const openBtn = $("#open-contact");
const closeBtn = $("#close-contact");

if(openBtn && modal){
  openBtn.addEventListener("click", ()=> modal.showModal());
}
if(closeBtn && modal){
  closeBtn.addEventListener("click", ()=> modal.close());
}


// ================= ARTICLE PAGE =================
if(location.pathname.includes("article.html")){
  loadArticle();
}

async function loadArticle(){
  const id = new URLSearchParams(location.search).get("id");
  if(!id) return;

  try{
    const res = await fetch("content/articles.json",{cache:"no-store"});
    const data = await res.json();
    const article = data.items.find(x=>x.id===id);
    if(!article) return;

    $("#title").textContent = article.title;

    const heroWrap = $("#heroWrap");
    const heroImg = $("#heroImg");

    if(heroImg){
      heroImg.src = article.heroImage?.src || "";
      heroWrap.style.display = "block";
    }

    const content = $("#content");
    content.innerHTML = "";

    article.body.forEach(block=>{
      if(block.type==="paragraph"){
        const p=document.createElement("p");
        p.textContent=block.text;
        content.appendChild(p);
      }
      if(block.type==="image"){
        const fig=document.createElement("figure");
        fig.innerHTML = `
          <img src="${block.src}">
          <figcaption>${block.caption||""}</figcaption>
        `;
        content.appendChild(fig);
      }
    });

    applyImageFallback(content);

  }catch{
    console.warn("Article failed");
  }
}

});
