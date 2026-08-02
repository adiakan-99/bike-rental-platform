// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import axios from "axios";
import { getToken } from "../../../lib/authStorage.js";
import {
  ArrowRight,
  Award,
  Banknote,
  Bike,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  ENTITY_TYPES,
  FIELD_LIMITS,
  IN_CITIES,
  MONTHS,
  STATES,
} from "../../../constants";
import { RX, pwScore } from "../../../lib/validation.js";
import { Field } from "../../../ui";
import { DocSlot } from "../components";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Mirrors StorageServicesImpl's ALLOWED_CONTENT_TYPES on the backend so a bad
// file is rejected client-side before we even ask for an upload URL.
const ALLOWED_DOC_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function PartnerRegisterPage({ onSubmit, onLogin, onHome, session }) {
  // A signed-in customer adding the PARTNER role keeps one account:
  // skip account creation, prefill from the existing user record.
  const linked = !!session;
  const [kind, setKind] = useState("individual"); // individual | business
  const isBiz = kind === "business";
  const [step, setStep] = useState(linked ? 1 : 0);
  const [v, setV] = useState({
    email: session?.email || "",
    phone: session?.phone || "",
    pw: "",
    cpw: "",
    first: session?.name?.split(" ")[0] || "",
    last: session?.name?.split(" ").slice(1).join(" ") || "",
    ownerName: session?.name || "",
    business: "",
    tradeName: "",
    type: "Proprietorship",
    yearEst: "",
    pan: "",
    gstin: "",
    udyam: "",
    signatory: "",
    signatoryDesignation: "",
    altEmail: "",
    altPhone: "",
    addr1: "",
    addr2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    rmcNo: "",
    rmcAuthority: "",
    rmcFrom: "",
    rmcTo: "",
    bankName: "",
    accHolder: "",
    accNo: "",
    ifsc: "",
  });
  const [docs, setDocs] = useState({});
  const [t, setT] = useState({});
  const [agree, setAgree] = useState(false),
    [kyc, setKyc] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  // Digits-only (phone/pincode/account) and uppercase-alphanumeric (PAN/GSTIN/IFSC) setters,
  // each hard-capped so a user can't over-type the field.
  const setNum = (k, max) => (e) =>
    setV((p) => ({
      ...p,
      [k]: e.target.value.replace(/\D/g, "").slice(0, max),
    }));
  const setUpper = (k, max) => (e) =>
    setV((p) => ({
      ...p,
      [k]: e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, max),
    }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const score = pwScore(v.pw);

  // Two-step upload: 1) ask the backend for a pre-signed MinIO PUT URL + the
  // permanent fileUrl, 2) PUT the raw file straight to MinIO. Only the
  // resulting fileUrl is ever sent in the partner profile submit — the file
  // itself never touches the partner API.
  const uploadDocument = async (doc, file) => {
    const k = doc.k;
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      setDocs((p) => ({
        ...p,
        [k]: {
          name: file.name,
          status: "error",
          fileUrl: null,
          error: "Only JPG, PNG, WEBP, and PDF files are allowed.",
        },
      }));
      setT((p) => ({ ...p, [`doc_${k}`]: true }));
      return;
    }
    setDocs((p) => ({
      ...p,
      [k]: { name: file.name, status: "uploading", fileUrl: null, error: null },
    }));
    setT((p) => ({ ...p, [`doc_${k}`]: true }));
    try {
      const token = getToken();
      const { data } = await axios.post(
        `${baseUrl}/api/v1/partners/documents/upload-url`,
        {
          fileName: file.name,
          contentType: file.type,
          documentType: doc.docType,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { uploadUrl, fileUrl } = data;
      // Pre-signed URL carries its own auth in the query string — no bearer
      // header here, and this request goes straight to MinIO, not baseUrl.
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      setDocs((p) => ({
        ...p,
        [k]: { name: file.name, status: "uploaded", fileUrl, error: null },
      }));
    } catch (err) {
      setDocs((p) => ({
        ...p,
        [k]: {
          name: file.name,
          status: "error",
          fileUrl: null,
          error: err.response?.data?.message || "Upload failed. Try again.",
        },
      }));
    }
  };

  // documents differ by owner type. `k` is the local form key; `docType` is the
  // exact value the backend expects in the upload-url request's documentType field.
  const docList = isBiz
    ? [
        {
          k: "gst",
          docType: "GST_CERTIFICATE",
          label: "GST certificate",
          required: true,
        },
        {
          k: "pan",
          docType: "PAN_CARD",
          label: "Business PAN card",
          required: true,
        },
        {
          k: "incorp",
          docType: "INCORPORATION_CERTIFICATE",
          label: "Incorporation / Shop & Establishment",
          required: true,
        },
        {
          k: "cheque",
          docType: "CANCELLED_CHEQUE",
          label: "Cancelled cheque",
          required: true,
        },
        {
          k: "rmc",
          docType: "RENTAL_LICENSE",
          label: "Rent-a-Motorcycle licence",
          required: false,
        },
        {
          k: "udyam",
          docType: "UDYAM_CERTIFICATE",
          label: "Udyam / MSME certificate",
          required: true,
        },
      ]
    : [
        { k: "pan", docType: "PAN_CARD", label: "PAN card", required: true },
        {
          k: "id",
          docType: "GOVERNMENT_ID",
          label: "Government ID (Aadhaar / Passport)",
          required: true,
        },
        {
          k: "address",
          docType: "ADDRESS_PROOF",
          label: "Address proof",
          required: true,
        },
        {
          k: "cheque",
          docType: "CANCELLED_CHEQUE",
          label: "Cancelled cheque / passbook",
          required: true,
        },
        {
          k: "rmc",
          docType: "RENTAL_LICENSE",
          label: "Rent-a-Motorcycle licence",
          required: false,
        },
      ];

  const e = {};
  // step 0 — account
  if (!v.first.trim()) e.first = "First name is required.";
  if (!v.last.trim()) e.last = "Last name is required.";
  if (!v.email) e.email = "Email is required.";
  else if (!RX.email.test(v.email)) e.email = "Enter a valid email.";
  if (!v.phone) e.phone = "Mobile number is required.";
  else if (!RX.phone.test(v.phone.replace(/\D/g, "")))
    e.phone = "Enter a valid 10-digit mobile.";
  if (!v.pw) e.pw = "Password is required.";
  else if (score < 3) e.pw = "Add length, a capital, a number or symbol.";
  if (v.cpw !== v.pw) e.cpw = "Passwords do not match.";
  // step 1 — identity (individual) / business
  if (!isBiz) {
    if (!v.ownerName.trim()) e.ownerName = "Full name is required.";
  } else {
    if (!v.business.trim()) e.business = "Registered legal name is required.";
    if (
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(
        v.gstin.trim().toUpperCase(),
      )
    )
      e.gstin = "15-character GSTIN e.g. 27ABCDE1234F1Z5.";
    if (!v.signatory.trim()) e.signatory = "Authorised signatory is required.";
    if (!v.signatoryDesignation.trim())
      e.signatoryDesignation = "Signatory designation is required.";
  }
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(v.pan.trim().toUpperCase()))
    e.pan = "PAN format e.g. ABCDE1234F.";
  if (v.yearEst && !/^(19|20)\d{2}$/.test(v.yearEst))
    e.yearEst = "Enter a 4-digit year.";
  if (v.altEmail && !RX.email.test(v.altEmail))
    e.altEmail = "Enter a valid email.";
  if (v.altPhone && !RX.phone.test(v.altPhone.replace(/\D/g, "")))
    e.altPhone = "Enter a valid 10-digit number.";
  // step 2 — address
  if (!v.addr1.trim()) e.addr1 = "Address line 1 is required.";
  if (!v.city.trim()) e.city = "City is required.";
  if (!/^\d{6}$/.test(v.pincode.trim()))
    e.pincode = "Pincode must be 6 digits.";
  // step 3 — compliance
  if (isBiz && v.rmcNo.trim() && !v.rmcTo)
    e.rmcTo = "Add the licence expiry date.";
  if (v.rmcTo && new Date(v.rmcTo) < new Date())
    e.rmcTo = "This licence has expired.";
  if (!v.accHolder.trim()) e.accHolder = "Account holder name is required.";
  if (!/^\d{9,18}$/.test(v.accNo.trim()))
    e.accNo = "Enter a valid account number.";
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.ifsc.trim().toUpperCase()))
    e.ifsc = "IFSC format e.g. HDFC0001234.";
  docList
    .filter((d) => d.required)
    .forEach((d) => {
      const entry = docs[d.k];
      if (!entry || entry.status === "error")
        e[`doc_${d.k}`] = entry?.error || "Required";
      else if (entry.status === "uploading")
        e[`doc_${d.k}`] = "Still uploading.";
      else if (entry.status !== "uploaded") e[`doc_${d.k}`] = "Required";
    });

  const stepFields = [
    linked ? [] : ["first", "last", "email", "phone", "pw", "cpw"],
    isBiz
      ? [
          "business",
          "gstin",
          "signatory",
          "signatoryDesignation",
          "pan",
          "yearEst",
          "altEmail",
          "altPhone",
        ]
      : ["ownerName", "pan", "altEmail", "altPhone"],
    ["addr1", "city", "pincode"],
    [
      "rmcTo",
      "accHolder",
      "accNo",
      "ifsc",
      ...docList.filter((d) => d.required).map((d) => `doc_${d.k}`),
    ],
  ];
  const stepValid = (i) =>
    stepFields[i].every((f) => !e[f]) && (i !== 3 || (agree && kyc));
  const err = (k) => t[k] && e[k];
  const next = () => {
    if (!stepValid(step)) {
      setT((p) => ({
        ...p,
        ...Object.fromEntries(stepFields[step].map((f) => [f, true])),
      }));
      return;
    }
    setStep((x) => Math.min(3, x + 1));
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setStep((x) => Math.max(linked ? 1 : 0, x - 1));
    window.scrollTo({ top: 0 });
  };
  const submit = () => {
    if (!stepValid(3)) {
      setT((p) => ({
        ...p,
        ...Object.fromEntries(stepFields[3].map((f) => [f, true])),
      }));
      return;
    }
    onSubmit({
      ownerType: isBiz ? "Business" : "Individual",
      linkedUser: linked ? session.email : null,
      name: isBiz ? v.signatory.trim() : v.ownerName.trim(),
      business: isBiz
        ? v.business.trim()
        : `${v.ownerName.trim().split(" ")[0]}'s Rentals`,
      city: v.city.trim(),
      area: v.addr2.trim() || v.addr1.trim(),
      date: `${new Date().getDate()} ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
      email: v.email,
      phone: v.phone,
      firstName: v.first.trim(),
      lastName: v.last.trim(),
      tradeName: isBiz ? v.tradeName.trim() : "",
      signatoryDesignation: isBiz ? v.signatoryDesignation.trim() : "",
      gstin: isBiz ? v.gstin.toUpperCase() : "N/A (individual)",
      type: isBiz ? v.type : "Individual owner",
      since: v.yearEst || String(new Date().getFullYear()),
      fleet: 0,
      complaints: [],
      // documentType -> permanent fileUrl, exactly what the partner profile
      // API's document URL fields expect (never the raw file).
      documents: docList.reduce((acc, d) => {
        if (docs[d.k]?.fileUrl) acc[d.docType] = docs[d.k].fileUrl;
        return acc;
      }, {}),
    });
    setDone(true);
  };

  if (done)
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <span
          className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white"
          style={{
            background: "linear-gradient(135deg,var(--brand),var(--brand-2))",
          }}
        >
          <CheckCircle2 size={34} />
        </span>
        <h1 className="br-serif br-fade-up br-d1 mt-5 text-3xl font-bold">
          Application submitted
        </h1>
        <p
          className="br-fade-up br-d2 mt-2 text-sm"
          style={{ color: "var(--mute)" }}
        >
          We verify your documents independently — usually within 48 hours. Once
          approved, you'll be able to list your bikes from the dealer portal.
          We'll email {v.email} as soon as you're verified.
        </p>
        <div className="br-fade-up br-d3 mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
          <button
            onClick={onLogin}
            className="br-btn br-display flex-1 rounded-xl py-3 text-sm font-semibold"
          >
            Go to Dealer Portal
          </button>
          <button
            onClick={onHome}
            className="br-ghost br-display flex-1 rounded-xl py-3 text-sm font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  const allLabels = [
    "Account",
    isBiz ? "Business" : "Your details",
    "Address",
    "Verification",
  ];
  const stepLabels = linked ? allLabels.slice(1) : allLabels;
  const labelIndex = (i) => (linked ? i - 1 : i);

  return (
    <>
      <div className="br-hero-bg">
        <div className="mx-auto max-w-[1200px] px-4 py-10 text-center sm:px-6 lg:px-8">
          <span className="br-display inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Bike size={14} /> Individuals &amp; businesses welcome
          </span>
          <h1 className="br-serif mt-4 text-4xl font-bold text-white">
            Become a rental partner
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Register once, get verified, then list as many bikes as you like.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="min-w-0 flex-1">
              <div
                className="h-1.5 rounded-full"
                style={{
                  background:
                    i <= labelIndex(step)
                      ? "linear-gradient(90deg,var(--brand),var(--brand-2))"
                      : "var(--form-bg)",
                }}
              />
              <p
                className="mt-1.5 truncate text-[11px] font-semibold"
                style={{
                  color:
                    i === labelIndex(step)
                      ? "var(--brand-strong)"
                      : "var(--mute)",
                }}
              >
                {i + 1}. {label}
              </p>
            </div>
          ))}
        </div>

        {linked && (
          <div
            className="br-card mt-4 flex items-start gap-3 rounded-2xl p-4 shadow-sm"
            style={{ borderColor: "var(--brand)" }}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
              style={{
                background:
                  "linear-gradient(135deg,var(--brand),var(--brand-2))",
              }}
            >
              <User size={17} />
            </span>
            <div>
              <p className="br-display text-sm font-bold">
                Adding partner access to your account
              </p>
              <p className="text-xs" style={{ color: "var(--mute)" }}>
                Signed in as {session.email} — you'll keep one login for renting
                and listing. No new account needed.
              </p>
            </div>
          </div>
        )}

        <div className="br-card mt-5 rounded-2xl p-5 shadow-sm sm:p-7">
          {step === 0 && (
            <>
              <h2 className="br-serif text-2xl font-bold">
                Create your account
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                Tell us who's registering — we'll only ask for what applies to
                you.
              </p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[
                  [
                    "individual",
                    User,
                    "Individual",
                    "I own one or a few bikes",
                  ],
                  [
                    "business",
                    Briefcase,
                    "Business",
                    "Registered rental company",
                  ],
                ].map(([k, Ic, title, sub]) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className="flex items-start gap-3 rounded-xl px-4 py-3 text-left transition"
                    style={
                      kind === k
                        ? {
                            border: "1.5px solid var(--brand)",
                            background: "var(--form-bg)",
                          }
                        : { border: "1px solid var(--line)" }
                    }
                  >
                    <span
                      className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                      style={{
                        border:
                          kind === k
                            ? "4px solid var(--brand)"
                            : "1.5px solid #cbd5e1",
                      }}
                    />
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <Ic size={15} style={{ color: "var(--brand)" }} />{" "}
                        {title}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--mute)" }}
                      >
                        {sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  icon={User}
                  label="First Name"
                  required
                  error={e.first}
                  show={err("first")}
                >
                  <input
                    value={v.first}
                    onChange={set("first")}
                    onBlur={blur("first")}
                    placeholder="Aarav"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={User}
                  label="Last Name"
                  required
                  error={e.last}
                  show={err("last")}
                >
                  <input
                    value={v.last}
                    onChange={set("last")}
                    onBlur={blur("last")}
                    placeholder="Sharma"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Mail}
                  label="Email"
                  required
                  error={e.email}
                  show={err("email")}
                >
                  <input
                    type="email"
                    value={v.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                    placeholder="you@email.com"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Phone}
                  label="Mobile Number"
                  required
                  tooltip="We send a one-time code to verify this number."
                  error={e.phone}
                  show={err("phone")}
                >
                  <span className="text-sm" style={{ color: "var(--mute)" }}>
                    +91
                  </span>
                  <input
                    value={v.phone}
                    onChange={setNum("phone", FIELD_LIMITS.phone)}
                    onBlur={blur("phone")}
                    placeholder="9876543210"
                    maxLength={FIELD_LIMITS.phone}
                    inputMode="numeric"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <div>
                  <Field
                    icon={Lock}
                    label="Password"
                    required
                    error={e.pw}
                    show={err("pw")}
                  >
                    <input
                      type={showPw ? "text" : "password"}
                      value={v.pw}
                      onChange={set("pw")}
                      onBlur={blur("pw")}
                      placeholder="Create a password"
                      className="br-input w-full text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((x) => !x)}
                      aria-label="Toggle password"
                    >
                      {showPw ? (
                        <EyeOff size={16} style={{ color: "var(--mute)" }} />
                      ) : (
                        <Eye size={16} style={{ color: "var(--mute)" }} />
                      )}
                    </button>
                  </Field>
                  {v.pw && (
                    <div className="mt-1.5 flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            background:
                              i <= (score <= 2 ? 1 : score === 3 ? 2 : 3)
                                ? score >= 4
                                  ? "var(--brand)"
                                  : score === 3
                                    ? "#eab308"
                                    : "#dc2626"
                                : "var(--form-bg)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Field
                  icon={Lock}
                  label="Confirm Password"
                  required
                  error={e.cpw}
                  show={err("cpw")}
                >
                  <input
                    type="password"
                    value={v.cpw}
                    onChange={set("cpw")}
                    onBlur={blur("cpw")}
                    placeholder="Re-enter password"
                    className="br-input w-full text-sm"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 1 && !isBiz && (
            <>
              <h2 className="br-serif text-2xl font-bold">Your details</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                We verify every partner before listings go live.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  icon={User}
                  label="Full Name"
                  required
                  error={e.ownerName}
                  show={err("ownerName")}
                >
                  <input
                    value={v.ownerName}
                    onChange={set("ownerName")}
                    onBlur={blur("ownerName")}
                    placeholder="Aarav Sharma"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={CreditCard}
                  label="PAN Number"
                  required
                  tooltip="Required for TDS and tax reporting on your payouts."
                  error={e.pan}
                  show={err("pan")}
                >
                  <input
                    value={v.pan}
                    onChange={setUpper("pan", FIELD_LIMITS.pan)}
                    onBlur={blur("pan")}
                    placeholder="ABCDE1234F"
                    maxLength={FIELD_LIMITS.pan}
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Mail}
                  label="Alternate Email"
                  error={e.altEmail}
                  show={err("altEmail")}
                >
                  <input
                    value={v.altEmail}
                    onChange={set("altEmail")}
                    onBlur={blur("altEmail")}
                    placeholder="Optional"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Phone}
                  label="Alternate Phone"
                  error={e.altPhone}
                  show={err("altPhone")}
                >
                  <input
                    value={v.altPhone}
                    onChange={setNum("altPhone", FIELD_LIMITS.phone)}
                    onBlur={blur("altPhone")}
                    placeholder="Optional"
                    maxLength={FIELD_LIMITS.phone}
                    inputMode="numeric"
                    className="br-input w-full text-sm"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 1 && isBiz && (
            <>
              <h2 className="br-serif text-2xl font-bold">Business details</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                Enter these exactly as they appear on your GST certificate.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  icon={Building2}
                  label="Registered Legal Name"
                  required
                  error={e.business}
                  show={err("business")}
                >
                  <input
                    value={v.business}
                    onChange={set("business")}
                    onBlur={blur("business")}
                    placeholder="Speedster Rentals Pvt. Ltd."
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Building2}
                  label="Trade Name"
                  tooltip="The 'doing business as' name shown to customers, if different from the registered legal name."
                >
                  <input
                    value={v.tradeName}
                    onChange={set("tradeName")}
                    placeholder="Speedster Rentals"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field icon={Briefcase} label="Entity Type" required>
                  <select
                    value={v.type}
                    onChange={set("type")}
                    className="br-input w-full bg-transparent text-sm"
                  >
                    {ENTITY_TYPES.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  icon={Calendar}
                  label="Year of Establishment"
                  error={e.yearEst}
                  show={err("yearEst")}
                >
                  <input
                    value={v.yearEst}
                    onChange={set("yearEst")}
                    onBlur={blur("yearEst")}
                    placeholder="2021"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={CreditCard}
                  label="Business PAN"
                  required
                  error={e.pan}
                  show={err("pan")}
                >
                  <input
                    value={v.pan}
                    onChange={setUpper("pan", FIELD_LIMITS.pan)}
                    onBlur={blur("pan")}
                    placeholder="ABCDE1234F"
                    maxLength={FIELD_LIMITS.pan}
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={FileText}
                  label="GSTIN"
                  required
                  tooltip="Verified independently against the GST portal."
                  error={e.gstin}
                  show={err("gstin")}
                >
                  <input
                    value={v.gstin}
                    onChange={setUpper("gstin", FIELD_LIMITS.gstin)}
                    onBlur={blur("gstin")}
                    placeholder="27ABCDE1234F1Z5"
                    maxLength={FIELD_LIMITS.gstin}
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field icon={Award} label="Udyam / MSME Number">
                  <input
                    value={v.udyam}
                    onChange={set("udyam")}
                    placeholder="Optional"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={User}
                  label="Authorised Signatory"
                  required
                  tooltip="Stored as the partner owner name."
                  error={e.signatory}
                  show={err("signatory")}
                >
                  <input
                    value={v.signatory}
                    onChange={set("signatory")}
                    onBlur={blur("signatory")}
                    placeholder="Full name"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Briefcase}
                  label="Signatory Designation"
                  required
                  tooltip="The signatory's title or role in the business, e.g. Director, Partner, Proprietor."
                  error={e.signatoryDesignation}
                  show={err("signatoryDesignation")}
                >
                  <input
                    value={v.signatoryDesignation}
                    onChange={set("signatoryDesignation")}
                    onBlur={blur("signatoryDesignation")}
                    placeholder="Director"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Mail}
                  label="Alternate Email"
                  error={e.altEmail}
                  show={err("altEmail")}
                >
                  <input
                    value={v.altEmail}
                    onChange={set("altEmail")}
                    onBlur={blur("altEmail")}
                    placeholder="Optional"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Phone}
                  label="Alternate Phone"
                  error={e.altPhone}
                  show={err("altPhone")}
                >
                  <input
                    value={v.altPhone}
                    onChange={setNum("altPhone", FIELD_LIMITS.phone)}
                    onBlur={blur("altPhone")}
                    placeholder="Optional"
                    maxLength={FIELD_LIMITS.phone}
                    inputMode="numeric"
                    className="br-input w-full text-sm"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="br-serif text-2xl font-bold">Address</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                {isBiz
                  ? "This must match the address on your GST registration."
                  : "Where your bikes are usually kept and handed over."}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    icon={MapPin}
                    label="Address Line 1"
                    required
                    error={e.addr1}
                    show={err("addr1")}
                  >
                    <input
                      value={v.addr1}
                      onChange={set("addr1")}
                      onBlur={blur("addr1")}
                      placeholder="Flat / shop, building, street"
                      className="br-input w-full text-sm"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field icon={MapPin} label="Address Line 2">
                    <input
                      value={v.addr2}
                      onChange={set("addr2")}
                      placeholder="Landmark / locality"
                      className="br-input w-full text-sm"
                    />
                  </Field>
                </div>
                <Field
                  icon={MapPin}
                  label="City"
                  required
                  error={e.city}
                  show={err("city")}
                >
                  <select
                    value={v.city}
                    onChange={set("city")}
                    onBlur={blur("city")}
                    className="br-input w-full bg-transparent text-sm"
                  >
                    {v.city === "" && <option value="">Select…</option>}
                    {IN_CITIES.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field icon={Building2} label="State" required>
                  <select
                    value={v.state}
                    onChange={set("state")}
                    className="br-input w-full bg-transparent text-sm"
                  >
                    {STATES.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  icon={MapPin}
                  label="Pincode"
                  required
                  error={e.pincode}
                  show={err("pincode")}
                >
                  <input
                    value={v.pincode}
                    onChange={setNum("pincode", FIELD_LIMITS.pincode)}
                    onBlur={blur("pincode")}
                    placeholder="411001"
                    maxLength={FIELD_LIMITS.pincode}
                    inputMode="numeric"
                    className="br-input w-full text-sm"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="br-serif text-2xl font-bold">
                Verification &amp; payouts
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                You'll add your bikes after approval — nothing to declare here.
              </p>

              <p
                className="br-display mt-5 mb-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--brand-strong)" }}
              >
                Rental licence{" "}
                <span
                  className="normal-case text-[10px]"
                  style={{ color: "var(--mute)" }}
                >
                  · optional now, required before going live
                </span>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={FileText} label="Licence Number">
                  <input
                    value={v.rmcNo}
                    onChange={set("rmcNo")}
                    placeholder="RMC/MH/2024/0142"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field icon={Building2} label="Issuing RTO / STA">
                  <input
                    value={v.rmcAuthority}
                    onChange={set("rmcAuthority")}
                    placeholder="RTO Pune (MH12)"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field icon={Calendar} label="Valid From">
                  <input
                    type="date"
                    value={v.rmcFrom}
                    onChange={set("rmcFrom")}
                    className="br-dt w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Calendar}
                  label="Valid Until"
                  error={e.rmcTo}
                  show={err("rmcTo")}
                >
                  <input
                    type="date"
                    value={v.rmcTo}
                    onChange={set("rmcTo")}
                    onBlur={blur("rmcTo")}
                    className="br-dt w-full text-sm"
                  />
                </Field>
              </div>

              <p
                className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--brand-strong)" }}
              >
                Bank account for payouts
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  icon={User}
                  label="Account Holder Name"
                  required
                  tooltip={
                    isBiz
                      ? "Must match the registered business name."
                      : "Must match your PAN name."
                  }
                  error={e.accHolder}
                  show={err("accHolder")}
                >
                  <input
                    value={v.accHolder}
                    onChange={set("accHolder")}
                    onBlur={blur("accHolder")}
                    placeholder="As per bank records"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field icon={Building2} label="Bank Name">
                  <input
                    value={v.bankName}
                    onChange={set("bankName")}
                    placeholder="HDFC Bank"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Banknote}
                  label="Account Number"
                  required
                  error={e.accNo}
                  show={err("accNo")}
                >
                  <input
                    value={v.accNo}
                    onChange={setNum("accNo", FIELD_LIMITS.accNo)}
                    onBlur={blur("accNo")}
                    placeholder="Bank account number"
                    maxLength={FIELD_LIMITS.accNo}
                    inputMode="numeric"
                    className="br-input w-full text-sm"
                  />
                </Field>
                <Field
                  icon={Banknote}
                  label="IFSC Code"
                  required
                  error={e.ifsc}
                  show={err("ifsc")}
                >
                  <input
                    value={v.ifsc}
                    onChange={setUpper("ifsc", FIELD_LIMITS.ifsc)}
                    onBlur={blur("ifsc")}
                    placeholder="HDFC0001234"
                    maxLength={FIELD_LIMITS.ifsc}
                    className="br-input w-full text-sm"
                  />
                </Field>
              </div>

              <p
                className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--brand-strong)" }}
              >
                Documents{" "}
                <span
                  className="normal-case text-[10px]"
                  style={{ color: "var(--mute)" }}
                >
                  · all required except the rental licence
                </span>
              </p>
              <div className="flex flex-col gap-2">
                {docList.map((d) => (
                  <DocSlot
                    key={d.k}
                    doc={d}
                    entry={docs[d.k]}
                    onPick={(file) => uploadDocument(d, file)}
                    error={t[`doc_${d.k}`] && e[`doc_${d.k}`]}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <label
                  className="flex cursor-pointer items-start gap-2.5 text-sm"
                  style={{ color: "#3a4d55" }}
                >
                  <input
                    type="checkbox"
                    className="br-check mt-0.5"
                    checked={kyc}
                    onChange={(x) => setKyc(x.target.checked)}
                  />{" "}
                  I authorise BikeRental to verify these details with the
                  relevant authorities.
                </label>
                <label
                  className="flex cursor-pointer items-start gap-2.5 text-sm"
                  style={{ color: "#3a4d55" }}
                >
                  <input
                    type="checkbox"
                    className="br-check mt-0.5"
                    checked={agree}
                    onChange={(x) => setAgree(x.target.checked)}
                  />{" "}
                  I confirm the information is accurate and accept the{" "}
                  <a
                    href="#"
                    className="font-semibold"
                    style={{ color: "var(--brand-strong)" }}
                  >
                    Partner Agreement
                  </a>
                  .
                </label>
              </div>
            </>
          )}

          <div className="mt-6 flex gap-2.5">
            {step > (linked ? 1 : 0) && (
              <button
                onClick={back}
                className="br-ghost br-display rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={next}
                className="br-btn br-display flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!stepValid(3)}
                className="br-btn br-display flex-1 rounded-xl py-3 text-sm font-semibold"
                style={
                  !stepValid(3)
                    ? {
                        background: "#c3d5dd",
                        boxShadow: "none",
                        cursor: "not-allowed",
                      }
                    : undefined
                }
              >
                Submit application
              </button>
            )}
          </div>
          <p
            className="mt-4 text-center text-sm"
            style={{ color: "var(--mute)" }}
          >
            Already a partner?{" "}
            <button
              onClick={onLogin}
              className="font-semibold"
              style={{ color: "var(--brand-strong)" }}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
