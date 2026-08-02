// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";

import axios from "axios";

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
  PhoneCall,
  User,
} from "lucide-react";
import { ENTITY_TYPES, MONTHS, STATES } from "../../../constants";
import { RX, pwScore } from "../../../lib/validation.js";
import { Field } from "../../../ui";
import { DocSlot } from "../components";
import partnerApi from "../../../api/partnerApi";

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
    ownerName: session?.name || "",
    business: "",
    type: "Proprietorship",
    yearEst: "",
    pan: "",
    gstin: "",
    udyam: "",
    signatory: "",
    altEmail: "",
    altPhone: "",
    addr1: "",
    addr2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    contact247: "",
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
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const score = pwScore(v.pw);

  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);

  // documents differ by owner type
  const docList = isBiz
    ? [
        { k: "gst", label: "GST certificate", required: true },
        { k: "pan", label: "Business PAN card", required: true },
        {
          k: "incorp",
          label: "Incorporation / Shop & Establishment",
          required: true,
        },
        { k: "cheque", label: "Cancelled cheque", required: true },
        { k: "rmc", label: "Rent-a-Motorcycle licence", required: false },
        { k: "udyam", label: "Udyam / MSME certificate", required: true },
      ]
    : [
        { k: "pan", label: "PAN card", required: true },
        {
          k: "id",
          label: "Government ID (Aadhaar / Passport)",
          required: true,
        },
        { k: "address", label: "Address proof", required: true },
        { k: "cheque", label: "Cancelled cheque / passbook", required: true },
        { k: "rmc", label: "Rent-a-Motorcycle licence", required: false },
      ];

  const e = {};
  // step 0 — account
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
  if (isBiz) {
    if (!v.contact247)
      e.contact247 = "A 24×7 number is required for businesses.";
    else if (!RX.phone.test(v.contact247.replace(/\D/g, "")))
      e.contact247 = "Enter a valid 10-digit number.";
  }
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
  //docList.filter((d) => d.required).forEach((d) => { if (!docs[d.k]) e[`doc_${d.k}`] = "Required"; });

  const stepFields = [
    linked ? [] : ["email", "phone", "pw", "cpw"],
    isBiz
      ? [
          "business",
          "gstin",
          "signatory",
          "pan",
          "yearEst",
          "altEmail",
          "altPhone",
        ]
      : ["ownerName", "pan", "altEmail", "altPhone"],
    isBiz
      ? ["addr1", "city", "pincode", "contact247"]
      : ["addr1", "city", "pincode"],
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

  const submit = async () => {
    if (!stepValid(3)) {
      setT((p) => ({
        ...p,
        ...Object.fromEntries(stepFields[3].map((f) => [f, true])),
      }));
      return;
    }

    // @Pattern rejects "" but skips null — blanks must go as null.
    const n = (s) => (s && s.trim() ? s.trim() : null);
    const up = (s) => (s && s.trim() ? s.trim().toUpperCase() : null);
    const fullName = isBiz ? v.signatory.trim() : v.ownerName.trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || parts[0] || "";
    if (!linked && (firstName.length < 3 || lastName.length < 3)) {
      setApiError(
        "Please enter your full name — first and last, each at least 3 characters.",
      );
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      // 3a — auth DB: create the user account (skipped if already signed in)
      if (!linked) {
        await axios.post("/api/v1/auth/register", {
          firstName,
          lastName,
          email: v.email.trim(),
          phoneNumber: v.phone.trim(),
          password: v.pw,
          captchaToken: "slider-verified",
        });

        // 3b — get a token; partnerApi's interceptor reads it from localStorage
        const { data } = await axios.post("/api/v1/auth/login", {
          email: v.email.trim(),
          password: v.pw,
        });
        localStorage.setItem("token", data.token);
      }

      // 3c — partner DB: create the application (PENDING)
      await partnerApi.onboardPartner({
        sellerType: isBiz ? "COMMERCIAL_DEALER" : "INDIVIDUAL",
        ownerName: fullName,
        alternateEmail: n(v.altEmail),
        alternatePhoneNumber: n(v.altPhone),
        panNumber: up(v.pan),
        contactPhone: isBiz ? n(v.contact247) : n(v.phone),
        addressLine1: n(v.addr1),
        addressLine2: n(v.addr2),
        city: n(v.city),
        state: n(v.state),
        pincode: n(v.pincode),
        businessName: isBiz ? n(v.business) : null,
        businessType: isBiz ? n(v.type) : null,
        gstNumber: isBiz ? up(v.gstin) : null,
        yearOfEstablishment: n(v.yearEst),
        udyamNumber: n(v.udyam),
        signatoryName: isBiz ? n(v.signatory) : null,
        licenseNumber: n(v.rmcNo),
        issuingAuthority: n(v.rmcAuthority),
        licenseValidFrom: n(v.rmcFrom),
        licenseValidTo: n(v.rmcTo),
        payoutAccount: {
          accountHolder: n(v.accHolder),
          accountNumber: n(v.accNo),
          ifsc: up(v.ifsc),
          bankName: n(v.bankName),
        },
        documents: [],
      });

      setDone(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Could not submit your application.",
      );
      window.scrollTo({ top: 0 });
    } finally {
      setSaving(false);
    }
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
                    onChange={set("phone")}
                    onBlur={blur("phone")}
                    placeholder="98765 43210"
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
                    onChange={set("pan")}
                    onBlur={blur("pan")}
                    placeholder="ABCDE1234F"
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
                    onChange={set("altPhone")}
                    onBlur={blur("altPhone")}
                    placeholder="Optional"
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
                    onChange={set("pan")}
                    onBlur={blur("pan")}
                    placeholder="ABCDE1234F"
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
                    onChange={set("gstin")}
                    onBlur={blur("gstin")}
                    placeholder="27ABCDE1234F1Z5"
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
                    onChange={set("altPhone")}
                    onBlur={blur("altPhone")}
                    placeholder="Optional"
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
                  <input
                    value={v.city}
                    onChange={set("city")}
                    onBlur={blur("city")}
                    placeholder="Pune"
                    className="br-input w-full text-sm"
                  />
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
                    onChange={set("pincode")}
                    onBlur={blur("pincode")}
                    placeholder="411001"
                    className="br-input w-full text-sm"
                  />
                </Field>
                {isBiz && (
                  <Field
                    icon={PhoneCall}
                    label="24×7 Contact Number"
                    required
                    tooltip="Rental businesses must keep a line reachable day and night."
                    error={e.contact247}
                    show={err("contact247")}
                  >
                    <input
                      value={v.contact247}
                      onChange={set("contact247")}
                      onBlur={blur("contact247")}
                      placeholder="98765 43210"
                      className="br-input w-full text-sm"
                    />
                  </Field>
                )}
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
                    onChange={set("accNo")}
                    onBlur={blur("accNo")}
                    placeholder="00000000000000"
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
                    onChange={set("ifsc")}
                    onBlur={blur("ifsc")}
                    placeholder="HDFC0001234"
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
                    file={docs[d.k]}
                    onPick={(name) => setDocs((p) => ({ ...p, [d.k]: name }))}
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
          {apiError && (
            <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </p>
          )}
          {apiError && (
            <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </p>
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
                disabled={!stepValid(3) || saving}
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
                {saving ? "Submitting…" : "Submit application"}
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
