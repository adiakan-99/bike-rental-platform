namespace booking_service.Infrastructure.Clients
{
    public interface IBikeServiceClient
    {
        Task<InternalBikeDetailsDto?> GetBikeDetailsAsync(int bikeId);
    }
}
