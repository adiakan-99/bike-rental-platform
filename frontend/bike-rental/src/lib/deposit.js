// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { inr } from "./money.js";

export const appliedTotal = (ded = []) => ded.filter((d) => d.status === "applied").reduce((s, d) => s + d.amount, 0);

export const refundDue = (s) => (s ? Math.max(0, s.depositAmount - appliedTotal(s.deductions)) : 0);

export const hasOpenDispute = (s) => !!s && s.deductions.some((d) => d.status === "disputed");

export const windowOpen = (s) => !!s && s.status === "pending_settlement" && s.settlementDueAt > new Date();

export const canDispute = (s, d) => d.status === "applied" && windowOpen(s);

export function depositLabel(rental) {
  const s = rental.settlement;
  if (!rental.deposit) return { text: "—", tone: "var(--mute)" };
  if (!s) return { text: `${inr(rental.deposit)} held`, tone: "#334155" };
  if (s.status === "released") return { text: `${inr(refundDue(s))} refunded`, tone: "#15803d" };
  if (s.status === "pending_settlement") return { text: `${inr(refundDue(s))} pending`, tone: "#c2410c" };
  return { text: `${inr(s.depositAmount)} held`, tone: "#334155" };
}
