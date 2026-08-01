// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { Star } from "lucide-react";

export function StarInput({ value, onChange, size = 26 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const on = (hover || value) >= i;
        return <button key={i} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => onChange(i)} className="transition-transform hover:scale-110" aria-label={`${i} star`}><Star size={size} fill={on ? "#f5a623" : "none"} color={on ? "#f5a623" : "#cbd5e1"} strokeWidth={1.5} /></button>;
      })}
    </div>
  );
}
