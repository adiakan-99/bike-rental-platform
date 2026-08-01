// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { SPEC_TYPES } from "../../../constants";
import { Modal } from "../../../ui";

export function AddSpecModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(SPEC_TYPES[0]);
  const [touched, setTouched] = useState(false);
  const err = !name.trim() ? "Give the specification a name." : null;
  const submit = () => { setTouched(true); if (err) return; onAdd({ name: name.trim(), type }); };
  return (
    <Modal
      title="Add specification"
      subtitle="Appears on the bike's detail page"
      onClose={onClose}
      maxWidth="max-w-md"
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Cancel</button>
          <button onClick={submit} className="br-btn br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Add specification</button>
        </div>
      }
    >
      <div>
        <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>Specification name <span style={{ color: "#dc2626" }}>*</span></p>
        <input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} autoFocus placeholder="e.g. Mileage 45 kmpl, Top speed 120 km/h, ABS" className="br-input br-field w-full rounded-xl px-3.5 py-2.5 text-sm" />
        {touched && err && <p className="mt-1 flex items-center gap-1 text-[11px] font-medium" style={{ color: "#dc2626" }}><AlertCircle size={11} /> {err}</p>}
      </div>
      <div className="mt-4">
        <p className="br-display mb-1 text-xs font-semibold" style={{ color: "#334155" }}>Type</p>
        <select value={type} onChange={(e) => setType(e.target.value)} className="br-input br-field w-full rounded-xl px-3.5 py-2.5 text-sm">
          {SPEC_TYPES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </Modal>
  );
}
