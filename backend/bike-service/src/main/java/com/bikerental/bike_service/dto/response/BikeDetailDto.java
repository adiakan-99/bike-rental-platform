package com.bikerental.bike_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BikeDetailDto {
    private Integer bikeId;
    private String name;
    private String manufacturer;
    private String model;
    private String bikeCategory;
    private String bikeType;
    private Integer engineCc;
    private String transmission;
    private Integer seatingCapacity;
    private Integer yearOfManufacture;
    private String color;

    private BigDecimal hourlyRate;
    private BigDecimal securityDeposit;
    private Integer partnerId;

    private List<BikeImageResponseDto> imageUrls;
    private Map<String, Object> additionalSpecs;
    private Map<String, Object> additionalServices;

    // Included items & rental policies for the frontend detail view
    private List<String> includedItems;
    private List<String> rentalTerms;
}
