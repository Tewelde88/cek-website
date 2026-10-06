/* ============================================================
   EPARCHY PAGE — "Where we are": a zoom journey.
   Africa → Eritrea → the Eparchy of Keren (illustrated maps in
   images/maps/) → a live Google satellite map. Every place can
   be opened in Google Earth (new tab: Google does not allow
   Google Earth inside another web page).
   To move a marker: change its x / y (per cent of the picture).
   ============================================================ */
(function(){
'use strict';
const box = document.getElementById('mp');
if (!box) return;
const ti = () => document.documentElement.lang === 'ti';
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
// a place is searched by name, or given as '@lat,lon' (the Anseba region: 16°00′N 38°00′E)
const earth = q => q.startsWith('@') ? 'https://earth.google.com/web/' + q + ',900a,320000d,35y,0h,0t,0r' : 'https://earth.google.com/web/search/' + encodeURIComponent(q);
// Google's own embed address (satellite view, no key needed); a name or 'lat,lon'
const satQ = q => q.startsWith('@') ? q.slice(1) : q;
const satSrc = q => 'https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s' + encodeURIComponent(satQ(q)).replace(/%20/g, '+').replace(/%2C/g, ',') + '!5e1!6i' + (q.startsWith('@') ? 9 : 12);
const satLink = q => 'https://www.google.com/maps/search/' + encodeURIComponent(satQ(q));

// [x %, y %, English, Tigrinya, note EN, note TI, search for Google Earth, level it opens]
const LEVELS = [
  { t: ['Africa', 'ኣፍሪቃ'], d: ['The Eparchy of Keren is in Eritrea, on the Red Sea, in the Horn of Africa.', 'ኤጳርቅና ከረን ኣብ ኤርትራ፡ ኣብ ገማግም ቀይሕ ባሕሪ፡ ኣብ ቀርኒ ኣፍሪቃ ትርከብ።'],
    pins: [[70, 36, 'Eritrea', 'ኤርትራ', 'Open the map of Eritrea', 'ካርታ ኤርትራ ክፈቱ', 'Eritrea', 1]] },
  { t: ['Eritrea', 'ኤርትራ'], d: ['Keren lies north-west of Asmara, in the Anseba region.', 'ከረን ኣብ ሰሜናዊ ምዕራብ ኣስመራ፡ ኣብ ዞባ ዓንሰባ ትርከብ።'],
    pins: [[39, 43.5, 'Anseba region', 'ዞባ ዓንሰባ', 'The land of the Eparchy', 'ምድሪ ኤጳርቅና', '@16.0,38.0', 2],
           [47.6, 46.2, 'Keren', 'ከረን', 'Seat of the bishop', 'መንበር ጳጳስ', 'Keren, Eritrea', 2],
           [51.5, 52, 'Asmara', 'ኣስመራ', 'Capital of Eritrea', 'ርእሰ ከተማ ኤርትራ', 'Asmara, Eritrea'],
           [60.2, 47, 'Massawa', 'ምጽዋዕ', 'Port on the Red Sea', 'ወደብ ቀይሕ ባሕሪ', 'Massawa, Eritrea']] },
  { t: ['Eparchy of Keren', 'ኤጳርቅና ከረን'], d: ['The Eparchy’s land in Anseba, with its subzones and peoples. Keren is the seat of the bishop.', 'ምድሪ ኤጳርቅና ኣብ ዓንሰባ፡ ምስ ንኡሳን ዞባታቱን ህዝብታቱን። ከረን መንበር ጳጳስ እያ።'],
    pins: [[67.6, 78.4, 'Keren', 'ከረን', 'Seat of the bishop · Keren deanery', 'መንበር ጳጳስ · መካን ከረን', 'Keren, Eritrea', 3],
           [61.5, 79.5, 'Hagaz', 'ሓጋዝ', 'Hagaz deanery', 'መካን ሓጋዝ', 'Hagaz, Eritrea', 3],
           [61, 67.5, 'Halhal', 'ሓልሓል', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Halhal, Eritrea', 3, 'list'],
           [70, 72, 'Hamelmalo', 'ሓመልማሎ', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Hamelmalo, Eritrea', 3, 'list'],
           [78, 80, 'Geleb', 'ገለብ', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Geleb, Eritrea', 3, 'list'],
           [72, 86, 'Elabered', 'ኤላበርድ', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Elabered, Eritrea', 3, 'list'],
           [80.5, 87.5, 'Atekelezan', 'ኣተካለዛን', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Adi Tekelezan, Eritrea', 3, 'list'],
           [61, 48.5, 'Habero', 'ሓበሮ', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Habero, Eritrea', 3, 'list'],
           [53, 55, 'Asmat', 'ኣስማት', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Asmat, Eritrea', 3, 'list'],
           [44, 26.5, 'Sela', 'ሰላ', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Sela, Anseba, Eritrea', 3, 'list'],
           [32, 43, 'Kerkebet', 'ከርከበት', 'Subzone of Anseba', 'ንኡስ ዞባ ዓንሰባ', 'Kerkebet, Eritrea', 3, 'list']] },
  { t: ['From space', 'ካብ ህዋ'], d: ['See the place as it looks from space — zoom, move and explore.', 'እቲ ቦታ ካብ ሰማይ ከመይ ከም ዝመስል ርኣዩ — ኣቕርቡ፡ ኣንቀሳቕሱን ዳህስሱን።'], pins: [] }
];
const stage = document.getElementById('mp-stage'), card = document.getElementById('mp-card');
const layers = [...stage.querySelectorAll('.mp-layer')];
const sat = document.getElementById('mp-sat');
// until a place is chosen, the satellite map and Google Earth show the whole Anseba region
let lv = 0, place = ['Anseba region', 'ዞባ ዓንሰባ', 'The land of the Eparchy · 16°00′N 38°00′E', 'ምድሪ ኤጳርቅና · 16°00′ሰ 38°00′ም', '@16.0,38.0'];

// markers on the three pictures
layers.forEach((layer, i) => (LEVELS[i].pins || []).filter(p => p[8] !== 'list').forEach(p => {
  const b = el('button', 'mp-pin' + (p[7] !== undefined && p[7] < 3 ? ' is-door' : ''));
  b.type = 'button'; b.style.left = p[0] + '%'; b.style.top = p[1] + '%';
  b.appendChild(el('span', 'mp-tip'));
  b.addEventListener('click', () => { place = p.slice(2, 7); if (p[7] !== undefined && p[7] < 3) go(p[7], p); else { info(); } });
  b._p = p; layer.appendChild(b);
}));

function labels(){
  layers.forEach(l => l.querySelectorAll('.mp-pin').forEach(b => {
    const p = b._p; b.querySelector('.mp-tip').textContent = p[ti() ? 3 : 2];
    b.setAttribute('aria-label', `${p[ti() ? 3 : 2]} — ${p[ti() ? 5 : 4]}`);
  }));
}
function info(){
  const L = LEVELS[lv]; card.replaceChildren();
  card.appendChild(el('p', 'mp-k', ti() ? `ደረጃ ${['፩','፪','፫','፬'][lv]}` : `Step ${lv + 1} of 4`));
  card.appendChild(el('h3', '', L.t[ti() ? 1 : 0]));
  card.appendChild(el('p', 'mp-d', L.d[ti() ? 1 : 0]));
  if (lv === 2){
    // every place on the Eparchy map, as buttons
    const chips = el('div', 'mp-chips');
    LEVELS[2].pins.forEach(p => {
      const c = el('button', '', p[ti() ? 3 : 2]); c.type = 'button';
      c.setAttribute('aria-pressed', p[2] === place[0]);
      c.addEventListener('click', () => { place = p.slice(2, 7); info(); });
      chips.appendChild(c);
    });
    card.appendChild(chips);
  }
  if (lv >= 1){
    const pl = el('div', 'mp-place');
    pl.append(el('strong', '', place[ti() ? 1 : 0]), el('span', '', place[ti() ? 3 : 2]));
    card.appendChild(pl);
  }
  const acts = el('p', 'mp-acts');
  if (lv < 3 && LEVELS[lv].pins.length){
    const door = LEVELS[lv].pins.find(p => p[7] !== undefined);
    const nx = el('button', 'btn btn-red', ti() ? 'ቀሪብኩም ርኣዩ' : 'Come closer'); nx.type = 'button';
    // on the Eparchy map, 'come closer' goes to space over the place chosen there (Keren unless another was chosen)
    nx.addEventListener('click', () => go(door[7], lv === 2 ? (LEVELS[2].pins.find(p => p[2] === place[0]) || door) : door));
    acts.appendChild(nx);
  }
  const ge = el('a', 'r-btn mp-earth'); ge.href = earth(place[4]); ge.target = '_blank'; ge.rel = 'noopener';
  ge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>';
  ge.append(ti() ? `${place[1]} ብGoogle Earth` : `${place[0]} in Google Earth`);
  acts.appendChild(ge);
  if (lv > 0){
    const back = el('button', 'mp-back', ti() ? '← ንድሕሪት' : '← Back'); back.type = 'button';
    back.addEventListener('click', () => go(lv - 1)); acts.appendChild(back);
  }
  card.appendChild(acts);
}
function go(n, from){
  n = Math.max(0, Math.min(3, n));
  if (n === 3){
    const src = satSrc(place[4]); if (sat.getAttribute('src') !== src) sat.src = src;
    // shown behind the map: if a browser blocks the map, this link still opens it
    const fb = document.getElementById('mp-sat-fb'); fb.href = satLink(place[4]);
    fb.textContent = ti() ? `${place[1]} ብGoogle Maps ክፈቱ` : `Open ${place[0]} in Google Maps`;
  }
  const old = layers[lv], nu = layers[n];
  if (n !== lv){
    // zoom into the chosen place (or out of it) while the next map fades in
    const x = from ? from[0] : 50, y = from ? from[1] : 50;
    old.style.transformOrigin = nu.style.transformOrigin = `${x}% ${y}%`;
    stage.classList.toggle('is-out', n < lv);
    old.classList.remove('is-on'); old.classList.add('is-off');
    nu.classList.remove('is-off'); nu.classList.add('is-on');
    setTimeout(() => old.classList.remove('is-off'), still.matches ? 0 : 700);
  }
  lv = n;
  box.querySelectorAll('.mp-steps button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.go === n));
  info();
}
box.querySelectorAll('.mp-steps button').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
document.addEventListener('langchange', () => { labels(); info(); });
labels(); info();
})();
