# Akarsh & Lavanya — "One Thread" (Next.js + Theatre.js + Web Audio)

A cinematic, mobile-first wedding invitation that plays like a short film with its own music.

**The idea: one thread of light does every job.** It slams in from deep space on the first beat and ties a
heart-knot between the two names, becomes a heart-shaped constellation, blooms into the Haldi marigold, loops
into two locked rings, turns into the live sound wave of the Sangeet, circles the sacred fire seven times for the
pheras (a bell and a diya for every round), draws the road to the venue, and ties the knot again at the end.
Every scene hands the same line to the next, drawn by one function (`drawThread` in `lib/thread.js`).

**The look:** a near-black stage with a warm glow that breathes and changes colour per chapter, film grain,
a vignette, bokeh, a camera that never stops drifting and pushes in through every hand-over.

**The sound:** an original score composed in code (`lib/score.js`), 100 BPM in F major: santoor plucks, tanpura
drone, a shehnai melody, dholak, claps, ghungroo and temple bells. Each chapter has its own section, changes land
on the downbeat, and every move has a sound (the slam, whooshes, the rings' clink, the fire, the pin drop).
Music starts when the guest taps the light (phones only allow sound after a tap); the ♪ button mutes it.

Guests tap once and the story plays by itself, scene by scene on the beat. They can swipe up/down any time,
pause with the ❚❚ button, and it ends on the card with the countdown, share and RSVP.

## 1. Run it

You need Node.js 18.18 or newer.

    npm install
    npm run dev          # http://localhost:3000
    npm run check        # self-check: timeline, thread shapes, calendar times

## 2. Edit your details

Open `lib/config.js`: names, story lines, the three events, calendar times, venue, countdown moment,
WhatsApp RSVP number (the RSVP button stays hidden until you add one), and `music.src` if you want your
own licensed song instead of the original score (put the file in `public/`).

**Personal invites:** add `?to=` to the link, e.g. `…/?to=Sharma%20Family`. The invitation opens with
"Dear Sharma Family," and ends with "We can't wait to celebrate with you, Sharma Family."

## 3. How it's built

    lib/timeline.js   Theatre.js choreography: the "world" sheet (scrubbed by swiping: glow colours, camera push,
                      scene layers, particles), the slam intro, every scene's entrance and light pulse, sound cues
    lib/thread.js     the thread's shapes, the morph between scenes, the one drawing function, particles
    lib/score.js      the music and sound effects, synthesized with Web Audio (no samples, no recordings)
    lib/scenes.js     the HTML of the gate, every scene (art layer + text layer) and the HUD
    lib/engine.js     direction: Theatre playback, camera, autoplay on the beat, swipe, countdown, share, calendar
    app/globals.css   all styling (sizes in --k units so every phone fits)
    app/fonts.css     self-hosted fonts (public/fonts), so builds never depend on Google Fonts

To retime anything, change the numbers in `lib/timeline.js`: `[time, value, ease]`.
Calendar buttons give iPhones a real .ics file and everyone else Google Calendar.

## 4. Publish

Push to GitHub: Vercel builds it (`vercel.json` pins the Next.js preset). Or `npm run build` and upload `out/`
anywhere. Put your live link in `siteUrl` in `lib/config.js` so WhatsApp shows the preview image.

## 5. Make the MP4

`?film=1` plays the whole story full-screen with no buttons (about a minute). Screen-record it with sound on
your phone, or record it automatically (video only; add music in an editor or via `public/song.mp3`):

    npx playwright install chromium     # one time
    npm run build
    npm run record                      # video/film.webm, and video/film.mp4 if ffmpeg is installed
