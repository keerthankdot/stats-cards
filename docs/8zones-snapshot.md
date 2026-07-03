# 8-Zone Section — Snapshot

## Image

**Active image:** `07-8zones/8zones check.png`
**Previous image:** `07-8zones/8zones new.png`

---

## HTML Structure

```html
<div class="zone-intro">
  <p class="zone-intro__desc reveal">
    Your Body's Pressure Distribution Is Spread Across
    <span class="zi-purple" style="color:#553C9A">8 Spinal Zones</span>
  </p>
  <p class="zone-intro__sub reveal">
    <span style="color:#553C9A">Calibr8</span> configures each zone
    <br class="zone-sub-br"> for balanced support
  </p>
</div>

<div class="zone-map">
  <img loading="lazy" class="zone-map__img" src="07-8zones/8zones check.png" alt="Calibr8 8-zone mattress">
  <div class="zone-tooltip" id="zone-tooltip">
    <div class="zone-tooltip__num"></div>
    <div class="zone-tooltip__name"></div>
    <div class="zone-tooltip__bar-track"><div class="zone-tooltip__bar-fill"></div></div>
    <div class="zone-tooltip__footer">
      <span class="zone-tooltip__firmness"></span>
      <span class="zone-tooltip__code"></span>
    </div>
  </div>

  <!-- 8 zone dots in DOM order (Head → Foot) -->
  <button class="zone-dot" style="left:calc(40% + 151.5px);top:calc(34.4% - 81px);--beat-delay:0s"    aria-label="Head">
  <button class="zone-dot" style="left:calc(41% + 153px);top:calc(34.4% - 36px);--beat-delay:0.28s"   aria-label="Shoulder">
  <button class="zone-dot" style="left:calc(42% + 159.5px);top:calc(34.4% + 9px);--beat-delay:0.56s"  aria-label="Upper Back">
  <button class="zone-dot" style="left:calc(43% + 166px);top:calc(34.4% + 54px);--beat-delay:0.84s"   aria-label="Lumbar">
  <button class="zone-dot" style="left:calc(44% + 171.5px);top:calc(34.4% + 99px);--beat-delay:1.12s" aria-label="Pelvic">
  <button class="zone-dot" style="left:calc(45% + 178px);top:calc(34.4% + 144px);--beat-delay:1.4s"   aria-label="Thigh">
  <button class="zone-dot" style="left:calc(46% + 184.5px);top:calc(34.4% + 189px);--beat-delay:1.68s" aria-label="Leg">
  <button class="zone-dot" style="left:calc(47.1% + 191px);top:calc(34.4% + 232px);--beat-delay:1.96s" aria-label="Foot">
</div>
```

---

## Desktop Dot Positions

Calibrated at reference zone-map width **W_REF = 1120px** (1280px viewport − 160px margins).

All dots share the same top anchor: `top: calc(34.4% + offset_px)`.
Left formula: `left: calc(X% + N_px)`.

| # | Label      | left                      | top                        | beat-delay |
|---|------------|---------------------------|----------------------------|------------|
| 1 | Head       | `calc(40%   + 151.5px)`   | `calc(34.4% - 81px)`       | 0s         |
| 2 | Shoulder   | `calc(41%   + 153px)`     | `calc(34.4% - 36px)`       | 0.28s      |
| 3 | Upper Back | `calc(42%   + 159.5px)`   | `calc(34.4% + 9px)`        | 0.56s      |
| 4 | Lumbar     | `calc(43%   + 166px)`     | `calc(34.4% + 54px)`       | 0.84s      |
| 5 | Pelvic     | `calc(44%   + 171.5px)`   | `calc(34.4% + 99px)`       | 1.12s      |
| 6 | Thigh      | `calc(45%   + 178px)`     | `calc(34.4% + 144px)`      | 1.4s       |
| 7 | Leg        | `calc(46%   + 184.5px)`   | `calc(34.4% + 189px)`      | 1.68s      |
| 8 | Foot       | `calc(47.1% + 191px)`     | `calc(34.4% + 232px)`      | 1.96s      |

### Desktop drift correction (1400px–481px viewports)
```css
@media (max-width: 1400px) and (min-width: 481px) {
  .zone-dot {
    transform: translate(
      calc(-50% - clamp(0px, (1280px - (100vw - 160px)) * 0.13, 80px)),
      -50%
    );
  }
}
```
At ≥1401px: `transform: translate(-50%, -50%)` (default).

---

## Mobile Dot Positions (< 768px)

Mobile dots are repositioned by JS at runtime based on the image's natural dimensions.

**Reference formula (per dot `i`, zero-indexed):**

1. Desktop absolute pixel position:
   ```
   left_px = (x / 100) * W_REF + n
   top_px  = 0.344 * H_container_ref + m
   ```
   where `H_container_ref = (naturalHeight * W_REF / naturalWidth) - 110`

2. Convert to % of full image:
   ```
   img_x_pct = left_px / W_REF * 100
   img_y_pct = (top_px + 100) / naturalHeight_scaled * 100
   ```

3. Apply stagger offsets:
   ```
   left = calc(img_x_pct% + (i * 5)px)   /* rightward per dot */
   top  = calc(img_y_pct% - (i * 5)px)   /* upward per dot, brings dots closer together */
   ```

**DOT_DATA params used for mobile conversion:**

| # | Label      | x (%)  | n (px)  | m (px) |
|---|------------|--------|---------|--------|
| 1 | Head       | 40     | 151.5   | -81    |
| 2 | Shoulder   | 41     | 153     | -36    |
| 3 | Upper Back | 42     | 159.5   |  +9    |
| 4 | Lumbar     | 43     | 166     | +54    |
| 5 | Pelvic     | 44     | 171.5   | +99    |
| 6 | Thigh      | 45     | 178     | +144   |
| 7 | Leg        | 46     | 184.5   | +189   |
| 8 | Foot       | 47.1   | 191     | +232   |

**Mobile dot size (≤767px):**
```css
.zone-dot__ring   { width: 16px; height: 16px; }
.zone-dot__center { width: 9px;  height: 9px; }
```

**Mobile zone-map container (≤767px):**
```css
.zone-map {
  width: calc(100% - 32px);
  margin: 0 16px;
  border-radius: 16px;
  aspect-ratio: 4/5;
  overflow: hidden;
}
.zone-map__img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
}
```

---

## Tooltip position

- **Desktop:** `right: calc(5% + 50px); top: 50%;` — appears to the left of dots
- **Mobile:** `left: 50%; top: 16px; transform: translateX(-50%);` — centered at top of map

---

## Mobile Dot Positions — Pre-computed

Computed from image natural dimensions **5504 × 3072 px**.

```
H_img_ref = 3072 × 1120 / 5504 = 625.12 px
H_c_ref   = 625.12 − 110        = 515.12 px
top_base  = 0.344 × 515.12      = 177.20 px
```

These are the exact `left` / `top` values the JS sets on each dot on mobile (< 768px):

| # | Label      | `left` (JS output)        | `top` (JS output)         |
|---|------------|---------------------------|---------------------------|
| 1 | Head       | `calc(53.53% + 0px)`      | `calc(31.39% - 0px)`      |
| 2 | Shoulder   | `calc(54.66% + 5px)`      | `calc(38.58% - 5px)`      |
| 3 | Upper Back | `calc(56.24% + 10px)`     | `calc(45.78% - 10px)`     |
| 4 | Lumbar     | `calc(57.82% + 15px)`     | `calc(52.98% - 15px)`     |
| 5 | Pelvic     | `calc(59.31% + 20px)`     | `calc(60.18% - 20px)`     |
| 6 | Thigh      | `calc(60.89% + 25px)`     | `calc(67.38% - 25px)`     |
| 7 | Leg        | `calc(62.47% + 30px)`     | `calc(74.58% - 30px)`     |
| 8 | Foot       | `calc(64.15% + 35px)`     | `calc(81.46% - 35px)`     |

---

## Tooltip Zone Data (ZONES array)

```javascript
const ZONES = [
  { num: 'Zone 01', name: 'Head',       fill: 30, firmness: 'Soft',   code: 'S2' },
  { num: 'Zone 02', name: 'Shoulder',   fill: 52, firmness: 'Medium', code: 'M3' },
  { num: 'Zone 03', name: 'Upper Back', fill: 62, firmness: 'Medium', code: 'M4' },
  { num: 'Zone 04', name: 'Lumbar',     fill: 72, firmness: 'Firm',   code: 'F5' },
  { num: 'Zone 05', name: 'Pelvic',     fill: 58, firmness: 'Firm',   code: 'F4' },
  { num: 'Zone 06', name: 'Thigh',      fill: 48, firmness: 'Medium', code: 'M3' },
  { num: 'Zone 07', name: 'Leg',        fill: 30, firmness: 'Soft',   code: 'S2' },
  { num: 'Zone 08', name: 'Foot',       fill: 18, firmness: 'Soft',   code: 'S1' },
];
```

Cycles every 3000ms. Dot click pauses; outside click resumes.
