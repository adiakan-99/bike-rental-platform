import { useState } from "react";

export function PartnerReviewPanel({ partners, onReview, notify }) {
  const [selected, setSelected] = useState(null);
  const [approved, setApproved] = useState(true);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await onReview(selected.partnerId, {
        approvalStatus: approved ? "APPROVED" : "REJECTED",
        adminRemarks: approved ? null : reason,
      });
      notify(
        approved ? "Partner approved." : "Partner rejected.",
        approved ? "success" : "info",
      );
      setSelected(null);
      setReason("");
      setApproved(true);
    } catch {
      notify("Could not submit the review.", "warn");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          Pending ({partners.length})
        </h2>
        {partners.length === 0 ? (
          <p className="py-8 text-center text-gray-500">Nothing to review.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {partners.map((p) => (
              <button
                key={p.partnerId}
                onClick={() => setSelected(p)}
                className={`w-full rounded border p-3 text-left ${
                  selected?.partnerId === p.partnerId
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">
                  {p.ownerName || p.businessName}
                </div>
                <div className="text-sm text-gray-600">{p.city}</div>
                <div className="text-xs text-gray-400">ID {p.partnerId}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {selected ? (
          <div className="space-y-6 rounded-lg bg-white p-6 shadow">
            <div>
              <h2 className="text-2xl font-semibold">
                {selected.ownerName || selected.businessName}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{selected.contactPhone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">City</p>
                  <p className="font-medium">{selected.city}</p>
                </div>
                <div>
                  <p className="text-gray-600">Applied</p>
                  <p className="font-medium">
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="mb-4 flex gap-6">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    checked={approved}
                    onChange={() => setApproved(true)}
                    className="mr-2"
                  />
                  <span className="font-medium text-green-600">Approve</span>
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    checked={!approved}
                    onChange={() => setApproved(false)}
                    className="mr-2"
                  />
                  <span className="font-medium text-red-600">Reject</span>
                </label>
              </div>

              {!approved && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Why is this being rejected?"
                  className="mb-4 w-full rounded border p-3 text-sm"
                />
              )}

              <button
                onClick={submit}
                disabled={busy || (!approved && !reason.trim())}
                className={`w-full rounded py-3 font-semibold text-white disabled:opacity-50 ${
                  approved ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {busy ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center text-gray-500">
            Select a partner to review.
          </div>
        )}
      </div>
    </div>
  );
}
