package com.bikerental.auth_service.entity;

import java.time.LocalDate;
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
@Table(name = "partner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Partner {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "partner_id")
	private Integer partnerId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "seller_type", nullable = false)
	private String sellerType;

	@Column(name = "owner_name", nullable = false)
	private String ownerName;

	@Column(name = "pan_number", nullable = false, length = 10)
	private String panNumber;

	@Column(name = "contact_phone")
	private String contactPhone;

	@Column(name = "alternate_email")
	private String alternateEmail;

	@Column(name = "alternate_phone_number")
	private String alternatePhoneNumber;

	@Column(name = "business_name")
	private String businessName;

	@Column(name = "gst_number")
	private String gstNumber;

	@Column(name = "business_type")
	private String businessType;

	@Column(name = "year_of_establishment", length = 4)
	private String yearOfEstablishment;

	@Column(name = "udyam_number")
	private String udyamNumber;

	@Column(name = "license_number")
	private String licenseNumber;

	@Column(name = "issuing_authority")
	private String issuingAuthority;

	@Column(name = "license_valid_from")
	private LocalDate licenseValidFrom;

	@Column(name = "license_valid_to")
	private LocalDate licenseValidTo;

	@Column(name = "address_line_1", nullable = false)
	private String addressLine1;

	@Column(name = "address_line_2")
	private String addressLine2;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false)
	private String state;

	@Column(nullable = false, length = 10)
	private String pincode;

	@Column(name = "approval_status", nullable = false)
	private String approvalStatus;

	@Column(name = "account_status", nullable = false)
	private String accountStatus;

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
