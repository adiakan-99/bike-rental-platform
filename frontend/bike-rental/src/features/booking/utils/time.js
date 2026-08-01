// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function timeAgo(d) {
  if (!d) return "";
  const mins = Math.max(0, Math.round((Date.now() - d.getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}
