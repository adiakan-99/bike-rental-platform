package com.bikerental.partner_service.dto;

import lombok.Data;

@Data
public class PartnerPublicDto {
    private Integer partnerId;
    private String sellerType;
    private String city;
    private String state;

    // Business fields are generally safe to show publicly
    private String businessName;
    private String tradeName;
}
