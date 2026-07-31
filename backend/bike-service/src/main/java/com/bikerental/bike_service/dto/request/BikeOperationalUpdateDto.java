package com.bikerental.bike_service.dto.request;

import com.bikerental.bike_service.enums.BikeStatus;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class BikeOperationalUpdateDto {

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate should be greater than 0")
    private BigDecimal hourlyRate;

    private BigDecimal securityDeposit;

    private BikeStatus bikeStatus;

    private Map<String, Object> additionalServices;
}
