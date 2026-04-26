# Design Process — Calibr8 Stats Cards

> How decisions get made. Not what was built — that's CLAUDE.md. This is the *why* and *how*.

---

## Philosophy

Three constraints drive every choice:

1. **Clinical trust** — feels like Oura / Whoop, not a marketing slide
2. **Instant comprehension** — story lands in under 3 seconds, no legend required
3. **Premium motion** — single continuous animation, no bounce, no chaos

When those three conflict, trust > comprehension > motion.

---

## How a card gets designed

### Step 1 — Establish the metric's story

Every card has one job: communicate a before/after delta so clearly the number is redundant.

- Identify if the metric is an *improvement up* (higher = better) or *reduction down* (lower = better)
- Pick a viz type that makes the direction obvious without labels:
  - **Line chart** — progress along a path (spinal alignment climbing)
  - **Gauge / arc** — score out of max (muscle pressure: where does the needle land?)
  - **Bar pair** — magnitude comparison (circulation zones, sleep stages)

### Step 2 — Sketch first, code second

Card 1 and Card 2 came from literal hand-drawn sketches by the user. The sketch defines:
- Visual metaphor (arc vs. bars vs. line)
- Rough proportions
- Where the "aha" moment lives (the delta label, the glow segment, the endpoint dot)

Code translates the sketch, not the other way around. If the math doesn't match the sketch proportions, adjust the `viewBox` to fit — not the sketch.

### Step 3 — Constrain to the card's bounding box

Top-row cards are `aspect-ratio: 1/1` (square). The viz must fit inside that square after the card title and footer claim their space. This dictates:
- Arc card: `viewBox 0 0 300 225` (roughly the title-stripped square height)
- Graph card: viewport-relative sizing with `overflow: hidden`

Never sacrifice the square for the viz. Adjust the viz.

### Step 4 — Animation as a single continuous event

Animation is not decoration. It *tells the story*:
- Baseline state appears first (where you start)
- The viz draws L→R or fills to the optimized value
- Dots / highlights land exactly when the drawing reaches them
- Delta counter ticks in sync with the draw

Rules:
- **Linear easing for synced draws** — ease-out looks like the counter "rushed ahead"
- **One rAF loop, one `t` variable** — all parts of the animation share a single progress value
- Never split the story into separate phases with gaps

### Step 5 — Glass card treatment

Cards sit on a flat `#f4f1ec` background. The glass effect needs contrast against that — achieved through:
- `backdrop-filter: blur(10px) saturate(1.15)` for depth, not frost
- 145° white translucent gradient (`rgba(255,255,255,0.45) → rgba(255,255,255,0.15)`)
- Inset rim-highlight shadows top-left (light source)
- Outer drop shadow with scheme color tint
- `::after` pseudo-element masked to card shape for edge shimmer

The blur alone doesn't make glass. The *rim highlights* make glass.

---

## Color system

Each card has a scheme color (its identity):

| Card | Metric | Scheme var | Hex |
|------|--------|-----------|-----|
| 1 | Lumbar Support | `--spinal-1` | `#5A67D8` |
| 2 | Muscle Pressure | `--muscle-1` | `#319795` |
| 3 | Circulation | `--circ-1` | `#D53F8C` |
| 4 | Deep Sleep | `--deepsleep` | `#553C9A` |
| 5 | REM Sleep | `--rem` | `#B7791F` |
| 6 | Sleep Continuity | `--fragmentation` | `#276749` |

Scheme color appears on: glow segments, active dots, delta labels, card drop shadow tint.

**Depth principle:** colors are intentionally deep (not pastel) so translucent glass tiles read against the warm background. Pastels wash out. Deep colors survive the opacity layer.

---

## Typography rules

- Card title: uppercase, 20px, 700, black — no eyebrow, no dot indicator
- Labels: 2-line stacked — "Standard / Mattress" and "Calibrated / Mattress" exactly
- Delta: large, scheme color, with sign (e.g. `+37%` or `−36%`)
- Footer benefit: 12–14px, muted, one sentence, outcome-focused

Max 3 font sizes per card. No vertical labels. Sans-serif throughout.

---

## Grid logic

```
[ Card 1 ] [ Card 2 ] [ Card 3 ]
[ Card 4 + 5 (span 2)  ] [ Card 6 ]
```

- 3 columns, `gap: 24px`
- Row 1: three equal squares
- Row 2: `.grid__wide` spans 2 columns, last tile spans 1
- ≤780px: single column, all cards drop `aspect-ratio`, stack naturally

---

## What we reject (and why)

| Rejected | Why |
|----------|-----|
| Pastel gradient blobs as bg | Competes with glass; rejected twice |
| "Before / After" as labels | Clinical tone requires neutral — "Standard / Calibrated" |
| "With Calibr8" label | Reads as ad copy, not data |
| Pie/donut for before-after | Incorrect chart type — pies show composition, not comparison |
| Bounce/overshoot easing | Not premium — feels playful |
| Separate base + highlight animation phases | Looks choppy; kills the single-draw story |
| Dot indicators / eyebrow text in header | Visual noise; header is just the metric name |

---

## Card 3 — pending redesign

Card 3 (Circulation) is the only top-row card still on the v1 dual-bar design. A sketch-driven redesign is waiting on user direction. When the sketch arrives, follow the same process: sketch defines metaphor → code translates → constrain to square bounding box → single continuous animation.

---

## Iteration model

Changes come from two sources:
1. **User sketches** — literal drawings that define a new card metaphor
2. **In-session rejection** — user says "no" to something; that becomes a hard rule in CLAUDE.md

Hard rules don't get re-litigated. The doc absorbs the rejection so future sessions don't re-propose the same thing.

Every session appends to the CLAUDE.md session log. This keeps parallel chat sessions synced — they all read the same source of truth.
