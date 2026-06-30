# TG6 Limited Product Warranty — Design Spec

**Date:** 2026-06-30
**Repo:** irl-stream-site (the product / IRL-stream-backpack site)
**Status:** Approved in brainstorming, pending user spec review

## Purpose

A live backpack prospect asked what warranty TG6 offers. TG6 does not manufacture
the backpacks — it sources brand-name components individually after a client
pre-orders, then assembles and pre-configures each rig. The warranty must reflect
that reality honestly: TG6 warrants the work it controls (assembly + software
config), and passes through the component makers' own warranties while handling
claims for the client.

Scope of this spec: the **physical product** warranty only. The separate
TG6-dev digital-services warranty (30-day defect fix) is deferred and lives on a
different site (tg6-dev.com), not this repo.

## The product (from /products/ pages)

All three tiers ship a 9-component loadout; only the uplink differs.

| Component | Maker | Notes |
|---|---|---|
| ZV-1 II camera | Sony | 4K30, clean HDMI |
| Cam Link 4K capture | Elgato / Corsair | HDMI → USB |
| Latitude 7420 "encoding brain" | Dell | i7 / 32GB; OBS + NGINX + FFmpeg pre-configured by TG6 |
| Uplink: 5G Gateway / MAX Transit Duo / Starlink Mini | T-Mobile / Peplink / Starlink | varies by tier (Metro / Roamer / Nomad) |
| TG6 Shoulder Mount | **TG6 (in-house)** | 3D-printed in-house — fully TG6-warranted |
| Mic: Boom or DJI Mic Mini ×2 | supplier / DJI | buyer's pick |
| LED light | supplier | buyer's pick |
| Hot-Swap Power (NP-F970 packs) | supplier | |
| High-Endurance SD | supplier | 4K-rated |

## Warranty terms (canonical text source)

### A. TG6 Workmanship Warranty — what TG6 builds and configures

1. **Physical assembly — 90 days from delivery.** Stitching, wiring, fitment, and
   integration of the loadout into the pack, plus the in-house 3D-printed TG6
   Shoulder Mount. If a TG6 assembly defect appears within 90 days, TG6 repairs
   or replaces the affected part/unit at its option, free.
2. **Software & encoding config care — lifetime, for the original owner.** TG6
   ships the Dell Latitude 7420 with OBS, NGINX, FFmpeg, and the uplink/bonding
   profile pre-configured. If that TG6-delivered streaming stack stops working —
   OBS won't launch, encoding profile corrupts, NGINX/FFmpeg config lost, bonding
   profile wiped — TG6 will restore and re-configure it **at no charge for the
   life of the rig**, performed **remotely where possible**, or by return.
   - Boundary: config care covers restoring **TG6's original delivered
     configuration**. It does **not** cover net-new feature requests, OS
     reinstalls caused by user action, or third-party software the owner installs.

**Liability boundary (state explicitly):** Config care is about the
*configuration*, not the machine. If the laptop *hardware* itself fails, that is
covered by Dell's manufacturer warranty (pass-through, section B) — TG6 does not
replace the laptop under config care.

**Remedy:** repair, re-configure, or replace at TG6's option, free. If none is
feasible, TG6 refunds the affected portion.

### B. Component Pass-Through — the brand-name gear

Every unit ships with a **Build Sheet & Warranty Card** listing each component's
make/model, serial, manufacturer, and warranty reference. Each component is
covered by its **original manufacturer's warranty** (Sony, Dell, Elgato/Corsair,
DJI, Peplink, Starlink, etc.). TG6 does not replace that coverage — TG6 **manages
the claim for you**: one point of contact (TG6) identifies the part, locates the
maker's warranty, and handles the claim legwork on the owner's behalf.

### C. Exclusions

Not covered: normal wear and cosmetic aging; misuse, accidents, or overloading
beyond stated capacity; liquid/water damage (unless the unit is sold as rated);
unauthorized repairs or modifications; user-installed software or config changes
outside TG6's setup; and any component failure beyond the maker's own warranty
terms.

### D. General terms

- Coverage starts at **delivery** (not at pre-order).
- **Original purchaser only; non-transferable.**
- This warranty is **in addition to** the existing Returns/Refunds policy
  (14-day defect / 30-day change-of-mind) — a warranty is not a return.
- This is a **limited** warranty, not a guarantee against all damage.
- Claims: contact via the contact page within the applicable window, with order
  info and photos. Every unit's live-stream build/test VOD documents its
  condition at ship.

## Implementation (this repo)

### 1. `terms.html`
- Insert a new `<details class="qa">` clause **"6. Limited Warranty"** immediately
  after clause 5 (Returns and Refunds, line ~91).
- **Renumber** the existing clauses: 6 Intellectual Property → 7, 7 Limitation of
  Liability → 8, 8 Privacy → 9, 9 Governing Law → 10, 10 Changes → 11.
- Give the new clause an `id="warranty"` anchor so the FAQ can deep-link to it.
- Body covers sections A–D above, condensed to match the tone/length of the
  surrounding clauses (plain, confident, no legalese bloat).
- Update "Last updated" (line 71) to June 2026.

### 2. `faq.html`
- In the "Returns & Support" group (after line 112), add one new `<details class="qa">`:
  - **Q:** "Is the gear under warranty?"
  - **A:** Reassure: TG6 warrants its own assembly (90 days) and provides
    **lifetime config care** on the encoding/streaming software; every brand-name
    component (Sony, Dell, Elgato, DJI, Peplink, Starlink…) carries its own
    manufacturer warranty and **TG6 handles those claims for you** via the per-unit
    Build Sheet. Link "warranty" to `terms.html#warranty`.
- Optionally update the existing line-111 answer's "warranty policy" link to point
  at `terms.html#warranty` (anchor) instead of the bare `terms.html`.

### Out of scope
- No new standalone `warranty.html` page (a Terms clause + FAQ entry is the right
  weight).
- No TG6-dev digital-services warranty (deferred; different site).
- No legal review this round (user opted to skip).

## Acceptance

- `terms.html` shows clause 6 = Limited Warranty with all subsequent clauses
  renumbered correctly and no duplicate numbers; `id="warranty"` resolves.
- FAQ has a warranty Q that links to `terms.html#warranty`.
- Warranty text states: 90-day physical workmanship, lifetime remote config care
  with the hardware-vs-config boundary, component pass-through with concierge
  claims + Build Sheet, exclusions, and "original owner / non-transferable /
  in addition to returns."
- Tone and markup match existing `details.qa` clauses; pages render with no broken
  layout.
