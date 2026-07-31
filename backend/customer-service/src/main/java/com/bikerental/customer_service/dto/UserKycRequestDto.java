package com.bikerental.customer_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserKycRequestDto {

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String idType;

    @NotBlank
    private String idNumber;

    @NotBlank
    private String idUploadUrl;

    private String drivingLicenseNumber;

    private String drivingLicenceUrl;

    private LocalDate licenseValidTo;
}