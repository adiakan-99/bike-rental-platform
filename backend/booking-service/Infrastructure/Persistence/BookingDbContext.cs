using Booking.Api.Domain.Entities;
using Booking.Api.Domain.Enums;
using Booking.Api.Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Infrastructure.Persistence;

public class BookingDbContext : DbContext
{
    public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

    public DbSet<BikeBooking> Bookings => Set<BikeBooking>();
    public DbSet<DepositDeduction> Deductions => Set<DepositDeduction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureBikeBooking(modelBuilder);
        ConfigureDepositDeduction(modelBuilder);
    }

    private static void ConfigureBikeBooking(ModelBuilder modelBuilder)
    {
        var b = modelBuilder.Entity<BikeBooking>();

        b.ToTable("bike_booking_details");
        b.HasKey(x => x.BookingId);

        b.Property(x => x.BookingId).HasColumnName("booking_id").ValueGeneratedOnAdd();
        b.Property(x => x.BookingRef).HasColumnName("booking_ref").IsRequired();

        b.Property(x => x.CustomerId).HasColumnName("customer_id").IsRequired();
        b.Property(x => x.BikeId).HasColumnName("bike_id").IsRequired();
        b.Property(x => x.PartnerId).HasColumnName("partner_id").IsRequired();

        b.Property(x => x.PickupDateTime).HasColumnName("pickup_date_time")
            .HasColumnType("timestamp without time zone").IsRequired();
        b.Property(x => x.ScheduledReturnDateTime).HasColumnName("scheduled_return_date_time")
            .HasColumnType("timestamp without time zone").IsRequired();
        b.Property(x => x.ActualReturnTime).HasColumnName("actual_return_time")
            .HasColumnType("timestamp without time zone");

        b.Property(x => x.BookingStatus).HasColumnName("booking_status").IsRequired()
            .HasConversion(new ScreamingSnakeEnumConverter<BookingStatus>());

        b.Property(x => x.TotalAmount).HasColumnName("total_amount")
            .HasColumnType("numeric(10,2)").IsRequired();

        b.Property(x => x.SecurityDepositAmount).HasColumnName("security_deposit_amount")
            .HasColumnType("numeric(10,2)");
        b.Property(x => x.SecurityDepositStatus).HasColumnName("security_deposit_status")
            .HasConversion(new ScreamingSnakeEnumConverter<DepositStatus>());

        b.Property(x => x.PaymentStatus).HasColumnName("payment_status").IsRequired()
            .HasConversion(new ScreamingSnakeEnumConverter<PaymentStatus>());
        b.Property(x => x.PaymentRef).HasColumnName("payment_ref");

        b.Property(x => x.CancelledAt).HasColumnName("cancelled_at")
            .HasColumnType("timestamp without time zone");
        b.Property(x => x.CancelReason).HasColumnName("cancel_reason");
        b.Property(x => x.CancellationPenalty).HasColumnName("cancellation_penalty")
            .HasColumnType("numeric(10,2)");
        b.Property(x => x.RefundAmount).HasColumnName("refund_amount")
            .HasColumnType("numeric(10,2)");

        b.Property(x => x.CreatedAt).HasColumnName("created_at")
            .HasColumnType("timestamp without time zone").IsRequired()
            .HasDefaultValueSql("now()");                       // small addition (schema had no default)
        b.Property(x => x.UpdatedAt).HasColumnName("updated_at")
            .HasColumnType("timestamp without time zone");
        b.Property(x => x.SettlementDueAt).HasColumnName("settlement_due_at")
            .HasColumnType("timestamp without time zone");
        b.Property(x => x.SettledAt).HasColumnName("settled_at")
            .HasColumnType("timestamp without time zone");

        b.HasIndex(x => x.CustomerId).HasDatabaseName("booking_customer_idx");
        b.HasIndex(x => x.PartnerId).HasDatabaseName("booking_partner_idx");
        b.HasIndex(x => x.SecurityDepositStatus).HasDatabaseName("booking_deposit_status_idx");


        b.HasMany(x => x.Deductions)
            .WithOne(d => d.Booking)
            .HasForeignKey(d => d.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureDepositDeduction(ModelBuilder modelBuilder)
    {
        var d = modelBuilder.Entity<DepositDeduction>();

        d.ToTable("deposit_deduction");
        d.HasKey(x => x.DeductionId);

        d.Property(x => x.DeductionId).HasColumnName("deduction_id").ValueGeneratedOnAdd();
        d.Property(x => x.BookingId).HasColumnName("booking_id").IsRequired();

        d.Property(x => x.Description).HasColumnName("description").IsRequired();
        d.Property(x => x.Amount).HasColumnName("amount")
            .HasColumnType("numeric(10,2)").IsRequired();
        d.Property(x => x.DocumentUrl).HasColumnName("document_url");

        d.Property(x => x.RecordedBy).HasColumnName("recorded_by");
        d.Property(x => x.CreatedAt).HasColumnName("created_at")
            .HasColumnType("timestamp without time zone").IsRequired()
            .HasDefaultValueSql("now()");

        d.Property(x => x.Status).HasColumnName("status").IsRequired()
            .HasConversion(new ScreamingSnakeEnumConverter<DeductionStatus>());

        d.Property(x => x.DisputedAt).HasColumnName("disputed_at")
            .HasColumnType("timestamp without time zone");
        d.Property(x => x.DisputeReason).HasColumnName("dispute_reason");
        d.Property(x => x.ResolvedAt).HasColumnName("resolved_at")
            .HasColumnType("timestamp without time zone");
        d.Property(x => x.ResolutionNote).HasColumnName("resolution_note");
        d.Property(x => x.ResolvedBy).HasColumnName("resolved_by");

        d.HasIndex(x => x.BookingId).HasDatabaseName("deduction_booking_idx");
        d.HasIndex(x => x.Status).HasDatabaseName("deduction_status_idx");
    }
}