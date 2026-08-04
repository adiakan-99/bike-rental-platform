package com.bikerental.customer_service.customer.DTO;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import com.bikerental.customer_service.enums.IdType;
import com.bikerental.customer_service.enums.KycStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerKycResponseDTO {

	private Integer customerId;

	private Integer userId;

	private LocalDate dateOfBirth;

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
	
	private String rejectionReason;
}