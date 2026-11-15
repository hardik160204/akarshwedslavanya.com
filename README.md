# Akarsh & Lavanya — an illustrated wedding storybook (Next.js + Theatre.js + Web Audio)

A mobile-first wedding invitation told like a picture book, tapped through like Instagram stories.

**The story:** a guest taps and the palace doors swing open. Then: the cover (the couple under a marigold
arch before a pink palace) → *Once upon a time*, two havelis under the same moon → *Two families, one yes*,
two decorated elephants meeting under a paper heart → **The Radiance Rituals** (Haldi in lavender fields) →
**Ring Ceremony & Sparkling Sangeet Night** (a stage, golden rings, dhols, the couple dancing) →
**Mangal Vivah** (the mandap and the sacred fire) → the venue (a car driving up to Green View Resort) →
the finale with a countdown, petals, share and RSVP.

**The look:** paper-cut illustrations drawn entirely in code (`lib/art.js`), no image files. Every picture is a
stack of paper layers with soft shadows that pop up like a pop-up book when its page arrives.

**How guests use it:** tap right for the next page, left to go back, hold to pause, or swipe. Pages also move on
by themselves, with progress bars at the top. An original score composed in code (`lib/score.js`: santoor,
tanpura, shehnai, dholak, temple bells) plays after the doors open; ♪ mutes it.

## 1. Run it

You need Node.js 18.18 or newer.

    npm install
    npm run dev          # http://localhost:3000
    npm run check        # self-check: timeline, every animated element exists, calendar times

## 2. Edit your details

Open `lib/config.js`: names, the two story pages, the three events, calendar times, venue, countdown moment,
WhatsApp RSVP number (the RSVP button stays hidden until you add one), and `music.src` if you want your own
licensed song instead of the original score (put the file in `public/`).

**Personal invites:** add `?to=` to the link, e.g. `…/?to=Sharma%20Family`. The doors greet them with
"Dear Sharma Family," and the last page says "We can't wait to celebrate with you, Sharma Family."

## 3. How it's built

    lib/art.js        the paper-cut illustrations: palace, havelis, elephants, the couple, mandap, fire, map…
    lib/timeline.js   Theatre.js choreography: page turns, the doors, each page's pop-up and its little moments
    lib/scenes.js     the HTML of the doors, every page and the story header
    lib/engine.js     tap/hold/swipe navigation, Theatre playback, music, petals and confetti, countdown, share
    lib/score.js      the music and sound effects, synthesized with Web Audio
    app/globals.css   all styling (sizes in --k units so every phone fits; short screens get smaller pictures)
    app/fonts.css     self-hosted fonts (public/fonts), so builds never depend on Google Fonts

To retime anything, change the numbers in `lib/timeline.js`: `[time, value, ease]`.
Calendar buttons give iPhones a real .ics file and everyone else Google Calendar.

## 4. Publish

Push to GitHub: Vercel builds it (`vercel.json` pins the Next.js preset). Or `npm run build` and upload `out/`
anywhere. Put your live link in `siteUrl` in `lib/config.js` so WhatsApp shows the preview image.

## 5. Make the MP4

`?film=1` plays the whole story full-screen with no buttons (about 75 seconds). Screen-record it with sound on
your phone, or record it automatically (video only; add music in an editor or via `public/song.mp3`):

    npx playwright install chromium     # one time
    npm run build
    npm run record                      # video/film.webm, and video/film.mp4 if ffmpeg is installed
