package com.bikerental.bike_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BikeAvailabilityResponseDto {
    private Integer bikeId;
    private Boolean available;
}
