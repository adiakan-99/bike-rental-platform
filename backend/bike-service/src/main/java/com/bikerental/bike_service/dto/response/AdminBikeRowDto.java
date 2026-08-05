package com.bikerental.bike_service.dto.response;

import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminBikeRowDto {
    private Integer bikeId;
    private Integer partnerId;
    private String registrationNumber;
    private String manufacturer;
    private String model;
    private String category;
    private Integer engineCc;
    private String transmission;
    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private BikeStatus bikeStatus;
    private ApprovalStatus approvalStatus;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
}