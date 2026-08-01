// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { InfoTip } from "./InfoTip.jsx";

export function Label({ children, required, tooltip }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>
      {children}{required ? <span style={{ color: "#dc2626" }}>*</span> : <span className="font-normal" style={{ color: "#9aa7ac" }}>(optional)</span>}
      {tooltip && <InfoTip text={tooltip} />}
    </label>
  );
}
