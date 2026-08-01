// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { AlertCircle, CheckCircle2, Clock3, Flag, ImagePlus, Info, Loader2, RefreshCw } from "lucide-react";
import { DEDUCTION_STATUS, DEPOSIT_STATUS } from "../../../constants";
import { useNow } from "../../../hooks";
import { fmtDue, hoursLeft } from "../../../lib/datetime.js";
import { appliedTotal, canDispute, hasOpenDispute, refundDue, windowOpen } from "../../../lib/deposit.js";
import { inr } from "../../../lib/money.js";
import { CheckSection, StatusTag, Sum } from "../../../ui";
import { timeAgo } from "../utils";

export function SettlementPanel({ settlement: s, onDispute }) {
  useNow(); // re-render so the countdown stays live
  const applied = appliedTotal(s.deductions);
  const onHold = s.deductions.filter((d) => d.status === "disputed").reduce((t, d) => t + d.amount, 0);
  const refund = refundDue(s);
  const open = windowOpen(s);
  const disputed = hasOpenDispute(s);
  const none = s.deductions.length === 0;

  const banner = none
    ? { bg: "#dcfce7", fg: "#15803d", icon: CheckCircle2, text: "Returned with no damages — your full deposit has been refunded." }
    : disputed
      ? { bg: "#dbeafe", fg: "#1d4ed8", icon: Loader2, text: "A charge is under review. Your refund is on hold until our team resolves the dispute." }
      : open
        ? { bg: "#fef3c7", fg: "#b45309", icon: Clock3, text: `You can dispute any charge until ${fmtDue(s.settlementDueAt)} (${hoursLeft(s.settlementDueAt)}h left). After that the refund is released automatically.` }
        : s.status === "released"
          ? { bg: "#dcfce7", fg: "#15803d", icon: CheckCircle2, text: "Settlement complete — your refund has been released to the original payment method." }
          : { bg: "var(--form-bg)", fg: "#334155", icon: Info, text: "The dispute window has closed. Your refund is being released." };

  return (
    <CheckSection title="Security Deposit Settlement" icon={RefreshCw} right={<StatusTag meta={DEPOSIT_STATUS[s.status]} />}>
      <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm" style={{ background: banner.bg, color: banner.fg }}>
        <banner.icon size={15} className="mt-0.5 shrink-0" /> <span>{banner.text}</span>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <Sum label="Deposit held" value={inr(s.depositAmount)} />
        {!none && <Sum label="Deductions applied" value={applied > 0 ? `- ${inr(applied)}` : "None"} color={applied > 0 ? "#dc2626" : "#15803d"} />}
        {onHold > 0 && <Sum label="Under review (not deducted yet)" value={inr(onHold)} color="#1d4ed8" tip="Disputed charges are excluded from your refund while our team reviews them. If a dispute is upheld the amount is deducted; if reversed it is refunded to you." />}
      </div>

      {!none && (
        <div className="mt-3 flex flex-col gap-2.5">
          {s.deductions.map((d) => {
            const rev = d.status === "reversed";
            return (
              <div key={d.id} className="rounded-xl px-3.5 py-3" style={{ background: "var(--form-bg)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: rev ? "var(--mute)" : "var(--ink)", textDecoration: rev ? "line-through" : "none" }}>{d.desc}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--mute)" }}>
                      {d.evidence
                        ? <a href="#" className="flex items-center gap-1 font-semibold" style={{ color: "var(--brand-strong)" }}><ImagePlus size={12} /> {d.evidence}</a>
                        : <span className="flex items-center gap-1"><AlertCircle size={12} /> No evidence attached</span>}
                      {d.disputedAt && <span className="flex items-center gap-1"><Clock3 size={12} /> Disputed {timeAgo(d.disputedAt)}</span>}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="br-display text-sm font-bold" style={{ color: rev ? "var(--mute)" : "var(--ink)", textDecoration: rev ? "line-through" : "none" }}>{inr(d.amount)}</span>
                    <StatusTag meta={DEDUCTION_STATUS[d.status]} />
                  </div>
                </div>
                {d.status === "disputed" && d.disputeReason && <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "#fff", color: "#3a4d55" }}><span className="font-semibold">Your dispute: </span>{d.disputeReason}</p>}
                {rev && d.resolutionNote && <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "#fff", color: "#3a4d55", borderLeft: "3px solid #16a34a" }}><span className="font-semibold" style={{ color: "#15803d" }}>Resolved in your favour: </span>{d.resolutionNote}</p>}
                {d.status === "applied" && d.resolutionNote && <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "#fff", color: "#3a4d55", borderLeft: "3px solid #dc2626" }}><span className="font-semibold" style={{ color: "#b91c1c" }}>Dispute rejected: </span>{d.resolutionNote}</p>}
                {canDispute(s, d) && (
                  <button onClick={() => onDispute(d)} className="br-display mt-2.5 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ border: "1px solid var(--line)", background: "#fff", color: "#334155" }}><Flag size={12} /> Dispute this charge</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 rounded-xl px-4 py-3" style={{ background: onHold > 0 ? "#dbeafe" : "#dcfce7" }}>
        <div className="flex items-center justify-between">
          <span className="br-display text-sm font-bold" style={{ color: onHold > 0 ? "#1d4ed8" : "#15803d" }}>{s.status === "released" ? "Refunded" : onHold > 0 ? "Refund on hold" : "Refund due"}</span>
          <span className="br-display text-2xl font-bold" style={{ color: onHold > 0 ? "#1d4ed8" : "#15803d" }}>{inr(refund)}</span>
        </div>
        {onHold > 0 && (
          <p className="mt-1.5 text-xs" style={{ color: "#1d4ed8" }}>
            You'll receive <strong>{inr(refund)}</strong> if the dispute is reversed, or <strong>{inr(refund - onHold)}</strong> if the charge is upheld. Nothing is paid out until it's resolved.
          </p>
        )}
      </div>
      {!none && open && onHold === 0 && <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--mute)" }}><Clock3 size={12} /> {hoursLeft(s.settlementDueAt)}h left to raise a dispute — after that this refund is released automatically.</p>}
    </CheckSection>
  );
}
