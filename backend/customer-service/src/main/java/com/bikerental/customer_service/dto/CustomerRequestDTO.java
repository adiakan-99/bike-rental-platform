package com.bikerental.customer_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequestDTO {

    @NotBlank(message = "Address Line 1 is required")
    @Size(max = 255, message = "Address Line 1 cannot exceed 255 characters")
    private String addressLine1;

    @Size(max = 255)
    private String addressLine2;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "\\d{6}", message = "Pincode must contain exactly 6 digits")
    private String pincode;

    @Pattern(
            regexp = "^$|\\d{10}",
            message = "Emergency contact must be 10 digits"
    )
    private String emergencyContact;

    private String referralCode;
}