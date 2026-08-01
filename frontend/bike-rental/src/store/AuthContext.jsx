import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEMO_USERS } from "../mock";
import {
  normalizeSession,
  fetchCustomerProfile,
  normalizeCustomerProfile,
} from "../lib/session.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Auth store — session + the account (`users`) table lifted out of App.
// Behaviour is identical to the original App-local useState; only ownership moved.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState(DEMO_USERS); // stands in for the `user` table

  const updateSession = (patch) =>
    setSession((prev) => (prev ? { ...prev, ...patch } : prev));

  // Survive a page refresh: if a token is already in localStorage, ask /auth/me for the
  // authoritative session instead of trying to decode anything from the token itself.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${baseUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const customer = await fetchCustomerProfile(token, res.data);
        setSession({
          ...normalizeSession(res.data, token),
          ...normalizeCustomerProfile(customer),
        });
      })
      .catch(() => {
        // token is invalid/expired — clear it so the app doesn't think we're logged in
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("firstName");
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, setSession, users, setUsers, updateSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
