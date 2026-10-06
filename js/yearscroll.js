/* ============================================================
   HOME PAGE — the liturgical year as a scroll.
   About thirteen months, from the start of last month: every
   feast is a marker (red = major), every fast a striped band,
   and a line marks today. Feasts, fasts and their names come
   from js/calendar.js (window.LiturgicalCalendar), so this
   always agrees with the full calendar on the Liturgy page.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('ycal');
const LC = window.LiturgicalCalendar, G = window.GeezCal;
if (!box || !LC || !LC.NAMES) return;

const ti = () => document.documentElement.lang === 'ti';
const N = () => LC.NAMES[ti() ? 'ti' : 'en'];
const short = s => s.split(' — ')[0].split(' · ')[0];
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = window.matchMedia('(max-width:760px)');
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

const now = new Date();
const todayJ = LC.grToJdn(now.getFullYear(), now.getMonth() + 1, now.getDate());
const tEt = LC.jdnToEt(todayJ);
// from the first day of last month (Pagume counts as a month), for about thirteen months
const start = tEt.m === 1 ? LC.etToJdn(tEt.y - 1, 13, 1) : LC.etToJdn(tEt.y, tEt.m - 1, 1);
const end = start + 400;

/* ---------- gather feasts and fasts in the window ---------- */
const feasts = [], fasts = [];
for (let y = tEt.y - 1; y <= tEt.y + 1; y++){
  const yd = LC.yearData(y);
  Object.keys(yd.days).forEach(k => {
    const j = +k; if (j < start || j > end) return;
    yd.days[k].feasts.forEach(f => { if (f.rank !== 'fast') feasts.push({ j, key: f.key, major: f.rank === 'major' }); });
  });
  yd.fasts.forEach(f => { if (f.to >= start && f.from <= end) fasts.push(f); });
}
feasts.sort((a, b) => a.j - b.j);

/* ---------- words ---------- */
const W = () => ti() ? {
  today: 'ሎሚ', next: 'ዝቕጽል በዓል', days: 'መዓልቲ', inDays: n => n === 0 ? 'ሎሚ' : n === 1 ? 'ጽባሕ' : `ድሕሪ ${n} መዓልቲ`,
  ago: n => n === 1 ? 'ትማሊ' : `ቅድሚ ${n} መዓልቲ`, dayOf: (a, b) => `መዓልቲ ${a} ካብ ${b}`, earlier: 'ቀደም', later: 'ደሓር'
} : {
  today: 'Today', next: 'Next feast', days: 'days', inDays: n => n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`,
  ago: n => n === 1 ? 'yesterday' : `${n} days ago`, dayOf: (a, b) => `day ${a} of ${b}`, earlier: 'Earlier', later: 'Later'
};
const grDate = j => { const g = LC.jdnToGr(j); return `${N().wd[(j + 1) % 7]}, ${g.d} ${N().grMonths[g.m - 1]} ${g.y}`; };
const etDate = j => { const e = LC.jdnToEt(j); return `${G ? G.geez(e.d) : e.d} ${LC.NAMES.ti.months[e.m - 1]} ${G ? G.geez(e.y) : e.y}`; };
const when = j => j >= todayJ ? W().inDays(j - todayJ) : W().ago(todayJ - j);

/* ---------- today and the next feast ---------- */
function renderTop(){
  const t = $('yr-today'); t.replaceChildren();
  const d = el('span', 'yr-d', G ? G.geez(tEt.d) : tEt.d); d.lang = 'ti';
  const mo = el('span', 'yr-mo', `${LC.NAMES.ti.months[tEt.m - 1]} ${G ? G.geez(tEt.y) : tEt.y}`); mo.lang = 'ti';
  const g = LC.jdnToGr(todayJ);
  const w = (todayJ + 1) % 7;
  const sub = el('span', 'yr-sub', ti()
    ? `${N().wd[w]}፡ ${g.d} ${N().grMonths[g.m - 1]} ${g.y}`
    : `${LC.NAMES.ti.wd[w]} · ${N().wd[w]}, ${g.d} ${N().grMonths[g.m - 1]} ${g.y} · ${tEt.d} ${LC.NAMES.en.months[tEt.m - 1]} ${tEt.y} ${N().era}`);
  t.append(d, mo, sub);
  const f = fasts.find(x => x.from <= todayJ && todayJ <= x.to);
  if (f){
    const n = todayJ - f.from + 1, len = f.to - f.from + 1;
    const fl = el('span', 'yr-fastnow'); fl.append(`${N().fasts[f.key]} · ${W().dayOf(n, len)} `);
    const bar = el('i'); const fill = el('b'); fill.style.width = Math.round(n / len * 100) + '%'; bar.appendChild(fill); fl.appendChild(bar);
    t.appendChild(fl);
  }
  const nx = feasts.find(x => x.j >= todayJ), box2 = $('yr-next'); box2.replaceChildren();
  if (!nx) return;
  const days = nx.j - todayJ;
  const c = el('div', 'yr-count');
  c.append(el('b', '', String(days)), el('span', '', W().days));
  if (G && days > 0){ const ge = el('em', '', G.geez(days)); ge.lang = 'ti'; c.appendChild(ge); }
  box2.append(el('small', '', W().next), el('strong', '', N().feasts[nx.key]), c, el('span', 'yr-sub', `${etDate(nx.j)} · ${grDate(nx.j)}`));
}

/* ---------- the scroll ---------- */
const scroll = $('yr-scroll'), track = $('yr-track'), card = $('yr-card');
let px = 4, sel = null;
const PAD = 56;                                   // room for the first and last names
const X = j => PAD + (j - start) * px;
function renderTrack(){
  px = narrow.matches ? 3 : 4;
  track.style.width = X(end + 1) + PAD + 'px';
  track.replaceChildren();
  // months along the axis
  for (let j = start; j <= end;){
    const e = LC.jdnToEt(j), len = e.m === 13 ? (e.y % 4 === 3 ? 6 : 5) : 30, first = j - e.d + 1;
    const m = el('div', 'yr-m' + (e.m === 1 ? ' is-new' : ''));
    m.style.left = X(Math.max(first, start)) + 'px';
    m.style.width = (Math.min(first + len, end + 1) - Math.max(first, start)) * px + 'px';
    m.append(LC.NAMES.ti.months[e.m - 1]);
    if (e.m !== 13) m.appendChild(el('small', '', e.m === 1 ? `${LC.NAMES.en.months[0]} ${e.y}` : LC.NAMES.en.months[e.m - 1]));
    track.appendChild(m);
    j = first + len;
  }
  track.appendChild(el('div', 'yr-axis'));
  const past = el('div', 'yr-past'); past.style.left = PAD + 'px'; past.style.width = (X(todayJ) - PAD) + 'px'; track.appendChild(past);
  // fasts below the axis
  fasts.forEach(f => {
    const a = Math.max(f.from, start), b = Math.min(f.to, end);
    const band = el('button', 'yr-fast', (b - a) * px > 70 ? N().fasts[f.key] : '');
    band.type = 'button'; band.style.left = X(a) + 'px'; band.style.width = Math.max(10, (b - a + 1) * px) + 'px';
    band.setAttribute('aria-label', N().fasts[f.key]);
    band.addEventListener('click', () => choose({ fast: f }, band));
    track.appendChild(band);
  });
  // feasts above the axis; names for the major ones, raised when they would touch
  // a major feast only gets a name if the next major feast is not right beside it (Holy Week → only Fasika is named)
  const majors = feasts.filter(f => f.major);
  const named = new Set(majors.filter((f, i) => !majors[i + 1] || X(majors[i + 1].j) - X(f.j) > 30));
  let lastX = -1e9, lift = 0;
  feasts.forEach(f => {
    const b = el('button', 'yr-f' + (f.major ? ' is-major' : ''));
    b.type = 'button'; b.style.left = X(f.j) + 'px';
    b.setAttribute('aria-label', `${N().feasts[f.key]}, ${grDate(f.j)}`);
    let h = f.major ? 40 : 22;
    if (named.has(f)){
      const x = X(f.j); lift = (x - lastX < 120) ? (lift + 1) % 3 : 0; lastX = x;
      h += lift * 24;
      b.appendChild(el('span', '', short(N().feasts[f.key])));
    }
    b.style.setProperty('--h', h + 'px');
    b.prepend(el('i'));
    b.addEventListener('click', () => choose({ feast: f }, b));
    track.appendChild(b);
  });
  const nowL = el('div', 'yr-now'); nowL.style.left = X(todayJ) + 'px'; nowL.appendChild(el('b', '', W().today)); track.appendChild(nowL);
}

function choose(it, btn){
  track.querySelectorAll('.is-sel').forEach(x => x.classList.remove('is-sel'));
  if (btn) btn.classList.add('is-sel');
  sel = it; card.replaceChildren();
  if (it.feast){
    const f = it.feast;
    card.append(el('strong', '', N().feasts[f.key]), el('span', '', `${etDate(f.j)} · ${grDate(f.j)} · ${when(f.j)}`));
  } else if (it.fast){
    const f = it.fast;
    card.append(el('strong', '', N().fasts[f.key]), el('span', '', `${etDate(f.from)} – ${etDate(f.to)} · ${f.to - f.from + 1} ${W().days}`));
  }
}
const goTo = (j, smooth) => scroll.scrollTo({ left: Math.max(0, X(j) - scroll.clientWidth * 0.3), behavior: smooth && !still.matches ? 'smooth' : 'auto' });

box.querySelectorAll('.yr-nav button').forEach(b => b.addEventListener('click', () => {
  const g = +b.dataset.go;
  if (!g) goTo(todayJ, true);
  else scroll.scrollBy({ left: g * 30 * px * 2, behavior: still.matches ? 'auto' : 'smooth' });
}));
// drag the scroll with the mouse (touch already slides by itself)
let dx = null, sx = 0, moved = false;
scroll.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dx = e.clientX; sx = scroll.scrollLeft; moved = false; });
window.addEventListener('pointermove', e => { if (dx === null) return; const d = e.clientX - dx; if (Math.abs(d) > 4){ moved = true; scroll.classList.add('is-drag'); } scroll.scrollLeft = sx - d; });
window.addEventListener('pointerup', () => { dx = null; scroll.classList.remove('is-drag'); });
scroll.addEventListener('click', e => { if (moved){ e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

function render(){
  renderTop(); renderTrack();
  const nx = feasts.find(x => x.j >= todayJ);
  const btn = nx && [...track.querySelectorAll('.yr-f')][feasts.indexOf(nx)];
  if (sel && sel.feast) choose(sel, [...track.querySelectorAll('.yr-f')][feasts.indexOf(sel.feast)]);
  else if (sel && sel.fast) choose(sel, [...track.querySelectorAll('.yr-fast')][fasts.indexOf(sel.fast)]);
  else if (nx) choose({ feast: nx }, btn);
}
render();
goTo(todayJ, false);

/* ---------- the one motion: the scroll unrolls when it comes into view ---------- */
if ('IntersectionObserver' in window && !still.matches){
  box.classList.add('is-wait');
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    io.disconnect(); box.classList.remove('is-wait'); box.classList.add('is-open');
  }, { threshold: .3 });
  io.observe(box);
}
document.addEventListener('langchange', render);
narrow.addEventListener('change', () => { render(); goTo(todayJ, false); });
})();
