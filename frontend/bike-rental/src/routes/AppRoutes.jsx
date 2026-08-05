// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { AboutContactPage } from "../features/about/pages";
import { AdminApp } from "../features/admin/pages";
import {
  IdentityVerificationPage,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "../features/auth/pages";
import { BikeDetailsPage } from "../features/bikeDetails/pages";
import { ConfirmationPage } from "../features/booking/pages";
import { ResultsPage } from "../features/browse/pages";
import { CancellationPage } from "../features/cancellation/pages";
import { CheckoutPage } from "../features/checkout/pages";
import { ComparePage } from "../features/compare/pages";
import { DealerPortal, PartnerRegisterPage } from "../features/dealer/pages";
import { DealerDetailsPage } from "../features/dealerDetails/pages";
import { LandingPage } from "../features/landing/pages";
import { RentalHistoryPage } from "../features/rentals/pages";
import { ReportPage } from "../features/report/pages";
import { WriteReviewPage } from "../features/review/pages";
import { WishlistPage } from "../features/wishlist/pages";
import { isSuspended } from "../lib/access.js";
import { getDealer } from "../mock";
import { findBike } from "../lib/bikeRegistry.js";
import { Guard } from "../ui";

import {
  PartnerOnboardingPage,
  PartnerProfilePage,
} from "../features/dealer/pages";
import { PartnerManagementPage } from "../features/admin/pages";

export function AppRoutes({ ctx }) {
  const {
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
    onDecideBike,
    openRental,
    openRentalCancel,
    openRentalReport,
    openRentalReview,
    pBikes,
    pDealers,
    page,
    pendingBook,
    partnerRentals,
    portalTab,
    recordIdentity,
    recordInspection,
    forgotPassword,
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
    deleteListing,
    fleetError,
    fleetLoading,
    refreshFleet,
    setBikeStatus,
  } = ctx;

  return (
    <main>
      {page === "home" && <LandingPage onSearch={goResults} />}
      {page === "results" && (
        <ResultsPage
          criteria={criteria}
          onEdit={goHome}
          onView={goDetails}
          compare={compare}
          onCompare={toggleCompare}
          wishlist={wishlist}
          onWish={toggleWish}
        />
      )}
      {page === "compare" && (
        <ComparePage
          bikes={compareBikes}
          criteria={criteria}
          onRemove={toggleCompare}
          onView={goDetails}
          onBack={() => go("results")}
          onClear={() => {
            setCompare(new Set());
            go("results");
          }}
        />
      )}
      {page === "details" && (
        <BikeDetailsPage
          bike={selectedBike}
          criteria={criteria}
          onBack={() => go("results")}
          onDealer={goDealer}
          onView={goDetails}
          onBook={goBook}
          wished={wishlist.has(selectedBike?.id)}
          onWish={toggleWish}
        />
      )}
      {page === "dealer" && selectedDealer && (
        <DealerDetailsPage
          dealer={selectedDealer}
          fromBike={selectedBike}
          criteria={criteria}
          onBack={backFromDealer}
          onView={goDetails}
          wishlist={wishlist}
          onWish={toggleWish}
          onDealer={(d) =>
            goDealer(d, findBike((b) => b.dealer === d.id) || selectedBike)
          }
        />
      )}
      {page === "register" && (
        <RegisterPage
          onLogin={() => go("login")}
          onDone={() => go("login")}
          onRegistered={registerUser}
          onSocial={socialAuth}
        />
      )}
      {page === "login" && (
        <LoginPage
          onRegister={() => go("register")}
          onDone={afterAuth}
          users={users}
          onSocial={socialAuth}
          onResetPassword={resetPassword}
          onForgotPassword={forgotPassword}
        />
      )}

      {page === "profile" &&
        (session ? (
          <ProfilePage
            session={session}
            profile={currentProfile}
            onSave={saveProfile}
            onChangePassword={changePassword}
            onBack={goHome}
            onLogout={() => {
              setSession(null);
              goHome();
            }}
          />
        ) : (
          <LoginPage
            onRegister={() => go("register")}
            onDone={afterAuth}
            users={users}
            onSocial={socialAuth}
            onResetPassword={resetPassword}
            onForgotPassword={forgotPassword}
          />
        ))}
      {page === "identity" && (
        <Guard
          session={session}
          need="booking.create"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <IdentityVerificationPage
            session={session}
            bike={selectedBike}
            onBack={() => go("details")}
            onVerified={recordIdentity}
          />
        </Guard>
      )}
      {page === "checkout" && (
        <Guard
          session={session}
          need="booking.create"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <CheckoutPage
            bike={selectedBike}
            criteria={criteria}
            onBack={() => go("details")}
            onHome={goHome}
            onConfirmed={(bk) => {
              setBooking(bk);
              go("confirmation");
            }}
          />
        </Guard>
      )}
      {page === "confirmation" && booking && (
        <ConfirmationPage
          bike={selectedBike}
          criteria={criteria}
          booking={booking}
          onDealer={() =>
            goDealer(getDealer(selectedBike, criteria.city), selectedBike)
          }
          onHome={goHome}
          onBookings={() => go("rentals")}
          onCancel={blockIfSuspended(() => go("cancel"))}
          onReview={blockIfSuspended(() => go("review"))}
          onReport={blockIfSuspended(() => go("report"))}
          settlement={activeSettlement}
          suspended={isSuspended(session)}
          onDispute={blockIfSuspended((dedId, reason) =>
            disputeDeduction(booking.rentalId, dedId, reason),
          )}
          preRideReports={activeRental?.preRideReports || []}
          onPreRide={
            booking.rentalId && !isSuspended(session)
              ? (entry) => addPreRideReport(booking.rentalId, entry)
              : null
          }
        />
      )}
      {page === "cancel" && booking && (
        <Guard
          session={session}
          need="booking.create"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <CancellationPage
            bike={selectedBike}
            criteria={criteria}
            booking={booking}
            onKeep={() => go("confirmation")}
            onViewDetails={() => {
              setBooking({ ...booking, status: "Cancelled" });
              go("confirmation");
            }}
            onRentals={() => go("rentals")}
            onExplore={goHome}
          />
        </Guard>
      )}
      {page === "wishlist" && (
        <WishlistPage
          bikes={wishlistBikes}
          wishlist={wishlist}
          onWish={toggleWish}
          onView={goDetails}
          onExplore={() => go("results")}
          suspended={isSuspended(session)}
        />
      )}
      {page === "rentals" && (
        <RentalHistoryPage
          rentals={rentals}
          suspended={isSuspended(session)}
          onView={openRental}
          onBook={blockIfSuspended(goDetails)}
          onExplore={goHome}
          onCancel={blockIfSuspended(openRentalCancel)}
          onReview={blockIfSuspended(openRentalReview)}
          onReport={blockIfSuspended(openRentalReport)}
          onWishlist={() => go("wishlist")}
          onSupport={() => goAbout("contact")}
        />
      )}
      {page === "review" && booking && (
        <Guard
          session={session}
          need="review.create"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <WriteReviewPage
            bike={selectedBike}
            criteria={criteria}
            booking={booking}
            onCancel={() => go("rentals")}
            onViewDetails={() => go("confirmation")}
            onExplore={goHome}
            onHome={goHome}
          />
        </Guard>
      )}
      {page === "report" && booking && (
        <Guard
          session={session}
          need="report.raise"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <ReportPage
            bike={selectedBike}
            criteria={criteria}
            booking={booking}
            onBack={() => go("confirmation")}
            onRentals={() => go("rentals")}
            onHome={goHome}
          />
        </Guard>
      )}
      {page === "admin" && (
        <Guard
          session={session}
          need="admin.access"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <AdminApp
            session={session}
            rentals={rentals}
            onResolveDispute={resolveDispute}
            pDealers={pDealers}
            setPDealers={setPDealers}
            pBikes={pBikes}
            onDecideBike={onDecideBike}
            adminAction={adminAction}
          />
        </Guard>
      )}
      {page === "dealerPortal" && (
        <Guard
          session={session}
          need="portal.access"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <DealerPortal
            session={session}
            rentals={partnerRentals}
            onInspect={recordInspection}
            listings={myListings}
            fleetLoading={fleetLoading}
            fleetError={fleetError}
            onRefreshFleet={refreshFleet}
            onSetBikeStatus={setBikeStatus}
            onDeleteListing={deleteListing}
            onListBike={submitListing}
            onEditListing={(id, patch) => {
              editListing(id, patch);
              notify("Listing updated — sent for review.");
            }}
            onSetListingStatus={(id, st, patch) => {
              setListingStatus(id, st, patch);
              notify(
                "Documents resubmitted — listing is back in the review queue.",
              );
            }}
            onRegister={() => go("partner")}
            onBrowse={() => go("results")}
            onHome={goHome}
            portalTab={portalTab}
          />
        </Guard>
      )}
      {page === "partner" && (
        <PartnerRegisterPage
          onSubmit={submitPartner}
          onLogin={() => go("dealerPortal")}
          onHome={goHome}
          session={session}
        />
      )}
      {page === "partnerProfile" && (
        <Guard
          session={session}
          need="portal.access"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <PartnerProfilePage onBack={goHome} onEdit={goPartnerOnboard} />
        </Guard>
      )}

      {page === "partnerOnboard" && (
        <Guard
          session={session}
          need="portal.access"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <PartnerOnboardingPage
            onSuccess={() => {
              notify("Partner profile submitted for review.");
              goPartnerProfile();
            }}
            onCancel={goHome}
          />
        </Guard>
      )}

      {page === "adminPartners" && (
        <Guard
          session={session}
          need="partner.approve"
          onLogin={() => go("login")}
          onHome={goHome}
        >
          <PartnerManagementPage onBack={goHome} notify={notify} />
        </Guard>
      )}
      {page === "about" && (
        <AboutContactPage
          onHome={goHome}
          section={aboutSection ? aboutSection.split(":")[0] : null}
        />
      )}
    </main>
  );
}
