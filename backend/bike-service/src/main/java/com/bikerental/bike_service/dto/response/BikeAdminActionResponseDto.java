package com.bikerental.bike_service.dto.response;

import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BikeAdminActionResponseDto {
    private Integer bikeId;
    private String registrationNumber;
    private ApprovalStatus approvalStatus;
    private BikeStatus bikeStatus;
    private Integer approvedBy;
    private LocalDateTime approvedAt;
    private String rejectionReason;
    private String message;
}
