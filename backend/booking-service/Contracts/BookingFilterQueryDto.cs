using Booking.Api.Domain.Enums;

namespace booking_service.Contracts
{
    public class BookingFilterQueryDto
    {
        public BookingStatus? Status { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
