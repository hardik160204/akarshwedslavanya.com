/* The original wedding score, composed and synthesized in code with Web Audio: no recordings, no samples.
   100 BPM in F major (one bar = 2.4 s). Santoor plucks, a tanpura drone, a shehnai lead, dholak, claps,
   ghungroo and temple bells. Every scene has its own 4-bar section; a change lands on the next downbeat.
   CONFIG.music.src (your own licensed song) replaces the score; the sound effects stay. */
const BPM = 100;
export const BEAT = 60 / BPM, BAR = BEAT * 4;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

const CH = { F: [53, 57, 60, 65], Dm: [50, 57, 62, 65], Bb: [46, 58, 62, 65], C: [48, 55, 60, 64], Am: [45, 57, 60, 64], Gm: [43, 58, 62, 67] };
const ROOT = { F: 41, Dm: 38, Bb: 46, C: 48, Am: 45, Gm: 43 };

/* melodies: [beat, midi, beats] over 4 bars */
const M_STORY = [[0, 72, 1.5], [1.5, 74, .5], [2, 72, 1], [3, 69, 1], [4, 69, 1.5], [5.5, 70, .5], [6, 69, 1], [7, 65, 1], [8, 74, 2], [10, 72, 1], [11, 70, 1], [12, 69, 1], [13, 67, 1], [14, 67, 2]];
const M_HOOK = [[0, 74, .5], [.5, 74, .5], [1, 77, .5], [1.5, 76, .5], [2, 74, 1], [3, 69, 1], [4, 70, .5], [4.5, 72, .5], [5, 74, .5], [5.5, 72, .5], [6, 70, 1], [7, 65, 1],
  [8, 69, .5], [8.5, 72, .5], [9, 77, 1], [10, 76, .5], [10.5, 74, .5], [11, 72, 1], [12, 74, .5], [12.5, 72, .5], [13, 70, .5], [13.5, 69, .5], [14, 67, 2]];
const M_ALAP = [[0, 72, 3], [3, 69, 1], [4, 70, 2], [6, 74, 2], [8, 67, 1.5], [9.5, 69, .5], [10, 70, 2], [12, 69, 1], [13, 67, 1], [14, 65, 2]];

export const SECTIONS = {
  cover:   { prog: ['F', 'Dm', 'Bb', 'C'], pad: .1, arp: '8', arpVol: .15, tanpura: 1, bass: .12 },
  story:   { prog: ['F', 'Dm', 'Bb', 'C'], pad: .09, arp: '4', arpVol: .12, tanpura: 1, bass: .1, mel: M_STORY, melVol: .085 },
  families: { prog: ['Bb', 'F', 'C', 'F'], pad: .09, arp: '8', arpVol: .14, tanpura: 1, bass: .11, dhol: 'light', shaker: .04 },
  haldi:   { prog: ['F', 'C', 'Dm', 'Bb'], pad: .07, arp: '16', arpVol: .12, tanpura: 1, bass: .1, dhol: 'light', shaker: .05 },
  sangeet: { prog: ['Dm', 'Bb', 'F', 'C'], pad: .06, arp: '16', arpVol: .08, bass: .16, pulse: 1, dhol: 'full', clap: .2, shaker: .06, mel: M_HOOK, melVol: .1 },
  vivah:   { prog: ['F', 'Bb', 'Gm', 'C'], pad: .1, tanpura: 1.5, bass: .12, mel: M_ALAP, melVol: .1, bell: .1 },
  venue:   { prog: ['F', 'Am', 'Bb', 'C'], pad: .08, arp: '8', arpVol: .12, tanpura: 1, bass: .1, dhol: 'light' },
  finale:  { prog: ['F', 'Bb', 'Dm', 'C'], pad: .1, arp: '8', arpVol: .11, tanpura: 1, bass: .12, mel: M_STORY, melVol: .07, big: 1 }
};
const ARP = {
  '4': [0, -1, 1, -1, 2, -1, 1, -1],
  '8': [0, 1, 2, 3, 2, 1, 2, 1],
  '16': [0, 1, 2, 1, 3, 2, 1, 2, 0, 1, 2, 3, 2, 1, 3, 1]
};
const DHOL = { full: 'DgntnkDn', light: 'D...n.n.' };
const PENTA = [77, 79, 81, 84, 86, 89, 91];

export function createScore(opts = {}) {
  let ctx = null, master, music, send, comp, analyser, noise, timer = 0;
  let section = 'cover', want = 'cover', barN = 0, nextBar = 0, muted = false, song = null;
  const cache = new Map();
  const vol = .9;

  /* ---------- graph ---------- */
  /* must run inside the tap (browsers only allow sound after a gesture) */
  function unlock() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (navigator.audioSession) try { navigator.audioSession.type = 'playback'; } catch (e) { /* older Safari */ }
    ctx = new AC();
    ctx.resume();
    return true;
  }
  function start(lead = .35) {
    if (master) return nextBar;
    if (!unlock()) return 0;
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .25;
    master = ctx.createGain(); master.gain.value = muted ? 0 : vol;
    analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = .7;
    music = ctx.createGain(); music.gain.value = 1;
    send = ctx.createGain(); send.gain.value = 1;
    const verb = ctx.createConvolver(); verb.buffer = impulse(2.8);
    const wet = ctx.createGain(); wet.gain.value = .55;
    music.connect(comp); send.connect(verb); verb.connect(wet); wet.connect(comp);
    comp.connect(master); master.connect(analyser); analyser.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    if (opts.src) {
      song = new Audio(opts.src); song.loop = true; song.crossOrigin = 'anonymous';
      ctx.createMediaElementSource(song).connect(music);
      song.play().catch(() => {});
    }
    nextBar = ctx.currentTime + lead;
    timer = setInterval(sched, 30);
    sched();
    return nextBar;
  }
  function impulse(sec) {
    const n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let lp = 0;
      for (let i = 0; i < n; i++) { lp += ((Math.random() * 2 - 1) - lp) * (.9 - .7 * i / n); d[i] = lp * Math.pow(1 - i / n, 2.6); }
    }
    return b;
  }

  /* ---------- sequencer: one bar at a time, scheduled just ahead ---------- */
  function sched() {
    const now = ctx.currentTime;
    if (nextBar < now - .05) nextBar = now + .05;          // after a stall, skip rather than burst
    while (nextBar < now + .2) {
      if (want !== section) { section = want; barN = 0; }
      if (!song) playBar(SECTIONS[section], barN, nextBar);
      barN++; nextBar += BAR;
    }
  }
  function playBar(S, n, t) {
    const name = S.prog[n % 4], ch = CH[name];
    if (S.big && n === 0) { boom(t); pad([41, 53, 60, 65, 67, 69], t, BAR * 1.6, .16); shimmer(t + .02, .07); }
    else if (S.pad) pad(ch, t, BAR * 1.04, S.pad);
    if (S.pulse) for (let i = 0; i < 8; i++) bass(ROOT[name], t + i * BEAT / 2, BEAT * .45, S.bass * (i % 2 ? .7 : 1));
    else if (S.bass) bass(ROOT[name], t, BAR * .95, S.bass);
    if (S.tanpura) [48, 53, 53, 41].forEach((m, i) => pluck(m, t + i * BEAT, .07 * S.tanpura, 4.2, .25));
    if (S.arp) {
      const tones = [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[1] + 24], pat = ARP[S.arp], step = BAR / pat.length;
      pat.forEach((ix, i) => { if (ix >= 0) pluck(tones[ix], t + i * step, S.arpVol * (i % 4 ? .75 : 1), 2.4, .3, 1.0016); });
    }
    if (S.mel) S.mel.forEach(([b, m, d]) => { if (b >= (n % 4) * 4 && b < (n % 4) * 4 + 4) reed(m, t + (b - (n % 4) * 4) * BEAT, d * BEAT, S.melVol); });
    if (S.dhol) [...DHOL[S.dhol]].forEach((c, i) => {
      const at = t + i * BEAT / 2;
      if (c === 'D') { drumLow(at, .5); drumHigh(at, .22); }
      else if (c === 'g') drumLow(at, .28);
      else if (c === 'n') drumHigh(at, .2);
      else if (c === 't' || c === 'k') drumHigh(at, .09);
    });
    if (S.clap) { clap(t + BEAT, S.clap); clap(t + BEAT * 3, S.clap); }
    if (S.shaker) for (let i = 0; i < 8; i++) shake(t + i * BEAT / 2, S.shaker * (i % 2 ? 1 : .55));
    if (S.bell && n % 2 === 0) bell(t, 740, S.bell, 3.4);
  }

  /* ---------- instruments ---------- */
  const g = (v = 1) => { const n = ctx.createGain(); n.gain.value = v; return n; };
  function out(node, dry = 1, wet = .25) {
    if (dry) node.connect(dry === 1 ? music : (() => { const d = g(dry); d.connect(music); return d; })());
    if (wet) { const s = g(wet); node.connect(s); s.connect(send); }
  }
  /* Karplus-Strong string, rendered once per pitch (santoor, tanpura, bass pluck) */
  function ks(m, dur) {
    const key = m + '|' + dur;
    if (cache.has(key)) return cache.get(key);
    const sr = ctx.sampleRate, f = mtof(m), P = Math.max(2, Math.round(sr / f)), n = Math.floor(sr * dur);
    const damp = Math.pow(10, -3 / (dur * f)), buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0), r = new Float32Array(P);
    let lp = 0;
    for (let i = 0; i < P; i++) { lp += ((Math.random() * 2 - 1) - lp) * .6; r[i] = lp; }
    let pk = 1e-6;
    for (let i = 0, j = 0; i < n; i++) {
      const a = r[j], j2 = j + 1 < P ? j + 1 : 0;
      r[j] = (a + r[j2]) * .5 * damp; d[i] = a; j = j2;
      if (i < 4000) pk = Math.max(pk, Math.abs(a));
    }
    for (let i = 0; i < n; i++) d[i] = d[i] / pk * Math.min(1, (n - i) / (sr * .05));
    cache.set(key, buf);
    return buf;
  }
  function pluck(m, t, v, dur = 2.4, wet = .3, rate = 1) {
    const s = ctx.createBufferSource(); s.buffer = ks(m, dur); s.playbackRate.value = rate;
    const a = g(v); s.connect(a); out(a, 1, wet); s.start(t);
    if (rate !== 1) { const s2 = ctx.createBufferSource(); s2.buffer = s.buffer; const b = g(v * .5); s2.connect(b); out(b, 1, wet); s2.start(t + .004); }
  }
  function pad(notes, t, dur, v) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = .3;
    const e = g(0); lp.connect(e); out(e, 1, .45);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(v, t + .7);
    e.gain.setValueAtTime(v, t + dur - .2); e.gain.linearRampToValueAtTime(0, t + dur + 1.1);
    notes.forEach((m, i) => ['triangle', 'sawtooth'].forEach((type, k) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = mtof(m); o.detune.value = k ? 7 : -5;
      const lv = g(k ? .12 : .32 / (1 + i * .15)); o.connect(lv); lv.connect(lp); o.start(t); o.stop(t + dur + 1.3);
    }));
  }
  function bass(m, t, dur, v) {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(m);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    const e = g(0); o.connect(lp); lp.connect(e); out(e, 1, 0);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(v, t + .02); e.gain.setTargetAtTime(0, t + dur * .7, dur * .15);
    o.start(t); o.stop(t + dur + .4);
  }
  /* shehnai: a reedy double-reed voice with a small meend (glide) into every note and growing vibrato */
  function reed(m, t, dur, v) {
    const f = mtof(m), end = t + dur;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = 'sawtooth'; o2.type = 'square'; o2.detune.value = 6;
    [o1, o2].forEach(o => { o.frequency.setValueAtTime(f * .944, t); o.frequency.exponentialRampToValueAtTime(f, t + .08); });
    const lfo = ctx.createOscillator(), lg = g(0); lfo.frequency.value = 5.3;
    lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * .01, t + Math.min(.4, dur * .7));
    lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
    const src = g(1), m2 = g(.3); o1.connect(src); o2.connect(m2); m2.connect(src);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1250; bp.Q.value = .8;
    const body = ctx.createBiquadFilter(); body.type = 'lowpass'; body.frequency.value = 1800;
    const bodyG = g(.45), pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 2700; pk.gain.value = 6; pk.Q.value = 1.1;
    const top = ctx.createBiquadFilter(); top.type = 'lowpass'; top.frequency.value = 5200;
    src.connect(bp); src.connect(body); body.connect(bodyG); bp.connect(pk); bodyG.connect(pk); pk.connect(top);
    const e = g(0); top.connect(e); out(e, 1, .4);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(v, t + .06);
    e.gain.setValueAtTime(v * .9, Math.max(t + .07, end - .06)); e.gain.linearRampToValueAtTime(0, end + .1);
    [o1, o2, lfo].forEach(o => { o.start(t); o.stop(end + .2); });
  }
  function noiseHit(t, dur, v, type, freq, q = 1, sweepTo = 0) {
    const s = ctx.createBufferSource(); s.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const e = g(0); s.connect(f); f.connect(e);
    s.start(t, Math.random() * 1.4); s.stop(t + dur + .05);
    return e;
  }
  function drumLow(t, v) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(175, t); o.frequency.exponentialRampToValueAtTime(58, t + .16);
    const e = g(0); o.connect(e); out(e, 1, .08);
    e.gain.setValueAtTime(v, t); e.gain.exponentialRampToValueAtTime(.001, t + .45);
    o.start(t); o.stop(t + .5);
  }
  function drumHigh(t, v) {
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(470, t); o.frequency.exponentialRampToValueAtTime(390, t + .05);
    const e = g(0); o.connect(e); out(e, 1, .12);
    e.gain.setValueAtTime(v, t); e.gain.exponentialRampToValueAtTime(.001, t + .15);
    o.start(t); o.stop(t + .2);
    const n = noiseHit(t, .05, v, 'bandpass', 3200, 1.2); out(n, 1, .1);
    n.gain.setValueAtTime(v * .7, t); n.gain.exponentialRampToValueAtTime(.001, t + .05);
  }
  function clap(t, v) {
    const n = noiseHit(t, .22, v, 'bandpass', 1150, .7); out(n, 1, .3);
    [0, .011, .023].forEach(d => { n.gain.setValueAtTime(v, t + d); n.gain.exponentialRampToValueAtTime(v * .2, t + d + .01); });
    n.gain.setValueAtTime(v * .6, t + .034); n.gain.exponentialRampToValueAtTime(.001, t + .2);
  }
  function shake(t, v) {
    const n = noiseHit(t, .05, v, 'highpass', 6800); out(n, 1, .1);
    n.gain.setValueAtTime(v, t); n.gain.exponentialRampToValueAtTime(.001, t + .045);
  }
  function bell(t, f0, v, len = 3) {
    [[1, 1], [2, .5], [2.76, .45], [4.07, .22], [5.4, .18], [6.9, .1]].forEach(([r, a], i) => {
      const o = ctx.createOscillator(); o.frequency.value = f0 * r;
      const e = g(0); o.connect(e); out(e, 1, .5);
      e.gain.setValueAtTime(v * a, t); e.gain.exponentialRampToValueAtTime(.0005, t + len / (1 + i * .55));
      o.start(t); o.stop(t + len + .1);
    });
  }
  function shimmer(t, v = .05) { for (let i = 0; i < 6; i++) bell(t + i * .07, mtof(PENTA[(Math.random() * PENTA.length) | 0]), v * (1 - i * .1), 1.6); }
  function boom(t) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(33, t + .9);
    const e = g(0); o.connect(e); out(e, 1, .2);
    e.gain.setValueAtTime(.95, t); e.gain.exponentialRampToValueAtTime(.001, t + 1.5);
    o.start(t); o.stop(t + 1.6);
    const n = noiseHit(t, .4, .5, 'lowpass', 1400, .5, 120); out(n, 1, .4);
    n.gain.setValueAtTime(.5, t); n.gain.exponentialRampToValueAtTime(.001, t + .4);
  }

  /* ---------- sound effects: every visible move has one ---------- */
  const SFX = {
    open: t => { bell(t, 523, .12, 3.2); [53, 57, 60, 65, 69].forEach((m, i) => pluck(m, t + .05 + i * .06, .16, 3, .5)); },
    whoosh: t => { const n = noiseHit(t, .6, .3, 'bandpass', 320, 1.4, 2600); out(n, 1, .35); n.gain.setValueAtTime(0, t); n.gain.linearRampToValueAtTime(.32, t + .3); n.gain.linearRampToValueAtTime(0, t + .62); },
    shimmer: t => shimmer(t, .045),
    clink: t => { bell(t, 2093, .11, 1.6); bell(t + .05, 2637, .08, 1.3); shimmer(t + .1, .035); },
    fwoom: t => { const n = noiseHit(t, .9, .5, 'lowpass', 180, .7, 1300); out(n, 1, .3); n.gain.setValueAtTime(0, t); n.gain.linearRampToValueAtTime(.42, t + .35); n.gain.exponentialRampToValueAtTime(.001, t + .9); },
    bell: t => bell(t, 660, .1, 3),
    pop: t => { const o = ctx.createOscillator(); o.frequency.setValueAtTime(1150, t); o.frequency.exponentialRampToValueAtTime(380, t + .08); const e = g(0); o.connect(e); out(e, 1, .3); e.gain.setValueAtTime(.22, t); e.gain.exponentialRampToValueAtTime(.001, t + .14); o.start(t); o.stop(t + .2); bell(t + .02, 1568, .04, 1); },
    chime: t => { bell(t, mtof(84), .06, 1.4); bell(t + .09, mtof(89), .06, 1.6); }
  };

  return {
    start, unlock,
    get running() { return !!master; },
    get muted() { return muted; },
    get analyser() { return analyser; },
    time: () => (ctx ? ctx.currentTime : 0),
    /* seconds until the downbeat `bars` bars after the next one */
    untilBar: (bars = 0) => (master ? nextBar + bars * BAR - ctx.currentTime : (bars + 1) * BAR),
    setSection(name) { if (SECTIONS[name]) want = name; },
    sfx(name, delay = 0) { if (master && SFX[name]) SFX[name](ctx.currentTime + .02 + delay); },
    mute(m) {
      muted = m;
      if (!master) return;
      master.gain.setTargetAtTime(m ? 0 : vol, ctx.currentTime, .08);
      if (song) m ? song.pause() : song.play().catch(() => {});
    },
    suspend() { if (ctx) { ctx.suspend(); if (song) song.pause(); } },
    resume() { if (ctx) { ctx.resume(); if (song && !muted) song.play().catch(() => {}); } },
    stop() { clearInterval(timer); if (song) song.pause(); if (ctx) ctx.close(); ctx = null; master = null; }
  };
}
