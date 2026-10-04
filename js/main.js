/* ---------- Sermons: featured + search + group by year ---------- */
const list = document.getElementById('sermon-list');
const empty = document.getElementById('empty');
const q = document.getElementById('q');
const isTi = () => document.documentElement.lang === 'ti';
const titleOf = s => (isTi() && s.ti) ? s.ti : s.t;

function render(filter=""){
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
q.addEventListener('input', e => render(e.target.value));

// Header search box → filters the sermon archive and scrolls to it
document.getElementById('site-search').addEventListener('submit', e => {
  e.preventDefault();
  q.value = document.getElementById('site-q').value;
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

  render(q.value);
  try { localStorage.setItem('lang', ti ? 'ti' : 'en'); } catch(e){}
}
document.querySelectorAll('.lang-switch button').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.lang)));
setLang(isTi() ? 'ti' : 'en');

/* ---------- Hero slider (autoplay, arrows, dots, swipe, keyboard) ---------- */
(function(){
  const root = document.getElementById('slider');
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
