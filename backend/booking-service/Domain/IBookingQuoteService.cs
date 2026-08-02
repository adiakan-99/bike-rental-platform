using booking_service.Contracts;

namespace booking_service.Domain
{
    public interface IBookingQuoteService
    {
        Task<QuoteResponseDto> CalculateQuoteAsync(QuoteRequestDto request);
    }
}
