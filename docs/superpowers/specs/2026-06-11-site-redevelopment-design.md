# TG6 irl-stream-site — Full Redevelopment Design

**Date:** 2026-06-11
**Status:** Approved pending final user review
**Execution:** Overnight session starting ~2:30am 2026-06-12 (autonomous)
**Benchmark:** YFE project (`~/Projects/Dvelopr/YFE`, live at neverending-ar.com) — match its craft level; do not copy its look.

## 1. Goal

Replace the Bootstrap shop template with a hand-crafted site that carries the new TG6 brand identity, reads instantly, and feels interactive without being busy. Design philosophy (user's words): **"less is more in art — people don't like to read, they like to see logos and content."** Every section earns its place visually; copy is one line wherever possible.

## 2. Decisions Made (with user, 2026-06-11)

| Decision | Choice |
|---|---|
| Rebuild depth | Full hand-crafted rebuild — delete `vender/` (Bootstrap, jQuery, Swiper, Remixicon); custom HTML/CSS/JS only |
| Design direction | **Glitch Editorial + telemetry details** — YFE's structural craft, TG6 glitch skin, mission-control accents |
| Sitemap | Keep all existing pages; minimal investment in faq/terms/privacy/404 (new shell only) |
| Features kept | Subscribe form (same Apps Script endpoint), backpack finder (reskinned as "Signal Check"), TG6·dev cross-promo band |
| Features dropped | Product hotspot panels (replaced by Loadout Manifest), homepage story section, image-swap product cards |
| Product status | **Pre-order only, everywhere.** No in-stock/in-development split. `inStock-pages/` and `img/in-stock/` stay in repo but unlinked |
| Numbers shown | **Product specs only** — verifiable hardware truth (battery hours, uplink, resolutions, prices). No audience/stream-count claims |
| Gear presentation | **Loadout Manifest** — telemetry rows with real `img/gear/` photos, animated spec bars |

## 3. Architecture

```
irl-stream-site/
├── index.html                       rebuilt — 6-section long scroll
├── products/{metro,roamer,nomad}.html  rebuilt — one shared template
├── about.html, contact.html, pre-orders.html   rebuilt, minimal
├── products.html, discover.html     redirect stubs to index.html — keep as-is
├── faq.html, terms.html, privacy.html, 404.html               new shell, content as-is
├── css/style.css                    single new stylesheet (tokens + sections)
├── js/main.js                       nav, reveal-on-scroll, count-ups, sticky bar, glitch tick
├── js/finder.js                     Signal Check (rewrite of current finder logic)
├── js/forms.js                      subscribe form — Apps Script endpoint & honeypot unchanged
├── img/brand/                       tg6-wordmark-primary.png, tg6-logo-secondary-wolf.png,
│                                    tg6-wordmark-primary.jpeg (circuit backdrop) — copied from Marketing/brands
├── img/gear/                        existing gear photos (already in repo, uncommitted)
└── apps-script/                     untouched
```

- No build step, no frameworks, no CDN dependencies except Google Fonts.
- All URLs/filenames preserved — no broken links or bookmarks.
- `vender/` directory deleted; remix icons replaced by inline SVG (YFE pattern).
- 404 page: wolf mascot moment (`tg6-logo-secondary-wolf.png`) — its only solo appearance.

## 4. Design System

**Palette** (CSS custom properties):
- Base `#07060c` near-black; panels `#0d0b16`; borders `#1e1b2e`
- Signature gradient: purple `#a855f7` → cyan `#22d3ee`
- Glitch accent: magenta `#e879f9` — also the `◆ PRE-ORDER` badge color
- Telemetry green `#34d399` — reserved exclusively for status/live signals (nav `● ONLINE`, spec readouts)
- Text: white headings, `#94a3b8` body, `#64748b` muted

**Type:**
- Display: Archivo Black — headlines
- Body: Archivo — never below 16px, max ~70ch line length
- Mono: Space Mono — ALL telemetry: kickers (`// SECTION_NAME`), spec readouts, prices in badges, diagnostic lines

**Motifs:**
- Grain + glow fixed overlays (YFE technique, recolored to purple/cyan)
- Chromatic-aberration glitch: decorative headings only, one subtle tick every ~8s; never on body copy
- Scanline divider between sections
- Count-up numbers on scroll-into-view
- `◆` diamond bullet for status badges; `//` mono kickers
- `prefers-reduced-motion`: all animation (reveals, count-ups, marquee, glitch) disabled

**Brand asset rules:**
- Wordmark PNG (transparent): nav + footer
- Wolf PNG (transparent): faint watermark behind homepage lineup cards (~12% opacity) + 404 page. Nowhere else — scarcity keeps it special
- Circuit-board JPEG (`tg6-wordmark-primary.jpeg`): masked/darkened hero backdrop material

## 5. Homepage (6 sections — approved v4)

1. **NAV** — sticky, blur-on-scroll. Wordmark left; SHOP · ABOUT · CONTACT · TG6·dev ↗; mono `● ONLINE` status dot. Socials live in mobile menu.
2. **HERO** — kicker `// BUILT FOR IRL STREAMERS`; headline "Stream from *anywhere*." (one line, no paragraph); one CTA "Find your tier ↓"; three mono count-up stats (`03 TIERS · 4K UPLINK-READY · 12H FIELD POWER`); circuit-board art + backpack render carry the visual weight.
3. **LINEUP + SIGNAL CHECK** (merged block) — marquee ticker runs as the section's top edge (pure CSS, pauses on hover). Tier buttons CITY / BACKCOUNTRY / OFF-GRID; selecting one types out a mono diagnostic (`> MATCH: TG6_METRO · T-MOBILE 5G · $2,100 · PRE-ORDER`) and glows the matching card. Three product cards: mono tier label (`TIER_01 · CITY` cyan / `TIER_02` purple / `TIER_03` magenta), name, price, uniform `◆ PRE-ORDER` magenta badge, big product photo, whole card clickable. Wolf watermark faint behind cards. Outside click clears highlight (preserve current finder behavior).
4. **TG6·dev BAND** — one line + one CTA → DigitalServices. Dark-green/lime accent scoped to the band (as today).
5. **SUBSCRIBE** — kicker `// SUBSCRIBE`; heading **"Subscribe to the community."**; email input + button. Same Apps Script endpoint, honeypot, optimistic success in mono: `> SUBSCRIBED. WE'LL PING YOU WHEN IT DROPS.`
6. **FOOTER** — wordmark, page links, Twitch/YouTube/Kick inline SVG icons, mono tagline `// STREAM FROM ANYWHERE.`

## 6. Product Page Template (6 sections — approved v4; ×3 pages)

1. **NAV** — same as home.
2. **PRODUCT HERO** — kicker `// TIER_01 · CITY · TG6_METRO`; name; price + `◆ PRE-ORDER`; three mono specs (Metro: `T-MOBILE 5G · 1080p60 OUT · 4K30 REC`); CTAs "Pre-order Metro →" (→ existing pre-order flow) + ghost "Compare tiers" (smooth-scrolls to Tier Switch section); large backpack render on circuit glow. Sticky mini-bar on scroll: `METRO · $2,100 · [Pre-order]`.
3. **LOADOUT MANIFEST** — kicker `// LOADOUT · N COMPONENTS · ALL INCLUDED`. One row per component: real photo (white tile), name, one-line role, mono spec + animated gradient bar; rows reveal on scroll. Customer-choice items inline-tagged `◆ YOUR PICK` magenta (mic, light, stabilizer — content from current BOM tables). Footnote: "Flat price — your picks don't change what you pay. Choose at checkout." This replaces both the hotspots and the separate checkout-options section.
4. **TIER SWITCH** — other two tiers as one-line cards (`TIER_02 Roamer $5,000 →`); current page marked `● VIEWING`. Replaces any compare table.
5. **CLOSING CTA** — kicker `// PRE-ORDER`; heading **"Built when you order."**; button "Pre-order Metro →". (Made-to-order message in four words — no dedicated story section.)
6. **FOOTER** — same as home.

Per-product content: Metro = T-Mobile 5G Gateway uplink; Roamer = Peplink MAX Transit Duo bonded; Nomad = Starlink Mini. Loadout rows sourced from the current product pages' What's-Inside tables + `img/gear/` photos (`SOURCES.md` documents image origins). Prices: Metro $2,100, Roamer $5,000, Nomad $3,000.

## 7. Secondary Pages

- **about / contact / pre-orders:** new shell + restyled content, minimal sections, same forms/endpoints where present.
- **products.html / discover.html:** meta-refresh redirect stubs to index — untouched.
- **faq / terms / privacy:** new nav + footer + typography pass only; content untouched.
- **404:** wolf mascot + mono `> SIGNAL LOST` + link home. Small, fun, on-brand.
- **inStock-pages/, pre-orders-pages/:** left in repo, not linked from new nav (pre-order-only decision). Pre-order CTAs route to the existing pre-order flow exactly as today.

## 8. Interactivity Inventory (all vanilla JS, ~300 lines total)

| Behavior | Trigger | Implementation |
|---|---|---|
| Reveal-on-scroll | sections/rows entering viewport | IntersectionObserver + CSS transitions |
| Count-up stats | hero stats entering viewport | rAF count animation, `data-count` attrs |
| Signal Check | tier button click | typed-out diagnostic line + card glow; outside click clears |
| Sticky product bar | scroll past hero | IntersectionObserver on hero sentinel |
| Marquee | always | pure CSS keyframes, `animation-play-state` on hover |
| Glitch tick | every ~8s on hero headline | CSS animation, decorative only |
| Nav blur | scroll > 0 | scroll listener toggling class |
| Subscribe form | submit | fetch to Apps Script (unchanged contract) |

All of it inert under `prefers-reduced-motion`. No layout shift from animations (transforms/opacity only).

## 9. Error Handling & Edge Cases

- Subscribe: client-side email regex, honeypot, busy-state button, optimistic success (no-cors opaque response — current behavior preserved), failure message in red.
- Missing JS: site fully readable and navigable without JS — animations and finder are progressive enhancement; product cards are plain links.
- Image fallbacks: gear photos have explicit width/height (no CLS); brand PNGs have alt text.
- Mobile: lineup cards stack; loadout rows keep photo+name, spec wraps below; sticky bar becomes bottom bar; social icons in hamburger menu.

## 10. Performance & Accessibility

- Zero framework payload; target < 200KB CSS+JS combined (vs ~400KB+ vendor today).
- Compress gear PNGs >300KB (sandisk, rode) to WebP/optimized PNG during build.
- Fonts: two families max, `display=swap`, preconnect.
- Semantic landmarks, focus-visible states on all interactive elements, AA contrast minimums (mono green/muted text checked against `#07060c`), `aria-live` on finder diagnostic + form status.

## 11. Testing / Verification

- Playwright MCP walkthrough of every page at 390px / 768px / 1440px: screenshots reviewed against this spec.
- Functional checks: finder selects + clears, subscribe posts (network request fired), all internal links resolve, no console errors, sticky bar appears/disappears.
- `prefers-reduced-motion` emulation pass.
- Lighthouse-style sanity: no CLS from animations, images sized.

## 12. Execution Notes (2:30am session)

- Work on a feature branch; commit per page/section; do not push until user reviews (ship skill routes to glitch6-dev).
- Copy brand PNGs/JPEG into `img/brand/` from `Marketing/brands/tg6/assets/` as first step.
- Commit the currently-uncommitted `img/gear/` assets as part of the rebuild.
- Existing uncommitted edits to `css/style.css` and `products/*.html` are superseded by this rebuild — the rebuild replaces those files wholesale.
- Memory files to consult: `site-redevelopment-brief`, `design-less-is-more`.
