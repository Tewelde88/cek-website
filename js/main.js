/* ---------- Sermons: search + group by year ---------- */
const list = document.getElementById('sermons');
const empty = document.getElementById('empty');
const q = document.getElementById('q');
const isTi = () => document.documentElement.lang === 'ti';
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
      a.textContent = (isTi() && s.ti) ? s.ti : s.t;
      li.appendChild(a); list.appendChild(li); count++;
    });
  empty.style.display = count ? 'none' : 'block';
}
q.addEventListener('input', e => render(e.target.value));

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

  // Menu: the big label and the small label swap places
  document.querySelectorAll('.nav a').forEach(a => {
    const big = a.querySelector('span'), small = a.querySelector('small');
    if (!big || !small) return;
    if (a.dataset.en === undefined){ a.dataset.en = big.textContent; a.dataset.ti = small.textContent; }
    big.textContent   = ti ? a.dataset.ti : a.dataset.en;
    small.textContent = ti ? a.dataset.en : a.dataset.ti;
    big.lang = ti ? 'ti' : 'en'; small.lang = ti ? 'en' : 'ti';
  });

  document.querySelectorAll('.lang-switch button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === (ti ? 'ti' : 'en'))));

  render(q.value);
  try { localStorage.setItem('lang', ti ? 'ti' : 'en'); } catch(e){}
}
document.querySelectorAll('.lang-switch button').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.lang)));
setLang(isTi() ? 'ti' : 'en');

/* ---------- Slider (autoplay, arrows, dots, swipe, keyboard) ---------- */
(function(){
  const root = document.getElementById('slider');
  const slides = [...root.querySelectorAll('.slide')];
  const dots = root.querySelector('.dots');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DELAY = 5000;  // slider speed in milliseconds
  let i = 0, timer = null, paused = false;

  slides.forEach((s,n)=>{
    s.setAttribute('aria-roledescription','slide');
    s.setAttribute('aria-label',(n+1)+' of '+slides.length);
    if (n) s.setAttribute('aria-hidden','true');
    const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Slide '+(n+1));
    b.onclick=()=>go(n); dots.appendChild(b);
  });
  dots.children[0].classList.add('on');

  function go(n){
    slides[i].classList.remove('on'); slides[i].setAttribute('aria-hidden','true');
    dots.children[i].classList.remove('on');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('on'); slides[i].removeAttribute('aria-hidden');
    dots.children[i].classList.add('on');
    restart();
  }
  function restart(){
    clearInterval(timer);
    if (!reduceMotion && !paused && !document.hidden) timer=setInterval(()=>go(i+1), DELAY);
  }
  function pause(p){ paused=p; restart(); }

  root.querySelector('.sl-prev').onclick=()=>go(i-1);
  root.querySelector('.sl-next').onclick=()=>go(i+1);

  // Pause while the mouse or keyboard focus is on the slider, or the tab is hidden
  root.addEventListener('mouseenter',()=>pause(true));
  root.addEventListener('mouseleave',()=>pause(false));
  root.addEventListener('focusin',()=>pause(true));
  root.addEventListener('focusout',()=>pause(false));
  document.addEventListener('visibilitychange',restart);

  // Arrow keys when the slider has focus
  root.addEventListener('keydown',e=>{
    if (e.key==='ArrowLeft') go(i-1);
    if (e.key==='ArrowRight') go(i+1);
  });

  // Touch swipe
  let x0=null, y0=null;
  root.addEventListener('touchstart',e=>{ x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
  root.addEventListener('touchend',e=>{
    if (x0===null) return;
    const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0;
    if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) go(dx<0 ? i+1 : i-1);
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
  const nav = document.getElementById('site-nav');
  const wide = window.matchMedia('(min-width:1180px)');
  function setOpen(o){
    nav.classList.toggle('open', o);
    tgl.setAttribute('aria-expanded', o);
    tgl.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  }
  tgl.onclick = () => setOpen(!nav.classList.contains('open'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key==='Escape' && nav.classList.contains('open')){ setOpen(false); tgl.focus(); }
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !e.target.closest('.site-header')) setOpen(false);
  });
  wide.addEventListener('change', () => setOpen(false));
})();

/* ---------- Footer year ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();
