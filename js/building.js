/* ============================================================
   ST. MICHAEL'S BUILDING PROJECT — home page block (#bp-home)
   and project page (building.html). Data: data/building.json
   (edit it on the Admin page → "Building project").
   The church drawing fills from the ground up to the percentage.
   ============================================================ */
(function(){
'use strict';
const B = (typeof BUILDING !== 'undefined' && BUILDING) ? BUILDING : null;
if (!B) return;
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const G = () => window.GeezCal;
const L = () => isTi() ? {
  complete: 'ተዛዚሙ', stages: 'ደረጃታት ስራሕ', done: 'ተዛዚሙ', current: 'ኣብ ስራሕ', planned: 'ዝመጽእ',
  updated: 'ናይ መወዳእታ ምሕዳስ', place: 'ቦታ', stagesDone: (a, b) => `${a} ካብ ${b} ደረጃታት ተዛዚሞም`,
  see: 'ፕሮጀክት ርኣዩ', support: 'ፕሮጀክት ደግፉ', example: 'ኣብነት', noPhotos: 'ስእልታት ህንጻ ኣብዚ ክርኣዩ እዮም።'
} : {
  complete: 'complete', stages: 'Building stages', done: 'Done', current: 'Under way', planned: 'Next',
  updated: 'Last updated', place: 'Place', stagesDone: (a, b) => `${a} of ${b} stages done`,
  see: 'See the project', support: 'Support the project', example: 'Example', noPhotos: 'Photos of the construction will appear here.'
};
const pct = Math.max(0, Math.min(100, Number(B.percent) || 0));
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function dateText(s){
  if (!s) return '';
  const [y, m, d] = s.split('-').map(Number);
  let out = `${d} ${MONTHS[m - 1]} ${y}`;
  if (G()){ const e = G().jdnToEt(G().grToJdn(y, m, d)); out = `${G().geez(e.d)} ${G().MONTHS_TI[e.m - 1]} ${G().geez(e.y)} · ` + out; }
  return out;
}

/* ---------- The church drawing ---------- */
let uid = 0;
function church(){
  const id = 'ch' + (++uid);
  const shapes = `
    <path d="M30 50Q47 18 64 50Z"/><rect x="30" y="49" width="34" height="116"/>
    <path d="M58 84L120 36L182 84Z"/><rect x="64" y="80" width="112" height="85"/>
    <path d="M176 100L218 112V165H176Z"/>`;
  const wrap = el('div', 'church');
  wrap.innerHTML = `
  <svg viewBox="0 0 240 172" role="img" aria-label="${pct}%">
    <defs>
      <clipPath id="${id}">${shapes}</clipPath>
      <pattern id="${id}c" width="12" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 7.5H12M6 0V3.75M0 3.75H12M0 0V3.75" stroke="rgba(31,27,24,.18)" stroke-width=".7" fill="none"/>
      </pattern>
    </defs>
    <g clip-path="url(#${id})">
      <rect width="240" height="172" class="ch-empty"/>
      <g class="ch-rise" style="--p:${pct / 100}">
        <rect y="20" width="240" height="145" class="ch-fill"/>
        <rect y="20" width="240" height="145" fill="url(#${id}c)"/>
      </g>
    </g>
    <g class="ch-line">${shapes}</g>
    <g class="ch-detail">
      <path d="M108 165V134a12 12 0 0 1 24 0V165"/>
      <circle cx="120" cy="104" r="11"/><circle cx="120" cy="104" r="4"/>
      <path d="M41 96v-9a6 6 0 0 1 12 0v9zM41 132v-9a6 6 0 0 1 12 0v9z"/>
      <path d="M86 140v-12a6 6 0 0 1 12 0v12zM142 140v-12a6 6 0 0 1 12 0v12zM190 145v-11a5 5 0 0 1 10 0v11z"/>
      <circle cx="47" cy="22" r="2.4"/>
    </g>
    <path d="M8 165.5H232" class="ch-ground"/>
  </svg>`;
  return wrap;
}
// Fill rises once, when the drawing comes into view
function rise(node){
  const g = node.querySelector('.ch-rise');
  const go = () => node.classList.add('is-up');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){ go(); return; }
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)){ go(); io.disconnect(); } }, { threshold: .4 });
  io.observe(node);
}
function stageList(cls){
  const ul = el('ol', cls);
  (B.stages || []).forEach(s => {
    const li = el('li', 'st-' + (s.status || 'planned'));
    li.appendChild(el('span', 'st-dot'));
    const t = el('span', 'st-text');
    t.appendChild(el('strong', '', tr(s, 'title')));
    t.appendChild(el('small', '', [L()[s.status] || L().planned, s.date ? dateText(s.date) : ''].filter(Boolean).join(' · ')));
    li.appendChild(t);
    ul.appendChild(li);
  });
  return ul;
}
const doneCount = () => (B.stages || []).filter(s => s.status === 'done').length;

/* ---------- Home page block ---------- */
function renderHome(){
  const box = document.getElementById('bp-home'); if (!box) return;
  box.replaceChildren();
  const ch = church(); box.appendChild(ch);
  const tx = el('div', 'bp-text');
  const big = el('p', 'bp-pct');
  big.appendChild(el('span', 'bp-num', pct + '%'));
  if (G()){ const ge = el('span', 'bp-ge', G().geez(pct) + '%'); ge.lang = 'ti'; big.appendChild(ge); }
  big.appendChild(el('span', 'bp-label', L().complete));
  tx.appendChild(big);
  const h = el('h2', '', (isTi() ? 'ህንጻ ' : '') + tr(B, 'name') + (isTi() ? '' : ' is rising'));
  tx.appendChild(h);
  tx.appendChild(el('p', 'bp-sum', tr(B, 'summary')));
  tx.appendChild(stageList('bp-stages'));
  const btns = el('div', 'bp-btns');
  const a1 = el('a', 'btn btn-red', L().see); a1.href = 'building.html';
  const a2 = el('a', 'r-btn', L().support); a2.href = 'building.html#help';
  btns.append(a1, a2); tx.appendChild(btns);
  box.appendChild(tx);
  rise(ch);
}

/* ---------- Project page ---------- */
function renderPage(){
  const ov = document.getElementById('bp-overview'); if (!ov) return;
  ov.replaceChildren();
  const ch = church(); ch.classList.add('church-lg'); ov.appendChild(ch);
  const st = el('dl', 'bp-facts');
  const add = (k, v, cls) => { if (!v) return; const d = el('div', cls || ''); d.appendChild(el('dt', '', k)); d.appendChild(el('dd', '', v)); st.appendChild(d); };
  add(L().complete.charAt(0).toUpperCase() + L().complete.slice(1), pct + '%', 'bp-fact-big');
  add(L().stages, L().stagesDone(doneCount(), (B.stages || []).length));
  add(L().updated, dateText(B.updated));
  add(L().place, tr(B, 'place'));
  ov.appendChild(st);
  rise(ch);

  const sb = document.getElementById('bp-stage-list'); sb.replaceChildren(stageList('bp-stages bp-stages-lg'));
  const ex = document.getElementById('bp-example'); if (ex) ex.hidden = !B.stages_are_examples;

  const ab = document.getElementById('bp-about'); ab.replaceChildren();
  String(tr(B, 'about') || '').split(/\n\s*\n/).filter(Boolean).forEach(p => ab.appendChild(el('p', '', p.trim())));

  const gal = document.getElementById('bp-photos'); gal.replaceChildren();
  const photos = B.photos || [];
  if (!photos.length) gal.appendChild(el('p', 'muted', L().noPhotos));
  photos.forEach(ph => {
    const f = el('figure', 'bp-photo');
    const a = el('a'); a.href = ph.src; a.target = '_blank'; a.rel = 'noopener';
    const img = el('img'); img.src = ph.src; img.alt = tr(ph, 'caption') || ''; img.loading = 'lazy';
    a.appendChild(img); f.appendChild(a);
    if (tr(ph, 'caption')) f.appendChild(el('figcaption', '', tr(ph, 'caption')));
    gal.appendChild(f);
  });
}

function renderAll(){ renderHome(); renderPage(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
