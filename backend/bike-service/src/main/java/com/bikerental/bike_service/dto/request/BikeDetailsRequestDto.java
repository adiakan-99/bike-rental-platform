package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class BikeDetailsRequestDto {
    @NotBlank(message = "Bike category is required")
    private String bikeCategory; // SCOOTER, COMMUTER, etc.

    @NotBlank(message = "Bike type is required")
    private String bikeType;

    @Min(value = 0, message = "Engine CC must be positive")
    private Integer engineCc;

    @NotBlank(message = "Transmission is required")
    private String transmission; // MANUAL, AUTOMATIC

    @NotNull(message = "Seating capacity is required")
    @Min(value = 1, message = "Seating capacity must be at least 1")
    private Integer seatingCapacity;

    @NotNull(message = "Year of manufacture is required")
    private Integer yearOfManufacture;

    private String color;
    private Map<String, Object> additionalSpecs;
}
