// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export const RX = { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, phone: /^[6-9]\d{9}$/, aadhaar: /^\d{12}$/, dl: /^[A-Z]{2}\d{2}(?:19|20)\d{2}\d{7}$/ };

export function pwScore(pw) { if (!pw) return 0; let s = 0; if (pw.length >= 8) s++; if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++; if (pw.length >= 12) s++; return Math.min(s, 4); }
