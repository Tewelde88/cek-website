/* ============================================================
   LITURGICAL CALENDAR — Ge'ez rite (Ethiopian calendar) with Gregorian dates
   ------------------------------------------------------------
   • Dates are converted through Julian Day Numbers (JDN), so the
     calendar works for any year.
   • Easter (Fasika) is computed with the Alexandrian computus
     (Julian-calendar Easter), as used by the Ethiopian and Eritrean
     Churches; the movable feasts and fasts are counted from it.
   • To ADD or CHANGE a fixed feast, edit FIXED_FEASTS below
     (Ethiopian month 1–13, day, key, rank) and add its name in
     NAMES.en and NAMES.ti.
   ============================================================ */
(function(){
'use strict';

/* ---------- 1. Calendar arithmetic ---------- */
const ET_EPOCH = 1723856;   // JDN offset of the Ethiopian (Amete Mihret) era

// Ethiopian date → JDN   (month 1 = Meskerem … 13 = Pagume)
function etToJdn(y, m, d){ return ET_EPOCH + 365 + 365*(y-1) + Math.floor(y/4) + 30*m + d - 31; }
// JDN → Ethiopian date
function jdnToEt(j){
  const r = (j - ET_EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const y = 4 * Math.floor((j - ET_EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  return { y, m: Math.floor(n / 30) + 1, d: (n % 30) + 1 };
}
// Gregorian ↔ JDN
function grToJdn(y, m, d){
  const t = new Date(0); t.setUTCFullYear(y, m - 1, d);
  return Math.floor(t.getTime() / 864e5) + 2440588;
}
function jdnToGr(j){
  const t = new Date((j - 2440588) * 864e5);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
// Julian calendar → JDN (needed for the Easter computation)
function juToJdn(y, m, d){
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12*a - 3;
  return d + Math.floor((153*mm + 2) / 5) + 365*yy + Math.floor(yy/4) - 32083;
}
const weekday = j => (j + 1) % 7;                     // 0 = Sunday … 6 = Saturday
const pagumeDays = y => (y % 4 === 3) ? 6 : 5;        // Ethiopian leap year
const monthDays = (y, m) => m === 13 ? pagumeDays(y) : 30;

// Easter (Fasika) of a given Gregorian year — Alexandrian computus, Julian calendar
function easterJdn(gYear){
  const a = gYear % 4, b = gYear % 7, c = gYear % 19;
  const d = (19*c + 15) % 30, e = (2*a + 4*b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31), day = ((d + e + 114) % 31) + 1;
  return juToJdn(gYear, month, day);
}

/* ---------- 2. Feasts and fasts ---------- */
// [Ethiopian month, day, key, rank]   rank: 'major' (red) or 'feast' (gold)
const FIXED_FEASTS = [
  [1, 1,  'newyear',      'major'],
  [1, 16, 'demera',       'feast'],
  [1, 17, 'meskel',       'major'],
  [3, 6,  'qusquam',      'feast'],
  [3, 12, 'michael',      'feast'],
  [3, 21, 'tsion',        'feast'],
  [4, 3,  'baata',        'feast'],
  [4, 19, 'gabriel',      'feast'],
  /* Christmas (Lidet) is added in yearData(): 29 Tahsas, or 28 Tahsas after a leap year */
  [5, 6,  'gizret',       'feast'],
  [5, 10, 'ketera',       'feast'],
  [5, 11, 'timket',       'major'],
  [5, 12, 'cana',         'feast'],
  [5, 21, 'astero',       'feast'],
  [7, 29, 'annunciation', 'major'],
  [9, 1,  'lideta',       'feast'],
  [10, 12,'michael',      'feast'],
  [11, 5, 'peterpaul',    'feast'],
  [11, 7, 'trinity',      'feast'],
  [11, 19,'gabriel',      'feast'],
  [12, 13,'tabor',        'major'],
  [12, 16,'filseta',      'major'],
];
// [days from Easter, key, rank]   rank 'fast' = first day of a fast
const MOVABLE_FEASTS = [
  [-69, 'nineveh',   'fast'],
  [-55, 'lent',      'fast'],
  [-28, 'debrezeit', 'feast'],
  [-7,  'hosanna',   'major'],
  [-3,  'holythu',   'feast'],
  [-2,  'siklet',    'major'],
  [0,   'fasika',    'major'],
  [39,  'erget',     'major'],
  [49,  'pentecost', 'major'],
  [50,  'apostles',  'fast'],
];

const cache = {};
function yearData(y){
  if (cache[y]) return cache[y];
  const days = {};                 // jdn → { feasts:[{key,rank}], fast:key, season:key }
  const at = j => (days[j] = days[j] || { feasts: [] });
  const addFeast = (j, key, rank) => at(j).feasts.push({ key, rank });
  const fasts = [];                // { key, from, to }
  const addFast = (key, from, to) => {
    if (to < from) return;
    fasts.push({ key, from, to });
    for (let j = from; j <= to; j++) at(j).fast = key;
  };

  FIXED_FEASTS.forEach(([m, d, key, rank]) => addFeast(etToJdn(y, m, d), key, rank));
  const lidet = etToJdn(y, 4, (y % 4 === 0) ? 28 : 29);
  addFeast(lidet, 'lidet', 'major');

  const E = easterJdn(y + 8);      // Easter of Ethiopian year y falls in Gregorian year y+8
  MOVABLE_FEASTS.forEach(([off, key, rank]) => addFeast(E + off, key, rank));

  addFast('advent',   etToJdn(y, 3, 15), lidet - 1);
  addFast('nineveh',  E - 69, E - 67);
  addFast('lent',     E - 55, E - 1);
  addFast('apostles', E + 50, etToJdn(y, 11, 4));
  addFast('filseta',  etToJdn(y, 12, 1), etToJdn(y, 12, 15));
  for (let j = E; j <= E + 49; j++) at(j).season = 'easter';

  fasts.sort((a, b) => a.from - b.from);
  return (cache[y] = { days, fasts, easter: E });
}
/* ---------- 2b. Sundays: the Yared hymn name, or else the season (ዘመን) ----------
   Sundays named after St Yared's hymns, counted from Easter (days before/after).
   Other Sundays are called by their season. The season boundaries below follow the
   usual Ge'ez reckoning and are TO BE CHECKED by the Eparchy — edit the dates here. */
const SUNDAY_NAMES = { '-56': 'zewerede', '-49': 'qidist', '-42': 'mekurab', '-35': 'metsagu', '-28': 'debrezeit',
  '-21': 'gebrher', '-14': 'niqodimos', '-7': 'hosanna', '0': 'fasika', '7': 'dagim', '49': 'pentecost' };
function seasonOf(j){
  const et = jdnToEt(j), y = et.y, E = yearData(y).easter;
  const lidet = etToJdn(y, 4, (y % 4 === 0) ? 28 : 29);
  if (j >= E - 56 && j < E) return 'tsom';                                  // Great Lent (from Zewerede Sunday)
  if (j >= E && j <= E + 49) return 'tinsae';                               // the fifty days of Easter
  const at = (m, d) => etToJdn(y, m, d);
  if (j < at(1, 17)) return 'yohannes';                                     // 1 – 16 Meskerem
  if (j < at(1, 26)) return 'meskel';                                       // 17 – 25 Meskerem
  if (j < at(3, 6))  return 'tsige';                                        // 26 Meskerem – 5 Hidar
  if (j < lidet)     return 'sibket';                                       // 6 Hidar – Christmas Eve
  if (j < at(5, 11)) return 'lidet';                                        // Christmas – 10 Tir
  if (j < E - 56)    return 'timket';                                       // 11 Tir – before Lent
  if (j < at(10, 26)) return 'hawaryat';                                    // after Pentecost – 25 Sene
  return 'kremt';                                                           // 26 Sene – Pagume
}
function sundayOf(j){
  if (weekday(j) !== 0) return null;
  const k = SUNDAY_NAMES[String(j - yearData(jdnToEt(j).y).easter)];
  const season = seasonOf(j);
  let n = 1; while (seasonOf(j - 7 * n) === season && n < 30) n++;          // the n-th Sunday of its season
  const out = k ? { key: k, season, n, name: N().sundays[k], named: true } : { key: '', season, n, name: N().times[season], named: false };
  // the Admin page (data/lectionary.json) can give the Sunday its hymn name, theme and readings
  const e = lectionaryFor(out);
  if (e){
    out.entry = e;
    const nm = (isTi() && e.name_ti) ? e.name_ti : e.name;
    if (nm){ out.name = nm; out.named = true; }
  }
  return out;
}
const isTi = () => document.documentElement.lang === 'ti';
let LECTIONARY = [];
function lectionaryFor(s){
  return LECTIONARY.find(e => e && ((e.sunday && e.sunday === s.key) || (!e.sunday && e.season === s.season && +e.n === s.n))) || null;
}
function infoFor(j){
  const et = jdnToEt(j);
  return yearData(et.y).days[j] || { feasts: [] };
}

/* ---------- 3. Names (English / Tigrinya) ---------- */
const NAMES = {
  en: {
    months: ['Meskerem','Tiqimti','Hidar','Tahsas','Tiri','Lekatit','Megabit','Miyazya','Ginbot','Sene','Hamle','Nehase','Pagume'],
    wd: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    wdShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    grMonths: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    grShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    era: 'E.C.', gr: 'Gregorian', et: 'Ethiopian',
    today: 'Today', fastDay: 'Fast day', none: 'No feasts this month.', noFeast: 'No major feast today.',
    invalid: 'Please enter a valid date.', range: '–', dayOf: 'days',
    soon: { today: 'Today', tomorrow: 'Tomorrow', inDays: n => `in ${n} days` }, more: n => `See more (${n})`, less: 'See less',
    feasts: {
      newyear: 'New Year · St John the Baptist', demera: 'Demera — Eve of the Holy Cross',
      meskel: 'Meskel — Finding of the Holy Cross', qusquam: 'Qusquam — Holy Family in Egypt',
      michael: 'St Michael the Archangel', tsion: 'Hidar Tsion — St Mary of Zion',
      baata: 'Presentation of Mary in the Temple', gabriel: 'St Gabriel the Archangel',
      lidet: 'Lidet — Christmas', gizret: 'Circumcision of the Lord', ketera: 'Ketera — Eve of Epiphany',
      timket: 'Timket — Epiphany', cana: 'Wedding at Cana', astero: 'Dormition of Mary',
      annunciation: 'Annunciation', lideta: 'Nativity of Mary', peterpaul: 'Sts Peter and Paul',
      trinity: 'Holy Trinity', tabor: 'Debre Tabor — Transfiguration', filseta: 'Filseta — Assumption of Mary',
      nineveh: 'Fast of Nineveh begins', lent: 'Great Lent begins', debrezeit: 'Debre Zeit — Mid-Lent',
      hosanna: 'Hosanna — Palm Sunday', holythu: 'Holy Thursday', siklet: 'Siklet — Good Friday',
      fasika: 'Fasika — Easter', erget: 'Erget — Ascension', pentecost: 'Pentecost',
      apostles: 'Fast of the Apostles begins'
    },
    fasts: {
      advent: 'Fast of the Prophets (Advent)', nineveh: 'Fast of Nineveh', lent: 'Great Lent',
      apostles: 'Fast of the Apostles', filseta: 'Fast of the Assumption'
    },
    seasons: { easter: 'Fifty Days of Easter' },
    readings: { paul: 'Pauline epistle', catholic: 'Catholic epistle', acts: 'Acts of the Apostles', psalm: 'Psalm (Misbak)', gospel: 'Gospel' },
    sunday: 'Sunday', nextSunday: n => n === 0 ? 'Today is Sunday' : n === 1 ? 'Tomorrow, Sunday' : `Next Sunday, in ${n} days`, hymn: 'Sunday of',
    sundays: { zewerede: 'Zewerede', qidist: 'Qidist', mekurab: 'Mekurab', metsagu: 'Metsagu', debrezeit: 'Debre Zeit', gebrher: 'Gebr Her',
      niqodimos: 'Niqodimos', hosanna: 'Hosanna', fasika: 'Fasika — Easter', dagim: 'Dagim Tinsae — Second Easter', pentecost: 'Pentecost' },
    times: { yohannes: 'Season of St John', meskel: 'Season of the Cross', tsige: 'Season of Flowers (Tsige)', sibket: 'Season of Advent (Sibket)',
      lidet: 'Season of Christmas', timket: 'Season of Epiphany', tsom: 'Great Lent', tinsae: 'Season of the Resurrection',
      hawaryat: 'Season of the Apostles', kremt: 'Rainy Season (Kremt)' }
  },
  ti: {
    months: ['መስከረም','ጥቅምቲ','ሕዳር','ታሕሳስ','ጥሪ','ለካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰነ','ሓምለ','ነሓሰ','ጳጉሜን'],
    wd: ['ሰንበት','ሰኑይ','ሰሉስ','ረቡዕ','ሓሙስ','ዓርቢ','ቀዳም'],
    wdShort: ['ሰን','ሰኑ','ሰሉ','ረቡ','ሓሙ','ዓር','ቀዳ'],
    grMonths: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    grShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    era: 'ዓ.ም.', gr: 'ግሪጎርያን', et: 'ግእዝ',
    today: 'ሎሚ', fastDay: 'መዓልቲ ጾም', none: 'ኣብዚ ወርሒ በዓል የለን።', noFeast: 'ሎሚ ዓቢ በዓል የለን።',
    invalid: 'በጃኹም ቅኑዕ ዕለት ኣእትዉ።', range: '–', dayOf: 'መዓልቲ',
    soon: { today: 'ሎሚ', tomorrow: 'ጽባሕ', inDays: n => `ድሕሪ ${n} መዓልቲ` }, more: n => `ተወሳኺ ርኣዩ (${n})`, less: 'ኣሕጽሩ',
    feasts: {
      newyear: 'ርእሰ ዓመት · ቅዱስ ዮሓንስ', demera: 'ደመራ', meskel: 'መስቀል — ርክበ መስቀል',
      qusquam: 'ደብረ ቍስቋም', michael: 'ቅዱስ ሚካኤል', tsion: 'ሕዳር ጽዮን', baata: 'በኣታ ማርያም',
      gabriel: 'ቅዱስ ገብርኤል', lidet: 'ልደት', gizret: 'ግዝረት', ketera: 'ከተራ', timket: 'ጥምቀት',
      cana: 'ቃና ዘገሊላ', astero: 'ኣስተርእዮ ማርያም', annunciation: 'ብስራት', lideta: 'ልደታ ማርያም',
      peterpaul: 'ጴጥሮስን ጳውሎስን', trinity: 'ቅድስት ሥላሴ', tabor: 'ደብረ ታቦር', filseta: 'ፍልሰታ ማርያም',
      nineveh: 'ጾመ ነነዌ ይጅምር', lent: 'ዓቢይ ጾም ይጅምር', debrezeit: 'ደብረ ዘይት', hosanna: 'ሆሳዕና',
      holythu: 'ሓሙስ ጸሎት', siklet: 'ዓርቢ ስቅለት', fasika: 'ፋሲካ — ትንሣኤ', erget: 'ዕርገት',
      pentecost: 'ጰራቅሊጦስ', apostles: 'ጾመ ሓዋርያት ይጅምር'
    },
    fasts: { advent: 'ጾመ ነቢያት', nineveh: 'ጾመ ነነዌ', lent: 'ዓቢይ ጾም', apostles: 'ጾመ ሓዋርያት', filseta: 'ጾመ ፍልሰታ' },
    seasons: { easter: 'ሓምሳ መዓልቲ ትንሣኤ' },
    readings: { paul: 'ጳውሎስ', catholic: 'ሓዋርያት', acts: 'ግብረ ሓዋርያት', psalm: 'ምስባክ', gospel: 'ወንጌል' },
    sunday: 'ሰንበት', nextSunday: n => n === 0 ? 'ሎሚ ሰንበት' : n === 1 ? 'ጽባሕ ሰንበት' : `ዝመጽእ ሰንበት፡ ድሕሪ ${n} መዓልቲ`, hymn: 'ሰንበት',
    sundays: { zewerede: 'ዘወረደ', qidist: 'ቅድስት', mekurab: 'ምኵራብ', metsagu: 'መጻጕዕ', debrezeit: 'ደብረ ዘይት', gebrher: 'ገብር ኄር',
      niqodimos: 'ኒቆዲሞስ', hosanna: 'ሆሳዕና', fasika: 'ፋሲካ — ትንሣኤ', dagim: 'ዳግም ትንሣኤ', pentecost: 'ጰራቅሊጦስ' },
    times: { yohannes: 'ዘመነ ዮሐንስ', meskel: 'ዘመነ መስቀል', tsige: 'ዘመነ ጽጌ', sibket: 'ዘመነ ስብከት', lidet: 'ዘመነ ልደት',
      timket: 'ዘመነ ጥምቀት', tsom: 'ዘመነ ጾም', tinsae: 'ዘመነ ትንሣኤ', hawaryat: 'ዘመነ ሓዋርያት', kremt: 'ዘመነ ክረምት' }
  }
};
const N = () => NAMES[document.documentElement.lang === 'ti' ? 'ti' : 'en'];
const shortName = key => N().feasts[key].split(' — ')[0];
const fmtEt = (et, withYear = true) => `${et.d} ${N().months[et.m - 1]}` + (withYear ? ` ${et.y} ${N().era}` : '');
const fmtGr = (g, long = true) => long ? `${g.d} ${N().grMonths[g.m - 1]} ${g.y}` : `${g.d} ${N().grShort[g.m - 1]}`;

// Shared with the Home page year scroll (js/yearscroll.js); also handy in the browser console
window.LiturgicalCalendar = { etToJdn, jdnToEt, grToJdn, jdnToGr, easterJdn, yearData, NAMES, weekday, monthDays };

/* ---------- 4. Page ---------- */
const $ = id => document.getElementById(id);
if (!$('today-et')) return;                    // pages without a calendar only use the data above
const FULL = !!$('cal-grid');                  // calendar.html: the whole calendar; liturgy.html: today + next feasts
const now = new Date();
const todayJ = grToJdn(now.getFullYear(), now.getMonth() + 1, now.getDate());
const todayEt = jdnToEt(todayJ);
const state = { y: todayEt.y, m: todayEt.m, sel: todayJ };

function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function feastLines(info, j){
  const out = info.feasts.map(f => ({ text: N().feasts[f.key], cls: 'rank-' + f.rank }));
  const sun = j !== undefined && sundayOf(j);
  if (sun && !info.feasts.some(f => N().feasts[f.key].startsWith(sun.name.split(' — ')[0]))) out.unshift({ text: (sun.named ? N().hymn + ' ' : N().sunday + ' · ') + sun.name, cls: 'is-sunday' });
  if (info.fast) out.push({ text: N().fasts[info.fast], cls: 'is-fastline' });
  if (info.season) out.push({ text: N().seasons[info.season], cls: 'is-season' });
  return out;
}

function renderToday(){
  const g = jdnToGr(todayJ);
  $('today-et').textContent = fmtEt(todayEt);
  $('today-wd').textContent = N().wd[weekday(todayJ)];
  $('today-gr').textContent = `${N().gr}: ${fmtGr(g)}`;
  const box = $('today-feast'); box.replaceChildren();
  const lines = feastLines(infoFor(todayJ), todayJ);
  if (!lines.length) box.appendChild(el('li', 'muted', N().noFeast));
  lines.forEach(l => box.appendChild(el('li', l.cls, l.text)));
  // the coming Sunday and its name
  const toSun = (7 - weekday(todayJ)) % 7, s = sundayOf(todayJ + toSun);
  if (toSun) box.appendChild(el('li', 'is-sunday', `${N().nextSunday(toSun)}: ${s.name}`));
}

function renderMonth(){
  const { y, m } = state;
  const first = etToJdn(y, m, 1), n = monthDays(y, m), last = first + n - 1;
  const g1 = jdnToGr(first), g2 = jdnToGr(last);
  $('cal-title').textContent = `${N().months[m - 1]} ${y} ${N().era}`;
  $('cal-sub').textContent = `${fmtGr(g1, false)} ${g1.y !== g2.y ? g1.y + ' ' : ''}${N().range} ${fmtGr(g2, false)} ${g2.y}`;

  const head = $('cal-head'); head.replaceChildren();
  [0,1,2,3,4,5,6].forEach(w => {               // week starts on Sunday (ሰንበት), as in the Ge'ez week: ሰኑይ is the second day
    const c = el('div', 'wd' + (w === 0 ? ' is-sun' : ''), N().wdShort[w]);
    c.title = N().wd[w]; head.appendChild(c);
  });

  const grid = $('cal-grid'); grid.replaceChildren();
  const lead = weekday(first);
  for (let i = 0; i < lead; i++) grid.appendChild(el('div', 'day is-blank'));
  for (let d = 1; d <= n; d++){
    const j = first + d - 1, info = infoFor(j), g = jdnToGr(j);
    const b = el('button', 'day');
    b.type = 'button';
    if (j === todayJ) b.classList.add('is-today');
    if (j === state.sel) b.classList.add('is-sel');
    if (info.fast) b.classList.add('is-fast');
    if (weekday(j) === 0) b.classList.add('is-sun');
    const top = info.feasts.find(f => f.rank === 'major') || info.feasts[0];
    if (top) b.classList.add('has-' + top.rank);
    // Day number in Ge'ez numerals (as in church calendars), ordinary digits in the tooltip
    const dn = el('span', 'et-d', window.GeezCal ? window.GeezCal.geez(d) : d); dn.title = String(d);
    b.appendChild(dn);
    b.appendChild(el('span', 'gr-d', fmtGr(g, false)));
    const sun = sundayOf(j);
    if (top) b.appendChild(el('span', 'feast-name', shortName(top.key)));
    else if (sun) b.appendChild(el('span', 'sun-name' + (sun.named ? ' is-named' : ''), sun.named ? sun.name.split(' — ')[0] : sun.name));
    b.setAttribute('aria-label', `${N().wd[weekday(j)]}, ${fmtEt({ y, m, d })} — ${fmtGr(g)}` +
      (info.feasts.length ? ' — ' + info.feasts.map(f => N().feasts[f.key]).join(', ') : ''));
    b.addEventListener('click', () => { state.sel = j; renderMonth(); renderDay(); });
    grid.appendChild(b);
  }

  // Feasts in this month (list under / beside the grid)
  const list = $('month-list'); list.replaceChildren();
  let count = 0;
  for (let j = first; j <= last; j++){
    infoFor(j).feasts.forEach(f => {
      const li = el('li', 'rank-' + f.rank);
      const et = jdnToEt(j), g = jdnToGr(j);
      li.appendChild(el('span', 'ml-date', `${et.d} ${N().months[et.m - 1]}`));
      li.appendChild(el('span', 'ml-name', N().feasts[f.key]));
      li.appendChild(el('span', 'ml-gr', `${N().wd[weekday(j)]} · ${fmtGr(g)}`));
      list.appendChild(li); count++;
    });
  }
  if (!count) list.appendChild(el('li', 'muted', N().none));
}

// Compact view: the next feasts from today (with a countdown)
const UPCOMING_COUNT = 5;
const UPCOMING_SHOWN = 2;                        // the rest open with "See more", so the card is as tall as Today
let upOpen = false;
function renderUpcoming(){
  const ul = $('upcoming'); if (!ul) return;
  ul.replaceChildren();
  let found = 0;
  for (let j = todayJ; j < todayJ + 400 && found < UPCOMING_COUNT; j++){
    infoFor(j).feasts.forEach(f => {
      if (found >= UPCOMING_COUNT) return;
      const n = j - todayJ, et = jdnToEt(j), g = jdnToGr(j);
      const li = el('li', 'rank-' + f.rank);
      const when = el('span', 'up-when', n === 0 ? N().soon.today : n === 1 ? N().soon.tomorrow : N().soon.inDays(n));
      const body = el('span', 'up-body');
      body.appendChild(el('strong', '', N().feasts[f.key]));
      body.appendChild(el('span', 'up-date', `${fmtEt(et, false)} · ${fmtGr(g)}`));
      const btn = el('button', 'up-btn'); btn.type = 'button';
      btn.appendChild(body); btn.appendChild(when);
      btn.addEventListener('click', () => openFullAt(j));
      li.appendChild(btn);
      if (found >= UPCOMING_SHOWN && !upOpen) li.hidden = true;
      ul.appendChild(li); found++;
    });
  }
  // "See more" / "See less" under the list
  const card = ul.closest('.upcoming-card'), box = ul.closest('.cal-compact');
  let more = card && card.querySelector('.up-more');
  if (card && !more){
    more = el('button', 'show-more up-more'); more.type = 'button';
    more.addEventListener('click', () => { upOpen = !upOpen; renderUpcoming(); });
    card.appendChild(more);
  }
  if (more){
    const extra = found - UPCOMING_SHOWN;
    more.hidden = extra <= 0;
    more.setAttribute('aria-expanded', String(upOpen));
    more.textContent = upOpen ? N().less : N().more(extra);
  }
  if (box) box.classList.toggle('is-open', upOpen);
}

// "Show full calendar" / "Show less"
const toggle = $('cal-toggle'), full = $('cal-full');
function setFull(open){
  if (!toggle || !full) return;
  full.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
}
if (toggle) toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setFull(open);
  if (!open) document.getElementById('calendar').scrollIntoView({ block: 'start' });
});
// Clicking an upcoming feast opens the full calendar on that day
function openFullAt(j){
  if (!FULL){ location.href = 'calendar.html#d=' + j; return; }   // the Liturgy page opens the calendar page on that day
  const et = jdnToEt(j);
  state.y = et.y; state.m = et.m; state.sel = j;
  renderMonth(); renderDay(); renderYear(); setFull(true);
  document.querySelector('.month-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDay(){
  const j = state.sel, et = jdnToEt(j), g = jdnToGr(j);
  $('day-et').textContent = fmtEt(et);
  $('day-gr').textContent = `${N().wd[weekday(j)]} · ${fmtGr(g)}`;
  const ul = $('day-feasts'); ul.replaceChildren();
  const lines = feastLines(infoFor(j), j);
  if (!lines.length) ul.appendChild(el('li', 'muted', '—'));
  lines.forEach(l => ul.appendChild(el('li', l.cls, l.text)));
  // a Sunday with readings from the lectionary (Admin page)
  const box = $('day-readings'); if (!box) return;
  box.replaceChildren(); box.hidden = true;
  const sun = sundayOf(j), e = sun && sun.entry; if (!e) return;
  const tr = f => (isTi() && e[f + '_ti']) ? e[f + '_ti'] : (e[f] || '');
  if (tr('theme')) box.appendChild(el('p', 'rd-theme', tr('theme')));
  const dl = el('dl', 'rd-list');
  [['paul', N().readings.paul], ['catholic', N().readings.catholic], ['acts', N().readings.acts], ['psalm', N().readings.psalm], ['gospel', N().readings.gospel]].forEach(([k, label]) => {
    if (!e[k]) return;
    const d = el('div'); d.append(el('dt', '', label), el('dd', '', e[k])); dl.appendChild(d);
  });
  if (dl.children.length) box.appendChild(dl);
  if (e.sample) box.appendChild(el('p', 'rd-sample', isTi() ? 'ኣብነት — ክረጋገጽ ኣለዎ' : 'Example — to be checked'));
  box.hidden = !box.children.length;
}

function renderYear(){
  const y = state.y, data = yearData(y);
  $('year-title').textContent = `${y} ${N().era}`;
  const tb = $('year-body'); tb.replaceChildren();
  const rows = [];
  Object.keys(data.days).forEach(k => data.days[k].feasts.forEach(f => rows.push({ j: +k, f })));
  rows.sort((a, b) => a.j - b.j);
  rows.forEach(({ j, f }) => {
    const tr = el('tr', 'rank-' + f.rank);
    tr.appendChild(el('td', 'yt-name', N().feasts[f.key]));
    tr.appendChild(el('td', 'yt-et', fmtEt(jdnToEt(j), false)));
    tr.appendChild(el('td', 'yt-gr', fmtGr(jdnToGr(j))));
    tr.appendChild(el('td', 'yt-wd', N().wd[weekday(j)]));
    tb.appendChild(tr);
  });
  const fb = $('fast-body'); fb.replaceChildren();
  data.fasts.forEach(f => {
    const tr = el('tr');
    tr.appendChild(el('td', 'yt-name', N().fasts[f.key]));
    tr.appendChild(el('td', 'yt-et', `${fmtEt(jdnToEt(f.from), false)} ${N().range} ${fmtEt(jdnToEt(f.to), false)}`));
    tr.appendChild(el('td', 'yt-gr', `${fmtGr(jdnToGr(f.from), false)} ${N().range} ${fmtGr(jdnToGr(f.to))}`));
    tr.appendChild(el('td', 'yt-wd', `${f.to - f.from + 1} ${N().dayOf}`));
    fb.appendChild(tr);
  });
}

/* ---------- 5. Date converter ---------- */
function fillConverter(){
  const ms = $('conv-et-m'), keep = ms.value || todayEt.m;
  ms.replaceChildren();
  N().months.forEach((name, i) => { const o = el('option', '', name); o.value = i + 1; ms.appendChild(o); });
  ms.value = keep;
}
function convertGr(){
  const v = $('conv-gr').value, out = $('conv-gr-out');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)){ out.textContent = N().invalid; return; }
  const [y, m, d] = v.split('-').map(Number), j = grToJdn(y, m, d);
  out.textContent = `${N().wd[weekday(j)]}, ${fmtEt(jdnToEt(j))}`;
}
function convertEt(){
  const d = +$('conv-et-d').value, m = +$('conv-et-m').value, y = +$('conv-et-y').value, out = $('conv-et-out');
  if (!y || y < 1 || d < 1 || d > monthDays(y, m)){ out.textContent = N().invalid; return; }
  const j = etToJdn(y, m, d);
  out.textContent = `${N().wd[weekday(j)]}, ${fmtGr(jdnToGr(j))}`;
}

/* ---------- 6. Wiring ---------- */
function go(dm){
  let { y, m } = state; m += dm;
  if (m < 1){ m = 13; y--; } if (m > 13){ m = 1; y++; }
  const yearChanged = y !== state.y;
  state.y = y; state.m = m; state.sel = etToJdn(y, m, 1);
  if (state.y === todayEt.y && state.m === todayEt.m) state.sel = todayJ;
  renderMonth(); renderDay(); if (yearChanged) renderYear();
}
function renderAll(){ renderToday(); renderUpcoming(); if (FULL){ fillConverter(); renderMonth(); renderDay(); renderYear(); convertGr(); convertEt(); } }

if (FULL){
$('cal-prev').addEventListener('click', () => go(-1));
$('cal-next').addEventListener('click', () => go(1));
$('cal-today').addEventListener('click', () => {
  state.y = todayEt.y; state.m = todayEt.m; state.sel = todayJ; renderMonth(); renderDay(); renderYear();
});
$('year-prev').addEventListener('click', () => { state.y--; state.m = 1; state.sel = etToJdn(state.y, 1, 1); renderMonth(); renderDay(); renderYear(); });
$('year-next').addEventListener('click', () => { state.y++; state.m = 1; state.sel = etToJdn(state.y, 1, 1); renderMonth(); renderDay(); renderYear(); });
$('cal-print').addEventListener('click', () => {
  document.body.classList.add('print-cal');           // print only the calendar
  window.print();
  setTimeout(() => document.body.classList.remove('print-cal'), 500);
});
$('conv-gr').addEventListener('input', convertGr);
['conv-et-d','conv-et-m','conv-et-y'].forEach(id => $(id).addEventListener('input', convertEt));
document.addEventListener('keydown', e => {
  if (e.target.closest('input,select,textarea')) return;
  if (e.key === 'PageUp') go(-1);
  if (e.key === 'PageDown') go(1);
});

// Converter defaults: today
$('conv-gr').value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
$('conv-et-d').value = todayEt.d; $('conv-et-y').value = todayEt.y;
}

document.addEventListener('langchange', renderAll);
renderAll();
// the Sunday names and readings entered on the Admin page
fetch('data/lectionary.json?v=' + Math.floor(Date.now() / 60000)).then(r => r.ok ? r.json() : null).then(d => {
  if (d && Array.isArray(d.sundays) && d.sundays.length){ LECTIONARY = d.sundays; renderAll(); }
}).catch(() => {});
// calendar.html#d=<day> (from a feast on the Liturgy page): open the month of that day
const hd = FULL && /^#d=(\d+)$/.exec(location.hash);
if (hd) openFullAt(+hd[1]);
// "See this month" on the wheel at the top of the page
if (FULL) window.addEventListener('hashchange', () => { const h = /^#d=(\d+)$/.exec(location.hash); if (h) openFullAt(+h[1]); });

})();
