/* ============================================================
   EPARCHY PAGE — "Meet them more closely": two arched double
   doors. Behind the first, the current bishop; behind the second,
   a mosaic of the priests (Admin page → Eparchy). On phones the
   doors open by themselves when they come into view.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('dr');
if (!box || typeof EPARCHY === 'undefined') return;
const ti = () => document.documentElement.lang === 'ti';
const G = () => window.GeezCal;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
// initials from the real words of a name (titles and dashes are skipped)
const initials = s => String(s || '').replace(/^(Most Rev\.|Rev\.|Fr\.|Abba|ብፁዕ|ኣቡነ|ኣባ)\s*/g, '').split(/\s+/).filter(w => /^\p{L}/u.test(w) && !/^(of|the|and)$/i.test(w)).slice(0, 2).map(w => w[0]).join('');
const B = (EPARCHY.bishops || []).find(b => b.current) || {};
const P = (EPARCHY.priests || []).filter(p => p && p.name);
const num = (n, en, tiw) => { const s = el('span'); s.append(el('b', '', String(n))); if (G() && n > 0){ const g = el('i', '', G().geez(n)); g.lang = 'ti'; s.appendChild(g); } s.append(' ' + (ti() ? tiw : en)); return s; };

function render(){
  // behind door 1: the bishop
  const b = document.getElementById('dr-bishop'); b.replaceChildren();
  if (B.photo) b.style.backgroundImage = `url('${B.photo}')`;
  else b.appendChild(el('span', 'dr-ini', initials(B.name)));
  const bn = document.getElementById('dr-bn'); bn.replaceChildren();
  const t = (B.timeline || []).length;
  if (t) bn.appendChild(num(t, 'milestones in his life', 'ፍጻመታት ህይወት'));
  // behind door 2: the priests, as a small mosaic (photos or initials)
  const m = document.getElementById('dr-priests'); m.replaceChildren();
  const tiles = P.slice(0, 9);
  for (let i = 0; i < 9; i++){
    const p = tiles[i % Math.max(tiles.length, 1)];
    const c = el('span', 'dr-tile');
    if (p && p.photo) c.style.backgroundImage = `url('${p.photo}')`;
    else c.textContent = p ? initials(p.name) : '';
    m.appendChild(c);
  }
  const pn = document.getElementById('dr-pn'); pn.replaceChildren();
  if (P.length) pn.appendChild(num(P.length, P.length === 1 ? 'priest listed' : 'priests listed', 'ካህናት ተመዝጊቦም'));
}

// touch screens cannot point: the doors open once they are well in view
if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-open'); io.unobserve(e.target); } }), { threshold: .6 });
  box.querySelectorAll('.dr-door').forEach(d => io.observe(d));
}
document.addEventListener('langchange', render);
render();
})();
