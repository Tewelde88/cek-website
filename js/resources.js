/* ============================================================
   SERMONS page (sermons.html) and LIBRARY page (library.html)
   Data: js/sermons.js (SERMONS) and js/library-data.js (LIBRARY)
   ============================================================ */
(function(){
'use strict';
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f, alt) => (isTi() && (o[f + '_ti'] || (alt && o[alt]))) ? (o[f + '_ti'] || o[alt]) : (o[f] || o[f + '_ti'] || (alt && o[alt]) || '');
const sTitle = s => (isTi() && s.ti) ? s.ti : (s.t || s.ti || '');      // a sermon may have a title in one language only
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
const fmtDate = s => { const [y, m, d] = s.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function linkBtn(href, text, cls){
  const a = el('a', 'r-btn ' + (cls || ''), text);
  a.href = href;
  if (/^https?:/.test(href) || /\.(pdf|mp3|mp4|docx?)$/i.test(href)){ a.target = '_blank'; a.rel = 'noopener'; }
  return a;
}
const refresh = () => { if (window.refreshClamps) window.refreshClamps(); };

/* ================= SERMONS ================= */
const S = () => isTi() ? {
  all: 'ኩሉ', listen: 'ስምዑ', watch: 'ርኣዩ', read: 'ኣንብቡ', open: 'ክፈቱ', soon: 'ቀልጢፉ ይመጽእ',
  none: 'ምስ ድሌትኩም ዝሰማማዕ ስብከት የለን።', latest: 'ናይ መወዳእታ ስብከት', count: n => `${n} ስብከታት`
} : {
  all: 'All', listen: 'Listen', watch: 'Watch', read: 'Read', open: 'Open', soon: 'Coming soon',
  none: 'No sermons match your search.', latest: 'Latest sermon', count: n => `${n} sermons`
};
const sState = { year: 'all', q: '' };

function sermonActions(s, row){
  const box = el('div', 'r-actions');
  if (s.audio){
    const b = el('button', 'r-btn r-listen', '▶ ' + S().listen); b.type = 'button';
    b.addEventListener('click', () => {
      let player = row.querySelector('audio');
      if (!player){ player = el('audio'); player.controls = true; player.preload = 'none'; player.src = s.audio; row.appendChild(player); }
      player.play();
    });
    box.appendChild(b);
  }
  if (s.video) box.appendChild(linkBtn(s.video, S().watch));
  if (s.pdf) box.appendChild(linkBtn(s.pdf, S().read));
  if (!s.audio && !s.video && !s.pdf){
    if (s.href && s.href !== '#') box.appendChild(linkBtn(s.href, S().open));
    else box.appendChild(el('span', 'r-soon', S().soon));
  }
  return box;
}
function sermonMeta(s){
  return [s.date ? fmtDate(s.date) : s.y, tr(s, 'by')].filter(Boolean).join(' · ');
}
function renderSermonsPage(){
  const list = document.getElementById('sermon-page-list'); if (!list || typeof SERMONS === 'undefined') return;
  // Featured
  const top = SERMONS[0], feat = document.getElementById('sermon-featured');
  feat.replaceChildren();
  if (top){
    feat.appendChild(el('p', 'eyebrow eyebrow-light', S().latest));
    feat.appendChild(el('h2', '', sTitle(top)));
    feat.appendChild(el('p', 'sf-meta', sermonMeta(top)));
    feat.appendChild(sermonActions(top, feat));
  }
  // Year chips
  const years = [...new Set(SERMONS.map(s => s.y))].sort((a, b) => b - a);
  const chips = document.getElementById('sermon-years'); chips.replaceChildren();
  ['all', ...years].forEach(y => {
    const b = el('button', 'chip-filter', y === 'all' ? S().all : String(y)); b.type = 'button';
    b.setAttribute('aria-pressed', String(String(sState.year) === String(y)));
    b.addEventListener('click', () => { sState.year = y; renderSermonsPage(); });
    chips.appendChild(b);
  });
  // List grouped by year
  const f = sState.q.trim().toLowerCase();
  const items = SERMONS.filter(s => (sState.year === 'all' || s.y === sState.year) &&
    (!f || [s.t, s.ti, s.by, s.by_ti, String(s.y)].some(v => (v || '').toLowerCase().includes(f))));
  list.replaceChildren();
  let lastY = null;
  items.forEach(s => {
    if (s.y !== lastY){ list.appendChild(el('li', 'r-year', String(s.y))); lastY = s.y; }
    const li = el('li', 'r-row');
    const txt = el('div', 'r-text');
    txt.appendChild(el('strong', '', sTitle(s)));
    const lt = langTag(s); if (lt) txt.appendChild(lt);
    txt.appendChild(el('span', '', sermonMeta(s)));
    li.appendChild(txt);
    li.appendChild(sermonActions(s, li));
    list.appendChild(li);
  });
  document.getElementById('sermon-page-empty').hidden = items.length > 0;
  document.getElementById('sermon-count').textContent = S().count(items.length);
  refresh();
}
const sq = document.getElementById('sermon-page-q');
if (sq){
  sq.addEventListener('input', () => { sState.q = sq.value; renderSermonsPage(); });
  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ){ sq.value = urlQ; sState.q = urlQ; }
}

/* ================= LIBRARY ================= */
const CATS = ['bible', 'church', 'liturgy', 'catechesis', 'social', 'eparchy'];
const LB = () => isTi() ? {
  all: 'ኩሉ', open: 'ክፈቱ', soon: 'ቀልጢፉ ይመጽእ', none: 'ዝተረኽበ የለን።', example: 'ኣብነት', count: n => `${n} ሰነዳት`,
  cats: { bible: 'መጽሓፍ ቅዱስ', church: 'ሰነዳት ቤተ ክርስቲያን', liturgy: 'ሊጡርጊያ', catechesis: 'ትምህርተ ክርስትና', social: 'ማሕበራዊ ትምህርቲ', eparchy: 'ሕትመታት ኤጳርቅና' }
} : {
  all: 'All', open: 'Open', soon: 'Coming soon', none: 'Nothing found.', example: 'Example', count: n => `${n} items`,
  cats: { bible: 'Bible', church: 'Church Documents', liturgy: 'Liturgy', catechesis: 'Catechesis', social: 'Social Teaching', eparchy: 'Eparchy Publications' }
};
const COVER = { bible: ['#5a1414', '#8e1820'], church: ['#0f2447', '#2a4a80'], liturgy: ['#6b4b12', '#c9a24a'],
                catechesis: ['#1f4d3a', '#3d8b5a'], social: ['#3b2d5a', '#6a54a0'], eparchy: ['#7a1a1a', '#b3202a'] };
const lState = { cat: 'all', q: '' };

function renderLibrary(){
  const grid = document.getElementById('library-grid'); if (!grid || typeof LIBRARY === 'undefined') return;
  const chips = document.getElementById('library-cats'); chips.replaceChildren();
  ['all', ...CATS.filter(c => LIBRARY.some(b => b.category === c))].forEach(c => {
    const n = c === 'all' ? LIBRARY.length : LIBRARY.filter(b => b.category === c).length;
    const b = el('button', 'chip-filter', `${c === 'all' ? LB().all : LB().cats[c]} (${n})`); b.type = 'button';
    b.setAttribute('aria-pressed', String(lState.cat === c));
    b.addEventListener('click', () => { lState.cat = c; renderLibrary(); });
    chips.appendChild(b);
  });
  const f = lState.q.trim().toLowerCase();
  const items = LIBRARY.filter(b => (lState.cat === 'all' || b.category === lState.cat) &&
    (!f || [b.title, b.title_ti, b.author, b.author_ti, b.lang, String(b.year)].some(v => (v || '').toLowerCase().includes(f))));
  grid.replaceChildren();
  items.forEach(b => {
    const card = el('article', 'book');
    const link = b.url || b.file || '';              // web link, or a file uploaded on the Admin page
    const cov = el('a', 'book-cover');
    if (link){ cov.href = link; cov.target = '_blank'; cov.rel = 'noopener'; }
    const [c1, c2] = COVER[b.category] || COVER.church;
    if (b.cover) cov.style.backgroundImage = `url('${b.cover}')`;
    else {
      cov.style.backgroundImage = `linear-gradient(150deg, ${c1}, ${c2})`;
      cov.appendChild(el('span', 'book-cat', LB().cats[b.category] || ''));
      cov.appendChild(el('span', 'book-title', tr(b, 'title')));
      cov.appendChild(el('span', 'book-author', tr(b, 'author')));
    }
    if (b.sample) cov.appendChild(el('span', 'sample-tag book-sample', LB().example));
    card.appendChild(cov);
    const body = el('div', 'book-body');
    body.appendChild(el('h3', '', tr(b, 'title')));
    body.appendChild(el('p', 'book-meta', [tr(b, 'author'), b.year].filter(Boolean).join(' · ')));
    const foot = el('div', 'book-foot');
    foot.appendChild(el('span', 'book-lang', b.lang || ''));
    if (link) foot.appendChild(linkBtn(link, LB().open)); else foot.appendChild(el('span', 'r-soon', LB().soon));
    body.appendChild(foot);
    card.appendChild(body);
    grid.appendChild(card);
  });
  document.getElementById('library-empty').hidden = items.length > 0;
  document.getElementById('library-count').textContent = LB().count(items.length);
  refresh();
}
const lq = document.getElementById('library-q');
if (lq) lq.addEventListener('input', () => { lState.q = lq.value; renderLibrary(); });

function renderAll(){ renderSermonsPage(); renderLibrary(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
