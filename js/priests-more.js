/* ============================================================
   PRIESTS PAGE — the sections after the directory:
   "A priest's day" (the sun crosses the arch, one duty per hour),
   "Always learning" (four time scales), "Who stands with our
   priests" (an arch on four pillars) and the candle by the prayer.
   ============================================================ */
(function(){
'use strict';
const ti = () => document.documentElement.lang === 'ti';
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const fresh = node => { node.classList.remove('is-new'); void node.offsetWidth; node.classList.add('is-new'); };

/* ---------- A priest's day ---------- */
(function(){
  const box = document.getElementById('pd'); if (!box) return;
  const btns = [...box.querySelectorAll('.pd-hours button')];
  const sun = document.getElementById('pd-sun'), sky = document.getElementById('pd-sky'), card = document.getElementById('pd-card');
  const TAG = () => ti() ? { l: 'ሊጡርጊያ', s: 'ምስጢራት', c: 'ምምራሕ ማሕበረሰብ' } : { l: 'Liturgy', s: 'Sacraments', c: 'Community leadership' };
  let cur = 0;
  function show(i, focus){
    cur = (i + btns.length) % btns.length;
    btns.forEach((b, k) => b.setAttribute('aria-pressed', k === cur));
    // the sun on the arch: from the left horizon (dawn) over the top (noon) to the right (night)
    const a = Math.PI * (1 - cur / (btns.length - 1)), x = 50 + 45 * Math.cos(a), y = 95 - 85 * Math.sin(a);
    sun.style.left = x + '%'; sun.style.top = y + '%';
    sky.dataset.t = cur;                                   // the colour of the sky follows the hour
    const b = btns[cur], p = b.nextElementSibling;
    card.replaceChildren();
    const h = el('p', 'pd-time'); h.append(el('b', '', b.querySelector('b').textContent), ' ', b.querySelector('span').textContent);
    const tags = el('p', 'pd-tags'); p.dataset.tags.split(' ').forEach(t => tags.appendChild(el('span', 'pd-tag pd-' + t, TAG()[t])));
    card.append(h, el('p', 'pd-text', p.textContent), tags);
    fresh(card);
    if (focus) b.focus();
  }
  btns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  box.querySelector('.pd-hours').addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    e.preventDefault(); show(cur + k, true);
  });
  document.addEventListener('langchange', () => show(cur));
  show(0);
  // the one motion: when the section comes into view, the sun rises along the arch to the morning Liturgy
  if ('IntersectionObserver' in window && !still.matches){
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)){ io.disconnect(); setTimeout(() => show(1), 500); } }, { threshold: .5 });
    io.observe(box);
  }
})();

/* ---------- Always learning: four time scales ---------- */
(function(){
  const box = document.getElementById('af'); if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')], panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  let cur = 0;
  function select(i, focus){
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === cur); t.tabIndex = k === cur ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== cur; if (k === cur) fresh(p); });
    box.style.setProperty('--af', cur);
    if (focus) tabs[cur].focus();
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
  box.querySelector('[role="tablist"]').addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    e.preventDefault(); select(cur + k, true);
  });
})();

/* ---------- Who stands with our priests: the four pillars ---------- */
(function(){
  const box = document.getElementById('sp'); if (!box) return;
  const btns = [...box.querySelectorAll('.sp-pillars button')], card = document.getElementById('sp-card');
  let cur = 0;
  function show(i){
    cur = i;
    btns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    card.replaceChildren(el('h3', '', btns[i].querySelector('span:not(.sp-long)').textContent), el('p', '', btns[i].querySelector('.sp-long').textContent));
    fresh(card);
  }
  btns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  document.addEventListener('langchange', () => show(cur));
  show(0);
})();

/* ---------- The candle beside the prayer ---------- */
(function(){
  const c = document.getElementById('pc-candle'); if (!c) return;
  c.addEventListener('click', () => {
    const on = c.getAttribute('aria-pressed') !== 'true';
    c.setAttribute('aria-pressed', on);
    document.getElementById('pc-thanks').hidden = !on;
  });
})();
})();
