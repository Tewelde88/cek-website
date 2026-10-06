/* ============================================================
   EPARCHY PAGE — "The shepherd of the Eparchy": the current
   bishop (Admin page → Eparchy → Bishops, the one marked
   "Current bishop") and his three tasks: teach, sanctify, guide.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('bf');
if (!box || typeof EPARCHY === 'undefined') return;
const B = (EPARCHY.bishops || []).find(b => b.current);
if (!B){ box.closest('section').hidden = true; return; }

const ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const G = () => window.GeezCal;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const initials = s => s.replace(/^(Most Rev\.|Rev\.|Abba|ብፁዕ|ኣቡነ|ኣባ)\s*/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('');

function render(){
  const arch = document.getElementById('bf-arch');
  arch.replaceChildren();
  if (B.photo) arch.style.backgroundImage = `url('${B.photo}')`;
  else { arch.classList.add('is-ph'); arch.appendChild(el('span', 'bf-ini', initials(B.name || ''))); }
  document.getElementById('bf-name').textContent = tr(B, 'name');

  // "Bishop of Keren since 2003 · 23 years" (+ the years in Ge'ez numerals)
  const since = document.getElementById('bf-since'); since.replaceChildren();
  const y = +(String(B.years || '').match(/\d{4}/) || [])[0];
  const order = tr(B, 'order') || tr(B, 'title');
  if (order) since.appendChild(el('span', '', order));
  if (y){
    const n = new Date().getFullYear() - y;
    since.appendChild(el('span', '', ti() ? `ካብ ${y} · ${n} ዓመታት` : `since ${y} · ${n} years`));
    if (G() && n > 0){ const g = el('b', '', G().geez(n)); g.lang = 'ti'; since.appendChild(g); }
  }

  // the motto: the Ge'ez words large, the translation beneath
  const fig = document.getElementById('bf-motto'); fig.replaceChildren();
  const ge = (B.motto_ti || '').match(/«([^»]+)»/), en = (B.motto || '').match(/[“"]([^”"]+)[”"]/);
  if (ge || en){
    const q = el('blockquote', '', ge ? ge[1] : en[1]); if (ge) q.lang = 'ti';
    fig.appendChild(q);
    const cap = el('figcaption');
    const refEn = (B.motto || '').replace(/^.*[”"]\s*/, '').replace(/[()]/g, '').trim();
    const refTi = (B.motto_ti || '').replace(/^.*»\s*/, '').replace(/[()]/g, '').trim();
    cap.textContent = ti() ? [refTi].filter(Boolean).join(' ') : [en && `“${en[1]}”`, refEn].filter(Boolean).join(' — ');
    fig.appendChild(cap);
    if (B.motto_sample) cap.appendChild(el('span', 'sample-tag', ti() ? 'ኣብነት' : 'Example'));
  }
}

/* ---------- the three tasks ---------- */
const tabs = [...box.querySelectorAll('[role="tab"]')];
const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
let cur = 0;
function select(i, focus){
  i = (i + tabs.length) % tabs.length; cur = i;
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
  panels.forEach((p, k) => { p.hidden = k !== i; p.classList.toggle('is-new', k === i); });
  box.style.setProperty('--task', i);
  if (focus) tabs[i].focus();
}
tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
box.querySelector('[role="tablist"]').addEventListener('keydown', e => {
  const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (k){ e.preventDefault(); select(cur + k, true); }
  else if (e.key === 'Home'){ e.preventDefault(); select(0, true); }
  else if (e.key === 'End'){ e.preventDefault(); select(tabs.length - 1, true); }
});

document.addEventListener('langchange', render);
render();
})();
