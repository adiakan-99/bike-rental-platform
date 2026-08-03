using Booking.Api.Domain.Enums;

namespace booking_service.Contracts
{
    public class BookingResponseDto
    {
        public int BookingId { get; set; }
        public string BookingRef { get; set; } = default!;
        public int CustomerId { get; set; }
        public int BikeId { get; set; }
        public int PartnerId { get; set; }
        public DateTime PickupDateTime { get; set; }
        public DateTime? ActualReturnTime { get; set; }
        public DateTime ScheduledReturnDateTime { get; set; }
        public BookingStatus BookingStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal SecurityDepositAmount { get; set; }
        public DepositStatus SecurityDepositStatus { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string PaymentRef { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public List<DepositDeductionDto> Deductions { get; set; } = new();
    }
}
