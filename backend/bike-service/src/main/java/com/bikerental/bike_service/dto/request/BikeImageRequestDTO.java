package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BikeImageRequestDTO {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Primary image flag is required")
    private Boolean primaryImage;
}