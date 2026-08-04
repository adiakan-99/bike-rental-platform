// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useMemo, useState, useCallback } from "react";
import { getBike, getBikes } from "./lib/bikeRegistry.js";
import axios from "axios";
import { COMPARE_MAX, DISPUTE_WINDOW_HOURS } from "./config";
import { MONTHS, ROLE } from "./constants";
import { CompareTray } from "./features/compare/components";
import { accountStatusMessage, isSuspended, kycOk } from "./lib/access.js";
import { getToken, clearAuth } from "./lib/Authstorage.js";
import { makeRentals } from "./mock";
import { AppRoutes } from "./routes";
import { useAuth } from "./store";
import { useMyFleet } from "./features/dealer/hooks";
import { Footer, KycBanner, Navbar, Styles, Toast } from "./ui";
import { createBikeListing, updateBikeListing } from "./api/bikes.js";
import {
  fleetDtoToListing,
  formToListingDto,
  formToOperationalDto,
} from "./lib/adapters/bike.js";
import { usePendingBikes } from "./features/admin/hooks/usePendingBikes.js";

import partnerApi from "./api/partnerApi";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function App() {
  const [page, setPage] = useState("home");
  const [criteria, setCriteria] = useState({
    city: "Pune",
    startDate: "2026-07-12",
    startTime: "09:00",
    endDate: "2026-07-14",
    endTime: "18:00",
  });
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const { session, setSession, users, setUsers } = useAuth();
  // Detailed profile fields (KYC, address, business, docs) keyed by userId. The `users`
  // table only holds auth basics, so richer fields live here and are seeded on first open.
  const [profiles, setProfiles] = useState({});
  const buildProfile = (sess) => {
    const [first = "", ...rest] = (sess.name || "").split(" ");
    const isPartner = sess.roles?.includes("PARTNER");
    const isAdmin = sess.roles?.includes("ADMIN");
    return {
      first,
      last: rest.join(" "),
      email: sess.email || "",
      phone: sess.phone || "",
      dob: "",
      gender: sess.gender
        ? sess.gender[0] + sess.gender.slice(1).toLowerCase()
        : "",
      dl: "",
      idType: "Aadhaar",
      idNumber: "",
      emergency: sess.emergency || "",
      addr: sess.addr || "",
      addr2: sess.addr2 || "",
      city: sess.city || "",
      state: sess.state || "",
      pincode: sess.pincode || "",
      referralCode: sess.referralCode || "",
      ...(isPartner
        ? {
            business: sess.name || "",
            bizType: "Individual",
            pan: "",
            gstin: "",
            accNo: "",
            ifsc: "",
            docs: {},
          }
        : {}),
      ...(isAdmin
        ? {
            designation: "Administrator",
            dept: "Platform Operations",
            empId: "",
          }
        : {}),
    };
  };
  const currentProfile = session
    ? profiles[session.userId] || buildProfile(session)
    : null;
  // Auth Service gender is an enum; the profile picker uses display labels.
  const genderToEnum = (g) =>
    ({
      Male: "MALE",
      Female: "FEMALE",
      Other: "OTHER",
      "Prefer not to say": "OTHER",
    })[g];
  const saveProfile = async (data) => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const isCustomer = session.roles?.includes(ROLE.CUSTOMER);
    // Each service call only fires when its required fields are actually filled, so a
    // blank name doesn't 400 on /auth/me and a blank address doesn't 400 on /customers/me.
    const hasName = data.first?.trim() && data.last?.trim();
    const hasAddress =
      data.addr?.trim() && data.city?.trim() && data.pincode?.trim();

    if (!hasName && !(isCustomer && hasAddress)) {
      notify("Enter your first and last name before saving.", "warn");
      return;
    }
    try {
      // Auth Service — name / phone / gender (all roles). Requires a name.
      if (hasName) {
        await axios.put(
          `/api/v1/auth/me`,
          {
            firstName: data.first,
            lastName: data.last,
            phoneNumber: data.phone,
            gender: genderToEnum(data.gender),
          },
          { headers },
        );
      }
      // Customer Service — address / emergency / referral (customers only). Requires address.
      if (isCustomer && hasAddress) {
        await axios.put(
          `/api/v1/customers/me`,
          {
            addressLine1: data.addr,
            addressLine2: data.addr2 || "",
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            emergencyContact: data.emergency,
            referralCode: data.referralCode || "",
          },
          { headers },
        );
      }
      setProfiles((prev) => ({ ...prev, [session.userId]: data }));
      const name = `${data.first} ${data.last}`.trim();
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === session.userId
            ? { ...u, name, email: data.email, phone: data.phone }
            : u,
        ),
      );
      setSession((cur) => ({
        ...cur,
        name,
        phone: data.phone,
        gender: genderToEnum(data.gender) || cur.gender,
        addr: data.addr,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        emergency: data.emergency,
      }));
      notify("Profile updated.");
    } catch (error) {
      // Backend may return either { message } or a field-error map { field: "reason", ... }.
      const d = error.response?.data;
      const msg =
        d && typeof d === "object" && !d.message
          ? Object.values(d).join(" · ")
          : d?.message || "Could not update profile.";
      notify(msg, "warn");
    }
  };
  const changePassword = async (cur, next) => {
    try {
      // Auth Service — PUT /api/v1/auth/password { oldPassword, newPassword }
      await axios.put(
        `/api/v1/auth/password`,
        { oldPassword: cur, newPassword: next },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error.response?.data?.message || "Current password is incorrect.",
      };
    }
  };
  const loggedIn = !!session;
  const [pendingBook, setPendingBook] = useState(false);
  // Riders verify identity once (DL + government ID) before their first booking.
  // kycStatus now comes from the backend (Customer Service, via session hydration) —
  // no more client-only verifiedUsers dict that resets on refresh.
  const idVerifiedFor = (sess) => kycOk(sess);
  const identityVerified = idVerifiedFor(session);
  const recordIdentity = () => {
    // Submission was already POSTed and session.kycStatus updated inside
    // IdentityVerificationPage via updateSession() — submitting ≠ verified,
    // so route onward based on the real status rather than assuming success.
    go(kycOk(session) ? "checkout" : "rentals");
    notify(
      session?.kycStatus === "SUBMITTED"
        ? "Documents submitted — we'll notify you once they're reviewed."
        : "Please complete identity verification.",
    );
  };
  const [booking, setBooking] = useState(null);
  const [rentals, setRentals] = useState(makeRentals);
  // Ownership scoping — a partner must never see the whole marketplace.
  const partnerRentals = useMemo(
    () =>
      session?.partnerId == null
        ? []
        : rentals.filter((r) => r.bike?.dealer === session.partnerId),
    [rentals, session],
  );
  const [compare, setCompare] = useState(new Set());
  // Wishlist lives here so results, details and the wishlist page stay in sync.
  const [wishlist, setWishlist] = useState(new Set());
  // Relays profile-menu admin actions (add / show) down into AdminApp.
  const [adminAction, setAdminAction] = useState(null);
  const fireAdmin = (type) => {
    go("admin");
    setAdminAction({ type, n: Date.now() });
  };
  // Lets the profile menu open the dealer portal on a specific tab.
  const [portalTab, setPortalTab] = useState(null);
  const openPortal = (tab = "dashboard") => {
    go("dealerPortal");
    setPortalTab({ tab, n: Date.now() });
  };

  const goPartnerProfile = () => go("partnerProfile");
  const goPartnerOnboard = () => go("partnerOnboard");
  const goAdminPartners = () => go("adminPartners");

  const toggleWish = (id) => {
    const bike = getBike(id);

    const next = new Set(wishlist);
    const removing = next.has(id);
    removing ? next.delete(id) : next.add(id);
    setWishlist(next);
    if (bike)
      notify(
        removing
          ? `${bike.name} removed from wishlist`
          : `${bike.name} saved to wishlist`,
        removing ? "info" : "success",
      );
  };
  const wishlistBikes = getBikes(wishlist);
  const [toast, setToast] = useState(null);
  const [aboutSection, setAboutSection] = useState(null);
  // Admin is intentionally NOT linked from the public site.
  // In production this lives on a separate deployment (admin.example.com) behind SSO/VPN.
  // For this prototype it is reachable via a staff shortcut: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const onKey = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "A" || e.key === "a")
      ) {
        e.preventDefault();
        setPage("admin");
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // A suspended session is confined to its own history plus support/legal pages.
  // Anything else bounces back rather than rendering a half-working screen.
  useEffect(() => {
    if (
      isSuspended(session) &&
      ![
        "rentals",
        "wishlist",
        "confirmation",
        "about",
        "login",
        "profile",
      ].includes(page)
    ) {
      setPage("rentals");
      window.scrollTo({ top: 0 });
    }
  }, [session, page]);
  const goAbout = (sec = null) => {
    setAboutSection(sec ? `${sec}:${Date.now()}` : null);
    go("about");
  };
  const notify = (msg, tone = "success") =>
    setToast({ msg, tone, at: Date.now() });
  // NOTE: decide the outcome outside the state updater — calling setState (notify)
  // inside an updater is a side effect React may double-invoke or drop.
  const toggleCompare = (id) => {
    //changed
    const bike = getBike(id);
    const next = new Set(compare);
    if (next.has(id)) {
      next.delete(id);
      setCompare(next);
      notify(`${bike.name} removed from compare`, "info");
      return;
    }
    if (next.size >= COMPARE_MAX) {
      notify(
        `You can compare up to ${COMPARE_MAX} bikes. Remove one to add another.`,
        "warn",
      );
      return;
    }
    next.add(id);
    setCompare(next);
    notify(
      next.size < 2
        ? `${bike.name} added — pick one more to compare`
        : `${bike.name} added to compare (${next.size}/${COMPARE_MAX})`,
    );
  };
  // const compareBikes = BIKES.filter((b) => compare.has(b.id));

  // change To this:
  const compareBikes = getBikes(compare);

  const [pDealers, setPDealers] = useState([]);

  const loadPendingPartners = useCallback(async () => {
    try {
      const { data } = await partnerApi.admin.getPending(0, 50);
      setPDealers(
        (data.content ?? []).map((p) => ({
          id: p.partnerId,
          name: p.ownerName,
          business: p.businessName || p.ownerName,
          city: p.city,
          area: p.city,
          email: p.email,
          phone: p.contactPhone,
          type:
            p.sellerType === "COMMERCIAL_DEALER" ? "Business" : "Individual",
          date: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "",
          fleet: 0,
          complaints: [],
        })),
      );
    } catch {
      // leave the list empty — the panel shows its own empty state
    }
  }, []);

  useEffect(() => {
    if (session?.roles?.includes(ROLE.ADMIN)) loadPendingPartners();
  }, [session, loadPendingPartners]);

  // const [pBikes, setPBikes] = useState(PENDING_BIKES_SEED);
  const { rows: pBikes, decide: handleDecideBike } = usePendingBikes({
    enabled: !!session?.roles?.includes("ADMIN"),
  });
  // supply side: partner registrations and bike listings feed the admin approval queues
  const submitPartner = async (form) => {
    const nz = (s) => (s && String(s).trim() ? String(s).trim() : null);
    const isBiz = form.ownerType === "Business";

    const payload = {
      sellerType: isBiz ? "COMMERCIAL_DEALER" : "INDIVIDUAL",
      ownerName: nz(form.name),
      alternateEmail: nz(form.altEmail),
      alternatePhoneNumber: nz(form.altPhone),
      panNumber: nz(form.pan),
      contactPhone: nz(form.phone),
      addressLine1: nz(form.addr1),
      addressLine2: nz(form.area),
      city: nz(form.city),
      state: nz(form.state),
      pincode: nz(form.pincode),
      businessName: isBiz ? nz(form.business) : null,
      tradeName: isBiz ? nz(form.tradeName) : null,
      gstNumber: isBiz ? nz(form.gstin) : null,
      businessType: isBiz ? nz(form.type) : null,
      yearOfEstablishment: nz(form.since),
      udyamNumber: isBiz ? nz(form.udyam) : null,
      signatoryName: isBiz ? nz(form.name) : null,
      signatoryDesignation: isBiz ? nz(form.signatoryDesignation) : null,
      licenseNumber: nz(form.rmcNo),
      issuingAuthority: nz(form.rmcAuthority),
      licenseValidFrom: nz(form.rmcFrom),
      licenseValidTo: nz(form.rmcTo),
      payoutAccount: {
        accountHolder: nz(form.accHolder),
        accountNumber: nz(form.accNo),
        ifsc: nz(form.ifsc),
        bankName: nz(form.bankName),
      },
      documents: Object.entries(form.documents || {}).map(
        ([docType, fileUrl]) => ({
          docType,
          fileUrl,
        }),
      ),
    };

    try {
      const { data } = await partnerApi.onboardPartner(payload);
      setPDealers((prev) => [{ ...form, id: data.partnerId }, ...prev]);
      notify("Partner application submitted", "success");
    } catch (err) {
      console.error("Partner onboarding failed:", err.response?.data || err);
      notify(err.response?.data?.message || "Submission failed", "error");
    }
  };

  //changed
  const {
    listings: myListings,
    setListings: setMyListings,
    loading: fleetLoading,
    error: fleetError,
    refresh: refreshFleet,
    setStatus: setBikeStatus,
    remove: deleteListing,
    patchOperational,
  } = useMyFleet({ enabled: !!session?.roles?.includes("PARTNER") });

  // Editing an approved listing sends it back through review — same as a new submission.
  // const editListing = (id, patch) =>
  //   setMyListings((prev) =>
  //     prev.map((l) =>
  //       l.id === id
  //         ? {
  //             ...l,
  //             ...patch,
  //             status: l.status === "Draft" ? "Draft" : "Pending approval",
  //             note: undefined,
  //           }
  //         : l,
  //     ),
  //   );
  const editListing = async (id, form) => {
    // Determine if this update is purely pricing/operational or requires a full document re-review
    const existingListing = myListings.find((l) => l.id === id);
    const priceOnly =
      !form._photoUrls?.length &&
      !form._certUrls?.rc &&
      !form._certUrls?.puc &&
      form.reg === existingListing?.reg;

    try {
      const saved = priceOnly
        ? await patchOperational(id, formToOperationalDto(form))
        : fleetDtoToListing(
            await updateBikeListing(
              id,
              formToListingDto(form, {
                photoUrls: form._photoUrls,
                certUrls: form._certUrls,
              }),
            ),
          );

      // Update the dealer's local list state with the response
      setMyListings((prev) => prev.map((l) => (l.id === id ? saved : l)));

      // Show appropriate notification message
      if (typeof notify === "function") {
        notify(
          priceOnly ? "Pricing updated" : "Sent back for review",
          "success",
        );
      }
    } catch (e) {
      if (typeof notify === "function") {
        notify(e.userMessage || "Update failed", "error");
      } else {
        console.error("Edit listing error:", e);
      }
    }
  };

  const setListingStatus = (id, status, patch = {}) =>
    setMyListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              ...patch,
              status,
              note: status === "Pending approval" ? undefined : l.note,
              needs: status === "Pending approval" ? undefined : l.needs,
            }
          : l,
      ),
    );
  // const submitListing = (listing) => {
  //   setMyListings((prev) => [
  //     { ...listing, id: `L${Date.now()}`, status: "Pending approval" },
  //     ...prev,
  //   ]);
  //   setPBikes((prev) => [
  //     {
  //       id: Date.now(),
  //       name: listing.name,
  //       mf: listing.mf,
  //       owner: "Apex Moto Rentals",
  //       type: "Business",
  //       reg: listing.reg,
  //       year: listing.year,
  //       docs: ["RC book", "Insurance"],
  //       cat: listing.cat,
  //       cc: Number(listing.cc) || 0,
  //       price: Number(listing.price) || 0,
  //       date: `${new Date().getDate()} ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
  //     },
  //     ...prev,
  //   ]);
  // };

  // --- deposit settlement mutations (mirror the DB transitions) ---
  const submitListing = async (listing) => {
    try {
      // 1. Transform form values and uploaded asset URLs into the DTO shape
      const dto = formToListingDto(listing, {
        photoUrls: listing._photoUrls,
        certUrls: listing._certUrls,
      });

      // 2. Call real backend API
      const saved = await createBikeListing(dto);

      // 3. Update dealer's local fleet state with the converted saved response
      setMyListings((prev) => [fleetDtoToListing(saved), ...prev]);

      // 4. Show success toast notification (if your notify helper is in scope)
      if (typeof notify === "function") {
        notify("Listing submitted for review", "success");
      }
    } catch (e) {
      if (typeof notify === "function") {
        notify(e.userMessage || "Couldn't submit the listing", "error");
      } else {
        console.error("Submit listing error:", e);
      }
    }
  };
  const updateDeduction = (rentalId, dedId, patch) =>
    setRentals((prev) =>
      prev.map((r) =>
        r.id !== rentalId || !r.settlement
          ? r
          : {
              ...r,
              settlement: {
                ...r.settlement,
                deductions: r.settlement.deductions.map((d) =>
                  d.id === dedId ? { ...d, ...patch } : d,
                ),
              },
            },
      ),
    );
  const disputeDeduction = (rentalId, dedId, reason) =>
    updateDeduction(rentalId, dedId, {
      status: "disputed",
      disputedAt: new Date(),
      disputeReason: reason,
    });
  const resolveDispute = (rentalId, dedId, outcome, note) =>
    updateDeduction(rentalId, dedId, {
      status: outcome,
      resolvedAt: new Date(),
      resolutionNote: note,
      resolvedBy: "admin",
    });
  const recordInspection = (rentalId, deductions) =>
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id !== rentalId) return r;
        const dep = r.settlement?.depositAmount || r.deposit || 0;
        const returnedAt = new Date();
        return deductions.length === 0
          ? {
              ...r,
              settlement: {
                depositAmount: dep,
                status: "released",
                returnedAt,
                settlementDueAt: null,
                deductions: [],
              },
            }
          : {
              ...r,
              settlement: {
                depositAmount: dep,
                status: "pending_settlement",
                returnedAt,
                settlementDueAt: new Date(
                  returnedAt.getTime() + DISPUTE_WINDOW_HOURS * 3.6e6,
                ),
                deductions,
              },
            };
      }),
    );
  const activeRental = booking?.rentalId
    ? rentals.find((r) => r.id === booking.rentalId)
    : null;
  const activeSettlement = activeRental?.settlement || null;
  const addPreRideReport = (rentalId, entry) =>
    setRentals((prev) =>
      prev.map((r) =>
        r.id === rentalId
          ? { ...r, preRideReports: [...(r.preRideReports || []), entry] }
          : r,
      ),
    );

  const top = () => window.scrollTo({ top: 0 });
  const go = (p) => {
    setPage(p);
    top();
  };
  const goResults = (c) => {
    setCriteria(c);
    go("results");
  };
  const goHome = () => go("home");
  const goDetails = (b) => {
    setSelectedBike(b);
    go("details");
  };
  const goDealer = (d, b) => {
    setSelectedDealer(d);
    setSelectedBike(b);
    go("dealer");
  };
  const backFromDealer = (to) => go(to === "details" ? "details" : "home");
  // Book Now: straight to checkout if logged in, otherwise authenticate first and return here
  // ---- account table mutations (password + social) ----
  const registerUser = (form) => {
    const created = {
      userId: Date.now(),
      ...form,
      roles: [ROLE.CUSTOMER],
      partnerId: null,
      approvalStatus: null,
      accountStatus: "ACTIVE",
      providers: ["password"],
      kycStatus: "PENDING",
    };
    setUsers((prev) => [...prev, created]);
    return created;
  };
  const resetPassword = (email, newPw) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === String(email).toLowerCase()
          ? { ...u, password: newPw }
          : u,
      ),
    );
  };
  // Link by verified email if we already know the address, otherwise provision a new rider.
  const socialAuth = (profile) => {
    if (!profile.email) {
      notify(
        `${profile.providerLabel} did not share an email address. Sign up with email instead.`,
        "warn",
      );
      go("register");
      return;
    }
    const existing = users.find(
      (u) => u.email.toLowerCase() === profile.email.toLowerCase(),
    );
    if (existing) {
      if (!profile.emailVerified) {
        notify(
          `${profile.providerLabel} could not verify that email — log in with your password to link it.`,
          "warn",
        );
        return;
      }
      const linked = {
        ...existing,
        providers: [
          ...new Set([
            ...(existing.providers || ["password"]),
            profile.provider,
          ]),
        ],
        picture: profile.picture || existing.picture,
      };
      setUsers((prev) =>
        prev.map((u) => (u.userId === existing.userId ? linked : u)),
      );
      const { password, ...sess } = linked;
      notify(
        `Signed in with ${profile.providerLabel} — linked to your existing BikeRental account.`,
      );
      afterAuth(sess);
      return;
    }
    const created = {
      userId: Date.now(),
      email: profile.email,
      password: null,
      name: profile.name || profile.email.split("@")[0],
      phone: "",
      subject: profile.subject,
      picture: profile.picture,
      emailVerified: profile.emailVerified,
      roles: [ROLE.CUSTOMER],
      partnerId: null,
      approvalStatus: null,
      accountStatus: "ACTIVE",
      providers: [profile.provider],
      kycStatus: "INCOMPLETE", // no phone / DL yet
    };
    setUsers((prev) => [...prev, created]);
    const { password, ...sess } = created;
    notify(
      `Welcome, ${created.name.split(" ")[0]} — account created via ${profile.providerLabel}. Add your phone and licence before booking.`,
    );
    afterAuth(sess);
  };

  const goBook = () => {
    if (isSuspended(session)) {
      notify("Your account is suspended — new bookings are disabled.", "warn");
      return;
    }
    if (loggedIn) go(identityVerified ? "checkout" : "identity");
    else {
      setPendingBook(true);
      go("register");
    }
  };
  // Any action a suspended account must not take funnels through here.
  const blockIfSuspended =
    (fn) =>
    (...args) => {
      if (isSuspended(session)) {
        notify("Your account is suspended — this action is disabled.", "warn");
        return;
      }
      fn(...args);
    };
  const afterAuth = async (sess) => {
    if (sess.roles?.includes(ROLE.PARTNER)) {
      try {
        const { data } = await partnerApi.getMyProfile();
        sess = {
          ...sess,
          partnerId: data.partnerId,
          approvalStatus: data.approvalStatus,
        };
      } catch {
        // No partner record yet — leave the defaults in place.
      }
    }

    setSession(sess);
    // Any non-ACTIVE account gets its history and nothing else — not even the home search.
    if (isSuspended(sess)) {
      setPendingBook(false);
      go("rentals");
      notify(accountStatusMessage(sess.accountStatus), "warn");
      return;
    }
    if (pendingBook) {
      setPendingBook(false);
      go(idVerifiedFor(sess) ? "checkout" : "identity");
      return;
    }
    if (sess.roles.includes(ROLE.ADMIN)) {
      go("admin");
      return;
    } // route by role
    // An approved partner lands in the portal; a partner still under review is treated
    // like a customer (they can browse and rent) until an admin approves them.
    if (
      sess.roles.includes(ROLE.PARTNER) &&
      sess.approvalStatus === "APPROVED"
    ) {
      go("dealerPortal");
      return;
    }
    if (sess.roles.includes(ROLE.PARTNER)) {
      goHome();
      notify(
        "Your partner account is under review — you can rent bikes as a customer meanwhile.",
        "info",
      );
      return;
    }
    goHome();
  };
  // Open a specific past/upcoming rental in the Rental Details page
  const loadRental = (r) => {
    setSelectedBike(r.bike);
    setCriteria({
      city: r.city,
      startDate: r.sd,
      startTime: r.st,
      endDate: r.ed,
      endTime: r.et,
    });
    setBooking({
      id: r.id,
      rentalId: r.id,
      regNo: r.regNo,
      fare: r.fare,
      paidAt: new Date(`${r.bookingDate}T10:00`),
      status: r.status,
    });
  };
  const openRental = (r) => {
    loadRental(r);
    go("confirmation");
  };
  const openRentalCancel = (r) => {
    loadRental(r);
    go("cancel");
  };
  const openRentalReview = (r) => {
    loadRental(r);
    go("review");
  };
  const openRentalReport = (r) => {
    loadRental(r);
    go("report");
  };

  // Prompt riders to finish KYC. Shown for a logged-in, active CUSTOMER whose KYC
  // isn't VERIFIED — hidden on the auth/KYC screens themselves and while suspended
  // (a suspended account already gets its own banner).
  const showKycBanner = false;

  return (
    <div className="br-root min-h-screen pt-16">
      <Styles />
      <Navbar
        onPartnerProfile={goPartnerProfile}
        onPartnerOnboard={goPartnerOnboard}
        onAdminPartners={goAdminPartners}
        onLogo={goHome}
        onLogin={() => go("login")}
        onRegister={() => go("register")}
        loggedIn={loggedIn}
        session={session}
        onRentals={() => go("rentals")}
        onWishlist={() => go("wishlist")}
        onLogout={() => {
          clearAuth();
          setSession(null);
          goHome();
        }}
        onAbout={(sec) => goAbout(sec)}
        onDealerPortal={() => openPortal("dashboard")}
        onMyFleet={() => openPortal("fleet")}
        onPartner={() => go("partner")}
        onAdmin={() => go("admin")}
        onAddAdmin={() => fireAdmin("addAdmin")}
        onShowAdmins={() => fireAdmin("showAdmins")}
        onProfile={() => go("profile")}
        onSearch={() => go("results")}
        minimal={page === "login" || page === "register"}
      />
      {showKycBanner && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <KycBanner
            status={session.kycStatus}
            onVerify={() => go("identity")}
          />
        </div>
      )}
      <AppRoutes
        ctx={{
          aboutSection,
          activeRental,
          activeSettlement,
          addPreRideReport,
          adminAction,
          afterAuth,
          backFromDealer,
          blockIfSuspended,
          booking,
          changePassword,
          compare,
          compareBikes,
          criteria,
          currentProfile,
          disputeDeduction,
          editListing,
          go,
          goAbout,
          goBook,
          goDealer,
          goDetails,
          goHome,
          goResults,
          goAdminPartners,
          goPartnerOnboard,
          goPartnerProfile,
          myListings,
          notify,
          openRental,
          openRentalCancel,
          openRentalReport,
          openRentalReview,
          pBikes,
          onDecideBike: handleDecideBike,
          pDealers,
          page,
          pendingBook,
          partnerRentals,
          portalTab,
          recordIdentity,
          recordInspection,
          registerUser,
          rentals,
          resetPassword,
          resolveDispute,
          saveProfile,
          selectedBike,
          selectedDealer,
          session,
          setBooking,
          setCompare,
          setListingStatus,
          setPDealers,
          setSession,
          socialAuth,
          submitListing,
          submitPartner,
          toggleCompare,
          toggleWish,
          users,
          wishlist,
          wishlistBikes,
          fleetLoading,
          fleetError,
          refreshFleet,
          setBikeStatus,
          deleteListing,
        }}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      {page !== "compare" && (
        <CompareTray
          bikes={compareBikes}
          onRemove={toggleCompare}
          onClear={() => {
            setCompare(new Set());
            notify("Compare list cleared", "info");
          }}
          onOpen={() => go("compare")}
        />
      )}
      <Footer
        onHome={goHome}
        onAdmin={() => go("admin")}
        onAbout={(sec) => goAbout(sec)}
        onPartner={() => go("partner")}
        onSearch={() => go("results")}
        onDealerPortal={() => go("dealerPortal")}
      />
    </div>
  );
}
