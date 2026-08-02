using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace booking_service.Migrations
{
    /// <inheritdoc />
    public partial class InitialBookingSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bike_booking_details",
                columns: table => new
                {
                    booking_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    booking_ref = table.Column<string>(type: "text", nullable: false),
                    customer_id = table.Column<int>(type: "integer", nullable: false),
                    bike_id = table.Column<int>(type: "integer", nullable: false),
                    partner_id = table.Column<int>(type: "integer", nullable: false),
                    pickup_date_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    scheduled_return_date_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    actual_return_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    booking_status = table.Column<string>(type: "text", nullable: false),
                    total_amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    security_deposit_amount = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    security_deposit_status = table.Column<string>(type: "text", nullable: true),
                    payment_status = table.Column<string>(type: "text", nullable: false),
                    payment_ref = table.Column<string>(type: "text", nullable: true),
                    cancelled_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    cancel_reason = table.Column<string>(type: "text", nullable: true),
                    cancellation_penalty = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    refund_amount = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "now()"),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    settlement_due_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    settled_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bike_booking_details", x => x.booking_id);
                });

            migrationBuilder.CreateTable(
                name: "deposit_deduction",
                columns: table => new
                {
                    deduction_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    booking_id = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    document_url = table.Column<string>(type: "text", nullable: true),
                    recorded_by = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "now()"),
                    status = table.Column<string>(type: "text", nullable: false),
                    disputed_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    dispute_reason = table.Column<string>(type: "text", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    resolution_note = table.Column<string>(type: "text", nullable: true),
                    resolved_by = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deposit_deduction", x => x.deduction_id);
                    table.ForeignKey(
                        name: "FK_deposit_deduction_bike_booking_details_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bike_booking_details",
                        principalColumn: "booking_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "booking_customer_idx",
                table: "bike_booking_details",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "booking_deposit_status_idx",
                table: "bike_booking_details",
                column: "security_deposit_status");

            migrationBuilder.CreateIndex(
                name: "booking_partner_idx",
                table: "bike_booking_details",
                column: "partner_id");

            migrationBuilder.CreateIndex(
                name: "deduction_booking_idx",
                table: "deposit_deduction",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "deduction_status_idx",
                table: "deposit_deduction",
                column: "status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "deposit_deduction");

            migrationBuilder.DropTable(
                name: "bike_booking_details");
        }
    }
}
