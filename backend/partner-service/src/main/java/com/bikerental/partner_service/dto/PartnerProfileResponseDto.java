package com.bikerental.partner_service.dto;

import lombok.Data;

@Data
public class PartnerProfileResponseDto {
    private Integer partnerId;
    private String sellerType;
    private String addressLine1;
    private String city;
    private String state;
    private String pincode;
    private String approvalStatus;
    private String accountStatus;

    // Business fields
    private String businessName;
    private String gstNumber;

    // Nested Payout Details
    private PartnerPayoutDto payoutAccount;
}
