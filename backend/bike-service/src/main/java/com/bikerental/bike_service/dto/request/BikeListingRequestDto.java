package com.bikerental.bike_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class BikeListingRequestDto {
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "RC upload URL is required")
    private String rcUploadUrl;

    @NotBlank(message = "PUC upload URL is required")
    private String pucUploadUrl;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0")
    private BigDecimal hourlyRate;

    private BigDecimal securityDeposit;

    @NotNull(message = "Registration expiry date is required")
    private LocalDate registrationExpiry;

    @NotNull(message = "PUC expiry date is required")
    private LocalDate pucExpiry;

    @NotNull(message = "Insurance details are required")
    @Valid
    private InsuranceRequestDto insurance;

    @NotNull(message = "Bike specifications are required")
    @Valid
    private BikeDetailsRequestDto bikeDetails;

    @NotEmpty(message = "At least one image of the bike must be provided")
    @Valid
    private List<BikeImageRequestDto> images;

    private Map<String, Object> additionalServices;
}
