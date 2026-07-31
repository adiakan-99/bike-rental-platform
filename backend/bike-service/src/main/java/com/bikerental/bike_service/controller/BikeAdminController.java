package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.request.BikeAdminReviewRequestDto;
import com.bikerental.bike_service.dto.response.BikeAdminActionResponseDto;
import com.bikerental.bike_service.dto.response.FleetListingDto;
import com.bikerental.bike_service.dto.response.PendingBikeDto;
import com.bikerental.bike_service.service.BikeServices;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bikes/admin")
public class BikeAdminController {
    private final BikeServices bikeServices;

    public BikeAdminController(BikeServices bikeServices) {
        this.bikeServices = bikeServices;
    }

    private Integer getAuthenticatedUserId() {
        return (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<PendingBikeDto>> getPendingBikeList(@ParameterObject @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<PendingBikeDto> pendingBikes = bikeServices.getPendingBikeList(pageable);
        return ResponseEntity.ok(pendingBikes);
    }

    @PutMapping("/review/{id}")
    public ResponseEntity<BikeAdminActionResponseDto> reviewBikeList(@PathVariable("id") Integer id,
                                                                     @Valid @RequestBody BikeAdminReviewRequestDto requestDto) {
        Integer userId = getAuthenticatedUserId();

        return ResponseEntity.ok(bikeServices.reviewBikeListing(userId, id, requestDto));
    }
}
