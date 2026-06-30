# TG6 Limited Product Warranty Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-facing Limited Product Warranty to the TG6 stream/product site — a new Terms clause plus a reassuring FAQ entry.

**Architecture:** Static HTML edits, no JS/build. The warranty lives as a new `<details class="qa">` clause in `terms.html` (anchored `#warranty`) and is surfaced via one new Q in `faq.html` that deep-links to it. No standalone page, no test framework — verification is grep-for-structure plus a visual render check.

**Tech Stack:** Plain HTML, existing `css/style.css` `details.qa` / `.qa-body` pattern.

## Global Constraints

- Warranty terms are fixed by the spec — copy these commitments verbatim in intent:
  - Physical workmanship (assembly + in-house 3D-printed shoulder mount): **90 days from delivery**.
  - **Encoding/software config care: lifetime, original owner, remote-where-possible**; restores TG6's *original* config only; laptop *hardware* failure → manufacturer warranty, NOT config care.
  - Components (Sony, Dell, Elgato, DJI, Peplink, Starlink, …): each keeps its **manufacturer's warranty**; TG6 runs the claim via a per-unit **Build Sheet & Warranty Card**.
  - Original purchaser only, **non-transferable**, **in addition to** Returns/Refunds (not a return), **limited** warranty.
- Match existing markup exactly: `<details class="qa">` + `<summary>` + `<div class="qa-body">`; multi-paragraph bodies use `<br><br>`; escape ampersands as `&amp;`.
- No new dependencies, no standalone `warranty.html`, no TG6-dev digital warranty, no legal review.
- Do not push. Commit locally only.

---

### Task 1: Add the Limited Warranty clause to `terms.html` and renumber

**Files:**
- Modify: `terms.html:71` (Last updated date)
- Modify: `terms.html:88-111` (insert clause after Returns/Refunds; renumber 6→7 … 10→11)

**Interfaces:**
- Produces: a `<details class="qa" id="warranty">` element. Task 2 deep-links to `terms.html#warranty`.

- [ ] **Step 1: Update the "Last updated" date**

Replace line 71:

```html
      <p class="qa-sub reveal">Last updated: May 2026</p>
```

with:

```html
      <p class="qa-sub reveal">Last updated: June 2026</p>
```

- [ ] **Step 2: Insert the Limited Warranty clause after clause 5**

Immediately after the closing `</details>` of clause 5 (Returns and Refunds, line 91) and before clause 6 (Intellectual Property), insert:

```html
      <details class="qa" id="warranty">
        <summary>6. Limited Warranty</summary>
        <div class="qa-body"><strong>TG6 workmanship.</strong> TG6 assembles every rig and pre-configures the encoding software in-house, and warrants that work directly. <strong>Physical assembly</strong> — stitching, wiring, fitment, and the in-house 3D-printed shoulder mount — is covered against defects for 90 days from delivery; TG6 repairs or replaces the affected part at its option, free. <strong>Encoding &amp; config care</strong> — the Dell Latitude encoding brain ships with OBS, NGINX, FFmpeg, and your uplink/bonding profile pre-configured; if that TG6-delivered setup ever stops working, TG6 restores and re-configures it at no charge for the life of the rig, remotely where possible or by return. Config care covers restoring TG6's original configuration, not new feature requests or third-party software you install; failure of the laptop hardware itself is covered by the manufacturer (below), not by config care.<br><br>
        <strong>Component pass-through.</strong> Your rig is built from brand-name gear — Sony, Dell, Elgato, DJI, Peplink, Starlink, and more — each carrying its own manufacturer's warranty. Every unit ships with a Build Sheet &amp; Warranty Card listing each component's make, model, serial, and warranty. If a component fails under its maker's warranty, TG6 handles the claim for you: one point of contact, we identify the part and do the legwork.<br><br>
        <strong>Exclusions.</strong> This limited warranty does not cover normal wear, cosmetic aging, misuse, accidents, overloading, liquid damage (unless the unit is sold as rated), unauthorized repairs or modifications, software you install or change outside TG6's setup, or component failures beyond the maker's own warranty terms.<br><br>
        <strong>Terms.</strong> Coverage begins at delivery and applies to the original purchaser only (non-transferable). This warranty is in addition to your Returns and Refunds rights above — it is not a return. To make a claim, contact us through the <a href="contact.html">contact page</a> with your order details and photos; your unit's live-stream build and test VOD documents its condition at ship.</div>
      </details>
```

- [ ] **Step 3: Renumber the following clauses**

In the five existing clauses after the insertion point, change only the leading number in each `<summary>`:

```
6. Intellectual Property   → 7. Intellectual Property
7. Limitation of Liability → 8. Limitation of Liability
8. Privacy                 → 9. Privacy
9. Governing Law           → 10. Governing Law
10. Changes to These Terms → 11. Changes to These Terms
```

- [ ] **Step 4: Verify structure with grep**

Run:

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
grep -noE '<summary>[0-9]+\. [^<]+' terms.html
grep -c 'id="warranty"' terms.html
```

Expected: summaries number 1–11 with no gaps or duplicates, clause 6 is "Limited Warranty", and `id="warranty"` count is `1`.

- [ ] **Step 5: Verify it renders (visual check)**

Run:

```bash
xdg-open /home/kali/Desktop/TG6/Repos/irl-stream-site/terms.html 2>/dev/null &
```

Expected: clause "6. Limited Warranty" appears after "5. Returns and Refunds", expands on click, four bold lead-ins (TG6 workmanship / Component pass-through / Exclusions / Terms), layout matches neighbors. (If no display, skip — the grep check is authoritative.)

- [ ] **Step 6: Commit**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
git add terms.html
git commit -m "feat(legal): add Limited Warranty clause to Terms

90-day workmanship + lifetime encoding config care + component
pass-through with concierge claims. Anchored #warranty; clauses
renumbered 6->7..10->11.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Surface the warranty in `faq.html`

**Files:**
- Modify: `faq.html:111` (point existing "warranty policy" link at the anchor)
- Modify: `faq.html:112` (add a dedicated warranty Q in the "Returns & Support" group)

**Interfaces:**
- Consumes: `terms.html#warranty` anchor produced in Task 1.

- [ ] **Step 1: Point the existing answer's link at the warranty anchor**

On line 111, the answer ends with `available in the <a href="terms.html">Terms</a>.`. Change that link target to the anchor:

```html
Full return and warranty policy is available in the <a href="terms.html#warranty">Terms</a>.
```

(Only change `href="terms.html"` to `href="terms.html#warranty"` on that line; leave the rest of the answer unchanged.)

- [ ] **Step 2: Add the dedicated warranty Q**

Immediately after the closing `</details>` of the "What if something doesn't work when I receive it?" question (line 112) and before the "I have a question not answered here." question, insert:

```html
      <details class="qa">
        <summary>Is the gear under warranty?</summary>
        <div class="qa-body">Yes. TG6 warrants its own work — physical assembly and the in-house shoulder mount for 90 days from delivery, plus <strong>lifetime config care</strong> on the encoding and streaming software (OBS, NGINX, FFmpeg, and your uplink profile), restored remotely where possible if it ever breaks. Every brand-name component — Sony, Dell, Elgato, DJI, Peplink, Starlink — carries its own manufacturer's warranty, and TG6 handles those claims for you using the Build Sheet &amp; Warranty Card that ships with your unit. Full details in the <a href="terms.html#warranty">Terms</a>.</div>
      </details>
```

- [ ] **Step 3: Verify with grep**

Run:

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
grep -c 'terms.html#warranty' faq.html
grep -n 'Is the gear under warranty?' faq.html
```

Expected: `terms.html#warranty` count is `2` (updated link + new Q), and the new summary is present, inside the "Returns & Support" group (after line ~108).

- [ ] **Step 4: Verify the anchor jump works (visual check)**

Run:

```bash
xdg-open /home/kali/Desktop/TG6/Repos/irl-stream-site/faq.html 2>/dev/null &
```

Expected: the new "Is the gear under warranty?" Q is present; clicking its "Terms" link opens `terms.html` scrolled to the Limited Warranty clause. (If no display, skip — grep is authoritative.)

- [ ] **Step 5: Commit**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
git add faq.html
git commit -m "feat(faq): add warranty Q linking to Terms #warranty anchor

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- 90-day physical workmanship → Task 1 Step 2 ✓
- Lifetime config care, remote, original-config-only, hardware-vs-config boundary → Task 1 Step 2 ✓
- Component pass-through + Build Sheet & Warranty Card + concierge claims → Task 1 Step 2 ✓
- Exclusions → Task 1 Step 2 ✓
- Delivery start / non-transferable / in-addition-to-returns / limited → Task 1 Step 2 ✓
- `terms.html` clause 6 + renumber + `id="warranty"` → Task 1 Steps 2–3 ✓
- FAQ warranty Q linking to anchor → Task 2 ✓
- "Last updated" refresh → Task 1 Step 1 ✓
- Out of scope (no warranty.html, no digital warranty, no legal) → respected ✓

**Placeholder scan:** none — all clause/FAQ HTML is literal and complete.

**Type consistency:** anchor `id="warranty"` (Task 1) matches both `terms.html#warranty` links (Task 2). Renumber end state 1–11 with no duplicate; new clause occupies 6.
