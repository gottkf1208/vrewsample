// 마우스 반짝이: 움직이면 별가루가 따라오고, 누르면 별·재생 단추·필름 조각이 팡 터져요
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'fx'; document.body.appendChild(cv);
  const g = cv.getContext('2d');
  const COLORS = ['#14A1C8', '#24B7D0', '#7FD8EC', '#FFD34D', '#FF8FB1', '#FFFFFF'];
  let W = 0, H = 0, D = 1, ps = [], raf = 0, last = 0, lx = 0, ly = 0;
  const size = () => { D = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; g.setTransform(D, 0, 0, D, 0, 0); };
  addEventListener('resize', size); size();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  function add(x, y, o) {
    if (ps.length > 420) return;
    ps.push({ x, y, vx: o.vx, vy: o.vy, g: o.g, r: o.r, rot: rnd(0, 6.3), vr: rnd(-6, 6), life: 0, max: o.max, c: pick(COLORS), k: o.k });
  }
  function burst(x, y) {
    for (let i = 0; i < 26; i++) { const a = rnd(0, 6.283), s = rnd(120, 520); add(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s - 90, g: 620, r: rnd(5, 13), max: rnd(.55, 1.05), k: pick(['star', 'star', 'star', 'play', 'film', 'dot']) }); }
    add(x, y, { vx: 0, vy: 0, g: 0, r: 8, max: .42, k: 'ring' });
  }
  function star(r) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .34 : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); g.fill(); }
  function draw(p, t) {
    const a = 1 - t; g.globalAlpha = Math.max(0, a * a * (3 - 2 * a));
    g.fillStyle = p.c; g.strokeStyle = p.c;
    if (p.k === 'ring') { g.lineWidth = 3 * (1 - t); g.beginPath(); g.arc(p.x, p.y, 8 + t * 74, 0, 6.283); g.stroke(); return; }
    g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
    const r = p.r * (.6 + .4 * (1 - t));
    if (p.k === 'star') star(r);
    else if (p.k === 'dot') { g.beginPath(); g.arc(0, 0, r * .45, 0, 6.283); g.fill(); }
    else if (p.k === 'play') { g.beginPath(); g.moveTo(-r * .6, -r * .75); g.lineTo(r * .85, 0); g.lineTo(-r * .6, r * .75); g.closePath(); g.fill(); }
    else { g.lineWidth = 2; g.strokeRect(-r, -r * .7, r * 2, r * 1.4); g.fillRect(-r * .55, -r * .3, r * 1.1, r * .6); }
    g.restore();
  }
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    g.clearRect(0, 0, W, H);
    ps = ps.filter(p => (p.life += dt) < p.max);
    for (const p of ps) { p.vy += p.g * dt; p.vx *= .985; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; draw(p, p.life / p.max); }
    g.globalAlpha = 1;
    raf = ps.length ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('pointerdown', e => { burst(e.clientX, e.clientY); kick(); }, { passive: true });
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const d = Math.hypot(e.clientX - lx, e.clientY - ly); if (d < 26) return;
    lx = e.clientX; ly = e.clientY;
    add(lx + rnd(-6, 6), ly + rnd(-6, 6), { vx: rnd(-30, 30), vy: rnd(-70, -10), g: 160, r: rnd(3, 7), max: rnd(.45, .8), k: Math.random() < .75 ? 'star' : 'dot' });
    kick();
  }, { passive: true });
})();
