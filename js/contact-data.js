/* ============================================================
   CONTACT DETAILS (contact.html) — fill these in
   ------------------------------------------------------------
   Leave a value as "" if you don't have it yet: the page then shows
   "To be added". Fields ending in _ti are Tigrinya (optional).

   email     → the contact form opens the visitor's email app,
               addressed to this email (no server needed)
   whatsapp  → number with country code, digits only, e.g. "2917123456"
               (adds a "Send via WhatsApp" button to the form)
   mapQuery  → what the map shows, e.g. "Keren, Eritrea" or the
               exact address / Google Maps place name
   ============================================================ */
const CONTACT = {
  name:     "Catholic Eparchy of Keren",
  name_ti:  "ካቶሊካዊ ኤጳርቅና ከረን",
  address:    "Keren, Eritrea",            // e.g. "P.O. Box …, Keren, Eritrea"
  address_ti: "ከረን፣ ኤርትራ",
  phone:    "",                            // e.g. "+291 1 40 00 00"
  email:    "",                            // e.g. "info@…"
  whatsapp: "",
  hours:    "",                            // e.g. "Monday – Friday, 8:00 – 12:00 and 14:00 – 17:30"
  hours_ti: "",
  mapQuery: "Keren, Eritrea",

  /* Offices — one entry per office (sample: true = example, replace or delete) */
  offices: [
    { name: "Bishop’s Office · Eparchial Curia", name_ti: "ቤት ጽሕፈት ጳጳስ · ቤት ምምሕዳር ኤጳርቅና",
      person: "", person_ti: "", phone: "", email: "", sample: true },
    { name: "CESK — Caritas / Social Services", name_ti: "CESK — ካሪታስ / ማሕበራዊ ኣገልግሎት",
      person: "", person_ti: "", phone: "", email: "", link: "cesk.html", sample: true },
    { name: "Pastoral & Liturgy Office", name_ti: "ቤት ጽሕፈት ጓስነትን ሊጡርጊያን",
      person: "", person_ti: "", phone: "", email: "", link: "liturgy.html", sample: true },
    { name: "Vocations & Seminary", name_ti: "ጻውዒትን ሰሚናርዮን",
      person: "", person_ti: "", phone: "", email: "", link: "eparchy.html#seminary", sample: true },
  ],
};
