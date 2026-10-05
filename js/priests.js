/* ============================================================
   PRIESTS PAGE (priests.html) — numbers, ordination anniversaries,
   letter index (A–Z / Ge'ez fidel), role + deanery filters, cards
   that turn over, side profile with ← →.
   Data: data/eparchy.json → priests (Admin page → Eparchy → Priests);
   deanery comes from the priest's parish (data/parishes.json).
   ============================================================ */
(function(){
'use strict';
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const G = () => window.GeezCal;
const DEANERY_NAMES = { keren: ['Keren', 'ከረን'], habinmentel: ['Habinmentel', 'ሓቢንመንተል'], hagaz: ['Hagaz', 'ሓጋዝ'] };

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const L = () => isTi() ? {
  all: 'ኩሎም', allDean: 'ኩሎም መካናት', none: 'ዝተረኽበ የለን።', count: n => `${n} ካህናት`, sample: 'ኣብነት',
  parish: 'ቍምስና', ordained: 'ዝተሰየሙሉ', feast: 'በዓል ስም', years: n => `${n} ዓመት ክህነት`, soon: 'ሓጺር ታሪኽ ህይወት ቀልጢፉ ክውሰኽ እዩ።',
  thanks: m => `ኣብዚ ${m} ነመስግን`, jub: n => `${n} ዓመት`, decade: d => `${d}ታት`, noDate: 'ዕለት ሲመት ዘይተፈልጠ',
  seeParish: 'ቍምስና ርኣዩ', clear: 'ኩሉ', months: ['ጥሪ','ለካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰነ','ሓምለ','ነሓሰ','መስከረም','ጥቅምቲ','ሕዳር','ታሕሳስ']
} : {
  all: 'All', allDean: 'All deaneries', none: 'No priests found.', count: n => `${n} priests`, sample: 'Example',
  parish: 'Parish', ordained: 'Ordained', feast: 'Feast day', years: n => `${n} years a priest`, soon: 'A short biography will be added here.',
  thanks: m => `This ${m} we give thanks`, jub: n => `${n} years`, decade: d => `${d}s`, noDate: 'Ordination date to be added',
  seeParish: 'See the parish', clear: 'All', months: MONTHS
};

/* ---------- data ---------- */
let P = ((typeof EPARCHY !== 'undefined' && EPARCHY && EPARCHY.priests) || []).slice();
const PARISHES = ((typeof PARISHES_DATA !== 'undefined' && PARISHES_DATA && PARISHES_DATA.parishes) || []);


// deanery of a priest = deanery of his parish
function deanery(p){
  if (p._dean) return { name: p._dean, name_ti: p._dean_ti };
  const par = PARISHES.find(x => x.name && p.place && p.place.toLowerCase().includes(x.name.toLowerCase()));
  if (!par || !par.deanery) return null;
  const n = DEANERY_NAMES[par.deanery] || [par.deanery, par.deanery_ti];
  return { name: par.deanery, label: n[0], label_ti: n[1] };
}
const nameKey = p => tr(p, 'name').replace(/^(Abba|Fr\.?|Father|ኣባ|አባ)\s*[—-]?\s*/i, '').trim();
// first letter: A–Z, or the base consonant of a Ge'ez syllable (ኣ → አ)
function initial(p){
  const c = nameKey(p).charAt(0); if (!c) return '';
  const cp = c.codePointAt(0);
  if (cp >= 0x1200 && cp <= 0x137F) return String.fromCodePoint(cp - ((cp - 0x1200) % 8));
  return c.toUpperCase();
}
const FIDEL = 'ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ'.split('');
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const year = p => p.ordained ? Number(p.ordained.slice(0, 4)) : null;
function dateText(s){
  if (!s) return '';
  const [y, m, d] = s.split('-').map(Number);
  let out = isTi() ? `${d} ${L().months[m - 1]} ${y}` : `${d} ${MONTHS[m - 1]} ${y}`;
  if (G()){ const e = G().jdnToEt(G().grToJdn(y, m, d)); out += ` · ${G().geez(e.d)} ${G().MONTHS_TI[e.m - 1]} ${G().geez(e.y)}`; }
  return out;
}

/* ---------- state ---------- */
const S = { q: '', role: 'all', dean: '', letter: '', sort: 'old' };
const $ = id => document.getElementById(id);

/* ---------- numbers (count up once) ---------- */
function renderStats(){
  const now = new Date().getFullYear();
  const v = { priests: P.length, parishes: new Set(P.map(p => p.place).filter(Boolean)).size,
              recent: P.filter(p => year(p) && now - year(p) < 10).length };
  document.querySelectorAll('[data-stat]').forEach(n => {
    const to = v[n.dataset.stat] || 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){ n.textContent = to; return; }
    const t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 900); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

/* ---------- this month we give thanks ---------- */
function renderThanks(){
  const now = new Date(), m = now.getMonth() + 1;
  const list = P.filter(p => p.ordained && Number(p.ordained.slice(5, 7)) === m)
    .sort((a, b) => a.ordained.slice(8).localeCompare(b.ordained.slice(8)));
  $('pr-thanks').hidden = !list.length;
  $('pr-thanks-title').textContent = L().thanks(L().months[m - 1]);
  $('pr-thanks-list').replaceChildren(...list.map(p => {
    const yrs = now.getFullYear() - year(p);
    const li = el('li'); const b = el('button', 'pr-thank'); b.type = 'button'; b.dataset.open = P.indexOf(p);
    b.append(el('strong', '', tr(p, 'name')), el('span', 'pr-yrs' + (yrs % 25 === 0 ? ' is-jub' : ''), L().jub(yrs)));
    li.appendChild(b); return li;
  }));
}

/* ---------- filters ---------- */
function filtered(ignoreLetter){
  const f = S.q.trim().toLowerCase();
  return P.filter(p => (S.role === 'all' || tr(p, 'role') === S.role)
    && (!S.dean || (deanery(p) && deanery(p).name === S.dean))
    && (ignoreLetter || !S.letter || initial(p) === S.letter)
    && (!f || [p.name, p.name_ti, p.role, p.role_ti, p.place, p.place_ti].some(v => (v || '').toLowerCase().includes(f))));
}
function renderRoles(){
  const roles = [...new Set(P.map(p => tr(p, 'role')).filter(Boolean))];
  $('pr-roles').replaceChildren(...['all', ...roles].map(r => {
    const n = r === 'all' ? P.length : P.filter(p => tr(p, 'role') === r).length;
    const b = el('button', 'chip-filter', `${r === 'all' ? L().all : r} (${n})`); b.type = 'button';
    b.setAttribute('aria-pressed', String(S.role === r));
    b.onclick = () => { S.role = r; renderRoles(); renderList(); };
    return b;
  }));
}
function renderDeans(){
  const seen = new Map(); P.forEach(p => { const d = deanery(p); if (d && !seen.has(d.name)) seen.set(d.name, d); });
  const sel = $('pr-dean'); sel.replaceChildren();
  const o0 = el('option', '', L().allDean); o0.value = ''; sel.appendChild(o0);
  seen.forEach(d => { const o = el('option', '', tr(d, 'label')); o.value = d.name; sel.appendChild(o); });
  sel.value = S.dean; sel.closest('label').hidden = !seen.size;
}
function renderIndex(){
  const have = new Set(filtered(true).map(initial));
  const letters = isTi() ? FIDEL : AZ;
  const box = $('pr-index'); box.replaceChildren();
  const all = el('button', 'pr-l pr-l-all', L().clear); all.type = 'button'; all.setAttribute('aria-pressed', String(!S.letter));
  all.onclick = () => { S.letter = ''; renderIndex(); renderList(); }; box.appendChild(all);
  letters.forEach(c => {
    const b = el('button', 'pr-l', c); b.type = 'button'; if (isTi()) b.lang = 'ti';
    b.disabled = !have.has(c); b.setAttribute('aria-pressed', String(S.letter === c));
    b.onclick = () => { S.letter = S.letter === c ? '' : c; renderIndex(); renderList(); };
    box.appendChild(b);
  });
}

/* ---------- cards that turn over ---------- */
const PH = ['ph-navy', 'ph-red', 'ph-ochre', 'ph-green'];
function card(p, i){
  const idx = P.indexOf(p);
  const b = el('button', 'pc-flip'); b.type = 'button'; b.dataset.open = idx;
  b.setAttribute('aria-label', [tr(p, 'name'), tr(p, 'role'), tr(p, 'place')].filter(Boolean).join(', '));
  const inner = el('span', 'pc-in');
  const front = el('span', 'pc-front');
  const arch = el('span', 'pc-arch' + (p.photo ? '' : ' ph ' + PH[idx % PH.length]));
  if (p.photo) arch.style.backgroundImage = `url("${p.photo}")`; else arch.appendChild(el('span', 'pc-ini', initial(p)));
  front.append(arch, el('strong', 'pc-name', tr(p, 'name')), el('span', 'pc-role', tr(p, 'role')));
  if (p.sample) front.appendChild(el('span', 'sample-tag', L().sample));
  const back = el('span', 'pc-back'); back.setAttribute('aria-hidden', 'true');
  const y = year(p);
  back.appendChild(el('span', 'pc-b-label', L().ordained));
  back.appendChild(el('span', 'pc-b-year', y ? String(y) : '—'));
  if (y && G()) back.appendChild(el('span', 'pc-b-ge', G().geez(G().jdnToEt(G().grToJdn(...p.ordained.split('-').map(Number))).y) + ' ዓ.ም.'));
  if (tr(p, 'place')){ back.appendChild(el('span', 'pc-b-label', L().parish)); back.appendChild(el('span', 'pc-b-val', tr(p, 'place'))); }
  if (tr(p, 'feast')){ back.appendChild(el('span', 'pc-b-label', L().feast)); back.appendChild(el('span', 'pc-b-val', tr(p, 'feast'))); }
  inner.append(front, back); b.appendChild(inner);
  return b;
}
let shown = [];
function renderList(){
  const list = filtered(false);
  const k = { old: (a, b) => (a.ordained || '9999').localeCompare(b.ordained || '9999'),
              new: (a, b) => (b.ordained || '0000').localeCompare(a.ordained || '0000'),
              az: (a, b) => nameKey(a).localeCompare(nameKey(b)) }[S.sort];
  list.sort(k); shown = list;
  const grid = $('pr-grid'); grid.replaceChildren();
  let group = null;
  list.forEach((p, i) => {
    const g = S.sort === 'az' ? initial(p) : (year(p) ? L().decade(Math.floor(year(p) / 10) * 10) : L().noDate);
    if (g !== group){ group = g; grid.appendChild(el('h3', 'pr-group', g)); }
    grid.appendChild(card(p, i));
  });
  if (!list.length) grid.appendChild(el('p', 'muted', L().none));
  $('pr-count').textContent = L().count(list.length);
}

/* ---------- profile (side page, ← →) ---------- */
const sheet = $('pr-sheet'); let cur = -1;
function openProfile(idx){
  const p = P[idx]; if (!p || !sheet) return;
  cur = shown.indexOf(p); if (cur < 0){ shown = P.slice(); cur = idx; }
  const body = $('pr-sheet-body'); body.replaceChildren();
  const head = el('header', 'bi-sheet-head');
  const arch = el('span', 'bi-arch' + (p.photo ? '' : ' ph ' + PH[idx % PH.length]));
  if (p.photo) arch.style.backgroundImage = `url("${p.photo}")`; else arch.appendChild(el('span', 'pc-ini', initial(p)));
  const t = el('div');
  t.appendChild(el('p', 'eyebrow eyebrow-red', tr(p, 'role')));
  const h = el('h2', '', tr(p, 'name')); h.id = 'pr-sheet-name'; t.appendChild(h);
  if (year(p)) t.appendChild(el('p', 'bishop-title', L().years(new Date().getFullYear() - year(p))));
  head.append(arch, t); body.appendChild(head);
  const dl = el('dl', 'facts');
  const row = (k, v) => { if (!v) return; const d = el('div'); d.append(el('dt', '', k), el('dd', '', v)); dl.appendChild(d); };
  row(L().parish, tr(p, 'place'));
  row(L().ordained, dateText(p.ordained));
  row(L().feast, tr(p, 'feast'));
  const dn = deanery(p); row(isTi() ? 'መካን' : 'Deanery', dn ? tr(dn, 'label') : '');
  body.appendChild(dl);
  const bio = String(tr(p, 'bio') || '').split(/\n\s*\n/).filter(Boolean);
  if (bio.length) bio.forEach(x => body.appendChild(el('p', '', x.trim()))); else body.appendChild(el('p', 'muted', L().soon));
  if (p.place){ const a = el('a', 'r-btn', L().seeParish); a.href = 'parishes.html?q=' + encodeURIComponent(p.place) + '#parishes'; body.appendChild(a); }
  $('pr-pos').textContent = `${cur + 1} / ${shown.length}`;
  if (!sheet.open) sheet.showModal();
  sheet.scrollTop = 0;
}
function step(d){ if (!shown.length) return; cur = (cur + d + shown.length) % shown.length; openProfile(P.indexOf(shown[cur])); }
document.addEventListener('click', e => { const t = e.target.closest('[data-open]'); if (t) openProfile(Number(t.dataset.open)); });
if (sheet){
  sheet.querySelector('.bi-x').onclick = () => sheet.close();
  sheet.querySelector('.pr-prev').onclick = () => step(-1);
  sheet.querySelector('.pr-next').onclick = () => step(1);
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
}

/* ---------- toolbar ---------- */
$('pr-q').addEventListener('input', e => { S.q = e.target.value; renderIndex(); renderList(); });
$('pr-dean').addEventListener('change', e => { S.dean = e.target.value; renderIndex(); renderList(); });
$('pr-sort').addEventListener('change', e => { S.sort = e.target.value; renderList(); });

function renderAll(){ renderThanks(); renderRoles(); renderDeans(); renderIndex(); renderList(); }
document.addEventListener('langchange', () => { S.letter = ''; renderAll(); });
renderStats(); renderAll();
})();

/* ---- Eparchy tabs: on phones, scroll the active tab into view ---- */
(function(){ const a = document.querySelector('.ep-tabs a.active'); if (a){ const ul = a.closest('ul'); ul.scrollLeft = a.parentElement.offsetLeft - 16; } })();
