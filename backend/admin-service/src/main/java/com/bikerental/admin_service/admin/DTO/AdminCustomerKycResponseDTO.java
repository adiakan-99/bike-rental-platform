package com.bikerental.admin_service.admin.DTO;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import com.bikerental.admin_service.enums.IdType;
import com.bikerental.admin_service.enums.KycStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCustomerKycResponseDTO {

	private Integer userId;

	private Integer customerId;

	
	private LocalDate dateOfBirth;

	private IdType idType;

	private String idNumber;

	private String idUploadUrl;

	private String drivingLicenseNumber;

	private String drivingLicenseUrl;

	private LocalDate licenseValidTo;

	private KycStatus kycStatus;

	private OffsetDateTime submittedAt;

	private OffsetDateTime verifiedAt;

	private Integer verifiedBy;

	private String rejectionReason;
}
