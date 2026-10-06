/* ============================================================
   EPARCHY PAGE — "Belonging to the Eparchy": a path through life.
   Seven stops; three threads (sacramental life, formation,
   community support) show where each benefit is present.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('bn');
if (!box) return;
const ti = () => document.documentElement.lang === 'ti';
const NAMES = () => ti() ? { s: 'ህይወት ምስጢራት', f: 'ሥነ-መዕበያ', c: 'ደገፍ ማሕበረሰብ' } : { s: 'Sacramental life', f: 'Formation', c: 'Community support' };
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const stops = [...box.querySelectorAll('.bn-stop')];
const dots = stops.map(s => s.querySelector('.bn-dot'));
const card = document.getElementById('bn-card');
let cur = 0;

// small coloured marks under each stop: which threads are present there
stops.forEach(s => {
  const pips = el('span', 'bn-pips'); pips.setAttribute('aria-hidden', 'true');
  s.dataset.th.split(' ').forEach(t => pips.appendChild(el('i', 'th-' + t)));
  s.querySelector('.bn-dot').after(pips);
});

function show(i, focus){
  cur = (i + stops.length) % stops.length;
  dots.forEach((d, k) => d.setAttribute('aria-pressed', k === cur));
  const s = stops[cur], more = s.querySelector('.bn-more');
  card.replaceChildren();
  const n = el('b', 'bn-n', s.querySelector('.bn-dot b').textContent); n.lang = 'ti';
  const head = el('div', 'bn-head'); head.append(n, el('small', '', s.querySelector('.bn-dot span').textContent));
  card.append(head, more.querySelector('h3').cloneNode(true), more.querySelector('p').cloneNode(true));
  const tags = el('p', 'bn-tags');
  s.dataset.th.split(' ').forEach(t => { const tag = el('span'); tag.append(el('i', 'th-' + t), NAMES()[t]); tags.appendChild(tag); });
  card.append(tags, more.querySelector('a').cloneNode(true));
  card.classList.remove('is-new'); void card.offsetWidth; card.classList.add('is-new');
  if (focus) dots[cur].focus();
}
function filter(t){
  box.dataset.t = t;
  box.querySelectorAll('.bn-threads button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
  stops.forEach(s => s.classList.toggle('is-dim', !!t && !s.dataset.th.split(' ').includes(t)));
  // keep the open stop on the chosen thread
  if (t && stops[cur].classList.contains('is-dim')) show(stops.findIndex(s => !s.classList.contains('is-dim')));
}
dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
box.querySelector('.bn-path').addEventListener('keydown', e => {
  const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
  e.preventDefault(); show(cur + k, true);
});
box.querySelectorAll('.bn-threads button').forEach(b => b.addEventListener('click', () => filter(b.dataset.t)));
document.addEventListener('langchange', () => show(cur));
show(0);
})();
