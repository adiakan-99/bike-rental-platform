package com.bikerental.customer_service.dto;

import com.bikerental.customer_service.enums.KycStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class UserKycResponseDto {

    private Integer userId;

    private LocalDate dateOfBirth;

    private String idType;

    private String idNumber;

    private String idUploadUrl;

    private String drivingLicenseNumber;

    private String drivingLicenceUrl;

    private LocalDate licenseValidTo;

    private KycStatus kycStatus;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}