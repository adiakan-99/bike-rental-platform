import { usePartnerService } from "../hooks";
import { PartnerOnboardingForm } from "../components";
import { ErrorAlert } from "../../../ui";
import { useEffect } from "react";

export function PartnerOnboardingPage({ onSuccess, onCancel }) {
  const {
    partner,
    getMyProfile,
    onboardPartner,
    updateMyProfile,
    loading,
    error,
    clearError,
  } = usePartnerService();

  useEffect(() => {
    getMyProfile().catch(() => {}); // 404 is fine — means no record yet
  }, [getMyProfile]);

  const submit = async (body) => {
    try {
      if (partner) await updateMyProfile(body);
      else await onboardPartner(body);
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
      <PartnerOnboardingForm
        initial={partner}
        onSubmit={submit}
        loading={loading}
      />
    </div>
  );
}
