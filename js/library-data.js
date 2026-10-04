/* ============================================================
   LIBRARY (library.html) — documents, books and texts
   ------------------------------------------------------------
   Add one { … } block per item. Fields ending in _ti are Tigrinya.
   category: "bible", "church", "liturgy", "catechesis", "social", "eparchy"
   lang:     language of the document, e.g. "English", "Tigrinya", "Ge'ez"
   url:      a web link, or a file you put on the site,
             e.g. "files/library/prayer-book.pdf"
   cover:    optional picture of the cover, e.g. "images/library/prayer-book.jpg"
   sample: true  marks an EXAMPLE — replace or delete.
   ============================================================ */
const LIBRARY = [
  { title: "The Holy Bible", title_ti: "መጽሓፍ ቅዱስ",
    author: "New American Bible (Vatican website)", author_ti: "New American Bible (መርበብ ቫቲካን)",
    year: "", category: "bible", lang: "English",
    url: "https://www.vatican.va/archive/ENG0839/_INDEX.HTM" },

  { title: "Catechism of the Catholic Church", title_ti: "ትምህርተ ክርስትና ካቶሊካዊት ቤተ ክርስቲያን",
    author: "Holy See", author_ti: "ቅድስቲ መንበር",
    year: 1992, category: "catechesis", lang: "English",
    url: "https://www.vatican.va/archive/ENG0015/_INDEX.HTM" },

  { title: "Sacrosanctum Concilium — Constitution on the Sacred Liturgy", title_ti: "ሳክሮሳንክቱም ኮንሲልዩም — ቅዋም ብዛዕባ ቅድስቲ ሊጡርጊያ",
    author: "Second Vatican Council", author_ti: "ካልኣይ ጉባኤ ቫቲካን",
    year: 1963, category: "liturgy", lang: "English",
    url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_en.html" },

  { title: "Orientalium Ecclesiarum — Decree on the Eastern Catholic Churches", title_ti: "ኦሪየንታልዩም ኤክለስያሩም — ብዛዕባ ምብራቓውያን ካቶሊካውያን ኣብያተ ክርስቲያናት",
    author: "Second Vatican Council", author_ti: "ካልኣይ ጉባኤ ቫቲካን",
    year: 1964, category: "church", lang: "English",
    url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_orientalium-ecclesiarum_en.html" },

  { title: "Lumen Gentium — Dogmatic Constitution on the Church", title_ti: "ሉመን ጀንትዩም — ቅዋም ብዛዕባ ቤተ ክርስቲያን",
    author: "Second Vatican Council", author_ti: "ካልኣይ ጉባኤ ቫቲካን",
    year: 1964, category: "church", lang: "English",
    url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html" },

  { title: "Dei Verbum — Dogmatic Constitution on Divine Revelation", title_ti: "ደይ ቨርቡም — ቅዋም ብዛዕባ መለኮታዊ ራእይ",
    author: "Second Vatican Council", author_ti: "ካልኣይ ጉባኤ ቫቲካን",
    year: 1965, category: "bible", lang: "English",
    url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html" },

  { title: "Compendium of the Social Doctrine of the Church", title_ti: "ጽማቝ ማሕበራዊ ትምህርቲ ቤተ ክርስቲያን",
    author: "Pontifical Council for Justice and Peace", author_ti: "ጳጳሳዊ ባይቶ ፍትሕን ሰላምን",
    year: 2004, category: "social", lang: "English",
    url: "https://www.vatican.va/roman_curia/pontifical_councils/justpeace/documents/rc_pc_justpeace_doc_20060526_compendio-dott-soc_en.html" },

  { title: "Laudato Si’ — On Care for Our Common Home", title_ti: "ላውዳቶ ሲ — ብዛዕባ ክንክን ሓባራዊ ገዛና",
    author: "Pope Francis", author_ti: "ር.ሊ.ጳ. ፍራንቸስኮስ",
    year: 2015, category: "social", lang: "English",
    url: "https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html" },

  // ---- Examples: books of the Eparchy (put the PDF in files/library/) ----
  { title: "Prayer book (title)", title_ti: "መጽሓፍ ጸሎት (ኣርእስቲ)",
    author: "Catholic Eparchy of Keren", author_ti: "ካቶሊካዊ ኤጳርቅና ከረን",
    year: "", category: "eparchy", lang: "Tigrinya",
    url: "", sample: true },
  { title: "Order of the Qiddase (title)", title_ti: "ሥርዓተ ቅዳሴ (ኣርእስቲ)",
    author: "Catholic Eparchy of Keren", author_ti: "ካቶሊካዊ ኤጳርቅና ከረን",
    year: "", category: "liturgy", lang: "Ge'ez · Tigrinya",
    url: "", sample: true },
];
