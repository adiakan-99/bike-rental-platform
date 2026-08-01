// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { KYC_STATUS, PERMISSIONS, SUSPENDED_ALLOWED } from "../constants";

export const permsFor = (roles = []) => roles.flatMap((r) => PERMISSIONS[r] || []);

export const kycOk = (session) => session?.kycStatus === KYC_STATUS.VERIFIED;

// Any state other than ACTIVE locks the account out of write actions. "isSuspended" is
// kept as the function name everywhere it's called (SUSPENDED_ALLOWED, Guard, App.jsx)
// so no call sites need renaming — it now just covers all 3 non-ACTIVE states.
export const ACCOUNT_BLOCKED_STATES = ["SUSPENDED", "BLOCKED", "INACTIVE"];
export const isSuspended = (session) => ACCOUNT_BLOCKED_STATES.includes(session?.accountStatus);

export const accountStatusMessage = (status) => ({
  SUSPENDED: "This account has been suspended. Contact support@bikerental.in to resolve it.",
  BLOCKED: "This account has been blocked. Contact support@bikerental.in to resolve it.",
  INACTIVE: "This account is inactive. Contact support@bikerental.in to reactivate it.",
}[status] || "This account cannot access the platform right now. Contact support@bikerental.in.");

export const accountStatusTitle = (status) => ({
  SUSPENDED: "Account suspended",
  BLOCKED: "Account blocked",
  INACTIVE: "Account inactive",
}[status] || "Account access restricted");

export const can = (session, key) => {
  if (!session) return false;
  if (isSuspended(session) && !SUSPENDED_ALLOWED.includes(key)) return false;
  return permsFor(session.roles).includes(key);
};
