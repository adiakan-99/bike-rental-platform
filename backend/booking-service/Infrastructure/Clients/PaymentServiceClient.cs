using System.Net.Http.Headers;

namespace booking_service.Infrastructure.Clients
{
    public interface IPaymentServiceClient
    {
        Task<PaymentChargeResponseDto?> ChargeAsync(PaymentChargeRequestDto chargeRequest, string authHeader);
    }

    public class PaymentServiceClient : IPaymentServiceClient
    {
        private readonly HttpClient _httpClient;

        public PaymentServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<PaymentChargeResponseDto?> ChargeAsync(PaymentChargeRequestDto chargeRequest, string authHeader)
        {
            if (!string.IsNullOrEmpty(authHeader)) 
            {
                _httpClient.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
            }

            var response = await _httpClient.PostAsJsonAsync("/api/v1/payments/charge", chargeRequest);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<PaymentChargeResponseDto?>();
        }
    }
}
