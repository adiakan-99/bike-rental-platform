package com.bikerental.partner_service.dto;

import jakarta.validation.constraints.NotBlank;

public class PartnerBlockRequestDto {
    @NotBlank(message = "You must provide a reason for blocking this partner")
    private String blockReason;
}
