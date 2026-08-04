import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  FileText,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import { Row } from "../../../ui";
import { AdminSection } from "./AdminSection.jsx";
import partnerApi from "../../../api/partnerApi";

const DOC_LABELS = {
  PAN: "PAN card",
  GOVT_ID: "Government ID",
  ADDRESS_PROOF: "Address proof",
  CANCELLED_CHEQUE: "Cancelled cheque",
  RENTAL_LICENSE: "Rent-a-Motorcycle licence",
  GST_CERT: "GST certificate",
  INCORPORATION: "Incorporation certificate",
  SHOP_ESTABLISHMENT: "Shop & Establishment",
  UDYAM: "Udyam / MSME certificate",
};

export function DealerDetailsAdmin({ dealer, onDecide, onReject, onBack }) {
  const [docs, setDocs] = useState([]);
  const [docsErr, setDocsErr] = useState("");
  const [profile, setProfile] = useState(null);

  const partnerId = dealer?.partnerId ?? dealer?.id;

  useEffect(() => {
    setProfile(null);
    if (!partnerId) return;
    partnerApi
      .getPartnerById(partnerId)
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(null));
  }, [partnerId]);

  useEffect(() => {
    setDocs([]);
    setDocsErr("");
    if (!partnerId) return;
    partnerApi
      .getPartnerDocuments(partnerId)
      .then(({ data }) => setDocs(data))
      .catch((ex) =>
        setDocsErr(ex.response?.data?.message || "Could not load documents"),
      );
  }, [partnerId]);

  const p = profile || {};
  const val = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  return (
    <div>
      <button
        onClick={onBack}
        className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"
      >
        <ChevronLeft size={16} /> Back to pending list
      </button>
      <div className="flex items-center gap-3">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl br-display text-lg font-bold text-white"
          style={{
            background: "linear-gradient(135deg,var(--brand),var(--brand-2))",
          }}
        >
          {dealer.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <h2 className="br-display text-xl font-bold">{dealer.business}</h2>
          <p className="text-sm" style={{ color: "var(--mute)" }}>
            {dealer.name} · Applied {dealer.date}
          </p>
        </div>
        <span
          className="ml-auto rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: "#fef3c7", color: "#b45309" }}
        >
          Pending Approval
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AdminSection title="Personal Details" icon={User}>
          <Row label="Full Name" value={val(p.ownerName || dealer.name)} />
          <Row label="Alternate Email" value={val(p.alternateEmail)} />
          <Row
            label="Phone"
            value={p.contactPhone ? `+91 ${p.contactPhone}` : "—"}
          />
          <Row label="PAN" value={val(p.panNumber)} />
        </AdminSection>
        <AdminSection title="Business Information" icon={Briefcase}>
          <Row
            label="Business Name"
            value={val(p.businessName || dealer.business)}
          />
          <Row
            label="Entity Type"
            value={
              p.sellerType === "COMMERCIAL_DEALER" ? "Business" : "Individual"
            }
          />
          <Row label="GSTIN" value={val(p.gstNumber)} />
          <Row label="Operating Since" value={val(p.yearOfEstablishment)} />
          <Row
            label="Fleet Size"
            value={dealer.fleet ? `${dealer.fleet} bikes` : "Not listed yet"}
          />
        </AdminSection>
        <AdminSection title="Contact & Address" icon={MapPin}>
          <Row
            label="Address"
            value={val(
              [p.addressLine1, p.addressLine2].filter(Boolean).join(", "),
            )}
          />
          <Row label="City" value={val(p.city || dealer.city)} />
          <Row label="State" value={val(p.state)} />
          <Row label="Pincode" value={val(p.pincode)} />
          <Row
            label="Contact Number"
            value={p.contactPhone ? `+91 ${p.contactPhone}` : "—"}
          />
        </AdminSection>
        <AdminSection title="Verification Documents" icon={FileText}>
          <div className="flex flex-col gap-2">
            {docsErr && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {docsErr}
              </p>
            )}
            {!docsErr && docs.length === 0 && (
              <p className="text-sm" style={{ color: "var(--mute)" }}>
                No documents uploaded.
              </p>
            )}
            {docs.map((d) => (
              <div
                key={d.documentId}
                className="flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ background: "var(--form-bg)" }}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <FileText size={15} style={{ color: "var(--brand)" }} />{" "}
                  {DOC_LABELS[d.docType] || d.docType}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    <CheckCircle2 size={13} /> Uploaded
                  </span>
                  <a
                    href={(d.fileUrl || "").replace(
                      /^http:\/\/minio:9000/,
                      "/storage",
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold"
                    style={{ color: "var(--brand-strong)" }}
                  >
                    View
                  </a>
                </span>
              </div>
            ))}
          </div>
        </AdminSection>
      </div>

      <div className="mt-4">
        <AdminSection title="Complaints" icon={AlertTriangle}>
          {(dealer.complaints || []).length === 0 ? (
            <p
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--brand-strong)" }}
            >
              <CheckCircle2 size={15} /> No complaints on record for this
              dealer.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {dealer.complaints.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: "#fff7ed" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#b45309" }}
                    >
                      {c.severity} severity
                    </span>
                    <span className="text-xs" style={{ color: "var(--mute)" }}>
                      {c.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "#3a4d55" }}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={() => onDecide(dealer.id, "approve")}
          className="br-btn br-display flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold sm:flex-1"
        >
          <CheckCircle2 size={17} /> Approve Dealer
        </button>
        <button
          onClick={() => onReject(dealer.id)}
          className="br-display flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold sm:flex-1"
          style={{
            border: "1.5px solid #dc2626",
            color: "#dc2626",
            background: "#fff",
          }}
        >
          <XCircle size={17} /> Reject
        </button>
        <button
          onClick={onBack}
          className="br-ghost br-display rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
