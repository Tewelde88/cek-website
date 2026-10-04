# Diocese website template

Modern, responsive design — works on phones, tablets, laptops and large screens.

## Structure
```
├── index.html        Page markup (header + menu, photo slider, content cards, footer)
├── css/style.css     All styling – colours, fonts, corner radius are variables at the top (:root)
├── js/translations.js  Tigrinya text for the EN ⇄ ትግ language switch
├── js/sermons.js     Sermon list data – add one line per sermon, newest first
├── js/main.js        Sermon search, slider (swipe/arrows/autoplay), progress bar, mobile menu
├── images/           Your photos
└── backup-old-design/  The previous design (safe to delete once you're happy)
```

## Editing in VS Code
1. File → Open Folder → select this folder.
2. Install the **Live Server** extension, right-click `index.html` → "Open with Live Server" for auto-reload while editing.
   (Or just double-click `index.html` to open it in a browser.)

## Common edits
- **Name / motto:** `index.html`, inside `<header class="topbar">` and the footer.
- **Colours:** `css/style.css` → `--brand`, `--gold`, etc.
- **Add a sermon:** `js/sermons.js` → `{t:"Title", y:2026, href:"sermons/file.pdf"},`
- **Photos:** see `images/README.txt` for the file names (hero-1.jpg, pope.jpg, news-1.jpg …).
- **Slider speed:** `js/main.js` → `DELAY = 6000` (milliseconds).
- **News cards:** edit the titles, dates and text in `index.html` (search for "News cards").
- **Building progress:** in `index.html` change `68` in `data-value`, `aria-valuenow` and the `68%` text.

## Screen sizes
- Under 480px (small phones): full-width slider, swipe to change photos, ☰ menu.
- 480–1179px (phones/tablets): ☰ menu; cards in two columns from 720px.
- 1180px and up (laptops/desktops): full menu bar, three-column layout.

## Language switch (EN ⇄ ትግ)
- The **EN / ትግ** button in the header switches the whole page. The visitor's choice is remembered.
- English text is written in `index.html`. Tigrinya text is in `js/translations.js`.
- To translate a new piece of text: add `data-i18n="my.key"` to the element in `index.html`,
  then add `"my.key": "ትግርኛ ጽሑፍ",` to `js/translations.js`.
- Sermons: add a `ti:"..."` title next to `t:"..."` in `js/sermons.js`.
- Menu items swap automatically (English label ⇄ Tigrinya label).

## Liturgy page (liturgy.html)
- Sub-sections with a sticky sub-menu: Divine Liturgy, Divine Office, Liturgical Calendar, Liturgical Formation, Resources. Edit the text in `liturgy.html` (English) and the `lit.*` keys in `js/translations.js` (Tigrinya). Styles: `css/liturgy.css`.
- To add a resource link: copy one `<a class="res-item">` block in the Resources section.
- `calendar.html` only forwards old links to `liturgy.html#calendar`.

### Liturgical calendar (section of liturgy.html)
- Ethiopian (Ge'ez rite) calendar with Gregorian dates: today, date converter, month view, and the full list of feasts and fasts for any year (with Print).
- Engine and feast list: `js/calendar.js`. Fixed feasts are in `FIXED_FEASTS` (Ethiopian month 1–13, day); feasts that move with Easter are in `MOVABLE_FEASTS` (days from Fasika). Names in English and Tigrinya are in `NAMES` in the same file.
- Easter (Fasika) uses the Alexandrian computus (same date as the Ethiopian/Eritrean Churches). Christmas is 29 Tahsas (28 Tahsas in the year after a leap year), so it stays on 7 January.
- Styles: `css/calendar.css`. Page labels in Tigrinya: `cal.*` keys in `js/translations.js`.

## Eparchy page (eparchy.html)
- Sub-sections: Bishop, Priests, Seminary, Deaneries, Religious Orders (sticky sub-menu, EN/Tigrinya).
- **Priests, deaneries and religious orders** are lists in `js/eparchy-data.js` — add one entry per person/deanery/community. Entries with `sample: true` are examples (shown with an "Example" tag); replace or delete them.
- Priest photos: put them in `images/` (e.g. `images/priests/abba-name.jpg`) and set `photo:` in the entry.
- Each sub-section is shown as a gallery (photo tiles) inside a "Show more" box. The visible height is `data-clamp="…"` (pixels) on the `clamp-box` in `eparchy.html`; the button only appears when there is more to see. Optional photos: `photo:` in each entry of `js/eparchy-data.js`; seminary tiles use `images/seminary-minor.jpg`, `images/seminary-major.jpg`, `images/vocations.jpg`.
- Section texts: `eparchy.html` (English) and the `ep.*` keys in `js/translations.js` (Tigrinya). Styles: `css/eparchy.css`.

## Parishes & Chapels page (parishes.html)
- Sub-sections: Parishes, Chapels, Christian Communities, Sanctuaries (sticky sub-menu, EN/Tigrinya).
- All lists are in `js/parishes-data.js`. Parish fields: name, patron, deanery, place, priest, mass (Mass times), phone, map (optional Google Maps link). Empty fields are simply not shown; a parish with no details shows "Details coming soon".
- The six parishes named in Bishop Kidane's biography are listed; entries with `sample: true` are examples to replace or delete.
- Styles: `css/parishes.css`. Section texts: `parishes.html` and the `pa.*` keys in `js/translations.js`.

## News page (news.html) — blog with photo gallery
- **To post news:** open `js/news-data.js`, copy one `{ … }` block to the TOP of the list, change id, date, category, title, text and photos. Put the photos in a folder such as `images/news/2026-10-easter/`.
- The News page shows the newest post large, the rest in a grid (filter by category, search, "Load more"). Each post has its own page (`news.html#post=<id>`) with a photo gallery, a full-screen photo viewer and share buttons (WhatsApp, Facebook, copy link).
- The **Gallery** tab shows every photo from every post.
- The 3 news cards on the home page are the 3 newest posts — no separate editing needed.
- Posts with `sample: true` are examples to replace or delete. Styles: `css/news.css`.

## Home buttons and the CESK, Sermons and Library pages
- Three buttons under the cover photo on the home page link to `cesk.html`, `sermons.html` and `library.html`.
- **Sermons** (`sermons.html`): built from `js/sermons.js`. Each sermon can have `audio` (plays on the page), `video` and `pdf` links, a `date` and a preacher (`by`). Year filters and search. The menu item "Archive" opens this page; the header search box also searches here.
- **Library** (`library.html`): items in `js/library-data.js` (title, author, year, category, language, url, optional cover picture). Put your own PDFs in `files/library/`.
- **CESK** (`cesk.html`): Caritas / social service office — About, Our Work (photo tiles: `images/cesk-*.jpg`), Get Involved, Resources. Texts in `cesk.html` and the `ck.*` keys in `js/translations.js`; please replace the general descriptions with the office's real programmes.

## Contact page (contact.html)
- **Fill in the details in `js/contact-data.js`**: address, phone, email, WhatsApp, office hours, map location, and the list of offices. Empty values show "To be added".
- The contact form needs no server: it opens the visitor's email app with the message ready to send to the `email` you set (and, if `whatsapp` is set, a "Send via WhatsApp" button). Until `email` is set, the form asks visitors to phone instead.
- All "Contact Us" links on the site point to this page.
