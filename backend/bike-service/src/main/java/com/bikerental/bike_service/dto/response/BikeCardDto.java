package com.bikerental.bike_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BikeCardDto {
    private Integer id;
    private String model;
    private String manufacturer;
    private String category;
    private Integer engineCc;
    private String fuelType;
    private String transmission;
    private BigDecimal hourlyRate;
    private BigDecimal deposit;
    private String primaryImageUrl;
    private Integer dealerId;
    private String badge;
    private Boolean instant;
}
