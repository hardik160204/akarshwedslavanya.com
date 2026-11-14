/* Self-check: the hand-written choreography loads into Theatre.js and interpolates as intended,
   the thread's shapes are evenly resampled, and calendar times convert correctly. Run: npm run check */
import assert from 'node:assert/strict';
import core from '@theatre/core';
import { SHEETS, SCENES, CUES, HOLD_BARS, buildState } from '../lib/timeline.js';
import { SHAPES, SCENE_SHAPES, resample, N } from '../lib/thread.js';
import { ics } from '../lib/engine.js';
import { CONFIG } from '../lib/config.js';

const { getProject, types } = core;
const project = getProject('check', { state: buildState() });
await project.ready;

const objOf = (sid, ok) => {
  const props = {};
  for (const [p, kfs] of Object.entries(SHEETS[sid][ok])) props[p] = typeof kfs[0][1] === 'string' ? types.rgba() : 0;
  return project.sheet(sid).object(ok, props);
};
const near = (a, b, msg, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${msg}: ${a} != ${b}`);

/* world: scenes cross-fade, the camera pushes in between them, colours follow */
const world = project.sheet('world');
const s0 = objOf('world', 's0'), s1 = objOf('world', 's1'), cam = objOf('world', 'cam'), g1 = objOf('world', 'g1');
world.sequence.position = 0; near(s0.value.o, 1, 'cover visible at 0'); near(s1.value.o, 0, 'story hidden at 0'); near(cam.value.z, 1, 'camera at rest');
world.sequence.position = 1; near(s0.value.o, 0, 'cover hidden at 1'); near(s1.value.o, 1, 'story visible at 1');
near(g1.value.c.r, 0x3a / 255, 'glow colour at story');
world.sequence.position = .5;
assert.ok(s0.value.o < .2 && s1.value.o < .2, 'both scenes dim mid-transition');
assert.ok(cam.value.z > 1.05, 'camera pushes in through the hand-over');

/* intro: the thread slams in from deep space */
const intro = project.sheet('intro'), th = objOf('intro', 'th');
intro.sequence.position = 0; near(th.value.s, .02, 'thread far away before the tap');
intro.sequence.position = .35; near(th.value.s, 1.16, 'slam overshoot on the downbeat');
intro.sequence.position = .85; near(th.value.s, 1, 'thread settles');

/* every scene has a sheet, a light pulse, cues and an autoplay hold */
assert.equal(HOLD_BARS.length, SCENES.length);
assert.equal(SCENE_SHAPES.length, SCENES.length);
for (const id of SCENES) { assert.ok(SHEETS[id] && SHEETS[id].th, `scene ${id} has a sheet with a pulse`); assert.ok(CUES[id], `cues for ${id}`); }
const n1 = objOf('cover', 'n1'), cover = project.sheet('cover');
cover.sequence.position = 0; near(n1.value.w, 0, 'name hidden before entrance');
cover.sequence.position = 5; near(n1.value.w, 1, 'name revealed after entrance');

/* thread: every shape has N evenly spaced points (so morphs and pulses move at a steady speed) */
for (const [name, s] of Object.entries(SHAPES)) {
  assert.equal(s.pts.length, N * 2, `${name} has ${N} points`);
  const seg = i => Math.hypot(s.pts[i * 2 + 2] - s.pts[i * 2], s.pts[i * 2 + 3] - s.pts[i * 2 + 1]);
  const a = seg(0), b = seg(Math.floor(N / 2)), c = seg(N - 2);
  assert.ok(Math.abs(a - b) / b < .15 && Math.abs(c - b) / b < .15, `${name} is evenly spaced (${a.toFixed(3)} ${b.toFixed(3)} ${c.toFixed(3)})`);
}
const line = resample([[0, 0], [10, 0]], 11);
near(line[2], 1, 'resample a straight line'); near(line[20], 10, 'resample keeps the end');

/* calendar: India time → UTC */
const cal = ics(CONFIG, CONFIG.events[0]);
assert.ok(cal.includes('DTSTART:20261209T053000Z'), '11 AM IST is 05:30 UTC');
assert.ok(cal.includes('LOCATION:Green View Resort\\, Agra Road\\, Aligarh'), 'commas escaped in .ics');

console.log('timeline ok:', Object.keys(SHEETS).length, 'sheets ·', Object.keys(SHAPES).length, 'thread shapes · calendar ok');
process.exit(0);
