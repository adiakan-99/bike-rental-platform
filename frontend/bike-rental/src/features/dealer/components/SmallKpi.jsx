// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function SmallKpi({ icon, label, value, sub, subTone }) {
  return (
    <div className="br-card rounded-2xl p-3.5 shadow-sm">
      <p className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--mute)" }}><span aria-hidden>{icon}</span> {label}</p>
      <p className="br-display mt-1 text-xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-[11px]" style={{ color: subTone || "var(--mute)" }}>{sub}</p>}
    </div>
  );
}
