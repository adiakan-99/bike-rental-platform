package com.bikerental.admin_service.admin.DTO;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import com.bikerental.admin_service.enums.IdType;
import com.bikerental.admin_service.enums.KycStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminKycResponseDTO {

	private Integer customerId;

	private Integer userId;
	
	private String email;
	
	private String phoneNumber;

	private LocalDate dateOfBirth;

	private String firstName;

	private String lastName;

	private IdType idType;

	private String idNumber;

	private String idUploadUrl;

	private String drivingLicenseNumber;

	private String drivingLicenseUrl;

	private LocalDate licenseValidTo;

	private KycStatus kycStatus;

	private OffsetDateTime verifiedAt;

	private OffsetDateTime createdAt;

	private OffsetDateTime updatedAt;

	private Integer verifiedBy;

	private String rejectionReason;
}
