// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, RefreshCw } from "lucide-react";

export function SliderCaptcha({ onVerify }) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const dragRef = useRef(null);
  const [target, setTarget] = useState(0);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | dragging | ok | fail
  const PIECE = 42, TOL = 9;

  const setP = (val) => { posRef.current = val; setPos(val); };
  const reset = () => {
    const w = trackRef.current?.offsetWidth || 300;
    const max = w - PIECE;
    setTarget(Math.round(max * (0.46 + Math.random() * 0.46)));
    setP(0); setStatus("idle"); onVerify?.(false);
  };
  useEffect(() => { reset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e) => {
    if (status === "ok") return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startPos: posRef.current, max: trackRef.current.offsetWidth - PIECE };
    setStatus("dragging");
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    let next = dragRef.current.startPos + (e.clientX - dragRef.current.startX);
    next = Math.max(0, Math.min(dragRef.current.max, next));
    setP(next);
  };
  const onUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (Math.abs(posRef.current - target) <= TOL) { setP(target); setStatus("ok"); onVerify?.(true); }
    else { setStatus("fail"); onVerify?.(false); setTimeout(() => { setP(0); setStatus("idle"); }, 450); }
  };

  const ok = status === "ok", fail = status === "fail";
  return (
    <div>
      <div ref={trackRef} className="relative w-full overflow-hidden rounded-lg" style={{ height: 48, background: "#fff", border: "1px solid var(--line)", touchAction: "none" }}>
        <div style={{ position: "absolute", top: 4, left: target, width: PIECE, height: 40, borderRadius: 8, border: "2px dashed #b6c6d1", background: "rgba(182,198,209,.16)" }} />
        <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          role="slider" aria-label="Drag to verify you are human" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((pos / Math.max(1, (trackRef.current?.offsetWidth || 300) - PIECE)) * 100)} tabIndex={0}
          style={{ position: "absolute", top: 4, left: pos, width: PIECE, height: 40, borderRadius: 8, display: "grid", placeItems: "center", color: "#fff",
            cursor: ok ? "default" : "grab", touchAction: "none", transition: dragRef.current ? "none" : "left .25s ease",
            background: fail ? "#dc2626" : "linear-gradient(135deg,var(--brand),var(--brand-2))", boxShadow: "0 4px 10px -4px rgba(15,143,181,.5)" }}>
          {ok ? <Check size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: ok ? "#15803d" : fail ? "#dc2626" : "var(--mute)" }}>
          {ok ? "Verified — you're human" : fail ? "Not quite — try again" : "Drag the arrow into the dashed box"}
        </span>
        <button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><RefreshCw size={12} /> New</button>
      </div>
    </div>
  );
}
