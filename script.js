/* ============================================================
   PAGE LOADER
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("site-loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 600);
    }, 1200);
});

/* ============================================================
   GREGORIAN DATE
============================================================ */

function updateGregorianDate() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const formatted = now.toLocaleDateString("en-US", options);
    document.getElementById("gregorian-date").textContent = formatted;
}

/* ============================================================
   HIJRI DATE (Umm al-Qura)
============================================================ */

function updateHijriDate() {
    try {
        const today = new Date();
        const hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(today);

        document.getElementById("hijri-date").textContent = hijri;
    } catch (e) {
        document.getElementById("hijri-date").textContent = "Hijri unavailable";
    }
}

/* ============================================================
   PUNJABI DESI BIKRAMI DATE
   (Simplified solar calendar approximation)
============================================================ */

function updateBikramiDate() {
    const now = new Date();
    const monthNames = [
        "Chet", "Vaisakh", "Jeth", "Harh", "Sawan", "Bhadon",
        "Assu", "Kattak", "Maghar", "Poh", "Magh", "Phagun"
    ];

    const startMonth = 3; // Chet starts mid-March
    const year = now.getFullYear() + 57; // Bikrami year offset
    const month = (now.getMonth() - startMonth + 12) % 12;
    const day = now.getDate();

    const formatted = `${day} ${monthNames[month]} ${year} BK`;
    document.getElementById("bikrami-date").textContent = formatted;
}

/* ============================================================
   INITIALIZE DATES
============================================================ */

updateGregorianDate();
updateHijriDate();
updateBikramiDate();
setInterval(updateGregorianDate, 60000);
setInterval(updateHijriDate, 60000);
setInterval(updateBikramiDate, 60000);
/* ============================================================
   REGIONAL CLOCKS — IST (Jammu, Kashmir, Ladakh)
   & PST (Gilgit, Baltistan, Muzaffarabad)
============================================================ */

function formatTime(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;

    return `${h}:${m}:${s}`;
}

function updateRegionalClocks() {
    const now = new Date();

    /* ------------------------------
       IST — UTC+5:30
    ------------------------------ */
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset - (now.getTimezoneOffset() * 60000));

    document.getElementById("clock-jammu").textContent =
        `Jammu (IST): ${formatTime(istTime)}`;

    document.getElementById("clock-kashmir").textContent =
        `Kashmir (IST): ${formatTime(istTime)}`;

    document.getElementById("clock-ladakh").textContent =
        `Ladakh (IST): ${formatTime(istTime)}`;

    /* ------------------------------
       PST — UTC+5:00
    ------------------------------ */
    const pstOffset = 5 * 60 * 60 * 1000;
    const pstTime = new Date(now.getTime() + pstOffset - (now.getTimezoneOffset() * 60000));

    document.getElementById("clock-gilgit").textContent =
        `Gilgit (PST): ${formatTime(pstTime)}`;

    document.getElementById("clock-baltistan").textContent =
        `Baltistan (PST): ${formatTime(pstTime)}`;

    document.getElementById("clock-muzaffarabad").textContent =
        `Muzaffarabad (PST): ${formatTime(pstTime)}`;
}

/* ============================================================
   INITIALIZE CLOCKS
============================================================ */

updateRegionalClocks();
setInterval(updateRegionalClocks, 1000);
