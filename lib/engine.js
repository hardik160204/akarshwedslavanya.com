/* Browser-side direction of the film: Theatre.js playback, the thread of light, the drifting camera,
   the score (autoplay lands on downbeats), swipe navigation, countdown, share and calendar.
   Returns a cleanup function. */
import { SHEETS, SCENES, CUES, HOLD_BARS, GLOWS, buildState } from './timeline.js';
import { SHAPES, SCENE_SHAPES, place, morph, drawThread, pointAt, glint, particles, N } from './thread.js';
import { createScore, BAR } from './score.js';

const NS = SCENES.length;
const ANCHORS = ['knot', 'stars', 'flower', 'rings', 'coil', 'route', 'knot2'];
const PETALS = [
  ['#c9b3f0', '#f2c4da', '#ffd27a'], ['#c9b3f0'], ['#a688dd', '#c4aef0', '#f4b400', '#ffa62b', '#efe4ff'], ['#c9b3f0'],
  ['#c1121f', '#e5383b', '#ff9f1c', '#ffb703'], ['#c9b3f0'], ['#e9c46a', '#c9b3f0', '#f2c4da', '#ff8fab']
];
const LEAD = .35;                                    // the slam lands this long after the tap, on the first downbeat

export function initInvitation(root, C) {
  const $ = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(window.location.search);
  const film = params.get('film') === '1';
  const scroller = $('#scroller'), stage = $('#stage'), cam = $('#cam'), gate = $('#gate'), canvas = $('#fx');
  const playBtn = $('#play'), sndBtn = $('#snd'), toast = $('#toast'), eq = [...root.querySelectorAll('#eq i')];
  const texts = [...root.querySelectorAll('.scene')], bars = [...root.querySelectorAll('#bars b')];
  const ctx = canvas.getContext('2d');

  const cleanups = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanups.push(() => t.removeEventListener(ev, fn, o)); };
  let destroyed = false, ready = false, opened = false, wantOpen = false;
  let u = 4, W = 1, H = 1, dpr = 1, pos = 0, active = 0, raf = 0, last = 0, clock = 0;
  const sheets = {}, binds = [], placed = [], boxes = {};
  const sceneO = SCENES.map((_, i) => (i ? 0 : 1)), pulses = SCENES.map(() => -1);
  const levels = { petals: 0, sparkles: 0, embers: 0, fireworks: 0, bokeh: 0 };
  const th = { s: .02, o: 0 }, shake = { x: 0, y: 0 }, camZ = { z: 1 };
  const cur = new Float32Array(N * 2), prev = new Float32Array(N * 2);
  const fx = particles();
  const score = createScore({ src: C.music && C.music.src });
  if (film) document.documentElement.classList.add('film');
  scroller.scrollTop = 0;

  /* ---------- personal greeting: ?to=Name ---------- */
  const to = (params.get('to') || '').trim().slice(0, 60);
  if (to) { $('#dear').textContent = `Dear ${to}, `; $('#toguest').textContent = `We can't wait to celebrate with you, ${to}.`; }

  /* ---------- layout: stage size, canvas, and where each thread shape sits ---------- */
  const rel = el => {
    let x = 0, y = 0, n = el;
    while (n && !n.classList.contains('scene')) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  function measure() {
    if (destroyed) return;
    H = scroller.clientHeight; W = stage.clientWidth;
    u = Math.min(W / 100, H / 200);
    root.style.setProperty('--H', H + 'px');
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    fx.resize(W, H);
    root.querySelectorAll('[data-anchor]').forEach(el => { boxes[el.dataset.anchor] = rel(el); });
    root.querySelectorAll('[data-at]').forEach(el => {
      const b = boxes[el.dataset.at]; if (!b) return;
      Object.assign(el.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
    });
    SCENES.forEach((_, i) => { placed[i] = place(SHAPES[SCENE_SHAPES[i]], boxes[ANCHORS[i]]); });
    binds.forEach(b => b.v && b.apply(b.v));
    if (opened) scroller.scrollTop = active * H;
  }

  /* ---------- Theatre.js → DOM ---------- */
  function applyEl(el, v) {
    const s = el.style;
    if (v.o !== undefined) s.opacity = v.o < .002 ? 0 : v.o;
    if (v.x !== undefined || v.y !== undefined || v.s !== undefined || v.r !== undefined) {
      let t = `translate3d(${((v.x || 0) * u).toFixed(2)}px,${((v.y || 0) * u).toFixed(2)}px,0)`;
      if (v.r) t += ` rotate(${v.r.toFixed(2)}deg)`;
      if (v.s !== undefined) t += ` scale(${Math.max(0, v.s).toFixed(4)})`;
      s.transform = t;
    }
    if (v.w !== undefined) {
      if (el.dataset.fx === 'wipe') s.webkitMaskPosition = s.maskPosition = `${(1 - v.w) * 100}% 0`;
      else s.setProperty('--w', v.w.toFixed(4));
    }
    if (v.c) s.setProperty('--c', `rgb(${v.c.r * 255 | 0},${v.c.g * 255 | 0},${v.c.b * 255 | 0})`);
    if (el.classList.contains('scene') || el.classList.contains('art')) el.classList.toggle('live', v.o > .002);
  }
  const same = (a, b) => { for (const k in a) if (a[k] !== b[k]) return false; return true; };
  /* values that steer the canvas rather than an element */
  const VIRTUAL = {
    'world.cam': v => { camZ.z = v.z; }, 'world.fx': v => Object.assign(levels, v),
    'intro.th': v => Object.assign(th, v), 'intro.shake': v => Object.assign(shake, v)
  };
  SCENES.forEach((id, i) => { VIRTUAL[id + '.th'] = v => { pulses[i] = v.p; }; VIRTUAL[`world.s${i}`] = null; });

  async function boot() {
    const { getProject, types } = await import('@theatre/core');
    if (destroyed) return;
    const project = getProject('Akarsh & Lavanya', { state: buildState() });
    await project.ready;
    if (destroyed) return;
    for (const id in SHEETS) sheets[id] = project.sheet(id);
    const objectFor = (sid, ok) => {
      const props = {};
      for (const [p, kfs] of Object.entries(SHEETS[sid][ok])) props[p] = typeof kfs[0][1] === 'string' ? types.rgba() : 0;
      return sheets[sid].object(ok, props);
    };
    const groups = new Map();
    root.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; groups.has(k) ? groups.get(k).push(el) : groups.set(k, [el]); });
    Object.keys(VIRTUAL).forEach(k => { if (!groups.has(k)) groups.set(k, []); });
    groups.forEach((els, key) => {
      const [sid, ok] = key.split('.');
      if (!SHEETS[sid] || !SHEETS[sid][ok]) return;
      const i = key.startsWith('world.s') ? +key.slice(7) : -1;
      const b = { v: null, apply: v => { els.forEach(el => applyEl(el, v)); if (VIRTUAL[key]) VIRTUAL[key](v); if (i >= 0) sceneO[i] = v.o; } };
      binds.push(b);
      cleanups.push(objectFor(sid, ok).onValuesChange(v => { if (b.v && same(v, b.v)) return; b.v = { ...v }; b.apply(v); }));
    });
    sheets.world.sequence.position = 0;
    ready = true;
    root.classList.add('ready');
    if (wantOpen || film) setTimeout(open, film ? 1200 : 0);
  }

  /* ---------- scenes ---------- */
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
      if (burst && placed[i] && active === i) { const [x, y] = pointAt(placed[i].P, Math.max(0, pulses[i])); fx.spark(x, y, 26, 1.2); }
    }, t * 1000)));
  }
  function setActive(i) {
    if (i === active && opened) return;
    active = i;
    texts.forEach((s, k) => s.classList.toggle('active', k === i));
    if (!opened) return;
    playScene(i);
    score.setSection(SCENES[i]);
    score.sfx('whoosh');
    scheduleAuto();
  }

  /* ---------- tap the light: the slam ---------- */
  function onTap() {
    if (opened) return;
    score.unlock();                                    // inside the gesture, or phones stay silent
    open();
  }
  async function open() {
    if (opened || destroyed) return;
    if (!ready) { wantOpen = true; return; }
    opened = true;
    root.classList.add('opened');
    score.start(LEAD);
    score.sfx('slam', LEAD - .02);
    setTimeout(() => { if (navigator.vibrate) navigator.vibrate(35); fx.spark(W / 2, boxes.knot.y + boxes.knot.h / 2, reduce ? 0 : 60, 2.2); }, LEAD * 1000);
    texts[0].classList.add('active');
    setTimeout(() => !destroyed && playScene(0), reduce ? 0 : 300);
    const intro = sheets.intro.sequence;
    if (reduce) intro.position = 2; else await intro.play();
    if (destroyed) return;
    gate.hidden = true;
    scroller.classList.remove('locked');
    scroller.focus({ preventScroll: true });
    setPlaying(true);
  }
  on($('#open'), 'click', onTap);

  /* ---------- autoplay: each scene holds a few bars, the next one lands on a downbeat ---------- */
  let playing = false, autoT = 0;
  const go = i => scroller.scrollTo({ top: i * H, behavior: reduce ? 'auto' : 'smooth' });
  function setPlaying(p) {
    playing = p;
    playBtn.classList.toggle('on', p);
    playBtn.setAttribute('aria-label', p ? 'Pause the story' : 'Play the story');
    scheduleAuto();
  }
  function scheduleAuto() {
    clearTimeout(autoT);
    if (!playing || !opened) return;
    const wait = Math.max(1.5, score.untilBar(HOLD_BARS[active] - 1) - .45);
    autoT = setTimeout(() => {
      if (active < NS - 1) go(active + 1);
      else { document.body.dataset.filmDone = '1'; setPlaying(false); }
    }, wait * 1000);
  }
  on(playBtn, 'click', () => {
    if (playing) return setPlaying(false);
    if (active >= NS - 1) go(0);
    setPlaying(true);
  });
  const replay = $('#replay');
  if (replay) on(replay, 'click', () => { go(0); setPlaying(true); });

  /* ---------- sound ---------- */
  on(sndBtn, 'click', () => {
    const m = !score.muted; score.mute(m);
    root.classList.toggle('muted', m);
    sndBtn.setAttribute('aria-pressed', String(m));
    sndBtn.setAttribute('aria-label', m ? 'Play music' : 'Mute music');
  });
  on(document, 'visibilitychange', () => {
    if (document.hidden) { score.suspend(); clearTimeout(autoT); }
    else { score.resume(); scheduleAuto(); }
  });

  /* ---------- every frame: swipe → world sheet, camera, thread, particles ---------- */
  const smooth = x => x * x * (3 - 2 * x);
  let wave = null, freq = null;
  function frame(now) {
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; clock += dt;
    const target = opened ? scroller.scrollTop / H : 0;
    pos = reduce ? target : pos + (target - pos) * (1 - Math.exp(-dt * 8));
    if (Math.abs(target - pos) < .0005) pos = target;
    if (ready) {
      if (sheets.world.sequence.position !== pos) sheets.world.sequence.position = pos;
      if (opened && Math.abs(target - active) > .6) setActive(Math.max(0, Math.min(NS - 1, Math.round(target))));
    }
    bars.forEach((b, i) => { b.style.transform = `scaleX(${Math.max(0, Math.min(1, pos - i + 1)).toFixed(3)})`; });

    // the camera never stops: a slow drift, a breath, the push through hand-overs and the slam's shake
    const d = reduce ? 0 : 1, t = clock;
    cam.style.transform = `translate3d(${((Math.sin(t * .23) * 1.1 + shake.x) * u * d).toFixed(2)}px,${((Math.cos(t * .19) * .9 + shake.y) * u * d).toFixed(2)}px,0) rotate(${(Math.sin(t * .11) * .35 * d).toFixed(3)}deg) scale(${(camZ.z * (1 + .012 * Math.sin(t * .5) * d)).toFixed(4)})`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const idx = Math.max(0, Math.min(NS - 1, Math.round(pos)));
    if (!reduce) fx.step(ctx, dt, t, levels, PETALS[idx], GLOWS[idx]);
    if (placed.length && opened) drawLight(t);
    raf = requestAnimationFrame(frame);
  }
  function drawLight(t) {
    const i0 = Math.max(0, Math.min(NS - 1, Math.floor(pos))), i1 = Math.min(NS - 1, i0 + 1), e = smooth(Math.max(0, Math.min(1, pos - i0)));
    const moving = e > .001 && e < .999;
    let P = e >= .999 ? placed[i1].P : placed[i0].P;
    if (moving) { prev.set(cur); P = morph(placed[i0].P, placed[i1].P, e, cur, t, 16 * u); }
    if (th.s !== 1 && i0 === 0 && !moving) {        // the slam: the knot rushes in from deep space
      const b = boxes.knot, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      for (let i = 0; i < cur.length; i += 2) { cur[i] = cx + (P[i] - cx) * th.s; cur[i + 1] = cy + (P[i + 1] - cy) * th.s; }
      P = cur;
    }
    const near = Math.abs(pos - Math.round(pos)) < .2 ? Math.round(pos) : -1;
    const z = u / 4;
    drawThread(ctx, P, { z, alpha: th.o, pulse: near >= 0 ? pulses[near] : -1, ghost: moving ? prev : null });
    // an idle light keeps travelling the line, so it never sits still
    if (!moving && !reduce) { const p = (t * .18) % 1.3; if (p < 1) drawThread(ctx, P, { z, alpha: th.o * .35, from: Math.max(0, p - .05), to: p, width: .6 }); }
    // stars of the constellation, and the diamond on the ring
    if (sceneO[1] > .01) SHAPES.stars.stars.slice(0, -1).forEach(([x, y], k) => { const [sx, sy] = placed[1].map([x, y]); glint(ctx, sx, sy, (k % 5 === 0 ? 7 : 4.5) * z, sceneO[1] * (.75 + .25 * Math.sin(t * 2.3 + k)), t * .3 + k); });
    // a diya lights on the orbit as each of the seven rounds completes
    if (sceneO[4] > .01) SHAPES.coil.diyas.forEach((d, k) => { const [sx, sy] = placed[4].map(d), lit = Math.max(0, Math.min(1, pulses[4] * 7 - k)); glint(ctx, sx, sy, 5.5 * z, sceneO[4] * lit * (.85 + .15 * Math.sin(t * 4 + k)), t * .4); });
    if (sceneO[3] > .01) {
      const [gx, gy] = placed[3].map(SHAPES.rings.gem); glint(ctx, gx, gy, 9 * z, sceneO[3] * (.8 + .2 * Math.sin(t * 3)), t * .5);
      drawWave(t, z);
    }
  }
  /* the sangeet's live sound wave and equalizer, drawn from the music itself */
  function drawWave(t, z) {
    const b = boxes.wave, M = 140, P = new Float32Array(M * 2);
    const an = score.analyser && score.time() > 0 && !score.muted ? score.analyser : null;   // silent → draw our own wave
    root.classList.toggle('no-audio', !an);
    if (an) { wave = wave || new Float32Array(an.fftSize); freq = freq || new Uint8Array(an.frequencyBinCount); an.getFloatTimeDomainData(wave); an.getByteFrequencyData(freq); }
    for (let i = 0; i < M; i++) {
      const v = an ? wave[Math.floor(i / M * wave.length)] * 2.2 : Math.sin(i * .22 + t * 5) * .25 * Math.sin(i / M * Math.PI);
      P[i * 2] = b.x + b.w * i / (M - 1); P[i * 2 + 1] = b.y + b.h / 2 + Math.max(-1, Math.min(1, v)) * b.h * .45 * Math.sin(i / (M - 1) * Math.PI);
    }
    drawThread(ctx, P, { z, alpha: sceneO[3] * .85, width: .7 });
    if (an) eq.forEach((el, i) => { const f = freq[Math.floor(Math.pow(i / eq.length, 1.7) * freq.length * .6) + 1] / 255; el.style.transform = `scaleY(${(.08 + f * .92).toFixed(3)})`; });
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
  raf = requestAnimationFrame(frame);
  const ro = new ResizeObserver(measure);
  ro.observe(scroller);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  boot().catch(err => { console.error(err); root.classList.add('ready'); });

  return () => {
    destroyed = true;
    cleanups.forEach(f => f());
    ro.disconnect(); cancelAnimationFrame(raf);
    clearInterval(cdTimer); clearTimeout(autoT); clearTimeout(tt); cueTimers.forEach(clearTimeout);
    Object.values(sheets).forEach(s => s.sequence.pause());
    score.stop();
    document.documentElement.classList.remove('film');
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
