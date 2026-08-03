using Booking.Api.Domain.Enums;

namespace booking_service.Contracts
{
    public class DepositDeductionDto
    {
        public int DeductionId { get; set; }
        public int BookingId { get; set; }
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public string? DocumentUrl { get; set; }
        public int? RecordedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DeductionStatus Status { get; set; }
        public DateTime? DisputedAt { get; set; }
        public string? DisputeReason { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? ResolutionNote { get; set; }
        public int? ResolvedBy { get; set; }
    }
}
