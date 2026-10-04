/* ============================================================
   EPARCHY PAGE — builds the Priests, Deaneries and Religious
   Orders lists from js/eparchy-data.js, in English or Tigrinya.
   ============================================================ */
(function(){
'use strict';
if (typeof EPARCHY === 'undefined') return;

const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const L = () => isTi()
  ? { sample: 'ኣብነት', dean: 'ዲን', parishes: 'ቍምስናታት', men: 'ደቂ ተባዕትዮ', women: 'ደቂ ኣንስትዮ', none: 'ዝተረኽበ የለን።' }
  : { sample: 'Example', dean: 'Dean', parishes: 'Parishes', men: 'Men', women: 'Women', none: 'No results.' };

function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function sampleTag(o, box){ if (o.sample) box.appendChild(el('span', 'sample-tag', L().sample)); }
const initials = name => name.replace(/^(Abba|Abune|Fr\.?|ኣባ|ኣቡነ)\s*[—-]?\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '✝';

/* ---------- Priests ---------- */
const pq = document.getElementById('priest-q');
function renderPriests(){
  const grid = document.getElementById('priest-grid'); if (!grid) return;
  const f = (pq && pq.value || '').trim().toLowerCase();
  grid.replaceChildren();
  const list = EPARCHY.priests.filter(p =>
    [p.name, p.name_ti, p.role, p.role_ti, p.place, p.place_ti].some(v => (v || '').toLowerCase().includes(f)));
  list.forEach(p => {
    const card = el('article', 'person');
    const av = el('div', 'avatar');
    if (p.photo){ av.style.backgroundImage = `url('${p.photo}')`; av.classList.add('has-photo'); }
    else av.textContent = p.sample ? '✝' : initials(p.name);
    card.appendChild(av);
    const body = el('div', 'person-body');
    body.appendChild(el('h3', '', tr(p, 'name')));
    body.appendChild(el('p', 'person-role', tr(p, 'role')));
    body.appendChild(el('p', 'person-place', tr(p, 'place')));
    sampleTag(p, body);
    card.appendChild(body);
    grid.appendChild(card);
  });
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
}
if (pq) pq.addEventListener('input', renderPriests);

/* ---------- Deaneries ---------- */
function renderDeaneries(){
  const grid = document.getElementById('deanery-grid'); if (!grid) return;
  grid.replaceChildren();
  EPARCHY.deaneries.forEach(d => {
    const card = el('article', 'deanery');
    const head = el('div', 'deanery-head');
    head.appendChild(el('h3', '', tr(d, 'name')));
    sampleTag(d, head);
    card.appendChild(head);
    if (d.dean) card.appendChild(el('p', 'deanery-dean', `${L().dean}: ${tr(d, 'dean')}`));
    card.appendChild(el('p', 'deanery-label', L().parishes));
    const ul = el('ul', 'parish-list');
    const parishes = (isTi() && d.parishes_ti) ? d.parishes_ti : (d.parishes || []);
    parishes.forEach(p => ul.appendChild(el('li', '', p)));
    card.appendChild(ul);
    grid.appendChild(card);
  });
}

/* ---------- Religious orders ---------- */
function renderOrders(){
  const grid = document.getElementById('order-grid'); if (!grid) return;
  grid.replaceChildren();
  EPARCHY.orders.forEach(o => {
    const card = el('article', 'order');
    card.appendChild(el('span', 'order-type type-' + o.type, o.type === 'women' ? L().women : L().men));
    card.appendChild(el('h3', '', tr(o, 'name')));
    card.appendChild(el('p', '', tr(o, 'work')));
    sampleTag(o, card);
    grid.appendChild(card);
  });
}

function renderAll(){ renderPriests(); renderDeaneries(); renderOrders(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
