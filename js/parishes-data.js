/* ============================================================
   PARISHES & CHAPELS PAGE DATA (parishes.html)
   ------------------------------------------------------------
   Add one entry per parish, chapel, Christian community or
   sanctuary. Fields ending in _ti are the Tigrinya text (optional).
   Leave a field empty ("") if you don't have the information yet.

   map: optional link to Google Maps. If empty, the "Map" button
        searches Google Maps for the name and place.
   Entries marked  sample: true  are EXAMPLES — replace or delete.
   ============================================================ */
const PARISHES_DATA = {

  /* ---------- Parishes ----------
     The six parishes below are named in Bishop Kidane's biography.
     Fill in the details (patron saint, deanery, priest, Mass times…). */
  parishes: [
    { name: "Haddish Addi", name_ti: "ሓዲሽ ዓዲ",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    { name: "Shinnara", name_ti: "ሽናራ",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    { name: "Jengeren", name_ti: "ጀንገረን",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    { name: "Halhal", name_ti: "ሃልሃል",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    { name: "Afabet", name_ti: "ዓፋበት",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    { name: "Bambi", name_ti: "ባምቢ",
      patron: "", patron_ti: "", deanery: "", deanery_ti: "", place: "", place_ti: "",
      priest: "", priest_ti: "", mass: "", mass_ti: "", phone: "", map: "" },
    // Example of a complete entry:
    { name: "Name of parish", name_ti: "ስም ቍምስና",
      patron: "St Mary", patron_ti: "ቅድስት ማርያም",
      deanery: "Name of deanery", deanery_ti: "ስም ዲነሪ",
      place: "Town / village", place_ti: "ከተማ / ዓዲ",
      priest: "Abba — Name of priest", priest_ti: "ኣባ — ስም ካህን",
      mass: "Sunday 7:00 & 9:00 · Weekdays 6:30", mass_ti: "ሰንበት 7:00ን 9:00ን · መዓልታት ስራሕ 6:30",
      phone: "+291 0 000 000", map: "", sample: true },
  ],

  /* ---------- Chapels ---------- */
  chapels: [
    { name: "Name of chapel", name_ti: "ስም ቤተ ጸሎት",
      parish: "Name of parish", parish_ti: "ስም ቍምስና",
      place: "Village / neighbourhood", place_ti: "ዓዲ / ከባቢ",
      mass: "Sunday 8:00", mass_ti: "ሰንበት 8:00", sample: true },
    { name: "Name of chapel", name_ti: "ስም ቤተ ጸሎት",
      parish: "Name of parish", parish_ti: "ስም ቍምስና",
      place: "Village / neighbourhood", place_ti: "ዓዲ / ከባቢ",
      mass: "", mass_ti: "", sample: true },
  ],

  /* ---------- Small Christian communities ---------- */
  communities: [
    { name: "Name of community", name_ti: "ስም ማሕበረሰብ",
      parish: "Name of parish", parish_ti: "ስም ቍምስና",
      meets: "Every Wednesday evening — prayer and Bible reading", meets_ti: "ኩሉ ረቡዕ ምሸት — ጸሎትን ንባብ መጽሓፍ ቅዱስን",
      sample: true },
  ],

  /* ---------- Sanctuaries and places of pilgrimage ---------- */
  sanctuaries: [
    { name: "Name of sanctuary", name_ti: "ስም ቅዱስ ቦታ",
      dedication: "Dedicated to …", dedication_ti: "ዝተወፈየ ን…",
      place: "Town / village", place_ti: "ከተማ / ዓዲ",
      feast: "Annual pilgrimage: feast day", feast_ti: "ዓመታዊ ንግደት፡ መዓልቲ በዓል",
      map: "", sample: true },
  ],
};
