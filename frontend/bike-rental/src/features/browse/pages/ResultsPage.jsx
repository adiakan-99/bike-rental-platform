// WAS: filtered/sorted the in-memory BIKES array.
// NOW: calls GET /api/v1/bikes/public/search/browse and pages through the results.
//
// Three behaviours changed, and they changed because the backend works differently:
//
// 1. FILTERING is split. city / manufacturer / category / price go to the server.
//    Everything else (fuel, transmission, deposit band, engine band, instant) is
//    applied to the page you got back. That means a client-side filter can only
//    narrow the current page, not search the whole catalogue — which is why the
//    count below says "on this page".
//
// 2. The backend takes ONE manufacturer and ONE category, not a list. If the user
//    ticks several, we send none and filter client-side instead.
//
// 3. "Load more" now fetches the next page and appends, instead of revealing more
//    of an array we already had.
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { COMPARE_MAX } from "../../../config";
import { browseBikes } from "../../../api/bikes.js";
import { cardDtoToBike, SORT_PARAM, SUPPORTED_SORTS } from "../../../lib/adapters/bike.js";
import { registerBikes } from "../../../lib/bikeRegistry.js";
import { BikeCard } from "../../../ui";
import { FilterPanel, SearchSummary } from "../components";
import { emptyFilters } from "../utils";

const PAGE_SIZE = 12;

export function ResultsPage({ criteria, onEdit, onView, compare, onCompare, wishlist, onWish }) {
  const [f, setF] = useState(emptyFilters);
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState("grid");
  const [drawer, setDrawer] = useState(false);

  const [bikes, setBikes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLast, setIsLast] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Only send a manufacturer/category when EXACTLY one is ticked — the endpoint
  // accepts a single value, so two ticks would silently drop one.
  const soleValue = (set) => (set.size === 1 ? [...set][0] : undefined);

  const serverParams = useMemo(
    () => ({
      city: criteria.city,
      manufacturer: soleValue(f.manufacturers),
      category: soleValue(f.categories),
      maxPrice: f.maxPrice,
      sort: SORT_PARAM[sort],
      size: PAGE_SIZE,
    }),
    [criteria.city, f.manufacturers, f.categories, f.maxPrice, sort],
  );

  const load = useCallback(
    async (pageToLoad, { append }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await browseBikes({ ...serverParams, page: pageToLoad });
        const mapped = (res.content || []).map(cardDtoToBike);
        // Wishlist/Compare hold IDs only — this is where they get the objects.
        registerBikes(mapped);
        setBikes((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotalElements(res.totalElements ?? mapped.length);
        setIsLast(res.last ?? true);
        setPage(res.number ?? pageToLoad);
      } catch (e) {
        setError(e.userMessage || "Could not load bikes.");
        if (!append) setBikes([]);
      } finally {
        setLoading(false);
      }
    },
    [serverParams],
  );

  // Any change to a server-side filter or the sort restarts from page 0.
  useEffect(() => {
    load(0, { append: false });
  }, [load]);

  // Filters the backend can't do. These only narrow what's already loaded.
  const shown = useMemo(() => {
    const multiMf = f.manufacturers.size > 1;
    const multiCat = f.categories.size > 1;
    return bikes.filter((b) => {
      if (multiMf && !f.manufacturers.has(b.mf)) return false;
      if (multiCat && !f.categories.has(b.cat)) return false;
      if (f.fuel.size && !f.fuel.has(b.fuel)) return false;
      if (f.transmission.size && !f.transmission.has(b.trans)) return false;
      if (f.deposit.has("No Deposit") && !f.deposit.has("Deposit Required") && b.deposit !== 0) return false;
      if (f.deposit.has("Deposit Required") && !f.deposit.has("No Deposit") && b.deposit === 0) return false;
      if (f.availability.has("Instant Booking") && !b.instant) return false;
      if (f.engine.size && !f.engine.has(engineBand(b.cc))) return false;
      return true;
    });
  }, [bikes, f]);

  const clientFiltered = shown.length !== bikes.length;

  return (
    <>
      <SearchSummary criteria={criteria} onEdit={onEdit} />
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-[9.5rem] max-h-[calc(100vh-10.5rem)] overflow-y-auto pb-4 pr-1 br-scroll">
              <FilterPanel f={f} setF={setF} onClear={() => setF(emptyFilters())} />
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="br-display text-xl font-bold">
                {loading && bikes.length === 0 ? "Loading bikes…" : `${totalElements} Bikes Available`}
                <span className="ml-2 text-sm font-normal" style={{ color: "var(--mute)" }}>
                  in {criteria.city}
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <button
                  className="br-ghost flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold lg:hidden"
                  onClick={() => setDrawer(true)}
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
                <div className="br-card flex items-center gap-2 rounded-xl px-3 py-2">
                  <span className="text-xs font-medium" style={{ color: "var(--mute)" }}>Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="br-input br-display text-sm font-semibold"
                  >
                    {SUPPORTED_SORTS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="br-card flex items-center rounded-xl p-1">
                  {[["grid", LayoutGrid], ["list", List]].map(([v, Icon]) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-label={`${v} view`}
                      className="grid h-8 w-8 place-items-center rounded-lg transition"
                      style={view === v ? { background: "var(--brand)", color: "#fff" } : { color: "var(--mute)" }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="br-card mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm" style={{ color: "#b91c1c" }}>
                <span>{error}</span>
                <button onClick={() => load(0, { append: false })} className="br-ghost br-display rounded-lg px-3 py-1.5 text-xs font-semibold">
                  Retry
                </button>
              </div>
            )}

            {loading && bikes.length === 0 ? (
              <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="br-card h-72 animate-pulse rounded-2xl" style={{ background: "var(--form-bg)" }} />
                ))}
              </div>
            ) : shown.length === 0 ? (
              <div className="br-card grid place-items-center rounded-2xl py-16 text-center">
                <p className="br-display text-base font-bold">No bikes match these filters</p>
                <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                  Try widening your price range or clearing a few filters.
                </p>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
                {shown.map((b) => (
                  <BikeCard
                    key={b.id}
                    bike={b}
                    view={view}
                    wished={wishlist?.has(b.id)}
                    onWish={() => onWish(b.id)}
                    onView={() => onView(b)}
                    inCompare={compare?.has(b.id)}
                    onCompare={() => onCompare(b.id)}
                    compareFull={compare?.size >= COMPARE_MAX && !compare?.has(b.id)}
                  />
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="h-1 w-40 overflow-hidden rounded-full" style={{ background: "var(--form-bg)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((bikes.length / Math.max(1, totalElements)) * 100)}%`,
                    background: "linear-gradient(90deg,var(--brand),var(--brand-2))",
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: "var(--mute)" }}>
                Showing <span className="font-semibold" style={{ color: "var(--ink)" }}>{shown.length}</span>
                {clientFiltered ? ` of ${bikes.length} loaded` : ` of ${totalElements} bikes`}
              </p>
              {clientFiltered && (
                <p className="text-[11px]" style={{ color: "var(--mute)" }}>
                  Some filters apply to loaded results only — load more to widen the search.
                </p>
              )}
              {!isLast ? (
                <button
                  onClick={() => load(page + 1, { append: true })}
                  disabled={loading}
                  className="br-ghost br-display mt-1 rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  {loading ? "Loading…" : "Load more bikes"}
                </button>
              ) : (
                bikes.length > 0 && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                    <Check size={14} /> You've seen every match
                  </p>
                )
              )}
            </div>
          </section>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 lg:hidden" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col shadow-2xl" style={{ background: "var(--page)" }}>
            <div className="flex items-center justify-between bg-white px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="br-display text-base font-bold">Filters</span>
              <button className="grid h-9 w-9 place-items-center rounded-lg br-ghost" onClick={() => setDrawer(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel f={f} setF={setF} onClear={() => setF(emptyFilters())} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Matches the ENGINE_BANDS strings in src/constants.
function engineBand(cc) {
  if (cc < 125) return "Under 125cc";
  if (cc < 200) return "125–200cc";
  if (cc <= 350) return "200–350cc";
  return "Above 350cc";
}
