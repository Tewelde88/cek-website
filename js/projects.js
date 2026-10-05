/* ============================================================
   PROJECTS PAGE (projects.html)
   St. Michael's comes first, from data/building.json (Admin →
   "Building project"); other projects from data/projects.json
   (Admin → "Projects").
   ============================================================ */
(function(){
'use strict';
const grid = document.getElementById('pj-grid'); if (!grid) return;
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const L = () => isTi() ? {
  complete: 'ተዛዚሙ', see: 'ዝርዝር ርኣዩ', status: { planned: 'ኣብ መደብ', current: 'ኣብ ስራሕ', done: 'ተዛዚሙ' }
} : {
  complete: 'complete', see: 'See the project', status: { planned: 'Planned', current: 'Under way', done: 'Completed' }
};
const BUILD_ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 28V14l11-8 11 8v14"/><path d="M2 28h28"/><path d="M12.5 28v-8h7v8"/><path d="M9 17h14"/></svg>';
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

function list(){
  const out = [];
  const B = (typeof BUILDING !== 'undefined' && BUILDING && BUILDING.name) ? BUILDING : null;
  if (B){
    const ph = (B.photos || [])[0];
    out.push({ title: B.name + ' building project', title_ti: B.name_ti ? 'ፕሮጀክት ህንጻ ' + B.name_ti : '', place: B.place, place_ti: B.place_ti,
      summary: B.summary, summary_ti: B.summary_ti, percent: B.percent, link: 'building.html',
      image: ph ? ph.src : '', status: Number(B.percent) >= 100 ? 'done' : 'current' });
  }
  return out.concat((typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : []);
}

function render(){
  grid.replaceChildren();
  list().forEach(p => {
    const card = el('article', 'pj');
    const img = el('div', 'pj-img');
    if (p.image) img.style.backgroundImage = `url("${p.image}")`; else img.innerHTML = BUILD_ICON;
    card.appendChild(img);
    const b = el('div', 'pj-body');
    const st = p.status || 'current';
    b.appendChild(el('span', 'pj-status st-' + st, L().status[st] || L().status.current));
    b.appendChild(el('h3', '', tr(p, 'title')));
    if (tr(p, 'place')) b.appendChild(el('p', 'pj-place', tr(p, 'place')));
    if (tr(p, 'summary')) b.appendChild(el('p', '', tr(p, 'summary')));
    if (p.percent !== undefined && p.percent !== '' && p.percent !== null){
      const pct = Math.max(0, Math.min(100, Number(p.percent) || 0));
      const bar = el('div', 'pj-bar'); bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuenow', pct); bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', 100);
      bar.setAttribute('aria-label', tr(p, 'title'));
      const fill = el('span'); fill.style.width = pct + '%'; bar.appendChild(fill);
      b.appendChild(bar);
      const row = el('p', 'pj-pct'); const n = el('b', '', pct + '%');
      row.append(n, el('span', '', L().complete)); b.appendChild(row);
    }
    if (p.link){ const a = el('a', 'more', L().see); a.href = p.link; b.appendChild(a); }
    card.appendChild(b);
    grid.appendChild(card);
  });
}
document.addEventListener('langchange', render);
render();
})();
