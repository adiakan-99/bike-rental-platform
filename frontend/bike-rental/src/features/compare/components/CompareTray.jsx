// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { X } from "lucide-react";
import { COMPARE_MAX } from "../../../config";
import { BikeImage } from "../../../ui";

export function CompareTray({ bikes, onRemove, onClear, onOpen }) {
  if (bikes.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white" style={{ zIndex: 55, borderTop: "1px solid var(--line)", boxShadow: "0 -8px 24px -14px rgba(15,39,51,.45)" }}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto br-scroll">
          <span className="br-display shrink-0 text-xs font-bold" style={{ color: "var(--mute)" }}>Comparing {bikes.length}/{COMPARE_MAX}</span>
          {bikes.map((b) => (
            <div key={b.id} className="relative shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid var(--line)" }}>
              <BikeImage bike={b} className="h-12 w-16" />
              <button onClick={() => onRemove(b.id)} aria-label={`Remove ${b.name}`} className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-black/55 text-white"><X size={10} /></button>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={onClear} className="br-ghost br-display rounded-xl px-4 py-2.5 text-sm font-semibold">Clear</button>
          <button onClick={onOpen} disabled={bikes.length < 2} className="br-btn br-display rounded-xl px-6 py-2.5 text-sm font-semibold" style={bikes.length < 2 ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>
            {bikes.length < 2 ? "Add 1 more to compare" : `Compare ${bikes.length} bikes`}
          </button>
        </div>
      </div>
    </div>
  );
}
