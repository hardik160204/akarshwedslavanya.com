/* Browser-side direction of the storybook: tap through it like Instagram stories (tap right = next,
   tap left = back, hold = pause, swipe), Theatre.js playback, the palace doors, music, paper petals,
   countdown, share and calendar. Returns a cleanup function. */
import { SHEETS, SCENES, CUES, HOLD_BARS, buildState } from './timeline.js';
import { createScore, BAR } from './score.js';

const NS = SCENES.length;
const PETALS = [
  ['#f39bb5', '#f7a21b', '#ffc93c', '#e8578a'], ['#ffe39a'], ['#f7a21b', '#e8578a', '#ffc93c', '#14797b'], ['#9d7fd6', '#c8b3f0', '#ffc93c', '#f7a21b'],
  ['#ffe39a', '#f7bfd0', '#c8b3f0'], ['#c2185b', '#e8578a', '#f7a21b', '#ffc93c'], ['#f7bfd0', '#ffc93c'], ['#e8578a', '#f39bb5', '#f7a21b', '#ffc93c', '#c8b3f0']
];
const CONFETTI = ['#e8578a', '#f7a21b', '#ffc93c', '#14797b', '#9d7fd6', '#c2185b'];
const LAST_HOLD = 8;                                   // film mode: seconds on the last page before it ends

export function initInvitation(root, C) {
  const $ = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(window.location.search);
  const film = params.get('film') === '1';
  const stage = $('#stage'), gate = $('#gate'), canvas = $('#fx'), toast = $('#toast');
  const playBtn = $('#play'), sndBtn = $('#snd'), zprev = $('#zprev'), znext = $('#znext');
  const slides = [...root.querySelectorAll('.slide')], bars = [...root.querySelectorAll('#bars b')];
  const ctx = canvas.getContext('2d');

  const cleanups = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  let destroyed = false, ready = false, opened = false, wantOpen = false;
  let u = 4, W = 1, H = 1, dpr = 1, pos = 0, active = 0, elapsed = 0, held = false, paused = false, raf = 0, last = 0;
  const sheets = {}, binds = [], levels = { petals: 0 };
  const score = createScore({ src: C.music && C.music.src });
  const fx = paperFx();
  if (film) document.documentElement.classList.add('film');

  /* ---------- personal greeting: ?to=Name ---------- */
  const to = (params.get('to') || '').trim().slice(0, 60);
  if (to) { $('#dear').textContent = `Dear ${to}, `; $('#toguest').textContent = `We can't wait to celebrate with you, ${to}.`; }

  function measure() {
    if (destroyed) return;
    W = stage.clientWidth; H = stage.clientHeight;
    u = Math.min(W / 100, H / 200);                      // same as CSS --k
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    fx.resize(W, H);
    binds.forEach(b => b.v && b.apply(b.v));
  }

  /* ---------- Theatre.js → DOM ---------- */
  function applyEl(el, v) {
    const s = el.style;
    if (v.o !== undefined) s.opacity = v.o < .002 ? 0 : v.o;
    const moves = v.x !== undefined || v.y !== undefined || v.s !== undefined || v.r !== undefined || v.ry !== undefined;
    if (moves && el instanceof SVGElement && el.tagName !== 'svg') {
      // a piece inside an illustration: scene units, turning and scaling about its own pivot
      const [cx, cy] = (el.dataset.o || '0 0').split(' ').map(Number);
      el.setAttribute('transform', `translate(${(v.x || 0).toFixed(2)},${(v.y || 0).toFixed(2)}) translate(${cx},${cy}) rotate(${(v.r || 0).toFixed(2)}) scale(${(v.s ?? 1).toFixed(4)}) translate(${-cx},${-cy})`);
    } else if (moves) {
      let t = `translate3d(${((v.x || 0) * u).toFixed(2)}px,${((v.y || 0) * u).toFixed(2)}px,0)`;
      if (v.r) t += ` rotate(${v.r.toFixed(2)}deg)`;
      if (v.ry !== undefined) t += ` rotateY(${v.ry.toFixed(2)}deg)`;
      if (v.s !== undefined) t += ` scale(${Math.max(0, v.s).toFixed(4)})`;
      s.transform = t;
    }
    if (v.w !== undefined) s.webkitMaskPosition = s.maskPosition = `${(1 - v.w) * 100}% 0`;
    if (el.classList.contains('slide')) el.classList.toggle('live', v.o > .002);
  }
  const same = (a, b) => { for (const k in a) if (a[k] !== b[k]) return false; return true; };

  async function boot() {
    const { getProject } = await import('@theatre/core');
    if (destroyed) return;
    const project = getProject('Akarsh & Lavanya', { state: buildState() });
    await project.ready;
    if (destroyed) return;
    for (const id in SHEETS) sheets[id] = project.sheet(id);
    const groups = new Map([['world.fx', []]]);
    root.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; groups.has(k) ? groups.get(k).push(el) : groups.set(k, [el]); });
    groups.forEach((els, key) => {
      const [sid, ok] = key.split('.');
      if (!SHEETS[sid] || !SHEETS[sid][ok]) return;
      const props = {}; for (const p in SHEETS[sid][ok]) props[p] = 0;
      const b = { v: null, apply: v => { els.forEach(el => applyEl(el, v)); if (key === 'world.fx') Object.assign(levels, v); } };
      binds.push(b);
      cleanups.push(sheets[sid].object(ok, props).onValuesChange(v => { if (b.v && same(v, b.v)) return; b.v = { ...v }; b.apply(v); }));
    });
    sheets.world.sequence.position = 0;
    ready = true;
    root.classList.add('ready');
    if (wantOpen || film) setTimeout(open, film ? 1200 : 0);
  }

  /* ---------- pages ---------- */
  const lengths = SCENES.map(id => Math.max(...Object.values(SHEETS[id]).flatMap(o => Object.values(o).map(k => k[k.length - 1][0]))));
  let cueTimers = [];
  function playScene(i) {
    const seq = sheets[SCENES[i]].sequence;
    seq.pause();
    cueTimers.forEach(clearTimeout); cueTimers = [];
    if (reduce) { seq.position = lengths[i]; return; }
    seq.position = 0;
    seq.play();
    (CUES[SCENES[i]] || []).forEach(([t, name, burst]) => cueTimers.push(setTimeout(() => {
      score.sfx(name);
      if (burst && active === i) fx.confetti(W / 2, H * .42, 70);
    }, t * 1000)));
  }
  function show(i) {
    slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.inert = k !== i; });
    stage.dataset.tone = slides[i].classList.contains('night') ? 'night' : 'day';
  }
  function go(i) {
    if (!opened || i < 0 || i >= NS) return;
    elapsed = 0;
    if (i === active) { playScene(i); return; }
    active = i;
    show(i);
    playScene(i);
    score.setSection(SCENES[i]);
    score.sfx('whoosh');
  }
  const next = () => go(active + 1);
  const prev = () => go(Math.max(0, active - 1));
  const dur = i => (HOLD_BARS[i] ? HOLD_BARS[i] * BAR : film ? LAST_HOLD : Infinity);

  /* ---------- the palace doors ---------- */
  function onTap() {
    if (opened) return;
    score.unlock();                                    // inside the tap, or phones stay silent
    open();
  }
  async function open() {
    if (opened || destroyed) return;
    if (!ready) { wantOpen = true; return; }
    opened = true;
    root.classList.add('opened');
    score.start(.05);
    score.sfx('open');
    show(0);
    setTimeout(() => !destroyed && playScene(0), reduce ? 0 : 500);
    const intro = sheets.intro.sequence;
    if (reduce) intro.position = 3; else await intro.play();
    if (destroyed) return;
    gate.hidden = true;
    znext.focus({ preventScroll: true });
  }
  on(gate, 'click', onTap);

  /* ---------- tap, hold, swipe, keys ---------- */
  let downX = 0, downY = 0, holdT = 0, wasHeld = false;
  const down = e => { downX = e.clientX; downY = e.clientY; wasHeld = false; clearTimeout(holdT); holdT = setTimeout(() => { held = wasHeld = true; stage.classList.add('held'); }, 230); };
  const up = (e, dir) => {
    clearTimeout(holdT);
    if (held) { held = false; stage.classList.remove('held'); return; }
    if (wasHeld) return;
    const dx = e.clientX - downX, dy = e.clientY - downY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
    else dir();
  };
  [[zprev, prev], [znext, next]].forEach(([z, dir]) => {
    on(z, 'pointerdown', down);
    on(z, 'pointerup', e => up(e, dir));
    on(z, 'pointercancel', () => { clearTimeout(holdT); held = false; stage.classList.remove('held'); });
    on(z, 'click', e => { if (e.detail === 0) dir(); });   // keyboard (Enter / Space)
  });
  on(window, 'keydown', e => {
    if (!opened) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });
  function setPaused(p) {
    paused = p;
    playBtn.classList.toggle('on', !p);
    playBtn.setAttribute('aria-label', p ? 'Play the story' : 'Pause the story');
  }
  setPaused(false);
  on(playBtn, 'click', () => setPaused(!paused));
  const replay = $('#replay');
  if (replay) on(replay, 'click', () => { setPaused(false); go(0); });

  /* ---------- sound ---------- */
  on(sndBtn, 'click', () => {
    const m = !score.muted; score.mute(m);
    root.classList.toggle('muted', m);
    sndBtn.setAttribute('aria-pressed', String(m));
    sndBtn.setAttribute('aria-label', m ? 'Play music' : 'Mute music');
  });
  on(document, 'visibilitychange', () => { document.hidden ? score.suspend() : score.resume(); });

  /* ---------- every frame: page clock, progress bars, page turn, petals ---------- */
  function frame(now) {
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (opened && !held && !paused && !document.hidden) {
      elapsed += dt;
      if (elapsed >= dur(active)) {
        if (active < NS - 1) next();
        else if (film && !document.body.dataset.filmDone) document.body.dataset.filmDone = '1';
      }
    }
    pos = reduce ? active : pos + (active - pos) * (1 - Math.exp(-dt * 7));
    if (Math.abs(active - pos) < .0005) pos = active;
    if (ready && sheets.world.sequence.position !== pos) sheets.world.sequence.position = pos;
    bars.forEach((b, i) => { b.style.transform = `scaleX(${i < active ? 1 : i > active ? 0 : Math.min(1, isFinite(dur(i)) ? elapsed / dur(i) : 1).toFixed(3)})`; });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!reduce) fx.step(ctx, dt, levels.petals, PETALS[active]);
    raf = requestAnimationFrame(frame);
  }

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

  /* ---------- share, and calendar (iPhone gets a real .ics; others open Google Calendar) ---------- */
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2400); };
  const shareBtn = $('#share');
  if (shareBtn) on(shareBtn, 'click', async () => {
    const data = { title: C.title, text: C.shareText || C.title, url: window.location.href.split('?')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); say('Link copied'); score.sfx('chime'); }
    } catch (err) { if (err && err.name !== 'AbortError') say('Copy the link from your browser'); }
  });
  const iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  on(root, 'click', e => {
    const a = e.target.closest && e.target.closest('.cal');
    if (!a || !iOS) return;
    e.preventDefault();
    window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics(C, C.events[+a.dataset.ev]));
  });

  /* ---------- boot ---------- */
  measure();
  slides.forEach((s, k) => { s.inert = k !== 0; });
  raf = requestAnimationFrame(frame);
  const ro = new ResizeObserver(measure);
  ro.observe(stage);
  boot().catch(err => { console.error(err); root.classList.add('ready'); });

  return () => {
    destroyed = true;
    cleanups.forEach(f => f());
    ro.disconnect(); cancelAnimationFrame(raf);
    clearInterval(cdTimer); clearTimeout(tt); clearTimeout(holdT); cueTimers.forEach(clearTimeout);
    Object.values(sheets).forEach(s => s.sequence.pause());
    score.stop();
    document.documentElement.classList.remove('film');
  };
}

/* paper petals drifting down, and confetti bursts for the happy moments */
function paperFx() {
  const P = [];
  let W = 1, H = 1, z = 1, acc = 0, t = 0;
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[(Math.random() * a.length) | 0];
  return {
    resize(w, h) { W = w; H = h; z = w / 400; },
    confetti(x, y, n) {
      for (let i = 0; i < n; i++) { const a = rnd(-Math.PI, 0), v = rnd(120, 340) * z; P.push({ k: 1, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(0, 6.3), vr: rnd(-8, 8), w: rnd(4, 8) * z, h: rnd(2.5, 4.5) * z, ph: rnd(0, 6.3), c: pick(CONFETTI), life: 0 }); }
    },
    step(ctx, dt, level, pal) {
      t += dt;
      acc += level * 6 * dt;
      while (acc >= 1 && P.length < 160) { acc--; P.push({ k: 0, x: rnd(-.05, 1.05) * W, y: -14, vx: rnd(-10, 10), vy: rnd(28, 56) * z, r: rnd(0, 6.3), vr: rnd(-2, 2), w: rnd(4, 7.5) * z, h: 0, ph: rnd(0, 6.3), c: pick(pal), life: 0 }); }
      ctx.clearRect(0, 0, W, H);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life += dt;
        if (p.k === 1) { p.vx *= 1 - 1.6 * dt; p.vy = p.vy * (1 - 1.6 * dt) + 260 * z * dt; }
        p.x += (p.vx + (p.k ? 0 : Math.sin(t * 1.6 + p.ph) * 16)) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        if (p.y > H + 20 || p.life > 9) { P.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, .3 + .7 * Math.abs(Math.sin(t * 2.4 + p.ph)));
        ctx.fillStyle = p.c; ctx.globalAlpha = p.k ? 1 : .9;
        if (p.k) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        else { ctx.beginPath(); ctx.ellipse(0, 0, p.w, p.w * .58, 0, 0, 6.283); ctx.fill(); }
        ctx.restore();
      }
    }
  };
}

/* one calendar event, times converted from India time to UTC */
export function ics(C, e) {
  const utc = s => new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(9, 11), +s.slice(11, 13)) - 330 * 60000).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const esc = s => String(s).replace(/([,;\\])/g, '\\$1');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding-invite//EN', 'BEGIN:VEVENT',
    `UID:${e.cal[0]}-${C.names[0].en}-${C.names[1].en}@invite`.replace(/\s/g, ''),
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${utc(e.cal[0])}`, `DTEND:${utc(e.cal[1])}`,
    `SUMMARY:${esc(`${C.names[0].en} & ${C.names[1].en} · ${e.calTitle}`)}`,
    `LOCATION:${esc(`${C.venue.name}, ${C.venue.address}`)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
