// ============================
// UTILITIES
// ============================
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function normalizeItem(data) {
  if (Array.isArray(data.items)) {
    return data.items[0];
  }
  return data;
}

// Map IDs to JSON file paths
function getJsonPathById(id) {
  // Articles
  if (id === 'article-001') return 'content/article-rawalakot-loadshedding.json';
  if (id === 'breaking-001') return 'content/breaking-emma-meeting.json';
  if (id === 'blog-001') return 'content/blog-ukpnp-briefs-mps.json';

  if (id === 'latest-001') return 'content/latest-001.json';
  if (id === 'editorial-001') return 'content/editorial-brief-history.json';
  if (id === 'historical-001') return 'content/historical-001.json';

  if (id === 'jk-001') return 'content/jk-001.json';
  if (id === 'jk-002') return 'content/jk-002.json';

  if (id === 'intl-001') return 'content/intl-001.json';
  if (id === 'intl-002') return 'content/intl-002.json';

  if (id === 'hr-001') return 'content/hr-001.json';
  if (id === 'hr-002') return 'content/hr-002.json';

  if (id === 'about') return 'content/about.json';
  if (id === 'chief-editor') return 'content/chief-editor.json';

  return null;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

// ============================
// HOMEPAGE: INDEX + SECTIONS
// ============================
async function buildHomePage() {
  const indexPath = 'content/index.json';
  let index;
  try {
    index = await loadJson(indexPath);
  } catch (e) {
    console.error('Index load error', e);
    return;
  }

  // Top Stories
  try {
    const leadData = normalizeItem(await loadJson(getJsonPathById(index.topStories.lead)));
    const breakingData = normalizeItem(await loadJson(getJsonPathById(index.topStories.breaking)));
    const opinionData = normalizeItem(await loadJson(getJsonPathById(index.topStories.opinion)));

    const leadImg = document.getElementById('top-lead-img');
    const breakingImg = document.getElementById('top-breaking-img');
    const opinionImg = document.getElementById('top-opinion-img');

    if (leadImg && leadData.heroImage) {
      leadImg.style.backgroundImage = `url(${leadData.heroImage.src})`;
    }
    if (breakingImg && breakingData.heroImage) {
      breakingImg.style.backgroundImage = `url(${breakingData.heroImage.src})`;
    }
    if (opinionImg && opinionData.heroImage) {
      opinionImg.style.backgroundImage = `url(${opinionData.heroImage.src})`;
    }

    const leadTitle = document.getElementById('top-lead-title');
    const leadExcerpt = document.getElementById('top-lead-excerpt');
    const breakingTitle = document.getElementById('top-breaking-title');
    const breakingExcerpt = document.getElementById('top-breaking-excerpt');
    const opinionTitle = document.getElementById('top-opinion-title');
    const opinionExcerpt = document.getElementById('top-opinion-excerpt');

    if (leadTitle) leadTitle.textContent = leadData.title;
    if (leadExcerpt) leadExcerpt.textContent = leadData.excerpt || '';
    if (breakingTitle) breakingTitle.textContent = breakingData.title;
    if (breakingExcerpt) breakingExcerpt.textContent = breakingData.excerpt || '';
    if (opinionTitle) opinionTitle.textContent = opinionData.title;
    if (opinionExcerpt) opinionExcerpt.textContent = opinionData.excerpt || '';

    // Click-throughs
    document.getElementById('top-lead')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${leadData.id}`;
    });
    document.getElementById('top-breaking')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${breakingData.id}`;
    });
    document.getElementById('top-opinion')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${opinionData.id}`;
    });
  } catch (e) {
    console.error('Top stories error', e);
  }

  // Latest / Editorial / Historical
  try {
    const latestData = normalizeItem(await loadJson(getJsonPathById(index.latestEditorialHistorical.latest)));
    const editorialData = normalizeItem(await loadJson(getJsonPathById(index.latestEditorialHistorical.editorial)));
    const historicalData = normalizeItem(await loadJson(getJsonPathById(index.latestEditorialHistorical.historical)));

    const latestTitle = document.getElementById('latest-title');
    const latestExcerpt = document.getElementById('latest-excerpt');
    const editorialTitle = document.getElementById('editorial-title');
    const editorialExcerpt = document.getElementById('editorial-excerpt');
    const historicalTitle = document.getElementById('historical-title');
    const historicalExcerpt = document.getElementById('historical-excerpt');

    if (latestTitle) latestTitle.textContent = latestData.title;
    if (latestExcerpt) latestExcerpt.textContent = latestData.excerpt || '';
    if (editorialTitle) editorialTitle.textContent = editorialData.title;
    if (editorialExcerpt) editorialExcerpt.textContent = editorialData.excerpt || '';
    if (historicalTitle) historicalTitle.textContent = historicalData.title;
    if (historicalExcerpt) historicalExcerpt.textContent = historicalData.excerpt || '';

    document.getElementById('latest-card')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${latestData.id}`;
    });
    document.getElementById('editorial-card')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${editorialData.id}`;
    });
    document.getElementById('historical-card')?.addEventListener('click', () => {
      window.location.href = `article.html?id=${historicalData.id}`;
    });
  } catch (e) {
    console.error('LEH error', e);
  }

  // JK
  try {
    const jk1Data = normalizeItem(await loadJson(getJsonPathById(index.jammuKashmir[0])));
    const jk2Data = normalizeItem(await loadJson(getJsonPathById(index.jammuKashmir[1])));
    const jk1Title = document.getElementById('jk-1-title');
    const jk2Title = document.getElementById('jk-2-title');
    if (jk1Title) jk1Title.textContent = jk1Data.title;
    if (jk2Title) jk2Title.textContent = jk2Data.title;
  } catch (e) {
    console.error('JK error', e);
  }

  // International
  try {
    const intl1Data = normalizeItem(await loadJson(getJsonPathById(index.international[0])));
    const intl2Data = normalizeItem(await loadJson(getJsonPathById(index.international[1])));
    const intl1Title = document.getElementById('intl-1-title');
    const intl2Title = document.getElementById('intl-2-title');
    if (intl1Title) intl1Title.textContent = intl1Data.title;
    if (intl2Title) intl2Title.textContent = intl2Data.title;
  } catch (e) {
    console.error('Intl error', e);
  }

  // Human Rights
  try {
    const hr1Data = normalizeItem(await loadJson(getJsonPathById(index.humanRights[0])));
    const hr2Data = normalizeItem(await loadJson(getJsonPathById(index.humanRights[1])));
    const hr1Title = document.getElementById('hr-1-title');
    const hr2Title = document.getElementById('hr-2-title');
    if (hr1Title) hr1Title.textContent = hr1Data.title;
    if (hr2Title) hr2Title.textContent = hr2Data.title;
  } catch (e) {
    console.error('HR error', e);
  }
}

// ============================
// ARTICLE PAGE RENDERING
// ============================
function getCategoryClass(category) {
  if (!category) return 'cat-default';
  const c = category.toLowerCase();
  if (c.includes('breaking')) return 'cat-breaking';
  if (c.includes('blog') || c.includes('opinion')) return 'cat-blog';
  if (c.includes('editorial')) return 'cat-editorial';
  if (c.includes('historical')) return 'cat-historical';
  if (c.includes('human')) return 'cat-humanrights';
  if (c.includes('international')) return 'cat-international';
  if (c.includes('latest')) return 'cat-latest';
  if (c.includes('jammu') || c.includes('kashmir')) return 'cat-jk';
  if (c.includes('vlog')) return 'cat-vlog';
  return 'cat-default';
}

function renderArticle(item) {
  const titleEl = document.getElementById('title');
  const pageTitleEl = document.getElementById('page-title');
  const metaEl = document.getElementById('meta');
  const heroImg = document.getElementById('heroImg');
  const heroCaption = document.getElementById('heroCaption');
  const content = document.getElementById('content');
  const sectionLabel = document.getElementById('section-label');

  if (!titleEl || !metaEl || !content) return;

  titleEl.textContent = item.title || '';
  if (pageTitleEl) {
    pageTitleEl.textContent = (item.title || 'Article') + ' – THE MIRROR JAMMU KASHMIR';
  }

  const metaParts = [];
  if (item.category) metaParts.push(item.category);
  if (item.author) metaParts.push(item.author);
  if (item.location) metaParts.push(item.location);
  if (item.date) metaParts.push(item.date);
  if (item.readTime) metaParts.push(item.readTime);
  metaEl.textContent = metaParts.join(' · ');

  if (item.heroImage && heroImg && heroCaption) {
    heroImg.src = item.heroImage.src;
    heroImg.alt = item.heroImage.caption || item.title || '';
    heroCaption.textContent = item.heroImage.caption +
      (item.heroImage.credit ? ' © ' + item.heroImage.credit : '');
  }

  if (sectionLabel) {
    sectionLabel.textContent = item.category || '';
    sectionLabel.className = 'category-label ' + getCategoryClass(item.category);
  }

  content.innerHTML = '';

  if (Array.isArray(item.body)) {
    item.body.forEach(block => {
      if (block.type === 'paragraph') {
        const p = document.createElement('p');
        p.textContent = block.text;
        content.appendChild(p);
      } else if (block.type === 'points') {
        const div = document.createElement('div');
        div.className = 'important-points';
        const ul = document.createElement('ul');
        (block.items || []).forEach(pt => {
          const li = document.createElement('li');
          li.textContent = pt;
          ul.appendChild(li);
        });
        div.appendChild(ul);
        content.appendChild(div);
      } else if (block.type === 'image') {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = block.src;
        img.alt = block.caption || '';
        if (block.align === 'left') img.className = 'img-left';
        else if (block.align === 'right') img.className = 'img-right';
        const cap = document.createElement('figcaption');
        cap.textContent = block.caption +
          (block.credit ? ' © ' + block.credit : '');
        figure.appendChild(img);
        figure.appendChild(cap);
        content.appendChild(figure);
      } else if (block.type === 'header') {
        const h2 = document.createElement('h2');
        h2.textContent = block.text;
        content.appendChild(h2);
      }
    });
  }
}

async function buildArticlePage() {
  const id = getQueryParam('id');
  if (!id) return;

  const path = getJsonPathById(id);
  if (!path) {
    console.error('No JSON path for id', id);
    return;
  }

  try {
    const data = await loadJson(path);
    const item = normalizeItem(data);
    renderArticle(item);
  } catch (e) {
    console.error('Article load error', e);
  }
}

// ============================
// CALENDARS & REGIONAL TIME
// ============================
function updateDatesAndTimes() {
  const now = new Date();

  // Gregorian
  const gregEl = document.getElementById('gregorian-date');
  if (gregEl) {
    gregEl.textContent = now.toLocaleString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Simple Hijri approximation (for production you might use a proper library)
  const hijriEl = document.getElementById('hijri-date');
  if (hijriEl) {
    hijriEl.textContent = 'Ramadan 24, 1447 AH'; // static placeholder to match your screenshots
  }

  const vikramEl = document.getElementById('vikram-date');
  if (vikramEl) {
    vikramEl.textContent = '13 Jyeshtha 2083 VS'; // static placeholder
  }

  // Regional times (fixed offsets relative to UTC)
  const zones = [
    { id: 'tz-zurich', label: 'Zurich', offset: 1 },
    { id: 'tz-rawalakot', label: 'Rawalakot', offset: 5 },
    { id: 'tz-jammu', label: 'Jammu', offset: 5.5 },
    { id: 'tz-kashmir', label: 'Kashmir', offset: 5.5 },
    { id: 'tz-ladakh', label: 'Ladakh', offset: 5.5 },
    { id: 'tz-gilgit', label: 'Gilgit', offset: 5 },
    { id: 'tz-baltistan', label: 'Baltistan', offset: 5 },
    { id: 'tz-muzaffarabad', label: 'Muzaffarabad', offset: 5 }
  ];

  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  zones.forEach(z => {
    const el = document.getElementById(z.id);
    if (!el) return;
    const local = new Date(utc + z.offset * 3600000);
    el.textContent = `${z.label}: ${local.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  });
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Detect page type
  if (document.body.classList.contains('article-page')) {
    buildArticlePage();
  } else {
    buildHomePage();
  }

  updateDatesAndTimes();
  setInterval(updateDatesAndTimes, 1000);
});
