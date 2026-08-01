// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { RENTAL_STATUS } from "../../../constants";

export function StatusPill({ status }) {
  const c = RENTAL_STATUS[status] || RENTAL_STATUS.Completed;
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: c.bg, color: c.fg }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: c.dot }} /> {status}</span>;
}
