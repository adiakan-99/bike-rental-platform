// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { Check, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { COMPARE_MAX } from "../../../config";
import { SORT_OPTIONS } from "../../../constants";
import { BIKES } from "../../../mock";
import { BikeCard } from "../../../ui";
import { FilterPanel, SearchSummary } from "../components";
import { emptyFilters } from "../utils";

export function ResultsPage({ criteria, onEdit, onView, compare, onCompare, wishlist, onWish }) {
  const [f, setF] = useState(emptyFilters); const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState("grid"); const [visible, setVisible] = useState(8);
  const [drawer, setDrawer] = useState(false);
  const filtered = useMemo(() => {
    let list = BIKES.filter((b) => {
      if (f.manufacturers.size && !f.manufacturers.has(b.mf)) return false;
      if (f.categories.size && !f.categories.has(b.cat)) return false;
      if (f.fuel.size && !f.fuel.has(b.fuel)) return false;
      if (f.transmission.size && !f.transmission.has(b.trans)) return false;
      if (b.price > f.maxPrice) return false; if (b.rating < f.minRating) return false; if (f.helmet && !b.helmet) return false;
      if (f.deposit.has("No Deposit") && !f.deposit.has("Deposit Required") && b.deposit !== 0) return false;
      if (f.deposit.has("Deposit Required") && !f.deposit.has("No Deposit") && b.deposit === 0) return false;
      return true;
    });
    const disc = (b) => (b.orig - b.price) / b.orig;
    const sorters = { "Price: Low to High":(a,b)=>a.price-b.price, "Price: High to Low":(a,b)=>b.price-a.price, "Highest Rated":(a,b)=>b.rating-a.rating, "Most Popular":(a,b)=>b.reviews-a.reviews, "Newly Added":(a,b)=>b.id-a.id, "Best Deals":(a,b)=>disc(b)-disc(a), "Lowest Security Deposit":(a,b)=>a.deposit-b.deposit, "Fastest Booking":(a,b)=>Number(b.instant)-Number(a.instant) };
    if (sorters[sort]) list = [...list].sort(sorters[sort]); return list;
  }, [f, sort]);
  const shown = filtered.slice(0, visible);
  return (
    <>
      <SearchSummary criteria={criteria} onEdit={onEdit} />
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="hidden w-[280px] shrink-0 lg:block"><div className="sticky top-[9.5rem] max-h-[calc(100vh-10.5rem)] overflow-y-auto pb-4 pr-1 br-scroll"><FilterPanel f={f} setF={setF} onClear={() => setF(emptyFilters())} /></div></aside>
          <section className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="br-display text-xl font-bold">{filtered.length} Bikes Available<span className="ml-2 text-sm font-normal" style={{ color: "var(--mute)" }}>in {criteria.city}</span></h1>
              <div className="flex items-center gap-2">
                <button className="br-ghost flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal size={15} /> Filters</button>
                <div className="br-card flex items-center gap-2 rounded-xl px-3 py-2"><span className="text-xs font-medium" style={{ color: "var(--mute)" }}>Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="br-input br-display text-sm font-semibold">{SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div className="br-card flex items-center rounded-xl p-1">{[["grid", LayoutGrid], ["list", List]].map(([v, Icon]) => <button key={v} onClick={() => setView(v)} aria-label={`${v} view`} className="grid h-8 w-8 place-items-center rounded-lg transition" style={view === v ? { background: "var(--brand)", color: "#fff" } : { color: "var(--mute)" }}><Icon size={16} /></button>)}</div>
              </div>
            </div>
            {shown.length === 0 ? (
              <div className="br-card grid place-items-center rounded-2xl py-16 text-center"><p className="br-display text-base font-bold">No bikes match these filters</p><p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Try widening your price range or clearing a few filters.</p></div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>{shown.map((b) => <BikeCard key={b.id} bike={b} view={view} wished={wishlist?.has(b.id)} onWish={() => onWish(b.id)} onView={() => onView(b)} inCompare={compare?.has(b.id)} onCompare={() => onCompare(b.id)} compareFull={compare?.size >= COMPARE_MAX && !compare?.has(b.id)} />)}</div>
            )}
            {/* one paginator: progressive "load more" (keeps filters/sort applied) */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="h-1 w-40 overflow-hidden rounded-full" style={{ background: "var(--form-bg)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((shown.length / Math.max(1, filtered.length)) * 100)}%`, background: "linear-gradient(90deg,var(--brand),var(--brand-2))" }} />
              </div>
              <p className="text-xs" style={{ color: "var(--mute)" }}>Showing <span className="font-semibold" style={{ color: "var(--ink)" }}>{shown.length}</span> of {filtered.length} bikes</p>
              {visible < filtered.length
                ? <button onClick={() => setVisible((v) => v + 6)} className="br-ghost br-display mt-1 rounded-xl px-6 py-3 text-sm font-semibold">Load more bikes</button>
                : filtered.length > 0 && <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand)" }}><Check size={14} /> You've seen every match</p>}
            </div>
          </section>
        </div>
      </div>
      {drawer && (
        <div className="fixed inset-0 lg:hidden" style={{ zIndex: 60 }}><div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} /><div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col shadow-2xl" style={{ background: "var(--page)" }}><div className="flex items-center justify-between bg-white px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}><span className="br-display text-base font-bold">Filters</span><button className="grid h-9 w-9 place-items-center rounded-lg br-ghost" onClick={() => setDrawer(false)}><X size={18} /></button></div><div className="flex-1 overflow-y-auto p-4"><FilterPanel f={f} setF={setF} onClear={() => setF(emptyFilters())} /></div></div></div>
      )}
    </>
  );
}
