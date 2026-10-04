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
  let i = 0, timer = null, paused = false;

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
    if (!reduceMotion && !paused && !document.hidden && slides.length > 1) timer=setInterval(()=>go(i+1, 1), DELAY);
  }
  function pause(p){ paused=p; restart(); }

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
    if (menu.classList.contains('open') && !e.target.closest('.mainnav')) setOpen(false);
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
