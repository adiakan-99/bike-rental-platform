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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bike")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bike {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bike_id")
	private Integer bikeId;

	@ManyToOne
	@JoinColumn(name = "partner_id", nullable = false)
	private Partner partner;

	@Column(name = "registration_number", nullable = false)
	private String registrationNumber;

	@Column(name = "rc_upload_url", nullable = false)
	private String rcUploadUrl;

	@Column(name = "puc_upload_url", nullable = false)
	private String pucUploadUrl;

	@Column(nullable = false)
	private String manufacturer;

	@Column(nullable = false)
	private String model;

	@Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
	private BigDecimal hourlyRate;

	@Column(name = "security_deposit", precision = 10, scale = 2)
	private BigDecimal securityDeposit;

	@OneToOne
	@JoinColumn(name = "insurance_id", nullable = false)
	private Insurance insurance;

	@Column(name = "bike_status", nullable = false)
	private String bikeStatus;

	@Column(name = "additional_services", columnDefinition = "jsonb")
	private String additionalServices;

	@Column(name = "approval_status", nullable = false)
	private String approvalStatus;

	@ManyToOne
	@JoinColumn(name = "approved_by")
	private User approvedBy;

	@Column(name = "approved_at")
	private LocalDateTime approvedAt;

	@Column(name = "rejection_reason")
	private String rejectionReason;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;
}