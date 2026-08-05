import { useEffect, useState } from "react";
import partnerApi from "../../../api/partnerApi";

import { useAllBikes } from "../hooks/useAllBikes";

import axios from "axios";
import { getToken } from "../../../lib/authStorage.js";
import {
  Bike,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { ADMIN_TABS, CAT_GRADIENT } from "../../../constants";
import { inr } from "../../../lib/money.js";
import { CUSTOMERS_SEED, DEALERS } from "../../../mock";
import { BikeImage, Chip, EmptyList, StatusTag } from "../../../ui";
import {
  AddAdminModal,
  AdminToolbar,
  BikeReviewModal,
  DealerDetailsAdmin,
  DisputeCard,
  RejectReasonModal,
} from "../components";
import { KycReviewPage } from "./KycReviewPage.jsx";

// Map an AdminKycResponseDTO row to the shape the Verify-Riders list renders.
const kycToView = (r) => ({
  id: r.customerId, // path param for approve/reject
  name:
    `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
    `Customer #${r.customerId}`,
  email: r.email,
  phone: r.phoneNumber,
  dl: r.drivingLicenseNumber,
  idType: r.idType,
  idNumber: r.idNumber,
  idFileUrl: r.idUploadUrl,
  dlFileUrl: r.drivingLicenseUrl,
  submittedAt: r.createdAt || r.updatedAt,
});

export function AdminApp({
  session,
  rentals = [],
  onResolveDispute,
  pDealers,
  setPDealers,
  pBikes,
  onDecideBike,
  adminAction,
}) {
  const [reviewBike, setReviewBike] = useState(null); // listing open in the review modal
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  // Real admin list (GET /api/v1/admin/admins). Refetched after create/remove.
  const loadAdmins = () => {
    setAdminsLoading(true);
    axios
      .get(`/api/v1/admin/admins`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) =>
        setAdmins(
          (res.data || []).map((a) => ({
            id: a.userId,
            name:
              `${a.firstName || ""} ${a.lastName || ""}`.trim() ||
              `Admin #${a.userId}`,
            email: a.email,
            phone: a.phoneNumber,
            designation: "Admin",
            access: [
              "Dealer approvals",
              "Bike approvals",
              "Disputes",
              "User management",
            ],
            added: a.createdAt
              ? new Date(a.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })
              : "—",
            superAdmin: a.userId === session?.userId, // you can't remove your own admin access
          })),
        ),
      )
      .catch(() => {})
      .finally(() => setAdminsLoading(false));
  };
  useEffect(() => {
    loadAdmins();
  }, []);

  const {
    rows: allBikes,
    loading: bikesLoading,
    error: bikesErr,
  } = useAllBikes();

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false); // admin-team panel (opened from profile menu)
  const [kycPending, setKycPending] = useState(0); // (kept for compatibility; badge derives from pending.length)
  // Admin dashboard counts (GET /api/v1/admin/customers/dashboard)
  const [stats, setStats] = useState(null);
  const loadStats = () =>
    axios
      .get(`/api/v1/admin/customers/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setStats(res.data))
      .catch(() => {});
  useEffect(() => {
    loadStats();
  }, []);

  // Pending KYC — fetched ONCE and held here (AdminApp doesn't unmount on tab switch), then
  // mutated locally on approve/reject. No refetch when you flip between tabs.
  const [pending, setPending] = useState([]);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycErr, setKycErr] = useState("");
  const [docErr, setDocErr] = useState("");
  const loadPending = () => {
    setKycLoading(true);
    setKycErr("");
    axios
      .get(`/api/v1/admin/kyc/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setPending((res.data || []).map(kycToView)))
      .catch((e) =>
        setKycErr(
          e.response?.status === 403
            ? "Not authorized — this account isn't an admin."
            : "Could not load pending submissions.",
        ),
      )
      .finally(() => setKycLoading(false));
  };
  useEffect(() => {
    loadPending();
  }, []);
  const viewDoc = async (objectName) => {
    if (!objectName) {
      setDocErr("No document on file.");
      return;
    }
    setDocErr("");
    try {
      const res = await axios.get(
        `/api/v1/admin/customers/storage/download-url`,
        {
          params: { objectName },
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.data?.downloadUrl)
        window.open(res.data.downloadUrl, "_blank", "noopener,noreferrer");
      else setDocErr("Could not open document.");
    } catch {
      setDocErr("Could not open document.");
    }
  };
  const approveKyc = (id) =>
    axios
      .put(
        `/api/v1/admin/kyc/customers/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      .then(() => {
        setPending((p) => p.filter((r) => r.id !== id));
        setStats((s) =>
          s
            ? {
                ...s,
                pendingKyc: Math.max(0, (s.pendingKyc || 0) - 1),
                verifiedKyc: (s.verifiedKyc || 0) + 1,
              }
            : s,
        );
        setFlash("Rider verified.");
        loadStats();
      })
      .catch(() => setFlash("Could not approve this submission."));
  const rejectKyc = (id, rejectionReason) =>
    axios
      .put(
        `/api/v1/admin/kyc/customers/${id}/reject`,
        { rejectionReason },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      .then(() => {
        setPending((p) => p.filter((r) => r.id !== id));
        setStats((s) =>
          s
            ? {
                ...s,
                pendingKyc: Math.max(0, (s.pendingKyc || 0) - 1),
                rejectedKyc: (s.rejectedKyc || 0) + 1,
              }
            : s,
        );
        setFlash("Submission rejected.");
        loadStats();
      })
      .catch(() => setFlash("Could not reject this submission."));
  // Create an admin: POST /api/v1/admin/admins { firstName, lastName, email, phoneNumber, password }
  // creates the user AND assigns the ADMIN role server-side, then we refetch the list.
  const addAdmin = async (payload) => {
    try {
      await axios.post(`/api/v1/admin/admins`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFlash(`${payload.firstName} added as an admin.`);
      loadAdmins();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Could not create the admin.",
      };
    }
  };
  // Remove admin access = demote (PUT /api/v1/admin/users/{userId}/demote).
  const removeAdmin = (id) => {
    const a = admins.find((x) => x.id === id);
    if (a?.superAdmin) return;
    if (!window.confirm(`Remove admin access from ${a?.name || "this admin"}?`))
      return;
    axios
      .put(
        `/api/v1/admin/users/${id}/demote`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      .then(() => {
        setFlash(`${a?.name || "Admin"} removed.`);
        loadAdmins();
      })
      .catch(() => setFlash("Could not remove admin access."));
  };
  // The profile-menu items live outside this component, so App relays them as a signal.
  useEffect(() => {
    if (!adminAction) return;
    if (adminAction.type === "addAdmin") {
      setShowAdmins(false);
      setShowAddAdmin(true);
    }
    if (adminAction.type === "showAdmins") {
      setShowAddAdmin(false);
      setShowAdmins(true);
    }
  }, [adminAction]);
  const [tab, setTab] = useState("dealers");
  const [selDealer, setSelDealer] = useState(null);
  const [flash, setFlash] = useState("");
  const [blockedD, setBlockedD] = useState(new Set());
  const [blockedC, setBlockedC] = useState(new Set());
  const toggle = (setter) => (id) =>
    setter((p) => {
      const s = new Set(p);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  // list filters (search + facets + sort) for the management tabs
  const [fD, setFD] = useState({
    q: "",
    city: "All",
    status: "All",
    sort: "name",
  });
  const [fC, setFC] = useState({
    q: "",
    city: "All",
    status: "All",
    sort: "name",
  });
  const [fB, setFB] = useState({
    q: "",
    cat: "All",
    status: "All",
    sort: "name",
  });

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(""), 3000);
    return () => clearTimeout(id);
  }, [flash]);

  const decideDealer = async (id, action, reason) => {
    const d = pDealers.find((x) => x.id === id);
    try {
      await partnerApi.admin.review(id, {
        approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
        adminRemarks: action === "approve" ? null : reason,
      });
      setPDealers((p) => p.filter((x) => x.id !== id));
      setSelDealer(null);
      setFlash(
        `${d?.business || "Dealer"} ${action === "approve" ? "approved and activated" : "rejected"}.`,
      );
    } catch (err) {
      setFlash(err.response?.data?.message || "Could not submit the decision.");
    }
  };

  const decideBike = async (id, action, reason) => {
    const b = pBikes.find((x) => x.id === id);
    try {
      await onDecideBike(id, action, reason);
      setFlash(
        `${b?.name || "Bike"} ${action === "approve" ? "approved" : "rejected"}.`,
      );
    } catch (err) {
      setFlash(err.userMessage || "Could not submit the decision.");
    }
  };

  // Real customers from Admin Service — includes Auth identity + accountStatus.
  const [custRows, setCustRows] = useState([]);
  const [custLoading, setCustLoading] = useState(true);
  const [custErr, setCustErr] = useState("");
  const loadCustomers = () => {
    setCustLoading(true);
    setCustErr("");
    axios
      .get(`/api/v1/admin/customers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) =>
        setCustRows(
          (res.data || []).map((c) => ({
            id: c.userId ?? c.customerId,
            customerId: c.customerId,
            name:
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              `Customer #${c.customerId}`,
            email: c.email && c.email !== "N/A" ? c.email : "—",
            phone:
              c.phoneNumber && c.phoneNumber !== "N/A" ? c.phoneNumber : "—",
            city: c.city || "—",
            joined: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })
              : "—",
            rentals: c.rentals ?? 0,
            blocked: c.accountStatus === "BLOCKED",
          })),
        ),
      )
      .catch((e) =>
        setCustErr(
          e.response?.status === 403
            ? "Not authorized to view customers."
            : "Could not load customers.",
        ),
      )
      .finally(() => setCustLoading(false));
  };
  useEffect(() => {
    loadCustomers();
  }, []);
  const blockCustomer = (row) => {
    const action = row.blocked ? "unblock" : "block";
    return axios
      .put(
        `/api/v1/admin/customers/${row.id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      .then(() => {
        setCustRows((rows) =>
          rows.map((c) =>
            c.id === row.id ? { ...c, blocked: !row.blocked } : c,
          ),
        );
        setStats((s) =>
          s
            ? {
                ...s,
                blockedUsers: Math.max(
                  0,
                  (s.blockedUsers || 0) + (row.blocked ? -1 : 1),
                ),
              }
            : s,
        );
        setFlash(`${row.name} ${row.blocked ? "unblocked" : "blocked"}.`);
        loadStats();
      })
      .catch(() => setFlash("Could not update customer status."));
  };

  // Rejections route through a reason-capture modal first.
  const [rejectTarget, setRejectTarget] = useState(null); // { kind, id, name }
  const askRejectDealer = (id) => {
    const d = pDealers.find((x) => x.id === id);
    setRejectTarget({
      kind: "dealer",
      id,
      name: d?.business || "Dealer application",
    });
  };
  const askRejectBike = (id) => {
    const b = pBikes.find((x) => x.id === id);
    setRejectTarget({ kind: "bike", id, name: b?.name || "Bike listing" });
  };
  const confirmReject = (reason) => {
    if (!rejectTarget) return;
    if (rejectTarget.kind === "dealer")
      decideDealer(rejectTarget.id, "reject", reason);
    else {
      decideBike(rejectTarget.id, "reject", reason);
      setReviewBike(null);
    }
    setRejectTarget(null);
  };
  const openDisputes = rentals.flatMap((r) =>
    (r.settlement?.deductions || [])
      .filter((d) => d.status === "disputed")
      .map((d) => ({ rental: r, ded: d })),
  );
  const badgeFor = (k) =>
    k === "dealers"
      ? pDealers.length
      : k === "bikes"
        ? pBikes.length
        : k === "disputes"
          ? openDisputes.length
          : k === "kyc"
            ? pending.length
            : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="br-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--mute)" }}>
            Signed in as {session?.email}.
          </p>
        </div>
        <span
          className="br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--form-bg)", color: "var(--brand-strong)" }}
        >
          <ShieldCheck size={15} /> {session?.name || "Administrator"}
        </span>
      </div>

      {/* live counts (GET /api/v1/admin/customers/dashboard) */}
      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total users", value: stats.totalUsers },
            { label: "Customers", value: stats.totalCustomers },
            {
              label: "Pending KYC",
              value: stats.pendingKyc,
              accent: "#b45309",
            },
            { label: "Verified", value: stats.verifiedKyc, accent: "#15803d" },
            { label: "Rejected", value: stats.rejectedKyc, accent: "#b91c1c" },
            { label: "Blocked", value: stats.blockedUsers, accent: "#b91c1c" },
          ].map((s) => (
            <div key={s.label} className="br-card rounded-2xl p-4 shadow-sm">
              <p
                className="br-display text-2xl font-bold"
                style={{ color: s.accent || "var(--ink)" }}
              >
                {s.value ?? "—"}
              </p>
              <p className="text-xs" style={{ color: "var(--mute)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* horizontal menu */}
      <div className="br-scroll mt-5 flex gap-2 overflow-x-auto pb-1">
        {ADMIN_TABS.map((t) => {
          const active = tab === t.key;
          const count = t.badge ? badgeFor(t.key) : 0;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelDealer(null);
              }}
              className="br-display relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg,var(--brand),var(--brand-2))",
                      color: "#fff",
                      boxShadow: "0 8px 18px -8px rgba(15,143,181,.5)",
                    }
                  : {
                      background: "#fff",
                      color: "#334155",
                      border: "1px solid var(--line)",
                    }
              }
            >
              <t.icon size={16} /> {t.label}
              {t.badge && count > 0 && (
                <span className="br-badge-count grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {flash && (
        <div
          className="br-fade-up mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "#e7f7ef", color: "#0b7a4f" }}
        >
          <CheckCircle2 size={16} /> {flash}
        </div>
      )}

      <div className="mt-6">
        {/* Approve Dealers */}
        {tab === "dealers" &&
          (selDealer ? (
            <DealerDetailsAdmin
              dealer={selDealer}
              onDecide={decideDealer}
              onReject={askRejectDealer}
              onBack={() => setSelDealer(null)}
            />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="br-display text-lg font-bold">
                  Pending Dealer Approvals
                </h2>
                <span className="text-sm" style={{ color: "var(--mute)" }}>
                  {pDealers.length} waiting
                </span>
              </div>
              {pDealers.length === 0 ? (
                <div className="br-card grid place-items-center rounded-2xl py-16 text-center">
                  <CheckCircle2 size={32} style={{ color: "var(--brand)" }} />
                  <p className="br-display mt-2 font-bold">All caught up!</p>
                  <p className="text-sm" style={{ color: "var(--mute)" }}>
                    No dealer registrations pending review.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pDealers.map((d) => (
                    <div
                      key={d.id}
                      className="br-card flex flex-col rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-11 w-11 place-items-center rounded-xl br-display text-sm font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg,var(--brand),var(--brand-2))",
                          }}
                        >
                          {d.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="br-display truncate text-sm font-bold">
                            {d.business}
                          </p>
                          <p
                            className="truncate text-xs"
                            style={{ color: "var(--mute)" }}
                          >
                            {d.name}
                          </p>
                        </div>
                        <span
                          className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={
                            (d.ownerType ||
                              (d.type === "Individual owner"
                                ? "Individual"
                                : "Business")) === "Individual"
                              ? { background: "#ede9fe", color: "#6d28d9" }
                              : {
                                  background: "var(--form-bg)",
                                  color: "var(--brand-strong)",
                                }
                          }
                        >
                          {d.ownerType ||
                            (d.type === "Individual owner"
                              ? "Individual"
                              : "Business")}
                        </span>
                      </div>
                      <div
                        className="mt-3 flex flex-col gap-1.5 text-xs"
                        style={{ color: "#3a4d55" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} style={{ color: "var(--brand)" }} />{" "}
                          {d.area}, {d.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar
                            size={13}
                            style={{ color: "var(--brand)" }}
                          />{" "}
                          Registered {d.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Bike size={13} style={{ color: "var(--brand)" }} />{" "}
                          {d.fleet
                            ? `${d.fleet} bikes in fleet`
                            : "No bikes listed yet"}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelDealer(d)}
                        className="br-btn br-display mt-4 w-full rounded-xl py-2.5 text-sm font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}

        {/* Approve Bikes */}
        {tab === "bikes" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="br-display text-lg font-bold">
                Pending Bike Listings
              </h2>
              <span className="text-sm" style={{ color: "var(--mute)" }}>
                {pBikes.length} waiting
              </span>
            </div>
            {pBikes.length === 0 ? (
              <div className="br-card grid place-items-center rounded-2xl py-16 text-center">
                <CheckCircle2 size={32} style={{ color: "var(--brand)" }} />
                <p className="br-display mt-2 font-bold">All caught up!</p>
                <p className="text-sm" style={{ color: "var(--mute)" }}>
                  No bike listings pending review.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pBikes.map((b) => (
                  <div
                    key={b.id}
                    className="br-card overflow-hidden rounded-2xl shadow-sm"
                  >
                    <div
                      className="flex h-28 items-center justify-center"
                      style={{
                        background:
                          CAT_GRADIENT[b.cat] || CAT_GRADIENT.Commuter,
                      }}
                    >
                      <Bike
                        size={54}
                        className="text-white/85"
                        strokeWidth={1.2}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="br-display text-sm font-bold">{b.name}</p>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={
                            b.type === "Individual"
                              ? { background: "#ede9fe", color: "#6d28d9" }
                              : {
                                  background: "var(--form-bg)",
                                  color: "var(--brand-strong)",
                                }
                          }
                        >
                          {b.type === "Individual" ? "Individual" : "Business"}
                        </span>
                      </div>
                      <p
                        className="flex items-center gap-1 text-xs"
                        style={{ color: "var(--mute)" }}
                      >
                        {b.type === "Individual" ? (
                          <User size={11} />
                        ) : (
                          <Briefcase size={11} />
                        )}{" "}
                        {b.owner}
                        {b.city ? ` · ${b.city}` : ""} · {b.date}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip>{b.cat}</Chip>
                        <Chip>
                          <Gauge size={12} />
                          {b.cc ? `${b.cc}cc` : "EV"}
                        </Chip>
                        <Chip>{inr(b.price)}/day</Chip>
                        {b.year && <Chip>{b.year}</Chip>}
                      </div>
                      {b.reg && (
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "#3a4d55" }}
                        >
                          <span className="font-semibold">Reg:</span> {b.reg}
                        </p>
                      )}
                      {Array.isArray(b.docs) && b.docs.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {["RC book", "Insurance", "PUC"].map((d) => {
                            const has = b.docs.some((x) => x.type === d);
                            return (
                              <span
                                key={d}
                                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                                style={
                                  has
                                    ? {
                                        background: "#dcfce7",
                                        color: "#15803d",
                                      }
                                    : {
                                        background: "#fee2e2",
                                        color: "#b91c1c",
                                      }
                                }
                              >
                                {has ? <Check size={9} /> : <X size={9} />}
                                {d}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {b.note && (
                        <p
                          className="mt-2 rounded-lg px-2.5 py-1.5 text-[11px]"
                          style={{
                            background: "var(--form-bg)",
                            color: "#3a4d55",
                          }}
                        >
                          {b.note}
                        </p>
                      )}
                      <div className="mt-3">
                        <button
                          onClick={() => setReviewBike(b)}
                          className="br-btn br-display flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold"
                        >
                          <FileText size={13} /> View Bike Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* All Bikes Management Tab */}
        {tab === "allBikes" &&
          (() => {
            const cats = [
              "All",
              ...Array.from(new Set(allBikes.map((b) => b.cat))),
            ];
            const list = allBikes
              .filter((b) => {
                if (fB.q) {
                  const hay =
                    `${b.name} ${b.mf} ${b.cat} ${b.reg || ""}`.toLowerCase();
                  if (!hay.includes(fB.q.toLowerCase())) return false;
                }
                if (fB.cat !== "All" && b.cat !== fB.cat) return false;
                if (fB.status !== "All" && b.approval !== fB.status)
                  return false;
                return true;
              })
              .sort((a, b) => {
                if (fB.sort === "price") return a.price - b.price;
                return a.name.localeCompare(b.name);
              });

            return (
              <div>
                <AdminToolbar
                  q={fB.q}
                  setQ={(v) => setFB({ ...fB, q: v })}
                  placeholder="Search bike, manufacturer, reg…"
                  count={list.length}
                  total={allBikes.length}
                  onClear={() =>
                    setFB({ q: "", cat: "All", status: "All", sort: "name" })
                  }
                  selects={[
                    {
                      label: "Status",
                      value: fB.status,
                      onChange: (v) => setFB({ ...fB, status: v }),
                      options: ["All", "PENDING", "APPROVED", "REJECTED"],
                    },
                    {
                      label: "Category",
                      value: fB.cat,
                      onChange: (v) => setFB({ ...fB, cat: v }),
                      options: cats,
                    },
                    {
                      label: "Sort by",
                      value: fB.sort,
                      onChange: (v) => setFB({ ...fB, sort: v }),
                      options: [
                        { v: "name", l: "Name (A–Z)" },
                        { v: "price", l: "Price: low to high" },
                      ],
                    },
                  ]}
                />

                {bikesLoading ? (
                  <EmptyList label="Loading bikes…" />
                ) : bikesErr ? (
                  <EmptyList label={bikesErr} />
                ) : list.length === 0 ? (
                  <EmptyList label="No bikes match these filters" />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((b) => (
                      <div
                        key={b.id}
                        className="br-card relative overflow-hidden rounded-2xl shadow-sm transition"
                      >
                        <div className="relative">
                          <BikeImage bike={b} className="h-44" />
                          <div className="absolute right-3 top-3">
                            <StatusTag
                              meta={
                                b.approval === "PENDING"
                                  ? {
                                      label: "Pending",
                                      fg: "#b45309",
                                      bg: "#fef3c7",
                                    }
                                  : b.approval === "REJECTED"
                                    ? {
                                        label: "Rejected",
                                        fg: "#b91c1c",
                                        bg: "#fee2e2",
                                      }
                                    : b.status === "AVAILABLE"
                                      ? {
                                          label: "Available",
                                          fg: "#15803d",
                                          bg: "#dcfce7",
                                        }
                                      : {
                                          label: b.status,
                                          fg: "#475569",
                                          bg: "#e2e8f0",
                                        }
                              }
                            />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="br-display text-base font-bold">
                              {b.name}
                            </h3>
                            <span className="br-display shrink-0 text-sm font-bold text-[var(--brand-strong)]">
                              {inr(b.price)}/d
                            </span>
                          </div>
                          <p
                            className="mt-0.5 text-xs"
                            style={{ color: "var(--mute)" }}
                          >
                            Partner #{b.partnerId} · {b.trans || "—"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <Chip>{b.cat}</Chip>
                            <Chip>{b.cc ? `${b.cc}cc` : "EV"}</Chip>
                            {b.reg && <Chip>{b.reg}</Chip>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        {/* Disputes */}
        {tab === "disputes" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="br-display text-lg font-bold">
                Deduction Disputes
              </h2>
              <span className="text-sm" style={{ color: "var(--mute)" }}>
                {openDisputes.length} awaiting review
              </span>
            </div>
            {openDisputes.length === 0 ? (
              <div className="br-card grid place-items-center rounded-2xl py-16 text-center">
                <CheckCircle2 size={32} style={{ color: "var(--brand)" }} />
                <p className="br-display mt-2 font-bold">No open disputes</p>
                <p className="text-sm" style={{ color: "var(--mute)" }}>
                  Contested deposit deductions will appear here for review.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {openDisputes.map(({ rental, ded }) => (
                  <DisputeCard
                    key={`${rental.id}-${ded.id}`}
                    rental={rental}
                    ded={ded}
                    onResolve={(outcome, note) => {
                      onResolveDispute(rental.id, ded.id, outcome, note);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {reviewBike && (
        <BikeReviewModal
          bike={reviewBike}
          onClose={() => setReviewBike(null)}
          onApprove={(id) => {
            decideBike(id, "approve");
            setReviewBike(null);
          }}
          onReject={askRejectBike}
        />
      )}

      {rejectTarget && (
        <RejectReasonModal
          targetName={rejectTarget.name}
          onClose={() => setRejectTarget(null)}
          onConfirm={confirmReject}
        />
      )}

      {showAddAdmin && (
        <AddAdminModal
          onClose={() => setShowAddAdmin(false)}
          onAdd={addAdmin}
        />
      )}
    </div>
  );
}
