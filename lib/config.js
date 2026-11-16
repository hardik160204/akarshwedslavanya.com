/* =====================================================================
   EDIT THIS FILE ONLY.
   Every word, date and link on the invitation comes from here.
   Save the file and the page updates (npm run dev).
   ===================================================================== */
export const CONFIG = {
  // Your live website address once deployed, e.g. "https://akarsh-lavanya.netlify.app"
  // (needed so the WhatsApp link preview shows the image). Leave "" while testing.
  siteUrl: "",

  title: "Akarsh & Lavanya — Wedding Invitation",
  shareText: "You're invited to Akarsh & Lavanya's wedding · 9 & 10 December 2026 · Green View Resort, Aligarh",

  names: [
    { en: "Akarsh", hi: "आकर्ष" },
    { en: "Lavanya", hi: "लावण्या" }
  ],
  blessing: "॥ श्री गणेशाय नमः ॥",
  shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
  kicker: "Together with their families",
  dates: "9 & 10 December 2026",
  city: "Aligarh",
  gateLine: "You are cordially invited to a royal celebration of love",
  inviteLine: "With joy and the blessings of our elders, we invite you to celebrate the wedding of",
  dateLine: "Mark your calendars — our forever begins on this joyous day, and we would be honoured to have you by our side.",
  hashtag: "#AkarshWedsLavanya",
  // Personal invites: add ?to=Sharma%20Family to the link and the invitation greets them by name.

  // The song that plays when the guest opens the doors (public/song.mp3), starting `start` seconds in.
  // If the file is missing, the original score (composed in code) plays instead.
  music: { src: "/song.mp3", start: 36, title: "Ek Dafaa · Arjun Kanungo" },

  // Exactly three celebrations, in this order. short = the name on the RSVP form.
  // calTitle + cal = the calendar entry; cal is start/end in Indian time, format YYYYMMDDTHHMMSS.
  events: [
    {
      chapter: "Chapter I", emoji: "🌸", short: "Haldi",
      date: "Wednesday, 9 December",
      title: "The Radiance Rituals",
      sub: "Haldi Hues in the Shades of Lavender",
      time: "11 AM",
      note: "Come dressed in shades of lavender",
      calTitle: "Haldi · The Radiance Rituals",
      cal: ["20261209T110000", "20261209T150000"]
    },
    {
      chapter: "Chapter II", emoji: "💍✨", short: "Ring & Sangeet",
      date: "Wednesday, 9 December",
      title: "Ring Ceremony & Sparkling Sangeet Night",
      sub: "With the Beats of Dance",
      time: "7 PM",
      note: "Bring your best dance moves",
      calTitle: "Ring Ceremony & Sparkling Sangeet Night",
      cal: ["20261209T190000", "20261209T235900"]
    },
    {
      chapter: "Chapter III", emoji: "❤️", short: "Mangal Vivah",
      date: "Thursday, 10 December",
      title: "Mangal Vivah",
      hi: "मंगल विवाह",
      sub: "Seven sacred rounds, seven promises, one forever",
      time: "8 PM onwards",
      calTitle: "Mangal Vivah",
      cal: ["20261210T200000", "20261211T030000"]
    }
  ],

  // The wedding day: shown on the scratch hearts, and the live countdown runs to this moment (India time).
  weddingDay: { day: "10", month: "Dec", year: "2026", weekday: "Thursday" },
  weddingIso: "2026-12-10T20:00:00+05:30",

  venue: {
    name: "Green View Resort",
    address: "Agra Road, Aligarh",
    line: "Where all three celebrations unfold",
    mapsQuery: "Green View Resort, Agra Road, Aligarh"
  },

  closingHi: "आपकी प्रतीक्षा में",
  closingEn: "We look forward to welcoming you",
  signoff: "With love & warm regards"
};
