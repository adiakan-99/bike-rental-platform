// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { DISPUTE_WINDOW_HOURS } from "../config";
import { ROLE } from "../constants";
import { durationHours } from "../lib/datetime.js";
import { buildFare } from "../lib/fare.js";

export const DEMO_USERS = [
  { userId: 1, email: "aarav@email.com", password: "demo123", name: "Aarav Sharma", phone: "9812345670",
    roles: [ROLE.CUSTOMER], partnerId: null, approvalStatus: null, accountStatus: "ACTIVE" },
  { userId: 2, email: "dealer@apexmoto.in", password: "demo123", name: "Rohan Deshpande", phone: "9876500011",
    roles: [ROLE.CUSTOMER, ROLE.PARTNER], partnerId: 0, approvalStatus: "APPROVED", accountStatus: "ACTIVE" },
  { userId: 3, email: "newpartner@rides.in", password: "demo123", name: "Meera Iyer", phone: "9876500022",
    roles: [ROLE.CUSTOMER, ROLE.PARTNER], partnerId: 1, approvalStatus: "PENDING", accountStatus: "ACTIVE" },
  { userId: 4, email: "admin@bikerental.in", password: "demo123", name: "Administrator", phone: "1800123456",
    roles: [ROLE.ADMIN], partnerId: null, approvalStatus: null, accountStatus: "ACTIVE" },
  { userId: 5, email: "blocked@email.com", password: "demo123", name: "Suspended User", phone: "9812340000",
    roles: [ROLE.CUSTOMER], partnerId: null, approvalStatus: null, accountStatus: "SUSPENDED" },
];

export const BIKES = [
  { id:1, name:"KTM Duke 390", mf:"KTM", cat:"Naked", cc:390, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.8, reviews:324, price:799, orig:999, deposit:2000, stock:3, badge:"Best Deal", instant:true, dealer:0 },
  { id:2, name:"Royal Enfield Classic 350", mf:"Royal Enfield", cat:"Cruiser", cc:349, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.7, reviews:512, price:649, orig:799, deposit:1500, stock:8, badge:"Most Booked", instant:true, dealer:1 },
  { id:3, name:"Ather 450X", mf:"Ather", cat:"Electric", cc:0, fuel:"Electric", trans:"Automatic", helmet:true, rating:4.6, reviews:189, price:549, orig:549, deposit:0, stock:12, badge:"New Arrival", instant:true, dealer:2 },
  { id:4, name:"Yamaha MT-15", mf:"Yamaha", cat:"Naked", cc:155, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.5, reviews:267, price:499, orig:649, deposit:1500, stock:2, badge:"Limited Stock", instant:false, dealer:0 },
  { id:5, name:"Honda Activa 6G", mf:"Honda", cat:"Scooter", cc:110, fuel:"Petrol", trans:"Automatic", helmet:true, rating:4.4, reviews:831, price:299, orig:349, deposit:0, stock:20, badge:"Best Deal", instant:true, dealer:1 },
  { id:6, name:"Bajaj Pulsar NS200", mf:"Bajaj", cat:"Sports", cc:199, fuel:"Petrol", trans:"Manual", helmet:false, rating:4.3, reviews:204, price:449, orig:549, deposit:1500, stock:6, badge:"Weekend Offer", instant:true, dealer:2 },
  { id:7, name:"Royal Enfield Himalayan", mf:"Royal Enfield", cat:"Adventure", cc:411, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.7, reviews:298, price:899, orig:1099, deposit:3000, stock:4, badge:"Most Booked", instant:false, dealer:0 },
  { id:8, name:"TVS Apache RTR 160", mf:"TVS", cat:"Commuter", cc:160, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.2, reviews:176, price:379, orig:379, deposit:1000, stock:15, badge:"New Arrival", instant:true, dealer:1 },
  { id:9, name:"Ola S1 Pro", mf:"Ola Electric", cat:"Electric", cc:0, fuel:"Electric", trans:"Automatic", helmet:true, rating:4.1, reviews:143, price:499, orig:599, deposit:0, stock:9, badge:"Weekend Offer", instant:true, dealer:2 },
  { id:10, name:"Suzuki Gixxer SF", mf:"Suzuki", cat:"Sports", cc:155, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.5, reviews:221, price:529, orig:649, deposit:1500, stock:5, badge:"Best Deal", instant:true, dealer:0 },
  { id:11, name:"Hero Xpulse 200", mf:"Hero", cat:"Off-road", cc:199, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.4, reviews:158, price:599, orig:749, deposit:2000, stock:3, badge:"Limited Stock", instant:false, dealer:1 },
  { id:12, name:"KTM 390 Adventure", mf:"KTM", cat:"Touring", cc:373, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.8, reviews:187, price:999, orig:1249, deposit:3000, stock:4, badge:"Most Booked", instant:true, dealer:2 },
  { id:13, name:"Triumph Speed 400", mf:"Triumph", cat:"Premium", cc:398, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.9, reviews:142, price:1149, orig:1399, deposit:3000, stock:3, badge:"New Arrival", instant:true, dealer:3 },
  { id:14, name:"Yamaha R15 V4", mf:"Yamaha", cat:"Sports", cc:155, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.6, reviews:389, price:679, orig:849, deposit:2000, stock:7, badge:"Most Booked", instant:true, dealer:3 },
  { id:15, name:"Honda H'ness CB350", mf:"Honda", cat:"Cruiser", cc:348, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.5, reviews:233, price:749, orig:899, deposit:2000, stock:6, badge:"Best Deal", instant:true, dealer:3 },
  { id:16, name:"BMW G 310 GS", mf:"BMW", cat:"Adventure", cc:313, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.7, reviews:118, price:1299, orig:1549, deposit:3000, stock:2, badge:"Limited Stock", instant:false, dealer:4 },
  { id:17, name:"Royal Enfield Scram 411", mf:"Royal Enfield", cat:"Off-road", cc:411, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.4, reviews:167, price:799, orig:949, deposit:2500, stock:5, badge:"Weekend Offer", instant:true, dealer:4 },
  { id:18, name:"Suzuki V-Strom SX", mf:"Suzuki", cat:"Touring", cc:249, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.3, reviews:96, price:849, orig:999, deposit:2500, stock:4, badge:"New Arrival", instant:true, dealer:4 },
  { id:19, name:"TVS Jupiter 125", mf:"TVS", cat:"Scooter", cc:125, fuel:"Petrol", trans:"Automatic", helmet:true, rating:4.2, reviews:512, price:279, orig:329, deposit:0, stock:24, badge:"Best Deal", instant:true, dealer:5 },
  { id:20, name:"Hero Splendor Plus", mf:"Hero", cat:"Commuter", cc:97, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.1, reviews:640, price:249, orig:249, deposit:1000, stock:30, badge:"Most Booked", instant:true, dealer:5 },
  { id:21, name:"Bajaj Chetak EV", mf:"Bajaj", cat:"Electric", cc:0, fuel:"Electric", trans:"Automatic", helmet:true, rating:4.4, reviews:204, price:459, orig:559, deposit:0, stock:11, badge:"Weekend Offer", instant:true, dealer:5 },
  { id:22, name:"Kawasaki Ninja 300", mf:"Kawasaki", cat:"Sports", cc:296, fuel:"Petrol", trans:"Manual", helmet:true, rating:4.8, reviews:151, price:1099, orig:1349, deposit:3000, stock:2, badge:"Limited Stock", instant:false, dealer:3 },
];

export const DEALERS = [
  { id:0, name:"Apex Moto Rentals", rating:4.9, city:"Pune", area:"Koregaon Park", tagline:"Premium performance bikes, meticulously maintained.", years:6, response:"~10 min", rentals:"8,400+", bikes:34 },
  { id:1, name:"CityRide Garage", rating:4.6, city:"Mumbai", area:"Baner", tagline:"Affordable everyday commuters & scooters for the city.", years:4, response:"~25 min", rentals:"5,100+", bikes:52 },
  { id:2, name:"Voltdrive EV Hub", rating:4.7, city:"Pune", area:"Viman Nagar", tagline:"India's cleanest fleet — electric-first, zero emissions.", years:3, response:"~15 min", rentals:"3,600+", bikes:28 },
  { id:3, name:"Torque Motorworks", rating:4.8, city:"Bengaluru", area:"Aundh", tagline:"Enthusiast-grade machines, track-prepped and pampered.", years:5, response:"~12 min", rentals:"6,900+", bikes:41 },
  { id:4, name:"Nomad Adventure Rentals", rating:4.5, city:"Goa", area:"Kalyani Nagar", tagline:"Built for the long road — ADVs, panniers and route maps included.", years:4, response:"~30 min", rentals:"2,800+", bikes:22 },
  { id:5, name:"Metro Two-Wheelers", rating:4.3, city:"Delhi NCR", area:"Hinjewadi", tagline:"Budget-friendly commuters for the daily office run.", years:7, response:"~20 min", rentals:"11,200+", bikes:64 },
];

export const getDealer = (bike, city) => ({ ...DEALERS[bike.dealer ?? 0], city });

export const REVIEWS = [
  { name: "Rahul Mehta", initials: "RM", verified: true, rating: 5, date: "2 weeks ago", title: "Flawless weekend ride", body: "Bike was spotless and delivered on time. The engine felt strong on the highway and city traffic was a breeze.", pros: "Clean, punctual delivery, great pickup", cons: "Slightly firm seat on long rides", helpful: 24, response: "Thank you Rahul! Glad you enjoyed the ride — see you next time." },
  { name: "Sneha Kulkarni", initials: "SK", verified: true, rating: 4, date: "1 month ago", title: "Great value for money", body: "Smooth booking and the dealer was very responsive. Mileage was as promised. Would rent again for city commutes.", pros: "Responsive dealer, good mileage", cons: "Helmet was a bit loose", helpful: 11 },
  { name: "Arjun Nair", initials: "AN", verified: false, rating: 5, date: "1 month ago", title: "Perfect for a Lonavala trip", body: "Took it up the ghats and it handled beautifully. Brakes were sharp and confidence-inspiring on the descents.", pros: "Excellent handling, strong brakes", cons: "None worth mentioning", helpful: 8 },
];

export const DEALER_REVIEWS = [
  { name: "Nikhil Verma", initials: "NV", verified: true, rating: 5, date: "1 week ago", bike: "KTM Duke 390", title: "Best rental experience in the city", body: "Bike was immaculate and delivered on time. The handover was quick and the staff walked me through everything patiently.", pros: "Spotless bike, on-time delivery, friendly staff", cons: "Parking near the counter is tight", helpful: 31, response: "Thank you Nikhil! We look forward to hosting your next ride." },
  { name: "Divya Rao", initials: "DR", verified: true, rating: 4, date: "3 weeks ago", bike: "Royal Enfield Classic 350", title: "Great value and very responsive", body: "Booking was smooth and they responded to my messages within minutes. Deposit was refunded quickly after return.", pros: "Fast responses, quick refund", cons: "Helmet felt slightly worn", helpful: 18 },
  { name: "Sameer Khan", initials: "SK", verified: true, rating: 5, date: "1 month ago", bike: "KTM 390 Adventure", title: "Perfect for my highway trip", body: "Took the ADV up the ghats — flawless. Well-maintained chain, fresh tyres, and full documentation provided.", pros: "Excellent maintenance, complete paperwork", cons: "None", helpful: 12 },
];

export const DEMO_LOGINS = [
  { email: "aarav@email.com", label: "Customer", desc: "Book bikes as a rider", tone: { bg: "#dbeafe", fg: "#1d4ed8" } },
  { email: "dealer@apexmoto.in", label: "Approved Partner", desc: "Customer + live dealer portal", tone: { bg: "#dcfce7", fg: "#15803d" } },
  { email: "newpartner@rides.in", label: "Pending Partner", desc: "Dealer awaiting approval", tone: { bg: "#fef3c7", fg: "#b45309" } },
  { email: "admin@bikerental.in", label: "Admin", desc: "Approvals & moderation", tone: { bg: "#fee2e2", fg: "#b91c1c" } },
  { email: "blocked@email.com", label: "Suspended", desc: "Read-only, frozen account", tone: { bg: "#f3f4f6", fg: "#6b7280" } },
];

export const PENDING_DEALERS_SEED = [
  { id: 1, name: "Rohan Deshpande", business: "Speedster Rentals", city: "Pune", area: "Kothrud", date: "28 Jun 2026", email: "rohan@speedster.in", phone: "9876500011", dob: "1990-04-12", gstin: "27ABCDE1234F1Z5", type: "Proprietorship", since: "2021", fleet: 18, complaints: [] },
  { id: 2, name: "Meera Iyer", business: "GreenWheels EV", city: "Bengaluru", area: "Indiranagar", date: "27 Jun 2026", email: "meera@greenwheels.in", phone: "9876500022", dob: "1988-11-03", gstin: "29PQRSX9876G2Z1", type: "Pvt. Ltd.", since: "2022", fleet: 26, complaints: [{ date: "10 May 2026", text: "Delayed refund of security deposit reported by a customer.", severity: "Medium" }] },
  { id: 3, name: "Karan Malhotra", business: "Highway Kings", city: "Delhi NCR", area: "Dwarka", date: "27 Jun 2026", email: "karan@highwaykings.in", phone: "9876500033", dob: "1993-01-22", gstin: "07LMNOP4567H3Z9", type: "Partnership", since: "2020", fleet: 41, complaints: [] },
  { id: 4, name: "Anjali Rao", business: "UrbanCommute Hub", city: "Hyderabad", area: "Gachibowli", date: "26 Jun 2026", email: "anjali@urbancommute.in", phone: "9876500044", dob: "1995-07-18", gstin: "36QRSTU7890J4Z2", type: "Proprietorship", since: "2023", fleet: 12, complaints: [] },
  { id: 5, name: "Vikram Shetty", business: "Coastline Cruisers", city: "Goa", area: "Panjim", date: "25 Jun 2026", email: "vikram@coastline.in", phone: "9876500055", dob: "1987-09-30", gstin: "30VWXYZ1234K5Z7", type: "Pvt. Ltd.", since: "2019", fleet: 33, complaints: [] },
  { id: 6, name: "Farhan Qureshi", business: "Redline Superbikes", city: "Mumbai", area: "Bandra", date: "25 Jun 2026", email: "farhan@redline.in", phone: "9876500066", dob: "1991-03-14", gstin: "27REDLN5566L6Z3", type: "Pvt. Ltd.", since: "2021", fleet: 29, complaints: [{ date: "2 Jun 2026", text: "Two riders reported the advertised bike was swapped at pickup.", severity: "High" }] },
  { id: 7, name: "Lakshmi Pillai", business: "Backwater Bikes", city: "Chennai", area: "Adyar", date: "24 Jun 2026", email: "lakshmi@backwater.in", phone: "9876500077", dob: "1994-12-05", gstin: "33BKWTR8899M7Z8", type: "Proprietorship", since: "2024", fleet: 9, complaints: [] },
  { id: 8, name: "Gurpreet Singh", business: "Northside Motorcycles", city: "Delhi NCR", area: "Rohini", date: "23 Jun 2026", email: "gurpreet@northside.in", phone: "9876500088", dob: "1986-08-21", gstin: "07NRTHS2211N8Z4", type: "Partnership", since: "2018", fleet: 47, complaints: [{ date: "18 May 2026", text: "Deposit deduction disputed by customer; resolved in customer's favour.", severity: "Low" }] },
  { id: 9, name: "Ritu Agarwal", business: "EcoCharge Scooters", city: "Jaipur", area: "Malviya Nagar", date: "22 Jun 2026", email: "ritu@ecocharge.in", phone: "9876500099", dob: "1996-06-11", gstin: "08ECOCH3344P9Z1", type: "Proprietorship", since: "2025", fleet: 16, complaints: [] },
];

export const PENDING_BIKES_SEED = [
  { id: 1, name: "KTM RC 390", mf: "KTM", owner: "Speedster Rentals", type: "Business", cat: "Sports", cc: 373, price: 949, date: "28 Jun 2026" },
  { id: 2, name: "Ola S1 Air", mf: "Ola Electric", owner: "GreenWheels EV", type: "Business", cat: "Electric", cc: 0, price: 429, date: "27 Jun 2026" },
  { id: 3, name: "Royal Enfield Hunter 350", mf: "Royal Enfield", owner: "Highway Kings", type: "Business", cat: "Commuter", cc: 349, price: 599, date: "27 Jun 2026" },
  { id: 4, name: "Yamaha Aerox 155", mf: "Yamaha", owner: "UrbanCommute Hub", type: "Business", cat: "Scooter", cc: 155, price: 469, date: "26 Jun 2026" },
  { id: 5, name: "Triumph Scrambler 400X", mf: "Triumph", owner: "Redline Superbikes", type: "Business", cat: "Premium", cc: 398, price: 1249, date: "26 Jun 2026" },
  { id: 6, name: "Honda CB300R", mf: "Honda", owner: "Northside Motorcycles", type: "Business", cat: "Naked", cc: 286, price: 799, date: "25 Jun 2026" },
  { id: 7, name: "Ather Rizta", mf: "Ather", owner: "EcoCharge Scooters", type: "Business", cat: "Electric", cc: 0, price: 499, date: "24 Jun 2026" },
  { id: 8, name: "Bajaj Dominar 400", mf: "Bajaj", owner: "Backwater Bikes", type: "Business", cat: "Touring", cc: 373, price: 869, date: "24 Jun 2026" },
  { id: 9, name: "TVS Ronin 225", mf: "TVS", owner: "Speedster Rentals", type: "Business", cat: "Cruiser", cc: 225, price: 559, date: "23 Jun 2026" },
  { id: 10, name: "Royal Enfield Meteor 350", mf: "Royal Enfield", owner: "Aditya Kulkarni", type: "Individual", city: "Pune", cat: "Cruiser", cc: 349, price: 649, date: "28 Jun 2026", reg: "MH12 KJ 4471", year: "2023", docs: [{ type: "RC book", file: "rc_meteor350.pdf", kind: "pdf", size: "412 KB", uploaded: "28 Jun 2026" }, { type: "Insurance", file: "insurance_policy.pdf", kind: "pdf", size: "638 KB", uploaded: "28 Jun 2026" }, { type: "PUC", file: "puc_certificate.jpg", kind: "image", size: "1.1 MB", uploaded: "28 Jun 2026" }], note: "Single owner, serviced last month. Weekends only." },
  { id: 11, name: "Honda Activa 6G", mf: "Honda", owner: "Sneha Fernandes", type: "Individual", city: "Goa", cat: "Scooter", cc: 110, price: 279, date: "27 Jun 2026", reg: "GA07 BL 2290", year: "2024", docs: [{ type: "RC book", file: "activa_rc.pdf", kind: "pdf", size: "388 KB", uploaded: "27 Jun 2026" }, { type: "Insurance", file: "activa_insurance.jpg", kind: "image", size: "902 KB", uploaded: "27 Jun 2026" }], note: "Second scooter at home, idle most weekdays." },
  { id: 12, name: "Yamaha FZ-S V3", mf: "Yamaha", owner: "Imran Sheikh", type: "Individual", city: "Mumbai", cat: "Naked", cc: 149, price: 429, date: "26 Jun 2026", reg: "MH02 DQ 8813", year: "2022", docs: [{ type: "RC book", file: "fzs_rc_scan.jpg", kind: "image", size: "1.4 MB", uploaded: "26 Jun 2026" }], note: "PUC certificate pending upload." },
  { id: 13, name: "Ather 450S", mf: "Ather", owner: "Nandini Rao", type: "Individual", city: "Bengaluru", cat: "Electric", cc: 0, price: 469, date: "25 Jun 2026", reg: "KA05 MH 6604", year: "2025", docs: [{ type: "RC book", file: "ather450s_rc.pdf", kind: "pdf", size: "401 KB", uploaded: "25 Jun 2026" }, { type: "Insurance", file: "ather_insurance.pdf", kind: "pdf", size: "555 KB", uploaded: "25 Jun 2026" }, { type: "PUC", file: "ather_puc.pdf", kind: "pdf", size: "220 KB", uploaded: "25 Jun 2026" }], note: "Home charger included with pickup." },
  { id: 14, name: "Bajaj Pulsar 150", mf: "Bajaj", owner: "Rakesh Yadav", type: "Individual", city: "Delhi NCR", cat: "Commuter", cc: 149, price: 319, date: "24 Jun 2026", reg: "DL08 SF 1157", year: "2021", docs: [{ type: "RC book", file: "pulsar_rc.pdf", kind: "pdf", size: "376 KB", uploaded: "24 Jun 2026" }, { type: "Insurance", file: "pulsar_insurance.jpg", kind: "image", size: "1.0 MB", uploaded: "24 Jun 2026" }], note: "Odometer 41,000 km — priced accordingly." },
  { id: 15, name: "KTM Duke 250", mf: "KTM", owner: "Priyanka Nair", type: "Individual", city: "Pune", cat: "Naked", cc: 248, price: 699, date: "23 Jun 2026", reg: "MH14 TR 3328", year: "2024", docs: [{ type: "RC book", file: "duke250_rc.pdf", kind: "pdf", size: "430 KB", uploaded: "23 Jun 2026" }, { type: "Insurance", file: "duke250_insurance.pdf", kind: "pdf", size: "512 KB", uploaded: "23 Jun 2026" }, { type: "PUC", file: "duke250_puc.jpg", kind: "image", size: "845 KB", uploaded: "23 Jun 2026" }], note: "First-time host, listing one bike." },
];

export const CUSTOMERS_SEED = [
  { id: 1, name: "Aarav Sharma", email: "aarav@email.com", phone: "9812345670", city: "Pune", joined: "Jan 2026", rentals: 12 },
  { id: 2, name: "Sneha Kulkarni", email: "sneha@email.com", phone: "9812345671", city: "Mumbai", joined: "Feb 2026", rentals: 8 },
  { id: 3, name: "Arjun Nair", email: "arjun@email.com", phone: "9812345672", city: "Bengaluru", joined: "Mar 2026", rentals: 5 },
  { id: 4, name: "Priya Menon", email: "priya@email.com", phone: "9812345673", city: "Chennai", joined: "Apr 2026", rentals: 3 },
  { id: 5, name: "Rahul Mehta", email: "rahul@email.com", phone: "9812345674", city: "Delhi NCR", joined: "May 2026", rentals: 17 },
  { id: 6, name: "Ananya Iyer", email: "ananya@email.com", phone: "9812345675", city: "Pune", joined: "Feb 2026", rentals: 21 },
  { id: 7, name: "Vikram Joshi", email: "vikram.j@email.com", phone: "9812345676", city: "Goa", joined: "Nov 2025", rentals: 9 },
  { id: 8, name: "Fatima Sheikh", email: "fatima@email.com", phone: "9812345677", city: "Hyderabad", joined: "Jun 2026", rentals: 2 },
  { id: 9, name: "Karthik Reddy", email: "karthik@email.com", phone: "9812345678", city: "Bengaluru", joined: "Dec 2025", rentals: 14 },
  { id: 10, name: "Meera Banerjee", email: "meera@email.com", phone: "9812345679", city: "Kolkata", joined: "Mar 2026", rentals: 6 },
  { id: 11, name: "Rohit Kapoor", email: "rohit.k@email.com", phone: "9812345680", city: "Pune", joined: "Jan 2025", rentals: 33 },
  { id: 12, name: "Divya Menon", email: "divya@email.com", phone: "9812345681", city: "Chennai", joined: "Jul 2026", rentals: 1 },
  { id: 13, name: "Imran Ali", email: "imran@email.com", phone: "9812345682", city: "Mumbai", joined: "Sep 2025", rentals: 18 },
  { id: 14, name: "Neha Gupta", email: "neha@email.com", phone: "9812345683", city: "Jaipur", joined: "Apr 2026", rentals: 4 },
  { id: 15, name: "Sanjay Patil", email: "sanjay@email.com", phone: "9812345684", city: "Pune", joined: "Feb 2025", rentals: 27 },
  { id: 16, name: "Aisha Khan", email: "aisha@email.com", phone: "9812345685", city: "Hyderabad", joined: "May 2026", rentals: 7 },
  { id: 17, name: "Tanvi Desai", email: "tanvi@email.com", phone: "9812345686", city: "Ahmedabad", joined: "Oct 2025", rentals: 11 },
  { id: 18, name: "Manish Rao", email: "manish@email.com", phone: "9812345687", city: "Bengaluru", joined: "Jun 2026", rentals: 3 },
];

export const ADMINS_SEED = [
  { id: 1, name: "Administrator", email: "admin@bikerental.in", phone: "1800123456", empId: "ADM-0001", dept: "Platform Operations", designation: "Super Admin", access: ["Dealer approvals", "Bike approvals", "Disputes", "User management", "Admin management"], status: "Active", added: "Jan 2026", superAdmin: true },
  { id: 2, name: "Kavya Reddy", email: "kavya.reddy@bikerental.in", phone: "9845012233", empId: "ADM-0007", dept: "Trust & Safety", designation: "Approvals Admin", access: ["Dealer approvals", "Bike approvals", "Disputes"], status: "Active", added: "Mar 2026" },
];

export function makeRentals() {
  const hoursAgo = (h) => new Date(Date.now() - h * 3.6e6);
  const dueFrom = (returnedAt) => new Date(returnedAt.getTime() + DISPUTE_WINDOW_HOURS * 3.6e6);
  // Settlement fixtures — one per completed rental, covering every state in the model.
  const settlements = {
    // 0 · window open, two disputable charges
    Completed_0: (dep) => { const ret = hoursAgo(12); return { depositAmount: dep, status: "pending_settlement", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Scratches on left fairing and tank", amount: 600, evidence: "fairing-scratch.jpg", status: "applied" },
      { id: "d2", desc: "Missing tool kit from under-seat storage", amount: 200, evidence: null, status: "applied" },
    ] }; },
    // 1 · dispute under review (holds settlement)
    Completed_1: (dep) => { const ret = hoursAgo(20); return { depositAmount: dep, status: "pending_settlement", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Fuel returned below agreed level", amount: 450, evidence: "fuel-gauge.jpg", status: "disputed", disputedAt: hoursAgo(4), disputeReason: "I refuelled to full at the pump right outside the shop and have the receipt to prove it." },
    ] }; },
    // 2 · clean return, released in full
    Completed_2: (dep) => { const ret = hoursAgo(200); return { depositAmount: dep, status: "released", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [] }; },
    // 3 · just returned, dealer still owes an inspection
    Completed_3: (dep) => ({ depositAmount: dep, status: "held", returnedAt: hoursAgo(2), settlementDueAt: null, deductions: [] }),
    // 4 · settled with a deduction applied (partial refund)
    Completed_4: (dep) => { const ret = hoursAgo(320); return { depositAmount: dep, status: "released", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Cracked indicator lens, replaced", amount: 350, evidence: "indicator.jpg", status: "applied" },
    ] }; },
    // 5 · renter won a dispute — charge reversed, refunded in full
    Completed_5: (dep) => { const ret = hoursAgo(410); return { depositAmount: dep, status: "released", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Deep scratch on exhaust guard", amount: 800, evidence: null, status: "reversed", disputedAt: hoursAgo(400), disputeReason: "The scratch is visible in the handover photos taken before I rode away.", resolvedAt: hoursAgo(370), resolutionNote: "Pickup photos confirm the damage pre-dates this rental. Charge reversed in full.", resolvedBy: "admin" },
    ] }; },
    // 6 · dealer won a dispute — charge upheld and applied
    Completed_6: (dep) => { const ret = hoursAgo(500); return { depositAmount: dep, status: "released", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Late return — 3 hours beyond schedule", amount: 450, evidence: "gate-log.pdf", status: "applied", disputedAt: hoursAgo(490), disputeReason: "Traffic on the expressway was outside my control.", resolvedAt: hoursAgo(470), resolutionNote: "Gate log confirms a 3h 12m overrun. Late fee stands as per policy.", resolvedBy: "admin" },
    ] }; },
    // 7 · window closed, awaiting automatic release
    Completed_7: (dep) => { const ret = hoursAgo(60); return { depositAmount: dep, status: "pending_settlement", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Chain cleaning and re-lubrication", amount: 250, evidence: "chain.jpg", status: "applied" },
    ] }; },
    // 8 · second open dispute (fills the admin queue)
    Completed_8: (dep) => { const ret = hoursAgo(30); return { depositAmount: dep, status: "pending_settlement", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Dented fuel tank, panel-beating required", amount: 1200, evidence: null, status: "disputed", disputedAt: hoursAgo(8), disputeReason: "The bike was parked in the dealer's own lot overnight when this happened. I never dropped it." },
      { id: "d2", desc: "Helmet visor scratched", amount: 150, evidence: "visor.jpg", status: "applied" },
    ] }; },
    // 9 · third open dispute
    Completed_9: (dep) => { const ret = hoursAgo(18); return { depositAmount: dep, status: "pending_settlement", returnedAt: ret, settlementDueAt: dueFrom(ret), deductions: [
      { id: "d1", desc: "Excess kilometres — 140 km over limit", amount: 700, evidence: "odometer.jpg", status: "disputed", disputedAt: hoursAgo(2), disputeReason: "My booking included unlimited kilometres — please check the rental agreement I signed." },
    ] }; },
    // 10–12 · returned, awaiting the dealer's inspection
    Completed_10: (dep) => ({ depositAmount: dep, status: "held", returnedAt: hoursAgo(5), settlementDueAt: null, deductions: [] }),
    Completed_11: (dep) => ({ depositAmount: dep, status: "held", returnedAt: hoursAgo(9), settlementDueAt: null, deductions: [] }),
    Completed_12: (dep) => ({ depositAmount: dep, status: "held", returnedAt: hoursAgo(26), settlementDueAt: null, deductions: [] }),
  };
  const recs = [
    { bikeId: 1, status: "Ongoing", sd: "2026-07-02", st: "09:00", ed: "2026-07-06", et: "18:00", city: "Pune", bookingDate: "2026-06-30" },
    { bikeId: 14, status: "Ongoing", sd: "2026-07-18", st: "08:00", ed: "2026-07-21", et: "18:00", city: "Pune", bookingDate: "2026-07-14" },
    { bikeId: 2, status: "Upcoming", sd: "2026-07-20", st: "10:00", ed: "2026-07-23", et: "18:00", city: "Bengaluru", bookingDate: "2026-07-01" },
    { bikeId: 3, status: "Completed", sd: "2026-06-10", st: "09:00", ed: "2026-06-12", et: "18:00", city: "Pune", bookingDate: "2026-06-05" },
    { bikeId: 5, status: "Completed", sd: "2026-05-15", st: "08:00", ed: "2026-05-16", et: "20:00", city: "Mumbai", bookingDate: "2026-05-10" },
    { bikeId: 4, status: "Cancelled", sd: "2026-06-28", st: "09:00", ed: "2026-06-30", et: "18:00", city: "Pune", bookingDate: "2026-06-20" },
    { bikeId: 7, status: "Upcoming", sd: "2026-08-05", st: "07:00", ed: "2026-08-10", et: "19:00", city: "Delhi NCR", bookingDate: "2026-07-02" },
    { bikeId: 10, status: "Completed", sd: "2026-04-20", st: "09:00", ed: "2026-04-22", et: "18:00", city: "Goa", bookingDate: "2026-04-15" },
    { bikeId: 9, status: "Cancelled", sd: "2026-07-01", st: "10:00", ed: "2026-07-03", et: "18:00", city: "Hyderabad", bookingDate: "2026-06-25" },
    { bikeId: 12, status: "Upcoming", sd: "2026-07-15", st: "08:00", ed: "2026-07-18", et: "18:00", city: "Pune", bookingDate: "2026-07-03" },
    { bikeId: 6, status: "Completed", sd: "2026-07-16", st: "09:00", ed: "2026-07-18", et: "18:00", city: "Pune", bookingDate: "2026-07-12" },
    { bikeId: 15, status: "Completed", sd: "2026-06-01", st: "09:00", ed: "2026-06-04", et: "18:00", city: "Pune", bookingDate: "2026-05-28" },
    { bikeId: 13, status: "Completed", sd: "2026-05-22", st: "10:00", ed: "2026-05-25", et: "19:00", city: "Mumbai", bookingDate: "2026-05-18" },
    { bikeId: 17, status: "Completed", sd: "2026-05-02", st: "07:00", ed: "2026-05-05", et: "18:00", city: "Goa", bookingDate: "2026-04-28" },
    { bikeId: 20, status: "Completed", sd: "2026-07-14", st: "09:00", ed: "2026-07-17", et: "18:00", city: "Pune", bookingDate: "2026-07-09" },
    { bikeId: 16, status: "Completed", sd: "2026-07-17", st: "08:00", ed: "2026-07-19", et: "17:00", city: "Delhi NCR", bookingDate: "2026-07-11" },
    { bikeId: 22, status: "Completed", sd: "2026-07-17", st: "10:00", ed: "2026-07-19", et: "20:00", city: "Bengaluru", bookingDate: "2026-07-13" },
    { bikeId: 19, status: "Upcoming", sd: "2026-08-12", st: "09:00", ed: "2026-08-14", et: "18:00", city: "Chennai", bookingDate: "2026-07-16" },
    { bikeId: 21, status: "Cancelled", sd: "2026-06-15", st: "10:00", ed: "2026-06-17", et: "18:00", city: "Jaipur", bookingDate: "2026-06-08" },
    { bikeId: 11, status: "Completed", sd: "2026-07-17", st: "08:00", ed: "2026-07-19", et: "19:00", city: "Pune", bookingDate: "2026-07-13" },
    { bikeId: 18, status: "Completed", sd: "2026-07-16", st: "07:00", ed: "2026-07-19", et: "15:00", city: "Mumbai", bookingDate: "2026-07-10" },
    { bikeId: 8, status: "Completed", sd: "2026-07-15", st: "09:00", ed: "2026-07-18", et: "22:00", city: "Bengaluru", bookingDate: "2026-07-11" },
  ];
  let done = 0;
  return recs.map((r, i) => {
    const bike = BIKES.find((b) => b.id === r.bikeId);
    const hrs = durationHours(r.sd, r.st, r.ed, r.et);
    const days = Math.max(1, Math.ceil(hrs / 24));
    const fare = buildFare(bike, days);
    const dealer = { ...DEALERS[bike.dealer], city: r.city };
    let settlement = null;
    if (r.status === "Completed") { const mk = settlements[`Completed_${done++}`]; if (mk) settlement = mk(fare.deposit || 1500); }
    else if (r.status === "Ongoing" || r.status === "Upcoming") settlement = fare.deposit ? { depositAmount: fare.deposit, status: "held", returnedAt: null, settlementDueAt: null, deductions: [] } : null;
    const preRideReports = r.bikeId === 13 ? [{ id: "p1", desc: "Deep scratch already present on the exhaust guard", photo: "pickup-exhaust.jpg", at: new Date(`${r.sd}T${r.st}`) }] : [];
    return { ...r, bike, dealer, hrs, days, fare, settlement, preRideReports, id: `BR-2026-${100000 + bike.id * 137 + i}`, regNo: `${r.city.slice(0, 2).toUpperCase()}12 AB ${1000 + bike.id * 7}`, amount: fare.payNow, deposit: settlement ? settlement.depositAmount : fare.deposit };
  });
}

export const MY_FLEET_SEED = [
  { id: "L1", name: "KTM Duke 390", mf: "KTM", cat: "Naked", cc: 390, fuel: "Petrol", trans: "Manual", year: "2024", reg: "MH12 AB 1137", price: 799, deposit: 2000, kmLimit: 150, helmet: true, status: "Live" },
  { id: "L2", name: "Yamaha MT-15", mf: "Yamaha", cat: "Naked", cc: 155, fuel: "Petrol", trans: "Manual", year: "2023", reg: "MH12 AB 1028", price: 499, deposit: 1500, kmLimit: 120, helmet: true, status: "Live" },
  { id: "L3", name: "Suzuki Gixxer SF", mf: "Suzuki", cat: "Sports", cc: 155, fuel: "Petrol", trans: "Manual", year: "2024", reg: "MH12 AB 1070", price: 529, deposit: 1500, kmLimit: 120, helmet: true, status: "Pending approval" },
  { id: "L4", name: "Honda CB200X", mf: "Honda", cat: "Adventure", cc: 184, fuel: "Petrol", trans: "Manual", year: "2022", reg: "MH12 AB 0994", price: 559, deposit: 1500, kmLimit: 120, helmet: false, status: "Rejected", note: "Insurance certificate had expired. Re-upload a valid policy to resubmit.",
    needs: [{ k: "insurance", label: "Insurance policy", hint: "Current, unexpired policy document — the copy on file lapsed on 12 Mar 2026." }] },
  { id: "L5", name: "TVS Ntorq 125", mf: "TVS", cat: "Scooter", cc: 125, fuel: "Petrol", trans: "Automatic", year: "2024", reg: "MH12 AB 1181", price: 329, deposit: 0, kmLimit: 100, helmet: true, status: "Draft" },
];
