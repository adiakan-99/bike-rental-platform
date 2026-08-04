import { useEffect, useState } from "react";

const EMPTY = {
  sellerType: "INDIVIDUAL",
  ownerName: "",
  alternateEmail: "",
  alternatePhoneNumber: "",
  panNumber: "",
  contactPhone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  businessName: "",
  tradeName: "",
  gstNumber: "",
  businessType: "",
  yearOfEstablishment: "",
  licenseNumber: "",
  issuingAuthority: "",
  licenseValidFrom: "",
  licenseValidTo: "",
  payoutAccount: {
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  },
};

function Input({ label, name, required, ...rest }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        name={name}
        required={required}
        className="w-full rounded border px-3 py-2"
        {...rest}
      />
    </div>
  );
}

export function PartnerOnboardingForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(() => {
    if (!initial) return;
    // Inputs are controlled — null would make React switch them to uncontrolled.
    const blankNulls = (obj = {}) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v ?? ""]));
    setForm({
      ...EMPTY,
      ...blankNulls(initial),
      payoutAccount: {
        ...EMPTY.payoutAccount,
        ...blankNulls(initial.payoutAccount),
      },
    });
  }, [initial]);

  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const changePayout = (e) =>
    setForm((p) => ({
      ...p,
      payoutAccount: { ...p.payoutAccount, [e.target.name]: e.target.value },
    }));

  const submit = (e) => {
    e.preventDefault();

    // @Pattern skips null but rejects "" — blank optional fields must go as null.
    const clean = (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v]),
      );

    onSubmit({
      ...clean(form),
      payoutAccount: clean(form.payoutAccount),
      documents: [],
    });
  };

  const isBusiness = form.sellerType === "COMMERCIAL_DEALER";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Seller type</h2>
        <div className="space-y-2">
          {["INDIVIDUAL", "COMMERCIAL_DEALER"].map((t) => (
            <label key={t} className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="sellerType"
                value={t}
                checked={form.sellerType === t}
                onChange={change}
                disabled={!!initial}
                className="mr-3"
              />
              {t === "INDIVIDUAL" ? "Individual" : "Commercial dealer"}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Contact</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Owner name"
            name="ownerName"
            value={form.ownerName}
            onChange={change}
          />
          <Input
            label="Contact phone"
            name="contactPhone"
            value={form.contactPhone}
            onChange={change}
            pattern="[6-9][0-9]{9}"
            placeholder="10 digits"
          />
          <Input
            label="Alternate email"
            name="alternateEmail"
            type="email"
            value={form.alternateEmail}
            onChange={change}
          />
          <Input
            label="Alternate phone"
            name="alternatePhoneNumber"
            value={form.alternatePhoneNumber}
            onChange={change}
            pattern="[6-9][0-9]{9}"
          />
          <Input
            label="PAN number"
            name="panNumber"
            required
            value={form.panNumber}
            onChange={change}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            placeholder="ABCDE1234F"
          />
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Address</h2>
        <div className="space-y-4">
          <Input
            label="Address line 1"
            name="addressLine1"
            required
            maxLength={255}
            value={form.addressLine1}
            onChange={change}
          />
          <Input
            label="Address line 2"
            name="addressLine2"
            value={form.addressLine2}
            onChange={change}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Input
              label="City"
              name="city"
              required
              value={form.city}
              onChange={change}
            />
            <Input
              label="State"
              name="state"
              required
              value={form.state}
              onChange={change}
            />
            <Input
              label="Pincode"
              name="pincode"
              required
              value={form.pincode}
              onChange={change}
              pattern="[1-9][0-9]{5}"
              placeholder="6 digits"
            />
          </div>
        </div>
      </div>

      {isBusiness && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Business details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Business name"
              name="businessName"
              value={form.businessName}
              onChange={change}
            />
            <Input
              label="Trade name"
              name="tradeName"
              value={form.tradeName}
              onChange={change}
            />
            <Input
              label="GST number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={change}
            />
            <Input
              label="Business type"
              name="businessType"
              value={form.businessType}
              onChange={change}
            />
            <Input
              label="Year established"
              name="yearOfEstablishment"
              value={form.yearOfEstablishment}
              onChange={change}
              placeholder="2020"
            />
            <Input
              label="License number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={change}
            />
            <Input
              label="Issuing authority"
              name="issuingAuthority"
              value={form.issuingAuthority}
              onChange={change}
            />
            <Input
              label="License valid from"
              name="licenseValidFrom"
              type="date"
              value={form.licenseValidFrom || ""}
              onChange={change}
            />
            <Input
              label="License valid to"
              name="licenseValidTo"
              type="date"
              value={form.licenseValidTo || ""}
              onChange={change}
            />
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Payout account</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Account holder"
            name="accountHolder"
            required
            value={form.payoutAccount.accountHolder}
            onChange={changePayout}
          />
          <Input
            label="Account number"
            name="accountNumber"
            required
            pattern="\d{9,18}"
            placeholder="9-18 digits"
            value={form.payoutAccount.accountNumber}
            onChange={changePayout}
          />
          <Input
            label="IFSC code"
            name="ifsc"
            required
            pattern="[A-Z]{4}0[A-Z0-9]{6}"
            placeholder="e.g. SBIN0001234"
            value={form.payoutAccount.ifsc}
            onChange={changePayout}
          />
          <Input
            label="Bank name"
            name="bankName"
            value={form.payoutAccount.bankName}
            onChange={changePayout}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-3 font-semibold text-white disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
