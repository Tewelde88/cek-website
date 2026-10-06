/* ============================================================
   HOME PAGE — "Pastoral life" open book.
   The left page lists the five initiatives; choosing one turns
   the right page. Arrow keys and a swipe on the page also turn it.
   The small live lines come from the site's own data:
   the Ge'ez calendar, data/parishes.json and data/building.json.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('folio');
if (!box) return;

const isTi = () => document.documentElement.lang === 'ti';
const tabs = [...box.querySelectorAll('[role="tab"]')];
const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
let cur = 0;

function select(i, focus){
  i = (i + tabs.length) % tabs.length;
  if (i === cur){ if (focus) tabs[i].focus(); return; }
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
  panels.forEach((p, k) => { p.hidden = k !== i; p.classList.remove('is-turn'); });
  cur = i;
  if (!still.matches){ void panels[i].offsetWidth; panels[i].classList.add('is-turn'); }
  if (focus) tabs[i].focus();
  // on phones the tabs are a sideways row: keep the chosen one in view
  const row = tabs[i].parentElement;
  if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: still.matches ? 'auto' : 'smooth' });
}

tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
box.querySelector('[role="tablist"]').addEventListener('keydown', e => {
  const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
  if (k) select(cur + k, true);
  else if (e.key === 'Home') select(0, true);
  else if (e.key === 'End') select(tabs.length - 1, true);
  else return;
  e.preventDefault();
});

// a swipe sideways on the right page turns to the next or previous initiative
const page = document.getElementById('fol-page');
let x0 = null, y0 = 0;
page.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse'){ x0 = e.clientX; y0 = e.clientY; } });
page.addEventListener('pointerup', e => {
  if (x0 === null) return;
  const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(cur + (dx < 0 ? 1 : -1));
});
page.addEventListener('pointercancel', () => { x0 = null; });

// the first time the book comes into view, the first symbol draws itself
if ('IntersectionObserver' in window && !still.matches){
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    panels[cur].classList.add('is-turn'); io.disconnect();
  }, { threshold: .4 });
  io.observe(box);
}

/* ---------- the live lines ---------- */
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
const live = k => box.querySelector(`[data-live="${k}"]`);

function feast(){
  const p = live('feast'), G = window.GeezCal; if (!p || !G) return;
  const f = G.upcoming(1)[0], days = f.j - G.todayJ, et = G.jdnToEt(f.j), ti = isTi();
  const name = (ti ? f.ti : f.en).split(' — ')[0];
  const d = el('span', 'fol-date'); d.lang = 'ti';
  d.append(el('b', '', G.geez(et.d)), G.MONTHS_TI[et.m - 1]);
  const s = el('strong', '', name);
  p.replaceChildren(d, ti ? 'ዝቕጽል በዓል፡ ' : 'Next feast: ', s,
    days === 0 ? (ti ? '፡ ሎሚ' : ', today') : (ti ? `፡ ድሕሪ ${days} መዓልቲ` : `, in ${days} days`));
}

function count(){
  const p = live('count'); if (!p || typeof PARISHES_DATA === 'undefined') return;
  const n = k => (PARISHES_DATA[k] || []).length;
  const c = n('communities'), pa = n('parishes'), ch = n('chapels');
  p.replaceChildren();
  if (isTi()) p.append(el('strong', '', c), ' ንኣሽቱ ማሕበረሰባት፡ ', el('strong', '', pa), ' ቍምስናታትን ', el('strong', '', ch), ' ቤተጸሎታትን ክሳብ ሕጂ ኣብዚ መርበብ ተመዝጊቦም ኣለዉ።');
  else p.append(el('strong', '', c), c === 1 ? ' small community, ' : ' small communities, ', el('strong', '', pa), pa === 1 ? ' parish and ' : ' parishes and ', el('strong', '', ch), ch === 1 ? ' chapel are listed on the website so far.' : ' chapels are listed on the website so far.');
}

function build(){
  const p = live('build'); if (!p) return;
  const B = (typeof BUILDING !== 'undefined' && BUILDING && BUILDING.name) ? BUILDING : null;
  const more = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS.length : 0;
  p.replaceChildren();
  if (B){
    const pct = Math.max(0, Math.min(100, Number(B.percent) || 0)), ti = isTi();
    const name = (ti && B.name_ti) ? B.name_ti : B.name;
    const line = el('span');
    line.append(ti ? `ህንጻ ${name}፡ ` : `${name} building: `, el('strong', '', pct + '%'), ti ? ' ተዛዚሙ' : ' complete');
    if (more) line.append(ti ? `፡ ${more} ካልኦት ምጥናት ድማ ኣለዉ።` : `, and ${more} more ${more === 1 ? 'project' : 'projects'}.`);
    const bar = el('div', 'fol-bar'); bar.setAttribute('aria-hidden', 'true');
    const fill = el('span'); fill.style.width = pct + '%'; bar.appendChild(fill);
    p.append(line, bar);
  } else if (more){
    p.append(el('strong', '', more), isTi() ? ' ምጥናት' : (more === 1 ? ' project' : ' projects'));
  }
}

function render(){ feast(); count(); build(); }
document.addEventListener('langchange', render);
render();
})();
