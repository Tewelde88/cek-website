# Catholic Eparchy of Keren — website

Live site: **https://tewelde88.github.io/cek-website/**
Admin page (post news, sermons, books, photos, videos): **https://tewelde88.github.io/cek-website/admin/**
→ Step-by-step guide for editors: **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)**

Bilingual (English ⇄ Tigrinya), works on phones, tablets and computers. Plain HTML/CSS/JavaScript, hosted free on GitHub Pages.

## Pages
| Page | File | Content edited on the Admin page |
|---|---|---|
| Home (shepherds, ribbon links, news, “Pastoral life” book, “The Eparchy in numbers”, CESK invitation (the mesob of six areas), the liturgical year as a scroll, Questions + Newsletter) | `index.html` | latest news posts; the Pastoral life book and “The Eparchy in numbers” count parishes, chapels, sanctuaries, priests and religious orders by themselves |
| Eparchy — contents, “The shepherd of the Eparchy” (current bishop, motto, his three tasks), “Our story” (foundation, growth, commitment — Admin page → Eparchy), bishops, “How the Eparchy is organised” (levels of service with live counts), priests, “Belonging to the Eparchy” (a path through life), seminary, orders, “Where we are” (map zoom: Africa → Eritrea → Eparchy → satellite / Google Earth; images in images/maps/), history, “Meet them more closely” (two doors: Bishop’s page, Priests directory), priests, seminary, orders, history | `eparchy.html` | (counts come from the lists below) |
| Eparchy › Bishop (profile, interactive timeline, biography) | `bishop.html` | — |
| Eparchy › Priests (search, role filter, sort, grid/list, profile window) | `priests.html` | priests |
| Eparchy › Seminary (step-by-step path, vocations) | `seminary.html` | — |
| Eparchy › Deaneries (cards open to show parishes) | `deaneries.html` | deaneries |
| Eparchy › Religious Orders (men/women filter, details window) | `religious.html` | religious orders |
| Parishes & Chapels | `parishes.html` | parishes, chapels, communities, sanctuaries |
| Liturgy (+ Ge'ez liturgical calendar) | `liturgy.html` | — (calendar is calculated) |
| News (blog + photo gallery) | `news.html` | news posts, photos, videos |
| Sermons (Archive) | `sermons.html` | sermons: audio, video, PDF |
| Library | `library.html` | books and documents (PDF or link) |
| CESK — Caritas | `cesk.html` | — |
| Contact Us | `contact.html` | address, phone, email, WhatsApp, offices |
| St. Michael’s building project | `building.html` | progress (church drawing), stages, story, photos, how to help — data in `data/building.json` |
| Pastoral | `pastoral.html` | hub: Liturgy, Formation, Vocation, Projects + Christian communities (from `data/parishes.json`) |
| Resources | `resources.html` | hub: Sermons, Library, Liturgical calendar, Archive |
| Projects | `projects.html` | St. Michael’s (from `data/building.json`) + other projects from `data/projects.json` |
| Formation | `formation.html` | catechesis, youth, families, catechists, liturgical formation |
| Vocation | `vocation.html` | priesthood, religious life, first steps, prayer for vocations |
| Major / Minor Seminary | `major-seminary.html`, `minor-seminary.html` | pages to be completed |

## Where things are
```
admin/            Admin page (Sveltia CMS) — config.yml defines all the forms
data/*.json       Content edited on the Admin page (news, sermons, library, eparchy, parishes, contact)
images/           Photos (uploads go to images/news, images/priests, … )
files/            Uploaded documents, audio and videos (files/library, files/sermons, files/videos)
css/style.css     Shared design — colours and fonts are variables at the top (:root)
css/*.css         Page-specific styles (calendar, liturgy, eparchy, parishes, news, resources, contact)
js/boot.js        Loads data/*.json, then starts the page scripts
js/main.js        Menu, language switch, slider, "Show more" boxes, pop-ups, home sermon card
js/translations.js  All Tigrinya interface text (keys used by data-i18n="…" in the HTML)
js/calendar.js    Ethiopian ⇄ Gregorian calendar, feasts and fasts
js/news.js · eparchy.js · parishes.js · resources.js (sermons + library) · contact.js
```

## Previewing on your computer
The pages read their content from `data/*.json`, so they must be opened through a web server, not by double-clicking:
VS Code → install **Live Server** → right-click `index.html` → **Open with Live Server**.

## Things still edited in the files (not on the Admin page)
- **Fixed page texts** (e.g. Liturgy, CESK, Seminary descriptions): English in the `.html` file, Tigrinya in `js/translations.js` (same `data-i18n` key).
- **Cover photos on the home page:** `images/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` (add more by copying a `<div class="slide">` line in `index.html`).
- **Building progress (68%):** `index.html` → `data-value`, `aria-valuenow` and the `68%` text.
- **Feasts of the calendar:** `FIXED_FEASTS` and `MOVABLE_FEASTS` in `js/calendar.js`.
- **"Show more" heights:** `data-clamp="…"` on each `clamp-box`.

## Liturgical calendar
Ethiopian (Ge'ez rite) calendar with Gregorian dates. Easter (Fasika) uses the Alexandrian computus (same date as the Ethiopian/Eritrean Churches); movable feasts and fasts are counted from it. Christmas is 29 Tahsas (28 Tahsas in the year after a leap year), so it stays on 7 January.

## Main menu

Home · News · Eparchy ▾ · Deaneries ▾ · CESK · Pastoral ▾ · Resources ▾ · Contact us.
The menu (`<ul id="site-nav">`) is written into every page; when you change it, change every page
the same way (only the `class="active"` / `aria-current` marks differ). Christian communities
are shown on the Pastoral page; parishes can be filtered by deanery (fill in “Deanery” for each parish
on the Admin page).

Site map (the menu follows it):
- **Eparchy** › Bishop, Priests, Seminary (› Major Seminary, Minor Seminary), Religious Orders, Blessed Memory (`blessed-memory.html`)
- **Deaneries** › Keren, Habinmentel, Hagaz · Parishes, Chapels, Sanctuaries
- **CESK** › Emergency Relief, Health Care, Education Support, Water & Agriculture, Women & Youth, Elderly & Disabled (`cesk-*.html`, to be completed)
- **Pastoral** › Liturgy (› Sacraments and Sacramentals, Chanting, Icons and Architecture, Ge’ez Language — linked from “More about the liturgy” on the Liturgy page), Formation, Vocation, Christian Communities, Projects (› St. Michael’s Building Project)
- **News** › News Archive (`news-archive.html`: every post by year and month; the shelf of yearly volumes also sits under the list on news.html)
- **Resources** › Liturgical Calendar, Sermons, Library, News Archive

A page under another one is indented in its menu list (`<li class="sub-in">`). Every lower-level page shows
a breadcrumb at the top (`<p class="crumbs">`, e.g. “Pastoral › Projects › St. Michael’s Building Project”).
