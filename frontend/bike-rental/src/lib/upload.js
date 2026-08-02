// Shared two-step MinIO upload, used by rider KYC (driving licence + ID) and by
// partner onboarding documents. The contract mirrors Partner Service's upload-url:
//   1) POST {endpoint} { fileName, contentType, documentType }  -> { uploadUrl, fileUrl }
//   2) PUT  uploadUrl  <raw file>  (Content-Type header, NO bearer — URL is pre-signed)
// Returns the permanent `fileUrl` to store; throws on failure (caller shows the error).
//
// Paths are relative on purpose so they go through the Vite dev proxy / API gateway.
import axios from "axios";

export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const isAllowedUploadType = (file) =>
  ALLOWED_UPLOAD_TYPES.includes(file?.type);

export async function uploadDocument({ file, documentType, endpoint }) {
  if (!isAllowedUploadType(file)) {
    const err = new Error("Only JPG, PNG, WEBP, and PDF files are allowed.");
    err.userMessage = err.message;
    throw err;
  }
  const token = localStorage.getItem("token");
  // 1) ask the backend for a pre-signed PUT URL + the permanent fileUrl
  const { data } = await axios.post(
    endpoint,
    { fileName: file.name, contentType: file.type, documentType },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const { uploadUrl, fileUrl } = data;
  // 2) PUT the raw bytes straight to MinIO — pre-signed URL carries its own auth
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
  return fileUrl;
}
