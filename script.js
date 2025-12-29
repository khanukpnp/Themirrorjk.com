:root{
  --maroon:#7a001e;
  --maroon-2:#8a102e;
  --text:#111;
  --bg:#f5f5f7;
  --card:#fff;
  --shadow:0 6px 24px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.06);
}

/* RESET */
*{ box-sizing:border-box }
html,body{ margin:0; padding:0; scroll-behavior:smooth }
body{
  font-family: Georgia, "Times New Roman", serif;
  background:var(--bg);
  color:var(--text);
}

/* HEADER */
.theme-maroon .site-header{ background:var(--maroon) }
.site-header{
  color:#fff;
  padding:18px 8px 12px;
  text-align:center;
}
.header-row{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
}
.logo{
  width:72px;
  height:72px;
  object-fit:contain;
  border-radius:12px;
  background:#fff3;
  padding:4px;
}
.site-title{
  margin:0;
  font-size:clamp(28px,5.8vw,56px);
  font-weight:700;
  text-transform:uppercase;
}
.subheading{
  margin-top:6px;
  font-size:clamp(11px,1.6vw,14px);
  text-transform:uppercase;
}

/* INFO BARS */
.bar{
  background:#fff;
  border-bottom:1px solid #e7e7ea;
  box-shadow:var(--shadow);
}
.bar .row{
  display:flex;
  justify-content:center;
  gap:10px;
  padding:6px 8px;
  flex-wrap:nowrap;
}
.chip{
  background:#f0f2f5;
  border-radius:999px;
  padding:4px 8px;
  font-size:12px;
}

/* WEATHER BAR CITY CHIPS (if your HTML uses .city) */
#weather-bar .city{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#f0f2f5;
  border-radius:999px;
  padding:4px 8px;
  font-size:12px;
  margin-right:6px;
  white-space:nowrap;
}
#weather-bar .city .temp{ font-weight:700 }
#weather-bar .city .name{ font-weight:600 }

/* TICKER – FIXED SPEED + READABILITY */
.ticker-wrap{
  background:var(--maroon);
  color:#fff;
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  overflow:hidden;
}
.ticker{
  display:flex;
  gap:12px;
  flex:1;
  overflow:hidden;
}
.ticker span{
  font-weight:800;
  white-space:nowrap;
}
.ticker ul{
  display:flex;
  gap:48px;
  list-style:none;
  padding:0;
  margin:0;
  white-space:nowrap;
  animation:ticker-scroll 120s linear infinite;
}
.ticker li{
  font-size:13px;
  opacity:1;
  text-shadow:0 1px 0 rgba(0,0,0,.25);
}
@keyframes ticker-scroll{
  from{ transform:translateX(0) }
  to{ transform:translateX(-50%) }
}

/* TOOLS (language + search) */
.tools{ display:flex; align-items:center; gap:8px }
.lang-select select,
.search input,
.search button{ font-size:12px }
.lang-select select{
  padding:6px 10px;
  border-radius:999px;
  border:1px solid #e3e3e8;
  background:#fff;
}
.search{ display:flex; gap:6px }
.search input{
  padding:6px 10px;
  border-radius:999px;
  border:1px solid #e3e3e8;
}
.search button{
  padding:6px 10px;
  border-radius:999px;
  border:1px solid #e3e3e8;
  background:#fff;
  cursor:pointer;
}

/* NAV */
.navbar{ background:var(--maroon-2) }
.nav-list{
  display:flex;
  justify-content:center;
  gap:4px;
  list-style:none;
  margin:0;
  padding:6px;
}
.nav-item{ position:relative }
.nav-btn{
  color:#fff;
  background:none;
  border:none;
  padding:8px 10px;
  border-radius:10px;
  cursor:pointer;
  text-decoration:none;
}
.nav-btn:hover{ background:rgba(255,255,255,.12) }

/* Dropdown support (if your project uses it) */
.dropdown{
  position:absolute;
  left:0;
  top:calc(100% + 6px);
  background:#fff;
  color:#111;
  border-radius:12px;
  box-shadow:var(--shadow);
  padding:8px;
  display:none;
  min-width:180px;
  z-index:20;
}
.nav-item.open .dropdown{ display:block }
.dropdown a{
  display:block;
  padding:8px 10px;
  border-radius:8px;
  color:#111;
  text-decoration:none;
  font-size:13px;
}
.dropdown a:hover{ background:#f3f5f8 }

/* Mobile menu (if present) */
.hamburger{
  display:none;
  background:none;
  border:none;
  color:#fff;
  padding:10px 12px;
  font-size:14px;
}
.mobile-menu{
  display:none;
  padding:10px;
  background:#fff;
  box-shadow:var(--shadow);
}
.mobile-menu[hidden]{ display:none }
.mobile-menu ul{ list-style:none; margin:0; padding:0 }

/* MAIN */
.main{
  max-width:1200px;
  margin:18px auto;
  padding:0 12px;
}

/* CARDS */
.cards{ display:grid; gap:12px }
.cards.three{ grid-template-columns:repeat(3,1fr) }
.cards.two{ grid-template-columns:repeat(2,1fr) }

.card{
  background:var(--card);
  border-radius:18px;
  box-shadow:var(--shadow);
  overflow:hidden;
}
.card .media{ position:relative; overflow:hidden }
.card .media img{
  width:100%;
  height:200px;
  object-fit:cover;
  display:block;
}
.badge{
  position:absolute;
  top:10px;
  left:10px;
  background:#ef5350;
  color:#fff;
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
}
.badge.time{
  left:auto;
  right:10px;
  background:#333;
}
.badge.breaking{
  top:46px;
  background:#d62828;
}

/* card text */
.card .card-body{ padding:14px }
.card .card-body h3{
  margin:0 0 8px;
  font-size:20px;
  line-height:1.2;
}
.card .card-body p{
  margin:0 0 10px;
  font-size:14px;
  color:#333;
}
.meta{
  display:flex;
  gap:10px;
  font-size:13px;
  color:#666;
  margin-bottom:8px;
}
.read-more{
  color:#d62828;
  text-decoration:none;
  font-weight:700;
}

/* Missing image placeholders */
.media-placeholder{
  height:200px;
  background:#f2f2f2;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:18px;
}
.media-placeholder-inner{
  width:100%;
  height:100%;
  border:3px solid #7a0d22;
  border-radius:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-size:26px;
  font-weight:700;
  color:#7a0d22;
  background:#f7f7f7;
}
.media-placeholder.accent-blue .media-placeholder-inner{ border-color:#1f6feb; color:#1f6feb }
.media-placeholder.accent-green .media-placeholder-inner{ border-color:#1f7a4d; color:#1f7a4d }

/* ACTION BAR (bottom of each content) */
.content-actions{
  display:flex;
  justify-content:center;
  gap:10px;
  padding:12px 12px 14px;
  border-top:1px solid #eee;
  background:#fff;
}
.icon-btn{
  border:1px solid #ddd;
  background:#fff;
  padding:8px 12px;
  border-radius:999px;
  cursor:pointer;
  font-size:13px;
}
.icon-btn:hover{ background:#f6f6f6 }
.icon-btn.active{
  border-color:#d62828;
  background:#fff5f5;
}

/* ARTICLE PAGE */
.article-wrap{
  max-width:980px;
  margin:0 auto;
  padding:26px 16px 60px;
}
.article-card{
  background:#fff;
  border-radius:18px;
  padding:22px 18px;
  box-shadow:var(--shadow);
}
.article-title{
  font-size:34px;
  margin:0 0 10px;
}
.article-hero{
  width:100%;
  max-height:520px;
  object-fit:cover;
  border-radius:14px;
  margin:12px 0;
}
.article-gallery{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}
.article-gallery img{
  height:160px;
  object-fit:cover;
  border-radius:12px;
}
.article-p{
  font-size:17px;
  line-height:1.85;
  margin-bottom:14px;
}

/* ABOUT + CHIEF EDITOR (if used) */
.page-hero-row{ display:flex; gap:16px }
.page-side{ width:170px; text-align:center }
.page-side img{
  width:150px;
  height:150px;
  object-fit:cover;
  border-radius:16px;
}

/* FOOTER */
.footer{
  background:var(--maroon);
  color:#fff;
  text-align:center;
  padding:14px 10px;
  margin-top:24px;
}

/* RESPONSIVE */
@media(max-width:900px){
  .cards.three{ grid-template-columns:repeat(2,1fr) }
}
@media(max-width:780px){
  .hamburger{ display:inline-block }
  .nav-list{ display:none }
  .mobile-menu{ display:block }
}
@media(max-width:600px){
  .cards.three,.cards.two{ grid-template-columns:1fr }
  .article-hero{ max-height:360px }
  .tools{ display:none }
}
