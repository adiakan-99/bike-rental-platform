// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="br-card overflow-hidden rounded-xl">
      <button onClick={() => setOpen((v) => !v)} className="br-collapse-h flex w-full items-center justify-between px-4 py-3 text-left"><span className="text-sm font-semibold">{q}</span><ChevronDown size={16} style={{ color: "var(--mute)", transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease" }} /></button>
      {open && <p className="px-4 pb-3.5 text-sm leading-relaxed" style={{ color: "#3a4d55" }}>{a}</p>}
    </div>
  );
}
