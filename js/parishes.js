/* ============================================================
   PARISHES & CHAPELS PAGE — builds the lists from
   js/parishes-data.js, in English or Tigrinya.
   ============================================================ */
(function(){
'use strict';
if (typeof PARISHES_DATA === 'undefined') return;

const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const L = () => isTi() ? {
  sample: 'ኣብነት', patron: 'ጠባቒ ቅዱስ', deanery: 'መካን', priest: 'ኣባ ሰበኻ', mass: 'ሰዓታት ቅዳሴ',
  phone: 'ተሌፎን', map: 'ካርታ', parish: 'ቍምስና', meets: 'ኣኼባ', feast: 'በዓል',
  soon: 'ዝርዝር ሓበሬታ ቀልጢፉ ይመጽእ።', none: 'ዝተረኽበ የለን።', count: n => `${n} ቍምስናታት`
} : {
  sample: 'Example', patron: 'Patron', deanery: 'Deanery', priest: 'Parish priest', mass: 'Mass times',
  phone: 'Phone', map: 'Map', parish: 'Parish', meets: 'Meets', feast: 'Feast',
  soon: 'Details coming soon.', none: 'No results.', count: n => `${n} parishes`
};

function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function sampleTag(o, box){ if (o.sample) box.appendChild(el('span', 'sample-tag', L().sample)); }
function row(dl, label, value){
  if (!value) return;
  const d = el('div');
  d.appendChild(el('dt', '', label));
  d.appendChild(el('dd', '', value));
  dl.appendChild(d);
}
function mapLink(o){
  const url = o.map || 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent([o.name, o.place, 'Eritrea'].filter(Boolean).join(', '));
  const a = el('a', 'map-btn');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  a.appendChild(document.createTextNode(L().map));
  return a;
}
function head(card, o, sub){
  const h = el('div', 'pc-head');
  const t = el('div');
  t.appendChild(el('h3', '', tr(o, 'name')));
  if (sub) t.appendChild(el('p', 'pc-sub', sub));
  h.appendChild(t);
  sampleTag(o, h);
  card.appendChild(h);
}

/* ---------- Parishes (with search) ---------- */
const q = document.getElementById('parish-q');
// Opened from a deanery: parishes.html?q=<parish name>
const urlQ = new URLSearchParams(location.search).get('q');
if (q && urlQ) q.value = urlQ;
function renderParishes(){
  const grid = document.getElementById('parish-grid'); if (!grid) return;
  const f = (q && q.value || '').trim().toLowerCase();
  grid.replaceChildren();
  const list = PARISHES_DATA.parishes.filter(p =>
    ['name','name_ti','patron','patron_ti','deanery','deanery_ti','place','place_ti','priest','priest_ti']
      .some(k => (p[k] || '').toLowerCase().includes(f)));
  list.forEach(p => {
    const card = el('article', 'pc parish');
    head(card, p, tr(p, 'place'));
    const dl = el('dl', 'pc-facts');
    row(dl, L().patron, tr(p, 'patron'));
    row(dl, L().deanery, tr(p, 'deanery'));
    row(dl, L().priest, tr(p, 'priest'));
    row(dl, L().mass, tr(p, 'mass'));
    row(dl, L().phone, p.phone);
    if (dl.children.length) card.appendChild(dl);
    else card.appendChild(el('p', 'pc-soon', L().soon));
    const foot = el('div', 'pc-foot');
    foot.appendChild(mapLink(p));
    card.appendChild(foot);
    grid.appendChild(card);
  });
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
  const c = document.getElementById('parish-count');
  if (c) c.textContent = L().count(PARISHES_DATA.parishes.filter(p => !p.sample).length);
}
if (q) q.addEventListener('input', renderParishes);

/* ---------- Chapels ---------- */
function renderChapels(){
  const grid = document.getElementById('chapel-grid'); if (!grid) return;
  grid.replaceChildren();
  PARISHES_DATA.chapels.forEach(c => {
    const card = el('article', 'pc chapel');
    head(card, c, tr(c, 'place'));
    const dl = el('dl', 'pc-facts');
    row(dl, L().parish, tr(c, 'parish'));
    row(dl, L().mass, tr(c, 'mass'));
    if (dl.children.length) card.appendChild(dl);
    grid.appendChild(card);
  });
}

/* ---------- Small Christian communities ---------- */
function renderCommunities(){
  const grid = document.getElementById('community-grid'); if (!grid) return;
  grid.replaceChildren();
  PARISHES_DATA.communities.forEach(c => {
    const card = el('article', 'pc community');
    head(card, c);
    const dl = el('dl', 'pc-facts');
    row(dl, L().parish, tr(c, 'parish'));
    row(dl, L().meets, tr(c, 'meets'));
    if (dl.children.length) card.appendChild(dl);
    grid.appendChild(card);
  });
}

/* ---------- Sanctuaries ---------- */
function renderSanctuaries(){
  const grid = document.getElementById('sanctuary-grid'); if (!grid) return;
  grid.replaceChildren();
  PARISHES_DATA.sanctuaries.forEach(s => {
    const card = el('article', 'pc sanctuary');
    head(card, s, tr(s, 'dedication'));
    const dl = el('dl', 'pc-facts');
    row(dl, L().feast, tr(s, 'feast'));
    if (dl.children.length) card.appendChild(dl);
    const foot = el('div', 'pc-foot');
    if (tr(s, 'place')) foot.appendChild(el('span', 'pc-place', tr(s, 'place')));
    foot.appendChild(mapLink(s));
    card.appendChild(foot);
    grid.appendChild(card);
  });
}

function renderAll(){ renderParishes(); renderChapels(); renderCommunities(); renderSanctuaries(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
