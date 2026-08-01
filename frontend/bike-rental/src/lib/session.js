// Single place that turns a raw /auth/me response into the session shape the rest of
// the frontend expects. Backend sends firstName/lastName/phoneNumber separately;
// buildProfile (App.jsx), Navbar, etc. all read a combined `name` + `phone`. Normalizing
// here — once — avoids re-fixing this mismatch in every place that calls /auth/me.
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

// A Customer Service record only exists once the rider is KYC-verified. Before that
// (PENDING / SUBMITTED / REJECTED / no record) there is genuinely nothing to fetch,
// so calling /customers/me would just 4xx on every login. We treat "verified" as the
// gate: anything else means "skip the call, prefill nothing".
export const hasCustomerRecord = (me) => me?.kycStatus === "VERIFIED";

// Customer Service owns the address/emergency-contact/referral fields — separate service,
// separate call. Pass the `me` object (from /auth/me) so we can skip the request entirely
// for accounts that don't have a customer record yet, instead of firing one we know fails.
export const fetchCustomerProfile = async (token, me) => {
  if (!hasCustomerRecord(me)) return null; // not verified yet → no record to fetch, don't call
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

// Maps the Customer Service response shape onto the field names buildProfile()/ProfilePage
// already use (addr/emergency, not addressLine1/emergencyContact).
export const normalizeCustomerProfile = (c) =>
  c
    ? {
        addr: c.addressLine1 || "",
        city: c.city || "",
        state: c.state || "",
        pincode: c.pincode || "",
        emergency: c.emergencyContact || "",
      }
    : {};
