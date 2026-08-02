// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Check, Cog, Fuel, Gauge, Heart, ShieldCheck, Star, Zap } from "lucide-react";
import { COMPARE_MAX } from "../config";
import { inr } from "../lib/money.js";
import { BikeImage } from "./BikeImage.jsx";
import { Chip } from "./Chip.jsx";

export function BikeCard({ bike, view, wished, onWish, onView, inCompare, onCompare, compareFull }) {
  const list = view === "list"; const low = bike.stock <= 3, discounted = bike.orig > bike.price;
  const Info = (
    <>
      <div className="flex items-start justify-between">
        <div><h3 className="br-display text-base font-bold leading-tight">{bike.name}</h3><p className="text-xs" style={{ color: "var(--mute)" }}>{bike.mf}</p></div>
        <button onClick={onWish} aria-label="Add to wishlist" className="grid h-9 w-9 shrink-0 place-items-center rounded-full br-ghost"><Heart size={17} fill={wished ? "#dc2626" : "none"} color={wished ? "#dc2626" : "#5b6b74"} /></button>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5"><Chip>{bike.cat}</Chip><Chip><Gauge size={12} />{bike.cc ? `${bike.cc}cc` : "EV"}</Chip><Chip><Fuel size={12} />{bike.fuel}</Chip><Chip><Cog size={12} />{bike.trans}</Chip>{bike.helmet && <Chip><ShieldCheck size={12} />Helmet</Chip>}</div>
      <div className="mt-2.5 flex items-center gap-1.5 text-sm"><Star size={15} fill="#f5a623" strokeWidth={0} /><span className="font-semibold">{bike.rating}</span><span style={{ color: "var(--mute)" }}>({bike.reviews} reviews)</span></div>
      <div className="mt-3 flex items-end justify-between">
        <div><div className="flex items-baseline gap-2"><span className="br-display text-xl font-bold">{inr(bike.price)}</span><span className="text-xs" style={{ color: "var(--mute)" }}>/day</span></div>{discounted && <span className="text-xs line-through" style={{ color: "var(--mute)" }}>{inr(bike.orig)}/day</span>}</div>
        <span className="text-xs font-semibold" style={{ color: bike.deposit === 0 ? "var(--brand)" : "#3a4d55" }}>{bike.deposit === 0 ? "No Security Deposit" : `${inr(bike.deposit)} Refundable`}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: low ? "#dc2626" : "var(--brand)" }}>{bike.instant && <Zap size={13} />}{low ? `Only ${bike.stock} bikes left` : `${bike.stock} available${bike.instant ? " · Instant booking" : ""}`}</div>
      <div className="mt-3 flex gap-2"><button onClick={onView} className="br-btn br-display flex-1 rounded-xl py-2.5 text-sm font-semibold">View Details</button>
        <button onClick={onCompare} title={compareFull ? `Compare list is full (${COMPARE_MAX} max) — tap to see why` : undefined} className="br-display flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition" style={inCompare ? { background: "var(--form-bg)", border: "1.5px solid var(--brand)", color: "var(--brand)" } : { background: "#fff", border: "1.5px solid var(--brand)", color: "var(--brand)" }}>{inCompare ? <><Check size={14} /> Added</> : "Compare"}</button></div>
    </>
  );
  if (list) return <div className="br-bikecard br-fade-up flex flex-col overflow-hidden rounded-2xl sm:flex-row"><div className="sm:w-64 sm:shrink-0"><BikeImage bike={bike} className="h-44" /></div><div className="flex-1 p-4">{Info}</div></div>;
  return <div className="br-bikecard br-fade-up flex flex-col overflow-hidden rounded-2xl"><BikeImage bike={bike} className="h-44" /><div className="p-4">{Info}</div></div>;
}
