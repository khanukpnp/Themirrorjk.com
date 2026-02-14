// ===== GLOBAL UTIL =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     YEAR
  ============================== */
  const yearEl = $("#year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* =============================
     CLOCKS
  ============================== */
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

  /* =============================
     NAV
  ============================== */
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");
  if(hamburger && mobileMenu){
    hamburger.addEventListener("click",()=>{
      mobileMenu.hidden = !mobileMenu.hidden;
    });
  }

  /* =============================
     WEATHER (ALL 8 CITIES)
  ============================== */
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

  const weatherBar = $("#weather-bar");

  async function loadWeather(){
    if(!weatherBar) return;
    weatherBar.innerHTML="";

    for(const c of cities){
      try{
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
        );
        const data = await res.json();
        const t = data?.current_weather?.temperature ?? "—";
        weatherBar.innerHTML +=
          `<div class="city"><span>${c.name}:</span> ${t}°C</div>`;
      }catch(e){
        weatherBar.innerHTML +=
          `<div class="city"><span>${c.name}:</span> —°C</div>`;
      }
    }
  }

  loadWeather();

  /* =============================
     PLACEHOLDER SYSTEM
  ============================== */
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.src = placeholder;
    });
  });

  /* =============================
     CONTACT MODAL
  ============================== */
  const dlg = $("#contact-modal");
  const open = $("#open-contact");
  const close = $("#close-contact");

  if(dlg && open && close){
    open.addEventListener("click",()=>dlg.showModal());
    close.addEventListener("click",()=>dlg.close());
  }

});
