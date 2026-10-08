/* ============================================================
   HOME PAGE — "How you can help": the St. Michael's card shows the
   progress from data/building.json (Admin page → Building project).
   ============================================================ */
(function(){
'use strict';
const card = document.getElementById('hp-build');
if (!card || typeof BUILDING === 'undefined' || !BUILDING) return;
const B = BUILDING, ti = () => document.documentElement.lang === 'ti';
const tr = (o, f) => (ti() && o[f + '_ti']) ? o[f + '_ti'] : (o[f] || '');
function render(){
  const pct = Math.max(0, Math.min(100, Math.round(Number(B.percent) || 0)));
  const st = Array.isArray(B.stages) ? B.stages : [];
  const done = st.filter(s => s.status === 'done').length, cur = st.find(s => s.status === 'current');
  const set = (k, v) => { const e = card.querySelector(`[data-hp="${k}"]`); if (e && v) e.textContent = v; };
  set('place', tr(B, 'place')); set('name', tr(B, 'name')); set('summary', tr(B, 'summary'));
  document.getElementById('hp-pct').textContent = ti() ? `${pct}% ተሃኒጹ` : `${pct}% built`;
  const parts = [];
  if (cur) parts.push(ti() ? `${tr(cur, 'title')} ኣብ ምስራሕ` : `${tr(cur, 'title')} under way`);
  if (st.length) parts.push(ti() ? `ካብ ${st.length} ደረጃታት ${done} ተዛዚሞም` : `${done} of ${st.length} stages done`);
  set('stage', parts.join(' · '));
  const bar = card.querySelector('.hp-bar'); bar.setAttribute('aria-valuenow', pct); bar.firstElementChild.style.width = pct + '%';
}
document.addEventListener('langchange', render);
render();
})();
