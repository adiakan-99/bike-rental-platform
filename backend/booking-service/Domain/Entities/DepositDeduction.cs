using Booking.Api.Domain.Enums;

namespace Booking.Api.Domain.Entities;

public class DepositDeduction
{
    public int DeductionId { get; set; }        // deduction_id (serial PK)
    public int BookingId { get; set; }          // FK -> bike_booking_details (kept)

    public string Description { get; set; } = default!;
    public decimal Amount { get; set; }
    public string? DocumentUrl { get; set; }

    public int? RecordedBy { get; set; }        // user_id in auth-service (no FK)
    public DateTime CreatedAt { get; set; }

    public DeductionStatus Status { get; set; }

    // 48-hour dispute window fields
    public DateTime? DisputedAt { get; set; }
    public string? DisputeReason { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNote { get; set; }
    public int? ResolvedBy { get; set; }        // user_id in auth-service (no FK)

    public BikeBooking Booking { get; set; } = default!;   // navigation
}