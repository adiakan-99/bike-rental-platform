package com.bikerental.customer_service.entity;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.bikerental.customer_service.enums.IdType;
import com.bikerental.customer_service.enums.KycStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customer_kyc")
@Getter
@Setter
public class CustomerKyc {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "kyc_id")
	private Integer kycId;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "customer_id", nullable = false, unique = true)
	private Customer customer;

	@NotNull(message = "Date of birth is required")
	@Past(message = "Date of birth must be in the past")
	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "ID type is required")
	private IdType idType;

	@NotBlank(message = "ID number is required")
	@Size(max = 50, message = "ID number cannot exceed 50 characters")
	private String idNumber;

	@NotBlank(message = "Upload URL is required")
	@Size(max = 500, message = "URL cannot exceed 500 characters")
	private String idUploadUrl;

	@Size(max = 50, message = "Driving license number cannot exceed 50 characters")
	private String drivingLicenseNumber;

	@Size(max = 500, message = "Driving license URL cannot exceed 500 characters")
	private String drivingLicenseUrl;

	@Future(message = "License expiration date must be in the future")
	private LocalDate licenseValidTo;

	@Enumerated(EnumType.STRING)
	@Column(name = "kyc_status", nullable = false, length = 20)
	private KycStatus kycStatus = KycStatus.PENDING;

	@Column(name = "verified_by")
	private Integer verifiedBy;

	@Column(name = "verified_at")
	private OffsetDateTime verifiedAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private OffsetDateTime updatedAt;
}