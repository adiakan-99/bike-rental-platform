// Presentational only. Data (pending list) + actions live in AdminApp so they persist
// across tab switches and mutate in place — this component just renders what it's given.
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AdminSection } from "../components/AdminSection.jsx";
import { RejectReasonModal } from "../components/RejectReasonModal.jsx";

export function KycReviewPage({
  rows = [],
  loading,
  err,
  docErr,
  onView,
  onApprove,
  onReject,
}) {
  const [rejecting, setRejecting] = useState(null);

  return (
    <AdminSection title="Verify Riders" icon={ShieldCheck}>
      {err && (
        <p className="text-sm font-semibold" style={{ color: "#c0392b" }}>
          {err}
        </p>
      )}
      {docErr && (
        <p className="mb-2 text-sm font-semibold" style={{ color: "#c0392b" }}>
          {docErr}
        </p>
      )}
      {loading && (
        <p className="text-sm" style={{ color: "var(--mute)" }}>
          Loading…
        </p>
      )}
      {!loading && !err && rows.length === 0 && (
        <p className="text-sm" style={{ color: "var(--mute)" }}>
          No pending submissions.
        </p>
      )}
      <div className="grid gap-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="br-card flex items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="min-w-0">
              <p className="br-display truncate text-sm font-bold">{r.name}</p>
              <p className="truncate text-xs" style={{ color: "var(--mute)" }}>
                {r.email} · DL {r.dl} · {r.idType} {r.idNumber}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => onView(r.dlFileUrl)}
                className="br-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                View DL
              </button>
              <button
                onClick={() => onView(r.idFileUrl)}
                className="br-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                View ID
              </button>
              <button
                onClick={() => onApprove(r.id)}
                className="br-btn rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => setRejecting(r)}
                className="br-display rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{
                  border: "1.5px solid #dc2626",
                  color: "#dc2626",
                  background: "#fff",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      {rejecting && (
        <RejectReasonModal
          kind="identity"
          name={rejecting.name}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => {
            onReject(rejecting.id, reason);
            setRejecting(null);
          }}
        />
      )}
    </AdminSection>
  );
}
