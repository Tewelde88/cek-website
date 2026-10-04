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
- **Name / tagline:** `index.html`, inside `<header>` (and again in `<footer>`).
- **Colours:** `css/style.css` → `--brand`, `--gold`, etc.
- **Add a sermon:** `js/sermons.js` → `{t:"Title", y:2026, href:"sermons/file.pdf"},`
- **Slider photo:** in `index.html` change a slide's `style` to `background-image:url('images/photo.jpg')`.
- **Slider speed:** `js/main.js` → `DELAY = 5000` (milliseconds).
- **Leader photo:** replace `<div class="portrait">Photo</div>` with `<div class="portrait"><img src="images/bishop.jpg" alt="Bishop's Name"></div>`.
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
