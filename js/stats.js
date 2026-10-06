/* ============================================================
   HOME PAGE — "The Eparchy in numbers".
   Counts come from the Admin page lists (data/parishes.json and
   data/eparchy.json); nothing here needs to be typed by hand.
   Each parish, chapel and sanctuary is one light, grouped by
   deanery. The buttons (or a click on a group) show one deanery.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('st');
if (!box) return;

const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const DEANS = { keren: ['Keren', 'ከረን'], habinmentel: ['Habinmentel', 'ሓቢንመንተል'], hagaz: ['Hagaz', 'ሓጋዝ'] };
const KEYS = Object.keys(DEANS);
const TYPE = { par: ['Parish', 'ቍምስና', 'parishes'], cha: ['Chapel', 'ቤተጸሎት', 'chapels'], san: ['Sanctuary', 'ቅዱስ ቦታ', 'sanctuaries'] };
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const G = () => window.GeezCal;

/* ---------- the data ---------- */
const P = (typeof PARISHES_DATA !== 'undefined' && PARISHES_DATA) || {};
const E = (typeof EPARCHY !== 'undefined' && EPARCHY) || {};
const list = (o, k) => Array.isArray(o[k]) ? o[k] : [];
const parishes = list(P, 'parishes');
const low = s => (s || '').trim().toLowerCase();
const parishDean = name => { const p = parishes.find(x => x.name && low(x.name) === low(name)); return p ? (p.deanery || '') : ''; };
const items = [
  ...list(P, 'sanctuaries').map(o => ({ t: 'san', o, d: o.deanery || '' })),
  ...parishes.map(o => ({ t: 'par', o, d: o.deanery || '' })),
  ...list(P, 'chapels').map(o => ({ t: 'cha', o, d: o.deanery || parishDean(o.parish) }))
];
// a priest belongs to the deanery of the parish named in his "place" (as on the Priests page)
const priests = list(E, 'priests').map(p => {
  const par = parishes.find(x => x.name && p.place && low(p.place).includes(low(x.name)));
  return { d: par ? (par.deanery || '') : '' };
});
const orders = list(E, 'orders').length;

let sel = '';
const shown = { par: 0, cha: 0, san: 0, pri: 0, ord: 0 };
function count(k, d){
  if (k === 'ord') return orders;
  if (k === 'pri') return priests.filter(p => !d || p.d === d).length;
  return items.filter(i => i.t === k && (!d || i.d === d)).length;
}

/* ---------- counters (Arabic and Ge'ez numerals) ---------- */
const rows = [...box.querySelectorAll('.st-nums > div')];
function paint(row, n){
  row.querySelector('.st-n').textContent = n.toLocaleString('en');
  row.querySelector('.st-ge').textContent = n > 0 && G() ? G().geez(n) : '';
}
function setCounts(animate){
  rows.forEach(row => {
    const k = row.dataset.k, to = count(k, sel), from = shown[k];
    shown[k] = to;
    const wide = k === 'ord' && sel;
    row.classList.toggle('is-wide', !!wide);
    const w = row.querySelector('.st-wide');
    if (w){ w.hidden = !wide; w.textContent = isTi() ? 'ኣብ ምሉእ ኤጳርቅና' : 'for the whole Eparchy'; }
    if (!animate || still.matches || from === to){ paint(row, to); return; }
    const t0 = performance.now(), dur = 900;
    (function step(now){
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      paint(row, Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
}

/* ---------- the field of lights: one sunflower spiral per deanery ---------- */
const field = document.getElementById('st-field');
const cap = document.getElementById('st-cap');
const capDefault = () => isTi() ? 'ነፍሲ ወከፍ ብርሃን ቍምስና፡ ቤተጸሎት ወይ ቅዱስ ቦታ እዩ። ስሙ ንምርኣይ ኣመልክቱ ወይ ጠውቑ።' : 'Each light is a parish, chapel or sanctuary. Point to one to see its name.';
const NS = 'http://www.w3.org/2000/svg';
const STAR = [[0,-1],[.24,-.33],[.95,-.31],[.38,.12],[.59,.81],[0,.4],[-.59,.81],[-.38,.12],[-.95,-.31],[-.24,-.33]];
const star = (x, y, s) => 'M' + STAR.map(([a, b]) => (x + a * s).toFixed(2) + ',' + (y + b * s).toFixed(2)).join('L') + 'Z';
const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const a in attrs) e.setAttribute(a, attrs[a]); return e; };

function build(){
  field.replaceChildren();
  // the whole Eparchy (every place, with or without a deanery) and then the three deaneries
  ['', ...KEYS].forEach(g => {
    const mine = items.filter(i => !g || i.d === g);
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'st-cl' + (g ? '' : ' is-all'); btn.dataset.d = g;
    btn.setAttribute('aria-pressed', 'false');
    const svg = svgEl('svg', { viewBox: '-50 -50 100 100', 'aria-hidden': 'true' });
    svg.appendChild(svgEl('circle', { class: 'st-ring', r: 47 }));
    const n = mine.length, c = 40 / Math.sqrt(Math.max(n, 1)), size = Math.min(4.2, Math.max(1.6, c * 0.42));
    mine.forEach((it, i) => {
      const r = c * Math.sqrt(i + 0.5), a = i * 2.39996;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      const s = it.t === 'san' ? size * 1.7 : it.t === 'par' ? size * 1.15 : size * 0.85;
      const lt = it.t === 'san'
        ? svgEl('path', { d: star(x, y, s) })
        : svgEl('circle', { cx: x.toFixed(2), cy: y.toFixed(2), r: s.toFixed(2) });
      lt.setAttribute('class', 'lt lt-' + it.t);
      lt.style.animationDelay = (i * 25) + 'ms';
      lt.addEventListener('mouseenter', () => say(it));
      lt.addEventListener('mouseleave', () => say(null));
      lt.addEventListener('click', e => { e.stopPropagation(); say(it); });
      svg.appendChild(lt);
    });
    const name = document.createElement('b');
    name.textContent = g ? DEANS[g][isTi() ? 1 : 0] : (isTi() ? 'ኤጳርቅና' : 'Eparchy');
    const sm = document.createElement('small');
    sm.textContent = n ? (isTi() ? `${n} ቦታታት` : `${n} ${n === 1 ? 'place' : 'places'}`) : (isTi() ? 'ገና ኣይተመዝገበን' : 'None listed yet');
    btn.append(svg, name, sm);
    btn.addEventListener('click', () => choose(sel === g ? '' : g));
    field.appendChild(btn);
  });
  mark();
}

function say(it){
  if (!it){ cap.textContent = capDefault(); return; }
  const ti = isTi(), T = TYPE[it.t];
  const where = DEANS[it.d] ? ` — ${DEANS[it.d][ti ? 1 : 0]}` : '';
  const s = document.createElement('strong'); s.textContent = tr(it.o, 'name') || T[ti ? 1 : 0];
  cap.replaceChildren(s, ` · ${T[ti ? 1 : 0]}${where}`);
}

function mark(){
  box.querySelectorAll('.st-filter button').forEach(b => b.setAttribute('aria-pressed', b.dataset.d === sel));
  field.querySelectorAll('.st-cl').forEach(c => {
    c.setAttribute('aria-pressed', c.dataset.d === sel);
    c.classList.toggle('is-dim', !!sel && c.dataset.d !== sel);
  });
}
function choose(d){ sel = d; mark(); setCounts(true); }
box.querySelectorAll('.st-filter button').forEach(b => b.addEventListener('click', () => choose(b.dataset.d)));

/* ---------- first time in view: the counters count up and the lights come on (the one motion) ---------- */
build();
if ('IntersectionObserver' in window && !still.matches){
  box.classList.add('is-wait');
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    io.disconnect(); box.classList.remove('is-wait'); box.classList.add('is-lit'); setCounts(true);
  }, { threshold: .3 });
  io.observe(box);
} else setCounts(false);

document.addEventListener('langchange', () => { build(); setCounts(false); say(null); });
})();
