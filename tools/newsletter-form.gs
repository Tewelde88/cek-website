/* ============================================================
   NEWSLETTER FORM — creates the Google Form that receives the
   Home page sign-ups ("Letters from the Eparchy"), with a Google
   Sheet for the email addresses.

   How to use (one time only):
   1. Open https://script.google.com → New project.
   2. Paste this whole file, Save, choose createNewsletterForm, Run, Allow.
   3. Open "Execution log": copy the three lines it prints into the
      Admin page → Newsletter (Form address, Email field code,
      Language field code) and Save.
   From then on every sign-up on the website appears in the Sheet.
   ============================================================ */

function createNewsletterForm() {
  const form = FormApp.create('Letters from the Eparchy — newsletter');
  form.setDescription('Sign-ups from the website of the Catholic Eparchy of Keren.')
      .setConfirmationMessage('Thank you! — የቐንየልና!');

  const email = form.addTextItem().setTitle('Email').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  const lang = form.addMultipleChoiceItem().setTitle('Language').setChoiceValues(['English', 'Tigrinya']);

  const sheet = SpreadsheetApp.create('Letters from the Eparchy — subscribers');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // read the field codes from a pre-filled link
  const url = form.createResponse()
    .withItemResponse(email.createResponse('name@example.com'))
    .withItemResponse(lang.createResponse('English'))
    .toPrefilledUrl();
  const codes = [...url.matchAll(/entry\.(\d+)=/g)].map(m => 'entry.' + m[1]);

  Logger.log('Form address:        ' + form.getPublishedUrl().replace(/\/viewform.*$/, '/formResponse'));
  Logger.log('Email field code:    ' + codes[0]);
  Logger.log('Language field code: ' + codes[1]);
  Logger.log('Subscribers (Sheet): ' + sheet.getUrl());
}
