/* ============================================================
   HOME PAGE — CESK invitation: the mesob of service.
   Six woven parts, one for each area of CESK (from the list in
   index.html). Choosing a part turns the basket so that part
   faces the text, and shows its description and link.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('ckc');
if (!box) return;
box.classList.add('js');

const svg = document.getElementById('ckc-svg');
const area = document.getElementById('ckc-area');
const centre = document.getElementById('ckc-centre');
const lis = [...document.querySelectorAll('#ckc-list li')];
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const phone = window.matchMedia('(max-width:760px)');
const NS = 'http://www.w3.org/2000/svg';
const ICONS = [
  '<path d="M5 12h22v14H5z"/><path d="M3 7h26v5H3z"/><path d="M16 7v19"/>',
  '<path d="M16 27s-10-6-10-13a5.5 5.5 0 0 1 10-3a5.5 5.5 0 0 1 10 3c0 7-10 13-10 13z"/><path d="M9 16h4l2-4 3 7 2-3h3"/>',
  '<path d="M3 12l13-6 13 6-13 6z"/><path d="M8 15v7c0 2 3.6 4 8 4s8-2 8-4v-7"/>',
  '<path d="M16 4c5 6 8 10 8 14a8 8 0 0 1-16 0c0-4 3-8 8-14z"/><path d="M12.5 19a3.5 3.5 0 0 0 3.5 3.5"/>',
  '<circle cx="11" cy="9" r="4"/><circle cx="22" cy="11" r="3"/><path d="M3 27c0-4.4 3.6-8 8-8s8 3.6 8 8M18 19.5c1-.4 2.5-.6 4-.5c3.5.3 6 3 6 6.5"/>',
  '<circle cx="13" cy="6" r="3"/><path d="M13 10v8l-4 8M13 18l4 8M13 13l6 3"/><path d="M22 15v13"/>'
];
const R0 = 56, R1 = 98, GAP = 1.6;               // inner and outer radius of the woven ring; gap in degrees
const rad = d => d * Math.PI / 180;
const pt = (r, d) => [(r * Math.cos(rad(d))).toFixed(2), (r * Math.sin(rad(d))).toFixed(2)];
const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const a in attrs) e.setAttribute(a, attrs[a]); return e; };
function wedge(a0, a1){
  const [x0, y0] = pt(R1, a0), [x1, y1] = pt(R1, a1), [x2, y2] = pt(R0, a1), [x3, y3] = pt(R0, a0);
  return `M${x0} ${y0}A${R1} ${R1} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${R0} ${R0} 0 0 0 ${x3} ${y3}Z`;
}
function arc(r, a0, a1){ const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`; }

/* ---------- draw the basket ---------- */
svg.appendChild(el('circle', { class: 'ckc-rim', r: 104 }));
svg.appendChild(el('circle', { class: 'ckc-rim2', r: 108 }));
const ring = el('g', { class: 'ckc-ring' });
svg.appendChild(ring);
const step = 360 / lis.length;
const segs = lis.map((li, i) => {
  const a0 = -90 + i * step + GAP / 2, a1 = -90 + (i + 1) * step - GAP / 2, mid = (a0 + a1) / 2;
  const g = el('g', { class: 'ckc-seg', tabindex: '0', role: 'button', 'aria-pressed': 'false' });
  g.style.animationDelay = (i * 90) + 'ms';
  g.appendChild(el('path', { class: 'base', d: wedge(a0, a1), fill: li.dataset.c }));
  [66, 77, 88].forEach(r => g.appendChild(el('path', { class: 'weave', d: arc(r, a0 + 3, a1 - 3) })));
  const [x, y] = pt(77, mid);
  const at = el('g', { transform: `translate(${(x - 9.6).toFixed(2)} ${(y - 9.6).toFixed(2)}) scale(.6)` });
  const ic = el('g', { class: 'ic' }); ic.innerHTML = ICONS[i] || ''; at.appendChild(ic); g.appendChild(at);
  ring.appendChild(g);
  return { g, li, mid, ic, base: g.querySelector('.base') };
});
ring.after(el('circle', { class: 'ckc-mid', r: 50 }));
svg.appendChild(el('circle', { class: 'ckc-mid2', r: 44 }));

/* ---------- choosing a part: turn the basket so it faces the text ---------- */
let cur = -1, turn = 0;
const label = s => s.li.querySelector('b').textContent;
function choose(i, focus){
  i = (i + segs.length) % segs.length;
  const s = segs[i];
  const face = phone.matches ? 90 : 180;                       // towards the text: left on wide screens, down on phones
  let want = face - s.mid, d = ((want - turn) % 360 + 540) % 360 - 180;   // shortest way round
  turn += d;
  ring.style.transform = `rotate(${turn}deg)`;
  segs.forEach((t, k) => {
    t.g.classList.toggle('is-sel', k === i); t.g.setAttribute('aria-pressed', k === i);
    t.ic.style.transform = `rotate(${-turn}deg)`;
    const [dx, dy] = pt(k === i ? 6 : 0, t.mid);
    t.base.style.transform = k === i ? `translate(${dx}px,${dy}px)` : '';
  });
  box.classList.add('has-sel');
  box.style.setProperty('--c', s.li.dataset.c);
  centre.querySelector('b').textContent = label(s);
  const h = document.createElement('h3'); h.textContent = label(s);
  const p = document.createElement('p'); p.textContent = s.li.querySelector('span').textContent;
  const a = document.createElement('a'); a.className = 'more'; a.href = s.li.dataset.href;
  a.textContent = document.documentElement.lang === 'ti' ? 'ተወሳኺ ኣንብቡ' : 'Read more';
  area.replaceChildren(h, p, a);
  area.classList.remove('is-new'); void area.offsetWidth; area.classList.add('is-new');
  cur = i;
  if (focus) s.g.focus();
}
segs.forEach((s, i) => {
  s.g.setAttribute('aria-label', label(s));
  s.g.addEventListener('click', () => choose(i));
  s.g.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); choose(i); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); choose(i + 1, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); choose(i - 1, true); }
  });
});

/* ---------- the one motion: the basket weaves itself in when it comes into view ---------- */
if ('IntersectionObserver' in window && !still.matches){
  box.classList.add('is-wait');
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    io.disconnect(); box.classList.remove('is-wait'); box.classList.add('is-woven');
  }, { threshold: .35 });
  io.observe(box);
}

// language switch: the list text changes, so refresh the labels and the open description
document.addEventListener('langchange', () => {
  segs.forEach(s => s.g.setAttribute('aria-label', label(s)));
  if (cur >= 0) choose(cur); else centre.querySelector('b').textContent = 'CESK';
});
})();
