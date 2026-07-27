package com.bikerental.partner_service.dto;

import lombok.Data;

@Data
public class PartnerStatusResponseDto {
    int partnerId;
    String accountStatus;
    String approvalStatus;
}
