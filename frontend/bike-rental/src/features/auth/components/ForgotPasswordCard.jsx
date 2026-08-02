// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ChevronLeft, Eye, EyeOff, Loader2, Lock, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { RX, pwScore } from "../../../lib/validation.js";
import { Field } from "../../../ui";

export function ForgotPasswordCard({ onBack, presetEmail = "", onResetPassword }) {
  const [step, setStep] = useState(0);            // 0 email · 1 otp + new password · 2 done
  const [email, setEmail] = useState(presetEmail);
  const [sentTo, setSentTo] = useState("");
  const [issued, setIssued] = useState("");       // stands in for the code the server would mail
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [t, setT] = useState({});
  const [formErr, setFormErr] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);

  // resend throttle — mirrors the server-side rate limit
  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const emailErr = !email ? "Email is required." : !RX.email.test(email) ? "Enter a valid email address." : null;
  const score = pwScore(pw);
  const otpErr = !otp ? "Enter the 6-digit code." : !/^\d{6}$/.test(otp.trim()) ? "The code is 6 digits." : null;
  const pwErr = !pw ? "New password is required." : score < 3 ? "Too weak — add length, a capital, a number or a symbol." : null;
  const cpwErr = !cpw ? "Confirm your new password." : cpw !== pw ? "Passwords do not match." : null;
  const pwLevel = score <= 2 ? 1 : score === 3 ? 2 : 3;
  const pwColor = pwLevel === 3 ? "var(--brand)" : pwLevel === 2 ? "#eab308" : "#dc2626";

  const issueOtp = () => { setIssued(String(Math.floor(100000 + Math.random() * 900000))); setCooldown(30); setOtp(""); setFormErr(""); };

  const verifyEmail = () => {
    if (emailErr) { setT((p) => ({ ...p, email: true })); return; }
    setBusy(true);
    // The server sends a code and always answers the same way — revealing whether an
    // address exists here would be an account-enumeration leak.
    setTimeout(() => { setBusy(false); setSentTo(email.trim()); issueOtp(); setStep(1); }, 550);
  };

  const resend = () => { if (!cooldown) issueOtp(); };

  const submitReset = () => {
    setT({ otp: true, pw: true, cpw: true });
    if (otpErr || pwErr || cpwErr) return;
    if (otp.trim() !== issued) { setFormErr("That code is incorrect or has expired. Request a new one."); return; }
    setFormErr("");
    onResetPassword?.(sentTo, pw);
    setStep(2);
  };

  const masked = sentTo.replace(/^(.).*?(.?)@/, (_, a, b) => `${a}•••${b}@`);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="br-card w-full max-w-md rounded-2xl p-6 shadow-sm sm:p-8">
        <button onClick={onBack} className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"><ChevronLeft size={16} /> Back to login</button>

        {step === 2 ? (
          <div className="flex flex-col items-center text-center">
            <span className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: "var(--brand)" }}><CheckCircle2 size={32} /></span>
            <h1 className="br-serif br-fade-up br-d1 mt-4 text-2xl font-bold">Password updated</h1>
            <p className="br-fade-up br-d2 mt-2 text-sm" style={{ color: "var(--mute)" }}>You can now log in with your new password.</p>
            <button onClick={onBack} className="br-btn br-display br-fade-up br-d3 mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">Continue to Login <ArrowRight size={16} /></button>
          </div>
        ) : (<>
          <span className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: "var(--brand)" }}>{step === 0 ? <Mail size={22} /> : <Lock size={22} />}</span>
          <h1 className="br-serif mt-4 text-2xl font-bold">{step === 0 ? "Forgot your password?" : "Enter the code we sent"}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
            {step === 0 ? "Enter the email on your account and we'll send a 6-digit verification code." : <>We sent a code to <span className="font-semibold" style={{ color: "var(--ink)" }}>{masked}</span>. It expires in 10 minutes.</>}
          </p>

          {/* step indicator */}
          <div className="mt-5 flex items-center gap-2">
            {[0, 1].map((i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= step ? "var(--brand)" : "var(--line)" }} />)}
          </div>

          {step === 0 ? (
            <div className="mt-5 flex flex-col gap-4">
              <Field icon={Mail} label="Email Address" required error={emailErr} show={t.email && emailErr}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setT((p) => ({ ...p, email: true }))} placeholder="you@email.com" className="br-input w-full text-sm" />
              </Field>
              <button onClick={verifyEmail} disabled={busy} className="br-btn br-display flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" style={busy ? { opacity: 0.75, cursor: "wait" } : undefined}>
                {busy ? <><Loader2 size={16} className="animate-spin" /> Sending code…</> : <>Verify <ArrowRight size={16} /></>}
              </button>
              <p className="text-center text-xs" style={{ color: "var(--mute)" }}>Remembered it? <button onClick={onBack} className="font-semibold" style={{ color: "var(--brand-strong)" }}>Log in instead</button></p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-4">
              <Field icon={ShieldCheck} label="Verification Code (OTP)" required error={otpErr} show={t.otp && otpErr}>
                <input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} onBlur={() => setT((p) => ({ ...p, otp: true }))} placeholder="6-digit code" className="br-input w-full text-sm tracking-[0.35em]" />
              </Field>

              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--mute)" }}>Didn't get the code?</span>
                <button onClick={resend} disabled={!!cooldown} className="br-display flex items-center gap-1.5 font-semibold" style={{ color: cooldown ? "var(--mute)" : "var(--brand-strong)", cursor: cooldown ? "not-allowed" : "pointer" }}>
                  <RefreshCw size={13} /> {cooldown ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>

              <Field icon={Lock} label="New Password" required error={pwErr} show={t.pw && pwErr}>
                <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} onBlur={() => setT((p) => ({ ...p, pw: true }))} placeholder="Create a new password" className="br-input w-full text-sm" />
                <button type="button" onClick={() => setShowPw((x) => !x)} aria-label="Toggle password">{showPw ? <EyeOff size={16} style={{ color: "var(--mute)" }} /> : <Eye size={16} style={{ color: "var(--mute)" }} />}</button>
              </Field>
              {pw && (
                <div className="-mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">{[1, 2, 3].map((i) => <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= pwLevel ? pwColor : "var(--line)" }} />)}</div>
                  <span className="text-[11px] font-semibold" style={{ color: pwColor }}>{["", "Weak", "Medium", "Strong"][pwLevel]}</span>
                </div>
              )}

              <Field icon={Lock} label="Confirm New Password" required error={cpwErr} show={t.cpw && cpwErr}>
                <input type={showPw ? "text" : "password"} value={cpw} onChange={(e) => setCpw(e.target.value)} onBlur={() => setT((p) => ({ ...p, cpw: true }))} placeholder="Re-enter the new password" className="br-input w-full text-sm" />
              </Field>

              {formErr && <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium" style={{ background: "#fdf2f2", color: "#dc2626" }}><AlertCircle size={15} /> {formErr}</div>}

              <button onClick={submitReset} className="br-btn br-display w-full rounded-xl py-3 text-sm font-semibold">Reset Password</button>
              <button onClick={() => { setStep(0); setFormErr(""); setT({}); }} className="text-center text-xs font-semibold" style={{ color: "var(--mute)" }}>Use a different email</button>

              {/* prototype only — a real build never returns the code to the client */}
              <details className="rounded-xl px-3 py-2 text-xs" style={{ background: "var(--form-bg)", color: "var(--mute)" }}>
                <summary className="cursor-pointer font-semibold">Demo: show the code that was "sent"</summary>
                <p className="mt-2 br-display text-base font-bold tracking-[0.3em]" style={{ color: "var(--brand-strong)" }}>{issued}</p>
              </details>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}
