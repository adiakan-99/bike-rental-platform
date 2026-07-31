package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.request.BikeListingRequestDto;
import com.bikerental.bike_service.dto.request.BikeOperationalUpdateDto;
import com.bikerental.bike_service.dto.request.BikeStatusUpdateDto;
import com.bikerental.bike_service.dto.response.FleetListingDto;
import com.bikerental.bike_service.service.BikeServices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/{id}")
    public ResponseEntity<FleetListingDto> updateBikeListing(@PathVariable Integer id, @Valid @RequestBody BikeListingRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.ok(bikeServices.updateBikeListing(userId, id, requestDto));
    }

    @PatchMapping("/{id}/operational")
    public ResponseEntity<FleetListingDto> updateOperationalDetails(@PathVariable Integer id, @Valid @RequestBody BikeOperationalUpdateDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.ok(bikeServices.updateOperationalDetails(userId, id, requestDto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FleetListingDto> updateBikeStatus(@PathVariable Integer id, @Valid @RequestBody BikeStatusUpdateDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.ok(bikeServices.updateBikeStatus(userId, id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBikeListing(@PathVariable Integer id) {
        Integer userId = getAuthenticatedUserId();

        bikeServices.deleteBikeListing(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mine")
    public ResponseEntity<List<FleetListingDto>> getPartnerFleetListings() {
        Integer userId = getAuthenticatedUserId();

        List<FleetListingDto> listings = bikeServices.getPartnerFleetListing(userId);

        return ResponseEntity.ok(listings);
    }
}