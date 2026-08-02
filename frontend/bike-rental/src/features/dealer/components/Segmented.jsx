// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl p-1" style={{ background: "var(--form-bg)" }}>
      {options.map((o) => (
        <button key={o.k} onClick={() => onChange(o.k)} className="br-display rounded-lg px-3 py-1.5 text-xs font-bold transition"
          style={value === o.k ? { background: "#fff", color: "var(--brand-strong)", boxShadow: "0 1px 3px rgba(15,39,51,.12)" } : { color: "var(--mute)" }}>{o.short}</button>
      ))}
    </div>
  );
}
