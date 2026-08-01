// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { accountStatusMessage, accountStatusTitle, can, isSuspended } from "../lib/access.js";
import { AccessDenied } from "./AccessDenied.jsx";

export function Guard({ session, need, onLogin, onHome, children }) {
  if (!session) return <AccessDenied title="Please log in" message="You need to be signed in to view this page." action="Go to login" onAction={onLogin} />;
  if (isSuspended(session)) return <AccessDenied title={accountStatusTitle(session.accountStatus)} message={accountStatusMessage(session.accountStatus)} action="Back to home" onAction={onHome} />;
  if (need && !can(session, need)) return <AccessDenied title="You don't have access" message="Your account doesn't have permission for this area." action="Back to home" onAction={onHome} />;
  return children;
}
