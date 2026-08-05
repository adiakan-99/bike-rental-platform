// CHANGED FROM THE ORIGINAL: filters with no data behind them are gone.
//
// Removed — the backend has no field for these, so they could never do anything:
//   Rating, Helmet Included, Mileage Included, Delivery Options, Offers, Model search
//
// Kept, and labelled so it's clear where each one runs:
//   "Searches all bikes"  -> sent to the API (manufacturer, category, price)
//   "Filters loaded results" -> applied in the browser to the current page
//
// Add a facet back the moment the backend grows a query param for it.
import { Search, Server } from "lucide-react";
import { CATEGORIES, ENGINE_BANDS, MANUFACTURERS } from "../../../constants";
import { inr } from "../../../lib/money.js";
import { CheckRow } from "./CheckRow.jsx";
import { CollapsibleCard } from "./CollapsibleCard.jsx";

const ServerNote = () => (
  <p className="mt-2 flex items-center gap-1 text-[11px]" style={{ color: "var(--mute)" }}>
    <Server size={11} /> Searches all bikes
  </p>
);

const LocalNote = () => (
  <p className="mt-2 flex items-center gap-1 text-[11px]" style={{ color: "var(--mute)" }}>
    <Search size={11} /> Filters loaded results only
  </p>
);

export function FilterPanel({ f, setF, onClear }) {
  const toggle = (key, val) =>
    setF((p) => {
      const s = new Set(p[key]);
      s.has(val) ? s.delete(val) : s.add(val);
      return { ...p, [key]: s };
    });

  return (
    <div className="flex flex-col gap-3">
      <CollapsibleCard title="Manufacturer">
        {MANUFACTURERS.map((m) => (
          <CheckRow key={m} label={m} checked={f.manufacturers.has(m)} onToggle={() => toggle("manufacturers", m)} />
        ))}
        {/* One tick queries the API; several fall back to filtering the loaded page. */}
        {f.manufacturers.size > 1 ? <LocalNote /> : <ServerNote />}
      </CollapsibleCard>

      <CollapsibleCard title="Price Range">
        <input
          type="range"
          min={100}
          max={3000}
          step={50}
          value={f.maxPrice}
          onChange={(e) => setF((p) => ({ ...p, maxPrice: +e.target.value }))}
          className="br-range"
        />
        <div className="mt-2 flex items-center justify-between text-xs font-medium" style={{ color: "var(--mute)" }}>
          <span>₹100/day</span>
          <span className="br-display font-bold" style={{ color: "var(--ink)" }}>
            Up to {inr(f.maxPrice)}/day
          </span>
        </div>
        <ServerNote />
      </CollapsibleCard>

      <CollapsibleCard title="Bike Category">
        {CATEGORIES.map((c) => (
          <CheckRow key={c} label={c} checked={f.categories.has(c)} onToggle={() => toggle("categories", c)} />
        ))}
        {f.categories.size > 1 ? <LocalNote /> : <ServerNote />}
      </CollapsibleCard>

      <CollapsibleCard title="Engine Capacity" defaultOpen={false}>
        {ENGINE_BANDS.map((b) => (
          <CheckRow key={b} label={b} checked={f.engine.has(b)} onToggle={() => toggle("engine", b)} />
        ))}
        <LocalNote />
      </CollapsibleCard>

      <CollapsibleCard title="Transmission" defaultOpen={false}>
        {["Manual", "Automatic"].map((t) => (
          <CheckRow key={t} label={t} checked={f.transmission.has(t)} onToggle={() => toggle("transmission", t)} />
        ))}
        <LocalNote />
      </CollapsibleCard>

      <CollapsibleCard title="Fuel Type" defaultOpen={false}>
        {["Petrol", "Electric"].map((t) => (
          <CheckRow key={t} label={t} checked={f.fuel.has(t)} onToggle={() => toggle("fuel", t)} />
        ))}
        <LocalNote />
      </CollapsibleCard>

      <CollapsibleCard title="Security Deposit" defaultOpen={false}>
        {["No Deposit", "Deposit Required"].map((t) => (
          <CheckRow key={t} label={t} checked={f.deposit.has(t)} onToggle={() => toggle("deposit", t)} />
        ))}
        <LocalNote />
      </CollapsibleCard>

      <CollapsibleCard title="Availability" defaultOpen={false}>
        <CheckRow
          label="Instant Booking"
          checked={f.availability.has("Instant Booking")}
          onToggle={() => toggle("availability", "Instant Booking")}
        />
        <LocalNote />
      </CollapsibleCard>

      {/* The old "Apply Filters" button did nothing — filters apply as you tick.
          Only "Clear All" remains, which is the one that had real behaviour. */}
      <div className="br-card sticky bottom-0 flex gap-2 rounded-2xl p-3 shadow-sm">
        <button className="br-ghost br-display flex-1 rounded-xl py-2.5 text-sm font-semibold" onClick={onClear}>
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
