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
@Table(name = "booking_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingTransactions {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_transaction_id")
	private Integer bookingTransactionId;

	@ManyToOne
	@JoinColumn(name = "booking_id", nullable = false)
	private BikeBookingDetails booking;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal amount;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "transaction_status", nullable = false)
	private String transactionStatus;

	@Column(name = "transaction_type", nullable = false)
	private String transactionType;
}