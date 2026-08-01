// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Star } from "lucide-react";

export function Stars({ value, size = 15 }) {
  return <span className="inline-flex">{[0,1,2,3,4].map((i) => <Star key={i} size={size} fill={i < Math.round(value) ? "#f5a623" : "#e2e8e6"} strokeWidth={0} />)}</span>;
}
