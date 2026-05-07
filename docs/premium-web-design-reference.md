# Premium World-Class Product Website — Design Reference

> Research base: Eight Sleep, Oura, WHOOP, Apple, Dyson, Arc'teryx, Loewe. Health tech + consumer hardware focus.
> Use as design guidance when building or critiquing UI sections.

---

## 1. Page Flow & Section Sequencing

### The Master Pattern (Health/Sleep Tech)

```
NAV (sticky, minimal)
↓
HERO — aspirational claim + product visual + primary CTA
↓
PROOF HOOK — 1-3 stats or trust signals (quick scan, no detail)
↓
PROBLEM — make the pain real (poor sleep costs you X)
↓
SOLUTION — product enters as answer (not features, outcomes)
↓
HOW IT WORKS — mechanism, science, engineering proof
↓
USE CASES — persona-specific scenarios (couples, athletes, shift workers)
↓
CLINICAL / RESEARCH — quantified benefits, advisory board
↓
SOCIAL PROOF — testimonials, press logos, review carousel
↓
FINAL CTA — emotional close, then shop link
↓
FOOTER
```

### Brand-Specific Patterns Observed

**Eight Sleep**: Opens with sale/urgency banner → value propositions (risk-free trial, financing) → "designed for deeper recovery" system framing → 6 use-case scenarios → clinical percentages → Huberman/Walker advisory board → "Sleep changed. Life changed." close. Notably: problem is implicit (poor recovery), not stated bluntly.

**Oura**: Hero = aspirational product ID ("Sleeker. Smarter.") → dual product cards → "your body has a voice" value prop → 6-pillar health carousel (Sleep, Stress, Women's Health, etc.) → 5 day-in-the-life vignettes → testimonials embedded within scenarios → press logos. Notably: proof is contextual (inside real moments), not a separate "reviews" dump.

**WHOOP (redesign, Basic/DEPT)**: Moved from eCommerce to "resource for leveling up." Progressive disclosure throughout — audiences dig deeper without being overwhelmed. Motion as storytelling, not decoration. Key restructuring: organized by what WHOOP *enables*, not what it *is*.

**Apple**: Problem is never named — aspiration is everything. Product is the answer to an unstated desire. Section transitions are spatial/cinematic. No "Why you need this" — only "This is the world now."

**Dyson**: Engineering-proof sections dominate mid-page. Laser dust detection, air amplifier mechanics — the mechanism IS the selling point. Feature callouts use spec numbers as visual anchors (rpm, Pa suction, filtration %). Science as luxury.

### Sequencing Rules
- Hero → emotional hook. Never lead with specs.
- Stat callouts directly after hero keep scroll momentum. Place 2-4 key metrics in a horizontal band before the problem section.
- Social proof (testimonials, press) goes AFTER mechanism/science — earns authority, then validates with humans.
- One CTA per viewport. Never two competing buttons in the same screen area.
- Final section should be a *close*, not a repeat of the hero. Emotional resolve: "You're ready." "Now you'll know." Never just "Buy now."

---

## 2. Typography Hierarchy

### The Premium Formula
- **2 typefaces maximum.** Display serif (or custom sans) for headlines + neutral sans for body. Never 3+ families.
- **Display font must be decisively different** from body. Mixing two similar sans-serifs reads as indecision.
- **Scale contrast is the signal.** The gap between your largest headline and your body copy is where premium lives. Generic sites: 48px headline / 16px body = 3:1. Premium: 80–120px headline / 15–17px body = 5:1 to 8:1.

### Type Scale Ratios

| Scale | Ratio | Use |
|-------|-------|-----|
| Minor Third | 1.2 | Dense UI, small screens |
| Major Third | 1.25 | Body + subheadings |
| Perfect Fourth | 1.333 | Good all-purpose scale |
| Golden Ratio | 1.618 | Editorial / luxury / hero-dominant |
| Major Second doubled | 1.414 (√2) | Technical/precision feel |

Premium product pages commonly use Perfect Fourth (1.333) or Golden Ratio (1.618) for display–to–body relationships.

### Practical Sizes (Desktop)
- Hero display: 80–140px, weight 700–900, tight tracking (-0.02 to -0.04em)
- Section headlines: 40–64px, weight 600–700
- Subheadings / eyebrows: 12–14px, weight 500–600, letter-spacing +0.08–0.12em, ALL CAPS
- Body copy: 16–18px, weight 400, line-height 1.5–1.65
- Captions / footnotes: 12–13px, weight 400–500, line-height 1.4

### What Separates Premium from Generic

**Premium does:**
- High stroke contrast on display face (thick/thin differential — classic Didot/Bodoni logic, or modern variable fonts with optical sizing enabled)
- Tight tracking on large headlines (-0.02em or tighter) — loose tracking at display sizes reads as amateur
- Light weight for large decorative numbers or pull quotes (thin 100–200 weight at 80px+)
- Italic accents for emotional emphasis — Oura does this: "_your life_", "_live healthier_"
- Optical sizing: display cuts of a typeface used at display sizes, text cuts for small sizes

**Generic does:**
- System sans (Inter/Roboto/Arial) at 24px with bold weight = "startup template"
- Inconsistent weights across sections (bold h2, semi-bold h3, bold h3, light h4 — random)
- Tracking unchanged across sizes (tight tracking at 14px is illegible; loose tracking at 80px is cheap)
- Line height 1.2 on body text (too tight — fatigue)

### Recommended Font Pairings (health/sleep tech)

| Display | Body | Mood |
|---------|------|------|
| Canela / Canela Text | Neue Haas Grotesk | Clinical editorial |
| GT Super | DM Sans | Science-warm |
| Freight Display | Freight Text / Inter | Trusted data |
| Editorial New | Suisse Int'l | Cold premium |
| Custom/bespoke serif | System sans | Maximum differentiation |

---

## 3. Scroll & Motion

### The Tasteful / Distracting Divide

**Tasteful:**
- Single directional reveal per section (fade + translateY 20–40px, 0.5–0.8s, ease-out)
- Scrubbed animations tied 1:1 to scroll position (Apple AirPods canvas frame-sequence pattern)
- Sticky "feature pin" sections: product stays fixed, copy panels scroll beside it — mechanism demo without needing video
- Number counters trigger on scroll-enter, run once
- Line-draw SVG animations (graphs, paths) triggered once on viewport entry, L→R direction

**Distracting:**
- Every element has a stagger animation (5 cards each delay 0.1s = last card waits 0.5s before appearing — user already scrolled past)
- Parallax on hero text (copy moving at different speed from background = difficult to read mid-scroll)
- Animations on repeated/utility elements (nav links, footer items, form labels)
- Entrance animations that replay on scroll-up (re-triggering every time user reverses)
- Overly long duration (>1.2s for simple reveals = page feels sluggish)

### Technical Reference

**GSAP ScrollTrigger** is the industry standard for premium scroll animation:
- `scrub: 1` or `scrub: 2` for smooth scroll-linked animation (higher = more lag/inertia)
- `ease: "none"` when scrubbing (easing + scrub = inconsistent feel)
- `pin: true` for sticky product-reveal sections
- Animate only `transform` and `opacity` — layout properties (width, height, padding) cause reflow

**CSS Scroll-driven animations** (2024+): now native, no JS needed for simple parallax. Compositor-only. Use for subtle background parallax, progress bars.

**Apple's canonical pattern** (AirPods Pro):
- Canvas element + pre-loaded image sequence (60–100 frames)
- requestAnimationFrame updates frame based on scrollTop / maxScrollTop ratio
- Copy is `position: sticky` with opacity linked to same scroll progress
- Effect: product "assembles" as user scrolls = 0 mystery, complete control

### Easing Reference

| Easing | Use |
|--------|-----|
| `ease-out` (cubic-bezier 0,0,0.2,1) | Most reveals — fast entry, gentle stop |
| `ease-in-out` | Cross-fade, section transitions |
| `linear` | Scrub animations, drawing animations |
| Spring physics | Hover micro-interactions only |

---

## 4. Spacing & Rhythm

### The 8pt Grid System

Base unit = 8px. All spacing is a multiple of 8 (or 4 for micro-spacing).

**Section vertical padding (desktop):**

| Context | Padding |
|---------|---------|
| Hero (top-of-page) | 120–200px top |
| Major content sections | 96–128px top + bottom |
| Sub-sections / feature rows | 64–96px top + bottom |
| Card internal padding | 32–48px |
| Element gaps (within a section) | 24–48px |
| Inline element spacing | 8–16px |

**Responsive reduction (non-linear):**
- 128px desktop → 88px tablet → 80px mobile
- 96px desktop → 64px tablet → 48px mobile

**White space as luxury signal:**
- Empty space around the product image is not wasted — it is attention purchased.
- Cramped sections signal "budget." Generous sections signal "we can afford to say less."
- Text columns: 55–75 characters per line is optimal readability. At 1440px wide with 16px body, that's roughly `max-width: 680px` for body copy.

### Horizontal Rhythm

- Max content width: 1200–1440px, centered
- Side margins: `clamp(24px, 5vw, 120px)` — scales with viewport
- Typography gutters: 20–30px between paragraphs

### What Inconsistent Spacing Signals

Varied margins between sections, text too close to images, buttons without clear alignment — these individually feel minor but collectively signal "template site." Premium comes from pixel-perfect consistency: every section uses the same grid unit.

---

## 5. Color & Material

### The Restraint Principle

Premium palettes: 1 neutral base + 1 deep neutral + 1 accent maximum. Health tech adds 1 data color (often a gradient for positive/negative).

**Near-monochrome examples:**
- Eight Sleep: white + dark navy/charcoal + blue-teal accent
- Oura: off-white + deep charcoal + soft gold/silver (hardware colors mirror palette)
- WHOOP: black-dominant + single brand color (black + WHOOP green or white)
- Apple: white-dominant + near-black + product color of the season

**The gradient trap:**
- Pastel gradient backgrounds read as 2019 SaaS template
- Acceptable gradient: subtle, single-direction, low saturation (e.g., white → off-white, not pink → purple)
- Gradients in data visualization (progress bars, gauges) = fine, purposeful
- Background blobs / mesh gradients = not premium in 2025-2026

### Glass / Frosted Treatments

**iOS-style clear glass (correct):**
```css
background: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(10px) saturate(1.15);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.25),  /* rim highlight top */
  0 8px 32px rgba(0,0,0,0.12);           /* depth shadow */
```
Glass reads from rim highlights, not blur intensity. Blur alone = frosted, not glass.

**Page background for glass registration:**
Glass needs a rich background to read as glass. Pure white bg = glass disappears. Use `#f0ede8` or deeper for warm, `#1a1a2e` for dark-mode glass.

**Frosted (overused, avoid for premium):**
High blur (>20px) + no rim highlights + white overlay at 30%+ opacity = "blur overlay" not glass.

### Color in Data Visualization

For before/after stat sections (health/sleep):
- Baseline: muted, slightly warm neutral (`#9CA3AF` gray or `#C4B5A5`)
- Improvement: brand accent or a distinct positive color
- Reduction (good): separate positive color (green scale)
- Never use raw red for "standard" — implies danger rather than baseline

---

## 6. Video & Media Integration

### Hero Video

**Spec:**
- Autoplay, muted, loop, playsinline — always
- No controls visible in hero (controls = YouTube, not premium)
- Keep under 10MB for hero (compress to H.264/H.265, ~5–8 Mbps for 1080p)
- Do not autoplay on mobile data connections — fallback to still image
- Duration: 6–15 seconds. Loop point must be seamless (reverse + loop or matched-frame loop)

**What premium hero videos show:**
- Product in motion (slow, deliberate camera movement)
- Lifestyle context without stock-photo feel (real environments, real imperfection)
- No text overlays in the video itself — copy is DOM layer above
- High contrast ratio — video dark enough that white copy reads at all scroll positions

**Placement pattern:**
```
[video: full bleed, 100vh, object-fit: cover]
[overlay: linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.45))]
[headline: position: absolute, bottom 15-20%]
[CTA: position: absolute, bottom 8-10%]
```

### Inline Product Demos

- Feature walkthrough sections use image sequences (Apple pattern) or CSS-animated diagrams, not embedded YouTube
- Video within feature sections: short clips (2–4s), looping, no controls, inline with copy
- Lightbox video for testimonials/case studies only — triggered by user click, never autoplay

### Image Sequence vs. Video

| Use Case | Format |
|----------|--------|
| Scroll-controlled product assembly | Canvas + image frames |
| Background atmosphere | Looping MP4, muted |
| Feature mechanism demo | Short looping MP4 or CSS animation |
| Testimonials | Static photo + quote (video optional via lightbox) |
| Product details/textures | High-res still, WebP |

---

## 7. CTA Design

### Button Hierarchy

**3-level system — only:**

1. **Primary** — filled, high contrast, single on viewport. Maximum 1 active at a time.
2. **Secondary** — outlined/ghost, same page, lower visual weight.
3. **Tertiary** — text link, in-paragraph or nav only.

### Primary CTA Specs

- **Shape:** pill (border-radius: 100px) signals modernity. Slight rounding (8–12px) signals precision/technical. Sharp corners (0–4px) feel budget in 2025.
- **Size:** min 48px height, 120–200px width. Padding: 14–16px top/bottom, 28–40px left/right.
- **Color:** highest contrast with background. If page is white → dark fill. If hero is dark → white or accent fill.
- **Hover state:** brightness -10%. Never color-shift or resize on hover (jarring).

### Copy Tone (Premium Health Tech)

**Premium:** outcome-first, active, first person
- "Start sleeping better" — not "Buy now"
- "See your recovery data" — not "Learn more"
- "Try free for 30 nights" — not "Shop"
- "Get early access" — not "Sign up"

**Avoid:**
- Generic: "Get started", "Learn more", "Click here"
- Overreach: "Transform your life", "Unlock your potential"
- Fake urgency: "Limited time" without a real deadline

### Ghost Button Usage

- Secondary action only. Never for the main conversion action.
- Example: Primary = "Shop Pod 4" (filled). Secondary = "Compare models" (ghost).
- Ghost on dark backgrounds: `border: 1px solid rgba(255,255,255,0.6)` + white text. On light: `border: 1px solid rgba(0,0,0,0.3)` + dark text.

### CTA Placement

- Hero: inline below headline. Don't bury in fold.
- Mid-page: after each proof section (science section → "See the data" CTA)
- Sticky nav CTA: visible always, smaller than section CTA, high contrast
- Final close section: largest CTA on the page — this is the buy moment

---

## 8. Performance Signals

### What Communicates Speed & Quality

**Font loading:**
- Preload critical fonts: `<link rel="preload" as="font" crossorigin>`
- `font-display: optional` for body fonts (skip if slow) or `font-display: swap` with a matched fallback
- Use `size-adjust`, `ascent-override`, `descent-override` to minimize CLS when font swaps
- System fallback should visually approximate the web font — not Helvetica as fallback for Canela

**Skeleton states:**
- Perceived 20–30% faster than spinners for identical load times
- Match skeleton shape to final content shape exactly (same height, same column width)
- Animate with shimmer (linear gradient moving L→R), not pulse (too obvious)
- Use for: testimonial sections, image galleries, stat cards on data load

**Transition timing:**
- Page section reveals: 400–600ms, ease-out
- Micro-interactions (hover, focus): 150–250ms
- Heavy transitions (full-screen overlay, modal): 300ms in, 200ms out (faster out = feels responsive)
- Counter animations: linear easing, duration = 1.2–2s (longer for larger numbers)

**Visual continuity signals:**
- Image loaded = always exact aspect ratio container (never height: auto on unfixed images — causes layout jump)
- Above-fold content: no lazy load (defeats the point)
- Background images: serve WebP with JPEG fallback, correct `srcset`

### What Slow Looks Like (Avoid)

- FOUT (flash of unstyled text): body text snaps from Arial to GT Super at 500ms load
- CLS (layout shift): image loads and pushes CTA button down 200px
- Long animation intro before user can interact (animated logo sequence > 1.5s = user gone)
- JavaScript animation that runs on scroll with dropped frames (use `transform` on compositor layer only)

---

## 9. Section-Level UX Patterns (Health/Sleep Tech)

### Hero Pattern
```
Full-bleed visual (video or editorial photo)
Eyebrow: small caps, brand or category label
H1: 1–2 lines max, outcome-focused
Supporting sentence: 1 line, mechanism hint
[Primary CTA] [Optional secondary ghost CTA]
Scroll indicator (optional — arrow or "discover" text at bottom)
```
Eyebrow examples: "CLINICALLY STUDIED SLEEP TECH" / "RECOVERY INTELLIGENCE" / "NOW WITH AI COACHING"

### Stat Showcase Section

**The "proof band"** — horizontal strip of 3–6 metrics immediately below hero or above fold of problem section:

```
[icon or data graphic] [+37%] [Muscle pressure improvement]
[icon or data graphic] [94%]  [Users report better mornings]
[icon or data graphic] [−25%] [Reduction in wakeups]
```

Design rules:
- Numbers animate (count up or draw) on scroll-enter, run once only
- Number = largest element, weight 700+
- Descriptor = small, weight 400, below the number
- Source footnote = 10–11px, muted, links to methodology
- Background: same as page (don't box these in a card — strip format reads cleaner)

### Feature Callout (Sticky Pin) Pattern

Long-scroll feature section used by Apple, Dyson:
```
[Product: sticky, centered, 50% width]
[Panels scroll past on right side]
  Panel 1: Feature name + descriptor + icon
  Panel 2: Next feature
  Panel 3: Next feature
[Product rotates/highlights as panels scroll]
```
Best for: showing multiple features of a single product without separate pages.

### Before/After Comparison

**For clinical/performance claims:**
- Side-by-side bar charts: standard mattress vs. calibrated
- Color code: muted neutral (standard) → accent (calibrated)
- Label: "Standard Mattress" / "Calibrated Mattress" — never "Before/After" (implies fault)
- Always include data source footnote
- Animation: bars grow from 0 on scroll-enter, linear easing, 0.8–1.2s

**For qualitative claims:**
- Split image slider (drag divider) — works for physical product changes
- Overlay animation (second state fades in over first)

### Testimonial Section

**Premium pattern (not a star-rating dump):**
- Large pull quote (32–40px, italic or light weight) as visual anchor
- Name + credential below (14px, muted)
- Photo: editorial crop, not passport headshot
- Context: "After 60 nights" / "Used by 50,000+ athletes"

**Carousel vs. grid:**
- Grid (2×3 or 3×2): shows volume, credibility through quantity
- Carousel: shows individual stories, pacing
- Best: auto-scroll carousel with pause on hover, large arrows for manual nav

**Avoid:**
- Star-rating logos everywhere (reads as Amazon)
- Generic headshots on white backgrounds
- Quotes that could apply to any product ("Changed my life!")
- Source: "— John D., New York" (no specificity = not believable)

### Clinical/Research Section

- White or light gray background — signals scientific neutrality
- Typography shifts to more neutral sans-serif weight
- Visuals: abstract data graphics, not stock lab photos
- Source citations visible and linked (trust signal)
- Expert portraits: professional, not stock headshots

### Press / Trust Logos

- Grayscale logos only (colored logos fight each other)
- Single row, horizontally scrolling on mobile
- Brief excerpt from the review below each logo: "Best mattress we've tested — TIME"
- Don't stack press logos with customer reviews — separate sections

---

## 10. Common Mistakes That Make Sites Feel Cheap

### Typography Killers
- 3+ typefaces
- Inconsistent weight logic across sections (bold h2, light h3, semi-bold h2 on next section)
- Tracking unchanged across sizes (large headlines need tight tracking)
- Line-height < 1.4 on body text
- Orphans in headlines (single word on last line at hero sizes)

### Spacing Killers
- Section padding varies per section (some 40px, some 80px, some 120px — random feel)
- Text touching the edge of cards (internal padding < 24px)
- Buttons with insufficient padding (height < 44px)
- Images at different aspect ratios across a grid

### Color Killers
- 3+ accent colors used for emphasis = no emphasis
- Gradient backgrounds (pastel mesh, blob shapes)
- Low contrast text (gray on white at < 4.5:1 — failing WCAG + looks washed out)
- Accent color on too many elements — loses salience

### Motion Killers
- Every element animates on scroll — eye never rests
- Long stagger delays (last card appears 0.5s+ after first = impatient users missed it)
- Animations that replay on scroll-up
- Heavy parallax on text columns (actively harmful to readability)
- Animations over 1s for simple reveals

### Copy Killers
- Buzzwords: "innovative," "cutting-edge," "revolutionary," "seamless"
- Vague claims without numbers: "dramatically improves sleep" (vs. "+37% muscle pressure distribution")
- Headers that describe rather than claim: "Our Technology" vs. "The Pod reads your body in real time"
- Generic CTAs: "Learn more" everywhere
- Wall-of-text paragraphs above the fold

### Visual Trust Killers
- Stock photography (people smiling at laptops, handshakes)
- Icons that look like they're from a free pack (mismatched stroke weights)
- Thin borders everywhere (border: 1px solid #e0e0e0 on every card = 2017 dashboard)
- Missing or fake testimonials (no credentials, no specifics)
- 5-star average with 3 reviews

### Technical Trust Killers
- Layout shift as page loads (images without aspect ratio containers)
- Text that flashes from system font to web font
- Hover states that are too dramatic (button changes color entirely on hover)
- Links with no underline and no color change — no affordance
- Mobile navigation that covers 80% of the screen

---

## Quick Reference: Tokens for Premium Health Tech

```css
/* Spacing */
--space-xs:  8px;
--space-sm:  16px;
--space-md:  32px;
--space-lg:  64px;
--space-xl:  96px;
--space-2xl: 128px;

/* Section padding */
--section-pad-y: clamp(64px, 8vw, 128px);
--section-pad-x: clamp(24px, 5vw, 120px);

/* Type scale (Golden Ratio 1.618) */
--text-xs:   11px;
--text-sm:   14px;
--text-base: 17px;
--text-lg:   20px;
--text-xl:   27px;
--text-2xl:  44px;
--text-3xl:  71px;
--text-hero: clamp(56px, 7vw, 120px);

/* Line heights */
--lh-display: 1.05;
--lh-heading: 1.2;
--lh-body:    1.6;

/* Letter spacing */
--ls-tight:    -0.03em;  /* display headlines */
--ls-normal:    0;        /* subheadings */
--ls-wide:     +0.08em;  /* eyebrows, small caps */

/* Animation */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--duration-reveal: 0.55s;
--duration-micro:  0.18s;

/* Glass */
--glass-bg:     rgba(255, 255, 255, 0.10);
--glass-blur:   blur(10px) saturate(1.15);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-rim:    rgba(255, 255, 255, 0.22);

/* Palette (near-monochrome premium) */
--surface:    #f0ede8;
--surface-2:  #e8e4de;
--ink-heavy:  #111111;
--ink-mid:    #444444;
--ink-light:  #888888;
--accent-1:   [brand primary];
--accent-2:   [data positive];
```

---

*Sources: Eight Sleep, Oura, WHOOP (Basic/DEPT case study), Apple, Dyson, Monotype type research, Baymard Institute, Nielsen Norman Group, GSAP documentation, hampusdesign.com, LogRocket UX, masterflowmaker.com spacing system.*
