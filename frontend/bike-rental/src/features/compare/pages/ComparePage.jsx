// REWRITTEN for bike-service.
//
// WHAT CHANGED AND WHY
//
// 1. FETCHES FULL DETAILS. The `bikes` prop comes from the registry, so those
//    objects are card-shaped — ~12 fields, no specs, no seating, no colour.
//    Comparing on that data means most rows read "—". GET /public/compare?ids=
//    returns full BikeDetailDto for every bike in ONE request, which is exactly
//    what this screen needs.
//
// 2. ROWS ARE BUILT FROM THE DATA. See utils/compareRows.js — the old static
//    COMPARE_GROUPS invented mileage, top speed and ABS from engine size, and
//    listed rating/reviews/stock columns the API doesn't return.
//
// 3. THE DEALER ROW IS GONE. It called getDealer() against mock data and showed
//    a fake dealer rating. Needs partner-service; add it back with
//    GET /api/v1/partners/public/{id} when that's wired.
import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronRight as Caret, Check, LayoutGrid, X } from "lucide-react";
import { durationHours, durationLabel } from "../../../lib/datetime.js";
import { buildFare } from "../../../lib/fare.js";
import { inr } from "../../../lib/money.js";
import { compareBikes as fetchCompare } from "../../../api/bikes.js";
import { detailDtoToBike } from "../../../lib/adapters/bike.js";
import { registerBikes } from "../../../lib/bikeRegistry.js";
import { BikeImage } from "../../../ui";
import { buildCompareGroups } from "../utils";

export function ComparePage({ bikes, criteria, onRemove, onView, onBack, onClear }) {
  const [diffOnly, setDiffOnly] = useState(false);
  const [detailed, setDetailed] = useState(bikes);
  const [error, setError] = useState(null);

  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const days = Math.max(1, Math.ceil(hours / 24));

  // Depend on the ID list, not the array identity — otherwise every parent
  // re-render would refire the request.
  const idKey = bikes.map((b) => b.id).sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (bikes.length < 2) return;
    let cancelled = false;

    fetchCompare(bikes.map((b) => b.id))
      .then((list) => {
        if (cancelled) return;
        const mapped = (list || []).map(detailDtoToBike);
        registerBikes(mapped);
        // Preserve the order the user added them in, and keep card-only fields
        // (badge, instant) that the detail DTO doesn't repeat.
        setDetailed(
          bikes.map((b) => {
            const full = mapped.find((m) => m.id === b.id);
            return full ? { ...b, ...full } : b;
          }),
        );
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.userMessage || "Couldn't load full specifications.");
        setDetailed(bikes); // fall back to card data rather than an empty table
      });

    return () => { cancelled = true; };
  }, [idKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = useMemo(() => buildCompareGroups(detailed), [detailed]);

  if (bikes.length < 2) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--form-bg)" }}>
          <LayoutGrid size={30} style={{ color: "var(--brand)" }} />
        </span>
        <h1 className="br-serif mt-4 text-2xl font-bold">Pick at least two bikes</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>
          Tap <strong>Compare</strong> on any bike in the search results to add it here.
        </p>
        <button onClick={onBack} className="br-btn br-display mt-6 rounded-xl px-6 py-3 text-sm font-semibold">
          Browse bikes
        </button>
      </div>
    );
  }

  // Highlights the winning cell, but only when a winner is meaningful.
  const bestFor = (row) => {
    if (!row.better) return null;
    const vals = detailed.map(row.get).filter((v) => v != null && v !== "");
    if (vals.length < 2 || typeof vals[0] !== "number") return null;
    const target = row.better === "low" ? Math.min(...vals) : Math.max(...vals);
    if (vals.every((v) => v === target)) return null; // all equal, nothing to crown
    return target;
  };

  const rowDiffers = (row) => new Set(detailed.map((b) => row.fmt(row.get(b)))).size > 1;
  const totalFor = (b) => buildFare(b, days).payNow;
  const cheapestTotal = Math.min(...detailed.map(totalFor));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--mute)" }}>
        <button className="br-crumb" onClick={onBack}>Search Results</button><Caret size={14} />
        <span className="font-semibold" style={{ color: "var(--ink)" }}>Compare</span>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="br-serif text-3xl font-bold">Compare bikes</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
            Best value in each row is highlighted · estimates based on your {durationLabel(hours)} rental.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDiffOnly((v) => !v)}
            className={`br-filter-chip br-display rounded-xl px-4 py-2.5 text-sm font-semibold ${diffOnly ? "br-filter-chip-active" : ""}`}
          >
            {diffOnly ? "Showing differences" : "Show differences only"}
          </button>
          <button onClick={onClear} className="br-ghost br-display rounded-xl px-4 py-2.5 text-sm font-semibold">
            Clear all
          </button>
        </div>
      </div>

      {error && (
        <div className="br-card mt-4 rounded-2xl px-4 py-3 text-sm" style={{ color: "#b91c1c" }}>
          {error} Comparing on summary data instead.
        </div>
      )}

      <div className="br-card br-scroll mt-5 overflow-x-auto rounded-2xl shadow-sm">
        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 text-left" style={{ width: 170, borderBottom: "1px solid var(--line)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Criteria</span>
              </th>
              {detailed.map((b) => (
                <th key={b.id} className="p-3 align-top" style={{ minWidth: 180, borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)" }}>
                  <div className="relative">
                    <button onClick={() => onRemove(b.id)} aria-label="Remove" className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full br-ghost">
                      <X size={13} />
                    </button>
                    <BikeImage bike={b} className="h-20 rounded-xl" />
                    <p className="br-display mt-2 text-sm font-bold leading-tight">{b.name}</p>
                    <p className="text-xs" style={{ color: "var(--mute)" }}>{b.mf}</p>
                    <button onClick={() => onView(b)} className="br-btn br-display mt-2 w-full rounded-lg py-1.5 text-xs font-semibold">
                      View Details
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={detailed.length + 1} className="px-3 py-2" style={{ background: "var(--form-bg)" }}>
                <span className="br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Your rental</span>
              </td>
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium" style={{ color: "#3a4d55", borderBottom: "1px solid var(--line)" }}>
                Estimated total <span className="text-xs" style={{ color: "var(--mute)" }}>({days}d)</span>
              </td>
              {detailed.map((b) => {
                const t = totalFor(b), best = t === cheapestTotal;
                return (
                  <td key={b.id} className="p-3 text-center" style={{ borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)", background: best ? "#dcfce7" : undefined }}>
                    <span className="br-display text-base font-bold" style={{ color: best ? "#15803d" : "var(--ink)" }}>{inr(t)}</span>
                    {best && <span className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#16a34a", color: "#fff" }}>Cheapest</span>}
                  </td>
                );
              })}
            </tr>

            {groups.map((g) => {
              const rows = g.rows.filter((r) => !diffOnly || rowDiffers(r));
              if (rows.length === 0) return null;
              return (
                <Fragment key={g.group}>
                  <tr>
                    <td colSpan={detailed.length + 1} className="px-3 py-2" style={{ background: "var(--form-bg)" }}>
                      <span className="br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>{g.group}</span>
                    </td>
                  </tr>
                  {rows.map((row) => {
                    const best = bestFor(row);
                    return (
                      <tr key={g.group + row.label}>
                        <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium" style={{ color: "#3a4d55", borderBottom: "1px solid var(--line)" }}>
                          {row.label}
                        </td>
                        {detailed.map((b) => {
                          const raw = row.get(b);
                          const isBest = best !== null && raw === best;
                          return (
                            <td key={b.id} className="p-3 text-center text-sm" style={{ borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)", background: isBest ? "#dcfce7" : undefined }}>
                              <span className="font-semibold" style={{ color: isBest ? "#15803d" : "var(--ink)" }}>{row.fmt(raw)}</span>
                              {isBest && <Check size={13} className="ml-1 inline" style={{ color: "#16a34a" }} />}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--mute)" }}>
        Specifications are supplied by the listing partner. A dash means the partner didn't provide that detail.
      </p>
      <div className="h-20" />
    </div>
  );
}
