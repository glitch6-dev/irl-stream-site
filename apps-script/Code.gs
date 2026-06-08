/**
 * TG6 Forms — Google Sheets receiver
 * Handles BOTH site forms (subscribe + contact) via one Web App deployment.
 *
 * Setup: bind this script to a spreadsheet (Extensions ▸ Apps Script from the sheet),
 * set NOTIFY_EMAIL below, then Deploy ▸ New deployment ▸ Web app
 * (Execute as: Me, Who has access: Anyone). See README.md.
 *
 * Front end posts JSON like:
 *   { "formType": "subscribe", "email": "...", "page": "..." , "company": "" }
 *   { "formType": "contact", "name": "...", "email": "...", "subject": "...",
 *     "message": "...", "userAgent": "...", "referer": "...", "company": "" }
 * `company` is a honeypot — if non-empty the submission is silently dropped.
 */

// Where contact-form notifications are sent.
var NOTIFY_EMAIL = 'dvelupr@proton.me';

var SUBSCRIBERS_TAB = 'Subscribers';
var CONTACT_TAB = 'Contact';

var SUBSCRIBERS_HEADERS = ['Timestamp', 'Email', 'Page'];
var CONTACT_HEADERS = ['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'UserAgent', 'Referer'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize appends to avoid row races

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        // Fallback: classic form-encoded POST (e.parameter)
        data = (e && e.parameter) ? e.parameter : {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Honeypot: real users never fill this. Pretend success, store nothing.
    if (data.company) {
      return _json({ ok: true, skipped: 'honeypot' });
    }

    var formType = String(data.formType || '').toLowerCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var now = new Date();

    if (formType === 'subscribe') {
      if (!data.email) return _json({ ok: false, error: 'missing email' });
      var subTab = _tab(ss, SUBSCRIBERS_TAB, SUBSCRIBERS_HEADERS);
      subTab.appendRow([now, data.email, data.page || '']);
      return _json({ ok: true, formType: 'subscribe' });
    }

    if (formType === 'contact') {
      if (!data.email || !data.message) return _json({ ok: false, error: 'missing fields' });
      var conTab = _tab(ss, CONTACT_TAB, CONTACT_HEADERS);
      conTab.appendRow([
        now, data.name || '', data.email, data.subject || '',
        data.message, data.userAgent || '', data.referer || ''
      ]);
      _notify(data);
      return _json({ ok: true, formType: 'contact' });
    }

    return _json({ ok: false, error: 'unknown formType' });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Friendly health check so a browser GET doesn't show a scary Apps Script error page.
function doGet() {
  return _json({ ok: true, service: 'TG6 Forms', usage: 'POST JSON with a formType field' });
}

function _tab(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _notify(data) {
  if (!NOTIFY_EMAIL) return;
  try {
    var subject = 'TG6 contact: ' + (data.subject || '(no subject)') + ' — ' + (data.name || data.email);
    var body =
      'New contact form submission\n\n' +
      'Name: ' + (data.name || '') + '\n' +
      'Email: ' + (data.email || '') + '\n' +
      'Subject: ' + (data.subject || '') + '\n\n' +
      'Message:\n' + (data.message || '') + '\n\n' +
      '— UA: ' + (data.userAgent || '') + '\n' +
      '— Ref: ' + (data.referer || '');
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: data.email || NOTIFY_EMAIL
    });
  } catch (mailErr) {
    // Logging-only: never fail the request just because the email didn't send.
    console.error('notify failed: ' + mailErr);
  }
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
