# Calibr8 — Design System (consolidated, current-state)

> Canonical design reference. Consolidates `docs/design-spec.md` (data-viz research) +
> `docs/premium-web-design-reference.md` (page-flow/typography/motion research) + the
> "Hard rules" and per-card specs previously scattered across CLAUDE.md's session log.
> **This file states what IS implemented, and calls out open research options separately.**
> For the full research writeups (brand-by-brand breakdowns, rejected options, sourcing), see the two files above.

---

## 1. Design DNA

Clinical minimal + glassy depth + data-viz energy. Reference products: Oura Ring, Whoop, Eight Sleep, Apple Health.

Narrative arc for the page: **Hero → implicit problem → aspiration → proof → how it works → social proof → CTA.**
Never name the problem bluntly in the hero — pain becomes explicit only in the dedicated problem-stat section; aspiration stays explicit throughout (Eight Sleep / Oura playbook).

Stack: single-file vanilla HTML/CSS/JS, `final-flow.html`. No build, no deps, no framework.
Dev server: `python3 -m http.server 8080` → `localhost:8080/final-flow.html`.

---

## 2. Typography

**Two families max.** Current build: system sans stack throughout (no serif display face adopted yet — the premium-reference research recommends pairing a serif/custom display face with a neutral sans body for a bigger perceived-quality gap; still an open option, not yet applied).

**Scale:** Perfect Fourth (1.333) or Golden Ratio (1.618).
- Hero display: 80–140px desktop, tight tracking (-0.02 to -0.03em)
- Section headlines: 40–64px, weight 600–700
- Body: 16–18px / 1.6 line-height
- Eyebrow text: 10–11px / 600 weight / 3–4px letter-spacing / uppercase / muted color — labels a section, never carries meaning alone

**Mobile:** `.problem-stat` uses `clamp(24px, 6.5vw, 30px)`. Prefer `clamp()` over fixed breakpoint sizes for body-adjacent copy so it scales continuously.

### Responsive line-breaks (pattern)

When a sentence needs *different* word-wrap points on mobile vs. desktop — not just narrower-width reflow, but genuinely different break words — don't duplicate the markup per breakpoint. Keep one text span, insert a `<br>` at every candidate break point, tag each with a breakpoint class, and toggle visibility:

```css
.pst-br-mobile { display: none; }
.pst-br-desktop { display: inline; }
@media (max-width: 767px) {
  .pst-br-mobile { display: inline; }
  .pst-br-desktop { display: none; }
}
```

`display:none` on a `<br>` removes the break; `inline` restores it. Used in `.problem-stat-section` (2026-07-09) after natural reflow orphaned a single word on mobile.

---

## 3. Spacing & rhythm

**8pt grid** throughout — every spacing value is a multiple of 8 (4 for micro-spacing).

- Section padding: `clamp(64px, 8vw, 128px)` top/bottom on desktop
- Responsive reduction is non-linear: 128px → 88px (tablet) → 80px (mobile), not a flat scale-down
- Card internal padding: 32–48px
- White space is attention purchased — resist filling it. Cramped sections read "budget"; generous sections read "we can afford to say less."

Inconsistent section padding is the single most common tell of a cheap site — keep every section on the same grid unit.

---

## 4. Motion

- Animate **only** `transform` and `opacity`. Never `width`/`height`/`top`/`left` (causes reflow, drops frames).
- Scroll-triggered reveals: start at ~20% viewport entry, complete within the viewport. Never replay on scroll-up unless it's a core mechanic (e.g. a toggle).
- Stagger cap: total stagger across sibling elements ≤ 300ms. Individual transitions: 300–700ms sweet spot. >1.2s feels cheap unless it's a hero reveal.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (fast-out, soft settle). `cubic-bezier(0.4, 0, 0.2, 1)` for state changes (smooth in-out).
- Counters: ease-out cubic for standalone stat counters; **linear** easing when a counter must stay synced to a path-drawing animation (graph/gauge cards) — see §7.
- `getBoundingClientRect()` on SVG elements does not reliably flush paint inside the carousel — use a **double `requestAnimationFrame`** instead before reading/animating geometry.

**Locked animation specifics (don't re-litigate):**
- Lumbar graph card: only seg2 (the glow segment between the 2 dots) draws in. Flanking segments + dots appear instantly. Requires the double-rAF flush above.
- Muscle-pressure arc card: only segB draws in, same double-rAF pattern.

---

## 5. Color & glass

**Restraint principle:** 1 neutral base + 1 deep neutral + 1 accent. Gradients only inside data-viz, never as decorative backgrounds (pastel/mesh gradients read as a 2019 SaaS template).

**Current state:**
- Page background: `#ffffff`. (Original spec called for `#f4f1ec`/deeper neutral so glass has something to read against — pure white makes glass surfaces disappear. Open to revisiting, not yet changed.)
- Accent: `#553C9A` (purple) — used consistently for emphasis spans, stat callouts, glow shadows.

**Glass — frosted approved (overrides earlier "clear iOS glass" spec):**
```css
backdrop-filter: blur(28px) saturate(1.6) brightness(1.04);
/* ~72% opaque white fill */
```
Glass reads from **rim highlights**, not blur amount — `inset 0 1px 0 rgba(255,255,255,0.9)` is the top-rim rule regardless of blur radius.

**Data-viz color rules:**
- Baseline/standard state: muted, slightly warm neutral — never raw red (red ≠ improvement, green ≠ problem doesn't mean "standard" should look dangerous)
- Improvement: brand accent or a distinct positive color
- Reduction-is-good metrics: separate positive color, not the same "improvement" hue reused
- Never rely on color alone to differentiate data — pair with label/pattern/position (colorblind-safe)
- Darker = higher value (intuitive direction)

---

## 6. CTAs

- Pill shape (`border-radius: 100px`) — current signature look, don't deviate to sharp corners.
- Outcome-first copy: "Start sleeping better" > "Buy now" / "See your recovery data" > "Learn more."
- One primary CTA per viewport. Ghost/outline = secondary only, never the main conversion action.
- Current: liquid-glass "Book Now" pill in hero — approved, keep as the reference implementation for future CTAs.

---

## 7. Data-viz & stat-card principles

(From the original stats-card research — still governs the 6 hidden template cards and any future stat visualization.)

- **Context over numbers.** A bare percentage means nothing without "vs. what." Always show before *and* after, or a clear delta.
- **Chart type by intent:** bar = numerical/categorical comparison, line = trend over time, radial = compact goal/score-out-of-100, paired bar = two series side by side.
- **Label proximity.** Labels on or directly adjacent to the charted element — never force the reader to look between a legend and the data.
- **Simplicity over impressiveness.** A stat graphic's job is instant comprehension, not visual flourish.
- **≤3 perceptual dimensions at once** (2 spatial + 1 time is the practical ceiling for a glanceable card).
- **Card copy hierarchy:** Category (1–3 words, uppercase) → Comparison labels (2–4 words) → Delta → Outcome (2–3 words, uppercase) → Benefit sentence (10–15 words, optional).
- **Card labels:** always the 2-line stacked form `Standard / Mattress` and `Calibrated / Mattress`. Never "With Calibr8" or "Before/After" (implies fault).

**Current per-card implementation** (hidden stat-card template, cloned into the carousel):
| Card | Kind | Behavior |
|---|---|---|
| 1. Lumbar Support | `graph` | 3-seg wavy line, only middle glow segment animates in |
| 2. Muscle Pressure | `arc` | Semicircle gauge, only segB animates in |
| 3. High Pressure Zones | `reduce` | Dual bar, starts full then reduces |
| 4. Deep Sleep | `rings` | Two rings 57%/78%, delta +21% |
| 5. Sleep Interruption | `lines` | Clip-rect draw animation, delta -25% |
| 6. REM Sleep | `vbars` | Vertical bars 63%/79%, delta +16% |

Counter easing: ease-out cubic for standalone counters; linear (`countToLinear`) when synced to a drawing path, to avoid the number and the line finishing at visibly different times.

---

## 8. Copy voice

Clinical, not cold. Outcome-focused, not feature-focused. Confident, not hyperbolic. Human units ("52%", not "0.52").

Avoid: buzzwords ("innovative," "revolutionary," "seamless"), vague claims without numbers ("dramatically improves sleep" — say "+37% muscle pressure distribution" instead), generic CTAs ("Learn more" everywhere).

---

## 9. Hard-locked rules (user decisions — do not re-litigate)

- **Frosted glass** (§5) approved over clear glass.
- **Page bg `#ffffff`** currently — open to deepening, not resolved.
- **Card labels** — 2-line stacked form only (§7).
- **Graph/arc animations** — only the glow/segB segment draws in (§4).
- **No commits without asking.**
- **Commits to GitHub trigger auto-deploy to Vercel** (`stats-page-calibr8.vercel.app`).
- **LOCKED — Calibr8 Slider mobile layout** (`#calibr8-slider`, `.calibr8-slider-section#process-section`): active card = `100vw - 52px`, prev/next peek cards = `100vw - 80px`, `margin-top: 17.5px` on both. Do not change without explicit request.
- **LOCKED — Bodies Slider mobile layout** (`#process-slider`, "Your body is a sleep signature" section): peek animation, card sizing, order all approved. Do not change without explicit request.

---

## 10. Anti-patterns — what makes a site feel cheap

- Inconsistent section padding (the most common killer)
- 3+ typefaces, or inconsistent weight logic across sections
- Every element animated — motion without hierarchy
- Buzzword copy without numbers
- Layout shift on load (missing aspect-ratio containers)
- Matching a competitor's aesthetic instead of owning a distinct visual voice
- Long stagger delays (last card appearing 0.5s+ after the first — user has scrolled past)
- Parallax on text columns (actively harms readability)

---

## 11. Further reading

- `docs/premium-web-design-reference.md` — full brand-by-brand research (Eight Sleep, Oura, WHOOP, Apple, Dyson), section-pattern library, token quick-reference.
- `docs/design-spec.md` — original data-viz research archive, rejected before/after chart options, accessibility/WCAG detail, browser support matrix.
- `docs/8zones-snapshot.md`, `docs/bodies-section.md`, `docs/design-process.md` — section-specific build notes.
- `CLAUDE.md` — live project state, current page-section list, session log.
