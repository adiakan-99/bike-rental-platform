// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Ban,
  Banknote,
  Bike,
  Briefcase,
  Building2,
  Clock3,
  CreditCard,
  Facebook,
  Flag,
  Fuel,
  Info,
  Instagram,
  LifeBuoy,
  Linkedin,
  Lock,
  MapPin,
  Navigation2,
  Percent,
  PhoneCall,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Twitter,
  Umbrella,
  Usb,
  User,
  Users,
  Wallet,
  Wifi,
  XCircle,
  Youtube,
  Zap,
} from "lucide-react";
import { hasOpenDispute } from "../lib/deposit.js";
import { inr } from "../lib/money.js";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DEDUCTION_STATUS = {
  applied: { label: "Applied", fg: "#b45309", bg: "#fef3c7" },
  disputed: { label: "Under review", fg: "#1d4ed8", bg: "#dbeafe" },
  reversed: { label: "Reversed", fg: "#15803d", bg: "#dcfce7" },
};

export const DEPOSIT_STATUS = {
  held: { label: "Held", fg: "#334155", bg: "var(--form-bg)" },
  pending_settlement: {
    label: "Awaiting settlement",
    fg: "#c2410c",
    bg: "#ffedd5",
  },
  released: { label: "Released", fg: "#15803d", bg: "#dcfce7" },
};

export const ROLE = {
  CUSTOMER: "CUSTOMER",
  PARTNER: "PARTNER",
  ADMIN: "ADMIN",
};

export const KYC_STATUS = {
  NOT_SUBMITTED: "NOT_SUBMITTED",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

export const PERMISSIONS = {
  CUSTOMER: [
    "booking.create",
    "booking.viewOwn",
    "review.create",
    "dispute.raise",
    "report.raise",
  ],
  PARTNER: [
    "portal.access",
    "listing.create",
    "listing.viewOwn",
    "inspection.record",
    "earnings.view",
  ],
  ADMIN: [
    "admin.access",
    "partner.approve",
    "bike.approve",
    "dispute.resolve",
    "user.block",
  ],
};

export const SUSPENDED_ALLOWED = ["booking.viewOwn"];

export const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Goa",
  "Ahmedabad",
];

export const CAT_GRADIENT = {
  Sports: "linear-gradient(135deg,#7f1d1d,#dc2626)",
  Naked: "linear-gradient(135deg,#7c2d12,#ea580c)",
  Cruiser: "linear-gradient(135deg,#0f2c4c,#1d4ed8)",
  Touring: "linear-gradient(135deg,#0b3b4a,#0e7c7b)",
  Adventure: "linear-gradient(135deg,#3f2d12,#b45309)",
  "Off-road": "linear-gradient(135deg,#3a2e0a,#a16207)",
  Scooter: "linear-gradient(135deg,#0b3b32,#0e9f6e)",
  Electric: "linear-gradient(135deg,#083344,#0891b2)",
  Commuter: "linear-gradient(135deg,#1f2937,#475569)",
  Premium: "linear-gradient(135deg,#2e1065,#7c3aed)",
};

export const BADGE_COLOR = {
  "Best Deal": "#0e9f6e",
  "New Arrival": "#1d4ed8",
  "Most Booked": "#7c3aed",
  "Limited Stock": "#dc2626",
  "Weekend Offer": "#ea580c",
  "Verified Listing": "#0e7c7b",
};

export const MANUFACTURERS = [
  "Honda",
  "Yamaha",
  "KTM",
  "Royal Enfield",
  "Bajaj",
  "TVS",
  "Suzuki",
  "Hero",
  "Ola Electric",
  "Ather",
  "Triumph",
  "BMW",
  "Kawasaki",
];

export const CATEGORIES = [
  "Scooter",
  "Commuter",
  "Sports",
  "Naked",
  "Cruiser",
  "Adventure",
  "Touring",
  "Electric",
  "Off-road",
  "Premium",
];

export const ENGINE_BANDS = [
  "Under 125cc",
  "125–200cc",
  "200–350cc",
  "Above 350cc",
];

export const COMPARE_GROUPS = [
  {
    group: "Pricing",
    rows: [
      { label: "Price per day", get: (b) => b.price, fmt: inr, better: "low" },
      { label: "Original price", get: (b) => b.orig, fmt: inr, better: null },
      {
        label: "Discount",
        get: (b) =>
          b.orig > b.price
            ? Math.round(((b.orig - b.price) / b.orig) * 100)
            : 0,
        fmt: (v) => `${v}%`,
        better: "high",
      },
      {
        label: "Security deposit",
        get: (b) => b.deposit,
        fmt: (v) => (v === 0 ? "No deposit" : inr(v)),
        better: "low",
      },
    ],
  },
  {
    group: "Engine & performance",
    rows: [
      {
        label: "Engine capacity",
        get: (b) => b.cc,
        fmt: (v) => (v ? `${v}cc` : "Electric"),
        better: "high",
      },
      { label: "Fuel type", get: (b) => b.fuel, fmt: (v) => v, better: null },
      {
        label: "Transmission",
        get: (b) => b.trans,
        fmt: (v) => v,
        better: null,
      },
      {
        label: "Mileage",
        get: (b) => (b.fuel === "Electric" ? 110 : b.cc >= 150 ? 35 : 50),
        fmt: (v) => `${v} km${v === 110 ? " range" : "pl"}`,
        better: "high",
      },
      {
        label: "Top speed",
        get: (b) =>
          b.fuel === "Electric"
            ? 90
            : b.cc >= 300
              ? 160
              : b.cc >= 150
                ? 130
                : 90,
        fmt: (v) => `${v} km/h`,
        better: "high",
      },
    ],
  },
  {
    group: "Ratings & popularity",
    rows: [
      {
        label: "Rating",
        get: (b) => b.rating,
        fmt: (v) => `${v} ★`,
        better: "high",
      },
      {
        label: "Reviews",
        get: (b) => b.reviews,
        fmt: (v) => `${v}`,
        better: "high",
      },
    ],
  },
  {
    group: "Availability",
    rows: [
      {
        label: "Bikes available",
        get: (b) => b.stock,
        fmt: (v) => `${v}`,
        better: "high",
      },
      {
        label: "Instant booking",
        get: (b) => (b.instant ? 1 : 0),
        fmt: (v) => (v ? "Yes" : "No"),
        better: "high",
      },
    ],
  },
  {
    group: "Included",
    rows: [
      {
        label: "Helmet included",
        get: (b) => (b.helmet ? 1 : 0),
        fmt: (v) => (v ? "Yes" : "No"),
        better: "high",
      },
      {
        label: "ABS",
        get: (b) => (b.cc >= 150 || b.fuel === "Electric" ? 2 : 1),
        fmt: (v) => (v === 2 ? "Dual-channel" : "Single-channel"),
        better: "high",
      },
      { label: "Category", get: (b) => b.cat, fmt: (v) => v, better: null },
    ],
  },
];

export const SORT_OPTIONS = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Highest Rated",
  "Most Popular",
  "Newly Added",
  "Best Deals",
  "Lowest Security Deposit",
  "Fastest Booking",
];

export const INCLUDED = [
  { icon: ShieldCheck, label: "Helmet", key: "helmet" },
  { icon: BadgeCheck, label: "Insurance" },
  { icon: LifeBuoy, label: "Roadside Assistance" },
  { icon: Smartphone, label: "Mobile Holder" },
  { icon: PlusCircle, label: "First Aid Kit" },
  { icon: Umbrella, label: "Rain Cover" },
  { icon: Usb, label: "Phone Charger" },
];

export const TERMS = [
  {
    q: "Driving License Required",
    a: "A valid two-wheeler driving license (physical or DigiLocker) must be presented at pickup. Learner's permits are not accepted.",
  },
  {
    q: "Age Restrictions",
    a: "Riders must be at least 18 years old. Bikes above 350cc require the rider to be 21+ with 1 year of riding experience.",
  },
  {
    q: "Security Deposit Rules",
    a: "The refundable deposit is blocked at pickup and released within 5–7 business days after the bike is returned undamaged.",
  },
  {
    q: "Damage Policy",
    a: "Minor scratches are covered under insurance. Structural or engine damage is charged as per the assessment report, capped at the deposit for insured rides.",
  },
  {
    q: "Fuel Rules",
    a: "The bike is handed over with a set fuel level and must be returned at the same level, or a refuelling fee applies.",
  },
  {
    q: "Traffic Fine Responsibility",
    a: "All traffic violations and challans during the rental period are the rider's responsibility and may be deducted from the deposit.",
  },
  {
    q: "Cancellation Policy",
    a: "Free cancellation up to 24 hours before pickup. Within 24 hours, one day's rental is charged.",
  },
  {
    q: "Refund Policy",
    a: "Eligible refunds are processed to the original payment method within 5–7 business days.",
  },
];

export const VIEWS = [
  "Front",
  "Left profile",
  "Right profile",
  "Rear",
  "Cockpit",
];

export const DEALER_AMENITIES = [
  { icon: ShieldCheck, label: "Helmet Included" },
  { icon: BadgeCheck, label: "Insurance Available" },
  { icon: LifeBuoy, label: "Roadside Assistance" },
  { icon: Truck, label: "Home Delivery" },
  { icon: Navigation2, label: "Pickup Assistance" },
  { icon: MapPin, label: "Multiple Pickup Locations" },
  { icon: Wifi, label: "GPS Enabled Bikes" },
  { icon: Sparkles, label: "Sanitized Vehicles" },
  { icon: PhoneCall, label: "24×7 Support" },
  { icon: Smartphone, label: "Online Booking" },
];

export const DEALER_CERTS = [
  { icon: BadgeCheck, label: "Verified Dealer" },
  { icon: Award, label: "Top Rated Dealer" },
  { icon: ShieldCheck, label: "Trusted Partner" },
  { icon: Sparkles, label: "Premium Fleet" },
  { icon: Zap, label: "Fast Response" },
  { icon: Star, label: "Best Customer Service" },
  { icon: TrendingUp, label: "1000+ Successful Rentals" },
];

export const DEALER_POLICIES = [
  {
    q: "Cancellation Policy",
    a: "Free cancellation up to 24 hours before pickup. Within 24 hours, one day's rental is charged; no-shows are non-refundable.",
  },
  {
    q: "Refund Policy",
    a: "Eligible refunds are processed to the original payment method within 5–7 business days of cancellation or deposit release.",
  },
  {
    q: "Security Deposit Policy",
    a: "A refundable deposit is blocked at pickup and released after inspection, minus any deductions for damage, fines, or excess usage.",
  },
  {
    q: "Fuel Policy",
    a: "The bike is handed over at a set fuel level and must be returned at the same level, or a refuelling fee applies.",
  },
  {
    q: "Late Return Policy",
    a: "A grace period of 30 minutes is allowed. Beyond that, ₹150 per hour is charged, deducted from the deposit.",
  },
  {
    q: "Damage Policy",
    a: "Minor wear is covered. Structural or engine damage is charged per the assessment report, capped at the deposit for insured rides.",
  },
  {
    q: "Vehicle Inspection Process",
    a: "Every bike is inspected and photographed at both pickup and return, with the report shared with the rider for full transparency.",
  },
];

export const DEALER_FAQS = [
  {
    q: "Is home delivery available?",
    a: "Yes, doorstep delivery and pickup are available across most areas of the city for a small fee, free above a minimum rental duration.",
  },
  {
    q: "What documents are required?",
    a: "A valid two-wheeler driving license and a government-issued ID (Aadhaar/Passport) are required at pickup.",
  },
  {
    q: "Can I extend my rental?",
    a: "Yes, subject to availability. Request an extension from the app or by calling the dealer before your scheduled return.",
  },
  {
    q: "Is roadside assistance included?",
    a: "Basic roadside assistance is included on all rentals; Roadside Assistance Plus can be added for wider coverage.",
  },
  {
    q: "What happens in case of an accident?",
    a: "Report it immediately to the dealer and local authorities. Insured rides cap your liability; keep the FIR and photos for the claim.",
  },
  {
    q: "Can another person ride the bike?",
    a: "Only the registered renter or an additional named rider with a valid license may ride the vehicle.",
  },
];

export const FLEET_DIST = [
  { label: "Scooters", pct: 22 },
  { label: "Sports Bikes", pct: 20 },
  { label: "Cruisers", pct: 15 },
  { label: "Adventure Bikes", pct: 14 },
  { label: "Electric Bikes", pct: 16 },
  { label: "Premium Bikes", pct: 13 },
];

export const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Bike Rentals",
    desc: "Every bike inspected & road-ready.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "Encrypted, PCI-compliant checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Dealers",
    desc: "Rated partners across every city.",
  },
  {
    icon: LifeBuoy,
    title: "24×7 Customer Support",
    desc: "Help on the road, any hour.",
  },
];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export const OAUTH_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    glyph: "G",
    fg: "#4285F4",
    bg: "#fff",
    border: "#dadce0",
  },
  {
    id: "apple",
    label: "Apple",
    glyph: "",
    fg: "#000",
    bg: "#fff",
    border: "#d2d2d7",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    glyph: "M",
    fg: "#5E5E5E",
    bg: "#fff",
    border: "#dbe3ec",
  },
];

export const ID_TYPES = ["Aadhaar", "Passport", "Voter ID", "PAN"];

export const PARTNER_DOCS = [
  { k: "pan", label: "PAN card", hint: "Business or proprietor PAN" },
  { k: "gstin", label: "GST certificate", hint: "If GST-registered" },
  {
    k: "rmc",
    label: "Rental / trade licence",
    hint: "RMC or municipal trade licence",
  },
  {
    k: "address",
    label: "Address proof",
    hint: "Utility bill or registered lease",
  },
  { k: "bank", label: "Cancelled cheque", hint: "For payout verification" },
];

export const ADMIN_TABS = [
  { key: "dealers", label: "Approve Dealers", icon: BadgeCheck, badge: true },
  { key: "bikes", label: "Approve Bikes", icon: Bike, badge: true },
  { key: "disputes", label: "Disputes", icon: Flag, badge: true },
  { key: "kyc", label: "Verify Riders", icon: ShieldCheck, badge: true },
  { key: "allDealers", label: "Dealers", icon: Briefcase },
  { key: "customers", label: "Customers", icon: Users },
  { key: "allBikes", label: "Bikes", icon: Bike },
];

export const ADDONS = [
  { key: "helmet2", label: "Additional Helmet", price: 40, icon: ShieldCheck },
  { key: "holder", label: "Mobile Holder", price: 20, icon: Smartphone },
  { key: "jacket", label: "Riding Jacket", price: 99, icon: Shirt },
  { key: "rain", label: "Rain Gear", price: 60, icon: Umbrella },
  { key: "luggage", label: "Luggage Carrier", price: 80, icon: Briefcase },
  { key: "extins", label: "Extended Insurance", price: 120, icon: BadgeCheck },
  { key: "rsa", label: "Roadside Assistance Plus", price: 70, icon: LifeBuoy },
];

export const PAYMENTS = [
  { key: "credit", label: "Credit Card", icon: CreditCard },
  { key: "debit", label: "Debit Card", icon: CreditCard },
  { key: "upi", label: "UPI", icon: Smartphone },
  { key: "netbank", label: "Net Banking", icon: Building2 },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "cash", label: "Cash at Pickup", icon: Banknote },
];

export const RENTAL_RULES = [
  { icon: CreditCard, text: "Original Driving License required at pickup." },
  { icon: User, text: "Rider must be at least 18 years old." },
  { icon: ShieldCheck, text: "Wear a helmet at all times while riding." },
  { icon: Fuel, text: "Return fuel at the same level as received." },
  {
    icon: Ban,
    text: "Smoking and illegal activities are strictly prohibited.",
  },
  { icon: AlertTriangle, text: "Report any accident or damage immediately." },
  { icon: Info, text: "Follow all traffic regulations and speed limits." },
];

export const TC_SECTIONS = [
  {
    q: "Rental Agreement",
    a: "This agreement governs the rental of the vehicle between you and the dealer, including usage limits, permitted riders, and return conditions.",
  },
  {
    q: "Refund Policy",
    a: "Refunds follow the cancellation tiers below and are processed to the original payment method within 5–7 business days.",
  },
  {
    q: "Security Deposit Policy",
    a: "The refundable deposit is blocked at booking and released after the bike is returned and inspected, minus any applicable deductions.",
  },
  {
    q: "Damage Assessment Policy",
    a: "Any damage beyond normal wear is assessed against a standard rate card. Insured rides cap your liability at the deposit amount.",
  },
  {
    q: "Privacy Policy",
    a: "Your KYC and payment details are encrypted and used only for verification and billing. They are never shared with dealers.",
  },
  {
    q: "Insurance Coverage",
    a: "Basic third-party insurance is included. Extended insurance reduces your damage liability further and can be added above.",
  },
  {
    q: "Liability Disclaimer",
    a: "The rider is responsible for traffic fines, challans, and violations incurred during the rental period.",
  },
];

export const CANCEL_TIERS = [
  {
    window: "More than 48 hrs before",
    refund: "100% refund",
    pct: 100,
    color: "var(--brand)",
  },
  {
    window: "24–48 hrs before",
    refund: "75% refund",
    pct: 75,
    color: "#0d9488",
  },
  {
    window: "Less than 24 hrs before",
    refund: "50% refund",
    pct: 50,
    color: "#eab308",
  },
  {
    window: "After pickup / No Show",
    refund: "No refund",
    pct: 0,
    color: "#dc2626",
  },
];

export const REFUND_STEPS = [
  "Bike Returned",
  "Vehicle Inspection",
  "Additional Charges Calculated (if any)",
  "Remaining Security Deposit Refunded",
  "Refund Processed within 3–7 business days",
];

export const CONFIRM_RULES = [
  { icon: CreditCard, text: "Carry your original Driving License." },
  { icon: ShieldCheck, text: "Wear a helmet at all times." },
  { icon: Info, text: "Follow all traffic regulations." },
  { icon: Clock3, text: "Return the bike on time." },
  { icon: AlertTriangle, text: "Report accidents immediately." },
  { icon: Fuel, text: "Refuel per the agreed policy." },
];

export const RENTAL_STATUS = {
  Upcoming: { fg: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" },
  Ongoing: { fg: "#c2410c", bg: "#ffedd5", dot: "#ea580c" },
  Completed: { fg: "#15803d", bg: "#dcfce7", dot: "#16a34a" },
  Cancelled: { fg: "#b91c1c", bg: "#fee2e2", dot: "#dc2626" },
};

export const RENTAL_CHIP = {
  Upcoming: { emoji: "🔵", fg: "#1d4ed8", bg: "#eff6ff" },
  Ongoing: { emoji: "🟠", fg: "#c2410c", bg: "#fff7ed" },
  Completed: { emoji: "🟢", fg: "#15803d", bg: "#f0fdf4" },
  Cancelled: { emoji: "🔴", fg: "#b91c1c", bg: "#fef2f2" },
};

export const RH_SORTS = {
  recent: "Most Recent",
  oldest: "Oldest First",
  high: "Highest Amount",
  low: "Lowest Amount",
  upcoming: "Upcoming First",
};

export const CANCEL_REASONS = [
  "Change of Plans",
  "Found Another Bike",
  "Price Too High",
  "Booking Mistake",
  "Travel Cancelled",
  "Dealer Issue",
  "Other",
];

export const CANCEL_NOTES = [
  {
    icon: RefreshCw,
    text: "Refund will be credited to the original payment method.",
  },
  {
    icon: ShieldCheck,
    text: "Security deposit is fully refundable if the bike has not been picked up.",
  },
  { icon: Clock3, text: "Refund processing may take 3–7 business days." },
  {
    icon: AlertTriangle,
    text: "Cancellation cannot be reversed after confirmation.",
  },
];

export const PROS_PRESETS = [
  "Well Maintained",
  "Clean Bike",
  "Smooth Ride",
  "Comfortable",
  "Excellent Pickup Experience",
  "Friendly Staff",
  "Quick Documentation",
  "Affordable",
  "Great Condition",
];

export const CONS_PRESETS = [
  "Minor Scratches",
  "Late Pickup",
  "Helmet Quality",
  "High Deposit",
  "Poor Communication",
  "Bike Needed Servicing",
  "Fuel Level Issue",
  "Delayed Refund",
];

export const BIKE_CATS = [
  "Bike Condition",
  "Cleanliness",
  "Comfort",
  "Performance",
  "Value for Money",
];

export const DEALER_CATS = [
  "Pickup Experience",
  "Staff Behaviour",
  "Communication",
  "Documentation Process",
  "Support During Rental",
];

export const RECOMMEND = [
  "Definitely",
  "Probably",
  "Maybe",
  "Probably Not",
  "Never",
];

export const GUIDELINES = [
  "Be respectful.",
  "Share genuine experiences.",
  "Do not include personal information.",
  "Avoid offensive language.",
  "Reviews may be moderated.",
];

export const MISSION = [
  {
    icon: BadgeCheck,
    title: "Verified Dealers",
    desc: "Every partner is KYC-checked and quality-audited.",
  },
  {
    icon: Lock,
    title: "Secure Online Payments",
    desc: "Encrypted, PCI-compliant checkout on every booking.",
  },
  {
    icon: Percent,
    title: "Transparent Pricing",
    desc: "No hidden charges — you see the full breakdown upfront.",
  },
  {
    icon: LifeBuoy,
    title: "Reliable Support",
    desc: "Real humans on call, 24×7, wherever you ride.",
  },
];

export const WHY_US = [
  { icon: Bike, label: "Wide Range of Bikes" },
  { icon: MapPin, label: "Multiple Cities" },
  { icon: Smartphone, label: "Easy Online Booking" },
  { icon: RefreshCw, label: "Secure Refund Process" },
  { icon: BadgeCheck, label: "Trusted Dealer Network" },
  { icon: ShieldCheck, label: "Transparent Deposit Policy" },
  { icon: PhoneCall, label: "24×7 Customer Support" },
  { icon: XCircle, label: "Easy Cancellations" },
];

export const PLATFORM_STATS = [
  { icon: Users, value: "200K+", label: "Registered Customers" },
  { icon: BadgeCheck, value: "1,800+", label: "Verified Dealers" },
  { icon: Bike, value: "12,000+", label: "Bikes Available" },
  { icon: MapPin, value: "42", label: "Cities Served" },
  { icon: TrendingUp, value: "850K+", label: "Completed Rentals" },
  { icon: Star, value: "4.8/5", label: "Avg. Customer Rating" },
];

export const CONTACT_CATEGORIES = [
  "General Inquiry",
  "Booking Issue",
  "Payment Issue",
  "Refund Issue",
  "Dealer Support",
  "Technical Support",
  "Partnership Inquiry",
  "Feedback",
  "Other",
];

export const ABOUT_FAQS = [
  {
    q: "How do I book a bike?",
    a: "Search your city and dates, pick a bike, review the details, and complete a secure payment. You'll get an instant confirmation with pickup details.",
  },
  {
    q: "What documents are required?",
    a: "A valid two-wheeler driving license and a government-issued ID (Aadhaar/Passport) at pickup.",
  },
  {
    q: "When is the security deposit refunded?",
    a: "After the bike is returned and inspected — typically within 3–7 business days, minus any applicable deductions.",
  },
  {
    q: "How can I cancel a booking?",
    a: "Open the booking in My Rentals or Rental Details and tap Cancel Booking. Refunds follow the cancellation policy shown there.",
  },
  {
    q: "What happens if the bike is damaged?",
    a: "Report it immediately. Insured rides cap your liability; damage beyond normal wear is assessed against a standard rate card.",
  },
  {
    q: "Can I extend my rental?",
    a: "Yes, subject to availability. Request an extension from the app or by contacting the dealer before your return time.",
  },
  {
    q: "How do I become a dealer?",
    a: "Use 'Login as Partner/Dealer' to register your business. After verification, you can list your fleet and start earning.",
  },
  {
    q: "How long does a refund take?",
    a: "Eligible refunds are processed to your original payment method within 5–7 business days.",
  },
];

export const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "X (Twitter)" },
  { icon: Youtube, label: "YouTube" },
];

export const POLICIES = [
  {
    key: "privacy",
    q: "Privacy Policy",
    a: "We collect only what's needed to run your rental: identity documents for KYC, contact details for booking updates, and payment information processed by our gateway. Your Aadhaar, PAN and licence are encrypted, used solely for verification, and never shared with dealers or advertisers. Location data is used only while an active booking is running. You can request a copy or deletion of your data at any time from your account or by writing to privacy@bikerental.in.",
  },
  {
    key: "terms",
    q: "Terms & Conditions",
    a: "By booking on BikeRental you confirm you hold a valid two-wheeler licence and are at least 18 (21 for bikes above 350cc). The vehicle may be ridden only by the registered renter or a named additional rider. Traffic fines, challans and violations during the rental period are your responsibility. Bikes may not be used for racing, commercial delivery, or travel outside the permitted state without written approval. We may suspend accounts that repeatedly return vehicles damaged, late, or in breach of these terms.",
  },
  {
    key: "refund",
    q: "Refund Policy",
    a: "Cancellations more than 48 hours before pickup are refunded in full; 24–48 hours before, 75%; under 24 hours, 50%. No-shows and post-pickup cancellations are not refundable. Approved refunds return to your original payment method within 5–7 business days. Platform and booking fees are non-refundable once a booking is confirmed.",
  },
  {
    key: "deposit",
    q: "Security Deposit Policy",
    a: "The refundable deposit is held at booking and settled after the bike is returned and inspected. If the dealer records damages, settlement is delayed by 48 hours so you can dispute any charge. Disputed charges are excluded from deductions while our team reviews them, and the balance is released automatically once the window closes.",
  },
  {
    key: "cancellation",
    q: "Cancellation Policy",
    a: "Cancel from My Rentals or the Rental Details page. The refund tier is shown before you confirm, along with any cancellation penalty. Cancellation is final and cannot be reversed.",
  },
];

export const LISTING_STATUS = {
  Live: { fg: "#15803d", bg: "#dcfce7" },
  "Pending approval": { fg: "#b45309", bg: "#fef3c7" },
  Rejected: { fg: "#b91c1c", bg: "#fee2e2" },
  Draft: { fg: "#334155", bg: "var(--form-bg)" },
};

export const ENTITY_TYPES = [
  "Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP",
  "One Person Company",
];

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Curated list of major Indian cities for address forms (city dropdowns).
export const IN_CITIES = [
  "Agra",
  "Ahmedabad",
  "Ajmer",
  "Amritsar",
  "Aurangabad",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Faridabad",
  "Ghaziabad",
  "Goa",
  "Gurugram",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jalandhar",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangaluru",
  "Meerut",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Navi Mumbai",
  "Noida",
  "Patna",
  "Prayagraj",
  "Pune",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Surat",
  "Thane",
  "Thiruvananthapuram",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
];

// Max input lengths, shared across every form so users can't over-type a field.
export const FIELD_LIMITS = {
  name: 40,
  email: 254,
  phone: 10,
  pincode: 6,
  emergency: 60,
  addressLine: 100,
  referralCode: 20,
  aadhaar: 12,
  passport: 8,
  voterId: 10,
  pan: 10,
  gstin: 15,
  ifsc: 11,
  dl: 16,
  accNo: 18,
  businessName: 120,
};

export const BOOK_FILTERS = [
  { k: "all", label: "All", test: () => true },
  {
    k: "inspection",
    label: "Awaiting inspection",
    test: (r) => r.status === "Completed" && r.settlement?.status === "held",
  },
  {
    k: "settling",
    label: "Settling",
    test: (r) =>
      r.settlement?.status === "pending_settlement" &&
      !hasOpenDispute(r.settlement),
  },
  {
    k: "disputes",
    label: "Disputes",
    test: (r) => hasOpenDispute(r.settlement),
  },
  { k: "upcoming", label: "Upcoming", test: (r) => r.status === "Upcoming" },
];

export const PERIODS = [
  { k: "30d", label: "Last 30 days", short: "30D", days: 30 },
  { k: "7d", label: "Last 7 days", short: "7D", days: 7 },
  { k: "90d", label: "Last 3 months", short: "90D", days: 90 },
  { k: "182d", label: "Last 6 months", short: "6M", days: 182 },
  { k: "365d", label: "Last 12 months", short: "1Y", days: 365 },
  { k: "all", label: "All time", short: "All", days: null },
];

export const RESUBMIT_FALLBACK = [
  {
    k: "docs",
    label: "Updated documents",
    hint: "Re-upload the paperwork flagged in the rejection note.",
  },
];

export const SPEC_TYPES = [
  "Performance",
  "Dimensions",
  "Comfort",
  "Safety",
  "Braking",
  "Fuel & range",
  "Features",
  "Other",
];

export const REPORT_TYPES = [
  "Damaged / Faulty Bike",
  "Dealer Misconduct",
  "Overcharging",
  "Safety Concern",
  "Documentation Issue",
  "Cleanliness Issue",
  "Fraud / Scam",
  "Other",
];
