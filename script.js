// FULL STABLE SCRIPT — SAFE VERSION

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

/* ===== SAFE YEAR ===== */
if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

/* ===== SAFE CLOCKS ===== */
function updateTimes(){
  const now = new Date();

  const cest = $("#clock-cest span");
  if(cest){
    const opts = {
      weekday:'long', year:'numeric', month:'long', day:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit',
      hour12:false, timeZone:'Europe/Zurich'
    };
    cest.textContent =
      new Intl.DateTimeFormat('en-GB', opts)
      .format(now).replace(',', ' —');
  }

  const hijri = $("#cal-hijri span");
  if(hijri){
    try{
      const fmt = new Intl.DateTimeFormat(
        'en-u-ca-islamic',
        { day:'numeric', month:'long', year:'numeric' }
      );
      hijri.textContent = fmt.format(now) + " AH";
    }catch(e){}
  }

  const hindi = $("#cal-hindi span");
  if(hindi){
    const gYear = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    const vsYear = (m >= 3) ? gYear + 57 : gYear + 56;
    hindi.textContent = `${d}, ${vsYear} VS`;
  }
}
updateTimes();
setInterval(updateTimes,1000);

/* ===== SAFE NAV ===== */
$$(".nav-item.has-sub > .nav-btn").forEach(btn=>{
  btn.addEventListener("click", e=>{
    const li = e.currentTarget.closest(".nav-item");
    if(!li) return;
    const isOpen = li.classList.contains("open");
    $$(".nav-item.open").forEach(n=>n.classList.remove("open"));
    if(!isOpen) li.classList.add("open");
  });
});

document.addEventListener("click",e=>{
  if(!e.target.closest(".navbar")){
    $$(".nav-item.open").forEach(n=>n.classList.remove("open"));
  }
});

const hamburger=$("#hamburger");
const mobileMenu=$("#mobile-menu");
if(hamburger && mobileMenu){
  hamburger.addEventListener("click",()=>{
    const expanded = hamburger.getAttribute("aria-expanded")==="true";
    hamburger.setAttribute("aria-expanded",String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

/* ===== WEATHER SAFE ===== */
const weatherBar=$("#weather-bar");

async function loadWeather(){
  if(!weatherBar) return;

  weatherBar.textContent="";
  const cities=[
    {name:"Zurich",lat:47.3769,lon:8.5417},
    {name:"Rawalakot",lat:33.8578,lon:73.7604}
  ];

  for(const c of cities){
    try{
      const res=await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data=await res.json();
      const t=data?.current_weather?.temperature ?? "—";
      weatherBar.innerHTML+=
        `<div class="city"><span>${c.name}:</span> ${t}°C</div>`;
    }catch(e){
      weatherBar.innerHTML+=
        `<div class="city"><span>${c.name}:</span> —°C</div>`;
    }
  }
}
loadWeather();

/* ===== PLACEHOLDER RESTORE ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.src=placeholder;
    });
  });
});

/* ===== CONTACT MODAL RESTORE ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const dlg=$("#contact-modal");
  const open=$("#open-contact");
  const close=$("#close-contact");

  if(dlg && open && close){
    open.addEventListener("click",()=>dlg.showModal());
    close.addEventListener("click",()=>dlg.close());
  }
});

/* ===== ARTICLE RENDER SAFE ===== */
document.addEventListener("DOMContentLoaded",async()=>{
  if(!location.pathname.includes("article.html")) return;

  const id=new URLSearchParams(location.search).get("id");
  if(!id) return;

  let data;
  try{
    const res=await fetch("content/articles.json",{cache:"no-store"});
    data=await res.json();
  }catch(e){return;}

  if(!data.items) return;

  const a=data.items.find(x=>x.id===id);
  if(!a) return;

  const title=$("#title");
  const meta=$("#meta");
  const content=$("#content");
  const heroWrap=$("#heroWrap");
  const heroImg=$("#heroImg");
  const heroCaption=$("#heroCaption");

  if(title) title.textContent=a.title;
  if(meta) meta.textContent=
    `${a.location||""} · ${a.date} · ${a.readTime}`;

  if(a.heroImage?.src && heroWrap && heroImg){
    heroWrap.style.display="block";
    heroImg.src=a.heroImage.src;
    heroCaption.textContent=
      (a.heroImage.caption||"")+
      (a.heroImage.credit?" © "+a.heroImage.credit:"");
  }

  if(!content) return;
  content.innerHTML="";

  a.body.forEach(block=>{
    if(block.type==="paragraph"){
      const p=document.createElement("p");
      p.textContent=block.text;
      content.appendChild(p);
    }
    if(block.type==="image"){
      const fig=document.createElement("figure");
      fig.className="article-figure";
      fig.innerHTML=
        `<img src="${block.src}" alt="">
         <figcaption>${block.caption||""}</figcaption>`;
      content.appendChild(fig);
    }
  });
});
