/* ============================================================
   EPARCHY PAGE DATA — priests, deaneries and religious orders
   ------------------------------------------------------------
   Edit the lists below; the Eparchy page (eparchy.html) updates
   automatically. Fields ending in _ti are the Tigrinya text
   (optional — if left out, the English text is shown).

   Entries marked  sample: true  are EXAMPLES that show the layout.
   Replace them with real information (and delete "sample: true"),
   or delete them.
   ============================================================ */
const EPARCHY = {

  /* ---------- Priests ----------
     photo: optional, e.g. "images/priests/abba-name.jpg"           */
  priests: [
    { name: "Abba — Name of priest", name_ti: "ኣባ — ስም ካህን",
      role: "Vicar General",          role_ti: "ጠቕላሊ ቪካር",
      place: "Eparchial Curia, Keren", place_ti: "ቤት ምምሕዳር ኤጳርቅና፡ ከረን",
      photo: "", sample: true },
    { name: "Abba — Name of priest", name_ti: "ኣባ — ስም ካህን",
      role: "Chancellor",             role_ti: "ቻንስለር",
      place: "Eparchial Curia, Keren", place_ti: "ቤት ምምሕዳር ኤጳርቅና፡ ከረን",
      photo: "", sample: true },
    { name: "Abba — Name of priest", name_ti: "ኣባ — ስም ካህን",
      role: "Parish Priest",          role_ti: "ኣባ ሰበኻ",
      place: "Name of parish",        place_ti: "ስም ቍምስና",
      photo: "", sample: true },
  ],

  /* ---------- Deaneries ----------
     Each deanery lists its parishes.                                  */
  deaneries: [
    { name: "Name of deanery", name_ti: "ስም ዲነሪ",
      dean: "Abba — Name of dean", dean_ti: "ኣባ — ስም ዲን",
      parishes: ["Parish 1", "Parish 2", "Parish 3"],
      parishes_ti: ["ቍምስና 1", "ቍምስና 2", "ቍምስና 3"],
      sample: true },
    { name: "Name of deanery", name_ti: "ስም ዲነሪ",
      dean: "Abba — Name of dean", dean_ti: "ኣባ — ስም ዲን",
      parishes: ["Parish 1", "Parish 2"],
      parishes_ti: ["ቍምስና 1", "ቍምስና 2"],
      sample: true },
  ],

  /* ---------- Religious orders and congregations ----------
     type: "men" or "women"                                           */
  orders: [
    { name: "De La Salle Christian Brothers", name_ti: "ኣሕዋት ክርስቲያን ደ ላ ሳል",
      type: "men",
      work: "Education — St Joseph School, Keren", work_ti: "ትምህርቲ — ቤት ትምህርቲ ቅዱስ ዮሴፍ፡ ከረን" },
    { name: "Name of congregation (men)", name_ti: "ስም ማሕበር (ደቂ ተባዕትዮ)",
      type: "men",
      work: "Mission / work · Place", work_ti: "ተልእኾ / ስራሕ · ቦታ", sample: true },
    { name: "Name of congregation (women)", name_ti: "ስም ማሕበር (ደቂ ኣንስትዮ)",
      type: "women",
      work: "Mission / work · Place", work_ti: "ተልእኾ / ስራሕ · ቦታ", sample: true },
  ],
};
