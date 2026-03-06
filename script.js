/* ======================================================
GLOBAL HELPERS
====================================================== */

const CONTENT_BASE = "content/";

const $ = (s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

async function fetchJSON(url){
 const r=await fetch(url,{cache:"no-store"});
 if(!r.ok)return null;
 return r.json();
}

function createEl(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(text)e.textContent=text;
 return e;
}

function clearEl(el){
 while(el.firstChild)el.removeChild(el.firstChild);
}

function resolveHeroImage(item){
 if(!item)return null;
 if(item.heroImage?.src)return item.heroImage.src;
 if(item.heroImage)return item.heroImage;
 if(item.image)return item.image;
 return null;
}

/* ======================================================
CLOCKS
====================================================== */

function initClocksCalendars(){

 function update(){

  const now=new Date();

  const cest=$("#clock-cest span");
  if(cest){
   cest.textContent=new Intl.DateTimeFormat("en-GB",{
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit",
    hour12:false,
    timeZone:"Europe/Zurich"
   }).format(now);
  }

  const ist=$("#tz-ist span");
  if(ist){
   ist.textContent=new Intl.DateTimeFormat("en-GB",{
    hour:"2-digit",minute:"2-digit",second:"2-digit",
    hour12:false,timeZone:"Asia/Kolkata"
   }).format(now);
  }

  const pkt=$("#tz-pkt span");
  if(pkt){
   pkt.textContent=new Intl.DateTimeFormat("en-GB",{
    hour:"2-digit",minute:"2-digit",second:"2-digit",
    hour12:false,timeZone:"Asia/Karachi"
   }).format(now);
  }

 }

 update();
 setInterval(update,1000);
}

/* ======================================================
WEATHER
====================================================== */

async function initWeather(){

 const bar=$("#weather-bar");
 if(!bar)return;

 const cities=[
  {n:"Zurich",lat:47.37,lon:8.54},
  {n:"Rawalakot",lat:33.85,lon:73.76},
  {n:"Jammu",lat:32.73,lon:74.86},
  {n:"Kashmir",lat:34.08,lon:74.79},
  {n:"Ladakh",lat:34.15,lon:77.58},
  {n:"Gilgit",lat:35.92,lon:74.30},
  {n:"Baltistan",lat:35.30,lon:75.63},
  {n:"Muzaffarabad",lat:34.37,lon:73.47}
 ];

 clearEl(bar);

 for(const c of cities){

  try{

   const url=`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;

   const data=await fetchJSON(url);

   const t=data?.current_weather?.temperature??"--";

   const chip=createEl("div","chip tiny",`${c.n}: ${t}°C`);

   bar.appendChild(chip);

  }catch{

   bar.appendChild(createEl("div","chip tiny",`${c.n}: --°C`));

  }

 }
}

/* ======================================================
TICKER
====================================================== */

async function initTicker(){

 const ul=$("#ticker-items");
 if(!ul)return;

 const data=await fetchJSON(CONTENT_BASE+"index.json");

 if(!data?.ticker)return;

 clearEl(ul);

 data.ticker.forEach(t=>{
  const li=document.createElement("li");
  li.textContent=t;
  ul.appendChild(li);
 });

}

/* ======================================================
ARTICLE SEARCH
====================================================== */

async function loadArticleById(id){

 const files=[
  "articles.json",
  "breaking.json",
  "blog.json",
  "editorial.json"
 ];

 for(const f of files){

  const data=await fetchJSON(CONTENT_BASE+f);
  if(!data?.items)continue;

  const a=data.items.find(x=>x.id===id);

  if(a)return a;

 }

 return null;

}

/* ======================================================
HOMEPAGE CARDS
====================================================== */

function fillCard(mediaId,bodyId,item){

 const media=$("#"+mediaId);
 const body=$("#"+bodyId);

 if(!media||!body)return;

 if(!item)return;

 media.textContent="";

 const img=resolveHeroImage(item);

 if(img){
  media.style.backgroundImage=`url(${img})`;
  media.style.backgroundSize="cover";
  media.style.backgroundPosition="center";
 }

 clearEl(body);

 const h=createEl("h3",null,item.title);
 const p=createEl("p",null,item.excerpt);

 const a=createEl("a","read-more","Read More");
 a.href=`editorial.html?id=${item.id}`;

 body.append(h,p,a);

}

/* ======================================================
HOMEPAGE
====================================================== */

async function initHomepage(){

 const data=await fetchJSON(CONTENT_BASE+"index.json");
 if(!data)return;

 const top=data.homepage.topStories;

 const lead=await loadArticleById(top.lead);
 const breaking=await loadArticleById(top.breaking);
 const opinion=await loadArticleById(top.opinion);

 fillCard("lead-media","lead-body",lead);
 fillCard("breaking-media","breaking-body",breaking);
 fillCard("opinion-media","opinion-body",opinion);

}

/* ======================================================
ARTICLE PAGE RENDER
====================================================== */

function renderArticle(article){

 $("#title").textContent=article.title;

 $("#meta").textContent=
 `${article.author} • ${article.location} • ${article.date} • ${article.readTime}`;

 if(article.heroImage){

  $("#heroImg").src=article.heroImage.src;

  $("#heroCaption").textContent=
   `${article.heroImage.caption} — ${article.heroImage.credit}`;
 }

 const container=$("#content");
 clearEl(container);

 article.body.forEach(b=>{

  if(b.type==="header"){
   container.appendChild(createEl("h2",null,b.text));
  }

  if(b.type==="paragraph"){
   container.appendChild(createEl("p",null,b.text));
  }

  if(b.type==="points"){

   const box=createEl("div","pull-points");

   const ul=document.createElement("ul");

   b.items.forEach(i=>{
    const li=document.createElement("li");
    li.textContent=i;
    ul.appendChild(li);
   });

   box.appendChild(ul);
   container.appendChild(box);
  }

  if(b.type==="image"){

   const fig=document.createElement("figure");

   const img=document.createElement("img");
   img.src=b.src;

   const cap=document.createElement("figcaption");
   cap.textContent=`${b.caption} — ${b.credit}`;

   fig.append(img,cap);

   if(b.align==="left")fig.className="img-left";
   if(b.align==="right")fig.className="img-right";

   container.appendChild(fig);
  }

 });

}

/* ======================================================
LOAD ARTICLE PAGE
====================================================== */

async function loadArticlePage(){

 const params=new URLSearchParams(location.search);
 const id=params.get("id");

 if(!id)return;

 const article=await loadArticleById(id);

 if(article)renderArticle(article);

}

/* ======================================================
ARTICLE ACTIONS
====================================================== */

function initArticleActions(){

 const like=$("#likeBtn");
 const likeCount=$("#likeCount");

 if(like){

  let n=0;

  like.onclick=()=>{
   n++;
   likeCount.textContent=n;
  };

 }

 const sub=$("#subBtn");

 if(sub){
  sub.onclick=()=>{
   sub.textContent="Subscribed";
   sub.disabled=true;
  };
 }

 const share=$("#shareBtn");

 if(share){

  share.onclick=()=>{

   if(navigator.share){

    navigator.share({
     title:document.title,
     url:location.href
    });

   }else{

    alert("Share not supported");

   }

  };

 }

 const copy=$("#copyBtn");

 if(copy){

  copy.onclick=()=>navigator.clipboard.writeText(location.href);

 }

}

/* ======================================================
VLOGS
====================================================== */

async function initVlogs(){

 const grid=$("#vlogs-grid");
 if(!grid)return;

 const data=await fetchJSON(CONTENT_BASE+"youtube.json");
 if(!data?.videos)return;

 clearEl(grid);

 data.videos.slice(0,3).forEach(v=>{

  const card=createEl("div","card");

  const iframe=document.createElement("iframe");
  iframe.src=`https://www.youtube.com/embed/${v.youtubeId}`;
  iframe.allowFullscreen=true;

  const body=createEl("div","card-body");

  body.append(
   createEl("h3",null,v.title),
   createEl("p",null,v.description)
  );

  card.append(iframe,body);

  grid.appendChild(card);

 });

}

/* ======================================================
INIT
====================================================== */

document.addEventListener("DOMContentLoaded",()=>{

 initClocksCalendars();
 initWeather();
 initTicker();
 initHomepage();
 initVlogs();

 loadArticlePage();
 initArticleActions();

});
