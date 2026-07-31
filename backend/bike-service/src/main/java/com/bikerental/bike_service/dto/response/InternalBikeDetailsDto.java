package com.bikerental.bike_service.dto.response;

import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InternalBikeDetailsDto {
    private Integer bikeId;
    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private Integer partnerId;
    private BikeStatus bikeStatus;
    private ApprovalStatus approvalStatus;
    private Boolean isBookable;
}
