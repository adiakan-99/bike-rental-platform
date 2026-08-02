// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { PERIODS } from "../../../constants";
import { fmtDue } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { BikeImage } from "../../../ui";
import { useDealerStats } from "../hooks";
import { AttentionCard } from "./AttentionCard.jsx";
import { FleetBadge } from "./FleetBadge.jsx";
import { MoneyStat } from "./MoneyStat.jsx";
import { ProgressStat } from "./ProgressStat.jsx";
import { QuickAction } from "./QuickAction.jsx";
import { Segmented } from "./Segmented.jsx";
import { SmallKpi } from "./SmallKpi.jsx";

export function DealerDashboard({ rentals, listings, session, onGoBookings, onGoFleet, onAddBike }) {
  const [periodKey, setPeriodKey] = useState("30d");
  const [bikeId, setBikeId] = useState("all");
  const st = useDealerStats(rentals, listings, periodKey, bikeId);
  const bikeOptions = useMemo(() => {
    const seen = new Map();
    rentals.forEach((r) => { if (r.bike && !seen.has(r.bike.id)) seen.set(r.bike.id, r.bike); });
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [rentals]);
  const firstName = (session?.name || "there").split(" ")[0];
  const greeting = (() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })();
  const availableBalance = st.bucket.paid + st.bucket.processing;
  const money = [
    { value: inr(st.bucket.paid), label: "Paid Out", tone: "#16a34a" },
    { value: inr(st.bucket.processing), label: "Processing", tone: "var(--brand-strong)" },
    { value: inr(st.bucket.upcoming), label: "Upcoming", tone: "#d97706" },
    { value: inr(st.bucket.hold), label: "On Hold", tone: st.bucket.hold > 0 ? "#dc2626" : "var(--ink)" },
  ];
  const maxMonth = Math.max(1, ...st.months.map((m) => m.total));
  const hasEarnings = st.months.some((m) => m.total > 0);
  const respondRate = 98, respondPct = 98;

  return (
    <div className="flex flex-col gap-5">
      {/* 1 · Hero summary */}
      <div className="br-card overflow-hidden rounded-2xl shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: "linear-gradient(120deg,var(--brand) 0%,var(--brand-2) 100%)" }}>
          <div className="text-white">
            <p className="br-display text-lg font-semibold opacity-90">{greeting}, {firstName} 👋</p>
            <p className="br-serif mt-1 text-4xl font-bold leading-none">{inr(availableBalance)}</p>
            <p className="mt-1 text-sm opacity-85">Available balance</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { big: st.upcomingPickups, small: "Upcoming\nBookings" },
              { big: st.live, small: "Active\nBikes" },
              { big: `${st.rating}★`, small: "Avg\nRating" },
            ].map((c, i) => (
              <div key={i} className="rounded-xl px-3 py-2.5 text-center text-white" style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(4px)" }}>
                <p className="br-display text-xl font-bold leading-none">{c.big}</p>
                <p className="mt-1 whitespace-pre-line text-[11px] leading-tight opacity-90">{c.small}</p>
              </div>
            ))}
          </div>
        </div>
        {/* 11 · Quick actions — sit on a light strip so they read as separate from the banner */}
        <div className="flex flex-wrap gap-2 border-t p-3" style={{ borderColor: "var(--line)", background: "#fff" }}>
          <button onClick={onAddBike} className="br-display flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5" style={{ background: "#0f2733", boxShadow: "0 8px 18px -8px rgba(15,39,51,.55)" }}><PlusCircle size={16} /> Add Bike</button>
          <QuickAction icon="📅" label="View Bookings" onClick={() => onGoBookings("all")} />
          <QuickAction icon="🏍️" label="View Fleet" onClick={() => onGoFleet("all")} />
        </div>
      </div>

      {/* Period filter — segmented (8) + bike select */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented options={PERIODS} value={periodKey} onChange={setPeriodKey} />
        <div className="flex items-center gap-2">
          <span className="text-[13px]" style={{ color: "var(--mute)" }}>Bike</span>
          <div className="br-field rounded-xl px-3 py-2"><select value={bikeId} onChange={(e) => setBikeId(e.target.value)} className="br-input text-sm font-semibold"><option value="all">All bikes</option>{bikeOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        </div>
      </div>

      {/* 2 · Compact KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SmallKpi icon="💰" label="Earned" value={inr(st.periodTotal)} sub={`${st.tripCount} rentals · ${st.periodLabel}`} />
        <SmallKpi icon="📈" label="vs previous" value={st.delta === null ? "—" : `${st.delta >= 0 ? "+" : ""}${st.delta}%`} sub={st.delta === null ? "no prior data" : "same length before"} subTone={st.delta === null ? undefined : st.delta >= 0 ? "#16a34a" : "#dc2626"} />
        <SmallKpi icon="⏳" label="Pending" value={inr(st.bucket.processing)} sub="in dispute window" />
        <SmallKpi icon="🏦" label="Next payout" value={inr(st.nextPayoutAmt)} sub={fmtDue(st.nextPayoutDate).split(",")[0]} />
      </div>

      {/* 9 · Two-column desktop layout */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* 3 · Needs your attention */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Needs your attention</h2>
          <div className="grid grid-cols-2 gap-3">
            <AttentionCard icon="🔍" label="Awaiting Inspection" n={st.awaitingInspection} tone="#d97706" cta="Inspect" onClick={() => onGoBookings("inspection")} />
            <AttentionCard icon="⚠️" label="Open Disputes" n={st.openDisputes} tone="#dc2626" cta="Resolve" onClick={() => onGoBookings("disputes")} />
            <AttentionCard icon="📅" label="Upcoming Pickups" n={st.upcomingPickups} tone="#2563eb" cta="View" onClick={() => onGoBookings("upcoming")} />
            <AttentionCard icon="⛔" label="Listings Rejected" n={st.rejected} tone="#dc2626" cta="Review now" onClick={() => onGoFleet("rejected")} />
          </div>
        </section>

        {/* 4 · Fleet with coloured badges */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Fleet</h2>
          <div className="br-card rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <FleetBadge dot="#16a34a" label="Live" value={st.live} />
              <FleetBadge dot="#d97706" label="Pending" value={st.pending} />
              <FleetBadge dot="#dc2626" label="Rejected" value={st.rejected} />
            </div>
            <div className="mt-3"><ProgressStat label="Utilization (30d)" pct={st.util} /></div>
          </div>
        </section>

        {/* 5 · Performance as progress bars */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Performance</h2>
          <div className="br-card flex flex-col gap-3.5 rounded-2xl p-4 shadow-sm">
            <ProgressStat label="Response rate" pct={respondPct} display={`${respondRate}%`} color="linear-gradient(90deg,#16a34a,#22c55e)" />
            <ProgressStat label="Fleet utilization" pct={st.util} color="linear-gradient(90deg,var(--brand),var(--brand-2))" />
            <ProgressStat label="Avg. rating" pct={(Number(st.rating) / 5) * 100} display={`${st.rating} ★`} color="linear-gradient(90deg,#f59e0b,#fbbf24)" />
            <ProgressStat label="Cancellation rate" pct={Number(st.cancelRate)} display={`${st.cancelRate}%`} color="linear-gradient(90deg,#ef4444,#f87171)" />
          </div>
        </section>

        {/* 7 · Earnings chart with empty state */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Earnings trend</h2>
          <div className="br-card rounded-2xl p-4 shadow-sm">
            {!hasEarnings ? (
              <div className="grid place-items-center py-8 text-center">
                <span className="text-3xl" aria-hidden>📈</span>
                <p className="br-display mt-2 text-base font-bold">No earnings yet</p>
                <p className="mt-1 max-w-xs text-xs" style={{ color: "var(--mute)" }}>Once you complete rentals, your earnings trend will appear here.</p>
              </div>
            ) : (<>
              <div className="flex h-28 items-end gap-1.5">
                {st.months.map((m, i) => (
                  <div key={m.key} className="flex flex-1 flex-col items-center">
                    <div className="w-full rounded-t" style={{ height: `${Math.max(4, (m.total / maxMonth) * 88)}px`, background: i === st.months.length - 1 ? "linear-gradient(180deg,var(--brand-2),var(--brand))" : "var(--form-bg)", border: i === st.months.length - 1 ? "none" : "1px solid var(--line)" }} title={inr(m.total)} />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex gap-1.5 text-[10px]" style={{ color: "var(--mute)" }}>{st.months.map((m) => <span key={m.key} className="flex-1 text-center">{m.label}</span>)}</div>
            </>)}
          </div>
        </section>

        {/* 6 · Money as four equal stat cards */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Money</h2>
          <div className="br-card rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {money.map((m) => <MoneyStat key={m.label} value={m.value} label={m.label} tone={m.tone} />)}
            </div>
            {st.bucket.hold > 0 && <p className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}><AlertTriangle size={13} className="mt-0.5 shrink-0" /> {inr(st.bucket.hold)} is frozen by an open dispute until it's resolved.</p>}
          </div>
        </section>

        {/* Earnings by bike */}
        <section>
          <h2 className="br-display mb-2.5 text-lg font-bold">Earnings by bike</h2>
          <div className="br-card rounded-2xl p-4 shadow-sm">
            {st.byBike.length === 0 ? (
              <div className="grid place-items-center py-8 text-center">
                <span className="text-3xl" aria-hidden>🏍️</span>
                <p className="br-display mt-2 text-base font-bold">Nothing to rank yet</p>
                <p className="mt-1 text-xs" style={{ color: "var(--mute)" }}>Completed rentals in this period will rank your bikes here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {st.byBike.map((row, i) => {
                  const pct = Math.round((row.total / st.byBike[0].total) * 100);
                  return (
                    <button key={row.bike.id} onClick={() => setBikeId(String(row.bike.id))} className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition" style={String(bikeId) === String(row.bike.id) ? { background: "var(--form-bg)" } : undefined}>
                      <span className="br-display w-5 shrink-0 text-xs font-bold" style={{ color: "var(--mute)" }}>{i + 1}</span>
                      <BikeImage bike={row.bike} className="h-9 w-12 shrink-0 rounded-lg" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{row.bike.name}</span>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full" style={{ background: "var(--form-bg)" }}><span className="block h-full rounded-full" style={{ width: `${pct}%`, background: i === 0 ? "linear-gradient(90deg,var(--brand),var(--brand-2))" : "var(--line)" }} /></span>
                      </span>
                      <span className="shrink-0 text-right"><span className="br-display block text-sm font-bold">{inr(row.total)}</span><span className="block text-[11px]" style={{ color: "var(--mute)" }}>{row.trips} trip{row.trips > 1 ? "s" : ""}</span></span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
