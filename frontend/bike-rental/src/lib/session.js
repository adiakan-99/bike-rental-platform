// Turns a raw /auth/me response into the session shape the rest of the app expects.
// Auth Service sends firstName/lastName/phoneNumber separately; the UI reads combined
// `name` + `phone`. Normalizing here — once — avoids re-fixing this in every caller.
export const normalizeSession = (me, token) => {
  const roles = Array.isArray(me.roles) ? me.roles : [me.roles].filter(Boolean);
  return {
    ...me,
    roles,
    token,
    name: `${me.firstName || ""} ${me.lastName || ""}`.trim(),
    phone: me.phoneNumber || me.phone || "",
  };
};

// Only a CUSTOMER has a Customer Service row (customer profile + KYC). Admin/partner-only
// accounts don't, so we gate the customer-service calls on the role to avoid firing
// requests that 404. Paths are relative so they go through the Vite proxy / API gateway.
export const hasCustomerRecord = (me) => {
  const roles = Array.isArray(me?.roles)
    ? me.roles
    : [me?.roles].filter(Boolean);
  return roles.includes("CUSTOMER");
};

// GET /api/v1/customers/me  ->  CustomerResponseDTO (address / emergency / referral).
// NOTE: this DTO does NOT carry kycStatus — that comes from the KYC endpoint below.
export const fetchCustomerProfile = async (token, me) => {
  if (!hasCustomerRecord(me)) return null;
  try {
    const res = await fetch(`/api/v1/customers/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// GET the rider's KYC record -> CustomerKycResponseDTO (kycStatus + submitted fields).
// A 404 means "no KYC row yet" (never submitted) — treated as null, not an error.
// PATH WARNING: the deployed route is the doubled `/me/kyc/me/kyc` shown in Swagger,
// which is almost certainly a controller-mapping bug. If/when the backend fixes it to
// `/api/v1/customers/me/kyc`, update KYC_GET_PATH here to match.
export const KYC_GET_PATH = "/api/v1/customers/me/kyc";
export const fetchCustomerKyc = async (token, me) => {
  if (!hasCustomerRecord(me)) return null;
  try {
    const res = await fetch(KYC_GET_PATH, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// Maps CustomerResponseDTO onto the field names the app already uses (addr/emergency).
export const normalizeCustomerProfile = (c) =>
  c
    ? {
        addr: c.addressLine1 || "",
        addr2: c.addressLine2 || "",
        city: c.city || "",
        state: c.state || "",
        pincode: c.pincode || "",
        emergency: c.emergencyContact || "",
        referralCode: c.referralCode || "",
      }
    : {};

// Merges the KYC record's status into the session. kycStatus is the ONLY authoritative
// source for the rider's verification state (Customer Service, not /auth/me).
export const normalizeKyc = (kyc) =>
  kyc?.kycStatus ? { kycStatus: kyc.kycStatus } : {};
