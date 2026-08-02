using Booking.Api.Domain.Enums;

namespace Booking.Api.Domain.Entities;

public class BikeBooking
{
    public int BookingId { get; set; }                  // booking_id (serial PK)
    public string BookingRef { get; set; } = default!;

    // Cross-service IDs — plain values, no FK (validated via service calls)
    public int CustomerId { get; set; }
    public int BikeId { get; set; }
    public int PartnerId { get; set; }

    public DateTime PickupDateTime { get; set; }
    public DateTime ScheduledReturnDateTime { get; set; }
    public DateTime? ActualReturnTime { get; set; }

    public BookingStatus BookingStatus { get; set; }
    public decimal TotalAmount { get; set; }

    public decimal? SecurityDepositAmount { get; set; }
    public DepositStatus? SecurityDepositStatus { get; set; }   // nullable in schema

    public PaymentStatus PaymentStatus { get; set; }
    public string? PaymentRef { get; set; }

    public DateTime? CancelledAt { get; set; }
    public string? CancelReason { get; set; }
    public decimal? CancellationPenalty { get; set; }
    public decimal? RefundAmount { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? SettlementDueAt { get; set; }
    public DateTime? SettledAt { get; set; }

    // Owned child table (intra-DB FK kept)
    public List<DepositDeduction> Deductions { get; set; } = new();
}