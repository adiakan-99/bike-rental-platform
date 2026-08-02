// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useRef, useState } from "react";
import { Ban, Bike, Briefcase, ChevronRight, Clock3, Heart, History, Lock, LogOut, Search, ShieldCheck, User, UserPlus } from "lucide-react";
import { isSuspended } from "../lib/access.js";

export function Navbar({ onLogo, onLogin, onRegister, loggedIn, session, onRentals, onWishlist, onLogout, onAbout, onDealerPortal, onMyFleet, onPartner, onAdmin, onSearch, onAddAdmin, onShowAdmins, onProfile, minimal = false }) {
  const suspended = isSuspended(session);
  const isCustomer = !session || session.roles?.includes("CUSTOMER");
  // A suspended user loses every hosting/staff surface, whatever roles they hold.
  const isPartner = !suspended && session?.roles?.includes("PARTNER");
  const partnerApproved = isPartner && session?.approvalStatus === "APPROVED";
  const isAdmin = !suspended && session?.roles?.includes("ADMIN");
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // close on Escape / outside click — expected behaviour for a disclosure menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    const onDoc = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDoc); };
  }, [open]);

  const go = (fn) => () => { setOpen(false); fn?.(); };

  const Item = ({ icon: Icon, label, sub, onClick, badge }) => (
    <button onClick={go(onClick)} role="menuitem" className="br-option flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><Icon size={15} style={{ color: "var(--brand)" }} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold" style={{ color: "var(--ink)" }}>{label}</span>
        {sub && <span className="block text-xs" style={{ color: "var(--mute)" }}>{sub}</span>}
      </span>
      {badge && <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#ede9fe", color: "#6d28d9" }}>{badge}</span>}
    </button>
  );
  const Group = ({ label, children }) => (
    <div className="py-1.5">
      <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--mute)" }}>{label}</p>
      {children}
    </div>
  );
  const Divider = () => <div className="my-1 h-px" style={{ background: "var(--line)" }} />;

  // On the login and registration pages the bar carries only the wordmark —
  // no menu, no account icon, no Login button, no secondary links.
  if (minimal) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <nav className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={onLogo} className="flex shrink-0 items-center gap-2.5" aria-label="BikeRental home">
              <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "var(--brand)" }}><Bike size={20} strokeWidth={2.4} /></span>
              <span className="br-display text-lg font-bold">Bike<span style={{ color: "var(--brand)" }}>Rental</span></span>
            </button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
      <nav className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <button onClick={onLogo} className="flex shrink-0 items-center gap-2.5" aria-label="BikeRental home">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "var(--brand)" }}><Bike size={20} strokeWidth={2.4} /></span>
            <span className="br-display text-lg font-bold">Bike<span style={{ color: "var(--brand)" }}>Rental</span></span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 2-3 primary links stay visible on desktop (hybrid pattern) */}
            {!isAdmin && !suspended && <button onClick={onSearch} className="br-nav-link hidden text-sm font-medium lg:block">Search Bikes</button>}
            <button onClick={() => onAbout?.()} className="br-nav-link hidden text-sm font-medium lg:block">About &amp; Contact</button>
            {isCustomer && <button onClick={onRentals} className="br-nav-link hidden items-center gap-1.5 text-sm font-medium lg:flex"><History size={15} /> Rental History</button>}

            {/* primary CTA stays outside the menu — never hide sign-in */}
            {!loggedIn && <button onClick={onLogin} className="br-btn br-display rounded-xl px-4 py-2 text-sm font-semibold sm:px-5">Login</button>}
            {!isAdmin && isPartner && !isCustomer && <button onClick={onDealerPortal} className="br-btn br-display flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold sm:px-5"><Briefcase size={15} /> Partner Portal</button>}

            {/* menu */}
            <div className="relative">
              <button ref={btnRef} onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-haspopup="true" aria-controls="main-menu"
                className="flex h-10 items-center rounded-xl px-2 transition" style={{ border: "1px solid var(--line)", background: open ? "var(--form-bg)" : "#fff" }}>
                <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: loggedIn ? "var(--teal)" : "#cbd5e1" }}>
                  <User size={13} />
                </span>
              </button>

              {open && (
                <div ref={panelRef} id="main-menu" role="menu" aria-label="Main menu"
                  className="br-fade-up absolute right-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                  style={{ top: "3rem", width: "min(320px, 86vw)", border: "1px solid var(--line)", zIndex: 60, maxHeight: "min(360px, calc(100vh - 6rem))" }}>

                  {/* account header */}
                  {loggedIn ? (
                    <button onClick={() => { setOpen(false); onProfile?.(); }} className="br-profile-hdr flex w-full shrink-0 items-center gap-3 px-4 py-3 text-left transition" style={{ background: "var(--form-bg)" }}>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" style={{ background: isAdmin ? "#b91c1c" : isPartner ? "#6d28d9" : "var(--teal)" }}>{isAdmin ? <ShieldCheck size={18} /> : isPartner ? <Briefcase size={18} /> : <User size={18} />}</span>
                      <div className="min-w-0 flex-1">
                        <p className="br-display truncate text-sm font-bold">{session?.name || "Welcome"}</p>
                        <p className="truncate text-xs" style={{ color: "var(--mute)" }}>{session?.email}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {session.roles.map((r) => (
                            <span key={r} className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={r === "ADMIN" ? { background: "#fee2e2", color: "#b91c1c" } : r === "PARTNER" ? { background: "#ede9fe", color: "#6d28d9" } : { background: "#dbeafe", color: "#1d4ed8" }}>{r}</span>
                          ))}
                          {suspended && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "#b91c1c", color: "#fff" }}>SUSPENDED</span>}
                          {(session.providers || []).filter((x) => x !== "password").map((x) => (
                            <span key={x} className="rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize" style={{ background: "#e2e8f0", color: "#475569" }}>via {x}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={16} className="shrink-0 self-center" style={{ color: "var(--mute)" }} />
                    </button>
                  ) : (
                  <div className="flex shrink-0 items-center gap-3 px-4 py-3" style={{ background: "var(--form-bg)" }}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" style={{ background: "#94a3b8" }}><User size={18} /></span>
                    <div className="min-w-0">
                      <p className="br-display truncate text-sm font-bold">Welcome</p>
                      <p className="truncate text-xs" style={{ color: "var(--mute)" }}>Log in to manage your rentals</p>
                    </div>
                  </div>
                  )}

                  <div className="br-scroll flex-1 overflow-y-auto p-1.5">
                    {/* STAFF — no customer browse features */}
                    {isAdmin && (
                      <Group label="Administration">
                        <Item icon={ShieldCheck} label="Show admins" sub="View the admin team" onClick={() => { setOpen(false); onShowAdmins?.(); }} />
                        <Item icon={UserPlus} label="Add admin" sub="Create a new admin account" onClick={() => { setOpen(false); onAddAdmin?.(); }} />
                      </Group>
                    )}

                    {/* PARTNER */}
                    {isPartner && (<>
                      {isAdmin && <Divider />}
                      {partnerApproved ? (
                        <Group label="Hosting">
                          <Item icon={Briefcase} label="Partner portal" sub="Bookings, fleet & earnings" onClick={onDealerPortal} />
                          <Item icon={Bike} label="My fleet" sub="Listings and approvals" onClick={onMyFleet || onDealerPortal} />
                        </Group>
                      ) : (
                        <Group label="Partner">
                          <Item icon={Clock3} label="Application status" sub="Under review — listings locked" onClick={onDealerPortal} />
                        </Group>
                      )}
                    </>)}

                    {/* SUSPENDED — history only, everything else withheld */}
                    {suspended && (<>
                      <div className="mx-1.5 mt-1.5 flex items-start gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fee2e2" }}>
                        <Ban size={14} className="mt-0.5 shrink-0" style={{ color: "#b91c1c" }} />
                        <p className="text-[11px] font-medium" style={{ color: "#7f1d1d" }}>Account suspended — booking, hosting and review tools are locked.</p>
                      </div>
                      <Group label="Account">
                        <Item icon={History} label="My Account" sub="View past bookings (read-only)" onClick={onRentals} />
                      </Group>
                    </>)}

                    {/* CUSTOMER */}
                    {loggedIn && isCustomer && !suspended && (<>
                      {(isAdmin || isPartner) && <Divider />}
                      <Group label="Account">
                        <Item icon={History} label="My Account" sub="Rentals, invoices & reviews" onClick={onRentals} />
                        <Item icon={Heart} label="Wishlist" sub="Bikes you saved" onClick={onWishlist} />
                      </Group>
                      <Divider />
                      <Group label="Explore">
                        <Item icon={Search} label="Search Bikes" onClick={onLogo} />
                      </Group>
                    </>)}

                    {/* SIGNED OUT */}
                    {!loggedIn && (<>
                      <Group label="Account">
                        <Item icon={Lock} label="Log in" sub="Access your bookings" onClick={onLogin} />
                        <Item icon={User} label="Create an account" sub="Rent in under 2 minutes" onClick={onRegister} />
                      </Group>
                      <Divider />
                      <Group label="Explore">
                        <Item icon={Search} label="Search Bikes" onClick={onLogo} />
                      </Group>
                      <Divider />
                      <Group label="Hosting">
                        <Item icon={Bike} label="List your bikes" sub="Rent out what you own" onClick={onPartner} badge="Earn" />
                        <Item icon={Briefcase} label="Partner login" onClick={onDealerPortal} />
                      </Group>
                    </>)}

                    {/* customers who aren't partners yet */}
                    {loggedIn && isCustomer && !isPartner && !isAdmin && !suspended && (<>
                      <Divider />
                      <Group label="Hosting">
                        <Item icon={Bike} label="List your bikes" sub="Rent out what you own" onClick={onPartner} badge="Earn" />
                      </Group>
                    </>)}

                    {loggedIn && (<><Divider />
                      <button onClick={go(onLogout)} role="menuitem" className="br-option flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "#fee2e2" }}><LogOut size={15} style={{ color: "#dc2626" }} /></span>
                        <span className="text-sm font-semibold" style={{ color: "#dc2626" }}>Log out</span>
                      </button></>)}
                  </div>

                  {isAdmin && <div className="flex shrink-0 items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid var(--line)", background: "var(--form-bg)" }}>
                    <span className="text-[11px]" style={{ color: "var(--mute)" }}>Staff only</span>
                    <button onClick={go(onAdmin)} role="menuitem" className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--mute)" }}>
                      <Lock size={11} /> Admin panel
                    </button>
                  </div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
