// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Search } from "lucide-react";

export function EmptyList({ label }) {
  return (
    <div className="br-card grid place-items-center rounded-2xl py-14 text-center">
      <Search size={26} style={{ color: "var(--mute)" }} />
      <p className="br-display mt-2 text-sm font-bold">{label}</p>
      <p className="text-xs" style={{ color: "var(--mute)" }}>Try clearing the search or changing filters.</p>
    </div>
  );
}
