package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.request.BikeCreateRequestDTO;
import com.bikerental.bike_service.dto.response.BikeResponseDTO;
import com.bikerental.bike_service.service.BikeService;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    //dependancy Injection using Constuctor
    private final BikeService bikeService;

    public BikeController(BikeService bikeService) {
        this.bikeService = bikeService;
    }

    @PostMapping
    public ResponseEntity<BikeResponseDTO> createBike(
            @Valid @RequestBody BikeCreateRequestDTO request) {

        System.out.println(request);
        BikeResponseDTO response =
                bikeService.createBike(request);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }
}