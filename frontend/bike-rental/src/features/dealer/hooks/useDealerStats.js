// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo } from "react";
import { MONTHS, PERIODS } from "../../../constants";
import { hasOpenDispute } from "../../../lib/deposit.js";
import { dealerCut } from "../utils";

export function useDealerStats(rentals, listings, periodKey, bikeId) {
  return useMemo(() => {
    const now = new Date();
    const period = PERIODS.find((x) => x.k === periodKey) || PERIODS[0];
    const from = period.days ? new Date(now.getTime() - period.days * 864e5) : new Date(0);
    const prevFrom = period.days ? new Date(from.getTime() - period.days * 864e5) : null;
    const endOf = (r) => new Date(`${r.ed}T00:00`);
    const inRange = (r, a, b) => { const d = endOf(r); return d >= a && d <= b; };

    // bike filter applies to everything; date filter applies to earnings only
    const scoped = rentals.filter((r) => (bikeId === "all" ? true : String(r.bike?.id) === String(bikeId)));
    const earned = scoped.filter((r) => r.status === "Completed" && inRange(r, from, now));
    const prevEarned = prevFrom ? scoped.filter((r) => r.status === "Completed" && inRange(r, prevFrom, from)) : [];

    const bucket = { paid: 0, processing: 0, upcoming: 0, hold: 0 };
    let total = 0, bookedDays = 0;
    earned.forEach((r) => {
      const amt = dealerCut(r); const st = r.settlement;
      bookedDays += r.days || 0;
      if (hasOpenDispute(st)) bucket.hold += amt;
      else if (st && st.status === "released") { bucket.paid += amt; total += amt; }
      else bucket.processing += amt;
    });
    scoped.filter((r) => r.status === "Upcoming" || r.status === "Ongoing").forEach((r) => { bucket.upcoming += dealerCut(r); });

    const periodTotal = bucket.paid + bucket.processing + bucket.hold;
    const prevTotal = prevEarned.reduce((a, r) => a + dealerCut(r), 0);
    const delta = prevTotal > 0 ? Math.round(((periodTotal - prevTotal) / prevTotal) * 100) : null;

    // chart buckets: weekly for short ranges, monthly for long
    const weekly = (period.days || 400) <= 90;
    const buckets = [];
    if (weekly) {
      const n = Math.max(2, Math.ceil((period.days || 30) / 7));
      for (let i = n - 1; i >= 0; i--) {
        const b = new Date(now.getTime() - i * 7 * 864e5);
        buckets.push({ key: `w${i}`, label: `${b.getDate()} ${MONTHS[b.getMonth()]}`, total: 0, from: new Date(b.getTime() - 7 * 864e5), to: b });
      }
    } else {
      const n = Math.min(12, Math.round((period.days || 365) / 30));
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()], total: 0, from: d, to: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59) });
      }
    }
    earned.forEach((r) => { const d = endOf(r); const b = buckets.find((x) => d >= x.from && d <= x.to); if (b) b.total += dealerCut(r); });

    // earnings by bike (respects the date filter, ignores the bike filter so the ranking stays comparable)
    const byBikeMap = {};
    rentals.filter((r) => r.status === "Completed" && inRange(r, from, now)).forEach((r) => {
      const id = r.bike?.id; if (!id) return;
      byBikeMap[id] = byBikeMap[id] || { bike: r.bike, total: 0, trips: 0 };
      byBikeMap[id].total += dealerCut(r); byBikeMap[id].trips++;
    });
    const byBike = Object.values(byBikeMap).sort((a, b) => b.total - a.total);

    const live = listings.filter((l) => l.status === "Live").length;
    const denomDays = period.days || 365;
    const util = live > 0 ? Math.min(99, Math.round((bookedDays / (live * denomDays)) * 100)) : 0;
    const nextPayout = new Date(now); nextPayout.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
    const cancelledAll = scoped.filter((r) => r.status === "Cancelled").length;

    return {
      periodLabel: period.label, total: bucket.paid, periodTotal, delta, bucket, byBike,
      nextPayoutAmt: bucket.processing, nextPayoutDate: nextPayout,
      // action items are intentionally NOT date-filtered — a to-do can't expire
      awaitingInspection: rentals.filter((r) => r.status === "Completed" && r.settlement?.status === "held").length,
      openDisputes: rentals.filter((r) => hasOpenDispute(r.settlement)).length,
      upcomingPickups: rentals.filter((r) => r.status === "Upcoming").length,
      rejected: listings.filter((l) => l.status === "Rejected").length,
      live, pending: listings.filter((l) => l.status === "Pending approval").length,
      util, months: buckets, tripCount: earned.length,
      rating: (scoped.reduce((a, r) => a + (r.bike?.rating || 0), 0) / Math.max(1, scoped.length)).toFixed(1),
      cancelRate: scoped.length ? ((cancelledAll / scoped.length) * 100).toFixed(1) : "0.0",
    };
  }, [rentals, listings, periodKey, bikeId]);
}
