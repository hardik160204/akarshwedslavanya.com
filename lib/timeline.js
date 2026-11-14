/* The choreography, written for Theatre.js.
   Every animated element carries data-t="sheet.object" (see scenes.js).
   SHEETS[sheet][object][prop] = keyframes [[time, value, ease?]]; ease shapes the move INTO that keyframe.
   Props: o opacity · x/y offset in k (1k = 1% of stage width) · s scale · r rotate° · w wipe/draw 0→1 · p light pulse 0→1.
   "world" is scrubbed by swiping (time = scene number); "intro" is the slam; every other sheet plays when its
   scene arrives, and CUES fire sounds on the same clock. buildState() makes the project state Theatre's Studio exports. */

export const SCENES = ['cover', 'story', 'haldi', 'sangeet', 'vivah', 'venue', 'finale'];
export const HOLD_BARS = [4, 4, 5, 5, 5, 4, 4];         // autoplay: bars each scene stays (1 bar = 2.4 s)

const EASE = {
  out: [.16, 1, .3, 1], soft: [.4, 0, .2, 1], inOut: [.65, 0, .35, 1],
  in: [.6, 0, .9, .4], back: [.34, 1.56, .64, 1], lin: [0, 0, 1, 1], expoIn: [.7, 0, .84, 0]
};

const fade = (t, d = .9, dy = 5) => ({ o: [[t, 0], [t + d, 1, 'soft']], y: [[t, dy], [t + d * 1.3, 0]] });
const rise = (t, d = 1.1) => ({ o: [[t, 0], [t + d, 1, 'soft']], y: [[t, 9], [t + d * 1.4, 0]], s: [[t, .94], [t + d * 1.4, 1]] });
const pop = (t, d = .8) => ({ o: [[t, 0], [t + .25, 1]], s: [[t, 0], [t + d, 1, 'back']] });
const wipe = (t, d = 1.4) => ({ w: [[t, 0], [t + d, 1, 'inOut']] });
const draw = (t, d = 2) => ({ o: [[t, 0], [t + .15, 1]], w: [[t, 0], [t + d, 1, 'inOut']] });
const pulse = (t, d = 1.6) => ({ p: [[t, 0], [t + d, 1, 'inOut']] });
const pill = t => ({ ...fade(t), s: [[t, .86], [t + .9, 1, 'back']] });
const chapter = t => ({
  c: fade(t + .2), d: fade(t + .45), t: { ...wipe(t + .7, 1.5), ...{ y: [[t + .7, 4], [t + 2.2, 0]] } }, s: fade(t + 1.7),
  i: pill(t + 2), n: fade(t + 2.3), a: fade(t + 2.6)
});

/* world sheet: one keyframe per scene */
const at = vals => vals.map((v, i) => [i, v]);
const inRange = kfs => kfs.filter(k => k[0] >= 0 && k[0] <= SCENES.length - 1);
const layers = {};
SCENES.forEach((_, i) => {
  layers['s' + i] = {
    o: inRange([[i - .55, 0], [i - .14, 1, 'soft'], [i + .14, 1], [i + .55, 0, 'soft']]),
    y: inRange([[i - 1, 30], [i, 0, 'lin'], [i + 1, -30, 'lin']]),
    s: inRange([[i - 1, .9], [i, 1, 'lin'], [i + 1, 1.12, 'lin']])
  };
});
/* the camera pushes in through every hand-over */
const push = [];
SCENES.forEach((_, i) => { push.push([i, 1]); if (i < SCENES.length - 1) push.push([i + .5, 1.09]); });

//            cover      story      haldi      sangeet    vivah      venue      finale
const G1 = ['#ff8a2a', '#3a2bd0', '#ffb300', '#ff2d95', '#ff4a12', '#2f6bff', '#ffb347'];
const G2 = ['#b3124a', '#8a3ffc', '#8f6bff', '#5b2cff', '#9c0b2b', '#c9a24a', '#c03a7a'];
export const GLOWS = G1.map((c, i) => [c, G2[i], '#ffd9a0'].map(h => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},1)`; }));

export const SHEETS = {
  world: {
    g1: { c: at(G1) }, g2: { c: at(G2) },
    cam: { z: push },
    stars: { o: at([.25, 1, 0, .7, .35, .2, .9]) },
    fx: {
      petals: at([.25, 0, .9, 0, .55, 0, .45]),
      sparkles: at([.25, .8, .2, .9, .2, .15, .6]),
      embers: at([0, 0, 0, 0, 1, 0, 0]),
      fireworks: at([0, 0, 0, 0, 0, 0, 1]),
      bokeh: at([.8, .7, 1, 1, .8, .7, 1])
    },
    ...layers
  },

  /* tap: the waiting light rushes into the distance, then the thread SLAMS in from deep space on the downbeat */
  intro: {
    gate: { o: [[0, 1], [.25, 0]], s: [[0, 1], [.3, 1.15, 'in']] },
    th: { s: [[0, .02], [.35, 1.16, 'expoIn'], [.6, .97], [.85, 1]], o: [[0, 0], [.2, 1]] },
    flash: { o: [[.33, 0], [.36, .55], [.9, 0, 'out']] },
    shake: { x: [[.35, 0], [.39, -2.6], [.44, 2.1], [.5, -1.4], [.57, .8], [.66, -.3], [.76, 0]], y: [[.35, 0], [.4, 1.8], [.46, -1.4], [.53, .9], [.62, -.4], [.72, 0]] }
  },

  cover: {
    th: pulse(.4, 1.8),
    halo: { o: [[.3, 0], [1.6, 1, 'soft']], s: [[.3, .6], [2, 1]] },
    arch: draw(.4, 2.6),
    md: { o: [[.5, 0], [2.6, 1, 'soft']], s: [[.5, .7], [3, 1]] },
    g: fade(.2), k: fade(.5),
    n1: { ...wipe(.7, 1.3), y: [[.7, 4], [2, 0]] },
    n2: { ...wipe(1.3, 1.3), y: [[1.3, 4], [2.6, 0]] },
    hn: fade(2.2), dt: rise(2.5), hint: fade(3.6)
  },

  /* the knot unties into a constellation; two stars, A and L, find each other */
  story: {
    th: pulse(.3, 2.4),
    c: fade(.4), l1: rise(1.1), l2: rise(2.3), l3: rise(3.5)
  },

  /* sunrise over lavender: the thread blooms into a marigold */
  haldi: {
    th: pulse(.2, 2.2),
    sun: { o: [[0, 0], [1.4, 1, 'soft']], s: [[0, .6], [2, 1]] },
    wm: { o: [[.2, 0], [1.8, 1, 'soft']], s: [[.2, 1.25], [2.6, 1]] },
    lv1: { o: [[.2, 0], [.7, 1]], y: [[.2, 46], [1.8, 0]], r: [[.2, -14], [2, 0]] },
    lv2: { o: [[.4, 0], [.9, 1]], y: [[.4, 46], [2, 0]], r: [[.4, 14], [2.2, 0]] },
    mg1: { ...pop(1.3), r: [[1.3, -120], [2.4, 0]] },
    mg2: { ...pop(1.55), r: [[1.55, 120], [2.65, 0]] },
    ...chapter(.2)
  },

  /* the marigold becomes two rings that lock with a flash, then the beat drops */
  sangeet: {
    th: pulse(.2, 1.5),
    beams: { o: [[.6, 0], [1.8, 1, 'soft']] },
    bulbs: { o: [[1, 0], [1.8, 1]] },
    eq: { o: [[1.4, 0], [2.2, 1]], y: [[1.4, 10], [2.3, 0]] },
    ...chapter(.6),
    amp: pop(2.2), t2: wipe(2.4, 1.5)
  },

  /* the rings unwind into seven rounds around the sacred fire: one bell per round */
  vivah: {
    th: { p: [[1.6, 0], [4.75, 1, 'lin']] },
    mandap: draw(0, 2.6),
    toran: { o: [[1, 0], [1.6, 1]], y: [[1, -10], [2, 0, 'back']] },
    gar: { o: [[1.2, 0], [1.8, 1]], y: [[1.2, -24], [2.4, 0]] },
    fire: { o: [[.7, 0], [1.1, 1]], s: [[.7, 0], [1.8, 1, 'back']] },
    ...chapter(0),
    t: { ...wipe(.7, 1.6), s: [[.7, 1.12], [2.3, 1]] }
  },

  /* the thread becomes the road through Aligarh and the pin drops on the resort */
  venue: {
    th: pulse(.9, 1.8),
    map: { o: [[.3, 0], [1, 1]], s: [[.3, .94], [1.5, 1]] },
    pin: { y: [[2.6, -34], [3.05, 0, 'in'], [3.22, -3.5, 'out'], [3.4, 0, 'in']], o: [[2.6, 0], [2.75, 1]] },
    pul: { o: [[3.1, 0], [3.5, 1]] },
    c: fade(.2), d: fade(.45), t: wipe(.6, 1.4), ad: fade(1.3), b: fade(3)
  },

  /* the road ties itself back into the knot */
  finale: {
    th: pulse(.2, 1.8),
    md: { o: [[0, 0], [2.4, 1, 'soft']], s: [[0, .5], [3, 1]] },
    hi: fade(.5), t: rise(.9, 1.2), cnt: fade(1.7), sg: fade(2.2),
    nm: { ...wipe(2.4, 1.5), y: [[2.4, 4], [3.6, 0]] },
    b: fade(3), g: fade(3.4)
  }
};

/* sounds on the same clock as the keyframes: [time, effect, spark burst at the light's head?] */
export const CUES = {
  cover: [[.4, 'shimmer']],
  story: [[.3, 'shimmer'], [2.6, 'chime', 1]],
  haldi: [[.25, 'shimmer'], [1.3, 'pop']],
  sangeet: [[1.55, 'clink', 1]],
  vivah: [[.7, 'fwoom'], ...Array.from({ length: 7 }, (_, i) => [1.6 + (i + 1) * .45, 'bell', 1])],
  venue: [[.9, 'whoosh'], [3.05, 'pop', 1]],
  finale: [[.2, 'shimmer'], [2, 'chime', 1]]
};

const rgba = h => {
  const n = parseInt(h.slice(1), 16);
  return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255, a: 1 };
};

/* Theatre.js project state (definitionVersion 0.4.0), the same shape Studio exports. */
export function buildState(sheets = SHEETS) {
  let n = 0;
  const sheetsById = {};
  for (const [sid, objects] of Object.entries(sheets)) {
    const def = sid === 'world' ? 'inOut' : 'out';
    const tracksByObject = {};
    let length = 0;
    for (const [ok, props] of Object.entries(objects)) {
      const trackData = {}, trackIdByPropPath = {};
      for (const [prop, kfs] of Object.entries(props)) {
        const id = 'T' + (n++).toString(36);
        trackIdByPropPath[JSON.stringify([prop])] = id;
        trackData[id] = {
          type: 'BasicKeyframedTrack',
          __debugName: `${ok}:["${prop}"]`,
          keyframes: kfs.map(([t, v, e], i) => {
            const into = EASE[e || def], next = kfs[i + 1], out = EASE[(next && next[2]) || def];
            return {
              id: `${id}k${i}`, position: t, connectedRight: !!next, type: 'bezier',
              handles: [into[2], into[3], out[0], out[1]],
              value: typeof v === 'string' ? rgba(v) : v
            };
          })
        };
        length = Math.max(length, kfs[kfs.length - 1][0]);
      }
      tracksByObject[ok] = { trackData, trackIdByPropPath };
    }
    sheetsById[sid] = {
      staticOverrides: { byObject: {} },
      sequence: { type: 'PositionalSequence', length, subUnitsPerUnit: 60, tracksByObject }
    };
  }
  return { sheetsById, definitionVersion: '0.4.0', revisionHistory: [] };
}
