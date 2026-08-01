// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Info } from "lucide-react";

export function InfoTip({ text }) {
  return (
    <span className="relative inline-flex align-middle group">
      <Info size={13} style={{ color: "var(--mute)" }} className="cursor-help" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-52 -translate-x-1/2 rounded-lg px-3 py-2 text-[11px] leading-snug text-white shadow-lg group-hover:block" style={{ background: "var(--ink)" }}>{text}</span>
    </span>
  );
}
