package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.BikeListingRequestDto;
import com.bikerental.bike_service.dto.response.FleetListingDto;

import java.nio.file.AccessDeniedException;

public interface BikeServices {
    FleetListingDto createBikeListing(Integer userId, BikeListingRequestDto requestDto);
}
