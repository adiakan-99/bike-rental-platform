import { useEffect } from "react";
import { usePartnerService } from "../hooks";
import { ErrorAlert, LoadingSpinner } from "../../../ui";

const statusColor = (s) =>
  s === "APPROVED" || s === "ACTIVE"
    ? "text-green-600"
    : s === "REJECTED" || s === "BLOCKED"
      ? "text-red-600"
      : "text-yellow-600";

function Row({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-medium">{value || "—"}</p>
    </div>
  );
}

export function PartnerProfilePage({ onBack, onEdit }) {
  const { partner, loading, error, getMyProfile, clearError } =
    usePartnerService();

  useEffect(() => {
    getMyProfile().catch(() => {});
  }, [getMyProfile]);

  if (loading && !partner)
    return <LoadingSpinner message="Loading your partner profile..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partner Profile</h1>
        <button onClick={onBack} className="rounded border px-4 py-2">
          Back
        </button>
      </div>

      <ErrorAlert message={error} onClose={clearError} />

      {!loading && !partner && !error && (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="mb-4 text-gray-600">
            You don't have a partner profile yet.
          </p>
          <button
            onClick={onEdit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Start onboarding
          </button>
        </div>
      )}

      {partner && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="text-sm text-gray-600">Seller type</p>
              <p className="text-xl font-semibold">{partner.sellerType}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="text-sm text-gray-600">Approval</p>
              <p
                className={`text-xl font-semibold ${statusColor(partner.approvalStatus)}`}
              >
                {partner.approvalStatus}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="text-sm text-gray-600">Account</p>
              <p
                className={`text-xl font-semibold ${statusColor(partner.accountStatus)}`}
              >
                {partner.accountStatus}
              </p>
            </div>
          </div>

          {partner.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <p className="font-semibold text-red-900">Rejection reason</p>
              <p className="text-red-700">{partner.rejectionReason}</p>
            </div>
          )}

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Contact</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Row label="Owner name" value={partner.ownerName} />
              <Row label="Phone" value={partner.contactPhone} />
              <Row label="Email" value={partner.alternateEmail} />
              <Row label="PAN" value={partner.panNumber} />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Address</h2>
            <Row
              label="Address"
              value={[partner.addressLine1, partner.addressLine2]
                .filter(Boolean)
                .join(", ")}
            />
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Row label="City" value={partner.city} />
              <Row label="State" value={partner.state} />
              <Row label="Pincode" value={partner.pincode} />
            </div>
          </div>

          {partner.sellerType === "COMMERCIAL_DEALER" && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Business</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Row label="Business name" value={partner.businessName} />
                <Row label="GST number" value={partner.gstNumber} />
                <Row label="License number" value={partner.licenseNumber} />
                <Row label="Established" value={partner.yearOfEstablishment} />
              </div>
            </div>
          )}

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Payout account</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Row
                label="Account holder"
                value={partner.payoutAccount?.accountHolder}
              />
              <Row label="Bank" value={partner.payoutAccount?.bankName} />
              <Row
                label="Account number"
                value={partner.payoutAccount?.accountNumber}
              />
              <Row label="IFSC" value={partner.payoutAccount?.ifsc} />
            </div>
          </div>

          <button
            onClick={onEdit}
            className="rounded bg-blue-600 px-6 py-2 text-white"
          >
            Edit profile
          </button>
        </div>
      )}
    </div>
  );
}
