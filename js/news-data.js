/* ============================================================
   NEWS POSTS — the News page (news.html) and the 3 news cards on
   the home page are built from this list.
   ------------------------------------------------------------
   HOW TO POST NEWS
   1. Put the photos in a folder, e.g.  images/news/2026-10-easter/
   2. Copy one { … } block below, paste it at the TOP of the list
      (newest first) and change the text.
   3. Save — the post appears on the News page and on the home page.

   id        short unique name used in the link (letters, numbers, -)
   date      "YYYY-MM-DD"
   category  "news", "article" or "event"
   title / title_ti, excerpt / excerpt_ti   (_ti = Tigrinya, optional)
   body / body_ti   list of paragraphs, one "…" per paragraph
   cover     main photo (optional — a colour is shown without it)
   gallery   photos shown in the post and in the Gallery:
             { src: "images/…jpg", caption: "…", caption_ti: "…" }
   sample: true  marks an EXAMPLE post — replace or delete it.
   ============================================================ */
const NEWS = [

  { id: "pope-leo-shepherd-of-hope",
    date: "2026-05-12",
    category: "news",
    title:    "Pope Leo XIV: A Shepherd of Hope for Our Time",
    title_ti: "ር.ሊ.ጳ. ሊዮ 14ይ፡ ጓሳ ተስፋ ንዘመንና",
    excerpt:    "The Holy Father continues to inspire the Church with his message of peace and unity.",
    excerpt_ti: "ቅዱስ ኣቦ ብመልእኽቲ ሰላምን ሓድነትን ንቤተ ክርስቲያን ምትብባዕ ቀጺሉ ኣሎ።",
    body: [
      "The Holy Father continues to inspire the Church with his message of peace and unity.",
      "This is an example post that shows how a news article looks. Replace its text, date and photos in js/news-data.js."
    ],
    body_ti: [
      "ቅዱስ ኣቦ ብመልእኽቲ ሰላምን ሓድነትን ንቤተ ክርስቲያን ምትብባዕ ቀጺሉ ኣሎ።",
      "እዚ ዜና ከመይ ከም ዝመስል ዘርኢ ኣብነታዊ ጽሑፍ እዩ። ጽሑፉ፡ ዕለቱን ስእልታቱን ኣብ js/news-data.js ቀይሩ።"
    ],
    cover: "images/pope.jpg",
    gallery: [
      { src: "images/pope.jpg", caption: "Pope Leo XIV", caption_ti: "ር.ሊ.ጳ. ሊዮ 14ይ" }
    ],
    sample: true },

  { id: "beauty-of-keren",
    date: "2026-04-28",
    category: "article",
    title:    "The Beauty of Keren and Its People",
    title_ti: "ጽባቐ ከረንን ህዝባን",
    excerpt:    "A reflection on the faith, resilience and rich culture of our Eparchy in Eritrea.",
    excerpt_ti: "ብዛዕባ እምነት፡ ጽንዓትን ሃብታም ባህልን ኤጳርቅናና ኣብ ኤርትራ ዝገልጽ ሓሳብ።",
    body: [
      "A reflection on the faith, resilience and rich culture of our Eparchy in Eritrea.",
      "This is an example post. Replace it with a real article."
    ],
    body_ti: [
      "ብዛዕባ እምነት፡ ጽንዓትን ሃብታም ባህልን ኤጳርቅናና ኣብ ኤርትራ ዝገልጽ ሓሳብ።",
      "እዚ ኣብነታዊ ጽሑፍ እዩ። ብሓቀኛ ጽሑፍ ቀይርዎ።"
    ],
    cover: "",
    gallery: [],
    sample: true },

  { id: "easter-celebrations",
    date: "2026-04-15",
    category: "event",
    title:    "Easter Celebrations in Our Parishes",
    title_ti: "ጽምብል ትንሣኤ ኣብ ቍምስናታትና",
    excerpt:    "Joyful liturgies and community celebrations across the Eparchy of Keren.",
    excerpt_ti: "ኣብ መላእ ኤጳርቅና ከረን ዝተኻየደ ሕጉስ ሊጡርጊያን ማሕበረሰባዊ በዓላትን።",
    body: [
      "Joyful liturgies and community celebrations across the Eparchy of Keren.",
      "This is an example post. Add the photos of your celebration to its gallery."
    ],
    body_ti: [
      "ኣብ መላእ ኤጳርቅና ከረን ዝተኻየደ ሕጉስ ሊጡርጊያን ማሕበረሰባዊ በዓላትን።",
      "እዚ ኣብነታዊ ጽሑፍ እዩ። ስእልታት ጽምብልኩም ኣብ ጋለሪኡ ወስኹ።"
    ],
    cover: "",
    gallery: [
      { src: "images/bishop.jpg", caption: "Bishop Kidane Yebio", caption_ti: "ብፁዕ ኣቡነ ኪዳነ የብዮ" }
    ],
    sample: true },
];
