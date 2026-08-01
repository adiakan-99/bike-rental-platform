// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { RX, pwScore } from "../../../lib/validation.js";
import { Field, Modal } from "../../../ui";

export function AddAdminModal({ onClose, onCreate, existingEmails = [] }) {
  const [v, setV] = useState({ first: "", last: "", email: "", phone: "", pw: "", cpw: "" });
  const [t, setT] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (ev) => setV((p) => ({ ...p, [k]: ev.target.value }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const score = pwScore(v.pw);
  const pwLevel = score <= 2 ? 1 : score === 3 ? 2 : 3;
  const pwColor = pwLevel === 3 ? "var(--brand)" : pwLevel === 2 ? "#eab308" : "#dc2626";

  const e = {};
  if (!v.first.trim()) e.first = "First name is required.";
  if (!v.last.trim()) e.last = "Last name is required.";
  if (!v.email) e.email = "Email is required.";
  else if (!RX.email.test(v.email)) e.email = "Enter a valid email address.";
  else if (existingEmails.some((x) => x.toLowerCase() === v.email.trim().toLowerCase())) e.email = "An account with this email already exists.";
  if (!v.phone) e.phone = "Phone number is required."; else if (!RX.phone.test(v.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
  if (!v.pw) e.pw = "Password is required."; else if (score < 3) e.pw = "Too weak — add length, a capital, a number or symbol.";
  if (!v.cpw) e.cpw = "Please confirm the password."; else if (v.cpw !== v.pw) e.cpw = "Passwords do not match.";
  const valid = Object.keys(e).length === 0;
  const err = (k) => t[k] && e[k];

  const submit = () => {
    if (!valid) { setT(Object.fromEntries(Object.keys(v).map((k) => [k, true]))); return; }
    onCreate?.({
      email: v.email.trim(), password: v.pw, phone: v.phone.trim(),
      name: `${v.first.trim()} ${v.last.trim()}`, firstName: v.first.trim(), lastName: v.last.trim(),
    });
    setDone(true);
  };

  return (
    <Modal title={done ? "Admin account created" : "Add a new admin"}
      subtitle={done ? undefined : "Creates a staff login with full administrator access."}
      onClose={onClose} maxWidth="max-w-lg"
      footer={done
        ? <button onClick={onClose} className="br-btn br-display w-full rounded-xl py-2.5 text-sm font-semibold">Done</button>
        : <div className="flex flex-col gap-2.5 sm:flex-row">
            <button onClick={onClose} className="br-ghost br-display rounded-xl py-2.5 text-sm font-semibold sm:flex-1">Cancel</button>
            <button onClick={submit} disabled={!valid} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold sm:flex-1" style={!valid ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}><ShieldCheck size={15} /> Create admin</button>
          </div>}>
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "#b91c1c" }}><ShieldCheck size={30} /></span>
          <p className="mt-3 text-sm" style={{ color: "var(--mute)" }}>{v.first} {v.last} can now sign in at the login page with <span className="font-semibold" style={{ color: "var(--ink)" }}>{v.email}</span> and the password you set. They'll have full administrator access.</p>
        </div>
      ) : (<>
        <p className="br-display mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Personal information</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="First Name" required error={e.first} show={err("first")}><input value={v.first} onChange={set("first")} onBlur={blur("first")} placeholder="Aarav" className="br-input w-full text-sm" /></Field>
          <Field icon={User} label="Last Name" required error={e.last} show={err("last")}><input value={v.last} onChange={set("last")} onBlur={blur("last")} placeholder="Sharma" className="br-input w-full text-sm" /></Field>
        </div>

        <p className="br-display mt-5 mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Contact</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={Mail} label="Email Address" required tooltip="This becomes the admin's login." error={e.email} show={err("email")}><input type="email" value={v.email} onChange={set("email")} onBlur={blur("email")} placeholder="name@bikerental.in" className="br-input w-full text-sm" /></Field>
          <Field icon={Phone} label="Phone Number" required error={e.phone} show={err("phone")}><span className="text-sm" style={{ color: "var(--mute)" }}>+91</span><input value={v.phone} onChange={set("phone")} onBlur={blur("phone")} placeholder="98765 43210" className="br-input w-full text-sm" /></Field>
        </div>

        <p className="br-display mt-5 mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Set a password</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Field icon={Lock} label="Password" required error={e.pw} show={err("pw")}>
              <input type={showPw ? "text" : "password"} value={v.pw} onChange={set("pw")} onBlur={blur("pw")} placeholder="Create a password" className="br-input w-full text-sm" />
              <button type="button" onClick={() => setShowPw((x) => !x)} aria-label="Toggle password">{showPw ? <EyeOff size={16} style={{ color: "var(--mute)" }} /> : <Eye size={16} style={{ color: "var(--mute)" }} />}</button>
            </Field>
            {v.pw && <div className="mt-1.5 flex gap-1">{[1, 2, 3].map((i) => <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= pwLevel ? pwColor : "var(--form-bg)" }} />)}</div>}
          </div>
          <Field icon={Lock} label="Confirm Password" required error={e.cpw} show={err("cpw")}><input type="password" value={v.cpw} onChange={set("cpw")} onBlur={blur("cpw")} placeholder="Re-enter password" className="br-input w-full text-sm" /></Field>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
          <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: "#b45309" }} />
          <p className="text-xs" style={{ color: "#7c5410" }}>Admins can approve dealers and bikes, resolve disputes, and manage users. Only grant this to trusted staff.</p>
        </div>
      </>)}
    </Modal>
  );
}
