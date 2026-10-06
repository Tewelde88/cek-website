/* ============================================================
   HOME PAGE — Questions (FAQ) as margin notes.
   The questions come from data/faq.json (Admin page → FAQ).
   Topic buttons and the search box narrow the list; one answer
   is open at a time.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('fq');
if (!box) return;
const all = (typeof FAQ !== 'undefined' && Array.isArray(FAQ)) ? FAQ.filter(f => f && f.q) : [];
if (!all.length){ box.hidden = true; box.closest('.fn-row').classList.add('is-single'); return; }

const ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const list = document.getElementById('fq-list'), q = document.getElementById('fq-q');
let topic = '';
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

// put the words found by the search in <mark>
function marked(text, words){
  const span = el('span');
  if (!words.length){ span.textContent = text; return span; }
  const re = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  text.split(re).forEach((part, i) => span.appendChild(i % 2 ? el('mark', '', part) : document.createTextNode(part)));
  return span;
}

function render(){
  const words = q.value.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const shown = all.filter(f => (!topic || f.topic === topic) &&
    words.every(w => [f.q, f.q_ti, f.a, f.a_ti].join(' ').toLowerCase().includes(w)));
  list.replaceChildren();
  shown.forEach(f => {
    const d = el('details', 'fq-item'); d.name = 'fq';
    const s = el('summary'); s.appendChild(marked(tr(f, 'q'), words)); s.insertAdjacentHTML('beforeend', CHEV);
    const a = el('div', 'fq-a'), p = el('p'); p.appendChild(marked(tr(f, 'a'), words)); a.appendChild(p);
    if (f.link){ const m = el('a', 'more', ti() ? 'ተወሳኺ ኣንብቡ' : 'Read more'); m.href = f.link; a.appendChild(m); }
    if (f.sample) a.appendChild(el('span', 'sample-tag', ti() ? 'ኣብነት' : 'Example'));
    d.append(s, a); list.appendChild(d);
  });
  if (!shown.length) list.appendChild(el('p', 'fq-none', ti() ? 'ዝተረኽበ ሕቶ የለን። ብታሕቲ ጽሓፉልና።' : 'No question found. Write to us below.'));
  if (words.length && shown.length === 1) list.querySelector('details').open = true;
}

box.querySelectorAll('.fq-topics button').forEach(b => b.addEventListener('click', () => {
  topic = b.dataset.t;
  box.querySelectorAll('.fq-topics button').forEach(x => x.setAttribute('aria-pressed', x === b));
  render();
}));
let t = null;
q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 150); });
document.addEventListener('langchange', render);
render();
})();
