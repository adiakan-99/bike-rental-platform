// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export function OverflowMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", d); return () => document.removeEventListener("mousedown", d); }, []);
  if (!items.length) return null;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="More actions" className="br-display grid h-9 w-9 place-items-center rounded-xl" style={{ border: "1px solid var(--line)", background: "#fff", color: "#334155" }}><MoreHorizontal size={16} /></button>
      {open && (
        <div className="absolute right-0 bottom-full z-30 mb-2 w-48 overflow-hidden rounded-xl bg-white shadow-2xl" style={{ border: "1px solid var(--line)" }}>
          {items.map((it, i) => (
            <button key={i} onClick={() => { setOpen(false); it.onClick?.(); }} className="br-option flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium" style={{ color: it.danger ? "#dc2626" : "#334155" }}><it.icon size={15} style={{ color: it.danger ? "#dc2626" : "var(--brand)" }} /> {it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
