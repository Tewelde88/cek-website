/* ============================================================
   PARISH INFORMATION FORM — creates a bilingual Google Form
   (English / Tigrinya) and a Google Sheet for the answers.

   How to use (one time only):
   1. Open https://script.google.com and click "New project".
   2. Delete what is there, paste this whole file, click Save.
   3. Choose createParishForm at the top and click Run.
      Google asks for permission the first time: Allow.
   4. Open "Execution log": it shows three links —
      the form to send to parishes, the form editor, and the answers sheet.
   The questions match the Admin page fields (Parishes, Chapels,
   Sanctuaries, Christian communities), so answers can be copied
   straight onto the website.
   ============================================================ */

function createParishForm() {
  const form = FormApp.create('Parish information — ሓበሬታ ቍምስና');
  form.setTitle('Parish information — ሓበሬታ ቍምስና')
    .setDescription(
      'Catholic Eparchy of Keren — ካቶሊካዊ ኤጳርቅና ከረን\n\n' +
      'This form collects information about each parish for the Eparchy website. ' +
      'Please fill in one form per parish. Questions marked * are required.\n\n' +
      'እዚ ቅጥዒ ንመርበብ ሓበሬታ ኤጳርቅና ከረን ሓበሬታ ቍምስናታት ንምእካብ ዝተዳለወ እዩ። ' +
      'በጃኹም ንነፍሲ ወከፍ ቍምስና ሓደ ቅጥዒ ምልኡ። * ዘለዎ ሕቶታት ግድን እዮም።')
    .setConfirmationMessage('Thank you! Your answers have been received.\nየቐንየልና! መልስኹም ተቐቢልናዮ ኣለና።')
    .setProgressBar(true)
    .setAllowResponseEdits(true);

  const text = (title, help, required) =>
    form.addTextItem().setTitle(title).setHelpText(help || '').setRequired(!!required);
  const para = (title, help, required) =>
    form.addParagraphTextItem().setTitle(title).setHelpText(help || '').setRequired(!!required);
  const page = (title, help) =>
    form.addPageBreakItem().setTitle(title).setHelpText(help || '');

  // ---------- 1. The person filling in ----------
  form.addSectionHeaderItem().setTitle('1. About you — ብዛዕባኹም');
  text('Your name — ስምኩም', '', true);
  form.addMultipleChoiceItem()
    .setTitle('Your role — ሓላፍነትኩም')
    .setChoiceValues(['Parish priest — ኣባ ሰበኻ', 'Assistant priest — ሓጋዚ ካህን', 'Parish secretary — ጸሓፊ ቍምስና'])
    .showOtherOption(true)
    .setRequired(true);
  text('Your phone number — ቍጽሪ ተሌፎንኩም', 'So we can call you if something is unclear. It will not be published. — ዘይንጹር እንተሃልዩ ክንድውለልኩም። ኣብ መርበብ ኣይሓትምን እዩ።', true);

  // ---------- 2. The parish ----------
  page('2. The parish — ቍምስና');
  text('Parish name in English — ስም ቍምስና ብእንግሊዝኛ', 'Example: St. Michael Parish, Keren', true);
  text('Parish name in Tigrinya — ስም ቍምስና ብትግርኛ', 'ኣብነት፡ ቍምስና ቅዱስ ሚካኤል፡ ከረን', true);
  text('Patron saint in English — ጠባቒ ቅዱስ ብእንግሊዝኛ', 'Example: St. Michael the Archangel');
  text('Patron saint in Tigrinya — ጠባቒ ቅዱስ ብትግርኛ', 'ኣብነት፡ ቅዱስ ሚካኤል ሊቀ መላእኽቲ');
  form.addMultipleChoiceItem()
    .setTitle('Deanery — መካን')
    .setChoiceValues(['Keren — ከረን', 'Habinmentel — ሓቢንመንተል', 'Hagaz — ሓጋዝ'])
    .setRequired(true);
  text('Town or village in English — ከተማ ወይ ዓዲ ብእንግሊዝኛ', '', true);
  text('Town or village in Tigrinya — ከተማ ወይ ዓዲ ብትግርኛ');
  text('Year the parish was founded — ቍምስና ዝተመስረተትሉ ዓመት',
       'Gregorian year, e.g. 1955 — ብፈረንጂ ኣቈጻጽራ፡ ኣብነት 1955')
    .setValidation(FormApp.createTextValidation()
      .requireNumberBetween(1800, 2100)
      .setHelpText('Please write the year as a number, e.g. 1955 — ዓመት ብቍጽሪ ጽሓፉ')
      .build());
  text('Parish phone number — ቍጽሪ ተሌፎን ቍምስና', 'This number will be shown on the website. — እዚ ቍጽሪ ኣብ መርበብ ክርአ እዩ።');
  text('Google Maps link — ሊንክ ካርታ ጎግል',
       'Open Google Maps, find the church, tap Share, Copy link and paste it here. — ኣብ Google Maps ቤተክርስቲያን ድለዩ፡ Share ጠውቑ፡ ሊንክ ቀዲሕኩም ኣብዚ ለጥፍዎ።')
    .setValidation(FormApp.createTextValidation()
      .requireTextIsUrl()
      .setHelpText('Please paste a link that starts with https:// — ብ https:// ዝጅምር ሊንክ ለጥፉ')
      .build());

  // ---------- 3. Priests ----------
  page('3. Priests — ካህናት');
  text('Parish priest in English — ኣባ ሰበኻ ብእንግሊዝኛ', 'Example: Abba Yohannes Tesfay', true);
  text('Parish priest in Tigrinya — ኣባ ሰበኻ ብትግርኛ', 'ኣብነት፡ ኣባ ዮውሃንስ ተስፋይ');
  para('Assistant priests — ሓገዝቲ ካህናት', 'One name per line. — ሓደ ስም ኣብ ሓደ መስመር።');

  // ---------- 4. Mass times ----------
  page('4. Mass times — ሰዓታት ቅዳሴ', 'Write in English, Tigrinya or both. — ብእንግሊዝኛ፡ ብትግርኛ ወይ ብኽልቲኡ ጽሓፉ።');
  para('Sunday Mass — ቅዳሴ ሰንበት', 'Example: 7:00, 9:00 (Ge\'ez rite) — ኣብነት፡ 1:00፡ 3:00', true);
  para('Weekday Mass — ቅዳሴ መዓልታት ሰሙን', 'Example: Mon–Sat 6:30 — ኣብነት፡ ሰኑይ–ቀዳም 12:30');

  // ---------- 5. Chapels, sanctuaries, communities ----------
  page('5. Chapels, sanctuaries and communities — ቤተጸሎታት፡ ቅዱሳት ቦታታትን ማሕበረሰባትን');
  para('Chapels of this parish — ቤተጸሎታት ናይዚ ቍምስና',
       'One chapel per line: name – village – Mass times.\n' +
       'Example: St. Mary Chapel – Hal Hal – Sunday 8:00\n' +
       'ሓደ ቤተጸሎት ኣብ ሓደ መስመር፡ ስም – ዓዲ – ሰዓታት ቅዳሴ።');
  para('Sanctuaries or places of pilgrimage — ቅዱሳት ቦታታት ወይ ቦታታት ንግደት',
       'One per line: name – dedicated to – village – feast day.\n' +
       'Example: Sanctuary of Our Lady – Mary – Keren – 21 Ginbot\n' +
       'ሓደ ኣብ ሓደ መስመር፡ ስም – ንመን ዝተወፈየ – ዓዲ – መዓልቲ በዓል።');
  para('Small Christian communities — ንኣሽቱ ክርስትያናዊ ማሕበረሰባት',
       'One per line: name – when it meets.\n' +
       'Example: St. Joseph community – Wednesday evening\n' +
       'ሓደ ኣብ ሓደ መስመር፡ ስም – መዓስ ይኣክብ።');

  // ---------- 6. History and photos ----------
  page('6. History and photos — ታሪኽን ስእልታትን');
  para('Short history of the parish — ሓጺር ታሪኽ ቍምስና',
       'A few sentences: when and how it began, important events. — ቍሩብ ምሉኣት ሓሳባት፡ መዓስን ከመይን ከም ዝጀመረት፡ ኣገደስቲ ፍጻመታት።');
  para('Anything else we should know — ካልእ ክንፈልጦ ዘለና',
       'Feasts, schools, clinics, associations… — በዓላት፡ ኣብያተ ትምህርቲ፡ ክሊኒካት፡ ማሕበራት…');
  form.addSectionHeaderItem()
    .setTitle('Photos — ስእልታት')
    .setHelpText('Please send 1–3 clear photos of the church (outside and inside) and of the parish priest ' +
                 'to the Eparchy office, with the parish name. — ብኽብረትኩም 1–3 ንጹራት ስእልታት ቤተክርስቲያን ' +
                 '(ካብ ደገን ካብ ውሽጥን) ከምኡውን ናይ ኣባ ሰበኻ፡ ምስ ስም ቍምስና ናብ ቤት ጽሕፈት ኤጳርቅና ስደዱ።');

  // ---------- answers go to a Google Sheet ----------
  const sheet = SpreadsheetApp.create('Parish information — answers');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Send this link to the parishes:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:                   ' + form.getEditUrl());
  Logger.log('See the answers (Google Sheet):  ' + sheet.getUrl());
}
