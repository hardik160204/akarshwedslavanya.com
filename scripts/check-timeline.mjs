/* Self-check: the hand-written choreography loads into Theatre.js and interpolates as intended.
   Run: npm run check */
import assert from 'node:assert/strict';
import core from '@theatre/core';
import { SHEETS, SCENES, buildState } from '../lib/timeline.js';

const { getProject, types } = core;
const project = getProject('check', { state: buildState() });
await project.ready;

const objOf = (sid, ok) => {
  const props = {};
  for (const [p, kfs] of Object.entries(SHEETS[sid][ok])) props[p] = typeof kfs[0][1] === 'string' ? types.rgba() : 0;
  return project.sheet(sid).object(ok, props);
};
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-3, `${msg}: ${a} != ${b}`);

const world = project.sheet('world');
const s0 = objOf('world', 's0'), s1 = objOf('world', 's1'), sky = objOf('world', 'sky');
world.sequence.position = 0;
near(s0.value.o, 1, 'cover visible at 0'); near(s1.value.o, 0, 'story hidden at 0');
world.sequence.position = 1;
near(s0.value.o, 0, 'cover hidden at 1'); near(s1.value.o, 1, 'story visible at 1');
near(sky.value.top.r, 0x0b / 255, 'sky colour at story');
world.sequence.position = .5;
assert.ok(s0.value.o < .2 && s1.value.o < .2, 'both scenes dim mid-transition');

const intro = project.sheet('intro'), flap = objOf('intro', 'flap');
intro.sequence.position = 0; near(flap.value.rx, 0, 'flap closed');
intro.sequence.position = 1.2; near(flap.value.rx, 180, 'flap open');
intro.sequence.position = .8; assert.ok(flap.value.rx > 0 && flap.value.rx < 180, 'flap eases between');

for (const id of SCENES) assert.ok(SHEETS[id], `every scene has a sheet: ${id}`);
const n1 = objOf('cover', 'n1'), cover = project.sheet('cover');
cover.sequence.position = 0; near(n1.value.w, 0, 'name hidden before entrance');
cover.sequence.position = 5; near(n1.value.w, 1, 'name revealed after entrance');
console.log('timeline ok:', Object.keys(SHEETS).length, 'sheets');
process.exit(0);
