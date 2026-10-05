/* ============================================================
   EPARCHY SECTION — overview, bishop, priests, seminary,
   deaneries and religious orders pages.
   Lists come from data/eparchy.json (edited on the Admin page).
   ============================================================ */
(function(){
'use strict';
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const D = (typeof EPARCHY !== 'undefined' && EPARCHY) ? EPARCHY : { priests: [], deaneries: [], orders: [] };
const $ = id => document.getElementById(id);
const L = () => isTi() ? {
  all: 'ኩሉ', sample: 'ኣብነት', none: 'ዝተረኽበ የለን።', soon: 'ቀልጢፉ ይመጽእ',
  count: (n, w) => `${n} ${w}`, priests: 'ካህናት', deaneries: 'ዲነሪታት', orders: 'ማሕበራት',
  role: 'ሓላፍነት', place: 'ቍምስና / ቦታ', dean: 'ዲን', parishes: 'ቍምስናታት', men: 'ደቂ ተባዕትዮ', women: 'ደቂ ኣንስትዮ',
  work: 'ስራሕ', open: 'ዝርዝር ርኣዩ', findParish: 'ኣብ ገጽ ቍምስናታት ድለዩ', of: 'ካብ'
} : {
  all: 'All', sample: 'Example', none: 'No results.', soon: 'Coming soon',
  count: (n, w) => `${n} ${w}`, priests: 'priests', deaneries: 'deaneries', orders: 'communities',
  role: 'Role', place: 'Parish / place', dean: 'Dean', parishes: 'Parishes', men: 'Men', women: 'Women',
  work: 'Work', open: 'View details', findParish: 'Find on the Parishes page', of: 'of'
};
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
const real = list => (list || []).filter(x => !x.sample);
const initials = name => name.replace(/^(Abba|Abune|Fr\.?|ኣባ|ኣቡነ)\s*[—-]?\s*/i, '')
  .split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '✝';
const reveal = node => { if (window.revealNow) window.revealNow(node); };
const ICONS = {
  church: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2v6M13 5h6"/><path d="M6 29V16l10-7 10 7v13z"/><path d="M13 29v-7h6v7"/></svg>',
  people: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="10" r="4"/><circle cx="21" cy="10" r="4"/><path d="M3 26c0-5 3.5-8 8-8s8 3 8 8M13 26c0-5 3.5-8 8-8s8 3 8 8"/></svg>'
};

/* ---------- Old links (eparchy.html#priests …) → the new pages ---------- */
const OLD = { bishop: 'bishop.html', priests: 'priests.html', seminary: 'seminary.html', deaneries: 'deaneries.html', religious: 'religious.html', 'bishop-bio': 'bishop.html#biography' };
if (/eparchy\.html$/.test(location.pathname) && OLD[location.hash.slice(1)]) location.replace(OLD[location.hash.slice(1)]);

/* ---------- Tabs: on phones, scroll the active tab into view ---------- */
const act = document.querySelector('.ep-tabs a.active');
if (act){ const ul = act.closest('ul'); ul.scrollLeft = act.parentElement.offsetLeft - 16; }

/* ---------- Picture tile (used for priests and religious communities) ---------- */
function tile({ photo, placeholder, kind, title, sub, badge, sample, onOpen, body }){
  const t = el('article', 'g-tile g-' + kind + ' reveal');
  const m = el('div', 'g-media');
  if (photo) m.style.backgroundImage = `url('${photo}')`;
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
  m.appendChild(el('span', 'g-zoom', '+'));
  t.appendChild(m);
  const b = el('div', 'g-body');
  (body || []).forEach(x => b.appendChild(x));
  t.appendChild(b);
  if (onOpen){
    const hit = el('button', 'g-hit'); hit.type = 'button';
    hit.setAttribute('aria-label', `${L().open}: ${title}`);
    hit.addEventListener('click', onOpen);
    t.appendChild(hit);
  }
  return t;
}

/* ---------- Details window (priests, religious) with previous / next ---------- */
const modal = $('ep-modal');
let mList = [], mIdx = 0, mRender = null;
function modalShow(){
  const body = $('ep-modal-body'); body.replaceChildren(mRender(mList[mIdx]));
  $('ep-pos').textContent = `${mIdx + 1} ${L().of} ${mList.length}`;
  $('ep-prev').hidden = $('ep-next').hidden = $('ep-pos').hidden = mList.length < 2;
}
function openModal(list, i, render){
  if (!modal || typeof modal.showModal !== 'function') return;
  mList = list; mIdx = i; mRender = render; modalShow(); modal.showModal();
}
if (modal){
  const step = d => { mIdx = (mIdx + d + mList.length) % mList.length; modalShow(); };
  $('ep-prev').addEventListener('click', () => step(-1));
  $('ep-next').addEventListener('click', () => step(1));
  modal.querySelector('.ep-modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
}
function profile({ photo, placeholder, title, sub, rows, sample }){
  const w = el('div', 'ep-profile');
  const ph = el('div', 'ep-profile-photo' + (photo ? '' : ' no-photo'));
  if (photo) ph.style.backgroundImage = `url('${photo}')`;
  else { if (placeholder.startsWith('<svg')) ph.innerHTML = placeholder; else ph.textContent = placeholder; }
  w.appendChild(ph);
  const tx = el('div', 'ep-profile-text');
  tx.appendChild(el('h2', '', title));
  if (sub) tx.appendChild(el('p', 'ep-profile-sub', sub));
  if (sample) tx.appendChild(el('span', 'sample-tag', L().sample));
  const dl = el('dl', 'facts');
  rows.filter(r => r[1]).forEach(([k, v]) => { const d = el('div'); d.appendChild(el('dt', '', k)); d.appendChild(el('dd', '', v)); dl.appendChild(d); });
  if (dl.children.length) tx.appendChild(dl);
  w.appendChild(tx);
  return w;
}

/* ================= OVERVIEW ================= */
function renderHub(){
  if (!document.querySelector('.ep-hub')) return;
  const parishes = (typeof PARISHES_DATA !== 'undefined' && PARISHES_DATA) ? real(PARISHES_DATA.parishes) : [];
  const counts = { priests: real(D.priests).length, deaneries: real(D.deaneries).length, orders: real(D.orders).length, parishes: parishes.length };
  document.querySelectorAll('[data-count-key]').forEach(n => {
    const v = counts[n.dataset.countKey] || 0;
    n.dataset.count = v;
    n.closest('.stat').classList.toggle('is-empty', !v);
    if (!v) n.textContent = '—';
  });
  document.querySelectorAll('[data-count-badge]').forEach(n => {
    const v = counts[n.dataset.countBadge] || 0;
    n.textContent = v ? String(v) : L().soon;
    n.classList.toggle('is-soon', !v);
  });
  // Priests tile shows the first priest photo, if any
  const withPhoto = real(D.priests).find(p => p.photo);
  if (withPhoto && $('ex-priests-bg')) $('ex-priests-bg').style.backgroundImage = `url('${withPhoto.photo}'), linear-gradient(150deg,#2a4a80,#16315e)`;
}
// Numbers count up when they come into view
function countUp(n){
  const to = +n.dataset.count; if (!to) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ n.textContent = to; return; }
  const t0 = performance.now(), dur = 900;
  const tick = t => { const k = Math.min(1, (t - t0) / dur); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ countUp(e.target); io.unobserve(e.target); } }), { threshold: .5 });
  document.querySelectorAll('[data-count-key]').forEach(n => io.observe(n));
}

/* ================= PRIESTS ================= */
const pState = { q: '', role: 'all', sort: 'az', view: 'grid' };
function priestCard(p, i, list){
  return tile({ kind: 'person', photo: p.photo, placeholder: p.sample ? '✝' : initials(p.name),
    title: tr(p, 'name'), sub: tr(p, 'role'), sample: p.sample,
    body: [el('p', 'g-list-name', tr(p, 'name')), el('p', 'g-list-role', tr(p, 'role')), el('p', 'g-place', tr(p, 'place'))],
    onOpen: () => openModal(list, i, x => profile({ photo: x.photo, placeholder: x.sample ? '✝' : initials(x.name),
      title: tr(x, 'name'), sub: tr(x, 'role'), sample: x.sample,
      rows: [[L().role, tr(x, 'role')], [L().place, tr(x, 'place')]] })) });
}
function renderPriests(){
  const grid = $('priest-grid'); if (!grid) return;
  // Role chips
  const roles = [...new Set(D.priests.map(p => tr(p, 'role')).filter(Boolean))];
  const chips = $('priest-roles'); chips.replaceChildren();
  if (roles.length > 1){
    ['all', ...roles].forEach(r => {
      const n = r === 'all' ? D.priests.length : D.priests.filter(p => tr(p, 'role') === r).length;
      const b = el('button', 'chip-filter', `${r === 'all' ? L().all : r} (${n})`); b.type = 'button';
      b.setAttribute('aria-pressed', String(pState.role === r));
      b.addEventListener('click', () => { pState.role = r; renderPriests(); });
      chips.appendChild(b);
    });
  }
  const f = pState.q.trim().toLowerCase();
  const key = { az: p => tr(p, 'name'), role: p => tr(p, 'role') + tr(p, 'name'), place: p => tr(p, 'place') + tr(p, 'name') }[pState.sort];
  const list = D.priests
    .filter(p => (pState.role === 'all' || tr(p, 'role') === pState.role) &&
      (!f || [p.name, p.name_ti, p.role, p.role_ti, p.place, p.place_ti].some(v => (v || '').toLowerCase().includes(f))))
    .sort((a, b) => key(a).localeCompare(key(b)));
  grid.replaceChildren();
  grid.classList.toggle('is-list', pState.view === 'list');
  list.forEach((p, i) => grid.appendChild(priestCard(p, i, list)));
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
  $('priest-count').textContent = L().count(list.length, L().priests);
  grid.querySelectorAll('.reveal').forEach(reveal);
}
if ($('priest-grid')){
  $('priest-q').addEventListener('input', e => { pState.q = e.target.value; renderPriests(); });
  $('priest-sort').addEventListener('change', e => { pState.sort = e.target.value; renderPriests(); });
  ['grid', 'list'].forEach(v => $('view-' + v).addEventListener('click', () => {
    pState.view = v;
    ['grid', 'list'].forEach(w => $('view-' + w).setAttribute('aria-pressed', String(w === v)));
    renderPriests();
  }));
}

/* ================= DEANERIES (cards open to show their parishes) ================= */
function renderDeaneries(){
  const box = $('deanery-grid'); if (!box) return;
  box.replaceChildren();
  D.deaneries.forEach((d, i) => {
    const card = el('article', 'dn reveal');
    const head = el('button', 'dn-head'); head.type = 'button';
    head.setAttribute('aria-expanded', 'false'); head.setAttribute('aria-controls', 'dn-' + i);
    const ic = el('span', 'dn-icon'); ic.innerHTML = ICONS.church; head.appendChild(ic);
    const tx = el('span', 'dn-title');
    tx.appendChild(el('strong', '', tr(d, 'name')));
    if (d.dean) tx.appendChild(el('small', '', `${L().dean}: ${tr(d, 'dean')}`));
    head.appendChild(tx);
    const parishes = (isTi() && d.parishes_ti && d.parishes_ti.length) ? d.parishes_ti : (d.parishes || []);
    head.appendChild(el('span', 'dn-num', String(parishes.length)));
    if (d.sample) head.appendChild(el('span', 'sample-tag', L().sample));
    head.appendChild(el('span', 'dn-chev', '⌄'));
    card.appendChild(head);
    const body = el('div', 'dn-body'); body.id = 'dn-' + i; body.hidden = true;
    if (d.photo){ const ph = el('div', 'dn-photo'); ph.style.backgroundImage = `url('${d.photo}')`; body.appendChild(ph); }
    body.appendChild(el('p', 'g-label', L().parishes));
    const ul = el('ul', 'parish-list');
    parishes.forEach((p, k) => {
      const li = el('li'); const a = el('a', '', p);
      a.href = 'parishes.html?q=' + encodeURIComponent((d.parishes || [])[k] || p);
      a.title = L().findParish; li.appendChild(a); ul.appendChild(li);
    });
    body.appendChild(ul);
    card.appendChild(body);
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') !== 'true';
      head.setAttribute('aria-expanded', String(open)); body.hidden = !open; card.classList.toggle('is-open', open);
    });
    box.appendChild(card);
  });
  if (!D.deaneries.length) box.appendChild(el('p', 'muted', L().none));
  $('deanery-count').textContent = L().count(D.deaneries.length, L().deaneries);
  box.querySelectorAll('.reveal').forEach(reveal);
}
if ($('deanery-all')) $('deanery-all').addEventListener('click', e => {
  const btn = e.currentTarget, open = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', String(open));
  btn.classList.toggle('is-open', open);
  document.querySelectorAll('.dn-head').forEach(h => { if ((h.getAttribute('aria-expanded') === 'true') !== open) h.click(); });
});

/* ================= RELIGIOUS ORDERS ================= */
const oState = { type: 'all' };
function renderOrders(){
  const grid = $('order-grid'); if (!grid) return;
  const chips = $('order-filter'); chips.replaceChildren();
  ['all', 'men', 'women'].forEach(t => {
    const n = t === 'all' ? D.orders.length : D.orders.filter(o => o.type === t).length;
    const b = el('button', 'chip-filter', `${t === 'all' ? L().all : L()[t]} (${n})`); b.type = 'button';
    b.setAttribute('aria-pressed', String(oState.type === t));
    b.addEventListener('click', () => { oState.type = t; renderOrders(); });
    chips.appendChild(b);
  });
  const list = D.orders.filter(o => oState.type === 'all' || o.type === oState.type);
  grid.replaceChildren();
  list.forEach((o, i) => {
    const badge = () => el('span', 'order-type type-' + o.type, o.type === 'women' ? L().women : L().men);
    grid.appendChild(tile({ kind: 'order', photo: o.photo, placeholder: ICONS.people, title: tr(o, 'name'),
      badge: badge(), sample: o.sample, body: [el('p', '', tr(o, 'work'))],
      onOpen: () => openModal(list, i, x => profile({ photo: x.photo, placeholder: ICONS.people, title: tr(x, 'name'),
        sub: x.type === 'women' ? L().women : L().men, sample: x.sample, rows: [[L().work, tr(x, 'work')]] })) }));
  });
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
  $('order-count').textContent = L().count(list.length, L().orders);
  grid.querySelectorAll('.reveal').forEach(reveal);
}

/* ================= SEMINARY: step by step ================= */
(function(){
  const tabs = [...document.querySelectorAll('.steps [data-step]')]; if (!tabs.length) return;
  const panels = [...document.querySelectorAll('.step-panel')];
  let cur = 0;
  function go(i){
    cur = Math.max(0, Math.min(tabs.length - 1, i));
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === cur)); t.parentElement.classList.toggle('is-done', k < cur); });
    panels.forEach((p, k) => p.hidden = k !== cur);
    $('step-prev').disabled = cur === 0; $('step-next').disabled = cur === tabs.length - 1;
    document.querySelector('.steps').style.setProperty('--progress', cur / (tabs.length - 1));
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  $('step-prev').addEventListener('click', () => go(cur - 1));
  $('step-next').addEventListener('click', () => go(cur + 1));
  document.querySelector('.steps').addEventListener('keydown', e => {
    if (e.key === 'ArrowRight'){ go(cur + 1); tabs[cur].focus(); }
    if (e.key === 'ArrowLeft'){ go(cur - 1); tabs[cur].focus(); }
  });
  go(0);
})();

/* ================= BISHOP: timeline filter + progress line ================= */
(function(){
  const list = $('timeline-list'); if (!list) return;
  document.querySelectorAll('.tl-filter [data-kind]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.kind;
    document.querySelectorAll('.tl-filter [data-kind]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    list.querySelectorAll('li').forEach(li => li.classList.toggle('is-dim', k !== 'all' && li.dataset.kind !== k));
  }));
  // The line fills as you scroll through the timeline
  const onScroll = () => {
    const r = list.getBoundingClientRect(), vh = window.innerHeight;
    const p = Math.max(0, Math.min(1, (vh * .6 - r.top) / r.height));
    list.style.setProperty('--fill', p);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

function renderAll(){ renderHub(); renderPriests(); renderDeaneries(); renderOrders(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
