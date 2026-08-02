// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function TL({ color, icon: Icon, title, badge, badgeColor, badgeBg, last, children }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white" style={{ background: color }}><Icon size={17} /></span>
        {!last && <span className="my-1 w-0.5 flex-1" style={{ background: "var(--line)" }} />}
      </div>
      <div className={last ? "pb-0" : "pb-5"}>
        <div className="flex flex-wrap items-center gap-2"><h4 className="br-display text-sm font-bold">{title}</h4><span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: badgeBg, color: badgeColor }}>{badge}</span></div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
