/* ============================================================
   EPARCHY PAGE (eparchy.html) — contents + chapters: bishops,
   priests, seminary, religious communities, history; chapter
   bar and photo viewer.
   Data: data/eparchy.json — edit on the Admin page → "Eparchy"
   (bishops, priests, orders, history).
   ============================================================ */
(function(){
'use strict';
const D = Object.assign({ bishops: [], priests: [], orders: [], history: [] }, (typeof EPARCHY !== 'undefined' && EPARCHY) || {});
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const T = k => (isTi() && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.ti && TRANSLATIONS.ti[k]) || null;
const L = () => isTi() ? {
  more: 'ተወሳኺ ርኣዩ', photoSoon: 'ስእሊ ቀልጢፉ', sample: 'ኣብነት', current: 'ጳጳስና', late: 'ዝዓረፉ ጳጳስ',
  priests: n => `${n} ካህናት`, orders: n => `${n} ማሕበራት`, see: 'ርኣዩ',
  earlier: 'ቅድሚ 1993', earlierT: 'ዝሓለፉ ዓመታት', earlierP: 'ናይ ቀደም ታሪኽ ኣብዚ ክውሰኽ እዩ።',
  later: 'ቀጻሊ', laterT: 'ታሪኽ ይቕጽል', laterP: 'ሓደስቲ ዓመታት ኣብዚ ክውሰኹ እዮም።'
} : {
  more: 'Show more', photoSoon: 'Photo coming', sample: 'Example', current: 'Our bishop', late: 'Late bishop',
  priests: n => `${n} priests`, orders: n => `${n} communities`, see: 'See more',
  earlier: 'Before 1993', earlierT: 'Earlier years', earlierP: 'The earlier history will be added here.',
  later: 'Next', laterT: 'The story continues', laterP: 'New years will be added here.'
};
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
const MITRE = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 28V15c0-4.5 3.2-8.6 5.5-11c2.3 2.4 5.5 6.5 5.5 11v13z"/><path d="M7 21h11M12.5 4v8"/><path d="M25 29V11"/><path d="M25 11a3.6 3.6 0 1 1 3.6-3.6c0 1.6-1.1 2.6-2.3 2.6"/></svg>';

/* ---- the two seminaries (each has its own page) ---- */
const SEMINARY = [
  { title: 'Major Seminary', key: 'ep.sem.c2.t', textKey: 'ep.sem.c2.p',
    text: 'Seminarians continue with philosophy and theology, preparing for ordination to the diaconate and the priesthood.', photo: '', link: 'major-seminary.html' },
  { title: 'Minor Seminary', key: 'ep.sem.c1.t', textKey: 'ep.sem.c1.p',
    text: 'Young men discerning a call to the priesthood begin in the minor seminary, combining school studies with prayer and community life.', photo: '', link: 'minor-seminary.html' }
];
const GALLERY = {};          // photo sets for the viewer, filled as each row is drawn
const PH = ['ph-navy', 'ph-red', 'ph-ochre', 'ph-green'];

/* ---- a photo: opens the viewer; without a photo, a coloured placeholder ---- */
function photo(src, set, i, label, cls){
  const t = el(src ? 'button' : 'div', 'tile' + (src ? '' : ' ph ' + PH[i % PH.length]) + (cls ? ' ' + cls : ''));
  if (src){ t.type = 'button'; t.style.backgroundImage = `url("${src}")`; t.dataset.lb = set; t.dataset.i = i; t.setAttribute('aria-label', label || ''); }
  return t;
}

/* ---- Bishops: current bishop first, then the late bishops ---- */
function renderBishops(){
  const box = document.getElementById('g-bishops'); if (!box) return;
  GALLERY.bishops = D.bishops.map(b => ({ src: b.photo, caption: tr(b, 'name') }));
  box.replaceChildren(...D.bishops.map((b, i) => {
    const c = el('article', 'bish' + (b.current ? ' is-current' : ''));
    const t = photo(b.photo, 'bishops', i, tr(b, 'name'), 'arch');
    if (!b.photo){ t.classList.remove(PH[i % PH.length]); t.classList.add('ph-purple'); t.innerHTML = MITRE; }
    c.appendChild(t);
    c.appendChild(el('span', 'bish-tag', b.current ? L().current : L().late));
    c.appendChild(el('strong', '', tr(b, 'name')));
    c.appendChild(el('span', 'bish-yrs', b.years));
    if (b.link){ const a = el('a', 'bish-link', L().see); a.href = b.link; c.appendChild(a); }
    if (b.sample) c.appendChild(el('span', 'sample-tag', L().sample));
    return c;
  }));
  scrollers.forEach(f => f());
}

/* ---- Priests: small cards, 12 at a time ---- */
const pr = { shown: 12 };
function renderPriests(){
  const box = document.getElementById('g-priests'); if (!box) return;
  GALLERY.priests = D.priests.map(p => ({ src: p.photo, caption: tr(p, 'name') }));
  box.replaceChildren(...D.priests.slice(0, pr.shown).map((p, i) => {
    const c = el('article', 'person');
    const t = photo(p.photo, 'priests', i, tr(p, 'name'), 'arch');
    if (!p.photo) t.appendChild(el('span', 'initials', (tr(p, 'name').replace(/^(Abba|ኣባ)\s*[—-]?\s*/, '')[0] || '?')));
    c.appendChild(t);
    c.appendChild(el('strong', '', tr(p, 'name')));
    if (tr(p, 'place')) c.appendChild(el('span', '', tr(p, 'place')));
    if (p.sample) c.appendChild(el('span', 'sample-tag', L().sample));
    return c;
  }));
  const more = document.getElementById('pr-more');
  more.hidden = D.priests.length <= pr.shown; more.onclick = () => { pr.shown += 12; renderPriests(); };
}

/* ---- Seminary: two cards ---- */
function renderSeminary(){
  const box = document.getElementById('g-seminary'); if (!box) return;
  GALLERY.seminary = SEMINARY.map(s => ({ src: s.photo, caption: T(s.key) || s.title }));
  box.replaceChildren(...SEMINARY.map((s, i) => {
    const c = el('article', 'sem-card');
    const t = photo(s.photo, 'seminary', i, T(s.key) || s.title);
    if (!s.photo) t.appendChild(el('span', 'ph-note', L().photoSoon));
    c.appendChild(t);
    const b = el('div', 'sem-body');
    b.appendChild(el('h3', '', T(s.key) || s.title));
    b.appendChild(el('p', '', T(s.textKey) || s.text));
    const a = el('a', 'chap-all', L().see); a.href = s.link; b.appendChild(a);
    c.appendChild(b);
    return c;
  }));
}

/* ---- Religious communities: photo card with the name only ---- */
function renderOrders(){
  const box = document.getElementById('g-orders'); if (!box) return;
  GALLERY.orders = D.orders.map(o => ({ src: o.photo, caption: tr(o, 'name') }));
  box.replaceChildren(...D.orders.map((o, i) => {
    const t = photo(o.photo, 'orders', i, tr(o, 'name'), 'comm');
    t.appendChild(el('span', 'tile-cap', tr(o, 'name')));
    return t;
  }));
}

/* ---- History: one sideways row, open at both ends for years still to come ---- */
function histCard(yr, title, text, ge, cls){
  const li = el('li', cls || '');
  li.appendChild(el('span', 'yr', yr));
  const g = el('span', 'ge', ge || ''); g.lang = 'ti'; li.appendChild(g);
  li.appendChild(el('strong', '', title));
  li.appendChild(el('p', '', text));
  return li;
}
function renderHistory(){
  const box = document.getElementById('g-history'); if (!box) return;
  const G = window.GeezCal;
  const items = D.history.slice().sort((a, b) => a.year - b.year).map(h => {
    let ge = '';
    if (G && h.date){ const [y, m, d] = h.date.split('-').map(Number), e = G.jdnToEt(G.grToJdn(y, m, d)); ge = `${G.geez(e.d)} ${G.MONTHS_TI[e.m - 1]} ${G.geez(e.y)}`; }
    return histCard(String(h.year), tr(h, 'title'), tr(h, 'text'), ge);
  });
  box.replaceChildren(histCard(L().earlier, L().earlierT, L().earlierP, '', 'h-open'), ...items,
                      histCard(L().later, L().laterT, L().laterP, '', 'h-open'));
  const chk = document.getElementById('hist-check'); if (chk) chk.hidden = !D.history.some(h => h.check);
  scrollers.forEach(f => f());
}
/* ---- sideways rows with arrow buttons (bishops, history) ---- */
const scrollers = [];
document.querySelectorAll('[data-scroller]').forEach(wrap => {
  const box = wrap.querySelector('.hscroll'), p = wrap.querySelector('.hs-prev'), n = wrap.querySelector('.hs-next');
  const update = () => { p.disabled = box.scrollLeft < 4; n.disabled = box.scrollLeft + box.clientWidth >= box.scrollWidth - 4; };
  const by = d => box.scrollBy({ left: d * box.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  p.onclick = () => by(-1); n.onclick = () => by(1);
  box.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  scrollers.push(update);
});

/* ---- counts in the contents windows ---- */
function renderCounts(){
  document.querySelectorAll('[data-count]').forEach(n => { const k = n.dataset.count; n.textContent = L()[k]((D[k] || []).length); });
}

/* ---- photo viewer: arrows, swipe, Esc ---- */
const lb = document.getElementById('lb'); let cur = { set: '', i: 0 };
function photos(set){ return (GALLERY[set] || []).map((g, i) => ({ ...g, i })).filter(g => g.src); }
function show(){
  const list = photos(cur.set); if (!list.length) return;
  const g = list.find(x => x.i === cur.i) || list[0];
  const img = document.getElementById('lb-img');
  img.style.backgroundImage = `url("${g.src}")`; img.setAttribute('aria-label', g.caption || '');
  document.getElementById('lb-cap').textContent = g.caption || '';
  lb.querySelectorAll('.lb-nav').forEach(b => b.hidden = list.length < 2);
}
function step(d){ const list = photos(cur.set), k = list.findIndex(g => g.i === cur.i); cur.i = list[(k + d + list.length) % list.length].i; show(); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-lb]'); if (!t || !lb || typeof lb.showModal !== 'function') return;
  cur = { set: t.dataset.lb, i: Number(t.dataset.i) || 0 }; show(); lb.showModal();
});
if (lb){
  lb.querySelector('.lb-prev').onclick = () => step(-1);
  lb.querySelector('.lb-next').onclick = () => step(1);
  lb.querySelector('[data-lb-close]').onclick = () => lb.close();
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  let x0 = null;
  lb.addEventListener('pointerdown', e => { x0 = e.clientX; });
  lb.addEventListener('pointerup', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) step(e.clientX < x0 ? 1 : -1); x0 = null; });
}

/* ---- chapter bar: underline the chapter on screen ---- */
const links = [...document.querySelectorAll('.ch-bar a')];
if ('IntersectionObserver' in window && links.length){
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.classList.toggle('is-here', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
}

function renderAll(){ renderCounts(); renderBishops(); renderPriests(); renderSeminary(); renderOrders(); renderHistory(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();
