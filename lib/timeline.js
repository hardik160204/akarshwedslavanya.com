/* The choreography, written for Theatre.js.
   Every animated element carries data-t="sheet.object" (see scenes.js and art.js).
   SHEETS[sheet][object][prop] = keyframes [[time, value, ease?]]; ease shapes the move INTO that keyframe.
   Props: o opacity · x/y offset (k units on the page, scene units inside an illustration) · s scale · r rotate°
   · ry door swing° · w wipe 0→1.
   "world" is the page-turn clock (time = page number); "intro" opens the palace doors; every other sheet plays
   when its page arrives, and CUES fire sounds on the same clock. buildState() makes the project state that
   Theatre's Studio exports. */

export const SCENES = ['cover', 'story', 'families', 'haldi', 'sangeet', 'vivah', 'venue', 'finale'];
export const HOLD_BARS = [4, 3, 4, 5, 5, 5, 4, 0];       // how long each page stays (1 bar = 2.4 s); the last one waits
export const LAYERS = 5;                                // paper layers per illustration

const EASE = {
  out: [.16, 1, .3, 1], soft: [.4, 0, .2, 1], inOut: [.65, 0, .35, 1],
  in: [.6, 0, .9, .4], back: [.34, 1.56, .64, 1], lin: [0, 0, 1, 1]
};

const fade = (t, d = .8, dy = 4) => ({ o: [[t, 0], [t + d, 1, 'soft']], y: [[t, dy], [t + d * 1.3, 0]] });
const wipe = (t, d = 1.2) => ({ w: [[t, 0], [t + d, 1, 'inOut']] });
const pop = (t, d = .7, from = 0) => ({ o: [[t, 0], [t + .2, 1]], s: [[t, from], [t + d, 1, 'back']] });
const pill = t => ({ ...fade(t), s: [[t, .88], [t + .8, 1, 'back']] });
/* a pop-up book: paper layers stand up one after another from the bottom edge */
const popup = (t0, gap = .13) => Object.fromEntries(Array.from({ length: LAYERS }, (_, i) => {
  const t = t0 + i * gap;
  return ['l' + i, { o: [[t, 0], [t + .25, 1]], y: [[t, 26], [t + .85, 0, 'back']], s: [[t, .94], [t + .85, 1, 'back']] }];
}));
const chapter = t => ({
  c: fade(t), d: fade(t + .2), t: { ...wipe(t + .4), y: [[t + .4, 3], [t + 1.6, 0]] }, s: fade(t + 1),
  i: pill(t + 1.3), n: fade(t + 1.6), a: fade(t + 1.8)
});

/* world: pages slide and cross-fade; petals per page */
const at = vals => vals.map((v, i) => [i, v]);
const inRange = kfs => kfs.filter(k => k[0] >= 0 && k[0] <= SCENES.length - 1);
const pages = {};
SCENES.forEach((_, i) => {
  pages['s' + i] = {
    o: inRange([[i - .6, 0], [i - .1, 1, 'soft'], [i + .1, 1], [i + .6, 0, 'soft']]),
    x: inRange([[i - 1, 22], [i, 0, 'lin'], [i + 1, -22, 'lin']]),
    s: inRange([[i - 1, .97], [i, 1, 'lin'], [i + 1, 1.03, 'lin']])
  };
});

export const SHEETS = {
  world: {
    fx: { petals: at([.35, 0, .45, .7, 0, .55, .15, .9]) },
    ...pages
  },

  /* tap the palace doors: they swing inward and we walk through */
  intro: {
    txt: { o: [[0, 1], [.35, 0]] },
    dl: { ry: [[.05, 0], [1.25, 106, 'inOut']] },
    dr: { ry: [[.05, 0], [1.25, -106, 'inOut']] },
    door: { s: [[.7, 1], [1.9, 2.3, 'in']] },
    gate: { o: [[1.45, 1], [1.95, 0]] }
  },

  cover: {
    ...popup(.9),
    g: fade(.9), k: fade(1.1),
    n1: { ...wipe(1.3), y: [[1.3, 3], [2.4, 0]] }, amp: pop(1.9, .6, .3), n2: { ...wipe(2.1), y: [[2.1, 3], [3.2, 0]] },
    hn: fade(2.8), dt: pill(3.1)
  },
  story: { ...popup(.1), c: fade(.5), t: { ...wipe(.8), y: [[.8, 3], [2, 0]] }, s: fade(1.5) },
  families: {
    ...popup(.1),
    heart: { o: [[1.6, 0], [1.75, 1]], s: [[1.6, 0], [2.1, 1.22, 'back'], [2.45, 1]] },
    c: fade(.5), t: { ...wipe(.8), y: [[.8, 3], [2, 0]] }, s: fade(1.5)
  },
  haldi: { ...popup(.1), urli: { o: [[1, 0], [1.2, 1]], s: [[1, .3], [1.6, 1, 'back']] }, ...chapter(.3) },
  sangeet: {
    ...popup(.1),
    rings: { o: [[.7, 0], [.9, 1]], r: [[.7, -28], [1.3, 12], [1.75, -6], [2.15, 3], [2.5, 0]] },
    ...chapter(.3), amp: pop(1.1, .5, .3), t2: wipe(1.2)
  },
  vivah: { ...popup(.1), fire: { o: [[.9, 0], [1.05, 1]], s: [[.9, .2], [1.5, 1, 'back']] }, ...chapter(.3) },
  venue: {
    ...popup(.1),
    car: { o: [[.7, 0], [.9, 1]], x: [[.7, -40], [2.6, 196, 'soft']], y: [[.7, 424], [1.7, 396], [2.6, 372, 'soft']], r: [[.7, -18], [1.7, -14], [2.6, -9]], s: [[.7, 1.05], [2.6, .78, 'soft']] },
    pin: { o: [[2.3, 0], [2.4, 1]], y: [[2.3, -70], [2.75, 0, 'in'], [2.9, -7, 'out'], [3.05, 0, 'in']] },
    c: fade(.4), d: fade(.6), t: { ...wipe(.8), y: [[.8, 3], [2, 0]] }, ad: fade(1.4), b: pill(2.8)
  },
  finale: {
    ...popup(.1),
    hi: fade(.5), t: fade(.8), cnt: pill(1.2), sg: fade(1.6), nm: { ...wipe(1.8), y: [[1.8, 3], [3, 0]] }, g: fade(2.4), b: pill(2.6)
  }
};

/* sounds on the same clock as the keyframes: [time, effect, confetti?] */
export const CUES = {
  cover: [[1.3, 'shimmer']],
  story: [[.6, 'shimmer']],
  families: [[1.65, 'chime', 1]],
  haldi: [[1, 'pop']],
  sangeet: [[1.3, 'clink']],
  vivah: [[.9, 'fwoom'], [1.6, 'bell'], [2.6, 'bell']],
  venue: [[.8, 'whoosh'], [2.75, 'pop']],
  finale: [[.4, 'chime', 1], [1.8, 'shimmer']]
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
