const yearEl = document.getElementById("year")

if(yearEl){
yearEl.textContent = new Date().getFullYear()
}


const hamburger = document.getElementById("hamburger")
const mobileMenu = document.getElementById("mobile-menu")
const navList = document.getElementById("nav-list")

if(hamburger && mobileMenu && navList){

hamburger.addEventListener("click",()=>{

const open = mobileMenu.style.display === "flex"

mobileMenu.style.display = open ? "none" : "flex"

mobileMenu.innerHTML = open ? "" : navList.innerHTML

})

}



const contactBtn = document.getElementById("contactBtn")
const contactModal = document.getElementById("contactModal")
const closeContact = document.getElementById("closeContact")

if(contactBtn && contactModal){

contactBtn.onclick=()=>contactModal.classList.remove("hidden")

closeContact.onclick=()=>contactModal.classList.add("hidden")

contactModal.onclick=(e)=>{
if(e.target===contactModal){
contactModal.classList.add("hidden")
}
}

}



function updateClocks(){

const zones=[
{ id:"#clock-cest span", tz:"Europe/Zurich"},
{ id:"#tz-ist span", tz:"Asia/Kolkata"},
{ id:"#tz-pkt span", tz:"Asia/Karachi"}
]

zones.forEach(z=>{

const el=document.querySelector(z.id)

if(!el) return

const d=new Date(new Date().toLocaleString("en-US",{timeZone:z.tz}))

el.textContent=
String(d.getHours()).padStart(2,"0")+":"+
String(d.getMinutes()).padStart(2,"0")+":"+
String(d.getSeconds()).padStart(2,"0")

})

}

setInterval(updateClocks,1000)

updateClocks()



async function updateHijri(){

const el=document.querySelector("#cal-hijri span")

if(!el) return

try{

const today=new Date().toISOString().split("T")[0]

const res=await fetch("https://api.aladhan.com/v1/gToH/"+today)

const data=await res.json()

const h=data.data.hijri

el.textContent=h.day+" "+h.month.en+" "+h.year

}catch{}

}

updateHijri()



function updateVikramSamvat(){

const el=document.querySelector("#cal-hindi span")

if(!el) return

el.textContent="VS "+(new Date().getFullYear()+57)

}

updateVikramSamvat()
