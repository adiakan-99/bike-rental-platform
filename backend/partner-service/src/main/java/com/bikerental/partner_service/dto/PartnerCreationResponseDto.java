package com.bikerental.partner_service.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * DTO for {@link com.bikerental.partner_service.entities.Partner}
 */
@Data
public class PartnerCreationResponseDto implements Serializable {
    private Integer partnerId;
    private String sellerType;
    private String approvalStatus;
}