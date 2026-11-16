/* The choreography, written for Theatre.js.
   Every animated element carries data-t="sheet.object" (see scenes.js).
   SHEETS[sheet][object][prop] = keyframes [[time, value, ease?]]; ease shapes the move INTO that keyframe.
   Props: o opacity · x/y offset in k (1k = 1% of the page width) · s scale · r rotate° · ry door swing° · w wipe 0→1.
   "intro" opens the palace doors; every other sheet plays when its section scrolls into view, and CUES fire
   sounds on the same clock. buildState() makes the project state that Theatre's Studio exports. */

/* page sections, top to bottom, and the music section each one asks for */
export const SECTIONS = ['hero', 'invite', 'date', 'count', 'fest', 'venue', 'tag', 'end'];
export const MUSIC = { hero: 'cover', invite: 'story', date: 'families', count: 'families', fest: 'sangeet', venue: 'vivah', tag: 'finale', end: 'finale' };

const EASE = {
  out: [.16, 1, .3, 1], soft: [.4, 0, .2, 1], inOut: [.65, 0, .35, 1],
  in: [.6, 0, .9, .4], back: [.34, 1.56, .64, 1], lin: [0, 0, 1, 1]
};

const fade = (t, d = .8, dy = 6) => ({ o: [[t, 0], [t + d, 1, 'soft']], y: [[t, dy], [t + d * 1.3, 0]] });
const wipe = (t, d = 1.3) => ({ w: [[t, 0], [t + d, 1, 'inOut']] });
const pop = (t, d = .7, from = .3) => ({ o: [[t, 0], [t + .25, 1]], s: [[t, from], [t + d, 1, 'back']] });
const rise = (t, dy = 14, d = 1.1) => ({ o: [[t, 0], [t + .4, 1]], y: [[t, dy], [t + d, 0, 'back']] });
const fades = (prefix, n, t0, gap = .15) => Object.fromEntries(Array.from({ length: n }, (_, i) => [prefix + i, fade(t0 + i * gap)]));
/* a banner on ropes: drops in, swings, settles */
const drop = t => ({ o: [[t, 0], [t + .2, 1]], y: [[t, -40], [t + .7, 0, 'back']], r: [[t, -9], [t + .8, 6], [t + 1.3, -3], [t + 1.8, 1.2], [t + 2.2, 0]] });

export const SHEETS = {
  /* tap: the peacock doors swing inward and we walk into the palace */
  intro: {
    txt: { o: [[0, 1], [.35, 0]] },
    dl: { ry: [[.05, 0], [1.3, 104, 'inOut']] },
    dr: { ry: [[.05, 0], [1.3, -104, 'inOut']] },
    door: { s: [[.75, 1], [1.95, 2.4, 'in']] },
    gate: { o: [[1.5, 1], [2, 0]] }
  },
  hero: {
    bells: { o: [[.2, 0], [.4, 1]], y: [[.2, -30], [1.1, 0, 'back']] },
    g: fade(.6), k: fade(.8),
    n1: { ...wipe(1), y: [[1, 3], [2.2, 0]] }, amp: pop(1.6, .6), n2: { ...wipe(1.8), y: [[1.8, 3], [3, 0]] },
    hn: fade(2.5), dt: fade(2.8), cue: fade(3.6),
    l0: { o: [[0, 0], [.8, 1, 'soft']] }, l1: rise(.3, 10, 1.6), l2: rise(.5, 12, 1.6)
  },
  invite: { panel: pop(0, .9, .92), ...fades('i', 7, .3) },
  date: { t: fade(0), h0: pop(.3), h1: pop(.45), h2: pop(.6), ...fades('i', 3, .9) },
  count: { t: fade(0), ...Object.fromEntries([0, 1, 2, 3].map(i => ['c' + i, rise(.2 + i * .14, 16)])) },
  fest: { ...fades('t', 2, 0), b0: drop(.3), b1: drop(.55), b2: drop(.8), ln: fade(1.2, 1.2, -6) },
  venue: { ...fades('t', 2, 0), art: rise(.25, 10), ...fades('i', 3, .7) },
  tag: { t: fade(0), h: pop(.3, .7, .6) },
  end: { ...fades('i', 4, 0), art: rise(.4, 10, 1.4) }
};

/* sounds on the same clock as the keyframes */
export const CUES = {
  hero: [[.25, 'bell'], [1, 'shimmer']],
  date: [[.3, 'pop']],
  count: [[.2, 'shimmer']],
  fest: [[.3, 'whoosh'], [1, 'chime']],
  venue: [[.3, 'shimmer']],
  tag: [[.3, 'pop']],
  end: [[.2, 'chime']]
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
            const into = EASE[e || 'out'], next = kfs[i + 1], out = EASE[(next && next[2]) || 'out'];
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
