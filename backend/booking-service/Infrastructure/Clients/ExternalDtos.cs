namespace booking_service.Infrastructure.Clients
{
    public class CustomerKycStatusDto
    {
        public int CustomerId { get; set; }
        public string KycStatus { get; set; } = default!;
    }

    public class PaymentChargeRequestDto
    {
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal SecurityDepositAmount { get; set; }
        public decimal Currency { get; set; }
    }

    public class PaymentChargeResponseDto
    {
        public bool Success { get; set; }
        public string PaymentRef { get; set; } = default!;
        public string Status { get; set; } = default!;
        public string? FailureReason { get; set; }
    }
}
