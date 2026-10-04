/* ============================================================
   TIGRINYA TRANSLATIONS
   The English text lives in index.html. Each element there with
   data-i18n="key" is replaced by the matching line below when the
   visitor switches to ትግርኛ. To fix a translation, edit the text
   on the right. To translate something new, add data-i18n="new.key"
   to the element in index.html and add "new.key": "..." here.

   Lines marked (EN) are the small second-language lines: they show
   Tigrinya in English mode, so in Tigrinya mode they show English.
   ============================================================ */
const TRANSLATIONS = {
  ti: {
    "skip":               "ናብ ትሕዝቶ ኪድ",
    "motto":              "እምነት • ኣገልግሎት • ሕብረት",
    "search.placeholder": "ድለዩ…",
    "photo":              "ስእሊ",
    "read":               "ተወሳኺ ኣንብቡ",

    /* Menu */
    "nav.menu":      "ምናዩ",
    "nav.home":      "ደምበ",
    "nav.about":     "ብዛዕባና",
    "nav.eparchy":   "ኤጳርቅና",
    "nav.parishes":  "ቁምስናታትን ማሕበረሰባትን",
    "nav.liturgy":   "ሊጡርጊያን እምነትን",
    "nav.news":      "ዜናን ፍጻመታትን",
    "nav.resources": "ጸጋታት",
    "nav.contact":   "ርኸቡና",

    /* Hero */
    "hero.eyebrow":  "ካቶሊካዊ ኤጳርቅና ከረን",
    "hero.title":    "ኣብ እምነት ዝሰረተ፡ ንህዝቢ ዘገልግል",
    "hero.text":     "ካቶሊካዊ ኤጳርቅና ከረን ምስ ምእመናን ኣብ ኤርትራ ይጓዓዝ፡ ወንጌል ይሰብኽ፡ ማሕበረሰባት ይሃንጽ፡ ተስፋ ድማ የዕቢ።",
    "hero.btn":      "ተወሳኺ ፍለጡ",
    "hero.motto":    "Faith · Service · Communion",          /* (EN) */

    /* Feature cards */
    "pope.eyebrow":  "ቅዱስ ኣቦ",
    "pope.name":     "ር.ሊ.ጳ. ሊዮ 14ይ",
    "pope.alt":      "Pope Leo XIV",                          /* (EN) */
    "pope.text":     "ንቅዱስ ኣቦን ንዓለማዊ ተልእኾኡን ምጽላይ ቀጽሉ።",
    "pope.link":     "መልእኽቲ ኣንብቡ",
    "bishop.eyebrow":"ጳጳስና",
    "bishop.name":   "ጳጳስ ከረን",
    "bishop.alt":    "Bishop of Keren",                       /* (EN) */
    "bishop.text":   "ጓሳዊ ክንክን፡ ሓድነትን ተስፋን ንኤጳርቅናና።",
    "bishop.link":   "ተወሳኺ ፍለጡ",
    "build.eyebrow": "ፕሮጀክት ህንጻ",
    "build.title":   "ምዕባለ ህንጻ ቅዱስ ሚካኤል",
    "build.complete":"ተዛዚሙ",
    "build.text":    "ብሓባር ንጸሎት፡ ንትምህርትን ንማሕበረሰብን ገዛ ንሃንጽ።",
    "build.link":    "ነቲ ፕሮጀክት ደግፉ",

    /* News */
    "news.eyebrow":  "ሓደስቲ ዜናታትን ጽሑፋትን",
    "news.title":    "ካብ ኤጳርቅናና",
    "news.all":      "ኩሉ ዜናታት ርኣዩ",
    "tag.news":      "ዜና",
    "tag.article":   "ጽሑፍ",
    "tag.events":    "ፍጻመታት",
    "news1.title":   "ር.ሊ.ጳ. ሊዮ 14ይ፡ ጓሳ ተስፋ ንዘመንና",
    "news1.text":    "ቅዱስ ኣቦ ብመልእኽቲ ሰላምን ሓድነትን ንቤተ ክርስቲያን ምትብባዕ ቀጺሉ ኣሎ።",
    "news2.title":   "ጽባቐ ከረንን ህዝባን",
    "news2.text":    "ብዛዕባ እምነት፡ ጽንዓትን ሃብታም ባህልን ኤጳርቅናና ኣብ ኤርትራ ዝገልጽ ሓሳብ።",
    "news3.title":   "ጽምብል ትንሣኤ ኣብ ቁምስናታትና",
    "news3.text":    "ኣብ መላእ ኤጳርቅና ከረን ዝተኻየደ ሕጉስ ሊጡርጊያን ማሕበረሰባዊ በዓላትን።",

    /* Sermons */
    "sermons.eyebrow": "ፍሉይ ስብከት",
    "sermons.title":   "ስብከት ሰንበትን ረድዮ ቫቲካንን",
    "sermons.alt":     "Sunday Sermons & Radio Vatican",      /* (EN) */
    "sermons.source":  "ረድዮ ቫቲካን – ትግርኛ",
    "sermons.search":  "ብኣርእስቲ ወይ ብዓመት ድለዩ…",
    "sermons.empty":   "ምስ ድሌትኩም ዝሰማማዕ ስብከት የለን።",
    "sermons.link":    "ስምዑ / ተወሳኺ ኣንብቡ",

    /* Quick links */
    "q.sermons":       "ስብከታት",
    "q.sermons.alt":   "Sermons",                             /* (EN) */
    "q.articles":      "ጽሑፋት",
    "q.articles.alt":  "Articles",                            /* (EN) */
    "q.news":          "ዜናታት",
    "q.news.alt":      "News",                                /* (EN) */
    "q.calendar":      "ሊጡርጊያዊ ዓውደ-ኣዋርሕ",
    "q.calendar.alt":  "Liturgical Calendar",                 /* (EN) */
    "q.contact":       "ርኸቡና",
    "q.contact.alt":   "Contact Us",                          /* (EN) */
    "q.browse":        "ኩሉ ርኣዩ",
    "q.viewall":       "ኩሉ ርኣዩ",
    "q.viewcal":       "ዓውደ-ኣዋርሕ ርኣዩ",
    "q.touch":         "ተራኸቡና",

    /* Scripture banner */
    "quote.text":      "“ክልተ ወይ ሰለስተ ብስመይ ኣብ ዝተኣከቡሉ፡ ኣነ ኣብ ማእከሎም ኣለኹ።”",
    "quote.ref":       "— ማቴዎስ 18፡20",

    /* Footer */
    "foot.name":       "ካቶሊካዊ ኤጳርቅና ከረን",
    "foot.country":    "ኤርትራ",
    "footer.rights":   "ካቶሊካዊ ኤጳርቅና ከረን። ኩሉ መሰላት ዝተሓለወ እዩ።"
  }
};
