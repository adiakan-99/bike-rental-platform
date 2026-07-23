package com.bikerental.auth_service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customer_id")
	private Integer customerId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	private String gender;

	@Column(name = "phone_number", nullable = false, length = 15)
	private String phoneNumber;

	@Column(name = "driving_license_number", nullable = false)
	private String drivingLicenseNumber;

	@Column(name = "driving_licence_url", nullable = false)
	private String drivingLicenceUrl;

	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@Column(name = "id_type", nullable = false)
	private String idType;

	@Column(name = "id_number", nullable = false)
	private String idNumber;

	@Column(name = "id_upload_url", nullable = false)
	private String idUploadUrl;

	@Column(name = "address_line_1")
	private String addressLine1;

	@Column(name = "address_line_2")
	private String addressLine2;

	private String city;
	private String state;

	@Column(length = 10)
	private String pincode;

	@Column(name = "emergency_contact")
	private String emergencyContact;

	@Column(name = "referral_code")
	private String referralCode;

	@Column(name = "kyc_status", nullable = false)
	private String kycStatus;

	@Column(name = "joining_date", nullable = false)
	private LocalDateTime joiningDate;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "account_status", nullable = false)
	private String accountStatus;
}