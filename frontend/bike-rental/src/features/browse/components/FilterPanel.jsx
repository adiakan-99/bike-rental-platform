// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { Search, Star } from "lucide-react";
import { CATEGORIES, ENGINE_BANDS, MANUFACTURERS } from "../../../constants";
import { inr } from "../../../lib/money.js";
import { CheckRow } from "./CheckRow.jsx";
import { CollapsibleCard } from "./CollapsibleCard.jsx";

export function FilterPanel({ f, setF, onClear }) {
  const [modelQuery, setModelQuery] = useState("");
  const toggle = (key, val) => setF((p) => { const s = new Set(p[key]); s.has(val) ? s.delete(val) : s.add(val); return { ...p, [key]: s }; });
  return (
    <div className="flex flex-col gap-3">
      <CollapsibleCard title="Manufacturer">{MANUFACTURERS.map((m) => <CheckRow key={m} label={m} checked={f.manufacturers.has(m)} onToggle={() => toggle("manufacturers", m)} />)}</CollapsibleCard>
      <CollapsibleCard title="Model" defaultOpen={false}><div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5"><Search size={15} style={{ color: "var(--mute)" }} /><input value={modelQuery} onChange={(e) => setModelQuery(e.target.value)} placeholder="Search model" className="br-input w-full text-sm" /></div></CollapsibleCard>
      <CollapsibleCard title="Price Range"><input type="range" min={100} max={3000} step={50} value={f.maxPrice} onChange={(e) => setF((p) => ({ ...p, maxPrice: +e.target.value }))} className="br-range" /><div className="mt-2 flex items-center justify-between text-xs font-medium" style={{ color: "var(--mute)" }}><span>₹100/day</span><span className="br-display font-bold" style={{ color: "var(--ink)" }}>Up to {inr(f.maxPrice)}/day</span></div></CollapsibleCard>
      <CollapsibleCard title="Bike Category">{CATEGORIES.map((c) => <CheckRow key={c} label={c} checked={f.categories.has(c)} onToggle={() => toggle("categories", c)} />)}</CollapsibleCard>
      <CollapsibleCard title="Engine Capacity" defaultOpen={false}>{ENGINE_BANDS.map((b) => <CheckRow key={b} label={b} checked={f.engine.has(b)} onToggle={() => toggle("engine", b)} />)}</CollapsibleCard>
      <CollapsibleCard title="Transmission" defaultOpen={false}>{["Manual","Automatic"].map((t) => <CheckRow key={t} label={t} checked={f.transmission.has(t)} onToggle={() => toggle("transmission", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Fuel Type" defaultOpen={false}>{["Petrol","Electric"].map((t) => <CheckRow key={t} label={t} checked={f.fuel.has(t)} onToggle={() => toggle("fuel", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Security Deposit" defaultOpen={false}>{["No Deposit","Deposit Required"].map((t) => <CheckRow key={t} label={t} checked={f.deposit.has(t)} onToggle={() => toggle("deposit", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Availability" defaultOpen={false}>{["Available Now","Instant Booking"].map((t) => <CheckRow key={t} label={t} checked={f.availability.has(t)} onToggle={() => toggle("availability", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Rating" defaultOpen={false}><input type="range" min={0} max={5} step={0.5} value={f.minRating} onChange={(e) => setF((p) => ({ ...p, minRating: +e.target.value }))} className="br-range" /><div className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><Star size={15} fill="#f5a623" strokeWidth={0} />{f.minRating > 0 ? `${f.minRating}★ & above` : "Any rating"}</div></CollapsibleCard>
      <CollapsibleCard title="Mileage Included" defaultOpen={false}>{["Unlimited","Limited"].map((t) => <CheckRow key={t} label={t} checked={f.mileage.has(t)} onToggle={() => toggle("mileage", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Helmet Included" defaultOpen={false}><CheckRow label="Helmet included" checked={f.helmet} onToggle={() => setF((p) => ({ ...p, helmet: !p.helmet }))} /></CollapsibleCard>
      <CollapsibleCard title="Delivery Options" defaultOpen={false}>{["Home Delivery","Pickup Only"].map((t) => <CheckRow key={t} label={t} checked={f.delivery.has(t)} onToggle={() => toggle("delivery", t)} />)}</CollapsibleCard>
      <CollapsibleCard title="Offers" defaultOpen={false}>{["Best Deals","Weekend Discount","Long Rental Discount"].map((t) => <CheckRow key={t} label={t} checked={f.offers.has(t)} onToggle={() => toggle("offers", t)} />)}</CollapsibleCard>
      <div className="br-card sticky bottom-0 flex gap-2 rounded-2xl p-3 shadow-sm"><button className="br-btn br-display flex-1 rounded-xl py-2.5 text-sm font-semibold">Apply Filters</button><button className="br-ghost br-display rounded-xl px-4 py-2.5 text-sm font-semibold" onClick={onClear}>Clear All</button></div>
    </div>
  );
}
