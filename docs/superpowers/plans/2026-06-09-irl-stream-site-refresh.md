# irl-stream-site Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the IRL streaming-backpack storefront (refined-minimal) with two engagement features — interactive "what's inside" hotspots and a "find your backpack" tier finder — plus a TG6·dev cross-sell integration, applied consistently across the whole customer-facing site.

**Architecture:** Static HTML + Bootstrap (unchanged stack). Two small vanilla-JS modules (`js/icons.js`, `js/hotspots.js`, `js/finder.js`) drive the interactive pieces from data so flat-photo hotspots can be upgraded to component shots later. A canonical nav + footer is copy-applied across pages. All emoji replaced by a shared inline-SVG icon set.

**Tech Stack:** HTML5, Bootstrap 5 (vendored), vanilla ES5/ES6 JS (no build step), CSS in `css/style.css`. Spec: `docs/superpowers/specs/2026-06-09-irl-stream-site-refresh-design.md`.

---

## Verification model (read first)

No test runner exists and the spec forbids adding one. Each task verifies by **serving the site and observing stated behavior**:

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
python3 -m http.server 8000   # then open http://localhost:8000/<page>
```

Agentic workers without a visible browser may screenshot headlessly:
```bash
CHROME=$(find ~/.cache/ms-playwright -name chrome -type f | head -1)
"$CHROME" --headless=new --no-sandbox --window-size=1280,2400 \
  --screenshot=/tmp/shot.png "http://localhost:8000/index.html"
```
Then Read `/tmp/shot.png`. Each task states exactly what to look for.

**Commits:** small and frequent. The user prefers to drive pushes manually — commit locally; do **not** push. Repo routes to GitHub `glitch6-dev` when the user later ships.

---

## File Structure

- `css/style.css` — append a `/* === REFRESH 2026-06 === */` block with all new tokens/components (do not rewrite existing rules; override where needed).
- `js/icons.js` — NEW. `window.TG6_ICONS` map: id → inline SVG string. Single source for all icons (finder, hotspots, socials, external-link).
- `js/hotspots.js` — NEW. `window.TG6_HOTSPOTS` data + `initHotspots(rootSelector, productKey)`.
- `js/finder.js` — NEW. `window.TG6_TIERS` data + `initFinder()`.
- `index.html` — restructured homepage.
- `products/metro.html`, `products/roamer.html`, `products/nomad.html` — hotspot treatment + canonical nav/footer.
- `about.html`, `contact.html`, `faq.html`, `terms.html`, `privacy.html`, `404.html` — consistency pass (nav/footer, de-emoji).
- `.gitignore` — already added (`.superpowers/`).

Canonical nav/footer markup is defined once in **Task 2** and referenced by later tasks.

---

## Task 1: Design-system CSS foundation + icon module

**Files:**
- Modify: `css/style.css` (append refresh block)
- Create: `js/icons.js`

- [ ] **Step 1: Create the icon module**

Create `js/icons.js`:

```js
/* TG6 shared inline-SVG icon set. White line icons, 24x24, stroke 1.5.
   Usage: element.innerHTML = TG6_ICONS.city; */
(function () {
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ' +
      'width="100%" height="100%" aria-hidden="true">' + inner + '</svg>';
  }
  window.TG6_ICONS = {
    city: svg('<path d="M3 21h18"/><rect x="4" y="9" width="6" height="12"/><rect x="14" y="4" width="6" height="17"/><path d="M6.5 12.5h1M6.5 15.5h1M16.5 8h1M16.5 11.5h1M16.5 15h1"/>'),
    backcountry: svg('<path d="M3 20h18"/><path d="M3 20l6-12 3.5 5 2.5-3.5L21 20"/><path d="M9 8l1.2 2"/>'),
    offgrid: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>'),
    camera: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2h5L16 7"/><circle cx="12" cy="13" r="3.2"/>'),
    signal: svg('<path d="M5 18a10 10 0 0 1 14 0"/><path d="M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/>'),
    battery: svg('<rect x="3" y="8" width="15" height="9" rx="2"/><path d="M21 11v3"/><path d="M7 12.5h4"/>'),
    chip: svg('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3"/>'),
    external: svg('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'),
    twitch: svg('<path d="M4 3h16v11l-4 4h-4l-3 3H7v-3H4z"/><path d="M11 8v4M15 8v4"/>'),
    youtube: svg('<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor"/>'),
    kick: svg('<path d="M5 4h4v5l4-5h5l-6 8 6 8h-5l-4-5v5H5z" fill="currentColor" stroke="none"/>')
  };
})();
```

- [ ] **Step 2: Append the refresh CSS block**

Append to the end of `css/style.css`:

```css
/* === REFRESH 2026-06 ====================================================== */
:root{
  --r-bg:#020304; --r-ink:#ffffff; --r-mut:#9a9a9a; --r-mut2:#6f6f6f;
  --r-line:#222; --r-line2:#2e2e2e; --r-panel:#0a0a0a; --r-ease:cubic-bezier(.2,.7,.2,1);
}
.r-kicker{font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:var(--r-mut2);}
.r-icon{display:inline-flex;color:var(--r-ink);}
.r-section{padding:4.5rem 0;}
.r-section-head h2{font-weight:800;letter-spacing:-.01em;}
/* svg social/nav icon buttons */
.r-iconbtn{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;color:var(--r-mut);transition:color .25s var(--r-ease);}
.r-iconbtn:hover{color:var(--r-ink);}
.r-iconbtn svg{width:18px;height:18px;}
/* === WHAT'S INSIDE (hotspots) === */
.hs{display:grid;grid-template-columns:1.2fr .8fr;gap:2rem;align-items:center;}
@media(max-width:768px){.hs{grid-template-columns:1fr;}}
.hs-stage{position:relative;background:var(--r-panel);border:1px solid var(--r-line);}
.hs-image{display:block;width:100%;height:auto;}
.hs-layer{position:absolute;inset:0;}
.hs-dot{position:absolute;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;
  background:rgba(0,0,0,.6);border:2px solid #fff;color:#fff;padding:5px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:transform .2s var(--r-ease),background .2s;}
.hs-dot:hover{transform:translate(-50%,-50%) scale(1.12);}
.hs-dot.is-active{background:#fff;color:#000;}
.hs-dot svg{width:100%;height:100%;}
.hs-panel{border-left:2px solid #fff;padding-left:1.25rem;}
.hs-panel .hs-label{font-weight:700;font-size:1.15rem;color:#fff;margin-bottom:.4rem;}
.hs-panel .hs-blurb{color:var(--r-mut);font-size:.95rem;line-height:1.6;}
.hs-hint{font-size:.72rem;color:var(--r-mut2);letter-spacing:.05em;margin-top:1rem;}
/* === FINDER === */
.finder-tiles{display:flex;gap:1rem;}
@media(max-width:576px){.finder-tiles{flex-direction:column;}}
.finder-tile{flex:1;background:transparent;border:1px solid var(--r-line2);color:#fff;
  padding:1.6rem 1rem;text-align:center;cursor:pointer;transition:border-color .25s var(--r-ease),background .25s;}
.finder-tile:hover{border-color:#fff;}
.finder-tile.is-active{border:2px solid #fff;background:var(--r-panel);}
.finder-tile .r-icon{width:36px;height:36px;margin:0 auto .7rem;}
.finder-tile .ft-name{font-weight:600;letter-spacing:.12em;font-size:.85rem;}
.finder-result{margin-top:1.6rem;text-align:center;opacity:0;transition:opacity .3s var(--r-ease);}
.finder-result.is-visible{opacity:1;}
.finder-result .finder-rec{font-weight:800;font-size:1.4rem;color:#fff;}
.finder-result .finder-blurb{color:var(--r-mut);font-size:.9rem;margin:.3rem 0 1rem;}
/* === TG6·dev band === */
.devband{background:var(--r-panel);border-top:1px solid var(--r-line);border-bottom:1px solid var(--r-line);}
.devband .dev-eyebrow{font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--r-mut2);}
.devband h3{font-weight:800;margin:.5rem 0;}
.devband p{color:var(--r-mut);max-width:48ch;}
.devband .dev-cta{display:inline-flex;align-items:center;gap:.5rem;border:1px solid #fff;color:#fff;
  padding:.7rem 1.4rem;text-transform:uppercase;font-size:.8rem;letter-spacing:.08em;transition:background .25s,color .25s;}
.devband .dev-cta:hover{background:#fff;color:#000;}
.devband .dev-cta svg{width:15px;height:15px;}
```

- [ ] **Step 3: Verify CSS parses and icons load**

Run:
```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/js/icons.js | grep -c 'TG6_ICONS'   # expect >=1
curl -s http://localhost:8000/css/style.css | grep -c 'REFRESH 2026-06'  # expect 1
kill %1
```
Expected: both counts ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add css/style.css js/icons.js
git commit -m "feat(refresh): add design tokens + shared SVG icon module"
```

---

## Task 2: Canonical nav + footer (define once, apply to index.html)

This markup is the **single source** reused by every page in later tasks. Defines emoji-free SVG socials and the TG6·dev nav/footer links.

**Files:**
- Modify: `index.html` (replace `<nav>…</nav>` and the footer block)

- [ ] **Step 1: Replace the navbar**

In `index.html`, replace the entire `<nav class="navbar …">…</nav>` block with:

```html
<nav class="navbar navbar-expand-lg osahan-nav p-0 border-bottom navbar-dark">
  <div class="container-fluid px-3">
    <a class="navbar-brand py-3 pe-3 border-end" href="index.html">
      <span class="fw-bold text-white fs-5 px-1">TG6</span>
    </a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 osahan-nav-navbar-nav">
        <li class="nav-item"><a class="nav-link active text-uppercase" href="index.html">Shop</a></li>
        <li class="nav-item"><a class="nav-link text-uppercase" href="about.html">About</a></li>
        <li class="nav-item"><a class="nav-link text-uppercase" href="contact.html">Contact</a></li>
        <li class="nav-item"><a class="nav-link text-uppercase d-inline-flex align-items-center gap-1"
          href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">
          TG6&middot;dev <span class="r-icon" data-icon="external" style="width:13px;height:13px;"></span></a></li>
      </ul>
    </div>
    <div class="text-end" style="margin-right:10px">
      <a target="_blank" rel="noopener" href="https://www.twitch.tv/teamglitch6" class="r-iconbtn" data-icon="twitch"></a>
      <a target="_blank" rel="noopener" href="https://www.youtube.com/channel/UC7KaaAFaf3LXI2Xcl7P9Ilw" class="r-iconbtn" data-icon="youtube"></a>
      <a target="_blank" rel="noopener" href="https://www.kick.com/teamglitch" class="r-iconbtn" data-icon="kick"></a>
    </div>
    <button class="navbar-toggler border-0 shadow-none" type="button"
      data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="r-icon" data-icon="external" style="display:none"></span>
      <i class="ri-menu-3-line text-white"></i>
    </button>
  </div>
</nav>
```

- [ ] **Step 2: Replace the footer**

Replace the `<!-- Footer -->` block in `index.html` with:

```html
<!-- Footer -->
<div class="py-3 footer-copyright">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-8">
        <span class="me-3 small">&copy;2026 <b>TG6</b>. All rights reserved.</span>
        <a class="text-secondary small mx-2 text-decoration-none" href="about.html">About</a>
        <a class="text-secondary small mx-2 text-decoration-none" href="faq.html">FAQ</a>
        <a class="text-secondary small mx-2 text-decoration-none" href="terms.html">Terms</a>
        <a class="text-secondary small mx-2 text-decoration-none" href="privacy.html">Privacy</a>
        <a class="text-secondary small mx-2 text-decoration-none" href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">TG6&middot;dev</a>
      </div>
      <div class="col-md-4 text-end hide-on-mobile">
        <a target="_blank" rel="noopener" href="https://www.twitch.tv/teamglitch6" class="r-iconbtn" data-icon="twitch"></a>
        <a target="_blank" rel="noopener" href="https://www.youtube.com/channel/UC7KaaAFaf3LXI2Xcl7P9Ilw" class="r-iconbtn" data-icon="youtube"></a>
        <a target="_blank" rel="noopener" href="https://www.kick.com/teamglitch" class="r-iconbtn" data-icon="kick"></a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add an icon-hydration script + include icons.js**

Immediately before the closing `</body>` in `index.html`, ensure scripts load in this order (add `icons.js` and the hydration snippet; keep existing bootstrap + script.js):

```html
<script src="vender/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="js/icons.js"></script>
<script>
  // Hydrate any element with data-icon="<id>" from the shared set.
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var k = el.getAttribute('data-icon');
    if (window.TG6_ICONS && TG6_ICONS[k]) el.innerHTML = TG6_ICONS[k];
  });
</script>
<script src="js/script.js"></script>
```

- [ ] **Step 4: Verify socials render as SVG and TG6·dev link is present**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/index.html | grep -c 'glitch6-dev.github.io/DigitalServices'  # expect >=2 (nav+footer)
curl -s http://localhost:8000/index.html | grep -c 'data-icon="twitch"'                     # expect >=2
kill %1
```
Expected: TG6·dev link count ≥ 2, twitch icon count ≥ 2. Open `http://localhost:8000/` and confirm social glyphs show as line icons (not emoji) and a "TG6·dev ↗" item sits in the nav.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(refresh): canonical nav+footer with SVG socials and TG6·dev links"
```

---

## Task 3: Hero refinement (index.html)

**Files:**
- Modify: `index.html` (the `<!-- Hero Banner -->` block)

- [ ] **Step 1: Replace hero markup**

Replace the `<!-- Hero Banner -->` block with (keeps `tg6-hero` background):

```html
<!-- Hero Banner -->
<div class="container-fluid px-0">
  <div class="tg6-hero d-flex align-items-center justify-content-center text-center">
    <div>
      <p class="r-kicker mb-2">Built for IRL streamers</p>
      <h1 class="fw-bold display-4 mb-3">Stream Anywhere.</h1>
      <p class="mb-4" style="color:#aaa;max-width:480px;margin:0 auto 1.5rem;">
        Three backpacks. Three tiers. Pick the one that matches where you stream.
      </p>
      <a href="#shop" class="btn btn-light btn-hov rounded-0 px-4">Shop now</a>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/` (serve as before). Expected: hero shows kicker in uppercase letter-spaced grey, large "Stream Anywhere.", a "Shop now" button; background image still loads.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(refresh): refine hero copy/styling"
```

---

## Task 4: "What's inside" hotspots — module + homepage Metro section

**Files:**
- Create: `js/hotspots.js`
- Modify: `index.html` (insert section after hero, before `#shop`)
- Modify: `css/style.css` (already has `.hs*` from Task 1 — no change)

- [ ] **Step 1: Create the hotspot module**

Create `js/hotspots.js`:

```js
/* Data-driven product hotspots. Coords are % of the image box (x=left, y=top).
   Swap flat-photo coords for component-shot coords later without code changes. */
(function () {
  window.TG6_HOTSPOTS = {
    metro: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Compact 4K camera with a flip screen and clean HDMI out — broadcast-grade picture in a run-and-gun body.' },
      { x: 70, y: 46, icon: 'signal',  label: 'T-Mobile 5G gateway',     blurb: 'Plug-and-play 5G home internet. In dense city coverage it just works — no bonding, no fuss.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Swap power mid-stream without going dark. Runs the full kit for hours on a single pack.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Elgato Cam Link 4K',      blurb: 'Turns the camera HDMI into a clean USB capture feed the encoder can push to Twitch/YouTube/Kick.' }
    ],
    roamer: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Same broadcast-grade 4K camera and clean HDMI capture as the Metro.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Peplink MAX Transit Duo', blurb: 'Dual-SIM bonding (T-Mobile + Verizon). When one carrier drops on the backroads, the stream rides the other.' },
      { x: 32, y: 60, icon: 'battery', label: 'Hot-swap battery',        blurb: 'Hours of mobile power; swap packs without dropping the broadcast.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Bonded encoder',          blurb: 'Combines both carriers into one stable uplink so bitrate stays steady through patchy coverage.' }
    ],
    nomad: [
      { x: 50, y: 20, icon: 'camera',  label: 'Sony ZV-1 II 4K camera', blurb: 'Broadcast-grade 4K in a travel-light body for off-grid shoots.' },
      { x: 70, y: 46, icon: 'signal',  label: 'Starlink portable',       blurb: 'Low-earth-orbit satellite uplink. Stream from anywhere on earth — no cell towers required.' },
      { x: 32, y: 60, icon: 'battery', label: 'Expedition power',        blurb: 'High-capacity, hot-swappable power sized for long off-grid sessions.' },
      { x: 58, y: 78, icon: 'chip',    label: 'Encoder + failover',      blurb: 'Pushes a clean feed over satellite with cellular failover when any coverage exists.' }
    ]
  };

  function show(root, productKey, i) {
    var h = TG6_HOTSPOTS[productKey][i];
    root.querySelector('.hs-label').textContent = h.label;
    root.querySelector('.hs-blurb').textContent = h.blurb;
    root.querySelectorAll('.hs-dot').forEach(function (d) {
      d.classList.toggle('is-active', +d.dataset.index === i);
    });
  }

  window.initHotspots = function (rootSelector, productKey) {
    var root = document.querySelector(rootSelector);
    if (!root || !TG6_HOTSPOTS[productKey]) return;
    var layer = root.querySelector('.hs-layer');
    TG6_HOTSPOTS[productKey].forEach(function (h, i) {
      var dot = document.createElement('button');
      dot.className = 'hs-dot';
      dot.type = 'button';
      dot.style.left = h.x + '%';
      dot.style.top = h.y + '%';
      dot.dataset.index = i;
      dot.setAttribute('aria-label', h.label);
      dot.innerHTML = (window.TG6_ICONS && TG6_ICONS[h.icon]) || '';
      dot.addEventListener('click', function () { show(root, productKey, i); });
      layer.appendChild(dot);
    });
    show(root, productKey, 0); // default to first component
  };
})();
```

- [ ] **Step 2: Insert the homepage "what's inside" section**

In `index.html`, immediately after the closing `</div>` of the Hero Banner block and before `<!-- Shop -->`, insert:

```html
<!-- What's Inside -->
<section class="container r-section" id="whats-inside">
  <div class="row mb-4"><div class="col-12 text-center">
    <p class="r-kicker mb-1">What's inside</p>
    <h2 class="fw-bold mb-0">Every part, doing a job.</h2>
  </div></div>
  <div class="hs" data-hotspots="metro">
    <div class="hs-stage">
      <img class="hs-image" src="img/in-stock/tg6-metro.png" alt="TG6 Metro streaming backpack with component hotspots" />
      <div class="hs-layer"></div>
    </div>
    <div class="hs-panel">
      <div class="hs-label"></div>
      <div class="hs-blurb"></div>
      <p class="hs-hint">Tap a marker on the pack to see each component.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Wire the init + load the module**

In `index.html`, update the pre-`</body>` scripts so `hotspots.js` loads after `icons.js`, and add an init line. The block becomes:

```html
<script src="vender/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="js/icons.js"></script>
<script src="js/hotspots.js"></script>
<script>
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var k = el.getAttribute('data-icon');
    if (window.TG6_ICONS && TG6_ICONS[k]) el.innerHTML = TG6_ICONS[k];
  });
  if (window.initHotspots) initHotspots('[data-hotspots="metro"]', 'metro');
</script>
<script src="js/script.js"></script>
```

- [ ] **Step 4: Verify hotspots render and switch**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/js/hotspots.js | grep -c 'Peplink MAX Transit Duo'   # expect 1
kill %1
```
Then open `http://localhost:8000/#whats-inside` (or headless-screenshot per the verification model). Expected: the Metro image shows 4 round SVG-icon markers; the panel shows "Sony ZV-1 II 4K camera" by default; clicking another marker swaps the label/blurb and highlights that dot.

- [ ] **Step 5: Commit**

```bash
git add js/hotspots.js index.html
git commit -m "feat(refresh): data-driven what's-inside hotspots on homepage"
```

---

## Task 5: Shop grid refinement (index.html)

The existing shop grid is solid; only refine the CTA label casing and ensure section heading uses the kicker style. Minimal change — keep card markup/hover.

**Files:**
- Modify: `index.html` (the `<!-- Shop -->` heading row only)

- [ ] **Step 1: Update the shop section heading**

Replace the shop heading row:

```html
<div class="row mb-4">
  <div class="col-12 text-center">
    <h4 class="fw-bold mb-0">Backpacks</h4>
  </div>
</div>
```

with:

```html
<div class="row mb-4">
  <div class="col-12 text-center">
    <p class="r-kicker mb-1">The lineup</p>
    <h2 class="fw-bold mb-0">Three backpacks. Three tiers.</h2>
  </div>
</div>
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/#shop`. Expected: shop section now has a kicker + larger heading; the three product cards and hover overlays still work and link to product pages.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(refresh): polish shop section heading"
```

---

## Task 6: "Find your backpack" finder (replaces "Choose Your Tier")

**Files:**
- Create: `js/finder.js`
- Modify: `index.html` (replace the `<!-- Tier Breakdown -->` block)

- [ ] **Step 1: Create the finder module**

Create `js/finder.js`:

```js
/* "Find your backpack" — maps where-you-stream to a tier recommendation. */
(function () {
  window.TG6_TIERS = {
    city:        { name: 'TG6 Metro',  href: 'products/metro.html',  blurb: 'City streets, dense coverage. Plug-and-play 5G — the simplest setup, lowest price.' },
    backcountry: { name: 'TG6 Roamer', href: 'products/roamer.html', blurb: 'Trails, backroads, events — patchy single-carrier coverage. Dual-SIM bonding keeps you live.' },
    offgrid:     { name: 'TG6 Nomad',  href: 'products/nomad.html',  blurb: 'Truly remote, off-grid, international. Starlink streams where there is no cell at all.' }
  };

  window.initFinder = function () {
    var tiles = document.querySelectorAll('.finder-tile');
    var result = document.querySelector('.finder-result');
    if (!tiles.length || !result) return;
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        tiles.forEach(function (t) { t.classList.remove('is-active'); });
        tile.classList.add('is-active');
        var tier = TG6_TIERS[tile.dataset.tier];
        if (!tier) return;
        result.querySelector('.finder-rec').textContent = tier.name;
        result.querySelector('.finder-blurb').textContent = tier.blurb;
        var cta = result.querySelector('.finder-cta');
        cta.setAttribute('href', tier.href);
        result.classList.add('is-visible');
      });
    });
  };
})();
```

- [ ] **Step 2: Replace the tier section with the finder**

Replace the entire `<!-- Tier Breakdown -->` block in `index.html` with:

```html
<!-- Find Your Backpack -->
<section class="container r-section border-top border-bottom" id="finder" style="border-color:#222 !important;">
  <div class="row mb-4"><div class="col-12 text-center">
    <p class="r-kicker mb-1">Find your backpack</p>
    <h2 class="fw-bold mb-1">Where do you stream?</h2>
    <p style="color:#888;">Every backpack is built around one question.</p>
  </div></div>
  <div class="row justify-content-center"><div class="col-lg-9">
    <div class="finder-tiles">
      <button type="button" class="finder-tile" data-tier="city">
        <span class="r-icon" data-icon="city"></span>
        <div class="ft-name">CITY</div>
      </button>
      <button type="button" class="finder-tile" data-tier="backcountry">
        <span class="r-icon" data-icon="backcountry"></span>
        <div class="ft-name">BACKCOUNTRY</div>
      </button>
      <button type="button" class="finder-tile" data-tier="offgrid">
        <span class="r-icon" data-icon="offgrid"></span>
        <div class="ft-name">OFF-GRID</div>
      </button>
    </div>
    <div class="finder-result">
      <div class="finder-rec"></div>
      <div class="finder-blurb"></div>
      <a class="btn btn-light btn-hov rounded-0 px-4 finder-cta" href="#">View it</a>
    </div>
  </div></div>
</section>
```

- [ ] **Step 3: Load + init the finder**

Add `finder.js` and its init to the index script block. The block now reads:

```html
<script src="vender/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="js/icons.js"></script>
<script src="js/hotspots.js"></script>
<script src="js/finder.js"></script>
<script>
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var k = el.getAttribute('data-icon');
    if (window.TG6_ICONS && TG6_ICONS[k]) el.innerHTML = TG6_ICONS[k];
  });
  if (window.initHotspots) initHotspots('[data-hotspots="metro"]', 'metro');
  if (window.initFinder) initFinder();
</script>
<script src="js/script.js"></script>
```

- [ ] **Step 4: Verify finder behavior**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/index.html | grep -c 'data-tier="backcountry"'  # expect 1
curl -s http://localhost:8000/index.html | grep -ci 'Choose Your Tier'         # expect 0 (old section gone)
kill %1
```
Then open `http://localhost:8000/#finder`. Expected: three icon tiles (City / Backcountry / Off-grid), no emoji; clicking a tile highlights it, reveals a recommendation (e.g. Backcountry → "TG6 Roamer") and a "View it" button whose link points to that product page.

- [ ] **Step 5: Commit**

```bash
git add js/finder.js index.html
git commit -m "feat(refresh): find-your-backpack finder replaces tier breakdown"
```

---

## Task 7: TG6·dev cross-sell band (index.html)

**Files:**
- Modify: `index.html` (insert band after `#finder`, before the Subscribe block)

- [ ] **Step 1: Insert the band**

Before the `<!-- Subscribe -->` block in `index.html`, insert:

```html
<!-- TG6·dev band -->
<section class="devband">
  <div class="container r-section text-center">
    <p class="dev-eyebrow">Also from TG6</p>
    <h3 class="fw-bold">Need a website or app, not a backpack?</h3>
    <p class="mx-auto">The same team builds sites, online stores, custom software, security &amp; SEO for businesses — that's TG6&middot;dev.</p>
    <a class="dev-cta" href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">
      Explore TG6&middot;dev <span class="r-icon" data-icon="external"></span>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/` and scroll past the finder. Expected: a bordered panel band reading "Need a website or app, not a backpack?" with an "Explore TG6·dev ↗" outline button that opens the DigitalServices site in a new tab.

```bash
curl -s http://localhost:8000/index.html | grep -c 'devband'   # expect 1
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(refresh): add TG6·dev cross-sell band to homepage"
```

---

## Task 8: Subscribe section polish (index.html)

**Files:**
- Modify: `index.html` (Subscribe heading/copy only; leave the form `<script>` logic untouched)

- [ ] **Step 1: Refine the subscribe heading**

Replace the subscribe heading/intro:

```html
<h4 class="fw-bold mb-3">Stay in the Loop</h4>
<p class="mb-4" style="color:#888;">Get notified when Metro ships and when new tiers drop.</p>
```

with:

```html
<p class="r-kicker mb-1">Stay in the loop</p>
<h2 class="fw-bold mb-3">Be first when Metro ships.</h2>
<p class="mb-4" style="color:#888;">One email when pre-orders ship and when new tiers drop. No spam.</p>
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000/`. Expected: subscribe block shows the new kicker/heading; entering an email and submitting still shows the optimistic success message (form JS unchanged).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(refresh): polish subscribe section copy"
```

---

## Task 9: Product pages — hotspots + canonical nav/footer

Apply to `products/metro.html`, `products/roamer.html`, `products/nomad.html`. **Buy buttons keep their current `test_…` links — do not touch them.** Per-page `productKey` is `metro` / `roamer` / `nomad`.

**Files:**
- Modify: `products/metro.html`, `products/roamer.html`, `products/nomad.html`

- [ ] **Step 1: Swap nav + footer to the canonical markup**

In each product page, replace its `<nav>…</nav>` and footer with the Task 2 markup, **adjusting relative paths** (product pages live in `products/`, so prefix page links with `../`): `href="../index.html"`, `../about.html`, `../contact.html`, `../faq.html`, `../terms.html`, `../privacy.html`. The TG6·dev and social URLs are absolute — leave them. Brand link → `../index.html`.

- [ ] **Step 2: Add the hotspot stage to the product image**

In each product page, wrap the existing main product `<img>` in a hotspot stage. Replace the existing product image element (the `<img src="../img/.../tg6-<name>.png" …>`) with:

```html
<div class="hs-stage" data-hotspots="PRODUCTKEY">
  <img class="hs-image" src="../img/.../tg6-PRODUCTKEY.png" alt="TG6 PRODUCTKEY streaming backpack with component hotspots" />
  <div class="hs-layer"></div>
</div>
<div class="hs-panel mt-3">
  <div class="hs-label"></div>
  <div class="hs-blurb"></div>
  <p class="hs-hint">Tap a marker to see each component.</p>
</div>
```

Substitute `PRODUCTKEY` (`metro`/`roamer`/`nomad`) and keep each page's existing image path (`img/in-stock/tg6-metro.png` for metro; `img/pre-orders/tg6-roamer.png`, `img/pre-orders/tg6-nomad.png` for the others — note the `../` prefix already present on these pages).

- [ ] **Step 3: Load modules + init per page**

Before `</body>` on each product page, ensure these load (paths are `../js/…` / `../vender/…` if the page uses relative paths — match the page's existing vendor path style):

```html
<script src="../vender/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../js/icons.js"></script>
<script src="../js/hotspots.js"></script>
<script>
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var k = el.getAttribute('data-icon');
    if (window.TG6_ICONS && TG6_ICONS[k]) el.innerHTML = TG6_ICONS[k];
  });
  if (window.initHotspots) initHotspots('[data-hotspots="PRODUCTKEY"]', 'PRODUCTKEY');
</script>
```

(Substitute `PRODUCTKEY`. If the page already includes bootstrap/script.js, don't duplicate — just add `icons.js`, `hotspots.js`, and the init.)

- [ ] **Step 4: Verify each product page**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
for p in metro roamer nomad; do
  echo "== $p =="
  curl -s http://localhost:8000/products/$p.html | grep -c "data-hotspots=\"$p\""   # expect 1
  curl -s http://localhost:8000/products/$p.html | grep -c 'glitch6-dev.github.io/DigitalServices'  # expect >=2
done
# buy links untouched:
curl -s http://localhost:8000/products/metro.html | grep -c 'buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800'  # expect 1
kill %1
```
Expected: each page reports the hotspot stage (1), TG6·dev links (≥2), and the Metro test buy-link still present (1). Open each page and confirm markers render over the product and the panel updates on click.

- [ ] **Step 5: Commit**

```bash
git add products/metro.html products/roamer.html products/nomad.html
git commit -m "feat(refresh): hotspots + canonical nav/footer on product pages"
```

---

## Task 10: Whole-site consistency pass

Apply canonical nav/footer + de-emoji to `about.html`, `contact.html`, `faq.html`, `terms.html`, `privacy.html`, `404.html`. These are root-level pages (same relative paths as index). **No structural redesign** — only nav, footer, icon hydration, and removing any emoji.

**Files:**
- Modify: `about.html`, `contact.html`, `faq.html`, `terms.html`, `privacy.html`, `404.html`

- [ ] **Step 1: Find emoji and old nav/footer across these pages**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
grep -rlP '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]' about.html contact.html faq.html terms.html privacy.html 404.html 2>/dev/null
```
Note which files contain emoji; each must be cleaned.

- [ ] **Step 2: Apply canonical nav + footer**

In each of the six pages, replace its `<nav>…</nav>` and footer with the Task 2 markup (root-relative paths — these pages are at repo root, so `index.html`, `about.html`, etc. with no prefix). Add the `icons.js` + hydration snippet before `</body>` exactly as in Task 2 Step 3 (root paths `js/icons.js`). If a page lacks `js/script.js`, that's fine — only add what it needs.

- [ ] **Step 3: Replace any emoji with the SVG icon set or plain text**

For each emoji found in Step 1, replace it with the nearest `data-icon` span (e.g. a location/offgrid/city icon) or remove it in favor of plain text. No emoji may remain.

- [ ] **Step 4: Verify no emoji + links present**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site && python3 -m http.server 8000 &
sleep 1
for p in about contact faq terms privacy 404; do
  echo "== $p =="
  curl -s http://localhost:8000/$p.html | grep -cP '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]'   # expect 0
  curl -s http://localhost:8000/$p.html | grep -c 'glitch6-dev.github.io/DigitalServices'      # expect >=2
done
kill %1
```
Expected: emoji count 0 on every page; TG6·dev links ≥ 2 (nav + footer). Open each page and confirm nav/footer match the homepage and headers still use their existing backgrounds.

- [ ] **Step 5: Commit**

```bash
git add about.html contact.html faq.html terms.html privacy.html 404.html
git commit -m "feat(refresh): site-wide nav/footer consistency + de-emoji"
```

---

## Task 11: Final QA sweep

**Files:** none (verification only) — fix-forward if issues found.

- [ ] **Step 1: Site-wide emoji + leftover checks**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
echo "Emoji anywhere (expect 0):"
grep -rlP '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]' --include=*.html . | grep -v inStock-pages | grep -v '/products/.*stock' || echo "none"
echo "Old 'Choose Your Tier' gone (expect 0):"
grep -rci 'Choose Your Tier' index.html
echo "TG6·dev nav/footer present on main pages:"
for p in index about contact faq terms privacy products/metro products/roamer products/nomad; do
  printf "%s: " "$p"; grep -c 'glitch6-dev.github.io/DigitalServices' $p.html 2>/dev/null || echo 0
done
```
Expected: no emoji on in-scope pages; tier text gone; every main page ≥ 2 TG6·dev links. (inStock-pages and GlitchBars pages are intentionally excluded.)

- [ ] **Step 2: Responsive + interaction spot-check**

Serve and open at desktop and mobile widths (use the headless screenshot at `--window-size=390,2200` for mobile). Confirm: hotspots tappable on mobile, finder tiles stack, nav collapses, no horizontal scroll.

- [ ] **Step 3: Buy links still intact (no accidental Stripe edits)**

```bash
grep -rn 'buy.stripe.com/test_' products/   # expect the three original test_ links unchanged
```
Expected: metro `test_bJe9AT2lzeYSesqfAU04800`, nomad `test_7sY7sL1hv9Ey0BA60k04801`, roamer `test_fZubJ12lz03Y1FE2O804802` — all present, untouched.

- [ ] **Step 4: Final commit (if any fixes were made)**

```bash
git add -A
git commit -m "chore(refresh): final QA fixes"
```

---

## Self-Review (author checklist — completed)

- **Spec coverage:** §3 design system → Task 1; §4 homepage (hero/A/shop/B/band/subscribe/nav) → Tasks 2,3,4,5,6,7,8; §5 product pages → Task 9; §6 whole-site pass → Task 10; no-emoji rule → Tasks 1–11; Stripe non-dependency → buy links explicitly untouched (Tasks 9, 11). ✓
- **Placeholder scan:** `PRODUCTKEY` is an explicit substitution token with instructions, not a TODO; all code blocks are complete. ✓
- **Type consistency:** `initHotspots`, `TG6_HOTSPOTS`, `TG6_ICONS`, `initFinder`, `TG6_TIERS`, `.hs-dot/.hs-layer/.hs-label/.hs-blurb`, `.finder-tile/.finder-result/.finder-rec/.finder-blurb/.finder-cta`, `data-icon`, `data-hotspots`, `data-tier` used identically across CSS, JS, and HTML tasks. ✓
