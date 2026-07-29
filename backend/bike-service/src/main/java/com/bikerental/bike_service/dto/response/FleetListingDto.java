package com.bikerental.bike_service.dto.response;

import com.bikerental.bike_service.dto.request.BikeDetailsRequestDto;
import com.bikerental.bike_service.dto.request.BikeImageRequestDto;
import com.bikerental.bike_service.dto.request.InsuranceRequestDto;
import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class FleetListingDto {
    private Integer bikeId;
    private Integer partnerId;
    private String registrationNumber;
    private String rcUploadUrl;
    private String pucUploadUrl;
    private String manufacturer;
    private String model;
    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private BikeStatus bikeStatus;
    private ApprovalStatus approvalStatus;
    private String rejectionReason;
    private LocalDate registrationExpiry;
    private LocalDate pucExpiry;
    private LocalDateTime createdAt;

    // Using the independent DTOs for structured responses
    private BikeDetailsRequestDto bikeDetails;
    private InsuranceRequestDto insurance;
    private List<BikeImageRequestDto> images;
    private Map<String, Object> additionalServices;
}
