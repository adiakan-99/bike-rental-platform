// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function RentalProgress({ r }) {
  const start = new Date(`${r.sd}T${r.st || "00:00"}`).getTime();
  const end = new Date(`${r.ed}T${r.et || "00:00"}`).getTime();
  const now = Date.now();
  const pct = end <= start ? 100 : Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  const hrsLeft = Math.max(0, Math.round((end - now) / 3.6e6));
  const remain = hrsLeft >= 24 ? `${Math.floor(hrsLeft / 24)}d ${hrsLeft % 24}h left` : `${hrsLeft} hrs left`;
  return (
    <div className="mt-2 rounded-xl p-2.5" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
      <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: "#c2410c" }}><span>⏳ {remain}</span><span>{Math.round(pct)}%</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: "#ffedd5" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#f97316,#ea580c)" }} /></div>
    </div>
  );
}
