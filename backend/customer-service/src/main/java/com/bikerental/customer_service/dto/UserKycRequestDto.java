package com.bikerental.customer_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserKycRequestDto {

    private LocalDate dateOfBirth;

    private String idType;

    private String idNumber;

    private String idUploadUrl;

    private String drivingLicenseNumber;

    private String drivingLicenceUrl;

    private LocalDate licenseValidTo;
}