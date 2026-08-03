using booking_service.Contracts;

namespace booking_service.Domain
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(int userId, CreateBookingRequestDto request, string authHeader);
        Task<PagedResultDto<BookingResponseDto>> GetCustomerBookingsAsync(int userId, BookingFilterQueryDto query, string authHeader);
        Task<BookingResponseDto> GetBookingByIdAsync(int bookingId, int userId, string authHeader);
    }
}
