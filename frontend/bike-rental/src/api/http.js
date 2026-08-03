// A pre-configured axios instance for bike-service.
//
// Two jobs it does for you, so no feature file has to:
//   1. Attaches the JWT to every request (you were writing
//      `headers: { Authorization: ... }` by hand in ~6 places).
//   2. Turns any backend error into a readable `err.userMessage` string,
//      so components can do `catch (e) { notify(e.userMessage) }`.
import axios from "axios";
import { BIKE_API } from "../config/api.js";

export const bikeHttp = axios.create({
  baseURL: BIKE_API,
  headers: { "Content-Type": "application/json" },
});

// Runs before every request leaves the browser.
bikeHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Runs on every response. The success path just passes through; the error path
// normalises whatever shape Spring sent back into one predictable field.
bikeHttp.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const body = err.response?.data;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }

    err.userMessage =
      body?.message ||
      body?.error ||
      // Spring's @Valid failures arrive as an array of field errors
      (Array.isArray(body?.errors) && body.errors[0]?.defaultMessage) ||
      (status === 401
        ? "Your session expired. Please sign in again."
        : status === 403
          ? "You don't have permission to do that."
          : status === 404
            ? "Not found."
            : !err.response
              ? "Can't reach the server. Is bike-service running?"
              : "Something went wrong. Please try again.");

    return Promise.reject(err);
  },
);

// Two-step upload used for bike photos and RC/PUC documents:
//   1. Ask bike-service for a pre-signed PUT URL.
//   2. PUT the raw file straight to MinIO.
// Step 2 uses plain `axios`, NOT `bikeHttp` — the pre-signed URL carries its own
// signature, and sending an Authorization header alongside it makes MinIO reject it.
export async function uploadBikeFile(file, documentType) {
  const { data } = await bikeHttp.post("/api/v1/bikes/storage/upload", {
    fileName: file.name,
    contentType: file.type,
    documentType,
  });
  await axios.put(data.uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
  return data.fileUrl; // the permanent URL you store in the listing
}
