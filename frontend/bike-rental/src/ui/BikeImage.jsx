// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Bike } from "lucide-react";
import { CAT_GRADIENT } from "../constants";

export function BikeImage({ bike, className = "" }) {
  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${className}`} style={{ background: CAT_GRADIENT[bike.cat] || CAT_GRADIENT.Commuter }}>
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(120% 90% at 20% 15%, #fff, transparent 55%)" }} />
      <Bike className="mb-2 text-white/85" style={{ width: "45%", height: "45%" }} strokeWidth={1.1} />
    </div>
  );
}
