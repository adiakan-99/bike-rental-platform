namespace booking_service.Infrastructure.Clients
{
    public class InternalBikeDetailsDto
    {
        public int BikeId { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal SecurityDeposit { get; set; }
        public int PartnerId { get; set; }
        public string BikeStatus { get; set; } = default!;
        public string ApprovalStatus { get; set; } = default!;
        public bool IsBookable { get; set; }
    }
}
