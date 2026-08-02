using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Booking.Api.Infrastructure.Persistence;

public class BookingDbContextFactory : IDesignTimeDbContextFactory<BookingDbContext>
{
    public BookingDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddUserSecrets<BookingDbContextFactory>()   // pulls BookingDb from your user secrets
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("BookingDb")
            ?? throw new InvalidOperationException("Connection string 'BookingDb' is not configured.");

        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new BookingDbContext(options);
    }
}