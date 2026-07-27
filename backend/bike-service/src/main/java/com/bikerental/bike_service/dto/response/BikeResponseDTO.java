package com.bikerental.bike_service.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BikeResponseDTO {
    private Integer bikeId;

    private String modelName;

    private String manufacturer;

    private String registrationNumber;

    private BigDecimal pricePerDay;

    private String bikeStatus;

    private String approvalStatus;

}
