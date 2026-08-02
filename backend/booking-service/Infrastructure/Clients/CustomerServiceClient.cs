using System.Net.Http.Headers;

namespace booking_service.Infrastructure.Clients
{
    public interface ICustomerServiceClient
    {
        Task<CustomerKycStatusDto?> GetCustomerKycStatusAsync(int userId, string authHeader);
    }

    public class CustomerServiceClient : ICustomerServiceClient
    {
        private readonly HttpClient _httpClient;

        public CustomerServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<CustomerKycStatusDto?> GetCustomerKycStatusAsync(int userId, string authHeader)
        {
            if (!string.IsNullOrEmpty(authHeader))
            {
                _httpClient.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
            }

            var response = await _httpClient.GetAsync($"/api/v1/customers/{userId}/kyc-status");

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<CustomerKycStatusDto>();
        }
    }
}
