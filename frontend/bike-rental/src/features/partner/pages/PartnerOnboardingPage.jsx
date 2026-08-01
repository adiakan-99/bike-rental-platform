import { usePartnerService } from "../hooks";
import { PartnerOnboardingForm } from "../components";
import { ErrorAlert } from "../../../ui";

export function PartnerOnboardingPage({ onSuccess, onCancel }) {
  const { onboardPartner, loading, error, clearError } = usePartnerService();

  const submit = async (body) => {
    try {
      await onboardPartner(body);
      onSuccess();
    } catch {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partner onboarding</h1>
        <button onClick={onCancel} className="rounded border px-4 py-2">
          Cancel
        </button>
      </div>
      <ErrorAlert message={error} onClose={clearError} />
      <PartnerOnboardingForm onSubmit={submit} loading={loading} />
    </div>
  );
}
