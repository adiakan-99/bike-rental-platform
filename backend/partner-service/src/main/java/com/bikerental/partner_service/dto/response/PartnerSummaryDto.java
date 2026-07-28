package com.bikerental.partner_service.dto.response;

import lombok.Data;

@Data
public class PartnerSummaryDto {
    private Integer partnerId;
    private Integer userId;
    private String sellerType;
    private String city;
    private String state;
    private String approvalStatus;
    private String accountStatus;

    private String businessName;
    private String ownerName;
}
