// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { RENTAL_CHIP } from "../../../constants";

export function SoftStatus({ status }) {
  const c = RENTAL_CHIP[status] || RENTAL_CHIP.Completed;
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: c.bg, color: c.fg }}><span aria-hidden>{c.emoji}</span> {status}</span>;
}
