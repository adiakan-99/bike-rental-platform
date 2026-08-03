// UPDATED for bike-service. Only the FLEET tab changed — dashboard and bookings
// are untouched, since those depend on booking-service which isn't built yet.
//
// WHAT CHANGED
//
// 1. Fleet now has loading and error states. Previously `listings` arrived
//    instantly from a seed array, so there was nothing to wait for.
//
// 2. Real photos. The old card passed `bike={{ cat: l.cat }}` — deliberately
//    throwing away the image so it always drew the category gradient.
//
// 3. Status controls are live. The backend tracks bikeStatus separately from
//    approvalStatus, so an approved partner can take a bike off the road for
//    maintenance without losing approval. That control didn't exist before.
//
// 4. Delete is wired.
//
// NOTE ON "Resubmit": that button needs the full PUT /partner/{id}, which needs
// the complete listing payload — that's Step 6. It's disabled with a tooltip
// until then rather than silently doing nothing.
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Clock3, Gauge, Pencil, PlusCircle, RefreshCw, Search, Trash2, Upload, X, XCircle } from "lucide-react";
import { BOOK_FILTERS, LISTING_STATUS } from "../../../constants";
import { fmtDay, hoursLeft } from "../../../lib/datetime.js";
import { depositLabel, hasOpenDispute } from "../../../lib/deposit.js";
import { inr } from "../../../lib/money.js";
import { BikeImage, Chip, EmptyList, StatusTag } from "../../../ui";
import { AddBikeForm, DealerDashboard, RecordInspection, ResubmitModal, StatusPill } from "../components";

// The backend's four bikeStatus values. RENTED is omitted deliberately — it's set
// by the booking flow, not by the partner clicking a button.
const STATUS_ACTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "INACTIVE", label: "Inactive" },
];

// Colours for the statuses fleetStatusLabel() can now produce beyond the
// original four in LISTING_STATUS.
const EXTRA_STATUS = {
  Maintenance: { fg: "#b45309", bg: "#fef3c7" },
  Rented: { fg: "#1d4ed8", bg: "#dbeafe" },
  Inactive: { fg: "#334155", bg: "var(--form-bg)" },
};

export function DealerPortal({
  session, rentals, onInspect, listings = [], fleetLoading = false, fleetError = null,
  onRefreshFleet, onSetBikeStatus, onDeleteListing,
  onListBike, onEditListing, onSetListingStatus, onRegister, onBrowse, onHome, portalTab,
}) {
  const approved = session?.approvalStatus === "APPROVED";
  const [sel, setSel] = useState(null);
  const [editing, setEditing] = useState(null);
  const [resubmit, setResubmit] = useState(null);
  const [dTab, setDTab] = useState("dashboard");
  const [bookFilter, setBookFilter] = useState("all");
  const [fleetFilter, setFleetFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null); // listing currently mid-request

  const goTab = (tab, filter = "all") => {
    setDTab(tab);
    if (tab === "bookings") setBookFilter(filter);
    if (tab === "fleet") setFleetFilter(filter);
    setSel(null); setAdding(false); setEditing(null); setResubmit(null);
  };
  useEffect(() => { if (portalTab?.tab) goTab(portalTab.tab); }, [portalTab]);

  const selected = sel && rentals.find((r) => r.id === sel);
  const bookF = BOOK_FILTERS.find((x) => x.k === bookFilter) || BOOK_FILTERS[0];
  const shownBookings = rentals.filter(bookF.test);
  const chipFor = (r) => {
    const s = r.settlement;
    if (s && hasOpenDispute(s)) return { text: "Dispute open", fg: "#1d4ed8", bg: "#dbeafe" };
    if (s && s.status === "pending_settlement") return { text: `Settling in ${hoursLeft(s.settlementDueAt)}h`, fg: "#c2410c", bg: "#ffedd5" };
    if (s && s.status === "released") return { text: "Settled", fg: "#15803d", bg: "#dcfce7" };
    return null;
  };

  const changeStatus = async (id, value) => {
    setBusyId(id);
    try { await onSetBikeStatus?.(id, value); } finally { setBusyId(null); }
  };

  const removeListing = async (l) => {
    if (!window.confirm(`Delete ${l.name} (${l.reg}) from your fleet? This can't be undone.`)) return;
    setBusyId(l.id);
    try { await onDeleteListing?.(l.id); } finally { setBusyId(null); }
  };

  if (!approved) {
    const rejected = session?.approvalStatus === "REJECTED";
    return (
      <div className="fixed inset-0 grid place-items-center px-4 py-6" style={{ zIndex: 60 }}>
        <div className="absolute inset-0" style={{ background: "rgba(15,39,51,.5)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)" }} />
        <div className="br-card br-fade-up relative w-full max-w-md rounded-2xl p-6 text-center shadow-2xl sm:p-8">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: rejected ? "#fee2e2" : "#fef3c7" }}>
            {rejected ? <XCircle size={32} style={{ color: "#b91c1c" }} /> : <Clock3 size={32} style={{ color: "#b45309" }} />}
          </span>
          <h1 className="br-serif mt-4 text-2xl font-bold">{rejected ? "Application not approved" : "Partner account under review"}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>
            {rejected
              ? "Your partner application wasn't approved. Our team will have emailed the reason and the documents to correct."
              : <>Thanks for registering as a partner, {session?.name?.split(" ")[0] || "there"}. An admin is reviewing your documents — the dealer portal and bike listings unlock once you're approved.</>}
          </p>
          <div className="mt-5 flex flex-col gap-2 rounded-xl p-4 text-left" style={{ background: "var(--form-bg)" }}>
            {[["Registration received", true], ["Documents under review", !rejected], ["Portal & listings unlocked", false]].map(([label, done], i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: done ? "var(--brand)" : "#fff", border: done ? "none" : "1.5px solid var(--line)" }}>
                  {done ? <Check size={12} className="text-white" /> : <span className="text-[11px] font-bold" style={{ color: "var(--mute)" }}>{i + 1}</span>}
                </span>
                <span style={{ color: done ? "var(--ink)" : "var(--mute)" }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 br-display text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Meanwhile</p>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>You can still browse and rent bikes with this same account, just like any rider.</p>
          <button onClick={onBrowse} className="br-btn br-display mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"><Search size={16} /> Browse &amp; rent bikes</button>
          <button onClick={onHome} className="br-ghost br-display mt-2.5 w-full rounded-xl py-2.5 text-sm font-semibold">Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {dTab === "dashboard" && <h1 className="br-serif text-3xl font-bold sm:text-[32px]">Partner Dashboard</h1>}

      {dTab === "dashboard" && (
        <div className="mt-6">
          <DealerDashboard rentals={rentals} listings={listings} session={session} onGoBookings={(f) => goTab("bookings", f)} onGoFleet={(f) => goTab("fleet", f)} onAddBike={() => { goTab("fleet"); setAdding(true); }} />
        </div>
      )}

      {dTab === "fleet" && (
        editing
          ? <div className="mt-6">
              <AddBikeForm
                key={editing}
                initial={listings.find((l) => l.id === editing)}
                onCancel={() => setEditing(null)}
                onSubmit={(patch) => { onEditListing?.(editing, patch); setEditing(null); }}
              />
            </div>
          : adding
          ? <div className="mt-6"><AddBikeForm onCancel={() => setAdding(false)} onSubmit={(l) => { onListBike(l); setAdding(false); }} /></div>
          : (
            <div className="mt-6">
              <button onClick={() => goTab("dashboard")} className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"><ChevronLeft size={16} /> Back to dashboard</button>

              <div className="mb-4 flex items-center justify-between">
                <h2 className="br-display text-lg font-bold">
                  My Fleet
                  {!fleetLoading && listings.length > 0 && (
                    <span className="ml-2 text-sm font-normal" style={{ color: "var(--mute)" }}>{listings.length} bikes</span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={onRefreshFleet} disabled={fleetLoading} aria-label="Refresh fleet" className="br-ghost grid h-10 w-10 place-items-center rounded-xl">
                    <RefreshCw size={15} className={fleetLoading ? "animate-spin" : undefined} />
                  </button>
                  <button onClick={() => setAdding(true)} className="br-btn br-display flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
                    <PlusCircle size={16} /> Add a bike
                  </button>
                </div>
              </div>

              {fleetError && (
                <div className="br-card mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm" style={{ color: "#b91c1c" }}>
                  <span>{fleetError}</span>
                  <button onClick={onRefreshFleet} className="br-ghost br-display rounded-lg px-3 py-1.5 text-xs font-semibold">Retry</button>
                </div>
              )}

              {fleetFilter !== "all" && (
                <div className="mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: "var(--form-bg)" }}>
                  <span style={{ color: "#3a4d55" }}>Showing <span className="font-semibold">{fleetFilter === "rejected" ? "rejected listings" : fleetFilter}</span></span>
                  <button onClick={() => setFleetFilter("all")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><X size={12} /> Clear</button>
                </div>
              )}

              {fleetLoading && listings.length === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="br-card h-64 animate-pulse rounded-2xl" style={{ background: "var(--form-bg)" }} />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <EmptyList label="No bikes listed yet" />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {listings
                    .filter((l) => fleetFilter === "all" || (fleetFilter === "rejected" && l.status === "Rejected"))
                    .map((l) => {
                      const meta = LISTING_STATUS[l.status] || EXTRA_STATUS[l.status] || LISTING_STATUS.Draft;
                      const busy = busyId === l.id;
                      // Status can only be changed once the listing is approved —
                      // a pending bike has no road status to toggle.
                      const canChangeStatus = l.approvalStatus === "APPROVED" && l.bikeStatus !== "RENTED";
                      return (
                        <div key={l.id} className="br-card overflow-hidden rounded-2xl shadow-sm" style={busy ? { opacity: 0.6 } : undefined}>
                          <BikeImage bike={l} className="h-24" />
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="br-display truncate text-sm font-bold">{l.name}</p>
                                <p className="text-xs" style={{ color: "var(--mute)" }}>{l.mf} · {l.reg}</p>
                              </div>
                              <StatusTag meta={{ label: l.status, fg: meta.fg, bg: meta.bg }} />
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <Chip>{l.cat}</Chip>
                              <Chip><Gauge size={12} />{l.cc ? `${l.cc}cc` : "EV"}</Chip>
                              <Chip>{inr(l.price)}/day</Chip>
                              <Chip>{l.deposit === 0 ? "No deposit" : `${inr(l.deposit)} dep.`}</Chip>
                            </div>

                            {l.note && (
                              <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "#fee2e2", color: "#b91c1c" }}>{l.note}</p>
                            )}

                            {canChangeStatus && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs" style={{ color: "var(--mute)" }}>Status</span>
                                <select
                                  value={l.bikeStatus}
                                  disabled={busy}
                                  onChange={(e) => changeStatus(l.id, e.target.value)}
                                  className="br-input flex-1 text-xs font-semibold"
                                >
                                  {STATUS_ACTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                              </div>
                            )}
                            {l.bikeStatus === "RENTED" && (
                              <p className="mt-3 text-xs" style={{ color: "var(--mute)" }}>Currently rented — status locked until return.</p>
                            )}

                            <div className="mt-3 flex gap-2">
                              <button onClick={() => setEditing(l.id)} disabled={busy} className="br-ghost br-display flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold">
                                <Pencil size={12} /> Edit
                              </button>
                              {l.status === "Rejected" && (
                                <button
                                  disabled
                                  title="Resubmitting needs the full listing update — coming with the Add Bike form"
                                  className="br-ghost br-display flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold"
                                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                                >
                                  <Upload size={12} /> Resubmit
                                </button>
                              )}
                              <button onClick={() => removeListing(l)} disabled={busy} aria-label="Delete listing" className="br-ghost grid w-10 place-items-center rounded-lg" style={{ color: "#b91c1c" }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )
      )}

      {dTab === "bookings" && <div className="mt-6">
        {selected ? (
          <RecordInspection rental={selected} onBack={() => setSel(null)} onSubmit={onInspect} />
        ) : (
          <>
            <button onClick={() => goTab("dashboard")} className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"><ChevronLeft size={16} /> Back to dashboard</button>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="br-display text-lg font-bold">Bookings</h2>
              <div className="flex flex-wrap gap-1.5">
                {BOOK_FILTERS.map((f) => {
                  const n = rentals.filter(f.test).length;
                  return <button key={f.k} onClick={() => setBookFilter(f.k)} className={`br-filter-chip br-display flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${bookFilter === f.k ? "br-filter-chip-active" : ""}`}>{f.label}<span className="rounded-full px-1.5 text-[10px]" style={{ background: bookFilter === f.k ? "rgba(255,255,255,.35)" : "var(--form-bg)" }}>{n}</span></button>;
                })}
              </div>
            </div>
            {bookFilter !== "all" && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: "var(--form-bg)" }}>
                <span style={{ color: "#3a4d55" }}>Filtered by <span className="font-semibold">{BOOK_FILTERS.find((f) => f.k === bookFilter)?.label}</span></span>
                <button onClick={() => setBookFilter("all")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><X size={12} /> Clear</button>
              </div>
            )}
            {shownBookings.length === 0 && <EmptyList label={`No bookings match "${bookF.label}"`} />}
            <div className="flex flex-col gap-3">
              {shownBookings.map((r) => {
                const chip = chipFor(r);
                const needsInspection = r.status === "Completed" && (!r.settlement || (r.settlement.status === "held" && r.settlement.deductions.length === 0));
                return (
                  <div key={r.id} className="br-card flex flex-col gap-3 rounded-2xl p-4 shadow-sm sm:flex-row sm:items-center">
                    <BikeImage bike={r.bike} className="h-16 w-24 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="br-display text-sm font-bold">{r.bike.name}</p>
                        <StatusPill status={r.status} />
                        {chip && <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: chip.bg, color: chip.fg }}>{chip.text}</span>}
                      </div>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--mute)" }}>{r.id} · {r.regNo} · returned {fmtDay(r.ed)}</p>
                      <p className="mt-1 text-xs" style={{ color: "#3a4d55" }}>Deposit: <span className="font-semibold" style={{ color: depositLabel(r).tone }}>{depositLabel(r).text}</span></p>
                    </div>
                    {needsInspection
                      ? <button onClick={() => setSel(r.id)} className="br-btn br-display shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold">Record Inspection</button>
                      : <span className="shrink-0 text-xs" style={{ color: "var(--mute)" }}>{r.settlement && r.settlement.deductions.length > 0 ? "Inspection recorded" : "—"}</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>}

      {resubmit && <ResubmitModal listing={listings.find((l) => l.id === resubmit)} onClose={() => setResubmit(null)} onSubmit={(id, patch) => onSetListingStatus?.(id, "Pending approval", patch)} />}
    </div>
  );
}
