/* ============================================================
   EPARCHY PAGE — "How the Eparchy is organised".
   Five levels of service; choosing a role shows what it does,
   how many there are (from the Admin page lists) and its page.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('og');
if (!box) return;
const ti = () => document.documentElement.lang === 'ti';
const E = (typeof EPARCHY !== 'undefined' && EPARCHY) || {};
const P = (typeof PARISHES_DATA !== 'undefined' && PARISHES_DATA) || {};
const len = (o, k) => Array.isArray(o[k]) ? o[k].length : 0;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const G = () => window.GeezCal;
const narrow = window.matchMedia('(max-width:900px)');

// the live number shown with each role (none where the site has no list yet)
const COUNT = {
  bishop:      () => [1, ti() ? 'ጳጳስ ከረን' : 'Bishop of Keren'],
  cesk:        () => [6, ti() ? 'መገድታት ኣገልግሎት' : 'areas of service'],
  archpriests: () => [len(E, 'deaneries') || 3, ti() ? 'መካናት' : 'deaneries'],
  priests:     () => [len(E, 'priests'), ti() ? 'ካህናት ኣብዚ መርበብ' : 'priests listed', len(P, 'parishes'), ti() ? 'ቍምስናታት' : 'parishes'],
  religious:   () => [len(E, 'orders'), ti() ? 'ማሕበራት ሃይማኖት' : 'religious communities'],
  seminarians: () => [2, ti() ? 'ሰሚናርዮታት' : 'seminaries'],
  laity:       () => [len(P, 'communities'), ti() ? 'ንኣሽቱ ማሕበረሰባት' : 'small communities listed']
};
const nodes = [...box.querySelectorAll('.og-node')];
let cur = nodes.find(n => n.getAttribute('aria-pressed') === 'true') || nodes[0];

function show(n){
  cur = n;
  nodes.forEach(x => x.setAttribute('aria-pressed', x === n));
  const card = document.getElementById('og-card'); card.replaceChildren();
  // on phones the details open right under the chosen role; on wide screens they stay beside the levels
  if (narrow.matches) n.closest('.og-tier').appendChild(card); else if (card.parentElement !== box) box.appendChild(card);
  card.appendChild(n.querySelector('svg').cloneNode(true));
  card.appendChild(el('h3', '', n.querySelector('b').textContent));
  card.appendChild(el('p', 'og-l', n.querySelector('.og-long').textContent));
  const c = COUNT[n.dataset.k];
  if (c){
    const v = c(), nums = el('div', 'og-nums');
    for (let i = 0; i < v.length; i += 2){
      if (!v[i]) continue;
      const d = el('div'); d.append(el('b', '', String(v[i])));
      if (G()){ const g = el('i', '', G().geez(v[i])); g.lang = 'ti'; d.appendChild(g); }
      d.appendChild(el('span', '', v[i + 1])); nums.appendChild(d);
    }
    if (nums.children.length) card.appendChild(nums);
  }
  const a = el('a', 'more', ti() ? 'ተወሳኺ ኣንብቡ' : 'Read more'); a.href = n.dataset.link; card.appendChild(a);
  card.classList.remove('is-new'); void card.offsetWidth; card.classList.add('is-new');
}
nodes.forEach(n => n.addEventListener('click', () => show(n)));
// arrow keys move between the roles, in reading order
box.addEventListener('keydown', e => {
  const i = nodes.indexOf(document.activeElement); if (i < 0) return;
  const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
  e.preventDefault(); const n = nodes[(i + k + nodes.length) % nodes.length]; n.focus(); show(n);
});
document.addEventListener('langchange', () => show(cur));
narrow.addEventListener('change', () => show(cur));
show(cur);
})();
