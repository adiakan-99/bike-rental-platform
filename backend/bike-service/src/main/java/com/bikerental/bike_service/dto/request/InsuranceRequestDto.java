package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InsuranceRequestDto {
    @NotBlank(message = "Insurance number is required")
    private String insuranceNumber;

    @NotBlank(message = "Policy provider is required")
    private String policyProvider;

    @NotBlank(message = "Policy holder name is required")
    private String policyHolderName;

    @NotNull(message = "Insurance expiry date is required")
    private LocalDate expiryDate;
}
