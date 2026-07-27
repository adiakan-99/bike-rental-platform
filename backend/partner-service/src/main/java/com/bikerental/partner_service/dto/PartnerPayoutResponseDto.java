package com.bikerental.partner_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class PartnerPayoutResponseDto {
    private Integer id;
    private String maskedAccountNumber;
    private String accountName;
    private String ifsc;
    private String bankName;
}
