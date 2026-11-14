/* The choreography, written for Theatre.js.
   Every animated element carries data-t="sheet.object" (see scenes.js).
   SHEETS[sheet][object][prop] = keyframes [[time, value, ease?], ...]; ease shapes the move INTO that keyframe.
   Props: o opacity · x/y offset in k (1k = 1% of stage width) · s scale · r rotate° · rx rotateX° · w wipe/draw 0→1.
   The "world" sheet is scrubbed by scrolling (time = scene number); every other sheet plays when its scene arrives.
   buildState() turns this into the project state Theatre.js normally exports from its Studio. */

export const SCENES = ['cover', 'story', 'haldi', 'sangeet', 'vivah', 'venue', 'finale'];

const EASE = {
  out: [.16, 1, .3, 1], soft: [.4, 0, .2, 1], inOut: [.65, 0, .35, 1],
  in: [.6, 0, .9, .4], back: [.34, 1.56, .64, 1], lin: [0, 0, 1, 1]
};

const fade = (t, d = .9, dy = 5) => ({ o: [[t, 0], [t + d, 1, 'soft']], y: [[t, dy], [t + d * 1.3, 0]] });
const pop = (t, d = .8) => ({ o: [[t, 0], [t + .25, 1]], s: [[t, 0], [t + d, 1, 'back']] });
const wipe = (t, d = 1.4) => ({ w: [[t, 0], [t + d, 1, 'inOut']] });
const draw = (t, d = 2) => ({ o: [[t, 0], [t + .15, 1]], w: [[t, 0], [t + d, 1, 'inOut']] });
const pill = t => ({ ...fade(t), s: [[t, .86], [t + .9, 1, 'back']] });
/* the text column every chapter shares */
const chapter = t => ({
  c: fade(t + .3), d: fade(t + .55), t: wipe(t + .8, 1.5), s: fade(t + 1.8),
  i: pill(t + 2.1), n: fade(t + 2.4), a: fade(t + 2.7)
});

/* one keyframe per scene, for the scrubbed world sheet */
const at = vals => vals.map((v, i) => [i, v]);
const inRange = kfs => kfs.filter(k => k[0] >= 0 && k[0] <= SCENES.length - 1);
const layers = {};
SCENES.forEach((_, i) => {
  layers['s' + i] = {
    o: inRange([[i - .55, 0], [i - .15, 1, 'soft'], [i + .15, 1], [i + .55, 0, 'soft']]),
    y: inRange([[i - 1, 26], [i, 0, 'lin'], [i + 1, -26, 'lin']])
  };
});

//             cover               story               haldi               sangeet             vivah               venue               finale
const SKY = [['#fbf6ff', '#e9d8f7'], ['#0b0820', '#33205c'], ['#fff4d6', '#e0cefa'], ['#0a0718', '#33175a'], ['#1c0306', '#5e0b17'], ['#fbf6ef', '#e7dbf7'], ['#0d0818', '#2e1238']];

export const SHEETS = {
  world: {
    sky: { top: at(SKY.map(c => c[0])), bot: at(SKY.map(c => c[1])) },
    stars: { o: at([0, 1, 0, 1, .3, 0, 1]) },
    sun: { o: at([0, 0, 1, 0, 0, 0, 0]), y: at([70, 70, 0, 70, 70, 70, 70]) },
    moon: { o: at([0, 0, 0, 1, .2, 0, .9]), y: at([30, 30, 30, 0, 8, 30, 0]) },
    fx: {
      petals: at([.35, 0, 1, 0, .7, .3, .55]),
      sparkles: at([.12, .8, 0, 1, .15, 0, .7]),
      embers: at([0, 0, 0, 0, 1, 0, 0]),
      fireworks: at([0, 0, 0, 0, 0, 0, 1])
    },
    ...layers
  },

  /* tap the wax seal: it pops, the flap swings open, the card rises and flies toward you */
  intro: {
    hint: { o: [[0, 1], [.3, 0]] },
    top: { o: [[0, 1], [1, 0]] },
    seal: { s: [[0, 1], [.22, 1.16, 'out'], [.6, .1, 'in']], o: [[.3, 1], [.6, 0]], r: [[0, 0], [.6, -40, 'in']] },
    flap: { rx: [[.4, 0], [1.2, 180, 'inOut']], o: [[1.8, 1], [2.4, 0]], y: [[1.8, 0], [2.4, 22, 'in']] },
    body: { o: [[1.8, 1], [2.4, 0]], y: [[1.8, 0], [2.4, 22, 'in']] },
    card: { y: [[1, 0], [1.9, -34, 'out']], s: [[1.95, 1], [2.85, 2.6, 'in']], o: [[2.45, 1], [2.85, 0]] },
    env: { o: [[2.25, 1], [2.9, 0]] }
  },

  cover: {
    arch: draw(0, 2.4),
    md: { o: [[.2, 0], [2.4, 1, 'soft']], s: [[.2, .6], [2.8, 1]] },
    fl1: { o: [[.5, 0], [1, 1]], y: [[.5, 30], [1.9, 0]], r: [[.5, -18], [2, 0]] },
    fl2: { o: [[.7, 0], [1.2, 1]], y: [[.7, 30], [2.1, 0]], r: [[.7, 18], [2.2, 0]] },
    g: fade(.3), k: fade(.65),
    n1: { ...wipe(1, 1.3), x: [[1, -5], [2.4, 0]] },
    amp: { o: [[1.9, 0], [2.4, 1]], s: [[1.9, .4], [2.6, 1, 'back']] },
    n2: { ...wipe(2.1, 1.3), x: [[2.1, 5], [3.5, 0]] },
    hn: fade(3), dt: fade(3.3), hint: fade(4.2)
  },

  /* two lights cross the night sky, meet, and a heart draws itself around them */
  story: {
    shoot: { x: [[0, -70], [1.1, 70, 'in']], y: [[0, -34], [1.1, 6, 'in']], r: [[0, 16]], o: [[0, 0], [.15, 1], [.9, 1], [1.1, 0]] },
    oa: { x: [[.3, -40], [2.2, -7, 'out']], y: [[.3, -26], [1.2, -32, 'soft'], [2.2, 0, 'inOut']], o: [[.3, 0], [.8, 1]] },
    ob: { x: [[.3, 40], [2.2, 7, 'out']], y: [[.3, 22], [1.2, 28, 'soft'], [2.2, 0, 'inOut']], o: [[.3, 0], [.8, 1]] },
    heart: draw(2, 1.6),
    glow: { o: [[2.2, 0], [3.2, 1]], s: [[2.2, .3], [3.4, 1]] },
    c: fade(.6), l1: fade(1.4, 1.1), l2: fade(2.6, 1.1), l3: fade(3.8, 1.1)
  },

  /* sunrise over lavender: Haldi */
  haldi: {
    wm: { o: [[0, 0], [1.6, 1, 'soft']], s: [[0, 1.3], [2.4, 1]] },
    lv1: { o: [[.2, 0], [.7, 1]], y: [[.2, 46], [1.8, 0]], r: [[.2, -14], [2, 0]] },
    lv2: { o: [[.4, 0], [.9, 1]], y: [[.4, 46], [2, 0]], r: [[.4, 14], [2.2, 0]] },
    sp1: pop(.9, 1), sp2: pop(1.15, 1), sp3: pop(1.4, 1),
    mg1: { ...pop(1.5), r: [[1.5, -120], [2.6, 0]] },
    mg2: { ...pop(1.75), r: [[1.75, 120], [2.85, 0]] },
    ...chapter(0)
  },

  /* two rings fly in and lock with a burst of light, then the party starts */
  sangeet: {
    beams: { o: [[.4, 0], [1.6, 1, 'soft']] },
    lights: draw(.1, 1.4),
    bulbs: { o: [[1, 0], [1.6, 1]] },
    wm: { o: [[0, 0], [1.6, 1, 'soft']], s: [[0, 1.3], [2.4, 1]] },
    r1: { x: [[.2, -62], [1.6, -7, 'out']], y: [[.2, 12], [.9, -8, 'soft'], [1.6, 0, 'soft']], r: [[.2, -220], [1.6, 0, 'out']], o: [[.2, 0], [.5, 1]] },
    r2: { x: [[.2, 62], [1.6, 7, 'out']], y: [[.2, 12], [.9, -8, 'soft'], [1.6, 0, 'soft']], r: [[.2, 220], [1.6, 0, 'out']], o: [[.2, 0], [.5, 1]] },
    burst: { s: [[1.45, 0], [1.9, 1.15, 'out'], [2.8, 1.35]], o: [[1.45, 0], [1.6, 1], [2.8, 0]] },
    ...chapter(.9),
    amp: pop(2.4),
    t2: wipe(2.6, 1.5),
    eq: { o: [[2.2, 0], [3, 1]], y: [[2.2, 12], [3.1, 0]] }
  },

  /* the mandap draws itself, the sacred fire is lit, seven rounds appear */
  vivah: {
    mandap: draw(0, 2.6),
    toran: { o: [[1.2, 0], [1.8, 1]], y: [[1.2, -10], [2.2, 0, 'back']] },
    gar: { o: [[1.4, 0], [2, 1]], y: [[1.4, -24], [2.6, 0]] },
    fire: { o: [[.8, 0], [1.2, 1]], s: [[.8, 0], [1.9, 1, 'back']] },
    ring: draw(1.6, 1.4),
    ...Object.fromEntries(Array.from({ length: 7 }, (_, i) => ['p' + i, pop(2.1 + i * .18, .6)])),
    ...chapter(0),
    t: { ...wipe(.8, 1.6), s: [[.8, 1.12], [2.4, 1]] }
  },

  /* a route draws across the map and the pin drops on the resort */
  venue: {
    c: fade(.2), d: fade(.45), t: wipe(.7, 1.4), ad: fade(1.4),
    map: { o: [[.6, 0], [1.2, 1]], s: [[.6, .92], [1.7, 1]] },
    route: draw(1.2, 1.5),
    pin: { y: [[2.5, -34], [2.95, 0, 'in'], [3.12, -3.5, 'out'], [3.3, 0, 'in']], o: [[2.5, 0], [2.65, 1]] },
    pul: { o: [[3, 0], [3.4, 1]] },
    b: fade(3)
  },

  finale: {
    md: { o: [[0, 0], [2.4, 1, 'soft']], s: [[0, .5], [3, 1]] },
    orn: draw(0, 1.6),
    hi: fade(.4), t: fade(.8, 1.2), cnt: fade(1.6), sg: fade(2.1),
    nm: { ...wipe(2.3, 1.5), s: [[2.3, .9], [3.6, 1]] },
    b: fade(3)
  }
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
