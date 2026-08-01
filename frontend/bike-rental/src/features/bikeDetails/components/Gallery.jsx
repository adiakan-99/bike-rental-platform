// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BADGE_COLOR, VIEWS } from "../../../constants";
import { BikeImage } from "../../../ui";

export function Gallery({ bike }) {
  const [idx, setIdx] = useState(0);
  const move = (d) => setIdx((i) => (i + d + VIEWS.length) % VIEWS.length);
  return (
    <div>
      <div className="br-zoomwrap relative overflow-hidden rounded-2xl" style={{ border: "1px solid var(--line)" }}>
        <BikeImage bike={bike} className="br-zoom h-72 sm:h-96" />
        <span className="absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-bold text-white" style={{ background: BADGE_COLOR[bike.badge] }}>{bike.badge}</span>
        <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">{VIEWS[idx]} · hover to zoom</span>
        <button onClick={() => move(-1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white" aria-label="Previous image"><ChevronLeft size={20} /></button>
        <button onClick={() => move(1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white" aria-label="Next image"><ChevronRight size={20} /></button>
      </div>
      <div className="mt-3 flex gap-2.5">
        {VIEWS.map((v, i) => (
          <button key={v} onClick={() => setIdx(i)} className="relative overflow-hidden rounded-xl transition" style={{ border: i === idx ? "2px solid var(--brand)" : "1px solid var(--line)", flex: 1 }} aria-label={v}>
            <BikeImage bike={bike} className="h-16" />
            {i !== idx && <span className="absolute inset-0 bg-white/40" />}
          </button>
        ))}
      </div>
    </div>
  );
}
