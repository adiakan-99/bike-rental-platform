// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Fragment, useState } from "react";
import { ChevronRight as Caret, Check, LayoutGrid, Star, X } from "lucide-react";
import { COMPARE_GROUPS } from "../../../constants";
import { durationHours, durationLabel } from "../../../lib/datetime.js";
import { buildFare } from "../../../lib/fare.js";
import { inr } from "../../../lib/money.js";
import { getDealer } from "../../../mock";
import { BikeImage } from "../../../ui";

export function ComparePage({ bikes, criteria, onRemove, onView, onBack, onClear }) {
  const [diffOnly, setDiffOnly] = useState(false);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const days = Math.max(1, Math.ceil(hours / 24));

  if (bikes.length < 2) return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--form-bg)" }}><LayoutGrid size={30} style={{ color: "var(--brand)" }} /></span>
      <h1 className="br-serif mt-4 text-2xl font-bold">Pick at least two bikes</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>Tap <strong>Compare</strong> on any bike in the search results to add it here.</p>
      <button onClick={onBack} className="br-btn br-display mt-6 rounded-xl px-6 py-3 text-sm font-semibold">Browse bikes</button>
    </div>
  );

  // best value per row, for the criteria where "better" is meaningful
  const bestFor = (row) => {
    if (!row.better) return null;
    const vals = bikes.map(row.get);
    if (typeof vals[0] !== "number") return null;
    const target = row.better === "low" ? Math.min(...vals) : Math.max(...vals);
    if (vals.every((v) => v === target)) return null; // all equal → nothing to highlight
    return target;
  };
  const rowDiffers = (row) => new Set(bikes.map((b) => row.fmt(row.get(b)))).size > 1;
  const totalFor = (b) => buildFare(b, days).payNow;
  const cheapestTotal = Math.min(...bikes.map(totalFor));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--mute)" }}>
        <button className="br-crumb" onClick={onBack}>Search Results</button><Caret size={14} />
        <span className="font-semibold" style={{ color: "var(--ink)" }}>Compare</span>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="br-serif text-3xl font-bold">Compare bikes</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Best value in each row is highlighted · estimates based on your {durationLabel(hours)} rental.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDiffOnly((v) => !v)} className={`br-filter-chip br-display rounded-xl px-4 py-2.5 text-sm font-semibold ${diffOnly ? "br-filter-chip-active" : ""}`}>{diffOnly ? "Showing differences" : "Show differences only"}</button>
          <button onClick={onClear} className="br-ghost br-display rounded-xl px-4 py-2.5 text-sm font-semibold">Clear all</button>
        </div>
      </div>

      {/* table */}
      <div className="br-card br-scroll mt-5 overflow-x-auto rounded-2xl shadow-sm">
        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
          {/* header: the bikes */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-3 text-left" style={{ width: 170, borderBottom: "1px solid var(--line)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Criteria</span>
              </th>
              {bikes.map((b) => (
                <th key={b.id} className="p-3 align-top" style={{ minWidth: 180, borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)" }}>
                  <div className="relative">
                    <button onClick={() => onRemove(b.id)} aria-label="Remove" className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full br-ghost"><X size={13} /></button>
                    <BikeImage bike={b} className="h-20 rounded-xl" />
                    <p className="br-display mt-2 text-sm font-bold leading-tight">{b.name}</p>
                    <p className="text-xs" style={{ color: "var(--mute)" }}>{b.mf}</p>
                    <button onClick={() => onView(b)} className="br-btn br-display mt-2 w-full rounded-lg py-1.5 text-xs font-semibold">View Details</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* estimated total — the headline comparison */}
            <tr>
              <td colSpan={bikes.length + 1} className="px-3 py-2" style={{ background: "var(--form-bg)" }}>
                <span className="br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Your rental</span>
              </td>
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium" style={{ color: "#3a4d55", borderBottom: "1px solid var(--line)" }}>Estimated total <span className="text-xs" style={{ color: "var(--mute)" }}>({days}d)</span></td>
              {bikes.map((b) => {
                const t = totalFor(b), best = t === cheapestTotal;
                return <td key={b.id} className="p-3 text-center" style={{ borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)", background: best ? "#dcfce7" : undefined }}>
                  <span className="br-display text-base font-bold" style={{ color: best ? "#15803d" : "var(--ink)" }}>{inr(t)}</span>
                  {best && <span className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#16a34a", color: "#fff" }}>Cheapest</span>}
                </td>;
              })}
            </tr>

            {COMPARE_GROUPS.map((g) => {
              const rows = g.rows.filter((r) => !diffOnly || rowDiffers(r));
              if (rows.length === 0) return null;
              return (
                <Fragment key={g.group}>
                  <tr>
                    <td colSpan={bikes.length + 1} className="px-3 py-2" style={{ background: "var(--form-bg)" }}>
                      <span className="br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>{g.group}</span>
                    </td>
                  </tr>
                  {rows.map((row) => {
                    const best = bestFor(row);
                    return (
                      <tr key={row.label}>
                        <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium" style={{ color: "#3a4d55", borderBottom: "1px solid var(--line)" }}>{row.label}</td>
                        {bikes.map((b) => {
                          const raw = row.get(b), isBest = best !== null && raw === best;
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

            {/* dealer row */}
            <tr>
              <td colSpan={bikes.length + 1} className="px-3 py-2" style={{ background: "var(--form-bg)" }}>
                <span className="br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Dealer</span>
              </td>
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium" style={{ color: "#3a4d55" }}>Listed by</td>
              {bikes.map((b) => {
                const d = getDealer(b, criteria.city);
                return <td key={b.id} className="p-3 text-center text-sm" style={{ borderLeft: "1px solid var(--line)" }}>
                  <span className="font-semibold">{d.name}</span>
                  <span className="mt-0.5 flex items-center justify-center gap-1 text-xs" style={{ color: "var(--mute)" }}><Star size={11} fill="#f5a623" strokeWidth={0} /> {d.rating}</span>
                </td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs" style={{ color: "var(--mute)" }}>Mileage, top speed and ABS are indicative figures for the model, not the individual vehicle.</p>
      <div className="h-20" />
    </div>
  );
}
