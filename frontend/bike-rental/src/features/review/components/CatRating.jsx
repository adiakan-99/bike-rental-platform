// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { StarInput } from "./StarInput.jsx";

export function CatRating({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}>
      <span className="text-sm font-medium" style={{ color: "#3a4d55" }}>{label}</span>
      <StarInput value={value} onChange={onChange} size={18} />
    </div>
  );
}
