import { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { AdminSection } from "../components/AdminSection.jsx";
import { RejectReasonModal } from "../components/RejectReasonModal.jsx";
import { getToken } from "../../../lib/authStorage.js";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// Map an AdminKycResponseDTO row to the shape this page renders.
const toView = (r) => ({
  id: r.customerId, // path param for approve/reject
  name:
    `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
    `Customer #${r.customerId}`,
  email: r.email,
  phone: r.phoneNumber,
  dl: r.drivingLicenseNumber,
  idType: r.idType,
  idNumber: r.idNumber,
  idFileUrl: r.idUploadUrl, // storage object key
  dlFileUrl: r.drivingLicenseUrl, // storage object key (note: admin DTO uses "License", KYC submit uses "Licence")
  submittedAt: r.createdAt || r.updatedAt,
});

export function KycReviewPage({ onCountChange }) {
  const [rows, setRows] = useState([]);
  const [rejecting, setRejecting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [docErr, setDocErr] = useState("");

  // Fetch a short-lived presigned URL for a stored object key, then open it in a new tab.
  const viewDoc = async (objectName) => {
    if (!objectName) {
      setDocErr("No document on file.");
      return;
    }
    setDocErr("");
    try {
      const res = await axios.get(
        `/api/v1/admin/customers/storage/download-url`,
        { params: { objectName }, headers: authHeader() },
      );
      const url = res.data?.downloadUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else setDocErr("Could not open document.");
    } catch {
      setDocErr("Could not open document.");
    }
  };

  const load = () => {
    setLoading(true);
    setLoadErr("");
    axios
      .get(`/api/v1/admin/kyc/pending`, { headers: authHeader() })
      .then((res) => {
        const view = (res.data || []).map(toView);
        setRows(view);
        onCountChange?.(view.length);
      })
      .catch((err) => {
        setLoadErr(
          err.response?.status === 403
            ? "Not authorized — this account isn't an admin."
            : "Could not load pending submissions.",
        );
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = (id) =>
    axios
      .put(
        `/api/v1/admin/kyc/customers/${id}/approve`,
        {},
        { headers: authHeader() },
      )
      .then(load);
  const reject = (id, rejectionReason) =>
    axios
      .put(
        `/api/v1/admin/kyc/customers/${id}/reject`,
        { rejectionReason },
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
                onClick={() => viewDoc(r.dlFileUrl)}
                className="br-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                View DL
              </button>
              <button
                onClick={() => viewDoc(r.idFileUrl)}
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
