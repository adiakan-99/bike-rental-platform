// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";

export function TagPicker({ presets, selected, setSelected, tone }) {
  const [input, setInput] = useState("");
  const all = [...new Set([...presets, ...selected])];
  const toggle = (t) => setSelected(selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t]);
  const add = () => { const t = input.trim(); if (t && !selected.includes(t)) setSelected([...selected, t]); setInput(""); };
  const onStyle = tone === "pro" ? { background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" } : { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" };
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {all.map((t) => {
          const on = selected.includes(t);
          return <button key={t} type="button" onClick={() => toggle(t)} className="rounded-full px-3 py-1.5 text-xs font-semibold transition" style={on ? onStyle : { background: "#fff", color: "#334155", border: "1px solid var(--line)" }}>{on ? "✓ " : "+ "}{t}</button>;
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="br-field flex-1 rounded-xl px-3 py-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Add your own…" className="br-input w-full text-sm" /></div>
        <button type="button" onClick={add} className="br-ghost br-display rounded-xl px-3 py-2 text-xs font-semibold">Add</button>
      </div>
    </>
  );
}
