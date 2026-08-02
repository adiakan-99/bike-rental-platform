// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Search, X } from "lucide-react";

export function AdminToolbar({ q, setQ, placeholder, selects, count, total, onClear }) {
  const dirty = q || selects.some((sel) => sel.value !== "All");
  return (
    <div className="br-card mb-4 rounded-2xl p-4 shadow-sm">
      <div className="br-field flex items-center gap-2 rounded-xl px-3.5 py-2.5">
        <Search size={16} style={{ color: "var(--brand)" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="br-input w-full text-sm" />
        {q && <button onClick={() => setQ("")} aria-label="Clear search"><X size={15} style={{ color: "var(--mute)" }} /></button>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {selects.map((sel) => (
          <div key={sel.label}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>{sel.label}</label>
            <div className="br-field rounded-xl px-3 py-2.5">
              <select value={sel.value} onChange={(e) => sel.onChange(e.target.value)} className="br-input w-full text-sm">
                {sel.options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--mute)" }}>Showing <span className="font-semibold" style={{ color: "var(--ink)" }}>{count}</span> of {total}</p>
        {dirty && <button onClick={onClear} className="br-display text-xs font-semibold" style={{ color: "var(--brand-strong)" }}>Clear filters</button>}
      </div>
    </div>
  );
}
