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
  kicker: "With the blessings of our families",
  dates: "9 & 10 December 2026",
  city: "Aligarh",
  envelopeLine: "A love story awaits you inside",

  // The prologue. Put *stars* around a word to make it glow.
  story: [
    "Some stories are written in the stars…",
    "ours found its way through two families, countless blessings and one beautiful *yes*.",
    "Now, as two hearts become one, we invite you into the three most cherished chapters of our forever."
  ],

  // Exactly three chapters, in this order (each has its own artwork: haldi, ring & sangeet, vivah).
  // calTitle + cal = the Google Calendar entry; cal is start/end in Indian time, format YYYYMMDDTHHMMSS.
  events: [
    {
      chapter: "Chapter I", emoji: "🌸", hi: "हल्दी",
      date: "Wednesday, 9 December",
      title: "The Radiance Rituals",
      sub: "Haldi Hues in the Shades of Lavender",
      time: "11 AM",
      note: "Come dressed in shades of lavender",
      calTitle: "Haldi · The Radiance Rituals",
      cal: ["20261209T110000", "20261209T150000"]
    },
    {
      chapter: "Chapter II", emoji: "💍✨", hi: "संगीत",
      date: "Wednesday, 9 December",
      title: "Ring Ceremony",
      title2: "Sparkling Sangeet Night",
      sub: "With the Beats of Dance",
      time: "7 PM",
      note: "Bring your best dance moves",
      calTitle: "Ring Ceremony & Sparkling Sangeet Night",
      cal: ["20261209T190000", "20261209T235900"]
    },
    {
      chapter: "Chapter III", emoji: "❤️", hi: "विवाह",
      date: "Thursday, 10 December",
      title: "मंगल विवाह",
      title2: "Mangal Vivah",
      time: "8 PM onwards",
      note: "Seven sacred rounds, seven promises, one forever.",
      calTitle: "Mangal Vivah",
      cal: ["20261210T200000", "20261211T030000"]
    }
  ],

  // The wedding moment, with India's time zone, for the live countdown.
  weddingIso: "2026-12-10T20:00:00+05:30",

  venue: {
    name: "Green View Resort",
    address: "Agra Road, Aligarh",
    line: "Where all three chapters unfold",
    mapsQuery: "Green View Resort, Agra Road, Aligarh"
  },

  // WhatsApp number with country code, digits only (e.g. 919876543210).
  // Leave "" to hide the RSVP button.
  rsvp: { whatsapp: "", message: "Hello! We'll be there to bless Akarsh & Lavanya." },

  closingHi: "आपकी प्रतीक्षा में",
  closingEn: "Your presence is the blessing we will cherish forever.",
  signoff: "With love & warm regards"
};
