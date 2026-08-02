// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { MONTHS } from "../constants";

export function fmtDateTime(dateStr, timeStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  let out = `${d} ${MONTHS[m - 1]} ${y}`;
  if (timeStr) { let [h, min] = timeStr.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; out += ` · ${h}:${String(min).padStart(2, "0")} ${ap}`; }
  return out;
}

export function durationHours(sd, st, ed, et) {
  if (!sd || !ed) return 0;
  const s = new Date(`${sd}T${st || "00:00"}`), e = new Date(`${ed}T${et || "00:00"}`);
  const ms = e - s; return isNaN(ms) || ms <= 0 ? 0 : Math.round(ms / 3.6e6);
}

export function durationLabel(hours) {
  if (!hours) return null;
  const days = Math.floor(hours / 24), rem = hours % 24;
  if (days === 0) return `${hours} hr`;
  return rem === 0 ? `${days} day${days > 1 ? "s" : ""}` : `${days} day${days > 1 ? "s" : ""} ${rem} hr`;
}

export function hoursLeft(due) {
  if (!due) return 0;
  return Math.max(0, Math.round((due - new Date()) / 3.6e6));
}

export function fmtDue(due) {
  if (!due) return "—";
  const ap = due.getHours() >= 12 ? "PM" : "AM";
  return `${due.getDate()} ${MONTHS[due.getMonth()]}, ${due.getHours() % 12 || 12}:${String(due.getMinutes()).padStart(2, "0")} ${ap}`;
}

export const fmtDay = (ds) => { if (!ds) return "—"; const [y, m, d] = ds.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
