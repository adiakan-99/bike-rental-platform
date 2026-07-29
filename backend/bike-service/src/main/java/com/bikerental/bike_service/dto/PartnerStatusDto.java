package com.bikerental.bike_service.dto;

import lombok.Data;

@Data
public class PartnerStatusDto {
    int partnerId;
    String accountStatus;
    String approvalStatus;
}
