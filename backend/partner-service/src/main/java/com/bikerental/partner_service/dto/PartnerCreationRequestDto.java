package com.bikerental.partner_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PartnerCreationRequestDto {
    @NotBlank(message = "Seller type is required")
    @Pattern(regexp = "^(INDIVIDUAL|COMMERCIAL_DEALER)", message = "Seller type must be INDIVIDUAL or COMMERCIAL_DEALER")
    private String sellerType; // "INDIVIDUAL" or "COMMERCIAL_DEALER"

    private String ownerName;

    @Email(message = "alternate email must be a valid email address")
    private String alternateEmail;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian number")
    private String alternatePhoneNumber;

    @NotBlank(message = "PAN number is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN number format")
    private String panNumber;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian number")
    private String contactPhone;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String addressLine1;
    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pincode must be a valid 6-digit number")
    private String pincode;

    // Business specific fields (Null if INDIVIDUAL)
    private String businessName;
    private String tradeName;
    private String gstNumber;
    private String businessType;
    private String yearOfEstablishment;
    private String udyamNumber;
    private String signatoryName;
    private String signatoryDesignation;

    private String licenseNumber;

    private String issuingAuthority;

    private LocalDate licenseValidFrom;

    private LocalDate licenseValidTo;

    @NotNull(message = "Payout account details are required")
    @Valid
    private PartnerPayoutDto payoutAccount;

    // The list of MinIO document URLs (For Business Docs Only)
    private List<PartnerDocumentUploadDto> documents;
}