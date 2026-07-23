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
@Table(name = "deposit_deduction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepositDeduction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "deduction_id")
	private Integer deductionId;

	@ManyToOne
	@JoinColumn(name = "booking_id", nullable = false)
	private BikeBookingDetails booking;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal amount;

	@Column(name = "document_url")
	private String documentUrl;

	@ManyToOne
	@JoinColumn(name = "recorded_by")
	private User recordedBy;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private String status;

	@Column(name = "disputed_at")
	private LocalDateTime disputedAt;

	@Column(name = "dispute_reason")
	private String disputeReason;

	@Column(name = "resolved_at")
	private LocalDateTime resolvedAt;

	@Column(name = "resolution_note")
	private String resolutionNote;

	@ManyToOne
	@JoinColumn(name = "resolved_by")
	private User resolvedBy;
}