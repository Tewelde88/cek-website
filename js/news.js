/* ============================================================
   NEWS — blog list, single posts, photo gallery and lightbox
   (news.html), plus the latest-news cards on the home page.
   Posts come from js/news-data.js.
   ============================================================ */
(function(){
'use strict';
if (typeof NEWS === 'undefined') return;

/* ---------- helpers ---------- */
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti'] && (!Array.isArray(o[f + '_ti']) || o[f + '_ti'].length)) ? o[f + '_ti'] : (o[f] || o[f + '_ti'] || '');   // a one-language post shows its own text
// A post can be in one language only (Admin page → Language); without the choice it is guessed from the titles
const langOf = o => o.lang || ((o.title || o.t) && !(o.title_ti || o.ti) ? 'en' : (!(o.title || o.t) && (o.title_ti || o.ti) ? 'ti' : 'both'));
// a small tag when the post is not in the reader's language
function langTag(o){
  const l = langOf(o); if (l === 'both' || l === (isTi() ? 'ti' : 'en')) return null;
  const s = document.createElement('span'); s.className = 'lang-tag';
  s.textContent = l === 'ti' ? (isTi() ? 'ትግርኛ' : 'In Tigrinya · ትግርኛ') : (isTi() ? 'ብእንግሊዝኛ · English' : 'English');
  if (l === 'ti') s.lang = 'ti';
  return s;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const T = () => isTi() ? {
  cats: { news: 'ዜና', article: 'ጽሑፍ', event: 'ፍጻመታት' }, all: 'ኩሉ', read: 'ተወሳኺ ኣንብቡ', back: 'ኩሉ ዜናታት',
  gallery: 'ጋለሪ ስእልታት', photos: n => `${n} ስእልታት`, share: 'ኣካፍሉ', copy: 'ሊንክ ቅዳሕ', copied: 'ሊንክ ተቐዲሑ',
  none: 'ዝተረኽበ ጽሑፍ የለን።', more: 'ተወሳኺ ኣርእዩ', prev: 'ዝሓለፈ', next: 'ዝቕጽል', example: 'ኣብነት',
  latest: 'ሓድሽ', others: 'ካልኦት ዜናታት', noPhotos: 'ገና ስእልታት የለዉን።', viewPost: 'ጽሑፍ ርኣዩ', close: 'ዕጸው'
} : {
  cats: { news: 'News', article: 'Article', event: 'Events' }, all: 'All', read: 'Read More', back: 'All news',
  gallery: 'Photo gallery', photos: n => n === 1 ? '1 photo' : `${n} photos`, share: 'Share', copy: 'Copy link', copied: 'Link copied',
  none: 'No posts found.', more: 'Load more', prev: 'Previous', next: 'Next', example: 'Example',
  latest: 'Latest', others: 'More news', noPhotos: 'No photos yet.', viewPost: 'View post', close: 'Close'
};
const FALLBACK = { news: 'linear-gradient(135deg,#9db4d3,#e8dcc4)', article: 'linear-gradient(135deg,#7f8e6a,#c8b088)', event: 'linear-gradient(135deg,#6e8a5c,#d5b98a)' };
const fmtDate = s => { const [y, m, d] = s.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const posts = () => NEWS.slice().sort((a, b) => b.date.localeCompare(a.date));
const postUrl = p => `news.html#post=${encodeURIComponent(p.id)}`;
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
// Cover picture: the cover photo, else the first gallery photo
const coverOf = p => p.cover || ((p.gallery || [])[0] || {}).src || '';
function media(p, cls){
  const m = el('div', cls);
  const bg = FALLBACK[p.category] || FALLBACK.news;
  m.style.backgroundImage = coverOf(p) ? `url('${coverOf(p)}'), ${bg}` : bg;
  if ((p.videos || []).length) m.appendChild(el('span', 'post-play', '▶'));
  return m;
}
// Post text: every new line starts a new paragraph (an empty line between them also works)
const paragraphs = v => Array.isArray(v) ? v : String(v || '').split(/\n+/).map(s => s.trim()).filter(Boolean);

/* ---------- Videos: YouTube / Facebook / Vimeo links, or an uploaded video file ---------- */
function videoEmbed(v){
  const url = (v.url || '').trim(), file = (v.file || '').trim();
  const wrap = el('figure', 'post-video');
  let frame = null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (yt) frame = 'https://www.youtube-nocookie.com/embed/' + yt[1];
  else if (vm) frame = 'https://player.vimeo.com/video/' + vm[1];
  else if (/facebook\.com|fb\.watch/.test(url)) frame = 'https://www.facebook.com/plugins/video.php?show_text=false&href=' + encodeURIComponent(url);
  if (frame){
    const f = el('iframe'); f.src = frame; f.loading = 'lazy'; f.allowFullscreen = true;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.title = tr(v, 'caption') || 'Video';
    const box = el('div', 'video-frame'); box.appendChild(f); wrap.appendChild(box);
  } else if (file || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)){
    const vid = el('video'); vid.controls = true; vid.preload = 'metadata'; vid.playsInline = true; vid.src = file || url;
    wrap.appendChild(vid);
  } else if (url){
    const a = el('a', 'share-btn', '▶ ' + (tr(v, 'caption') || url)); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    wrap.appendChild(a); return wrap;
  } else return null;
  if (tr(v, 'caption')) wrap.appendChild(el('figcaption', '', tr(v, 'caption')));
  return wrap;
}
function arrowLink(href, text, cls = 'more'){
  const a = el('a', cls); a.href = href;
  a.appendChild(el('span', '', text));
  a.appendChild(document.createTextNode(' '));
  const ar = el('span', 'arrow', '→'); ar.setAttribute('aria-hidden', 'true'); a.appendChild(ar);
  return a;
}
// Post card (same look as the home-page news cards)
function card(p, big){
  const a = el('article', 'post' + (big ? ' post-featured' : ''));
  const link = el('a', 'post-link'); link.href = postUrl(p);
  link.setAttribute('aria-label', tr(p, 'title'));
  link.appendChild(media(p, 'post-media'));
  a.appendChild(link);
  const body = el('div', 'post-body');
  const meta = el('p', 'post-meta');
  meta.appendChild(el('span', 'tag', T().cats[p.category] || p.category));
  const t = el('time', '', fmtDate(p.date)); t.dateTime = p.date; meta.appendChild(t);
  if (p.gallery && p.gallery.length) meta.appendChild(el('span', 'post-photos', '▣ ' + T().photos(p.gallery.length)));
  if (p.sample) meta.appendChild(el('span', 'sample-tag', T().example));
  const lt = langTag(p); if (lt) meta.appendChild(lt);
  body.appendChild(meta);
  const h = el(big ? 'h2' : 'h3'); const hl = el('a', '', tr(p, 'title')); hl.href = postUrl(p); h.appendChild(hl);
  body.appendChild(h);
  body.appendChild(el('p', '', tr(p, 'excerpt')));
  body.appendChild(arrowLink(postUrl(p), T().read));
  a.appendChild(body);
  return a;
}

/* ---------- Home page: latest 3 posts ---------- */
// Date as "፲፪ ግንቦት ፳፻፲፰" (Ge'ez, red) + "12 May 2026"
function dateLine(s){
  const span = el('span', 'hm-date');
  const G = window.GeezCal;
  if (G){
    const [y, m, d] = s.split('-').map(Number), e = G.jdnToEt(G.grToJdn(y, m, d));
    const ge = el('span', 'ge', `${G.geez(e.d)} ${G.MONTHS_TI[e.m - 1]} ${G.geez(e.y)}`);
    ge.lang = 'ti';                                   // read as Tigrinya by screen readers
    span.appendChild(ge);
  }
  span.appendChild(document.createTextNode(fmtDate(s)));
  return span;
}
function renderHome(){
  const box = document.getElementById('home-news'); if (!box) return;
  const list = posts();
  box.replaceChildren();
  if (!list.length) return;
  // Lead story: picture, title, date, summary
  const L0 = list[0], lead = el('a', 'hm-lead'); lead.href = postUrl(L0);
  const img = el('div', 'hm-lead-img');
  const bg = FALLBACK[L0.category] || FALLBACK.news;
  img.style.backgroundImage = coverOf(L0) ? `url('${coverOf(L0)}'), ${bg}` : bg;
  if ((L0.videos || []).length) img.appendChild(el('span', 'post-play', '▶'));
  lead.appendChild(img);
  lead.appendChild(el('h3', '', tr(L0, 'title')));
  lead.appendChild(dateLine(L0.date));
  const lt0 = langTag(L0); if (lt0) lead.appendChild(lt0);
  lead.appendChild(el('p', '', tr(L0, 'excerpt')));
  box.appendChild(lead);
  // The next stories as a simple dated list
  const ul = el('ul', 'hm-list');
  list.slice(1, 5).forEach(p => {
    const li = el('li'), a = el('a'); a.href = postUrl(p);
    a.appendChild(dateLine(p.date));
    a.appendChild(el('strong', '', tr(p, 'title')));
    const lt = langTag(p); if (lt) a.appendChild(lt);
    li.appendChild(a); ul.appendChild(li);
  });
  box.appendChild(ul);
}

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
let lbItems = [], lbIndex = 0;
function lbShow(){
  const it = lbItems[lbIndex];
  lb.querySelector('.lb-img').src = it.src;
  lb.querySelector('.lb-img').alt = tr(it, 'caption') || '';
  lb.querySelector('.lb-caption').textContent = tr(it, 'caption');
  lb.querySelector('.lb-count').textContent = `${lbIndex + 1} / ${lbItems.length}`;
  const pl = lb.querySelector('.lb-post');
  if (it.post){ pl.hidden = false; pl.href = postUrl(it.post); pl.textContent = T().viewPost + ' — ' + tr(it.post, 'title'); }
  else pl.hidden = true;
  lb.querySelectorAll('.lb-nav').forEach(b => b.hidden = lbItems.length < 2);
}
function openLightbox(items, i){
  if (!lb || typeof lb.showModal !== 'function'){ window.open(items[i].src, '_blank'); return; }
  lbItems = items; lbIndex = i; lbShow(); lb.showModal();
}
if (lb){
  const step = d => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbShow(); };
  lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => step(1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.querySelector('.lb-post').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null;
  }, { passive: true });
}
function thumbs(items, cls){
  const grid = el('div', cls);
  items.forEach((it, i) => {
    const b = el('button', 'thumb'); b.type = 'button';
    const img = el('img'); img.src = it.src; img.alt = tr(it, 'caption') || ''; img.loading = 'lazy';
    b.appendChild(img);
    if (tr(it, 'caption')) b.appendChild(el('span', 'thumb-cap', tr(it, 'caption')));
    b.addEventListener('click', () => openLightbox(items, i));
    grid.appendChild(b);
  });
  return grid;
}

/* ---------- News page ---------- */
const page = document.querySelector('.news-page');
const state = { cat: 'all', q: '', shown: 9 };
const PAGE_SIZE = 9;

function filtered(){
  const f = state.q.trim().toLowerCase();
  return posts().filter(p => (state.cat === 'all' || p.category === state.cat) &&
    (!f || [p.title, p.title_ti, p.excerpt, p.excerpt_ti].some(v => (v || '').toLowerCase().includes(f))));
}
function renderChips(){
  const box = document.getElementById('news-cats'); if (!box) return;
  box.replaceChildren();
  ['all', 'news', 'article', 'event'].forEach(c => {
    const b = el('button', 'chip-filter', c === 'all' ? T().all : T().cats[c]);
    b.type = 'button'; b.setAttribute('aria-pressed', String(state.cat === c));
    b.addEventListener('click', () => { state.cat = c; state.shown = PAGE_SIZE; renderList(); renderChips(); });
    box.appendChild(b);
  });
}
function renderList(){
  const list = filtered();
  const feat = document.getElementById('news-featured'), grid = document.getElementById('news-grid');
  feat.replaceChildren(); grid.replaceChildren();
  document.getElementById('news-empty').hidden = list.length > 0;
  if (!list.length){ document.getElementById('news-more').hidden = true; return; }
  // the latest post is shown in full, as when it is opened; the others follow as cards, newest first
  if (state.q.trim()) feat.appendChild(card(list[0], true));
  else {
    const lead = el('article', 'post-page news-lead');
    article(lead, list[0], 'h2', true);
    feat.appendChild(lead);
    if (list.length > 1) feat.appendChild(el('h2', 'news-others', T().others));
  }
  list.slice(1, state.shown).forEach(p => grid.appendChild(card(p)));
  document.getElementById('news-more').hidden = list.length <= state.shown;
}
function renderGallery(){
  const box = document.getElementById('gallery-grid'); if (!box) return;
  const items = [];
  posts().forEach(p => (p.gallery || []).forEach(g => items.push(Object.assign({ post: p }, g))));
  box.replaceChildren();
  if (!items.length){ box.appendChild(el('p', 'muted', T().noPhotos)); return; }
  box.appendChild(thumbs(items, 'masonry'));
}
function share(p){
  const url = new URL(postUrl(p), location.href).href, title = tr(p, 'title');
  const bar = el('div', 'share');
  bar.appendChild(el('span', 'share-label', T().share));
  const wa = el('a', 'share-btn', 'WhatsApp'); wa.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
  const fb = el('a', 'share-btn', 'Facebook'); fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
  [wa, fb].forEach(a => { a.target = '_blank'; a.rel = 'noopener'; bar.appendChild(a); });
  const cp = el('button', 'share-btn', T().copy); cp.type = 'button';
  cp.addEventListener('click', () => {
    const done = () => { cp.textContent = T().copied; setTimeout(() => cp.textContent = T().copy, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt(T().copy, url));
    else prompt(T().copy, url);
  });
  bar.appendChild(cp);
  return bar;
}
// The post itself, in this order: cover photo, title, short summary, a single line, the full text
// (then videos, photos and the share buttons). Used for an opened post and for the latest post on the list.
function article(box, p, hTag, link){
  const cover = coverOf(p);
  if (cover){
    const fig = el('figure', 'post-cover');
    const img = el('img'); img.src = cover; img.alt = '';
    if (link){ const a = el('a'); a.href = postUrl(p); a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); a.appendChild(img); fig.appendChild(a); }
    else fig.appendChild(img);
    box.appendChild(fig);
  }
  const meta = el('p', 'post-meta');
  meta.appendChild(el('span', 'tag', T().cats[p.category] || p.category));
  const t = el('time', '', fmtDate(p.date)); t.dateTime = p.date; meta.appendChild(t);
  if (p.sample) meta.appendChild(el('span', 'sample-tag', T().example));
  const lt = langTag(p); if (lt) meta.appendChild(lt);
  box.appendChild(meta);
  const h = el(hTag, 'post-title');
  if (link){ const a = el('a', '', tr(p, 'title')); a.href = postUrl(p); h.appendChild(a); } else h.textContent = tr(p, 'title');
  box.appendChild(h);
  const sum = tr(p, 'excerpt').trim();
  let pars = paragraphs(tr(p, 'body'));
  if (sum && pars.length && pars[0] === sum) pars = pars.slice(1);          // the summary is not repeated as the first paragraph
  if (sum) box.appendChild(el('p', 'post-summary', sum));
  if (sum && pars.length) box.appendChild(el('hr', 'post-rule'));
  if (pars.length){
    const body = el('div', 'post-text');
    pars.forEach(par => body.appendChild(el('p', '', par)));
    box.appendChild(body);
  }
  (p.videos || []).map(videoEmbed).filter(Boolean).forEach(v => box.appendChild(v));
  if (p.gallery && p.gallery.length){
    box.appendChild(el('h2', 'post-gal-title', `${T().gallery} · ${T().photos(p.gallery.length)}`));
    box.appendChild(thumbs(p.gallery, 'post-gallery'));
  }
  box.appendChild(share(p));
}
function renderPost(id){
  const all = posts(), i = all.findIndex(p => p.id === id), box = document.getElementById('post');
  box.replaceChildren();
  if (i < 0){ location.hash = ''; return; }
  const p = all[i];
  const back = el('a', 'back-link', '← ' + T().back); back.href = '#latest'; box.appendChild(back);
  article(box, p, 'h1');
  const nav = el('nav', 'post-nav');
  if (all[i + 1]){ const a = el('a', 'pn-prev'); a.href = postUrl(all[i + 1]); a.appendChild(el('small', '', '← ' + T().prev)); a.appendChild(el('span', '', tr(all[i + 1], 'title'))); nav.appendChild(a); }
  if (all[i - 1]){ const a = el('a', 'pn-next'); a.href = postUrl(all[i - 1]); a.appendChild(el('small', '', T().next + ' →')); a.appendChild(el('span', '', tr(all[i - 1], 'title'))); nav.appendChild(a); }
  box.appendChild(nav);
  document.title = tr(p, 'title') + ' — Catholic Eparchy of Keren';
}

// Views: #latest (default) · #gallery · #post=<id>
function route(){
  if (!page) return;
  const h = decodeURIComponent(location.hash.slice(1));
  const view = h.startsWith('post=') ? 'post' : (h === 'gallery' ? 'gallery' : 'list');
  ['list', 'gallery', 'post'].forEach(v => document.getElementById('view-' + v).hidden = v !== view);
  page.classList.toggle('is-post', view === 'post');
  document.querySelectorAll('.news-tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  if (view === 'post') renderPost(h.slice(5));
  else document.title = (isTi() ? 'ዜና' : 'News') + ' — Catholic Eparchy of Keren';
  if (view === 'gallery') renderGallery();
  if (view === 'list'){ renderChips(); renderList(); }
}
if (page){
  document.querySelectorAll('.news-tabs button').forEach(b => b.addEventListener('click', () => {
    location.hash = b.dataset.view === 'gallery' ? 'gallery' : 'latest';
  }));
  const q = document.getElementById('news-q');
  q.addEventListener('input', () => { state.q = q.value; state.shown = PAGE_SIZE; renderList(); });
  document.getElementById('news-more').addEventListener('click', () => { state.shown += PAGE_SIZE; renderList(); });
  window.addEventListener('hashchange', () => { route(); window.scrollTo({ top: 0 }); });
}

function renderAll(){ renderHome(); route(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
