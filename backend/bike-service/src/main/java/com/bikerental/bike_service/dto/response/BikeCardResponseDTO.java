package com.bikerental.bike_service.dto.response;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class BikeCardResponseDTO {
    private Integer bikeId;
    private String bikeName;
    private String manufacturer;
    private String category;
    private Integer engineCC;
    private String fuelType;
    private String transmission;
    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private String primaryImage;
}
