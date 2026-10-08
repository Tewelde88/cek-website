/* ============================================================
   NEWS ARCHIVE — the shelf of yearly volumes (news.html, after
   the list) and the archive page itself (news-archive.html):
   every post, grouped by year and month, with category and
   search. Posts come from data/news.json (Admin page → News).
   ============================================================ */
(function(){
'use strict';
if (typeof NEWS === 'undefined' || !Array.isArray(NEWS)) return;

const ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || o[f + '_ti'] || '');
const isTi = ti;
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

const G = () => window.GeezCal;
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CATS = () => ti() ? { news: 'ዜና', article: 'ጽሑፍ', event: 'ፍጻመታት' } : { news: 'News', article: 'Article', event: 'Events' };
const n = k => ti() ? `${k} ጽሑፋት` : `${k} ${k === 1 ? 'post' : 'posts'}`;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const posts = NEWS.filter(p => p && p.date && (p.title || p.title_ti)).slice().sort((a, b) => b.date.localeCompare(a.date));
const years = [...new Set(posts.map(p => +p.date.slice(0, 4)))].sort((a, b) => a - b);
const archivePage = !!document.getElementById('ar-list');
const COLORS = ['#16315e', '#a3221b', '#8a5a1e', '#2f5d4a', '#5a3d6e'];
// Ethiopian years that a Gregorian year touches (Jan–Sep 10: Y-8, then Y-7)
const etYears = y => G() ? `${G().geez(y - 8)}–${G().geez(y - 7)} ${ti() ? 'ዓ.ም.' : 'E.C.'}` : '';

/* ---------- the shelf of volumes ---------- */
function shelf(box){
  box.replaceChildren();
  if (!years.length) return;
  const max = Math.max(...years.map(y => posts.filter(p => +p.date.slice(0, 4) === y).length));
  const row = el('div', 'ar-books');
  years.forEach((y, i) => {
    const k = posts.filter(p => +p.date.slice(0, 4) === y).length;
    const a = el('a', 'ar-vol' + (i === years.length - 1 ? ' is-new' : ''));
    a.href = (archivePage ? '' : 'news-archive.html') + '#y' + y;
    a.style.setProperty('--c', COLORS[(y % COLORS.length)]);
    a.style.setProperty('--h', Math.round(150 + 50 * Math.sqrt(k / max)) + 'px');
    a.setAttribute('aria-label', `${y}: ${n(k)}`);
    a.append(el('span', 'ar-y', String(y)), el('span', 'ar-k', String(k)));
    row.appendChild(a);
  });
  box.append(row, el('div', 'ar-ledge'));
}

/* ---------- the archive page: years → months → posts ---------- */
let cat = '', q = '';
function list(){
  const box = document.getElementById('ar-list');
  const words = q.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const shown = posts.filter(p => (!cat || p.category === cat) &&
    words.every(w => [p.title, p.title_ti, p.excerpt, p.excerpt_ti].join(' ').toLowerCase().includes(w)));
  box.replaceChildren();
  if (!shown.length){ box.appendChild(el('p', 'muted', ti() ? 'ዝተረኽበ ጽሑፍ የለን።' : 'No posts found.')); return; }
  [...new Set(shown.map(p => p.date.slice(0, 4)))].forEach(y => {
    const sec = el('section', 'ar-year'); sec.id = 'y' + y;
    const mine = shown.filter(p => p.date.startsWith(y));
    const h = el('h2', 'ar-yh'); h.append(el('span', '', y), el('small', '', `${etYears(+y)} · ${n(mine.length)}`));
    sec.appendChild(h);
    [...new Set(mine.map(p => p.date.slice(5, 7)))].forEach(m => {
      sec.appendChild(el('h3', 'ar-mh', MONTHS[+m - 1]));
      const ul = el('ul', 'ar-posts'); ul.setAttribute('role', 'list');
      mine.filter(p => p.date.slice(5, 7) === m).forEach(p => {
        const [yy, mm, dd] = p.date.split('-').map(Number);
        const li = el('li'), a = el('a', 'ar-post'); a.href = 'news.html#post=' + encodeURIComponent(p.id);
        const d = el('span', 'ar-d'); d.appendChild(el('b', '', String(dd)));
        if (G()){ const e = G().jdnToEt(G().grToJdn(yy, mm, dd)); const s = el('small', '', `${G().geez(e.d)} ${G().MONTHS_TI[e.m - 1]}`); s.lang = 'ti'; d.appendChild(s); }
        const t = el('span', 'ar-t'); t.appendChild(el('strong', '', tr(p, 'title')));
        if (tr(p, 'excerpt')) t.appendChild(el('span', '', tr(p, 'excerpt')));
        const lt = langTag(p); if (lt) t.appendChild(lt);
        a.append(d, t, el('span', 'ar-cat ar-cat-' + (p.category || 'news'), CATS()[p.category] || CATS().news));
        li.appendChild(a); ul.appendChild(li);
      });
      sec.appendChild(ul);
    });
    box.appendChild(sec);
  });
}

function render(){
  document.querySelectorAll('[data-shelf]').forEach(shelf);
  if (archivePage){
    const chips = document.getElementById('ar-cats'); chips.replaceChildren();
    [['', ti() ? 'ኩሉ' : 'All'], ...Object.entries(CATS())].forEach(([k, label]) => {
      const b = el('button', 'chip-filter', label); b.type = 'button'; b.setAttribute('aria-pressed', k === cat);
      b.addEventListener('click', () => { cat = k; render(); });
      chips.appendChild(b);
    });
    list();
  }
}
if (archivePage){
  const s = document.getElementById('ar-q');
  let t = null; s.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { q = s.value; list(); }, 150); });
}
document.addEventListener('langchange', render);
render();
// opened at a year (news-archive.html#y2025): the list is drawn by now, so go there
if (archivePage && location.hash){ const h = document.getElementById(location.hash.slice(1)); if (h) h.scrollIntoView(); }
})();
