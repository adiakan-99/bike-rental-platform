# BikeRental — current state

## Setup
```bash
npm install
npm run dev
```
`.env` has `VITE_API_BASE_URL=http://localhost:8080` — change if your backend runs elsewhere.

## What changed most recently
- **Migrated off the Tailwind Play CDN to a real build** (tailwind.config.js, postcss.config.js,
  src/styles/tailwind.css). The CDN version recompiles styles live via a MutationObserver,
  which was causing a "click lands in the wrong place" bug during/after hot-reloads. If you
  pulled this after `npm install` already ran once, **run `npm install` again** — three new
  devDependencies (tailwindcss, postcss, autoprefixer) were added.
- Fixed the date/time search fields (native browser pickers were unreliable — overflow,
  trapped popups, unreliable dismiss). Time is now a `<select>` of 30-min slots; date stays
  native but with proper min-width handling.
- Corrected three wrong backend assumptions after seeing the real Swagger docs:
  - There is **no `PUT /api/v1/auth/me`** (GET only) — name/phone/gender edits in
    ProfilePage now update locally only; not yet persisted. Needs a real backend endpoint.
  - Register needs `phoneNumber` (not `phone`), an uppercase `gender` enum, and a
    `captchaToken` field — fixed, though the token sent is a placeholder since
    `SliderCaptcha` isn't wired to a real CAPTCHA provider.
  - KYC (`POST /api/kyc`) needs `dateOfBirth`/`licenseValidTo` (now collected) and expects
    `idUploadUrl`/`drivingLicenceUrl` as **string URLs**, not files — there's no backend
    endpoint yet to turn a selected file into a URL, so those are sent empty and the form
    shows a banner saying submission is incomplete until that exists.
- Customer Service wired in: `GET /api/customers/me` autofills address/city/state/pincode/
  emergency-contact on login; `PUT /api/customers/{userId}` saves them from ProfilePage.

## Fully wired to your real backend
- Register, login, session-restore-on-refresh, change password (all against `/api/v1/auth/*`)
- Customer address/emergency-contact fields (`/api/customers/*`)

## Still blocked on backend work (see full pending list in chat)
- `PUT /api/v1/auth/me` (name/phone/gender updates)
- KYC file-upload endpoint (blocks KYC from ever fully completing)
- Admin: customer list (`GET /api/customers`), KYC review queue, block/unblock wiring
- Partner Service — not wired to frontend at all yet
- Bike/Booking/Review/Complaint Services — not built yet

## Verification run on this exact tree
- Import/export resolution: 172/172 files OK
- All touched files (RegisterPage, LoginPage, IdentityVerificationPage, AuthContext,
  App.jsx, lib/session.js, main.jsx) parse clean
