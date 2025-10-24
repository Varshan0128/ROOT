// ROOT Website interactions and animations
// - Mobile nav toggle
// - Smooth scroll + active section highlighting
// - Intersection reveal animations
// - Scroll-based background animation
// - Particles background (tsParticles)
// - Intro entrance animations

(function () {
  // Background video readiness and reduced-motion handling
  (function initBackgroundVideo(){
    const gb = document.querySelector('.global-bg.use-video');
    if (!gb) return;
    const vid = gb.querySelector('video.bg-video');
    if (!vid) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      try { vid.pause(); } catch (_) {}
      return; // CSS also hides the video in reduced motion
    }
    const markReady = () => gb.classList.add('video-ready');
    if (vid.readyState >= 2) { // HAVE_CURRENT_DATA
      markReady();
    } else {
      vid.addEventListener('loadeddata', markReady, { once: true });
      vid.addEventListener('canplay', markReady, { once: true });
    }
    vid.addEventListener('error', () => {
      // Keep gradient fallback; optionally hide/break video element
      try { vid.removeAttribute('src'); vid.load(); } catch (_) {}
    }, { once: true });
  })();
  // Emotion presets config (switch theme with one line)
  const EmotionThemes = {
    Gentle: {
      journey: { topOpacity: 0.18, midOpacity: 0.38, bottomOpacity: 0.82, warmAlphaEnd: 0.35, scrollScrub: 0.5 },
      celebrate: { warmAlphaCelebrate: 0.65, confettiFactor: 0.9, lingerMs: 5200 },
      deviceTuning: { mobileScale: 0.9, reduceMotionScale: 0.5 }
    },
    Balanced: {
      journey: { topOpacity: 0.12, midOpacity: 0.46, bottomOpacity: 0.88, warmAlphaEnd: 0.45, scrollScrub: 0.6 },
      celebrate: { warmAlphaCelebrate: 0.75, confettiFactor: 1.0, lingerMs: 5200 },
      deviceTuning: { mobileScale: 1.0, reduceMotionScale: 0.5 }
    },
    Uplifted: {
      journey: { topOpacity: 0.10, midOpacity: 0.50, bottomOpacity: 0.92, warmAlphaEnd: 0.50, scrollScrub: 0.65 },
      celebrate: { warmAlphaCelebrate: 0.80, confettiFactor: 1.05, lingerMs: 7000 },
      deviceTuning: { mobileScale: 1.0, reduceMotionScale: 0.45 }
    }
  };
  // Theme resolver: query param or localStorage with Balanced fallback
  const THEME_KEY = 'emotion_theme';
  function normalizeName(name) {
    if (!name) return '';
    const n = String(name).toLowerCase();
    if (n.startsWith('gen')) return 'Gentle';
    if (n.startsWith('bal')) return 'Balanced';
    if (n.startsWith('upl')) return 'Uplifted';
    return '';
  }
  function getThemeChoice() {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = normalizeName(params.get('theme'));
      if (fromQuery && EmotionThemes[fromQuery]) {
        try { localStorage.setItem(THEME_KEY, fromQuery); } catch (_) {}
        window.__emotionThemeName = fromQuery;
        return EmotionThemes[fromQuery];
      }
      const stored = normalizeName(localStorage.getItem(THEME_KEY));
      const name = EmotionThemes[stored] ? stored : 'Balanced';
      window.__emotionThemeName = name;
      return EmotionThemes[name];
    } catch (_) {
      window.__emotionThemeName = 'Balanced';
      return EmotionThemes.Balanced;
    }
  }
  // expose for designers/dev
  window.getThemeChoice = getThemeChoice;
  // Selectable theme (swap via ?theme= or localStorage)
  const theme = getThemeChoice();

  // Initialize background animation if GSAP and ScrollTrigger are available
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bgTop = document.querySelector('.bg-grad-top');
    const bgBottom = document.querySelector('.bg-grad-bottom');
    if (bgTop && bgBottom) {
      const applyState = (p) => {
        // p in [0..1]; 0 = split; 1 = full white-sandal
        const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v));
        const opTop = clamp(1 - p); // fade 1 -> 0
        // Heights and positions per spec
        const topHeightVh = 50 * (1 - p);          // 50vh -> 0
        const bottomTopVh = 50 * (1 - p);          // 50vh -> 0
        const bottomHeightVh = 50 + (50 * p);      // 50vh -> 100vh
        gsap.set(bgTop, { opacity: opTop, height: `${topHeightVh}vh` });
        gsap.set(bgBottom, { top: `${bottomTopVh}vh`, height: `${bottomHeightVh}vh` });
      };

      const computeProgress = () => {
        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const g = window.scrollY / maxScroll; // global progress [0..1]
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        if (isMobile) {
          // Compress into middle third: 0..1 mapped over [1/3 .. 2/3]
          const start = 1/3, end = 2/3;
          if (g <= start) return 0;
          if (g >= end) return 1;
          return (g - start) / (end - start);
        }
        // Desktop/larger: reach 1 by mid-scroll (0.5)
        return Math.min(1, g / 0.5);
      };

      // Reduced motion: immediately show final state
      if (prefersReduced) {
        gsap.set(bgTop, { display: 'none' });
        gsap.set(bgBottom, { top: '0vh', height: '100vh' });
      } else {
        // Ensure initial split state is applied, then update on scroll
        applyState(computeProgress());
        ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: () => applyState(computeProgress()),
        });
        // Also update on resize to recalc progress map
        window.addEventListener('resize', () => applyState(computeProgress()));
      }
    }
  }

  // Legacy story constants remain for other modules if needed
  const storyConfig = {
    warmAlphaEnd: theme.journey.warmAlphaEnd,
    warmAlphaCelebrate: theme.celebrate.warmAlphaCelebrate,
    scrollStart: 0.85,
    celebrateDuration: theme.celebrate.lingerMs,
  };
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Toast manager (success/error) and copy tooltip
  (function initToastsAndCopy(){
    // Create toast container once
    let container = qs('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const mk = (type, message) => {
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = `<span class="toast-dot" aria-hidden="true"></span><span>${message}</span>`;
      return el;
    };

    const showToast = (type, message, ms = 3000) => {
      const t = mk(type, message);
      container.appendChild(t);
      // force reflow to trigger transition
      // eslint-disable-next-line no-unused-expressions
      t.offsetHeight; 
      t.classList.add('in');
      setTimeout(() => {
        t.classList.remove('in');
        setTimeout(() => t.remove(), 220);
      }, ms);
    };

    // Expose minimal API
    window.toast = {
      success: (msg, ms) => showToast('success', msg, ms),
      error: (msg, ms) => showToast('error', msg, ms)
    };

    // Copy-to-clipboard with tooltip
    const activeTips = new WeakMap();
    document.addEventListener('click', async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!btn) return;
      const text = btn.getAttribute('data-copy') || '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        // Tooltip
        let tip = activeTips.get(btn);
        if (!tip) {
          tip = document.createElement('span');
          tip.className = 'copy-tip';
          tip.textContent = 'Copied!';
          btn.style.position = btn.style.position || 'relative';
          btn.appendChild(tip);
          activeTips.set(btn, tip);
        }
        tip.classList.add('show');
        setTimeout(() => tip.classList.remove('show'), 1500);
      } catch (_) {
        window.toast.error('Copy failed');
      }
    }, { passive: true });
  })();

  // Cinematic morphing gradient background (three layered gradients)
  (function initCinematicGradient(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gb = document.querySelector('.global-bg');
    const l1 = document.querySelector('.global-bg .layer-1');
    const l2 = document.querySelector('.global-bg .layer-2');
    const l3 = document.querySelector('.global-bg .layer-3');
    if (!gb || !l1 || !l2 || !l3) return;

    // Reduced motion: rely on CSS fallback (layer-3 only)
    if (reduce || !window.gsap || !window.ScrollTrigger) {
      l1.style.display = 'none';
      l2.style.display = 'none';
      l3.style.opacity = '1';
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial states
    gsap.set(l1, { opacity: 0.9,  yPercent: 0,   willChange: 'opacity, transform', '--s1': '20%', '--s2': '55%', '--s3': '100%' });
    gsap.set(l2, { opacity: 0.55, yPercent: 2,   willChange: 'opacity, transform', '--s1': '20%', '--s2': '55%', '--s3': '100%' });
    gsap.set(l3, { opacity: 0.35, yPercent: 6,   willChange: 'opacity, transform', '--s1': '20%', '--s2': '55%', '--s3': '100%' });

    const totalScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const isMobile = () => window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    const startPx = () => totalScroll() * (isMobile() ? 0.30 : 0.00);
    const endPx   = () => totalScroll() * (isMobile() ? 0.70 : 1.00);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: () => `${startPx()}px top`,
        end: () => `${endPx()}px bottom`,
        scrub: true,
      }
    });

    // Parallax depth and opacity per spec
    tl.to(l1, { opacity: 0.18, yPercent: -6, ease: 'none' }, 0)
      .to(l2, { opacity: 0.40, yPercent: -4, ease: 'none' }, 0)
      .to(l3, { opacity: 0.95, yPercent: -2, ease: 'none' }, 0)
      // Gradient stop morph per spec
      .to([l1,l2,l3], {
        duration: 1,
        ease: 'none',
        css: {
          '--s1': '38%',  // push blue core lower
          '--s2': '72%',  // extend transition band
          '--s3': '115%'  // allow warm to dominate near bottom
        }
      }, 0);

    // Keep mapping accurate on resize
    window.addEventListener('resize', () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
  })();

  // Section reveals: fade + slide in with GSAP ScrollTrigger (10–15px offset) + slight stagger
  (function initSectionReveals(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = qsa('.section');
    const singles = qsa('.ea-hero, .contact-card, .team .person, .card');

    // Fallback: no GSAP or reduced motion — reveal immediately
    if (reduce || !window.gsap || !window.ScrollTrigger) {
      [...sections, ...singles].forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('visible');
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Helper to bind once
    const bindOnce = (el) => {
      if (el.dataset.animBound === '1') return false;
      el.dataset.animBound = '1';
      return true;
    };

    // Animate each section with a group stagger for its primary children
    sections.forEach((sec) => {
      if (!bindOnce(sec)) return;
      const children = qsa('.grid > *, .cards > .card, .contact-card, .team .person', sec);
      const targets = children.length ? children : [sec];
      const baseDy = 12;
      gsap.fromTo(targets,
        { opacity: 0, y: baseDy },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: { each: 0.08, from: 'start' },
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
            once: false,
          }
        }
      );
    });

    // Also animate any standalone featured elements not inside a typical grid
    gsap.utils.toArray(singles).forEach((el) => {
      if (!bindOnce(el)) return;
      gsap.fromTo(el,
        { opacity: 0, y: 13 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
            once: false,
          }
        }
      );
    });
  })();

  // Ambient-aware typography: switch to dark text on light peach toward the bottom
  (function initAmbientTone(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;
    if (!body) return;

    const apply = (on) => body.classList.toggle('light-ambient', !!on);
    const computeProgress = () => {
      const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      return Math.min(1, y / h);
    };

    // Threshold aligns with CSS bottom gradient stops (peach begins ~62%)
    const THRESHOLD_ON = 0.62;  // switch to light when >= this
    const THRESHOLD_OFF = 0.58; // switch back to dark when < this (hysteresis)
    let light = false;

    if (window.gsap && window.ScrollTrigger && !reduce) {
      const { gsap } = window;
      gsap.registerPlugin(window.ScrollTrigger);
      window.ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (st) => {
          const p = st.progress;
          if (!light && p >= THRESHOLD_ON) { light = true; apply(true); }
          else if (light && p < THRESHOLD_OFF) { light = false; apply(false); }
        }
      });
      // Initial state
      const p0 = computeProgress();
      light = p0 >= THRESHOLD_ON;
      apply(light);
    } else {
      const onScroll = () => {
        const p = computeProgress();
        if (!light && p >= THRESHOLD_ON) { light = true; apply(true); }
        else if (light && p < THRESHOLD_OFF) { light = false; apply(false); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  })();

  // Journey overlay messages + progress bar
  (function initJourneyOverlay(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const msgs = qsa('.journey-msg');
    const bar = qs('.journey-progress__bar');
    if (!msgs.length && !bar) return;

    const stages = [
      { key: 'rejection', at: 0.00 },
      { key: 'hope',      at: 0.25 },
      { key: 'almost',    at: 0.60 },
      { key: 'acceptance',at: 0.90 }
    ];

    const showKey = (key) => {
      msgs.forEach(m => m.classList.toggle('show', m.getAttribute('data-stage') === key));
    };

    const update = () => {
      const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const p = Math.min(1, y / h);
      if (bar) bar.style.width = (p * 100) + '%';
      // Choose stage by progress
      for (let i = stages.length - 1; i >= 0; i--) {
        if (p >= stages[i].at) { showKey(stages[i].key); break; }
      }
    };

    if (window.gsap && window.ScrollTrigger && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      // Fade in/out using ScrollTrigger across ranges
      stages.forEach((st, idx) => {
        const nextAt = stages[idx + 1] ? stages[idx + 1].at : 1;
        const start = st.at * 100;
        const end = nextAt * 100;
        const el = msgs.find(m => m.getAttribute('data-stage') === st.key);
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 8 },
          {
            opacity: 0.9, y: 0, ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: `${start}% top`,
              end: `${end}% top`,
              scrub: true,
              onUpdate: (self) => {
                if (bar) bar.style.width = (self.progress * 100) + '%';
              }
            }
          }
        );
      });
    } else {
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  })();

  // Early Access HERO form (top section) AJAX submit
  (function initEarlyAccessHeroForm(){
    const attach = () => {
      const form = document.getElementById('ea-hero-form');
      if (!form) return;
      if (form.dataset.bound === '1') return;
      form.dataset.bound = '1';

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const scriptURL = form.getAttribute('data-script-url') || '';
        const input = form.querySelector("input[name='email']");
        const successEl = document.getElementById('ea-hero-success');
        const errorEl = document.getElementById('ea-hero-error');
        const email = (input && input.value ? input.value.trim() : '');
        if (successEl) successEl.hidden = true;
        if (errorEl) errorEl.hidden = true;
        if (!email) { alert('Please enter your email.'); return; }

        try {
          const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const result = await response.json().catch(() => null);
          if (result && result.status === 'success') {
            if (successEl) successEl.hidden = false;
            if (window.fxCelebrate) { try { window.fxCelebrate(); } catch (_) {} }
            form.reset();
          } else {
            if (errorEl) errorEl.hidden = false;
          }
        } catch (_) {
          if (errorEl) errorEl.hidden = false;
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach, { once: true });
    } else {
      attach();
    }
  })();

  // GPU Particle Nebula Background with Cursor Wake (Pixi.js)
  (function initNebulaBackground() {
    // Disable particles to match the clean reference gradient look
    const ENABLE_NEBULA = false;
    if (!ENABLE_NEBULA) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = qs('#bg-particles');
    if (reduce || !canvas || !window.PIXI) return;

    let app, particleContainer, particles = [], trailPool = [], sparkPool = [], texture;
    // SHOWCASE mode: higher density and trails (auto scales down slightly on low width/height)
    const BASE_PARTICLES = 1200;
    const MAX_PARTICLES = Math.floor(BASE_PARTICLES * Math.min(window.innerWidth, window.innerHeight) / 900);
    const TRAIL_POOL = 150;
    const palette = [0x0b1e4b, 0x1d4ed8, 0x3b82f6, 0x22d3ee, 0x67e8f9]; // deeper to brighter blues/cyan
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false };

    // Intensity profiles
    const profiles = {
      showcase: { wakeRadius: 120, wakeForce: 1.2, wobble: 0.07, pulseAmp: 0.08, pulseSpeed: 0.7, sparkCount: 3 },
      subtle:   { wakeRadius: 80,  wakeForce: 0.6, wobble: 0.045, pulseAmp: 0.04, pulseSpeed: 0.5, sparkCount: 1 }
    };
    let mode = 'showcase';

    try {
      app = new PIXI.Application({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        powerPreference: 'high-performance',
        autoDensity: true
      });


      // Particle texture: small soft circle
      const g = new PIXI.Graphics();
      g.beginFill(0xffffff, 1); g.drawCircle(0, 0, 2.2); g.endFill();
      texture = app.renderer.generateTexture(g, { resolution: 2, scaleMode: PIXI.SCALE_MODES.LINEAR });

      particleContainer = new PIXI.ParticleContainer(MAX_PARTICLES + TRAIL_POOL, {
        scale: true, position: true, uvs: false, rotation: false, tint: true, alpha: true
      });
      app.stage.addChild(particleContainer);

      // Create base field particles
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const s = new PIXI.Sprite(texture);
        s.x = Math.random() * app.screen.width;
        s.y = Math.random() * app.screen.height;
        s.alpha = 0.45 + Math.random() * 0.45;
        s.scale.set(0.8 + Math.random() * 1.1);
        s.tint = palette[(Math.random() * palette.length) | 0];
        s.vx = (Math.random() - 0.5) * 0.32;
        s.vy = (Math.random() - 0.5) * 0.32;
        particles.push(s); particleContainer.addChild(s);
      }

      // Trail pool for cursor wake (reused)
      for (let i = 0; i < TRAIL_POOL; i++) {
        const t = new PIXI.Sprite(texture);
        t.visible = false; t.alpha = 0; t.scale.set(1.3);
        t.tint = 0x7dd3fc; // brighter cyan
        t.life = 0; // frames
        trailPool.push(t); particleContainer.addChild(t);
      }

      // Spark pool (additive blend) for quick mouse moves
      const SPARK_POOL = 60;
      for (let i = 0; i < SPARK_POOL; i++) {
        const s = new PIXI.Sprite(texture);
        s.visible = false; s.alpha = 0; s.scale.set(1.6);
        s.blendMode = PIXI.BLEND_MODES.ADD;
        s.tint = 0x9ae6ff;
        s.vx = 0; s.vy = 0; s.life = 0;
        sparkPool.push(s); particleContainer.addChild(s);
      }

      const wake = (x, y) => {
        // spawn a pooled trail sprite
        const t = trailPool.find(s => !s.visible);
        if (t) {
          t.visible = true; t.alpha = 0.9; t.life = 22; t.x = x; t.y = y; t.scale.set(1.4);
        }
        // repel nearby particles
        const prof = profiles[mode];
        const R = prof.wakeRadius; const R2 = R * R; const force = prof.wakeForce;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - x; const dy = p.y - y; const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.001;
            const ux = dx / d, uy = dy / d; // unit away from cursor
            const f = (1 - d / R) * force;
            p.vx += ux * f; p.vy += uy * f;
            p.alpha = Math.min(1, p.alpha + 0.1);
            p.scale.set(Math.min(2.4, p.scale.x + 0.03));
          }
        }
      };

      let lastMX = mouse.x, lastMY = mouse.y, lastMT = performance.now();
      const onPointerMove = (e) => {
        const now = performance.now();
        const dt = Math.max(16, now - lastMT);
        const dx = e.clientX - lastMX;
        const dy = e.clientY - lastMY;
        const speed = Math.hypot(dx, dy) / dt; // px per ms
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.moved = true;
        wake(mouse.x, mouse.y);
        // spawn sparks on fast movement
        if (speed > 0.4) {
          const prof = profiles[mode];
          for (let k = 0; k < prof.sparkCount; k++) {
            const s = sparkPool.find(sp => !sp.visible);
            if (!s) break;
            s.visible = true; s.alpha = 0.9; s.life = 18;
            s.x = mouse.x; s.y = mouse.y;
            const ang = Math.random() * Math.PI * 2;
            const mag = 1.4 + Math.random() * 1.6;
            s.vx = Math.cos(ang) * mag + dx * 0.02;
            s.vy = Math.sin(ang) * mag + dy * 0.02;
            s.scale.set(1.2 + Math.random() * 0.8);
          }
        }
        lastMX = mouse.x; lastMY = mouse.y; lastMT = now;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      // Resize handling
      const onResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Ticker: update field
      let t = 0;
      app.ticker.add((delta) => {
        t += delta / 60;
        const cw = app.screen.width, ch = app.screen.height;
        // gentle drift + wrap
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          // slight perlin-ish wobble via sin/cos cheaply
          const prof = profiles[mode];
          p.x += p.vx + Math.sin((p.y + t * 36) * 0.002) * prof.wobble;
          p.y += p.vy + Math.cos((p.x + t * 28) * 0.002) * prof.wobble;
          if (p.x < -5) p.x = cw + 5; else if (p.x > cw + 5) p.x = -5;
          if (p.y < -5) p.y = ch + 5; else if (p.y > ch + 5) p.y = -5;
          // decay effects
          if (p.alpha > 0.45) p.alpha -= 0.0025;
          if (p.scale.x > 0.8) p.scale.set(p.scale.x - 0.0045);
        }
        // update trail pool
        for (let i = 0; i < trailPool.length; i++) {
          const s = trailPool[i]; if (!s.visible) continue;
          s.life -= 1; s.alpha *= 0.93; s.scale.set(s.scale.x * 1.012);
          if (s.life <= 0 || s.alpha < 0.02) { s.visible = false; s.alpha = 0; }
        }
        // update sparks
        for (let i = 0; i < sparkPool.length; i++) {
          const s = sparkPool[i]; if (!s.visible) continue;
          s.life -= 1; s.alpha *= 0.92; s.x += s.vx; s.y += s.vy; s.scale.set(s.scale.x * 0.998);
          if (s.life <= 0 || s.alpha < 0.02) { s.visible = false; s.alpha = 0; }
        }
        // global subtle pulse
        const prof = profiles[mode];
        particleContainer.alpha = 0.88 + Math.sin(t * prof.pulseSpeed) * prof.pulseAmp;
      });

      // FX intensity toggle + controller
      const toggleBtn = qs('#fx-toggle');
      const statusEl = qs('#fx-status');
      const applyUI = () => {
        if (toggleBtn) {
          toggleBtn.textContent = mode === 'showcase' ? 'FX: Showcase' : 'FX: Subtle';
          toggleBtn.setAttribute('aria-pressed', mode === 'showcase' ? 'true' : 'false');
        }
        if (statusEl) statusEl.textContent = `FX: ${mode === 'showcase' ? 'Showcase' : 'Subtle'}`;
      };
      applyUI();

      // Expose controller for external scripts (Firebase) to set mode
      window.fxController = {
        getMode: () => mode,
        setMode: (newMode, silent = false) => {
          if (newMode !== 'showcase' && newMode !== 'subtle') return;
          if (mode === newMode) { applyUI(); return; }
          mode = newMode; applyUI();
          if (!silent) {
            window.dispatchEvent(new CustomEvent('fxmodechange', { detail: { mode } }));
          }
        }
      };

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          mode = mode === 'showcase' ? 'subtle' : 'showcase';
          applyUI();
          window.dispatchEvent(new CustomEvent('fxmodechange', { detail: { mode } }));
        });
      }

    } catch (_) { /* no-op */ }

    })();

  // Button ripples and pulse feedback (supportive, not flashy)
  (function initButtonRipples() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const addRipple = (btn, x, y) => {
      if (!btn) return;
      if (!btn.querySelector('.ripple')) {
        const span = document.createElement('span');
        span.className = 'ripple';
        btn.appendChild(span);
      }
      btn.style.setProperty('--rx', `${x}px`);
      btn.style.setProperty('--ry', `${y}px`);
      if (!reduce) {
        btn.classList.add('rippling');
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('rippling'), 600);
        setTimeout(() => btn.classList.remove('pulse'), 450);
      }
    };

    document.addEventListener('pointerdown', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.btn') : null;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addRipple(btn, x, y);
    }, { passive: true });

    // Keyboard activation feedback (centered)
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const btn = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('btn') ? document.activeElement : null;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      addRipple(btn, rect.width / 2, rect.height / 2);
    });
  })();

  // GSAP-driven background gradient journey (top→mid→bottom), scroll-based
  (function initGradientJourney() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.__gradientJourneyInitialized) return;
    // If half-and-half mode layers exist, skip this journey to avoid overlap
    if (document.querySelector('.bg-half-blue') || document.querySelector('.bg-half-white')) {
      return;
    }
    const gb = qs('.global-bg');
    const top = qs('.bg-grad-top');
    const mid = qs('.bg-grad-mid');
    const bot = qs('.bg-grad-bottom');
    if (!gb || !top || !mid || !bot) return;
    if (reduce || !window.gsap || !window.ScrollTrigger) {
      // Reduced-motion or GSAP unavailable: static final warm state only
      top.style.opacity = '0';
      mid.style.opacity = '0';
      bot.style.opacity = '1';
      gb.style.setProperty('--warmAlpha', String(theme.journey.warmAlphaEnd));
      bot.classList.add('warm-ending');
      return;
    }

    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Utility scalers
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const scaleVal = (v) => {
      let out = v;
      if (isMobile) out *= theme.deviceTuning.mobileScale;
      if (reduce) out *= theme.deviceTuning.reduceMotionScale;
      return out;
    };

    // Start state
    bot.classList.add('warm-ending');
    gsap.set([top, mid, bot], { willChange: 'opacity, filter' });
    gsap.set(top, { opacity: 1, yPercent: 0 });
    gsap.set(mid, { opacity: 0, yPercent: 5 });
    gsap.set(bot, { opacity: 0, yPercent: 8 });
    gsap.set(gb, { '--warmAlpha': 0 });

    const docHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const total = () => Math.max(docHeight() - window.innerHeight, 1);

    // On mobile, compress into middle third of the scroll
    const getStart = () => isMobile ? total() * 0.33 : 0;
    const getEnd = () => isMobile ? total() * 0.66 : total();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: () => `${getStart()}px top`,
        end: () => `${getEnd()}px bottom`,
        scrub: clamp01(scaleVal(theme.journey.scrollScrub)),
      }
    });

    // Explicit segments (0–25–60–90–100%) with subtle parallax (within ±5)
    tl.to(top, { opacity: 0, yPercent: -5, ease: 'none', duration: 0.25 }, 0)
      // Mid fades in 25–60%
      .fromTo(mid, { opacity: 0, yPercent: 5 }, { opacity: 1, yPercent: -3, ease: 'none', duration: 0.35 }, 0.25)
      // Mid fades back out 60–90%
      .to(mid, { opacity: 0, yPercent: -2, ease: 'none', duration: 0.30 }, 0.60)
      // Bottom fades in 60–100%
      .fromTo(bot, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: -2, ease: 'none', duration: 0.40 }, 0.60)
      // Warmth increases along the final segment
      .to(gb, { '--warmAlpha': clamp01(scaleVal(theme.journey.warmAlphaEnd)), ease: 'none', duration: 0.40 }, 0.60);

    // Recompute on resize
    window.addEventListener('resize', () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });

    // Mark as initialized to prevent duplicate animation setups elsewhere
    window.__gradientJourneyInitialized = true;
  })();

  // Celebration bloom + lightweight confetti, then fade back to baseline
  (function initCelebrate() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gb = qs('.global-bg');
    if (!gb) return;

    const makeConfetti = () => {
      const c = document.createElement('canvas');
      c.id = 'confetti-canvas';
      c.width = window.innerWidth; c.height = window.innerHeight;
      c.style.position = 'fixed'; c.style.inset = '0'; c.style.pointerEvents = 'none'; c.style.zIndex = '5';
      gb.appendChild(c);
      const ctx = c.getContext('2d');
      const colors = ['#67e8f9', '#a78bfa', '#fbcfe8', '#ffd7b5', '#ffffff'];
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
      const baseN = Math.min(120, Math.floor((window.innerWidth + window.innerHeight) / 18));
      const N = Math.max(20, Math.floor(baseN * (theme.celebrate.confettiFactor || 1) * (isMobile ? theme.deviceTuning.mobileScale : 1)));
      const parts = Array.from({ length: N }, () => ({
        x: Math.random() * c.width,
        y: -10 - Math.random() * 40,
        vx: -1 + Math.random() * 2,
        vy: 2 + Math.random() * 2.5,
        w: 4 + Math.random() * 4,
        h: 6 + Math.random() * 10,
        r: Math.random() * Math.PI,
        vr: (-0.1 + Math.random() * 0.2),
        col: colors[(Math.random() * colors.length) | 0]
      }));

      let running = true;
      const tick = () => {
        if (!running) return;
        ctx.clearRect(0, 0, c.width, c.height);
        parts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.r += p.vr;
          if (p.y > c.height + 20) { p.y = -10; p.x = Math.random() * c.width; }
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.r);
          ctx.fillStyle = p.col;
          ctx.globalAlpha = 0.9;
          ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
          ctx.restore();
        });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return { stop: () => { running = false; c.remove(); } };
    };

    window.fxCelebrate = () => {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
      const scaleVal = (v) => {
        let out = v;
        if (isMobile) out *= theme.deviceTuning.mobileScale;
        if (reduce) out *= theme.deviceTuning.reduceMotionScale;
        return out;
      };
      const dur = Math.max(1200, Math.floor(scaleVal(theme.celebrate.lingerMs)));
      if (reduce || !window.gsap) {
        gb.classList.add('celebrate');
        setTimeout(() => gb.classList.remove('celebrate'), dur);
        return;
      }
      gb.classList.add('celebrate');
      let confetti;
      if (!reduce) { try { confetti = makeConfetti(); } catch (_) {} }
      // Bloom warmth overlay quickly
      const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
      tl.to(gb, { '--warmAlpha': clamp01(scaleVal(theme.celebrate.warmAlphaCelebrate)), duration: 0.8 }, 0)
        .to(gb, { '--warmAlpha': clamp01(scaleVal(theme.journey.warmAlphaEnd)), duration: 1.2 }, 0.8)
        .to({}, { duration: Math.max(0, (dur - 1200) / 1000) })
        .add(() => {
          if (confetti) confetti.stop();
          gb.classList.remove('celebrate');
        });
    };
  })();

  // Headline Parallax on Scroll
  (function initHeadlineParallax() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const elems = qsa('.headline, .section > .container > h2');
    if (!elems.length) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        elems.forEach(el => {
          const rect = el.getBoundingClientRect();
          // progress -1 (above) .. 1 (below)
          const p = ((rect.top + rect.height * 0.5) - vh * 0.5) / (vh * 0.5);
          const clamped = Math.max(-1, Math.min(1, p));
          const dy = clamped * -12; // px, subtle upward when centered
          el.style.transform = `translateY(${dy}px)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // Floating decorative shapes that drift with scroll
  (function initScrollFloaters() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const floaters = qsa('.scroll-floater');
    if (!floaters.length) return;

    let lastY = window.scrollY;
    const tick = () => {
      const y = window.scrollY || 0;
      const t = performance.now() * 0.001;
      floaters.forEach((el, i) => {
        const speed = 0.15 + i * 0.07; // each a bit different
        const dy = (y - lastY) * speed;
        const bob = Math.sin(t * (0.8 + i * 0.2)) * (6 + i * 2);
        const sway = Math.cos(t * (0.6 + i * 0.15)) * (4 + i * 1);
        el.style.transform = `translate3d(${sway}px, ${bob + dy}px, 0)` + (el.style.transform.includes('translateX(-50%)') ? ' translateX(-50%)' : '');
      });
      lastY = y;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

  // Early Access click tracker (counts clicks on any .ea-track link)
  (function initEarlyAccessClickTracker() {
    const KEY = 'ea_click_count';
    if (!localStorage.getItem(KEY)) {
      try { localStorage.setItem(KEY, '0'); } catch (_) { /* no-op */ }
    }
    const inc = () => {
      try {
        const current = parseInt(localStorage.getItem(KEY) || '0', 10);
        const next = isNaN(current) ? 1 : current + 1;
        localStorage.setItem(KEY, String(next));
        console.log(`[EA] Clicks: ${next}`);
        window.eaClicksCount = next;
      } catch (_) { /* no-op */ }
    };
    document.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a.ea-track') : null;
      if (!a) return;
      inc();
    }, { passive: true });
  })();

  // Early Access form submit (prevents refresh, posts JSON to Apps Script Web App)
  (function initEarlyAccessSheetForm(){
    const attach = () => {
      const form = document.getElementById('ea-sheet-form');
      if (!form) return;
      if (form.dataset.bound === '1') return; // avoid duplicate binding
      form.dataset.bound = '1';

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const scriptURL = form.getAttribute('data-script-url') || '';
        const nameEl = form.querySelector("input[name='name']");
        const input = form.querySelector("input[name='email']");
        const name = (nameEl && nameEl.value ? nameEl.value.trim() : '');
        const email = (input && input.value ? input.value.trim() : '');
        if (!name || !email) { alert('Please enter your name and email.'); return; }

        try {
          const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
          });
          const result = await response.json().catch(() => null);
          if (result && result.status === 'success') {
            alert('Thanks, you’re on the waitlist!');
            // Trigger celebratory background + confetti (non-intrusive)
            if (window.fxCelebrate) {
              try { window.fxCelebrate(); } catch (_) {}
            }
            form.reset();
          } else {
            alert('Something went wrong. Please try again.');
          }
        } catch (_) {
          alert('Network error. Please retry.');
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach, { once: true });
    } else {
      attach();
    }
  })();

  // Mobile nav toggle
  const navToggle = qs('.nav-toggle');
  const navMenu = qs('#nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on link click (mobile)
    qsa('#nav-menu a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scrolling for anchor links
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      // Special case: #top points to the fixed header; scrolling it into view does nothing.
      // Scroll the window to the top instead.
      if (targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', targetId);
        return;
      }
      const target = qs(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    });
  });

  // Intersection reveal
  const revealables = new Set();
  const addRevealTargets = () => {
    qsa('.section h2, .section p, .section .grid > *, .section .card, .site-footer .container > *').forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealables.add(el);
      }
    });
  };
  addRevealTargets();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealables.forEach(el => io.observe(el));

  // Typing glow on inputs and textareas
  (function initTypingGlow() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inputs = qsa('input, textarea');
    inputs.forEach((el) => {
      let t;
      const onInput = () => {
        el.classList.add('typing');
        if (t) clearTimeout(t);
        t = setTimeout(() => el.classList.remove('typing'), reduce ? 400 : 900);
      };
      el.addEventListener('input', onInput);
      el.addEventListener('blur', () => { el.classList.remove('typing'); });
    });
  })();

  // Active nav highlight (scroll spy)
  const sections = qsa('section[id]');
  const navLinks = qsa('.site-nav a[href^="#"]');
  const setActive = (id) => {
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
    });
  };
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  // Smooth scroll is already applied globally; ensure EA anchors use it
  // Early Access modal logic
  (function initEarlyAccessModal(){
    const modal = qs('#ea-modal');
    if (!modal) return;
    const openers = qsa('[data-ea-open]');
    const closeBtn = modal.querySelector('.ea-close');
    const backdrop = modal.querySelector('.ea-backdrop');

    const open = () => { modal.hidden = false; document.body.classList.add('no-scroll'); };
    const close = () => { modal.hidden = true; document.body.classList.remove('no-scroll'); };

    // Intercept clicks on any EA buttons and open the modal instead of navigating
    openers.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    }));

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
  })();

  // Early Access inline form (mid-page)
  (function initEarlyAccessInline(){
    const form = qs('#early-access-form');
    if (!form) return;
    const emailEl = qs('#ea-email');
    const successEl = qs('#ea-inline-success');
    const errorEl = qs('#ea-inline-error');

    const show = (el, on) => { if (el) el.hidden = !on; };
    const mockPost = async (payload) => new Promise((res) => setTimeout(() => res({ ok: true }), 500));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      show(successEl, false); show(errorEl, false);
      if (!form.reportValidity()) return;
      const email = emailEl.value.trim();
      try {
        // store locally as a simple queue
        const key = 'root_ea_emails';
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        current.push({ email, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(current));
        // mock API call
        const res = await mockPost({ email });
        if (res.ok) {
          show(successEl, true);
          form.reset();
        } else {
          show(errorEl, true);
        }
      } catch (_) {
        show(errorEl, true);
      }
    });
  })();

  // CTA pulses for Early Access and Success Stories headings/buttons
  (function initCTAPulses(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const eaSec = qs('#early-access');
    const eaBtn = qs('#early-access .ea-btn');
    const successSec = qs('#projects');
    const pulse = (el) => { if (!el) return; el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 500); };

    if (eaSec && eaBtn) {
      const appear = new IntersectionObserver((ents) => {
        ents.forEach(ent => {
          if (ent.isIntersecting) {
            pulse(eaBtn);
            let timer;
            const start = () => { timer = setInterval(() => pulse(eaBtn), 4500); };
            const stop = () => { if (timer) clearInterval(timer); };
            start();
            const off = new IntersectionObserver((es) => {
              es.forEach(e => { if (!e.isIntersecting) { stop(); off.disconnect(); } });
            }, { threshold: 0.1 });
            off.observe(eaSec);
            appear.disconnect();
          }
        });
      }, { threshold: 0.6 });
      appear.observe(eaSec);
    }

    if (successSec) {
      const h2 = successSec.querySelector('h2');
      if (h2) {
        const io2 = new IntersectionObserver((ents) => {
          ents.forEach(ent => { if (ent.isIntersecting) { pulse(h2); io2.disconnect(); } });
        }, { threshold: 0.7 });
        io2.observe(h2);
      }
    }
  })();

  // Contact form submit (Formspree AJAX)
  const form = qs('#contact-form');
  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    const successMsg = qs('#contact-success');
    const errorMsg = qs('#contact-error');
    const endpoint = form.getAttribute('action') || '';

    const setState = (sending) => {
      if (!btn) return;
      btn.disabled = sending;
      btn.textContent = sending ? 'Sending…' : 'Send Message';
    };

    const show = (el, on) => { if (el) el.hidden = !on; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      show(successMsg, false); show(errorMsg, false);

      // Guard: require a real Formspree endpoint
      if (endpoint.includes('REPLACE_WITH_YOUR_FORM_ID')) {
        show(errorMsg, true);
        if (errorMsg) errorMsg.textContent = 'Form is not connected yet. Replace the action URL with your Formspree endpoint.';
        return;
      }

      // Basic HTML5 validation check
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      setState(true);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          show(successMsg, true);
          form.reset();
        } else {
          show(errorMsg, true);
        }
      } catch (_) {
        show(errorMsg, true);
      } finally {
        setState(false);
      }
    });
  }

  // Subtle parallax for global background orbs
  (function initParallax() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const bg = qs('.global-bg');
    if (!bg) return;

    const orbA = qs('.global-bg .orb-a');
    const orbB = qs('.global-bg .orb-b');
    const orbC = qs('.global-bg .orb-c');
    if (!orbA || !orbB || !orbC) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let lastScrollY = window.scrollY;

    const onMouseMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w) * 2 - 1; // -1..1
      const ny = (e.clientY / h) * 2 - 1; // -1..1
      targetX = nx;
      targetY = ny;
    };

    const onScroll = () => {
      lastScrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      // ease towards mouse position
      currentX = lerp(currentX, targetX, 0.04);
      currentY = lerp(currentY, targetY, 0.04);

      // convert to pixel offsets (smaller for subtlety)
      const base = Math.min(window.innerWidth, window.innerHeight);
      const mx = currentX * (base * 0.02); // up to ~2% of min dimension
      const my = currentY * (base * 0.02);

      // scroll-based offset (very light)
      const sy = lastScrollY * 0.03; // 3% of scroll

      // set CSS variables differently per orb for parallax depth
      orbA.style.setProperty('--px', `${mx * 0.8}px`);
      orbA.style.setProperty('--py', `${my * 0.8 + sy * 0.10}px`);

      orbB.style.setProperty('--px', `${mx * -0.6}px`);
      orbB.style.setProperty('--py', `${my * 0.5 + sy * 0.08}px`);

      orbC.style.setProperty('--px', `${mx * 0.4}px`);
      orbC.style.setProperty('--py', `${my * -0.6 + sy * 0.06}px`);

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

  // Initialize intro entrance animations
  const runIntro = () => {
    qsa('.intro-anim').forEach(el => requestAnimationFrame(() => el.classList.add('in')));
  };
  window.addEventListener('load', runIntro);

  // Pixi.js fluid preloader with curtains
  const initPreloader = () => {
    const pre = qs('.preloader-container');
    const barContainer = qs('.progress-bar-container');
    const bar = qs('.progress-bar');
    const topCurtain = qs('.top-curtain');
    const bottomCurtain = qs('.bottom-curtain');
    const fluidWrap = qs('#fluid-container');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!pre || !barContainer || !bar || !topCurtain || !bottomCurtain || !fluidWrap) return;
    // Disable scroll while preloader is visible
    document.body.classList.add('no-scroll');

    // Initialize PIXI fluid background (skip if reduced motion or PIXI missing)
    let app = null, uniforms = null, graphics = null;
    if (!reduce && window.PIXI && fluidWrap) {
      try {
        app = new PIXI.Application({
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          powerPreference: 'high-performance'
        });
        fluidWrap.innerHTML = '';
        fluidWrap.appendChild(app.view);

        const shaderCode = `precision highp float;uniform float u_time;uniform vec2 u_resolution;vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xzyw;vec4 a1=b1.xzyw+s1.xzyw*sh.xzyw;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}float random(in vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}void main(){vec2 st=gl_FragCoord.xy/u_resolution.y;st.x*=u_resolution.x/u_resolution.y;float n1=snoise(vec3(st*1.5,u_time*0.05));float n2=snoise(vec3(st*2.0,u_time*-0.025));float n3=snoise(vec3(st*3.0,u_time*0.01));float finalNoise=(n1+n2+n3)/3.0;vec3 color=vec3(0.0);vec3 black=vec3(0.0);vec3 darkBlue=vec3(0.0,0.0,0.05);vec3 purple=vec3(0.2,0.0,0.2);vec3 gray=vec3(0.1,0.1,0.1);color=mix(black,darkBlue,smoothstep(-0.5,0.0,finalNoise));color=mix(color,purple,smoothstep(0.0,0.5,finalNoise));color=mix(color,gray,smoothstep(0.5,1.0,finalNoise));vec2 starSt=gl_FragCoord.xy/u_resolution.y;starSt.x*=u_resolution.x/u_resolution.y;starSt*=10.0;float star=step(0.999,random(starSt));color=mix(color,vec3(1.0),star);gl_FragColor=vec4(color,1.0);}`;

        uniforms = { u_time: 0, u_resolution: new PIXI.Point(window.innerWidth, window.innerHeight) };
        const shader = new PIXI.Filter(null, shaderCode, uniforms);
        graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 0, app.screen.width, app.screen.height);
        graphics.endFill();
        graphics.filters = [shader];
        app.stage.addChild(graphics);

        app.ticker.add((delta) => { uniforms.u_time += delta / 60; });
        window.addEventListener('resize', () => {
          if (!app) return;
          app.renderer.resize(window.innerWidth, window.innerHeight);
          if (uniforms && uniforms.u_resolution) uniforms.u_resolution.set(window.innerWidth, window.innerHeight);
          if (graphics) { graphics.clear(); graphics.beginFill(0xFFFFFF); graphics.drawRect(0, 0, app.screen.width, app.screen.height); graphics.endFill(); }
        });
      } catch (e) { /* no-op */ }
    }

    // Progress bar sequence
    setTimeout(() => {
      barContainer.style.opacity = '1';
      bar.style.animation = 'fill-bar 2s ease-out forwards';
    }, 500);

    // Curtain open & reveal
    setTimeout(() => {
      pre.style.opacity = '0';
      topCurtain.classList.add('open');
      bottomCurtain.classList.add('open');

      setTimeout(() => {
        pre.style.display = 'none';
        document.body.classList.remove('no-scroll');
        // Clean up PIXI once reveal completes to save resources
        if (app) {
          try { app.destroy(true, { children: true, texture: true, baseTexture: true }); } catch (e) {}
          fluidWrap.innerHTML = '';
          app = null; graphics = null; uniforms = null;
        }
      }, 600);
    }, 2500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }

  // Feature-flag legacy hero backgrounds (disabled to use new global background)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ENABLE_LEGACY_HERO_BG = false;
  // Morphing gradient background using Granim (disabled)
  const gradientCanvas = qs('#gradient-canvas');
  if (ENABLE_LEGACY_HERO_BG && !prefersReduced && gradientCanvas && window.Granim) {
    try {
      // eslint-disable-next-line no-undef
      new Granim({
        element: '#gradient-canvas',
        name: 'root-gradient',
        direction: 'diagonal',
        opacity: [1, 1],
        states: {
          "default-state": {
            gradients: [
              ['#0a0b12', '#1b1e2e'],
              ['#0b1323', '#1a1030'],
              ['#0c1a22', '#161d2b']
            ],
            transitionSpeed: 6000
          },
          hover: {
            gradients: [
              ['#0a0b12', '#1a1030'],
              ['#0a0b12', '#161d2b']
            ],
            transitionSpeed: 3000
          }
        }
      });
    } catch (e) { /* no-op */ }
  }

  // Particles background using tsParticles (disabled)
  const particleEl = qs('#tsparticles');
  if (ENABLE_LEGACY_HERO_BG && !prefersReduced && particleEl && window.tsParticles) {
    tsParticles.load({
      id: 'tsparticles',
      options: {
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          color: { value: ['#6be0ff', '#8b5cf6', '#22d3ee'] },
          links: { enable: true, color: '#6be0ff', opacity: 0.25, width: 1 },
          move: { enable: true, speed: 1.2, direction: 'none', outModes: { default: 'out' } },
          opacity: { value: 0.5 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } }
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            repulse: { distance: 100, duration: 0.3 },
            push: { quantity: 2 }
          }
        }
      }
    });
  }

  // ===== GSAP-powered background story and reveals =====
  (function initGsapStory(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || reduce) return;
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const bg = document.querySelector('.global-bg');
    const gradTop = document.querySelector('.bg-grad-top');
    const gradMid = document.querySelector('.bg-grad-mid');
    const gradBot = document.querySelector('.bg-grad-bottom');
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

    // Only set up gradient/parallax here if not already initialized by initGradientJourney
    if (!window.__gradientJourneyInitialized && gradTop && gradMid && gradBot) {
      gsap.set(gradTop, { opacity: 1, yPercent: 0 });
      gsap.set(gradMid, { opacity: 0, yPercent: 5 });
      gsap.set(gradBot, { opacity: 0, yPercent: 10 });

      // Scroll-driven transition from dark (top) -> mid blues/cyan -> soft white bottom
      const total = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      // Balanced + Warm Ending parallax: top -6, mid -4, bottom -2
      tl.to(gradTop, { opacity: 0.18, yPercent: -6 }, 0)
        .to(gradMid, { opacity: 0.55, yPercent: -4 }, 0)
        .to(gradBot, { opacity: 0.72, yPercent: -2 }, 0);

      if (window.ScrollTrigger) {
        if (isMobile) {
          // Compress journey into the middle third on mobile for performance and clarity
          const startPx = total * 0.33; // start ~33%
          const endPx = total * 0.66;   // end ~66%
          window.ScrollTrigger.create({
            animation: tl,
            start: startPx,
            end: endPx,
            scrub: 1.2
          });
        } else {
          window.ScrollTrigger.create({
            animation: tl,
            start: 'top top',
            end: () => `+=${total}`,
            scrub: 1.2
          });
        }
      }
    }

    // Always-on warm ending overlay: fade in over the last 20% of total scroll
    if (!window.__gradientJourneyInitialized && gradBot && window.ScrollTrigger) {
      gradBot.classList.add('warm-ending');
      gsap.set(gradBot, { "--warmAlpha": 0 });
      const startPx = () => Math.max(document.body.scrollHeight - window.innerHeight, 1) * storyConfig.scrollStart;
      const endPx = () => Math.max(document.body.scrollHeight - window.innerHeight, 1);
      gsap.to(gradBot, {
        "--warmAlpha": storyConfig.warmAlphaEnd,
        ease: 'none',
        scrollTrigger: {
          start: startPx,
          end: endPx,
          scrub: 1.2
        }
      });
    }

    // Headline and section heading reveal synced to journey
    const h1 = document.querySelector('.hero .headline');
    if (h1) {
      gsap.fromTo(h1, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.15 });
    }
    document.querySelectorAll('.section .container > h2').forEach((el, i) => {
      if (!window.ScrollTrigger) return;
      gsap.fromTo(el, { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 78%', once: true }
      });
    });

    // Section hopeful pulse backdrop on enter (limit to Early Access and Success Stories)
    document.querySelectorAll('#early-access, #projects').forEach((sec) => {
      if (!window.ScrollTrigger) return;
      window.ScrollTrigger.create({
        trigger: sec,
        start: 'top 70%',
        onEnter: () => {
          sec.classList.add('pulse-active');
          // subtle timed fade-out to keep it professional
          gsap.to(sec, { duration: 1.2, onComplete: () => sec.classList.remove('pulse-active') });
        }
      });
    });

    // Background parallax slight effect
    if (bg && window.ScrollTrigger) {
      const parallax = gsap.timeline({ defaults: { ease: 'none' } });
      // Reduce parallax on mobile to keep motion subtle
      const yVal = isMobile ? -1.5 : -5;
      parallax.to('.global-bg', { yPercent: yVal }, 0);
      window.ScrollTrigger.create({ animation: parallax, start: 'top top', end: 'bottom bottom', scrub: 0.6 });
    }

    // Subtle slide-in for section elements (10–15px offset). We animate translateY only;
    // the opacity fade is handled by existing CSS (.reveal.visible)
    if (window.ScrollTrigger) {
      const items = gsap.utils.toArray('.section p, .section .card, .section .grid > *');
      items.forEach((el) => {
        // Avoid double animating big headings handled above
        if (el.matches('.section > .container > h2')) return;
        gsap.fromTo(el, { y: 14 }, {
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        });
      });
    }

    // Expose celebration trigger
    const makeConfetti = () => {
      try {
        const container = document.querySelector('.global-bg');
        if (!container) return;
        const c = document.createElement('canvas');
        c.width = window.innerWidth; c.height = window.innerHeight;
        c.style.position = 'absolute'; c.style.inset = '0'; c.style.zIndex = 3; c.style.pointerEvents = 'none'; c.style.opacity = '0.8';
        container.appendChild(c);
        const ctx = c.getContext('2d');
        const N = Math.min(160, Math.floor(window.innerWidth / 9));
        const parts = Array.from({ length: N }).map(() => ({
          x: Math.random() * c.width,
          y: -20 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 1.8 + Math.random() * 3.2,
          w: 5 + Math.random() * 7,
          h: 8 + Math.random() * 12,
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
          color: `hsl(${Math.floor(165 + Math.random() * 60)}, 85%, ${58 + Math.random() * 14}%)`
        }));
        let t = 0;
        const render = () => {
          ctx.clearRect(0,0,c.width,c.height);
          for (const p of parts) {
            p.x += p.vx; p.y += p.vy; p.r += p.vr;
            p.x += Math.sin((p.y + t) * 0.01);
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
            ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
          }
          t += 1;
        };
        const ticker = () => render();
        gsap.ticker.add(ticker);
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.ticker.remove(ticker);
            c.remove();
          }
        });
        tl.to(c, { opacity: 0.85, duration: 0.3 })
          .to({}, { duration: 5.2 }) // run for ~5-7s range
          .to(c, { opacity: 0, duration: 0.8 }, '>-0.0');
      } catch (_) {}
    };

    window.fxCelebrate = () => {
      const el = document.querySelector('.global-bg');
      const bot = document.querySelector('.bg-grad-bottom');
      if (!el) return;
      el.classList.add('celebrate');
      // Boost warm overlay during celebration, then return to scroll-driven value
      if (bot) {
        const cs = getComputedStyle(bot);
        const prev = parseFloat(cs.getPropertyValue('--warmAlpha')) || 0;
        gsap.to(bot, { "--warmAlpha": storyConfig.warmAlphaCelebrate, duration: 0.4, ease: 'power2.out' });
        setTimeout(() => {
          gsap.to(bot, { "--warmAlpha": prev, duration: 0.8, ease: 'power2.inOut' });
        }, storyConfig.celebrateDuration);
      }
      makeConfetti();
      // Auto-return to regular palette after ~6s
      setTimeout(() => { el.classList.remove('celebrate'); }, storyConfig.celebrateDuration);
    };

    // Optional: external control for warm-ending overlay
    window.fxWarmEnding = {
      enable: () => { const b = document.querySelector('.bg-grad-bottom'); if (b) b.classList.add('warm-ending'); },
      disable: () => { const b = document.querySelector('.bg-grad-bottom'); if (b) b.classList.remove('warm-ending'); }
    };
  })();

})();
