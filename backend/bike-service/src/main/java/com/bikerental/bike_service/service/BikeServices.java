package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.BikeAdminReviewRequestDto;
import com.bikerental.bike_service.dto.request.BikeListingRequestDto;
import com.bikerental.bike_service.dto.request.BikeOperationalUpdateDto;
import com.bikerental.bike_service.dto.request.BikeStatusUpdateDto;
import com.bikerental.bike_service.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

public interface BikeServices {
    FleetListingDto createBikeListing(Integer userId, BikeListingRequestDto requestDto);

    FleetListingDto updateBikeListing(Integer userId, Integer bikeId, BikeListingRequestDto requestDto);

    FleetListingDto updateOperationalDetails(Integer userId, Integer bikeId, BikeOperationalUpdateDto requestDto);

    FleetListingDto updateBikeStatus(Integer userId, Integer bikeId, BikeStatusUpdateDto requestDto);

    void deleteBikeListing(Integer userId, Integer bikeId);

    List<FleetListingDto> getPartnerFleetListing(Integer userId);

    Page<PendingBikeDto> getPendingBikeList(Pageable pageable);

    BikeAdminActionResponseDto reviewBikeListing(Integer userId, Integer bikeId, BikeAdminReviewRequestDto requestDto);

    Page<BikeCardDto> browseBike(String city, String manufacturer, String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    BikeDetailDto getBikeDetailById(Integer bikeId);

    BikeAvailabilityResponseDto getBikeAvailabilityById(Integer bikeId, LocalDateTime startDate, LocalDateTime endDate);

    List<BikeDetailDto> compareBikes(List<Integer> ids);

    InternalBikeDetailsDto getInternalBikeDetailById(Integer bikeId);
}
