# TG6 Forms → Google Sheets (Apps Script Web App)

One Apps Script deployment receives **both** site forms (subscribe + contact) and logs them to
a single spreadsheet. Contact submissions also email you. This is the server-side half of the
forms; the front end posts to the deployed `/exec` URL.

## One-time deploy (≈5 minutes)

1. **Create the spreadsheet**
   - Go to <https://sheets.new>, rename it **"TG6 Forms"**.
   - (Tabs `Subscribers` and `Contact` are created automatically on first submission — no need
     to make them by hand.)

2. **Open the bound script**
   - In that sheet: **Extensions ▸ Apps Script**.
   - Delete the default `function myFunction(){}`.
   - Paste the entire contents of [`Code.gs`](./Code.gs).
   - Confirm the `NOTIFY_EMAIL` value near the top (default `dvelupr@proton.me`). Save (Ctrl+S).

3. **Deploy as a Web App**
   - **Deploy ▸ New deployment**.
   - Click the gear ▸ **Web app**.
   - **Execute as:** *Me*.
   - **Who has access:** **Anyone**  ← this is what fixes the old 403.
   - **Deploy**, then **Authorize access** and allow the Sheets + Gmail (MailApp) scopes.

4. **Copy the Web app URL**
   - It looks like `https://script.google.com/macros/s/AKfy.../exec`.
   - **Paste that URL back to Claude** — it gets dropped into `js/script.js`
     (`window.TG6_FORMS_ENDPOINT`) and both forms start working immediately.

## Re-deploying after editing `Code.gs`
Apps Script keeps the same `/exec` URL only if you **Manage deployments ▸ edit (pencil) ▸
Version: New version ▸ Deploy**. Creating a brand-new deployment instead gives a new URL (then
re-paste it).

## Quick test (after deploy)
```bash
EXEC="https://script.google.com/macros/s/PASTE/exec"
# subscribe
curl -sS -L --post301 --post302 --post303 -X POST \
  -H "Content-Type: text/plain;charset=utf-8" \
  --data '{"formType":"subscribe","email":"test@example.com","page":"manual-test"}' "$EXEC"
# contact (also sends the notification email)
curl -sS -L --post301 --post302 --post303 -X POST \
  -H "Content-Type: text/plain;charset=utf-8" \
  --data '{"formType":"contact","name":"Test","email":"test@example.com","subject":"Hi","message":"hello"}' "$EXEC"
```
Then check the **Subscribers** / **Contact** tabs and your inbox.

## Notes
- The honeypot field is `company`; any submission with it filled is silently dropped.
- Under `no-cors` the browser can't read the response, so the site shows success as soon as the
  request is sent (can't detect a server-side error). This is expected for Apps Script + a static
  site. True success/failure detection would require a CORS-capable backend (e.g. Cloudflare
  Worker) — not set up here.
