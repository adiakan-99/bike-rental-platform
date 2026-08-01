// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Star } from "lucide-react";
import { inr } from "../../../lib/money.js";
import { getDealer } from "../../../mock";
import { BikeImage } from "../../../ui";

export function MiniCard({ bike, city, variant, onView }) {
  const dealer = getDealer(bike, city);
  return (
    <div className="br-bikecard flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl" style={{ scrollSnapAlign: "start" }}>
      <BikeImage bike={bike} className="h-32" />
      <div className="flex flex-1 flex-col p-3.5">
        {variant === "other-dealer" ? (
          <>
            <h4 className="br-display text-sm font-bold leading-tight">{bike.name}</h4>
            <p className="text-xs" style={{ color: "var(--mute)" }}>{bike.cat}</p>
          </>
        ) : (
          <>
            <h4 className="br-display text-sm font-bold leading-tight">{bike.name}</h4>
            <p className="text-xs" style={{ color: "var(--mute)" }}>{dealer.name}</p>
          </>
        )}
        <div className="mt-1.5 flex items-center gap-1 text-xs"><Star size={13} fill="#f5a623" strokeWidth={0} /><span className="font-semibold">{variant === "other-dealer" ? bike.rating : dealer.rating}</span><span style={{ color: "var(--mute)" }}>· {bike.stock} avail.</span></div>
        <div className="mt-2 flex items-baseline gap-1"><span className="br-display text-base font-bold">{inr(bike.price)}</span><span className="text-xs" style={{ color: "var(--mute)" }}>/day</span></div>
        {variant !== "other-dealer" && <p className="text-[11px]" style={{ color: bike.deposit === 0 ? "var(--brand)" : "var(--mute)" }}>{bike.deposit === 0 ? "No deposit" : `${inr(bike.deposit)} deposit`}</p>}
        <button onClick={() => onView(bike)} className="br-ghost br-display mt-2.5 rounded-lg py-2 text-xs font-semibold">View Details</button>
      </div>
    </div>
  );
}
