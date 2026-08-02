// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function buildFare(bike, days, couponAmt = 0) {
  const rentalGross = bike.orig * days;
  const rentalNet = bike.price * days;
  const discount = rentalGross - rentalNet;
  const platform = 49, booking = 25, insurance = 79;
  const helmet = bike.helmet ? 0 : 40;
  const taxable = rentalNet + platform + booking + insurance + helmet - couponAmt;
  const gst = Math.max(0, Math.round(taxable * 0.18));
  const payNow = taxable + gst + bike.deposit;
  return { rentalGross, rentalNet, discount, platform, booking, insurance, helmet, delivery: 0, couponAmt, addonsTotal: 0, gst, deposit: bike.deposit, payNow };
}
