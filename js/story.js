/* ============================================================
   EPARCHY PAGE — "Our story": foundation, growth, commitment.
   The text is on the Admin page (Eparchy → About the Eparchy);
   the key dates in the margin come from the History list, so
   they always agree with the History row further down.
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('sy');
if (!box || typeof EPARCHY === 'undefined') return;
const parts = (EPARCHY.about || []).filter(p => p && (p.text || p.title));
if (!parts.length){ box.closest('section').hidden = true; return; }

const ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const G = () => window.GeezCal;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const ge = n => G() ? G().geez(n) : String(n);
const history = (EPARCHY.history || []).filter(h => h && h.year).slice().sort((a, b) => a.year - b.year);
const MONTHS_TI = ['ጥሪ','ለካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰነ','ሓምለ','ነሓሰ','መስከረም','ጥቅምቲ','ሕዳር','ታሕሳስ'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// which dates go beside which part: up to the founding (1995) with the first, the rest with the second
const glossesFor = i => i === 0 ? history.filter(h => h.year <= 1995) : i === 1 ? history.filter(h => h.year > 1995) : [];

function gloss(h){
  const li = el('li');
  const y = el('b', '', String(h.year)); li.appendChild(y);
  if (h.date){
    const [yy, mm, dd] = String(h.date).slice(0, 10).split('-').map(Number);
    if (dd) li.appendChild(el('small', '', ti() ? `${dd} ${MONTHS_TI[mm - 1]}` : `${dd} ${MONTHS_EN[mm - 1]}`));
  }
  li.appendChild(el('span', '', tr(h, 'title')));
  if (h.check) li.appendChild(el('em', '', ti() ? 'ዕለት ይረጋገጽ' : 'date to check'));
  return li;
}

function render(){
  const idx = document.getElementById('sy-index'), txt = document.getElementById('sy-text');
  idx.replaceChildren(); txt.replaceChildren();
  parts.forEach((p, i) => {
    const id = 'sy-p' + (i + 1);
    // index entry: Ge'ez numeral + the part's name
    const a = el('a'); a.href = '#' + id;
    const n = el('b', '', ge(i + 1)); n.lang = 'ti';
    a.append(n, el('span', '', tr(p, 'label') || tr(p, 'title')));
    const li = el('li'); li.appendChild(a); idx.appendChild(li);
    // the part itself
    const art = el('article', 'sy-part'); art.id = id;
    const main = el('div', 'sy-main');
    if (tr(p, 'label')) main.appendChild(el('p', 'sy-kicker', tr(p, 'label')));
    main.appendChild(el('h3', '', tr(p, 'title')));
    String(tr(p, 'text')).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).forEach((s, k) => main.appendChild(el('p', 'sy-p' + (k ? '' : ' sy-first'), s)));
    art.appendChild(main);
    const gl = glossesFor(i), side = el('aside', 'sy-gloss');
    if (gl.length){ const ul = el('ul'); ul.setAttribute('role', 'list'); gl.forEach(h => ul.appendChild(gloss(h))); side.appendChild(ul); }
    else if (i === parts.length - 1){
      // the last part points to the work itself
      [['cesk.html', ti() ? 'CESK — ሽዱሽተ መገድታት ኣገልግሎት' : 'CESK — six ways of service'],
       ['parishes.html#parishes', ti() ? 'ቍምስናታትን ቤተጸሎታትን' : 'Parishes and chapels'],
       ['pastoral.html#communities', ti() ? 'ክርስትያናዊ ማሕበረሰባት' : 'Christian communities']].forEach(([h, t]) => {
        const l = el('a', 'sy-link', t); l.href = h; side.appendChild(l);
      });
    }
    art.appendChild(side);
    txt.appendChild(art);
  });
  if (EPARCHY.about_sample) txt.appendChild(el('p', 'sy-note', ti() ? 'ኣብነት — እዚ ጽሑፍ ኣብ ገጽ ምምሕዳር ክረጋገጽ ኣለዎ።' : 'Example — this text is to be checked on the Admin page.'));
  spy();
}

/* ---------- the index follows the reader ---------- */
let io = null;
function spy(){
  if (io) io.disconnect();
  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('#sy-index a')];
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.toggleAttribute('aria-current', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-35% 0px -55% 0px' });
  document.querySelectorAll('.sy-part').forEach(p => io.observe(p));
  if (links[0]) links[0].setAttribute('aria-current', 'true');
}

document.addEventListener('langchange', render);
render();
})();
