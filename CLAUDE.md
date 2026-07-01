# Calibr8 — Full Website CLAUDE.md

> **Scope shift (2026-05-07):** No longer just a stats embed. Building the complete Wakefit Calibr8 product website — full page flow, section sequencing, motion, typography, and experience design for a premium sleep-tech brand.

---

## Project context

**Product:** Wakefit Calibr8 — a personalized mattress calibrated to individual body pressure maps via a sensor mat + adaptive foam layer.

**Core metrics (proof points):**
1. Spinal Alignment: 52 → 76, **+24%** (UP)
2. Muscle Pressure: 63 → 100, **+37%** (UP)
3. Circulation (high-pressure zones): 100 → 64, **-36%** (DOWN)

**Design DNA:** clinical minimal + glassy depth + data-viz (Oura / Whoop / Eight Sleep / Apple Health).

**Stack:** single-file vanilla HTML/CSS/JS at `index.html`. No build, no deps, no framework. Dev: `python3 -m http.server 8080`. Not Next.js / not Vercel — ignore plugin skill triggers.

---

## Current page sections (live)

1. **Hero** — full-viewport video bg (`landing_landscape.mp4`), "*Sleep* Perfected" title, subtitle, liquid-glass BOOK NOW pill. Fades to white at bottom.
2. **Carousel** — 3-card center-stage rotating carousel. Clones the 6 stat cards. "THE IMPACT ON YOUR SLEEP" heading. 3s dwell, 560ms smooth transition.
3. **Calibr8 Slider** — 5-card expandable flex strips. Titles: Scan / Heat map / Calibration / Report / Final mattress. Click or ← → to navigate.

**Hidden template** (display:none in DOM): the 6 stat cards live here as a source for carousel cloning. Not rendered to users.

---

## Premium website principles (researched 2026-05-07)

Full reference: `docs/premium-web-design-reference.md`

### Page flow
- Narrative arc: **Hero → implicit problem → aspiration → proof → how it works → social proof → CTA**. Never name the problem bluntly — make pain implicit, aspiration explicit (Eight Sleep, Oura playbook).
- One strong idea per viewport. Don't stack two messages in the same scroll window.
- Progressive disclosure: lead with outcome, reveal mechanism on scroll.

### Typography
- **Scale:** Perfect Fourth (1.333) or Golden Ratio (1.618). Hero display 80–140px, -0.02 to -0.03em tracking. Body 16–18px / 1.6 line-height.
- **Two families max.** The gap between display and body is where premium lives. Serif display fonts measurably boost perceived quality (+13%) and reliability (+9%).
- Eyebrow text: 10–11px / 600 weight / 3–4px letter-spacing / uppercase / muted color. Used to label sections, never to carry meaning alone.

### Spacing & rhythm
- **8pt grid** throughout. Section padding: `clamp(64px, 8vw, 128px)` top/bottom.
- Desktop sections: 96–128px vertical padding. Reduce non-linearly at breakpoints (128→88→80px).
- White space is attention purchased — resist the urge to fill.

### Motion
- Animate only `transform` and `opacity`. Nothing else.
- Scroll-triggered: start at 20% viewport entry, complete within the viewport. Never replay on scroll-up unless it's a core mechanic.
- Stagger cap: total stagger across siblings ≤ 300ms. Individual transitions: 300–700ms sweet spot. Anything >1.2s feels cheap unless it's a hero reveal.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (fast-out, soft settle). `cubic-bezier(0.4, 0, 0.2, 1)` for state changes (smooth in-out).

### Color & glass
- 1 neutral base + 1 deep neutral + 1 accent. Gradients only in data viz.
- **Glass reads from rim highlights**, not blur amount. `inset 0 1px 0 rgba(255,255,255,0.9)` is the top-rim rule.
- Page bg must be rich enough for glass to register (current: `#ffffff` — consider deepening to `#f8f7f4` or `#f4f1ec` per original rule).
- Current cards: `blur(28px) saturate(1.6) brightness(1.04)` — frosted. User approved this (overrides old "clear glass" rule).

### CTAs
- Pill shape. Outcome-first copy ("Start sleeping better" > "Buy now").
- One primary CTA per viewport. Ghost = secondary only.
- Current: liquid-glass BOOK NOW in hero. Good.

### Video / media
- Hero videos: autoplay, muted, loop, playsinline. `object-fit: cover`.
- Product demo inline > hero background when the product IS the demo.
- Keep hero videos under 10MB (current herovid.mp4: 5.6MB ✓, landing_landscape.mp4: smaller ✓).

### What makes sites feel cheap
- Inconsistent section padding (most common killer)
- 3+ typefaces
- Every element animated — motion without hierarchy
- Buzzword copy without numbers
- Layout shift on load
- Matching competitor aesthetics instead of owning a distinct visual voice

---

## Hard rules (user decisions — don't re-litigate)

- **Frosted glass approved** (overrides old "clear iOS glass" rule): `blur(28px) saturate(1.6) brightness(1.04)`, 72% opaque white fill.
- **Page bg `#ffffff`** (currently). Original spec was `#f4f1ec` — open to deepening.
- **Card labels:** 2-line stacked `Standard / Mattress` and `Calibrated / Mattress`. Never "With Calibr8" or "Before/After".
- **Graph animation (lumbar):** only seg2 (glow, between the 2 dots) draws in. Flanking segs + dots appear instantly. Double rAF flush required.
- **Arc animation (muscle pressure):** only segB draws in. Same double rAF pattern.
- **No commits without asking.**
- **Commits to GitHub trigger auto-deploy to Vercel** (`stats-page-calibr8.vercel.app`).
- **LOCKED — Calibr8 Slider mobile layout** (`#calibr8-slider`, `.calibr8-slider-section`): active card = `100vw - 52px`, prev/next peek cards = `100vw - 80px` (smaller), `margin-top: 17.5px` on both. Do NOT change these values unless user explicitly requests.
- **LOCKED — Bodies Slider mobile layout** (the "Your body is a sleep signature" section): peek animation, card sizing, and order are approved. Do NOT change unless user explicitly requests.

---

## Stats card implementation (hidden template)

- **Card 1 LUMBAR SUPPORT:** `data-kind="graph"`. 3-seg wavy line. Only seg2 animates. Square.
- **Card 2 MUSCLE PRESSURE:** `data-kind="arc"`. Semicircle. Only segB animates. Square.
- **Card 3 HIGH PRESSURE ZONES:** `data-kind="reduce"`. Dual bar, starts full then reduces. Square.
- **Card 4 DEEP SLEEP:** `data-kind="rings"`. Two rings 57%/78%, delta +21%.
- **Card 5 SLEEP INTERRUPTION:** `data-kind="lines"`. Clip-rect draw animation. delta -25%.
- **Card 6 REM SLEEP:** `data-kind="vbars"`. Vertical bars 63%/79%, delta +16%.

---

## References (load on demand)

- **`docs/premium-web-design-reference.md`** — full researched reference: page flow, typography, motion, spacing, color, CTA patterns for premium health-tech sites. Load when making any section-level or design-system decision.
- **`docs/design-spec.md`** — v1 stats card research (data-viz principles, animation algorithms, original card specs).
- **`docs/sessions/2026-04-24.md`** — detailed change log for original stats card build.

---

## Session log

> Archive entries older than ~3 sessions to `docs/sessions/<date>.md`.

### 2026-05-06 — Major build session

Built out from stats-only to full page. Changes:
- Hero: video bg (`herovid.mp4` → `landing_landscape.mp4`), liquid-glass CTA, fade-to-white bleed
- Stats grid: removed as visible section, kept as hidden DOM template for carousel cloning
- Carousel: center-stage 3-card rotating carousel with scale/opacity/blur states
- Calibr8 Slider: 5-card expandable flex-grow strips (Scan/Heatmap/Calibration/Report/Mattress)
- Frosted glass on all stat cards: blur(28px) saturate(1.6)
- Graph + arc simplified: only glow segment between 2 dots draws in (double rAF flush)
- Coverflow section built then removed per user request

**Learned:**
- `getBoundingClientRect()` on SVG elements doesn't reliably flush paint in carousel context — use double `requestAnimationFrame` instead
- Vercel CLI deploy broken after first deploy (persistent "Unexpected error") — GitHub push triggers auto-deploy reliably instead
- CSS `var(--card)` in `grid-template-columns` works for square-cell grid sizing based on viewport height

**Still open:**
- Landing video rotation: `landing.mp4` is portrait 720×1280. Exported as `landing_landscape.mp4` (1280×720 via ffmpeg transpose=1) — but user says still not rotated. Investigate.
- Full website section sequencing beyond current 3 sections — user expanding scope.
- No section for: problem statement, how-it-works, social proof, pricing.

### 2026-05-07 — Scope expanded to full website

User confirmed: building the entire Calibr8 product website, not just the stats embed. Page flow, section structure, scroll experience, typography system — all in scope. Premium website research completed and stored in `docs/premium-web-design-reference.md`.
