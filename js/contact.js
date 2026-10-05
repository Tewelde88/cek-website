/* ============================================================
   CONTACT PAGE (contact.html) — details, offices, map and form
   Data: js/contact-data.js
   ============================================================ */
(function(){
'use strict';
if (typeof CONTACT === 'undefined') return;
const isTi = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (isTi() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
const T = () => isTi() ? {
  soon: 'ክውሰኽ እዩ', call: 'ደውሉ', write: 'ጽሓፉ', open: 'ክፈቱ', example: 'ኣብነት',
  noEmail: 'ኢመይል ቤት ጽሕፈት ገና ኣይተወሰነን። በጃኹም ብተሌፎን ርኸቡና።',
  sent: 'ኢመይል ኣፕሊኬሽንኩም ተኸፊቱ እዩ — መልእኽትኹም ንምልኣኽ "Send" ጠውቑ።',
  invalid: 'በጃኹም ስምኩምን መልእኽትኹምን ኣእትዉ።', subjectPrefix: 'መልእኽቲ ካብ መርበብ',
  lbl: { name: 'ስም', email: 'ኢመይል', phone: 'ተሌፎን' }
} : {
  soon: 'To be added', call: 'Call', write: 'Write', open: 'Open', example: 'Example',
  noEmail: 'The office email address has not been set yet. Please contact us by phone.',
  sent: 'Your email app has opened — press "Send" there to send your message.',
  invalid: 'Please enter your name and your message.', subjectPrefix: 'Website message',
  lbl: { name: 'Name', email: 'Email', phone: 'Phone' }
};
const $ = id => document.getElementById(id);
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function setVal(id, text, href){
  const box = $(id); if (!box) return;
  box.replaceChildren();
  if (!text){ box.appendChild(el('span', 'ct-soon', T().soon)); return; }
  if (href){ const a = el('a', '', text); a.href = href; box.appendChild(a); }
  else box.textContent = text;
}
const tel = p => 'tel:' + p.replace(/[^\d+]/g, '');

function renderDetails(){
  setVal('ct-address', tr(CONTACT, 'address'));
  setVal('ct-phone', CONTACT.phone, CONTACT.phone && tel(CONTACT.phone));
  setVal('ct-email', CONTACT.email, CONTACT.email && 'mailto:' + CONTACT.email);
  setVal('ct-hours', tr(CONTACT, 'hours'));
  setVal('ct-whatsapp', CONTACT.whatsapp && '+' + CONTACT.whatsapp, CONTACT.whatsapp && 'https://wa.me/' + CONTACT.whatsapp);
  const wa = $('ct-wa-row'); if (wa) wa.hidden = !CONTACT.whatsapp;
  const waBtn = $('ct-send-wa'); if (waBtn) waBtn.hidden = !CONTACT.whatsapp;
  // Map
  const q = encodeURIComponent(CONTACT.mapQuery || 'Keren, Eritrea');
  const map = $('ct-map');
  if (map && !map.src) map.src = `https://www.google.com/maps?q=${q}&output=embed`;
  const mapLink = $('ct-map-link'); if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function renderOffices(){
  const grid = $('ct-offices'); if (!grid) return;
  grid.replaceChildren();
  (CONTACT.offices || []).forEach(o => {
    const c = el('article', 'ct-office');
    const head = el('div', 'ct-office-head');
    head.appendChild(el('h3', '', tr(o, 'name')));
    if (o.sample) head.appendChild(el('span', 'sample-tag', T().example));
    c.appendChild(head);
    if (tr(o, 'person')) c.appendChild(el('p', 'ct-person', tr(o, 'person')));
    const acts = el('div', 'ct-acts');
    if (o.phone){ const a = el('a', 'r-btn', '☎ ' + o.phone); a.href = tel(o.phone); acts.appendChild(a); }
    if (o.email){ const a = el('a', 'r-btn', '✉ ' + o.email); a.href = 'mailto:' + o.email; acts.appendChild(a); }
    if (!o.phone && !o.email) acts.appendChild(el('span', 'ct-soon', T().soon));
    if (o.link){ const a = el('a', 'more', T().open + ' →'); a.href = o.link; acts.appendChild(a); }
    c.appendChild(acts);
    grid.appendChild(c);
  });
  if (window.refreshClamps) window.refreshClamps();
}

/* ---------- Contact form → email app / WhatsApp ---------- */
const form = $('ct-form');
function compose(){
  const v = id => ($(id).value || '').trim();
  const name = v('f-name'), msg = v('f-message');
  const status = $('ct-status');
  // Show the error next to each empty required field and move focus to the first one
  const missing = [['f-name', name], ['f-message', msg]].filter(([, val]) => !val).map(([id]) => $(id));
  ['f-name', 'f-message'].forEach(id => {
    const f = $(id), bad = missing.includes(f), errId = id + '-err';
    f.classList.toggle('is-invalid', bad);
    f.setAttribute('aria-invalid', String(bad));
    let err = $(errId);
    if (bad && !err){ err = el('span', 'field-error'); err.id = errId; f.after(err); }
    if (err){ err.textContent = bad ? (isTi() ? 'እዚ ሓበሬታ ኣድላዪ እዩ!' : 'This field is required.') : ''; }
    if (bad) f.setAttribute('aria-describedby', errId); else f.removeAttribute('aria-describedby');
  });
  if (missing.length){ status.textContent = T().invalid; status.className = 'ct-status is-error'; missing[0].focus(); return null; }
  status.textContent = '';
  const sel = $('f-subject'), subj = sel.options[sel.selectedIndex].text;
  const lines = [`${T().lbl.name}: ${name}`];
  if (v('f-email')) lines.push(`${T().lbl.email}: ${v('f-email')}`);
  if (v('f-phone')) lines.push(`${T().lbl.phone}: ${v('f-phone')}`);
  lines.push('', msg);
  return { subject: `${T().subjectPrefix} — ${subj} — ${name}`, body: lines.join('\n'), status };
}
if (form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const m = compose(); if (!m) return;
    if (!CONTACT.email){ m.status.textContent = T().noEmail; m.status.className = 'ct-status is-error'; return; }
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    m.status.textContent = T().sent; m.status.className = 'ct-status is-ok';
  });
  const waBtn = $('ct-send-wa');
  if (waBtn) waBtn.addEventListener('click', () => {
    const m = compose(); if (!m || !CONTACT.whatsapp) return;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(m.subject + '\n\n' + m.body)}`, '_blank', 'noopener');
  });
}

function renderAll(){ renderDetails(); renderOffices(); }
document.addEventListener('langchange', renderAll);
renderAll();
})();

// Clear a field's error as soon as the visitor types in it
['f-name', 'f-message'].forEach(id => {
  const f = document.getElementById(id); if (!f) return;
  f.addEventListener('input', () => {
    if (!f.value.trim()) return;
    f.classList.remove('is-invalid'); f.setAttribute('aria-invalid', 'false');
    const err = document.getElementById(id + '-err'); if (err) err.textContent = '';
  });
});
