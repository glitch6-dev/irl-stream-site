# TG6 Backpack Fulfillment Pipeline — Design Spec

**Date:** 2026-06-10
**Status:** Approved
**Scope:** Documents the order-to-delivery pipeline for the three IRL streaming backpacks (Metro, Roamer, Nomad) and the complete per-pack bill of materials, including components previously missing from all site copy and docs (LED light, microphone, SD cards, cables, encoder laptop, TG6 3D-printed mount). This spec is the single source of truth that later feeds (a) site-content updates and (b) procurement automation. It does not build either — see §5.

---

## 1. Business model constraints

- **Zero inventory.** Every component is purchased online per-order, after the customer pays. No stock is held at TG6.
- **One manufactured part.** The only thing TG6 makes in-house is the **3D-printed camera mount for the backpack's upper shoulder strap**. Everything else is off-the-shelf.
- **Service plans: TG6 activates, customer takes over.** Connectivity (T-Mobile / Verizon SIMs, Starlink) is a subscription, not a part. TG6 activates service to build and test the pack, then transfers the account(s) to the customer at handoff.

## 2. Pipeline stages

```
Customer pre-order (Stripe)
  └─> 2. Procurement  — buy all BOM items online per-order
        └─> 3. Receiving — parts arrive at TG6, checked against BOM
              └─> 4. Build — 3D-print mount, configure encoder, assemble
                    └─> 5. Test — per-tier checklist, live end-to-end
                          └─> 6. Ship — transfer service, ship, setup guide
```

### Stage 1 — Order intake
Customer pays through the Stripe pre-order payment link on the product page. Order appears in the Stripe dashboard.
**Launch blocker:** product pages currently use sandbox `test_` payment links (`products/*.html`, marked with `SANDBOX` comments); they must be swapped to live links before launch.

### Stage 2 — Procurement
A purchase checklist is generated from the ordered pack's BOM (§3): every line item, source link, order number, ETA. All items are bought online immediately after payment. **Manual for now** — this stage is the hook for future automation (§5).

### Stage 3 — Receiving
Components arrive at the TG6 location and are checked off against the BOM checklist. Missing/wrong items trigger reorders here, not at build time.

### Stage 4 — Build
- 3D-print the upper-shoulder camera mount and fit it to the backpack shell.
- Configure the Dell Latitude 7420 encoder: OBS + nginx-RTMP relay, output presets (1080p60 stream / 4K30 local record).
- Activate and configure the tier's connectivity (Metro: T-Mobile 5G gateway; Roamer: Peplink with both SIMs; Nomad: Starlink roam).
- Assemble all components into the pack with cable management.

### Stage 5 — Test
Per-pack checklist, run live end-to-end before anything ships:
- Stream to Twitch, YouTube, and Kick at 1080p60.
- 4K 30fps local recording to SD card.
- Battery hot-swap without dropping the stream.
- Light and microphone check on the live feed.
- Tier signature test — Metro: 5G gateway throughput; Roamer: pull one SIM mid-stream, confirm bonded failover holds; Nomad: Starlink uplink with cellular failover.

### Stage 6 — Ship & handoff
- Full charge, final pack-out.
- Transfer the activated service account(s) to the customer (per §1) — documented step-by-step in the setup guide.
- Ship with tracking; send the customer the setup guide and tracking number.

## 3. Bill of materials

### 3.1 Shared across all three packs

| Component | Role | Sourcing |
|---|---|---|
| Sony ZV-1 II | 4K 30fps camera, clean HDMI out | Per-order |
| Elgato Cam Link 4K | HDMI → USB capture | Per-order |
| Dell Latitude 7420 | Encoder laptop (OBS / nginx-RTMP) | Per-order |
| Clip-on LED video light | Low-light / night streaming | Per-order |
| Clip-on microphone (lavalier or compact shotgun) | Voice audio; exact model chosen at purchase time by availability | Per-order |
| High-endurance SD cards | 4K local recording (VODs/clips) | Per-order |
| USB hub, HDMI cable, chargers, cable management | Connective tissue | Per-order |
| Hot-swap battery packs | Mobile power | Per-order |
| Backpack shell | The bag | Per-order |
| **Upper-shoulder camera mount** | Camera mounting point on the strap | **TG6 3D-printed (in-house)** |

> The mount supersedes the "Shoulder strap camera mount (Ulanzi / SmallRig)" line currently on the Metro product page — site copy must change to the TG6 printed mount (§5).

### 3.2 Per-tier connectivity

| Pack | Hardware | Service (TG6-activated, transferred at handoff) |
|---|---|---|
| Metro | T-Mobile 5G home-internet gateway | T-Mobile plan |
| Roamer | Peplink MAX Transit Duo | T-Mobile SIM + Verizon SIM |
| Nomad | Starlink portable kit | Starlink roam plan |

## 4. Error handling

- **Component unavailable/back-ordered:** substitute an equivalent (same role, ≥ same spec) or notify the customer of the delay; the BOM lists roles, not immutable SKUs, for exactly this reason (camera, Cam Link, Peplink, and Starlink are exceptions — fixed models).
- **Test failure at Stage 5:** the pack does not ship; failing component is replaced via Stage 2 and the pack re-runs the full checklist.
- **Service transfer fails at handoff:** support the customer through carrier/Starlink account setup before closing the order.

## 5. Out of scope (recorded follow-ups)

1. **Site content update** — add the light, microphone, SD cards, and TG6 3D-printed mount to the "What's Inside" tables and hotspot data (`js/hotspots.js`) on all three product pages and the homepage; fix the Metro mount line. Needs its own small plan.
2. **Procurement automation** — Stripe webhook → auto-generated purchase checklist (Stage 2). Future project.
3. **Stripe live links** — swap `test_` payment links before launch.
4. **Setup guide** — the customer-facing document referenced in Stage 6 does not exist yet.
