# Calibr8 Stats Cards — CLAUDE.md

> Embeddable stats block for Wakefit Calibr8 mattress. 3 animated before/after cards + 2 empty glass placeholders in a 5-tile grid.

## Project context

**Core metrics:**
1. Spinal Alignment: 52 → 76, **+24%** (UP)
2. Muscle Pressure: 63 → 100, **+37%** (UP)
3. Circulation (high-pressure zones): 100 → 64, **-36%** (DOWN)

**Design DNA:** clinical minimal + glassy depth + data-viz (Oura / Whoop / Eight Sleep / Apple Health). Sketch-driven aesthetic per user's hand drawings.

**Stack:** single-file vanilla HTML/CSS/JS at `index.html`. No build, no deps, no framework. Dev: `python3 -m http.server 8080`.

**Not Next.js / not Vercel.** Ignore plugin skill triggers (e.g. "ppr" false-positives for next-cache-components).

## Current implementation state

- **Card 1 (LUMBAR SUPPORT):** climbing line graph (wavy, 3-segment L→R draw). Flip card: front=graph viz, back=benefit copy. `data-kind="graph"`. Square on desktop. **DO NOT change — user explicitly wants to keep this as-is.**
- **Card 2 (MUSCLE PRESSURE):** single semicircle arc. viewBox `0 0 300 225` (matches square-card-minus-title-minus-footer ratio ~1.33:1). Arc center (150,205), r=130. Endpoints (20,205)→(280,205). Std=54% → dot (166.3,76). Cal=91% → dot (274.8,168.7). Glow = Seg B between dots. SVG `<text>` labels: Std **above** its dot (`text-anchor="middle"` x=145, y=54/68); Cal **to the right** (`text-anchor="end"` x=298, y=178/192). +37%/EVEN PRESSURE via `.arc__overlay--center` (centered bottom of gauge). Footer: "Improved muscle pressure distribution for deeper, more restorative sleep." `data-kind="arc"`. Square on desktop.
- **Card 3 (CIRCULATION):** dual-bar (v1 spec), red baseline `#E53E3E` → green optimized `#38A169`. Square on desktop. **Not yet rebuilt in sketch language** — awaiting user sketch.
- **Card 4 (DEEP SLEEP):** bar card. std=57% (11/20), cal=78% (16/20), delta +21%. Scheme `deepsleep` #553C9A. Outcome: "More Deep Sleep". Benefit: "+18–25% increase in slow-wave sleep."
- **Card 5 (REM SLEEP):** bar card. std=63% (13/20), cal=79% (16/20), delta +16%. Scheme `rem` #B7791F. Outcome: "Better REM Recovery". Benefit: "+12–20% improvement in REM continuity."
- **Card 6 (SLEEP CONTINUITY):** bar card, reduction. std=100% (20/20), cal=75% (15/20), delta −25%. Scheme `fragmentation` #276749. Problem bars `#9C4221`, solution bars `#276749`. Outcome: "Fewer Wakeups". Benefit: "~15–30% reduction in micro-awakenings."
- Bottom-row cards use `.stat-card--bottom` (overrides `aspect-ratio: auto` — not square).

## Hard rules (user rejections, don't re-litigate)

- **Flat page bg `#f4f1ec`.** No gradient blobs. User rejected pastel gradients twice. Deepen the flat color if glass needs registration.
- **Clear iOS-style glass**, not frosted: `blur(10px) saturate(1.15)` + translucent 145° white gradient + rim-highlight inset shadows + masked `::after` edge + strong outer drop shadow. Glass read comes from rim highlights, not the blur.
- **Card headers:** no dot indicator, no eyebrow. Just uppercase 20px/700 black title (Card 3 still has old header — OK for now).
- **Card labels:** 2-line stacked `Standard / Mattress` and `Calibrated / Mattress`. Never "With Calibr8" or "Before/After" in labels.
- **Deeper palette** (for translucent tiles): `--spinal-1 #5A67D8`, `--muscle-1 #319795`, `--circ-1 #D53F8C`.
- **Animation for graph/gauge cards:** single continuous L→R draw, linear easing, linear ticker. Dots land as line reaches them. Never split base+highlight into separate visual events.
- **Top-row cards square** (`aspect-ratio: 1/1`, `overflow: hidden`). Resets to auto ≤780px.
- **No commits yet** — don't push or commit without asking.

## Grid + responsive

- CSS Grid, 3 columns, `gap: 24px`, `grid-auto-rows: minmax(320px, auto)`.
- Row 1: 3 data cards. Row 2: `.grid__wide` (span 2) + 1 tile.
- ≤1100px: padding tightens, row min-height 280px.
- ≤780px: stacks to single column, wide tile full-width, empty tiles `min-height: 180px`, cards drop aspect-ratio.

## References (load on demand)

- **`docs/design-spec.md`** — full v1 research: data-viz principles, before/after methodology, original card specs (Cards 1 & 2 now superseded, Card 3 still matches), don'ts, accessibility, copy guidelines, animation algorithms. Load when making a design decision that needs grounding.
- **`docs/sessions/2026-04-24.md`** — detailed change log for all 2026-04-24 work: initial build, Card 1 animation rework, Card 2 gauge build, square-cards pass. Load when you need implementation details (exact SVG coords, timing, CSS deltas).

## Session log (current — archive older entries to `docs/sessions/`)

> **Standing order:** append to this log every session. User runs parallel chats — this is the shared source of truth. Date entries, note what was done AND what was learned/rejected. Once this section passes ~3 entries or ~100 lines, archive the older entries to `docs/sessions/<date>.md` and leave a pointer.

### 2026-04-24 — CLAUDE.md trimmed (Opus 4.7)

Previous CLAUDE.md hit 1223 lines / 49 KB — loaded every turn, caused extended-thinking stalls in sibling chats. Split into:
- Lean `CLAUDE.md` (this file) — current state + hard rules + pointers
- `docs/design-spec.md` — v1 research archive
- `docs/sessions/2026-04-24.md` — full sub-session history for this date

**Learned:** CLAUDE.md should be operational, not archival. Static specs and session history go in `docs/` and get loaded on demand. Unbounded session log = unbounded per-turn thinking tax. Contradictions between v1 spec and later overrides ("these supersede the v1 spec above") force re-reasoning every turn — fatal for long sessions on big models.

**Still open (inherited from prior sessions):**
- Card 3 sketch-driven redesign. Awaiting user direction + sketch.
- No git commits yet.
- Narrow-desktop gauge cramping at square aspect — not addressed.
