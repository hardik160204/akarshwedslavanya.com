/* Self-check: the choreography loads into Theatre.js and interpolates as intended, every animated object
   has an element on the page, and calendar times convert correctly. Run: npm run check */
import assert from 'node:assert/strict';
import core from '@theatre/core';
import { SHEETS, SCENES, CUES, HOLD_BARS, LAYERS, buildState } from '../lib/timeline.js';
import { SCENE_ART } from '../lib/art.js';
import { sceneHtml } from '../lib/scenes.js';
import { SECTIONS } from '../lib/score.js';
import { ics } from '../lib/engine.js';
import { CONFIG } from '../lib/config.js';

const { getProject } = core;
const project = getProject('check', { state: buildState() });
await project.ready;
const objOf = (sid, ok) => {
  const props = {}; for (const p in SHEETS[sid][ok]) props[p] = 0;
  return project.sheet(sid).object(ok, props);
};
const near = (a, b, msg, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${msg}: ${a} != ${b}`);

/* pages slide and cross-fade on the world clock */
const world = project.sheet('world'), s0 = objOf('world', 's0'), s1 = objOf('world', 's1');
world.sequence.position = 0; near(s0.value.o, 1, 'cover visible'); near(s1.value.o, 0, 'next page hidden');
world.sequence.position = 1; near(s0.value.o, 0, 'cover gone'); near(s1.value.o, 1, 'page 2 visible');
world.sequence.position = .5; assert.ok(s0.value.x < 0 && s1.value.x > 0, 'pages slide past each other');

/* the doors swing inward, in opposite directions */
const intro = project.sheet('intro'), dl = objOf('intro', 'dl'), dr = objOf('intro', 'dr');
intro.sequence.position = 0; near(dl.value.ry, 0, 'doors closed');
intro.sequence.position = 1.25; near(dl.value.ry, 106, 'left door open'); near(dr.value.ry, -106, 'right door open');

/* paper layers pop up from below with a little overshoot */
const l0 = objOf('cover', 'l0'), cover = project.sheet('cover');
cover.sequence.position = .9; near(l0.value.y, 26, 'layer starts below');
cover.sequence.position = 3; near(l0.value.y, 0, 'layer stands up');

/* every page has art, a sheet, cues, music and a hold; every animated object has an element */
assert.equal(HOLD_BARS.length, SCENES.length);
const html = sceneHtml(CONFIG), onPage = new Set([...html.matchAll(/data-t="([^"]+)"/g)].map(m => m[1]));
for (const id of SCENES) {
  assert.ok(SHEETS[id] && CUES[id] && SECTIONS[id], `page ${id} has a sheet, cues and music`);
  const layers = SCENE_ART[id]();
  assert.ok(layers.length >= 4 && layers.length <= LAYERS, `${id} has 4–${LAYERS} paper layers`);
}
for (const [sid, objs] of Object.entries(SHEETS)) for (const ok of Object.keys(objs)) {
  if (sid === 'world' && ok === 'fx') continue;                      // drives the petals, not an element
  if (/^l\d$/.test(ok) && +ok[1] >= SCENE_ART[sid]().length) continue; // fewer layers on this page
  assert.ok(onPage.has(`${sid}.${ok}`), `element for ${sid}.${ok}`);
}

/* calendar: India time → UTC */
const cal = ics(CONFIG, CONFIG.events[0]);
assert.ok(cal.includes('DTSTART:20261209T053000Z'), '11 AM IST is 05:30 UTC');
assert.ok(cal.includes('LOCATION:Green View Resort\\, Agra Road\\, Aligarh'), 'commas escaped in .ics');

console.log('storybook ok:', SCENES.length, 'pages ·', onPage.size, 'animated elements · calendar ok');
process.exit(0);
