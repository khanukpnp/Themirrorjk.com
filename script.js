// JS v3 stable — global safe + article safe

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     GLOBAL CLOCKS + CALENDAR
  ========================== */

  if ($("#year")) {
    $("#year").textContent = new Date().getFullYear();
  }

  function formatCEST() {
    const now = new Date();
    const opts = {
      weekday:'long', year:'numeric', month:'long', day:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit',
      hour12:false, timeZone:'Europe/Zurich'
    };
    const el = $("#clock-cest span");
    if(el){
      el.textContent =
        new Intl.DateTimeFormat('en-GB', opts)
        .format(now).replace(',', ' —');
    }
  }

  function formatHijri(){
    try{
      const now = new Date();
      const fmt = new Intl.DateTimeFormat(
        'en-u-ca-islamic',
        { day:'numeric', month:'long', year:'numeric' }
      );
      const el = $("#cal-hijri span");
      if(el) el.textContent = fmt.format(now) + " AH";
    }catch(e){}
  }

  function formatVikram(){
    const now = new Date();
    const gYear = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    const vsYear = (m >= 3) ? gYear + 57 : gYear + 56;
    const months = [
      "Pausha","Magha","Phalguna","Chaitra",
      "Vaisakh","Jyeshtha","Ashadha","Shravana",
      "Bhadrapada","Ashwin","Kartik","Margashirsha"
    ];
    const map = [9,10,11,3,4,5,6,7,8,0,1,2];
    const el = $("#cal-hindi span");
    if(el){
      el.textContent =
        `${months[map[m]]} ${d}, ${vsYear} VS`;
    }
  }

  function updateTimes(){
    formatCEST();
    formatHijri();
    formatVikram();
  }

  updateTimes();
  setInterval(updateTimes,1000);

  /* =========================
     SAFE ARTICLE PAGE LOGIC
  ========================== */

  if (location.pathname.includes("article.html")) {
    renderArticlePage();
  }

});


/* =========================
   ARTICLE RENDER FUNCTION
========================== */

async function renderArticlePage(){

  const id = new URLSearchParams(location.search).get("id");
  if(!id) return;

  let data;
  try{
    const res = await fetch("content/articles.json",{cache:"no-store"});
    if(!res.ok) return;
    data = await res.json();
  }catch(e){
    console.warn("Articles JSON failed");
    return;
  }

  if(!data.items) return;

  const article = data.items.find(x=>x.id===id);
  if(!article) return;

  const titleEl = document.getElementById("title");
  const metaEl = document.getElementById("meta");
  const contentEl = document.getElementById("content");
  const heroWrap = document.getElementById("heroWrap");
  const heroImg = document.getElementById("heroImg");
  const heroCaption = document.getElementById("heroCaption");

  if(titleEl) titleEl.textContent = article.title;
  if(metaEl) metaEl.textContent =
    `${article.location || ""} · ${article.date} · ${article.readTime}`;

  if(heroWrap && heroImg && article.heroImage?.src){
    heroWrap.style.display="block";
    heroImg.src = article.heroImage.src;
    heroCaption.innerHTML =
      `${article.heroImage.caption || ""} ${
        article.heroImage.credit ? "© " + article.heroImage.credit : ""
      }`;
  }

  if(!contentEl) return;

  contentEl.innerHTML = "";

  article.body.forEach(block=>{

    if(block.type==="paragraph"){
      const p = document.createElement("p");
      p.textContent = block.text;
      contentEl.appendChild(p);
    }

    if(block.type==="image"){
      const figure = document.createElement("figure");
      figure.className = "article-figure";
      figure.style.width = "36%";
      figure.style.float =
        block.align==="left" ? "left" : "right";
      figure.style.margin =
        block.align==="left"
          ? "8px 20px 12px 0"
          : "8px 0 12px 20px";

      const img = document.createElement("img");
      img.src = block.src;
      img.alt = block.caption || "";

      const cap = document.createElement("figcaption");
      cap.style.fontSize="13px";
      cap.style.color="#555";
      cap.style.marginTop="6px";
      cap.textContent =
        (block.caption || "") +
        (block.credit ? " © " + block.credit : "");

      figure.appendChild(img);
      figure.appendChild(cap);
      contentEl.appendChild(figure);
    }

  });

}
