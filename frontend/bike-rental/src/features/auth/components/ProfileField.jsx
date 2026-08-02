// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  options,
  disabled,
  readOnly,
  hint,
  icon: Icon,
  maxLength,
  numeric,
}) {
  // Enforce limits: numeric fields keep digits only and hard-cap length; text caps length.
  const handle = (raw) => {
    let next = raw;
    if (numeric) next = next.replace(/\D/g, "");
    if (maxLength) next = next.slice(0, maxLength);
    onChange(next);
  };
  // Display mode: render the saved value as static text (no input) until the user edits.
  if (readOnly) {
    const empty = value === "" || value == null;
    return (
      <div>
        <p
          className="br-display mb-1 text-xs font-semibold"
          style={{ color: "#334155" }}
        >
          {label}
        </p>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: "var(--form-bg)" }}
        >
          {Icon && (
            <Icon
              size={15}
              style={{ color: "var(--brand)" }}
              className="shrink-0"
            />
          )}
          <span
            className="text-sm"
            style={empty ? { color: "var(--mute)" } : undefined}
          >
            {empty ? "—" : value}
          </span>
        </div>
        {hint && (
          <p className="mt-1 text-[11px]" style={{ color: "var(--mute)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
  return (
    <div>
      <p
        className="br-display mb-1 text-xs font-semibold"
        style={{ color: "#334155" }}
      >
        {label}
      </p>
      <div
        className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={
          disabled
            ? { background: "#eef2f5", opacity: 0.8 }
            : { background: "#fff" }
        }
      >
        {Icon && (
          <Icon
            size={15}
            style={{ color: "var(--brand)" }}
            className="shrink-0"
          />
        )}
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="br-input w-full bg-transparent text-sm"
          >
            {value === "" && <option value="">Select…</option>}
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handle(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            inputMode={numeric ? "numeric" : undefined}
            className="br-input w-full text-sm"
          />
        )}
      </div>
      {hint && (
        <p className="mt-1 text-[11px]" style={{ color: "var(--mute)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
