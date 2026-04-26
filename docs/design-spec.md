# Design Spec — Reference (v1 research archive)

> Moved out of CLAUDE.md on 2026-04-24 to reduce per-turn context load.
> Load on demand when researching a design decision. Current implementation
> state lives in CLAUDE.md — this file is historical research + rejected options.

---

## Original design DNA

Clinical minimal + glassy depth + data-viz energy. Reference products: Oura Ring, Whoop, Eight Sleep, Apple Health.

**Reference screenshots (Oura/Whoop cards) gave us:**
- Soft gradient backgrounds; colored dot + uppercase category label top-left
- Hero metric big (48-56px/700), unit small
- Embedded mini viz: sparkline / radial / horizontal bars (40-60px tall)
- Tiny supporting metrics (range/min-max) below viz
- Uppercase bottom label in scheme color
- Airy padding, 12-16px radius, subtle shadows

**Original color system (pastel, superseded by deeper palette — see CLAUDE.md):**
- Heart Rate: pink/coral `#FF6B9D → #FFB4A2`
- Breathing: teal/aqua `#6BCFCF → #A8E6CF`
- Sleep Score: purple/indigo `#7B68EE → #9B88FF`

---

## Data-viz research synthesis

**1. Context is everything.** Numbers alone are meaningless. 24% means nothing without "vs. previous baseline." Show before AND after.

**2. Chart type selection:**
- Bar: numerical comparison, before/after, categorical
- Line: trends over time (not single-point comparison)
- Radial/circular: compact, goal completion, scores-out-of-100
- Paired bar: side-by-side when two series

**3. Dashboard: 5-9 core elements. Single screen. Top-left = most important (scan path).**

**4. Progressive disclosure.** Delta prominent; methodology hidden.

**5. Label proximity.** Labels ON or adjacent to charted elements. Never make user scan between legend and data ("death by thousand paper cuts" — NN/g).

**6. Color rules.**
- Differentiate data points with color
- Colorblind-friendly
- Shades of same color for intensity gradients
- Never rely on color alone — add pattern/shape/label
- Darker = higher value (intuitive)

**7. Simplicity.** Graphics must be quickly understandable, not impressive. Communicate, don't decorate.

**8. Clutter = obscured insights.** Remove unnecessary borders/gridlines. Every pixel meaningful.

**9. Accessibility.** WCAG AA: 4.5:1 text, 3:1 UI. Keyboard nav. Screen reader support.

**10. Human perception ≤ 3 dimensions at once.** 2 spatial + 1 time is the sweet spot.

---

## Before/after methodology — 4 options evaluated

1. **Paired bar chart** (NN/g) — two bars side by side per metric, grouped by metric not time
2. **Stacked/segmented bar** — baseline + improvement-on-top
3. **Dual progress indicators** — top bar baseline, bottom bar optimized, same scale (20 units)
4. **Before → after with arrow** — simple single-metric cards

**Originally selected: option 3 (dual bar).** Partially superseded — Card 1 rebuilt as line chart, Card 2 as gauge. See CLAUDE.md for current per-card approach.

---

## Original card specs (v1 — partially superseded)

### Card 1: Spinal Alignment (+24%)
- **SUPERSEDED.** Now line chart titled "LUMBAR SUPPORT". See CLAUDE.md.
- Original: dual-bar, blue-to-purple `#667EEA → #764BA2`, baseline 52% / optimized 76%
- Copy: "BETTER ALIGNMENT", "Standard Mattress" / "With Calibr8"

### Card 2: Muscle Pressure (+37%)
- **SUPERSEDED.** Now dual semi-circle gauge. See CLAUDE.md.
- Original: dual-bar, teal-to-green `#38B2AC → #68D391`, baseline 63% / optimized 100%
- Copy: "EVEN PRESSURE", "Improved muscle pressure distribution for deeper, more restorative sleep"

### Card 3: Circulation (-36%)
- **STILL ORIGINAL DESIGN.** Dual-bar.
- Palette: red problem `#E53E3E` → green solution `#38A169` (option A, inverse coloring)
- Baseline 100% high-pressure zones / optimized 64%
- Copy: "FEWER WAKEUPS", "Reduced high-pressure zones improving circulation and reducing wakeups"
- Animation: card fade → red bar fills to 100% → green bar fills to 64% → delta counts to -36 → outcome fades

### Original universal card structure
```
● CATEGORY LABEL
BASELINE LABEL
▓▓▓▓▓░░░░░  52%
OPTIMIZED LABEL
▓▓▓▓▓▓▓░░░  76%
    ↑ +24%
OUTCOME
```

### Original bar-viz details
- 20 units per bar (easy % mental math)
- Bar height 12-16px, gap 4-6px, radius 4-6px
- Filled = solid saturated; empty = 20% opacity

---

## Animation spec (v1)

### Stagger
- Card 1: 0ms, Card 2: 200ms, Card 3: 400ms
- Scroll trigger via Intersection Observer, 20% visible threshold
- OR on page load if above fold

### Counter (ease-out cubic) — for bar cards
```js
function animateCounter(el, start, end, duration, suffix='%') {
  let t0 = null;
  function step(ts) {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(start + (end - start) * e) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
```

**Note:** graph + gauge cards use `countToLinear` (linear easing) to stay synced with path drawing. See CLAUDE.md session log.

### Bar fill (ease-out)
Same pattern, animates `el.style.width`.

### Hover
- `translateY(-4px)`, shadow deepens, 280ms, no color change, no border appearance.

---

## Tech stack options (evaluated — chose option 1)

1. **Pure HTML/CSS/vanilla JS** ← SELECTED. Single-file, no build, no deps.
2. React + Framer Motion — rejected (overkill for embeddable block)
3. GSAP ScrollTrigger — rejected (same)

---

## CSS variable scaffolding (original)

```css
:root {
  --spinal-primary: #667EEA; --spinal-secondary: #764BA2; --spinal-light: rgba(102,126,234,0.2);
  --muscle-primary: #38B2AC; --muscle-secondary: #68D391; --muscle-light: rgba(56,178,172,0.2);
  --circulation-problem: #FF6B6B; --circulation-solution: #48BB78;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --card-padding: 24px; --card-gap: 24px; --card-radius: 16px;
  --duration-fast: 0.2s; --duration-medium: 0.4s; --duration-slow: 1.5s;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Current palette deepened** — see CLAUDE.md for `--spinal-1 #5A67D8`, `--muscle-1 #319795`, `--circ-1 #D53F8C`, etc.

---

## Don'ts

**Visualization:**
- No pie charts for before/after
- No dual-axis charts
- No data without context
- Don't rely on color alone
- No gradient color on single data series

**Layout:**
- Don't separate legends from charts
- Max 9 elements on dashboard
- Consistent visual language
- Don't hide critical info in hover (mobile has no hover)

**Typography:**
- Max 3 font sizes per card
- No vertical/diagonal labels
- Sans-serif for data

**Animation:**
- No overshoot/bounce (not premium)
- Don't animate everything simultaneously
- Max 2s per animation
- Don't repeat on every scroll

**Color:**
- Keep pastels soft, avoid aggressive saturation
- Red ≠ improvement, green ≠ problem
- WCAG-pass contrast always
- Max 1-2 colors per card

**Data integrity:**
- Bars always start at 0 axis
- Don't cherry-pick data
- Round numbers correctly
- Don't mix % and absolute without clarification

---

## Accessibility requirements

### WCAG AA
- Text: 4.5:1 | Large text (18px+): 3:1 | UI: 3:1

**Tested palette colors (all pass on white):**
- `#667EEA`, `#38B2AC`, `#F687B3`

### Colorblind
- Card 3: don't rely on red/green alone — add patterns/icons/labels

### Keyboard
- Cards focusable (`tabindex="0"`), visible focus state

### Screen reader
```html
<div class="stat-card" role="article" aria-label="Spinal Alignment Improvement Statistics">
  <p class="sr-only">
    Spinal alignment improved by 24%, from 52% with a standard mattress to 76% with Calibr8.
  </p>
  <!-- visual content -->
</div>
```

---

## Performance

- Animate `transform` / `opacity` (GPU)
- Avoid animating `width`/`height`/`top`/`left` (reflow)
- `will-change` sparingly
- `requestAnimationFrame`, debounce scroll
- SVG inline for icons

---

## Copy guidelines

**Voice:** Clinical, not cold. Outcome-focused, not feature-focused. Confident, not hyperbolic. Human units (52%, not 0.52).

**Hierarchy:** Category → Comparison labels → Delta → Outcome → Benefit (optional).

**Length targets:**
- Category: 1-3 words uppercase
- Comparison: 2-4 words
- Outcome: 2-3 words uppercase
- Benefit: 10-15 words, one sentence

**Good:** "BETTER ALIGNMENT" / "Standard Mattress" / "With Calibr8"
**Bad:** "Enhanced Orthopedic Spinal Positioning" / "Old Mattress" / "Our Product"

---

## Narrative

The three cards build a chain:
- **Spinal** 52 → 76 = +24% better support
- **Muscle** 63 → 100 = +37% improvement in distribution
- **Circulation** 100 → 64 = -36% fewer high-pressure zones

Chain: Better spine → Better pressure → Better circulation → Better sleep.

**Design job:** Make that story obvious in under 3 seconds. Numbers trustworthy (clinical aesthetic). Comparison clear (visual differentiation). Memorable (smooth premium animation).

**When in doubt:** Clarity > cleverness. Simplicity > complexity. Evidence > decoration. Comprehension > expression.

---

## Delivery format options

1. **Single-file HTML** ← CURRENT. Self-contained, offline-capable, embeddable.
2. React component — not selected; example shape if ever needed:
   ```jsx
   <StatCard type="improvement" category="Spinal Alignment"
     baseline={{ value: 52, label: "Standard Mattress" }}
     optimized={{ value: 76, label: "With Calibr8" }}
     delta={24} outcome="Better Alignment" colorScheme="spinal" />
   ```
3. Design tokens JSON — not needed for single-file.

---

## Browser support target

Chrome 90+, Safari 14+, Firefox 88+, Edge 90+, iOS Safari 14+, Chrome Android 90+.
Fallbacks: flexbox for Grid, scroll event for IntersectionObserver, setTimeout for rAF, static values for CSS custom properties.
