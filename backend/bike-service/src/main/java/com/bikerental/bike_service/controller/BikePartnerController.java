package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.request.BikeListingRequestDto;
import com.bikerental.bike_service.dto.response.FleetListingDto;
import com.bikerental.bike_service.service.BikeServices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bikes/partner")
public class BikePartnerController {
    public final BikeServices bikeServices;

    public BikePartnerController(BikeServices bikeServices) {
        this.bikeServices = bikeServices;
    }

    private Integer getAuthenticatedUserId() {
        return (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<FleetListingDto> createBikeListing(@Valid @RequestBody BikeListingRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.status(HttpStatus.CREATED).body(bikeServices.createBikeListing(userId, requestDto));
    }
}
