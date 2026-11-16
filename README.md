# Akarsh & Lavanya — a royal wedding invitation (Next.js + Theatre.js + Web Audio)

A mobile-first, scrolling wedding invitation website. Every illustration is drawn in code (`lib/art.js`),
no image files.

**What guests see, top to bottom:**
1. **The peacock door:** a blue mosaic palace door with a peacock-feather fan. "Tap to open the doors" swings
   the carved doors inward and the music begins.
2. **The palace at sunset:** golden bells swinging from a carved arch, the names in rose italic, and a painted
   golden palace with the couple walking up a flower path between peacocks.
3. **The invitation:** an arched ivory panel with a kalash, the Vakratunda shloka and the invitation.
4. **A date to remember:** three hearts guests scratch with a finger to reveal the day, month and year.
5. **Counting the moments:** a live countdown in four coloured jharokha arches.
6. **The royal festivities:** each celebration on a red-and-gold banner hanging from ropes, beside lanterns,
   with Add to calendar.
7. **The venue:** Green View Resort with Get Directions.
8. **Our hashtag** (tap to copy), then a lotus pond with an elephant, and Share.

Sections animate in (Theatre.js) as they scroll into view; blue peacock mandalas at the edges turn as you
scroll. The wedding song (`public/song.mp3`, see `music` in `lib/config.js`) plays when the doors open; until that
file exists, the original score (`lib/score.js`) plays instead. ♪ mutes it.

## 1. Run it

You need Node.js 18.18 or newer.

    npm install
    npm run dev          # http://localhost:3000
    npm run check        # self-check: timeline, every animated element exists, calendar times

## 2. Edit your details

Open `lib/config.js`: names, the shloka and invitation lines, the three celebrations, the wedding day for the
scratch hearts and countdown, venue, hashtag, and the song (`music`).

**Personal invites:** add `?to=` to the link, e.g. `…/?to=Sharma%20Family`. The doors greet them with
"Dear Sharma Family," and the end says "We can't wait to celebrate with you, Sharma Family."

## 3. How it's built

    lib/art.js        the illustrations: peacock door, palace at sunset, bells, kalash, lanterns, peacock mandala, venue gate, elephant in a lotus pond
    lib/timeline.js   Theatre.js choreography: the doors, the hero, each section's entrance, sound cues
    lib/scenes.js     the HTML of the doors and every section
    lib/engine.js     doors, section entrances on scroll, scratch hearts, countdown, hashtag, share, music
    lib/score.js      the music and sound effects, synthesized with Web Audio
    app/globals.css   all styling (sizes in cqw: 1% of the page width)
    app/fonts.css     self-hosted fonts (public/fonts), so builds never depend on Google Fonts

## 4. Publish

Push to GitHub: Vercel builds it (`vercel.json` pins the Next.js preset). Or `npm run build` and upload `out/`
anywhere. Put your live link in `siteUrl` in `lib/config.js` so WhatsApp shows the preview image.

## 5. Make the MP4

`?film=1` opens the doors by itself and glides down the whole page (about a minute). Screen-record it with
sound on your phone, or record it automatically (video only):

    npx playwright install chromium     # one time
    npm run build
    npm run record                      # video/film.webm, and video/film.mp4 if ffmpeg is installed
