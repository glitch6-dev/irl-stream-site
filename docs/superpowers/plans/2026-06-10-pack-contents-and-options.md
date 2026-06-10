# Pack Contents & Checkout Options Site Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the full bill of materials (LED light, microphone, SD cards, TG6 3D-printed shoulder mount) and the three flat-rate customer checkout options (mic style, light tier, optional handheld stabilizer) on all three product pages and the shared hotspot data, per spec `docs/superpowers/specs/2026-06-10-fulfillment-pipeline-design.md` §5.1.

**Architecture:** Pure content/data update on the existing static stack. Three new inline-SVG icons go into `js/icons.js`; three new hotspot entries (shared across all packs) are appended to each product's array in `js/hotspots.js` via a single `extras` variable; each product page gets new "What's Inside" table rows plus a "You Pick At Checkout" section reusing the existing Built-For list styling. The homepage picks up the new hotspots automatically because it reads the same `TG6_HOTSPOTS.metro` data.

**Tech Stack:** HTML5, Bootstrap 5 (vendored), vanilla JS (no build step), Remix Icon (already vendored — `ri-check-line` is in use today).

---

## Verification model (read first)

No test runner exists (and none may be added). Each task verifies by serving the site and grepping/observing:

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
python3 -m http.server 8000   # then open http://localhost:8000/<page>
```

Headless screenshot when a visual check is stated:
```bash
CHROME=$(find ~/.cache/ms-playwright -name chrome -type f | head -1)
"$CHROME" --headless=new --no-sandbox --window-size=1280,2400 \
  --screenshot=/tmp/shot.png "http://localhost:8000/index.html"
```
Then Read `/tmp/shot.png`.

**Commits:** small and frequent, local only — the user pushes manually.

**Do not touch the Stripe buy links** (`buy.stripe.com/test_…`). Configuring the three checkout custom fields happens in the Stripe dashboard at the test→live swap, not in this repo.

---

## File Structure

- `js/icons.js` — add 3 icons: `light`, `mic`, `mount`.
- `js/hotspots.js` — add a shared `extras` array (mount / light / mic) concatenated onto all three product arrays.
- `products/metro.html` — fix Mount row, add Audio/Light/Storage rows, add options section.
- `products/roamer.html` — add Mount/Audio/Light/Storage rows, add options section.
- `products/nomad.html` — add Mount/Audio/Light/Storage rows, add options section.
- `index.html` — **no edit**; homepage hotspots come from `js/hotspots.js`.

---

## Task 1: New icons (`light`, `mic`, `mount`)

**Files:**
- Modify: `js/icons.js` (the `window.TG6_ICONS` map, currently ends with the `kick` entry at line 20)

- [ ] **Step 1: Add the three icons**

In `js/icons.js`, replace:

```js
    kick: svg('<path d="M5 4h4v5l4-5h5l-6 8 6 8h-5l-4-5v5H5z" fill="currentColor" stroke="none"/>')
```

with:

```js
    kick: svg('<path d="M5 4h4v5l4-5h5l-6 8 6 8h-5l-4-5v5H5z" fill="currentColor" stroke="none"/>'),
    light: svg('<rect x="6" y="4" width="12" height="9" rx="1.5"/><path d="M9 7h1M12 7h1M15 7h1M9 10h1M12 10h1M15 10h1"/><path d="M12 13v5"/><path d="M9 21h6"/>'),
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>'),
    mount: svg('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9"/>')
```

(`light` = LED panel on a stem, `mic` = studio mic, `mount` = layered cube for the 3D print.)

- [ ] **Step 2: Verify the icons parse**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/js/icons.js | grep -c "light:\|mic:\|mount:"   # expect 3
node -e "global.window={};$(curl -s http://localhost:8000/js/icons.js);console.log(Object.keys(window.TG6_ICONS).length)"  # expect 14
kill %1
```
Expected: grep count 3; node prints `14` (11 existing + 3 new). If `node` is unavailable, open `http://localhost:8000/` and run `Object.keys(TG6_ICONS).length` in the browser console instead.

- [ ] **Step 3: Commit**

```bash
git add js/icons.js
git commit -m "feat(bom): add light, mic, mount icons to shared set"
```

---

## Task 2: Shared hotspot entries (mount / light / mic)

**Files:**
- Modify: `js/hotspots.js:4-23` (the `window.TG6_HOTSPOTS` data)

- [ ] **Step 1: Add an `extras` array and concat it onto every product**

In `js/hotspots.js`, replace the whole data block (lines 4–23):

```js
  window.TG6_HOTSPOTS = {
    metro: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Compact 4K camera with a flip screen and clean HDMI out — broadcast-grade picture in a run-and-gun body.' },
      ...
  };
```

with (full block — `extras` holds the three components identical across packs; per-pack coords can still be split later because it's plain data):

```js
  /* Components identical across all three packs. Coords sit on the flat photo;
     refine per-product when component shots land. */
  var extras = [
    { x: 38, y: 10, icon: 'mount', label: 'TG6 3D-printed shoulder mount', blurb: 'Printed in-house and fitted to the upper strap — the camera locks in at chest height and pops off tool-free. Add the optional handheld stabilizer at checkout for off-shoulder shooting.' },
    { x: 24, y: 34, icon: 'light', label: 'LED video light', blurb: 'Keeps the stream lit after dark. Pick one of three tiers at checkout — basic clip-on LED, mid RGB panel, or pro bi-color/RGB. Included either way.' },
    { x: 76, y: 66, icon: 'mic',   label: 'Microphone', blurb: 'Your call at checkout: a boom mic for solo run-and-gun audio, or a DJI Mic Mini set (2 transmitters) for multi-person IRL. Included either way.' }
  ];

  window.TG6_HOTSPOTS = {
    metro: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Compact 4K camera with a flip screen and clean HDMI out — broadcast-grade picture in a run-and-gun body.' },
      { x: 70, y: 46, icon: 'signal',  label: 'T-Mobile 5G gateway',     blurb: 'Plug-and-play 5G home internet. In dense city coverage it just works — no bonding, no fuss.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Swap power mid-stream without going dark. Runs the full kit for hours on a single pack.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Elgato Cam Link 4K',      blurb: 'Turns the camera HDMI into a clean USB capture feed the encoder can push to Twitch/YouTube/Kick.' }
    ].concat(extras),
    roamer: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Same broadcast-grade 4K camera and clean HDMI capture as the Metro.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Peplink MAX Transit Duo', blurb: 'Dual-SIM bonding (T-Mobile + Verizon). When one carrier drops on the backroads, the stream rides the other.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Hours of mobile power; swap packs without dropping the broadcast.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Bonded encoder',          blurb: 'Combines both carriers into one stable uplink so bitrate stays steady through patchy coverage.' }
    ].concat(extras),
    nomad: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Broadcast-grade 4K in a travel-light body for off-grid shoots.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Starlink portable',       blurb: 'Low-earth-orbit satellite uplink. Stream from anywhere on earth — no cell towers required.' },
      { x: 32, y: 60, icon: 'battery', label: 'Expedition power',        blurb: 'High-capacity, hot-swappable power sized for long off-grid sessions.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Encoder + failover',      blurb: 'Pushes a clean feed over satellite with cellular failover when any coverage exists.' }
    ].concat(extras)
  };
```

Leave `show()` and `initHotspots()` (lines 25–52) untouched — they already render whatever the arrays contain.

- [ ] **Step 2: Verify 7 hotspots per product**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
node -e "global.window={};$(curl -s http://localhost:8000/js/hotspots.js);['metro','roamer','nomad'].forEach(k=>console.log(k, window.TG6_HOTSPOTS[k].length))"
kill %1
```
Expected: `metro 7`, `roamer 7`, `nomad 7`. (Browser-console fallback: `TG6_HOTSPOTS.metro.length` on the homepage.)

- [ ] **Step 3: Visual check on the homepage**

Serve and headless-screenshot `http://localhost:8000/index.html` per the verification model, then Read `/tmp/shot.png`. Expected: the Metro image in "What's Inside" shows **7** round markers (was 4); clicking/tabbing a new marker (mount, top-left area) swaps the side panel to "TG6 3D-printed shoulder mount".

- [ ] **Step 4: Commit**

```bash
git add js/hotspots.js
git commit -m "feat(bom): add mount, light, mic hotspots to all packs"
```

---

## Task 3: "What's Inside" table rows on all three product pages

**Files:**
- Modify: `products/metro.html:81-89` (spec table)
- Modify: `products/roamer.html:82-90` (spec table)
- Modify: `products/nomad.html:82-90` (spec table)

The four new/changed rows are identical in meaning on every page; the Mount row **replaces** an existing wrong row on Metro and is **new** on Roamer/Nomad.

- [ ] **Step 1: Metro — fix Mount, add Audio/Light/Storage**

In `products/metro.html`, replace:

```html
                <tr><td>Mount</td><td>Shoulder strap camera mount (Ulanzi / SmallRig)</td></tr>
```

with:

```html
                <tr><td>Mount</td><td>TG6 3D-printed shoulder mount — made in-house</td></tr>
                <tr><td>Audio</td><td>Boom mic or DJI Mic Mini ×2 — your pick at checkout</td></tr>
                <tr><td>Light</td><td>LED video light — three tiers, your pick at checkout</td></tr>
                <tr><td>Storage</td><td>High-endurance SD cards for 4K recording</td></tr>
```

- [ ] **Step 2: Roamer — add the same four rows**

In `products/roamer.html`, replace:

```html
                <tr><td>Capture</td><td>Elgato Cam Link 4K</td></tr>
```

with:

```html
                <tr><td>Capture</td><td>Elgato Cam Link 4K</td></tr>
                <tr><td>Mount</td><td>TG6 3D-printed shoulder mount — made in-house</td></tr>
                <tr><td>Audio</td><td>Boom mic or DJI Mic Mini ×2 — your pick at checkout</td></tr>
                <tr><td>Light</td><td>LED video light — three tiers, your pick at checkout</td></tr>
                <tr><td>Storage</td><td>High-endurance SD cards for 4K recording</td></tr>
```

- [ ] **Step 3: Nomad — add the same four rows**

In `products/nomad.html`, replace:

```html
                <tr><td>Capture</td><td>Elgato Cam Link 4K</td></tr>
```

with:

```html
                <tr><td>Capture</td><td>Elgato Cam Link 4K</td></tr>
                <tr><td>Mount</td><td>TG6 3D-printed shoulder mount — made in-house</td></tr>
                <tr><td>Audio</td><td>Boom mic or DJI Mic Mini ×2 — your pick at checkout</td></tr>
                <tr><td>Light</td><td>LED video light — three tiers, your pick at checkout</td></tr>
                <tr><td>Storage</td><td>High-endurance SD cards for 4K recording</td></tr>
```

- [ ] **Step 4: Verify rows present, Ulanzi gone**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
for p in metro roamer nomad; do
  echo "== $p =="
  curl -s http://localhost:8000/products/$p.html | grep -c '3D-printed shoulder mount'   # expect 1
  curl -s http://localhost:8000/products/$p.html | grep -c 'DJI Mic Mini'                # expect 1
  curl -s http://localhost:8000/products/$p.html | grep -c 'High-endurance SD cards'     # expect 1
done
grep -c 'Ulanzi' products/metro.html   # expect 0
kill %1
```
Expected: every page 1/1/1; Ulanzi count 0.

- [ ] **Step 5: Commit**

```bash
git add products/metro.html products/roamer.html products/nomad.html
git commit -m "feat(bom): add mount, audio, light, storage to What's Inside tables"
```

---

## Task 4: "You Pick At Checkout" options section on all three product pages

Insert between the **Built For** block and the purchase-button `<div class="row g-4">` on each page. Reuses the exact heading/list styling of Built For (inline styles, `ri-check-line`) — no new CSS.

**Files:**
- Modify: `products/metro.html` (after Built For `</div>`, ~line 114)
- Modify: `products/roamer.html` (after Built For `</div>`, ~line 113)
- Modify: `products/nomad.html` (after Built For `</div>`, ~line 101)

- [ ] **Step 1: Insert the section on each page**

On **each** of the three pages, the Built For block ends like this (the `<ul>` closes, then its wrapper `<div class="mb-5">` closes, then the purchase row begins):

```html
              </ul>
            </div>

            <div class="row g-4">
```

Replace that (per page) with:

```html
              </ul>
            </div>

            <!-- Checkout options -->
            <div class="mb-5">
              <h6 class="fw-bold text-uppercase mb-3" style="letter-spacing: 2px; font-size: 11px; color: #666;">You Pick At Checkout — All Included</h6>
              <ul class="list-unstyled" style="color: #aaa; font-size: 14px;">
                <li class="mb-2"><i class="ri-check-line me-2" style="color:#fff;"></i><span class="text-white">Mic</span> — boom mic, or DJI Mic Mini set (2 transmitters)</li>
                <li class="mb-2"><i class="ri-check-line me-2" style="color:#fff;"></i><span class="text-white">Light</span> — basic clip-on LED, mid RGB panel, or pro bi-color/RGB</li>
                <li class="mb-2"><i class="ri-check-line me-2" style="color:#fff;"></i><span class="text-white">Handheld stabilizer</span> — optional; camera pops off the shoulder mount tool-free</li>
              </ul>
              <p class="small mb-0" style="color:#555;">Flat price — your picks don't change what you pay. Choose in the checkout form.</p>
            </div>

            <div class="row g-4">
```

**Caution:** the literal `</ul>\n            </div>\n\n            <div class="row g-4">` anchor appears once per page (only Built For is followed directly by the purchase row). If an Edit reports a non-unique match, extend the `old_string` upward to include that page's last Built For `<li>` line.

- [ ] **Step 2: Verify all three pages**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
for p in metro roamer nomad; do
  echo "== $p =="
  curl -s http://localhost:8000/products/$p.html | grep -c 'You Pick At Checkout'        # expect 1
  curl -s http://localhost:8000/products/$p.html | grep -c 'Handheld stabilizer'         # expect 1
done
grep -rn 'buy.stripe.com/test_' products/ | wc -l   # expect 3 (links untouched)
kill %1
```
Expected: 1/1 per page; exactly 3 Stripe test links remain.

- [ ] **Step 3: Visual check on one page**

Headless-screenshot `http://localhost:8000/products/metro.html` (window 1280x2400) and Read it. Expected: a "YOU PICK AT CHECKOUT — ALL INCLUDED" block styled exactly like "BUILT FOR" sits directly above the PRE-ORDER button, with three check-mark lines (Mic / Light / Handheld stabilizer) and the flat-price note.

- [ ] **Step 4: Commit**

```bash
git add products/metro.html products/roamer.html products/nomad.html
git commit -m "feat(bom): add checkout options section to product pages"
```

---

## Task 5: Final QA sweep

**Files:** none (verification only) — fix-forward if issues found.

- [ ] **Step 1: Cross-page consistency checks**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
echo "Ulanzi gone (expect 0):";            grep -rc 'Ulanzi' products/metro.html
echo "Stripe links intact (expect 3):";    grep -rn 'buy.stripe.com/test_' products/ | wc -l
echo "No emoji introduced (expect none):"; grep -rlP '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]' products/*.html index.html js/*.js || echo none
echo "DJI cap is 2 everywhere (expect 0):"; grep -rci '3 transmitters' products/ js/ index.html | grep -v ':0' || echo ok
```
Expected: 0 / 3 / none / ok.

- [ ] **Step 2: Mobile spot-check**

Headless-screenshot the homepage and metro page at `--window-size=390,2200`, Read both. Expected: 7 hotspot dots remain tappable (not overlapping off-image), the options section stacks cleanly, no horizontal scroll.

- [ ] **Step 3: Commit (only if fixes were made)**

```bash
git add -A
git commit -m "chore(bom): QA fixes for pack contents/options update"
```

---

## Self-Review (author checklist — completed)

- **Spec coverage (§5.1):** light → Tasks 2/3/4; microphone → Tasks 2/3/4; SD cards → Task 3; 3D-printed mount → Tasks 2/3; Metro mount-line fix → Task 3 Step 1; customer options presented (mic style, light tier, stabilizer) → Task 4; homepage hotspot data → Task 2 (shared file, index.html untouched). Stripe custom fields explicitly out of repo scope (verification-model note) per spec §2 Stage 1 launch blocker. ✓
- **Placeholder scan:** no TBD/TODO; every step carries the exact code/markup and exact expected command output. The one `...` elision in Task 2 Step 1 is inside the *description of what to replace*, and the full replacement block is given verbatim. ✓
- **Consistency:** icon ids `light`/`mic`/`mount` defined in Task 1 are the ids used in Task 2's `extras`; row labels and option copy match spec §3.1/§3.2 wording (2-transmitter cap, three light tiers, tool-free stabilizer swap). ✓
