// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { Bike, Heart, LifeBuoy, Search, SlidersHorizontal } from "lucide-react";
import { RENTAL_STATUS, RH_SORTS } from "../../../constants";
import { fmtDay } from "../../../lib/datetime.js";
import { hasOpenDispute } from "../../../lib/deposit.js";
import { SuspendedBanner } from "../../../ui";
import { RentalCard, StatKpi } from "../components";

export function RentalHistoryPage({ rentals, onView, onBook, onExplore, onCancel, onReview, onReport, onWishlist, onSupport, suspended = false }) {
  const all = rentals;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [city, setCity] = useState("All");
  const [dealerF, setDealerF] = useState("All");
  const [depositF, setDepositF] = useState("All");
  const [cat, setCat] = useState("All");
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [sort, setSort] = useState("recent");
  const [visible, setVisible] = useState(6);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const nextUpcoming = useMemo(() => all.filter((r) => r.status === "Upcoming").sort((a, b) => a.sd.localeCompare(b.sd))[0], [all]);
  const counts = useMemo(() => ({
    Total: all.length,
    Upcoming: all.filter((r) => r.status === "Upcoming").length,
    Ongoing: all.filter((r) => r.status === "Ongoing").length,
    Completed: all.filter((r) => r.status === "Completed").length,
    Cancelled: all.filter((r) => r.status === "Cancelled").length,
    RefundPending: all.filter((r) => r.settlement && r.settlement.status === "pending_settlement").length,
    avgRating: (() => { const done = all.filter((r) => r.status === "Completed" && r.bike?.rating); return done.length ? (done.reduce((a, r) => a + r.bike.rating, 0) / done.length).toFixed(1) : null; })(),
    thisMonth: all.filter((r) => { const d = new Date(r.bookingDate); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length,
  }), [all]);

  const cities = useMemo(() => ["All", ...new Set(all.map((r) => r.city))], [all]);
  const dealers = useMemo(() => ["All", ...new Set(all.map((r) => r.dealer.name))], [all]);
  const cats = useMemo(() => ["All", ...new Set(all.map((r) => r.bike.cat))], [all]);
  const activeFilters = [status !== "All", city !== "All", dealerF !== "All", depositF !== "All", cat !== "All", !!from, !!to].filter(Boolean).length;
  const resetFilters = () => { setStatus("All"); setCity("All"); setDealerF("All"); setDepositF("All"); setCat("All"); setFrom(""); setTo(""); };

  const filtered = useMemo(() => {
    let list = all.filter((r) => {
      const hay = `${r.bike.name} ${r.dealer.name} ${r.id}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (status !== "All" && r.status !== status) return false;
      if (city !== "All" && r.city !== city) return false;
      if (dealerF !== "All" && r.dealer.name !== dealerF) return false;
      if (depositF !== "All") {
        const st = r.settlement;
        if (depositF === "pending" && !(st && st.status === "pending_settlement")) return false;
        if (depositF === "disputed" && !hasOpenDispute(st)) return false;
        if (depositF === "awaiting" && !(st && st.status === "held" && r.status === "Completed")) return false;
        if (depositF === "released" && !(st && st.status === "released")) return false;
      }
      if (cat !== "All" && r.bike.cat !== cat) return false;
      if (from && r.sd < from) return false;
      if (to && r.sd > to) return false;
      return true;
    });
    const rank = { Upcoming: 0, Ongoing: 1, Completed: 2, Cancelled: 3 };
    const sorters = {
      recent: (a, b) => b.bookingDate.localeCompare(a.bookingDate),
      oldest: (a, b) => a.bookingDate.localeCompare(b.bookingDate),
      high: (a, b) => b.amount - a.amount,
      low: (a, b) => a.amount - b.amount,
      upcoming: (a, b) => rank[a.status] - rank[b.status] || a.sd.localeCompare(b.sd),
    };
    return [...list].sort(sorters[sort]);
  }, [all, q, status, city, dealerF, depositF, cat, from, to, sort]);

  const shown = filtered.slice(0, visible);
  const Sel = ({ value, onChange, options, label }) => (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>{label}</label>
      <div className="br-field rounded-xl px-3 py-2.5"><select value={value} onChange={(e) => onChange(e.target.value)} className="br-input w-full text-sm">{options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}</select></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {suspended && <SuspendedBanner />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="br-serif text-3xl font-bold sm:text-[32px]">My Rentals</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>{suspended ? "Your past bookings stay visible here while the account is under review." : "View and manage all your bike rentals in one place."}</p>
        </div>
        {/* 12 · Quick actions */}
        {!suspended && (
          <div className="flex flex-wrap gap-2">
            <button onClick={onExplore} className="br-btn br-display flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"><Bike size={14} /> Browse Bikes</button>
            <button onClick={onWishlist} className="br-ghost br-display flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"><Heart size={14} /> Wishlist</button>
            <button onClick={onSupport} className="br-ghost br-display flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"><LifeBuoy size={14} /> Support</button>
          </div>
        )}
      </div>

      {/* 1 · Rich KPI cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatKpi icon="🚲" label="Total Rentals" value={counts.Total} sub={counts.thisMonth ? `+${counts.thisMonth} this month` : "—"} color="var(--brand)" active={status === "All" && depositF === "All"} onClick={() => { setStatus("All"); setDepositF("All"); }} />
        <StatKpi icon="🟠" label="Ongoing" value={counts.Ongoing} sub={counts.Ongoing ? "In progress now" : "None active"} color={RENTAL_STATUS.Ongoing.dot} active={status === "Ongoing"} onClick={() => { setStatus(status === "Ongoing" ? "All" : "Ongoing"); setDepositF("All"); }} />
        <StatKpi icon="📅" label="Upcoming" value={counts.Upcoming} sub={nextUpcoming ? `Next ${fmtDay(nextUpcoming.sd)}` : "None booked"} color={RENTAL_STATUS.Upcoming.dot} active={status === "Upcoming"} onClick={() => { setStatus(status === "Upcoming" ? "All" : "Upcoming"); setDepositF("All"); }} />
        <StatKpi icon="⭐" label="Completed" value={counts.Completed} sub={counts.avgRating ? `${counts.avgRating} avg rating` : "—"} color={RENTAL_STATUS.Completed.dot} active={status === "Completed"} onClick={() => { setStatus(status === "Completed" ? "All" : "Completed"); setDepositF("All"); }} />
      </div>

      {/* 6+7 · Search with collapsible filter drawer */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="br-field flex flex-1 items-center gap-2 rounded-xl px-3.5 py-3"><Search size={16} style={{ color: "var(--brand)" }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rentals…" className="br-input w-full text-sm" /></div>
        <button onClick={() => setFiltersOpen((o) => !o)} className="br-display flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold" style={filtersOpen || activeFilters ? { background: "var(--brand)", color: "#fff" } : { background: "#fff", color: "#334155", border: "1px solid var(--line)" }}>
          <SlidersHorizontal size={15} /> Filter{activeFilters ? <span className="rounded-full px-1.5 text-[11px] font-bold" style={{ background: "rgba(255,255,255,.3)" }}>{activeFilters}</span> : null}
        </button>
        <div className="br-field rounded-xl px-3 py-2.5 sm:w-44"><select value={sort} onChange={(e) => setSort(e.target.value)} className="br-input w-full text-sm">{Object.entries(RH_SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      </div>

      {filtersOpen && (
        <div className="br-card br-fade-up mt-3 rounded-2xl p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <Sel label="Status" value={status} onChange={setStatus} options={["All", "Upcoming", "Ongoing", "Completed", "Cancelled"]} />
            <Sel label="Deposit" value={depositF} onChange={setDepositF} options={[{ v: "All", l: "All deposits" }, { v: "awaiting", l: "Awaiting inspection" }, { v: "pending", l: "Refund pending" }, { v: "disputed", l: "Under review" }, { v: "released", l: "Refunded" }]} />
            <Sel label="City" value={city} onChange={setCity} options={cities} />
            <Sel label="Dealer" value={dealerF} onChange={setDealerF} options={dealers} />
            <Sel label="Category" value={cat} onChange={setCat} options={cats} />
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Date Range</label>
              <div className="flex gap-2">
                <div className="br-field flex-1 rounded-xl px-2 py-2.5"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="br-dt w-full text-xs" /></div>
                <div className="br-field flex-1 rounded-xl px-2 py-2.5"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="br-dt w-full text-xs" /></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
            <button onClick={resetFilters} className="br-ghost br-display rounded-xl px-5 py-2 text-sm font-semibold">Reset</button>
            <button onClick={() => setFiltersOpen(false)} className="br-btn br-display rounded-xl px-6 py-2 text-sm font-semibold">Apply</button>
          </div>
        </div>
      )}

      {/* list */}
      <div className="mt-5">
        {all.length === 0 ? (
          <div className="br-card grid place-items-center rounded-2xl py-16 text-center">
            <span className="text-4xl" aria-hidden>🚲</span>
            <p className="br-display mt-3 text-lg font-bold">No rentals yet</p>
            <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Explore bikes nearby and your rides will show up here.</p>
            {!suspended && <button onClick={onExplore} className="br-btn br-display mt-5 rounded-xl px-6 py-3 text-sm font-semibold">Browse Bikes</button>}
          </div>
        ) : filtered.length === 0 ? (
          <div className="br-card grid place-items-center rounded-2xl py-14 text-center">
            <span className="text-4xl" aria-hidden>🔍</span>
            <p className="br-display mt-3 font-bold">No rentals match your filters</p>
            <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Try clearing the search or resetting filters.</p>
            {activeFilters > 0 && <button onClick={resetFilters} className="br-ghost br-display mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold">Reset filters</button>}
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm" style={{ color: "var(--mute)" }}>Showing {shown.length} of {filtered.length} rentals</p>
            <div className="flex flex-col gap-3">{shown.map((r) => <RentalCard key={r.id} r={r} readOnly={suspended} onView={onView} onBook={onBook} onCancel={onCancel} onReview={onReview} onReport={onReport} />)}</div>
            {visible < filtered.length && <div className="mt-6 flex justify-center"><button onClick={() => setVisible((v) => v + 4)} className="br-ghost br-display rounded-xl px-6 py-3 text-sm font-semibold">Load More Rentals</button></div>}
          </>
        )}
      </div>
    </div>
  );
}
