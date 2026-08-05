// CHANGED: one line, but it prevents NaN across the whole booking flow.
//
// The original opened with `bike.orig * days`. Mock bikes always had an `orig`
// (a fake pre-discount price). Real API bikes do NOT — BikeCardDto has no list
// price, so `orig` is null. null * 3 is 0, discount becomes negative, and every
// downstream total renders as a wrong number or NaN.
//
// Falling back to `price` means: no list price => no discount => rentalGross
// equals rentalNet. That is the honest reading of "we don't know of a discount".
export function buildFare(bike, days, couponAmt = 0) {
  const price = Number(bike.price) || 0;
  const orig = Number(bike.orig) > 0 ? Number(bike.orig) : price;
  const deposit = Number(bike.deposit) || 0;

  const rentalGross = orig * days;
  const rentalNet = price * days;
  const discount = Math.max(0, rentalGross - rentalNet);

  const platform = 49, booking = 25, insurance = 79;
  // bike.helmet is null when unknown (the card DTO has no helmet flag). Treating
  // unknown as "not included" charges the ₹40 — the safe direction, since the
  // alternative is quoting a total that's ₹40 short of what's collected.
  const helmet = bike.helmet === true ? 0 : 40;

  const taxable = rentalNet + platform + booking + insurance + helmet - couponAmt;
  const gst = Math.max(0, Math.round(taxable * 0.18));
  const payNow = taxable + gst + deposit;

  return {
    rentalGross, rentalNet, discount, platform, booking, insurance, helmet,
    delivery: 0, couponAmt, addonsTotal: 0, gst, deposit, payNow,
  };
}
