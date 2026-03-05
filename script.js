// ================= GLOBAL HELPERS =================

const $ = (sel, ctx=document) => ctx.querySelector(sel)
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)]

async function fetchJSON(path){
const res = await fetch(path + "?v=" + Date.now(),{cache:"no-store"})
if(!res.ok) throw new Error("Failed loading " + path)
return res.json()
}



// ================= PAGE INIT =================

document.addEventListener("DOMContentLoaded", async function(){

updateTimes()
updateCalendars()
updateYear()

setInterval(updateTimes,1000)

loadWeather()
loadTicker()
loadHomepage()

})



// ================= YEAR =================

function updateYear(){
const el = $("#year")
if(el) el.textContent = new Date().getFullYear()
}



// ================= CLOCKS =================

function updateTimes(){

const now = new Date()

const cest = $("#clock-cest span")
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
}).format(now)
}

const ist = $("#tz-ist span")
if(ist){
ist.textContent =
new Intl.DateTimeFormat('en-GB',{
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
hour12:false,
timeZone:'Asia/Kolkata'
}).format(now)
}

const pkt = $("#tz-pkt span")
if(pkt){
pkt.textContent =
new Intl.DateTimeFormat('en-GB',{
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
hour12:false,
timeZone:'Asia/Karachi'
}).format(now)
}

}



// ================= CALENDARS =================

function updateCalendars(){

const now = new Date()

const hijri = $("#cal-hijri span")

if(hijri){
hijri.textContent =
new Intl.DateTimeFormat(
'en-TN-u-ca-islamic',
{day:'numeric',month:'long',year:'numeric'}
).format(now)
}

const vs = $("#cal-hindi span")

if(vs){
vs.textContent =
new Intl.DateTimeFormat(
'en-IN-u-ca-indian',
{day:'numeric',month:'long',year:'numeric'}
).format(now)
}

}



// ================= WEATHER =================

async function loadWeather(){

const cities = [
["Zurich",47.37,8.54],
["Rawalakot",33.85,73.75],
["Jammu",32.73,74.86],
["Kashmir",34.08,74.79],
["Ladakh",34.15,77.57],
["Gilgit",35.92,74.30],
["Baltistan",35.28,75.63],
["Muzaffarabad",34.37,73.47]
]

const bar = $("#weather-bar")
if(!bar) return

bar.innerHTML=""

for(const c of cities){

try{

const url=`https://api.open-meteo.com/v1/forecast?latitude=${c[1]}&longitude=${c[2]}&current_weather=true`

const res=await fetch(url)
const data=await res.json()

const temp=data.current_weather.temperature

const chip=document.createElement("div")
chip.className="chip tiny"
chip.textContent=`${c[0]}: ${temp}°C`

bar.appendChild(chip)

}catch(e){

console.log("weather error",e)

}

}

}



// ================= TICKER =================

async function loadTicker(){

try{

const data = await fetchJSON("content/index.json")

const ticker = $("#ticker-items")
if(!ticker) return

ticker.innerHTML=""

data.ticker.forEach(t=>{
const li=document.createElement("li")
li.textContent=t
ticker.appendChild(li)
})

}catch(e){

console.log("Ticker error",e)

}

}



// ================= HOMEPAGE CONTENT =================

async function loadHomepage(){

try{

const index = await fetchJSON("content/index.json")

const articles = await fetchJSON("content/articles.json")
const blog = await fetchJSON("content/blog.json")
const breaking = await fetchJSON("content/breaking.json")
const editorial = await fetchJSON("content/editorial.json")

const all = [

...(articles.items || []),
...(blog.items || []),
...(breaking.items || []),
...(editorial.items || [])

]


function find(id){
return all.find(a=>a.id===id)
}



// ===== TOP STORIES =====

fillCard(find(index.homepage.topStories.lead),
"#lead-media","#lead-body")

fillCard(find(index.homepage.topStories.breaking),
"#breaking-media","#breaking-body")

fillCard(find(index.homepage.topStories.opinion),
"#opinion-media","#opinion-body")



// ===== LATEST EDITORIAL HISTORICAL =====

fillCard(find(index.homepage.latestEditorialHistorical.latest),
"#leh1-media","#leh1-body")

fillCard(find(index.homepage.latestEditorialHistorical.editorial),
"#leh2-media","#leh2-body")

fillCard(find(index.homepage.latestEditorialHistorical.historical),
"#leh3-media","#leh3-body")



}catch(e){

console.log("homepage error",e)

}

}



// ================= CARD RENDER =================

function fillCard(item,mediaSel,bodySel){

const media=$(mediaSel)
const body=$(bodySel)

if(!media||!body) return

if(!item){

body.innerHTML="<h3>Coming Soon</h3><p>Content will be added shortly.</p>"
return

}

if(item.heroImage && item.heroImage.src){

media.innerHTML=
`<img src="${item.heroImage.src}" alt="${item.title}">`

media.classList.remove("placeholder")

}

body.innerHTML=`
<h3>${item.title}</h3>
<p>${item.excerpt || ""}</p>
<a class="read-more" href="article.html?id=${item.id}">Read More →</a>
`

}
