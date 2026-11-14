/* Browser-side behaviour: Theatre.js playback, the envelope, swipe-scrubbed sky,
   particles, autoplay/film mode, countdown and share. Returns a cleanup function. */
import { SHEETS, SCENES, buildState } from './timeline.js';

const N = SCENES.length;
const HOLD = [7, 10, 8.5, 9.5, 9.5, 7.5, 10];          // seconds each scene stays on screen in autoplay
const PAL = [                                          // falling petals, per scene
  ['#c9b3f0', '#b59be6', '#ecdfff', '#f2c4da'], ['#c9b3f0'],
  ['#a688dd', '#c4aef0', '#f4b400', '#ffa62b', '#efe4ff'], ['#c9b3f0'],
  ['#c1121f', '#e5383b', '#ff9f1c', '#ffb703'], ['#c9b3f0', '#f2c4da', '#b59be6'],
  ['#e9c46a', '#c9b3f0', '#f2c4da']
];
const FIREWORK = ['#ffd166', '#d6c2ff', '#ff8fab', '#fff1c1', '#f6dc94'];

export function initInvitation(root, C) {
  const $ = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const film = new URLSearchParams(window.location.search).get('film') === '1';
  const scroller = $('#scroller'), stage = $('#stage'), env = $('#env'), playBtn = $('#play'), toast = $('#toast');
  const scenes = [...root.querySelectorAll('.scene')];
  const bars = [...root.querySelectorAll('#bars b')];

  const cleanups = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  let destroyed = false, ready = false, opened = false, wantOpen = false;
  let u = 4, H = 1, pos = 0, active = 0, raf = 0, last = 0;
  let sheets = {};
  const binds = [];
  const levels = { petals: 0, sparkles: 0, embers: 0, fireworks: 0 };
  const fx = particles($('#fx'));
  if (film) document.documentElement.classList.add('film');
  scroller.scrollTop = 0;

  /* ---------- layout ---------- */
  function measure() {
    if (destroyed) return;
    H = scroller.clientHeight;
    u = Math.min(stage.clientWidth / 100, H / 200);   // same as CSS --k
    root.style.setProperty('--H', H + 'px');
    binds.forEach(b => b.v && b.apply(b.v));
    fx.resize();
    if (opened) scroller.scrollTop = active * H;
  }

  /* ---------- Theatre.js ---------- */
  function applyEl(el, v) {
    const s = el.style;
    if (v.o !== undefined) s.opacity = v.o < .002 ? 0 : v.o;
    if (v.x !== undefined || v.y !== undefined || v.s !== undefined || v.r !== undefined || v.rx !== undefined) {
      let t = `translate3d(${((v.x || 0) * u).toFixed(2)}px,${((v.y || 0) * u).toFixed(2)}px,0)`;
      if (v.r) t += ` rotate(${v.r.toFixed(2)}deg)`;
      if (v.rx !== undefined) { t += ` rotateX(${v.rx.toFixed(2)}deg)`; s.zIndex = v.rx > 90 ? 1 : 4; }
      if (v.s !== undefined) t += ` scale(${Math.max(0, v.s).toFixed(4)})`;
      s.transform = t;
    }
    if (v.w !== undefined) {
      const fxType = el.dataset.fx;
      if (fxType === 'wipe' || fxType === 'wiper') s.webkitMaskPosition = s.maskPosition = `${(fxType === 'wipe' ? 1 - v.w : v.w) * 100}% 0`;
      else s.setProperty('--w', v.w.toFixed(4));
    }
    if (el.classList.contains('scene')) el.classList.toggle('live', v.o > .002);
  }
  const css = c => `rgb(${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0})`;
  const same = (a, b) => { for (const k in a) if (a[k] !== b[k]) return false; return true; };

  async function boot() {
    const { getProject, types } = await import('@theatre/core');
    if (destroyed) return;
    const project = getProject('Akarsh & Lavanya', { state: buildState() });
    await project.ready;
    if (destroyed) return;
    for (const id in SHEETS) sheets[id] = project.sheet(id);

    const groups = new Map();
    root.querySelectorAll('[data-t]').forEach(el => {
      const k = el.dataset.t;
      groups.has(k) ? groups.get(k).push(el) : groups.set(k, [el]);
    });
    const objectFor = (sid, ok) => {
      const props = {};
      for (const [p, kfs] of Object.entries(SHEETS[sid][ok])) props[p] = typeof kfs[0][1] === 'string' ? types.rgba() : 0;
      return sheets[sid].object(ok, props);
    };
    groups.forEach((els, key) => {
      const [sid, ok] = key.split('.');
      if (!SHEETS[sid] || !SHEETS[sid][ok]) return;
      const b = {
        v: null,
        apply: key === 'world.sky'
          ? v => { els[0].style.background = `linear-gradient(180deg,${css(v.top)} 0%,${css(v.bot)} 100%)`; }
          : v => els.forEach(el => applyEl(el, v))
      };
      binds.push(b);
      cleanups.push(objectFor(sid, ok).onValuesChange(v => {
        if (b.v && same(v, b.v)) return;
        b.v = { ...v }; b.apply(v);
      }));
    });
    cleanups.push(objectFor('world', 'fx').onValuesChange(v => Object.assign(levels, v)));

    sheets.world.sequence.position = 0;
    ready = true;
    root.classList.add('ready');
    if (wantOpen || film) setTimeout(open, film ? 1200 : 0);
  }

  const lengths = SCENES.map(id => Math.max(...Object.values(SHEETS[id]).flatMap(o => Object.values(o).map(k => k[k.length - 1][0]))));
  function playScene(i) {
    const seq = sheets[SCENES[i]].sequence;
    seq.pause();
    if (reduce) { seq.position = lengths[i]; return; }
    seq.position = 0;
    seq.play();
  }

  function setActive(i) {
    active = i;
    scenes.forEach((s, k) => s.classList.toggle('active', k === i));
    if (opened) playScene(i);
  }

  /* ---------- the envelope ---------- */
  async function open() {
    if (opened || destroyed) return;
    if (!ready) { wantOpen = true; return; }
    opened = true;
    root.classList.add('opened');
    const intro = sheets.intro.sequence;
    if (reduce) intro.position = 3;
    else {
      setTimeout(() => !destroyed && playScene(0), 1900);
      await intro.play();
    }
    if (destroyed) return;
    if (reduce) playScene(0);
    env.hidden = true;
    scroller.classList.remove('locked');
    scroller.focus({ preventScroll: true });
    setActive(0);
    if (film) { setPlaying(true); timer = setTimeout(step, HOLD[0] * 1000); }
  }
  on(env, 'click', open);

  /* ---------- frame loop: swipe position → world sheet, HUD, particles ---------- */
  function frame(now) {
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    const target = opened ? scroller.scrollTop / H : 0;
    pos = reduce ? target : pos + (target - pos) * (1 - Math.exp(-dt * 9));
    if (Math.abs(target - pos) < .0005) pos = target;
    if (ready) {
      if (sheets.world.sequence.position !== pos) sheets.world.sequence.position = pos;
      if (opened && Math.abs(target - active) > .6) setActive(Math.max(0, Math.min(N - 1, Math.round(target))));
    }
    bars.forEach((b, i) => { b.style.transform = `scaleX(${Math.max(0, Math.min(1, pos - i + 1)).toFixed(3)})`; });
    if (!reduce) fx.step(dt, levels, PAL[Math.round(pos)] || PAL[0], H);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ---------- autoplay (Play button, and ?film=1 for screen-recording) ---------- */
  let playing = false, timer = null;
  function setPlaying(p) {
    playing = p;
    playBtn.classList.toggle('on', p);
    playBtn.setAttribute('aria-label', p ? 'Pause the story' : 'Play the story');
    if (!p) clearTimeout(timer);
  }
  const go = i => scroller.scrollTo({ top: i * H, behavior: reduce ? 'auto' : 'smooth' });
  function step() {
    if (!playing) return;
    const next = active + 1;
    if (next >= N) { setPlaying(false); document.body.dataset.filmDone = '1'; return; }
    go(next);
    timer = setTimeout(step, HOLD[next] * 1000);
  }
  on(playBtn, 'click', () => {
    if (playing) return setPlaying(false);
    setPlaying(true);
    if (active >= N - 1) { go(0); timer = setTimeout(step, HOLD[0] * 1000); }
    else timer = setTimeout(step, 900);
  });
  const userTook = e => { if (playing && !(e.target.closest && e.target.closest('.hud'))) setPlaying(false); };
  on(scroller, 'touchstart', userTook, { passive: true });
  on(scroller, 'wheel', userTook, { passive: true });
  on(window, 'keydown', e => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) userTook(e); });
  const replay = $('#replay');
  if (replay) on(replay, 'click', () => { setPlaying(false); go(0); });

  /* ---------- countdown ---------- */
  const target = new Date(C.weddingIso).getTime();
  const cd = $('#cd'), ch = $('#ch'), cm = $('#cm'), cs = $('#cs'), count = $('#count');
  function tick() {
    const d = target - Date.now();
    if (isNaN(d) || d <= 0) { count.classList.add('done'); return; }
    const s = Math.floor(d / 1000);
    cd.textContent = Math.floor(s / 86400); ch.textContent = Math.floor(s % 86400 / 3600);
    cm.textContent = Math.floor(s % 3600 / 60); cs.textContent = s % 60;
  }
  tick(); const cdTimer = setInterval(tick, 1000);

  /* ---------- share ---------- */
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); };
  const shareBtn = $('#share');
  if (shareBtn) on(shareBtn, 'click', async () => {
    const data = { title: C.title, text: C.shareText || C.title, url: window.location.href.split('?')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); say('Link copied'); }
    } catch (err) { if (err && err.name !== 'AbortError') say('Copy the link from your browser'); }
  });

  /* ---------- boot ---------- */
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(scroller);
  boot().catch(err => { console.error(err); root.classList.add('ready'); });

  return () => {
    destroyed = true;
    cleanups.forEach(f => f());
    ro.disconnect(); cancelAnimationFrame(raf);
    clearInterval(cdTimer); clearTimeout(timer); clearTimeout(tt);
    Object.values(sheets).forEach(s => s.sequence.pause());
    document.documentElement.classList.remove('film');
  };
}

/* Petals, sparkles, embers and fireworks on one canvas; amounts come from the world sheet. */
function particles(cv) {
  const ctx = cv.getContext('2d');
  const P = [], acc = { petals: 0, sparkles: 0, embers: 0 }, RATE = { petals: 7, sparkles: 12, embers: 26 };
  let W = 1, H = 1, dpr = 1, z = 1, t = 0, fw = 0, dirty = false;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.random() * a.length | 0];
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth || 1; H = cv.clientHeight || 1; z = W / 400;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function spawn(kind, pal) {
    if (P.length > 240) return;
    if (kind === 'petals') P.push({ k: 0, x: rnd(-.05, 1.05) * W, y: -16, vx: rnd(-12, 12), vy: rnd(30, 62), r: rnd(0, 6.3), vr: rnd(-2, 2), sz: rnd(4, 8) * z, ph: rnd(0, 6.3), c: pick(pal) });
    else if (kind === 'sparkles') P.push({ k: 1, x: rnd(0, 1) * W, y: rnd(0, .8) * H, life: 0, max: rnd(1, 2.2), sz: rnd(1.4, 3.2) * z, c: pick(['#ffffff', '#ffe8a8', '#e9dcff']) });
    else P.push({ k: 2, x: W / 2 + rnd(-.08, .08) * W, y: H * .84, vx: rnd(-10, 10), vy: -rnd(45, 95) * z, life: 0, max: rnd(1.4, 2.6), sz: rnd(1, 2.4) * z, ph: rnd(0, 6.3), c: pick(['#ffd166', '#ff9f1c', '#ff6b35']) });
  }
  function burst() {
    // keep bursts in the sky above the text, or low at the sides
    const top = Math.random() < .7, cx = (top ? rnd(.15, .85) : pick([rnd(.06, .2), rnd(.8, .94)])) * W, cy = (top ? rnd(.07, .17) : rnd(.72, .88)) * H;
    const c = pick(FIREWORK), sp = rnd(80, 130) * z;
    for (let i = 0; i < 40; i++) {
      const a = i / 36 * 6.283 + rnd(-.05, .05), v = sp * rnd(.7, 1);
      P.push({ k: 3, x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rnd(1.1, 1.7), sz: rnd(1.1, 2) * z, c });
    }
  }
  function step(dt, L, pal) {
    t += dt;
    for (const k in acc) { acc[k] += (L[k] || 0) * RATE[k] * dt; while (acc[k] >= 1) { acc[k]--; spawn(k, pal); } }
    if (L.fireworks > .4) { fw -= dt; if (fw <= 0) { burst(); fw = rnd(.8, 1.7); } } else fw = .3;
    if (!P.length && !dirty) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    dirty = P.length > 0;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      if (p.k === 0) {
        p.x += (p.vx + Math.sin(t * 1.6 + p.ph) * 18) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y > H + 16) { P.splice(i, 1); continue; }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .85; ctx.fillStyle = p.c;
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
      else { p.vx *= 1 - 1.3 * dt; p.vy = p.vy * (1 - 1.3 * dt) + 46 * z * dt; p.x += p.vx * dt; p.y += p.vy * dt; a = 1 - f * f; }
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = p.c;
      if (p.k === 1) {
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.sz * 2.6, p.sz * .35, 0, 0, 6.283); ctx.ellipse(p.x, p.y, p.sz * .35, p.sz * 2.6, 0, 0, 6.283); ctx.fill();
      } else {
        ctx.globalAlpha = a * .22; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 3, 0, 6.283); ctx.fill();
        ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 6.283); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  return { resize, step };
}
