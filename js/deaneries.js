/* ============================================================
   DEANERIES PAGE (deaneries.html) — three doors (Keren,
   Habinmentel, Hagaz), the open deanery with its Archpriest,
   parishes / chapels / sanctuaries as cards or as a vine, and
   the three deaneries side by side.
   Data: data/eparchy.json → deaneries; data/parishes.json →
   parishes, chapels, sanctuaries (each with a "deanery").
   ============================================================ */
(function(){
'use strict';
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const $ = id => document.getElementById(id);
const L = () => isTi() ? {
  archpriest: 'ሊቀካህናት', parishes: 'ቍምስናታት', chapels: 'ቤተጸሎታት', sanctuaries: 'ቅዱሳት ቦታታት', sample: 'ኣብነት',
  patron: 'ጠባቒ ቅዱስ', priest: 'ኣባ ሰበኻ', mass: 'ሰዓታት ቅዳሴ', parish: 'ቍምስና', feast: 'በዓል', map: 'ካርታ',
  lives: 'ዝነብረሉ ቍምስና', call: 'ደውሉ', none: 'ገና ኣይተወሰኸን — ኣብ ገጽ ምምሕዳር ወስኹ።', soon: 'ዝርዝር ሓበሬታ ቀልጢፉ ይመጽእ።',
  open: 'ክፈት', noDean: 'መካን ዘይተመደበ'
} : {
  archpriest: 'Archpriest', parishes: 'Parishes', chapels: 'Chapels', sanctuaries: 'Sanctuaries', sample: 'Example',
  patron: 'Patron', priest: 'Parish priest', mass: 'Mass times', parish: 'Parish', feast: 'Feast', map: 'Map',
  lives: 'Resides at', call: 'Call', none: 'None added yet — add them on the Admin page.', soon: 'Details coming soon.',
  open: 'Open', noDean: 'Not yet assigned'
};

/* ---------- data ---------- */
let DEANS = [
  { key: 'keren', name: 'Keren', name_ti: 'ከረን', color: 'red' },
  { key: 'habinmentel', name: 'Habinmentel', name_ti: 'ሓቢንመንተል', color: 'navy' },
  { key: 'hagaz', name: 'Hagaz', name_ti: 'ሓጋዝ', color: 'ochre' }
];
const E = (typeof EPARCHY !== 'undefined' && EPARCHY) || {};
if (Array.isArray(E.deaneries) && E.deaneries.some(d => d.key)) DEANS = E.deaneries.filter(d => d.key);
const PD = (typeof PARISHES_DATA !== 'undefined' && PARISHES_DATA) || {};
let PAR = (PD.parishes || []).slice(), CHA = (PD.chapels || []).slice(), SAN = (PD.sanctuaries || []).slice();


const parishOf = c => PAR.find(p => p.name === c.parish);
const deanOf = x => x.deanery || (x.parish && parishOf(x) && parishOf(x).deanery) || '';
const of = (list, key) => list.filter(x => deanOf(x) === key);
const counts = d => ({ parishes: of(PAR, d.key).length, chapels: of(CHA, d.key).length, sanctuaries: of(SAN, d.key).length });

/* ---------- state (deaneries.html#hagaz opens Hagaz) ---------- */
const S = { dean: (DEANS.find(d => d.key === location.hash.slice(1)) || DEANS[0] || {}).key, tab: 'parishes', view: 'cards' };
const cur = () => DEANS.find(d => d.key === S.dean);
const DOOR = '<svg viewBox="0 0 40 52" aria-hidden="true"><path d="M5 50V22C5 11.5 11.7 4 20 4s15 7.5 15 18v28"/><path d="M20 4v46M5 50h30"/><path d="M14 30v4M26 30v4"/></svg>';

/* ---------- row 1: doors ---------- */
function renderDoors(){
  $('dn-doors').replaceChildren(...DEANS.map(d => {
    const n = counts(d);
    const b = el('button', 'door door-' + (d.color || 'red')); b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(d.key === S.dean)); b.setAttribute('aria-controls', 'dn-open');
    b.onclick = () => { S.dean = d.key; S.tab = 'parishes'; history.replaceState(null, '', '#' + d.key); renderAll(); $('dn-open').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };
    const arch = el('span', 'door-arch'); arch.innerHTML = DOOR;
    const nm = el('span', 'door-name', tr(d, 'name'));
    const other = el('span', 'door-alt', isTi() ? d.name : d.name_ti); if (!isTi()) other.lang = 'ti';
    arch.append(nm, other);
    const info = el('span', 'door-info');
    info.appendChild(el('span', 'door-ap', `${L().archpriest}: ${tr(d, 'archpriest')}`));
    const nums = el('span', 'door-nums');
    [['parishes', n.parishes], ['chapels', n.chapels], ['sanctuaries', n.sanctuaries]].forEach(([k, v]) => { const s = el('span'); s.append(el('b', '', String(v)), ' ' + L()[k]); nums.appendChild(s); });
    info.appendChild(nums);
    b.append(arch, info);
    return b;
  }));
}

/* ---------- row 2: the open deanery ---------- */
function renderOpen(){
  const d = cur(); if (!d) return;
  $('dn-open').className = 'lit-section alt dn-open dn-' + (d.color || 'red');
  const ap = $('dn-arch'); ap.replaceChildren();
  const ph = el('span', 'bi-arch' + (d.photo ? '' : ' ph ph-' + (d.color === 'navy' ? 'navy' : d.color === 'ochre' ? 'ochre' : 'red')));
  if (d.photo) ph.style.backgroundImage = `url("${d.photo}")`; else ph.appendChild(el('span', 'pc-ini', (tr(d, 'archpriest').replace(/^(Abba|ኣባ)\s*[—-]?\s*/, '')[0] || '')));
  const tx = el('div');
  tx.appendChild(el('p', 'eyebrow eyebrow-red', L().archpriest));
  tx.appendChild(el('strong', 'dn-ap-name', tr(d, 'archpriest')));
  if (tr(d, 'residence')) tx.appendChild(el('span', 'dn-ap-res', `${L().lives}: ${tr(d, 'residence')}`));
  if (d.phone){ const a = el('a', 'r-btn', `${L().call} ${d.phone}`); a.href = 'tel:' + d.phone.replace(/\s+/g, ''); tx.appendChild(a); }
  if (d.sample) tx.appendChild(el('span', 'sample-tag', L().sample));
  ap.append(ph, tx);
  $('dn-name').textContent = (isTi() ? 'መካን ' : '') + tr(d, 'name') + (isTi() ? '' : ' Deanery');
  $('dn-desc').textContent = tr(d, 'about');
  const n = counts(d);
  document.querySelectorAll('[data-n]').forEach(b => b.textContent = n[b.dataset.n]);
  document.querySelectorAll('.dn-tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)));
  document.querySelectorAll('.dn-view [data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === S.view)));
  $('dn-cards').hidden = S.view !== 'cards'; $('dn-vine').hidden = S.view !== 'vine';
  if (S.view === 'cards') renderCards(d); else renderVine(d);
}
function mapBtn(o){
  const a = el('a', 'map-btn'); a.target = '_blank'; a.rel = 'noopener';
  a.href = o.map || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([o.name, o.place, 'Eritrea'].filter(Boolean).join(', '));
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  a.appendChild(document.createTextNode(L().map)); return a;
}
function card(o, kind, sub){
  const c = el('article', 'pc ' + kind); c.id = kind + '-' + (o.name || '').replace(/\W+/g, '-').toLowerCase();
  const h = el('div', 'pc-head'); const t = el('div'); t.appendChild(el('h3', '', tr(o, 'name')));
  if (sub) t.appendChild(el('p', 'pc-sub', sub)); h.appendChild(t);
  if (o.sample) h.appendChild(el('span', 'sample-tag', L().sample)); c.appendChild(h);
  const dl = el('dl', 'pc-facts'); const row = (k, v) => { if (!v) return; const d = el('div'); d.append(el('dt', '', k), el('dd', '', v)); dl.appendChild(d); };
  if (kind === 'parish'){ row(L().patron, tr(o, 'patron')); row(L().priest, tr(o, 'priest')); row(L().mass, tr(o, 'mass')); }
  if (kind === 'chapel'){ row(L().mass, tr(o, 'mass')); }
  if (kind === 'sanctuary'){ row(L().feast, tr(o, 'feast')); }
  if (dl.children.length) c.appendChild(dl); else if (kind !== 'chapel') c.appendChild(el('p', 'pc-soon', L().soon));
  const f = el('div', 'pc-foot');
  if (kind === 'chapel' && o.parish){ const a = el('button', 'dn-link', `${L().parish}: ${tr(o, 'parish')}`); a.type = 'button';
    a.onclick = () => { S.tab = 'parishes'; renderOpen(); const p = document.getElementById('parish-' + o.parish.replace(/\W+/g, '-').toLowerCase()); if (p){ p.scrollIntoView({ block: 'center' }); p.classList.add('is-flash'); setTimeout(() => p.classList.remove('is-flash'), 1600); } };
    f.appendChild(a); }
  if (kind !== 'chapel') f.appendChild(mapBtn(o));
  c.appendChild(f);
  return c;
}
function renderCards(d){
  const list = { parishes: of(PAR, d.key), chapels: of(CHA, d.key), sanctuaries: of(SAN, d.key) }[S.tab];
  const kind = { parishes: 'parish', chapels: 'chapel', sanctuaries: 'sanctuary' }[S.tab];
  $('dn-grid').replaceChildren(...list.map(o => card(o, kind, kind === 'sanctuary' ? tr(o, 'dedication') : tr(o, 'place'))));
  if (!list.length) $('dn-grid').appendChild(el('p', 'muted', L().none));
}
/* the vine: deanery → parishes (branches) → chapels (grapes); sanctuaries as stars */
function renderVine(d){
  const box = $('dn-vine'); box.replaceChildren();
  const root = el('div', 'vine-root'); root.append(el('strong', '', tr(d, 'name')), el('span', '', `${L().archpriest}: ${tr(d, 'archpriest')}`));
  box.appendChild(root);
  const ul = el('ul', 'vine');
  of(PAR, d.key).forEach(p => {
    const li = el('li', 'vine-branch');
    const ch = of(CHA, d.key).filter(c => c.parish === p.name);
    const b = el('button', 'vine-parish'); b.type = 'button'; b.setAttribute('aria-expanded', 'true');
    b.append(el('span', 'leaf'), el('strong', '', tr(p, 'name')), el('small', '', `${ch.length} ${L().chapels.toLowerCase()}`));
    const sub = el('ul', 'vine-grapes');
    ch.forEach(c => { const g = el('li'); g.append(el('span', 'grape'), document.createTextNode(tr(c, 'name'))); sub.appendChild(g); });
    b.onclick = () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!o)); sub.hidden = o; };
    li.append(b, sub); ul.appendChild(li);
  });
  of(SAN, d.key).forEach(s => { const li = el('li', 'vine-branch vine-star'); li.append(el('span', 'star'), el('strong', '', tr(s, 'name')), el('small', '', L().sanctuaries)); ul.appendChild(li); });
  box.appendChild(ul);
  if (!ul.children.length) box.appendChild(el('p', 'muted', L().none));
}
document.querySelectorAll('.dn-tabs [data-tab]').forEach(b => b.addEventListener('click', () => { S.tab = b.dataset.tab; renderOpen(); }));
document.querySelector('.dn-tabs').addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const tabs = ['parishes', 'chapels', 'sanctuaries'], i = tabs.indexOf(S.tab);
  S.tab = tabs[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; renderOpen(); document.querySelector(`.dn-tabs [data-tab="${S.tab}"]`).focus();
});
document.querySelectorAll('.dn-view [data-view]').forEach(b => b.addEventListener('click', () => { S.view = b.dataset.view; renderOpen(); }));

/* ---------- row 3: side by side ---------- */
function renderCompare(){
  const max = Math.max(1, ...DEANS.map(d => Math.max(...Object.values(counts(d)))));
  $('dn-cmp').replaceChildren(...DEANS.map(d => {
    const n = counts(d);
    const b = el('button', 'cmp cmp-' + (d.color || 'red')); b.type = 'button';
    b.onclick = () => { S.dean = d.key; history.replaceState(null, '', '#' + d.key); renderAll(); $('dn-open').scrollIntoView({ block: 'start' }); };
    b.appendChild(el('strong', 'cmp-name', tr(d, 'name')));
    b.appendChild(el('span', 'cmp-ap', tr(d, 'archpriest')));
    [['parishes', n.parishes], ['chapels', n.chapels], ['sanctuaries', n.sanctuaries]].forEach(([k, v]) => {
      const r = el('span', 'cmp-row'); r.appendChild(el('span', 'cmp-k', L()[k]));
      const bar = el('span', 'cmp-bar'); const f = el('span'); f.style.width = (v / max * 100) + '%'; bar.appendChild(f);
      r.append(bar, el('b', '', String(v))); b.appendChild(r);
    });
    return b;
  }));
}

function renderAll(){ renderDoors(); renderOpen(); renderCompare(); }
window.addEventListener('hashchange', () => { const k = location.hash.slice(1); if (DEANS.some(d => d.key === k)){ S.dean = k; renderAll(); } });
document.addEventListener('langchange', renderAll);
renderAll();
})();

/* ---- Eparchy tabs: on phones, scroll the active tab into view ---- */
(function(){ const a = document.querySelector('.ep-tabs a.active'); if (a){ const ul = a.closest('ul'); ul.scrollLeft = a.parentElement.offsetLeft - 16; } })();
