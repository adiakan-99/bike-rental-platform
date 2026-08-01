// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function FleetBadge({ dot, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}>
      <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#334155" }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} /> {label}</span>
      <span className="br-display text-base font-bold">{value}</span>
    </div>
  );
}
