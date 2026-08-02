// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function StatKpi({ icon, label, value, sub, subTone, color, active, onClick }) {
  return (
    <button onClick={onClick} className="br-card rounded-2xl p-3.5 text-left shadow-sm transition hover:-translate-y-0.5" style={active ? { borderColor: color, boxShadow: `0 0 0 2px ${color}22` } : undefined}>
      <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--mute)" }}><span aria-hidden>{icon}</span> {label}</p>
      <p className="br-display mt-1 text-2xl font-bold leading-none" style={{ color: color || "var(--ink)" }}>{value}</p>
      {sub && <p className="mt-1 text-[11px] font-medium" style={{ color: subTone || "var(--mute)" }}>{sub}</p>}
    </button>
  );
}
