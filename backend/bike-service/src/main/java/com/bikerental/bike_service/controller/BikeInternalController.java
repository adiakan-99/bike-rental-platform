package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.response.InternalBikeDetailsDto;
import com.bikerental.bike_service.service.BikeServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bikes/internal")
public class BikeInternalController {
    private final BikeServices bikeServices;

    public BikeInternalController(BikeServices bikeServices) {
        this.bikeServices = bikeServices;
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternalBikeDetailsDto> getInternalBikeDetails(@PathVariable Integer id) {
        InternalBikeDetailsDto detailsDto = bikeServices.getInternalBikeDetailById(id);
        return ResponseEntity.ok(detailsDto);
    }
}
