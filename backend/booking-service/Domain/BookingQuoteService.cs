using booking_service.Contracts;
using booking_service.Infrastructure.Clients;

namespace booking_service.Domain
{
    public class BookingQuoteService : IBookingQuoteService
    {
        private readonly IBikeServiceClient _bikeServiceClient;
        private const decimal StandardTaxRate = 18.00m;

        public BookingQuoteService (IBikeServiceClient bikeServiceClient)
        {
            this._bikeServiceClient = bikeServiceClient;
        }

        public async Task<QuoteResponseDto> CalculateQuoteAsync(QuoteRequestDto request)
        {
            if (request.ScheduledReturnDateTime <= request.PickUpDateTime)
            {
                throw new ArgumentException("Scheduled return time must be strictly after pickup time.");
            }

            var bikeDetails = await _bikeServiceClient.GetBikeDetailsAsync(request.BikeId);

            if (bikeDetails == null)
            {
                throw new KeyNotFoundException($"Bike with id: {request.BikeId} not found");
            }

            if (!bikeDetails.IsBookable)
            {
                throw new InvalidOperationException($"Bike with ID {request.BikeId} is currently not available to rent");
            } 

            TimeSpan duration = request.ScheduledReturnDateTime - request.PickUpDateTime;

            int totalHours = (int) Math.Ceiling(duration.TotalHours);

            if (totalHours <= 0) 
            {
                totalHours = 1;
            }

            decimal hourlyRate = bikeDetails.HourlyRate;
            decimal subTotal = totalHours * hourlyRate;
            decimal taxAmount = Math.Round(subTotal * (StandardTaxRate / 100m), 2);
            decimal totalAmount = subTotal + taxAmount;
            decimal totalPayableAmount = totalAmount + bikeDetails.SecurityDeposit;

            return new QuoteResponseDto
            {
                BikeId = request.BikeId,
                TotalHours = totalHours,
                HourlyRate = hourlyRate,
                SubTotal = subTotal,
                TaxRatePercentage = StandardTaxRate,
                TaxAmount = taxAmount,
                TotalAmount = totalAmount,
                SecurityDepositAmount = bikeDetails.SecurityDeposit,
                TotalPayableAmount = totalPayableAmount
            };
        }
    }
}
