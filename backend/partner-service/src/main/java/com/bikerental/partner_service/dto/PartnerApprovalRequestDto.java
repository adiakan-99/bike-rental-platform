package com.bikerental.partner_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PartnerApprovalRequestDto {

    @NotBlank(message = "Approval status cannot be blank")
    @Pattern(regexp = "^(APPROVED|REJECTED)$", message = "Status must be exactly APPROVED or REJECTED")
    private String approvalStatus;

    private String adminRemarks;
}
