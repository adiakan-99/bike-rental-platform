import { Loader } from "lucide-react";

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="mb-2 h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
