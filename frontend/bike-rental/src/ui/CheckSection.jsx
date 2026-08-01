// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function CheckSection({ title, icon: Icon, children, right }) {
  return (
    <section className="br-card rounded-2xl p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="br-display flex items-center gap-2 text-base font-bold"><Icon size={18} style={{ color: "var(--brand)" }} /> {title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
