import { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { AdminSection } from "../components/AdminSection.jsx";
import { DocPreview } from "../components/DocPreview.jsx";
import { RejectReasonModal } from "../components/RejectReasonModal.jsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function KycReviewPage({ onCountChange }) {
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const load = () => {
    setLoading(true);
    setLoadErr("");
    // NOTE: Customer Service isn't built yet — this will fail until
    // /customer-service/customer/kyc/pending exists on your backend.
    axios
      .get(`/customer-service/customer/kyc/pending`, { headers: authHeader() })
      .then((res) => {
        setRows(res.data);
        onCountChange?.(res.data.length);
      })
      .catch((err) => {
        setLoadErr(
          err.response?.status === 403
            ? "Not authorized to view KYC submissions (or the backend endpoint isn't built yet)."
            : "Could not load pending submissions.",
        );
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = (id) =>
    axios
      .put(
        `/customer-service/customer/${id}/verify`,
        {},
        { headers: authHeader() },
      )
      .then(load);
  const reject = (id, reason) =>
    axios
      .put(
        `/customer-service/customer/${id}/reject`,
        { reason },
        { headers: authHeader() },
      )
      .then(() => {
        setRejecting(null);
        load();
      });

  return (
    <AdminSection title="Verify Riders" icon={ShieldCheck}>
      {loadErr && (
        <p className="text-sm font-semibold" style={{ color: "#c0392b" }}>
          {loadErr}
        </p>
      )}
      {loading && (
        <p className="text-sm" style={{ color: "var(--mute)" }}>
          Loading…
        </p>
      )}
      {!loading && !loadErr && rows.length === 0 && (
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
                onClick={() =>
                  setPreview({
                    type: "Driving Licence",
                    file: r.dlFileUrl,
                    kind: "image",
                    size: "—",
                    uploaded: r.submittedAt,
                  })
                }
                className="br-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                View DL
              </button>
              <button
                onClick={() =>
                  setPreview({
                    type: r.idType,
                    file: r.idFileUrl,
                    kind: "image",
                    size: "—",
                    uploaded: r.submittedAt,
                  })
                }
                className="br-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                View ID
              </button>
              <button
                onClick={() => approve(r.id)}
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
      {preview && <DocPreview doc={preview} onClose={() => setPreview(null)} />}
      {rejecting && (
        <RejectReasonModal
          kind="identity"
          name={rejecting.name}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => reject(rejecting.id, reason)}
        />
      )}
    </AdminSection>
  );
}
