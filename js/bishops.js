/* ============================================================
   BISHOPS PAGE (bishop.html): current bishop, his years and life
   in brief, late bishops, and a side page with each biography.
   Data: data/eparchy.json → bishops (Admin page → Eparchy → Bishops).
   ============================================================ */
(function(){
'use strict';
const D = Object.assign({ bishops: [] }, (typeof EPARCHY !== 'undefined' && EPARCHY) || {});
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const L = () => isTi() ? {
  shepherd: 'ጓሳና', read: 'ታሪኽ ህይወት ኣንብቡ', years: 'ዓመት ብዓመት', late: 'ዝዓረፉ ጳጳስ', sample: 'ኣብነት',
  soon: 'ታሪኽ ህይወቶም ቀልጢፉ ክውሰኽ እዩ።', motto: 'ጭርሖ', life: 'ታሪኽ ህይወት'
} : {
  shepherd: 'Our Shepherd', read: 'Read his biography', years: 'Year by year', late: 'Late bishop', sample: 'Example',
  soon: 'His life story will be added here soon.', motto: 'Motto', life: 'Life story'
};
const MITRE = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 28V15c0-4.5 3.2-8.6 5.5-11c2.3 2.4 5.5 6.5 5.5 11v13z"/><path d="M7 21h11M12.5 4v8"/><path d="M25 29V11"/><path d="M25 11a3.6 3.6 0 1 1 3.6-3.6c0 1.6-1.1 2.6-2.3 2.6"/></svg>';
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

const all = D.bishops.map((b, i) => ({ ...b, idx: i }));
const current = all.find(b => b.current) || all[0];
const late = all.filter(b => b !== current);

function portrait(b, cls){
  const p = el('span', 'bi-arch' + (cls ? ' ' + cls : '') + (b.photo ? '' : ' ph ph-purple'));
  if (b.photo) p.style.backgroundImage = `url("${b.photo}")`; else p.innerHTML = MITRE;
  return p;
}
function facts(b){
  const dl = el('dl', 'facts');
  (b.facts || []).filter(f => tr(f, 'value')).forEach(f => {
    const d = el('div'); d.append(el('dt', '', tr(f, 'label')), el('dd', '', tr(f, 'value'))); dl.appendChild(d);
  });
  return dl;
}
// biography text: "## " starts a heading, an empty line starts a new paragraph
function bioNodes(text){
  return String(text || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)
    .map(s => s.startsWith('## ') ? el('h3', '', s.slice(3)) : el('p', '', s));
}
const firstPara = b => (String(tr(b, 'bio')).split(/\n\s*\n/).map(s => s.trim()).find(s => s && !s.startsWith('## ')) || tr(b, 'summary'));

/* ---- Row 1: current bishop ---- */
function renderNow(){
  const box = document.getElementById('bi-now'); if (!box || !current) return;
  box.replaceChildren();
  const ph = el('button', 'bi-now-photo'); ph.type = 'button'; ph.dataset.bio = current.idx;
  ph.setAttribute('aria-label', L().read); ph.appendChild(portrait(current));
  const tx = el('div', 'bi-now-text');
  tx.appendChild(el('p', 'eyebrow eyebrow-red', L().shepherd));
  const h = el('h2', '', tr(current, 'name')); h.id = 'bi-now-name'; tx.appendChild(h);
  tx.appendChild(el('p', 'bishop-title', [tr(current, 'order') || tr(current, 'title'), current.years ? (isTi() ? 'ካብ ' : 'since ') + current.years.replace(/\s*–\s*$/, '') : ''].filter(Boolean).join(' · ')));
  if (tr(current, 'motto')){ const m = el('p', 'bi-motto'); m.append(el('span', '', L().motto + ': '), el('em', '', tr(current, 'motto'))); if (current.motto_sample) m.append(' ', el('span', 'sample-tag', L().sample)); tx.appendChild(m); }
  tx.appendChild(el('p', 'bi-sum', tr(current, 'summary')));
  tx.appendChild(facts(current));
  const btns = el('div', 'ep-spot-btns');
  const a = el('button', 'btn btn-red', L().read); a.type = 'button'; a.dataset.bio = current.idx;
  const y = el('a', 'r-btn', L().years); y.href = '#timeline';
  btns.append(a, y); tx.appendChild(btns);
  box.append(ph, tx);
}

/* ---- Row 2: timeline (left) + life in brief (right) ---- */
let kind = 'all';
function tlItems(b){
  return (b.timeline || []).map(t => {
    const li = el('li', t.key ? 'tl-key' : ''); li.dataset.kind = t.kind || 'ministry';
    li.appendChild(el('span', 'tl-year', t.years));
    const c = el('div', 'tl-card'); c.appendChild(el('p', '', tr(t, 'text'))); li.appendChild(c);
    return li;
  });
}
function renderYears(){
  const ol = document.getElementById('bi-tl'); if (!ol || !current) return;
  ol.replaceChildren(...tlItems(current));
  ol.querySelectorAll('li').forEach(li => li.classList.toggle('is-dim', kind !== 'all' && li.dataset.kind !== kind));
  const br = document.getElementById('bi-brief');
  br.replaceChildren(el('p', 'bi-brief-lead', firstPara(current)));
  const keys = (current.timeline || []).filter(t => t.key);
  if (keys.length){ const ul = el('ul', 'bi-keys'); keys.forEach(k => { const li = el('li'); li.append(el('b', '', k.years), el('span', '', tr(k, 'text'))); ul.appendChild(li); }); br.appendChild(ul); }
  const bb = document.getElementById('bi-brief-btn'); bb.dataset.bio = current.idx; bb.textContent = L().read;
}
document.querySelectorAll('.tl-filter [data-kind]').forEach(b => b.addEventListener('click', () => {
  kind = b.dataset.kind;
  document.querySelectorAll('.tl-filter [data-kind]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  renderYears();
}));

/* ---- Row 3: late bishops ---- */
function renderLate(){
  const ol = document.getElementById('bi-late'); if (!ol) return;
  const sec = document.getElementById('late'); if (sec) sec.hidden = !late.length;
  ol.replaceChildren(...late.map(b => {
    const li = el('li');
    const btn = el('button', 'bi-card'); btn.type = 'button'; btn.dataset.bio = b.idx;
    btn.appendChild(portrait(b, 'sepia'));
    if (tr(b, 'order')) btn.appendChild(el('span', 'bi-order', tr(b, 'order')));
    btn.appendChild(el('strong', '', tr(b, 'name')));
    if (b.years) btn.appendChild(el('span', 'bi-yrs', b.years));
    if (b.sample) btn.appendChild(el('span', 'sample-tag', L().sample));
    li.appendChild(btn);
    return li;
  }));
}

/* ---- Side page with a bishop's biography ---- */
const sheet = document.getElementById('bi-sheet');
function openBio(i){
  const b = all[i]; if (!b || !sheet) return;
  const body = document.getElementById('bi-sheet-body'); body.replaceChildren();
  const head = el('header', 'bi-sheet-head');
  head.appendChild(portrait(b, b.current ? '' : 'sepia'));
  const t = el('div');
  t.appendChild(el('p', 'eyebrow eyebrow-red', b.current ? L().shepherd : L().late));
  const h = el('h2', '', tr(b, 'name')); h.id = 'bi-sheet-name'; t.appendChild(h);
  t.appendChild(el('p', 'bishop-title', [tr(b, 'order') || tr(b, 'title'), b.years].filter(Boolean).join(' · ')));
  head.appendChild(t); body.appendChild(head);
  if (tr(b, 'motto')){ const m = el('p', 'bi-motto'); m.append(el('span', '', L().motto + ': '), el('em', '', tr(b, 'motto'))); body.appendChild(m); }
  const f = facts(b); if (f.children.length) body.appendChild(f);
  if (tr(b, 'summary')) body.appendChild(el('p', 'bio-lead', tr(b, 'summary')));
  const nodes = bioNodes(tr(b, 'bio'));
  if (nodes.length) body.append(...nodes); else body.appendChild(el('p', 'muted', L().soon));
  if (!b.current && (b.timeline || []).length){
    body.appendChild(el('h3', '', L().years));
    const ol = el('ol', 'timeline bi-tl'); ol.append(...tlItems(b)); body.appendChild(ol);
  }
  sheet.showModal(); sheet.scrollTop = 0;
  sheet.querySelector('.bi-x').focus();
}
document.addEventListener('click', e => { const t = e.target.closest('[data-bio]'); if (t) openBio(Number(t.dataset.bio)); });
if (sheet){
  sheet.querySelector('.bi-x').onclick = () => sheet.close();
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  sheet.querySelector('.bi-print').onclick = () => { document.body.classList.add('print-bio'); window.print(); document.body.classList.remove('print-bio'); };
}

function renderAll(){ renderNow(); renderYears(); renderLate(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();

/* ---- Eparchy tabs: on phones, scroll the active tab into view ---- */
(function(){ const a = document.querySelector('.ep-tabs a.active'); if (a){ const ul = a.closest('ul'); ul.scrollLeft = a.parentElement.offsetLeft - 16; } })();
