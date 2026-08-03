// REWRITTEN. The original fabricated most of what it showed.
//
// It hardcoded "2024" as the manufacturing year, "Ceramic White" as the colour,
// and derived mileage / top speed / ABS / Bluetooth from engine size alone —
// so a 400cc scooter claimed a 160 km/h top speed. That was fine as a UI mock;
// it is not fine now that real listings exist, because a renter would treat those
// numbers as facts about the actual bike.
//
// New rule: show a row ONLY if the backend sent the value. Everything the partner
// typed into additionalSpecs (JSONB) is appended as extra rows.
import {
  Award, Bike, Calendar, Clock3, Cog, Fuel, Gauge, Info, Palette,
  Route, ShieldCheck, Timer, Users,
} from "lucide-react";
import { inr } from "../../../lib/money.js";

// Icons for the free-text keys partners commonly use in additionalSpecs.
// Anything unrecognised falls back to a neutral icon rather than being dropped.
const SPEC_ICONS = {
  mileage: Route, topspeed: Gauge, abs: Info, brakes: Info,
  weight: Info, tank: Fuel, fueltank: Fuel, range: Route,
  battery: Info, charging: Info, bluetooth: Info, console: Info,
};

const iconFor = (key) =>
  SPEC_ICONS[String(key).toLowerCase().replace(/[\s_-]/g, "")] || Info;

// Turns "topSpeed" / "top_speed" into "Top Speed" for display.
const humanise = (key) =>
  String(key)
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function buildSpecs(b) {
  const ev = b.fuel === "Electric" || !b.cc;

  const rows = [
    b.mf && { icon: Award, label: "Manufacturer", value: b.mf },
    b.model && { icon: Bike, label: "Model", value: b.model },
    b.cat && { icon: Award, label: "Category", value: b.cat },
    b.bikeType && { icon: Bike, label: "Type", value: b.bikeType },
    { icon: Gauge, label: "Engine Capacity", value: ev ? "Electric motor" : `${b.cc}cc` },
    b.fuel && { icon: Fuel, label: "Fuel Type", value: b.fuel },
    b.trans && { icon: Cog, label: "Transmission", value: b.trans },
    b.seats && { icon: Users, label: "Seating Capacity", value: `${b.seats}` },
    b.year && { icon: Calendar, label: "Manufacturing Year", value: `${b.year}` },
    b.color && { icon: Palette, label: "Colour", value: b.color },
  ].filter(Boolean);

  // Whatever the partner added themselves.
  for (const [k, v] of Object.entries(b.specs || {})) {
    if (v == null || v === "") continue;
    rows.push({ icon: iconFor(k), label: humanise(k), value: String(v) });
  }

  return rows;
}

export function buildRentalInfo(b) {
  const svc = b.services || {};

  return [
    {
      icon: ShieldCheck,
      label: "Security Deposit",
      value: b.deposit === 0 ? "No deposit" : `${inr(b.deposit)} (Refundable)`,
    },
    // These come from additionalServices, which is where AddBikeForm writes them.
    svc.kmLimit != null && {
      icon: Route, label: "Daily KM Limit", value: `${svc.kmLimit} km/day`,
    },
    svc.extraKm != null && {
      icon: Route, label: "Extra KM Charges", value: `${inr(svc.extraKm)}/km`,
    },
    svc.helmet != null && {
      icon: ShieldCheck, label: "Helmet", value: svc.helmet ? "Included" : "Not included",
    },
    svc.minHours != null && {
      icon: Timer, label: "Minimum Rental", value: `${svc.minHours} hours`,
    },
    svc.maxDays != null && {
      icon: Timer, label: "Maximum Rental", value: `${svc.maxDays} days`,
    },
    svc.fuelPolicy && { icon: Fuel, label: "Fuel Policy", value: svc.fuelPolicy },
    svc.pickupWindow && { icon: Clock3, label: "Pickup Time", value: svc.pickupWindow },
    svc.lateFee != null && {
      icon: Info, label: "Late Return", value: `${inr(svc.lateFee)} / hour`,
    },
    svc.cancellation && { icon: Info, label: "Cancellation", value: svc.cancellation },
  ].filter(Boolean);
}
