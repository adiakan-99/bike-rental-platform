import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEMO_USERS } from "../mock";
import {
  normalizeSession,
  fetchCustomerProfile,
  fetchCustomerKyc,
  normalizeCustomerProfile,
  normalizeKyc,
} from "../lib/session.js";
import { getToken, clearAuth } from "../lib/authStorage.js";

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
    const token = getToken();
    if (!token) return;
    axios
      .get(`/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const [customer, kyc] = await Promise.all([
          fetchCustomerProfile(token, res.data),
          fetchCustomerKyc(token, res.data),
        ]);
        setSession({
          ...normalizeSession(res.data, token),
          ...normalizeCustomerProfile(customer),
          ...normalizeKyc(kyc),
        });
      })
      .catch(() => {
        // token is invalid/expired — clear it so the app doesn't think we're logged in
        clearAuth();
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
