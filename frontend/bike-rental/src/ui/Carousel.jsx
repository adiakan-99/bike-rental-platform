// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({ title, children }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="br-display text-lg font-bold">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scroll(-1)} className="grid h-9 w-9 place-items-center rounded-full br-ghost" aria-label="Scroll left"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll(1)} className="grid h-9 w-9 place-items-center rounded-full br-ghost" aria-label="Scroll right"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div ref={ref} className="br-scroll flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>{children}</div>
    </section>
  );
}
