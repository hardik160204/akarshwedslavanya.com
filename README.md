# Wedding invitation — "The Thread" (Next.js)

An animated, mobile-first wedding invitation. A single thread draws itself through every scene as you scroll.
Static site, pre-rendered HTML, self-hosted fonts: it loads fast and works on any phone or desktop.

## 1. Run it

You need Node.js 18.18 or newer (https://nodejs.org).

    npm install
    npm run dev          # opens http://localhost:3000, updates live as you edit

## 2. Edit your details

Open `lib/config.js`. That is the only file you need to edit:
names (English + Devanagari), events, date, venue, WhatsApp number, RSVP text.
Save the file and the page updates.

Optional: replace `public/og.png` with a screenshot of your finished invitation
(1200 x 630). It is the picture shown when the link is shared on WhatsApp.

## 3. Publish

    npm run build        # creates the `out/` folder (a normal website)

Upload `out/` to any host:
- Netlify Drop: drag the `out` folder onto https://app.netlify.com/drop
- Vercel / Cloudflare Pages / GitHub Pages: point them at this project (build command `npm run build`, output `out`).

After you get your link, paste it into `siteUrl` in `lib/config.js` and build again,
so WhatsApp shows the preview image.

## 4. Make the MP4 (no Claude Code needed)

Option A: add `?film=1` to your link (for example `http://localhost:3000/?film=1`).
It plays the whole invitation full-screen with no buttons. Screen-record it on your phone.

Option B: automatic recording.

    npx playwright install chromium     # one time
    npm run build
    npm run record

This creates `video/film.webm`, and `video/film.mp4` (1080x1920) if ffmpeg is installed.
To add music, put your licensed song at `public/song.mp3` before running `npm run record`.
(Recorded at 540x960 and upscaled, so it is good for WhatsApp and stories, not 4K.)

## Folder map

    app/layout.js         fonts, page title, link-preview tags
    app/page.js           the page
    app/globals.css       all the styling (colour tokens at the top)
    app/icon.svg          browser tab icon
    components/Invitation.jsx   page shell
    lib/config.js         <-- YOUR DETAILS (edit this)
    lib/scenes.js         builds each scene from your details
    lib/engine.js         thread, scroll reveals, film mode, countdown, share
    public/og.png         link-preview image
    scripts/record.mjs    automatic MP4 recorder
    next.config.mjs       static export setting
