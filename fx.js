// 마우스 효과: 어린 왕자의 별과 장미. 움직이면 작은 금빛 별이 드문드문 반짝이고, 누르면 별 몇 개와 꽃잎 두어 장이 조용히 흩어진다
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'fx'; document.body.appendChild(cv);
  const g = cv.getContext('2d');
  const GOLD = ['#F2C14E', '#F7D774', '#FFE9A8'], ROSE = ['#D9475A', '#E8798A'];
  let W = 0, H = 0, D = 1, ps = [], raf = 0, last = 0, lx = -99, ly = -99, lt = 0;
  const size = () => { D = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; g.setTransform(D, 0, 0, D, 0, 0); };
  addEventListener('resize', size); size();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  function add(o) { if (ps.length < 90) ps.push(Object.assign({ life: 0, rot: rnd(0, 6.28), vr: rnd(-1.2, 1.2) }, o)); }
  function burst(x, y) {
    const n = 5, off = rnd(0, 6.28);
    for (let i = 0; i < n; i++) { const a = off + (i / n) * 6.283 + rnd(-.25, .25), s = rnd(46, 92); add({ k: 'star', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 14, r: rnd(3.2, 6.2), c: pick(GOLD), max: rnd(.7, 1), drag: 2.6, grav: 16 }); }
    for (let i = 0; i < 2; i++) add({ k: 'petal', x: x + rnd(-6, 6), y: y + rnd(-4, 4), vx: rnd(-34, 34), vy: rnd(-46, -18), r: rnd(4.5, 6.5), c: ROSE[i], max: rnd(1.1, 1.5), drag: 1.4, grav: 70, sway: rnd(0, 6.28) });
    add({ k: 'glow', x, y, vx: 0, vy: 0, r: 14, c: '#FFE9A8', max: .45, drag: 0, grav: 0 });
    kick();
  }
  function trail(x, y) {
    const now = performance.now();
    if (Math.hypot(x - lx, y - ly) < 120 || now - lt < 160) return;
    lx = x; ly = y; lt = now;
    add({ k: 'star', x: x + rnd(-10, 10), y: y + rnd(-10, 10), vx: rnd(-6, 6), vy: rnd(-16, -6), r: rnd(2.2, 3.8), c: pick(GOLD), max: rnd(.6, .9), drag: 1.5, grav: 0 });
    kick();
  }
  // 가는 네 갈래 별
  function star(r) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .26 : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); g.fill(); }
  function petal(r) { g.beginPath(); g.moveTo(0, -r); g.bezierCurveTo(r * .95, -r * .5, r * .7, r * .8, 0, r); g.bezierCurveTo(-r * .7, r * .8, -r * .95, -r * .5, 0, -r); g.closePath(); g.fill(); }
  function draw(p) {
    const t = p.life / p.max, tw = Math.sin(Math.min(1, t * 2.4) * Math.PI / 2), fade = t > .55 ? 1 - (t - .55) / .45 : 1;
    g.globalAlpha = Math.max(0, fade) * (p.k === 'glow' ? .35 * (1 - t) : .95);
    g.fillStyle = p.c;
    if (p.k === 'glow') { const e = 1 - Math.pow(1 - t, 2); const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 + e * 26); gr.addColorStop(0, 'rgba(255,233,168,.9)'); gr.addColorStop(1, 'rgba(255,233,168,0)'); g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, 10 + e * 26, 0, 6.283); g.fill(); return; }
    g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
    if (p.k === 'star') { g.shadowColor = 'rgba(242,193,78,.7)'; g.shadowBlur = 6; star(p.r * tw * (1 + .18 * Math.sin(p.life * 14))); }
    else petal(p.r * tw);
    g.restore();
  }
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    g.clearRect(0, 0, W, H);
    ps = ps.filter(p => (p.life += dt) < p.max);
    for (const p of ps) { const d = Math.exp(-p.drag * dt); p.vx *= d; p.vy = p.vy * d + p.grav * dt; if (p.k === 'petal') p.vx += Math.sin(p.life * 5 + p.sway) * 40 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; draw(p); }
    g.globalAlpha = 1;
    raf = ps.length ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('pointerdown', e => burst(e.clientX, e.clientY), { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType !== 'touch') trail(e.clientX, e.clientY); }, { passive: true });
  window.__fx = { burst, trail };
})();
