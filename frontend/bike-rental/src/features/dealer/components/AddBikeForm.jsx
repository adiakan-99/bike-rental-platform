// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import {
  AlertCircle,
  Award,
  Bike,
  Calendar,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Cog,
  CreditCard,
  FileText,
  Fuel,
  Gauge,
  ImagePlus,
  PlusCircle,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import { CATEGORIES, MANUFACTURERS } from "../../../constants";
import { CheckSection, Field, Label } from "../../../ui";
import { AddSpecModal } from "./AddSpecModal.jsx";
import { uploadBikeFile } from "../../../api/http.js";

export function AddBikeForm({ onCancel, onSubmit, initial = null }) {
  // `initial` turns this into an edit form: same fields, prefilled from the listing.
  const isEdit = !!initial;
  const str = (x, fallback = "") =>
    x === undefined || x === null || x === "" ? fallback : String(x);
  const [v, setV] = useState({
    name: str(initial?.name),
    mf: str(initial?.mf, "Honda"),
    cat: str(initial?.cat, "Commuter"),
    cc: initial?.cc ? String(initial.cc) : "",
    fuel: str(initial?.fuel, "Petrol"),
    trans: str(initial?.trans, "Manual"),
    year: str(initial?.year),
    reg: str(initial?.reg),
    price: str(initial?.price),
    deposit: initial?.deposit === 0 ? "0" : str(initial?.deposit),
    kmLimit: str(initial?.kmLimit, "120"),
    extraKm: str(initial?.extraKm, "5"),
    desc: str(initial?.desc),
    model: str(initial?.model),
    bikeType: str(initial?.bikeType, "Standard"),
    seats: str(initial?.seats, "2"),
    color: str(initial?.color),
    insuranceNumber: str(initial?.insurance?.insuranceNumber),
    insuranceProvider: str(initial?.insurance?.policyProvider),
    insuranceHolder: str(initial?.insurance?.policyHolderName),
  });
  const [helmet, setHelmet] = useState(initial?.helmet ?? true);
  const [photos, setPhotos] = useState([]);
  // Three named certificates, each with its own file + expiry date.
  const [certs, setCerts] = useState(() => ({
    rc: {
      file: initial?.certs?.rc?.file || "",
      expiry: initial?.certs?.rc?.expiry || "",
    },
    insurance: {
      file: initial?.certs?.insurance?.file || "",
      expiry: initial?.certs?.insurance?.expiry || "",
    },
    puc: {
      file: initial?.certs?.puc?.file || "",
      expiry: initial?.certs?.puc?.expiry || "",
    },
  }));
  const [specs, setSpecs] = useState(() =>
    Array.isArray(initial?.specs) ? initial.specs : [],
  );
  const [specModal, setSpecModal] = useState(false);
  const [t, setT] = useState({});

  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));

  const errors = {};
  if (!v.name.trim()) errors.name = "Bike name is required.";
  if (v.fuel !== "Electric" && !(Number(v.cc) > 0))
    errors.cc = "Enter engine capacity in cc.";
  if (!/^\d{4}$/.test(v.year) || Number(v.year) < 2005 || Number(v.year) > 2026)
    errors.year = "Enter a valid year (2005–2026).";
  if (!/^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{1,4}$/i.test(v.reg.trim()))
    errors.reg = "Format e.g. MH12 AB 1234.";
  if (!(Number(v.price) > 0)) errors.price = "Set a daily price.";
  if (v.deposit === "" || Number(v.deposit) < 0)
    errors.deposit = "Set a deposit (0 for none).";

  // --- ADD THIS INSURANCE VALIDATION ---
  if (!v.insuranceNumber || !v.insuranceNumber.trim())
    errors.insuranceNumber = "Insurance policy number is required.";
  if (!v.insuranceProvider || !v.insuranceProvider.trim())
    errors.insuranceProvider = "Insurance provider is required.";
  if (!v.insuranceHolder || !v.insuranceHolder.trim())
    errors.insuranceHolder = "Policy holder name is required.";
  // ------------------------------------
  // On edit the listing already has approved photos/docs on file — only require new ones on create.
  if (!isEdit && photos.length === 0) errors.photos = "Add at least one photo.";
  const CERT_DEFS = [
    { k: "rc", label: "RC certificate" },
    { k: "insurance", label: "Insurance policy" },
    { k: "puc", label: "PUC certificate" },
  ];
  const certErrs = {};
  CERT_DEFS.forEach(({ k, label }) => {
    const c = certs[k];
    if (!isEdit && !c.file) certErrs[`${k}File`] = `Upload the ${label}.`;
    if (c.file && !c.expiry) certErrs[`${k}Exp`] = "Add the expiry date.";
  });
  Object.assign(errors, certErrs);
  const missing = Object.keys(errors).length;
  const valid = missing === 0;
  const err = (k) => t[k] && errors[k];

  const addPhotos = (files) =>
    setPhotos((p) =>
      [
        ...p,
        ...Array.from(files).map((f) => ({
          url: URL.createObjectURL(f),
          file: f,
        })),
      ].slice(0, 8),
    );
  const setCertFile = (k, f) =>
    setCerts((p) => ({
      ...p,
      [k]: { ...p[k], file: f ? f.name : "", raw: f },
    }));
  const setCertExp = (k, val) =>
    setCerts((p) => ({ ...p, [k]: { ...p[k], expiry: val } }));
  const addSpec = (spec) => setSpecs((p) => [...p, spec]);
  const removeSpec = (i) => setSpecs((p) => p.filter((_, j) => j !== i));
  // const submit = () => {
  //   if (!valid) {
  //     setT(
  //       Object.fromEntries(
  //         [
  //           ...Object.keys(v),
  //           "insuranceNumber",
  //           "insuranceProvider",
  //           "insuranceHolder",
  //           "photos",
  //           "rcFile",
  //           "rcExp",
  //           "insuranceFile",
  //           "insuranceExp",
  //           "pucFile",
  //           "pucExp",
  //         ].map((k) => [k, true]),
  //       ),
  //     );
  //     return;
  //   }
  //   const uploadedDocs = [
  //     certs.rc.file && {
  //       type: "RC book",
  //       file: certs.rc.file,
  //       expiry: certs.rc.expiry,
  //       kind: /\.(jpg|jpeg|png)$/i.test(certs.rc.file) ? "image" : "pdf",
  //     },
  //     certs.insurance.file && {
  //       type: "Insurance",
  //       file: certs.insurance.file,
  //       expiry: certs.insurance.expiry,
  //       kind: /\.(jpg|jpeg|png)$/i.test(certs.insurance.file) ? "image" : "pdf",
  //     },
  //     certs.puc.file && {
  //       type: "PUC",
  //       file: certs.puc.file,
  //       expiry: certs.puc.expiry,
  //       kind: /\.(jpg|jpeg|png)$/i.test(certs.puc.file) ? "image" : "pdf",
  //     },
  //   ].filter(Boolean);
  //   const payload = {
  //     ...v,
  //     cc: Number(v.cc) || 0,
  //     price: Number(v.price),
  //     deposit: Number(v.deposit),
  //     kmLimit: Number(v.kmLimit),
  //     extraKm: Number(v.extraKm) || 0,
  //     helmet,
  //     specs,
  //     certs,
  //   };
  //   // Keep existing media on edit unless replacements were provided.
  //   if (!isEdit || photos.length) payload.photos = photos.length;
  //   if (!isEdit || uploadedDocs.length)
  //     payload.docs = uploadedDocs.length ? uploadedDocs : undefined;
  //   onSubmit(payload);
  // };
  const submit = async () => {
    if (!valid) {
      setT(
        Object.fromEntries(
          [
            ...Object.keys(v),
            "insuranceNumber",
            "insuranceProvider",
            "insuranceHolder",
            "photos",
            "rcFile",
            "rcExp",
            "insuranceFile",
            "insuranceExp",
            "pucFile",
            "pucExp",
          ].map((k) => [k, true]),
        ),
      );
      return;
    }

    setBusy(true);

    try {
      // 1. Upload photos in parallel to storage
      const photoUrls = await Promise.all(
        photos
          .filter((p) => p.file)
          .map((p) => uploadBikeFile(p.file, "BIKE_IMAGE")),
      );

      // 2. Upload document certificates
      const certUrls = {};
      if (certs.rc.raw) certUrls.rc = await uploadBikeFile(certs.rc.raw, "RC");
      if (certs.puc.raw)
        certUrls.puc = await uploadBikeFile(certs.puc.raw, "PUC");
      if (certs.insurance.raw)
        certUrls.insurance = await uploadBikeFile(
          certs.insurance.raw,
          "INSURANCE",
        );

      // 3. Send payload with real uploaded URLs to onSubmit
      await onSubmit({
        ...v,
        cc: Number(v.cc) || 0,
        price: Number(v.price),
        deposit: Number(v.deposit),
        kmLimit: Number(v.kmLimit),
        extraKm: Number(v.extraKm) || 0,
        helmet,
        specs,
        rcExpiry: certs.rc.expiry,
        pucExpiry: certs.puc.expiry,
        insuranceExpiry: certs.insurance.expiry,
        _photoUrls: photoUrls,
        _certUrls: certUrls,
      });
    } catch (e) {
      setT((p) => ({ ...p, _upload: e.userMessage || "Upload failed." }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        onClick={onCancel}
        className="br-crumb mb-4 flex items-center gap-1.5 text-sm font-semibold"
      >
        <ChevronLeft size={16} /> Back to fleet
      </button>
      <h2 className="br-serif text-2xl font-bold">
        {isEdit ? `Edit ${initial.name}` : "List a bike"}
      </h2>
      <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
        {isEdit
          ? `${initial.reg} · currently ${initial.status}. Saving changes sends the listing back for review.`
          : "Submitted listings are reviewed by our team, usually within 24 hours."}
      </p>

      <div className="mt-5 flex flex-col gap-5">
        <CheckSection title="Bike details" icon={Bike}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              icon={Bike}
              label="Bike Name"
              required
              error={errors.name}
              show={err("name")}
            >
              <input
                value={v.name}
                onChange={set("name")}
                onBlur={blur("name")}
                placeholder="Honda CB350"
                className="br-input w-full text-sm"
              />
            </Field>
            <Field icon={Award} label="Manufacturer" required>
              <select
                value={v.mf}
                onChange={set("mf")}
                className="br-input w-full bg-transparent text-sm"
              >
                {MANUFACTURERS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field icon={Award} label="Category" required>
              <select
                value={v.cat}
                onChange={set("cat")}
                className="br-input w-full bg-transparent text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field icon={Fuel} label="Fuel Type" required>
              <select
                value={v.fuel}
                onChange={set("fuel")}
                className="br-input w-full bg-transparent text-sm"
              >
                {["Petrol", "Electric"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
            {v.fuel !== "Electric" && (
              <Field
                icon={Gauge}
                label="Engine (cc)"
                required
                error={errors.cc}
                show={err("cc")}
              >
                <input
                  type="number"
                  value={v.cc}
                  onChange={set("cc")}
                  onBlur={blur("cc")}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="350"
                  className="br-input w-full text-sm"
                />
              </Field>
            )}
            <Field icon={Cog} label="Transmission" required>
              <select
                value={v.trans}
                onChange={set("trans")}
                className="br-input w-full bg-transparent text-sm"
              >
                {["Manual", "Automatic"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
            <Field
              icon={Calendar}
              label="Manufacturing Year"
              required
              error={errors.year}
              show={err("year")}
            >
              <input
                value={v.year}
                onChange={set("year")}
                onBlur={blur("year")}
                placeholder="2024"
                className="br-input w-full text-sm"
              />
            </Field>
            <Field
              icon={CreditCard}
              label="Registration Number"
              required
              error={errors.reg}
              show={err("reg")}
            >
              <input
                value={v.reg}
                onChange={set("reg")}
                onBlur={blur("reg")}
                placeholder="MH12 AB 1234"
                className="br-input w-full text-sm"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Label>Description</Label>
            <textarea
              value={v.desc}
              onChange={set("desc")}
              rows={3}
              placeholder="Condition, recent servicing, what riders should know…"
              className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm"
            />
          </div>
        </CheckSection>

        <CheckSection title="Pricing & limits" icon={CircleDollarSign}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              icon={CircleDollarSign}
              label="Price per day (₹)"
              required
              error={errors.price}
              show={err("price")}
            >
              <input
                type="number"
                value={v.price}
                onChange={set("price")}
                onBlur={blur("price")}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="599"
                className="br-input w-full text-sm"
              />
            </Field>
            <Field
              icon={ShieldCheck}
              label="Security deposit (₹)"
              required
              tooltip="Enter 0 to offer a no-deposit listing — these convert better."
              error={errors.deposit}
              show={err("deposit")}
            >
              <input
                type="number"
                value={v.deposit}
                onChange={set("deposit")}
                onBlur={blur("deposit")}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="1500"
                className="br-input w-full text-sm"
              />
            </Field>
            <Field icon={Route} label="Daily km limit" required>
              <input
                type="number"
                value={v.kmLimit}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={set("kmLimit")}
                className="br-input w-full text-sm"
              />
            </Field>
            <Field icon={Route} label="Extra km charge (₹)" required>
              <input
                type="number"
                value={v.extraKm}
                onChange={set("extraKm")}
                className="br-input w-full text-sm"
              />
            </Field>
          </div>
          <label
            className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm"
            style={{ color: "#3a4d55" }}
          >
            <input
              type="checkbox"
              className="br-check"
              checked={helmet}
              onChange={(e) => setHelmet(e.target.checked)}
            />{" "}
            Helmet included with this bike
          </label>
        </CheckSection>

        <CheckSection
          title="Photos"
          icon={ImagePlus}
          right={
            <span
              className="text-xs"
              style={{ color: err("photos") ? "#dc2626" : "var(--mute)" }}
            >
              {photos.length}/8
            </span>
          }
        >
          <div
            onClick={() => document.getElementById("bikePhotoInput")?.click()}
            className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed px-4 py-6 text-center"
            style={{ borderColor: err("photos") ? "#dc2626" : "#cbd8e2" }}
          >
            <ImagePlus size={22} style={{ color: "var(--brand)" }} />
            <p className="mt-1.5 text-sm font-semibold">
              {isEdit ? "Replace photos (optional)" : "Add photos of your bike"}
            </p>
            <p className="text-xs" style={{ color: "var(--mute)" }}>
              {isEdit
                ? "Leave empty to keep the photos already on this listing"
                : "Front, both sides, rear and odometer work best"}
            </p>
            <input
              id="bikePhotoInput"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addPhotos(e.target.files)}
            />
          </div>
          {err("photos") && (
            <p
              className="mt-1 flex items-center gap-1 text-xs font-medium"
              style={{ color: "#dc2626" }}
            >
              <AlertCircle size={12} /> {errors.photos}
            </p>
          )}
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {photos.map((ph, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={ph.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/55 text-white"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CheckSection>

        <CheckSection
          title="Documents"
          icon={FileText}
          right={
            <span className="text-xs" style={{ color: "var(--mute)" }}>
              RC · Insurance · PUC
            </span>
          }
        >
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <Field
              icon={ShieldCheck}
              label="Insurance Policy Number"
              required
              error={errors.insuranceNumber}
              show={err("insuranceNumber")}
            >
              <input
                value={v.insuranceNumber}
                onChange={set("insuranceNumber")}
                onBlur={blur("insuranceNumber")}
                placeholder="POL123456789"
                className="br-input w-full text-sm"
              />
            </Field>

            <Field
              icon={ShieldCheck}
              label="Insurance Provider"
              required
              error={errors.insuranceProvider}
              show={err("insuranceProvider")}
            >
              <input
                value={v.insuranceProvider}
                onChange={set("insuranceProvider")}
                onBlur={blur("insuranceProvider")}
                placeholder="ICICI Lombard"
                className="br-input w-full text-sm"
              />
            </Field>

            <Field
              icon={FileText}
              label="Policy Holder Name"
              required
              error={errors.insuranceHolder}
              show={err("insuranceHolder")}
            >
              <input
                value={v.insuranceHolder}
                onChange={set("insuranceHolder")}
                onBlur={blur("insuranceHolder")}
                placeholder="John Doe"
                className="br-input w-full text-sm"
              />
            </Field>
          </div>
          <div className="flex flex-col gap-3">
            {[
              {
                k: "rc",
                label: "RC certificate",
                hint: "Registration certificate",
              },
              {
                k: "insurance",
                label: "Insurance policy",
                hint: "Valid, unexpired policy",
              },
              {
                k: "puc",
                label: "PUC certificate",
                hint: "Pollution-under-control",
              },
            ].map(({ k, label, hint }) => {
              const c = certs[k];
              return (
                <div
                  key={k}
                  className="rounded-xl p-3.5"
                  style={{
                    background: "var(--form-bg)",
                    border: `1px solid ${err(`${k}File`) || err(`${k}Exp`) ? "#f0a5a5" : "transparent"}`,
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p
                        className="br-display mb-1 text-xs font-semibold"
                        style={{ color: "#334155" }}
                      >
                        {label}
                        {!isEdit && (
                          <span style={{ color: "#dc2626" }}> *</span>
                        )}
                      </p>
                      <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                        style={{
                          background: "#fff",
                          border: "1px solid var(--line)",
                        }}
                      >
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-md"
                          style={{
                            background: c.file ? "#dcfce7" : "var(--form-bg)",
                          }}
                        >
                          {c.file ? (
                            <Check size={15} style={{ color: "#15803d" }} />
                          ) : (
                            <FileText
                              size={15}
                              style={{ color: "var(--mute)" }}
                            />
                          )}
                        </span>
                        <span
                          className="min-w-0 flex-1 truncate text-xs"
                          style={{
                            color: c.file ? "var(--ink)" : "var(--mute)",
                          }}
                        >
                          {c.file || hint}
                        </span>
                        <label className="br-ghost br-display shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold">
                          {c.file ? "Replace" : "Upload"}
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setCertFile(k, f);
                                setT((p) => ({ ...p, [`${k}File`]: true }));
                              }
                            }}
                          />
                        </label>
                      </div>
                      {err(`${k}File`) && (
                        <p
                          className="mt-1 flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#dc2626" }}
                        >
                          <AlertCircle size={11} /> {errors[`${k}File`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <p
                        className="br-display mb-1 text-xs font-semibold"
                        style={{ color: "#334155" }}
                      >
                        Expiry date
                      </p>
                      <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                        style={{
                          background: "#fff",
                          border: "1px solid var(--line)",
                        }}
                      >
                        <Calendar
                          size={15}
                          style={{ color: "var(--brand)" }}
                          className="shrink-0"
                        />
                        <input
                          type="date"
                          value={c.expiry}
                          onChange={(e) => setCertExp(k, e.target.value)}
                          onBlur={() =>
                            setT((p) => ({ ...p, [`${k}Exp`]: true }))
                          }
                          className="br-input w-full text-xs"
                        />
                      </div>
                      {err(`${k}Exp`) && (
                        <p
                          className="mt-1 flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#dc2626" }}
                        >
                          <AlertCircle size={11} /> {errors[`${k}Exp`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CheckSection>

        <CheckSection
          title="Specifications"
          icon={Cog}
          right={
            <button
              onClick={() => setSpecModal(true)}
              className="br-btn br-display flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              <PlusCircle size={13} /> Add spec
            </button>
          }
        >
          {specs.length === 0 ? (
            <div
              className="grid place-items-center rounded-xl border-2 border-dashed px-4 py-6 text-center"
              style={{ borderColor: "#cbd8e2" }}
            >
              <Cog size={20} style={{ color: "var(--brand)" }} />
              <p className="mt-1.5 text-sm font-semibold">
                No extra specifications yet
              </p>
              <p className="text-xs" style={{ color: "var(--mute)" }}>
                Add details like mileage, top speed, ABS, seat height…
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {specs.map((sp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
                  style={{ background: "var(--form-bg)" }}
                >
                  <div className="min-w-0">
                    <p className="br-display truncate text-sm font-bold">
                      {sp.name}
                    </p>
                    <p
                      className="truncate text-xs"
                      style={{ color: "var(--mute)" }}
                    >
                      {sp.type}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSpec(i)}
                    aria-label="Remove"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: "#fff" }}
                  >
                    <X size={13} style={{ color: "var(--mute)" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CheckSection>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={submit}
            disabled={!valid || busy}
            className="br-btn br-display rounded-xl px-6 py-3 text-sm font-semibold sm:flex-1"
            style={
              !valid || busy
                ? {
                    background: "#c3d5dd",
                    boxShadow: "none",
                    cursor: "not-allowed",
                  }
                : undefined
            }
          >
            {busy
              ? "Uploading files..."
              : isEdit
                ? "Save changes"
                : "Submit for approval"}
          </button>
          <button
            onClick={onCancel}
            className="br-ghost br-display rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Cancel
          </button>
        </div>
        {!valid && (
          <p
            className="-mt-2 text-center text-xs"
            style={{ color: "var(--mute)" }}
          >
            {missing} {missing === 1 ? "item needs" : "items need"} attention
            before submitting.
          </p>
        )}
      </div>

      {specModal && (
        <AddSpecModal
          onClose={() => setSpecModal(false)}
          onAdd={(sp) => {
            addSpec(sp);
            setSpecModal(false);
          }}
        />
      )}
    </div>
  );
}
