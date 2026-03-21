// script.js
// THE MIRROR JAMMU KASHMIR – Front page logic (Top Stories, sections, footer, contact, uploads, vlogs)

const CONTENT_BASE = 'content/';
const IMAGES_BASE = 'content/images/';

// ---------- Helpers ----------

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function setHeroImage(imgEl, captionEl, hero) {
  if (!hero) return;
  if (imgEl) {
    imgEl.src = hero.src;
    imgEl.alt = hero.caption || '';
  }
  if (captionEl) {
    captionEl.textContent = hero.caption || '';
  }
}

// ---------- Card builders ----------

function buildArticleCard(item, sectionLabelOverride) {
  const card = createEl('article', 'tm-card');

  const imgWrap = createEl('div', 'tm-card-image');
  if (item.heroImage && item.heroImage.src) {
    const img = createEl('img');
    img.src = item.heroImage.src;
    img.alt = item.heroImage.caption || item.title || '';
    imgWrap.appendChild(img);
  }
  card.appendChild(imgWrap);

  const body = createEl('div', 'tm-card-body');

  const label = createEl('div', 'tm-card-label',
    sectionLabelOverride || item.sectionLabel || ''
  );
  body.appendChild(label);

  const title = createEl('h3', 'tm-card-title');
  const link = createEl('a');
  link.href = `${item.slug || item.id}.html`;
  link.textContent = item.title || '';
  title.appendChild(link);
  body.appendChild(title);

  if (item.excerpt) {
    const excerpt = createEl('p', 'tm-card-excerpt', item.excerpt);
    body.appendChild(excerpt);
  }

  const meta = createEl('div', 'tm-card-meta');
  const leftMeta = [];
  if (item.author) leftMeta.push(item.author);
  if (item.location) leftMeta.push(item.location);
  if (leftMeta.length) {
    meta.appendChild(createEl('span', 'tm-card-meta-author', leftMeta.join(' · ')));
  }
  if (item.date || item.readTime) {
    const rightMeta = [];
    if (item.date) rightMeta.push(formatDate(item.date));
    if (item.readTime) rightMeta.push(item.readTime);
    meta.appendChild(createEl('span', 'tm-card-meta-date', rightMeta.join(' · ')));
  }
  body.appendChild(meta);

  const readMore = createEl('a', 'tm-card-readmore', 'Read More →');
  readMore.href = `${item.slug || item.id}.html`;
  body.appendChild(readMore);

  card.appendChild(body);
  return card;
}

// ---------- Section renderers ----------

async function renderTopStories(config, indexMap) {
  const container = document.getElementById('top-stories');
  if (!container || !config.sections.topStories?.enabled) return;

  const { lead, breaking, opinion } = indexMap.topStories;
  const ids = [lead, breaking, opinion].filter(Boolean);

  const data = await Promise.all(
    ids.map(id => loadJSON(`${CONTENT_BASE}${id}.json`))
  );

  container.innerHTML = '';
  container.classList.add('tm-grid-3');

  data.forEach(item => {
    const card = buildArticleCard(item);
    container.appendChild(card);
  });
}

async function renderLatestEditorialHistorical(config, indexMap) {
  const container = document.getElementById('latest-editorial-historical');
  if (!container || !config.sections.latestEditorialHistorical?.enabled) return;

  const { latest, editorial, historical } = indexMap.latestEditorialHistorical;
  const ids = [latest, editorial, historical].filter(Boolean);

  const data = await Promise.all(
    ids.map(id => loadJSON(`${CONTENT_BASE}${id}.json`))
  );

  container.innerHTML = '';
  container.classList.add('tm-grid-3');

  data.forEach(item => {
    const card = buildArticleCard(item);
    container.appendChild(card);
  });
}

async function renderSimpleSection(sectionKey, config, indexMap, containerId, gridCols = 2) {
  const container = document.getElementById(containerId);
  if (!container || !config.sections[sectionKey]?.enabled) return;

  const ids = indexMap[sectionKey] || [];
  const validIds = ids.filter(Boolean);
  if (!validIds.length) return;

  const data = await Promise.all(
    validIds.map(id => loadJSON(`${CONTENT_BASE}${id}.json`))
  );

  container.innerHTML = '';
  container.classList.add(`tm-grid-${gridCols}`);

  data.forEach(item => {
    const card = buildArticleCard(item);
    container.appendChild(card);
  });
}

async function renderInternational(config, indexMap) {
  await renderSimpleSection('international', config, indexMap, 'international', 2);
}

async function renderHumanRights(config, indexMap) {
  await renderSimpleSection('humanRights', config, indexMap, 'human-rights', 2);
}

async function renderJammuKashmir(config, indexMap) {
  await renderSimpleSection('jammuKashmir', config, indexMap, 'jammu-kashmir', 2);
}

// ---------- Vlogs / YouTube ----------

async function renderVlogs() {
  const container = document.getElementById('vlogs');
  if (!container) return;

  const yt = await loadJSON(`${CONTENT_BASE}youtube.json`);
  const videos = yt.videos || [];

  container.innerHTML = '';
  container.classList.add('tm-grid-3');

  videos.forEach(video => {
    const card = createEl('article', 'tm-card tm-card-video');

    const thumbWrap = createEl('div', 'tm-card-image');
    const iframe = createEl('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.youtubeId}`;
    iframe.title = video.title;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    thumbWrap.appendChild(iframe);
    card.appendChild(thumbWrap);

    const body = createEl('div', 'tm-card-body');
    const label = createEl('div', 'tm-card-label', video.category || 'Video');
    body.appendChild(label);

    const title = createEl('h3', 'tm-card-title', video.title || '');
    body.appendChild(title);

    if (video.description) {
      body.appendChild(createEl('p', 'tm-card-excerpt', video.description));
    }

    if (video.duration) {
      body.appendChild(createEl('div', 'tm-card-meta', `Duration: ${video.duration}`));
    }

    card.appendChild(body);
    container.appendChild(card);
  });

  const visitBtn = document.getElementById('visit-channel-btn');
  if (visitBtn && yt.channel?.url) {
    visitBtn.addEventListener('click', () => {
      window.open(yt.channel.url, '_blank', 'noopener');
    });
  }
}

// ---------- Weather & Ticker ----------

function renderWeather(config) {
  const bar = document.getElementById('weather-bar');
  if (!bar || !config.weather?.cities) return;

  bar.innerHTML = '';
  config.weather.cities.forEach(city => {
    const item = createEl('div', 'weather-item');
    const name = createEl('span', 'weather-city', city.name);
    const temp = createEl('span', 'weather-temp', city.temp);
    item.appendChild(name);
    item.appendChild(temp);
    bar.appendChild(item);
  });
}

function renderTicker(config, indexMap) {
  const tickerEl = document.getElementById('ticker');
  if (!tickerEl) return;

  const items = config.ticker?.items || indexMap.ticker || [];
  if (!items.length) return;

  const inner = createEl('div', 'ticker-inner');
  items.forEach(text => {
    const span = createEl('span', 'ticker-item', text);
    inner.appendChild(span);
  });
  tickerEl.innerHTML = '';
  tickerEl.appendChild(inner);
}

// ---------- Navigation ----------

function initNavigation(config) {
  // Example: fill dropdowns if you have <ul> placeholders
  // Adjust selectors to your HTML structure
  const homeDropdown = document.getElementById('nav-home-dropdown');
  if (homeDropdown && config.navigation.home?.dropdown) {
    config.navigation.home.dropdown.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link;
      a.textContent = link.replace('#', '').replace('.html', '').replace('-', ' ').toUpperCase();
      li.appendChild(a);
      homeDropdown.appendChild(li);
    });
  }
  // Repeat similarly for blog, vlog, jammuKashmir, unHR if needed
}

// ---------- Footer ----------

function renderFooter(config) {
  const footerContainer = document.getElementById('footer-sections');
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  if (!footerContainer || !config.footer?.sections) return;

  footerContainer.innerHTML = '';

  config.footer.sections.forEach(section => {
    const col = createEl('div', 'footer-col');
    const title = createEl('h4', 'footer-title', section.title || '');
    col.appendChild(title);

    if (section.content) {
      const contentDiv = createEl('div', 'footer-content');
      contentDiv.innerHTML = section.content;
      col.appendChild(contentDiv);
    }

    if (section.links) {
      const ul = createEl('ul', 'footer-links');
      section.links.forEach(l => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = l.url;
        a.textContent = l.label;
        li.appendChild(a);
        ul.appendChild(li);
      });
      col.appendChild(ul);
    }

    if (section.social) {
      const ul = createEl('ul', 'footer-social');
      section.social.forEach(s => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.icon;
        a.setAttribute('aria-label', 'Social link');
        li.appendChild(a);
        ul.appendChild(li);
      });
      col.appendChild(ul);
    }

    footerContainer.appendChild(col);
  });
}

// ---------- Contact form & uploads ----------

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fileInput = form.querySelector('input[type="file"]');
  const statusEl = document.getElementById('contact-status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!statusEl) return;

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      statusEl.textContent = 'Please fill in all required fields.';
      statusEl.className = 'form-status error';
      return;
    }

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.type)) {
        statusEl.textContent = 'Only PDF, JPG, and PNG files are allowed.';
        statusEl.className = 'form-status error';
        return;
      }
    }

    // Here you would send to your backend / email service
    // For now, just simulate success:
    statusEl.textContent = 'Thank you. Your message has been received.';
    statusEl.className = 'form-status success';
    form.reset();
  });
}

function initEPaperUpload() {
  const form = document.getElementById('epaper-form');
  if (!form) return;

  const fileInput = form.querySelector('input[type="file"]');
  const statusEl = document.getElementById('epaper-status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!statusEl) return;

    if (!fileInput || fileInput.files.length === 0) {
      statusEl.textContent = 'Please choose a file to upload.';
      statusEl.className = 'form-status error';
      return;
    }

    const file = fileInput.files[0];
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      statusEl.textContent = 'Only PDF, JPG, and PNG files are allowed.';
      statusEl.className = 'form-status error';
      return;
    }

    // Simulate upload
    statusEl.textContent = 'File uploaded successfully (demo).';
    statusEl.className = 'form-status success';
    form.reset();
  });
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const statusEl = document.getElementById('newsletter-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = new FormData(form).get('email');
    if (!email) {
      if (statusEl) {
        statusEl.textContent = 'Please enter your email.';
        statusEl.className = 'form-status error';
      }
      return;
    }
    if (statusEl) {
      statusEl.textContent = 'Subscribed successfully (demo).';
      statusEl.className = 'form-status success';
    }
    form.reset();
  });
}

// ---------- Engagement buttons (like / subscribe / share / copy) ----------

function initEngagementButtons() {
  const likeBtn = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');
  const subBtn = document.getElementById('subBtn');
  const shareBtn = document.getElementById('shareBtn');
  const copyBtn = document.getElementById('copyBtn');

  if (likeBtn && likeCount) {
    let count = 0;
    likeBtn.addEventListener('click', () => {
      count += 1;
      likeCount.textContent = count.toString();
    });
  }

  if (subBtn) {
    subBtn.addEventListener('click', () => {
      alert('Thank you for subscribing (demo).');
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'Check out this article from THE MIRROR JAMMU KASHMIR',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (e) {
          console.warn('Share cancelled', e);
        }
      } else {
        alert('Sharing is not supported in this browser.');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard.');
      } catch (e) {
        alert('Unable to copy link.');
      }
    });
  }
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [config, indexMap] = await Promise.all([
      loadJSON(`${CONTENT_BASE}config.json`),
      loadJSON(`${CONTENT_BASE}index.json`)
    ]);

    // Site title / tagline
    if (config.site) {
      const titleEl = document.getElementById('site-title');
      const taglineEl = document.getElementById('site-tagline');
      if (titleEl) titleEl.textContent = config.site.name;
      if (taglineEl) taglineEl.textContent = config.site.tagline;
    }

    renderWeather(config);
    renderTicker(config, indexMap);
    initNavigation(config);
    renderFooter(config);

    await Promise.all([
      renderTopStories(config, indexMap),
      renderLatestEditorialHistorical(config, indexMap),
      renderJammuKashmir(config, indexMap),
      renderInternational(config, indexMap),
      renderHumanRights(config, indexMap),
      renderVlogs()
    ]);

    initContactForm();
    initEPaperUpload();
    initNewsletter();
    initEngagementButtons();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
