package com.bikerental.partner_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PartnerUpdateRequestDto {


    @Size(max = 150, message = "Owner name cannot exceed 150 characters")
    private String ownerName;

    @Size(max = 20, message = "Contact phone cannot exceed 20 characters")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Invalid phone number format")
    private String contactPhone;

    @Size(max = 255, message = "Alternate email cannot exceed 255 characters")
    @Email(message = "Invalid email format")
    private String alternateEmail;

    @Size(max = 20, message = "Alternate phone number cannot exceed 20 characters")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Invalid phone number format")
    private String alternatePhoneNumber;


    @Size(max = 255, message = "Address line 1 cannot exceed 255 characters")
    private String addressLine1;

    @Size(max = 255, message = "Address line 2 cannot exceed 255 characters")
    private String addressLine2;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State cannot exceed 100 characters")
    private String state;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
    private String pincode;


    @Size(max = 200, message = "Business name cannot exceed 200 characters")
    private String businessName;

    @Size(max = 200, message = "Trade name cannot exceed 200 characters")
    private String tradeName;

    @Size(max = 50, message = "Business type cannot exceed 50 characters")
    private String businessType;

    @Pattern(regexp = "^(19|20)\\d{2}$", message = "Year of establishment must be a valid 4-digit year")
    private String yearOfEstablishment;


    @Size(max = 150, message = "Signatory name cannot exceed 150 characters")
    private String signatoryName;

    @Size(max = 100, message = "Signatory designation cannot exceed 100 characters")
    private String signatoryDesignation;

    @Size(max = 100, message = "License number cannot exceed 100 characters")
    private String licenseNumber;

    @Size(max = 150, message = "Issuing authority cannot exceed 150 characters")
    private String issuingAuthority;

    private LocalDate licenseValidFrom;
    private LocalDate licenseValidTo;

    @Pattern(regexp = "^([A-Z]{5}[0-9]{4}[A-Z]{1})?$", message = "Invalid PAN format")
    private String panNumber;

    @Pattern(regexp = "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$", message = "Invalid GST format")
    private String gstNumber;

    @Size(max = 50, message = "Udyam number cannot exceed 50 characters")
    private String udyamNumber;
}