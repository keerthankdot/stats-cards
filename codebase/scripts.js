
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.bar').forEach(bar => {
    const total = Number(bar.dataset.total) || 20;
    const fill  = Number(bar.dataset.fill)  || 0;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const seg = document.createElement('span');
      seg.className = 'bar__seg';
      if (i < fill) seg.dataset.on = '1';
      frag.appendChild(seg);
    }
    bar.appendChild(frag);
  });

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function countTo(el, target, duration, suffix = '') {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(target * easeOutCubic(t));
      el.textContent = v + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  function animateBars(card) {
    const rows = card.querySelectorAll('.row');
    const cardFadeOffset = 280;
    const baselineDur = 1200;
    const optimizedDur = 1500;
    const gapBetweenRows = 200;
    const rowDurs = [baselineDur, optimizedDur];
    const rowStarts = [
      cardFadeOffset,
      cardFadeOffset + baselineDur + gapBetweenRows
    ];

    rows.forEach((row, idx) => {
      const rowStart = rowStarts[idx];
      const rowDur = rowDurs[idx];
      const segs = [...row.querySelectorAll('.bar__seg[data-on="1"]')];
      const perSeg = segs.length > 0 ? (rowDur / segs.length) : 0;

      segs.forEach((seg, i) => {
        setTimeout(() => seg.classList.add('is-on'), rowStart + i * perSeg);
      });

      const pct = row.querySelector('.row__percent');
      setTimeout(() => countTo(pct, Number(pct.dataset.target), rowDur, '%'), rowStart);
    });

    const dv = card.querySelector('.delta__value');
    setTimeout(() => countTo(dv, Number(dv.dataset.target), 1100), rowStarts[1]);
  }

  function countToLinear(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(target * t);
      el.textContent = v;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  function animateGraph(card) {
    const seg1 = card.querySelector('.graph__line--seg1');
    const seg2 = card.querySelector('.graph__line--seg2');
    const seg3 = card.querySelector('.graph__line--seg3');
    const dots   = card.querySelectorAll('.graph__dot');
    const labels = card.querySelectorAll('.graph__label');
    const dv     = card.querySelector('.delta__value');

    // Flanking lines and dots/labels appear instantly
    seg1.style.strokeDashoffset = 0;
    seg3.style.strokeDashoffset = 0;
    dots.forEach(d => d.classList.add('is-on'));
    labels.forEach(l => l.classList.add('is-on'));

    // Only the segment between the two plotted points draws in
    const len = seg2.getTotalLength();
    seg2.style.transition       = 'none';
    seg2.style.strokeDasharray  = len;
    seg2.style.strokeDashoffset = len;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      seg2.style.transition     = `stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)`;
      seg2.style.strokeDashoffset = 0;
    }));

    countToLinear(dv, Number(dv.dataset.target), 700);
  }

  function snapGraph(card) {
    card.querySelectorAll('.graph__line').forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = 0; });
    card.querySelectorAll('.graph__dot').forEach(d => d.classList.add('is-on'));
    card.querySelectorAll('.graph__label').forEach(l => l.classList.add('is-on'));
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function animateGauge(card) {
    const outer = card.querySelector('.gauge__arc--outer-fill');
    const inner = card.querySelector('.gauge__arc--inner-fill');
    const dots = card.querySelectorAll('.gauge__dot');
    const labels = card.querySelectorAll('.gauge__label');
    const dv = card.querySelector('.delta__value');
    const target = Number(dv.dataset.target);

    const Li = inner.getTotalLength();
    const Lo = outer.getTotalLength();
    const LT = Li + Lo;

    [inner, outer].forEach(p => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = L;
      p.style.strokeDashoffset = L;
    });

    const totalDur = 2800;
    const offset = 320;
    const di = totalDur * (Li / LT);  // inner (standard) draws first — shorter
    const doo = totalDur * (Lo / LT); // outer (calibrated) draws second — longer

    // Standard (inner arc, baseline) draws first
    setTimeout(() => {
      inner.style.transition = `stroke-dashoffset ${di}ms linear`;
      inner.style.strokeDashoffset = 0;
    }, offset);

    setTimeout(() => dots[0].classList.add('is-on'), offset + di - 60);
    setTimeout(() => labels[0].classList.add('is-on'), offset + di + 40);

    // Calibrated (outer arc, improvement) draws second
    setTimeout(() => {
      outer.style.transition = `stroke-dashoffset ${doo}ms linear`;
      outer.style.strokeDashoffset = 0;
    }, offset + di);

    setTimeout(() => dots[1].classList.add('is-on'), offset + di + doo - 60);
    setTimeout(() => labels[1].classList.add('is-on'), offset + di + doo + 40);

    setTimeout(() => countToLinear(dv, target, totalDur), offset);
  }

  function snapGauge(card) {
    card.querySelectorAll('.gauge__arc').forEach(p => { p.style.strokeDashoffset = 0; });
    card.querySelectorAll('.gauge__dot').forEach(d => d.classList.add('is-on'));
    card.querySelectorAll('.gauge__label').forEach(l => l.classList.add('is-on'));
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function animateVbars(card) {
    const fills = card.querySelectorAll('.vbar__fill');
    const dv = card.querySelector('.delta__value');
    const target = Number(dv.dataset.target);
    fills.forEach((fill, i) => {
      setTimeout(() => fill.classList.add('is-on'), 350 + i * 300);
    });
    setTimeout(() => countToLinear(dv, target, 2000), 350);
  }

  function snapVbars(card) {
    card.querySelectorAll('.vbar__fill').forEach(f => f.classList.add('is-on'));
    const dv = card.querySelector('.delta__value');
    if (dv) dv.textContent = dv.dataset.target;
  }

  function animateRings(card) {
    const fills = card.querySelectorAll('.ring__fill');
    const dv = card.querySelector('.delta__value');
    const target = Number(dv.dataset.target);

    fills.forEach(fill => {
      const r = Number(fill.getAttribute('r'));
      const circ = 2 * Math.PI * r;
      fill.style.strokeDasharray = circ;
      fill.style.strokeDashoffset = circ;
    });

    fills.forEach((fill, i) => {
      const r = Number(fill.getAttribute('r'));
      const circ = 2 * Math.PI * r;
      const pct = Number(fill.dataset.pct) / 100;
      setTimeout(() => {
        fill.style.transition = `stroke-dashoffset 1600ms linear`;
        fill.style.strokeDashoffset = circ * (1 - pct);
      }, 200 + i * 400);
    });

    setTimeout(() => countToLinear(dv, target, 2000), 200);
  }

  function snapRings(card) {
    card.querySelectorAll('.ring__fill').forEach(fill => {
      const r = Number(fill.getAttribute('r'));
      const circ = 2 * Math.PI * r;
      fill.style.strokeDasharray = circ;
      fill.style.strokeDashoffset = circ * (1 - Number(fill.dataset.pct) / 100);
    });
    const dv = card.querySelector('.delta__value');
    if (dv) dv.textContent = dv.dataset.target;
  }

  function snapBars(card) {
    card.querySelectorAll('.row').forEach(row => {
      row.querySelectorAll('.bar__seg[data-on="1"]').forEach(s => s.classList.add('is-on'));
      const pct = row.querySelector('.row__percent');
      pct.textContent = pct.dataset.target + '%';
    });
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function animateArc(card) {
    const segA = card.querySelector('.arc__seg--a');
    const segB = card.querySelector('.arc__seg--b');
    const segC = card.querySelector('.arc__seg--c');
    const dots   = card.querySelectorAll('.arc__dot');
    const labels = card.querySelectorAll('.arc__label');
    const dv     = card.querySelector('.delta__value');

    // Flanking segments and dots/labels appear instantly
    segA.style.strokeDashoffset = 0;
    segC.style.strokeDashoffset = 0;
    dots.forEach(d => d.classList.add('is-on'));
    labels.forEach(l => l.classList.add('is-on'));
    const stem = card.querySelector('.arc__stem--cal');
    if (stem) stem.classList.add('is-on');

    // Only the glow segment between the two plotted points draws in
    const len = segB.getTotalLength();
    segB.style.transition       = 'none';
    segB.style.strokeDasharray  = len;
    segB.style.strokeDashoffset = len;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      segB.style.transition     = `stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)`;
      segB.style.strokeDashoffset = 0;
    }));

    countToLinear(dv, Number(dv.dataset.target), 1000);
  }

  function snapArc(card) {
    card.querySelectorAll('.arc__seg').forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = 0; });
    card.querySelectorAll('.arc__dot').forEach(d => d.classList.add('is-on'));
    card.querySelectorAll('.arc__label').forEach(l => l.classList.add('is-on'));
    card.querySelectorAll('.arc__stem').forEach(s => s.classList.add('is-on'));
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function animateLines(card) {
    const stdLine = card.querySelector('.sleep-line--std');
    const calLine = card.querySelector('.sleep-line--cal');
    const clipRect = card.querySelector('.sleep-reveal-rect');
    const dv = card.querySelector('.delta__value');
    const dur = 1400;

    [stdLine, calLine].forEach(p => {
      const l = p.getTotalLength();
      p.style.strokeDasharray  = l;
      p.style.strokeDashoffset = l;
    });
    clipRect.setAttribute('width', '0');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      [stdLine, calLine].forEach(p => {
        p.style.transition = `stroke-dashoffset ${dur}ms linear`;
        p.style.strokeDashoffset = 0;
      });
      const t0 = performance.now();
      (function tick(now) {
        const t = Math.min(1, (now - t0) / dur);
        clipRect.setAttribute('width', t * 300);
        if (t < 1) requestAnimationFrame(tick);
        else clipRect.setAttribute('width', 300);
      })(performance.now());
    }));

    setTimeout(() => countToLinear(dv, Number(dv.dataset.target), dur), 200);
  }

  function snapLines(card) {
    const stdLine = card.querySelector('.sleep-line--std');
    const calLine = card.querySelector('.sleep-line--cal');
    const clipRect = card.querySelector('.sleep-reveal-rect');
    [stdLine, calLine].forEach(p => { p.style.strokeDashoffset = 0; });
    clipRect.setAttribute('width', 300);
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function animateBarsReduce(card) {
    const rows = card.querySelectorAll('.row');
    const total = 20;
    const reduceDur = 800;

    // Both rows start fully at 100%
    [rows[0], rows[1]].forEach(row => {
      row.querySelectorAll('.bar__seg').forEach(s => s.classList.add('is-on'));
      row.querySelector('.row__percent').textContent = '100%';
    });

    function reduceRow(row, targetFill, targetPct, startDelay) {
      const segs = [...row.querySelectorAll('.bar__seg')];
      const removeCount = total - targetFill;
      for (let i = total - 1; i >= targetFill; i--) {
        setTimeout(() => segs[i].classList.remove('is-on'), startDelay + (total - 1 - i) * (reduceDur / removeCount));
      }
      const pct = row.querySelector('.row__percent');
      setTimeout(() => {
        const t0 = performance.now();
        (function tick(now) {
          const t = Math.min(1, (now - t0) / reduceDur);
          const e = 1 - Math.pow(1 - t, 3);
          pct.textContent = Math.round(100 - (100 - targetPct) * e) + '%';
          if (t < 1) requestAnimationFrame(tick);
          else pct.textContent = targetPct + '%';
        })(performance.now());
      }, startDelay);
    }

    const baseFill = Number(rows[0].querySelector('.bar').dataset.fill);
    const optFill  = Number(rows[1].querySelector('.bar').dataset.fill);
    const basePct  = Number(card.dataset.baseline);
    const optPct   = Number(card.dataset.optimized);

    const start = 500;
    reduceRow(rows[0], baseFill, basePct, start);
    reduceRow(rows[1], optFill, optPct, start);

    const dv = card.querySelector('.delta__value');
    setTimeout(() => countTo(dv, Number(dv.dataset.target), reduceDur), start);
  }

  function snapBarsReduce(card) {
    const rows = card.querySelectorAll('.row');
    const baseFill = Number(rows[0].querySelector('.bar').dataset.fill);
    const optFill  = Number(rows[1].querySelector('.bar').dataset.fill);
    [...rows[0].querySelectorAll('.bar__seg')].slice(0, baseFill).forEach(s => s.classList.add('is-on'));
    rows[0].querySelector('.row__percent').textContent = card.dataset.baseline + '%';
    [...rows[1].querySelectorAll('.bar__seg')].slice(0, optFill).forEach(s => s.classList.add('is-on'));
    rows[1].querySelector('.row__percent').textContent = card.dataset.optimized + '%';
    const dv = card.querySelector('.delta__value');
    dv.textContent = dv.dataset.target;
  }

  function revealCard(card) {
    if (card.dataset.revealed === '1') return;
    card.dataset.revealed = '1';

    const delay = Number(card.dataset.delay) || 0;
    card.style.setProperty('--card-delay', delay + 'ms');
    requestAnimationFrame(() => card.classList.add('is-revealed'));

    const kind = card.dataset.kind || 'bars';

    if (prefersReduced) {
      if (kind === 'vbars') snapVbars(card);
      else if (kind === 'rings') snapRings(card);
      else if (kind === 'arc') snapArc(card);
      else if (kind === 'graph') snapGraph(card);
      else if (kind === 'gauge') snapGauge(card);
      else if (kind === 'reduce') snapBarsReduce(card);
      else if (kind === 'lines') snapLines(card);
      else snapBars(card);
      return;
    }
    if (kind === 'vbars') animateVbars(card);
    else if (kind === 'rings') animateRings(card);
    else if (kind === 'arc') animateArc(card);
    else if (kind === 'graph') animateGraph(card);
    else if (kind === 'gauge') animateGauge(card);
    else if (kind === 'reduce') animateBarsReduce(card);
    else if (kind === 'lines') animateLines(card);
    else animateBars(card);
  }

  const cards = document.querySelectorAll('.stat-card');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          revealCard(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(revealCard);
  }

  // ── Scroll reveal (bidirectional) ──
  {
    const revEls = Array.from(document.querySelectorAll('.reveal'));
    function updateReveal() {
      const vh = window.innerHeight;
      revEls.forEach(el => {
        const { top, bottom } = el.getBoundingClientRect();
        el.classList.toggle('is-visible', top < vh * 0.85 && bottom > 50);
      });
    }
    window.addEventListener('scroll', updateReveal, { passive: true });
    requestAnimationFrame(() => requestAnimationFrame(updateReveal));
  }

  // ── Narrative simple reveals ──
  {
    const simpleEls = Array.from(document.querySelectorAll(
      '.narrative-solution-card'
    ));
    if (simpleEls.length) {
      const nObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            nObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      simpleEls.forEach(el => nObs.observe(el));
    }
  }

  // ── Problem stat (32% truth) — word stagger like life-stat ──
  {
    const pSection = document.querySelector('.problem-stat-section');
    if (pSection) {
      const pStat  = pSection.querySelector('.problem-stat');
      const pWords = Array.from(pSection.querySelectorAll('.pst-w'));
      const pCountEl = document.getElementById('pst-count');
      const pObs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        pStat.classList.add('is-visible');
        pWords.forEach((w, i) => {
          setTimeout(() => { w.style.transitionDelay = '0ms'; w.style.opacity = '1'; w.style.transform = 'none'; }, 300 + i * 120);
        });
        // count-up 0→32
        if (pCountEl) {
          const start = performance.now();
          const dur = 1200;
          (function tick(now) {
            const t = Math.min(1, (now - start) / dur);
            pCountEl.textContent = Math.round(32 * (1 - Math.pow(1 - t, 3)));
            if (t < 1) requestAnimationFrame(tick);
            else pCountEl.textContent = '32';
          })(performance.now());
        }
        pObs.disconnect();
      }, { threshold: 0.3 });
      pObs.observe(pSection);
    }
  }

  // ── Bodies video: play on load ──
  {
    const bv = document.getElementById('bodies-vid');
    if (bv) {
      bv.addEventListener('loadedmetadata', () => bv.play().catch(() => {}));
    }
  }

  // ── Solution section: heroGIF.mp4 last-5s loop ──
  {
    const sv = document.getElementById('solution-vid');
    if (sv) {
      sv.addEventListener('loadedmetadata', () => { sv.play().catch(() => {}); });
    }
  }

  // ── Pain text section: fade in on scroll ──
  {
    const pt = document.getElementById('pain-text');
    if (pt) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { pt.classList.add('is-visible'); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(pt);
    }
  }

  // ── Life stat section animation ──
  {
    const section = document.querySelector('.life-stat-section');
    if (section) {
      const youSpend = document.getElementById('lst-you-spend');
      const pctEl    = document.getElementById('lst-pct');
      const countEl  = document.getElementById('lst-count');
      const words    = Array.from(section.querySelectorAll('.lst-w'));
      // words after "you spend" and "32%": starting from index 2 (lst-of onward)
      const afterPct = words.slice(2);
      const countDur = prefersReduced ? 0 : 1200;
      const stagger  = prefersReduced ? 0 : 120;
      let fired = false;

      function runLifeStat() {
        if (fired) return;
        fired = true;

        // Whole block fades up at once
        const lifeStat = section.querySelector('.life-stat');
        lifeStat.classList.add('is-visible');

        // 32% counts up simultaneously
        if (prefersReduced) {
          countEl.textContent = '32';
        } else {
          const start = performance.now();
          (function tick(now) {
            const t = Math.min(1, (now - start) / countDur);
            countEl.textContent = Math.round(32 * (1 - Math.pow(1 - t, 3)));
            if (t < 1) requestAnimationFrame(tick);
            else countEl.textContent = '32';
          })(performance.now());
        }
      }

      const lsObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { runLifeStat(); lsObs.disconnect(); }
      }, { threshold: 0.3 });
      lsObs.observe(section);
    }


  }

  // ── Shared utilities ──
  function cloneCard(src, suffix) {
    const clone = src.cloneNode(true);
    // Remap all IDs to unique names so url(#...) gradient refs don't collide
    const idMap = {};
    clone.querySelectorAll('[id]').forEach(el => {
      const newId = el.id + suffix;
      idMap[el.id] = newId;
      el.id = newId;
    });
    clone.querySelectorAll('*').forEach(el => {
      ['stroke','fill','filter'].forEach(attr => {
        const v = el.getAttribute(attr);
        if (v && v.startsWith('url(#')) {
          const old = v.slice(5, -1);
          if (idMap[old]) el.setAttribute(attr, `url(#${idMap[old]})`);
        }
      });
    });
    clone.dataset.revealed = '';
    clone.classList.remove('is-revealed');
    clone.style.removeProperty('--card-delay');
    clone.querySelectorAll('.is-on').forEach(el => el.classList.remove('is-on'));
    clone.querySelectorAll('.delta__value').forEach(el => el.textContent = '0');
    clone.querySelectorAll('.row__percent').forEach(el => el.textContent = '0%');
    clone.querySelectorAll('.sleep-reveal-rect').forEach(r => r.setAttribute('width', '0'));
    clone.querySelectorAll('[style]').forEach(el => {
      ['stroke-dashoffset','stroke-dasharray','transition','height'].forEach(p => el.style.removeProperty(p));
    });
    clone.removeAttribute('aria-labelledby');
    clone.removeAttribute('aria-describedby');
    return clone;
  }

  // ── Carousel (initialise all instances) ──
  function initCarousel(section, suffix, extraClass) {
    const track = section.querySelector('.carousel__track');
    const STATES = ['c-center','c-left','c-right','c-exit','c-enter','c-hidden'];
    const N = 6;
    const cCards = [];
    document.querySelectorAll('#stats-grid .stat-card').forEach((src, i) => {
      const clone = cloneCard(src, `${suffix}${i}`);
      clone.classList.add('carousel-card', 'c-hidden');
      if (extraClass) clone.classList.add(extraClass);
      // Scale content to fit the smaller card
      const vh = window.innerHeight, vw = window.innerWidth;
      const newCard  = Math.min((vh - 80) * 0.56, (Math.min(vw, 1440) - 48) / 5);
      const origCard = Math.min((vh - 80) * 0.72, (Math.min(vw, 1320) - 64) / 3);
      const scale    = newCard / origCard;
      const inv      = 1 / scale;
      const cardPad  = Math.min(22, Math.max(16, vw * 0.02));
      const scaler   = document.createElement('div');
      scaler.style.cssText = [
        'position:absolute', 'top:0', 'left:0',
        `width:${inv * 100}%`, `height:${inv * 100}%`,
        `transform:scale(${scale})`, 'transform-origin:top left',
        `padding:${cardPad}px`, 'box-sizing:border-box',
        'display:flex', 'flex-direction:column'
      ].join(';') + ';';
      while (clone.firstChild) scaler.appendChild(clone.firstChild);
      clone.appendChild(scaler);
      track.appendChild(clone);
      cCards.push(clone);
    });
    function stateFor(idx, active) {
      const d = ((idx - active) % N + N) % N;
      if (d === 0) return 'c-center';
      if (d === 1) return 'c-right';
      if (d === N-1) return 'c-left';
      return 'c-hidden';
    }
    function applyState(card, state, instant) {
      if (instant) card.style.transition = 'none';
      STATES.forEach(s => card.classList.remove(s));
      card.classList.add(state);
      if (instant) { card.getBoundingClientRect(); card.style.transition = ''; }
    }
    let active = 0, advancing = false;
    function setAll(a) { cCards.forEach((c,i) => applyState(c, stateFor(i,a))); }
    function clearViz(card) {
      card.dataset.revealed = '';
      card.querySelectorAll('.is-on').forEach(el => el.classList.remove('is-on'));
      card.querySelectorAll('.delta__value').forEach(el => { if (el.dataset.target) el.textContent = '0'; });
      card.querySelectorAll('.row__percent').forEach(el => el.textContent = '0%');
      card.querySelectorAll('.sleep-reveal-rect').forEach(r => r.setAttribute('width', '0'));
      card.querySelectorAll('[style]').forEach(el => {
        ['stroke-dashoffset','stroke-dasharray','transition','height'].forEach(p => el.style.removeProperty(p));
      });
      card.querySelectorAll('.arc__seg--glow, .graph__line--glow').forEach(el => {
        el.style.strokeDasharray = '9999';
        el.style.strokeDashoffset = '9999';
      });
    }
    function advance() {
      if (advancing) return;
      advancing = true;
      const next = (active+1)%N;
      const hiddenIdx = (active+N-2)%N;
      applyState(cCards[hiddenIdx], 'c-hidden', true);
      active = next; setAll(active);
      revealCard(cCards[active]);
      setTimeout(() => { advancing = false; }, 580);
      setTimeout(advance, 3000);
    }
    let started = false;
    const cio = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true; cio.disconnect();
      cCards.forEach((c,i) => applyState(c, stateFor(i,active), true));
      revealCard(cCards[active]);
      cCards[(active+N-1)%N].classList.add('is-revealed');
      cCards[(active+1)%N].classList.add('is-revealed');
      setTimeout(advance, 3000);
    }, { threshold: 0.3 });
    cio.observe(section);
  }
  document.querySelectorAll('.carousel-section').forEach((sec, idx) =>
    initCarousel(sec, `-c${idx}-`, idx === 1 ? 'stat-card--purple' : null)
  );

  // ── Card Wheel ──
  const wheelSection = document.querySelector('.wheel-section');
  if (wheelSection) {
    const wheelTrack = document.getElementById('wheel-track');
    const sources = document.querySelectorAll('#stats-grid .stat-card');
    const N = sources.length;

    // Read --radius from computed style
    const container = wheelSection.querySelector('.wheel-container');

    sources.forEach((src, i) => {
      const clone = cloneCard(src, `-w${i}`);
      clone.classList.add('wheel-card');

      // Position each card at equal angle around the Y axis
      const angle = i * (360 / N);
      clone.style.setProperty('--angle', angle + 'deg');

      // Snap internal animations to final state (cards spin too fast to read mid-animation)
      clone.dataset.revealed = '1';
      clone.classList.add('is-revealed');
      clone.querySelectorAll('.graph__dot,.graph__label,.arc__dot,.arc__label').forEach(el => el.classList.add('is-on'));
      clone.querySelectorAll('.graph__line').forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = '0'; });
      clone.querySelectorAll('.arc__seg').forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = '0'; });
      clone.querySelectorAll('.delta__value').forEach(el => { if (el.dataset.target) el.textContent = el.dataset.target; });

      wheelTrack.appendChild(clone);
    });

    // Set --radius on the track from computed container style
    const cardSize = parseFloat(getComputedStyle(container).getPropertyValue('--card')) || 300;
    wheelTrack.style.setProperty('--radius', (cardSize * 1.05) + 'px');
    wheelTrack.querySelectorAll('.wheel-card').forEach(c => {
      c.style.setProperty('--radius', (cardSize * 1.05) + 'px');
    });
  }
})();



/* ── Zone dot tooltip ── */
(function () {
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

  const tooltip   = document.getElementById('zone-tooltip');
  const tNum      = tooltip.querySelector('.zone-tooltip__num');
  const tName     = tooltip.querySelector('.zone-tooltip__name');
  const tFill     = tooltip.querySelector('.zone-tooltip__bar-fill');
  const tFirmness = tooltip.querySelector('.zone-tooltip__firmness');
  const tCode     = tooltip.querySelector('.zone-tooltip__code');
  const dots      = Array.from(document.querySelectorAll('.zone-dot'));

  let zoneActive = 0;
  let zonePaused = false;
  let zoneTimer  = null;

  function populate(zone) {
    tNum.textContent      = zone.num;
    tName.textContent     = zone.name;
    tFill.style.width     = zone.fill + '%';
    tFirmness.textContent = zone.firmness;
    tCode.textContent     = zone.code;
  }

  function activateDot(idx) {
    zoneActive = idx;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    populate(ZONES[idx]);
    tooltip.classList.add('is-visible');
  }

  function startTimer() {
    clearInterval(zoneTimer);
    zoneTimer = setInterval(() => {
      if (!zonePaused) activateDot((zoneActive + 1) % ZONES.length);
    }, 3000);
  }

  // Dot clicks: pause + jump to that zone
  dots.forEach((dot, i) => {
    dot.addEventListener('click', e => {
      e.stopPropagation();
      zonePaused = true;
      activateDot(i);
    });
  });

  // Card click: pause (stay on current)
  tooltip.addEventListener('click', e => {
    e.stopPropagation();
    zonePaused = true;
  });

  // Click anywhere else: resume
  document.addEventListener('click', e => {
    if (zonePaused && !e.target.closest('.zone-dot') && !e.target.closest('#zone-tooltip')) {
      zonePaused = false;
    }
  });

  // Activate dot 1 immediately and start cycling
  activateDot(0);
  startTimer();
})();



/* ── Zone dot mobile repositioning ── */
(function () {
  const W_REF = 1120; // reference desktop zone-map width (1280px viewport - 160px margins)
  // Each dot's original formula params: { x: percent, n: fixed_px, m: top_offset_px }
  const DOT_DATA = [
    { x: 40,   n: 151.5, m:  -81 },
    { x: 41,   n: 153,   m:  -36 },
    { x: 42,   n: 159.5, m:    9 },
    { x: 43,   n: 166,   m:   54 },
    { x: 44,   n: 171.5, m:   99 },
    { x: 45,   n: 178,   m:  144 },
    { x: 46,   n: 184.5, m:  189 },
    { x: 47.1, n: 191,   m:  232 },
  ];
  const zDots = Array.from(document.querySelectorAll('.zone-dot'));
  const zImg  = document.querySelector('.zone-map__img');

  function reposition() {
    if (window.innerWidth >= 768) {
      // Restore original inline styles
      const origLeft = ['calc(40% + 151.5px)','calc(41% + 153px)','calc(42% + 159.5px)','calc(43% + 166px)','calc(44% + 171.5px)','calc(45% + 178px)','calc(46% + 184.5px)','calc(47.1% + 191px)'];
      const origTop  = ['calc(34.4% - 81px)','calc(34.4% - 36px)','calc(34.4% + 9px)','calc(34.4% + 54px)','calc(34.4% + 99px)','calc(34.4% + 144px)','calc(34.4% + 189px)','calc(34.4% + 232px)'];
      zDots.forEach((d, i) => { d.style.left = origLeft[i]; d.style.top = origTop[i]; });
      return;
    }
    if (!zImg.naturalWidth) return;
    // Image height at W_REF: H_img_ref
    const H_img_ref = zImg.naturalHeight * W_REF / zImg.naturalWidth;
    // Desktop zone-map height (image cropped -100px top, -10px bottom)
    const H_c_ref   = H_img_ref - 110;
    DOT_DATA.forEach(({ x, n, m }, i) => {
      // Desktop absolute position
      const left_px = x / 100 * W_REF + n;
      const top_px  = 0.344 * H_c_ref + m;
      // Convert to position within full image
      const img_x_pct = left_px / W_REF * 100;
      const img_y_pct = (top_px + 100) / H_img_ref * 100; // +100 for the cropped top
      const mobileShift = i * 5; // dot 1: 0px, dot 2: +5px … dot 8: +35px (rightward)
      const mobileClose = i * 5; // dot 1: 0px, dot 2: 5px up … dot 8: 35px up (closer together)
      zDots[i].style.left = 'calc(' + img_x_pct.toFixed(2) + '% + ' + mobileShift + 'px)';
      zDots[i].style.top  = 'calc(' + img_y_pct.toFixed(2) + '% - ' + mobileClose + 'px)';
    });
  }

  if (zImg.complete && zImg.naturalWidth) {
    reposition();
  } else {
    zImg.addEventListener('load', reposition);
  }
  let rTmr = null;
  window.addEventListener('resize', () => {
    clearTimeout(rTmr);
    rTmr = setTimeout(reposition, 100);
  });
})();



/* ── Calibr8 Slider ── */
(function() {
  function scanIcon(c) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`;
  }
  function heatmapIcon(c) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
  }
  function calibrationIcon(c) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="6" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="4" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="8" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="4" x2="15" y2="4"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`;
  }
  function reportIcon(c) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`;
  }
  function mattressIcon(c) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><line x1="2" y1="18" x2="22" y2="18"/><path d="M6 10V8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2"/><path d="M13 10V8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2"/></svg>`;
  }

  const CARDS = [
    { id: 0, title: 'Scan', desc: 'Calibr8 scans 8 zones of your body to identify your body\'s pressure points.', img: null, video: '06-process/new scan flow.mp4', icon: scanIcon('#ffffff') },
    { id: 1, title: 'Heat Map', desc: 'Your body pressure appears in real time from Blue to Red, revealing where it\'s building up.', img: null, video: '06-process/heatmap.mp4', icon: heatmapIcon('#ffffff') },
    { id: 2, title: 'Calibration', desc: 'Calibr8 reconfigures the middle support layer, until your body\'s 8 zones find perfect support.', img: null, video: '06-process/Calibration.mp4', icon: calibrationIcon('#ffffff') },
    { id: 3, title: 'Report', desc: 'A personalised sleep report is created from your calibration profile & recommendations.', img: null, video: '06-process/scroll.mp4?v=2', icon: reportIcon('#ffffff') },
    { id: 4, title: 'Mattress Type', desc: 'Choose between memory foam, latex or grid as the preferred top layer for your Calibr8ed mattress.', img: null, video: '06-process/layers.mp4', videoMobile: '06-process/layersmobile.mp4', icon: mattressIcon('#ffffff') },
    { id: 5, title: 'Your Mattress', desc: 'A one-of-a-kind personalised mattress designed with Calibr8 is delivered to your home.', img: null, video: '06-process/Final Mattress.mp4', icon: mattressIcon('#ffffff') },
  ];

  let activeId = 0;

  function buildSlider() {
    const slider = document.getElementById('calibr8-slider');
    if (!slider) return;
    CARDS.forEach(card => {
      const el = document.createElement('div');
      el.className = 'card' + (card.id === activeId ? ' active' : '');
      el.dataset.id = card.id;
      el.innerHTML = `
        ${card.video
          ? `<video preload="none" class="card__bg card__video" src="${window.innerWidth <= 480 && card.videoMobile ? card.videoMobile : card.video}" autoplay loop muted playsinline></video>`
          : `<div class="card__bg" style="background-image:url('${card.img}')"></div>`
        }
        <div class="card__scrim"></div>
        <div class="card__inline-title">${card.title}</div>
        <div class="card__content">
          <div class="card__content-header">
            <div class="card__top-title">${card.title}</div>
            <div class="card__nav">
              <button class="card__nav-btn card__nav-btn--prev" aria-label="Previous">&#8592;</button>
              <button class="card__nav-btn card__nav-btn--next" aria-label="Next">&#8594;</button>
            </div>
          </div>
          <div class="card__desc">${card.desc}</div>
        </div>
        <div class="card__icon">${card.id + 1}</div>
      `;
      el.addEventListener('click', () => activate(parseInt(el.dataset.id)));
      el.querySelector('.card__nav-btn--prev').addEventListener('click', e => {
        e.stopPropagation();
        activate((activeId - 1 + CARDS.length) % CARDS.length, -1);
      });
      el.querySelector('.card__nav-btn--next').addEventListener('click', e => {
        e.stopPropagation();
        activate((activeId + 1) % CARDS.length, 1);
      });
      slider.appendChild(el);
    });
  }

  function updateCalibr8Arrows() {
    const prevs = document.querySelectorAll('#calibr8-static-nav .card__nav-btn--prev');
    const nexts = document.querySelectorAll('#calibr8-static-nav .card__nav-btn--next');
    prevs.forEach(b => b.style.display = activeId === 0 ? 'none' : '');
    nexts.forEach(b => b.style.display = activeId === CARDS.length - 1 ? 'none' : '');
  }

  // Wire static nav buttons
  document.getElementById('c8-prev').addEventListener('click', () => activate((activeId - 1 + CARDS.length) % CARDS.length, -1));
  document.getElementById('c8-next').addEventListener('click', () => activate((activeId + 1) % CARDS.length, 1));

  function updatePeek() {
    if (window.innerWidth > 480) return;
    document.querySelectorAll('#calibr8-slider .card').forEach(c => c.classList.remove('is-next', 'is-prev', 'is-ghost'));
    const nextId = (activeId + 1) % CARDS.length;
    const prevId = (activeId - 1 + CARDS.length) % CARDS.length;
    const nextCard = document.querySelector(`#calibr8-slider .card[data-id="${nextId}"]`);
    const prevCard = document.querySelector(`#calibr8-slider .card[data-id="${prevId}"]`);
    if (nextCard) {
      nextCard.classList.add('is-next');
      if (activeId === CARDS.length - 1) nextCard.classList.add('is-ghost');
    }
    if (prevCard) {
      prevCard.classList.add('is-prev');
      if (activeId === 0) prevCard.classList.add('is-ghost');
    }
  }

  function activate(id, direction = 1) {
    if (id === activeId) return;
    const isMobile = window.innerWidth <= 480;
    const oldActive = document.querySelector('#calibr8-slider .card.active');
    const incoming  = document.querySelector(`#calibr8-slider .card[data-id="${id}"]`);

    // FIRST — capture positions before any class change
    const oldFirst = isMobile && oldActive  ? oldActive.getBoundingClientRect()  : null;
    const newFirst = isMobile && incoming   ? incoming.getBoundingClientRect()    : null;

    // Apply class changes
    document.querySelectorAll('#calibr8-slider .card').forEach(c => {
      c.classList.remove('slide-from-right', 'slide-from-left', 'is-next', 'is-prev');
      c.classList.toggle('active', parseInt(c.dataset.id) === id);
    });
    activeId = id;
    updatePeek();
    updateCalibr8Arrows();

    if (isMobile && oldActive && incoming && oldFirst && newFirst) {
      // LAST — positions after class change (forces style recalc, no paint yet)
      const oldLast = oldActive.getBoundingClientRect();
      const newLast = incoming.getBoundingClientRect();

      if (newLast.width > 0 && oldLast.width > 0) {
        const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
        const DUR  = '0.5s';

        // INVERT — push both cards back to their old visual positions via transform
        [[incoming, newFirst, newLast], [oldActive, oldFirst, oldLast]].forEach(([el, f, l]) => {
          const dx = f.left - l.left;
          const dy = f.top  - l.top;
          const sx = f.width  / l.width;
          const sy = f.height / l.height;
          el.style.transition     = 'none';
          el.style.transformOrigin = 'top left';
          el.style.transform      = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
        });

        // PLAY — release transforms so browser animates to natural layout positions
        requestAnimationFrame(() => requestAnimationFrame(() => {
          [incoming, oldActive].forEach(el => {
            el.style.transition = `transform ${DUR} ${EASE}`;
            el.style.transform  = 'translate(0,0) scale(1)';
          });
          setTimeout(() => {
            [incoming, oldActive].forEach(el => {
              el.style.transition      = '';
              el.style.transform       = '';
              el.style.transformOrigin = '';
            });
          }, 550);
        }));
      }
    } else if (!isMobile) {
      // Desktop: original slide-in animation
      const newActive = document.querySelector('#calibr8-slider .card.active');
      if (newActive) {
        const cls = direction > 0 ? 'slide-from-right' : 'slide-from-left';
        requestAnimationFrame(() => {
          newActive.classList.add(cls);
          newActive.addEventListener('animationend', () => newActive.classList.remove(cls), { once: true });
        });
      }
    }
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') activate((activeId + 1) % CARDS.length, 1);
    if (e.key === 'ArrowLeft')  activate((activeId - 1 + CARDS.length) % CARDS.length, -1);
  });

  buildSlider();
  updateCalibr8Arrows();
  updatePeek();

  // ── Process slider (persona cards) ──
  const PROCESS_CARDS_DESKTOP = [
    { id: 0, eyebrow: 'The Pain Sufferer',    title: 'Waking up with body pain shouldn\'t be your normal.',     desc: 'Targeted support relieves the pressure points across your back, shoulders, hips & joints.',           video: '02-bodies/pain.mp4' },
    { id: 1, eyebrow: 'The Everyday Hustler', title: 'Your desk job puts pressure on your spine every day',    desc: 'Calibr8 supports pressure points caused by long sitting hours, helping you recover at night.',         video: '09-people/work.mp4' },
    { id: 2, eyebrow: 'The Couple',           title: 'Two people Completely different needs',                 desc: 'Each side is calibr8ed independently, so both of you get the support your body needs.',               video: '09-people/couple.mp4' },
    { id: 3, eyebrow: 'The High Achiever',    title: 'You train hard Hustle hard Push your body every day',  desc: 'Calibr8ed support helps your body recover deeper, so you wake up ready to do it all again.',           video: '09-people/lift.mp4' },
    { id: 4, eyebrow: 'The Overthinker',      title: 'Too many choices Too much guesswork',                   desc: 'Instead of opinions and buzzwords, your mattress is built on how your body actually rests.',           video: '09-people/choices.mp4' },
  ];
  const PROCESS_CARDS_MOBILE = [
    { id: 0, eyebrow: 'The Pain Sufferer', title: '',  desc: 'Targeted support relieves the pain across your back, shoulders, hips & joints while you sleep.',                    video: '02-bodies/pain.mp4' },
    { id: 1, eyebrow: 'The Everyday Hustler', title: '',  desc: 'Calibr8 supports pressure points caused by long sitting hours, helping your spine recover.',                         video: '09-people/work.mp4' },
    { id: 2, eyebrow: 'The Couple',        title: '',  desc: 'Each side is calibrated independently, to support two people with different needs.',                                   video: '09-people/couple.mp4' },
    { id: 3, eyebrow: 'The High Achiever', title: '',  desc: 'As you train hard, Calibr8ed support helps your body recover better through the night.',                             video: '09-people/lift.mp4' },
    { id: 4, eyebrow: 'The Overthinker',   title: '',  desc: 'Instead of opinions and buzzwords, Calibr8 builds your mattress based on how you actually rest.',                   video: '09-people/choices.mp4' },
  ];
  const PROCESS_CARDS = window.innerWidth <= 480 ? PROCESS_CARDS_MOBILE : PROCESS_CARDS_DESKTOP;

  let processActiveId = 0;

  function updateProcessPeek() {
    if (window.innerWidth > 480) return;
    document.querySelectorAll('#process-slider .card').forEach(c => c.classList.remove('is-next', 'is-prev', 'is-ghost'));
    const nextId = (processActiveId + 1) % PROCESS_CARDS.length;
    const prevId = (processActiveId - 1 + PROCESS_CARDS.length) % PROCESS_CARDS.length;
    const nextCard = document.querySelector(`#process-slider .card[data-id="${nextId}"]`);
    const prevCard = document.querySelector(`#process-slider .card[data-id="${prevId}"]`);
    if (nextCard) {
      nextCard.classList.add('is-next');
      if (processActiveId === PROCESS_CARDS.length - 1) nextCard.classList.add('is-ghost');
    }
    if (prevCard) {
      prevCard.classList.add('is-prev');
      if (processActiveId === 0) prevCard.classList.add('is-ghost');
    }
  }

  function processActivate(id, direction = 1) {
    if (id === processActiveId) return;
    const isMobile = window.innerWidth <= 480;
    const oldActive = document.querySelector('#process-slider .card.active');
    const incoming  = document.querySelector(`#process-slider .card[data-id="${id}"]`);

    const oldFirst = isMobile && oldActive ? oldActive.getBoundingClientRect() : null;
    const newFirst = isMobile && incoming  ? incoming.getBoundingClientRect()  : null;

    document.querySelectorAll('#process-slider .card').forEach(c => {
      c.classList.remove('slide-from-right', 'slide-from-left', 'is-next', 'is-prev');
      c.classList.toggle('active', parseInt(c.dataset.id) === id);
    });
    processActiveId = id;
    updateProcessPeek();

    if (isMobile && oldActive && incoming && oldFirst && newFirst) {
      const oldLast = oldActive.getBoundingClientRect();
      const newLast = incoming.getBoundingClientRect();
      if (newLast.width > 0 && oldLast.width > 0) {
        const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
        const DUR  = '0.5s';
        [[incoming, newFirst, newLast], [oldActive, oldFirst, oldLast]].forEach(([el, f, l]) => {
          const dx = f.left - l.left, dy = f.top - l.top;
          const sx = f.width / l.width,  sy = f.height / l.height;
          el.style.transition = 'none';
          el.style.transformOrigin = 'top left';
          el.style.transform = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
        });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          [incoming, oldActive].forEach(el => {
            el.style.transition = `transform ${DUR} ${EASE}`;
            el.style.transform  = 'translate(0,0) scale(1)';
          });
          setTimeout(() => {
            [incoming, oldActive].forEach(el => {
              el.style.transition = el.style.transform = el.style.transformOrigin = '';
            });
          }, 550);
        }));
      }
    } else if (!isMobile) {
      const newActive = document.querySelector('#process-slider .card.active');
      if (newActive) {
        const cls = direction > 0 ? 'slide-from-right' : 'slide-from-left';
        requestAnimationFrame(() => {
          newActive.classList.add(cls);
          newActive.addEventListener('animationend', () => newActive.classList.remove(cls), { once: true });
        });
      }
    }
  }

  function buildProcessSlider() {
    const slider = document.getElementById('process-slider');
    if (!slider) return;
    const isMobile = window.innerWidth <= 480;
    PROCESS_CARDS.forEach(card => {
      const el = document.createElement('div');
      el.className = 'card' + (card.id === processActiveId ? ' active' : '');
      el.dataset.id = card.id;
      el.innerHTML = `
        ${card.video
          ? `<video preload="none" class="card__bg card__video" src="${card.video}" autoplay loop muted playsinline></video>`
          : `<div class="card__bg" style="background-image:url('${card.img}')"></div>`
        }
        <div class="card__scrim"></div>
        ${isMobile ? `<div class="card__inline-title">${card.eyebrow}</div>` : ''}
        <div class="card__content">
          <div class="card__content-header">
            <div class="card__eyebrow">${card.eyebrow}</div>
            ${!isMobile ? `<div class="card__nav">
              <button class="card__nav-btn card__nav-btn--prev" aria-label="Previous">&#8592;</button>
              <button class="card__nav-btn card__nav-btn--next" aria-label="Next">&#8594;</button>
            </div>` : ''}
          </div>
          <div class="card__title">${card.title}</div>
          <div class="card__desc">${card.desc}</div>
        </div>
        <div class="card__icon">${card.id + 1}</div>
      `;
      if (!isMobile) {
        el.querySelector('.card__nav-btn--prev').addEventListener('click', e => {
          e.stopPropagation();
          processActivate((processActiveId - 1 + PROCESS_CARDS.length) % PROCESS_CARDS.length, -1);
        });
        el.querySelector('.card__nav-btn--next').addEventListener('click', e => {
          e.stopPropagation();
          processActivate((processActiveId + 1) % PROCESS_CARDS.length, 1);
        });
      }
      el.addEventListener('click', () => processActivate(parseInt(el.dataset.id), 1));
      slider.appendChild(el);
    });
  }

  buildProcessSlider();
  updateProcessPeek();

  // ── Reviews ──
  const REVIEWS = [
    { name: 'Kunal Shah',      city: 'Bengaluru', quote: '"I learnt about Calibr8 at a Wakefit store and it has been an incredible experience so far. The mattress adapts perfectly to my body shape, I would 100% recommend it!"',                                                                        img: '11-testimonials/kunal.jpeg',   bodyBefore: '11-testimonials/before.png', bodyAfter: '11-testimonials/after.png' },
    { name: 'Shivashish Suman',city: 'Bengaluru', quote: '"I\'m confident I\'ve made the best purchase because the comfort I feel is exactly what I experienced with my calibration in the store!"',                                                                                                       img: '11-testimonials/shivphoto.png',  bodyBefore: '11-testimonials/shivashish_nobg.png', bodyAfter: '11-testimonials/shivashish2_nobg.png' },
    { name: 'Ashish Naik',     city: 'Bengaluru', quote: '"What I love about Calibr8 is that it is tailored to my needs. In fact, I bought another Calibr8 mattress for my mother as well!"',                                                                                                             img: '11-testimonials/ashishphoto.png', bodyBefore: '11-testimonials/Ashish_nobg.png', bodyAfter: '11-testimonials/ashish2_nobg.png' },
    { name: 'Purab Saxena',    city: 'Bengaluru', quote: '"My Calibr8 mattress improved my lower back pain and sleep quality. I\'d recommend it to anyone who wants personalised sleep."',                                              img: '11-testimonials/purabphoto.png',  bodyBefore: '11-testimonials/purab_nobg.png', bodyAfter: '11-testimonials/abhishek2_nobg.png' },
    { name: 'Abhishek J R',    city: 'Bengaluru', quote: '"I am very happy with my Calibr8 mattress...it is so comfortable, stays cool & has improved my sleep experience immensely! Wakefit has a great customer service as well."',                                                                      img: '11-testimonials/abhishekphoto.png', bodyBefore: '11-testimonials/abhishek_nobg.png', bodyAfter: '11-testimonials/purab2_nobg.png' },
  ];

  let rcActive = 0;
  let rcLocked = false;
  let rcTimer  = null;

  function loadContent(idx) {
    const r = REVIEWS[idx];
    document.getElementById('reviews-quote').textContent = r.quote;
    document.getElementById('reviews-name').textContent  = r.name;
    document.getElementById('reviews-city').textContent  = r.city;
    const personCol = document.querySelector('.rev-person-col');
    const mobImg = document.getElementById('rev-person-mob-img');
    if (r.img) {
      document.getElementById('reviews-hero-img').src = r.img;
      if (mobImg) mobImg.src = r.img;
      if (personCol) personCol.style.display = '';
    } else {
      if (mobImg) mobImg.src = '';
      if (personCol) personCol.style.display = 'none';
    }
    document.getElementById('rev-cal-bef-img').src = r.bodyBefore;
    document.getElementById('rev-cal-aft-img').src = r.bodyAfter;
  }

  function activateReview(newIdx) {
    if (rcLocked || newIdx === rcActive) return;
    rcLocked = true;

    const body   = document.getElementById('reviews-body');
    const cals   = body.querySelectorAll('.rev-cal');
    const els    = [
      document.getElementById('reviews-quote-wrap'),
      body.querySelector('.rev-person-col'),
      cals[0],
      cals[1],
    ];

    const STAGGER      = 65;
    const EXIT_DUR     = 320;
    const ENTER_DUR    = 580;
    const exitEase     = 'cubic-bezier(0.4,0,1,1)';
    const enterEase    = 'cubic-bezier(0.16,1,0.3,1)';

    // ── EXIT: slide right + fade, staggered ──
    els.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = `opacity ${EXIT_DUR}ms ${exitEase}, transform ${EXIT_DUR}ms ${exitEase}`;
        el.style.opacity    = '0';
        el.style.transform  = 'translateX(72px)';
      }, i * STAGGER);
    });

    const exitDone = EXIT_DUR + (els.length - 1) * STAGGER + 30;

    setTimeout(() => {
      // Swap content while everything is invisible
      rcActive = newIdx;
      loadContent(newIdx);

      // Snap all to enter-start (left, invisible, no transition)
      els.forEach(el => {
        el.style.transition = 'none';
        el.style.opacity    = '0';
        el.style.transform  = 'translateX(-56px)';
      });

      // ── ENTER: slide to position + fade, staggered ──
      requestAnimationFrame(() => requestAnimationFrame(() => {
        els.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = `opacity ${ENTER_DUR}ms ${enterEase}, transform ${ENTER_DUR}ms ${enterEase}`;
            el.style.opacity    = '1';
            el.style.transform  = 'translateX(0)';
          }, i * STAGGER);
        });

        const enterDone = ENTER_DUR + (els.length - 1) * STAGGER + 30;
        setTimeout(() => {
          els.forEach(el => { el.style.transition = ''; el.style.transform = ''; el.style.opacity = ''; });
          rcLocked = false;
        }, enterDone);
      }));
    }, exitDone);
  }

  function startTimer() {
    clearInterval(rcTimer);
    rcTimer = setInterval(() => {
      if (!rcLocked) activateReview((rcActive + 1) % REVIEWS.length);
    }, 4000);
  }

  // Init
  loadContent(rcActive);
  startTimer();
})();

// Social proof fade-in
(() => {
  const cards = document.querySelectorAll('.sp-section .sp-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sp-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 80) + 'ms';
    obs.observe(card);
  });
})();

// Social proof videos
(() => {
  [['sp-vid1-card','sp-vid1-btn'],['sp-vid2-card','sp-vid2-btn']].forEach(([cId, bId]) => {
    const card = document.getElementById(cId);
    const btn  = document.getElementById(bId);
    if (!card || !btn) return;
    const vid  = card.querySelector('video');
    btn.addEventListener('click', () => {
      if (vid.paused) { vid.play(); btn.style.opacity = '0'; }
      else            { vid.pause(); btn.style.opacity = '1'; }
    });
    vid.addEventListener('pause', () => { btn.style.opacity = '1'; });
    vid.addEventListener('play',  () => { btn.style.opacity = '0'; });
  });
})();

// Book toggle
(() => {
  const btns   = document.querySelectorAll('.book-btn');
  const imgMap = { store: document.getElementById('book-img-store'), home: document.getElementById('book-img-home') };
  let current  = 'store';

  const toggle = document.querySelector('.book-toggle');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === current) return;
      btns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      if (toggle) toggle.classList.toggle('tab-home', tab === 'home');
      imgMap[current].classList.add('hidden');
      if (imgMap[current].pause) imgMap[current].pause();
      imgMap[tab].classList.remove('hidden');
      if (imgMap[tab].play) imgMap[tab].play();
      current = tab;
    });
  });
})();




(function () {
  const hero  = document.querySelector('.hero');
  if (!hero) return;
  const video = hero.querySelector('video');
  const title = hero.querySelector('.hero__title');
  const sub   = hero.querySelector('.hero__sub');
  const grad  = hero.querySelector('.hero__text-grad');
  if (!video || !title || !sub) return;

  const EASE            = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const COLOR_IN_DELAY  = 3000; // ms after loop start to morph to dark
  const COLOR_OUT_EARLY = 1.0;  // seconds before loop end to morph back to white

  const DARK_TITLE = '#111';
  const DARK_SUB   = '#111';
  const WHITE       = '#ffffff';

  // Start white, always visible
  title.style.color      = WHITE;
  title.style.transition = `color 700ms ${EASE}`;
  sub.style.color        = WHITE;
  sub.style.transition   = `color 700ms ${EASE} 150ms`;

  let isDark = false;
  let morphedNearEnd = false;
  let prevTime = 0;
  let morphTimer = null;

  function toDark() {
    title.style.color = DARK_TITLE;
    sub.style.color   = DARK_SUB;
    if (grad) grad.style.opacity = '1';
    hero.classList.add('is-dark');
    isDark = true; morphedNearEnd = false;
  }

  function toWhite() {
    title.style.color = WHITE;
    sub.style.color   = WHITE;
    if (grad) grad.style.opacity = '0';
    hero.classList.remove('is-dark');
    isDark = false;
  }

  function scheduleDark() {
    clearTimeout(morphTimer);
    morphTimer = setTimeout(toDark, COLOR_IN_DELAY);
  }

  scheduleDark(); // initial load

  video.addEventListener('timeupdate', function () {
    const cur = video.currentTime;
    const dur = video.duration;

    // Loop detected — reset to white, schedule dark again
    if (cur < prevTime - 0.5) {
      toWhite();
      morphedNearEnd = false;
      scheduleDark();
    }

    // Morph back to white near end of loop
    if (dur && isDark && !morphedNearEnd && cur > dur - COLOR_OUT_EARLY) {
      toWhite();
      morphedNearEnd = true;
    }

    prevTime = cur;
  });
})();

// ── Calibr8 Score Live Section ──
(function () {
  const section   = document.querySelector('.cls-section');
  if (!section) return;

  const canvas    = document.getElementById('cls-canvas');
  const ctx       = canvas.getContext('2d');
  const numEl     = document.getElementById('cls-score-num');
  const prefRed   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() { canvas.width = section.offsetWidth; canvas.height = section.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  // ── Layered concentric ring system ──
  // 6 layers, each evenly spaced, alternating CW / CCW
  const NUM_LAYERS   = 6;
  const DOTS_PER_LAYER = 100;
  // Radial offset per layer as fraction of minD (inner → outer)
  const L_OFFSET  = [-0.040, -0.024, -0.008, 0.008, 0.024, 0.040];
  // Angular speed per layer (rad/frame), alternating direction
  const L_SPEED   = [ 0.0007, -0.0005,  0.0006, -0.0005,  0.0006, -0.0007];
  // Opacity weight — brightest at the two center layers, fades at edges
  const L_OP_W    = [  0.38,    0.38,    0.38,   0.38,    0.38,    0.38];
  // Size range per layer (inner layers smaller, outer bigger for depth)
  const L_SIZE    = [  2.0,     2.0,     2.0,    2.0,     2.0,     2.0];

  // Per-layer rotating phase (random start so layers aren't aligned)
  const layerAngle = L_OFFSET.map(() => Math.random() * Math.PI * 2);

  // Build particles: each layer has DOTS_PER_LAYER evenly spaced
  const pts = [];
  for (let l = 0; l < NUM_LAYERS; l++) {
    for (let j = 0; j < DOTS_PER_LAYER; j++) {
      pts.push({
        layer:     l,
        baseAngle: (j / DOTS_PER_LAYER) * Math.PI * 2,
        size:      L_SIZE[l],
        opBase:    L_OP_W[l],
        op:        0,
      });
    }
  }

  // ── Ring state ──
  let ringFrac  = 0;
  let ringTgt   = 0.19;
  let orbitMult = 1;
  let orbitTgt  = 1.4;
  const CLR = [85, 60, 154];

  // ── Cards ──
  const cards = [0,1,2,3].map(i => document.getElementById('cls-c' + i));

  function absorb(i) {
    cards[i].classList.remove('cls-vis');
    cards[i].classList.add('cls-absorbed');
  }
  function restore(i) {
    cards[i].classList.remove('cls-absorbed');
    cards[i].classList.add('cls-vis');
  }
  function resetCards() {
    cards.forEach(c => { c.classList.remove('cls-vis', 'cls-absorbed'); });
  }

  function showNum(n) {
    const next = String(n);
    const isFirst = numEl.style.opacity === '0' || numEl.textContent === '';
    if (isFirst) {
      // First number: enter from below
      numEl.textContent = next;
      numEl.style.transition = 'none';
      numEl.style.transform = 'translate(-50%, calc(-50% + 70px))';
      numEl.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        numEl.style.transition = 'opacity 380ms ease, transform 420ms cubic-bezier(0.16,1,0.3,1)';
        numEl.style.transform = 'translate(-50%, -50%)';
        numEl.style.opacity = '1';
      }));
    } else {
      // Slide current up + out, then bring next from below
      numEl.style.transition = 'opacity 220ms ease, transform 260ms cubic-bezier(0.4,0,1,1)';
      numEl.style.transform = 'translate(-50%, calc(-50% - 70px))';
      numEl.style.opacity = '0';
      setTimeout(() => {
        numEl.textContent = next;
        numEl.style.transition = 'none';
        numEl.style.transform = 'translate(-50%, calc(-50% + 70px))';
        numEl.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          numEl.style.transition = 'opacity 380ms ease, transform 420ms cubic-bezier(0.16,1,0.3,1)';
          numEl.style.transform = 'translate(-50%, -50%)';
          numEl.style.opacity = '1';
        }));
      }, 250);
    }
  }
  function hideNum() {
    numEl.style.transition = 'opacity 280ms ease, transform 320ms cubic-bezier(0.4,0,1,1)';
    numEl.style.transform = 'translate(-50%, calc(-50% - 70px))';
    numEl.style.opacity = '0';
  }

  // ── Loop ──
  const D = prefRed ? 0 : 1;

  function runLoop() {
    // Cards already visible — go straight into sequence
    hideNum();
    ringTgt = 0.19; orbitTgt = 1.4;

    // number shows → 2.5s dwell → card absorbs → 500ms → next number
    setTimeout(() => { showNum(1); ringTgt = 0.212; },                                   600 * D);
    setTimeout(() => { absorb(0);  ringTgt = 0.232; orbitTgt = 1.8; },                 3100 * D);

    setTimeout(() => { showNum(2); ringTgt = 0.245; },                                  3600 * D);
    setTimeout(() => { absorb(1);  ringTgt = 0.256; orbitTgt = 2.1; },                 6100 * D);

    setTimeout(() => { showNum(3); ringTgt = 0.265; },                                  6600 * D);
    setTimeout(() => { absorb(2);  ringTgt = 0.272; orbitTgt = 2.5; },                 9100 * D);

    setTimeout(() => { showNum(4); ringTgt = 0.276; },                                  9600 * D);
    setTimeout(() => { absorb(3);  ringTgt = 0.280; orbitTgt = 2.8; },                12100 * D);

    // Number fades → all 4 cards come out together
    setTimeout(() => { hideNum(); },                                                   12800 * D);
    setTimeout(() => {
      restore(0); restore(1); restore(2); restore(3);
      ringTgt = 0.19; orbitTgt = 1.4;
    }, 13800 * D);

    setTimeout(runLoop, prefRed ? 500 : 15600);
  }

  // ── Render loop ──
  function render() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 + 50;
    const minD = Math.min(W, H);

    ringFrac  += (ringTgt  - ringFrac)  * 0.022;
    orbitMult += (orbitTgt - orbitMult) * 0.022;

    // Advance each layer's rotation
    for (let l = 0; l < NUM_LAYERS; l++) {
      layerAngle[l] += L_SPEED[l] * orbitMult;
    }

    ctx.clearRect(0, 0, W, H);

    const ringPx = ringFrac * minD;

    pts.forEach(p => {
      // Fade in opacity toward target
      p.op += (p.opBase - p.op) * 0.05;
      if (p.op < 0.005) return;

      const radius = ringPx + L_OFFSET[p.layer] * minD;
      if (radius <= 0) return;

      const angle = p.baseAngle + layerAngle[p.layer];
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.fillStyle = `rgba(${CLR[0]},${CLR[1]},${CLR[2]},${p.op})`;
      ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
    });

    requestAnimationFrame(render);
  }

  // ── Start on viewport entry ──
  let started = false;
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started) {
      started = true;
      requestAnimationFrame(render);
      // One-time intro: show all 4 cards staggered, then start loop
      cards.forEach((c, i) => setTimeout(() => c.classList.add('cls-vis'), 300 + i * 160));
      setTimeout(runLoop, 300 + 4 * 160 + 400);
      obs.disconnect();
    }
  }, { threshold: 0.25 });
  obs.observe(section);
})();

// Match hero title width to subtitle width
(function () {
  const title = document.querySelector('.hero__title');
  const sub   = document.querySelector('.hero__sub');
  if (!title || !sub) return;

  function matchWidth() {
    title.style.fontSize = '';
    const targetW = sub.getBoundingClientRect().width;
    let lo = 8, hi = 300;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      title.style.fontSize = mid + 'px';
      title.getBoundingClientRect(); // force reflow
      if (title.getBoundingClientRect().width > targetW) hi = mid;
      else lo = mid;
    }
    title.style.fontSize = lo + 'px';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', matchWidth);
  } else {
    matchWidth();
  }
  window.addEventListener('resize', matchWidth);
})();



function equalizeRevCalGaps() {
  document.querySelectorAll('.rev-cal').forEach(card => {
    const label = card.querySelector('.rev-cal__label');
    const img   = card.querySelector('.rev-cal__body-img');
    if (!label || !img || !img.naturalWidth) return;

    const hPad   = 16;
    const availW = card.clientWidth - hPad * 2;
    const imgH   = Math.round(availW * (img.naturalHeight / img.naturalWidth));

    // Label is absolute overlay — image fills card from top, offset 5px
    card.style.paddingTop    = '0px';
    card.style.paddingBottom = '0px';
    img.style.marginTop = '25px';
    img.style.width  = availW + 'px';
    img.style.height = imgH   + 'px';
  });
}

function initRevCal() {
  const imgs = document.querySelectorAll('.rev-cal .rev-cal__body-img');
  let loaded = 0;
  imgs.forEach(img => {
    if (img.complete && img.naturalWidth) { loaded++; }
    else img.addEventListener('load', () => { loaded++; if (loaded === imgs.length) equalizeRevCalGaps(); });
  });
  if (loaded === imgs.length) equalizeRevCalGaps();
}

document.addEventListener('DOMContentLoaded', initRevCal);
window.addEventListener('resize', equalizeRevCalGaps);

// ── Lazy-load below-fold videos ──
(() => {
  function loadVid(v) {
    if (v.dataset.src && !v.src.includes(v.dataset.src)) {
      v.src = v.dataset.src;
      delete v.dataset.src;
      v.load();
    }
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { loadVid(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '300px' });
  document.querySelectorAll('video[data-src]').forEach(v => io.observe(v));

  // Book-section toggle: load video on demand
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.book-img').forEach(v => loadVid(v));
    }, { once: true });
  });
})();

