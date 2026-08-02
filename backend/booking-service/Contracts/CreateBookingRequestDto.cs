namespace booking_service.Contracts
{
    public class CreateBookingRequestDto
    {
        public int BikeId { get; set; }
        public DateTime PickupDateTime { get; set; }
        public DateTime ScheduledReturnDateTime { get; set; }
    }
}
