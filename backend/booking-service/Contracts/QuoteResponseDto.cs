namespace booking_service.Contracts
{
    public record QuoteResponseDto
    {
        public int BikeId {  get; set; }
        public int TotalHours { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxRatePercentage { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal SecurityDepositAmount { get; set; }
        public decimal TotalPayableAmount { get; set; }
    }
}
