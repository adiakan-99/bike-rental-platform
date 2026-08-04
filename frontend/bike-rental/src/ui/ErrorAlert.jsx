import { AlertCircle, X } from "lucide-react";

export function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
        <p className="flex-1 text-sm text-red-700">{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-red-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
