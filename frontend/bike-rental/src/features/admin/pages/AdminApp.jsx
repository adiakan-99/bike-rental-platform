// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
// MODIFIED: added the "kyc" (Verify Riders) tab — see KycReviewPage import, kycPending state,
// badgeFor(), and the new {tab === "kyc" && ...} block below. Everything else is unchanged.
import { useEffect, useState } from "react";
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
import { ADMINS_SEED, BIKES, CUSTOMERS_SEED, DEALERS } from "../../../mock";
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

export function AdminApp({
  session,
  rentals = [],
  onResolveDispute,
  pDealers,
  setPDealers,
  pBikes,
  setPBikes,
  adminAction,
}) {
  const [reviewBike, setReviewBike] = useState(null); // listing open in the review modal
  const [admins, setAdmins] = useState(ADMINS_SEED);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false); // admin-team panel (opened from profile menu)
  const [kycPending, setKycPending] = useState(0); // count for the "Verify Riders" tab badge
  const addAdmin = (a) => {
    const created = {
      id: Date.now(),
      designation: "Admin",
      access: [
        "Dealer approvals",
        "Bike approvals",
        "Disputes",
        "User management",
      ],
      status: "Active",
      added: new Date().toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
      ...a,
    };
    setAdmins((p) => [...p, created]);
    setFlash(`${a.name} added as an admin.`);
  };
  const removeAdmin = (id) => {
    const a = admins.find((x) => x.id === id);
    if (a?.superAdmin) return;
    setAdmins((p) => p.filter((x) => x.id !== id));
    setFlash(`${a?.name || "Admin"} removed.`);
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
  const [blockedB, setBlockedB] = useState(new Set());
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
  const blockCustomer = (row) =>
    axios
      .put(
        `/api/v1/internal/users/${row.id}/status`,
        { accountStatus: row.blocked ? "ACTIVE" : "BLOCKED" },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      .then(() => {
        setFlash(`${row.name} ${row.blocked ? "unblocked" : "blocked"}.`);
        loadCustomers();
      })
      .catch(() => setFlash("Could not update customer status."));
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

  const decideDealer = (id, action, reason) => {
    const d = pDealers.find((x) => x.id === id);
    setPDealers((p) => p.filter((x) => x.id !== id));
    setSelDealer(null);
    setFlash(
      `${d?.business || "Dealer"} ${action === "approve" ? "approved and activated" : "rejected"}.`,
    );
  };
  const decideBike = (id, action, reason) => {
    const b = pBikes.find((x) => x.id === id);
    setPBikes((p) => p.filter((x) => x.id !== id));
    setFlash(
      `${b?.name || "Bike"} ${action === "approve" ? "approved" : "rejected"}.`,
    );
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
            ? kycPending
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
                      setFlash(
                        `Charge ${outcome === "reversed" ? "reversed — renter refunded" : "upheld — charge stands"}.`,
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Verify Riders (KYC) */}
        {tab === "kyc" && <KycReviewPage onCountChange={setKycPending} />}

        {/* Dealers — manage + block */}
        {tab === "allDealers" &&
          (() => {
            const cities = [
              "All",
              ...new Set(DEALERS.map((d) => d.city || "Pune")),
            ];
            const list = DEALERS.filter((d) => {
              const hay = `${d.name} ${d.area} ${d.tagline}`.toLowerCase();
              if (fD.q && !hay.includes(fD.q.toLowerCase())) return false;
              if (fD.city !== "All" && (d.city || "Pune") !== fD.city)
                return false;
              if (fD.status === "Active" && blockedD.has(d.id)) return false;
              if (fD.status === "Blocked" && !blockedD.has(d.id)) return false;
              return true;
            }).sort((a, b) =>
              fD.sort === "rating"
                ? b.rating - a.rating
                : fD.sort === "fleet"
                  ? b.bikes - a.bikes
                  : a.name.localeCompare(b.name),
            );
            return (
              <>
                <h2 className="br-display mb-4 text-lg font-bold">Dealers</h2>
                <AdminToolbar
                  q={fD.q}
                  setQ={(v) => setFD({ ...fD, q: v })}
                  placeholder="Search dealers by name, area or description"
                  count={list.length}
                  total={DEALERS.length}
                  onClear={() =>
                    setFD({ q: "", city: "All", status: "All", sort: "name" })
                  }
                  selects={[
                    {
                      label: "Status",
                      value: fD.status,
                      onChange: (v) => setFD({ ...fD, status: v }),
                      options: ["All", "Active", "Blocked"],
                    },
                    {
                      label: "City",
                      value: fD.city,
                      onChange: (v) => setFD({ ...fD, city: v }),
                      options: cities,
                    },
                    {
                      label: "Sort by",
                      value: fD.sort,
                      onChange: (v) => setFD({ ...fD, sort: v }),
                      options: [
                        { v: "name", l: "Name (A–Z)" },
                        { v: "rating", l: "Highest rated" },
                        { v: "fleet", l: "Largest fleet" },
                      ],
                    },
                  ]}
                />
                {list.length === 0 ? (
                  <EmptyList label="No dealers match these filters" />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {list.map((d) => {
                      const blocked = blockedD.has(d.id);
                      return (
                        <div
                          key={d.id}
                          className="br-card rounded-2xl p-5 shadow-sm"
                          style={
                            blocked ? { borderColor: "#fca5a5" } : undefined
                          }
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl br-display text-sm font-bold text-white"
                                style={{
                                  background: blocked
                                    ? "#94a3b8"
                                    : "linear-gradient(135deg,var(--brand),var(--brand-2))",
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
                                  {d.name}
                                </p>
                                <p
                                  className="truncate text-xs"
                                  style={{ color: "var(--mute)" }}
                                >
                                  {d.area}
                                </p>
                              </div>
                            </div>
                            <StatusTag
                              meta={
                                blocked
                                  ? {
                                      label: "Blocked",
                                      fg: "#b91c1c",
                                      bg: "#fee2e2",
                                    }
                                  : {
                                      label: "Active",
                                      fg: "#15803d",
                                      bg: "#dcfce7",
                                    }
                              }
                            />
                          </div>
                          <div
                            className="mt-3 flex flex-col gap-1.5 text-xs"
                            style={{ color: "#3a4d55" }}
                          >
                            <span className="flex items-center gap-1.5">
                              <Star size={13} fill="#f5a623" strokeWidth={0} />{" "}
                              {d.rating} rating
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Bike
                                size={13}
                                style={{ color: "var(--brand)" }}
                              />{" "}
                              {d.bikes} bikes listed
                            </span>
                            <span className="flex items-center gap-1.5">
                              <TrendingUp
                                size={13}
                                style={{ color: "var(--brand)" }}
                              />{" "}
                              {d.rentals} rentals
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock3
                                size={13}
                                style={{ color: "var(--brand)" }}
                              />{" "}
                              Responds in {d.response}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              toggle(setBlockedD)(d.id);
                              setFlash(
                                `${d.name} ${blocked ? "unblocked" : "blocked"}.`,
                              );
                            }}
                            className="br-display mt-4 w-full rounded-xl py-2.5 text-xs font-semibold"
                            style={
                              blocked
                                ? {
                                    border: "1.5px solid var(--brand)",
                                    color: "var(--brand)",
                                    background: "#fff",
                                  }
                                : {
                                    border: "1.5px solid #dc2626",
                                    color: "#dc2626",
                                    background: "#fff",
                                  }
                            }
                          >
                            {blocked ? "Unblock dealer" : "Block dealer"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

        {/* Customers — details + block (real data from /api/v1/admin/customers) */}
        {tab === "customers" &&
          (() => {
            const cities = [
              "All",
              ...new Set(
                custRows.map((c) => c.city).filter((x) => x && x !== "—"),
              ),
            ];
            const list = custRows
              .filter((c) => {
                const hay =
                  `${c.name} ${c.email} ${c.phone} ${c.city}`.toLowerCase();
                if (fC.q && !hay.includes(fC.q.toLowerCase())) return false;
                if (fC.city !== "All" && c.city !== fC.city) return false;
                if (fC.status === "Active" && c.blocked) return false;
                if (fC.status === "Blocked" && !c.blocked) return false;
                return true;
              })
              .sort((a, b) =>
                fC.sort === "rentals"
                  ? b.rentals - a.rentals
                  : fC.sort === "recent"
                    ? b.customerId - a.customerId
                    : a.name.localeCompare(b.name),
              );
            return (
              <>
                <h2 className="br-display mb-4 text-lg font-bold">
                  Customer Details
                </h2>
                {custErr && (
                  <p
                    className="mb-3 text-sm font-semibold"
                    style={{ color: "#c0392b" }}
                  >
                    {custErr}
                  </p>
                )}
                {custLoading ? (
                  <p className="text-sm" style={{ color: "var(--mute)" }}>
                    Loading customers…
                  </p>
                ) : (
                  <>
                    <AdminToolbar
                      q={fC.q}
                      setQ={(v) => setFC({ ...fC, q: v })}
                      placeholder="Search customers by name, email, phone or city"
                      count={list.length}
                      total={custRows.length}
                      onClear={() =>
                        setFC({
                          q: "",
                          city: "All",
                          status: "All",
                          sort: "name",
                        })
                      }
                      selects={[
                        {
                          label: "Status",
                          value: fC.status,
                          onChange: (v) => setFC({ ...fC, status: v }),
                          options: ["All", "Active", "Blocked"],
                        },
                        {
                          label: "City",
                          value: fC.city,
                          onChange: (v) => setFC({ ...fC, city: v }),
                          options: cities,
                        },
                        {
                          label: "Sort by",
                          value: fC.sort,
                          onChange: (v) => setFC({ ...fC, sort: v }),
                          options: [
                            { v: "name", l: "Name (A–Z)" },
                            { v: "rentals", l: "Most rentals" },
                            { v: "recent", l: "Newest first" },
                          ],
                        },
                      ]}
                    />
                    {list.length === 0 ? (
                      <EmptyList label="No customers match these filters" />
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {list.map((c) => {
                          const blocked = c.blocked;
                          return (
                            <div
                              key={c.id}
                              className="br-card rounded-2xl p-5 shadow-sm"
                              style={
                                blocked ? { borderColor: "#fca5a5" } : undefined
                              }
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  <span
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full br-display text-sm font-bold text-white"
                                    style={{
                                      background: blocked
                                        ? "#94a3b8"
                                        : "var(--teal)",
                                    }}
                                  >
                                    {c.name
                                      .split(" ")
                                      .map((w) => w[0])
                                      .slice(0, 2)
                                      .join("")}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="br-display truncate text-sm font-bold">
                                      {c.name}
                                    </p>
                                    <p
                                      className="text-xs"
                                      style={{ color: "var(--mute)" }}
                                    >
                                      Joined {c.joined}
                                    </p>
                                  </div>
                                </div>
                                <StatusTag
                                  meta={
                                    blocked
                                      ? {
                                          label: "Blocked",
                                          fg: "#b91c1c",
                                          bg: "#fee2e2",
                                        }
                                      : {
                                          label: "Active",
                                          fg: "#15803d",
                                          bg: "#dcfce7",
                                        }
                                  }
                                />
                              </div>
                              <div
                                className="mt-3 flex flex-col gap-1.5 text-xs"
                                style={{ color: "#3a4d55" }}
                              >
                                <span className="flex items-center gap-1.5">
                                  <Mail
                                    size={13}
                                    style={{ color: "var(--brand)" }}
                                  />{" "}
                                  {c.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Phone
                                    size={13}
                                    style={{ color: "var(--brand)" }}
                                  />{" "}
                                  {c.phone === "—" ? "—" : `+91 ${c.phone}`}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin
                                    size={13}
                                    style={{ color: "var(--brand)" }}
                                  />{" "}
                                  {c.city}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Bike
                                    size={13}
                                    style={{ color: "var(--brand)" }}
                                  />{" "}
                                  {c.rentals} completed rentals
                                </span>
                              </div>
                              <button
                                onClick={() => blockCustomer(c)}
                                className="br-display mt-4 w-full rounded-xl py-2.5 text-xs font-semibold"
                                style={
                                  blocked
                                    ? {
                                        border: "1.5px solid var(--brand)",
                                        color: "var(--brand)",
                                        background: "#fff",
                                      }
                                    : {
                                        border: "1.5px solid #dc2626",
                                        color: "#dc2626",
                                        background: "#fff",
                                      }
                                }
                              >
                                {blocked
                                  ? "Unblock customer"
                                  : "Block customer"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </>
            );
          })()}

        {/* Bikes — manage + block */}
        {tab === "allBikes" &&
          (() => {
            const cats = ["All", ...new Set(BIKES.map((b) => b.cat))];
            const list = BIKES.filter((b) => {
              const hay = `${b.name} ${b.mf} ${b.cat}`.toLowerCase();
              if (fB.q && !hay.includes(fB.q.toLowerCase())) return false;
              if (fB.cat !== "All" && b.cat !== fB.cat) return false;
              if (fB.status === "Active" && blockedB.has(b.id)) return false;
              if (fB.status === "Blocked" && !blockedB.has(b.id)) return false;
              return true;
            }).sort((a, b) =>
              fB.sort === "price"
                ? a.price - b.price
                : fB.sort === "rating"
                  ? b.rating - a.rating
                  : a.name.localeCompare(b.name),
            );
            return (
              <>
                <h2 className="br-display mb-4 text-lg font-bold">Bikes</h2>
                <AdminToolbar
                  q={fB.q}
                  setQ={(v) => setFB({ ...fB, q: v })}
                  placeholder="Search bikes by name, manufacturer or category"
                  count={list.length}
                  total={BIKES.length}
                  onClear={() =>
                    setFB({ q: "", cat: "All", status: "All", sort: "name" })
                  }
                  selects={[
                    {
                      label: "Status",
                      value: fB.status,
                      onChange: (v) => setFB({ ...fB, status: v }),
                      options: ["All", "Active", "Blocked"],
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
                        { v: "rating", l: "Highest rated" },
                      ],
                    },
                  ]}
                />
                {list.length === 0 ? (
                  <EmptyList label="No bikes match these filters" />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {list.map((b) => {
                      const blocked = blockedB.has(b.id);
                      return (
                        <div
                          key={b.id}
                          className="br-card overflow-hidden rounded-2xl shadow-sm"
                          style={
                            blocked ? { borderColor: "#fca5a5" } : undefined
                          }
                        >
                          <div className="relative">
                            <BikeImage bike={b} className="h-24" />
                            {blocked && (
                              <span
                                className="absolute inset-0"
                                style={{ background: "rgba(255,255,255,.55)" }}
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="br-display truncate text-sm font-bold">
                                  {b.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "var(--mute)" }}
                                >
                                  {b.mf} · {b.cat}
                                </p>
                              </div>
                              <StatusTag
                                meta={
                                  blocked
                                    ? {
                                        label: "Blocked",
                                        fg: "#b91c1c",
                                        bg: "#fee2e2",
                                      }
                                    : {
                                        label: "Active",
                                        fg: "#15803d",
                                        bg: "#dcfce7",
                                      }
                                }
                              />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <Chip>
                                <Gauge size={12} />
                                {b.cc ? `${b.cc}cc` : "EV"}
                              </Chip>
                              <Chip>{inr(b.price)}/day</Chip>
                              <Chip>
                                <Star
                                  size={11}
                                  fill="#f5a623"
                                  strokeWidth={0}
                                />
                                {b.rating}
                              </Chip>
                            </div>
                            <button
                              onClick={() => {
                                toggle(setBlockedB)(b.id);
                                setFlash(
                                  `${b.name} ${blocked ? "unblocked" : "blocked"}.`,
                                );
                              }}
                              className="br-display mt-3 w-full rounded-xl py-2 text-xs font-semibold"
                              style={
                                blocked
                                  ? {
                                      border: "1.5px solid var(--brand)",
                                      color: "var(--brand)",
                                      background: "#fff",
                                    }
                                  : {
                                      border: "1.5px solid #dc2626",
                                      color: "#dc2626",
                                      background: "#fff",
                                    }
                              }
                            >
                              {blocked ? "Unblock bike" : "Block bike"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

        {/* Admins */}
      </div>

      {reviewBike && (
        <BikeReviewModal
          bike={reviewBike}
          onClose={() => setReviewBike(null)}
          onDecide={decideBike}
          onReject={askRejectBike}
        />
      )}
      {rejectTarget && (
        <RejectReasonModal
          kind={rejectTarget.kind}
          name={rejectTarget.name}
          onClose={() => setRejectTarget(null)}
          onConfirm={confirmReject}
        />
      )}
      {showAddAdmin && (
        <AddAdminModal
          existingEmails={admins.map((a) => a.email)}
          onClose={() => setShowAddAdmin(false)}
          onCreate={addAdmin}
        />
      )}

      {/* Admin team — opened from the profile menu's "Show admins" */}
      {showAdmins && (
        <div
          className="fixed inset-0 grid place-items-center px-4 py-6"
          style={{ zIndex: 80 }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            onClick={() => setShowAdmins(false)}
            style={{
              background: "rgba(15,39,51,.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />
          <div className="br-card br-fade-up relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl">
            <div
              className="flex shrink-0 items-center justify-between gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <div>
                <h3 className="br-display text-base font-bold">Admin Team</h3>
                <p className="text-xs" style={{ color: "var(--mute)" }}>
                  {admins.length} {admins.length === 1 ? "admin" : "admins"}{" "}
                  with panel access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAdmins(false);
                    setShowAddAdmin(true);
                  }}
                  className="br-btn br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  <UserPlus size={15} /> Add Admin
                </button>
                <button
                  onClick={() => setShowAdmins(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-lg"
                  style={{ background: "var(--form-bg)" }}
                >
                  <X size={16} style={{ color: "var(--mute)" }} />
                </button>
              </div>
            </div>
            <div className="br-scroll min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {admins.map((a) => (
                  <div
                    key={a.id}
                    className="br-card flex flex-col rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-11 w-11 place-items-center rounded-xl br-display text-sm font-bold text-white"
                        style={{
                          background: a.superAdmin
                            ? "linear-gradient(135deg,#b91c1c,#ef4444)"
                            : "linear-gradient(135deg,var(--brand),var(--brand-2))",
                        }}
                      >
                        {a.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <div className="min-w-0">
                        <p className="br-display truncate text-sm font-bold">
                          {a.name}
                        </p>
                        <p
                          className="truncate text-xs"
                          style={{ color: "var(--mute)" }}
                        >
                          {a.designation || "Admin"}
                        </p>
                      </div>
                      {a.superAdmin && (
                        <span
                          className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: "#fee2e2", color: "#b91c1c" }}
                        >
                          Super Admin
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-3 flex flex-col gap-1.5 text-xs"
                      style={{ color: "#3a4d55" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} style={{ color: "var(--brand)" }} />{" "}
                        {a.email}
                      </span>
                      {(a.dept || a.empId) && (
                        <span className="flex items-center gap-1.5">
                          <Briefcase
                            size={13}
                            style={{ color: "var(--brand)" }}
                          />{" "}
                          {[a.dept, a.empId].filter(Boolean).join(" · ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} style={{ color: "var(--brand)" }} />{" "}
                        Added {a.added}
                        {a.twofa ? " · 2FA on" : ""}
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {a.access.map((ac) => (
                        <span
                          key={ac}
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: "var(--form-bg)",
                            color: "var(--brand-strong)",
                          }}
                        >
                          {ac}
                        </span>
                      ))}
                    </div>
                    {a.superAdmin ? (
                      <p
                        className="mt-4 text-center text-[11px]"
                        style={{ color: "var(--mute)" }}
                      >
                        The super admin can't be removed.
                      </p>
                    ) : (
                      <button
                        onClick={() => removeAdmin(a.id)}
                        className="br-display mt-4 w-full rounded-xl py-2 text-xs font-semibold"
                        style={{
                          border: "1.5px solid #dc2626",
                          color: "#dc2626",
                          background: "#fff",
                        }}
                      >
                        Remove access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
