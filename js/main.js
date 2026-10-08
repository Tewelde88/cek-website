/* ---------- Sermons: featured + search + group by year ---------- */
const list = document.getElementById('sermon-list');
const empty = document.getElementById('empty');
const q = document.getElementById('q');
const isTi = () => document.documentElement.lang === 'ti';
const titleOf = s => (isTi() && s.ti) ? s.ti : s.t;

function render(filter=""){
  if (!list) return;                       // page without a sermon list
  const f = filter.trim().toLowerCase();
  list.innerHTML = "";
  let lastYear = null, count = 0;
  // Search matches the English title, the Tigrinya title or the year
  SERMONS.filter(s => s.t.toLowerCase().includes(f) || (s.ti||"").includes(f) || String(s.y).includes(f))
    .forEach(s => {
      if (s.y !== lastYear){
        const h = document.createElement('li'); h.className='yr'; h.textContent=s.y;
        list.appendChild(h); lastYear = s.y;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.href; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = titleOf(s);
      li.appendChild(a); list.appendChild(li); count++;
    });
  empty.style.display = count ? 'none' : 'block';

  // Featured sermon = the newest one (first in js/sermons.js)
  const top = SERMONS[0];
  if (top){
    document.getElementById('featured').href = top.href;
    document.getElementById('featured-title').textContent = titleOf(top);
    document.getElementById('featured-year').textContent = top.y;
  }
}
if (q) q.addEventListener('input', e => render(e.target.value));

// Search sent from another page (index.html?q=…#sermons)
const urlQ = new URLSearchParams(location.search).get('q');
if (q && urlQ){ q.value = urlQ; document.getElementById('site-q').value = urlQ; }

// Header search box → filters the sermon archive and scrolls to it
document.getElementById('site-search').addEventListener('submit', e => {
  e.preventDefault();
  const v = document.getElementById('site-q').value;
  const sp = document.getElementById('sermon-page-q');          // on the Sermons page
  if (sp){ sp.value = v; sp.dispatchEvent(new Event('input')); sp.scrollIntoView({behavior:'smooth', block:'center'}); return; }
  if (!q){ location.href = 'sermons.html?q=' + encodeURIComponent(v); return; }
  q.value = v;
  render(q.value);
  document.getElementById('sermons').scrollIntoView({behavior:'smooth', block:'start'});
});

/* ---------- Language switch: English ⇄ Tigrinya ---------- */
function setLang(lang){
  const ti = lang === 'ti';
  const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.ti) || {};
  document.documentElement.lang = ti ? 'ti' : 'en';

  // Text: remember the English from the HTML, then show Tigrinya or English
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent;
    const t = dict[el.dataset.i18n];
    el.textContent = (ti && t) ? t : el.dataset.en;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.placeholder;
    const t = dict[el.dataset.i18nPlaceholder];
    el.placeholder = (ti && t) ? t : el.dataset.enPlaceholder;
  });

  document.querySelectorAll('.lang-switch button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === (ti ? 'ti' : 'en'))));

  render(q ? q.value : '');
  mountVaticanNews(ti ? 'ti' : 'en');
  document.dispatchEvent(new CustomEvent('langchange', {detail:{lang: ti ? 'ti' : 'en'}}));
  try { localStorage.setItem('lang', ti ? 'ti' : 'en'); } catch(e){}
}

/* ---------- Vatican News widget in the page's language ----------
   The widget reads its settings only once, so on a language change we replace it. */
function mountVaticanNews(lang){
  const box = document.getElementById('vn-widget');
  if (!box || box.dataset.lang === lang) return;
  box.dataset.lang = lang;
  const w = document.createElement('vaticannews-widget');
  w.setAttribute('lang', lang);          // en = English, ti = Tigrinya
  w.setAttribute('fontSize', '16');      // 14, 16 or 18
  if (window.matchMedia('(max-width:640px)').matches) w.setAttribute('mobile', 'true');
  box.replaceChildren(w);
}
document.querySelectorAll('.lang-switch button').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.lang)));
setLang(isTi() ? 'ti' : 'en');

/* ---------- Hero slider (autoplay, arrows, dots, swipe, keyboard) ---------- */
(function(){
  const root = document.getElementById('slider');
  if (!root) return;                       // page without the cover slider
  const slides = [...root.querySelectorAll('.slide')];
  const dots = root.querySelector('.dots');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DELAY = 6000;  // slider speed in milliseconds
  let i = 0, timer = null, paused = false, userPaused = false;

  slides.forEach((s,n)=>{
    s.setAttribute('aria-roledescription','slide');
    s.setAttribute('aria-label',(n+1)+' of '+slides.length);
    if (n) s.setAttribute('aria-hidden','true');
    const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Photo '+(n+1));
    b.onclick=()=>go(n); dots.appendChild(b);
  });
  dots.children[0].classList.add('on');

  // Slide to photo n. dir = 1 slides in from the right, -1 from the left.
  function go(n, dir){
    const next = (n+slides.length)%slides.length;
    if (next === i) return;
    dir = dir || (next > i ? 1 : -1);
    const from = slides[i], to = slides[next];
    clearTimeout(to._reset);

    // Park the incoming photo just off-screen on the correct side (no animation)…
    to.style.transition = 'none';
    to.style.transform = 'translateX(' + (dir*100) + '%)';
    to.style.visibility = 'visible';
    void to.offsetWidth;
    // …then slide it in while the current photo slides out the other way
    to.style.transition = to.style.transform = '';
    to.classList.add('on'); to.removeAttribute('aria-hidden');
    from.classList.remove('on'); from.setAttribute('aria-hidden','true');
    from.style.transform = 'translateX(' + (-dir*100) + '%)';
    from.style.visibility = 'visible';
    clearTimeout(from._reset);
    from._reset = setTimeout(() => {          // once off-screen, quietly reset it
      if (from.classList.contains('on')) return;
      from.style.transition = 'none';
      from.style.transform = from.style.visibility = '';
      void from.offsetWidth;
      from.style.transition = '';
    }, 950);

    dots.children[i].classList.remove('on');
    i = next;
    dots.children[i].classList.add('on');
    restart();
  }
  function restart(){
    clearInterval(timer);
    if (!reduceMotion && !paused && !userPaused && !document.hidden && slides.length > 1) timer=setInterval(()=>go(i+1, 1), DELAY);
  }
  function pause(p){ paused=p; restart(); }

  // Pause / play button (auto-rotating content must be stoppable)
  const pb = root.querySelector('.sl-pause');
  if (pb){
    if (reduceMotion || slides.length < 2) pb.hidden = true;
    pb.addEventListener('click', () => {
      userPaused = !userPaused;
      pb.setAttribute('aria-pressed', String(userPaused));
      pb.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      pb.classList.toggle('is-paused', userPaused);
      restart();
    });
  }

  root.querySelector('.sl-prev').onclick=()=>go(i-1, -1);
  root.querySelector('.sl-next').onclick=()=>go(i+1, 1);
  root.addEventListener('mouseenter',()=>pause(true));
  root.addEventListener('mouseleave',()=>pause(false));
  root.addEventListener('focusin',()=>pause(true));
  root.addEventListener('focusout',()=>pause(false));
  document.addEventListener('visibilitychange',restart);
  root.addEventListener('keydown',e=>{
    if (e.key==='ArrowLeft') go(i-1, -1);
    if (e.key==='ArrowRight') go(i+1, 1);
  });

  let x0=null, y0=null;
  root.addEventListener('touchstart',e=>{ x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
  root.addEventListener('touchend',e=>{
    if (x0===null) return;
    const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;
    if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) dx<0 ? go(i+1, 1) : go(i-1, -1);
    x0=null;
  },{passive:true});

  restart();
})();

/* ---------- Building progress bar ---------- */
document.querySelectorAll('.progress').forEach(p=>{
  const v = Math.max(0, Math.min(100, Number(p.dataset.value)||0));
  requestAnimationFrame(()=>{ p.querySelector('.bar span').style.width = v+'%'; });
});

/* ---------- Mobile menu ---------- */
(function(){
  const tgl = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-nav');
  const wide = window.matchMedia('(min-width:1024px)');
  function setOpen(o){
    menu.classList.toggle('open', o);
    tgl.setAttribute('aria-expanded', o);
  }
  tgl.onclick = () => setOpen(!menu.classList.contains('open'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key==='Escape' && menu.classList.contains('open')){ setOpen(false); tgl.focus(); }
  });
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !e.target.closest('.mainnav, .sitehead, .menubar')) setOpen(false);
  });
  wide.addEventListener('change', () => setOpen(false));
})();

/* ---------- Footer year ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Pop-up windows (e.g. Pope biography) ---------- */
document.querySelectorAll('[data-open]').forEach(link => {
  const dlg = document.getElementById(link.dataset.open);
  if (!dlg || typeof dlg.showModal !== 'function') return;   // very old browsers: link just jumps to the text
  link.addEventListener('click', e => {
    e.preventDefault();
    dlg.showModal();
    dlg.querySelector('.bio-body').scrollTop = 0;
  });
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  // Click on the dark area outside the window closes it
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
});

/* ---------- Sub-menu: highlight the section being read (Liturgy page) ---------- */
(function(){
  const links = [...document.querySelectorAll('.subnav a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const visible = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
    // the first section (in page order) that is on screen wins
    const current = [...byId.keys()].find(id => visible.has(id));
    links.forEach(a => a.classList.toggle('active', a === byId.get(current)));
    const act = byId.get(current);
    if (act){ const ul = act.closest('ul'); ul.scrollTo({ left: act.parentElement.offsetLeft - 16, behavior: 'smooth' }); }
  }, { rootMargin: '-140px 0px -55% 0px' });
  byId.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ---------- "Show more / Show less" boxes ----------
   Markup:  <div class="clamp-box" data-clamp="400"> … </div>
            <button type="button" class="show-more" hidden aria-expanded="false">…</button>
   The box is cut to data-clamp pixels (with a fade) only when its content is taller;
   otherwise the button stays hidden. Call window.refreshClamps() after changing content. */
(function(){
  const boxes = () => [...document.querySelectorAll('.clamp-box')];
  function refresh(){
    boxes().forEach(box => {
      const btn = box.nextElementSibling;
      if (!btn || !btn.classList.contains('show-more')) return;
      const h = +box.dataset.clamp || 400;
      box.style.setProperty('--clamp-h', h + 'px');
      const tall = box.scrollHeight > h + 40;          // small margin: don't hide just a few pixels
      box.classList.toggle('is-clamped', tall);
      btn.hidden = !tall;
      if (!tall){ box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('.show-more'); if (!btn) return;
    const box = btn.previousElementSibling; if (!box || !box.classList.contains('clamp-box')) return;
    const open = !box.classList.contains('is-open');
    box.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (!open){
      const sec = box.closest('section');
      if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start' });
    }
  });
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(refresh, 150); });
  window.addEventListener('load', refresh);
  document.addEventListener('langchange', () => setTimeout(refresh, 0));
  window.refreshClamps = refresh;
  refresh();
})();

/* ---------- Gentle "appear on scroll" for elements with class="reveal" ---------- */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)){ window.revealNow = n => n.classList.add('is-in'); return; }
  document.documentElement.classList.add('reveal-on');      // content stays visible if this script never runs
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(n => io.observe(n));
  window.revealNow = n => io.observe(n);
})();

/* ============================================================
   GE'EZ CALENDAR HELPERS (shared) + "Today in the Church" line
   window.GeezCal: geez(n) numerals, Ethiopian ⇄ Gregorian dates,
   upcoming(n) main feasts. (The full calendar is in js/calendar.js.)
   ============================================================ */
(function(){
  const ONES = ['', '፩','፪','፫','፬','፭','፮','፯','፰','፱'], TENS = ['', '፲','፳','፴','፵','፶','፷','፸','፹','፺'];
  function geez(n){
    let s = String(n); const pairs = [];
    while (s.length){ pairs.unshift(s.slice(-2)); s = s.slice(0, -2); }
    return pairs.map((p, i) => {
      const v = +p, pos = pairs.length - 1 - i;
      let t = (TENS[Math.floor(v / 10)] || '') + (ONES[v % 10] || '');
      if (pos > 0){ if (!v) return ''; if (v === 1) t = ''; t += (pos % 2 === 1) ? '፻' : '፼'; }
      return t;
    }).join('');
  }
  const E0 = 1723856;
  const etToJdn = (y, m, d) => E0 + 365 + 365 * (y - 1) + Math.floor(y / 4) + 30 * m + d - 31;
  function jdnToEt(j){ const r = (j - E0) % 1461, n = (r % 365) + 365 * Math.floor(r / 1460);
    return { y: 4 * Math.floor((j - E0) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460), m: Math.floor(n / 30) + 1, d: (n % 30) + 1 }; }
  const grToJdn = (y, m, d) => { const t = new Date(0); t.setUTCFullYear(y, m - 1, d); return Math.floor(t.getTime() / 864e5) + 2440588; };
  const jdnToDate = j => new Date((j - 2440588) * 864e5);
  const juToJdn = (y, m, d) => { const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083; };
  function easter(g){ const a = g % 4, b = g % 7, c = g % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
    return juToJdn(g, Math.floor((d + e + 114) / 31), ((d + e + 114) % 31) + 1); }
  const MONTHS_TI = ['መስከረም','ጥቅምቲ','ሕዳር','ታሕሳስ','ጥሪ','ለካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰነ','ሓምለ','ነሓሰ','ጳጉሜን'];
  const MONTHS_EN = ['Meskerem','Tiqimti','Hidar','Tahsas','Tiri','Lekatit','Megabit','Miyazya','Ginbot','Sene','Hamle','Nehase','Pagume'];
  const WD_TI = ['ሰንበት','ሰኑይ','ሰሉስ','ረቡዕ','ሓሙስ','ዓርቢ','ቀዳም'];
  // [month, day, English, Tigrinya, major]
  const FIXED = [[1,1,'New Year · St John the Baptist','ርእሰ ዓመት',1],[1,17,'Meskel — Finding of the Holy Cross','መስቀል',1],[3,6,'Qusquam','ደብረ ቍስቋም',0],
    [3,12,'St Michael the Archangel','ቅዱስ ሚካኤል',0],[3,21,'Hidar Tsion — St Mary of Zion','ሕዳር ጽዮን',0],[4,3,'Presentation of Mary in the Temple','በኣታ ማርያም',0],
    [4,19,'St Gabriel the Archangel','ቅዱስ ገብርኤል',0],[5,11,'Timket — Epiphany','ጥምቀት',1],[5,21,'Dormition of Mary','ኣስተርእዮ ማርያም',0],[7,29,'Annunciation','ብስራት',1],
    [9,1,'Nativity of Mary','ልደታ ማርያም',0],[11,5,'Sts Peter and Paul','ጴጥሮስን ጳውሎስን',0],[12,13,'Debre Tabor — Transfiguration','ደብረ ታቦር',1],[12,16,'Filseta — Assumption of Mary','ፍልሰታ',1]];
  const MOVABLE = [[-7,'Hosanna — Palm Sunday','ሆሳዕና',1],[-2,'Siklet — Good Friday','ዓርቢ ስቅለት',1],[0,'Fasika — Easter','ፋሲካ — ትንሣኤ',1],[39,'Erget — Ascension','ዕርገት',1],[49,'Pentecost','ጰራቅሊጦስ',1]];
  function feastsOf(y){
    const list = FIXED.map(([m, d, en, ti, major]) => ({ j: etToJdn(y, m, d), en, ti, major }));
    list.push({ j: etToJdn(y, 4, y % 4 === 0 ? 28 : 29), en: 'Lidet — Christmas', ti: 'ልደት', major: 1 });
    const E = easter(y + 8);
    MOVABLE.forEach(([o, en, ti, major]) => list.push({ j: E + o, en, ti, major }));
    return list;
  }
  const now = new Date(), todayJ = grToJdn(now.getFullYear(), now.getMonth() + 1, now.getDate());
  function upcoming(n){
    const et = jdnToEt(todayJ);
    return [...feastsOf(et.y), ...feastsOf(et.y + 1)].filter(f => f.j >= todayJ).sort((a, b) => a.j - b.j).slice(0, n);
  }
  window.GeezCal = { geez, etToJdn, jdnToEt, grToJdn, jdnToDate, upcoming, todayJ, MONTHS_TI, MONTHS_EN, WD_TI };

  // ---- "Today in the Church" line, under the main menu on every page ----
  const nav = document.getElementById('menubar') || document.getElementById('sitehead') || document.querySelector('.mainnav');
  if (!nav || document.querySelector('.today-line')) return;
  const bar = document.createElement('div'); bar.className = 'today-line';
  bar.innerHTML = '<div class="wrap"><span class="today-ge" lang="ti"></span><span class="today-en"></span><a href="calendar.html"></a></div>';
  const skip = document.querySelector('.skip-link');
  if (skip) skip.after(bar); else document.body.prepend(bar);
  bar.classList.add('is-top');
  function render(){
    const ti = document.documentElement.lang === 'ti', et = jdnToEt(todayJ), wd = (todayJ + 1) % 7;
    const ge = bar.querySelector('.today-ge'); ge.replaceChildren();
    ge.append(WD_TI[wd] + ' ');
    const d = document.createElement('span'); d.className = 'rub'; d.textContent = geez(et.d); ge.append(d);
    ge.append(` ${MONTHS_TI[et.m - 1]} ${geez(et.y)} ዓ.ም.`);
    bar.querySelector('.today-en').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const f = upcoming(1)[0], days = f.j - todayJ, name = (ti ? f.ti : f.en).split(' — ')[0];
    bar.querySelector('a').textContent = days === 0 ? (ti ? `ሎሚ፡ ${name}` : `Today: ${name}`)
      : (ti ? `ዝቕጽል በዓል፡ ${name}፡ ድሕሪ ${days} መዓልቲ` : `Next feast: ${name}, in ${days} days`);
  }
  document.addEventListener('langchange', render);
  render();
})();

/* ---------- Home page: the verse writes itself in (the one motion), and the manuscript calendar ---------- */
(function(){
  const v = document.getElementById('verse');
  if (v && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const letters = [...v.textContent]; v.textContent = '';
    letters.forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.animationDelay = (0.25 + i * 0.09) + 's';
      v.appendChild(s);
    });
  }
  const list = document.getElementById('ms-feasts'), G = window.GeezCal;
  if (!list || !G) return;
  function render(){
    const ti = document.documentElement.lang === 'ti', up = G.upcoming(5), first = G.jdnToEt(up[0].j);
    const month = document.getElementById('ms-month'); month.replaceChildren();
    month.lang = 'ti';
    month.append(G.MONTHS_TI[first.m - 1]);
    const small = document.createElement('small');
    small.textContent = ti ? `ዝመጽኡ በዓላት — ካብ ${G.MONTHS_TI[first.m - 1]} ${G.geez(first.y)}` : `The coming feasts, from ${G.MONTHS_EN[first.m - 1]} ${first.y}`;
    month.appendChild(small);
    list.replaceChildren();
    up.forEach(f => {
      const e = G.jdnToEt(f.j), g = G.jdnToDate(f.j), li = document.createElement('li');
      const d = document.createElement('span'); d.className = 'd' + (f.major ? '' : ' plain'); d.textContent = G.geez(e.d); d.lang = 'ti';
      const n = document.createElement('span'); n.className = 'n';
      n.append(ti ? f.ti : f.en);
      const sub = document.createElement('span'); sub.className = 'ge'; sub.lang = 'ti';
      sub.textContent = ti ? G.MONTHS_TI[e.m - 1] : `${f.ti} · ${G.MONTHS_TI[e.m - 1]}`;
      n.appendChild(sub);
      const gr = document.createElement('span'); gr.className = 'g';
      gr.textContent = g.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
      li.append(d, n, gr); list.appendChild(li);
    });
  }
  document.addEventListener('langchange', render);
  render();
})();

/* ---------- Main menu: drop-down lists (click/tap the arrow; Esc or a click outside closes) ---------- */
(function(){
  const subs = document.querySelectorAll('.mainnav .has-sub');
  if (!subs.length) return;
  const closeAll = except => subs.forEach(li => {
    if (li === except || !li.classList.contains('is-open')) return;
    li.classList.remove('is-open'); li.querySelector('.sub-tgl').setAttribute('aria-expanded', 'false');
  });
  subs.forEach(li => {
    const b = li.querySelector('.sub-tgl');
    b.addEventListener('click', () => {
      const open = !li.classList.contains('is-open');
      closeAll(li); li.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
    });
    // Leaving the list with the keyboard closes it
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) closeAll(); });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const li = document.querySelector('.mainnav .has-sub.is-open'); if (!li) return;
    closeAll(); li.querySelector('.sub-tgl').focus();
  });
  document.addEventListener('click', e => { if (!e.target.closest('.has-sub')) closeAll(); });
})();

/* ---------- Eparchy tabs: on phones, slide the current tab into view ---------- */
(function(){ const a = document.querySelector('.ep-tabs a.active'); if (!a) return; const ul = a.closest('ul'); if (ul && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = a.parentElement.offsetLeft - 16; })();

/* ---------- Site header: search opens from the magnifier; on the Home page the menu bar turns navy at the top ---------- */
(function(){
  const head = document.getElementById('sitehead'); if (!head) return;
  const btn = head.querySelector('.sh-search'), form = document.getElementById('site-search');
  const close = () => { form.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
  if (btn && form){
    btn.addEventListener('click', () => {
      const open = !form.classList.contains('is-open');
      form.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
      if (open) form.querySelector('input').focus();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && form.classList.contains('is-open')){ close(); btn.focus(); } });
    document.addEventListener('click', e => { if (form.classList.contains('is-open') && !e.target.closest('.sh-tools')) close(); });
  }
  const bar = document.getElementById('menubar');
  if (bar){
    const stuck = () => bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= 0.5 && window.scrollY > 10);
    window.addEventListener('scroll', stuck, { passive: true }); window.addEventListener('resize', stuck); stuck();
  }
})();
