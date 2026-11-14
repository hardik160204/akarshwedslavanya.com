# Akarsh & Lavanya — "A Love Story in Three Chapters" (Next.js + Theatre.js)

A mobile-first animated wedding invitation, told as a story:

1. **The envelope**: tap the wax seal; the flap opens, the card rises and flies toward you.
2. **Cover**: a gold jharokha arch draws itself; the names are written in gold among swaying lavender.
3. **Prologue**: two lights cross the night sky, meet, and a heart draws itself around them.
4. **Chapter I, The Radiance Rituals** (Haldi): the sun rises over lavender and turmeric.
5. **Chapter II, Ring Ceremony & Sparkling Sangeet Night**: two rings lock in a burst of light; party lights and beats.
6. **Chapter III, Mangal Vivah**: the mandap draws itself, the sacred fire is lit, seven diyas mark the pheras.
7. **The venue**: a route draws across the map and the pin drops on Green View Resort.
8. **Finale**: live countdown to the pheras, fireworks, share/RSVP.

Each swipe moves one scene. The sky scrubs with your finger (night → sunrise → party night → sacred red),
and each scene plays its own Theatre.js entrance when it arrives. "▶" at the top autoplays the story.

## 1. Run it

You need Node.js 18.18 or newer.

    npm install
    npm run dev          # http://localhost:3000
    npm run check        # self-check: the animation timeline loads into Theatre.js correctly

## 2. Edit your details

Open `lib/config.js`, the only file you need to edit: names, story lines, the three events,
calendar times, venue, countdown moment, and the WhatsApp RSVP number. The RSVP button stays hidden
until you add a number.

## 3. The animation (Theatre.js)

`lib/timeline.js` holds the whole choreography as Theatre.js keyframes: one sheet per scene, plus a
"world" sheet that is scrubbed by swiping. `buildState()` turns it into the same project state Theatre's
Studio exports, and `lib/engine.js` binds every element marked `data-t="sheet.object"` to its object.
To retime something, change the numbers there: `[time, value, ease]`.

## 4. Publish

    npm run build        # creates the `out/` folder (a normal static website)

Upload `out/` to Netlify Drop (https://app.netlify.com/drop), Vercel, Cloudflare Pages or GitHub Pages.
Then put your live link in `siteUrl` in `lib/config.js` and build again, so WhatsApp shows the preview
image (`public/og.png`).

## 5. Make the MP4

Add `?film=1` to the link: the whole story plays by itself, full-screen with no buttons (about 67 s).
Screen-record it on your phone, or run it automatically:

    npx playwright install chromium     # one time
    npm run build
    npm run record                      # video/film.webm, and video/film.mp4 if ffmpeg is installed

To add music to the video, put your licensed song at `public/song.mp3` before `npm run record`.

## Folder map

    lib/config.js         <-- YOUR DETAILS (edit this)
    lib/timeline.js       Theatre.js choreography (keyframes for every scene)
    lib/scenes.js         builds every scene's HTML and artwork (SVG) from your details
    lib/engine.js         Theatre.js playback, swipe scrubbing, particles, autoplay, countdown, share
    components/Invitation.jsx   page shell (scroller + sticky stage)
    app/globals.css       all styling (sizes in --k units so every phone fits)
    app/layout.js         fonts, page title, link-preview tags
    public/og.png         link-preview image
    scripts/check-timeline.mjs  self-check for the timeline
    scripts/record.mjs    automatic MP4 recorder
