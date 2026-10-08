/* ============================================================
   HOME PAGE — the notice board: announcements and latest updates,
   beside "Our shepherds" and "From our Eparchy".
   Entries come from data/announcements.json (Admin page → Announcements).
   Pinned entries first, then the newest; an entry with a "Hide after"
   date disappears by itself the day after.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('notices');
if (!box) return;
const ALL = (typeof NOTICES !== 'undefined' && Array.isArray(NOTICES)) ? NOTICES.filter(n => n && (n.title || n.title_ti)) : [];
const SHOW = 4;                                      // entries shown before "All announcements"
let open = false;

const ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || o[f + '_ti'] || '');   // an entry may be in one language only
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const T = () => ti() ? {
  title: 'ማስታወቂያታት', sub: 'ሓደሽቲ ሓበሬታታት ካብ ኤጳርቅና',
  kinds: { announcement: 'ማስታወቂያ', update: 'ሓድሽ ሓበሬታ', event: 'ፍጻመ', urgent: 'ህጹጽ' },
  pinned: 'ኣብ ላዕሊ ዝተቐመጠ', more: n => `ኩሎም ማስታወቂያታት (${n})`, less: 'ውሑድ ኣርእዩ',
  read: 'ተወሳኺ ኣንብቡ', none: 'ኣብዚ እዋን ዝተሓበረ የለን።', example: 'ኣብነት'
} : {
  title: 'Announcements', sub: 'Latest updates from the Eparchy',
  kinds: { announcement: 'Announcement', update: 'Update', event: 'Event', urgent: 'Urgent' },
  pinned: 'Pinned', more: n => `All announcements (${n})`, less: 'Show fewer',
  read: 'Read more', none: 'No announcements at the moment.', example: 'Example'
};
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const pad = n => String(n).padStart(2, '0');
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const ICON = {
  announcement: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  update: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/>',
  event: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  urgent: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.3v.2"/>',
  pin: '<path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z"/>'
};
const icon = (k, cls) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', cls); s.innerHTML = ICON[k]; return s; };

// the date as a calendar leaf: Ge'ez day and month, the Gregorian date under it
function leaf(date){
  const L = el('span', 'nb-leaf');
  if (!date){ L.classList.add('is-blank'); return L; }
  const [y, m, d] = date.split('-').map(Number), G = window.GeezCal;
  if (G){
    const e = G.jdnToEt(G.grToJdn(y, m, d));
    const dd = el('span', 'nb-d', G.geez(e.d)); dd.lang = 'ti';
    const mm = el('span', 'nb-m', G.MONTHS_TI[e.m - 1]); mm.lang = 'ti';
    L.append(dd, mm);
  }
  const t = el('time', 'nb-g', `${d} ${MON[m - 1]}`); t.dateTime = date; L.appendChild(t);
  return L;
}

function entry(n){
  const kind = ICON[n.kind] && n.kind !== 'pin' ? n.kind : 'announcement';
  const li = el('li', 'nb-item nb-' + kind + (n.pinned ? ' is-pinned' : ''));
  li.appendChild(leaf(n.date));
  const body = el('div', 'nb-body');
  const k = el('p', 'nb-kind');
  k.appendChild(icon(kind, 'nb-ic'));
  k.appendChild(el('span', '', T().kinds[kind]));
  if (n.pinned){ const p = icon('pin', 'nb-pin'); p.setAttribute('aria-hidden', 'false'); p.setAttribute('role', 'img'); p.setAttribute('aria-label', T().pinned); k.appendChild(p); }
  body.appendChild(k);
  const h = el('h3', 'nb-title');
  if (n.link){ const a = el('a', '', tr(n, 'title')); a.href = n.link; if (/^https?:/.test(n.link)){ a.target = '_blank'; a.rel = 'noopener'; } h.appendChild(a); }
  else h.textContent = tr(n, 'title');
  body.appendChild(h);
  if (tr(n, 'text')) body.appendChild(el('p', 'nb-text', tr(n, 'text')));
  if (n.sample) body.appendChild(el('span', 'sample-tag', T().example));
  li.appendChild(body);
  return li;
}

function render(){
  const now = todayStr();
  const list = ALL.filter(n => !n.until || n.until >= now)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.date || '').localeCompare(a.date || ''));
  box.replaceChildren();
  box.appendChild(el('div', 'harag nb-harag'));
  const head = el('header', 'nb-head');
  const h2 = el('h2', '', T().title); h2.id = 'nb-title'; head.appendChild(h2);
  if (!ti()){ const g = el('span', 'ge', 'ማስታወቂያታት'); g.lang = 'ti'; head.appendChild(g); }
  head.appendChild(el('p', 'nb-sub', T().sub));
  box.appendChild(head);
  if (!list.length){ box.appendChild(el('p', 'nb-none', T().none)); return; }
  const ol = el('ol', 'nb-list');
  list.slice(0, open ? list.length : SHOW).forEach(n => ol.appendChild(entry(n)));
  box.appendChild(ol);
  if (list.length > SHOW){
    const b = el('button', 'nb-more', open ? T().less : T().more(list.length)); b.type = 'button';
    b.setAttribute('aria-expanded', String(open));
    b.addEventListener('click', () => { open = !open; render(); box.querySelector('.nb-more').focus(); });
    box.appendChild(b);
  }
}
document.addEventListener('langchange', render);
render();
})();
