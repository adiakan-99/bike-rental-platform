package com.bikerental.bike_service.dto.request;

import com.bikerental.bike_service.enums.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BikeAdminReviewRequestDto {
    @NotNull(message = "Approval status is required (APPROVED or REJECTED)")
    private ApprovalStatus approvalStatus;

    private String adminRemarks;
}
