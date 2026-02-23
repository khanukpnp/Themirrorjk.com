Updated Final Live index.html 23 feb2026
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- ================= META & HEAD ================= -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="./" />

    <title>THE MIRROR JAMMU KASHMIR</title>
    <meta name="description"
        content="The Mirror Jammu Kashmir — Champion justice & amplify the voices of the unheard." />

    <!-- Preconnect for Weather API -->
    <link rel="preconnect" href="https://api.open-meteo.com">

    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="styles.css?v=9" />
</head>

<body id="top" class="theme-maroon">

    <!-- ================= HEADER ================= -->
    <header class="site-header">
        <div class="header-row">
            <img src="assets/logo.png" alt="Logo" class="logo" />
            <h1 class="site-title">THE MIRROR JAMMU KASHMIR</h1>
            <img src="assets/logo.png" alt="Logo" class="logo" />
        </div>

        <div class="subheading">
            CHAMPION JUSTICE & AMPLIFY THE VOICES OF THE UNHEARD… REVEALING THE TRUTH BEYOND BORDERS
        </div>
    </header>

    <!-- ================= CLOCKS ================= -->
    <section class="bar clocks-line" aria-label="Clocks and Calendars">
        <div class="row tight nowrap">
            <!-- Clock chips dynamically updated via JS -->
            <div id="clock-cest" class="chip tiny">🕒 <span>Loading CEST…</span></div>
            <div id="cal-hijri" class="chip tiny">📅 <span>Hijri…</span></div>
            <div id="cal-hindi" class="chip tiny">📅 <span>VS…</span></div>
            <div id="tz-ist" class="chip tiny">🕒 IST (Jammu-Kashmir-Ladakh): <span>—:—</span></div>
            <div id="tz-pkt" class="chip tiny">🕒 PKT (Gilgit-Baltistan & Azad Kashmir): <span>—:—</span></div>
        </div>
    </section>

    <!-- ================= WEATHER ================= -->
    <section class="bar weather-line" aria-label="Weather">
        <div class="row nowrap super-tight" id="weather-bar"></div>
    </section>

    <!-- ================= TICKER ================= -->
    <section class="ticker-wrap" aria-label="Breaking Ticker">
        <div class="ticker">

            <!-- Ticker label (filled by JS if needed) -->
            <span></span>

            <!-- Scrolling ticker items -->
            <ul id="ticker-items">
                <li>WELCOME TO THE MIRROR JAMMU KASHMIR — EMPOWERING TRUTH BEYOND BORDERS.</li>
                <li>SUBMIT YOUR ISSUES, NEWS, FEEDBACK, URGENT MATTERS, VIA EMAIL OR THE CONTACT FORM BELOW.</li>
                <li>THE MIRROR JAMMU KASHMIR AN INDEPENDENT DIGITAL MEDIA PLATFORM DEDICATED TO TRUTH JUSTICE AND HUMAN DIGNITY</li>
                <li>WE CHALLENGE SILENCE EXPOSE INJUSTICE AND AMPLIFY SUPPRESSED VOICES</li>
                <li>OUR MISSION CHAMPION JUSTICE AND SPEAK TRUTH WITHOUT FEAR</li>
                <li>HOPE BECOMES REAL THROUGH ACTION PERSISTENCE AND PRINCIPLED JOURNALISM</li>
                <li>ALL HUMAN BEINGS ARE BORN FREE AND EQUAL IN DIGNITY AND RIGHTS</li>
                <li>EQUALITY WITHOUT DISCRIMINATION IS A RIGHT NOT A PRIVILEGE</li>
                <li>DEMOCRACY DERIVES LEGITIMACY FROM THE WILL AND PARTICIPATION OF THE PEOPLE</li>
                <li>DEMOCRACY CANNOT SURVIVE WHERE HUMAN RIGHTS ARE VIOLATED OR POPULATIONS EXCLUDED</li>
                <li>THE MIRROR JAMMU KASHMIR STANDS AGAINST THE GLOBAL EROSION OF HUMAN RIGHTS</li>
                <li>NEO COLONIAL PRACTICES AND MODERN FORMS OF SLAVERY REMAIN PRESENT DAY REALITIES</li>
                <li>JAMMU KASHMIR A MULTI RELIGIOUS MULTI CULTURAL MULTI LINGUAL AND MULTI ETHNIC SOCIETY</li>
                <li>SINCE 1947 THE PEOPLE OF JAMMU KASHMIR HAVE REMAINED FORCIBLY DIVIDED</li>
                <li>FREEDOM OF MOVEMENT EXPRESSION PRESS ASSEMBLY AND ASSOCIATION ARE ROUTINELY DENIED</li>
                <li>INDEPENDENT JOURNALISM IS INCREASINGLY MARGINALIZED FREEDOM OF THE PRESS IS ESSENTIAL</li>
                <li>WE PRESENT VERIFIED FACTS TREATIES AND GROUND REALITIES</li>
                <li>WE REMIND STATES OF THEIR RESPONSIBILITIES UNDER INTERNATIONAL LAW AND UN OBLIGATIONS</li>
                <li>WE ASSESS POLICIES AGAINST PROMISES AND ACTIONS AGAINST PLEDGES</li>
                <li>WE DO NOT MANUFACTURE NARRATIVES WE REFLECT REALITY</li>
                <li>THE MIRROR JAMMU KASHMIR HOLDS UP A MIRROR TO POWER POLICY HISTORY AND TRUTH</li>
                <li>GOT NEWS FEEDBACK OR URGENT UPDATES CONTACT THE MIRROR JAMMU KASHMIR NOW</li>
                <li>FOLLOW OUR YOUTUBE CHANNEL THE MIRROR JAMMU KASHMIR FOR LATEST VLOGS EVENTS NEWS AND TALK SHOWS PLEASE SUBSCRIBE LIKE AND SHARE</li>
            </ul>

            <!-- Language selector + Search -->
            <div class="tools">
                <label class="lang-select">
                    🌍
                    <select id="language-select">
                        <option value="en" selected>English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="ur">Urdu</option>
                        <option value="hi">Hindi</option>
                        <option value="ar">Arabic</option>
                    </select>
                </label>

                <form class="search" onsubmit="event.preventDefault();">
                    <input id="search-input" type="search" placeholder="Search…" />
                    <button type="submit">🔍</button>
                </form>
            </div>

        </div>
    </section>
    <!-- ================= NAVIGATION ================= -->
    <nav class="navbar" aria-label="Primary Navigation">

        <!-- Mobile hamburger button -->
        <button class="hamburger" aria-expanded="false" aria-controls="mobile-menu" id="hamburger">
            ☰ Menu
        </button>

        <!-- Desktop Navigation -->
        <ul class="nav-list" id="nav-list">

            <!-- HOME (with dropdown) -->
            <li class="nav-item has-sub">
                <button class="nav-btn">🏠 Home</button>
                <div class="dropdown">
                    <a href="about.html">About</a>
                    <a href="chief-editor.html">Chief Editor</a>
                    <a href="#contact">Contact</a>
                </div>
            </li>

            <!-- Breaking -->
            <li class="nav-item">
                <a class="nav-btn" href="#breaking">🆕 Breaking News</a>
            </li>

            <!-- Blog -->
            <li class="nav-item has-sub">
                <button class="nav-btn">📝 Blog</button>
                <div class="dropdown wide">
                    <a href="#editorial">Editorial</a>
                    <a href="#opinion">Opinion</a>
                    <a href="#updates">Latest Updates</a>
                </div>
            </li>

            <!-- Vlog -->
            <li class="nav-item has-sub">
                <button class="nav-btn">🎥 Vlog</button>
                <div class="dropdown">
                    <a href="#vlog-latest">Latest Vlogs</a>
                    <a href="#vlog-archive">Archive</a>
                </div>
            </li>

            <!-- E-Paper -->
            <li class="nav-item">
                <a class="nav-btn" href="#epaper">📰 E-Paper</a>
            </li>

            <!-- Jammu Kashmir -->
            <li class="nav-item has-sub">
                <button class="nav-btn">📍 Jammu Kashmir</button>
                <div class="dropdown wide">
                    <a href="#jk-region">Regions</a>
                    <a href="#jk-history">History</a>
                    <a href="#jk-culture">Culture</a>
                </div>
            </li>

            <!-- Historical Documents -->
            <li class="nav-item has-sub">
                <button class="nav-btn">📜 Historical Documents</button>
                <div class="dropdown wide">
                    <a href="#docs-treaties">Treaties</a>
                    <a href="#docs-archives">Archives</a>
                    <a href="#docs-letters">Letters</a>
                </div>
            </li>

            <!-- UN & Human Rights -->
            <li class="nav-item has-sub">
                <button class="nav-btn">🕊️ UN & Human Rights</button>
                <div class="dropdown">
                    <a href="#unhrc">UNHRC</a>
                    <a href="#reports">Reports</a>
                    <a href="#advocacy">Advocacy</a>
                </div>
            </li>

            <!-- Global Advocacy -->
            <li class="nav-item has-sub">
                <button class="nav-btn">🌐 Global Advocacy</button>
                <div class="dropdown wide">
                    <a href="#campaigns">Campaigns</a>
                    <a href="#partners">Partners</a>
                    <a href="#get-involved">Get Involved</a>
                </div>
            </li>

        </ul>

        <!-- Mobile menu container (filled by JS) -->
        <div id="mobile-menu" class="mobile-menu" hidden></div>

    </nav>

    <!-- ================= MAIN CONTENT ================= -->
    <main class="main">

        <!-- ================= LATEST ARTICLES + BREAKING + BLOG ================= -->
        <section class="card-col" id="articles">

            <!-- Section Header -->
            <h2 class="rail-header red-label">
                <span>📝 Latest Articles</span>
            </h2>

            <!-- 3-column layout -->
            <div class="cards three">

                <!-- LEFT COLUMN: Latest Article -->
                <article class="card post">
                    <div id="latest-article-media" class="media placeholder maroon">
                        Editorial Placeholder
                    </div>

                    <div class="card-body" id="latest-article-body">
                        <h3>Kashmir Peace Process: New Hope for Dialogue</h3>
                        <p>International mediators express optimism about recent developments.</p>
                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

                <!-- MIDDLE COLUMN: Breaking -->
                <article class="card post">
                    <div id="breaking" class="media placeholder blue"></div>
                    <div class="card-body" id="breaking-body"></div>
                </article>

                <!-- RIGHT COLUMN: Blog / Opinion -->
                <article class="card post">
                    <div id="latest-blog-media" class="media placeholder green">
                        Update Placeholder
                    </div>

                    <div class="card-body" id="latest-blog-body">
                        <h3>Educational Reform Initiative Launched</h3>
                        <p>New educational programs aim to provide quality education.</p>
                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

            </div>

            <!-- ================= ARCHIVES (filled by JS) ================= -->

            <!-- Articles archive -->
            <div id="articles-archive" class="archive-list"></div>

            <!-- Breaking archive -->
            <div id="breaking-archive" class="archive-list"></div>

            <!-- Blog archive -->
            <div id="blog-archive" class="archive-list"></div>

        </section>
        <!-- ================= INTERNATIONAL NEWS ================= -->
        <section class="section-rail">

            <!-- Section Header -->
            <div class="rail-header red-label">
                <span>🌐 International News</span>
            </div>

            <!-- Two-column layout -->
            <div class="cards two">

                <!-- International Article 1 -->
                <article class="card rail">
                    <div id="intl-media-1" class="media">
                        <img src="assets/sample-2.jpg" alt="UNSC" loading="lazy" decoding="async"
                            onerror="this.onerror=null;this.src='assets/placeholder.svg';" />
                    </div>

                    <div class="card-body" id="intl-body-1">
                        <h3>UN Security Council Addresses Regional Conflicts</h3>
                        <p>Emergency session discusses peaceful resolution mechanisms for disputed territories worldwide.</p>

                        <div class="meta">
                            <span class="author">International Desk</span>
                            <span class="date">1 hour ago</span>
                        </div>

                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

                <!-- International Article 2 -->
                <article class="card rail">
                    <div id="intl-media-2" class="media">
                        <img src="assets/sample-1.jpg" alt="EU Parliament" loading="lazy" decoding="async"
                            onerror="this.onerror=null;this.src='assets/placeholder.svg';" />
                    </div>

                    <div class="card-body" id="intl-body-2">
                        <h3>European Parliament Calls for Press Freedom</h3>
                        <p>Resolution passed supporting independent journalism in conflict zones.</p>

                        <div class="meta">
                            <span class="author">Brussels Correspondent</span>
                            <span class="date">6 hours ago</span>
                        </div>

                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

            </div>

            <!-- View All Button -->
            <div class="center">
                <a class="btn outline" href="#">View All International News</a>
            </div>

            <!-- International archive (filled by JS) -->
            <div id="international-archive" class="archive-list"></div>

        </section>

        <!-- ================= VLOGS ================= -->
        <section id="vlog" class="vlogs card">

            <!-- Header -->
            <div class="vlogs-header">
                <h2>Video Reports & Vlogs</h2>
                <a class="btn yt" href="https://youtube.com" target="_blank" rel="noopener">Visit Channel ▶</a>
            </div>

            <p class="vlogs-sub">
                Watch in-depth reports, exclusive interviews, and documentary-style content.
            </p>

            <!-- Filter Pills -->
            <div class="filter-pills">
                <button class="pill active">All</button>
                <button class="pill">Interview</button>
                <button class="pill">Current Affairs</button>
                <button class="pill">Analysis</button>
                <button class="pill">Culture</button>
                <button class="pill">Forum</button>
                <button class="pill">Feature</button>
            </div>

            <!-- Vlog Cards -->
            <div class="cards three media-cards">

                <!-- Video 1 -->
                <article class="card video">
                    <div class="media">
                        <span class="badge cat">Interview</span>
                        <span class="badge duration">15:32</span>

                        <iframe width="100%" height="100%"
                            src="https://www.youtube.com/embed/VIDEO_ID_1"
                            title="Exclusive Interview: Peace Process Developments"
                            frameborder="0" allowfullscreen loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"></iframe>
                    </div>

                    <div class="card-body">
                        <h3>Exclusive Interview: Peace Process Developments</h3>
                        <p>In-depth conversation with diplomatic sources about ongoing negotiations and next steps.</p>
                    </div>
                </article>

                <!-- Video 2 -->
                <article class="card video">
                    <div class="media">
                        <span class="badge cat">Current Affairs</span>
                        <span class="badge duration">12:45</span>

                        <iframe width="100%" height="100%"
                            src="https://www.youtube.com/embed/VIDEO_ID_2"
                            title="Ground Report: Community Resilience Stories"
                            frameborder="0" allowfullscreen loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"></iframe>
                    </div>

                    <div class="card-body">
                        <h3>Ground Report: Community Resilience Stories</h3>
                        <p>Documenting how local communities are adapting and supporting each other.</p>
                    </div>
                </article>

                <!-- Video 3 -->
                <article class="card video">
                    <div class="media">
                        <span class="badge cat">Analysis</span>
                        <span class="badge duration">18:20</span>

                        <iframe width="100%" height="100%"
                            src="https://www.youtube.com/embed/VIDEO_ID_3"
                            title="Analysis: Human Rights Legal Framework"
                            frameborder="0" allowfullscreen loading="lazy"
                            referrerpolicy="strict-origin-when-cross-origin"></iframe>
                    </div>

                    <div class="card-body">
                        <h3>Analysis: Human Rights Legal Framework</h3>
                        <p>Expert breakdown of key legal mechanisms and obligations.</p>
                    </div>
                </article>

            </div>

            <!-- Load More -->
            <div class="center">
                <button class="btn load">Load More Videos</button>
            </div>

        </section>

        <!-- ================= HUMAN RIGHTS ================= -->
        <section class="section-rail">

            <!-- Section Header -->
            <div class="rail-header red-label">
                <span>🧑‍⚕️ Human Rights</span>
            </div>

            <!-- Two-column layout -->
            <div class="cards two">

                <!-- HR Article 1 -->
                <article class="card rail">
                    <div id="hr-media-1" class="media">
                        <img src="assets/sample-3.jpg" alt="Aid" loading="lazy" decoding="async"
                            onerror="this.onerror=null;this.src='assets/placeholder.svg';" />
                    </div>

                    <div class="card-body" id="hr-body-1">
                        <h3>Humanitarian Organizations Launch Aid Initiative</h3>
                        <p>International relief efforts focus on providing essential services to affected communities.</p>

                        <div class="meta">
                            <span class="author">Human Rights Desk</span>
                            <span class="date">3 hours ago</span>
                        </div>

                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

                <!-- HR Article 2 -->
                <article class="card rail">
                    <div id="hr-media-2" class="media">
                        <img src="assets/sample-2.jpg" alt="Legal" loading="lazy" decoding="async"
                            onerror="this.onerror=null;this.src='assets/placeholder.svg';" />
                    </div>

                    <div class="card-body" id="hr-body-2">
                        <h3>Legal Advocacy Groups File Petition</h3>
                        <p>Human rights lawyers present case for civilian protection measures.</p>

                        <div class="meta">
                            <span class="author">Legal Correspondent</span>
                            <span class="date">5 hours ago</span>
                        </div>

                        <a class="read-more" href="#">Read More →</a>
                    </div>
                </article>

            </div>

            <!-- View All Button -->
            <div class="center">
                <a class="btn outline" href="#">View All Human Rights</a>
            </div>

            <!-- Human Rights archive -->
            <div id="humanrights-archive" class="archive-list"></div>

        </section>
        <!-- ================= E-PAPER ================= -->
        <section id="epaper" class="epaper card">

            <h2>📰 E-Paper Upload</h2>

            <p>
                Upload your digital publication (PDF).  
                This section is a placeholder; connect to your preferred CMS or cloud later.
            </p>

            <form name="epaper" method="POST" data-netlify="true">
                <input type="file" name="file" accept=".pdf" />
                <button class="btn" type="submit">Upload</button>
            </form>

        </section>

        <!-- ================= CONTACT & NEWSLETTER ================= -->
        <section id="contact" class="contact-wrap">

            <!-- Newsletter -->
            <div class="newsletter card">
                <h2>📬 Newsletter</h2>

                <form name="newsletter" method="POST" data-netlify="true">
                    <input type="email" name="email" placeholder="your@email.com" required />
                    <button class="btn" type="submit">Subscribe</button>
                </form>
            </div>

            <!-- Contact -->
            <div class="contact card">
                <h2>✉️ Contact</h2>

                <p>
                    Email:
                    <a href="mailto:themirrorjk@gmail.com">themirrorjk@gmail.com</a>
                    • Phone:
                    <a href="tel:+41783131213">+41 783 13 12 13</a>
                </p>

                <button class="btn" id="open-contact">Open Contact Form</button>
            </div>

        </section>

    </main>

    <!-- ================= FOOTER ================= -->
    <footer class="footer">

        <div class="social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="YouTube">▶️</a>
            <a href="#" aria-label="Facebook">📘</a>

            <button class="btn small outline" id="share-btn">Share</button>
        </div>

        <p>
            © <span id="year"></span> THE MIRROR JAMMU KASHMIR.  
            All rights reserved.
            <a href="/admin/" class="admin-link">Admin</a>
        </p>

    </footer>

    <!-- ================= CONTACT MODAL ================= -->
    <dialog id="contact-modal" class="modal">

        <form name="contact" method="POST" data-netlify="true"
            enctype="multipart/form-data" class="modal-card">

            <!-- Required for Netlify -->
            <input type="hidden" name="form-name" value="contact">

            <h3>Contact Form</h3>

            <label>
                Name
                <input type="text" name="name" required />
            </label>

            <label>
                Email
                <input type="email" name="email" value="themirrorjk@gmail.com" required />
            </label>

            <label>
                Message
                <textarea name="message" rows="4" required></textarea>
            </label>

            <!-- File Upload -->
            <label>
                Attach File (PDF / JPG / PNG)
                <input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png" />
            </label>

            <div class="modal-actions">
                <button type="submit" class="btn">Submit</button>
                <button type="button" class="btn outline" id="close-contact">Exit</button>
            </div>

        </form>

    </dialog>

    <!-- ================= MOBILE STICKY NAV ================= -->
    <nav class="mobile-sticky">
        <a href="#top" aria-label="Home">🏠</a>
        <button id="sticky-search" aria-label="Search">🔍</button>
        <button id="sticky-like" aria-label="Like">❤️</button>
        <button id="sticky-share" aria-label="Share">🔗</button>
        <button id="sticky-menu" aria-label="Menu">☰</button>
    </nav>

    <!-- ================= SCRIPT ================= -->
    <script src="script.js?v=6"></script>

</body>
</html>
