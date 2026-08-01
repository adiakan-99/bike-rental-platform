// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { CalendarDays, Search, Zap } from "lucide-react";
import { durationHours, durationLabel } from "../../../lib/datetime.js";
import { CityField } from "./CityField.jsx";
import { DateTimeField } from "./DateTimeField.jsx";

export function SearchCard({ onSearch, city: cityProp, onCity }) {
  const [cityInner, setCityInner] = useState("");
  // City can be driven from outside (the Popular chips) or held locally.
  const city = cityProp !== undefined ? cityProp : cityInner;
  const setCity = onCity || setCityInner;
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [warn, setWarn] = useState(null);
  const dur = durationLabel(
    durationHours(startDate, startTime, endDate, endTime),
  );
  const search = () => {
    if (!city) return setWarn("Pick a city to see available bikes.");
    if (!startDate || !endDate)
      return setWarn("Choose your start and end dates.");
    if (!dur) return setWarn("End time must be after the start time.");
    setWarn(null);
    onSearch({ city, startDate, startTime, endDate, endTime });
  };
  return (
    <div
      className="br-fade-up br-d3 br-search-card w-full rounded-2xl bg-white p-4 sm:p-6"
      style={{ border: "1px solid rgba(255,255,255,.6)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="br-display text-base font-bold">Find a bike</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <CityField value={city} onChange={setCity} solid />
          <div className="md:col-span-2">
            {dur && (
              <div className="mb-3 flex justify-end">
                <span
                  className="br-display rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: "#e7f2f9",
                    color: "var(--brand-strong)",
                  }}
                >
                  {dur}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DateTimeField
                plain
                solid
                label="Start"
                date={startDate}
                time={startTime}
                onDate={setStartDate}
                onTime={setStartTime}
              />
              <DateTimeField
                plain
                solid
                label="End"
                date={endDate}
                time={endTime}
                onDate={setEndDate}
                onTime={setEndTime}
              />
            </div>
          </div>
        </div>
        <button
          onClick={search}
          className="br-cta br-display flex w-full items-center justify-center gap-2 px-8 text-sm font-semibold md:w-auto md:self-end"
          style={{ height: 58 }}
        >
          <Search size={18} strokeWidth={2.5} /> Search Bikes
        </button>
      </div>
      {warn && (
        <div
          className="br-fade-up mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "#fff7ed", color: "#b45309" }}
        >
          <Zap size={16} /> {warn}
        </div>
      )}
    </div>
  );
}
