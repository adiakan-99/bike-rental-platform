package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.BikeCreateRequestDTO;
import com.bikerental.bike_service.dto.response.BikeResponseDTO;

public interface BikeService {

    BikeResponseDTO createBike(BikeCreateRequestDTO request);

}