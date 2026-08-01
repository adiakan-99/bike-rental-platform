namespace booking_service.Contracts
{
    public class QuoteRequestDto
    {
        public int BikeId { get; set; }
        public DateTime PickUpDateTime { get; set; }
        public DateTime ScheduledReturnDateTime { get; set; }
    }
}
