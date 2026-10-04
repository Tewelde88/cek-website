/* ---------- Sermons data: edit this array (newest first) ----------
   Used by the Sermons page (sermons.html) and the sermon card on the home page.
   t  = English title
   ti = Tigrinya title (optional — if left out, the English title is shown)
   y  = year,  href = link to the file (text / PDF / page)
   Optional extras (shown on the Sermons page as buttons):
   date  = "YYYY-MM-DD"        by / by_ti = preacher
   audio = "files/sermons/name.mp3"  (Listen — plays on the page)
   video = "https://youtube.com/…"   (Watch)
   pdf   = "files/sermons/name.pdf"  (Read)
   Example: {t:"Christmas homily", ti:"ስብከት ልደት", y:2026, date:"2026-01-07",
             by:"Bishop Kidane Yebio", by_ti:"ብፁዕ ኣቡነ ኪዳነ የብዮ", audio:"files/sermons/christmas.mp3"},
   ------------------------------------------------------------------ */
const SERMONS = [
  {t:"Sermon title — 1st Sunday",  ti:"ኣርእስቲ ስብከት — 1ይ ሰንበት", y:2026, href:"#"},
  {t:"Feast of the Holy Cross",    ti:"በዓል መስቀል",             y:2026, href:"#"},
  {t:"New Year reflection",        ti:"ሓሳባት ሓድሽ ዓመት",         y:2026, href:"#"},
  {t:"Ordination of deacons",      ti:"ሲመት ዲያቆናት",            y:2026, href:"#"},
  {t:"Pentecost homily",           ti:"ስብከት በዓለ ሃምሳ",          y:2026, href:"#"},
  {t:"Easter Sunday",              ti:"ሰንበት ትንሣኤ",            y:2026, href:"#"},
  {t:"Christmas message",          ti:"መልእኽቲ ልደት",            y:2025, href:"#"},
  {t:"Anniversary celebrations",   ti:"በዓል ዝኽሪ ዓመት",          y:2025, href:"#"},
  {t:"All Saints",                 ti:"በዓል ኩሎም ቅዱሳን",         y:2025, href:"#"},
  {t:"Assumption of Mary",         ti:"ፍልሰታ ማርያም",            y:2025, href:"#"},
  {t:"Holy Thursday",              ti:"ሓሙስ ጸሎት",              y:2025, href:"#"},
  {t:"Lenten reflection",          ti:"ሓሳባት ዓቢይ ጾም",          y:2024, href:"#"},
  {t:"Thanksgiving Day",           ti:"መዓልቲ ምስጋና",            y:2024, href:"#"},
  {t:"Feast of the Holy Trinity",  ti:"በዓል ቅድስት ሥላሴ",         y:2024, href:"#"}
];
