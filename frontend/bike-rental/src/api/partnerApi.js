import axios from "axios";
import { getToken } from "../lib/Authstorage.js";

// vite.config.js proxies /api -> http://localhost:8080 (api-gateway).
// Relative path only — matches how App.jsx already calls /api/v1/customers.
const api = axios.create({ baseURL: "/api/v1/partners" });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const partnerApi = {
  onboardPartner: (data) => api.post("/profile", data),
  getMyProfile: () => api.get("/me"),
  getMyDocuments: () => api.get("/me/documents"),
  updateMyProfile: (data) => api.put("/me", data),
  updateMyDocuments: (data) => api.put("/me/documents", data),
  updatePayout: (data) => api.put("/me/payout", data),
  getPartnerById: (id) => api.get(`/${id}`),
  getPartnerDocuments: (id) => api.get(`/${id}/documents`),
  getPublicProfile: (id) => api.get(`/public/${id}`),

  admin: {
    getPending: (page = 0, size = 10) =>
      api.get("/admin/pending", { params: { page, size } }),
    getAll: (f = {}) =>
      api.get("/admin", {
        params: {
          city: f.city,
          accountStatus: f.accountStatus,
          search: f.search,
          page: f.page ?? 0,
          size: f.size ?? 10,
        },
      }),
    review: (id, data) => api.put(`/admin/review/${id}`, data),
    block: (id, reason) => api.post(`/admin/${id}/block`, { reason }),
    unblock: (id) => api.post(`/admin/${id}/unblock`),
  },
};

export default partnerApi;