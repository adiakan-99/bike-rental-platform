package com.bikerental.auth_service.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bike_booking_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BikeBookingDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_id")
	private Integer bookingId;

	@Column(name = "booking_ref", nullable = false)
	private String bookingRef;

	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false)
	private Customer customer;

	@ManyToOne
	@JoinColumn(name = "bike_id", nullable = false)
	private Bike bike;

	@ManyToOne
	@JoinColumn(name = "partner_id", nullable = false)
	private Partner partner;

	@Column(name = "pickup_date_time", nullable = false)
	private LocalDateTime pickupDateTime;

	@Column(name = "scheduled_return_date_time", nullable = false)
	private LocalDateTime scheduledReturnDateTime;

	@Column(name = "booking_status", nullable = false)
	private String bookingStatus;

	@Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
	private BigDecimal totalAmount;

	@Column(name = "security_deposit_amount", precision = 10, scale = 2)
	private BigDecimal securityDepositAmount;

	@Column(name = "security_deposit_status")
	private String securityDepositStatus;

	@Column(name = "actual_return_time")
	private LocalDateTime actualReturnTime;

	@Column(name = "payment_status", nullable = false)
	private String paymentStatus;

	@Column(name = "payment_ref")
	private String paymentRef;

	@Column(name = "cancelled_at")
	private LocalDateTime cancelledAt;

	@Column(name = "cancel_reason")
	private String cancelReason;

	@Column(name = "cancellation_penalty", precision = 10, scale = 2)
	private BigDecimal cancellationPenalty;

	@Column(name = "refund_amount", precision = 10, scale = 2)
	private BigDecimal refundAmount;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "settlement_due_at")
	private LocalDateTime settlementDueAt;

	@Column(name = "settled_at")
	private LocalDateTime settledAt;
}