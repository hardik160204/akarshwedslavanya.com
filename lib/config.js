/* =====================================================================
   EDIT THIS FILE ONLY.
   Every word, date and link on the invitation comes from here.
   Replace all placeholders, save, and the page updates (npm run dev).
   ===================================================================== */
export const CONFIG = {
  // Your live website address once deployed, e.g. "https://akarsh-lavanya.netlify.app"
  // (needed so the WhatsApp/Instagram link preview shows the image). Leave "" while testing.
  siteUrl: "",

  title: "Akarsh & Lavanya — Wedding Invitation",
  shareText: "You're invited to Akarsh & Lavanya's wedding, 10 December 2026.",

  names: [
    { en: "Akarsh", hi: "आकर्ष" },
    { en: "Lavanya", hi: "लावण्या" }
  ],
  kicker: "Together with their families",
  tagline: "Two names. One thread.",
  inviteHi: "आप सादर आमंत्रित हैं",
  // Put *stars* around the word that gets the thread underline.
  inviteEn: "With the blessings of our families, we joyfully invite *you* to celebrate the beginning of our forever.",
  families: "The Sharma and Verma families",

  // world must be one of: haldi | mehendi | sangeet | wedding
  // Add, remove or reorder events freely.
  events: [
    { world: "haldi",   hi: "हल्दी",  en: "Haldi",       day: "Friday, 12 February",   time: "11:00 AM", place: "The Garden Palace",   note: "Come dressed in your yellows." },
    { world: "mehendi", hi: "मेहंदी", en: "Mehendi",     day: "Friday, 12 February",   time: "4:00 PM",  place: "The Garden Palace",   note: "Henna, chai and old stories." },
    { world: "sangeet", hi: "संगीत",  en: "Sangeet",     day: "Saturday, 13 February", time: "7:30 PM",  place: "The Grand Courtyard", note: "Bring your dancing shoes." },
    { world: "wedding", hi: "विवाह",  en: "The Wedding", day: "Sunday, 14 February",   time: "7:00 PM",  place: "The Garden Palace",   note: "Muhurat and pheras at sundown." }
  ],

  // iso = the wedding moment (local time) for the live countdown
  date:  { day: "14", month: "February 2027", weekday: "Sunday", iso: "2027-02-14T19:00:00" },
  venue: { name: "The Garden Palace", address: "12 Rose Avenue, Your City", mapsQuery: "The Garden Palace, Your City" },
  // Google Calendar button (format YYYYMMDDTHHMMSS)
  calendar: { title: "Akarsh & Lavanya's Wedding", start: "20270214T190000", end: "20270214T233000" },
  // WhatsApp number with country code, digits only (e.g. 919876543210)
  rsvp: { whatsapp: "910000000000", by: "Please reply by 1 January 2027", message: "Hello! I'll be there for Akarsh & Lavanya's wedding." },

  closingHi: "आपकी प्रतीक्षा में",
  closingEn: "We can't wait to celebrate with you."
};