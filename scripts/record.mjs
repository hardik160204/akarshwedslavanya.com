/* Records the invitation's "film" automatically and converts it to MP4.
 *
 *   npm run build           (creates the out/ folder)
 *   npx playwright install chromium     (one time)
 *   npm run record
 *
 * Output: video/film.webm  and, if ffmpeg is installed, video/film.mp4 (1080x1920).
 * Music: put your licensed song at public/song.mp3 (or set SONG=path/to/song.mp3).
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OUT = path.resolve('out');
if (!fs.existsSync(OUT)) { console.error('Run "npm run build" first (it creates the out/ folder).'); process.exit(1); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(OUT, p);
  if (!f.startsWith(OUT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(4173, r));

const W = 540, H = 960; // recorded at 540x960, upscaled to 1080x1920 below
fs.mkdirSync('video', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: 'video', size: { width: W, height: H } } });
const page = await ctx.newPage();
console.log('Recording the film (about a minute)...');
await page.goto('http://localhost:4173/?film=1');
await page.waitForFunction(() => document.body.dataset.filmDone === '1', null, { timeout: 180000 });
await page.waitForTimeout(1500);
const vid = page.video();
await ctx.close();
fs.copyFileSync(await vid.path(), 'video/film.webm');
await browser.close();
server.close();
console.log('Saved video/film.webm');

const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
if (!hasFfmpeg) { console.log('ffmpeg not found. Install it (https://ffmpeg.org) to get an MP4, or convert film.webm in CapCut/HandBrake.'); process.exit(0); }
const song = process.env.SONG || (fs.existsSync('public/song.mp3') ? 'public/song.mp3' : null);
const args = ['-y', '-i', 'video/film.webm'];
if (song) args.push('-i', song);
args.push('-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-r', '30');
if (song) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
args.push('video/film.mp4');
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
console.log(r.status === 0 ? 'Saved video/film.mp4' + (song ? ' (with music)' : ' (no music)') : 'ffmpeg failed.');
