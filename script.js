/* EVE.DIGITAL — interactions */
(() => {
  const root   = document.documentElement;
  const nav    = document.getElementById('nav');
  const stage  = document.getElementById('stage');
  const robot  = document.getElementById('robot');
  const glow   = document.getElementById('cursorGlow');
  const sparks = document.getElementById('sparks');
  const coords = document.getElementById('coords');
  const eyes   = [document.getElementById('eyeL'), document.getElementById('eyeR')];

  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- mouse state ---------- */
  const mouse = { x: innerWidth / 2, y: innerHeight * 0.4 };
  const eyeOff = { x: 0, y: 0 };        // lerped pupil offset
  const tilt   = { x: 0, y: 0 };        // lerped robot tilt

  addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    glow.style.setProperty('--gx', e.clientX + 'px');
    glow.style.setProperty('--gy', e.clientY + 'px');
    coords.textContent =
      'X:' + String(e.clientX).padStart(4, '0') +
      '  Y:' + String(e.clientY).padStart(4, '0');
    maybeSpark(e.clientX, e.clientY);
  }, { passive: true });

  /* ---------- interactive blueprint: sparks + coordinates ---------- */
  let lastSpark = { x: -999, y: -999, t: 0 };
  function maybeSpark(x, y) {
    const now = performance.now();
    const dx = x - lastSpark.x, dy = y - lastSpark.y;
    if (dx * dx + dy * dy < 3600 || now - lastSpark.t < 110) return;
    lastSpark = { x, y, t: now };
    const r = stage.getBoundingClientRect();
    const gx = Math.round((x - r.left) / 12) * 12;
    const gy = Math.round((y - r.top) / 12) * 12;
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = gx + 'px';
    s.style.top = gy + 'px';
    s.textContent = `${String(gx).padStart(3, '0')}:${String(gy).padStart(3, '0')}`;
    sparks.appendChild(s);
    setTimeout(() => s.remove(), 1150);
  }

  /* ---------- living eyes ---------- */
  const EYE_RANGE = { x: 9, y: 6 };     // px travel inside the socket
  let blinkT = 0;

  function blinkLoop() {
    blinkT = performance.now() + 2600 + Math.random() * 3200;
  }
  blinkLoop();

  function frame(now) {
    // vector from face center to cursor
    const head = document.getElementById('layerHead').getBoundingClientRect();
    const fx = head.left + head.width * 0.43;   // approx face centre
    const fy = head.top + head.height * 0.28;
    let vx = (mouse.x - fx) / (innerWidth * 0.5);
    let vy = (mouse.y - fy) / (innerHeight * 0.5);
    vx = Math.max(-1, Math.min(1, vx));
    vy = Math.max(-1, Math.min(1, vy));

    eyeOff.x = lerp(eyeOff.x, vx * EYE_RANGE.x, 0.09);
    eyeOff.y = lerp(eyeOff.y, vy * EYE_RANGE.y, 0.09);

    // robot tilt (very subtle)
    tilt.x = lerp(tilt.x, -vy * 3, 0.05);
    tilt.y = lerp(tilt.y, vx * 4, 0.05);
    robot.style.setProperty('--rx', tilt.x.toFixed(3) + 'deg');
    robot.style.setProperty('--ry', tilt.y.toFixed(3) + 'deg');

    // blink: quick scaleY dip
    let sy = 1;
    const dt = now - blinkT;
    if (dt > 0 && dt < 140) sy = 1 - Math.sin((dt / 140) * Math.PI) * 0.85;
    else if (dt >= 140) blinkLoop();

    for (const e of eyes) {
      e.style.setProperty('--dx', eyeOff.x.toFixed(2) + 'px');
      e.style.setProperty('--dy', eyeOff.y.toFixed(2) + 'px');
      e.style.setProperty('--sy', sy.toFixed(3));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- scroll: disassembly progress ---------- */
  const forcedP = new URLSearchParams(location.search).get('p');
  function onScroll() {
    const hero = document.querySelector('.hero');
    const p = forcedP !== null ? +forcedP
      : Math.min(Math.max(scrollY / (hero.offsetHeight - innerHeight), 0), 1);
    root.style.setProperty('--p', p.toFixed(4));
    nav.classList.toggle('is-solid', scrollY > 40);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============ BOOT PRELOADER ============ */
(() => {
  const boot = document.getElementById('boot');
  if (!boot) return;
  const bar = document.getElementById('bootBar');
  const log = document.getElementById('bootLog');
  const steps = [
    'SYSTEM BOOT…', 'LOADING MODULES…', 'UNIT ZTRX-07 ONLINE',
    'OPTIC ARRAY… OK', 'PWR-CORE… OK', 'INTERFACE READY',
  ];
  let i = 0;
  const tick = () => {
    log.textContent = steps[i];
    bar.style.width = Math.round(((i + 1) / steps.length) * 100) + '%';
    if (++i < steps.length) setTimeout(tick, 160 + Math.random() * 140);
    else setTimeout(() => boot.classList.add('is-done'), 350);
  };
  tick();
})();

/* ============ SCROLL REVEAL + COUNTERS ============ */
(() => {
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const cio = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const run = t => {
        const k = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
})();

/* ============ MAGNETIC BUTTONS ============ */
(() => {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.22;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy - 2}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
})();
