// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function AdminSection({ title, icon: Icon, children }) {
  return (
    <div className="br-card rounded-2xl p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2"><Icon size={17} style={{ color: "var(--brand)" }} /><h3 className="br-display text-sm font-bold">{title}</h3></div>
      {children}
    </div>
  );
}
