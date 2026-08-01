// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function DealerStat({ label, value, icon: Icon }) {
  return (
    <div className="br-card rounded-2xl p-4 text-center shadow-sm">
      {Icon && <Icon size={18} style={{ color: "var(--brand)" }} className="mx-auto mb-1" />}
      <p className="br-display text-xl font-bold" style={{ color: "var(--brand-strong)" }}>{value}</p>
      <p className="mt-0.5 text-xs" style={{ color: "var(--mute)" }}>{label}</p>
    </div>
  );
}
