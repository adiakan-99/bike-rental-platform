package com.bikerental.partner_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PartnerAdminActionResponseDto {
    private Integer partnerId;
    private String actionTaken;     // e.g., "PROFILE_APPROVED", "ACCOUNT_BLOCKED"
    private String newApprovalStatus; // Current state of approval
    private String newAccountStatus;  // Current state of the account
    private String message;           // e.g., "Role successfully upgraded via Auth Service"
    private LocalDateTime timestamp;
}
