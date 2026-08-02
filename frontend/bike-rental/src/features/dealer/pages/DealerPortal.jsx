// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Clock3, Gauge, Pencil, PlusCircle, Search, Upload, X, XCircle } from "lucide-react";
import { BOOK_FILTERS, LISTING_STATUS } from "../../../constants";
import { fmtDay, hoursLeft } from "../../../lib/datetime.js";
import { depositLabel, hasOpenDispute } from "../../../lib/deposit.js";
import { inr } from "../../../lib/money.js";
import { BikeImage, Chip, EmptyList, StatusTag } from "../../../ui";
import { AddBikeForm, DealerDashboard, RecordInspection, ResubmitModal, StatusPill } from "../components";

export function DealerPortal({ session, rentals, onInspect, listings = [], onListBike, onEditListing, onSetListingStatus, onRegister, onBrowse, onHome, portalTab }) {
  const approved = session?.approvalStatus === "APPROVED";
  const [sel, setSel] = useState(null);
  const [editing, setEditing] = useState(null);   // listing id currently being edited
  const [resubmit, setResubmit] = useState(null); // listing id open in the resubmit modal
  const [dTab, setDTab] = useState("dashboard"); // dashboard | bookings | fleet
  const [bookFilter, setBookFilter] = useState("all"); // all | inspection | disputes | upcoming | settling
  const [fleetFilter, setFleetFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const goTab = (tab, filter = "all") => { setDTab(tab); if (tab === "bookings") setBookFilter(filter); if (tab === "fleet") setFleetFilter(filter); setSel(null); setAdding(false); setEditing(null); setResubmit(null); };
  // The profile menu can request a specific tab (e.g. "My fleet") on open.
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

  // Until an admin approves the account there is no portal to show — no fleet, no
  // bookings, no dashboard. The dealer uses the site as a customer in the meantime.
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
                <h2 className="br-display text-lg font-bold">My Fleet</h2>
                <button onClick={() => approved && setAdding(true)} disabled={!approved} title={approved ? undefined : "Your application is still under review"} className="br-btn br-display flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold" style={!approved ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}><PlusCircle size={16} /> Add a bike</button>
              </div>
              {fleetFilter !== "all" && (
                <div className="mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: "var(--form-bg)" }}>
                  <span style={{ color: "#3a4d55" }}>Showing <span className="font-semibold">{fleetFilter === "rejected" ? "rejected listings" : fleetFilter}</span></span>
                  <button onClick={() => setFleetFilter("all")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><X size={12} /> Clear</button>
                </div>
              )}
              {listings.length === 0 ? <EmptyList label="No bikes listed yet" /> : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {listings.filter((l) => fleetFilter === "all" || (fleetFilter === "rejected" && l.status === "Rejected")).map((l) => {
                    const meta = LISTING_STATUS[l.status] || LISTING_STATUS.Draft;
                    return (
                      <div key={l.id} className="br-card overflow-hidden rounded-2xl shadow-sm">
                        <BikeImage bike={{ cat: l.cat }} className="h-24" />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0"><p className="br-display truncate text-sm font-bold">{l.name}</p><p className="text-xs" style={{ color: "var(--mute)" }}>{l.mf} · {l.reg}</p></div>
                            <StatusTag meta={{ label: l.status, fg: meta.fg, bg: meta.bg }} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5"><Chip>{l.cat}</Chip><Chip><Gauge size={12} />{l.cc ? `${l.cc}cc` : "EV"}</Chip><Chip>{inr(l.price)}/day</Chip><Chip>{l.deposit === 0 ? "No deposit" : `${inr(l.deposit)} dep.`}</Chip></div>
                          {l.note && <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "#fee2e2", color: "#b91c1c" }}>{l.note}</p>}
                          <div className="mt-3 flex gap-2">
                            <button onClick={() => setEditing(l.id)} className="br-ghost br-display flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold"><Pencil size={12} /> Edit</button>
                            {l.status === "Rejected" && <button onClick={() => setResubmit(l.id)} className="br-btn br-display flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold"><Upload size={12} /> Resubmit Details</button>}
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
