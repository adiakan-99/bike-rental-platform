import { useState } from "react";
import axios from "axios";
import { AlertCircle, Bike, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { RX } from "../../../lib/validation.js";
import {
  normalizeSession,
  fetchCustomerProfile,
  fetchCustomerKyc,
  normalizeCustomerProfile,
  normalizeKyc,
} from "../../../lib/session.js";
import { setAuth } from "../../../lib/Authstorage.js";
import { Field } from "../../../ui";
import { ForgotPasswordCard, SocialButtons } from "../components";

export function LoginPage({
  onRegister,
  onDone,
  onSocial,
  onResetPassword,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [t, setT] = useState({});
  const [authErr, setAuthErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState("login"); // login | forgot
  const [remember, setRemember] = useState(true); // Remember me: localStorage vs sessionStorage
  const eErr = !email
    ? "Email is required."
    : !RX.email.test(email)
      ? "Enter a valid email address."
      : null;
  const pErr = !pw ? "Password is required." : null;
  const valid = !eErr && !pErr;
  // One login for every role — the session that comes back decides where you land.
  // NOTE: we deliberately do NOT trust fields decoded off the JWT for anything beyond
  // "is this token valid" — /auth/me is the source of truth for roles/accountStatus,
  // avoiding the client-side-decode field-name mismatches we kept hitting before.
  const submit = async () => {
    if (!valid) {
      setT({ email: true, pw: true });
      return;
    }
    setAuthErr("");
    setBusy(true);
    try {
      const loginRes = await axios.post(`/api/v1/auth/login`, {
        email: email.trim(),
        password: pw,
      });
      const token = loginRes.data.token;
      setAuth({ token }, remember);

      const meRes = await axios.get(`/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = meRes.data;
      const [customer, kyc] = await Promise.all([
        fetchCustomerProfile(token, me),
        fetchCustomerKyc(token, me),
      ]);
      const session = {
        ...normalizeSession(me, token),
        ...normalizeCustomerProfile(customer),
        ...normalizeKyc(kyc),
      };
      setAuth(
        { userId: session.userId, firstName: session.name || "" },
        remember,
      );
      onDone(session);
    } catch (error) {
      const status = error.response?.status;
      const serverMsg =
        error.response?.data?.message || error.response?.data?.error;
      if (status === 401) setAuthErr("Invalid email or password.");
      else if (status === 403) setAuthErr("Your account has been blocked.");
      else
        setAuthErr(
          serverMsg ||
            error.message ||
            "Something went wrong. Please try again.",
        );
    } finally {
      setBusy(false);
    }
  };
  if (view === "forgot")
    return (
      <ForgotPasswordCard
        presetEmail={email}
        onBack={() => setView("login")}
        onResetPassword={onResetPassword}
        onForgotPassword={onForgotPassword}
      />
    );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="br-card w-full max-w-md rounded-2xl p-6 shadow-sm sm:p-8">
        <span
          className="grid h-12 w-12 place-items-center rounded-xl text-white"
          style={{ background: "var(--brand)" }}
        >
          <Bike size={24} strokeWidth={2.3} />
        </span>
        <h1 className="br-serif mt-4 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
          Log in to continue booking your ride.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <Field
            icon={Mail}
            label="Email Address"
            required
            error={eErr}
            show={t.email && eErr}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setT((p) => ({ ...p, email: true }))}
              placeholder="you@email.com"
              className="br-input w-full text-sm"
            />
          </Field>
          <Field
            icon={Lock}
            label="Password"
            required
            error={pErr}
            show={t.pw && pErr}
          >
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onBlur={() => setT((p) => ({ ...p, pw: true }))}
              placeholder="Your password"
              className="br-input w-full text-sm"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label="Toggle password"
            >
              {show ? (
                <EyeOff size={16} style={{ color: "var(--mute)" }} />
              ) : (
                <Eye size={16} style={{ color: "var(--mute)" }} />
              )}
            </button>
          </Field>
          <div className="flex items-center justify-between text-sm">
            <label
              className="flex cursor-pointer items-center gap-2"
              style={{ color: "#3a4d55" }}
            >
              <input
                type="checkbox"
                className="br-check"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="font-semibold"
              style={{ color: "var(--brand-strong)" }}
            >
              Forgot password?
            </button>
          </div>
          {authErr && (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ background: "#fdf2f2", color: "#dc2626" }}
            >
              <AlertCircle size={15} /> {authErr}
            </div>
          )}
          <button
            onClick={submit}
            disabled={busy}
            className="br-btn br-display w-full rounded-xl py-3 text-sm font-semibold"
            style={busy ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
          >
            {busy ? "Logging in…" : "Login"}
          </button>
        </div>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "var(--line)" }} />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--mute)" }}
          >
            OR
          </span>
          <div className="h-px flex-1" style={{ background: "var(--line)" }} />
        </div>
        <SocialButtons compact />

        <p
          className="mt-5 text-center text-sm"
          style={{ color: "var(--mute)" }}
        >
          New to BikeRental?{" "}
          <button
            onClick={onRegister}
            className="font-semibold"
            style={{ color: "var(--brand-strong)" }}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
