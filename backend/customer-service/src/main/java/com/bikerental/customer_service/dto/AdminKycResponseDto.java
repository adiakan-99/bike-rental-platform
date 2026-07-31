package com.bikerental.customer_service.dto;

import com.bikerental.customer_service.enums.IdType;
import com.bikerental.customer_service.enums.KycStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
public class AdminKycResponseDto {

    private Integer userId;

    private String firstName;

    private String lastName;

    private String email;

    private LocalDate dateOfBirth;

    private IdType idType;

    private String idNumber;

    private String idUploadUrl;

    private String drivingLicenseNumber;

    private String drivingLicenceUrl;

    private LocalDate licenseValidTo;

    private KycStatus kycStatus;

    private Integer verifiedBy;

    private OffsetDateTime verifiedAt;

    private OffsetDateTime createdAt;
}