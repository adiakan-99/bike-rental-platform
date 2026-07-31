package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BikeImageRequestDto {
    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    @NotNull(message = "Primary flag is required")
    private Boolean isPrimary;
}
