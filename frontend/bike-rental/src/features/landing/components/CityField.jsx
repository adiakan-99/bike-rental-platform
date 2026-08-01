// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { CITIES } from "../../../constants";

export function CityField({ value, onChange, solid }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(""); const boxRef = useRef(null);
  useEffect(() => { const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", onDoc); return () => document.removeEventListener("mousedown", onDoc); }, []);
  const results = useMemo(() => CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div ref={boxRef} className="relative">
      <label className={`mb-1.5 flex items-center gap-1.5 ${solid ? "text-[11px] font-medium" : "text-xs font-semibold"}`} style={{ color: "var(--mute)" }}><MapPin size={14} style={{ color: "var(--brand)" }} /> City</label>
      <button type="button" onClick={() => setOpen((v) => !v)} className={`br-field ${solid ? "br-field-solid" : ""} flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left`}>
        <span className="text-sm font-medium" style={{ color: value ? "var(--ink)" : "#93a2a8" }}>{value || "Select City"}</span>
        <ChevronDown size={16} style={{ color: "var(--mute)", transform: open ? "rotate(180deg)" : "none", transition: "transform .18s ease" }} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-2xl" style={{ border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: "1px solid var(--line)" }}><Search size={15} style={{ color: "var(--mute)" }} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city" className="br-input w-full text-sm" /></div>
          <ul className="max-h-56 overflow-auto py-1">
            {results.length === 0 && <li className="px-3.5 py-3 text-sm" style={{ color: "var(--mute)" }}>No cities match “{query}”.</li>}
            {results.map((c) => <li key={c}><button type="button" onClick={() => { onChange(c); setOpen(false); setQuery(""); }} className="br-option flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm font-medium">{c}{value === c && <Check size={16} style={{ color: "var(--brand)" }} />}</button></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
