using Booking.Api.Domain.Entities;
using Booking.Api.Domain.Enums;
using Booking.Api.Infrastructure.Persistence;
using booking_service.Contracts;
using booking_service.Infrastructure.Clients;
using Microsoft.EntityFrameworkCore;

namespace booking_service.Domain
{
    public class BookingService : IBookingService
    {
        private readonly BookingDbContext _dbContext;
        private readonly IBikeServiceClient _bikeServiceClient;
        private readonly ICustomerServiceClient _customerServiceClient;
        private readonly IPaymentServiceClient _paymentServiceClient;
        private readonly IBookingQuoteService _quoteService;

        public BookingService(
            BookingDbContext dbContext, 
            IBikeServiceClient bikeServiceClient, 
            ICustomerServiceClient customerServiceClient, 
            IPaymentServiceClient paymentServiceClient,
            IBookingQuoteService quoteService)
        {
            _dbContext = dbContext;
            _bikeServiceClient = bikeServiceClient;
            _customerServiceClient = customerServiceClient;
            _paymentServiceClient = paymentServiceClient;
            _quoteService = quoteService;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(int userId, CreateBookingRequestDto request, string authHeader)
        {
            var kycInfo = await _customerServiceClient.GetCustomerKycStatusAsync(userId, authHeader);

            if (kycInfo == null || !string.Equals(kycInfo.KycStatus, "VERIFIED", StringComparison.OrdinalIgnoreCase)) 
            {
                throw new UnauthorizedAccessException("Customer KYC is not verifed. Unavailable to book bikes");
            }

            bool hasOverlap = await _dbContext.Bookings.AnyAsync(b =>
                b.BikeId == request.BikeId &&
                b.BookingStatus != BookingStatus.Cancelled &&
                b.PickupDateTime < request.ScheduledReturnDateTime &&
                b.ScheduledReturnDateTime > request.PickupDateTime
            );

            if (hasOverlap)
            {
                throw new InvalidOperationException("The requested bike is already reserved");
            }

            var bikeDetails = await _bikeServiceClient.GetBikeDetailsAsync(request.BikeId);

            if (bikeDetails == null || !bikeDetails.IsBookable)
            {
                throw new KeyNotFoundException($"Bike with ID {request.BikeId} is either invalid or currently unavailable");
            }

            var quote = await _quoteService.CalculateQuoteAsync(new QuoteRequestDto
            {
                BikeId = request.BikeId,
                PickUpDateTime = request.PickupDateTime,
                ScheduledReturnDateTime = request.ScheduledReturnDateTime
            });


            var chargeRequest = new PaymentChargeRequestDto
            {
                CustomerId = kycInfo.CustomerId,
                TotalAmount = quote.TotalAmount,
                SecurityDepositAmount = quote.SecurityDepositAmount,
            };

            var paymentResponse = await _paymentServiceClient.ChargeAsync(chargeRequest, authHeader);

            if (paymentResponse == null || !paymentResponse.Success)
            {
                throw new Exception($"Payment Transaction failed: {paymentResponse?.FailureReason}");
            }

            var booking = new BikeBooking
            {
                BookingRef = $"BK-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
                CustomerId = kycInfo.CustomerId,
                BikeId = request.BikeId,
                PartnerId = bikeDetails.PartnerId,
                PickupDateTime = request.PickupDateTime,
                ScheduledReturnDateTime = request.ScheduledReturnDateTime,
                BookingStatus = BookingStatus.Reserved,
                TotalAmount = quote.TotalAmount,
                SecurityDepositAmount = quote.SecurityDepositAmount,
                SecurityDepositStatus = DepositStatus.Held,
                PaymentStatus = PaymentStatus.Paid,
                PaymentRef = paymentResponse.PaymentRef,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Add(booking);
            await _dbContext.SaveChangesAsync();

            return new BookingResponseDto
            {
                BookingId = booking.BookingId,
                BookingRef = booking.BookingRef,
                CustomerId = booking.CustomerId,
                PartnerId = booking.PartnerId,
                PickupDateTime = booking.PickupDateTime,
                ScheduledReturnDateTime = booking.ScheduledReturnDateTime,
                BookingStatus = booking.BookingStatus,
                TotalAmount = quote.TotalAmount,
                SecurityDepositAmount = booking.SecurityDepositAmount.Value,
                SecurityDepositStatus = booking.SecurityDepositStatus.Value,
                PaymentStatus = booking.PaymentStatus,
                CreatedAt = DateTime.UtcNow
            };
        }

        public async Task<PagedResultDto<BookingResponseDto>> GetCustomerBookingsAsync(int userId, BookingFilterQueryDto query, string authHeader)
        {
            var customer = await _customerServiceClient.GetCustomerKycStatusAsync(userId, authHeader);

            if (customer == null) 
            {
                throw new KeyNotFoundException($"No customer profile associated with User ID: {userId}");
            }

            var dbQuery = _dbContext.Bookings
                .AsNoTracking()
                .Where(b => b.CustomerId == customer.CustomerId);

            if (query.Status.HasValue)
            {
                dbQuery = dbQuery.Where(b => b.BookingStatus  == query.Status.Value);
            }

            int totalItems = await dbQuery.CountAsync();

            var bookings = await dbQuery
                .OrderByDescending(b => b.CreatedAt)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(b => new BookingResponseDto
                {
                    BookingId = b.BookingId,
                    BookingRef = b.BookingRef,
                    CustomerId = b.CustomerId,
                    BikeId = b.BikeId,
                    PartnerId = b.PartnerId,
                    PickupDateTime = b.PickupDateTime,
                    ScheduledReturnDateTime = b.ScheduledReturnDateTime,
                    BookingStatus = b.BookingStatus,
                    TotalAmount = b.TotalAmount,
                    SecurityDepositAmount = b.SecurityDepositAmount ?? 0,
                    SecurityDepositStatus = b.SecurityDepositStatus ?? DepositStatus.Held,
                    PaymentStatus = b.PaymentStatus,
                    PaymentRef = b.PaymentRef ?? string.Empty,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return new PagedResultDto<BookingResponseDto>
            {
                Items = bookings,
                TotalItems = totalItems,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
            };
        }
    }
}
