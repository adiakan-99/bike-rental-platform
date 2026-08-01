// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { AlertCircle, Briefcase, Check, CheckCircle2, ChevronLeft, CreditCard, Eye, EyeOff, FileText, Lock, LogOut, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { GENDERS, ID_TYPES, PARTNER_DOCS, STATES } from "../../../constants";
import { pwScore } from "../../../lib/validation.js";
import { ProfileField, ProfileSection } from "../components";

export function ProfilePage({ session, profile, onSave, onChangePassword, onBack, onLogout }) {
  const isAdmin = session?.roles?.includes("ADMIN");
  const isPartner = session?.roles?.includes("PARTNER");
  const isCustomer = session?.roles?.includes("CUSTOMER");
  const [f, setF] = useState(() => ({ ...profile }));
  const [savedTick, setSavedTick] = useState(false);
  const set = (k) => (val) => setF((p) => ({ ...p, [k]: val }));

  // dirty check so Save is only enabled when something actually changed
  const dirty = useMemo(() => JSON.stringify(f) !== JSON.stringify(profile), [f, profile]);
  const save = () => { onSave(f); setSavedTick(true); setTimeout(() => setSavedTick(false), 2200); };

  // password sub-form
  const [pw, setPw] = useState({ cur: "", next: "", conf: "" });
  const [pwT, setPwT] = useState({});
  const [pwMsg, setPwMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const score = pwScore(pw.next);
  const pwLevel = score <= 2 ? 1 : score === 3 ? 2 : 3;
  const pwColor = pwLevel === 3 ? "var(--brand)" : pwLevel === 2 ? "#eab308" : "#dc2626";
  const pwErr = {
    cur: !pw.cur ? "Enter your current password." : null,
    next: !pw.next ? "Enter a new password." : score < 3 ? "Too weak — add length, a capital, a number or a symbol." : null,
    conf: !pw.conf ? "Confirm the new password." : pw.conf !== pw.next ? "Passwords do not match." : null,
  };
  const submitPw = () => {
    setPwT({ cur: true, next: true, conf: true });
    if (pwErr.cur || pwErr.next || pwErr.conf) return;
    const res = onChangePassword(pw.cur, pw.next);
    if (res?.ok) { setPw({ cur: "", next: "", conf: "" }); setPwT({}); setPwMsg({ ok: true, text: "Password updated." }); }
    else { setPwMsg({ ok: false, text: res?.error || "Couldn't update password." }); }
    setTimeout(() => setPwMsg(null), 3000);
  };

  const roleLabel = isAdmin ? "Administrator" : isPartner ? "Partner" : "Customer";
  const roleColor = isAdmin ? "#b91c1c" : isPartner ? "#6d28d9" : "var(--teal)";

  return (
    <div className="mx-auto max-w-[880px] px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={onBack} className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"><ChevronLeft size={16} /> Back</button>

      {/* header */}
      <div className="br-card flex flex-col gap-4 rounded-2xl p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-white" style={{ background: roleColor }}>{isAdmin ? <ShieldCheck size={28} /> : isPartner ? <Briefcase size={28} /> : <User size={28} />}</span>
        <div className="min-w-0 flex-1">
          <h1 className="br-serif text-2xl font-bold">{profile.first || session?.name?.split(" ")[0]} {profile.last}</h1>
          <p className="text-sm" style={{ color: "var(--mute)" }}>{session?.email}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {session?.roles?.map((r) => <span key={r} className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={r === "ADMIN" ? { background: "#fee2e2", color: "#b91c1c" } : r === "PARTNER" ? { background: "#ede9fe", color: "#6d28d9" } : { background: "#dbeafe", color: "#1d4ed8" }}>{r}</span>)}
            {isPartner && session?.approvalStatus && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={session.approvalStatus === "APPROVED" ? { background: "#dcfce7", color: "#15803d" } : { background: "#fef3c7", color: "#b45309" }}>{session.approvalStatus === "APPROVED" ? "Approved" : "Under review"}</span>}
          </div>
        </div>
        <span className="br-display hidden shrink-0 rounded-xl px-3 py-2 text-sm font-semibold sm:block" style={{ background: "var(--form-bg)", color: "var(--brand-strong)" }}>{roleLabel}</span>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {/* Personal — every role */}
        <ProfileSection title="Personal information" icon={User} subtitle="Shown across your account">
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="First name" value={f.first} onChange={set("first")} placeholder="First name" />
            <ProfileField label="Last name" value={f.last} onChange={set("last")} placeholder="Last name" />
            <ProfileField label="Email address" value={f.email} onChange={set("email")} type="email" icon={Mail} hint="Also used to sign in" />
            <ProfileField label="Phone number" value={f.phone} onChange={set("phone")} icon={Phone} />
            <ProfileField label="Date of birth" value={f.dob} onChange={set("dob")} type="date" />
            <ProfileField label="Gender" value={f.gender} onChange={set("gender")} options={GENDERS} />
          </div>
        </ProfileSection>

        {/* Customer identity & address — customers and partners (partners are customers too) */}
        {isCustomer && (
          <ProfileSection title="Identity & licence" icon={CreditCard} subtitle="Required to rent and ride">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Driving licence no." value={f.dl} onChange={set("dl")} placeholder="MH0120200001234" />
              <ProfileField label="Government ID type" value={f.idType} onChange={set("idType")} options={ID_TYPES} />
              <ProfileField label="Government ID number" value={f.idNumber} onChange={set("idNumber")} placeholder="ID number" />
              <ProfileField label="Emergency contact" value={f.emergency} onChange={set("emergency")} icon={Phone} placeholder="Name & number" />
            </div>
          </ProfileSection>
        )}

        {isCustomer && (
          <ProfileSection title="Address" icon={MapPin}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><ProfileField label="Street address" value={f.addr} onChange={set("addr")} placeholder="House / street" /></div>
              <ProfileField label="City" value={f.city} onChange={set("city")} />
              <ProfileField label="State" value={f.state} onChange={set("state")} options={STATES} />
              <ProfileField label="PIN code" value={f.pincode} onChange={set("pincode")} />
            </div>
          </ProfileSection>
        )}

        {/* Partner business + documents */}
        {isPartner && (
          <ProfileSection title="Partner / business details" icon={Briefcase} subtitle="Your hosting profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Business / owner name" value={f.business} onChange={set("business")} placeholder="Registered name" />
              <ProfileField label="Business type" value={f.bizType} onChange={set("bizType")} options={["Individual", "Proprietorship", "Partnership", "Private Limited", "LLP"]} />
              <ProfileField label="PAN" value={f.pan} onChange={set("pan")} placeholder="ABCDE1234F" />
              <ProfileField label="GSTIN" value={f.gstin} onChange={set("gstin")} placeholder="Optional" hint="Leave blank if unregistered" />
              <ProfileField label="Bank account no." value={f.accNo} onChange={set("accNo")} placeholder="Payout account" />
              <ProfileField label="IFSC" value={f.ifsc} onChange={set("ifsc")} placeholder="BANK0001234" />
            </div>
          </ProfileSection>
        )}

        {isPartner && (
          <ProfileSection title="Partner documents" icon={FileText} subtitle="Re-upload to replace what's on file">
            <div className="flex flex-col gap-2.5">
              {PARTNER_DOCS.map((d) => {
                const onFile = f.docs?.[d.k];
                return (
                  <div key={d.k} className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: "var(--form-bg)" }}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: onFile ? "#dcfce7" : "#fff", border: onFile ? "none" : "1px solid var(--line)" }}>{onFile ? <Check size={16} style={{ color: "#15803d" }} /> : <FileText size={16} style={{ color: "var(--mute)" }} />}</span>
                      <div className="min-w-0">
                        <p className="br-display truncate text-sm font-bold">{d.label}</p>
                        <p className="truncate text-xs" style={{ color: "var(--mute)" }}>{onFile || d.hint}</p>
                      </div>
                    </div>
                    <label className="br-ghost br-display shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold">
                      {onFile ? "Replace" : "Upload"}
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setF((p) => ({ ...p, docs: { ...(p.docs || {}), [d.k]: file.name } })); }} />
                    </label>
                  </div>
                );
              })}
            </div>
          </ProfileSection>
        )}

        {/* Admin work profile */}
        {isAdmin && (
          <ProfileSection title="Staff details" icon={ShieldCheck} subtitle="Visible to other admins">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Designation" value={f.designation} onChange={set("designation")} placeholder="e.g. Approvals Admin" />
              <ProfileField label="Department" value={f.dept} onChange={set("dept")} placeholder="e.g. Trust & Safety" />
              <ProfileField label="Employee ID" value={f.empId} onChange={set("empId")} placeholder="ADM-0000" />
            </div>
          </ProfileSection>
        )}

        {/* sticky-ish save bar for profile fields */}
        <div className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
          <p className="text-xs" style={{ color: savedTick ? "var(--brand-strong)" : "var(--mute)" }}>{savedTick ? "Changes saved." : dirty ? "You have unsaved changes." : "Everything up to date."}</p>
          <button onClick={save} disabled={!dirty} className="br-btn br-display rounded-xl px-6 py-2.5 text-sm font-semibold" style={!dirty ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>{savedTick ? "Saved ✓" : "Save changes"}</button>
        </div>

        {/* Change password — every role */}
        <ProfileSection title="Change password" icon={Lock} subtitle="Use a strong, unique password">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 sm:max-w-sm">
              <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>Current password</p>
              <div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}>
                <Lock size={15} style={{ color: "var(--brand)" }} className="shrink-0" />
                <input type={showPw ? "text" : "password"} value={pw.cur} onChange={(e) => setPw((p) => ({ ...p, cur: e.target.value }))} onBlur={() => setPwT((p) => ({ ...p, cur: true }))} placeholder="Current password" className="br-input w-full text-sm" />
                <button type="button" onClick={() => setShowPw((x) => !x)} aria-label="Toggle password">{showPw ? <EyeOff size={16} style={{ color: "var(--mute)" }} /> : <Eye size={16} style={{ color: "var(--mute)" }} />}</button>
              </div>
              {pwT.cur && pwErr.cur && <p className="mt-1 text-[11px] font-medium" style={{ color: "#dc2626" }}>{pwErr.cur}</p>}
            </div>
            <div>
              <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>New password</p>
              <div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}>
                <Lock size={15} style={{ color: "var(--brand)" }} className="shrink-0" />
                <input type={showPw ? "text" : "password"} value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} onBlur={() => setPwT((p) => ({ ...p, next: true }))} placeholder="New password" className="br-input w-full text-sm" />
              </div>
              {pw.next && <div className="mt-1.5 flex items-center gap-2"><div className="flex flex-1 gap-1">{[1, 2, 3].map((i) => <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= pwLevel ? pwColor : "var(--line)" }} />)}</div><span className="text-[11px] font-semibold" style={{ color: pwColor }}>{["", "Weak", "Medium", "Strong"][pwLevel]}</span></div>}
              {pwT.next && pwErr.next && <p className="mt-1 text-[11px] font-medium" style={{ color: "#dc2626" }}>{pwErr.next}</p>}
            </div>
            <div>
              <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>Confirm new password</p>
              <div className="br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}>
                <Lock size={15} style={{ color: "var(--brand)" }} className="shrink-0" />
                <input type={showPw ? "text" : "password"} value={pw.conf} onChange={(e) => setPw((p) => ({ ...p, conf: e.target.value }))} onBlur={() => setPwT((p) => ({ ...p, conf: true }))} placeholder="Re-enter new password" className="br-input w-full text-sm" />
              </div>
              {pwT.conf && pwErr.conf && <p className="mt-1 text-[11px] font-medium" style={{ color: "#dc2626" }}>{pwErr.conf}</p>}
            </div>
          </div>
          {pwMsg && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium" style={pwMsg.ok ? { background: "#e7f7ef", color: "#0b7a4f" } : { background: "#fdf2f2", color: "#dc2626" }}>{pwMsg.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />} {pwMsg.text}</div>}
          <button onClick={submitPw} className="br-btn br-display mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold">Update password</button>
        </ProfileSection>

        <button onClick={onLogout} className="br-display flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" style={{ border: "1.5px solid #dc2626", color: "#dc2626", background: "#fff" }}><LogOut size={16} /> Log out</button>
      </div>
    </div>
  );
}
