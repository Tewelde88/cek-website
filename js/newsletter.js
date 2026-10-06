/* ============================================================
   HOME PAGE — Newsletter sign-up, as a sealed letter.
   The email is sent to a Google Form (its answers collect in a
   Google Sheet). The form's address and field codes are set on
   the Admin page → Newsletter (data/newsletter.json); the script
   tools/newsletter-form.gs creates the form and prints them.
   ============================================================ */
(function(){
'use strict';
const form = document.getElementById('nl');
if (!form) return;
const NL = (typeof NEWSLETTER !== 'undefined' && NEWSLETTER) || {};
const ti = () => document.documentElement.lang === 'ti';
const email = document.getElementById('nl-email'), err = document.getElementById('nl-err');
const done = document.getElementById('nl-done'), inner = form.querySelector('.nl-in');
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const entry = v => { v = String(v || '').trim(); return v && !v.startsWith('entry.') ? 'entry.' + v : v; };
const ready = /^https:\/\/docs\.google\.com\/forms\/.+\/formResponse$/.test(String(NL.form_action || '').trim()) && entry(NL.email_entry);

// the flap of the envelope opens while the visitor writes
form.addEventListener('focusin', () => form.classList.add('is-open'));
form.addEventListener('focusout', () => setTimeout(() => { if (!form.contains(document.activeElement) && !email.value) form.classList.remove('is-open'); }, 0));

function say(msg){ err.textContent = msg; err.hidden = !msg; email.setAttribute('aria-invalid', msg ? 'true' : 'false'); }
form.addEventListener('submit', e => {
  e.preventDefault();
  const v = email.value.trim();
  if (!v || !email.checkValidity()){
    say(ti() ? 'በጃኹም ቅኑዕ ኢመይል ጽሓፉ፡ ንኣብነት name@example.com' : 'Please write a valid email, for example name@example.com');
    email.focus(); return;
  }
  if (!ready && !window.NL_DEMO){
    say(ti() ? 'ምዝገባ ገና ኣይተኸፍተን። በጃኹም ብገጽ ርኸቡና ጽሓፉልና።' : 'Sign-up is not open yet. Please write to us on the Contact page.');
    return;
  }
  say('');
  const btn = form.querySelector('.nl-seal'); btn.disabled = true;
  const lang = (form.querySelector('input[name="lang"]:checked') || {}).value || 'English';
  const send = ready ? (() => {
    const fd = new FormData(); fd.append(entry(NL.email_entry), v);
    if (NL.lang_entry) fd.append(entry(NL.lang_entry), lang);
    return fetch(String(NL.form_action).trim(), { method: 'POST', mode: 'no-cors', body: fd });   // Google Forms gives no readable answer; a sent request is enough
  })() : Promise.resolve();
  send.then(() => {
    form.classList.remove('is-open');                  // the flap closes …
    setTimeout(() => {                                 // … and the letter is sealed
      inner.hidden = true; done.hidden = false; form.classList.add('is-sealed'); done.focus();
    }, still.matches ? 0 : 450);
  }).catch(() => {
    btn.disabled = false;
    say(ti() ? 'ኣይተላእከን። ኢንተርነትኩም ርኣዩ እሞ እንደገና ፈትኑ።' : 'It could not be sent. Check your internet connection and try again.');
  });
});
email.addEventListener('input', () => { if (!err.hidden) say(''); });
})();
