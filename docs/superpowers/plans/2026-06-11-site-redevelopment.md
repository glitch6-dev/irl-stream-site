# TG6 Site Redevelopment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bootstrap shop template with a hand-crafted glitch-editorial + telemetry site per `docs/superpowers/specs/2026-06-11-site-redevelopment-design.md`.

**Architecture:** Static site, zero frameworks. One stylesheet (`css/style.css`, full rewrite), three small JS modules (`main.js`, `finder.js`, `forms.js`). Shared nav/footer markup is duplicated per page (no build step) — the canonical snippets live in Task 3 and MUST be copied verbatim.

**Tech Stack:** Vanilla HTML/CSS/JS. Google Fonts (Archivo Black, Archivo, Space Mono). Playwright MCP for verification. No Bootstrap/jQuery/Swiper/Remixicon.

**Verification model:** No JS test framework exists and none is added (YAGNI for a static site). Every task ends with a concrete verification step: serve via `python3 -m http.server 8080` from repo root, check with curl/grep or Playwright MCP (navigate → snapshot/screenshot → console check). A task is not done until its verification passes.

**Branch:** all work on `redesign/glitch-telemetry`, commit per task, NO push (user reviews first; pushing later goes through the ship skill → glitch6-dev account).

---

## Canonical data (used by multiple tasks — single source of truth)

**Palette tokens:** base `#07060c`, panel `#0d0b16`, border `#1e1b2e`, purple `#a855f7`, cyan `#22d3ee`, magenta `#e879f9`, green `#34d399`, text `#e7e9ee`, body `#94a3b8`, muted `#64748b`.

**Per-product data:**

| | Metro | Roamer | Nomad |
|---|---|---|---|
| Tier kicker | `// TIER_01 · CITY · TG6_METRO` | `// TIER_02 · BACKCOUNTRY · TG6_ROAMER` | `// TIER_03 · OFF-GRID · TG6_NOMAD` |
| Tier color | cyan `#22d3ee` | purple `#a855f7` | magenta `#e879f9` |
| Price | $2,100 | $5,000 | $3,000 |
| Hero mono specs | `T-MOBILE 5G · 1080p60 OUT · 4K30 REC` | `DUAL-SIM BONDED · 1080p60 OUT · 4K30 REC` | `STARLINK ROAM · 1080p60 OUT · 4K30 REC` |
| Hero image | `../img/in-stock/tg6-metro.png` | `../img/pre-orders/tg6-roamer.png` | `../img/pre-orders/tg6-nomad.png` |
| Stripe link (SANDBOX — swap before launch) | `https://buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800` | `https://buy.stripe.com/test_fZubJ12lz03Y1FE2O804802` | `https://buy.stripe.com/test_7sY7sL1hv9Ey0BA60k04801` |
| Loadout row 1 (uplink) | T-Mobile 5G Gateway · "Uplink · plug in and stream" · spec `5G UC` · `tmobile-5g-gateway.png` | Peplink MAX Transit Duo · "Uplink · T-Mobile + Verizon bonded, seamless failover" · spec `DUAL-SIM` · `peplink-max-transit.png` | Starlink Mini · "Uplink · works where there is no cell at all" · spec `GLOBAL ROAM` · `starlink-mini.png` |

**Loadout rows 2–8 (identical for all three products):**

| # | Name | Role line | Spec | Photo (`../img/gear/`) | YOUR PICK? |
|---|---|---|---|---|---|
| 2 | Sony ZV-1 II | Camera · clean HDMI, flip screen | `4K30 · 20MP` | `sony-zv1-ii.jpg` | no |
| 3 | Elgato Cam Link 4K | Capture · HDMI → USB for OBS | `4K PASSTHRU` | `elgato-cam-link-4k.jpg` | no |
| 4 | TG6 Shoulder Mount | 3D-printed in-house · camera pops off tool-free | `IN-HOUSE` | none — dark tile with wordmark (see Task 8) | no |
| 5 | Mic | Boom mic or DJI Mic Mini ×2 | `YOUR CALL` | `dji-mic-mini.png` | **yes** |
| 6 | LED Light | Basic clip-on, mid RGB, or pro bi-color | `3 TIERS` | `ulanzi-vl49-led.png` | **yes** |
| 7 | Hot-Swap Power | NP-F970 packs · swap mid-stream, never go dark | `12H FIELD` | `np-f970-battery.jpg` | no |
| 8 | High-Endurance SD | Rated for continuous 4K recording | `4K RATED` | `sandisk-high-endurance.png` | no |

Loadout footnote (all pages): `Flat price — your picks don't change what you pay. Choose at checkout. Phone USB tether included as signal fallback.`
Gear credit line (keep, small): camera photo by Henry Söderlund (CC BY 2.0), link `https://commons.wikimedia.org/wiki/File:Sony_ZV-1_II_by_Henry_S%C3%B6derlund.jpg`.

**External links:** Twitch `https://www.twitch.tv/teamglitch6` · YouTube `https://www.youtube.com/channel/UC7KaaAFaf3LXI2Xcl7P9Ilw` · Kick `https://www.kick.com/teamglitch` · TG6·dev `https://glitch6-dev.github.io/DigitalServices/` · Forms endpoint `https://script.google.com/macros/s/AKfycbwykb0OnOAnyIWFHjm8ZpRj0Pc0ZQlBvnes2K-SPMqwVQlO0bq9mzghWsUa_J2nFsqd-g/exec`.

---

### Task 1: Branch + brand assets

**Files:**
- Create: `img/brand/tg6-wordmark.png`, `img/brand/tg6-wolf.png`, `img/brand/tg6-circuit.jpg`
- Commit: everything currently untracked in `img/gear/`

- [ ] **Step 1: Create branch**

```bash
cd /home/kali/Desktop/TG6/Repos/irl-stream-site
git checkout -b redesign/glitch-telemetry
```

- [ ] **Step 2: Copy brand assets in**

```bash
mkdir -p img/brand
cp /home/kali/Desktop/TG6/Marketing/brands/tg6/assets/tg6-wordmark-primary.png img/brand/tg6-wordmark.png
cp /home/kali/Desktop/TG6/Marketing/brands/tg6/assets/tg6-logo-secondary-wolf.png img/brand/tg6-wolf.png
cp /home/kali/Desktop/TG6/Marketing/brands/tg6/assets/tg6-wordmark-primary.jpeg img/brand/tg6-circuit.jpg
```

- [ ] **Step 3: Optimize the two heavy gear photos (>300KB)**

```bash
magick img/gear/sandisk-high-endurance.png -resize 800x800\> -quality 85 img/gear/sandisk-high-endurance.png
magick img/gear/rode-videomic-go-ii.png -resize 800x800\> -quality 85 img/gear/rode-videomic-go-ii.png
ls -la img/gear/  # both should now be well under 300KB
```

- [ ] **Step 4: Verify assets exist and commit**

```bash
ls img/brand/   # expect: tg6-circuit.jpg  tg6-wolf.png  tg6-wordmark.png
git add img/brand img/gear
git commit -m "feat(assets): add brand assets, commit + optimize gear photos"
```

---

### Task 2: CSS foundation — tokens, reset, base, utilities

**Files:**
- Replace entirely: `css/style.css` (old content is Bootstrap-era; superseded wholesale)

- [ ] **Step 1: Write the foundation layer of `css/style.css`** (homepage/product sections appended in later tasks — this file is built up task by task, top to bottom)

```css
/* ============ TG6 — glitch editorial + telemetry ============ */
/* 1. TOKENS */
:root {
  --bg: #07060c; --panel: #0d0b16; --line: #1e1b2e;
  --purple: #a855f7; --cyan: #22d3ee; --magenta: #e879f9; --green: #34d399;
  --text: #e7e9ee; --body: #94a3b8; --muted: #64748b;
  --grad: linear-gradient(90deg, var(--purple), var(--cyan));
  --font-display: "Archivo Black", sans-serif;
  --font-body: "Archivo", sans-serif;
  --font-mono: "Space Mono", monospace;
  --wrap: 1140px;
}

/* 2. RESET / BASE */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--body);
  font-family: var(--font-body); font-size: 16px; line-height: 1.6;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: var(--cyan); text-decoration: none; }
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 2px solid var(--cyan); outline-offset: 3px;
}
h1, h2, h3 { font-family: var(--font-display); color: var(--text); line-height: 1.1; font-weight: 400; }
h1 { font-size: clamp(2.4rem, 6vw, 4.2rem); }
h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); }
h3 { font-size: 1.15rem; }
p { max-width: 70ch; }
.wrap { max-width: var(--wrap); margin: 0 auto; padding: 0 24px; }
.section { padding: 96px 0; position: relative; }

/* 3. UTILITIES */
.kicker {
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--cyan); margin-bottom: 14px; display: block;
}
.mono { font-family: var(--font-mono); }
.badge-pre { font-family: var(--font-mono); font-size: 12px; color: var(--magenta); letter-spacing: 1px; }
.status-dot { font-family: var(--font-mono); font-size: 11px; color: var(--green); letter-spacing: 1px; }
.btn {
  display: inline-block; font-family: var(--font-body); font-weight: 700; font-size: 14px;
  padding: 13px 26px; border-radius: 5px; border: 0; cursor: pointer;
  background: var(--grad); color: #07060c; transition: transform .15s, box-shadow .15s;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px #a855f755; }
.btn-ghost { background: none; border: 1px solid #475569; color: var(--text); }
.btn-ghost:hover { border-color: var(--cyan); box-shadow: none; }

/* 4. OVERLAYS (grain + glow, YFE technique recolored) */
.grain, .glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
.grain {
  opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E");
}
.glow {
  background:
    radial-gradient(600px 400px at 85% -5%, #a855f71f, transparent 70%),
    radial-gradient(500px 360px at 10% 40%, #22d3ee14, transparent 70%);
}
main, header, footer { position: relative; z-index: 2; }

/* 5. SCANLINE DIVIDER */
.scanline { height: 1px; background: var(--line); position: relative; overflow: visible; }
.scanline::after {
  content: ""; position: absolute; top: 0; left: 0; width: 120px; height: 1px;
  background: var(--grad); animation: scan 6s linear infinite;
}
@keyframes scan { from { left: -120px; } to { left: 100%; } }

/* 6. REVEAL */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.reveal.in { opacity: 1; transform: none; }

/* 7. GLITCH TICK (decorative headings only) */
@keyframes glitch-tick {
  0%, 94%, 100% { text-shadow: none; transform: none; }
  95% { text-shadow: -2px 0 var(--magenta), 2px 0 var(--cyan); transform: translateX(1px); }
  97% { text-shadow: 2px 0 var(--magenta), -2px 0 var(--cyan); transform: translateX(-1px); }
}
.glitch { animation: glitch-tick 8s infinite; }

/* 8. REDUCED MOTION — everything inert */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .glitch, .scanline::after, .marquee-track { animation: none !important; }
  * { transition-duration: .01ms !important; }
}
```

- [ ] **Step 2: Verify CSS parses (no served pages use it yet — syntax check only)**

```bash
python3 - <<'EOF'
import tinycss2, sys
rules = tinycss2.parse_stylesheet(open('css/style.css').read(), skip_whitespace=True)
errs = [r for r in rules if r.type == 'error']
print("PARSE ERRORS:", errs if errs else "none")
EOF
# If tinycss2 unavailable: pip install tinycss2 — or fall back to loading any page in Playwright later
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(css): foundation — tokens, base, utilities, overlays, motion"
```

---

### Task 3: Shared shell — canonical nav + footer snippets, head block

These snippets are the single source of truth. Every page task below copies them verbatim (adjusting only the `../` prefix on root-relative pages vs `products/` pages, marked `{P}` = `` for root pages, `../` for product pages).

**Canonical `<head>` block** (replace `{TITLE}` and `{DESC}` per page):

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{TITLE}</title>
  <meta name="description" content="{DESC}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{P}css/style.css" />
  <link rel="icon" type="image/png" sizes="32x32" href="{P}img/fav/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="{P}img/fav/favicon-16x16.png" />
  <link rel="shortcut icon" href="{P}img/fav/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="{P}img/fav/apple-icon-180x180.png" />
  <meta name="theme-color" content="#07060c" />
</head>
```

**Canonical nav** (immediately after `<body>`, preceded by `<div class="grain" aria-hidden="true"></div><div class="glow" aria-hidden="true"></div>`):

```html
<header class="nav" id="top">
  <div class="wrap nav-inner">
    <a class="brand" href="{P}index.html" aria-label="TG6 home">
      <img src="{P}img/brand/tg6-wordmark.png" alt="TG6" height="34" width="67" />
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="{P}index.html">Shop</a>
      <a href="{P}about.html">About</a>
      <a href="{P}contact.html">Contact</a>
      <a href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">TG6·dev ↗</a>
    </nav>
    <span class="status-dot nav-status" aria-hidden="true">● ONLINE</span>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <a href="{P}index.html">Shop</a>
  <a href="{P}about.html">About</a>
  <a href="{P}contact.html">Contact</a>
  <a href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">TG6·dev ↗</a>
  <div class="socials">
    <a href="https://www.twitch.tv/teamglitch6" target="_blank" rel="noopener" aria-label="Twitch"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4 2 2 6v14h5v2h3l2-2h4l5-5V2H4Zm15 12-3 3h-5l-2 2v-2H5V4h14v10ZM13 7h2v5h-2V7Zm-5 0h2v5H8V7Z"/></svg></a>
    <a href="https://www.youtube.com/channel/UC7KaaAFaf3LXI2Xcl7P9Ilw" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg></a>
    <a href="https://www.kick.com/teamglitch" target="_blank" rel="noopener" aria-label="Kick"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 2h6v6l4-4h6l-6 6 6 6h-6l-4-4v6H3V2Z"/></svg></a>
  </div>
</div>
```

**Canonical footer** (end of `<body>`, before scripts):

```html
<footer class="footer">
  <div class="wrap footer-inner">
    <img src="{P}img/brand/tg6-wordmark.png" alt="TG6" height="28" width="55" />
    <nav class="footer-links" aria-label="Footer">
      <a href="{P}about.html">About</a>
      <a href="{P}faq.html">FAQ</a>
      <a href="{P}terms.html">Terms</a>
      <a href="{P}privacy.html">Privacy</a>
      <a href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">TG6·dev</a>
    </nav>
    <div class="socials"><!-- same 3 SVG links as mobile menu, copy verbatim --></div>
    <p class="mono footer-tag">// STREAM FROM ANYWHERE.</p>
    <p class="footer-copy">© 2026 TG6. All rights reserved.</p>
  </div>
</footer>
```

**Canonical scripts block** (root pages; product pages use `../js/...`):

```html
<script src="{P}js/main.js"></script>
```
(plus `{P}js/finder.js` + `{P}js/forms.js` only on index.html; `{P}js/forms.js` on contact/pre-orders if they have forms)

- [ ] **Step 1: Append shell CSS to `css/style.css`**

```css
/* ============ NAV ============ */
.nav { position: sticky; top: 0; z-index: 50; background: #07060cb3; backdrop-filter: blur(0px); transition: backdrop-filter .2s, background .2s; border-bottom: 1px solid transparent; }
.nav.scrolled { backdrop-filter: blur(14px); background: #07060ce6; border-bottom-color: var(--line); }
.nav-inner { display: flex; align-items: center; gap: 28px; padding-top: 14px; padding-bottom: 14px; }
.brand img { height: 34px; width: auto; }
.nav-links { display: flex; gap: 24px; margin-left: auto; }
.nav-links a { color: var(--body); font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }
.nav-links a:hover { color: var(--text); }
.nav-status { white-space: nowrap; }
.nav-toggle { display: none; background: none; border: 0; cursor: pointer; flex-direction: column; gap: 5px; padding: 6px; }
.nav-toggle span { width: 22px; height: 2px; background: var(--text); display: block; }
.mobile-menu { display: none; }
@media (max-width: 768px) {
  .nav-links, .nav-status { display: none; }
  .nav-toggle { display: flex; margin-left: auto; }
  .mobile-menu { display: none; position: fixed; inset: 0; top: 63px; z-index: 49; background: #07060cfa; padding: 36px 24px; flex-direction: column; gap: 22px; }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { color: var(--text); font-size: 20px; font-family: var(--font-display); }
  .mobile-menu .socials { display: flex; gap: 18px; margin-top: 12px; }
  .mobile-menu .socials a, .footer .socials a { color: var(--body); }
}

/* ============ FOOTER ============ */
.footer { border-top: 1px solid var(--line); padding: 56px 0 40px; margin-top: 96px; }
.footer-inner { display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
.footer-links { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
.footer-links a { color: var(--muted); font-size: 13px; }
.footer-links a:hover { color: var(--text); }
.footer .socials { display: flex; gap: 18px; }
.footer .socials a { color: var(--muted); } .footer .socials a:hover { color: var(--text); }
.footer-tag { font-size: 12px; color: var(--purple); letter-spacing: 2px; }
.footer-copy { font-size: 12px; color: var(--muted); }
```

- [ ] **Step 2: Create `js/main.js`** (complete file)

```js
/* TG6 main — nav, mobile menu, reveal, count-ups, sticky product bar */
(function () {
  "use strict";

  // Nav blur on scroll
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") toggle.click(); });
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !reduced && "IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Count-ups: <span data-count="12" data-prefix="" data-suffix="H">0</span>
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    var t0 = null, dur = 1200;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  // Sticky product bar (product pages): show after hero scrolls past
  var bar = document.querySelector(".sticky-bar");
  var heroSentinel = document.querySelector(".product-hero");
  if (bar && heroSentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("visible", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(heroSentinel);
  }
})();
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat(shell): shared nav/footer styles + main.js behaviors"
```

---

### Task 4: Homepage — `index.html` rebuild

**Files:**
- Replace entirely: `index.html`
- Append to: `css/style.css`

- [ ] **Step 1: Write new `index.html`** (complete file; `{P}` = empty prefix; head/nav/footer copied verbatim from Task 3 with `{TITLE}` = `TG6 | IRL Streaming Backpacks`, `{DESC}` = `IRL streaming backpacks built by a streamer. Metro, Roamer, Nomad — three tiers, city to off-grid. Pre-order open.`)

```html
<!DOCTYPE html>
<html lang="en">
<!-- head: Task 3 canonical -->
<body>
<div class="grain" aria-hidden="true"></div>
<div class="glow" aria-hidden="true"></div>
<!-- nav + mobile menu: Task 3 canonical -->

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <span class="kicker reveal">// BUILT FOR IRL STREAMERS</span>
        <h1 class="reveal glitch">Stream from <em>anywhere</em>.</h1>
        <div class="reveal"><a class="btn" href="#lineup">Find your tier ↓</a></div>
        <dl class="hero-stats mono reveal">
          <div><dt><span data-count="3" data-prefix="0">0</span></dt><dd>TIERS</dd></div>
          <div><dt>4K</dt><dd>UPLINK-READY</dd></div>
          <div><dt><span data-count="12" data-suffix="H">0</span></dt><dd>FIELD POWER</dd></div>
        </dl>
      </div>
      <div class="hero-art reveal" aria-hidden="true">
        <img src="img/in-stock/tg6-metro.png" alt="" loading="eager" />
      </div>
    </div>
  </section>

  <!-- LINEUP + SIGNAL CHECK -->
  <section class="section lineup" id="lineup">
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track mono">
        <span>CITY ✦ BACKCOUNTRY ✦ OFF-GRID ✦ BONDED UPLINK ✦ HOT-SWAP POWER ✦ PRE-ORDER OPEN ✦&nbsp;</span>
        <span>CITY ✦ BACKCOUNTRY ✦ OFF-GRID ✦ BONDED UPLINK ✦ HOT-SWAP POWER ✦ PRE-ORDER OPEN ✦&nbsp;</span>
      </div>
    </div>
    <div class="wrap" id="shop">
      <span class="kicker reveal">// SIGNAL CHECK · WHERE DO YOU STREAM?</span>
      <div class="finder-tiles reveal" role="group" aria-label="Pick where you stream">
        <button type="button" class="finder-tile" data-tier="city">CITY</button>
        <button type="button" class="finder-tile" data-tier="backcountry">BACKCOUNTRY</button>
        <button type="button" class="finder-tile" data-tier="offgrid">OFF-GRID</button>
      </div>
      <p class="finder-line mono" aria-live="polite"></p>
      <div class="cards reveal">
        <img class="wolf-mark" src="img/brand/tg6-wolf.png" alt="" aria-hidden="true" />
        <a class="pcard" data-product="metro" href="products/metro.html">
          <span class="mono tier-label" style="color:var(--cyan)">TIER_01 · CITY</span>
          <img src="img/in-stock/tg6-metro.png" alt="TG6 Metro streaming backpack" loading="lazy" />
          <span class="pcard-name">Metro</span>
          <span class="pcard-row"><span class="pcard-price">$2,100</span><span class="badge-pre">◆ PRE-ORDER</span></span>
        </a>
        <a class="pcard" data-product="roamer" href="products/roamer.html">
          <span class="mono tier-label" style="color:var(--purple)">TIER_02 · BACKCOUNTRY</span>
          <img src="img/pre-orders/tg6-roamer.png" alt="TG6 Roamer streaming backpack" loading="lazy" />
          <span class="pcard-name">Roamer</span>
          <span class="pcard-row"><span class="pcard-price">$5,000</span><span class="badge-pre">◆ PRE-ORDER</span></span>
        </a>
        <a class="pcard" data-product="nomad" href="products/nomad.html">
          <span class="mono tier-label" style="color:var(--magenta)">TIER_03 · OFF-GRID</span>
          <img src="img/pre-orders/tg6-nomad.png" alt="TG6 Nomad streaming backpack" loading="lazy" />
          <span class="pcard-name">Nomad</span>
          <span class="pcard-row"><span class="pcard-price">$3,000</span><span class="badge-pre">◆ PRE-ORDER</span></span>
        </a>
      </div>
    </div>
  </section>

  <div class="scanline" aria-hidden="true"></div>

  <!-- TG6·dev BAND -->
  <section class="section devband">
    <div class="wrap devband-inner reveal">
      <p class="devband-line">Need a website, not a backpack?</p>
      <a class="btn btn-dev" href="https://glitch6-dev.github.io/DigitalServices/" target="_blank" rel="noopener">Explore TG6·dev ↗</a>
    </div>
  </section>

  <div class="scanline" aria-hidden="true"></div>

  <!-- SUBSCRIBE -->
  <section class="section subscribe">
    <div class="wrap subscribe-inner reveal">
      <span class="kicker">// SUBSCRIBE</span>
      <h2>Subscribe to the community.</h2>
      <form id="subscribe-form" novalidate>
        <div class="sub-row">
          <label class="visually-hidden" for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="you@email.com" required />
          <button class="btn" type="submit">Subscribe</button>
        </div>
        <input type="text" id="sub-company" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <p id="form-status" class="mono" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>

<!-- footer: Task 3 canonical -->
<script src="js/main.js"></script>
<script src="js/finder.js"></script>
<script src="js/forms.js"></script>
</body>
</html>
```

- [ ] **Step 2: Append homepage CSS to `css/style.css`**

```css
/* ============ HERO ============ */
.hero { padding: 72px 0 64px; overflow: hidden; }
.hero-inner { display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: center; }
.hero h1 em { font-style: normal; color: var(--purple); }
.hero-copy .btn { margin-top: 8px; }
.hero-stats { display: flex; gap: 36px; margin-top: 40px; }
.hero-stats dt { font-size: 22px; color: var(--cyan); }
.hero-stats dd { font-size: 11px; color: var(--muted); letter-spacing: 2px; }
.hero-art { position: relative; }
.hero-art::before {
  content: ""; position: absolute; inset: -10% -16%;
  background: url("img/brand/tg6-circuit.jpg") center/cover; opacity: .28; border-radius: 18px;
  -webkit-mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
          mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
}
.hero-art img { position: relative; filter: drop-shadow(0 18px 48px #a855f733); }
@media (max-width: 860px) { .hero-inner { grid-template-columns: 1fr; } .hero-art { order: -1; max-width: 320px; margin: 0 auto; } }

/* ============ MARQUEE ============ */
.marquee { overflow: hidden; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 10px 0; margin-bottom: 56px; }
.marquee-track { display: flex; white-space: nowrap; animation: marquee 28s linear infinite; color: var(--purple); font-size: 13px; letter-spacing: 2px; }
.marquee:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }

/* ============ FINDER (Signal Check) ============ */
.finder-tiles { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.finder-tile {
  font-family: var(--font-mono); font-size: 13px; letter-spacing: 2px; cursor: pointer;
  padding: 12px 22px; border-radius: 5px; background: none; color: var(--body);
  border: 1px solid #475569; transition: border-color .15s, color .15s;
}
.finder-tile:hover { border-color: var(--cyan); color: var(--text); }
.finder-tile.is-active { border-color: var(--cyan); color: var(--cyan); }
.finder-line { min-height: 24px; font-size: 13px; color: var(--green); margin-bottom: 28px; }
.finder-line .caret { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* ============ LINEUP CARDS ============ */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; position: relative; }
.wolf-mark { position: absolute; right: -30px; top: -90px; height: 200px; opacity: .12; pointer-events: none; z-index: 0; }
.pcard {
  position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 20px;
  transition: transform .18s, border-color .18s, box-shadow .18s;
}
.pcard:hover { transform: translateY(-4px); border-color: var(--purple); box-shadow: 0 10px 34px #a855f722; }
.pcard.is-rec { border-color: var(--cyan); box-shadow: 0 0 0 1px var(--cyan), 0 10px 40px #22d3ee2c; }
.lineup.has-pick .pcard:not(.is-rec) { opacity: .45; }
.tier-label { font-size: 11px; letter-spacing: 1.5px; }
.pcard img { margin: 6px auto; max-height: 230px; object-fit: contain; }
.pcard-name { font-family: var(--font-display); font-size: 20px; color: var(--text); }
.pcard-row { display: flex; justify-content: space-between; align-items: baseline; }
.pcard-price { font-family: var(--font-mono); font-size: 16px; color: var(--text); }
@media (max-width: 860px) { .cards { grid-template-columns: 1fr; } .wolf-mark { right: 0; } }

/* ============ DEVBAND ============ */
.devband { padding: 64px 0; }
.devband-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.devband-line { font-family: var(--font-display); font-size: clamp(1.2rem, 2.6vw, 1.7rem); color: var(--text); }
.btn-dev { background: linear-gradient(90deg, #16a34a, #a3e635); }

/* ============ SUBSCRIBE ============ */
.subscribe-inner { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sub-row { display: flex; gap: 10px; width: min(440px, 100%); margin-top: 16px; }
.sub-row input {
  flex: 1; background: var(--panel); border: 1px solid var(--line); border-radius: 5px;
  color: var(--text); padding: 13px 16px; font-family: var(--font-body); font-size: 15px;
}
.sub-row input::placeholder { color: var(--muted); }
.hp { display: none; }
#form-status { font-size: 13px; min-height: 20px; color: var(--green); }
#form-status.err { color: #f87171; }
.visually-hidden { position: absolute; width: 1px; height: 1px; clip-path: inset(50%); overflow: hidden; }
@media (max-width: 520px) { .sub-row { flex-direction: column; } }
```

- [ ] **Step 3: Verify in browser (Playwright MCP)**

```
Run: python3 -m http.server 8080  (background, repo root)
Playwright: browser_navigate http://localhost:8080/ → browser_console_messages (expect: no errors;
finder.js/forms.js don't exist yet — 404s for those two scripts are EXPECTED at this task)
browser_take_screenshot at 1440px and 390px — check against spec §5: hero, marquee, 3 cards, devband, subscribe, footer.
```

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat(home): rebuild homepage — hero, lineup+signal-check, devband, subscribe"
```

---

### Task 5: `js/finder.js` — Signal Check rewrite

**Files:**
- Replace entirely: `js/finder.js`

- [ ] **Step 1: Write new `js/finder.js`** (complete file — keeps current tier logic/blurbs, adds typed diagnostic line; self-initializing, no `initFinder()` call needed)

```js
/* TG6 Signal Check — tier picker types a diagnostic line and spotlights the matching card */
(function () {
  "use strict";
  var TIERS = {
    city:        { product: "metro",  line: "> MATCH: TG6_METRO · T-MOBILE 5G · $2,100 · PRE-ORDER" },
    backcountry: { product: "roamer", line: "> MATCH: TG6_ROAMER · DUAL-SIM BONDED · $5,000 · PRE-ORDER" },
    offgrid:     { product: "nomad",  line: "> MATCH: TG6_NOMAD · STARLINK ROAM · $3,000 · PRE-ORDER" }
  };
  var tiles = document.querySelectorAll(".finder-tile");
  var out = document.querySelector(".finder-line");
  var section = document.querySelector(".lineup");
  if (!tiles.length || !out || !section) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeTimer = null;

  function typeLine(text) {
    if (typeTimer) clearInterval(typeTimer);
    if (reduced) { out.textContent = text; return; }
    var i = 0;
    out.innerHTML = "";
    typeTimer = setInterval(function () {
      i++;
      out.innerHTML = text.slice(0, i).replace(/</g, "&lt;") + '<span class="caret">_</span>';
      if (i >= text.length) { clearInterval(typeTimer); typeTimer = null; }
    }, 14);
  }

  function clearPick() {
    section.classList.remove("has-pick");
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    out.textContent = "";
    tiles.forEach(function (t) { t.classList.remove("is-active"); });
    section.querySelectorAll("[data-product]").forEach(function (c) { c.classList.remove("is-rec"); });
  }

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      var tier = TIERS[tile.dataset.tier];
      if (!tier) return;
      tiles.forEach(function (t) { t.classList.remove("is-active"); });
      tile.classList.add("is-active");
      typeLine(tier.line);
      section.classList.add("has-pick");
      section.querySelectorAll("[data-product]").forEach(function (card) {
        card.classList.toggle("is-rec", card.dataset.product === tier.product);
      });
    });
  });

  // Outside click clears the pick (preserved behavior)
  document.addEventListener("click", function (e) {
    if (!section.classList.contains("has-pick")) return;
    if (e.target.closest(".finder-tile") || e.target.closest(".finder-line") || e.target.closest(".pcard.is-rec")) return;
    clearPick();
  });
})();
```

- [ ] **Step 2: Verify with Playwright**

```
browser_navigate http://localhost:8080/
browser_click on "CITY" tile → browser_snapshot: .finder-line contains "TG6_METRO", metro card has class is-rec
browser_click on page background → snapshot: line empty, no is-rec
Console: no errors (forms.js 404 still expected)
```

- [ ] **Step 3: Commit**

```bash
git add js/finder.js
git commit -m "feat(finder): signal-check rewrite — typed diagnostic + card spotlight"
```

---

### Task 6: `js/forms.js` — subscribe (and contact) submission

**Files:**
- Create: `js/forms.js`
- Delete (superseded): `js/script.js`, `js/icons.js`, `js/hotspots.js`

- [ ] **Step 1: Write `js/forms.js`** (complete file — same endpoint contract as the old inline script)

```js
/* TG6 forms — posts to Apps Script endpoint (opaque no-cors response, optimistic success) */
(function () {
  "use strict";
  window.TG6_FORMS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwykb0OnOAnyIWFHjm8ZpRj0Pc0ZQlBvnes2K-SPMqwVQlO0bq9mzghWsUa_J2nFsqd-g/exec";

  var form = document.getElementById("subscribe-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var emailEl = document.getElementById("email");
  var honeypot = document.getElementById("sub-company");
  var btn = form.querySelector("button[type='submit']");

  function setBusy(busy) {
    btn.disabled = busy;
    btn.textContent = busy ? "Subscribing..." : "Subscribe";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = emailEl.value.trim();
    if (!email || !/.+@.+\..+/.test(email)) {
      status.classList.add("err");
      status.textContent = "> INVALID EMAIL. TRY AGAIN.";
      return;
    }
    setBusy(true);
    status.classList.remove("err");
    status.textContent = "";
    fetch(window.TG6_FORMS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        formType: "subscribe",
        email: email,
        page: location.pathname,
        company: honeypot ? honeypot.value : ""
      })
    }).then(function () {
      status.textContent = "> SUBSCRIBED. WE'LL PING YOU WHEN IT DROPS.";
      form.reset();
    }).catch(function () {
      status.classList.add("err");
      status.textContent = "> TRANSMISSION FAILED. TRY AGAIN.";
    }).finally(function () { setBusy(false); });
  });
})();
```

- [ ] **Step 2: Delete superseded JS**

```bash
git rm js/script.js js/icons.js js/hotspots.js
```

- [ ] **Step 3: Verify with Playwright**

```
browser_navigate http://localhost:8080/
Fill #email with "bad" → submit → status shows "> INVALID EMAIL. TRY AGAIN." in red
Fill #email with "test@example.com" → submit → browser_network_requests shows POST to script.google.com;
status shows "> SUBSCRIBED..." — console clean (no 404s remain on index)
```

- [ ] **Step 4: Commit**

```bash
git add js/forms.js
git commit -m "feat(forms): extract subscribe handler; drop template scripts"
```

---

### Task 7: Product page CSS + `products/metro.html`

**Files:**
- Replace entirely: `products/metro.html`
- Append to: `css/style.css`

- [ ] **Step 1: Append product CSS to `css/style.css`**

```css
/* ============ PRODUCT PAGES ============ */
.product-hero { padding: 64px 0 56px; overflow: hidden; }
.product-hero-inner { display: grid; grid-template-columns: 1.05fr .95fr; gap: 44px; align-items: center; }
.product-hero h1 { font-size: clamp(2.6rem, 6vw, 4rem); }
.product-hero h1 .dot { color: var(--cyan); }
.price-row { display: flex; align-items: baseline; gap: 16px; font-family: var(--font-mono); margin: 10px 0 4px; }
.price-row .price { font-size: 24px; color: var(--text); }
.hero-specs { display: flex; gap: 22px; flex-wrap: wrap; margin: 14px 0 24px; font-family: var(--font-mono); font-size: 12px; color: var(--green); letter-spacing: 1px; }
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
.product-art { position: relative; }
.product-art::before {
  content: ""; position: absolute; inset: -12% -18%;
  background: url("../img/brand/tg6-circuit.jpg") center/cover; opacity: .26; border-radius: 18px;
  -webkit-mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
          mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
}
.product-art img { position: relative; filter: drop-shadow(0 18px 48px #a855f733); }
@media (max-width: 860px) { .product-hero-inner { grid-template-columns: 1fr; } .product-art { max-width: 320px; margin: 0 auto; order: -1; } }

/* Sticky bar */
.sticky-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; transform: translateY(110%);
  transition: transform .25s ease; background: #0d0b16f2; backdrop-filter: blur(12px);
  border-top: 1px solid var(--line); padding: 10px 0;
}
.sticky-bar.visible { transform: none; }
.sticky-bar-inner { display: flex; align-items: center; gap: 18px; }
.sticky-bar .mono { color: var(--text); font-size: 13px; letter-spacing: 1px; }
.sticky-bar .btn { margin-left: auto; padding: 9px 20px; font-size: 13px; }

/* Loadout manifest */
.loadout { padding-top: 72px; }
.loadout-list { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 6px 22px; }
.load-row { display: flex; align-items: center; gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--line); }
.load-row:last-child { border-bottom: none; }
.load-row img, .load-tile { width: 58px; height: 58px; border-radius: 8px; background: #fff; object-fit: contain; flex: none; padding: 4px; }
.load-tile { background: var(--bg); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; padding: 10px; }
.load-name { color: var(--text); font-weight: 700; font-size: 15px; }
.load-name .badge-pre { font-size: 11px; margin-left: 8px; }
.load-role { font-size: 13px; color: var(--body); }
.load-spec { margin-left: auto; text-align: right; font-family: var(--font-mono); font-size: 11px; color: var(--green); letter-spacing: 1px; flex: none; }
.load-bar { height: 4px; border-radius: 2px; background: var(--grad); margin-top: 6px; margin-left: auto; transform-origin: right; transform: scaleX(0); transition: transform .9s ease .15s; }
.load-row.in .load-bar { transform: none; }
.load-note { font-size: 13px; color: var(--muted); margin-top: 14px; }
.load-credit { font-size: 11px; color: var(--muted); margin-top: 6px; }
.load-credit a { color: var(--muted); text-decoration: underline; }
@media (max-width: 640px) {
  .load-spec { display: none; }
  .load-row { gap: 14px; }
}

/* Tier switch */
.tier-switch { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.tier-item { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; display: flex; flex-direction: column; gap: 4px; transition: border-color .15s, transform .15s; }
a.tier-item:hover { border-color: var(--purple); transform: translateY(-2px); }
.tier-item.current { border-color: var(--cyan); }
.tier-item .name { font-family: var(--font-display); color: var(--text); font-size: 17px; }
@media (max-width: 640px) { .tier-switch { grid-template-columns: 1fr; } }

/* Closing CTA */
.closing-cta { text-align: center; padding-bottom: 40px; }
.closing-cta h2 { margin-bottom: 22px; }
```

- [ ] **Step 2: Add loadout reveal to `js/main.js`** (append inside the IIFE, after the reveal block)

```js
  // Loadout rows: stagger-reveal + bar animation
  var rows = document.querySelectorAll(".load-row");
  if (rows.length && !reduced && "IntersectionObserver" in window) {
    var lo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); lo.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    rows.forEach(function (r, i) {
      r.classList.add("reveal");
      r.style.transitionDelay = (i * 60) + "ms";
      lo.observe(r);
    });
  } else {
    rows.forEach(function (r) { r.classList.add("in", "reveal"); });
  }
```

- [ ] **Step 3: Write new `products/metro.html`** (complete file; `{P}` = `../`; title `TG6 Metro | IRL Streaming Backpack`, desc `TG6 Metro — city-tier IRL streaming backpack. T-Mobile 5G, Sony ZV-1 II, 4K capture. $2,100, pre-order.`)

```html
<!DOCTYPE html>
<html lang="en">
<!-- head: Task 3 canonical with ../ prefix -->
<body>
<div class="grain" aria-hidden="true"></div>
<div class="glow" aria-hidden="true"></div>
<!-- nav + mobile menu: Task 3 canonical with ../ prefix -->

<main>
  <!-- 02 PRODUCT HERO -->
  <section class="product-hero">
    <div class="wrap product-hero-inner">
      <div>
        <span class="kicker reveal">// TIER_01 · CITY · TG6_METRO</span>
        <h1 class="reveal glitch">Metro<span class="dot">.</span></h1>
        <p class="price-row reveal"><span class="price">$2,100</span><span class="badge-pre">◆ PRE-ORDER</span></p>
        <div class="hero-specs reveal"><span>T-MOBILE 5G</span><span>1080p60 OUT</span><span>4K30 REC</span></div>
        <div class="cta-row reveal">
          <!-- SANDBOX test link — swap to live before launch -->
          <a class="btn" href="https://buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800" target="_blank" rel="noopener">Pre-order Metro →</a>
          <a class="btn btn-ghost" href="#tiers">Compare tiers</a>
        </div>
      </div>
      <div class="product-art reveal" aria-hidden="true">
        <img src="../img/in-stock/tg6-metro.png" alt="" loading="eager" />
      </div>
    </div>
  </section>

  <!-- STICKY BAR -->
  <div class="sticky-bar" aria-hidden="true">
    <div class="wrap sticky-bar-inner">
      <span class="mono">METRO · $2,100</span>
      <a class="btn" href="https://buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800" target="_blank" rel="noopener">Pre-order</a>
    </div>
  </div>

  <div class="scanline" aria-hidden="true"></div>

  <!-- 03 LOADOUT MANIFEST -->
  <section class="section loadout">
    <div class="wrap">
      <span class="kicker">// LOADOUT · 8 COMPONENTS · ALL INCLUDED</span>
      <div class="loadout-list">
        <div class="load-row">
          <img src="../img/gear/tmobile-5g-gateway.png" alt="T-Mobile 5G Home Internet gateway" loading="lazy" width="58" height="58" />
          <div><div class="load-name">T-Mobile 5G Gateway</div><div class="load-role">Uplink · plug in and stream</div></div>
          <div class="load-spec">5G UC<div class="load-bar" style="width:86px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/sony-zv1-ii.jpg" alt="Sony ZV-1 II compact 4K camera" loading="lazy" width="58" height="58" />
          <div><div class="load-name">Sony ZV-1 II</div><div class="load-role">Camera · clean HDMI, flip screen</div></div>
          <div class="load-spec">4K30 · 20MP<div class="load-bar" style="width:70px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/elgato-cam-link-4k.jpg" alt="Elgato Cam Link 4K capture device" loading="lazy" width="58" height="58" />
          <div><div class="load-name">Elgato Cam Link 4K</div><div class="load-role">Capture · HDMI → USB for OBS</div></div>
          <div class="load-spec">4K PASSTHRU<div class="load-bar" style="width:78px"></div></div>
        </div>
        <div class="load-row">
          <span class="load-tile"><img src="../img/brand/tg6-wordmark.png" alt="" /></span>
          <div><div class="load-name">TG6 Shoulder Mount</div><div class="load-role">3D-printed in-house · camera pops off tool-free</div></div>
          <div class="load-spec">IN-HOUSE<div class="load-bar" style="width:60px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/dji-mic-mini.png" alt="DJI Mic Mini wireless microphone set" loading="lazy" width="58" height="58" />
          <div><div class="load-name">Mic <span class="badge-pre">◆ YOUR PICK</span></div><div class="load-role">Boom mic or DJI Mic Mini ×2</div></div>
          <div class="load-spec">YOUR CALL<div class="load-bar" style="width:54px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/ulanzi-vl49-led.png" alt="RGB LED video light" loading="lazy" width="58" height="58" />
          <div><div class="load-name">LED Light <span class="badge-pre">◆ YOUR PICK</span></div><div class="load-role">Basic clip-on, mid RGB, or pro bi-color</div></div>
          <div class="load-spec">3 TIERS<div class="load-bar" style="width:48px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/np-f970-battery.jpg" alt="Sony NP-F970 battery pack" loading="lazy" width="58" height="58" />
          <div><div class="load-name">Hot-Swap Power</div><div class="load-role">NP-F970 packs · swap mid-stream, never go dark</div></div>
          <div class="load-spec">12H FIELD<div class="load-bar" style="width:92px"></div></div>
        </div>
        <div class="load-row">
          <img src="../img/gear/sandisk-high-endurance.png" alt="High-endurance microSD card" loading="lazy" width="58" height="58" />
          <div><div class="load-name">High-Endurance SD</div><div class="load-role">Rated for continuous 4K recording</div></div>
          <div class="load-spec">4K RATED<div class="load-bar" style="width:66px"></div></div>
        </div>
      </div>
      <p class="load-note">Flat price — your picks don't change what you pay. Choose at checkout. Phone USB tether included as signal fallback.</p>
      <p class="load-credit">Camera photo: <a href="https://commons.wikimedia.org/wiki/File:Sony_ZV-1_II_by_Henry_S%C3%B6derlund.jpg" target="_blank" rel="noopener">Henry Söderlund</a> (CC BY 2.0).</p>
    </div>
  </section>

  <!-- 04 TIER SWITCH -->
  <section class="section" id="tiers">
    <div class="wrap">
      <div class="tier-switch reveal">
        <div class="tier-item current">
          <span class="mono" style="color:var(--cyan);font-size:11px">TIER_01 · CITY</span>
          <span class="name">Metro</span>
          <span class="status-dot">● VIEWING</span>
        </div>
        <a class="tier-item" href="roamer.html">
          <span class="mono" style="color:var(--purple);font-size:11px">TIER_02 · BACKCOUNTRY</span>
          <span class="name">Roamer</span>
          <span class="mono" style="color:var(--muted);font-size:12px">$5,000 →</span>
        </a>
        <a class="tier-item" href="nomad.html">
          <span class="mono" style="color:var(--magenta);font-size:11px">TIER_03 · OFF-GRID</span>
          <span class="name">Nomad</span>
          <span class="mono" style="color:var(--muted);font-size:12px">$3,000 →</span>
        </a>
      </div>
    </div>
  </section>

  <!-- 05 CLOSING CTA -->
  <section class="section closing-cta">
    <div class="wrap reveal">
      <span class="kicker">// PRE-ORDER</span>
      <h2>Built when you order.</h2>
      <a class="btn" href="https://buy.stripe.com/test_bJe9AT2lzeYSesqfAU04800" target="_blank" rel="noopener">Pre-order Metro →</a>
    </div>
  </section>
</main>

<!-- footer: Task 3 canonical with ../ prefix -->
<script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify with Playwright**

```
browser_navigate http://localhost:8080/products/metro.html
- console: no errors, no 404s
- snapshot: kicker TIER_01, $2,100, ◆ PRE-ORDER, 8 load-rows, tier switch shows Roamer/Nomad links, closing CTA
- scroll down → sticky bar appears with "METRO · $2,100"; scroll to top → disappears
- 390px viewport: rows readable, spec column hidden, sticky bar fits
```

- [ ] **Step 5: Commit**

```bash
git add css/style.css js/main.js products/metro.html
git commit -m "feat(product): metro rebuilt — hero, loadout manifest, tier switch, closing CTA"
```

---

### Task 8: `products/roamer.html` + `products/nomad.html`

**Files:**
- Replace entirely: `products/roamer.html`, `products/nomad.html`

- [ ] **Step 1: Copy metro.html as the template for both, then apply the per-product substitutions from the Canonical data table.** For each file change ONLY:
  1. `<title>` / meta description (`TG6 Roamer | IRL Streaming Backpack` / `TG6 Nomad | IRL Streaming Backpack`; desc per tier)
  2. Hero kicker, h1 name, price, hero mono specs, hero image, both Stripe links, sticky-bar label
  3. Loadout row 1 (uplink row — Roamer gets Peplink + extra role text "T-Mobile + Verizon bonded, seamless failover", spec `DUAL-SIM`; Nomad gets Starlink Mini, role "works where there is no cell at all", spec `GLOBAL ROAM`)
  4. Tier switch: mark own tier `current` with `● VIEWING`, other two become links (Metro link: `metro.html`, `$2,100 →`)
  5. Closing CTA button text ("Pre-order Roamer →" / "Pre-order Nomad →")
  6. h1 dot color: Roamer `style="color:var(--purple)"` on `.dot`, Nomad `style="color:var(--magenta)"`; hero kicker text per table

Rows 2–8 of the loadout are IDENTICAL to metro.html — copy verbatim.

- [ ] **Step 2: Verify with Playwright**

```
browser_navigate http://localhost:8080/products/roamer.html → snapshot: TIER_02, $5,000, Peplink row, no console errors
browser_navigate http://localhost:8080/products/nomad.html → snapshot: TIER_03, $3,000, Starlink row, no console errors
Click tier-switch links on each page → land on correct sibling pages
```

- [ ] **Step 3: Commit**

```bash
git add products/roamer.html products/nomad.html
git commit -m "feat(product): roamer + nomad on shared template"
```

---

### Task 9: Secondary pages — about, contact, pre-orders

**Files:**
- Replace entirely: `about.html`, `contact.html`, `pre-orders.html`

Process for each: new shell (Task 3 head/nav/footer, `{P}` empty), one `.section` with `wrap`, kicker + h2 + the page's existing content restyled minimally. **Read the current page first and carry over its real copy and any form markup/IDs** — forms must keep their existing field names/IDs and POST through `js/forms.js`'s endpoint contract (if the current contact page posts `formType: "contact"`, keep that; extend forms.js with a `contact-form` handler mirroring the subscribe handler if the page has one).

- [ ] **Step 1: Rebuild `about.html`** — kicker `// ABOUT`, existing about copy condensed (less-is-more: max 2 short paragraphs), no new sections.
- [ ] **Step 2: Rebuild `contact.html`** — kicker `// CONTACT`, carry over existing form fields + IDs; submit handler in forms.js (duplicate subscribe pattern, `formType: "contact"`, success line `> MESSAGE SENT. WE'LL GET BACK TO YOU.`).
- [ ] **Step 3: Rebuild `pre-orders.html`** — kicker `// PRE-ORDER`, carry over its existing content/links restyled; all product links point at `products/*.html`.
- [ ] **Step 4: Verify with Playwright** — navigate all three; console clean; forms (if present) validate + post like Task 6.
- [ ] **Step 5: Commit**

```bash
git add about.html contact.html pre-orders.html
git commit -m "feat(pages): about, contact, pre-orders on new shell"
```

---

### Task 10: Utility shells — faq, terms, privacy, 404

**Files:**
- Modify: `faq.html`, `terms.html`, `privacy.html` (shell swap ONLY — keep all content markup)
- Replace entirely: `404.html`

- [ ] **Step 1: For faq/terms/privacy:** replace head/nav/footer with Task 3 canonical, wrap existing body content in `<main><section class="section"><div class="wrap"> ... </div></section></main>`, strip Bootstrap classes from the container only where they break layout (`container`, `row`, `col-*` → plain divs). Do NOT rewrite content.

- [ ] **Step 2: Write new `404.html`** (complete `<main>` — shell per Task 3):

```html
<main>
  <section class="section" style="text-align:center; padding-top:120px;">
    <div class="wrap">
      <img src="img/brand/tg6-wolf.png" alt="" style="max-height:260px; margin:0 auto 28px;" />
      <p class="kicker" style="color:var(--magenta)">// 404</p>
      <h1>&gt; SIGNAL LOST<span class="glitch">_</span></h1>
      <p style="margin:16px auto 28px;">This page is off-grid. Even the Nomad can't reach it.</p>
      <a class="btn" href="index.html">Back to base →</a>
    </div>
  </section>
</main>
```

- [ ] **Step 3: Verify** — navigate all four pages, console clean, content readable, wolf renders on 404.
- [ ] **Step 4: Commit**

```bash
git add faq.html terms.html privacy.html 404.html
git commit -m "feat(pages): utility shells + wolf 404"
```

---

### Task 11: Remove vendor libs + unlink legacy pages

**Files:**
- Delete: `vender/` (entire directory)
- Check: `inStock-pages/`, `pre-orders-pages/` stay but must not be referenced by any rebuilt page

- [ ] **Step 1: Confirm nothing rebuilt references vender/ or removed JS**

```bash
grep -rn "vender/\|script\.js\|icons\.js\|hotspots\.js\|bootstrap\|swiper\|remixicon" \
  index.html about.html contact.html pre-orders.html faq.html terms.html privacy.html 404.html products/*.html
# Expected: NO matches. inStock-pages/ and pre-orders-pages/ may still reference vender/ — that's allowed (legacy, unlinked).
```

If `inStock-pages/` or `pre-orders-pages/` files reference `vender/`, KEEP vender/ and instead note it in the final report — deleting it would break those legacy pages. Decision rule: `grep -rln "vender/" inStock-pages pre-orders-pages` → if matches exist, skip the deletion step and report; if no matches, delete.

- [ ] **Step 2: Delete (only if decision rule allows)**

```bash
git rm -r vender
```

- [ ] **Step 3: Verify whole site still loads** — Playwright: index + one product + one utility page, console clean.
- [ ] **Step 4: Commit**

```bash
git commit -m "chore: drop vendor libraries (bootstrap/jquery/swiper/remixicon)"
```

---

### Task 12: Full verification pass

- [ ] **Step 1: Page-by-page Playwright sweep at 390 / 768 / 1440 px:** index, metro, roamer, nomad, about, contact, pre-orders, faq, terms, privacy, 404. For each: screenshot, console messages (zero errors), no horizontal scroll at 390px.
- [ ] **Step 2: Functional checks:**
  - Finder: each tier types correct line + spotlights correct card; outside click clears
  - Subscribe: invalid → error; valid → POST fired + success line
  - Sticky bar on all 3 product pages
  - All internal links resolve (no 404s in network log while clicking through nav/footer/tier-switch)
  - Hero count-ups run once on scroll-into-view
- [ ] **Step 3: Reduced-motion pass:** Playwright `browser_run_code_unsafe` with `matchMedia` emulation or CDP `Emulation.setEmulatedMedia` → reload index + metro: no animations, content fully visible.
- [ ] **Step 4: Spec conformance read-through:** open `docs/superpowers/specs/2026-06-11-site-redevelopment-design.md` §5 and §6, check each numbered section exists with the exact approved copy ("Subscribe to the community.", "Built when you order.", `// PRE-ORDER` kicker, `◆ PRE-ORDER` badges everywhere, wolf only on homepage lineup + 404).
- [ ] **Step 5: Fix anything found, commit fixes**

```bash
git add -A && git commit -m "fix: verification pass corrections"
```

---

### Task 13: Wrap-up

- [ ] **Step 1: Summary commit log review** — `git log --oneline main..HEAD` reads as a coherent build sequence.
- [ ] **Step 2: Update memory** — mark `site-redevelopment-brief` as executed (note branch name, date, what shipped).
- [ ] **Step 3: Report to user** — branch name, screenshots of homepage + metro at desktop/mobile, list of decisions deferred (live Stripe links still sandbox; legacy `inStock-pages/`/`pre-orders-pages/` untouched; SVG vectors for merch still TBD). DO NOT push or merge — user reviews first.

---

## Self-review checklist (done at write time)

- **Spec coverage:** §3 architecture → Tasks 1–3, 6, 11; §4 design system → Task 2; §5 homepage → Tasks 4–6; §6 product pages → Tasks 7–8; §7 secondary → Tasks 9–10; §8 interactivity → Tasks 3, 5, 7; §9–10 error handling/a11y/perf → built into files + Task 12; §11 testing → Task 12; §12 execution notes → Tasks 1, 13. No gaps found.
- **Placeholder scan:** the only intentionally deferred content is real copy carry-over in Task 9 (source = existing pages, instruction explicit) — everything else has full code.
- **Type consistency:** class names cross-checked: `.load-row/.load-bar` (Task 7 CSS = Task 7 JS = Task 7/8 HTML), `.finder-tile/.finder-line/.is-rec/.has-pick` (Task 4 HTML = Task 4 CSS = Task 5 JS), `.sticky-bar/.product-hero` (Task 7 CSS/HTML = Task 3 main.js), `#subscribe-form/#email/#sub-company/#form-status` (Task 4 HTML = Task 6 JS). `data-count` attrs match main.js parser.
```
