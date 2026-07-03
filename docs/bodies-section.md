# Bodies Section — "Your body is Toned. Your mattress should be too."

> Full technical reference for the bodies-section: HTML structure, CSS (desktop + mobile), JS ticker animation, video lazy-load, and asset wiring.

---

## What it does

A full-bleed video card with an animated word ticker. The sentence reads:

> **Your body is [word]. Your mattress should be too.**

`[word]` cycles through: **Toned → Athletic → Plus-Sized → Slender → unique** — then loops. The video (`bodies.mp4`) restarts in sync with the word loop.

---

## Asset

| Asset | Path | Notes |
|---|---|---|
| Video | `02-bodies/bodies.mp4` | Full-body lifestyle shots. Loaded lazily via `data-src`. |

---

## HTML

```html
<!-- Bodies video: "Your body is unique. Your mattress should be too." -->
<section class="bodies-section" aria-label="Unique bodies">
  <div class="narrative-solution-card" id="bodies-card"
       style="justify-content:center;align-items:center">

    <video preload="none"
           class="narrative-solution-video"
           id="bodies-vid"
           data-src="02-bodies/bodies.mp4"
           muted playsinline autoplay>
    </video>

    <p class="narrative-solution"
       style="font-size:clamp(24px,3vw,52px);
              max-width:80%;
              text-align:center;
              padding:clamp(24px,3vw,48px)">
      Your body is
      <span class="body-word-wrap">
        <span class="body-word">Toned</span>
      </span>.<br>
      Your mattress should be too.
    </p>

  </div>
</section>
```

### Key details
- `preload="none"` + `data-src` — video is lazy-loaded by the global `IntersectionObserver` that swaps `data-src → src` on viewport entry.
- `id="bodies-vid"` — referenced by the ticker JS to sync word cycle with video playback.
- `.body-word-wrap` clips the sliding word. Width is set and transitioned by JS so the sentence doesn't reflow on word change.
- `.body-word` is the element that slides up/down during transitions.
- The card uses inline overrides (`justify-content:center; align-items:center`) so the text sits in the center of the card (unlike other narrative cards where text sits bottom-left).

---

## CSS — Desktop

```css
/* ── Section shell ── */
.bodies-section {
  padding: clamp(64px, 8vw, 120px) 0;
  background: #ffffff;
}

/* ── Card: 16:9 rounded card ── */
.narrative-solution-card {
  position: relative;
  width: calc(100% - 160px);   /* 80px margin each side */
  margin: 0 80px;
  aspect-ratio: 16 / 9;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.10);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  /* scroll-reveal state */
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 700ms cubic-bezier(0.16,1,0.3,1),
              transform 700ms cubic-bezier(0.16,1,0.3,1);
}
.narrative-solution-card.in-view {
  opacity: 1;
  transform: none;
}

/* ── Video: fills card, contain (shows full body) ── */
.narrative-solution-video {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: contain;   /* NOTE: contain, not cover — shows full video frame */
  z-index: 0;
}

/* ── Dark overlay gradient ── */
.narrative-solution-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, transparent 70%),
    rgba(0,0,0,0.09);
  z-index: 1;
}

/* ── Text overlay ── */
.narrative-solution {
  position: relative;
  z-index: 2;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(18px, 2.2vw, 36px);   /* base; bodies-section overrides to clamp(24px,3vw,52px) */
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: #ffffff;
  text-align: left;    /* bodies-section overrides to center */
  max-width: 72%;      /* bodies-section overrides to 80% */
  padding: clamp(24px, 3vw, 48px) clamp(28px, 4vw, 56px);
  opacity: 1;
  transform: none;
}

/* ── Animated word container ── */
.body-word-wrap {
  display: inline-block;
  overflow: hidden;         /* clips the sliding word */
  vertical-align: bottom;
  height: 1.2em;
  line-height: 1.2;
  position: relative;
  top: -2px;
  /* width is set per-word by JS and transitions on change */
}

/* ── The word itself ── */
.body-word {
  display: inline-block;
  white-space: nowrap;
  line-height: 1.2;
  font-size: inherit;
  font-weight: inherit;
  text-shadow: none;
}
```

---

## CSS — Mobile (max-width: 480px)

```css
@media (max-width: 480px) {

  /* Section: reduced vertical padding */
  .bodies-section {
    padding: 40px 0;
  }

  /* Text: larger clamped size for readability, full-width */
  .bodies-section .narrative-solution {
    font-size: 20px !important;
    max-width: 92% !important;
  }

  /* Word wrap + word: match text size */
  .bodies-section .body-word-wrap,
  .bodies-section .body-word {
    font-size: 20px !important;
    line-height: 1.2;
  }

  /* Nudge wrap up 0.5px to align baseline */
  .bodies-section .body-word-wrap {
    top: -0.5px;
  }

  /* Card: narrower margins, portrait aspect ratio, cover video */
  .narrative-solution-card {
    width: calc(100% - 32px);   /* 16px margin each side */
    margin: 0 16px;
    aspect-ratio: 4 / 5;        /* portrait on mobile */
    border-radius: 20px;
    align-items: flex-end;
    justify-content: center;
  }

  /* Video: cover fills portrait card */
  .narrative-solution-video {
    object-fit: cover;           /* cover on mobile (was contain on desktop) */
  }

  /* Text: centered, bottom-anchored, larger bottom padding */
  .narrative-solution {
    font-size: clamp(16px, 4.5vw, 22px);
    max-width: 92%;
    padding: 20px 20px 52px;
    text-align: center;
  }
}
```

### Desktop vs Mobile key differences

| Property | Desktop | Mobile |
|---|---|---|
| Card aspect ratio | `16 / 9` (landscape) | `4 / 5` (portrait) |
| Card margin | `0 80px` (80px each side) | `0 16px` (16px each side) |
| Card border-radius | `28px` | `20px` |
| Video object-fit | `contain` | `cover` |
| Text align | `center` (inline override) | `center` |
| Text max-width | `80%` | `92%` |
| Text font-size | `clamp(24px,3vw,52px)` | `20px` |
| Text padding | `clamp(24px,3vw,48px)` | `20px 20px 52px` |
| Section padding | `clamp(64px,8vw,120px) 0` | `40px 0` |

---

## JS — Word Ticker

```js
/* ── Body-word ticker (video-synced) ── */
(function() {
  const words = ['Toned', 'Athletic', 'Plus-Sized', 'Slender', 'unique'];
  const el   = document.querySelector('.body-word');
  const wrap = document.querySelector('.body-word-wrap');
  const vid  = document.getElementById('bodies-vid');
  if (!el || !wrap) return;

  // Measure natural rendered width of each word up front
  const widths = [];
  wrap.style.transition = 'none';
  wrap.style.width = '';
  words.forEach(function(w) {
    el.textContent = w;
    widths.push(wrap.getBoundingClientRect().width);
  });

  var cycleTimer  = null;
  var isFirstRun  = true;

  // Snap to first word with no animation (first play only)
  function snapToFirst() {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
    el.style.transition = 'none';
    el.style.transform  = 'translateY(0)';
    el.style.opacity    = '1';
    el.textContent = words[0];
    wrap.style.transition = 'none';
    wrap.style.width = widths[0] + 'px';
    // Re-enable width transition after a double rAF flush
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        wrap.style.transition = 'width 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  // Animate from current word to next word
  function animateTo(nextIdx) {
    // 1. Expand/contract wrap to new word's width immediately
    wrap.style.width = widths[nextIdx] + 'px';

    // 2. Slide current word UP and fade out (ease-in, fast exit)
    el.style.transition = 'transform 0.28s cubic-bezier(0.4,0,1,1), opacity 0.22s ease';
    el.style.transform  = 'translateY(-115%)';
    el.style.opacity    = '0';

    // 3. After exit completes: swap text, position below, then slide UP into place
    setTimeout(function() {
      el.style.transition = 'none';
      el.style.transform  = 'translateY(115%)';   // start below the clip
      el.style.opacity    = '0';
      el.textContent = words[nextIdx];
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          // ease-out, soft settle
          el.style.transition = 'transform 0.28s cubic-bezier(0,0,0.2,1), opacity 0.22s ease';
          el.style.transform  = 'translateY(0)';
          el.style.opacity    = '1';
        });
      });
    }, 280);   // matches exit duration
  }

  function startCycle() {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
    if (isFirstRun) {
      isFirstRun = false;
      snapToFirst();    // first play: snap Toned in with no animation
    } else {
      animateTo(0);     // loop restart: unique slides up, Toned comes from bottom
    }

    var idx = 0;
    // "Toned" holds for 0.9s before cycle starts
    setTimeout(function() {
      cycleTimer = setInterval(function() {
        idx++;
        animateTo(idx);
        if (idx >= words.length - 1) {
          // Reached "unique" — stop the interval
          clearInterval(cycleTimer);
          cycleTimer = null;
          // "unique" holds for 3s, then restart video (which triggers startCycle via 'play' event)
          setTimeout(function() {
            if (vid) {
              vid.currentTime = 0;
              vid.play();         // fires 'play' event → startCycle()
            } else {
              startCycle();       // fallback if no video
            }
          }, 3000);
        }
      }, 900);   // 900ms per word
    }, 900);     // initial 900ms dwell on "Toned"
  }

  // Tie cycle start to video play event (handles both first load and loop)
  if (vid) {
    vid.addEventListener('play', function() {
      if (vid.currentTime < 0.5) startCycle();
    });
  } else {
    startCycle();   // no video — run ticker standalone
  }
})();
```

### Timing breakdown

| Stage | Duration | Notes |
|---|---|---|
| First word dwell (Toned) | 900ms | `setTimeout` before `setInterval` fires |
| Each subsequent word | 900ms | `setInterval` cadence |
| Word exit animation | 280ms | slides up + fades |
| Word enter animation | 280ms | comes up from below + fades in |
| Final word dwell (unique) | 3000ms | `setTimeout` after interval cleared |
| Total cycle | ~5.4s | 900ms × 5 words + 3000ms unique hold |

### Width transition

The `.body-word-wrap` width is pre-measured for every word at init via `getBoundingClientRect()`. On each word change `wrap.style.width` jumps to the new word's measured width — the CSS transition `width 0.32s cubic-bezier(0.4, 0, 0.2, 1)` animates the container so the surrounding text doesn't jump.

### Video sync

The ticker doesn't use a timer to loop — it restarts by setting `vid.currentTime = 0` and calling `vid.play()`, which fires the `'play'` event. The `'play'` listener calls `startCycle()` only if `currentTime < 0.5` (guards against false triggers mid-play). This keeps video frames and word positions in sync across loops.

---

## Video lazy-load

The video uses `preload="none"` and `data-src` rather than `src`. The global IntersectionObserver swaps `data-src → src` when the element enters the viewport. After the `src` is set, this fires separately:

```js
// Bodies video: play on loadedmetadata
const bv = document.getElementById('bodies-vid');
if (bv) {
  bv.addEventListener('loadedmetadata', () => bv.play().catch(() => {}));
}
```

`loadedmetadata` is used (not `canplay`) because browsers on mobile often stall at `canplay` for muted autoplay. `.catch(() => {})` silently swallows autoplay policy blocks.

---

## Scroll-reveal

The card (`#bodies-card` / `.narrative-solution-card`) enters with opacity + translateY:

- Start: `opacity: 0; transform: translateY(28px)`
- End: `opacity: 1; transform: none`
- Easing: `cubic-bezier(0.16,1,0.3,1)` (fast-out soft-settle)
- Duration: `700ms`
- Trigger: `IntersectionObserver` adds `.in-view` class at 20% viewport entry

---

## Word list

```js
['Toned', 'Athletic', 'Plus-Sized', 'Slender', 'unique']
```

The last word `'unique'` is lowercase by design — it reads as a pivot from body types into the brand claim ("Your body is **unique**.").
