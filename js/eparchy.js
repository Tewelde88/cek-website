/* ============================================================
   EPARCHY PAGE — builds the Priests, Deaneries and Religious
   Orders galleries from js/eparchy-data.js, in English or Tigrinya.
   ============================================================ */
(function(){
'use strict';
if (typeof EPARCHY === 'undefined') return;

const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const L = () => isTi()
  ? { sample: 'ኣብነት', dean: 'ዲን', parishes: 'ቍምስናታት', men: 'ደቂ ተባዕትዮ', women: 'ደቂ ኣንስትዮ', none: 'ዝተረኽበ የለን።' }
  : { sample: 'Example', dean: 'Dean', parishes: 'Parishes', men: 'Men', women: 'Women', none: 'No results.' };

// Placeholder pictures (used when an entry has no photo)
const ICONS = {
  church: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2v6M13 5h6"/><path d="M6 29V16l10-7 10 7v13z"/><path d="M13 29v-7h6v7"/></svg>',
  people: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="10" r="4"/><circle cx="21" cy="10" r="4"/><path d="M3 26c0-5 3.5-8 8-8s8 3 8 8M13 26c0-5 3.5-8 8-8s8 3 8 8"/></svg>'
};

function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
const initials = name => name.replace(/^(Abba|Abune|Fr\.?|ኣባ|ኣቡነ)\s*[—-]?\s*/i, '')
  .split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '✝';

// One gallery tile: picture with the title over it, details underneath
function tile({ photo, placeholder, kind, title, sub, badge, sample }){
  const t = el('article', 'g-tile g-' + kind);
  const m = el('div', 'g-media');
  if (photo){ m.style.backgroundImage = `url('${photo}')`; }
  else {
    m.classList.add('no-photo');
    const ph = el('span', 'g-ph');
    if (placeholder.startsWith('<svg')) ph.innerHTML = placeholder; else ph.textContent = placeholder;
    m.appendChild(ph);
  }
  const tags = el('div', 'g-tags');
  if (badge) tags.appendChild(badge);
  if (sample) tags.appendChild(el('span', 'sample-tag', L().sample));
  if (tags.children.length) m.appendChild(tags);
  const ov = el('div', 'g-overlay');
  ov.appendChild(el('h3', '', title));
  if (sub) ov.appendChild(el('p', '', sub));
  m.appendChild(ov);
  t.appendChild(m);
  const body = el('div', 'g-body');
  t.appendChild(body);
  return { tile: t, body };
}

/* ---------- Priests ---------- */
const pq = document.getElementById('priest-q');
function renderPriests(){
  const grid = document.getElementById('priest-grid'); if (!grid) return;
  const f = (pq && pq.value || '').trim().toLowerCase();
  grid.replaceChildren();
  const list = EPARCHY.priests.filter(p =>
    [p.name, p.name_ti, p.role, p.role_ti, p.place, p.place_ti].some(v => (v || '').toLowerCase().includes(f)));
  list.forEach(p => {
    const { tile: t, body } = tile({ kind: 'person', photo: p.photo, placeholder: p.sample ? '✝' : initials(p.name),
      title: tr(p, 'name'), sub: tr(p, 'role'), sample: p.sample });
    body.appendChild(el('p', 'g-place', tr(p, 'place')));
    grid.appendChild(t);
  });
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
}
if (pq) pq.addEventListener('input', () => { renderPriests(); refresh(); });

/* ---------- Deaneries ---------- */
function renderDeaneries(){
  const grid = document.getElementById('deanery-grid'); if (!grid) return;
  grid.replaceChildren();
  EPARCHY.deaneries.forEach(d => {
    const { tile: t, body } = tile({ kind: 'deanery', photo: d.photo, placeholder: ICONS.church,
      title: tr(d, 'name'), sub: d.dean ? `${L().dean}: ${tr(d, 'dean')}` : '', sample: d.sample });
    body.appendChild(el('p', 'g-label', L().parishes));
    const ul = el('ul', 'parish-list');
    ((isTi() && d.parishes_ti) ? d.parishes_ti : (d.parishes || [])).forEach(p => ul.appendChild(el('li', '', p)));
    body.appendChild(ul);
    grid.appendChild(t);
  });
}

/* ---------- Religious orders ---------- */
function renderOrders(){
  const grid = document.getElementById('order-grid'); if (!grid) return;
  grid.replaceChildren();
  EPARCHY.orders.forEach(o => {
    const badge = el('span', 'order-type type-' + o.type, o.type === 'women' ? L().women : L().men);
    const { tile: t, body } = tile({ kind: 'order', photo: o.photo, placeholder: ICONS.people,
      title: tr(o, 'name'), badge, sample: o.sample });
    body.appendChild(el('p', '', tr(o, 'work')));
    grid.appendChild(t);
  });
}

const refresh = () => { if (window.refreshClamps) window.refreshClamps(); };
function renderAll(){ renderPriests(); renderDeaneries(); renderOrders(); refresh(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
