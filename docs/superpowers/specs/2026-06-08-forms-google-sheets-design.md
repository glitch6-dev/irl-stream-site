# Google Sheets Integration for Site Forms — Design

**Date:** 2026-06-08
**Repo:** irl-stream-site
**Goal:** Make both site forms reliably log to Google Sheets (the current endpoints are
misconfigured — contact returns **403 Access Denied**, subscribe is opaque `no-cors`).

## Decisions (locked with user)

- **Storage:** one spreadsheet **"TG6 Forms"** with two tabs (`Subscribers`, `Contact`).
- **Contact alerts:** on a contact submission, also **email** `dvelupr@proton.me`.
- **Deploy model:** I provide `Code.gs` + a deploy guide; **user deploys** the Apps Script
  Web App (it must live in their Google account) and pastes back the `/exec` URL.

## Forms in scope (the only two in the repo)

| Form | File | Fields |
|---|---|---|
| Subscribe | `index.html` (`#subscribe-form`) | email |
| Contact | `contact.html` (`#contactForm`) | name, email, subject, message (+ userAgent, referer) |

The two old Apps Script endpoints are **replaced**, not debugged.

## Architecture

```
index.html  subscribe ─┐
                       ├─ POST JSON {formType,…} (no-cors) ─► Apps Script Web App ─► "TG6 Forms"
contact.html contact ──┘            one /exec URL                   │                ├ Subscribers
                                                                    └ contact → email + Contact tab
```

### Apps Script (`apps-script/Code.gs`, version-controlled)
- `doPost(e)` parses `e.postData.contents` as JSON, reads `formType`.
- `LockService` guards concurrent appends; honeypot field (`company`) → silently ignored.
- `subscribe` → append `[Timestamp, Email, Page]` to **Subscribers**.
- `contact` → append `[Timestamp, Name, Email, Subject, Message, UserAgent, Referer]` to
  **Contact**, then `MailApp.sendEmail` to `NOTIFY_EMAIL`.
- Auto-creates tabs + header rows on first run.
- Returns `ContentService` JSON `{ok:true}` (cosmetic; client can't read it under no-cors).
- `doGet` returns a small JSON health string so a browser GET doesn't show a scary error.
- Deployment: Web App, **execute as owner**, **access: Anyone** (fixes the 403).

### Frontend
- Single shared endpoint constant `window.TG6_FORMS_ENDPOINT` in `js/script.js` (loaded by
  both pages) — **one place to swap** after deploy.
- Both handlers: client-validate → `fetch(endpoint,{method:"POST",mode:"no-cors",
  headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify({formType,…})})`
  → optimistic success message → reset.
  - `text/plain` keeps it a CORS "simple request" (no preflight); Apps Script still reads the
    raw JSON from `e.postData.contents`.
- Add a hidden honeypot input `company` (off-screen, `tabindex=-1`, `autocomplete=off`) to both.
- Contact form switches from `cors`+`res.ok` (which fails) to the same `no-cors` optimistic flow.

## Data flow
visitor submit → JS validate (+ honeypot empty) → POST JSON `{formType,…}` → `doPost` →
LockService → append row [+ email for contact] → opaque 302/200 → JS shows success + resets.

## Error handling
- **Client:** required-field + email-regex validation before sending; honeypot blocks bots.
- **Server:** try/catch around append/email; `LockService` for races; tabs auto-created.
- **Known limitation:** under `no-cors` the client cannot read the response, so a *server-side*
  failure can't be surfaced in the browser — it shows success once the request is sent. Inherent
  to Apps Script + static hosting. True detection would need a CORS backend (Cloudflare Worker) —
  out of scope.

## Testing (after user deploys + pastes /exec URL)
1. `curl` POST `formType=subscribe` and `formType=contact` (preserving method across the 302) →
   confirm rows appear in each tab and the contact email arrives.
2. Browser: submit each form on the live/local page; confirm success UI + a new row.
3. Confirm honeypot-filled POST is ignored (no row).

## Deploy guide (`apps-script/README.md`)
Create Sheet → Extensions ▸ Apps Script → paste `Code.gs` → set `NOTIFY_EMAIL` → Deploy ▸ New
deployment ▸ Web app (execute as me, access Anyone) → authorize → copy `/exec` URL → paste to me.

## Out of scope (YAGNI)
Debugging the two old endpoints, CAPTCHA, double-opt-in, admin dashboard, server-error detection.

## Build log
- Endpoint placed in `js/script.js` as `window.TG6_FORMS_ENDPOINT`.
- Deployed `/exec` URL (live in `js/script.js`):
  `https://script.google.com/macros/s/AKfycbwykb0OnOAnyIWFHjm8ZpRj0Pc0ZQlBvnes2K-SPMqwVQlO0bq9mzghWsUa_J2nFsqd-g/exec`
- Spreadsheet: **"TG6 - IRL Leads"** (in the TG6 Google account). Owner address and sheet ID
  are kept out of this public repo — see private notes.
- **Verified 2026-06-08** via curl + Drive read:
  - GET → `{"ok":true,"service":"TG6 - IRL Leads"}` (Anyone-access; 403 fixed).
  - POST subscribe ×2 → rows in Subscribers tab.
  - POST contact → row in Contact tab (+ email to dvelupr@proton.me via MailApp).
  - POST honeypot (`company` filled) → dropped, no row.
  - Note: curl shows "Page Not Found" on the followed redirect, but `/exec` returns 302→/echo
    and side effects run — confirmed by reading the sheet.
- Cleanup: 3 `claude-test*` verification rows remain in the sheet — delete them manually
  (Drive MCP is read-only; can't remove cells from here).
