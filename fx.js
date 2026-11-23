// 마우스 효과: 누르면 스티커 같은 네 갈래 별이 팡 터진다 (쿼카 모션랩 「반짝 별」의 그림체: 굵은 먹선 + 청록·흰 면)
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'fx'; document.body.appendChild(cv);
  const g = cv.getContext('2d');
  const INK = '#16242C', FILLS = ['#14A1C8', '#14A1C8', '#FFFFFF', '#BFEAF5'];
  let W = 0, H = 0, D = 1, ps = [], raf = 0, last = 0, lx = -99, ly = -99, lt = 0;
  const size = () => { D = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; g.setTransform(D, 0, 0, D, 0, 0); };
  addEventListener('resize', size); size();
  const rnd = (a, b) => a + Math.random() * (b - a);
  // 통통 튀는 등장: 0 → 1.18 → 1
  const pop = t => t < .45 ? 1.18 * (1 - Math.pow(1 - t / .45, 3)) : 1.18 - .18 * Math.min(1, (t - .45) / .25);
  function starPath(r, k) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, q = i % 2 ? r * k : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); }
  function add(o) { if (ps.length < 160) ps.push(Object.assign({ life: 0, rot: rnd(-.5, .5), vr: rnd(-2.4, 2.4) }, o)); }
  function burst(x, y) {
    const n = 9, off = rnd(0, 6.28);
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * 6.283 + rnd(-.18, .18), s = rnd(210, 430), big = i % 3 === 0;
      add({ k: 'star', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, r: big ? rnd(15, 21) : rnd(8, 12), c: FILLS[i % FILLS.length], max: rnd(.75, 1.05), drag: 3.4, grav: 240 });
    }
    for (let i = 0; i < 8; i++) { const a = rnd(0, 6.283), s = rnd(260, 520); add({ k: 'dot', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rnd(2.5, 4.5), c: i % 2 ? '#14A1C8' : INK, max: rnd(.45, .7), drag: 4.2, grav: 120 }); }
    add({ k: 'ring', x, y, vx: 0, vy: 0, r: 10, c: '#14A1C8', max: .42, drag: 0, grav: 0 });
    add({ k: 'star', x, y, vx: 0, vy: 0, r: 30, c: '#FFFFFF', max: .34, drag: 0, grav: 0, vr: 3 });
    kick();
  }
  function trail(x, y) {
    const now = performance.now();
    if (Math.hypot(x - lx, y - ly) < 90 || now - lt < 110) return;
    lx = x; ly = y; lt = now;
    add({ k: 'star', x: x + rnd(-8, 8), y: y + rnd(-8, 8), vx: rnd(-20, 20), vy: rnd(-50, -20), r: rnd(5, 8), c: Math.random() < .5 ? '#14A1C8' : '#FFFFFF', max: rnd(.5, .7), drag: 2, grav: 60 });
    kick();
  }
  function draw(p) {
    const t = p.life / p.max, fade = t > .68 ? 1 - (t - .68) / .32 : 1;
    g.globalAlpha = Math.max(0, fade);
    if (p.k === 'ring') { const e = 1 - Math.pow(1 - t, 3); g.strokeStyle = p.c; g.lineWidth = 5 * (1 - t) + 1; g.beginPath(); g.arc(p.x, p.y, 10 + e * 78, 0, 6.283); g.stroke(); return; }
    g.save(); g.translate(p.x, p.y);
    if (p.k === 'dot') { g.fillStyle = p.c; g.beginPath(); g.arc(0, 0, p.r * (1 - t * .5), 0, 6.283); g.fill(); g.restore(); return; }
    g.rotate(p.rot); const r = p.r * pop(Math.min(1, t * 1.9));
    starPath(r, .38); g.lineJoin = 'round'; g.lineWidth = Math.max(2.2, p.r * .2); g.strokeStyle = INK; g.stroke(); g.fillStyle = p.c; g.fill();
    g.restore();
  }
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    g.clearRect(0, 0, W, H);
    ps = ps.filter(p => (p.life += dt) < p.max);
    for (const p of ps) { const d = Math.exp(-p.drag * dt); p.vx *= d; p.vy = p.vy * d + p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; draw(p); }
    g.globalAlpha = 1;
    raf = ps.length ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('pointerdown', e => burst(e.clientX, e.clientY), { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType !== 'touch') trail(e.clientX, e.clientY); }, { passive: true });
  window.__fx = { burst, trail };
})();
