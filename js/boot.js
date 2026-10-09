/* ============================================================
   DATA LOADER — reads the content files in /data (edited on the
   Admin page), then starts the page scripts.
   ------------------------------------------------------------
   Usage in a page:
   <script src="js/boot.js"
           data-json="NEWS=data/news.json#posts SERMONS=data/sermons.json#sermons"
           data-scripts="js/main.js js/news.js"></script>

   NAME=file#key  → window.NAME = (contents of file)[key]   (#key optional)
   The scripts in data-scripts run in order once all files are loaded.
   Note: the site must be opened through a web server (GitHub Pages,
   or "Live Server" in VS Code) — browsers block these files when a
   page is opened by double-clicking it.
   ============================================================ */
(function(){
  const me = document.currentScript;
  const specs = (me.dataset.json || '').trim().split(/\s+/).filter(Boolean);
  const scripts = (me.dataset.scripts || '').trim().split(/\s+/).filter(Boolean);
  const bust = '?v=' + Math.floor(Date.now() / 60000);        // fresh content after each edit (1-minute cache)

  // Newest first (by date, else year) — the Admin page may add items anywhere in the list
  const byDate = (a, b) => String(b.date || b.y || '').localeCompare(String(a.date || a.y || ''));
  const SORT = { NEWS: byDate, SERMONS: byDate };

  // Uploaded files may be saved as "/images/…" or "/files/…". The site lives in a
  // sub-folder (…/cek-website/), so make such paths relative: "images/…", "files/…".
  function fixPaths(v){
    if (typeof v === 'string') return v.replace(/^\/(?:cek-website\/)?((?:images|files)\/)/, '$1');
    if (Array.isArray(v)) return v.map(fixPaths);
    if (v && typeof v === 'object'){ for (const k in v) v[k] = fixPaths(v[k]); }
    return v;
  }

  function loadScript(src){
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = src + bust; s.async = false; s.onload = ok; s.onerror = fail;   // fresh scripts after each update, like the data
      document.body.appendChild(s);
    });
  }
  Promise.all(specs.map(spec => {
    const [name, path] = spec.split('=');
    const [file, key] = path.split('#');
    return fetch(file + bust)
      .then(r => { if (!r.ok) throw new Error(file + ' ' + r.status); return r.json(); })
      .then(data => {
        data = fixPaths(data);
        let v = key ? data[key] : data;
        if (Array.isArray(v) && SORT[name]) v = v.slice().sort(SORT[name]);
        window[name] = v;
      })
      .catch(err => { console.error('Could not load', file, err); window[name] = key ? [] : {}; });
  }))
  .then(() => scripts.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve()))
  .catch(err => console.error(err));
})();
