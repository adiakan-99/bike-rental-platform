// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function ProfileField({ label, value, onChange, type = "text", placeholder, options, disabled, hint, icon: Icon }) {
  return (
    <div>
      <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>{label}</p>
      <div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={disabled ? { background: "#eef2f5", opacity: 0.8 } : { background: "#fff" }}>
        {Icon && <Icon size={15} style={{ color: "var(--brand)" }} className="shrink-0" />}
        {options ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="br-input w-full bg-transparent text-sm">
            {value === "" && <option value="">Select…</option>}
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} className="br-input w-full text-sm" />
        )}
      </div>
      {hint && <p className="mt-1 text-[11px]" style={{ color: "var(--mute)" }}>{hint}</p>}
    </div>
  );
}
