package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.response.BikeAvailabilityResponseDto;
import com.bikerental.bike_service.dto.response.BikeCardDto;
import com.bikerental.bike_service.dto.response.BikeDetailDto;
import com.bikerental.bike_service.service.BikeServices;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bikes/public")
public class BikePublicController {
    private final BikeServices bikeServices;

    public BikePublicController(BikeServices bikeServices) {
        this.bikeServices = bikeServices;
    }

    @GetMapping("/search/browse")
    public ResponseEntity<Page<BikeCardDto>> browseBikes(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @ParameterObject @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<BikeCardDto> result = bikeServices.browseBike(city, startDate, endDate, manufacturer, category, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BikeDetailDto> getBikeDetailById(@PathVariable Integer id) {
        BikeDetailDto result = bikeServices.getBikeDetailById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<BikeAvailabilityResponseDto> checkBikeAvailability(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        BikeAvailabilityResponseDto responseDto = bikeServices.getBikeAvailabilityById(id, startDate, endDate);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/compare")
    public ResponseEntity<List<BikeDetailDto>> compareBikes(@RequestParam List<Integer> ids) {
        List<BikeDetailDto> result = bikeServices.compareBikes(ids);
        return ResponseEntity.ok(result);
    }
}
