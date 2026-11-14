/* The thread of light. One line does every job: the heart knot between the names, a constellation,
   the Haldi marigold, two locked rings, the sangeet's sound wave, seven rounds around the sacred fire,
   the road to the venue, and the knot again. Every scene hands the same line to the next (a morph),
   and it is always drawn by ONE function, drawThread(), so it looks identical everywhere. */
export const N = 360;

/* ---------- geometry ---------- */
function catmull(pts, seg = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
/* evenly spaced along the length, so morphs and pulses move at a steady speed */
export function resample(pts, n = N) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1], out = new Float32Array(n * 2);
  for (let i = 0, j = 0; i < n; i++) {
    const d = L * i / (n - 1);
    while (j < cum.length - 2 && cum[j + 1] < d) j++;
    const u = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1);
    out[i * 2] = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u;
    out[i * 2 + 1] = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u;
  }
  return out;
}
const curve = (fn, steps) => Array.from({ length: steps + 1 }, (_, i) => fn(i / steps));

/* each shape lives in its own viewBox (w × h) and is fitted into its anchor box on screen */
/* a heart drawn in the stars: two lobes that meet, the way two people do */
const STAR_PTS = [[100, 100], [64, 74], [38, 46], [44, 16], [72, 4], [100, 28], [128, 5], [158, 18], [163, 47], [135, 73], [100, 100]];
export const SHAPES = {
  knot: { w: 200, h: 100, pts: resample(catmull([[0, 66], [40, 67], [78, 72], [100, 88], [128, 62], [134, 34], [120, 15], [100, 26], [80, 15], [66, 34], [72, 62], [100, 88], [122, 72], [160, 67], [200, 66]])) },
  stars: { w: 200, h: 104, pts: resample(STAR_PTS), stars: STAR_PTS },
  flower: {
    w: 100, h: 100, pts: resample([
      ...curve(t => { const a = -Math.PI / 2 + t * Math.PI * 2, r = 36 + 9 * Math.cos(10 * a); return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]; }, 400),
      ...curve(t => { const a = -Math.PI / 2 + t * Math.PI * 6, r = 32 * (1 - t) + 2; return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]; }, 300)
    ])
  },
  rings: {
    w: 200, h: 100, pts: resample([
      ...curve(t => [78 + 36 * Math.cos(t * Math.PI * 2), 50 + 36 * Math.sin(t * Math.PI * 2)], 200),
      ...curve(t => [122 + 36 * Math.cos(Math.PI + t * Math.PI * 2), 50 + 36 * Math.sin(Math.PI + t * Math.PI * 2)], 200)
    ]),
    gem: [78, 14]
  },
  /* seven rounds of one orbit around the sacred fire, starting at the front; each round is 1/7 of the line */
  coil: {
    w: 160, h: 120, pts: resample(curve(t => { const a = Math.PI / 2 + t * Math.PI * 14; return [80 + (68 + 2.4 * Math.sin(t * 9)) * Math.cos(a), 94 + (17 + 1.3 * Math.cos(t * 7)) * Math.sin(a)]; }, 1400)),
    diyas: Array.from({ length: 7 }, (_, k) => { const a = Math.PI * (.14 + k / 6 * .72); return [80 + 68 * Math.cos(a), 94 + 17 * Math.sin(a)]; })
  },
  route: { w: 100, h: 64, pts: resample(catmull([[1, 53], [12, 50.5], [24, 47.5], [36, 40.5], [52, 35], [66, 31.5], [73, 30], [75.5, 26.5], [74, 21]], 10)) }
};
export const SCENE_SHAPES = ['knot', 'stars', 'flower', 'rings', 'coil', 'route', 'knot'];

/* fit a shape into a screen box (like SVG "meet"); returns screen points and the transform */
export function place(shape, box) {
  const s = Math.min(box.w / shape.w, box.h / shape.h), ox = box.x + (box.w - shape.w * s) / 2, oy = box.y + (box.h - shape.h * s) / 2;
  const P = new Float32Array(shape.pts.length);
  for (let i = 0; i < P.length; i += 2) { P[i] = ox + shape.pts[i] * s; P[i + 1] = oy + shape.pts[i + 1] * s; }
  return { P, map: ([x, y]) => [ox + x * s, oy + y * s], s };
}

/* the hand-over between two scenes: a morph with a soft swirl in the middle so it flows like silk */
export function morph(A, B, e, out, time, amp) {
  const lift = Math.sin(Math.PI * e) * amp;
  for (let i = 0; i < out.length; i += 2) {
    const k = i / 2;
    out[i] = A[i] + (B[i] - A[i]) * e + lift * Math.sin(k * .045 + time * 2.1);
    out[i + 1] = A[i + 1] + (B[i + 1] - A[i + 1]) * e + lift * Math.cos(k * .038 + time * 1.7);
  }
  return out;
}

/* ---------- the one drawing function ---------- */
const sprites = {};
function sprite(color, size = 64) {
  if (sprites[color]) return sprites[color];
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), gr = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, color); gr.addColorStop(.25, color.replace(/[\d.]+\)$/, '.45)')); gr.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
  x.fillStyle = gr; x.fillRect(0, 0, size, size);
  return (sprites[color] = c);
}
const PASSES = [[16, '255,84,40', .09], [7, '255,160,64', .26], [2.4, '255,238,205', .95]];

function sub(P, from, to) {
  const n = P.length / 2, a = from * (n - 1), b = to * (n - 1), i0 = Math.floor(a), i1 = Math.ceil(b);
  const path = new Path2D(), lerp = (i, u) => [P[i * 2] + (P[i * 2 + 2] - P[i * 2]) * u, P[i * 2 + 1] + (P[i * 2 + 3] - P[i * 2 + 1]) * u];
  const s = i0 < n - 1 ? lerp(i0, a - i0) : [P[i0 * 2], P[i0 * 2 + 1]];
  path.moveTo(s[0], s[1]);
  for (let i = i0 + 1; i < i1; i++) path.lineTo(P[i * 2], P[i * 2 + 1]);
  const e = i1 > 0 ? lerp(i1 - 1, b - (i1 - 1)) : s;
  path.lineTo(e[0], e[1]);
  return { path, head: e };
}
export function pointAt(P, t) {
  const n = P.length / 2, a = Math.max(0, Math.min(1, t)) * (n - 1), i = Math.min(n - 2, Math.floor(a)), u = a - i;
  return [P[i * 2] + (P[i * 2 + 2] - P[i * 2]) * u, P[i * 2 + 1] + (P[i * 2 + 3] - P[i * 2 + 1]) * u];
}
export function drawThread(ctx, P, { z = 1, alpha = 1, from = 0, to = 1, pulse = -1, ghost = null, width = 1 } = {}) {
  if (alpha <= .01 || to - from <= .001) return;
  const { path, head } = sub(P, from, to);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = ctx.lineJoin = 'round';
  if (ghost) { ctx.lineWidth = 6 * z * width; ctx.strokeStyle = `rgba(255,150,70,${.16 * alpha})`; ctx.stroke(sub(ghost, from, to).path); }
  for (const [w, c, a] of PASSES) { ctx.lineWidth = w * z * width; ctx.strokeStyle = `rgba(${c},${a * alpha})`; ctx.stroke(path); }
  if (to < 1) { const s = 30 * z; ctx.drawImage(sprite('rgba(255,236,200,1)'), head[0] - s / 2, head[1] - s / 2, s, s); }
  if (pulse > 0 && pulse < 1) {
    const seg = sub(P, Math.max(from, pulse - .07), Math.min(to, pulse));
    ctx.lineWidth = 4.5 * z * width; ctx.strokeStyle = `rgba(255,248,232,${.9 * alpha})`; ctx.stroke(seg.path);
    const s = 44 * z; ctx.drawImage(sprite('rgba(255,244,220,1)'), seg.head[0] - s / 2, seg.head[1] - s / 2, s, s);
  }
  ctx.restore();
}
export function glint(ctx, x, y, size, alpha, rot = 0) {
  if (alpha <= .01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha;
  ctx.drawImage(sprite('rgba(255,250,235,1)'), x - size, y - size, size * 2, size * 2);
  ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#fffaf0';
  ctx.beginPath(); ctx.ellipse(0, 0, size * 1.6, size * .09, 0, 0, 6.283); ctx.ellipse(0, 0, size * .09, size * 1.6, 0, 0, 6.283); ctx.fill();
  ctx.restore();
}

/* ---------- particles on the same canvas: bokeh, petals, sparks, embers, fireworks ---------- */
export function particles() {
  const P = [], B = [], acc = { petals: 0, sparkles: 0, embers: 0 }, RATE = { petals: 6, sparkles: 10, embers: 24 };
  let W = 1, H = 1, z = 1, fw = 0;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[(Math.random() * a.length) | 0];
  function resize(w, h) {
    W = w; H = h; z = w / 400;
    B.length = 0;
    for (let i = 0; i < 16; i++) B.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(18, 70) * z, vy: -rnd(3, 10) * z, ph: rnd(0, 6.3), c: i % 3, a: rnd(.05, .14), near: i > 12 });
  }
  function spark(x, y, n = 1, power = 1) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, 6.283), v = rnd(20, 140) * z * power;
      P.push({ k: 4, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20 * z, life: 0, max: rnd(.4, 1.1), sz: rnd(.8, 1.8) * z, c: pick(['#fff3d6', '#ffd27a', '#ffb347']) });
    }
  }
  function burst(cols) {
    const top = Math.random() < .7, cx = (top ? rnd(.15, .85) : pick([rnd(.06, .2), rnd(.8, .94)])) * W, cy = (top ? rnd(.07, .2) : rnd(.72, .88)) * H;
    const c = pick(cols), sp = rnd(80, 130) * z;
    for (let i = 0; i < 40; i++) {
      const a = i / 40 * 6.283 + rnd(-.05, .05), v = sp * rnd(.7, 1);
      P.push({ k: 3, x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rnd(1.1, 1.7), sz: rnd(1.1, 2) * z, c });
    }
  }
  function spawn(kind, pal) {
    if (P.length > 300) return;
    if (kind === 'petals') P.push({ k: 0, x: rnd(-.05, 1.05) * W, y: -16, vx: rnd(-12, 12), vy: rnd(30, 62) * z, r: rnd(0, 6.3), vr: rnd(-2, 2), sz: rnd(4, 8) * z, ph: rnd(0, 6.3), c: pick(pal) });
    else if (kind === 'sparkles') P.push({ k: 1, x: rnd(0, 1) * W, y: rnd(0, .9) * H, life: 0, max: rnd(1, 2.2), sz: rnd(1.4, 3) * z, c: '#fff8e6' });
    else P.push({ k: 2, x: W / 2 + rnd(-.07, .07) * W, y: H * .8, vx: rnd(-10, 10), vy: -rnd(45, 95) * z, life: 0, max: rnd(1.4, 2.6), sz: rnd(1, 2.4) * z, ph: rnd(0, 6.3), c: pick(['#ffd166', '#ff9f1c', '#ff6b35']) });
  }
  function step(ctx, dt, t, L, pal, glows) {
    // far bokeh: soft out-of-focus lights in the chapter's colours (depth of field)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const b of B) {
      b.y += b.vy * dt; if (b.y < -b.r) { b.y = H + b.r; b.x = rnd(0, W); }
      const a = b.a * (L.bokeh || 0) * (.7 + .3 * Math.sin(t * .8 + b.ph)), s = b.r * (b.near ? 2.2 : 1);
      if (a > .005) { ctx.globalAlpha = Math.min(1, a * (b.near ? .6 : 1)); ctx.drawImage(sprite(glows[b.c] || glows[0]), b.x - s, b.y - s, s * 2, s * 2); }
    }
    ctx.restore();
    for (const k in acc) { acc[k] += (L[k] || 0) * RATE[k] * dt; while (acc[k] >= 1) { acc[k]--; spawn(k, pal); } }
    if (L.fireworks > .4) { fw -= dt; if (fw <= 0) { burst(['#ffd166', '#d6c2ff', '#ff8fab', '#fff1c1', '#f6dc94']); fw = rnd(.8, 1.7); } } else fw = .3;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      if (p.k === 0) {
        p.x += (p.vx + Math.sin(t * 1.6 + p.ph) * 18) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y > H + 16) { P.splice(i, 1); continue; }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .8; ctx.fillStyle = p.c;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, .35 + .65 * Math.abs(Math.sin(t * 2 + p.ph)));
        ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .58, 0, 0, 6.283); ctx.fill(); ctx.restore();
        continue;
      }
      p.life += dt;
      if (p.life > p.max) { P.splice(i, 1); continue; }
      const f = p.life / p.max;
      let a;
      if (p.k === 1) a = Math.sin(f * Math.PI);
      else if (p.k === 2) { p.x += (p.vx + Math.sin(t * 3 + p.ph) * 14) * dt; p.y += p.vy * dt; a = 1 - f; }
      else { const drag = p.k === 4 ? 2.4 : 1.3; p.vx *= 1 - drag * dt; p.vy = p.vy * (1 - drag * dt) + 46 * z * dt; p.x += p.vx * dt; p.y += p.vy * dt; a = 1 - f * f; }
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = p.c;
      if (p.k === 1) {
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.sz * 2.6, p.sz * .35, 0, 0, 6.283); ctx.ellipse(p.x, p.y, p.sz * .35, p.sz * 2.6, 0, 0, 6.283); ctx.fill();
      } else {
        ctx.globalAlpha = a * .22; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 3, 0, 6.283); ctx.fill();
        ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 6.283); ctx.fill();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  return { resize, step, spark };
}
