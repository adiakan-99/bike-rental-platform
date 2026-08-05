// REWRITTEN. The original cycled through a fixed VIEWS list
// ("Front", "Left profile", "Rear"…) and rendered the SAME placeholder gradient
// for all five thumbnails — the arrows changed a caption and nothing else.
//
// Real listings carry an ordered image array (BikeImageResponseDto sorted by
// displayOrder). This now pages through the actual photos, and adapts to however
// many the partner uploaded: one photo means no arrows and no thumbnail strip.
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BADGE_COLOR } from "../../../constants";
import { BikeImage } from "../../../ui";

export function Gallery({ bike }) {
  const images = bike?.images?.length ? bike.images : [];
  const count = images.length;
  const [idx, setIdx] = useState(0);

  // Guard against a stale index when navigating from a 5-photo bike to a 2-photo one.
  useEffect(() => { setIdx(0); }, [bike?.id]);

  const move = (d) => setIdx((i) => (i + d + count) % count);

  // BikeImage already handles the no-photo case with its gradient fallback,
  // so we hand it a shaped object rather than branching here.
  const current = count ? { ...bike, image: images[idx] } : bike;

  return (
    <div>
      <div className="br-zoomwrap relative overflow-hidden rounded-2xl" style={{ border: "1px solid var(--line)" }}>
        <BikeImage bike={current} className="br-zoom h-72 sm:h-96" />

        {bike?.badge && (
          <span
            className="absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-bold text-white"
            style={{ background: BADGE_COLOR[bike.badge] || "var(--brand)" }}
          >
            {bike.badge}
          </span>
        )}

        {count > 1 && (
          <>
            <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
              {idx + 1} / {count}
            </span>
            <button
              onClick={() => move(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => move(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {count === 0 && (
          <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            No photos yet
          </span>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2.5">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIdx(i)}
              aria-label={`Image ${i + 1}`}
              className="relative overflow-hidden rounded-xl transition"
              style={{ border: i === idx ? "2px solid var(--brand)" : "1px solid var(--line)", flex: 1 }}
            >
              <BikeImage bike={{ ...bike, image: src }} className="h-16" />
              {i !== idx && <span className="absolute inset-0 bg-white/40" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
