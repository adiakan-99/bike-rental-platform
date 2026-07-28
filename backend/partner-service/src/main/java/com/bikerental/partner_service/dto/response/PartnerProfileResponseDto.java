package com.bikerental.partner_service.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class PartnerProfileResponseDto {
    // --- Core Identifiers ---
    private Integer partnerId;
    private Integer userId;
    private String sellerType;

    // --- General Contact & Owner Details ---
    private String ownerName;
    private String contactPhone;
    private String alternateEmail;
    private String alternatePhoneNumber;

    // --- Address Details ---
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;

    // --- Business & Commercial Details ---
    private String businessName;
    private String tradeName;
    private String gstNumber;
    private String businessType;
    private String yearOfEstablishment;
    private String udyamNumber;
    private String panNumber;

    // --- License & Authorization Details ---
    private String signatoryName;
    private String signatoryDesignation;
    private String licenseNumber;
    private String issuingAuthority;
    private LocalDate licenseValidFrom;
    private LocalDate licenseValidTo;

    // --- Account Status & Lifecycle ---
    private String approvalStatus;
    private String accountStatus;
    private OffsetDateTime approvedAt;
    private Integer approvedBy;
    private String rejectionReason;

    // --- Audit Timestamps ---
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    // --- Nested Relations & Payouts ---
    private PartnerPayoutDto payoutAccount;
    private List<PartnerDocumentDto> documents;
}
