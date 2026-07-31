package com.bikerental.customer_service.dto;

import com.bikerental.customer_service.enums.IdType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserKycRequestDto {

    @NotNull
    private LocalDate dateOfBirth;

    @NotNull
    private IdType idType;

    @NotBlank
    private String idNumber;

    @NotBlank
    private String idUploadUrl;

    private String drivingLicenseNumber;

    private String drivingLicenceUrl;

    private LocalDate licenseValidTo;
}