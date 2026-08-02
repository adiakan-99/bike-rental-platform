// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CollapsibleCard({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="br-card rounded-2xl px-4 py-3.5 shadow-sm">
      <button className="br-collapse-h flex w-full items-center justify-between" onClick={() => setOpen((v) => !v)}><span className="br-display text-sm font-bold">{title}</span><ChevronDown size={16} style={{ color: "var(--mute)", transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease" }} /></button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  );
}
