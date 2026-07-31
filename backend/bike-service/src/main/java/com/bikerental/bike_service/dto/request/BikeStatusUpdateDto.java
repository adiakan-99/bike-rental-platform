package com.bikerental.bike_service.dto.request;

import com.bikerental.bike_service.enums.BikeStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BikeStatusUpdateDto {
    @NotNull(message = "Bike status is required")
    private BikeStatus bikeStatus;
}
