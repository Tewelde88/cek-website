/* ============================================================
   CALENDAR PAGE — "A year lived with Christ": the thirteen Ge'ez
   months as a wheel. This month is marked; choosing a month shows
   its Gregorian dates and its feasts and fasts, and "See this
   month" opens it in the month view below.
   Feasts come from js/calendar.js (window.LiturgicalCalendar).
   ============================================================ */
(function(){
'use strict';
const svg = document.getElementById('ci-wheel'), centre = document.getElementById('ci-centre');
const LC = window.LiturgicalCalendar, G = window.GeezCal;
if (!svg || !LC) return;
const ti = () => document.documentElement.lang === 'ti';
const N = () => LC.NAMES[ti() ? 'ti' : 'en'];
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const a in attrs) e.setAttribute(a, attrs[a]); return e; };
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const now = new Date();
const todayJ = LC.grToJdn(now.getFullYear(), now.getMonth() + 1, now.getDate());
const T = LC.jdnToEt(todayJ);
const Y = T.y;
const yd = LC.yearData(Y);
const days = m => m === 13 ? LC.monthDays(Y, 13) : 30;
const total = 360 + days(13);
const R0 = 62, R1 = 108;
const rad = d => (d - 90) * Math.PI / 180;
const pt = (r, d) => [(r * Math.cos(rad(d))).toFixed(2), (r * Math.sin(rad(d))).toFixed(2)];
const wedge = (a0, a1) => { const [x0, y0] = pt(R1, a0), [x1, y1] = pt(R1, a1), [x2, y2] = pt(R0, a1), [x3, y3] = pt(R0, a0);
  return `M${x0} ${y0}A${R1} ${R1} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${R0} ${R0} 0 0 0 ${x3} ${y3}Z`; };

// feasts and fasts of one month of this Ge'ez year
function monthInfo(m){
  const first = LC.etToJdn(Y, m, 1), last = first + days(m) - 1, out = { major: [], feast: [], fast: new Set() };
  for (let j = first; j <= last; j++){
    const d = yd.days[j]; if (!d) continue;
    d.feasts.forEach(f => { if (f.rank === 'major') out.major.push([j, f.key]); else if (f.rank === 'feast') out.feast.push([j, f.key]); });
    if (d.fast) out.fast.add(d.fast);
  }
  return { first, last, ...out };
}

/* ---------- draw the wheel ---------- */
const segs = [];
let a = 0;
for (let m = 1; m <= 13; m++){
  const span = 360 * days(m) / total, a0 = a + .8, a1 = a + span - .8, mid = a + span / 2; a += span;
  const info = monthInfo(m);
  const g = mk('g', { class: 'ci-seg' + (m === T.m ? ' is-now' : '') + (info.fast.size ? ' has-fast' : ''), tabindex: '0', role: 'button', 'aria-pressed': 'false' });
  g.appendChild(mk('path', { class: 'ci-base', d: wedge(a0, a1) }));
  // one small mark per major feast in the month, along the outer edge
  info.major.forEach(([j], k) => { const [x, y] = pt(R1 - 7, a0 + (a1 - a0) * (k + 1) / (info.major.length + 1)); g.appendChild(mk('circle', { class: 'ci-dot', cx: x, cy: y, r: 2.6 })); });
  const [tx, ty] = pt((R0 + R1) / 2 - 2, mid);
  const t = mk('text', { x: tx, y: ty, class: 'ci-name' + (m === 13 ? ' is-small' : ''), transform: `rotate(${mid > 90 && mid < 270 ? mid + 180 : mid} ${tx} ${ty})` });
  g.appendChild(t);
  svg.appendChild(g);
  segs.push({ g, t, m, info });
}
svg.appendChild(mk('circle', { class: 'ci-hub', r: R0 - 6 }));
// today: a small red marker on the rim at today's place in the year
const todayAngle = (() => { let s = 0; for (let m = 1; m < T.m; m++) s += days(m); return 360 * (s + T.d - .5) / total; })();
const [nx, ny] = pt(R1 + 7, todayAngle);
svg.appendChild(mk('circle', { class: 'ci-today', cx: nx, cy: ny, r: 4.2 }));

/* ---------- the centre: the chosen month ---------- */
let cur = T.m;
function grRange(info){
  const g1 = LC.jdnToGr(info.first), g2 = LC.jdnToGr(info.last), M = N().grShort;
  return `${g1.d} ${M[g1.m - 1]} – ${g2.d} ${M[g2.m - 1]} ${g2.y}`;
}
function show(m, focus){
  cur = m;
  const s = segs[m - 1];
  segs.forEach(x => { x.g.setAttribute('aria-pressed', x.m === m); x.g.classList.toggle('is-sel', x.m === m); });
  centre.replaceChildren();
  const name = el('b', 'ci-m', LC.NAMES.ti.months[m - 1]); name.lang = 'ti';
  centre.append(name);
  if (!ti()) centre.append(el('span', 'ci-en', LC.NAMES.en.months[m - 1]));
  centre.append(el('span', 'ci-gr', grRange(s.info)));
  const list = el('ul', 'ci-list');
  s.info.major.concat(s.info.feast).sort((x, y) => x[0] - y[0]).slice(0, 4).forEach(([j, k]) => {
    const li = el('li'); const d = el('i', '', G ? G.geez(LC.jdnToEt(j).d) : LC.jdnToEt(j).d); d.lang = 'ti';
    li.append(d, ' ' + N().feasts[k].split(' — ')[0]); list.appendChild(li);
  });
  s.info.fast.forEach(f => list.appendChild(el('li', 'is-fast', N().fasts[f])));
  if (list.children.length) centre.appendChild(list);
  const go = el('a', 'ci-go', ti() ? 'ዘሎናዮ ወርሒ ተመልከቱ ↓' : 'See this month ↓'); go.href = '#d=' + s.info.first;
  centre.appendChild(go);
  if (focus) s.g.focus();
}
function labels(){ segs.forEach(s => { s.t.textContent = s.m === 13 ? 'ጳ' : LC.NAMES.ti.months[s.m - 1];   // Pagume's slice is too narrow for the whole name
    s.g.setAttribute('aria-label', `${LC.NAMES.ti.months[s.m - 1]} · ${LC.NAMES.en.months[s.m - 1]}`); }); }
segs.forEach(s => {
  s.g.addEventListener('click', () => show(s.m));
  s.g.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); show(s.m); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); show(s.m % 13 + 1, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); show((s.m + 11) % 13 + 1, true); }
  });
});
document.addEventListener('langchange', () => { labels(); show(cur); });
labels(); show(cur);
})();
