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

## Liturgical calendar (calendar.html)
- Ethiopian (Ge'ez rite) calendar with Gregorian dates: today, date converter, month view, and the full list of feasts and fasts for any year (with Print).
- Engine and feast list: `js/calendar.js`. Fixed feasts are in `FIXED_FEASTS` (Ethiopian month 1–13, day); feasts that move with Easter are in `MOVABLE_FEASTS` (days from Fasika). Names in English and Tigrinya are in `NAMES` in the same file.
- Easter (Fasika) uses the Alexandrian computus (same date as the Ethiopian/Eritrean Churches). Christmas is 29 Tahsas (28 Tahsas in the year after a leap year), so it stays on 7 January.
- Styles: `css/calendar.css`. Page labels in Tigrinya: `cal.*` keys in `js/translations.js`.
