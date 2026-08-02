import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

// Persistent top-of-page prompt shown to a logged-in rider whose KYC isn't VERIFIED.
// The copy + call-to-action change with the status so the message is always accurate:
//   SUBMITTED  → under review, no action needed (no button)
//   REJECTED   → needs re-submission (button)
//   otherwise  → not started / pending / incomplete (button)
export function KycBanner({ status, onVerify }) {
  const underReview = status === "SUBMITTED";
  const rejected = status === "REJECTED";

  const tone = underReview
    ? {
        bg: "#eff6ff",
        border: "#bfdbfe",
        fg: "#1e40af",
        sub: "#1e3a8a",
        Icon: ShieldCheck,
      }
    : {
        bg: "#fffbeb",
        border: "#fde68a",
        fg: "#92400e",
        sub: "#78350f",
        Icon: AlertTriangle,
      };

  const title = underReview
    ? "Your KYC is under review"
    : rejected
      ? "Your KYC was rejected"
      : "Complete your KYC to book a bike";

  const message = underReview
    ? "We'll notify you once your documents are verified. You can browse in the meantime."
    : rejected
      ? "Your documents couldn't be verified. Please re-submit to start booking."
      : "Verify your identity (driving licence + government ID) to unlock bookings.";

  const cta = rejected ? "Re-submit KYC" : "Complete KYC";

  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-4"
      style={{ background: tone.bg, border: `1px solid ${tone.border}` }}
    >
      <tone.Icon
        size={18}
        className="mt-0.5 shrink-0"
        style={{ color: tone.fg }}
      />
      <div className="min-w-0 flex-1">
        <p className="br-display text-sm font-bold" style={{ color: tone.fg }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: tone.sub }}>
          {message}
        </p>
      </div>
      {!underReview && onVerify && (
        <button
          onClick={onVerify}
          className="br-btn br-display shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1"
        >
          {cta} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
