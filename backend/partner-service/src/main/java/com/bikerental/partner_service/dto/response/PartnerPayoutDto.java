package com.bikerental.partner_service.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PartnerPayoutDto {
    @NotBlank(message = "Account holder needs to be mentioned")
    @Size(min = 2, max = 100, message = "Account holder name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9.,&\\-\\s]+$", message = "Account holder name contains invalid characters")
    private String accountHolder;

    @NotBlank(message = "Account number needs to be mentioned")
    @Pattern(regexp = "^\\d{9,18}$", message = "Account number must be between 9 and 18 digits")
    private String accountNumber;

    @NotBlank(message = "IFSC code needs to be mentioned")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code format")
    private String ifsc;

    @Size(min = 2, max = 100, message = "Bank name must be between 2 and 100 characters")
    private String bankName;
}
