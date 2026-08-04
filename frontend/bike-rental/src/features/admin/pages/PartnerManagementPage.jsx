import { useEffect, useState } from "react";
import { usePartnerAdmin } from "../hooks";
import { PartnerReviewPanel } from "../components/PartnerReviewPanel";
import { ErrorAlert, LoadingSpinner } from "../../../ui";

export function PartnerManagementPage({ onBack, notify }) {
  const {
    partners,
    totalPages,
    loading,
    error,
    getPending,
    review,
    clearError,
  } = usePartnerAdmin();
  const [page, setPage] = useState(0);

  useEffect(() => {
    getPending(page, 10).catch(() => {});
  }, [page, getPending]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partner management</h1>
        <button onClick={onBack} className="rounded border px-4 py-2">
          Back
        </button>
      </div>

      <ErrorAlert message={error} onClose={clearError} />

      {loading ? (
        <LoadingSpinner message="Loading partners..." />
      ) : (
        <PartnerReviewPanel
          partners={partners}
          onReview={review}
          notify={notify}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
