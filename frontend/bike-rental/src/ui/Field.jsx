// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { AlertCircle } from "lucide-react";
import { Label } from "./Label.jsx";

export function Field({ icon: Icon, label, required, tooltip, error, show, children }) {
  return (
    <div>
      <Label required={required} tooltip={tooltip}>{label}</Label>
      <div className="br-field flex items-center gap-2 rounded-xl px-3.5 py-3" style={show ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined}>
        {Icon && <Icon size={16} style={{ color: show ? "#dc2626" : "var(--brand)" }} className="shrink-0" />}
        {children}
      </div>
      {show && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {error}</p>}
    </div>
  );
}
