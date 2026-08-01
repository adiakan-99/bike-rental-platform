// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { InfoTip } from "./InfoTip.jsx";

export function Sum({ label, value, color, tip }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1" style={{ color: "var(--mute)" }}>{label}{tip && <InfoTip text={tip} />}</span>
      <span className="font-semibold" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}
