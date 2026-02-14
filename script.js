// FULL RESTORED ORIGINAL ADVANCED SCRIPT (SAFE VERSION)

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

/* ===== YEAR ===== */
if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

/* ===== CLOCKS ===== */
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
      .format(now)
      .replace(',', ' —');
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

/* ===== NAVIGATION ===== */
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
    const expanded =
      hamburger.getAttribute("aria-expanded")==="true";
    hamburger.setAttribute("aria-expanded",String(!expanded));
    mobileMenu.hidden = expanded;
  });
}

/* ===== WEATHER FULL RESTORE ===== */
const cities = [
  { key:"zurich", name:"Zurich", lat:47.3769, lon:8.5417 },
  { key:"rawalakot", name:"Rawalakot", lat:33.8578, lon:73.7604 },
  { key:"jammu", name:"Jammu", lat:32.7266, lon:74.8570 },
  { key:"kashmir", name:"Kashmir", lat:34.0837, lon:74.7973 },
  { key:"ladakh", name:"Ladakh", lat:34.1526, lon:77.5771 },
  { key:"gilgit", name:"Gilgit", lat:35.9208, lon:74.3080 },
  { key:"baltistan", name:"Baltistan", lat:35.3025, lon:75.6360 },
  { key:"muzaffarabad", name:"Muzaffarabad", lat:34.37, lon:73.47 }
];

const weatherBar=$("#weather-bar");

const codeToIcon = (code)=>{
  if([0].includes(code)) return "☀️";
  if([1,2,3].includes(code)) return "⛅";
  if([45,48].includes(code)) return "🌫️";
  if([51,53,55,56,57].includes(code)) return "🌦️";
  if([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if([71,73,75,77,85,86].includes(code)) return "🌨️";
  if([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
};

function createCityChip(name,text){
  const el=document.createElement("div");
  el.className="city";
  el.innerHTML=`<span class="name">${name}:</span>
                <span class="temp">${text}</span>`;
  return el;
}

async function loadWeather(){
  if(!weatherBar) return;

  weatherBar.textContent="";

  for(const c of cities){
    const urlNew =
      `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code`;

    const urlOld =
      `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;

    try{
      let res = await fetch(urlNew);
      if(!res.ok) throw new Error();
      let data = await res.json();
      let t = data?.current?.temperature_2m ?? null;
      let code = data?.current?.weather_code ?? null;

      if(t===null){
        const r2=await fetch(urlOld);
        const d2=await r2.json();
        t = d2?.current_weather?.temperature ?? "—";
        code = d2?.current_weather?.weathercode ?? null;
      }

      const icon = codeToIcon(Number(code));
      weatherBar.appendChild(
        createCityChip(c.name,`${t}°C ${icon}`)
      );

    }catch(e){
      weatherBar.appendChild(
        createCityChip(c.name,"— °C")
      );
    }
  }
}
loadWeather();

/* ===== FULL CONTENT SYSTEM ===== */

async function loadJSON(path){
  const tryFetch = async(p)=>{
    const url=new URL(p,document.baseURI);
    const res=await fetch(url.toString(),{cache:"no-store"});
    if(res.ok) return res;
    return null;
  };

  let res = await tryFetch(path);

  if(!res && path.startsWith("content/")){
    res = await tryFetch(path.replace(/^content\//,""));
  }

  if(!res) throw new Error("Failed to load "+path);
  return await res.json();
}

/* ===== VLOG RENDER ===== */

function renderTopVlogs(videos,channelUrl){
  const vlogSection=document.getElementById("vlog");
  if(!vlogSection || !Array.isArray(videos)) return;

  const sorted=[...videos]
    .sort((a,b)=>String(b.date).localeCompare(String(a.date)))
    .slice(0,3);

  const cards=vlogSection
    .querySelectorAll("article.card.video");

  sorted.forEach((v,idx)=>{
    const card=cards[idx];
    if(!card) return;

    const media=card.querySelector(".media");
    if(!media) return;

    media.innerHTML="";
    const iframe=document.createElement("iframe");
    iframe.loading="lazy";
    iframe.allowFullscreen=true;
    iframe.src =
      v.youtubeId ?
      `https://www.youtube.com/embed/${encodeURIComponent(v.youtubeId)}`
      : "";

    iframe.style.width="100%";
    iframe.style.height="100%";
    iframe.style.border="0";

    media.appendChild(iframe);
  });
}

/* ===== APPLY CONTENT ===== */

async function applyContent(){
  try{
    const [site,articles,vlogs]=await Promise.all([
      loadJSON("content/site.json"),
      loadJSON("content/articles.json"),
      loadJSON("content/vlogs.json")
    ]);

    renderTopVlogs(
      vlogs?.videos || [],
      site?.youtubeChannelUrl || ""
    );

  }catch(e){
    console.warn("Content load skipped:",e);
  }
}

document.addEventListener("DOMContentLoaded",applyContent);

/* ===== IMAGE PLACEHOLDER SYSTEM ===== */

document.addEventListener("DOMContentLoaded",()=>{
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  document.querySelectorAll("img").forEach(img=>{
    img.loading="lazy";
    img.addEventListener("error",()=>{
      img.src=placeholder;
    });
  });
});
