// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronLeft, CircleDollarSign, Clock3, ImagePlus, PlusCircle, X } from "lucide-react";
import { DISPUTE_WINDOW_HOURS } from "../../../config";
import { fmtDue } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { BikeImage, CheckSection, Sum } from "../../../ui";

export function RecordInspection({ rental, onBack, onSubmit }) {
  const deposit = rental.settlement?.depositAmount || rental.deposit || 0;
  const [rows, setRows] = useState([]);
  const [warned, setWarned] = useState(false);
  const [done, setDone] = useState(null);

  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const over = total > deposit;
  const refund = Math.max(0, deposit - total);
  const hasDamages = rows.length > 0 && total > 0;
  const due = new Date(Date.now() + DISPUTE_WINDOW_HOURS * 3.6e6);
  const valid = !over && rows.every((r) => r.desc.trim() && Number(r.amount) > 0);

  const addRow = () => setRows((p) => [...p, { id: `d${p.length + 1}`, desc: "", amount: "", evidence: "" }]);
  const setRow = (i, k, v) => setRows((p) => p.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const submit = () => {
    if (!valid) return;
    if (!warned) { setWarned(true); return; }
    const deductions = rows.map((r) => ({ id: r.id, desc: r.desc.trim(), amount: Number(r.amount), evidence: r.evidence.trim() || null, status: "applied" }));
    onSubmit(rental.id, deductions);
    setDone(hasDamages ? { type: "pending", due, refund } : { type: "released", refund: deposit });
  };

  if (done) return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <span className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: done.type === "released" ? "#16a34a" : "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>{done.type === "released" ? <CheckCircle2 size={34} /> : <Clock3 size={32} />}</span>
      <h2 className="br-serif mt-4 text-2xl font-bold">{done.type === "released" ? "Deposit refunded" : "Inspection recorded"}</h2>
      <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>
        {done.type === "released"
          ? `No damages recorded — ${inr(done.refund)} has been refunded to the renter.`
          : <>Renter has until <span className="br-display font-bold" style={{ color: "var(--ink)" }}>{fmtDue(done.due)}</span> to dispute. {inr(done.refund)} settles automatically after that.</>}
      </p>
      <button onClick={onBack} className="br-btn br-display mt-6 rounded-xl px-6 py-3 text-sm font-semibold">Back to bookings</button>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"><ChevronLeft size={16} /> Back to bookings</button>
      <div className="flex items-center gap-3">
        <BikeImage bike={rental.bike} className="h-14 w-20 shrink-0 rounded-xl" />
        <div>
          <h2 className="br-display text-lg font-bold">{rental.bike.name}</h2>
          <p className="text-xs" style={{ color: "var(--mute)" }}>{rental.id} · {rental.regNo} · deposit {inr(deposit)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <CheckSection title="Damages" icon={AlertTriangle} right={<span className="text-xs" style={{ color: "var(--mute)" }}>{rows.length === 0 ? "None recorded" : `${inr(total)} of ${inr(deposit)}`}</span>}>
          {rows.length === 0 && <p className="text-sm" style={{ color: "var(--mute)" }}>No damages recorded. Submitting now refunds the full deposit immediately.</p>}
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: "var(--form-bg)" }}>
                <div className="grid gap-2 sm:grid-cols-[1fr_130px]">
                  <div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}><input value={r.desc} onChange={(e) => setRow(i, "desc", e.target.value)} placeholder="Describe the damage" className="br-input w-full text-sm" /></div>
                  <div className="br-field flex items-center gap-1 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}><span className="text-sm" style={{ color: "var(--mute)" }}>₹</span><input type="number" min={0} value={r.amount} onChange={(e) => setRow(i, "amount", e.target.value)} placeholder="Cost" className="br-input w-full text-sm" /></div>
                </div>
                <div className="mt-2 flex gap-2">
                  <div className="br-field flex flex-1 items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#fff" }}><ImagePlus size={14} style={{ color: "var(--brand)" }} /><input value={r.evidence} onChange={(e) => setRow(i, "evidence", e.target.value)} placeholder="Evidence file (optional)" className="br-input w-full text-xs" /></div>
                  <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl br-ghost"><X size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addRow} className="br-ghost br-display mt-3 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><PlusCircle size={15} /> Add damage</button>
          {over && <p className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> Deductions can't exceed the {inr(deposit)} deposit.</p>}
        </CheckSection>

        <CheckSection title="Settlement" icon={CircleDollarSign}>
          <div className="flex flex-col gap-2 text-sm">
            <Sum label="Deposit held" value={inr(deposit)} />
            <Sum label="Deductions" value={total > 0 ? `- ${inr(total)}` : "None"} color={total > 0 ? "#dc2626" : "#15803d"} />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#dcfce7" }}>
            <span className="br-display text-sm font-bold" style={{ color: "#15803d" }}>Refund to renter</span>
            <span className="br-display text-2xl font-bold" style={{ color: "#15803d" }}>{inr(refund)}</span>
          </div>
          {hasDamages && <p className="mt-2 flex items-start gap-1.5 rounded-xl px-3 py-2.5 text-xs" style={{ background: "#fef3c7", color: "#b45309" }}><Clock3 size={13} className="mt-0.5 shrink-0" /> Money doesn't move yet — the renter has {DISPUTE_WINDOW_HOURS}h (until {fmtDue(due)}) to dispute. Settlement is automatic after that.</p>}

          {warned && (
            <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#b91c1c" }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" /> <span>This inspection is one-time and <strong>can't be reopened</strong>. Press submit again to confirm.</span>
            </div>
          )}
          <button onClick={submit} disabled={!valid} className="br-btn br-display mt-4 w-full rounded-xl py-3 text-sm font-semibold" style={!valid ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>
            {hasDamages ? `Submit inspection — ${inr(refund)} refunds in ${DISPUTE_WINDOW_HOURS}h` : `Submit inspection — refund ${inr(deposit)} now`}
          </button>
        </CheckSection>
      </div>
    </div>
  );
}
