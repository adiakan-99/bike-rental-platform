package com.bikerental.partner_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PartnerPayoutRequestDto {
    @NotBlank(message = "Account holder name is required")
    @Size(max = 150, message = "Name cannot exceed 150 characters")
    private String accountHolder;

    @NotBlank(message = "Account number is required")
    @Size(max = 30, message = "Account number cannot exceed 30 characters")
    @Pattern(regexp = "^[0-9]{9,18}$", message = "Invalid bank account number format")
    private String accountNumber;

    @NotBlank(message = "IFSC code is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code format (e.g., SBIN0001234)")
    private String ifsc;

    @Size(max = 100, message = "Bank name cannot exceed 100 characters")
    private String bankName;
}
