// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Award, Bike, Bluetooth, Calendar, Clock3, Cog, Disc, Fuel, Gauge, Info, Palette, Power, Route, ShieldCheck, Smartphone, Gauge as Speed, Timer, Usb } from "lucide-react";
import { inr } from "../../../lib/money.js";

export function buildSpecs(b) {
  const high = b.cc >= 300, mid = b.cc >= 150, ev = b.fuel === "Electric";
  return [
    { icon: Award, label: "Manufacturer", value: b.mf }, { icon: Bike, label: "Model", value: b.name },
    { icon: Calendar, label: "Manufacturing Year", value: "2024" }, { icon: Calendar, label: "Registration Year", value: "2024" },
    { icon: Award, label: "Category", value: b.cat }, { icon: Gauge, label: "Engine Capacity", value: ev ? "Electric motor" : `${b.cc}cc` },
    { icon: Fuel, label: "Fuel Type", value: b.fuel }, { icon: Cog, label: "Transmission", value: b.trans },
    { icon: Route, label: "Mileage", value: ev ? "~110 km range" : mid ? "35 kmpl" : "50 kmpl" },
    { icon: Speed, label: "Top Speed", value: ev ? "90 km/h" : high ? "160 km/h" : mid ? "130 km/h" : "90 km/h" },
    { icon: Palette, label: "Color", value: "Ceramic White" }, { icon: Disc, label: "ABS", value: mid || ev ? "Dual-channel" : "Single-channel" },
    { icon: Disc, label: "Disc Brakes", value: "Front & Rear" }, { icon: Power, label: "Electric Start", value: "Yes" },
    { icon: ShieldCheck, label: "Helmet Included", value: b.helmet ? "Yes" : "No" }, { icon: Smartphone, label: "Mobile Holder", value: "Yes" },
    { icon: Usb, label: "USB Charging", value: "Yes" }, { icon: Bluetooth, label: "Bluetooth", value: high || ev ? "Yes" : "Not available" },
  ];
}

export function buildRentalInfo(b) {
  return [
    { icon: ShieldCheck, label: "Security Deposit", value: b.deposit === 0 ? "No deposit" : `${inr(b.deposit)} (Refundable)` },
    { icon: Timer, label: "Minimum Rental", value: "8 hours" }, { icon: Timer, label: "Maximum Rental", value: "30 days" },
    { icon: Route, label: "Daily KM Limit", value: b.cc >= 300 ? "150 km/day" : "120 km/day" }, { icon: Route, label: "Extra KM Charges", value: "₹5/km" },
    { icon: Fuel, label: "Fuel Policy", value: "Return at same level" }, { icon: Clock3, label: "Pickup Time", value: "9:00 AM – 8:00 PM" },
    { icon: Clock3, label: "Return Time", value: "Before 8:00 PM" }, { icon: Info, label: "Late Return", value: "₹150 / hour" },
    { icon: Info, label: "Cancellation", value: "Free up to 24 hrs prior" },
  ];
}
