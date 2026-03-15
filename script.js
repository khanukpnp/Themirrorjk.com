/* ==========================
GLOBAL CONFIG
========================== */

const JSON_PATHS = {
    topstories: 'topstories.json',
    latest: 'latest.json',
    editorial: 'editorial.json',
    historical: 'historical.json',
    jk: 'jk.json',
    international: 'international.json',
    humanrights: 'humanrights.json',
    vlogs: 'vlogs.json',
    breaking: 'breaking.json'
};

const ARTICLES_PER_ARCHIVE_PAGE = 9;

/* ==========================
UTILITY: FETCH JSON
========================== */

async function fetchJSON(path) {
    try {
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Error loading JSON:', path, err);
        return [];
    }
}

/* ==========================
UTILITY: CREATE ARTICLE CARD
========================== */

function createArticleCard(article, categoryClass, isVlog = false) {
    const card = document.createElement('article');
    card.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'card-thumb';
    if (isVlog) thumb.classList.add('vlog-thumb');

    if (article.image) {
        thumb.style.backgroundImage = `url('${article.image}')`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
    } else {
        thumb.classList.add('placeholder-thumb');
    }

    const body = document.createElement('div');
    body.className = 'card-body';

    const cat = document.createElement('div');
    cat.className = `card-category ${categoryClass || 'cat-default'}`;
    cat.textContent = article.categoryLabel || article.category || 'Story';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = article.title || 'Untitled';

    const excerpt = document.createElement('p');
    excerpt.className = 'card-excerpt';
    excerpt.textContent = article.excerpt || article.summary || '';

    body.appendChild(cat);
    body.appendChild(title);
    body.appendChild(excerpt);

    card.appendChild(thumb);
    card.appendChild(body);

    if (article.id) {
        card.addEventListener('click', () => {
            window.location.href = `article.html?id=${encodeURIComponent(article.id)}`;
        });
        card.style.cursor = 'pointer';
    } else if (article.url) {
        card.addEventListener('click', () => {
            window.location.href = article.url;
        });
        card.style.cursor = 'pointer';
    }

    return card;
}

/* ==========================
HOMEPAGE: TOP STORIES
========================== */

async function loadTopStories(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const data = await fetchJSON(JSON_PATHS.topstories);
    container.innerHTML = '';

    const items = data.slice(0, 3);
    if (!items.length) return;

    items.forEach(article => {
        const card = createArticleCard(article, 'cat-breaking');
        container.appendChild(card);
    });
}

/* ==========================
HOMEPAGE: LATEST / EDITORIAL / HISTORICAL
========================== */

async function loadLatestEditorialHistorical(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const latestSlot = container.querySelector('[data-slot="latest"]');
    const editorialSlot = container.querySelector('[data-slot="editorial"]');
    const historicalSlot = container.querySelector('[data-slot="historical"]');

    const latestData = await fetchJSON(JSON_PATHS.latest);
    if (latestData.length && latestSlot) {
        fillSlotCard(latestSlot, latestData[0], 'cat-latest', 'Latest');
    }

    const editorialData = await fetchJSON(JSON_PATHS.editorial);
    if (editorialData.length && editorialSlot) {
        fillSlotCard(editorialSlot, editorialData[0], 'cat-editorial', 'Editorial');
    }

    const historicalData = await fetchJSON(JSON_PATHS.historical);
    if (historicalData.length && historicalSlot) {
        fillSlotCard(historicalSlot, historicalData[0], 'cat-historical', 'Historical');
    }
}

function fillSlotCard(slot, article, categoryClass, fallbackLabel) {
    const thumb = slot.querySelector('.card-thumb');
    const cat = slot.querySelector('.card-category');
    const title = slot.querySelector('.card-title');
    const excerpt = slot.querySelector('.card-excerpt');

    if (thumb && article.image) {
        thumb.classList.remove('placeholder-thumb');
        thumb.style.backgroundImage = `url('${article.image}')`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
    }

    if (cat) {
        cat.className = `card-category ${categoryClass}`;
        cat.textContent = article.categoryLabel || article.category || fallbackLabel;
    }

    if (title) title.textContent = article.title || fallbackLabel;
    if (excerpt) excerpt.textContent = article.excerpt || article.summary || '';

    if (article.id) {
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', () => {
            window.location.href = `article.html?id=${encodeURIComponent(article.id)}`;
        });
    }
}

/* ==========================
HOMEPAGE: JK / INT / HR
========================== */

async function loadJKSection(selector) {
    await loadTwoCardSection(selector, JSON_PATHS.jk, 'cat-jk', 'Jammu & Kashmir');
}

async function loadInternationalSection(selector) {
    await loadTwoCardSection(selector, JSON_PATHS.international, 'cat-international', 'International');
}

async function loadHumanRightsSection(selector) {
    await loadTwoCardSection(selector, JSON_PATHS.humanrights, 'cat-humanrights', 'Human Rights');
}

async function loadTwoCardSection(selector, jsonPath, categoryClass, fallbackLabel) {
    const container = document.querySelector(selector);
    if (!container) return;

    const data = await fetchJSON(jsonPath);
    if (!data.length) return;

    container.innerHTML = '';

    const items = data.slice(0, 2);
    items.forEach(article => {
        const card = createArticleCard(article, categoryClass);
        container.appendChild(card);
    });
}

/* ==========================
VLOGS
========================== */

let VLOG_DATA = [];
let VLOG_FILTER = 'all';

async function loadVlogs(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    VLOG_DATA = await fetchJSON(JSON_PATHS.vlogs);
    renderVlogs(container);
}

function renderVlogs(container) {
    container.innerHTML = '';

    const filtered = VLOG_DATA.filter(v => {
        if (VLOG_FILTER === 'all') return true;
        const type = (v.type || v.category || '').toLowerCase();
        return type === VLOG_FILTER;
    }).slice(0, 9);

    if (!filtered.length) {
        const placeholder = document.createElement('div');
        placeholder.className = 'card placeholder-card';
        placeholder.innerHTML = `
            <div class="card-thumb placeholder-thumb vlog-thumb"></div>
            <div class="card-body">
                <div class="card-category cat-vlog">Vlog</div>
                <h3>No videos available in this category yet</h3>
                <p>New video reports and interviews will be added soon.</p>
            </div>
        `;
        container.appendChild(placeholder);
        return;
    }

    filtered.forEach(v => {
        const card = document.createElement('article');
        card.className = 'card';

        const thumb = document.createElement('div');
        thumb.className = 'card-thumb vlog-thumb';

        if (v.thumbnail) {
            thumb.style.backgroundImage = `url('${v.thumbnail}')`;
            thumb.style.backgroundSize = 'cover';
            thumb.style.backgroundPosition = 'center';
        } else {
            thumb.classList.add('placeholder-thumb');
        }

        const body = document.createElement('div');
        body.className = 'card-body';

        const cat = document.createElement('div');
        cat.className = 'card-category cat-vlog';
        cat.textContent = v.typeLabel || v.type || 'Vlog';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = v.title || 'Untitled Video';

        const meta = document.createElement('p');
        meta.className = 'card-excerpt';
        const duration = v.duration ? ` • ${v.duration}` : '';
        meta.textContent = (v.description || '') + duration;

        body.appendChild(cat);
        body.appendChild(title);
        body.appendChild(meta);

        card.appendChild(thumb);
        card.appendChild(body);

        if (v.youtubeId) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(v.youtubeId)}`, '_blank');
            });
        } else if (v.url) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(v.url, '_blank');
            });
        }

        container.appendChild(card);
    });
}

function filterVlogs(filter) {
    VLOG_FILTER = filter;
    const container = document.querySelector('#vlogs-grid');
    if (!container) return;
    renderVlogs(container);
}

/* ==========================
BREAKING TICKER
========================== */

async function loadBreakingTicker(selector) {
    const list = document.querySelector(selector);
    if (!list) return;

    const data = await fetchJSON(JSON_PATHS.breaking);
    list.innerHTML = '';

    if (!data.length) {
        const li = document.createElement('li');
        li.textContent = 'No breaking news at the moment.';
        list.appendChild(li);
        return;
    }

    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title || item.text || '';
        list.appendChild(li);
    });
}

/* ==========================
CLOCKS & CALENDARS (STATIC WEATHER)
========================== */

function initClocksAndCalendars() {

    /* ---- CLOCKS ---- */
    function updateClocks() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const t = now.toLocaleTimeString('en-GB', options);

        setText('clock-zurich', `Zurich: ${t}`);
        setText('clock-rawalakot', `Rawalakot: ${t}`);
        setText('clock-jammu', `Jammu: ${t}`);
        setText('clock-kashmir', `Kashmir: ${t}`);
        setText('clock-ladakh', `Ladakh: ${t}`);
        setText('clock-gilgit', `Gilgit: ${t}`);
        setText('clock-muzaffarabad', `Muzaffarabad: ${t}`);
    }

    /* ---- CALENDARS ---- */
    function updateCalendars() {
        const now = new Date();

        const greg = now.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        setText('gregorian-date', greg);
        setText('hijri-date', 'Hijri: (static)');
        setText('bikrami-date', 'Bikrami: (static)');
        setText('vikram-samvat-date', 'Vikram Samvat: (static)');
    }

    /* ---- STATIC WEATHER ---- */
    function setStaticWeather() {
        setText('wx-zurich', '7°C');
        setText('wx-rawalakot', '9°C');
        setText('wx-jammu', '18°C');
        setText('wx-kashmir', '5°C');
        setText('wx-ladakh', '2°C');
        setText('wx-gilgit', '3°C');
        setText('wx-muzaffarabad', '8°C');
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    updateClocks();
    updateCalendars();
    setStaticWeather();

    setInterval(updateClocks, 1000 * 30);
}

/* ==========================
ARCHIVE PAGINATION
========================== */

async function loadArchiveSection(jsonFile, gridSelector, paginationSelector) {
    const grid = document.querySelector(gridSelector);
    const pagination = document.querySelector(paginationSelector);
    if (!grid || !pagination) return;

    const data = await fetchJSON(jsonFile);

    if (!data.length) {
        grid.innerHTML = '<p class="archive-empty">No archived content available yet.</p>';
        pagination.innerHTML = '';
        return;
    }

    const state = {
        data,
        currentPage: 1,
        totalPages: Math.ceil(data.length / ARTICLES_PER_ARCHIVE_PAGE)
    };

    function renderPage(page) {
        state.currentPage = page;
        grid.innerHTML = '';

        const start = (page - 1) * ARTICLES_PER_ARCHIVE_PAGE;
        const end = start + ARTICLES_PER_ARCHIVE_PAGE;
        const slice = data.slice(start, end);

        slice.forEach(article => {
            const catClass = mapCategoryToClass(article.category || article.section);
            const card = createArticleCard(article, catClass);
            grid.appendChild(card);
        });

        renderPaginationControls(pagination, state, renderPage);
    }

    renderPage(1);
}

function renderPaginationControls(container, state, onPageChange) {
    container.innerHTML = '';

    if (state.totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.textContent = '← Previous';
    prev.disabled = state.currentPage === 1;
    prev.addEventListener('click', () => {
        if (state.currentPage > 1) onPageChange(state.currentPage - 1);
    });

    const next = document.createElement('button');
    next.textContent = 'Next →';
    next.disabled = state.currentPage === state.totalPages;
    next.addEventListener('click', () => {
        if (state.currentPage < state.totalPages) onPageChange(state.currentPage + 1);
    });

    const info = document.createElement('span');
    info.className = 'pagination-info';
    info.textContent = `Page ${state.currentPage} of ${state.totalPages}`;

    container.appendChild(prev);
    container.appendChild(info);
    container.appendChild(next);
}

function mapCategoryToClass(cat) {
    if (!cat) return 'cat-default';

    const c = cat.toLowerCase();

    if (c.includes('breaking')) return 'cat-breaking';
    if (c.includes('latest')) return 'cat-latest';
    if (c.includes('editorial')) return 'cat-editorial';
    if (c.includes('historical')) return 'cat-historical';
    if (c.includes('human')) return 'cat-humanrights';
    if (c.includes('international')) return 'cat-international';
    if (c.includes('jammu') || c.includes('kashmir') || c === 'jk') return 'cat-jk';
    if (c.includes('vlog') || c.includes('video')) return 'cat-vlog';

    return 'cat-default';
}

/* ==========================
EXPORT HOOKS
========================== */

window.loadTopStories = loadTopStories;
window.loadLatestEditorialHistorical = loadLatestEditorialHistorical;
window.loadJKSection = loadJKSection;
window.loadInternationalSection = loadInternationalSection;
window.loadHumanRightsSection = loadHumanRightsSection;
window.loadVlogs = loadVlogs;
window.filterVlogs = filterVlogs;
window.loadBreakingTicker = loadBreakingTicker;
window.initClocksAndCalendars = initClocksAndCalendars;
window.loadArchiveSection = loadArchiveSection;
