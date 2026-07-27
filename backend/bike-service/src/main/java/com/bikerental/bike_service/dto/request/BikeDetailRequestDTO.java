package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BikeDetailRequestDTO {

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotNull(message = "Engine CC is required")
    @Positive(message = "Engine CC must be positive")
    private Integer engineCC;

    @NotBlank(message = "Transmission is required")
    private String transmission;

    @NotNull(message = "Manufacturing year is required")
    @Min(value = 1990, message = "Invalid manufacturing year")
    @Max(value = 2100, message = "Invalid manufacturing year")
    private Integer manufacturingYear;

    @NotNull(message = "Seating capacity is required")
    @Positive(message = "Seating capacity must be positive")
    private Integer seatingCapacity;

    private String color;
}