import { inr } from "../../../lib/money.js";

const has = (bikes, fn) => bikes.some((b) => { const v = fn(b); return v != null && v !== ""; });

const humanise = (key) =>
  String(key)
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const dash = (v) => (v == null || v === "" ? "—" : String(v));

export function buildCompareGroups(bikes) {
  if (!bikes?.length) return [];

  const groups = [];

  /* ---- Pricing ---- */
  const pricing = [
    { label: "Price per day", get: (b) => b.price, fmt: inr, better: "low" },
    {
      label: "Security deposit",
      get: (b) => b.deposit,
      fmt: (v) => (v === 0 ? "No deposit" : inr(v)),
      better: "low",
    },
  ];
  // Only shown if a list price genuinely exists — normally it won't.
  if (has(bikes, (b) => b.orig)) {
    pricing.push({
      label: "Discount",
      get: (b) => (b.orig > b.price ? Math.round(((b.orig - b.price) / b.orig) * 100) : 0),
      fmt: (v) => `${v}%`,
      better: "high",
    });
  }
  groups.push({ group: "Pricing", rows: pricing });

  /* ---- Engine & performance ---- */
  const engine = [
    {
      label: "Engine capacity",
      get: (b) => b.cc,
      fmt: (v) => (v ? `${v}cc` : "Electric"),
      better: "high",
    },
  ];
  if (has(bikes, (b) => b.fuel)) engine.push({ label: "Fuel type", get: (b) => b.fuel, fmt: dash, better: null });
  if (has(bikes, (b) => b.trans)) engine.push({ label: "Transmission", get: (b) => b.trans, fmt: dash, better: null });
  groups.push({ group: "Engine & performance", rows: engine });

  /* ---- The bike itself ---- */
  const about = [{ label: "Category", get: (b) => b.cat, fmt: dash, better: null }];
  if (has(bikes, (b) => b.bikeType)) about.push({ label: "Type", get: (b) => b.bikeType, fmt: dash, better: null });
  if (has(bikes, (b) => b.seats)) about.push({ label: "Seating capacity", get: (b) => b.seats, fmt: dash, better: "high" });
  if (has(bikes, (b) => b.year)) about.push({ label: "Year", get: (b) => b.year, fmt: dash, better: "high" });
  if (has(bikes, (b) => b.color)) about.push({ label: "Colour", get: (b) => b.color, fmt: dash, better: null });
  groups.push({ group: "About the bike", rows: about });

  /* ---- Partner-supplied specs (additionalSpecs JSONB) ---- */
  // Union of every key across the compared bikes, so a spec only one partner
  // filled in still shows — the others read "—", which is itself informative.
  const specKeys = [...new Set(bikes.flatMap((b) => Object.keys(b.specs || {})))];
  if (specKeys.length) {
    groups.push({
      group: "Specifications",
      rows: specKeys.map((k) => ({
        label: humanise(k),
        get: (b) => b.specs?.[k],
        // Numeric strings compare properly; text falls back to plain display.
        fmt: dash,
        better: null,
      })),
    });
  }

  /* ---- What you get ---- */
  const included = [];
  if (has(bikes, (b) => b.services?.kmLimit)) {
    included.push({ label: "Daily KM limit", get: (b) => b.services?.kmLimit, fmt: (v) => (v == null ? "—" : `${v} km`), better: "high" });
  }
  if (has(bikes, (b) => b.services?.extraKm)) {
    included.push({ label: "Extra KM charge", get: (b) => b.services?.extraKm, fmt: (v) => (v == null ? "—" : `${inr(v)}/km`), better: "low" });
  }
  if (bikes.some((b) => b.helmet != null)) {
    included.push({ label: "Helmet included", get: (b) => (b.helmet == null ? null : b.helmet ? 1 : 0), fmt: (v) => (v == null ? "—" : v ? "Yes" : "No"), better: "high" });
  }
  if (bikes.some((b) => b.instant != null)) {
    included.push({ label: "Instant booking", get: (b) => (b.instant ? 1 : 0), fmt: (v) => (v ? "Yes" : "No"), better: "high" });
  }
  if (included.length) groups.push({ group: "What you get", rows: included });

  return groups;
}
