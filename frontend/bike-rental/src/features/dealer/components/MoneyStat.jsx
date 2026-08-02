// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function MoneyStat({ value, label, tone }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: "var(--form-bg)" }}>
      <p className="br-display text-lg font-bold" style={{ color: tone || "var(--ink)" }}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium" style={{ color: "var(--mute)" }}>{label}</p>
    </div>
  );
}
