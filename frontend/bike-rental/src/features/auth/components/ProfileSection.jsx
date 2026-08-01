// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function ProfileSection({ title, icon: Icon, subtitle, children }) {
  return (
    <div className="br-card rounded-2xl p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        {Icon && <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><Icon size={17} style={{ color: "var(--brand)" }} /></span>}
        <div><h2 className="br-display text-base font-bold">{title}</h2>{subtitle && <p className="text-xs" style={{ color: "var(--mute)" }}>{subtitle}</p>}</div>
      </div>
      {children}
    </div>
  );
}
