// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function SpecItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "#f8faf9" }}>
      <Icon size={17} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" />
      <div className="min-w-0"><p className="text-[11px]" style={{ color: "var(--mute)" }}>{label}</p><p className="truncate text-sm font-semibold">{value}</p></div>
    </div>
  );
}
