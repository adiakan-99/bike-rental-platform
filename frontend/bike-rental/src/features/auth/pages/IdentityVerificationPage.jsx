// MODIFIED: rider KYC now uploads the government ID + driving licence to MinIO via the
// storage service's presigned-URL flow, then submits the resulting permanent fileUrls.
//   select file -> POST /api/storage/upload-url -> PUT uploadUrl (binary) to MinIO
//               -> keep fileUrl -> POST /api/customers/me/kyc with the fileUrls
// Same flow works for a first submission and for a re-submission after rejection, and
// for both KYC entry points (the booking flow and the "Complete KYC" banner), since
// both render this page.
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  Calendar,
  ArrowRight,
  Clock,
  XCircle,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Field, Label } from "../../../ui";
import { RX } from "../../../lib/validation.js";
import { uploadDocument, isAllowedUploadType } from "../../../lib/upload.js";
import { fetchCustomerKyc } from "../../../lib/session.js";
import { getToken } from "../../../lib/authStorage.js";
import { FIELD_LIMITS, KYC_STATUS } from "../../../constants";
import { useAuth } from "../../../store";

const UPLOAD_ENDPOINT = "/api/v1/customers/storage/upload-url";
const KYC_ENDPOINT = "/api/v1/customers/me/kyc"; // POST = create, PUT = update (resubmit)

// Backend idType may be an enum (AADHAAR / VOTER_ID); the form uses display labels.
const idTypeToLabel = (t) =>
  ({ AADHAAR: "Aadhaar", PASSPORT: "Passport", VOTER_ID: "Voter ID" })[t] ||
  t ||
  "Aadhaar";
// Reverse: form label -> backend enum. Sending "Aadhaar" fails Jackson enum parsing.
const labelToIdType = (l) =>
  ({ Aadhaar: "AADHAAR", Passport: "PASSPORT", "Voter ID": "VOTER_ID" })[l] ||
  l;

// One upload slot (government ID or driving licence). Mirrors the partner DocSlot
// lifecycle: idle -> uploading -> uploaded -> error, each rendered inline.
function UploadRow({ label, hint, doc, onPick, error, show }) {
  const ref = useRef(null);
  const uploading = doc?.status === "uploading";
  const uploaded = doc?.status === "uploaded";
  const failed = doc?.status === "error";
  const pick = (ev) => {
    const f = ev.target.files?.[0];
    ev.target.value = ""; // allow re-picking the same file after an error
    if (f) onPick(f);
  };
  return (
    <div>
      <Label required>{label}</Label>
      <div
        className="br-field flex items-center justify-between gap-3 rounded-xl px-3.5 py-3"
        style={
          show || failed
            ? {
                borderColor: "#dc2626",
                boxShadow: "0 0 0 3px rgba(220,38,38,.1)",
              }
            : undefined
        }
      >
        <span className="flex min-w-0 items-center gap-2 text-sm">
          <FileText
            size={16}
            className="shrink-0"
            style={{ color: show || failed ? "#dc2626" : "var(--brand)" }}
          />
          {doc?.name ? (
            <span
              className="flex min-w-0 items-center gap-1 truncate"
              style={{
                color: uploaded
                  ? "var(--brand-strong)"
                  : failed
                    ? "#dc2626"
                    : "var(--mute)",
              }}
            >
              {uploading && (
                <Loader2 size={13} className="animate-spin shrink-0" />
              )}
              {uploaded && <CheckCircle2 size={13} className="shrink-0" />}
              {failed && <AlertCircle size={13} className="shrink-0" />}
              <span className="truncate">{doc.name}</span>
              {uploading && <span className="shrink-0">· uploading…</span>}
              {uploaded && <span className="shrink-0">· uploaded</span>}
            </span>
          ) : (
            <span style={{ color: "var(--mute)" }}>{hint}</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="br-ghost br-display shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={
            uploading ? { opacity: 0.6, cursor: "not-allowed" } : undefined
          }
        >
          {uploading
            ? "Uploading…"
            : failed
              ? "Retry"
              : doc?.name
                ? "Replace"
                : "Upload"}
        </button>
        <input
          ref={ref}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={pick}
        />
      </div>
      {failed && doc?.error && (
        <p
          className="mt-1 flex items-center gap-1 text-xs font-medium"
          style={{ color: "#dc2626" }}
        >
          <AlertCircle size={12} /> {doc.error}
        </p>
      )}
      {!failed && show && (
        <p
          className="mt-1 flex items-center gap-1 text-xs font-medium"
          style={{ color: "#dc2626" }}
        >
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export function IdentityVerificationPage({
  session,
  bike,
  onBack,
  onVerified,
}) {
  const { updateSession } = useAuth();
  const [v, setV] = useState({
    dateOfBirth: "",
    idType: "Aadhaar",
    idNumber: "",
    drivingLicenseNumber: "",
    licenseValidTo: "",
    idDoc: null, // { name, status: "uploading"|"uploaded"|"error", url, error }
    dlDoc: null,
  });
  const [t, setT] = useState({});
  const [lic, setLic] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [record, setRecord] = useState(null); // existing KYC record from the backend, if any
  const [loading, setLoading] = useState(true); // fetching the existing record on mount
  const set = (k) => (e) =>
    setV((p) => ({ ...p, [k]: e.target ? e.target.value : e }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));

  // On mount, read any existing KYC record. This is the authoritative check that stops
  // duplicate submission (a record already SUBMITTED/VERIFIED shows status, not the form)
  // and lets a REJECTED rider resubmit with their previous details prefilled.
  useEffect(() => {
    let alive = true;
    (async () => {
      const rec = await fetchCustomerKyc(getToken(), session);
      if (!alive) return;
      if (rec) {
        setRecord(rec);
        if (rec.kycStatus) updateSession({ kycStatus: rec.kycStatus });
        // prefill so a resubmission isn't blank; existing document URLs count as uploaded
        setV((p) => ({
          ...p,
          dateOfBirth: rec.dateOfBirth || "",
          idType: idTypeToLabel(rec.idType),
          idNumber: rec.idNumber || "",
          drivingLicenseNumber: rec.drivingLicenseNumber || "",
          licenseValidTo: rec.licenseValidTo || "",
          idDoc: rec.idUploadUrl
            ? {
                name: "Current ID document",
                status: "uploaded",
                url: rec.idUploadUrl,
                error: null,
              }
            : null,
          dlDoc: rec.drivingLicenceUrl
            ? {
                name: "Current licence document",
                status: "uploaded",
                url: rec.drivingLicenceUrl,
                error: null,
              }
            : null,
        }));
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Freshest status: the record we just fetched wins over whatever the session had.
  const status =
    record?.kycStatus || session?.kycStatus || KYC_STATUS.NOT_SUBMITTED;

  // ---- Still loading the existing record ----
  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <div className="br-card rounded-2xl p-10 text-center shadow-sm">
          <Loader2
            size={26}
            className="mx-auto animate-spin"
            style={{ color: "var(--brand)" }}
          />
          <p className="mt-3 text-sm" style={{ color: "var(--mute)" }}>
            Checking your verification status…
          </p>
        </div>
      </div>
    );
  }

  // ---- Already verified: nothing to submit, just confirm ----
  if (status === KYC_STATUS.VERIFIED) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <button
          onClick={onBack}
          className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div className="br-card rounded-2xl p-7 text-center shadow-sm">
          <CheckCircle2
            size={32}
            className="mx-auto mb-3"
            style={{ color: "var(--brand-strong)" }}
          />
          <h1 className="br-serif text-xl font-bold">
            You're already verified
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>
            Your identity has been verified — there's nothing more to submit.
            You're all set
            {bike ? ` to book ${bike.name}` : " to book"}.
          </p>
        </div>
      </div>
    );
  }

  // ---- Already submitted / under review: no form, just status ----
  if (status === KYC_STATUS.SUBMITTED) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <button
          onClick={onBack}
          className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div className="br-card rounded-2xl p-7 text-center shadow-sm">
          <Clock
            size={32}
            className="mx-auto mb-3"
            style={{ color: "var(--brand)" }}
          />
          <h1 className="br-serif text-xl font-bold">
            Your documents are under review
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>
            Our team verifies every rider's licence and ID before their first
            booking. This is usually quick — check back shortly
            {bike ? ` to book ${bike.name}` : ""}.
          </p>
        </div>
      </div>
    );
  }

  const wasRejected = status === KYC_STATUS.REJECTED;

  // Upload a picked file to MinIO via the storage service, tracking status on the slot.
  const pickDoc = (key, documentType) => async (file) => {
    if (!isAllowedUploadType(file)) {
      setV((p) => ({
        ...p,
        [key]: {
          name: file.name,
          status: "error",
          url: null,
          error: "Only JPG, PNG, WEBP, or PDF files are allowed.",
        },
      }));
      setT((p) => ({ ...p, [key]: true }));
      return;
    }
    setV((p) => ({
      ...p,
      [key]: { name: file.name, status: "uploading", url: null, error: null },
    }));
    setT((p) => ({ ...p, [key]: true }));
    try {
      const fileUrl = await uploadDocument({
        file,
        documentType,
        endpoint: UPLOAD_ENDPOINT,
      });
      setV((p) => ({
        ...p,
        [key]: {
          name: file.name,
          status: "uploaded",
          url: fileUrl,
          error: null,
        },
      }));
    } catch (err) {
      setV((p) => ({
        ...p,
        [key]: {
          name: file.name,
          status: "error",
          url: null,
          error:
            err.userMessage ||
            err.response?.data?.message ||
            "Upload failed. Please try again.",
        },
      }));
    }
  };

  const e = {};
  if (!v.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
  if (!v.drivingLicenseNumber)
    e.drivingLicenseNumber = "Driving license number is required.";
  else if (
    !RX.dl.test(v.drivingLicenseNumber.replace(/[\s-]/g, "").toUpperCase())
  )
    e.drivingLicenseNumber = "Format e.g. MH12 2020 0012345.";
  if (!v.licenseValidTo) e.licenseValidTo = "Licence expiry date is required.";
  if (!v.idNumber) e.idNumber = "ID number is required.";
  else if (
    v.idType === "Aadhaar" &&
    !RX.aadhaar.test(v.idNumber.replace(/\s/g, ""))
  )
    e.idNumber = "Aadhaar must be 12 digits.";
  else if (
    v.idType === "Passport" &&
    !/^[A-Z]\d{7}$/.test(v.idNumber.trim().toUpperCase())
  )
    e.idNumber = "Passport format e.g. A1234567.";
  else if (
    v.idType === "Voter ID" &&
    !/^[A-Z]{3}\d{7}$/.test(v.idNumber.trim().toUpperCase())
  )
    e.idNumber = "Voter ID format e.g. ABC1234567.";
  // documents must be fully uploaded (not just selected / mid-upload)
  if (!v.dlDoc || v.dlDoc.status !== "uploaded")
    e.dlDoc =
      v.dlDoc?.status === "uploading"
        ? "Still uploading — please wait."
        : "Upload your driving licence.";
  if (!v.idDoc || v.idDoc.status !== "uploaded")
    e.idDoc =
      v.idDoc?.status === "uploading"
        ? "Still uploading — please wait."
        : "Upload your government ID.";

  const missing = Object.keys(e).length + (lic ? 0 : 1);
  const valid = missing === 0;
  const err = (k) => t[k] && e[k];

  const submit = async () => {
    if (!valid) {
      setT({
        dateOfBirth: true,
        drivingLicenseNumber: true,
        licenseValidTo: true,
        idNumber: true,
        idDoc: true,
        dlDoc: true,
      });
      return;
    }
    setSubmitErr("");
    setBusy(true);
    try {
      // Documents are already in MinIO — we send their permanent fileUrls, not the files.
      // A record that already exists (e.g. after rejection) is updated with PUT; a first
      // submission is created with POST.
      const payload = {
        dateOfBirth: v.dateOfBirth,
        idType: labelToIdType(v.idType),
        idNumber: v.idNumber.trim(),
        idUploadUrl: v.idDoc.url,
        drivingLicenseNumber: v.drivingLicenseNumber.trim().toUpperCase(),
        drivingLicenceUrl: v.dlDoc.url,
        licenseValidTo: v.licenseValidTo,
      };
      const headers = { Authorization: `Bearer ${getToken()}` };
      const res = record
        ? await axios.put(KYC_ENDPOINT, payload, { headers })
        : await axios.post(KYC_ENDPOINT, payload, { headers });

      updateSession({ kycStatus: res.data.kycStatus, rejectionReason: null });
      onVerified(res.data);
    } catch (error) {
      setSubmitErr(
        error.response?.data?.message ||
          "Could not submit your documents. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const idDocType = v.idType.toUpperCase().replace(/ /g, "_"); // AADHAAR | PASSPORT | VOTER_ID

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="mb-5 flex items-center gap-2 text-xs font-semibold">
        <span
          className="flex items-center gap-1.5"
          style={{ color: "var(--brand-strong)" }}
        >
          <span
            className="grid h-5 w-5 place-items-center rounded-full text-white"
            style={{ background: "var(--brand)" }}
          >
            1
          </span>{" "}
          Verify identity
        </span>
        <span className="h-px flex-1" style={{ background: "var(--line)" }} />
        <span
          className="flex items-center gap-1.5"
          style={{ color: "var(--mute)" }}
        >
          <span
            className="grid h-5 w-5 place-items-center rounded-full"
            style={{ background: "var(--form-bg)" }}
          >
            2
          </span>{" "}
          Review &amp; confirm
        </span>
      </div>

      <div className="br-card rounded-2xl p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl text-white"
            style={{ background: "var(--brand)" }}
          >
            <ShieldCheck size={22} />
          </span>
          <div>
            <h1 className="br-serif text-2xl font-bold">
              Verify your identity
            </h1>
            <p className="text-sm" style={{ color: "var(--mute)" }}>
              Required once before your first booking
              {bike ? ` · ${bike.name}` : ""}.
            </p>
          </div>
        </div>

        {wasRejected && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
            style={{ background: "#fdecea" }}
          >
            <XCircle
              size={15}
              className="mt-0.5 shrink-0"
              style={{ color: "#c0392b" }}
            />
            <p className="text-xs" style={{ color: "#7a2c22" }}>
              Your previous submission was rejected
              {session.rejectionReason
                ? `: ${session.rejectionReason}`
                : "."}{" "}
              Please correct the details and resubmit.
            </p>
          </div>
        )}

        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
          style={{ background: "#e7f2f9" }}
        >
          <Lock
            size={15}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--brand-strong)" }}
          />
          <p className="text-xs" style={{ color: "#3a4d55" }}>
            Rental operators must record hirer identity by law. Your documents
            are stored encrypted, used only for verification, and never shown to
            dealers.
          </p>
        </div>

        <p
          className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--brand-strong)" }}
        >
          Personal details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={Calendar}
            label="Date of Birth"
            required
            error={e.dateOfBirth}
            show={err("dateOfBirth")}
          >
            <input
              type="date"
              value={v.dateOfBirth}
              onChange={set("dateOfBirth")}
              onBlur={blur("dateOfBirth")}
              className="br-input w-full text-sm"
            />
          </Field>
        </div>

        <p
          className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--brand-strong)" }}
        >
          Driving licence
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            icon={CreditCard}
            label="Driving License Number"
            required
            error={e.drivingLicenseNumber}
            show={err("drivingLicenseNumber")}
          >
            <input
              value={v.drivingLicenseNumber}
              onChange={set("drivingLicenseNumber")}
              onBlur={blur("drivingLicenseNumber")}
              placeholder="MH12 2020 0012345"
              maxLength={FIELD_LIMITS.dl}
              className="br-input w-full text-sm"
            />
          </Field>
          <Field
            icon={Calendar}
            label="Licence Valid To"
            required
            error={e.licenseValidTo}
            show={err("licenseValidTo")}
          >
            <input
              type="date"
              value={v.licenseValidTo}
              onChange={set("licenseValidTo")}
              onBlur={blur("licenseValidTo")}
              className="br-input w-full text-sm"
            />
          </Field>
          <div className="sm:col-span-2">
            <UploadRow
              label="Driving Licence document"
              hint="PDF, JPG, PNG or WEBP"
              doc={v.dlDoc}
              onPick={pickDoc("dlDoc", "DRIVING_LICENSE")}
              error={e.dlDoc}
              show={err("dlDoc")}
            />
          </div>
        </div>

        <p
          className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--brand-strong)" }}
        >
          Government ID
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={CreditCard} label="Government ID Type" required>
            <select
              value={v.idType}
              onChange={set("idType")}
              className="br-input w-full bg-transparent text-sm"
            >
              {["Aadhaar", "Passport", "Voter ID"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field
            icon={CreditCard}
            label={`${v.idType} Number`}
            required
            error={e.idNumber}
            show={err("idNumber")}
          >
            <input
              value={v.idNumber}
              onChange={(e) => {
                let val = e.target.value;
                if (v.idType === "Aadhaar")
                  val = val.replace(/\D/g, "").slice(0, FIELD_LIMITS.aadhaar);
                else
                  val = val.slice(
                    0,
                    v.idType === "Passport"
                      ? FIELD_LIMITS.passport
                      : FIELD_LIMITS.voterId,
                  );
                setV((p) => ({ ...p, idNumber: val }));
              }}
              onBlur={blur("idNumber")}
              inputMode={v.idType === "Aadhaar" ? "numeric" : undefined}
              maxLength={
                v.idType === "Aadhaar"
                  ? FIELD_LIMITS.aadhaar
                  : v.idType === "Passport"
                    ? FIELD_LIMITS.passport
                    : FIELD_LIMITS.voterId
              }
              placeholder={
                v.idType === "Aadhaar"
                  ? "1234 5678 9012"
                  : v.idType === "Passport"
                    ? "A1234567"
                    : "ABC1234567"
              }
              className="br-input w-full text-sm"
            />
          </Field>
          <div className="sm:col-span-2">
            <UploadRow
              label={`${v.idType} document`}
              hint="PDF, JPG, PNG or WEBP"
              doc={v.idDoc}
              onPick={pickDoc("idDoc", idDocType)}
              error={e.idDoc}
              show={err("idDoc")}
            />
          </div>
        </div>

        <label
          className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm"
          style={{ color: "#3a4d55" }}
        >
          <input
            type="checkbox"
            className="br-check mt-0.5"
            checked={lic}
            onChange={(ev) => setLic(ev.target.checked)}
          />{" "}
          <span>
            I confirm that I possess a valid Driving License and the details
            above are correct.
          </span>
        </label>

        {submitErr && (
          <p
            className="mt-3 text-center text-xs font-semibold"
            style={{ color: "#c0392b" }}
          >
            {submitErr}
          </p>
        )}

        <button
          onClick={submit}
          disabled={!valid || busy}
          className="br-btn br-display mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
          style={
            !valid || busy
              ? {
                  background: "#c7d2ce",
                  boxShadow: "none",
                  cursor: "not-allowed",
                }
              : undefined
          }
        >
          {busy ? (
            "Submitting…"
          ) : (
            <>
              Submit for review <ArrowRight size={16} />
            </>
          )}
        </button>
        {!valid && (
          <p
            className="mt-2 text-center text-xs"
            style={{ color: "var(--mute)" }}
          >
            {missing} {missing === 1 ? "item needs" : "items need"} attention to
            continue.
          </p>
        )}
      </div>
    </div>
  );
}
