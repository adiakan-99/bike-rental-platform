package com.bikerental.bike_service.dto.response;

import com.bikerental.bike_service.dto.request.BikeImageRequestDto;
import com.bikerental.bike_service.dto.request.InsuranceRequestDto;
import com.bikerental.bike_service.enums.ApprovalStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PendingBikeDto {
    private Integer bikeId;
    private Integer partnerId;
    private String registrationNumber;
    private String manufacturer;
    private String model;
    private String category;
    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private String rcUploadUrl;
    private String pucUploadUrl;
    private ApprovalStatus approvalStatus;
    private LocalDateTime createdAt;
    private LocalDate registrationExpiry;
    private LocalDate pucExpiry;
    private InsuranceRequestDto insurance;
    private List<BikeImageRequestDto> images;
}
