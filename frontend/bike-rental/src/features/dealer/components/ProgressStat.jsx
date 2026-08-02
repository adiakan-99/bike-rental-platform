// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function ProgressStat({ label, pct, display, color = "linear-gradient(90deg,var(--brand),var(--brand-2))" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span style={{ color: "var(--mute)" }}>{label}</span><span className="br-display font-bold">{display ?? `${pct}%`}</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: "var(--form-bg)" }}><div className="h-full rounded-full" style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: color }} /></div>
    </div>
  );
}
