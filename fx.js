// 마우스 반짝이: 움직이면 가는 별빛이 따라오고, 누르면 별빛이 한 번 퍼진다 (브루 청록 한 가지 색조)
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'fx'; document.body.appendChild(cv);
  const g = cv.getContext('2d');
  const COLORS = ['#14A1C8', '#14A1C8', '#5CC4E0', '#A9E3F2', '#FFFFFF'];
  let W = 0, H = 0, D = 1, ps = [], raf = 0, last = 0, lx = 0, ly = 0;
  const size = () => { D = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; g.setTransform(D, 0, 0, D, 0, 0); };
  addEventListener('resize', size); size();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  function add(x, y, o) { if (ps.length < 260) ps.push({ x, y, vx: o.vx, vy: o.vy, g: o.g, r: o.r, rot: rnd(0, 1.57), vr: rnd(-1.6, 1.6), life: 0, max: o.max, c: o.c || pick(COLORS), k: o.k }); }
  function burst(x, y) {
    for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.283 + rnd(-.2, .2), s = rnd(90, 300); add(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 90, r: rnd(3.5, 9), max: rnd(.5, .95), k: i % 3 ? 'star' : 'dot' }); }
    add(x, y, { vx: 0, vy: 0, g: 0, r: 6, max: .5, k: 'ring', c: '#14A1C8' });
    add(x, y, { vx: 0, vy: 0, g: 0, r: 15, max: .32, k: 'star', c: '#FFFFFF' });
    kick();
  }
  function trail(x, y) {
    if (Math.hypot(x - lx, y - ly) < 34) return;
    lx = x; ly = y;
    add(x + rnd(-5, 5), y + rnd(-5, 5), { vx: rnd(-14, 14), vy: rnd(-34, -8), g: 30, r: rnd(2.2, 5), max: rnd(.5, .85), k: Math.random() < .7 ? 'star' : 'dot' });
    kick();
  }
  // 가는 네 갈래 별빛
  function star(r) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .2 : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); g.fill(); }
  function draw(p, t) {
    const a = 1 - t; g.globalAlpha = Math.max(0, a * a * (3 - 2 * a)) * .9;
    g.fillStyle = p.c; g.strokeStyle = p.c;
    if (p.k === 'ring') { g.lineWidth = 1.5; g.globalAlpha *= .7; g.beginPath(); g.arc(p.x, p.y, 6 + (1 - (1 - t) * (1 - t)) * 54, 0, 6.283); g.stroke(); return; }
    g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
    const r = p.r * (.5 + .5 * Math.sin(Math.min(1, t * 1.6) * Math.PI));
    g.shadowColor = 'rgba(20,161,200,.55)'; g.shadowBlur = 8;
    if (p.k === 'star') star(r); else { g.beginPath(); g.arc(0, 0, r * .32, 0, 6.283); g.fill(); }
    g.restore();
  }
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    g.clearRect(0, 0, W, H);
    ps = ps.filter(p => (p.life += dt) < p.max);
    for (const p of ps) { p.vy += p.g * dt; p.vx *= .94; p.vy *= .94; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; draw(p, p.life / p.max); }
    g.globalAlpha = 1;
    raf = ps.length ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('pointerdown', e => burst(e.clientX, e.clientY), { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType !== 'touch') trail(e.clientX, e.clientY); }, { passive: true });
  window.__fx = { burst, trail };
})();
