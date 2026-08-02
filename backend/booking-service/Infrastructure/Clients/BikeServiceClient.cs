using System.Net.Http.Headers;

namespace booking_service.Infrastructure.Clients
{
    public class BikeServiceClient : IBikeServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BikeServiceClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<InternalBikeDetailsDto?> GetBikeDetailsAsync(int bikeId)
        {
            var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader))
            {
                _httpClient.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(authHeader);
            }

            var response = await _httpClient.GetAsync($"/api/v1/bikes/internal/{bikeId}");

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("Failed");
                return null;
            }

            Console.WriteLine("Succeeded");

            return await response.Content.ReadFromJsonAsync<InternalBikeDetailsDto>();
        }
    }
}
