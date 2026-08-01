// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Bike,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { FEATURES, GENDERS } from "../../../constants";
import { RX, pwScore } from "../../../lib/validation.js";
import { Field, Label, SliderCaptcha } from "../../../ui";
import { SocialButtons } from "../components";
import { ageFrom } from "../utils";

const baseUrl = import.meta.env.VITE_API_BASE_URL1 || "http://localhost:8080";

export function RegisterPage({ onLogin, onDone, onRegistered, onSocial }) {
  const [v, setV] = useState({
    first: "",
    last: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    pw: "",
    cpw: "",
  });
  const [t, setT] = useState({});
  const [busy, setBusy] = useState(false);
  const [regErr, setRegErr] = useState("");
  const [showPw, setShowPw] = useState(false),
    [showCpw, setShowCpw] = useState(false);
  const [captcha, setCaptcha] = useState(false),
    [terms, setTerms] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) =>
    setV((p) => ({ ...p, [k]: e.target ? e.target.value : e }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const score = pwScore(v.pw);
  const pwLevel = score <= 2 ? 1 : score === 3 ? 2 : 3; // 1 weak · 2 medium · 3 strong
  const pwLabel = ["", "Weak", "Medium", "Strong"][pwLevel];
  const pwColor =
    pwLevel === 3 ? "var(--brand)" : pwLevel === 2 ? "#eab308" : "#dc2626";

  const errors = {};
  if (!v.first.trim()) errors.first = "First name is required.";
  if (!v.last.trim()) errors.last = "Last name is required.";
  if (!v.dob) errors.dob = "Date of birth is required.";
  else if (ageFrom(v.dob) < 18)
    errors.dob = "You must be at least 18 years old.";
  if (!v.email) errors.email = "Email is required.";
  else if (!RX.email.test(v.email))
    errors.email = "Enter a valid email address.";
  if (!v.phone) errors.phone = "Phone number is required.";
  else if (!RX.phone.test(v.phone.replace(/\D/g, "")))
    errors.phone = "Enter a valid 10-digit mobile number.";
  if (!v.pw) errors.pw = "Password is required.";
  else if (score < 3)
    errors.pw =
      "Password is too weak — add length, a capital, a number or symbol.";
  if (!v.cpw) errors.cpw = "Please confirm your password.";
  else if (v.cpw !== v.pw) errors.cpw = "Passwords do not match.";

  const missing =
    Object.keys(errors).length + (captcha ? 0 : 1) + (terms ? 0 : 1);
  const valid = missing === 0;
  const err = (k) => t[k] && errors[k];

  const submit = async () => {
    if (!valid) {
      setT(Object.fromEntries(Object.keys(v).map((k) => [k, true])));
      return;
    }
    setRegErr("");
    setBusy(true);
    try {
      // Field names match your real /api/v1/auth/register schema.
      await axios.post(`${baseUrl}/api/v1/auth/register`, {
        firstName: v.first.trim(),
        lastName: v.last.trim(),
        email: v.email.trim(),
        phoneNumber: v.phone.trim(),
        password: v.pw,
        gender: v.gender
          ? v.gender.toUpperCase().replace(/ /g, "_")
          : undefined,
        // NOTE: SliderCaptcha is a UI-only slide gesture (produces a boolean, not a real
        // anti-bot token). Sending a placeholder so registration isn't blocked by a missing
        // field — this provides no actual bot protection. To make captchaToken meaningful,
        // integrate a real provider (reCAPTCHA/hCaptcha/Cloudflare Turnstile) and send its token here instead.
        captchaToken: "slider-verified",
      });
      onRegistered?.({
        email: v.email.trim(),
        name: `${v.first.trim()} ${v.last.trim()}`,
        phone: v.phone.trim(),
      });
      setDone(true);
    } catch (error) {
      const status = error.response?.status;
      const serverMsg =
        error.response?.data?.message || error.response?.data?.error;
      if (status === 409)
        setRegErr("An account with this email already exists.");
      else
        setRegErr(
          serverMsg ||
            error.message ||
            "Could not create your account. Please try again.",
        );
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (done) {
      const id = setTimeout(onLogin, 2600);
      return () => clearTimeout(id);
    }
  }, [done]);

  if (done)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span
          className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white"
          style={{ background: "var(--brand)" }}
        >
          <CheckCircle2 size={34} />
        </span>
        <h1 className="br-serif br-fade-up br-d1 mt-5 text-2xl font-bold">
          Account created!
        </h1>
        <p
          className="br-fade-up br-d2 mt-2 text-sm"
          style={{ color: "var(--mute)" }}
        >
          Welcome to BikeRental, {v.first}. We're taking you to the login page…
        </p>
        <button
          onClick={onLogin}
          className="br-btn br-display br-fade-up br-d3 mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Continue to Login <ArrowRight size={16} />
        </button>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-0 px-0 lg:grid-cols-[40%_60%]">
      {/* LEFT hero */}
      <div className="br-hero-bg relative hidden overflow-hidden px-8 py-12 lg:block">
        <div className="sticky top-24">
          <span className="br-display inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Bike size={14} /> Join 200,000+ riders
          </span>
          <h2 className="br-serif mt-5 text-3xl font-bold text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-white/80">
            Register to rent bikes safely and quickly.
          </p>
          <div className="mt-8 grid gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
                  <f.icon size={19} />
                </span>
                <div>
                  <p className="br-display text-sm font-bold text-white">
                    {f.title}
                  </p>
                  <p className="text-xs text-white/75">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT form */}
      <div className="px-4 py-8 sm:px-8 lg:px-12">
        <div className="br-card mx-auto max-w-xl rounded-2xl p-5 shadow-sm sm:p-7">
          <h1 className="br-serif text-3xl font-bold">Create Your Account</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
            Register once to book bikes from verified dealers across multiple
            cities.
          </p>

          {/* Personal */}
          <p
            className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--brand-strong)" }}
          >
            Personal Information
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              icon={User}
              label="First Name"
              required
              error={errors.first}
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
              error={errors.last}
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
              icon={Calendar}
              label="Date of Birth"
              required
              error={errors.dob}
              show={err("dob")}
            >
              <input
                type="date"
                value={v.dob}
                onChange={set("dob")}
                onBlur={blur("dob")}
                className="br-dt w-full text-sm"
              />
            </Field>
            <div>
              <Label>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setV((p) => ({ ...p, gender: p.gender === g ? "" : g }))
                    }
                    className={`br-filter-chip rounded-lg px-3 py-2 text-xs font-semibold ${v.gender === g ? "br-filter-chip-active" : ""}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <p
            className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--brand-strong)" }}
          >
            Contact Information
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              icon={Mail}
              label="Email Address"
              required
              error={errors.email}
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
              label="Phone Number"
              required
              error={errors.phone}
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
          </div>

          {/* Credentials */}
          <p
            className="br-display mt-6 mb-3 text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--brand-strong)" }}
          >
            Account Credentials
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field
                icon={Lock}
                label="Password"
                required
                error={errors.pw}
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
                  onClick={() => setShowPw((s) => !s)}
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
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full"
                        style={{
                          background: i <= pwLevel ? pwColor : "#e6ebe9",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="mt-1 text-[11px] font-semibold"
                    style={{ color: pwColor }}
                  >
                    {pwLabel} password
                  </p>
                </div>
              )}
            </div>
            <Field
              icon={Lock}
              label="Confirm Password"
              required
              error={errors.cpw}
              show={err("cpw")}
            >
              <input
                type={showCpw ? "text" : "password"}
                value={v.cpw}
                onChange={set("cpw")}
                onBlur={blur("cpw")}
                placeholder="Re-enter password"
                className="br-input w-full text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCpw((s) => !s)}
                aria-label="Toggle password"
              >
                {showCpw ? (
                  <EyeOff size={16} style={{ color: "var(--mute)" }} />
                ) : (
                  <Eye size={16} style={{ color: "var(--mute)" }} />
                )}
              </button>
            </Field>
          </div>

          {/* CAPTCHA — client-side slider challenge */}
          <div
            className="mt-6 w-full max-w-xs rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--line)", background: "#fafbfb" }}
          >
            <SliderCaptcha onVerify={setCaptcha} />
          </div>

          {/* Terms */}
          <div className="mt-5 flex flex-col gap-2.5">
            <label
              className="flex cursor-pointer items-start gap-2.5 text-sm"
              style={{ color: "#3a4d55" }}
            >
              <input
                type="checkbox"
                className="br-check mt-0.5"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />{" "}
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold"
                  style={{ color: "var(--brand-strong)" }}
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold"
                  style={{ color: "var(--brand-strong)" }}
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit */}
          {regErr && (
            <p
              className="mt-3 text-center text-xs font-semibold"
              style={{ color: "#c0392b" }}
            >
              {regErr}
            </p>
          )}
          <button
            onClick={submit}
            disabled={!valid || busy}
            className="br-btn br-display mt-6 w-full rounded-xl py-3 text-sm font-semibold"
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
            {busy ? "Creating account…" : "Create Account"}
          </button>
          {!valid && (
            <p
              className="mt-2 text-center text-xs"
              style={{ color: "var(--mute)" }}
            >
              {missing} {missing === 1 ? "item needs" : "items need"} attention
              before you can register.
            </p>
          )}

          {/* divider + social */}
          <div className="my-5 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ background: "var(--line)" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--mute)" }}
            >
              OR
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--line)" }}
            />
          </div>
          <SocialButtons />

          <p
            className="mt-5 text-center text-sm"
            style={{ color: "var(--mute)" }}
          >
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="font-semibold"
              style={{ color: "var(--brand-strong)" }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
